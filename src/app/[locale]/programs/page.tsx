import { DEFAULT_LOCALE, getDictionary, isValidLocale, type Locale } from '../../../lib/i18n';
import { demoStore } from '../../../lib/demo/store';
import { Breadcrumbs, PageHeader } from '../../../components/layout';
import { ProgramsClient } from './ProgramsClient';

export default async function ProgramsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const isAr = locale === 'ar';

  const programs = demoStore.getPrograms();

  return (
    <div>
      <PageHeader
        title={dict.nav.programs}
        subtitle={
          isAr
            ? 'دليل البرامج والمشاريع الميدانية لتعزيز الوساطة وحماية الحقوق وتمكين المجتمعات المحلية.'
            : 'Catalogue of field programs and interventions advancing community mediation, legal defense, and empowerment.'
        }
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            items={[{ label: dict.nav.programs }]}
          />
        }
      />

      <div className="container" style={{ paddingBlockEnd: 'var(--space-16)' }}>
        <ProgramsClient programs={programs} locale={locale} />
      </div>
    </div>
  );
}
