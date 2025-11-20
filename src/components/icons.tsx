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
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M32 8c-7.5 0-14 5.6-14 14v6c0 3.3 1.6 6.2 4.3 7.9V42c0 1.3.5 2.6 1.5 3.5L26 48h12l2.2-2.5c1-1 1.5-2.2 1.5-3.5v-6.1C44.4 34.2 46 31.3 46 28v-6c0-8.4-6.5-14-14-14Z" />
      <circle cx="26" cy="24" r="3" />
      <circle cx="38" cy="24" r="3" />
      <path d="M30 30l2 3 2-3" />
      <path d="M24 34c2.5 3 5 4 8 4s5.5-1 8-4" />
      <path d="M26 34v3" />
      <path d="M29 35v3" />
      <path d="M32 35v3" />
      <path d="M35 35v3" />
      <path d="M38 34v3" />
      <path d="M14 44l10 6" />
      <path d="M18 38l6 3" />
      <path d="M50 44l-10 6" />
      <path d="M46 38l-6 3" />
      <path d="M18 50c-2 1-4.5.4-5.5-1.6-1-2-.1-4.4 1.9-5.4" />
      <path d="M46 50c2 1 4.5.4 5.5-1.6 1-2 .1-4.4-1.9-5.4" />
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
