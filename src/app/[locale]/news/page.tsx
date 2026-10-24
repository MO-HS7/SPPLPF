import { DEFAULT_LOCALE, getDictionary, isValidLocale, type Locale } from '../../../lib/i18n';
import { demoStore } from '../../../lib/demo/store';
import { Breadcrumbs, PageHeader } from '../../../components/layout';
import { NewsClient } from './NewsClient';

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const isAr = locale === 'ar';

  const publishedNews = demoStore
    .getContentItems()
    .filter((c) => c.status === 'PUBLISHED' && c.type === 'news');

  return (
    <div>
      <PageHeader
        title={dict.nav.news}
        subtitle={
          isAr
            ? 'الأخبار والبيانات الصحفية الصادرة عن مؤسسة تعزيز السلام والحماية القانونية.'
            : 'Official news and press statements issued by the Peace, Protection and Law Foundation.'
        }
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            items={[{ label: dict.nav.news }]}
          />
        }
      />

      <div className="container" style={{ paddingBlockEnd: 'var(--space-16)' }}>
        <NewsClient items={publishedNews} locale={locale} />
      </div>
    </div>
  );
}
