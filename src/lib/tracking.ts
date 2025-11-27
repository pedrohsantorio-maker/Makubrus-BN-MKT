
'use client';

import { doc, getDoc, setDoc, serverTimestamp, updateDoc, type Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';


export const trackFirstVisit = async (firestore: Firestore, userId: string) => {
  if (!userId) return;
  const leadDocRef = doc(firestore, 'leads', userId);
  
  try {
    const docSnap = await getDoc(leadDocRef);

    if (!docSnap.exists()) {
      // Use non-blocking write
      setDocumentNonBlocking(leadDocRef, {
        id: userId,
        createdAt: serverTimestamp(),
        hasClickedFinalLink: false
      }, {});
    }
  } catch (error) {
    // This might catch errors if getDoc fails, but write errors are handled non-blockingly
    console.error("Error checking for first visit:", error);
  }
};

export const trackConversionClick = (firestore: Firestore, userId: string) => {
    if (!userId) return;
    const leadDocRef = doc(firestore, 'leads', userId);
    // Use non-blocking update
    updateDocumentNonBlocking(leadDocRef, { hasClickedFinalLink: true });
};
