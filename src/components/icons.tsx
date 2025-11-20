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
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M48,46.5l-5.5,5.5-5.5-5.5" />
      <path d="M27,52l-5.5-5.5-5.5,5.5" />
      <path d="M37,41.5l16.5,16.5" />
      <path d="M10.5,58l16.5-16.5" />
      <path d="M46.5,41.5l5.5,5.5,5.5-5.5" />
      <path d="M17,52l5.5-5.5,5.5,5.5" />
      <path d="M48,34v3M44,34v3M40,34v3M36,34v3M32,34v3M28,34v3M24,34v3M20,34v3" />
      <path d="M16,34A15.9,15.9,0,0,0,32,38a15.9,15.9,0,0,0,16-4" />
      <path d="M34.5,23a2.5,2.5,0,0,1,5,0h0a2.5,2.5,0,0,1-5,0Z" />
      <path d="M24.5,23a2.5,2.5,0,0,1,5,0h0a2.5,2.5,0,0,1-5,0Z" />
      <path d="M32,29l-3,3,3,3,3-3Z" />
      <path d="M48,24V20A16,16,0,0,0,32,4h0A16,16,0,0,0,16,20v4a8,8,0,0,0,8,8h16A8,8,0,0,0,48,24Z" />
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
