import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
}

export function Badge({ variant = 'neutral', size = 'md', children, className = '', ...props }: BadgeProps) {
  const variantStyles: Record<string, { bg: string; text: string; border: string }> = {
    primary: { bg: 'var(--color-brand-primary-light)', text: 'var(--color-brand-primary)', border: 'rgba(15, 76, 129, 0.2)' },
    secondary: { bg: 'var(--color-brand-secondary-light)', text: 'var(--color-brand-secondary-hover)', border: 'rgba(0, 159, 227, 0.2)' },
    accent: { bg: 'var(--color-brand-accent-light)', text: 'var(--color-brand-accent-hover)', border: 'rgba(217, 119, 6, 0.2)' },
    success: { bg: 'var(--color-brand-success-light)', text: 'var(--color-brand-success-hover)', border: 'rgba(16, 185, 129, 0.2)' },
    warning: { bg: 'var(--color-brand-warning-light)', text: '#b45309', border: 'rgba(245, 158, 11, 0.2)' },
    danger: { bg: 'var(--color-brand-danger-light)', text: 'var(--color-brand-danger)', border: 'rgba(224, 58, 62, 0.2)' },
    neutral: { bg: 'var(--color-bg-elevated)', text: 'var(--color-text-secondary)', border: 'var(--color-border-subtle)' },
  };

  const styleConfig = variantStyles[variant] || variantStyles.neutral;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        backgroundColor: styleConfig.bg,
        color: styleConfig.text,
        border: `1px solid ${styleConfig.border}`,
        padding: size === 'sm' ? '0.125rem 0.5rem' : '0.25rem 0.75rem',
        fontSize: size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)',
        lineHeight: 1.25,
      }}
      className={className}
      {...props}
    >
      {children}
    </span>
  );
}
