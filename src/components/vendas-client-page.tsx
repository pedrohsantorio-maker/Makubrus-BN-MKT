"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { CountdownTimer } from '@/components/countdown-timer';
import { MotionButton } from '@/components/motion-button';
import { logEvent } from '@/lib/firebase';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { ShieldAlert } from 'lucide-react';
import { SalesPageHero } from '@/components/sales-page-hero';
import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface VendasClientPageProps {
    carouselImages: ImagePlaceholder[];
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

export function VendasClientPage({ carouselImages }: VendasClientPageProps) {
  const autoplayOptions = {
    delay: 2000,
    stopOnInteraction: true,
    stopOnMouseEnter: true,
  };

  const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true }, [Autoplay(autoplayOptions)]);
  
  const duplicatedImages = [...carouselImages, ...carouselImages, ...carouselImages];

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

      <main className="pt-24 pb-16 relative z-10">
        <SalesPageHero />

        <section className="py-20 w-full">
          <div className="carousel-wrapper" ref={emblaRef}>
            <div className="carousel-track">
              {duplicatedImages.map((image, index) => (
                <div key={index} className="carousel-item group">
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    data-ai-hint={image.imageHint}
                    className="carousel-image"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <motion.section 
            className="text-center flex flex-col items-center space-y-6 pt-16 px-4 md:px-8"
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
