"use client";

import { motion } from 'framer-motion';

type SkullProps = {
  size?: number;
  className?: string;
};

export function SkullCrossbonesIcon({
  size = 64,
  className = "",
}: SkullProps) {
  return (
    <motion.div
      animate={{ scale: [1, 1.02, 1], opacity: [1, 0.95, 1] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="flex justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width={size}
        height={size}
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Ossos Cruzados */}
        <path d="M14 50 L50 14" />
        <path d="M12 12.5a4 4 0 1 0 -8 0a4 4 0 1 0 8 0z" transform="rotate(45 10 12.5)" />
        <path d="M58 51.5a4 4 0 1 0 -8 0a4 4 0 1 0 8 0z" transform="rotate(45 54 51.5)" />
        <path d="M14 14 L50 50" />
        <path d="M12 51.5a4 4 0 1 0 -8 0a4 4 0 1 0 8 0z" transform="rotate(-45 10 51.5)" />
        <path d="M58 12.5a4 4 0 1 0 -8 0a4 4 0 1 0 8 0z" transform="rotate(-45 54 12.5)" />
        
        {/* Cabeça da Caveira */}
        <path d="M32 8 C 18 8, 12 20, 12 30 C 12 42, 18 50, 32 50 C 46 50, 52 42, 52 30 C 52 20, 46 8, 32 8 Z" />
        
        {/* Olhos */}
        <circle cx="24" cy="28" r="5" />
        <circle cx="40" cy="28" r="5" />
        
        {/* Nariz */}
        <path d="M32 34 L 29 40 L 35 40 Z" />

        {/* Dentes */}
        <path d="M22 50 V 45" />
        <path d="M27 50 V 45" />
        <path d="M32 50 V 45" />
        <path d="M37 50 V 45" />
        <path d="M42 50 V 45" />
      </svg>
    </motion.div>
  );
}


export function Icon18Plus({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M7 10h2" />
      <path d="M8 10v4" />
      <path d="M14.5 10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      <path d="M13 13.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      <path d="M17 10h-2" />
      <path d="M16 10v4" />
    </svg>
  );
}

export function ForbiddenIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m4.9 4.9 14.2 14.2" />
    </svg>
  );
}
