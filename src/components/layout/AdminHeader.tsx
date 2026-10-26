'use client';

import React from 'react';
import Link from 'next/link';
import { useDemoStore } from '../../lib/demo/use-demo-store';
import { IconGlobe, IconLock, IconUsers, IconShield } from '../icons';
import { ThemeToggle } from '../ui/ThemeToggle';

export function AdminHeader() {
  const store = useDemoStore();
  const currentUser = store.getUsers()[0];

  return (
    <header
      style={{
        height: '4.25rem',
        backgroundColor: 'var(--color-bg-surface)',
        borderBlockEnd: '1px solid var(--color-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingInline: 'var(--space-6)',
        position: 'sticky',
        top: 0,
        zIndex: 800,
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {/* Left: Prototype Mode Tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-brand-primary-light)',
            color: 'var(--color-brand-primary)',
            border: '1px solid rgba(15, 50, 90, 0.15)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <IconShield size={12} style={{ color: 'var(--color-brand-primary)' }} />
          <span>بيئة النموذج التجريبي التحريري / Editorial Demo Environment</span>
        </span>
      </div>

      {/* Right: Theme Toggle + Public link + User Avatar & Persona */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <ThemeToggle locale="ar" />

        <Link
          href="/ar"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            textDecoration: 'none',
          }}
          className="admin-public-link"
        >
          <IconGlobe size={15} style={{ color: 'var(--color-brand-secondary)' }} />
          <span>الموقع العام</span>
        </Link>

        {/* Current Demo Persona Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            paddingInlineStart: '0.85rem',
            borderInlineStart: '1px solid var(--color-border-subtle)',
          }}
        >
          <div
            style={{
              width: '2.2rem',
              height: '2.2rem',
              borderRadius: '50%',
              backgroundColor: 'var(--color-brand-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8125rem',
              fontWeight: 700,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {currentUser?.name ? currentUser.name.substring(0, 2) : 'SA'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
              {currentUser?.name || 'مهند حسن'}
            </span>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--color-brand-secondary)',
                letterSpacing: '0.03em',
              }}
            >
              {currentUser?.role || 'SUPER_ADMIN'}
            </span>
          </div>
        </div>

        {/* Persona Switch / Exit */}
        <Link
          href="/admin/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.65rem',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--color-border-strong)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            textDecoration: 'none',
            backgroundColor: 'var(--color-bg-surface)',
          }}
        >
          <IconLock size={13} />
          <span>تبديل الحساب</span>
        </Link>
      </div>
    </header>
  );
}
