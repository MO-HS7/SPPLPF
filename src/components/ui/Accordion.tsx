'use client';

import React, { useState } from 'react';
import { IconChevronDown } from '../icons';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({ items, defaultOpenId, allowMultiple = false, className = '' }: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }} className={className}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <button
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              style={{
                width: '100%',
                padding: 'var(--space-4) var(--space-6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'transparent',
                border: 'none',
                textAlign: 'inherit',
                cursor: 'pointer',
                fontWeight: 600,
                color: 'var(--color-brand-primary)',
                fontSize: 'var(--text-base)',
              }}
            >
              <span>{item.title}</span>
              <span
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform var(--transition-fast)',
                  display: 'flex',
                  color: 'var(--color-text-muted)',
                }}
              >
                <IconChevronDown size={20} />
              </span>
            </button>
            {isOpen && (
              <div
                style={{
                  padding: 'var(--space-4) var(--space-6)',
                  borderBlockStart: '1px solid var(--color-border-subtle)',
                  backgroundColor: 'var(--color-bg-canvas)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                }}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
