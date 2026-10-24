import { DEFAULT_LOCALE, getDictionary, isValidLocale, type Locale } from '../../../../lib/i18n';
import { Breadcrumbs, PageHeader } from '../../../../components/layout';
import { Badge } from '../../../../components/ui';
import { IconShield } from '../../../../components/icons';

export default async function NeutralityCharterPage({
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
        title={dict.nav.neutrality}
        subtitle={
          isAr
            ? 'ميثاق الحياد الإيجابي والاستقلالية التامة في العمل الإنساني والوساطة المجتمعية.'
            : 'Operational charter governing humanitarian neutrality, non-alignment, and institutional independence.'
        }
        badge={<Badge variant="primary">{isAr ? 'ميثاق مهني ملزم' : 'Binding Charter'}</Badge>}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            items={[{ label: dict.nav.legal }, { label: dict.nav.neutrality }]}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBlockEnd: 'var(--space-4)' }}>
            <div
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-brand-primary-light)',
                color: 'var(--color-brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconShield size={20} />
            </div>
            <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-brand-primary)', margin: 0 }}>
              {isAr ? 'إعلان الحياد الإنساني والاستقلالية المؤسسية' : 'Declaration of Humanitarian Neutrality & Independence'}
            </h2>
          </div>

          <p style={{ marginBlockEnd: 'var(--space-4)' }}>
            {isAr
              ? 'تؤكد مؤسسة تعزيز السلام والحماية القانونية (حماية) أن كافة برامجها، تدخلاتها، وتصريحاتها قائمة على الالتزام الصارم بمبادئ القانون الدولي الإنساني ومبادئ نزهة العمل المدني: الإنسانية، الحياد، عدم التمييز، والاستقلالية العملياتية.'
              : 'The Peace, Protection and Law Foundation reaffirms that all its interventions and programs operate in strict compliance with core humanitarian standards: humanity, neutrality, non-discrimination, and operational independence.'}
          </p>

          <h3 style={{ fontSize: 'var(--text-base)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-2)' }}>
            {isAr ? '1. عدم الانحياز السياسي أو العسكري' : '1. Political and Military Non-Alignment'}
          </h3>
          <p style={{ marginBlockEnd: 'var(--space-4)' }}>
            {isAr
              ? 'لا تنتمي المؤسسة لأي حزب سياسي أو تشكيل مسلح أو جهة ذات طابع طائفي، ولا تنخرط في أي تجاذبات سياسية، مع المحافظة على مسافة مهنية متساوية من جميع الأطراف خدمةً للمصلحة الإنسانية وصوناً لكرامة المدنيين.'
              : 'The foundation maintains total independence from all political parties, armed formations, and sectarian groups, preserving an impartial posture to safeguard civilians.'}
          </p>

          <h3 style={{ fontSize: 'var(--text-base)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-2)' }}>
            {isAr ? '2. الحياد في تيسير الوساطة المحلية' : '2. Neutrality in Local Mediation'}
          </h3>
          <p style={{ marginBlockEnd: 'var(--space-4)' }}>
            {isAr
              ? 'في كافة مهام تيسير اتفاقات تبادل الأسرى والمحتجزين واستعادة الجثامين، يعمل الوسطاء المحليون بدعم المؤسسة كأطراف إنسانية محايدة وموثوقة، دون استغلال للجهود الإنسانية لتحقيق أي مكاسب سياسية أو إعلامية.'
              : 'In all mediation engagements, detainee exchanges, and body recoveries, local mediators operate strictly as neutral human bridges, preventing the politicization of civilian suffering.'}
          </p>

          <h3 style={{ fontSize: 'var(--text-base)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-2)' }}>
            {isAr ? '3. الامتثال لقواعد المانحين والقوانين الدولية' : '3. Compliance with Donor Standards & International Law'}
          </h3>
          <p style={{ margin: 0 }}>
            {isAr
              ? 'تلتزم المؤسسة بالقواعد والمعايير الإنسانية الدولية المنظمة لعمل المنظمات غير الحكومية (بما فيها معايير الاتحاد الأوروبي والأمم المتحدة)، وتخضع لتدقيق مالي وقانوني مستقل لضمان الشفافية والنزاهة المطلقة.'
              : 'The foundation complies with international humanitarian grant conditions, anti-corruption standards, and undergoes independent third-party audits.'}
          </p>
        </div>
      </div>
    </div>
  );
}
