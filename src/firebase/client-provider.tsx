'use client';

import React, { useMemo, useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  // useMemo ensures Firebase is only initialized once per component lifecycle.
  const { firebaseApp, auth, firestore } = useMemo(() => {
    return initializeFirebase();
  }, []);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // This effect handles the user's authentication state.
  useEffect(() => {
    if (!auth) {
      console.error("Firebase Auth instance is not available for auth state listener.");
      setLoading(false);
      return;
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        // If no user, sign in anonymously.
        signInAnonymously(auth).catch((error) => {
          console.error("Anonymous sign-in failed on client provider:", error);
          setLoading(false);
        });
      }
    }, (error) => {
      console.error("Auth state change error:", error);
      setLoading(false);
    });

    // Cleanup subscription on unmount.
    return () => unsubscribe();
  }, [auth]); // The effect depends on the auth instance.

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
      user={user}
      loading={loading}
    >
      {children}
    </FirebaseProvider>
  );
}
