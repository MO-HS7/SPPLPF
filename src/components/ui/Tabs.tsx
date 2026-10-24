'use client';

import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
  return (
    <div
      role="tablist"
      style={{
        display: 'flex',
        borderBlockEnd: '1px solid var(--color-border-subtle)',
        gap: 'var(--space-2)',
        overflowX: 'auto',
        marginBlockEnd: 'var(--space-6)',
      }}
      className={`tabs-nav ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            style={{
              padding: 'var(--space-3) var(--space-4)',
              background: 'transparent',
              border: 'none',
              borderBlockEnd: isActive ? '3px solid var(--color-brand-primary)' : '3px solid transparent',
              color: isActive ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
              fontWeight: isActive ? 700 : 500,
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              whiteSpace: 'nowrap',
              transition: 'all var(--transition-fast)',
            }}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  padding: '0.125rem 0.375rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive ? 'var(--color-brand-primary)' : 'var(--color-bg-muted)',
                  color: isActive ? '#ffffff' : 'var(--color-text-secondary)',
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
