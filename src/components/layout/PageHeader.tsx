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
        backgroundColor: 'var(--color-bg-surface)',
        borderBlockEnd: '1px solid var(--color-border-subtle)',
        paddingBlock: 'var(--space-8)',
        marginBlockEnd: 'var(--space-8)',
      }}
    >
      <div className="container">
        {breadcrumbs && <div style={{ marginBlockEnd: 'var(--space-3)' }}>{breadcrumbs}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
          <div style={{ maxWidth: '800px' }}>
            {badge && <div style={{ marginBlockEnd: 'var(--space-2)' }}>{badge}</div>}
            <h1
              style={{
                fontSize: 'var(--text-3xl)',
                color: 'var(--color-brand-primary)',
                fontWeight: 800,
                marginBlockEnd: subtitle ? 'var(--space-2)' : 0,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
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
