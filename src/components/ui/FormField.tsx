import React from 'react';

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  id?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  required = false,
  error,
  hint,
  id,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div style={{ marginBlockEnd: 'var(--space-4)' }} className={className}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: 'block',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBlockEnd: 'var(--space-1)',
          }}
        >
          {label}
          {required && (
            <span style={{ color: 'var(--color-brand-danger)', marginInlineStart: 'var(--space-1)' }}>
              *
            </span>
          )}
        </label>
      )}
      {children}
      {hint && !error && (
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBlockStart: 'var(--space-1)' }}>
          {hint}
        </p>
      )}
      {error && (
        <p
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-brand-danger)',
            fontWeight: 600,
            marginBlockStart: 'var(--space-1)',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
