import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DEFAULT_LOCALE, getDictionary, isValidLocale, type Locale } from '../../../../lib/i18n';
import { demoStore } from '../../../../lib/demo/store';
import { Breadcrumbs, PageHeader } from '../../../../components/layout';
import { Badge, Button, Card, CardContent } from '../../../../components/ui';
import { IconCalendar, IconCheck, IconMapPin, IconScale, IconShield } from '../../../../components/icons';

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const isAr = locale === 'ar';

  const program = demoStore.getProgramBySlug(slug);

  if (!program) {
    return (
      <div className="container" style={{ paddingBlock: 'var(--space-16)', textAlign: 'center' }}>
        <h2>{isAr ? 'البرنامج غير موجود' : 'Program Not Found'}</h2>
        <p>{isAr ? 'لم يتم العثور على البرنامج المطلوب.' : 'The requested program could not be found.'}</p>
        <Link href={`/${locale}/programs`} style={{ textDecoration: 'none' }}>
          <Button variant="primary">{isAr ? 'العودة للبرامج' : 'Back to Programs'}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={isAr ? program.titleAr : program.titleEn}
        subtitle={`${isAr ? 'النطاق الجغرافي:' : 'Location:'} ${program.location}`}
        badge={<Badge variant="primary">{program.pillar.toUpperCase()}</Badge>}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            items={[
              { label: dict.nav.programs, href: `/${locale}/programs` },
              { label: isAr ? program.titleAr : program.titleEn },
            ]}
          />
        }
      />

      <div className="container" style={{ paddingBlockEnd: 'var(--space-16)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 'var(--space-8)' }} className="md-grid-cols-1">
          {/* Main Content */}
          <div>
            <div
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                padding: 'var(--space-8)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border-subtle)',
                marginBlockEnd: 'var(--space-8)',
              }}
            >
              <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-4)' }}>
                {isAr ? 'عن البرنامج والهدف العام' : 'Program Overview & Objectives'}
              </h2>
              <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.8, color: 'var(--color-text-secondary)', marginBlockEnd: 'var(--space-6)' }}>
                {isAr ? program.descriptionAr : program.descriptionEn}
              </p>

              <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-3)' }}>
                {isAr ? 'الأهداف الاستراتيجية المحددة للتدخل' : 'Key Specific Objectives'}
              </h3>
              <ul style={{ paddingInlineStart: '1.25rem', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBlockEnd: 'var(--space-6)', listStyle: 'disc', color: 'var(--color-text-secondary)' }}>
                {(isAr ? program.objectivesAr : program.objectivesEn).map((obj, i) => (
                  <li key={i} style={{ lineHeight: 1.6 }}>{obj}</li>
                ))}
              </ul>

              <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-3)' }}>
                {isAr ? 'منهجية التنفيذ والحياد الإنساني' : 'Implementation Methodology & Impartiality'}
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
                {isAr
                  ? 'تتبع المؤسسة نهجاً تصاعدياً تشاركياً يشرك المجتمعات المحلية في تحديد الأولويات. يتم تنفيذ الأنشطة تحت رقابة دورية ومعايير امتثال مشددة، بما يضمن عدم إلحاق الضرر واستقلالية التدخل عن أي تجاذبات سياسية.'
                  : 'The foundation applies a grassroots participatory model engaging local communities in determining intervention priorities, executed with stringent compliance safeguards to preserve absolute humanitarian impartiality.'}
              </p>
            </div>
          </div>

          {/* Sidebar Info */}
          <div>
            <Card>
              <h3 style={{ fontSize: 'var(--text-base)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-4)' }}>
                {isAr ? 'بطاقة البرنامج' : 'Program Factsheet'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', marginBlockEnd: 'var(--space-6)' }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: 'var(--text-xs)' }}>
                    {isAr ? 'المحور الاستراتيجي:' : 'Pillar:'}
                  </span>
                  <span style={{ fontWeight: 600 }}>{program.pillar}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: 'var(--text-xs)' }}>
                    {isAr ? 'نطاق العمليات:' : 'Coverage:'}
                  </span>
                  <span style={{ fontWeight: 600 }}>{program.location}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: 'var(--text-xs)' }}>
                    {isAr ? 'حالة البرنامج:' : 'Status:'}
                  </span>
                  <Badge variant="success" size="sm">{program.status}</Badge>
                </div>
              </div>

              <Link href={`/${locale}/contact`} style={{ textDecoration: 'none' }}>
                <Button variant="primary" style={{ width: '100%' }}>
                  {isAr ? 'الاستفسار عن البرنامج' : 'Inquire About Program'}
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
