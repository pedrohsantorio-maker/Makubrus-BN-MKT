
"use client";

import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

interface FirebaseProviderProps {
  children: ReactNode;
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  user: User | null;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const FirebaseProvider = ({ children, app, auth, firestore }: FirebaseProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error("Anonymous sign-in failed:", error);
          setLoading(false);
        });
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <FirebaseContext.Provider value={{ app, auth, firestore, user, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === null) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};
