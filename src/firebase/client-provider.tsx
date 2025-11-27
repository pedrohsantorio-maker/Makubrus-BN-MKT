
'use client';

import { useEffect, useState } from 'react';
import { initializeFirebase } from '@/lib/firebase';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { FirebaseProvider } from '@/firebase/firebase-provider';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

// This is a placeholder that will be replaced by the actual config.
// The important part is that this code is in a 'use client' file.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};


export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [firestore, setFirestore] = useState<Firestore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const firebaseApp = initializeFirebase(firebaseConfig);
      const authInstance = getAuth(firebaseApp);
      const firestoreInstance = getFirestore(firebaseApp);
      
      setApp(firebaseApp);
      setAuth(authInstance);
      setFirestore(firestoreInstance);
    } catch (error) {
      console.error("Firebase initialization error:", error);
    } finally {
        setLoading(false);
    }
  }, []);

  if (loading) {
    // You can return a loading spinner here if needed
    return null; 
  }

  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore}>
        {children}
    </FirebaseProvider>
  );
}
