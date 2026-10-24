import Link from 'next/link';
import { DEFAULT_LOCALE, getDictionary, isValidLocale, type Locale } from '../../../lib/i18n';
import { demoStore } from '../../../lib/demo/store';
import { Breadcrumbs, PageHeader } from '../../../components/layout';
import { Badge, Card, CardContent, CardFooter, CardTitle } from '../../../components/ui';
import { IconCalendar, IconCheck } from '../../../components/icons';

export default async function StoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const isAr = locale === 'ar';

  const stories = demoStore
    .getContentItems()
    .filter((c) => c.status === 'PUBLISHED' && c.type === 'story');

  return (
    <div>
      <PageHeader
        title={dict.nav.stories}
        subtitle={
          isAr
            ? 'شهادات حية وقصص نجاح إنسانية توثق أثر الوساطة المحلية ومبادرات التماسك المجتمعي في الميدان.'
            : 'Human stories and qualitative testimonials documenting the grassroots impact of local mediation and civil protection.'
        }
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            items={[{ label: dict.nav.stories }]}
          />
        }
      />

      <div className="container" style={{ paddingBlockEnd: 'var(--space-16)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          {stories.map((story) => (
            <Card key={story.id} hoverEffect style={{ borderInlineStart: '4px solid var(--color-brand-accent)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-3)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <IconCalendar size={14} />
                  <span>{story.publishedAt}</span>
                </span>
                <Badge variant="accent" size="sm">{story.category}</Badge>
              </div>

              <CardTitle>
                <Link href={`/${locale}/news/${story.slug}`} style={{ color: 'inherit' }}>
                  {isAr ? story.titleAr : story.titleEn}
                </Link>
              </CardTitle>

              <CardContent>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {isAr ? story.summaryAr : story.summaryEn}
                </p>
              </CardContent>

              <CardFooter>
                <Link href={`/${locale}/news/${story.slug}`} style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-brand-accent)' }}>
                  {isAr ? 'اقرأ قصة الأثر' : 'Read Full Story'} &larr;
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
