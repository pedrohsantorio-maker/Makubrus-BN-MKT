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
    boxShadow: [
      "0 0 15px rgba(255,0,0,0.5), inset 0 0 5px rgba(255,255,255,0.2)",
      "0 0 30px rgba(255,0,0,0.8), inset 0 0 8px rgba(255,255,255,0.3)",
      "0 0 15px rgba(255,0,0,0.5), inset 0 0 5px rgba(255,255,255,0.2)"
    ]
  };

  const pulseTransition = {
    duration: 2.5,
    repeat: Infinity,
    ease: "easeInOut"
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
    // note: vibrate transition is shorter, we need to ensure it loops correctly
    transition = { ...transition, x: vibrateTransition };
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      animate={animate}
      transition={transition}
      className="rounded-md"
    >
      <Button
        onClick={onClick}
        className={cn(
          "w-full bg-primary/90 text-primary-foreground font-bold py-6 text-lg tracking-wider uppercase rounded-md border border-primary transition-all duration-300",
          "shadow-[0_0_15px_rgba(255,0,0,0.5),inset_0_0_5px_rgba(255,255,255,0.2)]",
          "hover:shadow-[0_0_30px_rgba(255,0,0,0.8)] hover:bg-primary",
          className
        )}
      >
        {children}
      </Button>
    </motion.div>
  );
}
