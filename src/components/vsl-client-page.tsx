"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import { MotionButton } from '@/components/motion-button';
import { logEvent } from '@/lib/firebase';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
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
    <div className="bg-transparent text-white min-h-screen flex items-center justify-center py-16">
      <main className="px-4 md:px-8 max-w-4xl w-full">
        <motion.section 
            className="text-center flex flex-col items-center space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3 text-primary font-code uppercase text-sm tracking-widest">
            <ShieldCheck className="w-5 h-5" />
            <span>Transmissão Segura</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants} 
            className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter"
          >
            Assista a Mensagem Importante
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            O que você está prestes a ver é confidencial e sensível. Prossiga com atenção.
          </motion.p>
          
          <motion.div 
            variants={itemVariants} 
            className="w-full aspect-video bg-black border border-primary/20 rounded-lg flex items-center justify-center shadow-[0_0_30px_rgba(255,0,0,0.2)] p-1"
          >
            <div className="w-full h-full bg-black flex items-center justify-center rounded-md">
              <p className="text-muted-foreground font-code">VSL Player Placeholder</p>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="pt-6 w-full max-w-lg">
            <MotionButton onClick={handleCtaClick} pulse>
              QUERO ACESSO COMPLETO
            </MotionButton>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-12 w-full max-w-lg text-left">
             <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                    <motion.li 
                        key={index} 
                        className="flex items-center text-muted-foreground gap-3 text-lg"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <CheckCircle className="h-6 w-6 text-primary shrink-0" />
                        <span>{benefit}</span>
                    </motion.li>
                ))}
             </ul>
          </motion.div>

        </motion.section>
      </main>
    </div>
  );
}
