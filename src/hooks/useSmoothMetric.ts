import { useState, useEffect, useRef } from 'react';

export function useSmoothMetric(targetValue: number, duration: number = 500): number {
  const [currentValue, setCurrentValue] = useState(targetValue);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef<number>(targetValue);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    startValueRef.current = currentValue;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);

      // Ease-out cubic for natural deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValueRef.current + (targetValue - startValueRef.current) * easeProgress;

      setCurrentValue(nextValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetValue, duration, currentValue]);

  return currentValue;
}