
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
      console.log('New lead tracked:', userId);
    } else {
      console.log('Returning lead:', userId);
    }
  } catch (error) {
    console.error("Error in trackFirstVisit:", error);
    throw error;
  }
};

// This function is called when a conversion button is clicked.
export const trackConversionClick = async () => {
  try {
    const userId = await getUserId();
    const leadDocRef = doc(firestore, 'leads', userId);

    await updateDoc(leadDocRef, {
      hasClickedFinalLink: true
    });
    console.log('Conversion click tracked for user:', userId);
  } catch (error) {
    console.error("Error in trackConversionClick:", error);
    // If the user document doesn't exist, create it and mark as clicked
    if ((error as any).code === 'not-found') {
        const userId = await getUserId();
        const leadDocRef = doc(firestore, 'leads', userId);
        await setDoc(leadDocRef, {
            id: userId,
            createdAt: serverTimestamp(),
            hasClickedFinalLink: true
        });
        console.log('New lead tracked from conversion click:', userId);
    } else {
       throw error;
    }
  }
};
