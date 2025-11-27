
'use client';

import { doc, getDoc, serverTimestamp, type Firestore } from 'firebase/firestore';
import { setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export const trackFirstVisit = async (firestore: Firestore, userId: string) => {
  if (!userId) return;
  const leadDocRef = doc(firestore, 'leads', userId);

  try {
    const docSnap = await getDoc(leadDocRef);

    if (!docSnap.exists()) {
      // Use a escrita não-bloqueante que já inclui o tratamento de erro contextual
      setDocumentNonBlocking(leadDocRef, {
        id: userId,
        createdAt: serverTimestamp(),
        hasClickedFinalLink: false
      }, { merge: true });
    }
  } catch (error) {
    // Erros de leitura (getDoc) ainda podem acontecer, mas o erro de escrita (setDoc) é o mais provável para permissões.
    // O erro de escrita agora é tratado dentro de setDocumentNonBlocking.
    // Se getDoc falhar por permissão, precisaremos de um tratamento similar. Por enquanto, focamos na escrita.
    console.error("Error during getDoc in trackFirstVisit:", error);
  }
};

export const trackConversionClick = (firestore: Firestore, userId: string) => {
    if (!userId) return;
    const leadDocRef = doc(firestore, 'leads', userId);
    // Use a atualização não-bloqueante
    updateDocumentNonBlocking(leadDocRef, { hasClickedFinalLink: true });
};
