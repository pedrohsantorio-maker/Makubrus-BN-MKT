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
      animate={{ scale: [1, 1.05, 1], opacity: [1, 0.95, 1] }}
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
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Ossos Cruzados */}
        <path d="M16 48 L48 16" />
        <path d="M18 14 a4 4 0 1 0 -8 0 a4 4 0 1 0 8 0z" />
        <path d="M54 46 a4 4 0 1 0 -8 0 a4 4 0 1 0 8 0z" />
        <path d="M16 16 L48 48" />
        <path d="M18 50 a4 4 0 1 0 -8 0 a4 4 0 1 0 8 0z" />
        <path d="M54 18 a4 4 0 1 0 -8 0 a4 4 0 1 0 8 0z" />
        
        {/* Cabeça da Caveira */}
        <path d="M32 6 C 18 6, 12 18, 12 28 C 12 40, 18 46, 32 46 C 46 46, 52 40, 52 28 C 52 18, 46 6, 32 6 Z" />
        
        {/* Olhos */}
        <circle cx="24" cy="26" r="4" />
        <circle cx="40" cy="26" r="4" />
        
        {/* Nariz */}
        <path d="M32 32 L 29 38 L 35 38 Z" />

        {/* Dentes */}
        <path d="M22 46 V 42" />
        <path d="M27 46 V 42" />
        <path d="M32 46 V 42" />
        <path d="M37 46 V 42" />
        <path d="M42 46 V 42" />
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