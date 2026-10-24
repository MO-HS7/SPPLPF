import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error = false, rows = 4, className = '', style, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        style={{
          width: '100%',
          padding: '0.625rem 0.875rem',
          fontSize: 'var(--text-sm)',
          borderRadius: 'var(--radius-md)',
          border: error ? '1px solid var(--color-brand-danger)' : '1px solid var(--color-border-strong)',
          backgroundColor: 'var(--color-bg-surface)',
          color: 'var(--color-text-primary)',
          outline: 'none',
          resize: 'vertical',
          transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
          ...style,
        }}
        className={`textarea-control ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
