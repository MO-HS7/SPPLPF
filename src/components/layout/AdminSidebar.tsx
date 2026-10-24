'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconCalendar,
  IconCheck,
  IconEdit,
  IconFileText,
  IconGlobe,
  IconInfo,
  IconLock,
  IconMail,
  IconPlus,
  IconScale,
  IconShield,
  IconUsers,
} from '../icons';

export function AdminSidebar() {
  const pathname = usePathname() || '/admin/overview';

  const navItems = [
    { label: 'نظرة عامة / Overview', href: '/admin/overview', icon: <IconScale size={18} /> },
    { label: 'إدارة المحتوى / Content', href: '/admin/content', icon: <IconEdit size={18} /> },
    { label: 'طابور المراجعة / Workflow', href: '/admin/workflow', icon: <IconCheck size={18} /> },
    { label: 'البرامج والمشاريع / Programs', href: '/admin/programs', icon: <IconCalendar size={18} /> },
    { label: 'الإصدارات والتقارير / Publications', href: '/admin/publications', icon: <IconFileText size={18} /> },
    { label: 'مكتبة الوسائط / Media', href: '/admin/media', icon: <IconPlus size={18} /> },
    { label: 'الاستفسارات / Inquiries', href: '/admin/inquiries', icon: <IconMail size={18} /> },
    { label: 'المستخدمون والأدوار / Users & RBAC', href: '/admin/users', icon: <IconUsers size={18} /> },
    { label: 'سجل التدقيق / Audit Logs', href: '/admin/audit-logs', icon: <IconShield size={18} /> },
    { label: 'الإعدادات / Settings', href: '/admin/settings', icon: <IconLock size={18} /> },
  ];

  return (
    <aside
      style={{
        width: 'var(--admin-sidebar-width)',
        backgroundColor: 'var(--color-navy-900)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        borderInlineEnd: '1px solid rgba(255, 255, 255, 0.1)',
        flexShrink: 0,
        minHeight: '100vh',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: 'var(--space-6) var(--space-4)',
          borderBlockEnd: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
        }}
      >
        <div
          style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-brand-secondary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconShield size={22} />
        </div>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: 'var(--text-sm)', fontWeight: 800, margin: 0 }}>
            SPPLPF Admin
          </h4>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-accent)', fontWeight: 600 }}>
            لوحة الإدارة (معاينة)
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav
        style={{
          padding: 'var(--space-4) var(--space-2)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-1)',
          flex: '1 1 auto',
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin/overview' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-xs)',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#ffffff' : '#cbd5e1',
                backgroundColor: isActive ? 'var(--color-brand-primary)' : 'transparent',
                transition: 'all var(--transition-fast)',
              }}
            >
              <span style={{ color: isActive ? '#ffffff' : 'var(--color-brand-secondary)' }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer link to public site */}
      <div
        style={{
          padding: 'var(--space-4)',
          borderBlockStart: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Link
          href="/ar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: '#f8fafc',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <IconGlobe size={16} />
          <span>العودة إلى الموقع العام / Public Site</span>
        </Link>
      </div>
    </aside>
  );
}
