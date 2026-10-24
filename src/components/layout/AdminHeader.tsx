'use client';

import React from 'react';
import Link from 'next/link';
import { IconGlobe, IconLock, IconUsers } from '../icons';

export function AdminHeader() {
  return (
    <header
      style={{
        height: '4rem',
        backgroundColor: 'var(--color-bg-surface)',
        borderBlockEnd: '1px solid var(--color-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingInline: 'var(--space-6)',
        position: 'sticky',
        top: 0,
        zIndex: 800,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-brand-primary-light)',
            color: 'var(--color-brand-primary)',
          }}
        >
          وضع النموذج التجريبي / Prototype Mode
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <Link
          href="/ar"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-secondary)',
            textDecoration: 'none',
          }}
        >
          <IconGlobe size={16} />
          <span>الموقع العام (العربية)</span>
        </Link>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            paddingInlineStart: 'var(--space-3)',
            borderInlineStart: '1px solid var(--color-border-subtle)',
          }}
        >
          <div
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              backgroundColor: 'var(--color-brand-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
            }}
          >
            SA
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              مهند حسن (تجريبي)
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
              SUPER_ADMIN
            </span>
          </div>
        </div>

        <Link
          href="/admin/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.35rem 0.6rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border-strong)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-secondary)',
            textDecoration: 'none',
          }}
        >
          <IconLock size={14} />
          <span>تبديل الحساب / خروج</span>
        </Link>
      </div>
    </header>
  );
}
