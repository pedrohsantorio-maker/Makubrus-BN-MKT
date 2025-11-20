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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* CABEÇA */}
      <path d="M22 12c-4.4 2.5-7 6.7-7 12v7c0 3.7 1.9 6.8 5 8.9V46c0 1.7.8 3.3 2.2 4.3L26 53h12l3.8-2.7c1.4-1 2.2-2.6 2.2-4.3v-6.1c3.1-2.1 5-5.2 5-8.9v-7c0-5.3-2.6-9.5-7-12C38.8 10.7 35.6 10 32 10s-6.8.7-10 2Z" />

      {/* OLHOS */}
      <circle cx="26" cy="24" r="3.2" />
      <circle cx="38" cy="24" r="3.2" />

      {/* NARIZ */}
      <path d="M30 30.5 32 33l2-2.5" />

      {/* BOCA + DENTES */}
      <path d="M24 35c2.5 3.2 5.2 4.5 8 4.5s5.5-1.3 8-4.5" />
      <path d="M26 35.5v3.5" />
      <path d="M29 36.5v3.5" />
      <path d="M32 36.5v3.5" />
      <path d="M35 36.5v3.5" />
      <path d="M38 35.5v3.5" />

      {/* OSSOS CRUZADOS */}
      {/* osso diagonal 1 */}
      <path d="M16 44.5 26.5 39" />
      <path d="M14.5 40.5c-1.8-.4-3.3.5-3.9 2-0.6 1.6 0 3.3 1.6 4.1" />
      <path d="M27.5 42.5c1.8.4 3.3-.5 3.9-2 0.6-1.6 0-3.3-1.6-4.1" />

      {/* osso diagonal 2 */}
      <path d="M48 44.5 37.5 39" />
      <path d="M49.5 40.5c1.8-.4 3.3.5 3.9 2 0.6 1.6 0 3.3-1.6 4.1" />
      <path d="M36.5 42.5c-1.8.4-3.3-.5-3.9-2-0.6-1.6 0-3.3 1.6-4.1" />
    </svg>
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
