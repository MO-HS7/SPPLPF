import React from 'react';
import Link from 'next/link';
import type { Locale } from '../../lib/i18n';
import { getDictionary } from '../../lib/i18n';
import { IconMail, IconMapPin, IconPhone, IconScale, IconShield, IconChevronRight, IconChevronLeft } from '../icons';

export interface PublicFooterProps {
  locale: Locale;
}

export function PublicFooter({ locale }: PublicFooterProps) {
  const dict = getDictionary(locale);
  const isAr = locale === 'ar';
  const Arrow = isAr ? IconChevronLeft : IconChevronRight;

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-navy-950)',
        color: '#f8fafc',
        borderBlockStart: '3px solid var(--color-brand-secondary)',
        marginBlockStart: 'auto',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-label="Site Footer"
    >
      <div className="container" style={{ paddingBlock: 'var(--space-16) var(--space-8)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-10)',
            marginBlockEnd: 'var(--space-12)',
          }}
        >
          {/* Col 1: Institutional Identity */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBlockEnd: 'var(--space-4)' }}>
              <div
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
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
                aria-label={isAr ? 'علامة تعريفية مؤقتة للمؤسسة' : 'Provisional institutional mark'}
              >
                <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--color-gold-500)', lineHeight: 1 }}>SP</span>
                <span style={{ fontSize: '0.52rem', fontWeight: 800, color: '#ffffff', lineHeight: 1, marginTop: '1px' }}>LPF</span>
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, margin: 0, lineHeight: 1.35 }}>
                  {dict.common.orgName}
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gold-500)', fontWeight: 600 }}>
                  {isAr ? 'حماية • SPPLPF' : 'SPPLPF • Himaaya'}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.7, marginBlockEnd: 'var(--space-4)' }}>
              {dict.footer.aboutText}
            </p>

            {/* Neutrality micro-badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                fontSize: '0.75rem',
                color: '#cbd5e1',
                width: 'fit-content',
              }}
            >
              <IconShield size={14} style={{ color: 'var(--color-brand-secondary)' }} />
              <span>{isAr ? 'ميثاق الحياد والنزاهة الإنسانية' : 'Charter of Humanitarian Neutrality'}</span>
            </div>
          </div>

          {/* Col 2: Thematic Areas */}
          <div>
            <h4
              style={{
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 700,
                marginBlockEnd: 'var(--space-4)',
                borderBlockEnd: '1px solid rgba(255, 255, 255, 0.1)',
                paddingBlockEnd: 'var(--space-2)',
              }}
            >
              {dict.footer.thematicAreas}
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li>
                <Link
                  href={`/${locale}/programs`}
                  style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'color var(--transition-fast)' }}
                  className="footer-link"
                >
                  <Arrow size={13} style={{ color: 'var(--color-brand-secondary)', flexShrink: 0 }} />
                  <span>{isAr ? 'الوساطة المحلية وفض النزاعات' : 'Local Mediation & Reconciliation'}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/programs`}
                  style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'color var(--transition-fast)' }}
                  className="footer-link"
                >
                  <Arrow size={13} style={{ color: 'var(--color-brand-secondary)', flexShrink: 0 }} />
                  <span>{isAr ? 'الحماية القانونية وسيادة القانون' : 'Legal Protection & Fair Trials'}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/programs`}
                  style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'color var(--transition-fast)' }}
                  className="footer-link"
                >
                  <Arrow size={13} style={{ color: 'var(--color-brand-secondary)', flexShrink: 0 }} />
                  <span>{isAr ? 'تمكين المرأة والشباب في بناء السلام' : 'Women & Youth Peace Leadership'}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/programs`}
                  style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'color var(--transition-fast)' }}
                  className="footer-link"
                >
                  <Arrow size={13} style={{ color: 'var(--color-brand-secondary)', flexShrink: 0 }} />
                  <span>{isAr ? 'النزاهة والحوكمة المؤسسية' : 'Institutional Governance & Safety'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4
              style={{
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 700,
                marginBlockEnd: 'var(--space-4)',
                borderBlockEnd: '1px solid rgba(255, 255, 255, 0.1)',
                paddingBlockEnd: 'var(--space-2)',
              }}
            >
              {dict.footer.quickLinks}
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li>
                <Link href={`/${locale}/about`} style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem' }} className="footer-link">
                  <Arrow size={13} style={{ color: 'var(--color-brand-secondary)', flexShrink: 0 }} />
                  <span>{dict.nav.about}</span>
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about/values`} style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem' }} className="footer-link">
                  <Arrow size={13} style={{ color: 'var(--color-brand-secondary)', flexShrink: 0 }} />
                  <span>{dict.nav.values}</span>
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/news`} style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem' }} className="footer-link">
                  <Arrow size={13} style={{ color: 'var(--color-brand-secondary)', flexShrink: 0 }} />
                  <span>{dict.nav.news}</span>
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/publications`} style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem' }} className="footer-link">
                  <Arrow size={13} style={{ color: 'var(--color-brand-secondary)', flexShrink: 0 }} />
                  <span>{dict.nav.publications}</span>
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/presence`} style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem' }} className="footer-link">
                  <Arrow size={13} style={{ color: 'var(--color-brand-secondary)', flexShrink: 0 }} />
                  <span>{dict.nav.presence}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Operational Hubs & Contact */}
          <div>
            <h4
              style={{
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 700,
                marginBlockEnd: 'var(--space-4)',
                borderBlockEnd: '1px solid rgba(255, 255, 255, 0.1)',
                paddingBlockEnd: 'var(--space-2)',
              }}
            >
              {dict.footer.offices}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#cbd5e1' }}>
                <IconMapPin size={17} style={{ color: 'var(--color-brand-secondary)', flexShrink: 0, marginTop: '2px' }} />
                <span>{dict.footer.taizHub} • {dict.footer.maribBranch} • {dict.footer.sanaaOffice}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
                <IconPhone size={17} style={{ color: 'var(--color-brand-secondary)', flexShrink: 0 }} />
                <span dir="ltr">+967 4 250 881</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
                <IconMail size={17} style={{ color: 'var(--color-brand-secondary)', flexShrink: 0 }} />
                <a href="mailto:contact@spplpf.org" style={{ color: '#cbd5e1' }}>
                  contact@spplpf.org
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Compliance Bottom Bar */}
        <div
          style={{
            borderBlockStart: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBlockStart: 'var(--space-6)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            fontSize: '0.8125rem',
            color: '#94a3b8',
          }}
        >
          <div>{dict.footer.allRightsReserved}</div>
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <Link href={`/${locale}/legal/privacy`} style={{ color: '#cbd5e1' }} className="footer-legal-link">
              {dict.nav.privacy}
            </Link>
            <Link href={`/${locale}/legal/terms`} style={{ color: '#cbd5e1' }} className="footer-legal-link">
              {dict.nav.terms}
            </Link>
            <Link href={`/${locale}/legal/neutrality`} style={{ color: '#cbd5e1' }} className="footer-legal-link">
              {dict.nav.neutrality}
            </Link>
          </div>
        </div>

        <div style={{ marginBlockStart: 'var(--space-4)', fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>
          {dict.footer.disclaimer}
        </div>
      </div>
    </footer>
  );
}
