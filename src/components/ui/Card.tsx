import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function Card({ hoverEffect = false, children, className = '', style, ...props }: CardProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-subtle)',
        boxShadow: 'var(--shadow-sm)',
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        transition: hoverEffect ? 'transform var(--transition-fast), box-shadow var(--transition-fast)' : undefined,
        ...style,
      }}
      className={`card ${hoverEffect ? 'card-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', style }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div style={{ marginBlockEnd: 'var(--space-4)', ...style }} className={className}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', style }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 700,
        color: 'var(--color-brand-primary)',
        marginBlockEnd: 'var(--space-2)',
        ...style,
      }}
      className={className}
    >
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '', style }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div style={{ flex: '1 1 auto', ...style }} className={className}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', style }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        marginBlockStart: 'var(--space-4)',
        paddingBlockStart: 'var(--space-3)',
        borderBlockStart: '1px solid var(--color-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
}
