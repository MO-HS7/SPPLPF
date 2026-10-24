import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, className = '', style, ...props }, ref) => {
    return (
      <input
        ref={ref}
        style={{
          width: '100%',
          padding: '0.625rem 0.875rem',
          fontSize: 'var(--text-sm)',
          borderRadius: 'var(--radius-md)',
          border: error ? '1px solid var(--color-brand-danger)' : '1px solid var(--color-border-strong)',
          backgroundColor: 'var(--color-bg-surface)',
          color: 'var(--color-text-primary)',
          outline: 'none',
          transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
          ...style,
        }}
        className={`input-control ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
