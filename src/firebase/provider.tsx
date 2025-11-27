'use client';

import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect, DependencyList } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener'

// This interface is the source of truth for what is available in the context
export interface FirebaseContextValue {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: User | null;
  loading: boolean;
}

// The React Context is created with an initial value of undefined.
export const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  user: User | null;
  loading: boolean;
}

export const FirebaseProvider = ({ children, firebaseApp, auth, firestore, user, loading }: FirebaseProviderProps) => {
  // The value provided to the context consumers. It's memoized to prevent unnecessary re-renders.
  const value = useMemo(() => ({
    firebaseApp,
    auth,
    firestore,
    user,
    loading
  }), [firebaseApp, auth, firestore, user, loading]);

  return (
    <FirebaseContext.Provider value={value}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

// Custom hook to access the Firebase context.
export const useFirebase = (): FirebaseContextValue => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};

// Convenience hooks to access specific parts of the context.
export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  if (!auth) throw new Error("Firebase Auth not available.");
  return auth;
};

export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  if (!firestore) throw new Error("Firebase Firestore not available.");
  return firestore;
};

export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  if (!firebaseApp) throw new Error("Firebase App not available.");
  return firebaseApp;
};

export const useUser = () => {
  const { user, loading } = useFirebase();
  return { user, loading };
}

// Helper for memoizing Firebase queries/references to prevent re-renders.
type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}
