import React from 'react';
import { IconAlertTriangle, IconCheck, IconInfo, IconX } from '../icons';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export function Alert({ variant = 'info', title, children, onClose, className = '' }: AlertProps) {
  const variantStyles = {
    info: {
      bg: 'var(--color-brand-primary-light)',
      border: 'rgba(15, 76, 129, 0.25)',
      text: 'var(--color-brand-primary)',
      icon: <IconInfo size={20} />,
    },
    success: {
      bg: 'var(--color-brand-success-light)',
      border: 'rgba(16, 185, 129, 0.25)',
      text: 'var(--color-brand-success-hover)',
      icon: <IconCheck size={20} />,
    },
    warning: {
      bg: 'var(--color-brand-warning-light)',
      border: 'rgba(245, 158, 11, 0.25)',
      text: '#b45309',
      icon: <IconAlertTriangle size={20} />,
    },
    danger: {
      bg: 'var(--color-brand-danger-light)',
      border: 'rgba(224, 58, 62, 0.25)',
      text: 'var(--color-brand-danger)',
      icon: <IconAlertTriangle size={20} />,
    },
  }[variant];

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: variantStyles.bg,
        border: `1px solid ${variantStyles.border}`,
        color: 'var(--color-text-primary)',
        marginBlockEnd: 'var(--space-4)',
      }}
      className={`alert alert-${variant} ${className}`}
    >
      <div style={{ color: variantStyles.text, flexShrink: 0, marginBlockStart: '0.125rem' }}>
        {variantStyles.icon}
      </div>
      <div style={{ flex: '1 1 auto' }}>
        {title && (
          <h4
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              color: variantStyles.text,
              marginBlockEnd: 'var(--space-1)',
            }}
          >
            {title}
          </h4>
        )}
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          {children}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            padding: 'var(--space-1)',
          }}
        >
          <IconX size={16} />
        </button>
      )}
    </div>
  );
}
