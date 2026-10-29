'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDemoStore } from '../../lib/demo/use-demo-store';
import { IconGlobe, IconLock, IconMenu, IconShield } from '../icons';
import { ThemeToggle } from '../ui/ThemeToggle';

const ROUTE_LABELS: Record<string, string> = {
  '/admin/overview': 'نظرة عامة / Overview',
  '/admin/content': 'إدارة المحتوى / Content',
  '/admin/content/new': 'مادة جديدة / New Content',
  '/admin/workflow': 'طابور المراجعة / Review Queue',
  '/admin/programs': 'البرامج والمشاريع / Programs',
  '/admin/publications': 'الإصدارات والتقارير / Publications',
  '/admin/media': 'مكتبة الوسائط / Media',
  '/admin/inquiries': 'الاستفسارات / Inquiries',
  '/admin/users': 'المستخدمون والأدوار / Users & RBAC',
  '/admin/audit-logs': 'سجل التدقيق / Audit Logs',
  '/admin/settings': 'الإعدادات / Settings',
};

export function AdminHeader({ onOpenMobileMenu }: { onOpenMobileMenu?: () => void }) {
  const pathname = usePathname() || '/admin/overview';
  const store = useDemoStore();
  const currentUser = store.getUsers()[0];

  const currentSectionLabel =
    ROUTE_LABELS[pathname] ||
    (pathname.startsWith('/admin/content/') ? 'تحرير مادة / Edit Content' : 'لوحة الإدارة / Dashboard');

  return (
    <header
      style={{
        minHeight: '4.25rem',
        backgroundColor: 'var(--color-bg-surface)',
        borderBlockEnd: '1px solid var(--color-border-subtle)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingInline: 'clamp(1rem, 2.5vw, 1.5rem)',
        paddingBlock: '0.5rem',
        gap: '0.75rem',
        position: 'sticky',
        top: 0,
        zIndex: 800,
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {/* Left: Mobile Drawer Trigger + Breadcrumbs + Prototype Mode Tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="show-mobile-only"
            aria-label="فتح قائمة الإدارة"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-default)',
              backgroundColor: 'var(--color-bg-elevated)',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
            }}
          >
            <IconMenu size={18} />
          </button>
        )}

        <nav aria-label="Admin Breadcrumbs" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}>
          <Link href="/admin/overview" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontWeight: 600 }}>
            لوحة الإدارة
          </Link>
          <span style={{ color: 'var(--color-border-strong)' }}>/</span>
          <span style={{ color: 'var(--color-brand-primary)', fontWeight: 700 }}>
            {currentSectionLabel}
          </span>
        </nav>

        <span
          className="hidden-mobile"
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '0.18rem 0.55rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-brand-primary-light)',
            color: 'var(--color-brand-primary)',
            border: '1px solid var(--color-border-subtle)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <IconShield size={12} style={{ color: 'var(--color-brand-primary)' }} />
          <span>بيئة النموذج التجريبي التحريري</span>
        </span>
      </div>

      {/* Right: Theme Toggle + Public link + User Avatar & Persona */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
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
          className="hidden-mobile"
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
              width: '2.1rem',
              height: '2.1rem',
              borderRadius: '50%',
              backgroundColor: 'var(--color-brand-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
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
