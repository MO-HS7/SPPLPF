import type { ReactNode } from 'react';
import { DEFAULT_LOCALE, isValidLocale, type Locale } from '../../lib/i18n';
import { DemoBanner } from '../../components/layout/DemoBanner';
import { DirectionSync } from '../../components/layout/DirectionSync';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { PublicHeader } from '../../components/layout/PublicHeader';

export default async function LocalizedLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  return (
    <>
      <DirectionSync locale={locale} />
      <DemoBanner locale={locale} />
      <PublicHeader locale={locale} />
      <main style={{ flex: '1 0 auto' }}>{children}</main>
      <PublicFooter locale={locale} />
    </>
  );
}
