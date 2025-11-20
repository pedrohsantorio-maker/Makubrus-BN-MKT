"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CountdownTimer } from '@/components/countdown-timer';
import { SkullIcon } from '@/components/SkullIcon';
import { MotionButton } from '@/components/motion-button';
import { logEvent } from '@/lib/firebase';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { ShieldAlert } from 'lucide-react';
import { SalesPageHero } from '@/components/sales-page-hero';

interface FeatureCard {
    title: string;
    description: string;
    image?: ImagePlaceholder;
}

interface VendasClientPageProps {
    featureCards: FeatureCard[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export function VendasClientPage({ featureCards }: VendasClientPageProps) {
  return (
    <div className="bg-transparent text-white min-h-screen overflow-x-hidden">
       <div className="radial-gradient-overlay pointer-events-none"></div>
       <div className="vignette-overlay pointer-events-none"></div>
       <div className="noise-overlay pointer-events-none"></div>
      
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md text-primary-foreground p-3 text-center border-b border-primary/20 shadow-[0_0_25px_rgba(255,0,0,0.3)] pointer-events-auto"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="font-bold text-sm md:text-base flex items-center justify-center gap-3">
          <ShieldAlert className="text-primary w-5 h-5 animate-pulse" />
          <p>
            AVISO: Portal de acesso limitado. Tempo restante: <CountdownTimer />
          </p>
        </div>
      </motion.header>

      <main className="pt-24 pb-16 px-4 md:px-8 relative z-10">
        <SalesPageHero />

        <motion.section 
            className="py-20 max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCards.map((card, index) => (
              <motion.div key={index} variants={itemVariants} className="pointer-events-auto">
                <Card className="bg-black/20 border border-white/10 shadow-lg shadow-black/50 overflow-hidden h-full flex flex-col transition-all duration-300 hover:border-white/20 hover:shadow-primary/20 hover:-translate-y-1">
                  <CardHeader className="p-4">
                    {card.image && (
                       <div className="aspect-video w-full overflow-hidden rounded-md border border-white/10">
                          <Image
                          src={card.image.imageUrl}
                          alt={card.image.description}
                          width={600}
                          height={400}
                          data-ai-hint={card.image.imageHint}
                          className="w-full h-full object-cover filter blur-sm scale-110"
                          />
                       </div>
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow p-4 pt-0">
                    <CardTitle className="font-headline text-2xl mb-2">{card.title}</CardTitle>
                    <p className="text-muted-foreground">{card.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
        
        <motion.section 
            className="text-center flex flex-col items-center space-y-6 pt-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={containerVariants}
        >
            <motion.h2 variants={itemVariants} className="font-headline text-4xl md:text-6xl font-bold tracking-tight">Vagas Quase Esgotadas</motion.h2>
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground max-w-2xl">O acesso é extremamente limitado e será encerrado a qualquer momento. Esta é sua última oportunidade de entrar.</motion.p>
            <motion.div variants={itemVariants} className="pt-8 w-full max-w-lg pointer-events-auto">
                <MotionButton onClick={() => logEvent('final_cta_click', { placement: 'footer' })} vibrate>
                    Entrar no grupo privado agora
                </MotionButton>
            </motion.div>
        </motion.section>

      </main>
    </div>
  );
}
