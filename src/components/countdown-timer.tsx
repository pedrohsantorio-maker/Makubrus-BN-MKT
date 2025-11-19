"use client";

import { useState, useEffect } from 'react';

// This timer restarts on every page load, as requested.
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
          clearInterval(interval);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [minutes, seconds]);

  return (
    <span className="font-mono text-accent font-bold tracking-wider">
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </span>
  );
}
