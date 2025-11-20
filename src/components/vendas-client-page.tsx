"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CountdownTimer } from '@/components/countdown-timer';
import { MotionButton } from '@/components/motion-button';
import { logEvent } from '@/lib/firebase';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { ShieldAlert } from 'lucide-react';
import { SalesPageHero } from '@/components/sales-page-hero';
import React, { useEffect, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

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
  const autoplayOptions = {
    delay: 2500,
    stopOnInteraction: true,
    stopOnMouseEnter: true,
  };

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: true }, [Autoplay(autoplayOptions)]);
  
  const duplicatedCards = [...featureCards, ...featureCards, ...featureCards];

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

        <section className="py-20 w-full">
          <div className="carousel-wrapper" ref={emblaRef}>
            <div className="carousel-track">
              {duplicatedCards.map((card, index) => (
                <div key={index} className="carousel-item group">
                   <div className="carousel-item-content">
                      <CardHeader className="p-0 mb-4">
                        {card.image && (
                           <div className="aspect-video w-full overflow-hidden rounded-md border border-white/10">
                              <Image
                              src={card.image.imageUrl}
                              alt={card.image.description}
                              width={600}
                              height={400}
                              data-ai-hint={card.image.imageHint}
                              className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                              />
                           </div>
                        )}
                      </CardHeader>
                      <CardContent className="flex-grow p-0">
                        <CardTitle className="font-headline text-2xl mb-2 text-neutral-100 group-hover:text-white">{card.title}</CardTitle>
                        <p className="text-neutral-400 group-hover:text-neutral-300">{card.description}</p>
                      </CardContent>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
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
