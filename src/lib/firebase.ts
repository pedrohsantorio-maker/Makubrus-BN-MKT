
'use client';

import { initializeApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getFirestore, Timestamp } from 'firebase/firestore';
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
export let firestore: any; 

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
  if (!currentSessionId) {
      if (process.env.NODE_ENV === 'development') {
        console.warn("No session ID, skipping event log.");
      }
      return;
  }

  const eventData = {
    sessionId: currentSessionId,
    name: eventName,
    payload: {
      path: window.location.pathname,
      ...payload,
    },
    source: getSourceInfo(),
    device: getDeviceInfo(),
    createdAt: new Date().toISOString(), // Use ISO string for API
  };

  if (process.env.NODE_ENV === 'development') {
    console.log(`[EVENT SENT]: ${eventName}`, eventData);
  }
  
  // Use navigator.sendBeacon for robustness, especially on page unload.
  const blob = new Blob([JSON.stringify(eventData)], { type: 'application/json' });
  navigator.sendBeacon('/api/events', blob);

  // Also log to Google Analytics if available
  if (analytics) {
    firebaseLogEvent(analytics, eventName, payload);
  }
};

// 5. Heartbeat for active session tracking
let heartbeatInterval: NodeJS.Timeout | null = null;

export const startHeartbeat = () => {
    if (heartbeatInterval || typeof window === 'undefined') return; // Prevent multiple intervals
    
    const sendHeartbeat = () => {
      if (document.hasFocus()) { // Only send heartbeat if tab is active
        logEvent('session_heartbeat');
      }
    };
    
    sendHeartbeat(); // Log one immediately
    heartbeatInterval = setInterval(sendHeartbeat, 15000); // every 15 seconds
};

export const stopHeartbeat = () => {
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }
};

// Start heartbeat automatically when the lib is loaded and app is active
if (typeof window !== 'undefined') {
    if (document.hasFocus()) {
        startHeartbeat();
    }
    window.addEventListener('focus', startHeartbeat);
    window.addEventListener('blur', stopHeartbeat);

    // Also log event on unload
    window.addEventListener('beforeunload', () => {
        logEvent('page_unload');
    });
}
