
import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
let app: App;
if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON as string);
  app = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

// This function processes each incoming event
async function processEvent(event: any) {
  const { sessionId, name, source, device, createdAt } = event;
  
  // 1. Save the raw event
  await db.collection('events').add(event);

  const liveRef = db.collection('analytics_aggregates').doc('live');

  // Use a transaction to safely update aggregates
  await db.runTransaction(async (transaction) => {
    const liveDoc = await transaction.get(liveRef);
    const now = new Date();

    // Initialize document if it doesn't exist
    if (!liveDoc.exists) {
        transaction.set(liveRef, {
            funnel: { ageGateViews: 0, vslViews: 0, ctaClicks: 0, purchases: 0 },
            activeSessions: {},
            recentLeads: [],
            lastUpdatedAt: FieldValue.serverTimestamp()
        });
        // We will re-run the transaction to get the newly created doc
        return;
    }

    const updates: { [key: string]: any } = {
        lastUpdatedAt: FieldValue.serverTimestamp()
    };
    
    // Update session info
    if (sessionId) {
        const sessionRef = db.collection('sessions').doc(sessionId);
        transaction.set(sessionRef, { 
            lastSeenAt: createdAt,
            source: source,
            device: device,
            lastFunnelStage: FieldValue.arrayUnion(name)
        }, { merge: true });
        
        // Update active sessions (heartbeat mechanism)
        if (name === 'session_heartbeat' || name === 'page_view') {
            updates[`activeSessions.${sessionId}`] = createdAt;
        }
    }

    // Update funnel counters
    switch (name) {
      case 'age_gate_view':
        updates['funnel.ageGateViews'] = FieldValue.increment(1);
        break;
      case 'vsl_view':
        updates['funnel.vslViews'] = FieldValue.increment(1);
        // Add to recent leads
        updates['recentLeads'] = FieldValue.arrayUnion({
            id: 'new_lead_' + Date.now(), // Create a pseudo-id
            sessionId: sessionId,
            createdAt: createdAt,
        });
        break;
      case 'main_cta_click':
      case 'final_cta_click':
      case 'vsl_page_cta':
      case 'begin_checkout':
        updates['funnel.ctaClicks'] = FieldValue.increment(1);
        break;
      case 'purchase':
        updates['funnel.purchases'] = FieldValue.increment(1);
        break;
    }

    transaction.update(liveRef, updates);
  });

  // Cleanup old active sessions periodically (optional but good practice)
  // This could be a separate scheduled function for better performance
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000).toISOString();
  const currentActiveSessions = (await liveRef.get()).data()?.activeSessions || {};
  const cleanedSessions: {[key: string]: any} = {};
  let needsCleaning = false;
  for (const [sid, timestamp] of Object.entries(currentActiveSessions)) {
      if (timestamp > tenMinutesAgo) {
          cleanedSessions[sid] = timestamp;
      } else {
          needsCleaning = true;
      }
  }
  if (needsCleaning) {
      await liveRef.update({ activeSessions: cleanedSessions });
  }

}

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();

    // Basic validation
    if (!event.name || !event.sessionId) {
      return NextResponse.json({ status: 'error', message: 'Missing required event data' }, { status: 400 });
    }
    
    // Don't wait for processing to finish to send response,
    // makes the client-side experience faster.
    processEvent(event).catch(console.error);

    return NextResponse.json({ status: 'ok' }, { status: 202 });
  } catch (error) {
    console.error('Error processing event:', error);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}
