
import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
let app: App;
if (!getApps().length) {
  // This requires the FIREBASE_ADMIN_SDK_JSON environment variable to be set.
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON as string);
    app = initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (e) {
    console.error("Failed to initialize Firebase Admin SDK. Make sure FIREBASE_ADMIN_SDK_JSON is set.", e);
  }
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

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

  // Use a transaction to safely update aggregates
  await db.runTransaction(async (transaction) => {
    const liveDoc = await transaction.get(liveRef);
    const now = new Date();

    let funnelData = { ageGateViews: 0, vslViews: 0, ctaClicks: 0, purchases: 0 };
    let activeSessionsData: { [key: string]: any } = {};
    let recentLeadsData: any[] = [];

    if (liveDoc.exists) {
      const existingData = liveDoc.data();
      funnelData = existingData?.funnel || funnelData;
      activeSessionsData = existingData?.activeSessions || activeSessionsData;
      recentLeadsData = existingData?.recentLeads || recentLeadsData;
    }
    
    // --- Update session info ---
    if (sessionId) {
        const sessionRef = db.collection('sessions').doc(sessionId);
        transaction.set(sessionRef, { 
            lastSeenAt: createdAt,
            source: source,
            device: device,
            lastFunnelStage: FieldValue.arrayUnion(name)
        }, { merge: true });
        
        // Update active sessions (heartbeat mechanism)
        if (name === 'session_heartbeat' || name === 'page_view' || name === 'age_gate_view') {
            activeSessionsData[sessionId] = createdAt;
        }
    }

    // --- Update funnel counters ---
    switch (name) {
      case 'age_gate_view':
        funnelData.ageGateViews += 1;
        break;
      case 'vsl_view':
        funnelData.vslViews += 1;
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
      case 'begin_checkout':
        funnelData.ctaClicks += 1;
        break;
      case 'purchase':
        funnelData.purchases += 1;
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
        lastUpdatedAt: FieldValue.serverTimestamp()
    };

    if (liveDoc.exists) {
        transaction.update(liveRef, updatePayload);
    } else {
        transaction.set(liveRef, updatePayload);
    }
  });
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
