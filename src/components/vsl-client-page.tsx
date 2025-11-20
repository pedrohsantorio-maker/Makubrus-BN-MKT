"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, ShieldCheck } from 'lucide-react';
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

const benefitsListVariants = {
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
  hidden: {},
};

const benefitItemVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};


const benefits = [
    "Conteúdo Oculto & Ultra-Restrito 🔥",
    "Arquivos Secretos da Deep Web (Acesso Adulto) 🜁",
    "Mídias Raras, Vazadas & Difíceis de Encontrar 🕳️",
    "Gravações Confidenciais e Não Listadas 🎥",
    "Atualizações Diárias de Conteúdos Exclusivos ⚡",
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
            ASSISTA SE TIVER CORAGEM
          </motion.h1>

          <motion.div 
            variants={itemVariants}
            className="max-w-2xl w-full space-y-4 text-center"
          >
            <div>
              <p className="text-xl md:text-2xl text-white font-semibold tracking-wide" style={{ textShadow: '0 0 12px hsla(var(--primary), 0.4)'}}>
                O que você está prestes a ver é extremo e não é para qualquer um.
              </p>
              <div className="mt-3 mx-auto h-px w-40 bg-primary/30 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-1/4 bg-primary animate-scan-line"></div>
              </div>
            </div>
            <p className="text-lg text-muted-foreground pt-1">
              Apenas continue se não for fraco e tiver coragem.
            </p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants} 
            className="w-full aspect-video bg-black border border-primary/20 rounded-lg flex items-center justify-center shadow-[0_0_30px_rgba(255,0,0,0.2)] p-1"
          >
            <div className="w-full h-full bg-black flex items-center justify-center rounded-md">
              <video
                controls
                className="w-full h-full rounded-md"
                src="https://screenapp.io/app/v/3_qqJHrmVi"
                autoPlay
                muted
                loop
              />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="pt-6 w-full max-w-lg">
            <MotionButton onClick={handleCtaClick} pulse>
              QUERO ACESSO COMPLETO
            </MotionButton>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="pt-12 w-full max-w-2xl text-left"
          >
             <div className="mt-8 rounded-2xl border border-red-500/20 bg-gradient-to-b from-black/80 via-black/60 to-black/80 shadow-[0_0_40px_rgba(239,68,68,0.18)] px-4 py-5 sm:px-8 sm:py-6">
                <motion.ul 
                    className="space-y-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={benefitsListVariants}
                >
                    {benefits.map((benefit, index) => (
                        <motion.li 
                            key={index} 
                            className="group flex items-start gap-3 transition-transform duration-200 hover:translate-x-0.5"
                            variants={benefitItemVariant}
                        >
                            <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full border border-red-500/60 bg-red-500/10 text-xs font-bold text-red-400 transition-all duration-200 group-hover:bg-red-500/20 group-hover:text-red-300 group-hover:scale-110">
                                <Check className="h-3 w-3" />
                            </span>
                            <p className="text-base sm:text-lg text-neutral-200 transition-colors duration-200 group-hover:text-white">
                                {benefit}
                            </p>
                        </motion.li>
                    ))}
                </motion.ul>
             </div>
          </motion.div>

        </motion.section>
      </main>
    </div>
  );
}
