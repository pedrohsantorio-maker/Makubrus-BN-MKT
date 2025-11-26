
import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
let app: App;
let db: ReturnType<typeof getFirestore>;

try {
    if (!getApps().length) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON as string);
        app = initializeApp({
            credential: cert(serviceAccount),
        });
    } else {
        app = getApps()[0];
    }
    db = getFirestore(app);
} catch (e) {
    console.error("CRITICAL: Failed to initialize Firebase Admin SDK. Make sure FIREBASE_ADMIN_SDK_JSON is set.", e);
}


// This function processes each incoming event
async function processEvent(event: any) {
  if (!db) {
    console.error("Firestore Admin is not initialized. Cannot process event.");
    return;
  }
  const { sessionId, name, source, device, createdAt } = event;
  
  // 1. Save the raw event
  await db.collection('events').add(event);

  const liveRef = db.collection('analytics_aggregates').doc('live');

  try {
    const liveDoc = await liveRef.get();
    const now = new Date();

    let funnelData = { ageGateViews: 0, vslViews: 0, ctaClicks: 0, purchases: 0 };
    let activeSessionsData: { [key: string]: any } = {};
    let recentLeadsData: any[] = [];
    
    if (liveDoc.exists) {
        const data = liveDoc.data();
        funnelData = data?.funnel || funnelData;
        activeSessionsData = data?.activeSessions || activeSessionsData;
        recentLeadsData = data?.recentLeads || recentLeadsData;
    }

    // --- Update session info ---
    if (sessionId) {
        const sessionRef = db.collection('sessions').doc(sessionId);
        // This is a separate write, not part of the main aggregate update
        await sessionRef.set({ 
            lastSeenAt: createdAt,
            source: source,
            device: device,
            funnelStages: FieldValue.arrayUnion(name)
        }, { merge: true });
        
        // Update active sessions (heartbeat mechanism)
        if (name === 'session_heartbeat' || name === 'age_gate_view') {
            activeSessionsData[sessionId] = createdAt;
        }
    }
    
    // --- Update funnel counters ---
    switch (name) {
      case 'age_gate_view':
        funnelData.ageGateViews = (funnelData.ageGateViews || 0) + 1;
        break;
      case 'vsl_view':
        funnelData.vslViews = (funnelData.vslViews || 0) + 1;
        // Add to recent leads (limited to 5)
        const newLead = { id: `lead_${sessionId.substring(0,6)}_${Date.now()}`, sessionId, createdAt };
        recentLeadsData.unshift(newLead);
        if (recentLeadsData.length > 5) {
            recentLeadsData.pop();
        }
        break;
      case 'main_cta_click':
      case 'final_cta_click':
      case 'vsl_page_cta':
        funnelData.ctaClicks = (funnelData.ctaClicks || 0) + 1;
        break;
      case 'begin_checkout':
        // This event might not directly increment a simple counter, but could be used elsewhere
        break;
      case 'purchase':
        funnelData.purchases = (funnelData.purchases || 0) + 1;
        break;
    }

    // --- Cleanup old active sessions ---
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000).toISOString();
    const cleanedSessions: {[key: string]: any} = {};
    for (const [sid, timestamp] of Object.entries(activeSessionsData)) {
        if (timestamp > tenMinutesAgo) {
            cleanedSessions[sid] = timestamp;
        }
    }

    // --- Commit updates ---
    const updatePayload = {
        funnel: funnelData,
        activeSessions: cleanedSessions,
        recentLeads: recentLeadsData,
        lastUpdatedAt: Timestamp.now()
    };
    
    await liveRef.set(updatePayload, { merge: true });

  } catch (error) {
    console.error("Error processing event in backend:", error);
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
    console.error('Error in API route handler:', error);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}

