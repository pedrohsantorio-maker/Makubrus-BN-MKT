import type { SVGProps } from 'react';

export function Icon18Plus(props: SVGProps<SVGSVGElement>) {
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
      {...props}
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

export function IconSkull(props: SVGProps<SVGSVGElement>) {
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
      {...props}
    >
      <path d="M12 2a9.5 9.5 0 0 0-9.5 9.5c0 4.14 2.86 7.58 6.5 8.94V22h6v-1.56c3.64-1.36 6.5-4.8 6.5-8.94A9.5 9.5 0 0 0 12 2Z" />
      <path d="M9 12c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1Z" />
      <path d="M15 12c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1Z" />
      <path d="M12 16c-1.5 0-3-1-3-2h6c0 1-1.5 2-3 2Z" />
    </svg>
  );
}
