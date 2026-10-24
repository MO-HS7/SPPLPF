import Link from 'next/link';
import { DEFAULT_LOCALE, getDictionary, isValidLocale, type Locale } from '../../lib/i18n';
import { demoStore } from '../../lib/demo/store';
import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui';
import {
  IconCalendar,
  IconCheck,
  IconDownload,
  IconFileText,
  IconMapPin,
  IconScale,
  IconShield,
  IconUsers,
} from '../../components/icons';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  const programs = demoStore.getPrograms().slice(0, 3);
  const newsItems = demoStore.getContentItems().filter((c) => c.status === 'PUBLISHED').slice(0, 3);
  const publications = demoStore.getPublications().slice(0, 2);

  const isAr = locale === 'ar';

  return (
    <div>
      {/* 1. Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-navy-900) 0%, var(--color-brand-primary) 100%)',
          color: '#ffffff',
          paddingBlock: 'var(--space-16)',
          position: 'relative',
          overflow: 'hidden',
          borderBlockEnd: '4px solid var(--color-brand-secondary)',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px' }}>
            <div style={{ marginBlockEnd: 'var(--space-4)' }}>
              <Badge variant="secondary" size="md">
                {dict.home.heroBadge}
              </Badge>
            </div>
            <h1
              style={{
                fontSize: 'clamp(1.75rem, 1.4rem + 1.8vw, 3rem)',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.25,
                marginBlockEnd: 'var(--space-4)',
              }}
            >
              {dict.home.heroTitle}
            </h1>
            <p
              style={{
                fontSize: 'var(--text-lg)',
                color: '#e2e8f0',
                lineHeight: 1.7,
                marginBlockEnd: 'var(--space-8)',
              }}
            >
              {dict.home.heroSubtitle}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <Link href={`/${locale}/programs`} style={{ textDecoration: 'none' }}>
                <Button variant="accent" size="lg">
                  {dict.home.explorePrograms}
                </Button>
              </Link>
              <Link href={`/${locale}/contact`} style={{ textDecoration: 'none' }}>
                <Button variant="outline" size="lg" style={{ color: '#ffffff', borderColor: '#ffffff' }}>
                  {dict.home.contactUs}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Four Strategic Pillars Section */}
      <section className="section section-alt">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '750px', marginInline: 'auto', marginBlockEnd: 'var(--space-12)' }}>
            <Badge variant="primary" size="sm" style={{ marginBlockEnd: 'var(--space-2)' }}>
              {isAr ? 'محاور التدخل' : 'Strategic Pillars'}
            </Badge>
            <h2 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-brand-primary)' }}>
              {dict.home.focusAreasTitle}
            </h2>
            <p style={{ color: 'var(--color-text-muted)' }}>
              {dict.home.focusAreasSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-4 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {/* Pillar 1 */}
            <Card hoverEffect>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-brand-primary-light)',
                  color: 'var(--color-brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBlockEnd: 'var(--space-4)',
                }}
              >
                <IconScale size={24} />
              </div>
              <CardTitle>{dict.home.mediationTitle}</CardTitle>
              <CardContent>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  {dict.home.mediationDesc}
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/${locale}/programs`} style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                  {dict.common.readMore} &larr;
                </Link>
              </CardFooter>
            </Card>

            {/* Pillar 2 */}
            <Card hoverEffect>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-brand-secondary-light)',
                  color: 'var(--color-brand-secondary-hover)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBlockEnd: 'var(--space-4)',
                }}
              >
                <IconShield size={24} />
              </div>
              <CardTitle>{dict.home.legalTitle}</CardTitle>
              <CardContent>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  {dict.home.legalDesc}
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/${locale}/programs`} style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                  {dict.common.readMore} &larr;
                </Link>
              </CardFooter>
            </Card>

            {/* Pillar 3 */}
            <Card hoverEffect>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-brand-accent-light)',
                  color: 'var(--color-brand-accent-hover)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBlockEnd: 'var(--space-4)',
                }}
              >
                <IconUsers size={24} />
              </div>
              <CardTitle>{dict.home.youthWomenTitle}</CardTitle>
              <CardContent>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  {dict.home.youthWomenDesc}
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/${locale}/programs`} style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                  {dict.common.readMore} &larr;
                </Link>
              </CardFooter>
            </Card>

            {/* Pillar 4 */}
            <Card hoverEffect>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-brand-success-light)',
                  color: 'var(--color-brand-success-hover)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBlockEnd: 'var(--space-4)',
                }}
              >
                <IconCheck size={24} />
              </div>
              <CardTitle>{dict.home.governanceTitle}</CardTitle>
              <CardContent>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  {dict.home.governanceDesc}
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/${locale}/programs`} style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                  {dict.common.readMore} &larr;
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. Featured Programs */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBlockEnd: 'var(--space-8)', gap: 'var(--space-4)' }}>
            <div>
              <Badge variant="primary" size="sm" style={{ marginBlockEnd: 'var(--space-2)' }}>
                {isAr ? 'مشاريع حية' : 'Featured Initiatives'}
              </Badge>
              <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', margin: 0 }}>
                {isAr ? 'أبرز البرامج والمشاريع الميدانية' : 'Featured Programs & Interventions'}
              </h2>
            </div>
            <Link href={`/${locale}/programs`} style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
              {dict.common.viewAll} &larr;
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
            {programs.map((p) => (
              <Card key={p.id} hoverEffect>
                <div style={{ marginBlockEnd: 'var(--space-3)' }}>
                  <Badge variant="primary" size="sm">{p.location}</Badge>
                </div>
                <CardTitle>
                  <Link href={`/${locale}/programs/${p.slug}`} style={{ color: 'inherit' }}>
                    {isAr ? p.titleAr : p.titleEn}
                  </Link>
                </CardTitle>
                <CardContent>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                    {isAr ? p.descriptionAr : p.descriptionEn}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href={`/${locale}/programs/${p.slug}`} style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                    {dict.common.readMore} &larr;
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Latest News & Field Updates */}
      <section className="section section-alt">
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBlockEnd: 'var(--space-8)', gap: 'var(--space-4)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-1)' }}>
                {dict.home.latestNewsTitle}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                {dict.home.latestNewsSubtitle}
              </p>
            </div>
            <Link href={`/${locale}/news`} style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
              {dict.common.viewAll} &larr;
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
            {newsItems.map((item) => (
              <Card key={item.id} hoverEffect>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBlockEnd: 'var(--space-3)' }}>
                  <IconCalendar size={14} />
                  <span>{item.publishedAt}</span>
                  <span>•</span>
                  <span>{item.category}</span>
                </div>
                <CardTitle>
                  <Link href={`/${locale}/news/${item.slug}`} style={{ color: 'inherit' }}>
                    {isAr ? item.titleAr : item.titleEn}
                  </Link>
                </CardTitle>
                <CardContent>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                    {isAr ? item.summaryAr : item.summaryEn}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href={`/${locale}/news/${item.slug}`} style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                    {dict.common.readMore} &larr;
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Publications */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBlockEnd: 'var(--space-8)', gap: 'var(--space-4)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-1)' }}>
                {dict.home.featuredPubsTitle}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                {dict.home.featuredPubsSubtitle}
              </p>
            </div>
            <Link href={`/${locale}/publications`} style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
              {dict.common.viewAll} &larr;
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
            {publications.map((pub) => (
              <div
                key={pub.id}
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border-subtle)',
                  padding: 'var(--space-6)',
                  display: 'flex',
                  gap: 'var(--space-4)',
                }}
              >
                <div
                  style={{
                    width: '3.5rem',
                    height: '4.5rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-navy-900)',
                    color: 'var(--color-brand-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconFileText size={28} />
                </div>
                <div style={{ flex: '1 1 auto' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBlockEnd: 'var(--space-1)' }}>
                    {pub.category} • {pub.fileSize}
                  </div>
                  <h4 style={{ fontSize: 'var(--text-base)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-2)' }}>
                    {isAr ? pub.titleAr : pub.titleEn}
                  </h4>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBlockEnd: 'var(--space-3)' }}>
                    {isAr ? pub.summaryAr : pub.summaryEn}
                  </p>
                  <Link
                    href={`/${locale}/publications`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
                      color: 'var(--color-brand-secondary)',
                    }}
                  >
                    <IconDownload size={14} />
                    <span>{dict.common.downloadPdf}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Operational Presence CTA */}
      <section
        style={{
          backgroundColor: 'var(--color-bg-elevated)',
          borderBlockStart: '1px solid var(--color-border-subtle)',
          paddingBlock: 'var(--space-12)',
        }}
      >
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-6)' }}>
          <div style={{ maxWidth: '650px' }}>
            <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-2)' }}>
              {dict.home.presenceTitle}
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
              {dict.home.presenceDesc}
            </p>
          </div>
          <div>
            <Link href={`/${locale}/presence`} style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="md">
                <IconMapPin size={18} />
                <span>{dict.home.viewPresence}</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
