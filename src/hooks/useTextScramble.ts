import { useState, useEffect, useRef } from 'react';

// Constrained strictly to binary values for the cinematic Matrix/Data resolve effect
const CHARS = '01';

export function useTextScramble(targetText: string, isActive: boolean, duration: number = 400) {
  const [displayText, setDisplayText] = useState(targetText);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isActive) {
      setDisplayText(targetText);
      return;
    }

    let iteration = 0;
    const maxIterations = targetText.length * 2;
    const stepTime = Math.max(10, duration / maxIterations);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        targetText
          .split('')
          .map((char, index) => {
            if (index < iteration) return targetText[index];
            if (char === ' ') return ' ';
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      if (iteration >= targetText.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      iteration += 0.5;
    }, stepTime);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [targetText, isActive, duration]);

  return displayText;
}