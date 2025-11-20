"use client";

import { useState, useEffect } from 'react';

const INITIAL_MINUTES = 9;
const INITIAL_SECONDS = 59;

export function CountdownTimer() {
  const [minutes, setMinutes] = useState(INITIAL_MINUTES);
  const [seconds, setSeconds] = useState(INITIAL_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Optional: Stop at 00:00
          setMinutes(0);
          setSeconds(0);
          clearInterval(interval);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [minutes, seconds]);

  const isEnding = minutes < 1;

  return (
    <span 
      className={`font-code text-primary font-bold tracking-wider ${isEnding ? 'animate-flicker' : ''}`}
      style={{ textShadow: `0 0 5px hsl(var(--primary)), 0 0 10px hsl(var(--primary))`}}
    >
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </span>
  );
}
