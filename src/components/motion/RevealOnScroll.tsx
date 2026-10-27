'use client';

import React, { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/**
 * RevealOnScroll — CSS-only scroll-reveal wrapper.
 * Uses IntersectionObserver to add a class that triggers a CSS transition.
 * No external motion library dependency for this base utility.
 * Respects `prefers-reduced-motion`.
 */

export interface RevealOnScrollProps {
  children: ReactNode;
  /** Direction from which the element enters */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** Delay in ms before the animation starts */
  delay?: number;
  /** Duration in ms */
  duration?: number;
  /** IntersectionObserver threshold (0-1) */
  threshold?: number;
  /** Additional className */
  className?: string;
  /** Additional style */
  style?: CSSProperties;
  /** Whether to trigger only once */
  once?: boolean;
  /** HTML tag to render */
  as?: React.ElementType;
}

export function RevealOnScroll({
  children,
  direction = 'up',
  delay = 0,
  duration = 600,
  threshold = 0.15,
  className = '',
  style,
  once = true,
  as: Tag = 'div',
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once, prefersReducedMotion]);

  const getInitialTransform = (): string => {
    if (prefersReducedMotion) return 'none';
    switch (direction) {
      case 'up': return 'translateY(32px)';
      case 'down': return 'translateY(-32px)';
      case 'left': return 'translateX(32px)';
      case 'right': return 'translateX(-32px)';
      case 'none': return 'none';
    }
  };

  const revealStyle: CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'none' : getInitialTransform(),
    transition: prefersReducedMotion
      ? 'none'
      : `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
    willChange: isVisible ? 'auto' : 'opacity, transform',
    ...style,
  };

  return (
    <Tag ref={ref} className={className} style={revealStyle}>
      {children}
    </Tag>
  );
}
