import Link from 'next/link';
import { DEFAULT_LOCALE, getDictionary, isValidLocale, type Locale } from '../../../lib/i18n';
import { demoStore } from '../../../lib/demo/store';
import { Breadcrumbs, PageHeader } from '../../../components/layout';
import { Badge, Card, CardContent, CardFooter, CardTitle } from '../../../components/ui';
import { IconCalendar, IconMapPin } from '../../../components/icons';

export default async function ActivitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const isAr = locale === 'ar';

  const activities = demoStore
    .getContentItems()
    .filter((c) => c.status === 'PUBLISHED' && c.type === 'activity');

  return (
    <div>
      <PageHeader
        title={dict.nav.activities}
        subtitle={
          isAr
            ? 'الورش التدريبية، الجلسات الحوارية، والأنشطة الميدانية المنفذة في المحافظات اليمنية.'
            : 'Workshops, roundtables, and field community activities implemented across Yemeni governorates.'
        }
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            items={[{ label: dict.nav.activities }]}
          />
        }
      />

      <div className="container" style={{ paddingBlockEnd: 'var(--space-16)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          {activities.map((act) => (
            <Card key={act.id} hoverEffect>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-3)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <IconCalendar size={14} />
                  <span>{act.publishedAt}</span>
                </span>
                <Badge variant="secondary" size="sm">{act.category}</Badge>
              </div>

              <CardTitle>
                <Link href={`/${locale}/news/${act.slug}`} style={{ color: 'inherit' }}>
                  {isAr ? act.titleAr : act.titleEn}
                </Link>
              </CardTitle>

              <CardContent>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {isAr ? act.summaryAr : act.summaryEn}
                </p>
              </CardContent>

              <CardFooter>
                <Link href={`/${locale}/news/${act.slug}`} style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-brand-primary)' }}>
                  {dict.common.readMore} &larr;
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
