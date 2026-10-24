import Link from 'next/link';
import { DEFAULT_LOCALE, getDictionary, isValidLocale, type Locale } from '../../../../lib/i18n';
import { demoStore } from '../../../../lib/demo/store';
import { Breadcrumbs, PageHeader } from '../../../../components/layout';
import { Badge, Button, Card } from '../../../../components/ui';
import { IconCalendar, IconFileText, IconUsers } from '../../../../components/icons';

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const isAr = locale === 'ar';

  const item = demoStore.getContentItemBySlug(slug);

  if (!item) {
    return (
      <div className="container" style={{ paddingBlock: 'var(--space-16)', textAlign: 'center' }}>
        <h2>{isAr ? 'المادة الإخبارية غير موجودة' : 'News Article Not Found'}</h2>
        <p>{isAr ? 'لم نتمكن من العثور على البيان أو الخبر المطلوب.' : 'The requested statement or article could not be located.'}</p>
        <Link href={`/${locale}/news`} style={{ textDecoration: 'none' }}>
          <Button variant="primary">{isAr ? 'العودة لقائمة الأخبار' : 'Back to News'}</Button>
        </Link>
      </div>
    );
  }

  const related = demoStore
    .getContentItems()
    .filter((c) => c.status === 'PUBLISHED' && c.id !== item.id)
    .slice(0, 2);

  return (
    <div>
      <PageHeader
        title={isAr ? item.titleAr : item.titleEn}
        subtitle={`${isAr ? 'جهة النشر:' : 'Published by:'} ${item.author}`}
        badge={<Badge variant="primary">{item.category}</Badge>}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            items={[
              { label: dict.nav.news, href: `/${locale}/news` },
              { label: isAr ? item.titleAr : item.titleEn },
            ]}
          />
        }
      />

      <div className="container" style={{ paddingBlockEnd: 'var(--space-16)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 'var(--space-8)' }} className="md-grid-cols-1">
          {/* Main Article Body */}
          <div>
            <div
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border-subtle)',
                padding: 'var(--space-8)',
                marginBlockEnd: 'var(--space-8)',
              }}
            >
              {/* Meta details bar */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)',
                  borderBlockEnd: '1px solid var(--color-border-subtle)',
                  paddingBlockEnd: 'var(--space-4)',
                  marginBlockEnd: 'var(--space-6)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <IconCalendar size={14} />
                  <span>{item.publishedAt}</span>
                </div>
                <div>•</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <IconUsers size={14} />
                  <span>{item.author}</span>
                </div>
              </div>

              {/* Lead Summary Callout */}
              <div
                style={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  borderInlineStart: '4px solid var(--color-brand-primary)',
                  padding: 'var(--space-4) var(--space-6)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 600,
                  color: 'var(--color-brand-primary)',
                  lineHeight: 1.7,
                  marginBlockEnd: 'var(--space-6)',
                }}
              >
                {isAr ? item.summaryAr : item.summaryEn}
              </div>

              {/* Full Body Paragraphs */}
              <div
                style={{
                  fontSize: 'var(--text-base)',
                  lineHeight: 1.9,
                  color: 'var(--color-text-secondary)',
                  whiteSpace: 'pre-line',
                }}
              >
                {isAr ? item.bodyAr : item.bodyEn}
              </div>

              {/* Tags */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--space-2)',
                  borderBlockStart: '1px solid var(--color-border-subtle)',
                  paddingBlockStart: 'var(--space-4)',
                  marginBlockStart: 'var(--space-8)',
                }}
              >
                {item.tags.map((t, idx) => (
                  <Badge key={idx} variant="neutral" size="sm">
                    #{t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <h3 style={{ fontSize: 'var(--text-base)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-4)' }}>
                {isAr ? 'أخبار ذات صلة' : 'Related News'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {related.map((rel) => (
                  <div key={rel.id} style={{ borderBlockEnd: '1px solid var(--color-border-subtle)', paddingBlockEnd: 'var(--space-3)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{rel.publishedAt}</span>
                    <h4 style={{ fontSize: 'var(--text-sm)', marginBlock: '0.25rem' }}>
                      <Link href={`/${locale}/news/${rel.slug}`} style={{ color: 'var(--color-text-primary)' }}>
                        {isAr ? rel.titleAr : rel.titleEn}
                      </Link>
                    </h4>
                  </div>
                ))}
              </div>

              <div style={{ marginBlockStart: 'var(--space-6)' }}>
                <Link href={`/${locale}/news`} style={{ textDecoration: 'none' }}>
                  <Button variant="outline" size="sm" style={{ width: '100%' }}>
                    {isAr ? 'كافة الأخبار والبيانات' : 'All News & Updates'}
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
