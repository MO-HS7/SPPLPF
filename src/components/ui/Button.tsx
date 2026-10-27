import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'outline-white' | 'ghost' | 'ghost-white' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, icon, children, className = '', disabled, style, ...props }, ref) => {
    const getPadding = () => {
      switch (size) {
        case 'sm': return '0.375rem 0.75rem';
        case 'lg': return '0.75rem 1.5rem';
        default: return '0.55rem 1.125rem';
      }
    };

    const getFontSize = () => {
      switch (size) {
        case 'sm': return 'var(--text-xs)';
        case 'lg': return 'var(--text-base)';
        default: return 'var(--text-sm)';
      }
    };

    const getMinHeight = () => {
      switch (size) {
        case 'sm': return '2rem';
        case 'lg': return '3rem';
        default: return '2.5rem';
      }
    };

    const getColors = () => {
      switch (variant) {
        case 'primary':
          return {
            bg: 'var(--color-brand-primary)',
            color: '#ffffff',
            border: '1px solid transparent',
            shadow: 'var(--shadow-sm)',
          };
        case 'secondary':
          return {
            bg: 'var(--color-brand-secondary)',
            color: '#ffffff',
            border: '1px solid transparent',
            shadow: 'var(--shadow-sm)',
          };
        case 'accent':
          return {
            bg: 'var(--color-brand-accent)',
            color: '#ffffff',
            border: '1px solid transparent',
            shadow: 'var(--shadow-gold)',
          };
        case 'outline':
          return {
            bg: 'transparent',
            color: 'var(--color-brand-primary)',
            border: '1.5px solid var(--color-border-strong)',
            shadow: 'none',
          };
        case 'outline-white':
          return {
            bg: 'rgba(255, 255, 255, 0.06)',
            color: '#ffffff',
            border: '1.5px solid rgba(255, 255, 255, 0.4)',
            shadow: 'none',
          };
        case 'ghost':
          return {
            bg: 'transparent',
            color: 'var(--color-text-secondary)',
            border: '1px solid transparent',
            shadow: 'none',
          };
        case 'ghost-white':
          return {
            bg: 'transparent',
            color: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid transparent',
            shadow: 'none',
          };
        case 'danger':
          return {
            bg: 'var(--color-brand-danger)',
            color: '#ffffff',
            border: '1px solid transparent',
            shadow: 'var(--shadow-sm)',
          };
        default:
          return {
            bg: 'var(--color-brand-primary)',
            color: '#ffffff',
            border: '1px solid transparent',
            shadow: 'var(--shadow-sm)',
          };
      }
    };

    const colors = getColors();

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
          border: colors.border,
          backgroundColor: colors.bg,
          color: colors.color,
          boxShadow: colors.shadow,
          padding: getPadding(),
          fontSize: getFontSize(),
          minHeight: getMinHeight(),
          gap: '0.45rem',
          lineHeight: 1.25,
          letterSpacing: '0.01em',
          ...style,
        }}
        className={`btn btn-${variant} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span
            style={{
              display: 'inline-block',
              width: '1rem',
              height: '1rem',
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        ) : icon ? (
          <span className="btn-arrow" style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>
        ) : null}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
