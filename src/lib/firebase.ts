'use client';

import { initializeApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getAnalytics, logEvent as firebaseLogEvent } from 'firebase/analytics';

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
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}


export const logEvent = (eventName: string, params?: { [key: string]: any }) => {
  console.log(`[Firebase Analytics] Event: ${eventName}`, params);
  if (analytics) {
    firebaseLogEvent(analytics, eventName, params);
  }
};
