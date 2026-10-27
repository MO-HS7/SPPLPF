'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface AnimatedCounterProps {
  /** The target value to animate to */
  value: number;
  /** Duration in ms */
  duration?: number;
  /** Optional prefix (e.g., '+', '$') */
  prefix?: string;
  /** Optional suffix (e.g., '%', '+') */
  suffix?: string;
  /** Locale for number formatting */
  locale?: string;
  /** Additional className */
  className?: string;
  /** Additional style */
  style?: React.CSSProperties;
  /** Whether to format with locale separators */
  useLocaleFormatting?: boolean;
}

export function AnimatedCounter({
  value,
  duration = 1800,
  prefix = '',
  suffix = '',
  locale = 'en',
  className = '',
  style,
  useLocaleFormatting = true,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(value);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateValue(0, value, duration);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, hasAnimated]);

  function animateValue(start: number, end: number, dur: number) {
    const startTime = performance.now();

    function easeOutExpo(t: number): number {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / dur, 1);
      const easedProgress = easeOutExpo(progress);
      const current = Math.round(start + (end - start) * easedProgress);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  const formattedValue = useLocaleFormatting
    ? displayValue.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')
    : displayValue.toString();

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
}
