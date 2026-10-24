import Link from 'next/link';
import { DEFAULT_LOCALE, getDictionary, isValidLocale, type Locale } from '../../../lib/i18n';
import { demoStore } from '../../../lib/demo/store';
import { Breadcrumbs, PageHeader } from '../../../components/layout';
import { Badge, Button, Card, CardContent, CardTitle } from '../../../components/ui';
import { IconCheck, IconMail, IconMapPin, IconPhone, IconShield } from '../../../components/icons';

export default async function PresencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const isAr = locale === 'ar';

  const offices = demoStore.getOffices();

  return (
    <div>
      <PageHeader
        title={dict.nav.presence}
        subtitle={
          isAr
            ? 'التوزيع الجغرافي لمكاتب وفرق مؤسسة تعزيز السلام والحماية القانونية عبر المحافظات اليمنية.'
            : 'Geographical footprint and operational hubs across Yemeni governorates ensuring impartial community access.'
        }
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            items={[{ label: dict.nav.presence }]}
          />
        }
      />

      <div className="container" style={{ paddingBlockEnd: 'var(--space-16)' }}>
        {/* Institutional Geographic Strategy Callout */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-subtle)',
            padding: 'var(--space-8)',
            marginBlockEnd: 'var(--space-12)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBlockEnd: 'var(--space-3)' }}>
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
              {isAr ? 'المرونة العملياتية والحضور المحايد المستدام' : 'Operational Agility & Neutral Field Presence'}
            </h2>
          </div>
          <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.8, color: 'var(--color-text-secondary)', marginBlockEnd: 'var(--space-4)' }}>
            {isAr
              ? 'تمتلك مؤسسة تعزيز السلام والحماية القانونية قدرة عملياتية مرنة وحضوراً استراتيجياً راسخاً مدعوماً بتصاريح عمل رسمية. استجابةً للمتغيرات الميدانية وبما يضمن سلامة الكادر واستقلالية القرار الإنساني، تم اعتماد مدينة تعز مقراً رئيسياً لقيادة وإدارة البرامج الكبرى، مع تشغيل فرع مأرب للاستجابة لاحتياجات النازحين والمجتمعات المضيفة، والحفاظ على مكتب متخصص في صنعاء للمهام المحايدة والوساطة القانونية.'
              : 'SPPLPF maintains adaptive operational capacity and structured strategic hubs underpinned by official permits. To ensure staff safety and uphold humanitarian independence, operations are coordinated from our central command hub in Taiz, supported by our active Marib branch serving displaced and host communities, and a specialized coordination office in Sanaa.'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', marginBlockStart: 'var(--space-6)' }}>
            <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-primary)', fontWeight: 700, display: 'block', marginBlockEnd: '0.25rem' }}>
                {isAr ? 'محافظة تعز والمحافظات المجاورة' : 'Taiz & Southern Governorates'}
              </span>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
                {isAr ? 'تغطية شاملة لمديريات تعز والامتداد نحو لحج والساحل.' : 'Coverage of all Taiz districts and coordination in Lahj.'}
              </p>
            </div>
            <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-secondary)', fontWeight: 700, display: 'block', marginBlockEnd: '0.25rem' }}>
                {isAr ? 'محافظة مأرب والنازحين' : 'Marib & IDP Communities'}
              </span>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
                {isAr ? 'فرع تنفيذي معتمد لعموم مديريات مأرب ولجان المصالحة.' : 'Authorized branch covering all districts & reconciliation.'}
              </p>
            </div>
            <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-accent)', fontWeight: 700, display: 'block', marginBlockEnd: '0.25rem' }}>
                {isAr ? 'المحافظات الشمالية' : 'Northern Governorates'}
              </span>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
                {isAr ? 'تصريح وطني للمهام المتخصصة والوساطة القانونية المحايدة.' : 'National registration for specialized legal mediation.'}
              </p>
            </div>
          </div>
        </div>

        {/* Operational Hub Cards */}
        <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-6)' }}>
          {isAr ? 'المقرات والمكاتب الميدانية' : 'Operational Command Hubs & Offices'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          {offices.map((office) => (
            <Card key={office.id} style={{ borderInlineStart: office.isHeadquarters ? '4px solid var(--color-brand-primary)' : '4px solid var(--color-brand-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-3)' }}>
                <span style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
                  {isAr ? office.cityAr : office.cityEn}
                </span>
                {office.isHeadquarters ? (
                  <Badge variant="primary" size="sm">{isAr ? 'المقر الرئيسي' : 'Headquarters'}</Badge>
                ) : (
                  <Badge variant="secondary" size="sm">{isAr ? 'فرع ميداني' : 'Branch Office'}</Badge>
                )}
              </div>

              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-brand-accent)', marginBlockEnd: 'var(--space-3)' }}>
                {isAr ? office.roleAr : office.roleEn}
              </div>

              <CardContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBlockEnd: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                    <IconMapPin size={16} style={{ color: 'var(--color-brand-primary)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{isAr ? office.addressAr : office.addressEn}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <IconPhone size={16} style={{ color: 'var(--color-brand-primary)', flexShrink: 0 }} />
                    <span>{office.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <IconMail size={16} style={{ color: 'var(--color-brand-primary)', flexShrink: 0 }} />
                    <span>{office.email}</span>
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--color-bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--color-brand-primary)', display: 'block', marginBlockEnd: '0.2rem' }}>
                    {isAr ? 'النطاق القانوني والتشغيلي:' : 'Operational Scope:'}
                  </strong>
                  <span>{isAr ? office.scopeAr : office.scopeEn}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
