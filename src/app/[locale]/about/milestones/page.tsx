import Link from 'next/link';
import { DEFAULT_LOCALE, getDictionary, isValidLocale, type Locale } from '../../../../lib/i18n';
import { Breadcrumbs, PageHeader } from '../../../../components/layout';
import { Badge, Card, CardContent } from '../../../../components/ui';
import { IconCalendar, IconCheck, IconScale, IconShield } from '../../../../components/icons';

export default async function MilestonesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const isAr = locale === 'ar';

  const milestonesList = [
    {
      year: '2026',
      badge: isAr ? 'إنجاز حديث' : 'Recent Milestone',
      titleAr: 'توسيع مشروع تعزيز الوساطة المحلية وتدريب الأجهزة الأمنية في تعز ومأرب',
      titleEn: 'Scaling Local Mediation Projects & Training Law Enforcement in Taiz & Marib',
      descAr: 'تنفيذ برنامج الأمن الرقمي وضوابط التفتيش القانوني لضباط الشرطة، وتأسيس لجنة المصالحة المجتمعية في مأرب لتيسير الحوار الإنساني المحلي.',
      descEn: 'Conducted digital privacy and lawful search training for law enforcement, and established the Marib Community Reconciliation Committee to facilitate local humanitarian dialogue.',
      icon: <IconShield size={20} />,
    },
    {
      year: '2025',
      badge: isAr ? 'أثر إنساني' : 'Humanitarian Impact',
      titleAr: 'تيسير 57 عملية تبادل محتجزين و19 اتفاقية مجتمعية في 10 محافظات',
      titleEn: 'Facilitating 57 Detainee Exchanges and 19 Local Agreements Across 10 Governorates',
      descAr: 'بفضل جهود شبكات الوسطاء المحليين المدعومين من المؤسسة، تم بنجاح تسهيل توقيع 19 اتفاقاً لاستعادة الجثامين وتبادل المحتجزين وبناء الثقة بين لجان الأطراف.',
      descEn: 'Through local mediator networks supported by the foundation, 19 body recovery and detainee exchange pacts were brokered across 10 governorates based on depoliticized trust.',
      icon: <IconCheck size={20} />,
    },
    {
      year: '2025',
      badge: isAr ? 'حماية وعدالة' : 'Justice & Defense',
      titleAr: 'إطلاق برنامج الرقابة القانونية ومكافحة الحبس الاحتياطي غير القانوني',
      titleEn: 'Launching Legal Oversight & Pre-Trial Detention Safeguards Program',
      descAr: 'تنظيم حلقات نقاش وورش عمل بمشاركة القضاة ووكلاء النيابة والمحامين لتعزيز إجراءات المحاكمة العادلة وتقديم العون القضائي للمستضعفين.',
      descEn: 'Convened joint workshops with judiciary, prosecutors, and the bar association to enforce fair trial benchmarks and provide pro-bono defense for vulnerable detainees.',
      icon: <IconScale size={20} />,
    },
    {
      year: '2024',
      badge: isAr ? 'تطوير مؤسسي' : 'Institutional Hubs',
      titleAr: 'التكيف العملياتي وإعادة هيكلة مقرات المؤسسة (تعز، مأرب، صنعاء)',
      titleEn: 'Operational Adaptation & Headquarters Restructuring (Taiz, Marib, Sanaa)',
      descAr: 'استجابة للمتغيرات الميدانية ولضمان أمن الفريق واستقلالية العمل، تم اعتماد مكتب تعز كمقر رئيسي ومركز للعمليات، مع تشغيل فرع مأرب ومكتب صنعاء التنسيقي.',
      descEn: 'To safeguard staff and preserve operational independence, Taiz was designated the operational headquarters, supported by the Marib field branch and Sanaa specialized office.',
      icon: <IconCalendar size={20} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title={dict.nav.milestones}
        subtitle={
          isAr
            ? 'المحطات الرئيسية والأثر الميداني لمسيرة مؤسسة حماية منذ تأسيسها.'
            : 'Key institutional milestones and tangible humanitarian impacts achieved across Yemen.'
        }
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            items={[
              { label: dict.nav.about, href: `/${locale}/about` },
              { label: dict.nav.milestones },
            ]}
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
            marginBlockEnd: 'var(--space-8)',
            borderBlockEnd: '1px solid var(--color-border-subtle)',
            paddingBlockEnd: 'var(--space-3)',
          }}
        >
          <Link
            href={`/${locale}/about`}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-surface)',
              color: 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            {dict.nav.aboutOverview}
          </Link>
          <Link
            href={`/${locale}/about/values`}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-surface)',
              color: 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            {dict.nav.values}
          </Link>
          <Link
            href={`/${locale}/about/goals`}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-surface)',
              color: 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            {dict.nav.goals}
          </Link>
          <Link
            href={`/${locale}/about/milestones`}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-brand-primary)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 'var(--text-sm)',
            }}
          >
            {dict.nav.milestones}
          </Link>
        </div>

        {/* Timeline Track */}
        <div style={{ maxWidth: '850px', marginInline: 'auto', position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-8)',
              borderInlineStart: '3px solid var(--color-brand-secondary)',
              paddingInlineStart: 'var(--space-6)',
              marginInlineStart: 'var(--space-4)',
            }}
          >
            {milestonesList.map((m, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                {/* Timeline node circle */}
                <div
                  style={{
                    position: 'absolute',
                    insetInlineStart: 'calc(-1 * var(--space-6) - 1.125rem)',
                    top: '0.25rem',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-brand-primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid var(--color-bg-canvas)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {m.icon}
                </div>

                <Card hoverEffect style={{ borderInlineStart: '4px solid var(--color-brand-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
                      {m.year}
                    </span>
                    <Badge variant="primary" size="sm">{m.badge}</Badge>
                  </div>
                  <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-2)' }}>
                    {isAr ? m.titleAr : m.titleEn}
                  </h3>
                  <CardContent>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
                      {isAr ? m.descAr : m.descEn}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
