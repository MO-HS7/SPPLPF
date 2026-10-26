import { DEFAULT_LOCALE, getDictionary, isValidLocale, type Locale } from '../../../lib/i18n';
import { Breadcrumbs, PageHeader } from '../../../components/layout';
import { Card, CardContent } from '../../../components/ui';
import { IconMail, IconMapPin, IconPhone } from '../../../components/icons';
import { ContactFormClient } from './ContactFormClient';

export default async function ContactPage({
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
        title={dict.nav.contact}
        subtitle={
          isAr
            ? 'تواصل مع فريق مؤسسة حماية القانون وتعزيز السلم الاجتماعي لطلب العون القضائي أو التنسيق المؤسسي.'
            : 'Reach out to the SPPLPF team for legal counsel, project coordination, or community partnerships.'
        }
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            items={[{ label: dict.nav.contact }]}
          />
        }
      />

      <div className="container" style={{ paddingBlockEnd: 'var(--space-16)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(280px, 0.7fr)', gap: 'var(--space-8)' }} className="md-grid-cols-1">
          {/* Left: Contact & Inquiry Form */}
          <div>
            <ContactFormClient locale={locale} />
          </div>

          {/* Right: Direct Contact Info & Offices */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <Card>
              <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-4)' }}>
                {isAr ? 'قنوات التواصل المباشر' : 'Direct Communications'}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                  <div style={{ color: 'var(--color-brand-primary)', marginTop: '2px' }}>
                    <IconMail size={18} />
                  </div>
                  <div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'block' }}>
                      {isAr ? 'البريد الإلكتروني العام:' : 'General Inquiries:'}
                    </span>
                    <strong style={{ color: 'var(--color-brand-primary)' }}>contact@spplpf.org</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                  <div style={{ color: 'var(--color-brand-primary)', marginTop: '2px' }}>
                    <IconPhone size={18} />
                  </div>
                  <div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'block' }}>
                      {isAr ? 'المقر الرئيسي (تعز):' : 'Taiz Headquarters:'}
                    </span>
                    <strong>+967 4 250 881</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                  <div style={{ color: 'var(--color-brand-primary)', marginTop: '2px' }}>
                    <IconPhone size={18} />
                  </div>
                  <div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'block' }}>
                      {isAr ? 'فرع مأرب الميداني:' : 'Marib Branch Office:'}
                    </span>
                    <strong>+967 6 304 912</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                  <div style={{ color: 'var(--color-brand-primary)', marginTop: '2px' }}>
                    <IconMapPin size={18} />
                  </div>
                  <div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'block' }}>
                      {isAr ? 'ساعات العمل الرسمية:' : 'Working Hours:'}
                    </span>
                    <span>{isAr ? 'الأحد – الخميس: 8:00 ص – 3:30 م' : 'Sun – Thu: 8:00 AM – 3:30 PM'}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card style={{ backgroundColor: 'var(--color-bg-elevated)', borderInlineStart: '4px solid var(--color-brand-accent)' }}>
              <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-2)' }}>
                {isAr ? 'السرية وحماية بيانات المستفيدين' : 'Confidentiality & Data Protection'}
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {isAr
                  ? 'تتعامل المؤسسة مع كافة طلبات العون القضائي والاستفسارات بسرية تامة وأمان رقمي يحفظ خصوصية وكرامة المواطنين وطالبي الحماية القانونية.'
                  : 'All legal aid inquiries are handled with strict operational confidentiality, ensuring civilian privacy and dignity are safeguarded.'}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
