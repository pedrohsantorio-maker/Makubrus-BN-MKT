
"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { CountdownTimer } from '@/components/countdown-timer';
import { MotionButton } from '@/components/motion-button';
import { logEvent } from '@/lib/firebase';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { ShieldAlert, Users } from 'lucide-react';
import { SalesPageHero } from '@/components/sales-page-hero';
import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import {useEffect, useState} from 'react';

interface VendasClientPageProps {
    carouselImages: ImagePlaceholder[];
    previewImages: ImagePlaceholder[];
}

const previewVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

export function VendasClientPage({ carouselImages, previewImages }: VendasClientPageProps) {
  const autoplayOptions = {
    delay: 2000,
    stopOnInteraction: true,
    stopOnMouseEnter: true,
  };

  const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true }, [Autoplay(autoplayOptions)]);
  
  const duplicatedImages = [...carouselImages, ...carouselImages, ...carouselImages];

  const [vagas, setVagas] = useState(8);

  useEffect(() => {
    const interval = setInterval(() => {
      setVagas((v) => {
        if (v > 1) {
          return v - 1;
        }
        clearInterval(interval);
        return 1;
      });
    }, 4500); // Slower decrement

    return () => clearInterval(interval);
  }, []);


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

      <main className="relative z-10">
        <SalesPageHero />

        <section className="py-12 w-full">
          <div className="carousel-wrapper" ref={emblaRef}>
            <div className="carousel-track">
              {duplicatedImages.map((image, index) => (
                 <div key={index} className="carousel-item">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      width={260}
                      height={420}
                      data-ai-hint={image.imageHint}
                      className="carousel-image"
                    />
                 </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mt-12 sm:mt-16">
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center">
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-neutral-100">Um gostinho do que você vai receber</h2>
              <p className="mt-2 max-w-2xl mx-auto text-lg text-neutral-400">Abaixo você vê apenas uma pequena prévia do tipo de material que fica disponível dentro do portal oculto.</p>
            </div>
            
            <div className="mt-8 grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {previewImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  custom={index}
                  variants={previewVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  className="preview-card group relative overflow-hidden rounded-2xl bg-gradient-to-b from-red-900/40 via-black to-black border border-red-500/20 shadow-[0_0_25px_rgba(248,113,113,0.35)]"
                >
                  <div className="relative aspect-[9/16] overflow-hidden">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="preview-image h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                    <div className="pointer-events-none absolute inset-x-0 -top-full h-16 bg-gradient-to-b from-transparent via-red-500/25 to-transparent preview-scan" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        <motion.section 
            className="text-center flex flex-col items-center space-y-6 pt-16 px-4 md:px-8 pb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
        >
            <motion.h2 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="font-headline text-4xl md:text-6xl font-bold tracking-tight">Vagas Quase Esgotadas</motion.h2>
            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-lg md:text-xl text-muted-foreground max-w-2xl">O acesso é extremamente limitado e será encerrado a qualquer momento. Esta é sua última oportunidade de entrar.</motion.p>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="pt-8 w-full max-w-lg pointer-events-auto">
                <MotionButton onClick={() => logEvent('final_cta_click', { placement: 'footer' })} vibrate>
                    Entrar no grupo privado agora
                </MotionButton>
            </motion.div>
        </motion.section>

        <motion.div
          className="relative max-w-md mx-auto mt-8 mb-12 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.7 }}
        >
            <div className="relative rounded-lg border-2 border-primary/50 bg-primary/10 px-6 py-4 text-center shadow-[0_0_30px_hsl(var(--primary)/0.4)]">
                <div className="absolute -top-3 -left-3 -right-3 -bottom-3 animate-pulse-slow rounded-lg border-2 border-primary/30 blur-sm"></div>
                <div className="flex items-center justify-center gap-4">
                    <Users className="h-8 w-8 text-primary animate-flicker" />
                    <div className="text-left">
                        <p className="font-bold text-white text-lg tracking-wide">ÚLTIMAS VAGAS DISPONÍVEIS</p>
                        <div className="flex items-baseline gap-2">
                           <span className={`font-headline text-4xl font-bold text-primary ${vagas <= 3 ? 'animate-flicker-intense' : ''}`} style={{textShadow: `0 0 ${vagas <= 3 ? '15px' : '8px'} hsl(var(--primary))`}}>
                             {vagas}
                           </span>
                           <span className="text-muted-foreground font-medium text-base">vagas restantes</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>

      </main>
    </div>
  );
}



