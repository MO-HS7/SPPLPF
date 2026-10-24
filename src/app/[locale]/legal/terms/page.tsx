import { DEFAULT_LOCALE, getDictionary, isValidLocale, type Locale } from '../../../../lib/i18n';
import { Breadcrumbs, PageHeader } from '../../../../components/layout';

export default async function TermsPage({
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
        title={dict.nav.terms}
        subtitle={
          isAr
            ? 'شروط الاستخدام وحقوق الملكية الفكرية لمحتوى وتقارير المنصة المؤسسية.'
            : 'Terms of use and intellectual property guidelines for SPPLPF publications and digital assets.'
        }
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            items={[{ label: dict.nav.legal }, { label: dict.nav.terms }]}
          />
        }
      />

      <div className="container" style={{ paddingBlockEnd: 'var(--space-16)', maxWidth: '900px' }}>
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-subtle)',
            padding: 'var(--space-8)',
            lineHeight: 1.8,
            color: 'var(--color-text-secondary)',
          }}
        >
          <h2 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-3)' }}>
            {isAr ? '1. الملكية الفكرية والاقتباس' : '1. Intellectual Property & Citation'}
          </h2>
          <p style={{ marginBlockEnd: 'var(--space-4)' }}>
            {isAr
              ? 'كافة الدراسات، التقارير الحقوقية، وأوراق السياسات الصادرة عن مؤسسة تعزيز السلام والحماية القانونية متاحة للاستخدام الإنساني والأكاديمي والمدني غير التجاري، بشرط الإشارة الصريحة إلى المؤسسة كمصدر للمعلومات.'
              : 'All empirical research, human rights reports, and policy briefs published by SPPLPF are open for non-commercial academic and civic use, subject to explicit attribution.'}
          </p>

          <h2 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-3)' }}>
            {isAr ? '2. الاستخدام المشروع للمنصة' : '2. Lawful Platform Use'}
          </h2>
          <p style={{ marginBlockEnd: 'var(--space-4)' }}>
            {isAr
              ? 'يُحظر استخدام المنصة أو قنوات التواصل التابعة لها في بث أي محتوى ينتهك القوانين، أو يحرض على الكراهية والعنف، أو يعطل الأداء الأمني والتقني للمنظومة.'
              : 'Users are strictly prohibited from utilizing this platform to disseminate unlawful content, incite violence or hate speech, or compromise operational cybersecurity.'}
          </p>
        </div>
      </div>
    </div>
  );
}
