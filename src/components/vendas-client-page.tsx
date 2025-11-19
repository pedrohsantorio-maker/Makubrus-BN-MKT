"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CountdownTimer } from '@/components/countdown-timer';
import { IconSkull } from '@/components/icons';
import { MotionButton } from '@/components/motion-button';
import { logEvent } from '@/lib/firebase';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

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
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};


export function VendasClientPage({ featureCards }: VendasClientPageProps) {
  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground p-3 text-center shadow-[0_0_15px_theme(colors.primary)]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <p className="font-bold text-sm md:text-base">
          AVISO: Este portal sairá do ar em breve. Acesso extremamente limitado. <span className="hidden md:inline-block ml-4">Tempo restante: <CountdownTimer /></span>
        </p>
      </motion.header>

      <main className="pt-24 pb-16 px-4 md:px-8">
        <motion.section 
            className="text-center flex flex-col items-center space-y-6 min-h-[60vh] justify-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
          <motion.div variants={itemVariants}><IconSkull className="w-16 h-16" /></motion.div>
          <motion.h1 
            variants={itemVariants} 
            className="font-headline text-6xl md:text-8xl font-extrabold tracking-tighter leading-tight"
          >
            ACESSO OCULTO
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            Conteúdos restritos, raros e privados. <span className="text-primary mx-1">🔥</span><span className="text-primary mx-1">⚠️</span><span className="text-primary mx-1">🥷</span>
          </motion.p>
          <motion.div variants={itemVariants} className="pt-8 w-full max-w-md">
            <MotionButton onClick={() => logEvent('main_cta_click', { placement: 'hero' })} pulse>
              GARANTIR ACESSO EXCLUSIVO
            </MotionButton>
          </motion.div>
        </motion.section>

        <motion.section 
            className="py-20 max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCards.map((card, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="bg-[#071a0c] border-green-900/50 shadow-lg shadow-green-500/10 overflow-hidden h-full flex flex-col transition-all hover:border-green-800/80 hover:shadow-green-500/20">
                  <CardHeader>
                    {card.image && (
                       <div className="aspect-video w-full overflow-hidden rounded-md">
                          <Image
                          src={card.image.imageUrl}
                          alt={card.image.description}
                          width={600}
                          height={400}
                          data-ai-hint={card.image.imageHint}
                          className="w-full h-full object-cover filter blur-sm scale-105"
                          />
                       </div>
                    )}
                    <CardTitle className="font-headline text-2xl pt-4">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
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
            <motion.h2 variants={itemVariants} className="font-headline text-4xl md:text-5xl font-bold">Não Perca Sua Vaga</motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground max-w-xl">O acesso é limitado e pode fechar a qualquer momento. Esta é sua última chance.</motion.p>
            <motion.div variants={itemVariants} className="pt-8 w-full max-w-md">
                <MotionButton onClick={() => logEvent('final_cta_click', { placement: 'footer' })} vibrate>
                    Entrar no grupo privado agora
                </MotionButton>
            </motion.div>
        </motion.section>

      </main>
    </div>
  );
}
