import Link from 'next/link';
import { DEFAULT_LOCALE, getDictionary, isValidLocale, type Locale } from '../../lib/i18n';
import { demoStore } from '../../lib/demo/store';
import { Badge, Button, Card, CardContent, CardFooter, CardTitle } from '../../components/ui';
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
  IconArrowRight,
  IconArrowLeft,
  IconBookOpen,
  IconBuilding,
} from '../../components/icons';
import {
  SectionReveal,
  MetricCounter,
  HeroEntrance,
  StaggeredReveal,
  YemenMapSection,
} from '../../components/home/HomeClientComponents';

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
  const publications = demoStore.getPublications().slice(0, 3);
  const stories = demoStore
    .getContentItems()
    .filter((c) => c.status === 'PUBLISHED' && c.type === 'story')
    .slice(0, 2);

  const isAr = locale === 'ar';
  const NextArrow = isAr ? IconChevronLeft : IconChevronRight;
  const CtaArrow = isAr ? IconArrowLeft : IconArrowRight;

  return (
    <div>
      {/* 1. Asymmetric Institutional Hero Section — Integrated with Transparent Header */}
      <section
        style={{
          marginBlockStart: 'calc(-1 * var(--header-height))',
          paddingBlockStart: 'calc(var(--header-height) + clamp(3rem, 5vw, 5rem))',
          paddingBlockEnd: 'clamp(3.5rem, 6vw, 6rem)',
          background: 'linear-gradient(135deg, #040f1e 0%, #091d36 52%, #0f325a 100%)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          borderBlockEnd: '3px solid var(--color-brand-accent)',
        }}
      >
        {/* Background Editorial Highland Dawn Image Layer */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/images/editorial/hero-highland-dawn.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.18,
            mixBlendMode: 'luminosity',
            pointerEvents: 'none',
          }}
        />
        {/* Gradient Vignette Overlay for High-Contrast Readability */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(4, 15, 30, 0.85) 0%, rgba(9, 29, 54, 0.72) 50%, rgba(5, 19, 36, 0.94) 100%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: 'clamp(2.5rem, 4.5vw, 4.5rem)',
              alignItems: 'center',
            }}
          >
            {/* Start Column: Eyebrow, Editorial Headline, Mission & Actions */}
            <HeroEntrance delay={80}>
              {/* Eyebrow Badge */}
              <div style={{ marginBlockEnd: 'var(--space-4)' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0.95rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: '#f8fafc',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <IconShield size={14} style={{ color: 'var(--color-gold-400)' }} />
                  <span>{dict.home.heroBadge}</span>
                </span>
              </div>

              {/* Main Display Headline */}
              <h1
                className="font-display"
                style={{
                  fontSize: 'clamp(2.15rem, 1.7rem + 2.1vw, 3.45rem)',
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: isAr ? 1.32 : 1.18,
                  marginBlockEnd: 'var(--space-5)',
                }}
              >
                {isAr ? (
                  <>
                    ترسيخ <span style={{ color: 'var(--color-gold-400)' }}>السلام الاجتماعي</span> وحماية سيادة القانون وصون الكرامة الإنسانية
                  </>
                ) : (
                  <>
                    Advancing <span style={{ color: 'var(--color-gold-400)' }}>Social Peace</span>, Legal Protection & the Rule of Law
                  </>
                )}
              </h1>

              {/* Supporting Mission Copy */}
              <p
                style={{
                  fontSize: 'clamp(1rem, 0.95rem + 0.3vw, 1.15rem)',
                  color: 'rgba(248, 250, 252, 0.88)',
                  lineHeight: 1.78,
                  marginBlockEnd: 'var(--space-8)',
                  maxWidth: '600px',
                }}
              >
                {dict.home.heroSubtitle}
              </p>

              {/* Dual Action CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9rem', marginBlockEnd: 'var(--space-10)' }}>
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

              {/* Verified Institutional Scope Indicators (Responsible Animated Metrics) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 'var(--space-4)',
                  borderBlockStart: '1px solid rgba(255, 255, 255, 0.16)',
                  paddingBlockStart: 'var(--space-6)',
                  maxWidth: '560px',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
                    <MetricCounter value={3} locale={locale} />
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginTop: '0.3rem' }}>
                    {isAr ? 'مقرات عملياتية (تعز • مأرب • صنعاء)' : 'Operational Hubs (Taiz • Marib • Sanaa)'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-gold-400)', lineHeight: 1 }}>
                    <MetricCounter value={4} locale={locale} />
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginTop: '0.3rem' }}>
                    {isAr ? 'محاور تدخل استراتيجية' : 'Strategic Focus Pillars'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8', lineHeight: 1 }}>
                    <MetricCounter value={5} locale={locale} />
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginTop: '0.3rem' }}>
                    {isAr ? 'أهداف مؤسسية لعام 2030' : '2030 Institutional Goals'}
                  </div>
                </div>
              </div>
            </HeroEntrance>

            {/* End Column: Layered Editorial Visual & Institutional Factsheet */}
            <HeroEntrance delay={240} style={{ position: 'relative' }}>
              <div
                style={{
                  backgroundColor: 'rgba(10, 25, 47, 0.72)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-2xl)',
                  backdropFilter: 'blur(16px)',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.55)',
                  color: '#ffffff',
                }}
              >
                {/* Curated Visual Storytelling Banner */}
                <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
                  <img
                    src="/images/editorial/dialogue-table.jpg"
                    alt={
                      isAr
                        ? 'طاولة الحوار والوساطة المجتمعية وسيادة القانون'
                        : 'Community dialogue table and scales of justice'
                    }
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(5, 19, 36, 0.15) 0%, rgba(10, 25, 47, 0.92) 100%)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0.85rem',
                      insetInlineStart: '1.25rem',
                      insetInlineEnd: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#ffffff' }}>
                        {isAr ? 'بطاقة التعريف والالتزام المؤسسي' : 'Institutional Mandate & Scope'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                        {isAr ? 'مؤسسة حماية القانون وتعزيز السلم الاجتماعي' : 'SPPLPF • Taiz • Marib • Sanaa'}
                      </div>
                    </div>
                    <span
                      style={{
                        padding: '0.2rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'rgba(5, 150, 105, 0.35)',
                        border: '1px solid rgba(52, 211, 153, 0.5)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#a7f3d0',
                      }}
                    >
                      {isAr ? 'حياد واستقلالية' : 'Impartial & Independent'}
                    </span>
                  </div>
                </div>

                {/* 3 Snapshot Highlights */}
                <div style={{ padding: '1.35rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Highlight 1: Local Mediation */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      padding: '0.75rem 0.95rem',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid rgba(255, 255, 255, 0.09)',
                    }}
                  >
                    <div
                      style={{
                        padding: '0.45rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(245, 158, 11, 0.2)',
                        color: 'var(--color-gold-400)',
                        flexShrink: 0,
                      }}
                    >
                      <IconHandshake size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f8fafc' }}>
                        {isAr ? 'الوساطة المجتمعية وفض النزاعات' : 'Local Community Mediation'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.15rem' }}>
                        {isAr
                          ? 'تمكين لجان المصالحة المحلية وتيسير المبادرات الإنسانية'
                          : 'Empowering local reconciliation committees & humanitarian truce pacts'}
                      </div>
                    </div>
                  </div>

                  {/* Highlight 2: Detainees Legal Aid */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      padding: '0.75rem 0.95rem',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid rgba(255, 255, 255, 0.09)',
                    }}
                  >
                    <div
                      style={{
                        padding: '0.45rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(14, 165, 233, 0.2)',
                        color: '#38bdf8',
                        flexShrink: 0,
                      }}
                    >
                      <IconScale size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f8fafc' }}>
                        {isAr ? 'الحماية القانونية وسيادة القانون' : 'Legal Protection & Fair Trial Safeguards'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.15rem' }}>
                        {isAr
                          ? 'تقديم العون القضائي المجاني ومراقبة ضمانات الاحتجاز القانونية'
                          : 'Pro-bono legal defense & oversight of lawful detention procedures'}
                      </div>
                    </div>
                  </div>

                  {/* Highlight 3: Women & Youth Committees */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      padding: '0.75rem 0.95rem',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid rgba(255, 255, 255, 0.09)',
                    }}
                  >
                    <div
                      style={{
                        padding: '0.45rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        color: '#6ee7b7',
                        flexShrink: 0,
                      }}
                    >
                      <IconUsers size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f8fafc' }}>
                        {isAr ? 'تمكين النساء والشباب في صناعة السلام' : 'Women & Youth Peace Leadership'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.15rem' }}>
                        {isAr
                          ? 'تأهيل القيادات الشابة والنسوية للمشاركة الفاعلة في صنع القرار'
                          : 'Equipping women and youth to lead local conflict resolution'}
                      </div>
                    </div>
                  </div>

                  {/* Institutional Quote Footer */}
                  <div
                    style={{
                      borderBlockStart: '1px solid rgba(255, 255, 255, 0.12)',
                      paddingBlockStart: '0.75rem',
                      marginTop: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      color: '#cbd5e1',
                    }}
                  >
                    <span className="font-display" style={{ fontStyle: 'italic' }}>
                      {isAr
                        ? '«السلام المستدام ينطلق من سيادة العدالة وصون كرامة الإنسان»'
                        : '“Sustainable peace begins with the rule of law and human dignity.”'}
                    </span>
                    <Link
                      href={`/${locale}/legal/neutrality`}
                      style={{ color: 'var(--color-gold-400)', fontWeight: 700, fontSize: '0.72rem', whiteSpace: 'nowrap' }}
                    >
                      {isAr ? 'ميثاق الحياد' : 'Neutrality Charter'}
                    </Link>
                  </div>
                </div>
              </div>
            </HeroEntrance>
          </div>
        </div>
      </section>

      {/* 2. Institutional Identity & Editorial Introduction Strip */}
      <section className="section section-alt" style={{ paddingBlock: 'clamp(3rem, 5vw, 4.5rem)' }}>
        <div className="container">
          <SectionReveal>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'clamp(2rem, 4vw, 3.5rem)',
                alignItems: 'center',
              }}
            >
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-brand-primary-light)',
                    color: 'var(--color-brand-primary)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    marginBlockEnd: 'var(--space-3)',
                  }}
                >
                  {isAr ? 'رسالتنا وهويتنا المؤسسية' : 'Institutional Identity & Mandate'}
                </span>
                <h2
                  className="font-display"
                  style={{
                    fontSize: 'clamp(1.65rem, 1.35rem + 1vw, 2.35rem)',
                    color: 'var(--color-brand-primary)',
                    lineHeight: 1.3,
                    marginBlockEnd: 'var(--space-4)',
                  }}
                >
                  {isAr
                    ? 'جسر مدني مستقل لحماية الحقوق القانونية وتجسير الفجوات المجتمعية'
                    : 'An Independent Civic Bridge Safeguarding Legal Rights and Social Cohesion'}
                </h2>
                <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                  {isAr
                    ? 'تعمل مؤسسة حماية القانون وتعزيز السلم الاجتماعي (حماية) كمنظمة مجتمع مدني يمنية مرخصة ومستقلة، تنطلق من إيمان راسخ بأن استدامة السلم الأهلي ترتبط ارتباطاً وثيقاً بإنصاف الضحايا، سيادة القانون، وتمكين الوسطاء المحليين والقيادات النسوية والشبابية من صياغة حلول محلية مستدامة.'
                    : 'The Law Protection & Social Peace Foundation (Provisional translation pending approval under OQ-001) operates as an independent Yemeni civil society organization dedicated to the conviction that durable social peace relies on legal accountability, fair trial safeguards, and community-led mediation.'}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBlockStart: 'var(--space-6)' }}>
                  <Link href={`/${locale}/about`} style={{ textDecoration: 'none' }}>
                    <Button variant="primary" size="md" icon={<NextArrow size={15} />}>
                      {isAr ? 'تعرّف على المؤسسة' : 'About the Foundation'}
                    </Button>
                  </Link>
                  <Link href={`/${locale}/about/values`} style={{ textDecoration: 'none' }}>
                    <Button variant="outline" size="md">
                      {dict.nav.values}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Architectural Visual & Core Values Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-subtle)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--color-border-subtle)',
                    padding: '1.35rem',
                  }}
                >
                  <IconScale size={22} style={{ color: 'var(--color-brand-primary)', marginBlockEnd: '0.6rem' }} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBlockEnd: '0.35rem' }}>
                    {isAr ? 'سيادة القانون والكرامة' : 'Rule of Law & Dignity'}
                  </h3>
                  <p style={{ fontSize: '0.84375rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: 0 }}>
                    {isAr
                      ? 'الدفاع عن الحقوق الدستورية ومكافحة الاحتجاز خارج إطار القانون.'
                      : 'Defending constitutional protections and curtailing unlawful detention.'}
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--color-bg-subtle)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--color-border-subtle)',
                    padding: '1.35rem',
                  }}
                >
                  <IconShield size={22} style={{ color: 'var(--color-brand-accent)', marginBlockEnd: '0.6rem' }} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBlockEnd: '0.35rem' }}>
                    {isAr ? 'الحياد الإيجابي المستقل' : 'Impartial Neutrality'}
                  </h3>
                  <p style={{ fontSize: '0.84375rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: 0 }}>
                    {isAr
                      ? 'مسافة مهنية متساوية تضمن قبول الوسطاء لدى مختلف الأطراف.'
                      : 'Strict non-alignment ensuring mediator credibility across divides.'}
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--color-bg-subtle)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--color-border-subtle)',
                    padding: '1.35rem',
                  }}
                >
                  <IconUsers size={22} style={{ color: 'var(--color-brand-secondary)', marginBlockEnd: '0.6rem' }} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBlockEnd: '0.35rem' }}>
                    {isAr ? 'التنوع والشمول المجتمعي' : 'Inclusion & Diversity'}
                  </h3>
                  <p style={{ fontSize: '0.84375rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: 0 }}>
                    {isAr
                      ? 'إشراك النساء والشباب والوجهاء الاجتماعيين في صناعة التوافق.'
                      : 'Engaging women, youth, and civic elders in local consensus-building.'}
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--color-bg-subtle)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--color-border-subtle)',
                    padding: '1.35rem',
                  }}
                >
                  <IconCheck size={22} style={{ color: 'var(--color-brand-success)', marginBlockEnd: '0.6rem' }} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBlockEnd: '0.35rem' }}>
                    {isAr ? 'الشفافية والحوكمة' : 'Transparency & Accountability'}
                  </h3>
                  <p style={{ fontSize: '0.84375rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: 0 }}>
                    {isAr
                      ? 'امتثال مؤسسي ومالي دقيق يعزز ثقة المجتمعات والشركاء.'
                      : 'Rigorous compliance and governance standards earning partner trust.'}
                  </p>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* 3. Four Strategic Pillars Section */}
      <section className="section section-warm">
        <div className="container">
          <SectionReveal>
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
              <h2
                className="font-display"
                style={{
                  fontSize: 'clamp(1.75rem, 1.4rem + 1vw, 2.5rem)',
                  color: 'var(--color-brand-primary)',
                  marginBlockEnd: 'var(--space-3)',
                }}
              >
                {dict.home.focusAreasTitle}
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
                {dict.home.focusAreasSubtitle}
              </p>
            </div>
          </SectionReveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* Pillar 1: Local Mediation */}
            <StaggeredReveal index={0}>
              <Card
                hoverEffect
                className="card-interactive"
                style={{ borderTop: '4px solid var(--color-brand-accent)', display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div
                  className="card-icon"
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
                    className="editorial-link"
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: 'var(--color-brand-accent)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <span>{dict.common.readMore}</span>
                    <span className="link-arrow"><NextArrow size={14} /></span>
                  </Link>
                </CardFooter>
              </Card>
            </StaggeredReveal>

            {/* Pillar 2: Rule of Law & Legal Aid */}
            <StaggeredReveal index={1}>
              <Card
                hoverEffect
                className="card-interactive"
                style={{ borderTop: '4px solid var(--color-brand-primary)', display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div
                  className="card-icon"
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
                    className="editorial-link"
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
                    <span className="link-arrow"><NextArrow size={14} /></span>
                  </Link>
                </CardFooter>
              </Card>
            </StaggeredReveal>

            {/* Pillar 3: Women & Youth Leadership */}
            <StaggeredReveal index={2}>
              <Card
                hoverEffect
                className="card-interactive"
                style={{ borderTop: '4px solid var(--color-brand-secondary)', display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div
                  className="card-icon"
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
                    className="editorial-link"
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: 'var(--color-brand-secondary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <span>{dict.common.readMore}</span>
                    <span className="link-arrow"><NextArrow size={14} /></span>
                  </Link>
                </CardFooter>
              </Card>
            </StaggeredReveal>

            {/* Pillar 4: Institutional Governance & Integrity */}
            <StaggeredReveal index={3}>
              <Card
                hoverEffect
                className="card-interactive"
                style={{ borderTop: '4px solid var(--color-brand-success)', display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div
                  className="card-icon"
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
                    className="editorial-link"
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: 'var(--color-brand-success)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <span>{dict.common.readMore}</span>
                    <span className="link-arrow"><NextArrow size={14} /></span>
                  </Link>
                </CardFooter>
              </Card>
            </StaggeredReveal>
          </div>
        </div>
      </section>

      {/* 4. Featured Field Programs Section — Differentiated Program Cards */}
      <section className="section">
        <div className="container">
          <SectionReveal>
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
                  className="font-display"
                  style={{
                    fontSize: 'clamp(1.65rem, 1.3rem + 1vw, 2.35rem)',
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
                className="editorial-link"
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
                <span className="link-arrow"><NextArrow size={16} /></span>
              </Link>
            </div>
          </SectionReveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {programs.map((p, idx) => (
              <StaggeredReveal key={p.id} index={idx}>
                <Card
                  hoverEffect
                  className="card-interactive"
                  style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0, overflow: 'hidden' }}
                >
                  {/* Thematic Program Header Banner */}
                  <div
                    style={{
                      padding: '1.15rem 1.5rem',
                      background:
                        p.pillar === 'mediation'
                          ? 'linear-gradient(135deg, #0a1e38 0%, #194677 100%)'
                          : p.pillar === 'legal'
                            ? 'linear-gradient(135deg, #051324 0%, #0f325a 100%)'
                            : 'linear-gradient(135deg, #0f2747 0%, #0369a1 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#e2e8f0',
                      }}
                    >
                      <IconMapPin size={13} style={{ color: 'var(--color-gold-400)' }} />
                      <span>{p.location}</span>
                    </span>
                    <Badge variant="accent" size="sm">
                      {p.pillar.toUpperCase()}
                    </Badge>
                  </div>

                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <CardTitle style={{ fontSize: '1.15rem', lineHeight: 1.4 }}>
                      <Link href={`/${locale}/programs/${p.slug}`} style={{ color: 'inherit' }}>
                        {isAr ? p.titleAr : p.titleEn}
                      </Link>
                    </CardTitle>

                    <CardContent>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBlockEnd: '1rem' }}>
                        {isAr ? p.descriptionAr : p.descriptionEn}
                      </p>

                      {/* Key Objective Preview */}
                      <div
                        style={{
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--color-bg-subtle)',
                          borderInlineStart: '3px solid var(--color-brand-secondary)',
                          fontSize: '0.78rem',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {(isAr ? p.objectivesAr : p.objectivesEn)[0]}
                      </div>
                    </CardContent>

                    <CardFooter style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                      <Link
                        href={`/${locale}/programs/${p.slug}`}
                        className="editorial-link"
                        style={{
                          fontSize: '0.84375rem',
                          fontWeight: 700,
                          color: 'var(--color-brand-primary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <span>{isAr ? 'استعراض بطاقة البرنامج' : 'Explore Program Details'}</span>
                        <span className="link-arrow"><NextArrow size={14} /></span>
                      </Link>
                    </CardFooter>
                  </div>
                </Card>
              </StaggeredReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Interactive Geographic Presence — Real Yemen GeoJSON Map */}
      <section className="section section-warm">
        <div className="container">
          <SectionReveal>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginBlockEnd: 'var(--space-8)',
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
                  {isAr ? 'الانتشار الميداني المعتمد' : 'Verified Geographic Footprint'}
                </span>
                <h2
                  className="font-display"
                  style={{
                    fontSize: 'clamp(1.65rem, 1.3rem + 1vw, 2.35rem)',
                    color: 'var(--color-brand-primary)',
                    margin: 0,
                    marginTop: '0.25rem',
                  }}
                >
                  {dict.home.presenceTitle}
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', margin: 0, marginTop: '0.35rem', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '640px' }}>
                  {dict.home.presenceDesc}
                </p>
              </div>
              <Link
                href={`/${locale}/presence`}
                className="editorial-link"
                style={{
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  color: 'var(--color-brand-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>{dict.home.viewPresence}</span>
                <span className="link-arrow"><NextArrow size={16} /></span>
              </Link>
            </div>
          </SectionReveal>

          <SectionReveal delay={120}>
            <YemenMapSection locale={locale} />
          </SectionReveal>
        </div>
      </section>

      {/* 6. Latest News & Field Updates (Editorial Layout) */}
      <section className="section section-alt">
        <div className="container">
          <SectionReveal>
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
                  {isAr ? 'بيانات وتغطيات ميدانية (نماذج معاينة)' : 'Field Dispatches (Provisional Demo Records)'}
                </span>
                <h2
                  className="font-display"
                  style={{
                    fontSize: 'clamp(1.65rem, 1.3rem + 1vw, 2.35rem)',
                    color: 'var(--color-brand-primary)',
                    marginBlockEnd: '0.25rem',
                    marginTop: '0.25rem',
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
                className="editorial-link"
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
                <span className="link-arrow"><NextArrow size={16} /></span>
              </Link>
            </div>
          </SectionReveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {newsItems.map((item, idx) => (
              <StaggeredReveal key={item.id} index={idx}>
                <Card hoverEffect className="card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.45rem',
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)',
                      marginBlockEnd: 'var(--space-3)',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-bg-subtle)',
                        color: 'var(--color-brand-primary)',
                        fontWeight: 700,
                      }}
                    >
                      {item.category}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <IconCalendar size={13} />
                      <span>{item.publishedAt}</span>
                    </span>
                  </div>

                  <CardTitle style={{ fontSize: '1.125rem', lineHeight: 1.45 }}>
                    <Link href={`/${locale}/news/${item.slug}`} style={{ color: 'inherit' }}>
                      {isAr ? item.titleAr : item.titleEn}
                    </Link>
                  </CardTitle>

                  <CardContent>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.68 }}>
                      {isAr ? item.summaryAr : item.summaryEn}
                    </p>
                  </CardContent>

                  <CardFooter style={{ marginTop: 'auto' }}>
                    <Link
                      href={`/${locale}/news/${item.slug}`}
                      className="editorial-link"
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
                      <span className="link-arrow"><NextArrow size={14} /></span>
                    </Link>
                  </CardFooter>
                </Card>
              </StaggeredReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Qualitative Impact Stories & Featured Publications Split Section */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-canvas)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: 'clamp(2rem, 4vw, 3.5rem)',
              alignItems: 'start',
            }}
          >
            {/* Column A: Impact Stories */}
            <SectionReveal>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-6)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-brand-accent)', textTransform: 'uppercase' }}>
                      {isAr ? 'أثر الوساطة في الميدان (نماذج تجريبية)' : 'Grassroots Impact (Provisional Narratives)'}
                    </span>
                    <h2 className="font-display" style={{ fontSize: '1.65rem', color: 'var(--color-brand-primary)', margin: 0, marginTop: '0.2rem' }}>
                      {isAr ? 'قصص الأثر والتماسك المجتمعي' : 'Stories of Impact & Cohesion'}
                    </h2>
                  </div>
                  <Link
                    href={`/${locale}/stories`}
                    className="editorial-link"
                    style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-brand-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <span>{dict.common.viewAll}</span>
                    <span className="link-arrow"><NextArrow size={15} /></span>
                  </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {stories.map((story) => (
                    <div
                      key={story.id}
                      style={{
                        backgroundColor: 'var(--color-bg-surface)',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--color-border-subtle)',
                        borderInlineStart: '4px solid var(--color-brand-accent)',
                        padding: '1.75rem',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                      className="card-hover"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: '0.75rem' }}>
                        <Badge variant="accent" size="sm">{story.category}</Badge>
                        <span className="font-display" style={{ fontSize: '2.25rem', color: 'var(--color-gold-500)', lineHeight: 0.8 }}>“</span>
                      </div>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--color-brand-primary)', lineHeight: 1.45, marginBlockEnd: '0.65rem' }}>
                        <Link href={`/${locale}/news/${story.slug}`} style={{ color: 'inherit' }}>
                          {isAr ? story.titleAr : story.titleEn}
                        </Link>
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBlockEnd: '1rem' }}>
                        {isAr ? story.summaryAr : story.summaryEn}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.75rem', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        <span>{story.author}</span>
                        <Link
                          href={`/${locale}/news/${story.slug}`}
                          style={{ fontWeight: 700, color: 'var(--color-brand-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <span>{isAr ? 'قراءة القصة' : 'Read Story'}</span>
                          <NextArrow size={13} />
                        </Link>
                      </div>
                    </div>
                  ))}

                  {/* Editorial Visual Card */}
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: 'var(--radius-xl)',
                      overflow: 'hidden',
                      height: '200px',
                      border: '1px solid var(--color-border-subtle)',
                    }}
                  >
                    <img
                      src="/images/editorial/arch-detail.jpg"
                      alt={isAr ? 'تفصيل معماري يرمز لسيادة القانون والعدالة' : 'Architectural threshold symbolizing rule of law'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(90deg, rgba(5, 19, 36, 0.88) 0%, rgba(5, 19, 36, 0.45) 100%)',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        color: '#ffffff',
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-gold-400)', fontWeight: 700, marginBlockEnd: '0.25rem' }}>
                        {isAr ? 'ميثاق العمل المهني' : 'Operational Ethos'}
                      </span>
                      <h4 className="font-display" style={{ fontSize: '1.25rem', color: '#ffffff', marginBlockEnd: '0.5rem' }}>
                        {isAr ? 'الالتزام الصارم بمبادئ الحياد وعدم إلحاق الضرر' : 'Strict Adherence to Do-No-Harm & Humanitarian Neutrality'}
                      </h4>
                      <Link href={`/${locale}/legal/neutrality`} style={{ color: '#38bdf8', fontSize: '0.8125rem', fontWeight: 700 }}>
                        {isAr ? 'اطلع على ميثاق الحياد والاستقلالية ←' : 'Read the Neutrality Charter →'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SectionReveal>

            {/* Column B: Featured Publications */}
            <SectionReveal delay={150}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-6)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-brand-secondary)', textTransform: 'uppercase' }}>
                      {isAr ? 'إصدارات بحثية وأدلة إجرائية' : 'Policy Papers & Legal Manuals'}
                    </span>
                    <h2 className="font-display" style={{ fontSize: '1.65rem', color: 'var(--color-brand-primary)', margin: 0, marginTop: '0.2rem' }}>
                      {dict.home.featuredPubsTitle}
                    </h2>
                  </div>
                  <Link
                    href={`/${locale}/publications`}
                    className="editorial-link"
                    style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-brand-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <span>{dict.common.viewAll}</span>
                    <span className="link-arrow"><NextArrow size={15} /></span>
                  </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {publications.map((pub) => (
                    <div
                      key={pub.id}
                      style={{
                        backgroundColor: 'var(--color-bg-surface)',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--color-border-subtle)',
                        padding: '1.35rem',
                        display: 'flex',
                        gap: '1.15rem',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                      className="card-hover"
                    >
                      {/* Document Folio Cover Treatment */}
                      <div
                        style={{
                          width: '3.75rem',
                          height: '5rem',
                          borderRadius: 'var(--radius-md)',
                          background: 'linear-gradient(145deg, var(--color-navy-950) 0%, var(--color-navy-800) 100%)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.2rem',
                          flexShrink: 0,
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <IconFileText size={20} style={{ color: '#ffffff' }} />
                        <span style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--color-gold-400)' }}>PDF</span>
                      </div>

                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBlockEnd: '0.25rem' }}>
                            <span style={{ fontWeight: 700, color: 'var(--color-brand-secondary)' }}>{pub.category}</span> • {pub.pages} {isAr ? 'صفحة' : 'pages'} • {pub.fileSize}
                          </div>
                          <h3 style={{ fontSize: '1rem', color: 'var(--color-brand-primary)', lineHeight: 1.4, marginBlockEnd: '0.35rem' }}>
                            {isAr ? pub.titleAr : pub.titleEn}
                          </h3>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBlockEnd: '0.65rem' }}>
                            {isAr ? pub.summaryAr : pub.summaryEn}
                          </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                            {pub.publishedAt}
                          </span>
                          <Link
                            href={`/${locale}/publications`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.8125rem',
                              fontWeight: 700,
                              color: 'var(--color-brand-primary)',
                            }}
                          >
                            <IconDownload size={14} style={{ color: 'var(--color-brand-secondary)' }} />
                            <span>{dict.common.downloadPdf}</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* 8. Concluding Institutional Call-to-Action Banner */}
      <section className="section section-navy" style={{ paddingBlock: 'clamp(3rem, 5vw, 4.5rem)' }}>
        <div className="container">
          <SectionReveal>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '2rem',
              }}
            >
              <div style={{ maxWidth: '640px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'var(--color-gold-400)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginBlockEnd: '0.75rem',
                  }}
                >
                  {isAr ? 'التواصل والتنسيق المؤسسي' : 'Institutional Outreach & Legal Aid'}
                </span>
                <h2 className="font-display" style={{ fontSize: 'clamp(1.65rem, 1.35rem + 1vw, 2.25rem)', color: '#ffffff', marginBlockEnd: '0.75rem' }}>
                  {isAr
                    ? 'هل تبحثون عن استشارة قانونية، أو ترغبون في بناء شراكة مجتمعية؟'
                    : 'Seeking Legal Aid Consultation or Exploring Institutional Partnerships?'}
                </h2>
                <p style={{ fontSize: '0.95rem', color: 'rgba(248, 250, 252, 0.85)', lineHeight: 1.75, margin: 0 }}>
                  {isAr
                    ? 'تستقبل فرقنا المتخصصة في تعز ومأرب وصنعاء طلبات العون القضائي، ومبادرات التنسيق الإنساني، واستفسارات الشركاء والباحثين بسرية ومهنية تامة.'
                    : 'Our teams in Taiz, Marib, and Sanaa receive legal aid inquiries, mediation requests, and research partnership communications with strict confidentiality.'}
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
                <Link href={`/${locale}/contact`} style={{ textDecoration: 'none' }}>
                  <Button variant="accent" size="lg" icon={<CtaArrow size={18} />}>
                    {isAr ? 'تواصل مع فريقنا الآن' : 'Contact Our Team'}
                  </Button>
                </Link>
                <Link href={`/${locale}/presence`} style={{ textDecoration: 'none' }}>
                  <Button variant="outline-white" size="lg">
                    {isAr ? 'عناوين المكاتب الميدانية' : 'Field Office Directory'}
                  </Button>
                </Link>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
