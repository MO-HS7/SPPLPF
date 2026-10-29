'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '../../lib/i18n';
import { getDictionary, switchLocalePath } from '../../lib/i18n';
import {
  IconChevronDown,
  IconGlobe,
  IconMenu,
  IconScale,
  IconShield,
  IconX,
  IconFileText,
  IconUsers,
  IconHandshake,
  IconBookOpen,
} from '../icons';
import { ThemeToggle } from '../ui/ThemeToggle';

export interface PublicHeaderProps {
  locale: Locale;
}

export function PublicHeader({ locale }: PublicHeaderProps) {
  const dict = getDictionary(locale);
  const pathname = usePathname() || `/${locale}`;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'about' | 'media' | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const targetLocale: Locale = locale === 'en' ? 'ar' : 'en';
  const targetPath = switchLocalePath(pathname, targetLocale);

  const headerRef = useRef<HTMLElement>(null);

  const isAr = locale === 'ar';
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;
  const isTransparentHero = isHomePage && !isScrolled && !mobileMenuOpen;

  // ═══ Scroll-Aware Header ═══
  useEffect(() => {
    const SCROLL_THRESHOLD = 36;

    function handleScroll() {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Escape key closes menus
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close menus on path change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  const toggleDropdown = useCallback((name: 'about' | 'media') => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  }, []);

  const isHomeActive = isHomePage;
  const isAboutActive = pathname.startsWith(`/${locale}/about`);
  const isProgramsActive = pathname.startsWith(`/${locale}/programs`);
  const isMediaActive =
    pathname.startsWith(`/${locale}/news`) ||
    pathname.startsWith(`/${locale}/activities`) ||
    pathname.startsWith(`/${locale}/stories`) ||
    pathname.startsWith(`/${locale}/publications`);
  const isPresenceActive = pathname.startsWith(`/${locale}/presence`);
  const isContactActive = pathname.startsWith(`/${locale}/contact`);

  // Shared nav link style generator
  const navLinkStyle = (isActive: boolean): React.CSSProperties => {
    if (isTransparentHero) {
      return {
        padding: '0.45rem 0.75rem',
        fontSize: '0.84375rem',
        fontWeight: isActive ? 700 : 600,
        color: isActive ? '#ffffff' : 'rgba(248, 250, 252, 0.88)',
        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.14)' : 'transparent',
        borderRadius: 'var(--radius-md)',
        transition: 'all var(--transition-fast)',
        whiteSpace: 'nowrap' as const,
        textDecoration: 'none',
      };
    }

    return {
      padding: '0.45rem 0.75rem',
      fontSize: '0.84375rem',
      fontWeight: isActive ? 700 : 600,
      color: isActive ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
      backgroundColor: isActive ? 'var(--color-brand-primary-light)' : 'transparent',
      borderRadius: 'var(--radius-md)',
      transition: 'all var(--transition-fast)',
      whiteSpace: 'nowrap' as const,
      textDecoration: 'none',
    };
  };

  return (
    <header
      ref={headerRef}
      className={`glass-header ${isTransparentHero ? 'header-over-hero' : ''} ${isScrolled ? 'header-scrolled' : ''}`}
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
          height: isScrolled ? 'var(--header-height-scrolled)' : 'var(--header-height)',
          gap: '0.75rem',
          transition: 'height 280ms var(--ease-editorial)',
        }}
      >
        {/* ═══ Brand Emblem & Organization Identity ═══ */}
        <Link
          href={`/${locale}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
            minWidth: 0,
            flex: '0 1 auto',
          }}
          aria-label={isAr ? 'الصفحة الرئيسية لمؤسسة حماية القانون وتعزيز السلم الاجتماعي' : 'SPPLPF Home Page'}
        >
          {/* Provisional Text-Based Brand Mark */}
          <div
            style={{
              width: isScrolled ? '2.35rem' : '2.55rem',
              height: isScrolled ? '2.35rem' : '2.55rem',
              borderRadius: 'var(--radius-md)',
              background: isTransparentHero
                ? 'rgba(255, 255, 255, 0.12)'
                : 'linear-gradient(135deg, var(--color-navy-950) 0%, var(--color-navy-800) 100%)',
              border: isTransparentHero
                ? '1px solid rgba(255, 255, 255, 0.28)'
                : '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
              flexShrink: 0,
              backdropFilter: isTransparentHero ? 'blur(8px)' : 'none',
              transition: 'all 280ms var(--ease-editorial)',
            }}
            aria-label={isAr ? 'علامة تعريفية مؤقتة للمؤسسة' : 'Provisional institutional mark'}
            title={isAr ? 'علامة تعريفية مؤقتة (SPPLPF)' : 'Provisional institutional mark (SPPLPF)'}
          >
            <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--color-gold-500)', lineHeight: 1, letterSpacing: '0.04em' }}>
              SP
            </span>
            <span style={{ fontSize: '0.52rem', fontWeight: 800, color: '#ffffff', lineHeight: 1, letterSpacing: '0.06em', marginTop: '1px' }}>
              LPF
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              maxWidth: isAr ? 'clamp(148px, 38vw, 275px)' : 'clamp(148px, 36vw, 260px)',
            }}
          >
            <span
              style={{
                fontWeight: 800,
                fontSize: 'clamp(0.74rem, 0.68rem + 0.25vw, 0.9rem)',
                color: isTransparentHero ? '#ffffff' : 'var(--color-brand-primary)',
                lineHeight: 1.25,
                transition: 'color 250ms ease',
              }}
            >
              {isAr ? 'مؤسسة حماية القانون وتعزيز السلم الاجتماعي' : 'Law Protection & Social Peace Foundation'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.1rem', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <span
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  color: isTransparentHero ? 'var(--color-gold-400)' : 'var(--color-brand-secondary)',
                  letterSpacing: '0.04em',
                }}
              >
                SPPLPF
              </span>
              <span style={{ fontSize: '0.5rem', color: isTransparentHero ? 'rgba(255,255,255,0.5)' : 'var(--color-text-muted)' }}>•</span>
              <span
                style={{
                  fontSize: '0.625rem',
                  color: isTransparentHero ? 'rgba(248, 250, 252, 0.78)' : 'var(--color-text-muted)',
                  fontWeight: 500,
                }}
              >
                {isAr ? 'حماية • منظمة مستقلة' : 'Provisional translation (OQ-001)'}
              </span>
            </div>
          </div>
        </Link>

        {/* ═══ Desktop Navigation — Compact, Single-Line ═══ */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
          }}
          className="desktop-navigation"
          aria-label="Main Navigation"
        >
          {/* 1. Home */}
          <Link href={`/${locale}`} style={navLinkStyle(isHomeActive)}>
            {dict.nav.home}
          </Link>

          {/* 2. About Group Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => toggleDropdown('about')}
              aria-expanded={activeDropdown === 'about'}
              aria-haspopup="true"
              style={{
                ...navLinkStyle(isAboutActive),
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                backgroundColor:
                  isAboutActive || activeDropdown === 'about'
                    ? isTransparentHero
                      ? 'rgba(255, 255, 255, 0.16)'
                      : 'var(--color-bg-subtle)'
                    : 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span>{dict.nav.about}</span>
              <IconChevronDown
                size={13}
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
                  top: 'calc(100% + 0.45rem)',
                  insetInlineStart: 0,
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  minWidth: '225px',
                  padding: '0.45rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.15rem',
                  zIndex: 950,
                  animation: 'fadeIn 180ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <Link
                  href={`/${locale}/about`}
                  style={{
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                  }}
                  className="dropdown-item"
                >
                  <IconShield size={15} style={{ color: 'var(--color-brand-secondary)' }} />
                  <span>{dict.nav.aboutOverview}</span>
                </Link>
                <Link
                  href={`/${locale}/about/values`}
                  style={{
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                  }}
                  className="dropdown-item"
                >
                  <IconHandshake size={15} style={{ color: 'var(--color-brand-accent)' }} />
                  <span>{dict.nav.values}</span>
                </Link>
                <Link
                  href={`/${locale}/about/goals`}
                  style={{
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                  }}
                  className="dropdown-item"
                >
                  <IconScale size={15} style={{ color: 'var(--color-brand-primary)' }} />
                  <span>{dict.nav.goals}</span>
                </Link>
                <Link
                  href={`/${locale}/about/milestones`}
                  style={{
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                  }}
                  className="dropdown-item"
                >
                  <IconBookOpen size={15} style={{ color: 'var(--color-brand-secondary)' }} />
                  <span>{dict.nav.milestones}</span>
                </Link>
              </div>
            )}
          </div>

          {/* 3. Programs */}
          <Link href={`/${locale}/programs`} style={navLinkStyle(isProgramsActive)}>
            {dict.nav.programs}
          </Link>

          {/* 4. Media Center Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => toggleDropdown('media')}
              aria-expanded={activeDropdown === 'media'}
              aria-haspopup="true"
              style={{
                ...navLinkStyle(isMediaActive),
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                backgroundColor:
                  isMediaActive || activeDropdown === 'media'
                    ? isTransparentHero
                      ? 'rgba(255, 255, 255, 0.16)'
                      : 'var(--color-bg-subtle)'
                    : 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span>{isAr ? 'المركز الإعلامي' : 'Media & Studies'}</span>
              <IconChevronDown
                size={13}
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
                  top: 'calc(100% + 0.45rem)',
                  insetInlineStart: 0,
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  minWidth: '225px',
                  padding: '0.45rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.15rem',
                  zIndex: 950,
                  animation: 'fadeIn 180ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <Link
                  href={`/${locale}/news`}
                  style={{
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                  }}
                  className="dropdown-item"
                >
                  <IconFileText size={15} style={{ color: 'var(--color-brand-secondary)' }} />
                  <span>{dict.nav.news}</span>
                </Link>
                <Link
                  href={`/${locale}/activities`}
                  style={{
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                  }}
                  className="dropdown-item"
                >
                  <IconUsers size={15} style={{ color: 'var(--color-brand-accent)' }} />
                  <span>{dict.nav.activities}</span>
                </Link>
                <Link
                  href={`/${locale}/stories`}
                  style={{
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                  }}
                  className="dropdown-item"
                >
                  <IconHandshake size={15} style={{ color: 'var(--color-brand-primary)' }} />
                  <span>{dict.nav.stories}</span>
                </Link>
                <Link
                  href={`/${locale}/publications`}
                  style={{
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                  }}
                  className="dropdown-item"
                >
                  <IconBookOpen size={15} style={{ color: 'var(--color-brand-secondary)' }} />
                  <span>{dict.nav.publications}</span>
                </Link>
              </div>
            )}
          </div>

          {/* 5. Presence */}
          <Link href={`/${locale}/presence`} style={navLinkStyle(isPresenceActive)}>
            {dict.nav.presence}
          </Link>

          {/* 6. Contact */}
          <Link href={`/${locale}/contact`} style={navLinkStyle(isContactActive)}>
            {dict.nav.contact}
          </Link>
        </nav>

        {/* ═══ Right Actions ═══ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
          {/* Light / Dark Mode Toggle */}
          <ThemeToggle locale={locale} inverted={isTransparentHero} />

          {/* Language Switcher */}
          <Link
            href={targetPath}
            title={dict.common.changeLang}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              height: '2.25rem',
              paddingInline: '0.65rem',
              borderRadius: 'var(--radius-md)',
              border: isTransparentHero
                ? '1.5px solid rgba(255, 255, 255, 0.3)'
                : '1.5px solid var(--color-border-strong)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: isTransparentHero ? '#ffffff' : 'var(--color-brand-primary)',
              backgroundColor: isTransparentHero ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-bg-surface)',
              backdropFilter: isTransparentHero ? 'blur(8px)' : 'none',
              transition: 'all var(--transition-fast)',
              textDecoration: 'none',
            }}
            className="locale-switcher"
          >
            <IconGlobe
              size={14}
              style={{ color: isTransparentHero ? 'var(--color-gold-400)' : 'var(--color-brand-secondary)' }}
            />
            <span>{locale === 'ar' ? 'EN' : 'ع'}</span>
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: 'var(--radius-md)',
              border: isTransparentHero
                ? '1.5px solid rgba(255, 255, 255, 0.3)'
                : '1.5px solid var(--color-border-strong)',
              background: isTransparentHero ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-bg-surface)',
              color: isTransparentHero ? '#ffffff' : 'var(--color-text-primary)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            className="mobile-nav-toggle"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <IconX size={18} /> : <IconMenu size={18} />}
          </button>
        </div>
      </div>

      {/* ═══ Mobile Drawer Navigation ═══ */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--color-border-subtle)',
            backgroundColor: 'var(--color-bg-surface)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            maxHeight: 'calc(100vh - var(--header-height))',
            overflowY: 'auto',
            animation: 'fadeIn 200ms ease-out',
          }}
          className="mobile-drawer"
          role="dialog"
          aria-label={isAr ? 'قائمة التنقل للهاتف' : 'Mobile Navigation Drawer'}
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
          <div style={{ padding: '0.5rem 0.85rem', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-brand-secondary)', textTransform: 'uppercase' }}>
              {dict.nav.about}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.5rem', paddingInlineStart: '0.5rem' }}>
              <Link href={`/${locale}/about`} onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-text-primary)', fontSize: '0.875rem', fontWeight: 600 }}>
                {dict.nav.aboutOverview}
              </Link>
              <Link href={`/${locale}/about/values`} onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-text-primary)', fontSize: '0.875rem', fontWeight: 600 }}>
                {dict.nav.values}
              </Link>
              <Link href={`/${locale}/about/goals`} onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-text-primary)', fontSize: '0.875rem', fontWeight: 600 }}>
                {dict.nav.goals}
              </Link>
              <Link href={`/${locale}/about/milestones`} onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-text-primary)', fontSize: '0.875rem', fontWeight: 600 }}>
                {dict.nav.milestones}
              </Link>
            </div>
          </div>

          <Link
            href={`/${locale}/programs`}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.65rem 0.85rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-md)',
              backgroundColor: isProgramsActive ? 'var(--color-brand-primary-light)' : 'transparent',
              color: 'var(--color-brand-primary)',
            }}
          >
            {dict.nav.programs}
          </Link>

          {/* Media Section in Mobile */}
          <div style={{ padding: '0.5rem 0.85rem', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-brand-secondary)', textTransform: 'uppercase' }}>
              {isAr ? 'المركز الإعلامي والدراسات' : 'Media & Studies'}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.5rem', paddingInlineStart: '0.5rem' }}>
              <Link href={`/${locale}/news`} onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-text-primary)', fontSize: '0.875rem', fontWeight: 600 }}>
                {dict.nav.news}
              </Link>
              <Link href={`/${locale}/activities`} onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-text-primary)', fontSize: '0.875rem', fontWeight: 600 }}>
                {dict.nav.activities}
              </Link>
              <Link href={`/${locale}/stories`} onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-text-primary)', fontSize: '0.875rem', fontWeight: 600 }}>
                {dict.nav.stories}
              </Link>
              <Link href={`/${locale}/publications`} onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-text-primary)', fontSize: '0.875rem', fontWeight: 600 }}>
                {dict.nav.publications}
              </Link>
            </div>
          </div>

          <Link
            href={`/${locale}/presence`}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.65rem 0.85rem',
              fontWeight: 700,
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
              fontWeight: 700,
              borderRadius: 'var(--radius-md)',
              backgroundColor: isContactActive ? 'var(--color-brand-primary-light)' : 'transparent',
              color: 'var(--color-brand-primary)',
            }}
          >
            {dict.nav.contact}
          </Link>

          {/* Quick theme & locale switcher inside drawer */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              borderTop: '1px solid var(--color-border-subtle)',
              paddingTop: '1rem',
              marginTop: '0.25rem',
            }}
          >
            <ThemeToggle locale={locale} style={{ flex: '1 1 auto', height: '2.5rem' }} />
            <Link
              href={targetPath}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                flex: '1 1 auto',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                height: '2.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border-strong)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: 'var(--color-brand-primary)',
                backgroundColor: 'var(--color-bg-surface)',
                textDecoration: 'none',
              }}
            >
              <IconGlobe size={15} style={{ color: 'var(--color-brand-secondary)' }} />
              <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
