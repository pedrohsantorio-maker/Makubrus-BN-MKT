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
let firestore;

if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
  firestore = getFirestore(app);
}

export const logEvent = (eventName: string, params?: { [key: string]: any }) => {
  console.log(`[Analytics Event]: ${eventName}`, params);
  if (analytics) {
    firebaseLogEvent(analytics, eventName, params);
  }

  if (firestore) {
    const eventsCollection = collection(firestore, 'events');
    addDoc(eventsCollection, {
      name: eventName,
      params: params || {},
      createdAt: serverTimestamp(),
      // You could add more context here, like user ID, session ID, etc.
    }).catch(error => {
      console.error("Error writing event to Firestore: ", error);
    });
  }
};
