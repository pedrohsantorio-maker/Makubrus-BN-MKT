"use client";

import { motion } from 'framer-motion';
import { SkullIcon } from '@/components/SkullIcon';
import { MotionButton } from '@/components/motion-button';
import { logEvent } from '@/lib/firebase';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

export const SalesPageHero = () => (
  <motion.section 
    className="text-center flex flex-col items-center space-y-4 min-h-[70vh] justify-center"
    initial="hidden"
    animate="visible"
    variants={containerVariants}
  >
    <motion.div 
      variants={itemVariants} 
      className="flex items-center justify-center gap-4"
    >
      <motion.h1 
        className="font-headline text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-primary"
        style={{ textShadow: '0 0 8px hsl(var(--primary) / 0.8), 0 0 24px hsl(var(--primary) / 0.6)' }}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        MAK4BRUS OCULTOS
      </motion.h1>
    </motion.div>
    
    <motion.div 
        variants={itemVariants} 
        className="mt-4 flex flex-col items-center gap-2 text-sm text-neutral-300"
    >
        <div className="inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.25em] text-neutral-400">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span>Conteúdo Raro</span>
            <span className="text-yellow-400">⚠</span>
        </div>
        <p className="text-[0.7rem] text-neutral-500 uppercase tracking-[0.3em]">
            Não divulgue
        </p>
    </motion.div>

    <motion.div
        variants={itemVariants}
        className="pt-2"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <SkullIcon 
            size={48} 
            className="text-neutral-100 drop-shadow-[0_0_14px_rgba(255,0,0,0.6)]" 
        />
    </motion.div>
    
    <motion.p variants={itemVariants} className="text-lg md:text-xl text-neutral-200/90 max-w-3xl pt-8 leading-relaxed">
      Acesso liberado a uma coleção de materiais restritos, raros e privados. O que você verá aqui não pode ser encontrado em nenhum outro lugar.
    </motion.p>
    <motion.div variants={itemVariants} className="pt-8 w-full max-w-lg pointer-events-auto">
      <MotionButton onClick={() => logEvent('main_cta_click', { placement: 'hero' })} pulse>
        GARANTIR ACESSO VITALÍCIO
      </MotionButton>
    </motion.div>
  </motion.section>
);