"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Icon18Plus } from '@/components/icons';
import { logEvent } from '@/lib/firebase';

export function AgeGateClient() {
  const router = useRouter();

  const handleAdult = () => {
    logEvent("age_gate", { result: "adult" });
    router.push('/carregando');
  };

  const handleMinor = () => {
    logEvent("age_gate", { result: "minor" });
    router.push('/acesso-negado');
  };

  return (
    <div className="flex flex-col items-center justify-center text-center text-white space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Icon18Plus className="h-24 w-24 text-white" />
      </motion.div>
      <motion.h1
        className="font-headline text-5xl md:text-7xl font-extrabold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Confirmação de Idade
      </motion.h1>
      <motion.p
        className="max-w-md text-lg text-muted-foreground"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        O conteúdo a seguir é restrito e exclusivo. Confirme sua idade para continuar.
      </motion.p>
      <motion.div
        className="flex flex-col sm:flex-row gap-4 w-full max-w-sm pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
          <Button
            onClick={handleAdult}
            className="w-full bg-primary text-primary-foreground font-bold py-6 text-lg hover:bg-primary/90 shadow-[0_0_15px_theme(colors.primary)] hover:shadow-[0_0_25px_theme(colors.primary)] transition-shadow duration-300"
          >
            Tenho mais de 18
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
          <Button
            onClick={handleMinor}
            variant="secondary"
            className="w-full py-6 text-lg font-bold"
          >
            Sou menor
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
