
'use client';

import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// This function now handles the initialization, ensuring it only happens once.
export const initializeFirebase = (config: FirebaseOptions) => {
  return getApps().length > 0 ? getApp() : initializeApp(config);
};

// We get the instances from the initialized app.
// Note: These will throw an error if accessed before initialization.
// The FirebaseProvider ensures this doesn't happen.
const app = getApps().length > 0 ? getApp() : undefined;
const auth = app ? getAuth(app) : undefined;
const firestore = app ? getFirestore(app) : undefined;

export { auth, firestore };
