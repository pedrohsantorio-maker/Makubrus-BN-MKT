
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SkullIcon } from '@/components/SkullIcon';
import { trackFirstVisit } from '@/lib/tracking';
import { useFirebase } from '@/firebase/firebase-provider';

export function AgeGateClient() {
  const router = useRouter();
  const { firestore, user, loading } = useFirebase();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Wait for firebase to initialize and user to be authenticated
    if (!loading && firestore && user) {
        trackFirstVisit(firestore, user.uid).finally(() => {
            setTimeout(() => setIsProcessing(false), 250);
        });
    } else if (!loading) {
      // If firebase is loaded but there's no user/firestore, stop processing
      setIsProcessing(false);
    }
  }, [firestore, user, loading]);

  const handleAdult = () => {
    router.push('/carregando');
  };

  const handleMinor = () => {
    router.push('/acesso-negado');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  if (isProcessing || loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black p-8 text-center text-white">
        <div
          className="w-12 h-12 border-2 border-primary/50 border-t-primary rounded-full"
          style={{ animation: 'spin 1.2s linear infinite' }}
        ></div>
         <style jsx>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
        `}</style>
      </div>
    );
  }

  return (
    <motion.div 
      className="relative z-20 flex flex-col items-center justify-center text-center text-white space-y-8 p-8 border border-white/10 bg-black/30 rounded-lg shadow-2xl shadow-primary/10 backdrop-blur-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute pointer-events-none -inset-0.5 rounded-lg bg-gradient-to-r from-primary/30 to-primary/10 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      
      <motion.div variants={itemVariants} className="relative z-30">
        <div className="flex justify-center mb-6">
           <SkullIcon
              size={56}
              className="text-primary drop-shadow-[0_0_20px_rgba(255,0,0,0.9)]"
            />
        </div>
      </motion.div>
      <motion.h1
        className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter"
        variants={itemVariants}
      >
        Confirmação de Idade
      </motion.h1>
      <motion.p
        className="max-w-md text-lg text-muted-foreground"
        variants={itemVariants}
      >
        O conteúdo a seguir é restrito e exige maturidade. Confirme sua idade para ter acesso.
      </motion.p>
      <motion.div
        className="flex flex-col sm:flex-row gap-4 w-full max-w-sm pt-4"
        variants={itemVariants}
      >
        <motion.div 
          className="w-full relative z-30 pointer-events-auto"
          whileHover={{ scale: 1.05, y: -2 }} 
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleAdult}
            className="w-full bg-primary/90 text-primary-foreground font-bold py-6 text-lg rounded-md border border-primary transition-all duration-300 shadow-[0_0_15px_rgba(255,0,0,0.5),inset_0_0_5px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,0,0,0.8)] hover:bg-primary"
          >
            Tenho mais de 18
          </Button>
        </motion.div>
        <motion.div 
          className="w-full relative z-30 pointer-events-auto"
          whileHover={{ scale: 1.05, y: -2 }} 
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleMinor}
            variant="secondary"
            className="w-full py-6 text-lg font-bold bg-white/5 border border-white/10 hover:bg-white/10"
          >
            Sou menor
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
