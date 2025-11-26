
import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';

let app: App;
let db: ReturnType<typeof getFirestore>;

// Guard against running in a non-server environment
if (typeof process.env.FIREBASE_ADMIN_SDK_JSON === 'string') {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON);
    if (!getApps().length) {
      app = initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);
  } catch (e) {
    console.error("CRITICAL: Failed to initialize Firebase Admin SDK.", e);
  }
} else {
    console.error("CRITICAL: FIREBASE_ADMIN_SDK_JSON environment variable not set.");
}


async function processEvent(event: any) {
  if (!db) {
    console.error("Firestore Admin is not initialized. Cannot process event.");
    return;
  }

  const { sessionId, name, source, device, createdAt, payload } = event;

  // 1. Save the raw event for detailed analysis later
  await db.collection('events').add(event);

  const liveRef = db.collection('analytics_aggregates').doc('live');

  try {
    const sessionRef = db.collection('sessions').doc(sessionId);

    // Use a transaction to ensure atomic updates
    await db.runTransaction(async (transaction) => {
      const liveDoc = await transaction.get(liveRef);
      const sessionDoc = await transaction.get(sessionRef);

      // Initialize live data if it doesn't exist
      if (!liveDoc.exists) {
        transaction.set(liveRef, {
            funnel: { ageGateViews: 0, vslViews: 0, ctaClicks: 0, purchases: 0 },
            activeSessions: {},
            recentLeads: [],
            lastUpdatedAt: FieldValue.serverTimestamp()
        });
      }
      const liveData = liveDoc.data() || { funnel: {}, activeSessions: {}, recentLeads: [] };

      // Initialize session data if it's the first time we see this session
      if (!sessionDoc.exists) {
          transaction.set(sessionRef, {
              firstSeenAt: createdAt,
              lastSeenAt: createdAt,
              source: source || {},
              device: device || {},
              lastFunnelStage: name
          });
      } else {
          transaction.update(sessionRef, {
              lastSeenAt: createdAt,
              lastFunnelStage: name
          });
      }


      // --- Update Aggregates ---
      const updatePayload: { [key: string]: any } = {
          'lastUpdatedAt': FieldValue.serverTimestamp()
      };
      
      // Update active sessions for heartbeat events
      if (name === 'session_heartbeat' || name === 'age_gate_view') {
          updatePayload[`activeSessions.${sessionId}`] = createdAt;
      }
      
      let newLead = null;

      switch (name) {
        case 'age_gate_view':
          updatePayload['funnel.ageGateViews'] = FieldValue.increment(1);
          break;
        case 'vsl_view':
          updatePayload['funnel.vslViews'] = FieldValue.increment(1);
          newLead = { id: `lead_${sessionId.substring(0, 6)}_${Date.now()}`, sessionId, createdAt };
          break;
        case 'main_cta_click':
        case 'final_cta_click':
        case 'vsl_page_cta':
          updatePayload['funnel.ctaClicks'] = FieldValue.increment(1);
          break;
        case 'purchase':
          updatePayload['funnel.purchases'] = FieldValue.increment(1);
          break;
      }
      
      // Handle recent leads array
      if (newLead) {
          const recentLeads = liveData.recentLeads || [];
          const updatedLeads = [newLead, ...recentLeads].slice(0, 5);
          updatePayload['recentLeads'] = updatedLeads;
      }
      
      // --- Cleanup old active sessions (run this less frequently in a real app) ---
      const tenMinutesAgo = new Date(new Date().getTime() - 10 * 60 * 1000).toISOString();
      const cleanedSessions: {[key: string]: any} = {};
      if (liveData.activeSessions) {
          for (const [sid, timestamp] of Object.entries(liveData.activeSessions)) {
              if (timestamp > tenMinutesAgo) {
                  cleanedSessions[sid] = timestamp;
              }
          }
          updatePayload['activeSessions'] = cleanedSessions;
      }

      transaction.update(liveRef, updatePayload);
    });

  } catch (error) {
    console.error("Error processing event in transaction:", error);
  }
}

export async function POST(req: NextRequest) {
  if (!db) {
    return NextResponse.json({ status: 'error', message: 'Backend not initialized' }, { status: 500 });
  }

  try {
    const bodyAsText = await req.text();
    if (!bodyAsText) {
        return NextResponse.json({ status: 'error', message: 'Empty request body' }, { status: 400 });
    }
    const event = JSON.parse(bodyAsText);

    if (!event.name || !event.sessionId) {
      return NextResponse.json({ status: 'error', message: 'Missing required event data' }, { status: 400 });
    }
    
    // Use `waitUntil` if available (on Vercel Edge), or just await otherwise.
    // This allows the response to be sent faster.
    if ((global as any).waitUntil) {
      (global as any).waitUntil(processEvent(event));
    } else {
      await processEvent(event);
    }
    
    return NextResponse.json({ status: 'ok' }, { status: 202 });
  } catch (error) {
    console.error('Error in API route handler:', error);
    // Check if it's a JSON parsing error
    if (error instanceof SyntaxError) {
        return NextResponse.json({ status: 'error', message: `Invalid JSON: ${error.message}` }, { status: 400 });
    }
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}
