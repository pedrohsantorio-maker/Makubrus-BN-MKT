"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { logEvent } from '@/lib/firebase';

const loadingTexts = [
  "Validando seu acesso reservado...",
  "Carregando conteúdos ocultos...",
  "Liberando área secreta...",
  "Preparando experiência...",
];

export function LoadingClient() {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setIndex((prevIndex) => {
        if (prevIndex >= loadingTexts.length - 1) {
          clearInterval(textInterval);
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, 625); // 2.5s / 4 texts

    const redirectTimeout = setTimeout(() => {
      logEvent("loading_sequence_complete");
      router.push('/vendas');
    }, 2500);

    return () => {
      clearInterval(textInterval);
      clearTimeout(redirectTimeout);
    };
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-8 text-center text-white space-y-8">
      <motion.div
        className="w-16 h-16 border-4 border-muted border-t-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <div className="h-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {loadingTexts[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </main>
  );
}
