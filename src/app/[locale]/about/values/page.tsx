import Link from 'next/link';
import { DEFAULT_LOCALE, getDictionary, isValidLocale, type Locale } from '../../../../lib/i18n';
import { Breadcrumbs, PageHeader } from '../../../../components/layout';
import { Badge, Card, CardContent, CardTitle } from '../../../../components/ui';
import { IconCheck, IconScale, IconShield, IconUsers } from '../../../../components/icons';

export default async function ValuesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const isAr = locale === 'ar';

  const valuesList = [
    {
      titleAr: 'التنوع وقبول الآخر (Diversity)',
      titleEn: 'Diversity & Inclusion',
      descAr: 'نؤمن أن احتضان الاختلافات، وإشراك الأصوات المتنوعة، والعمل المشترك يمثل السبيل الحقيقي لحل أكثر القضايا المجتمعية تعقيداً في اليمن.',
      descEn: 'We know that if we embrace differences, engage a diverse group of voices, and work together, we will be able to solve the most complicated community challenges.',
      icon: <IconUsers size={24} />,
      badge: isAr ? 'قيمة أساسية' : 'Core Value',
    },
    {
      titleAr: 'المساواة والكرامة الإنسانية (Equality)',
      titleEn: 'Equality & Human Dignity',
      descAr: 'نؤمن أن لجميع الأفراد قيمة متساوية دون تمييز. نعمل لترسيخ العدالة وحماية كرامة الإنسان وحقوق الفئات المستضعفة والمهمشة.',
      descEn: 'We believe all individuals have equal value. We champion human dignity, gender equity, and the civil rights of all community members.',
      icon: <IconScale size={24} />,
      badge: isAr ? 'قيمة أساسية' : 'Core Value',
    },
    {
      titleAr: 'الحياد الإيجابي والاستقلالية (Neutrality)',
      titleEn: 'Neutrality & Independence',
      descAr: 'مؤسسة حماية منظمة غير حكومية وغير ربحية، تعمل وفق القوانين المرعية، ومستقلة تماماً عن أي ولاءات حزبية أو سياسية أو فئوية.',
      descEn: 'An independent, non-profit organization operating strictly under the law, unaffiliated with any political party, armed group, or sectarian faction.',
      icon: <IconShield size={24} />,
      badge: isAr ? 'ميثاق مهني' : 'Operational Charter',
    },
    {
      titleAr: 'الشفافية والمساءلة المؤسسية (Transparency)',
      titleEn: 'Transparency & Accountability',
      descAr: 'نلتزم بأعلى معايير الإفصاح المالي والإداري والحوكمة الدقيقة في تنفيذ مشاريعنا، بما يضمن صيانة الأمانة واستدامة ثقة الشركاء والمانحين.',
      descEn: 'We enforce rigorous programmatic, financial, and administrative compliance, ensuring accountable stewardships that earn lasting donor and community trust.',
      icon: <IconCheck size={24} />,
      badge: isAr ? 'معيار حوكمة' : 'Governance Standard',
    },
  ];

  return (
    <div>
      <PageHeader
        title={dict.nav.values}
        subtitle={
          isAr
            ? 'المبادئ الأخلاقية والموجهات المؤسسية التي تحكم قرارات وتدخلات مؤسسة حماية في الميدان.'
            : 'The ethical principles and institutional compass guiding our field operations and strategic interventions.'
        }
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            items={[
              { label: dict.nav.about, href: `/${locale}/about` },
              { label: dict.nav.values },
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
              backgroundColor: 'var(--color-brand-primary)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 'var(--text-sm)',
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
              backgroundColor: 'var(--color-bg-surface)',
              color: 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            {dict.nav.milestones}
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
          {valuesList.map((val, idx) => (
            <Card key={idx} hoverEffect>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-4)' }}>
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
                  }}
                >
                  {val.icon}
                </div>
                <Badge variant="accent" size="sm">{val.badge}</Badge>
              </div>
              <CardTitle>{isAr ? val.titleAr : val.titleEn}</CardTitle>
              <CardContent>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                  {isAr ? val.descAr : val.descEn}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
