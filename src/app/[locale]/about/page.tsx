import Link from 'next/link';
import { DEFAULT_LOCALE, getDictionary, isValidLocale, type Locale } from '../../../lib/i18n';
import { Breadcrumbs, PageHeader } from '../../../components/layout';
import { Badge, Button, Card, CardContent, CardTitle } from '../../../components/ui';
import { IconCheck, IconScale, IconShield, IconUsers } from '../../../components/icons';

export default async function AboutPage({
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
        title={dict.nav.about}
        subtitle={
          isAr
            ? 'مؤسسة يمنية مستقلة غير حكومية تعمل على تعزيز السلام الاجتماعي، الحماية القانونية، وحماية الحقوق والحريات.'
            : 'An independent Yemeni NGO dedicated to advancing social peace, human rights, and the rule of law.'
        }
        badge={<Badge variant="primary">{dict.common.orgSubtitle}</Badge>}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            items={[{ label: dict.nav.about }]}
          />
        }
      />

      <div className="container" style={{ paddingBlockEnd: 'var(--space-16)' }}>
        {/* Navigation Tabs for About Section */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
            marginBlockEnd: 'var(--space-8)',
            borderBlockEnd: '1px solid var(--color-border-subtle)',
            paddingBlockEnd: 'var(--space-3)',
          }}
        >
          <Link
            href={`/${locale}/about`}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-brand-primary)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 'var(--text-sm)',
            }}
          >
            {dict.nav.aboutOverview}
          </Link>
          <Link
            href={`/${locale}/about/values`}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-surface)',
              color: 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            {dict.nav.values}
          </Link>
          <Link
            href={`/${locale}/about/goals`}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-surface)',
              color: 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            {dict.nav.goals}
          </Link>
          <Link
            href={`/${locale}/about/milestones`}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-surface)',
              color: 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            {dict.nav.milestones}
          </Link>
        </div>

        {/* Narrative Section 1: Who We Are */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-8)', marginBlockEnd: 'var(--space-12)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-4)' }}>
              {isAr ? 'من نحن (مؤسسة حماية القانون وتعزيز السلم الاجتماعي)' : 'Who We Are (Law Protection & Social Peace Foundation)'}
            </h2>
            <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
              {isAr
                ? 'مؤسسة حماية القانون وتعزيز السلم الاجتماعي (حماية) منظمة مجتمع مدني يمنية غير ربحية وغير حزبية، مرخصة وتعمل بموجب القوانين النافذة. انطلقت المؤسسة استجابة للحاجة الإنسانية والاجتماعية الملحة لحماية الحقوق الأساسية للمدنيين وتعزيز ثقافة السلام وسيادة القانون في ظل التحديات المعقدة التي يمر بها اليمن.'
                : 'The Law Protection & Social Peace Foundation (Himaaya - Provisional English translation) is an independent, non-profit, and non-partisan Yemeni civil society organization. Established in response to the acute humanitarian and civic imperative, the foundation safeguards civilian rights, promotes sustainable peace, and bolsters the rule of law amidst Yemen\'s complex landscape.'}
            </p>
            <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
              {isAr
                ? 'تعتمد المؤسسة على الشراكة الوثيقة مع المجتمعات المحلية والمنظمات الإنسانية والمانحين الدوليين، لبناء قدرات الوسطاء المحليين، وتقديم العون القضائي للمستضعفين، وتعزيز المشاركة الفاعلة للشباب والنساء في صنع القرار المحلي والمصالحة المجتمعية.'
                : 'Through deep-rooted partnerships with local communities, international donors, and humanitarian agencies, the foundation builds the capacities of local mediators, provides pro-bono legal defense for the vulnerable, and fosters youth and women leadership in local governance and community reconciliation.'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Card style={{ borderInlineStart: '4px solid var(--color-brand-primary)' }}>
              <CardTitle>{isAr ? 'رسالتنا المؤسسية' : 'Our Mission'}</CardTitle>
              <CardContent>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                  {isAr
                    ? 'العمل الدؤوب لتحقيق مجتمع يسوده السلام والعدالة عبر تمكين النساء والشباب، وتوفير الحماية القانونية، ودعم مبادرات الوساطة والتنمية المستدامة في المجتمعات المحلية.'
                    : 'Striving towards a society characterized by peace and justice by empowering women and youth, providing robust legal protection, and fostering local mediation initiatives across communities.'}
                </p>
              </CardContent>
            </Card>

            <Card style={{ borderInlineStart: '4px solid var(--color-brand-secondary)' }}>
              <CardTitle>{isAr ? 'رؤيتنا المستقبلية' : 'Our Vision'}</CardTitle>
              <CardContent>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                  {isAr
                    ? 'نحو مجتمع يمني يتمتع فيه الجميع بالعدالة والمساواة، وتلعب فيه النساء والشباب دوراً ريادياً في صنع القرار وبناء السلام بحلول عام 2030.'
                    : 'Towards a Yemeni society where all individuals enjoy justice and equality, with women and youth playing an active leadership role in decision-making and sustainable peace by 2030.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Narrative Section 2: Core Focus Areas */}
        <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: 'var(--space-8)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
          <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-4)' }}>
            {isAr ? 'مرتكزات النهج المؤسسي' : 'Institutional Approach Pillars'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)' }}>
            <div>
              <h4 style={{ fontSize: 'var(--text-base)', color: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <IconScale size={18} />
                <span>{isAr ? 'النزاهة والاستقلالية' : 'Integrity & Neutrality'}</span>
              </h4>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {isAr
                  ? 'الالتزام التام بمبادئ العمل الإنساني والحياد الإيجابي وعدم الانحياز لأي طرف سياسي أو مناطقي.'
                  : 'Strict adherence to humanitarian principles, operational impartiality, and independence from all political factions.'}
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: 'var(--text-base)', color: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <IconShield size={18} />
                <span>{isAr ? 'سيادة القانون وحقوق الإنسان' : 'Rule of Law & Human Rights'}</span>
              </h4>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {isAr
                  ? 'صون حقوق الإنسان الدستورية والدولية وتقديم الدعم القضائي للفئات الأشد تضرراً.'
                  : 'Safeguarding constitutional civil rights and extending pro-bono judicial support to vulnerable populations.'}
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: 'var(--text-base)', color: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <IconUsers size={18} />
                <span>{isAr ? 'النهج التشاركي المجتمعي' : 'Grassroots Participation'}</span>
              </h4>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {isAr
                  ? 'تمكين المبادرات المحلية وإشراك القيادات المجتمعية والقبلية والنسوية في صياغة الحلول.'
                  : 'Empowering local community initiatives and engaging tribal, civic, and female leaders in crafting viable solutions.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
