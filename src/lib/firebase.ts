
'use client';

import { initializeApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getAnalytics, logEvent as firebaseLogEvent } from 'firebase/analytics';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

let analytics;
export let firestore: any; // Allow export

if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.error("Failed to initialize Analytics", e);
  }
  try {
    firestore = getFirestore(app);
  } catch(e) {
    console.error("Failed to initialize Firestore", e);
  }
}

// Simple session ID generator
const getSessionId = () => {
    if (typeof window !== 'undefined') {
        let sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            sessionStorage.setItem('sessionId', sessionId);
        }
        return sessionId;
    }
    return null;
}


export const logEvent = (eventName: string, params?: { [key: string]: any }) => {
  const sessionId = getSessionId();
  console.log(`[Analytics Event]: ${eventName}`, { ...params, sessionId });
  if (analytics) {
    firebaseLogEvent(analytics, eventName, params);
  }

  if (firestore) {
    const eventsCollection = collection(firestore, 'events');
    addDoc(eventsCollection, {
      name: eventName,
      params: params || {},
      createdAt: serverTimestamp(),
      sessionId: sessionId,
    }).catch(error => {
      console.error("Error writing event to Firestore: ", error);
    });
  }
};
