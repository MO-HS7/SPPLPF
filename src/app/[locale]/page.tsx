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
  IconHandshake,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconBuilding,
  IconArrowRight,
  IconArrowLeft,
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
  const stories = demoStore
    .getContentItems()
    .filter((c) => c.status === 'PUBLISHED' && c.type === 'story')
    .slice(0, 2);

  const isAr = locale === 'ar';
  const NextArrow = isAr ? IconChevronLeft : IconChevronRight;
  const CtaArrow = isAr ? IconArrowLeft : IconArrowRight;

  return (
    <div>
      {/* 1. Asymmetric Institutional Hero Section */}
      <section
        style={{
          background: 'linear-gradient(145deg, #051324 0%, #0a1e38 50%, #0f325a 100%)',
          color: '#ffffff',
          paddingBlock: 'clamp(3rem, 5vw, 5.5rem)',
          position: 'relative',
          overflow: 'hidden',
          borderBlockEnd: '3px solid var(--color-brand-secondary)',
        }}
      >
        {/* Ambient Glow Circles */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-120px',
            insetInlineEnd: '-100px',
            width: '480px',
            height: '480px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(2, 132, 199, 0.18) 0%, rgba(2, 132, 199, 0) 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '-140px',
            insetInlineStart: '-100px',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(194, 120, 3, 0.14) 0%, rgba(194, 120, 3, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(2rem, 4vw, 4rem)',
              alignItems: 'center',
            }}
          >
            {/* Start Column: Headline, Mission & Actions */}
            <div>
              {/* Eyebrow Badge */}
              <div style={{ marginBlockEnd: 'var(--space-4)' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#f8fafc',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <IconShield size={14} style={{ color: 'var(--color-gold-500)' }} />
                  <span>
                    {isAr
                      ? 'مؤسسة مجتمعية مستقلة للوساطة وسيادة القانون'
                      : 'Independent Community Foundation for Mediation & Law'}
                  </span>
                </span>
              </div>

              {/* Main Display Headline */}
              <h1
                style={{
                  fontSize: 'clamp(2rem, 1.6rem + 2vw, 3.25rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.22,
                  letterSpacing: '-0.02em',
                  marginBlockEnd: 'var(--space-4)',
                }}
              >
                {isAr ? (
                  <>
                    ترسيخ <span style={{ color: 'var(--color-gold-500)' }}>السلام الاجتماعي</span> وحماية سيادة القانون
                  </>
                ) : (
                  <>
                    Fostering <span style={{ color: 'var(--color-gold-500)' }}>Social Peace</span> & Upholding the Rule of Law
                  </>
                )}
              </h1>

              {/* Supporting Mission Copy */}
              <p
                style={{
                  fontSize: 'clamp(1rem, 0.95rem + 0.3vw, 1.15rem)',
                  color: 'rgba(255, 255, 255, 0.88)',
                  lineHeight: 1.7,
                  marginBlockEnd: 'var(--space-8)',
                  maxWidth: '580px',
                }}
              >
                {dict.home.heroSubtitle}
              </p>

              {/* Dual Action CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginBlockEnd: 'var(--space-10)' }}>
                <Link href={`/${locale}/programs`} style={{ textDecoration: 'none' }}>
                  <Button variant="accent" size="lg" icon={<CtaArrow size={18} />}>
                    {dict.home.explorePrograms}
                  </Button>
                </Link>
                <Link href={`/${locale}/contact`} style={{ textDecoration: 'none' }}>
                  <Button variant="outline-white" size="lg">
                    {dict.home.contactUs}
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators Strip */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 'var(--space-4)',
                  borderBlockStart: '1px solid rgba(255, 255, 255, 0.15)',
                  paddingBlockStart: 'var(--space-6)',
                  maxWidth: '540px',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>3</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    {isAr ? 'مكاتب تشغيلية' : 'Operational Hubs'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-gold-500)', lineHeight: 1 }}>4</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    {isAr ? 'محاور استراتيجية' : 'Core Focus Pillars'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', lineHeight: 1 }}>100%</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    {isAr ? 'حياد واستقلالية' : 'Strict Neutrality'}
                  </div>
                </div>
              </div>
            </div>

            {/* End Column: Editorial Visual Factsheet Composition */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: 'var(--radius-xl)',
                  backdropFilter: 'blur(16px)',
                  padding: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  color: '#ffffff',
                }}
              >
                {/* Factsheet Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBlockEnd: 'var(--space-6)',
                    borderBlockEnd: '1px solid rgba(255, 255, 255, 0.12)',
                    paddingBlockEnd: 'var(--space-4)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div
                      style={{
                        width: '2.25rem',
                        height: '2.25rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-brand-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconScale size={18} style={{ color: '#ffffff' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                        {isAr ? 'بطاقة الأثر المؤسسي' : 'Institutional Factsheet'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>
                        {isAr ? 'حماية • تعز • مأرب • صنعاء' : 'Himaaya • Taiz • Marib • Sanaa'}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(5, 150, 105, 0.25)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: '#6ee7b7',
                    }}
                  >
                    {isAr ? 'مشاريع نشطة' : 'Active Field Work'}
                  </span>
                </div>

                {/* 3 Snapshot Highlights */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBlockEnd: 'var(--space-6)' }}>
                  {/* Highlight 1: Local Mediation */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div
                      style={{
                        padding: '0.4rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(194, 120, 3, 0.2)',
                        color: 'var(--color-gold-500)',
                        flexShrink: 0,
                      }}
                    >
                      <IconHandshake size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f8fafc' }}>
                        {isAr ? 'الوساطة المجتمعية وفض النزاعات' : 'Local Community Mediation'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                        {isAr ? 'بروتوكولات تهدئة أهلية ولجان تفاوض محلية' : 'Tribal de-escalation & community truce pacts'}
                      </div>
                    </div>
                  </div>

                  {/* Highlight 2: Detainees Legal Aid */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div
                      style={{
                        padding: '0.4rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(2, 132, 199, 0.2)',
                        color: '#38bdf8',
                        flexShrink: 0,
                      }}
                    >
                      <IconScale size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f8fafc' }}>
                        {isAr ? 'حماية المحتجزين والعيادات القانونية' : 'Detainee Protection & Legal Clinics'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                        {isAr ? 'استشارات قضائية ومتابعة ملفات التبادل الإنساني' : 'Fair trial monitoring & humanitarian exchanges'}
                      </div>
                    </div>
                  </div>

                  {/* Highlight 3: Women & Youth Committees */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div
                      style={{
                        padding: '0.4rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(5, 150, 105, 0.2)',
                        color: '#6ee7b7',
                        flexShrink: 0,
                      }}
                    >
                      <IconUsers size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f8fafc' }}>
                        {isAr ? 'تمكين لجان السلام والنساء' : 'Women & Youth Peace Leadership'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                        {isAr ? 'بناء قدرات القيادات النسائية في رصد التوترات' : 'Grassroots conflict early-warning committees'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Institutional Quote Footer */}
                <div
                  style={{
                    borderBlockStart: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingBlockStart: 'var(--space-3)',
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    fontStyle: 'italic',
                    textAlign: 'center',
                  }}
                >
                  {isAr
                    ? '«السلام المستدام ينطلق من سيادة العدالة وصون كرامة الإنسان»'
                    : '“Sustainable peace begins with the rule of law and human dignity.”'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Four Strategic Pillars Section (Content-Aware Visual Hierarchy) */}
      <section className="section section-warm">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', marginInline: 'auto', marginBlockEnd: 'var(--space-12)' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-brand-primary-light)',
                color: 'var(--color-brand-primary)',
                fontWeight: 700,
                fontSize: '0.8125rem',
                marginBlockEnd: 'var(--space-3)',
              }}
            >
              {isAr ? 'محاور التدخل الاستراتيجي' : 'Strategic Intervention Pillars'}
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 1.4rem + 1vw, 2.5rem)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-3)' }}>
              {dict.home.focusAreasTitle}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
              {dict.home.focusAreasSubtitle}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* Pillar 1: Local Mediation */}
            <Card hoverEffect style={{ borderTop: '4px solid var(--color-brand-accent)', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: '3.25rem',
                  height: '3.25rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-gold-100)',
                  color: 'var(--color-gold-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBlockEnd: 'var(--space-4)',
                }}
              >
                <IconHandshake size={24} />
              </div>
              <CardTitle>{dict.home.mediationTitle}</CardTitle>
              <CardContent>
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                  {dict.home.mediationDesc}
                </p>
              </CardContent>
              <CardFooter>
                <Link
                  href={`/${locale}/programs`}
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--color-brand-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <span>{dict.common.readMore}</span>
                  <NextArrow size={14} />
                </Link>
              </CardFooter>
            </Card>

            {/* Pillar 2: Rule of Law & Legal Aid */}
            <Card hoverEffect style={{ borderTop: '4px solid var(--color-brand-primary)', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: '3.25rem',
                  height: '3.25rem',
                  borderRadius: 'var(--radius-lg)',
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
              <CardTitle>{dict.home.legalTitle}</CardTitle>
              <CardContent>
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                  {dict.home.legalDesc}
                </p>
              </CardContent>
              <CardFooter>
                <Link
                  href={`/${locale}/programs`}
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--color-brand-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <span>{dict.common.readMore}</span>
                  <NextArrow size={14} />
                </Link>
              </CardFooter>
            </Card>

            {/* Pillar 3: Women & Youth Leadership */}
            <Card hoverEffect style={{ borderTop: '4px solid var(--color-brand-secondary)', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: '3.25rem',
                  height: '3.25rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-brand-secondary-light)',
                  color: 'var(--color-brand-secondary-hover)',
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
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                  {dict.home.youthWomenDesc}
                </p>
              </CardContent>
              <CardFooter>
                <Link
                  href={`/${locale}/programs`}
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--color-brand-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <span>{dict.common.readMore}</span>
                  <NextArrow size={14} />
                </Link>
              </CardFooter>
            </Card>

            {/* Pillar 4: Institutional Governance & Integrity */}
            <Card hoverEffect style={{ borderTop: '4px solid var(--color-brand-success)', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: '3.25rem',
                  height: '3.25rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-brand-success-light)',
                  color: 'var(--color-brand-success-hover)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBlockEnd: 'var(--space-4)',
                }}
              >
                <IconShield size={24} />
              </div>
              <CardTitle>{dict.home.governanceTitle}</CardTitle>
              <CardContent>
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                  {dict.home.governanceDesc}
                </p>
              </CardContent>
              <CardFooter>
                <Link
                  href={`/${locale}/programs`}
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--color-brand-success)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <span>{dict.common.readMore}</span>
                  <NextArrow size={14} />
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. Featured Field Programs Section */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBlockEnd: 'var(--space-10)',
              gap: '1rem',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--color-brand-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {isAr ? 'التدخلات الميدانية' : 'Field Initiatives'}
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.5rem, 1.2rem + 1vw, 2.25rem)',
                  color: 'var(--color-brand-primary)',
                  margin: 0,
                  marginTop: '0.25rem',
                }}
              >
                {isAr ? 'أبرز البرامج والمشاريع الميدانية' : 'Featured Programs & Interventions'}
              </h2>
            </div>
            <Link
              href={`/${locale}/programs`}
              style={{
                fontWeight: 700,
                fontSize: '0.9375rem',
                color: 'var(--color-brand-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span>{dict.common.viewAll}</span>
              <NextArrow size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {programs.map((p) => (
              <Card key={p.id} hoverEffect style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-3)' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-brand-primary-light)',
                      color: 'var(--color-brand-primary)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    <IconMapPin size={12} />
                    <span>{p.location}</span>
                  </span>
                  <Badge variant="accent" size="sm">
                    {p.pillar}
                  </Badge>
                </div>

                <CardTitle style={{ fontSize: '1.125rem', lineHeight: 1.4 }}>
                  <Link href={`/${locale}/programs/${p.slug}`} style={{ color: 'inherit' }}>
                    {isAr ? p.titleAr : p.titleEn}
                  </Link>
                </CardTitle>

                <CardContent>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                    {isAr ? p.descriptionAr : p.descriptionEn}
                  </p>
                </CardContent>

                <CardFooter>
                  <Link
                    href={`/${locale}/programs/${p.slug}`}
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: 'var(--color-brand-primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <span>{dict.common.readMore}</span>
                    <NextArrow size={14} />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Latest News & Field Updates (Editorial Layout) */}
      <section className="section section-alt">
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBlockEnd: 'var(--space-10)',
              gap: '1rem',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 'clamp(1.5rem, 1.2rem + 1vw, 2.25rem)',
                  color: 'var(--color-brand-primary)',
                  marginBlockEnd: '0.25rem',
                }}
              >
                {dict.home.latestNewsTitle}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.9375rem' }}>
                {dict.home.latestNewsSubtitle}
              </p>
            </div>
            <Link
              href={`/${locale}/news`}
              style={{
                fontWeight: 700,
                fontSize: '0.9375rem',
                color: 'var(--color-brand-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span>{dict.common.viewAll}</span>
              <NextArrow size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {newsItems.map((item) => (
              <Card key={item.id} hoverEffect style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    marginBlockEnd: 'var(--space-3)',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-bg-subtle)',
                      color: 'var(--color-brand-primary)',
                      fontWeight: 600,
                    }}
                  >
                    {item.category}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <IconCalendar size={13} />
                    <span>{item.publishedAt}</span>
                  </span>
                </div>

                <CardTitle style={{ fontSize: '1.125rem', lineHeight: 1.4 }}>
                  <Link href={`/${locale}/news/${item.slug}`} style={{ color: 'inherit' }}>
                    {isAr ? item.titleAr : item.titleEn}
                  </Link>
                </CardTitle>

                <CardContent>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                    {isAr ? item.summaryAr : item.summaryEn}
                  </p>
                </CardContent>

                <CardFooter>
                  <Link
                    href={`/${locale}/news/${item.slug}`}
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: 'var(--color-brand-primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <span>{dict.common.readMore}</span>
                    <NextArrow size={14} />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Qualitative Impact Stories (Dignified Framing) */}
      {stories.length > 0 && (
        <section className="section" style={{ backgroundColor: 'var(--color-bg-canvas)' }}>
          <div className="container">
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginBlockEnd: 'var(--space-10)',
                gap: '1rem',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--color-brand-accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {isAr ? 'أثر حقيقي من الميدان' : 'Real Impact From The Field'}
                </span>
                <h2
                  style={{
                    fontSize: 'clamp(1.5rem, 1.2rem + 1vw, 2.25rem)',
                    color: 'var(--color-brand-primary)',
                    margin: 0,
                    marginTop: '0.25rem',
                  }}
                >
                  {isAr ? 'قصص الأثر وبناء التماسك المجتمعي' : 'Stories of Impact & Community Cohesion'}
                </h2>
              </div>
              <Link
                href={`/${locale}/stories`}
                style={{
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  color: 'var(--color-brand-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>{dict.common.viewAll}</span>
                <NextArrow size={16} />
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {stories.map((story) => (
                <div
                  key={story.id}
                  style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--color-border-subtle)',
                    padding: 'clamp(1.5rem, 2vw, 2rem)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'relative',
                  }}
                  className="card-hover"
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-4)' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'var(--color-brand-primary)',
                          backgroundColor: 'var(--color-brand-primary-light)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        {story.category}
                      </span>
                      <span style={{ fontSize: '1.75rem', color: 'var(--color-gold-500)', lineHeight: 1 }}>“</span>
                    </div>

                    <h4 style={{ fontSize: '1.125rem', color: 'var(--color-brand-primary)', lineHeight: 1.4, marginBlockEnd: 'var(--space-3)' }}>
                      {isAr ? story.titleAr : story.titleEn}
                    </h4>

                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBlockEnd: 'var(--space-4)' }}>
                      {isAr ? story.summaryAr : story.summaryEn}
                    </p>
                  </div>

                  <div
                    style={{
                      borderBlockStart: '1px solid var(--color-border-subtle)',
                      paddingBlockStart: 'var(--space-3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {story.author}
                    </span>
                    <Link
                      href={`/${locale}/stories`}
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: 'var(--color-brand-primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <span>{dict.common.readMore}</span>
                      <NextArrow size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Featured Studies & Publications */}
      <section className="section section-warm">
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBlockEnd: 'var(--space-10)',
              gap: '1rem',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 'clamp(1.5rem, 1.2rem + 1vw, 2.25rem)',
                  color: 'var(--color-brand-primary)',
                  marginBlockEnd: '0.25rem',
                }}
              >
                {dict.home.featuredPubsTitle}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.9375rem' }}>
                {dict.home.featuredPubsSubtitle}
              </p>
            </div>
            <Link
              href={`/${locale}/publications`}
              style={{
                fontWeight: 700,
                fontSize: '0.9375rem',
                color: 'var(--color-brand-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span>{dict.common.viewAll}</span>
              <NextArrow size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {publications.map((pub) => (
              <div
                key={pub.id}
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--color-border-subtle)',
                  padding: 'clamp(1.25rem, 2vw, 1.75rem)',
                  display: 'flex',
                  gap: '1.25rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
                className="card-hover"
              >
                <div
                  style={{
                    width: '3.5rem',
                    height: '4.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(145deg, var(--color-navy-950) 0%, var(--color-navy-800) 100%)',
                    color: 'var(--color-brand-secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.2rem',
                    flexShrink: 0,
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <IconFileText size={22} style={{ color: '#ffffff' }} />
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-gold-500)' }}>PDF</span>
                </div>

                <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBlockEnd: '0.35rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-brand-primary)' }}>{pub.category}</span> • {pub.fileSize}
                    </div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--color-brand-primary)', lineHeight: 1.4, marginBlockEnd: '0.4rem' }}>
                      {isAr ? pub.titleAr : pub.titleEn}
                    </h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBlockEnd: '0.75rem' }}>
                      {isAr ? pub.summaryAr : pub.summaryEn}
                    </p>
                  </div>

                  <div>
                    <Link
                      href={`/${locale}/publications`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: 'var(--color-brand-secondary)',
                      }}
                    >
                      <IconDownload size={15} />
                      <span>{dict.common.downloadPdf}</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Institutional Operational Presence CTA */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-navy-950) 0%, var(--color-navy-900) 100%)',
          color: '#ffffff',
          paddingBlock: 'var(--space-16)',
          borderBlockStart: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-8)',
          }}
        >
          <div style={{ maxWidth: '650px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-gold-500)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {isAr ? 'الانتشار الميداني' : 'Geographic Reach'}
            </span>
            <h3
              style={{
                fontSize: 'clamp(1.5rem, 1.25rem + 1vw, 2.25rem)',
                color: '#ffffff',
                marginBlock: '0.35rem var(--space-3)',
                fontWeight: 800,
              }}
            >
              {dict.home.presenceTitle}
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.7, margin: 0 }}>
              {dict.home.presenceDesc}
            </p>
          </div>

          <div>
            <Link href={`/${locale}/presence`} style={{ textDecoration: 'none' }}>
              <Button variant="accent" size="lg" icon={<IconMapPin size={18} />}>
                <span>{dict.home.viewPresence}</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
