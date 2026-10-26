import { DEFAULT_LOCALE, getDictionary, isValidLocale, type Locale } from '../../../../lib/i18n';
import { Breadcrumbs, PageHeader } from '../../../../components/layout';

export default async function PrivacyPolicyPage({
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
        title={dict.nav.privacy}
        subtitle={
          isAr
            ? 'سياسة حماية البيانات وخصوصية طالبي العون القضائي وزوار المنصة.'
            : 'Privacy and data protection policy for legal aid seekers and platform visitors.'
        }
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            items={[{ label: dict.nav.legal }, { label: dict.nav.privacy }]}
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
            {isAr ? '1. الالتزام بحماية البيانات الشخصية' : '1. Commitment to Personal Data Protection'}
          </h2>
          <p style={{ marginBlockEnd: 'var(--space-4)' }}>
            {isAr
              ? 'تلتزم مؤسسة حماية القانون وتعزيز السلم الاجتماعي بحماية خصوصية وأمان البيانات الشخصية لجميع المستفيدين، طالبي العون القضائي، والزوار، وفقاً للمعايير القانونية والأخلاقية ومبادئ العمل الإنساني.'
              : 'The Law Protection & Social Peace Foundation (Provisional translation pending approval under OQ-001) is committed to protecting the privacy and security of personal data for all beneficiaries, legal aid seekers, and site visitors in accordance with ethical humanitarian benchmarks.'}
          </p>

          <h2 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-3)' }}>
            {isAr ? '2. سرية ملفات العون القضائي' : '2. Confidentiality of Legal Aid Records'}
          </h2>
          <p style={{ marginBlockEnd: 'var(--space-4)' }}>
            {isAr
              ? 'تخضع كافة البيانات والوثائق والمعلومات المتعلقة بالقضايا القانونية والاحتجاز الاحتياطي للسرية المهنية التامة، ولا يتم مشاركتها مع أي جهة خارجية دون موافقة خطية صريحة ومسبقة من صاحب الشأن.'
              : 'All records, case files, and communications relating to legal defense and pre-trial detention inquiries are governed by strict professional secrecy and shall not be disclosed to third parties without prior written consent.'}
          </p>

          <h2 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-3)' }}>
            {isAr ? '3. ملفات تعريف الارتباط والتقنيات الفنية' : '3. Cookies & Technical Security'}
          </h2>
          <p style={{ marginBlockEnd: 'var(--space-4)' }}>
            {isAr
              ? 'تستخدم المنصة ملفات تعريف ارتباط مشفرة ومؤمنة (HttpOnly و SameSite) لإدارة الجلسات المصرح بها ومنع هجمات التزييف الإلكتروني، دون تتبع أو جمع بيانات لأغراض تجارية.'
              : 'The platform employs encrypted, secure cookies (HttpOnly, SameSite) exclusively for authenticated session protection and CSRF mitigation, without commercial tracking mechanisms.'}
          </p>
        </div>
      </div>
    </div>
  );
}
