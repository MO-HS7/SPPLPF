'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '../../lib/i18n';
import { getDictionary, switchLocalePath } from '../../lib/i18n';
import { IconChevronDown, IconGlobe, IconLock, IconMenu, IconScale, IconX } from '../icons';

export interface PublicHeaderProps {
  locale: Locale;
}

export function PublicHeader({ locale }: PublicHeaderProps) {
  const dict = getDictionary(locale);
  const pathname = usePathname() || `/${locale}`;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [mediaDropdownOpen, setMediaDropdownOpen] = useState(false);

  const targetLocale: Locale = locale === 'en' ? 'ar' : 'en';
  const targetPath = switchLocalePath(pathname, targetLocale);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
    setMediaDropdownOpen(false);
  };

  return (
    <header
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderBlockEnd: '1px solid var(--color-border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 900,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'var(--header-height)' }}>
        {/* Brand Logo & Name */}
        <Link
          href={`/${locale}`}
          onClick={closeMenus}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '2.75rem',
              height: '2.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-brand-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(15, 76, 129, 0.3)',
            }}
          >
            <IconScale size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontWeight: 800,
                fontSize: 'var(--text-base)',
                color: 'var(--color-brand-primary)',
                lineHeight: 1.2,
              }}
            >
              {locale === 'ar' ? 'مؤسسة تعزيز السلام والحماية القانونية' : 'Peace, Protection and Law Foundation'}
            </span>
            <span
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-brand-accent)',
                fontWeight: 600,
                letterSpacing: locale === 'en' ? '0.05em' : 'normal',
              }}
            >
              {locale === 'ar' ? 'حماية — SPPLPF' : 'SPPLPF — Himaaya Foundation'}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: 'var(--space-1)',
          }}
          className="desktop-nav"
        >
          <Link
            href={`/${locale}`}
            style={{
              padding: '0.5rem 0.75rem',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: pathname === `/${locale}` ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            {dict.nav.home}
          </Link>

          {/* About Menu Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setAboutDropdownOpen(!aboutDropdownOpen);
                setMediaDropdownOpen(false);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.5rem 0.75rem',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: pathname.includes('/about') ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <span>{dict.nav.about}</span>
              <IconChevronDown size={16} />
            </button>
            {aboutDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  insetInlineStart: 0,
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  minWidth: '200px',
                  padding: 'var(--space-2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-1)',
                  zIndex: 950,
                }}
              >
                <Link href={`/${locale}/about`} onClick={closeMenus} style={{ padding: '0.5rem 0.75rem', fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-sm)' }}>
                  {dict.nav.aboutOverview}
                </Link>
                <Link href={`/${locale}/about/values`} onClick={closeMenus} style={{ padding: '0.5rem 0.75rem', fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-sm)' }}>
                  {dict.nav.values}
                </Link>
                <Link href={`/${locale}/about/goals`} onClick={closeMenus} style={{ padding: '0.5rem 0.75rem', fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-sm)' }}>
                  {dict.nav.goals}
                </Link>
                <Link href={`/${locale}/about/milestones`} onClick={closeMenus} style={{ padding: '0.5rem 0.75rem', fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-sm)' }}>
                  {dict.nav.milestones}
                </Link>
              </div>
            )}
          </div>

          <Link
            href={`/${locale}/programs`}
            style={{
              padding: '0.5rem 0.75rem',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: pathname.includes('/programs') ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            {dict.nav.programs}
          </Link>

          {/* Media Center Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setMediaDropdownOpen(!mediaDropdownOpen);
                setAboutDropdownOpen(false);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.5rem 0.75rem',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: (pathname.includes('/news') || pathname.includes('/activities') || pathname.includes('/stories')) ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <span>{locale === 'ar' ? 'المركز الإعلامي' : 'Media Center'}</span>
              <IconChevronDown size={16} />
            </button>
            {mediaDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  insetInlineStart: 0,
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  minWidth: '200px',
                  padding: 'var(--space-2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-1)',
                  zIndex: 950,
                }}
              >
                <Link href={`/${locale}/news`} onClick={closeMenus} style={{ padding: '0.5rem 0.75rem', fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-sm)' }}>
                  {dict.nav.news}
                </Link>
                <Link href={`/${locale}/activities`} onClick={closeMenus} style={{ padding: '0.5rem 0.75rem', fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-sm)' }}>
                  {dict.nav.activities}
                </Link>
                <Link href={`/${locale}/stories`} onClick={closeMenus} style={{ padding: '0.5rem 0.75rem', fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-sm)' }}>
                  {dict.nav.stories}
                </Link>
              </div>
            )}
          </div>

          <Link
            href={`/${locale}/publications`}
            style={{
              padding: '0.5rem 0.75rem',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: pathname.includes('/publications') ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            {dict.nav.publications}
          </Link>

          <Link
            href={`/${locale}/presence`}
            style={{
              padding: '0.5rem 0.75rem',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: pathname.includes('/presence') ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            {dict.nav.presence}
          </Link>

          <Link
            href={`/${locale}/contact`}
            style={{
              padding: '0.5rem 0.75rem',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: pathname.includes('/contact') ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            {dict.nav.contact}
          </Link>
        </nav>

        {/* Right Action Icons: Language Switcher & Admin Preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Link
            href={targetPath}
            title={dict.common.changeLang}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.375rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-strong)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              color: 'var(--color-brand-primary)',
            }}
          >
            <IconGlobe size={16} />
            <span>{dict.common.changeLang}</span>
          </Link>

          <Link
            href="/admin/overview"
            title={dict.nav.adminPreview}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.375rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-subtle)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
            }}
          >
            <IconLock size={14} />
            <span className="admin-btn-label">{locale === 'ar' ? 'الإدارة' : 'Admin'}</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            style={{
              display: 'inline-flex',
              padding: '0.5rem',
              background: 'transparent',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              color: 'var(--color-text-primary)',
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <IconX size={22} /> : <IconMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            borderBlockStart: '1px solid var(--color-border-subtle)',
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
          }}
        >
          <Link href={`/${locale}`} onClick={closeMenus} style={{ padding: '0.5rem', fontWeight: 600 }}>
            {dict.nav.home}
          </Link>
          <div style={{ paddingInlineStart: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 700 }}>{dict.nav.about}</span>
            <Link href={`/${locale}/about`} onClick={closeMenus} style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--text-sm)' }}>
              {dict.nav.aboutOverview}
            </Link>
            <Link href={`/${locale}/about/values`} onClick={closeMenus} style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--text-sm)' }}>
              {dict.nav.values}
            </Link>
            <Link href={`/${locale}/about/goals`} onClick={closeMenus} style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--text-sm)' }}>
              {dict.nav.goals}
            </Link>
            <Link href={`/${locale}/about/milestones`} onClick={closeMenus} style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--text-sm)' }}>
              {dict.nav.milestones}
            </Link>
          </div>
          <Link href={`/${locale}/programs`} onClick={closeMenus} style={{ padding: '0.5rem', fontWeight: 600 }}>
            {dict.nav.programs}
          </Link>
          <div style={{ paddingInlineStart: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 700 }}>
              {locale === 'ar' ? 'المركز الإعلامي' : 'Media Center'}
            </span>
            <Link href={`/${locale}/news`} onClick={closeMenus} style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--text-sm)' }}>
              {dict.nav.news}
            </Link>
            <Link href={`/${locale}/activities`} onClick={closeMenus} style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--text-sm)' }}>
              {dict.nav.activities}
            </Link>
            <Link href={`/${locale}/stories`} onClick={closeMenus} style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--text-sm)' }}>
              {dict.nav.stories}
            </Link>
          </div>
          <Link href={`/${locale}/publications`} onClick={closeMenus} style={{ padding: '0.5rem', fontWeight: 600 }}>
            {dict.nav.publications}
          </Link>
          <Link href={`/${locale}/presence`} onClick={closeMenus} style={{ padding: '0.5rem', fontWeight: 600 }}>
            {dict.nav.presence}
          </Link>
          <Link href={`/${locale}/contact`} onClick={closeMenus} style={{ padding: '0.5rem', fontWeight: 600 }}>
            {dict.nav.contact}
          </Link>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
