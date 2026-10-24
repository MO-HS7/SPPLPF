import Link from 'next/link';
import { DEFAULT_LOCALE, getDictionary, isValidLocale, type Locale } from '../../../../lib/i18n';
import { Breadcrumbs, PageHeader } from '../../../../components/layout';
import { Accordion } from '../../../../components/ui';

export default async function GoalsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const isAr = locale === 'ar';

  const goalsAccordion = [
    {
      id: 'g-1',
      title: isAr
        ? 'الهدف الأول: تعزيز السلام الاجتماعي وترسيخ الوساطة المحلية'
        : 'Goal 1: Advancing Social Peace & Institutionalizing Local Mediation',
      content: (
        <div>
          <p>
            {isAr
              ? 'تأسيس شبكات وساطة محلية مؤهلة في المديريات المتأثرة بالنزاع، ودعم الوسطاء المحليين بالأدوات المنهجية اللازمة لفض النزاعات وتيسير اتفاقات تبادل المحتجزين واستعادة الجثامين وفتح المعابر الإنسانية.'
              : 'Establishing qualified local mediator networks in conflict-affected districts, supporting community mediators with standard methodologies to de-escalate disputes and broker humanitarian agreements.'}
          </p>
          <ul style={{ paddingInlineStart: '1.25rem', marginTop: '0.5rem', listStyle: 'disc' }}>
            <li>{isAr ? 'تيسير اتفاقات المصالحة المجتمعية عبر خطوط التماس.' : 'Facilitate community reconciliation pacts across conflict lines.'}</li>
            <li>{isAr ? 'حماية الوسطاء وتوفير بيئة عمل آمنة ومحايدة لعملهم الإنساني.' : 'Safeguard mediators and secure neutral operational space.'}</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'g-2',
      title: isAr
        ? 'الهدف الثاني: توفير الحماية القانونية وسيادة القانون ومساندة الضحايا'
        : 'Goal 2: Expanding Legal Protection, Rule of Law & Victim Support',
      content: (
        <div>
          <p>
            {isAr
              ? 'تقديم العون القضائي والاستشارات القانونية المجانية للمحتجزين احتياطياً خارج إطار القانون، ومراقبة التزام الأجهزة الأمنية والقضائية بإجراءات المحاكمة العادلة وضمان كرامة أماكن التوقيف.'
              : 'Extending pro-bono judicial representation and legal clinics for arbitrary detainees, monitoring procedural due process, and elevating detention condition safeguards.'}
          </p>
          <ul style={{ paddingInlineStart: '1.25rem', marginTop: '0.5rem', listStyle: 'disc' }}>
            <li>{isAr ? 'تقديم المساعدة القانونية للنساء والأحداث والفئات المستضعفة.' : 'Extend legal aid for women, juveniles, and marginalized groups.'}</li>
            <li>{isAr ? 'الرقابة على مراكز الاحتجاز والحد من الحبس الاحتياطي غير القانوني.' : 'Inspect detention facilities to curtail unlawful pre-trial detention.'}</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'g-3',
      title: isAr
        ? 'الهدف الثالث: تمكين النساء والشباب في قيادة السلام وصنع القرار'
        : 'Goal 3: Empowering Women & Youth in Peace Leadership & Decision-Making',
      content: (
        <div>
          <p>
            {isAr
              ? 'بناء قدرات الشابات والشباب في مهارات التفاوض، التحليل السياسي، وصناعة السياسات، لضمان مشاركتهم الفاعلة في لجان المصالحة والتخطيط المحلي بحلول عام 2030.'
              : 'Building youth and women capacities in negotiation, strategic analysis, and policy formulation to institutionalize their role in local reconciliation by 2030.'}
          </p>
        </div>
      ),
    },
    {
      id: 'g-4',
      title: isAr
        ? 'الهدف الرابع: تطوير الحوكمة والنزاهة المؤسسية لمنظمات المجتمع المدني'
        : 'Goal 4: Institutional Governance, Transparency & Civil Society Capacity',
      content: (
        <div>
          <p>
            {isAr
              ? 'تطوير آليات الحوكمة الداخلية، معايير مكافحة الفساد، والامتثال المالي والإداري لمنظمات المجتمع المدني، ورفع الوعي بالأمن السيبراني لحماية بيانات المدنيين.'
              : 'Upgrading internal governance benchmarks, anti-corruption compliance, and administrative transparency while reinforcing digital safety for civilian data.'}
          </p>
        </div>
      ),
    },
    {
      id: 'g-5',
      title: isAr
        ? 'الهدف الخامس: تحسين سبل العيش وتعزيز صمود الفئات الأشد تضرراً'
        : 'Goal 5: Livelihood Resilience for Vulnerable & Displaced Communities',
      content: (
        <div>
          <p>
            {isAr
              ? 'دعم المبادرات المجتمعية لتعزيز الصمود الاقتصادي وتوفير سبل العيش المستدامة للنازحين والمجتمعات المضيفة، بما يسهم في استدامة السلام الاجتماعي.'
              : 'Fostering community-led economic resilience and sustainable livelihoods for displaced and host communities to underpin durable social stability.'}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={dict.nav.goals}
        subtitle={
          isAr
            ? 'الأهداف الخمسة الاستراتيجية لمؤسسة تعزيز السلام والحماية القانونية حتى عام 2030.'
            : 'The five strategic institutional goals guiding SPPLPF interventions through 2030.'
        }
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            items={[
              { label: dict.nav.about, href: `/${locale}/about` },
              { label: dict.nav.goals },
            ]}
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
              backgroundColor: 'var(--color-bg-surface)',
              color: 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
              border: '1px solid var(--color-border-subtle)',
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
              backgroundColor: 'var(--color-brand-primary)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 'var(--text-sm)',
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

        <div style={{ maxWidth: '900px', marginInline: 'auto' }}>
          <Accordion items={goalsAccordion} defaultOpenId="g-1" allowMultiple />
        </div>
      </div>
    </div>
  );
}
