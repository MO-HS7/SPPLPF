import { DEFAULT_LOCALE, getDictionary, isValidLocale, type Locale } from '../../../lib/i18n';
import { demoStore } from '../../../lib/demo/store';
import { Breadcrumbs, PageHeader } from '../../../components/layout';
import { PublicationsClient } from './PublicationsClient';

export default async function PublicationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const isAr = locale === 'ar';

  const publications = demoStore.getPublications();

  return (
    <div>
      <PageHeader
        title={dict.nav.publications}
        subtitle={
          isAr
            ? 'مكتبة الأوراق السياساتية، التقارير التقييمية، والأدلة التدريبية الصادرة عن المؤسسة.'
            : 'Library of policy briefs, empirical assessment reports, and training manuals published by SPPLPF.'
        }
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            items={[{ label: dict.nav.publications }]}
          />
        }
      />

      <div className="container" style={{ paddingBlockEnd: 'var(--space-16)' }}>
        <PublicationsClient publications={publications} locale={locale} />
      </div>
    </div>
  );
}
