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
        background: 'linear-gradient(180deg, var(--color-bg-subtle) 0%, var(--color-bg-surface) 100%)',
        borderBlockEnd: '1px solid var(--color-border-subtle)',
        paddingBlock: 'clamp(2rem, 3.5vw, 3rem)',
        marginBlockEnd: 'clamp(1.5rem, 3vw, 2.5rem)',
      }}
    >
      <div className="container">
        {breadcrumbs && <div style={{ marginBlockEnd: 'var(--space-3)' }}>{breadcrumbs}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
          <div style={{ maxWidth: '820px' }}>
            {badge && <div style={{ marginBlockEnd: 'var(--space-2)' }}>{badge}</div>}
            <h1
              style={{
                fontSize: 'clamp(1.75rem, 1.4rem + 1.2vw, 2.5rem)',
                color: 'var(--color-brand-primary)',
                fontWeight: 800,
                lineHeight: 1.25,
                marginBlockEnd: subtitle ? 'var(--space-2)' : 0,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                style={{
                  fontSize: 'clamp(0.9375rem, 0.9rem + 0.2vw, 1.0625rem)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.65,
                  margin: 0,
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
