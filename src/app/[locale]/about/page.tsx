import Link from 'next/link';
import { DEFAULT_LOCALE, getDictionary, isValidLocale, type Locale } from '../../../lib/i18n';
import { Breadcrumbs, PageHeader } from '../../../components/layout';
import { Badge, Card, CardContent, CardTitle } from '../../../components/ui';
import { IconCheck, IconMapPin, IconScale, IconShield, IconUsers } from '../../../components/icons';
import { RevealOnScroll } from '../../../components/motion';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const isAr = locale === 'ar';

  return (
    <div>
      <PageHeader
        title={dict.nav.about}
        subtitle={
          isAr
            ? 'مؤسسة يمنية مستقلة غير حكومية تعمل على تعزيز السلام الاجتماعي، الحماية القانونية، وحماية الحقوق والحريات.'
            : 'An independent Yemeni NGO dedicated to advancing social peace, human rights, and the rule of law.'
        }
        badge={<Badge variant="primary">{dict.common.orgSubtitle}</Badge>}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            items={[{ label: dict.nav.about }]}
          />
        }
      />

      <div className="container" style={{ paddingBlockEnd: 'var(--space-16)' }}>
        {/* Navigation Tabs for About Section */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
            marginBlockEnd: 'var(--space-10)',
            borderBlockEnd: '1px solid var(--color-border-subtle)',
            paddingBlockEnd: 'var(--space-3)',
          }}
        >
          <Link
            href={`/${locale}/about`}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-brand-primary)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 'var(--text-sm)',
              textDecoration: 'none',
            }}
          >
            {dict.nav.aboutOverview}
          </Link>
          <Link
            href={`/${locale}/about/values`}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-bg-surface)',
              color: 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
              border: '1px solid var(--color-border-subtle)',
              textDecoration: 'none',
            }}
          >
            {dict.nav.values}
          </Link>
          <Link
            href={`/${locale}/about/goals`}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-bg-surface)',
              color: 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
              border: '1px solid var(--color-border-subtle)',
              textDecoration: 'none',
            }}
          >
            {dict.nav.goals}
          </Link>
          <Link
            href={`/${locale}/about/milestones`}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-bg-surface)',
              color: 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
              border: '1px solid var(--color-border-subtle)',
              textDecoration: 'none',
            }}
          >
            {dict.nav.milestones}
          </Link>
        </div>

        {/* Narrative Section 1: Who We Are + Editorial Visual Frame */}
        <RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-10)', alignItems: 'center', marginBlockEnd: 'var(--space-14)' }}>
            <div>
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 800,
                  color: 'var(--color-brand-accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  display: 'block',
                  marginBlockEnd: 'var(--space-2)',
                }}
              >
                {isAr ? 'النبذة التعريفية الرسمية' : 'Institutional Profile'}
              </span>
              <h2 className="font-display" style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-4)', lineHeight: 1.25 }}>
                {isAr ? 'من نحن: مؤسسة حماية القانون وتعزيز السلم الاجتماعي' : 'Who We Are: Law Protection & Social Peace Foundation'}
              </h2>
              <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.85, color: 'var(--color-text-secondary)', marginBlockEnd: 'var(--space-4)' }}>
                {isAr
                  ? 'مؤسسة حماية القانون وتعزيز السلم الاجتماعي (حماية) منظمة مجتمع مدني يمنية غير ربحية وغير حزبية، مرخصة وتعمل بموجب القوانين النافذة. انطلقت المؤسسة استجابة للحاجة الإنسانية والاجتماعية الملحة لحماية الحقوق الأساسية للمدنيين وتعزيز ثقافة السلام وسيادة القانون في ظل التحديات المعقدة التي يمر بها اليمن.'
                  : 'The Law Protection & Social Peace Foundation (Himaaya - Provisional English translation under OQ-001) is an independent, non-profit, and non-partisan Yemeni civil society organization. Established in response to the acute humanitarian and civic imperative, the foundation safeguards civilian rights, promotes sustainable peace, and bolsters the rule of law amidst Yemen\'s complex landscape.'}
              </p>
              <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.85, color: 'var(--color-text-secondary)', marginBlockEnd: 'var(--space-6)' }}>
                {isAr
                  ? 'تعتمد المؤسسة على الشراكة الوثيقة مع المجتمعات المحلية والمنظمات الإنسانية والمانحين الدوليين، لبناء قدرات الوسطاء المحليين، وتقديم العون القضائي للمستضعفين، وتعزيز المشاركة الفاعلة للشباب والنساء في صنع القرار المحلي والمصالحة المجتمعية.'
                  : 'Through deep-rooted partnerships with local communities, international donors, and humanitarian agencies, the foundation builds the capacities of local mediators, provides pro-bono legal defense for the vulnerable, and fosters youth and women leadership in local governance and community reconciliation.'}
              </p>

              {/* Verified Facts Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
                <div style={{ padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border-subtle)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 700, display: 'block' }}>
                    {isAr ? 'الوضع القانوني' : 'Legal Status'}
                  </span>
                  <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-brand-primary)' }}>
                    {isAr ? 'منظمة مجتمع مدني مستقلة غير ربحية' : 'Independent Non-Profit CSO'}
                  </strong>
                </div>
                <div style={{ padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border-subtle)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 700, display: 'block' }}>
                    {isAr ? 'نطاق التواجد المعتمد' : 'Verified Operational Hubs'}
                  </span>
                  <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-brand-primary)' }}>
                    {isAr ? 'تعز (المقر الرئيسي) • مأرب • صنعاء' : 'Taiz (HQ) • Marib • Sanaa'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Editorial Visual & Mission/Vision Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <div
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  height: '220px',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <img
                  src="/images/editorial/dialogue-table.jpg"
                  alt=""
                  aria-hidden="true"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(12,30,53,0.2) 0%, rgba(12,30,53,0.85) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: 'var(--space-5)',
                    color: '#ffffff',
                  }}
                >
                  <span style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {isAr ? 'الالتزام المؤسسي' : 'Institutional Mandate'}
                  </span>
                  <p className="font-display" style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: '0.25rem 0 0 0', color: '#ffffff' }}>
                    {isAr
                      ? 'حماية الحقوق القانونية وبناء جسور التوافق المجتمعي بحياد واستقلالية.'
                      : 'Safeguarding legal rights and building bridges of community consensus with impartiality.'}
                  </p>
                </div>
              </div>

              <Card style={{ borderInlineStart: '4px solid var(--color-brand-primary)' }}>
                <CardTitle>{isAr ? 'رسالتنا المؤسسية' : 'Our Mission'}</CardTitle>
                <CardContent>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.75, margin: 0 }}>
                    {isAr
                      ? 'العمل الدؤوب لتحقيق مجتمع يسوده السلام والعدالة عبر تمكين النساء والشباب، وتوفير الحماية القانونية، ودعم مبادرات الوساطة والتنمية المستدامة في المجتمعات المحلية.'
                      : 'Striving towards a society characterized by peace and justice by empowering women and youth, providing robust legal protection, and fostering local mediation initiatives across communities.'}
                  </p>
                </CardContent>
              </Card>

              <Card style={{ borderInlineStart: '4px solid var(--color-brand-secondary)' }}>
                <CardTitle>{isAr ? 'رؤيتنا المستقبلية (2030)' : 'Our Vision (2030)'}</CardTitle>
                <CardContent>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.75, margin: 0 }}>
                    {isAr
                      ? 'نحو مجتمع يمني يتمتع فيه الجميع بالعدالة والمساواة، وتلعب فيه النساء والشباب دوراً ريادياً في صنع القرار وبناء السلام بحلول عام 2030.'
                      : 'Towards a Yemeni society where all individuals enjoy justice and equality, with women and youth playing an active leadership role in decision-making and sustainable peace by 2030.'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </RevealOnScroll>

        {/* Narrative Section 2: Core Focus Areas */}
        <RevealOnScroll>
          <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: 'clamp(1.75rem, 3.5vw, 2.75rem)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 className="font-display" style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-6)' }}>
              {isAr ? 'مرتكزات النهج المؤسسي' : 'Institutional Approach Pillars'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)' }}>
              <div style={{ padding: 'var(--space-5)', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
                <h4 style={{ fontSize: 'var(--text-base)', color: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBlockEnd: 'var(--space-2)' }}>
                  <IconScale size={20} style={{ color: 'var(--color-brand-secondary)' }} />
                  <span>{isAr ? 'النزاهة والاستقلالية' : 'Integrity & Neutrality'}</span>
                </h4>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
                  {isAr
                    ? 'الالتزام التام بمبادئ العمل الإنساني والحياد الإيجابي وعدم الانحياز لأي طرف سياسي أو مناطقي.'
                    : 'Strict adherence to humanitarian principles, operational impartiality, and independence from all political factions.'}
                </p>
              </div>
              <div style={{ padding: 'var(--space-5)', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
                <h4 style={{ fontSize: 'var(--text-base)', color: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBlockEnd: 'var(--space-2)' }}>
                  <IconShield size={20} style={{ color: 'var(--color-brand-secondary)' }} />
                  <span>{isAr ? 'سيادة القانون وحقوق الإنسان' : 'Rule of Law & Human Rights'}</span>
                </h4>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
                  {isAr
                    ? 'صون حقوق الإنسان الدستورية والدولية وتقديم الدعم القضائي للفئات الأشد تضرراً.'
                    : 'Safeguarding constitutional civil rights and extending pro-bono judicial support to vulnerable populations.'}
                </p>
              </div>
              <div style={{ padding: 'var(--space-5)', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
                <h4 style={{ fontSize: 'var(--text-base)', color: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBlockEnd: 'var(--space-2)' }}>
                  <IconUsers size={20} style={{ color: 'var(--color-brand-secondary)' }} />
                  <span>{isAr ? 'النهج التشاركي المجتمعي' : 'Grassroots Participation'}</span>
                </h4>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
                  {isAr
                    ? 'تمكين المبادرات المحلية وإشراك القيادات المجتمعية والقبلية والنسوية في صياغة الحلول.'
                    : 'Empowering local community initiatives and engaging tribal, civic, and female leaders in crafting viable solutions.'}
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}
