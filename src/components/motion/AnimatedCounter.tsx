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
  /** Accessible label describing the final metric */
  label?: string;
  /** Additional className */
  className?: string;
  /** Additional style */
  style?: React.CSSProperties;
  /** Whether to format with locale separators */
  useLocaleFormatting?: boolean;
}

export function AnimatedCounter({
  value,
  duration = 1400,
  prefix = '',
  suffix = '',
  locale = 'en',
  label,
  className = '',
  style,
  useLocaleFormatting = true,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const hasAnimatedRef = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimatedRef.current) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayValue(value);
      hasAnimatedRef.current = true;
      return;
    }

    let rafId: number | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          observer.unobserve(el);

          const startTime = performance.now();
          setDisplayValue(0);

          const easeOutExpo = (t: number): number =>
            t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutExpo(progress);
            const current = Math.round(value * eased);
            setDisplayValue(current);

            if (progress < 1) {
              rafId = requestAnimationFrame(tick);
            } else {
              setDisplayValue(value);
            }
          };

          rafId = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [value, duration]);

  const formatNumber = (num: number) =>
    useLocaleFormatting
      ? num.toLocaleString(locale === 'ar' ? 'ar-YE' : 'en-US')
      : num.toString();

  const finalFormatted = `${prefix}${formatNumber(value)}${suffix}`;
  const currentFormatted = `${prefix}${formatNumber(displayValue)}${suffix}`;

  return (
    <span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: 'tabular-nums', ...style }}
      aria-label={label ? `${finalFormatted} ${label}` : finalFormatted}
    >
      <span aria-hidden="true">{currentFormatted}</span>
    </span>
  );
}
