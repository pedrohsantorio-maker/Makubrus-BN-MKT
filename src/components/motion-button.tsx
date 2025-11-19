"use client";

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MotionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  pulse?: boolean;
  vibrate?: boolean;
}

export function MotionButton({ children, onClick, className, pulse = false, vibrate = false }: MotionButtonProps) {
  
  const pulseAnimation = {
    scale: [1, 1.03, 1],
  };
  const pulseTransition = {
    duration: 1.5,
    repeat: Infinity,
    repeatDelay: 1.5
  };

  const vibrateAnimation = {
    x: [0, -1.5, 1.5, -1.5, 1.5, 0],
  };
  const vibrateTransition = {
    duration: 0.4,
    repeat: Infinity,
    repeatDelay: 5.6
  };

  let animate = {};
  let transition: any = {};

  if (pulse) {
    animate = { ...animate, ...pulseAnimation };
    transition = { ...transition, ...pulseTransition };
  }
  if (vibrate) {
    animate = { ...animate, ...vibrateAnimation };
    transition = { ...transition, ...vibrateTransition };
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={animate}
      transition={transition}
    >
      <Button
        onClick={onClick}
        className={cn(
          "w-full bg-primary text-primary-foreground font-bold py-6 text-lg tracking-wider uppercase shadow-[0_0_15px_rgba(255,0,0,0.7)] hover:shadow-[0_0_30px_rgba(255,0,0,1)] transition-all duration-300 ease-in-out",
          className
        )}
      >
        {children}
      </Button>
    </motion.div>
  );
}
