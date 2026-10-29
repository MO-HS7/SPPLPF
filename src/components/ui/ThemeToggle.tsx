'use client';

import React from 'react';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { IconMoon, IconSun } from '../icons';

export interface ThemeToggleProps {
  locale?: 'ar' | 'en';
  inverted?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function ThemeToggle({ locale = 'ar', inverted = false, className = '', style }: ThemeToggleProps) {
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
        width: '2.25rem',
        height: '2.25rem',
        borderRadius: 'var(--radius-md)',
        border: inverted ? '1.5px solid rgba(255, 255, 255, 0.3)' : '1.5px solid var(--color-border-strong)',
        backgroundColor: inverted ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-bg-surface)',
        color: inverted ? '#fbbf24' : isDark ? 'var(--color-gold-500)' : 'var(--color-brand-primary)',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        flexShrink: 0,
        backdropFilter: inverted ? 'blur(8px)' : 'none',
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
