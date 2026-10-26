'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDemoStore } from '../../lib/demo/use-demo-store';
import {
  IconCalendar,
  IconCheckCircle,
  IconEdit,
  IconFileText,
  IconGlobe,
  IconImage,
  IconMail,
  IconScale,
  IconSettings,
  IconShield,
  IconUsers,
  IconBookOpen,
  IconBarChart,
} from '../icons';

export function AdminSidebar() {
  const pathname = usePathname() || '/admin/overview';
  const store = useDemoStore();

  const inReviewCount = store.getContentItems().filter((c) => c.status === 'IN_REVIEW').length;
  const pendingInquiriesCount = store.getInquiries().filter((i) => i.status === 'NEW').length;

  const sections = [
    {
      title: 'التحرير والمحتوى / Content & Editorial',
      items: [
        { label: 'نظرة عامة / Overview', href: '/admin/overview', icon: <IconBarChart size={18} /> },
        { label: 'إدارة المحتوى / Content', href: '/admin/content', icon: <IconEdit size={18} /> },
        {
          label: 'طابور المراجعة / Review Queue',
          href: '/admin/workflow',
          icon: <IconCheckCircle size={18} />,
          badge: inReviewCount > 0 ? inReviewCount : undefined,
          badgeColor: 'var(--color-brand-accent)',
        },
        { label: 'مكتبة الوسائط / Media', href: '/admin/media', icon: <IconImage size={18} /> },
      ],
    },
    {
      title: 'السجلات والاتصال / Catalogues & Outreach',
      items: [
        { label: 'البرامج والمشاريع / Programs', href: '/admin/programs', icon: <IconCalendar size={18} /> },
        { label: 'الإصدارات والتقارير / Publications', href: '/admin/publications', icon: <IconBookOpen size={18} /> },
        {
          label: 'الاستفسارات / Inquiries',
          href: '/admin/inquiries',
          icon: <IconMail size={18} />,
          badge: pendingInquiriesCount > 0 ? pendingInquiriesCount : undefined,
          badgeColor: 'var(--color-brand-secondary)',
        },
      ],
    },
    {
      title: 'الحوكمة والنظام / Governance & System',
      items: [
        { label: 'المستخدمون والأدوار / Users & RBAC', href: '/admin/users', icon: <IconUsers size={18} /> },
        { label: 'سجل التدقيق / Audit Logs', href: '/admin/audit-logs', icon: <IconShield size={18} /> },
        { label: 'الإعدادات / Settings', href: '/admin/settings', icon: <IconSettings size={18} /> },
      ],
    },
  ];

  return (
    <aside
      style={{
        width: 'var(--admin-sidebar-width)',
        backgroundColor: '#0a1626',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        borderInlineEnd: '1px solid rgba(255, 255, 255, 0.08)',
        flexShrink: 0,
        minHeight: '100vh',
      }}
      aria-label="Admin Navigation Sidebar"
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '1.25rem 1.25rem',
          borderBlockEnd: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            width: '2.4rem',
            height: '2.4rem',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--color-navy-950) 0%, var(--color-navy-800) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
            flexShrink: 0,
          }}
          aria-label="علامة تعريفية مؤقتة للمؤسسة"
        >
          <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-gold-500)', lineHeight: 1 }}>SP</span>
          <span style={{ fontSize: '0.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1, marginTop: '1px' }}>LPF</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 800, margin: 0, lineHeight: 1.25 }}>
            مؤسسة حماية القانون
          </h2>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-gold-500)', fontWeight: 600 }} title="مؤسسة حماية القانون وتعزيز السلم الاجتماعي">
            وتعزيز السلم الاجتماعي (SPPLPF)
          </span>
        </div>
      </div>

      {/* Grouped Navigation Sections */}
      <nav
        style={{
          padding: '1rem 0.65rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          flex: '1 1 auto',
          overflowY: 'auto',
        }}
      >
        {sections.map((section, idx) => (
          <div key={idx}>
            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                paddingInline: '0.65rem',
                marginBlockEnd: '0.4rem',
              }}
            >
              {section.title}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href || (item.href !== '/admin/overview' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8125rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#ffffff' : '#94a3b8',
                      backgroundColor: isActive ? 'rgba(2, 132, 199, 0.16)' : 'transparent',
                      border: isActive ? '1px solid rgba(2, 132, 199, 0.35)' : '1px solid transparent',
                      transition: 'all var(--transition-fast)',
                      textDecoration: 'none',
                    }}
                    className="sidebar-link"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ color: isActive ? '#38bdf8' : '#64748b', display: 'flex', alignItems: 'center' }}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        style={{
                          backgroundColor: item.badgeColor || 'var(--color-brand-secondary)',
                          color: '#ffffff',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.1rem 0.45rem',
                          borderRadius: 'var(--radius-full)',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Return Link to Public Site */}
      <div
        style={{
          padding: '0.85rem 0.85rem',
          borderBlockStart: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Link
          href="/ar"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.55rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#f8fafc',
            fontSize: '0.8125rem',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all var(--transition-fast)',
          }}
          className="sidebar-public-btn"
        >
          <IconGlobe size={15} style={{ color: '#38bdf8' }} />
          <span>العودة للموقع العام / Public Site</span>
        </Link>
      </div>
    </aside>
  );
}
