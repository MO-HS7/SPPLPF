import React from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
}

export function PageHeader({ title, subtitle, badge, action, breadcrumbs }: PageHeaderProps) {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--color-bg-subtle) 0%, var(--color-bg-surface) 60%, var(--color-bg-canvas) 100%)',
        borderBlockEnd: '1px solid var(--color-border-subtle)',
        paddingBlock: 'clamp(2.25rem, 4vw, 3.5rem)',
        marginBlockEnd: 'clamp(1.75rem, 3.5vw, 2.75rem)',
      }}
    >
      {/* Subtle architectural accent pattern */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          insetBlockStart: '-35%',
          insetInlineEnd: '-5%',
          width: '28rem',
          height: '28rem',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-brand-primary-light) 0%, transparent 70%)',
          opacity: 0.7,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          insetBlockEnd: 0,
          insetInlineStart: 0,
          width: '100%',
          height: '3px',
          background: 'linear-gradient(90deg, var(--color-brand-primary), var(--color-brand-secondary), var(--color-brand-accent), transparent)',
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {breadcrumbs && <div style={{ marginBlockEnd: 'var(--space-3)' }}>{breadcrumbs}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
          <div style={{ maxWidth: '840px' }}>
            {badge && <div style={{ marginBlockEnd: 'var(--space-2)' }}>{badge}</div>}
            <h1
              className="font-display"
              style={{
                fontSize: 'clamp(1.85rem, 1.45rem + 1.4vw, 2.75rem)',
                color: 'var(--color-brand-primary)',
                fontWeight: 800,
                lineHeight: 1.22,
                marginBlockEnd: subtitle ? 'var(--space-3)' : 0,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                style={{
                  fontSize: 'clamp(0.95rem, 0.9rem + 0.25vw, 1.125rem)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.75,
                  margin: 0,
                  maxWidth: '72ch',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {action && <div style={{ display: 'flex', alignItems: 'center' }}>{action}</div>}
        </div>
      </div>
    </div>
  );
}
