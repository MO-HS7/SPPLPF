import React from 'react';
import { IconInfo } from '../icons';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      style={{
        padding: 'var(--space-12) var(--space-6)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--color-border-strong)',
      }}
      className={className}
    >
      <div
        style={{
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          backgroundColor: 'var(--color-bg-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-muted)',
          marginBlockEnd: 'var(--space-4)',
        }}
      >
        {icon || <IconInfo size={28} />}
      </div>
      <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBlockEnd: 'var(--space-2)' }}>
        {title}
      </h4>
      {description && (
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-muted)',
            maxWidth: '450px',
            marginBlockEnd: action ? 'var(--space-6)' : 0,
          }}
        >
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
