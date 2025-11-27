
'use client';

import { doc, getDoc, setDoc, serverTimestamp, updateDoc, type Firestore } from 'firebase/firestore';

// This function is now more generic and receives the firestore instance.
const getUserId = (auth: any): Promise<string> => {
  return new Promise((resolve, reject) => {
      if (auth.currentUser) {
          return resolve(auth.currentUser.uid);
      }
      const unsubscribe = auth.onAuthStateChanged((user: any) => {
          unsubscribe();
          if (user) {
              resolve(user.uid);
          } else {
              reject(new Error("User is not authenticated."));
          }
      });
  });
};


export const trackFirstVisit = async (firestore: Firestore, userId: string) => {
  if (!userId) return;
  try {
    const leadDocRef = doc(firestore, 'leads', userId);
    const docSnap = await getDoc(leadDocRef);

    if (!docSnap.exists()) {
      await setDoc(leadDocRef, {
        id: userId,
        createdAt: serverTimestamp(),
        hasClickedFinalLink: false
      });
    }
  } catch (error) {
    console.error("Error in trackFirstVisit:", error);
  }
};

export const trackConversionClick = async (firestore: Firestore, userId: string) => {
    if (!userId) return;
    try {
        const leadDocRef = doc(firestore, 'leads', userId);
        await setDoc(leadDocRef, { hasClickedFinalLink: true }, { merge: true });
    } catch (error) {
        console.error("Error in trackConversionClick:", error);
    }
};
