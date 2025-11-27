
'use client';

import { auth, firestore } from './firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

// Function to get the current user's UID, signing in anonymously if needed
const getUserId = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve(user.uid);
      } else {
        signInAnonymously(auth)
          .then((userCredential) => {
            resolve(userCredential.user.uid);
          })
          .catch(reject);
      }
    });
  });
};

// This function is called on the first page load.
// It ensures a user is created in Firestore only once.
export const trackFirstVisit = async () => {
  try {
    const userId = await getUserId();
    const leadDocRef = doc(firestore, 'leads', userId);
    const docSnap = await getDoc(leadDocRef);

    // Create document only if it doesn't exist
    if (!docSnap.exists()) {
      await setDoc(leadDocRef, {
        id: userId,
        createdAt: serverTimestamp(),
        hasClickedFinalLink: false
      });
    }
  } catch (error) {
    console.error("Error in trackFirstVisit:", error);
    // Don't re-throw, to avoid crashing the app if tracking fails
  }
};

// This function is called when a conversion button is clicked.
export const trackConversionClick = async () => {
  try {
    const userId = await getUserId();
    const leadDocRef = doc(firestore, 'leads', userId);

    // Use setDoc with merge to create or update
    await setDoc(leadDocRef, { hasClickedFinalLink: true }, { merge: true });

  } catch (error) {
    console.error("Error in trackConversionClick:", error);
    // Don't re-throw
  }
};
