'use client';

import React from 'react';
import { RevealOnScroll } from '../motion/RevealOnScroll';
import { AnimatedCounter } from '../motion/AnimatedCounter';
import { YemenGovernorateMap } from '../map/YemenGovernorateMap';
import type { Locale } from '../../lib/i18n';

/**
 * Client-side wrappers to enable motion/interaction features
 * in the server-rendered homepage. These thin wrappers keep
 * the main page.tsx as a Server Component for SEO/performance.
 */

// ─── Section Reveal Wrapper ───
export function SectionReveal({
  children,
  direction = 'up',
  delay = 0,
  className = '',
  style,
}: {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <RevealOnScroll direction={direction} delay={delay} className={className} style={style}>
      {children}
    </RevealOnScroll>
  );
}

// ─── Animated Metric Counter ───
export function MetricCounter({
  value,
  prefix = '',
  suffix = '',
  locale = 'en',
  style,
  className = '',
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  locale?: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <AnimatedCounter
      value={value}
      prefix={prefix}
      suffix={suffix}
      locale={locale}
      duration={2000}
      style={style}
      className={className}
    />
  );
}

// ─── Yemen Map Wrapper ───
export function YemenMapSection({ locale, style }: { locale: Locale; style?: React.CSSProperties }) {
  return <YemenGovernorateMap locale={locale} style={style} />;
}

// ─── Hero Entrance Animation ───
export function HeroEntrance({
  children,
  delay = 0,
  className = '',
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <RevealOnScroll direction="up" delay={delay} duration={800} threshold={0.05} className={className} style={style}>
      {children}
    </RevealOnScroll>
  );
}

// ─── Staggered Card Grid ───
export function StaggeredReveal({
  children,
  index = 0,
  className = '',
  style,
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <RevealOnScroll direction="up" delay={index * 100} duration={600} className={className} style={style}>
      {children}
    </RevealOnScroll>
  );
}
