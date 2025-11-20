"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { MotionButton } from '@/components/motion-button';
import { logEvent } from '@/lib/firebase';

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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const benefits = [
    "Conteúdo Ultra-Exclusivo",
    "Acesso a Segredos Revelados",
    "Comunidade VIP e Discreta",
    "Atualizações Constantes e Raras",
];

export function VslClientPage() {
  const router = useRouter();

  useEffect(() => {
    logEvent("view_vsl");
  }, []);

  const handleCtaClick = () => {
    logEvent("click_vsl_cta");
    router.push('/vendas');
  };

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden flex items-center justify-center">
      <main className="py-16 px-4 md:px-8 max-w-4xl w-full">
        <motion.section 
            className="text-center flex flex-col items-center space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
          <motion.h1 
            variants={itemVariants} 
            className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            Assista essa mensagem importante antes de continuar
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg text-muted-foreground max-w-2xl">
            O que você está prestes a ver é confidencial.
          </motion.p>
          
          <motion.div variants={itemVariants} className="w-full aspect-video bg-card border border-border rounded-lg flex items-center justify-center shadow-lg">
            <p className="text-muted-foreground">Seu vídeo será carregado aqui.</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="pt-6 w-full max-w-md">
            <MotionButton onClick={handleCtaClick} pulse>
              CONTINUAR PARA O CONTEÚDO
            </MotionButton>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-12 w-full max-w-lg text-left">
             <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-muted-foreground">
                        <CheckCircle className="h-5 w-5 mr-3 text-accent" />
                        <span>{benefit}</span>
                    </li>
                ))}
             </ul>
          </motion.div>

        </motion.section>
      </main>
    </div>
  );
}
