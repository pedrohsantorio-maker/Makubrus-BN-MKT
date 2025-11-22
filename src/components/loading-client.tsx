"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { logEvent } from '@/lib/firebase';

const loadingTexts = [
  "Validando seu acesso reservado...",
  "Carregando conteúdos ocultos...",
  "Estabelecendo conexão segura...",
  "Liberando área secreta...",
];

export function LoadingClient() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    logEvent("loading_started");
    const textInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 80);
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-8 text-center text-white space-y-8 font-code">
      <motion.div
        className="w-20 h-20 border-2 border-primary/50 border-t-primary rounded-full relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-2 border-2 border-primary/30 border-t-transparent rounded-full" style={{ animation: 'spin 1.5s linear infinite reverse' }}></div>
        <div className="absolute inset-4 border-2 border-primary/10 border-t-transparent rounded-full" style={{ animation: 'spin 0.8s linear infinite' }}></div>
      </motion.div>
      <div className="h-8 text-lg text-muted-foreground">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, filter: 'blur(5px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(5px)' }}
            transition={{ duration: 0.3 }}
            className={glitch ? 'glitch-text' : ''}
            data-text={loadingTexts[index]}
          >
            {loadingTexts[index]}
          </motion.p>
        </AnimatePresence>
      </div>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .glitch-text {
          position: relative;
          animation: glitch-anim 0.1s infinite;
        }
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #010103;
          overflow: hidden;
        }
        .glitch-text::before {
          left: 2px;
          text-shadow: -2px 0 red;
          animation: glitch-anim-2 0.5s infinite linear reverse;
        }
        .glitch-text::after {
          left: -2px;
          text-shadow: -2px 0 cyan;
          animation: glitch-anim-3 1s infinite linear reverse;
        }
        @keyframes glitch-anim {
          0% { transform: translate(0); }
          20% { transform: translate(-3px, 3px); }
          40% { transform: translate(-3px, -3px); }
          60% { transform: translate(3px, 3px); }
          80% { transform: translate(3px, -3px); }
          to { transform: translate(0); }
        }
        @keyframes glitch-anim-2 {
          0% { clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%); }
          10% { clip-path: polygon(0 75%, 100% 75%, 100% 75%, 0 75%); }
          20% { clip-path: polygon(0 44%, 100% 44%, 100% 54%, 0 54%); }
          /* ... add more steps */
          to { clip-path: polygon(0 63%, 100% 63%, 100% 82%, 0 82%); }
        }
        @keyframes glitch-anim-3 {
          0% { clip-path: polygon(0 69%, 100% 69%, 100% 73%, 0 73%); }
          /* ... add more steps */
          to { clip-path: polygon(0 45%, 100% 45%, 100% 55%, 0 55%); }
        }
      `}</style>
    </main>
  );
}
