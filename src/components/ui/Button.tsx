import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, icon, children, className = '', disabled, ...props }, ref) => {
    const baseStyles = 'display: inline-flex; align-items: center; justify-content: center; font-weight: 600; border-radius: var(--radius-md); transition: all var(--transition-fast); cursor: pointer; border: 1px solid transparent; text-decoration: none;';

    const sizeStyles = {
      sm: 'padding: var(--space-1) var(--space-3); font-size: var(--text-xs); gap: var(--space-1); min-height: 2rem;',
      md: 'padding: var(--space-2) var(--space-4); font-size: var(--text-sm); gap: var(--space-2); min-height: 2.5rem;',
      lg: 'padding: var(--space-3) var(--space-6); font-size: var(--text-base); gap: var(--space-3); min-height: 3rem;',
    }[size];

    const variantStyles = {
      primary: 'background-color: var(--color-brand-primary); color: #ffffff;',
      secondary: 'background-color: var(--color-brand-secondary); color: #ffffff;',
      accent: 'background-color: var(--color-brand-accent); color: #ffffff;',
      outline: 'background-color: transparent; border-color: var(--color-border-strong); color: var(--color-text-primary);',
      ghost: 'background-color: transparent; color: var(--color-text-secondary);',
      danger: 'background-color: var(--color-brand-danger); color: #ffffff;',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          borderRadius: 'var(--radius-md)',
          cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
          opacity: disabled || isLoading ? 0.65 : 1,
          transition: 'all var(--transition-fast)',
          border: variant === 'outline' ? '1px solid var(--color-border-strong)' : '1px solid transparent',
          backgroundColor:
            variant === 'primary' ? 'var(--color-brand-primary)' :
            variant === 'secondary' ? 'var(--color-brand-secondary)' :
            variant === 'accent' ? 'var(--color-brand-accent)' :
            variant === 'danger' ? 'var(--color-brand-danger)' :
            'transparent',
          color:
            variant === 'outline' ? 'var(--color-text-primary)' :
            variant === 'ghost' ? 'var(--color-text-secondary)' :
            '#ffffff',
          padding: size === 'sm' ? '0.375rem 0.75rem' : size === 'lg' ? '0.75rem 1.5rem' : '0.5rem 1rem',
          fontSize: size === 'sm' ? 'var(--text-xs)' : size === 'lg' ? 'var(--text-base)' : 'var(--text-sm)',
          gap: 'var(--space-2)',
        }}
        className={className}
        {...props}
      >
        {isLoading ? (
          <span style={{ display: 'inline-block', width: '1rem', height: '1rem', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        ) : icon ? (
          <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
        ) : null}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
