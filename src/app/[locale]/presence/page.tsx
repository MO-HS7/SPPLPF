import Link from 'next/link';
import { DEFAULT_LOCALE, getDictionary, isValidLocale, type Locale } from '../../../lib/i18n';
import { demoStore } from '../../../lib/demo/store';
import { Breadcrumbs, PageHeader } from '../../../components/layout';
import { Badge, Button, Card, CardContent } from '../../../components/ui';
import { IconMail, IconMapPin, IconPhone, IconShield } from '../../../components/icons';
import { YemenGovernorateMap } from '../../../components/map';
import { RevealOnScroll } from '../../../components/motion';

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
            ? 'التوزيع الجغرافي لمكاتب وفرق مؤسسة حماية القانون وتعزيز السلم الاجتماعي عبر المحافظات اليمنية المعتمدة.'
            : 'Geographical footprint and verified operational hubs across Yemeni governorates ensuring impartial community access.'
        }
        badge={
          <Badge variant="primary">
            {isAr ? 'نطاق العمليات المعتمد: تعز • مأرب • صنعاء' : 'Verified Hubs: Taiz • Marib • Sanaa'}
          </Badge>
        }
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            items={[{ label: dict.nav.presence }]}
          />
        }
      />

      <div className="container" style={{ paddingBlockEnd: 'var(--space-16)' }}>
        {/* Interactive GeoJSON Map Section */}
        <RevealOnScroll>
          <div style={{ marginBlockEnd: 'var(--space-12)' }}>
            <div style={{ marginBlockEnd: 'var(--space-5)' }}>
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 800,
                  color: 'var(--color-brand-accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  display: 'block',
                  marginBlockEnd: 'var(--space-1)',
                }}
              >
                {isAr ? 'الخريطة التفاعلية للمحافظات اليمنية (GeoJSON ADM1)' : 'Interactive Yemen Governorate Map (GeoJSON ADM1)'}
              </span>
              <h2 className="font-display" style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', margin: 0 }}>
                {isAr ? 'استكشاف النطاق الجغرافي والمكاتب الميدانية' : 'Explore Verified Operational Hubs & Governorate Boundaries'}
              </h2>
            </div>
            <YemenGovernorateMap locale={locale} />
          </div>
        </RevealOnScroll>

        {/* Institutional Geographic Strategy Callout */}
        <RevealOnScroll>
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border-subtle)',
              padding: 'clamp(1.5rem, 3vw, 2.5rem)',
              marginBlockEnd: 'var(--space-12)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBlockEnd: 'var(--space-3)' }}>
              <div
                style={{
                  width: '2.75rem',
                  height: '2.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-brand-primary-light)',
                  color: 'var(--color-brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <IconShield size={22} />
              </div>
              <h2 className="font-display" style={{ fontSize: 'var(--text-xl)', color: 'var(--color-brand-primary)', margin: 0 }}>
                {isAr ? 'المرونة العملياتية والحضور المحايد المستدام' : 'Operational Agility & Neutral Field Presence'}
              </h2>
            </div>
            <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.85, color: 'var(--color-text-secondary)', marginBlockEnd: 'var(--space-4)' }}>
              {isAr
                ? 'تمتلك مؤسسة حماية القانون وتعزيز السلم الاجتماعي قدرة عملياتية مرنة وحضوراً استراتيجياً راسخاً مدعوماً بتصاريح عمل رسمية. استجابةً للمتغيرات الميدانية وبما يضمن سلامة الكادر واستقلالية القرار الإنساني، تم اعتماد مدينة تعز مقراً رئيسياً لقيادة وإدارة البرامج، مع تشغيل فرع مأرب للاستجابة لاحتياجات النازحين والمجتمعات المضيفة، والحفاظ على مكتب متخصص في صنعاء للمهام المحايدة والوساطة القانونية.'
                : 'SPPLPF maintains adaptive operational capacity and structured strategic hubs underpinned by official permits. To ensure staff safety and uphold humanitarian independence, operations are coordinated from our central command hub in Taiz, supported by our active Marib branch serving displaced and host communities, and a specialized coordination office in Sanaa.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 'var(--space-4)', marginBlockStart: 'var(--space-6)' }}>
              <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)', borderInlineStart: '3px solid var(--color-brand-primary)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-primary)', fontWeight: 800, display: 'block', marginBlockEnd: '0.35rem' }}>
                  {isAr ? 'محافظة تعز والمقر الرئيسي' : 'Taiz Headquarters Hub'}
                </span>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.65 }}>
                  {isAr ? 'تغطية برامجية لمديريات تعز انطلاقاً من المقر الرئيسي.' : 'Programmatic coverage across Taiz districts from headquarters.'}
                </p>
              </div>
              <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)', borderInlineStart: '3px solid var(--color-brand-secondary)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-secondary)', fontWeight: 800, display: 'block', marginBlockEnd: '0.35rem' }}>
                  {isAr ? 'محافظة مأرب والنازحين' : 'Marib & IDP Communities'}
                </span>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.65 }}>
                  {isAr ? 'فرع تنفيذي معتمد لعموم مديريات مأرب ولجان المصالحة.' : 'Authorized branch covering all districts & reconciliation.'}
                </p>
              </div>
              <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)', borderInlineStart: '3px solid var(--color-brand-accent)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-accent)', fontWeight: 800, display: 'block', marginBlockEnd: '0.35rem' }}>
                  {isAr ? 'المحافظات الشمالية (مكتب صنعاء)' : 'Northern Governorates (Sanaa Office)'}
                </span>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.65 }}>
                  {isAr ? 'تصريح وطني للمهام المتخصصة والوساطة القانونية المحايدة.' : 'National registration for specialized legal mediation.'}
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Operational Hub Cards */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', marginBlockEnd: 'var(--space-6)' }}>
          <h3 className="font-display" style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', margin: 0 }}>
            {isAr ? 'دليل المقرات والمكاتب الميدانية المعتمدة' : 'Directory of Operational Command Hubs & Offices'}
          </h3>
          <Link href={`/${locale}/contact`} style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="sm">
              {isAr ? 'تواصل مع فرقنا الميدانية' : 'Contact Field Teams'}
            </Button>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          {offices.map((office) => (
            <Card
              key={office.id}
              hoverEffect
              style={{
                borderInlineStart: office.isHeadquarters
                  ? '4px solid var(--color-brand-primary)'
                  : '4px solid var(--color-brand-secondary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-3)' }}>
                <span className="font-display" style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
                  {isAr ? office.cityAr : office.cityEn}
                </span>
                {office.isHeadquarters ? (
                  <Badge variant="primary" size="sm">{isAr ? 'المقر الرئيسي' : 'Headquarters'}</Badge>
                ) : (
                  <Badge variant="secondary" size="sm">{isAr ? 'فرع ميداني' : 'Branch Office'}</Badge>
                )}
              </div>

              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-brand-accent)', marginBlockEnd: 'var(--space-4)' }}>
                {isAr ? office.roleAr : office.roleEn}
              </div>

              <CardContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBlockEnd: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                    <IconMapPin size={16} style={{ color: 'var(--color-brand-primary)', flexShrink: 0, marginTop: '3px' }} />
                    <span>{isAr ? office.addressAr : office.addressEn}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <IconPhone size={16} style={{ color: 'var(--color-brand-primary)', flexShrink: 0 }} />
                    <span dir="ltr">{office.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <IconMail size={16} style={{ color: 'var(--color-brand-primary)', flexShrink: 0 }} />
                    <span>{office.email}</span>
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--color-bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', lineHeight: 1.65 }}>
                  <strong style={{ color: 'var(--color-brand-primary)', display: 'block', marginBlockEnd: '0.25rem' }}>
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
