
"use client";

import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { initializeFirebase } from '@/lib/firebase';
import { getAuth, onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

// Define the shape of the context
interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  user: User | null;
  loading: boolean;
}

// Create the context
const FirebaseContext = createContext<FirebaseContextType | null>(null);

// This is a placeholder for the actual config that will be injected.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [firestore, setFirestore] = useState<Firestore | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Firebase
    const firebaseApp = initializeFirebase(firebaseConfig);
    const authInstance = getAuth(firebaseApp);
    const firestoreInstance = getFirestore(firebaseApp);
    
    setApp(firebaseApp);
    setAuth(authInstance);
    setFirestore(firestoreInstance);

    // Handle authentication state
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        // Sign in anonymously if no user
        signInAnonymously(authInstance).catch((error) => {
          console.error("Anonymous sign-in failed:", error);
          setLoading(false);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <FirebaseContext.Provider value={{ app, auth, firestore, user, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Custom hook to use the Firebase context
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === null) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};
