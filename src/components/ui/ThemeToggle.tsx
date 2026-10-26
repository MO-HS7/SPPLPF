'use client';

import React from 'react';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { IconMoon, IconSun } from '../icons';

export interface ThemeToggleProps {
  locale?: 'ar' | 'en';
  className?: string;
  style?: React.CSSProperties;
}

export function ThemeToggle({ locale = 'ar', className = '', style }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const label = isDark
    ? (locale === 'ar' ? 'التبديل إلى الوضع النهاري (المضيء)' : 'Switch to Light Mode')
    : (locale === 'ar' ? 'التبديل إلى الوضع الليلي (الداكن)' : 'Switch to Dark Mode');

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`theme-toggle-btn ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2.35rem',
        height: '2.35rem',
        borderRadius: 'var(--radius-md)',
        border: '1.5px solid var(--color-border-strong)',
        backgroundColor: 'var(--color-bg-surface)',
        color: isDark ? 'var(--color-gold-500)' : 'var(--color-brand-primary)',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        flexShrink: 0,
        ...style,
      }}
    >
      {isDark ? (
        <IconSun size={17} aria-hidden="true" />
      ) : (
        <IconMoon size={17} aria-hidden="true" />
      )}
    </button>
  );
}
