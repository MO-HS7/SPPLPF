import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ error = false, children, className = '', style, ...props }, ref) => {
    return (
      <select
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
          cursor: 'pointer',
          transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
          ...style,
        }}
        className={`select-control ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';
