import React from 'react';
import Link from 'next/link';
import type { Locale } from '../../lib/i18n';
import { getDictionary } from '../../lib/i18n';
import { IconMail, IconMapPin, IconPhone, IconScale } from '../icons';

export interface PublicFooterProps {
  locale: Locale;
}

export function PublicFooter({ locale }: PublicFooterProps) {
  const dict = getDictionary(locale);

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-navy-900)',
        color: '#f8fafc',
        borderBlockStart: '4px solid var(--color-brand-secondary)',
        marginBlockStart: 'auto',
      }}
    >
      <div className="container" style={{ paddingBlock: 'var(--space-16)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-8)',
            marginBlockEnd: 'var(--space-12)',
          }}
        >
          {/* Col 1: About Foundation */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBlockEnd: 'var(--space-4)' }}>
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
                <IconScale size={22} />
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: 'var(--text-base)', margin: 0 }}>
                  {dict.common.orgName}
                </h4>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-accent)', fontWeight: 600 }}>
                  {locale === 'ar' ? 'حماية — SPPLPF' : 'SPPLPF — Himaaya Foundation'}
                </span>
              </div>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: '#94a3b8', lineHeight: 1.7 }}>
              {dict.footer.aboutText}
            </p>
          </div>

          {/* Col 2: Thematic Areas */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: 'var(--text-base)', marginBlockEnd: 'var(--space-4)', borderBlockEnd: '2px solid rgba(255, 255, 255, 0.1)', paddingBlockEnd: 'var(--space-2)' }}>
              {dict.footer.thematicAreas}
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
              <li>
                <Link href={`/${locale}/programs`} style={{ color: '#cbd5e1' }}>
                  {locale === 'ar' ? '• الوساطة المحلية وفض النزاعات' : '• Local Mediation & Reconciliation'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/programs`} style={{ color: '#cbd5e1' }}>
                  {locale === 'ar' ? '• الحماية القانونية وسيادة القانون' : '• Legal Protection & Fair Trials'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/programs`} style={{ color: '#cbd5e1' }}>
                  {locale === 'ar' ? '• تمكين المرأة والشباب في بناء السلام' : '• Women & Youth Peace Leadership'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/programs`} style={{ color: '#cbd5e1' }}>
                  {locale === 'ar' ? '• النزاهة والحوكمة المؤسسية والأمن الرقمي' : '• Institutional Governance & Digital Safety'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: 'var(--text-base)', marginBlockEnd: 'var(--space-4)', borderBlockEnd: '2px solid rgba(255, 255, 255, 0.1)', paddingBlockEnd: 'var(--space-2)' }}>
              {dict.footer.quickLinks}
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
              <li>
                <Link href={`/${locale}/about`} style={{ color: '#cbd5e1' }}>
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/news`} style={{ color: '#cbd5e1' }}>
                  {dict.nav.news}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/publications`} style={{ color: '#cbd5e1' }}>
                  {dict.nav.publications}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/presence`} style={{ color: '#cbd5e1' }}>
                  {dict.nav.presence}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} style={{ color: '#cbd5e1' }}>
                  {dict.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Operational Hubs */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: 'var(--text-base)', marginBlockEnd: 'var(--space-4)', borderBlockEnd: '2px solid rgba(255, 255, 255, 0.1)', paddingBlockEnd: 'var(--space-2)' }}>
              {dict.footer.offices}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', color: '#cbd5e1' }}>
                <IconMapPin size={18} style={{ color: 'var(--color-brand-secondary)', flexShrink: 0, marginTop: '2px' }} />
                <span>{dict.footer.taizHub} — {dict.footer.maribBranch} — {dict.footer.sanaaOffice}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: '#cbd5e1' }}>
                <IconPhone size={18} style={{ color: 'var(--color-brand-secondary)', flexShrink: 0 }} />
                <span>+967 4 250 881</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: '#cbd5e1' }}>
                <IconMail size={18} style={{ color: 'var(--color-brand-secondary)', flexShrink: 0 }} />
                <span>contact@spplpf.org</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Compliance Bottom Bar */}
        <div
          style={{
            borderBlockStart: '1px solid rgba(255, 255, 255, 0.12)',
            paddingBlockStart: 'var(--space-6)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            fontSize: 'var(--text-xs)',
            color: '#94a3b8',
          }}
        >
          <div>{dict.footer.allRightsReserved}</div>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <Link href={`/${locale}/legal/privacy`} style={{ color: '#cbd5e1' }}>
              {dict.nav.privacy}
            </Link>
            <Link href={`/${locale}/legal/terms`} style={{ color: '#cbd5e1' }}>
              {dict.nav.terms}
            </Link>
            <Link href={`/${locale}/legal/neutrality`} style={{ color: '#cbd5e1' }}>
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
