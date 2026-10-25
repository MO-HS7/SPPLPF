'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '../../lib/i18n';
import { getDictionary, switchLocalePath } from '../../lib/i18n';
import {
  IconChevronDown,
  IconGlobe,
  IconLock,
  IconMenu,
  IconScale,
  IconShield,
  IconX,
  IconFileText,
  IconUsers,
  IconHandshake,
  IconBuilding,
  IconBookOpen,
} from '../icons';

export interface PublicHeaderProps {
  locale: Locale;
}

export function PublicHeader({ locale }: PublicHeaderProps) {
  const dict = getDictionary(locale);
  const pathname = usePathname() || `/${locale}`;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'about' | 'programs' | 'media' | null>(null);

  const targetLocale: Locale = locale === 'en' ? 'ar' : 'en';
  const targetPath = switchLocalePath(pathname, targetLocale);

  const headerRef = useRef<HTMLElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on path change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  const toggleDropdown = (name: 'about' | 'programs' | 'media') => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const isAr = locale === 'ar';

  const isHomeActive = pathname === `/${locale}` || pathname === `/${locale}/`;
  const isAboutActive = pathname.startsWith(`/${locale}/about`);
  const isProgramsActive = pathname.startsWith(`/${locale}/programs`);
  const isMediaActive =
    pathname.startsWith(`/${locale}/news`) ||
    pathname.startsWith(`/${locale}/activities`) ||
    pathname.startsWith(`/${locale}/stories`) ||
    pathname.startsWith(`/${locale}/publications`);
  const isPresenceActive = pathname.startsWith(`/${locale}/presence`);
  const isContactActive = pathname.startsWith(`/${locale}/contact`);

  return (
    <header
      ref={headerRef}
      className="glass-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 'var(--header-height)',
        }}
      >
        {/* Brand Emblem & Organization Identity */}
        <Link
          href={`/${locale}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
          }}
          aria-label={isAr ? 'الصفحة الرئيسية لمؤسسة السلام وحماية القانون' : 'SPPLPF Home Page'}
        >
          <div
            style={{
              width: '2.85rem',
              height: '2.85rem',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--color-navy-900) 0%, var(--color-navy-700) 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              flexShrink: 0,
            }}
          >
            <IconScale size={24} style={{ color: '#ffffff' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontWeight: 800,
                fontSize: '1rem',
                color: 'var(--color-brand-primary)',
                lineHeight: 1.25,
                letterSpacing: '-0.01em',
              }}
            >
              {isAr ? 'مؤسسة السلام الاجتماعي وحماية القانون' : 'Social Peace & Protection of Law Foundation'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--color-brand-secondary)',
                  letterSpacing: '0.04em',
                }}
              >
                {isAr ? 'حماية • SPPLPF' : 'SPPLPF • Himaaya'}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>|</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                {isAr ? 'منظمة مجتمعية مستقلة' : 'Independent Foundation'}
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Grouped Navigation (6 Clean Focus Areas) */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
          className="desktop-navigation"
          aria-label="Main Navigation"
        >
          {/* 1. Home Link */}
          <Link
            href={`/${locale}`}
            style={{
              padding: '0.5rem 0.85rem',
              fontSize: '0.9375rem',
              fontWeight: isHomeActive ? 700 : 600,
              color: isHomeActive ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
              backgroundColor: isHomeActive ? 'var(--color-brand-primary-light)' : 'transparent',
              borderRadius: 'var(--radius-md)',
              transition: 'all var(--transition-fast)',
            }}
          >
            {dict.nav.home}
          </Link>

          {/* 2. About Group Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => toggleDropdown('about')}
              aria-expanded={activeDropdown === 'about'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.5rem 0.85rem',
                fontSize: '0.9375rem',
                fontWeight: isAboutActive ? 700 : 600,
                color: isAboutActive ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                backgroundColor: isAboutActive || activeDropdown === 'about' ? 'var(--color-bg-subtle)' : 'transparent',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <span>{dict.nav.about}</span>
              <IconChevronDown
                size={15}
                style={{
                  transform: activeDropdown === 'about' ? 'rotate(180deg)' : 'none',
                  transition: 'transform var(--transition-fast)',
                }}
              />
            </button>

            {activeDropdown === 'about' && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.35rem)',
                  insetInlineStart: 0,
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  minWidth: '220px',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  zIndex: 950,
                  animation: 'fadeIn 150ms ease-out',
                }}
              >
                <Link
                  href={`/${locale}/about`}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                  className="dropdown-item"
                >
                  <IconShield size={16} style={{ color: 'var(--color-brand-secondary)' }} />
                  <span>{dict.nav.aboutOverview}</span>
                </Link>
                <Link
                  href={`/${locale}/about/values`}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                  className="dropdown-item"
                >
                  <IconHandshake size={16} style={{ color: 'var(--color-brand-accent)' }} />
                  <span>{dict.nav.values}</span>
                </Link>
                <Link
                  href={`/${locale}/about/goals`}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                  className="dropdown-item"
                >
                  <IconScale size={16} style={{ color: 'var(--color-brand-primary)' }} />
                  <span>{dict.nav.goals}</span>
                </Link>
                <Link
                  href={`/${locale}/about/milestones`}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                  className="dropdown-item"
                >
                  <IconBookOpen size={16} style={{ color: 'var(--color-brand-secondary)' }} />
                  <span>{dict.nav.milestones}</span>
                </Link>
              </div>
            )}
          </div>

          {/* 3. Programs Link */}
          <Link
            href={`/${locale}/programs`}
            style={{
              padding: '0.5rem 0.85rem',
              fontSize: '0.9375rem',
              fontWeight: isProgramsActive ? 700 : 600,
              color: isProgramsActive ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
              backgroundColor: isProgramsActive ? 'var(--color-brand-primary-light)' : 'transparent',
              borderRadius: 'var(--radius-md)',
              transition: 'all var(--transition-fast)',
            }}
          >
            {dict.nav.programs}
          </Link>

          {/* 4. Media & Impact Center Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => toggleDropdown('media')}
              aria-expanded={activeDropdown === 'media'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.5rem 0.85rem',
                fontSize: '0.9375rem',
                fontWeight: isMediaActive ? 700 : 600,
                color: isMediaActive ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                backgroundColor: isMediaActive || activeDropdown === 'media' ? 'var(--color-bg-subtle)' : 'transparent',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <span>{isAr ? 'المركز الإعلامي' : 'Media Center'}</span>
              <IconChevronDown
                size={15}
                style={{
                  transform: activeDropdown === 'media' ? 'rotate(180deg)' : 'none',
                  transition: 'transform var(--transition-fast)',
                }}
              />
            </button>

            {activeDropdown === 'media' && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.35rem)',
                  insetInlineStart: 0,
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  minWidth: '220px',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  zIndex: 950,
                  animation: 'fadeIn 150ms ease-out',
                }}
              >
                <Link
                  href={`/${locale}/news`}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                  className="dropdown-item"
                >
                  <IconFileText size={16} style={{ color: 'var(--color-brand-secondary)' }} />
                  <span>{dict.nav.news}</span>
                </Link>
                <Link
                  href={`/${locale}/activities`}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                  className="dropdown-item"
                >
                  <IconUsers size={16} style={{ color: 'var(--color-brand-accent)' }} />
                  <span>{dict.nav.activities}</span>
                </Link>
                <Link
                  href={`/${locale}/stories`}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                  className="dropdown-item"
                >
                  <IconHandshake size={16} style={{ color: 'var(--color-brand-primary)' }} />
                  <span>{dict.nav.stories}</span>
                </Link>
                <Link
                  href={`/${locale}/publications`}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                  className="dropdown-item"
                >
                  <IconBookOpen size={16} style={{ color: 'var(--color-brand-secondary)' }} />
                  <span>{dict.nav.publications}</span>
                </Link>
              </div>
            )}
          </div>

          {/* 5. Geographic Presence */}
          <Link
            href={`/${locale}/presence`}
            style={{
              padding: '0.5rem 0.85rem',
              fontSize: '0.9375rem',
              fontWeight: isPresenceActive ? 700 : 600,
              color: isPresenceActive ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
              backgroundColor: isPresenceActive ? 'var(--color-brand-primary-light)' : 'transparent',
              borderRadius: 'var(--radius-md)',
              transition: 'all var(--transition-fast)',
            }}
          >
            {dict.nav.presence}
          </Link>

          {/* 6. Contact Us */}
          <Link
            href={`/${locale}/contact`}
            style={{
              padding: '0.5rem 0.85rem',
              fontSize: '0.9375rem',
              fontWeight: isContactActive ? 700 : 600,
              color: isContactActive ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
              backgroundColor: isContactActive ? 'var(--color-brand-primary-light)' : 'transparent',
              borderRadius: 'var(--radius-md)',
              transition: 'all var(--transition-fast)',
            }}
          >
            {dict.nav.contact}
          </Link>
        </nav>

        {/* Right Actions: Locale Switcher, Admin Demo Entry, Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Language Switcher */}
          <Link
            href={targetPath}
            title={dict.common.changeLang}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--color-border-strong)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--color-brand-primary)',
              backgroundColor: 'var(--color-bg-surface)',
              transition: 'all var(--transition-fast)',
            }}
            className="locale-switcher"
          >
            <IconGlobe size={15} style={{ color: 'var(--color-brand-secondary)' }} />
            <span>{dict.common.changeLang}</span>
          </Link>

          {/* Admin Demo Portal Entry */}
          <Link
            href="/admin/overview"
            title={isAr ? 'الدخول للوحة التحكم التجريبية' : 'Access Admin Demo Workspace'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-navy-900)',
              color: '#ffffff',
              fontSize: '0.8125rem',
              fontWeight: 600,
              boxShadow: 'var(--shadow-sm)',
              transition: 'all var(--transition-fast)',
            }}
            className="admin-entry-btn"
          >
            <IconLock size={13} style={{ color: '#fbbf24' }} />
            <span>{isAr ? 'لوحة الإدارة' : 'Admin'}</span>
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-strong)',
              background: 'transparent',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
            }}
            className="mobile-nav-toggle"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <IconX size={20} /> : <IconMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--color-border-subtle)',
            backgroundColor: 'var(--color-bg-surface)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            maxHeight: 'calc(100vh - var(--header-height))',
            overflowY: 'auto',
          }}
          className="mobile-drawer"
        >
          <Link
            href={`/${locale}`}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.65rem 0.85rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-md)',
              backgroundColor: isHomeActive ? 'var(--color-brand-primary-light)' : 'transparent',
              color: 'var(--color-brand-primary)',
            }}
          >
            {dict.nav.home}
          </Link>

          {/* About Section in Mobile */}
          <div style={{ padding: '0.5rem 0.85rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              {dict.nav.about}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.4rem', paddingInlineStart: '0.5rem' }}>
              <Link href={`/${locale}/about`} onClick={() => setMobileMenuOpen(false)}>
                {dict.nav.aboutOverview}
              </Link>
              <Link href={`/${locale}/about/values`} onClick={() => setMobileMenuOpen(false)}>
                {dict.nav.values}
              </Link>
              <Link href={`/${locale}/about/goals`} onClick={() => setMobileMenuOpen(false)}>
                {dict.nav.goals}
              </Link>
              <Link href={`/${locale}/about/milestones`} onClick={() => setMobileMenuOpen(false)}>
                {dict.nav.milestones}
              </Link>
            </div>
          </div>

          <Link
            href={`/${locale}/programs`}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.65rem 0.85rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              backgroundColor: isProgramsActive ? 'var(--color-brand-primary-light)' : 'transparent',
              color: 'var(--color-brand-primary)',
            }}
          >
            {dict.nav.programs}
          </Link>

          {/* Media Section in Mobile */}
          <div style={{ padding: '0.5rem 0.85rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              {isAr ? 'المركز الإعلامي' : 'Media Center'}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.4rem', paddingInlineStart: '0.5rem' }}>
              <Link href={`/${locale}/news`} onClick={() => setMobileMenuOpen(false)}>
                {dict.nav.news}
              </Link>
              <Link href={`/${locale}/activities`} onClick={() => setMobileMenuOpen(false)}>
                {dict.nav.activities}
              </Link>
              <Link href={`/${locale}/stories`} onClick={() => setMobileMenuOpen(false)}>
                {dict.nav.stories}
              </Link>
              <Link href={`/${locale}/publications`} onClick={() => setMobileMenuOpen(false)}>
                {dict.nav.publications}
              </Link>
            </div>
          </div>

          <Link
            href={`/${locale}/presence`}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.65rem 0.85rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              backgroundColor: isPresenceActive ? 'var(--color-brand-primary-light)' : 'transparent',
              color: 'var(--color-brand-primary)',
            }}
          >
            {dict.nav.presence}
          </Link>

          <Link
            href={`/${locale}/contact`}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.65rem 0.85rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              backgroundColor: isContactActive ? 'var(--color-brand-primary-light)' : 'transparent',
              color: 'var(--color-brand-primary)',
            }}
          >
            {dict.nav.contact}
          </Link>
        </div>
      )}
    </header>
  );
}
