
'use client';

import { initializeApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { getAnalytics, logEvent as firebaseLogEvent } from 'firebase/analytics';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const hasAllFirebaseConfigValues =
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId;

let app;
if (hasAllFirebaseConfigValues) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
}

let analytics;
export let firestore: any; // Allow export

if (typeof window !== 'undefined' && app) {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.warn("Failed to initialize Analytics", e);
  }
  try {
    firestore = getFirestore(app);
  } catch (e) {
    console.warn("Failed to initialize Firestore", e);
  }
}

// --- Event Tracking Logic ---

// 1. Session Management
let sessionId: string | null = null;
const getSessionId = () => {
  if (typeof window === 'undefined') return null;
  if (!sessionId) {
    sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('sessionId', sessionId);
    }
  }
  return sessionId;
};


// 2. Source Tracking
const getSourceInfo = () => {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const sourceData: { [key: string]: string } = {};
  
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  utmKeys.forEach(key => {
    if (params.has(key)) {
      sourceData[key] = params.get(key)!;
    }
  });

  if (params.has('gclid')) sourceData['gclid'] = params.get('gclid')!;
  if (params.has('fbclid')) sourceData['fbclid'] = params.get('fbclid')!;
  if (document.referrer) sourceData['referrer'] = document.referrer;
  
  return sourceData;
};

// 3. Device Tracking
const getDeviceInfo = () => {
    if (typeof window === 'undefined') return {};
    const isMobile = window.innerWidth < 768;
    return {
        device: isMobile ? 'mobile' : 'desktop',
        userAgent: navigator.userAgent,
        screenSize: `${window.screen.width}x${window.screen.height}`
    };
}


// 4. Central Event Logging Function
export const logEvent = (eventName: string, payload: { [key: string]: any } = {}) => {
  const currentSessionId = getSessionId();
  if (!currentSessionId) return;

  const eventData = {
    sessionId: currentSessionId,
    name: eventName,
    payload: {
      path: window.location.pathname,
      ...payload,
    },
    source: getSourceInfo(),
    device: getDeviceInfo(),
    createdAt: serverTimestamp(),
  };

  if (process.env.NODE_ENV === 'development') {
    console.log(`[EVENT]: ${eventName}`, eventData);
  }

  if (!hasAllFirebaseConfigValues) {
    if (process.env.NODE_ENV === 'development') {
      console.warn("Firebase not configured, skipping event logging.");
    }
    return;
  }

  // Send to our own API endpoint instead of directly to Firestore
  fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
    keepalive: true, // Ensures request is sent even if page is closing
  }).catch(error => {
    console.error("Error sending event to API: ", error);
  });

  // Also log to Google Analytics if available
  if (analytics) {
    firebaseLogEvent(analytics, eventName, payload);
  }
};

// 5. Heartbeat for active session tracking
let heartbeatInterval: NodeJS.Timeout | null = null;

export const startHeartbeat = () => {
    if (heartbeatInterval) return; // Prevent multiple intervals
    logEvent('session_heartbeat'); // Log one immediately
    heartbeatInterval = setInterval(() => {
        logEvent('session_heartbeat');
    }, 15000); // every 15 seconds
};

export const stopHeartbeat = () => {
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }
};

// Start heartbeat automatically when the lib is loaded and app is active
if (typeof window !== 'undefined') {
    startHeartbeat();
    window.addEventListener('focus', startHeartbeat);
    window.addEventListener('blur', stopHeartbeat);
}
