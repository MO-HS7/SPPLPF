import type {
  AuditLogDemo,
  ContentItemDemo,
  InquiryDemo,
  OfficeDemo,
  ProgramDemo,
  PublicationDemo,
  UserDemo,
} from './types';

export const INITIAL_CONTENT_ITEMS: ContentItemDemo[] = [
  {
    id: 'cnt-001',
    slug: 'local-mediation-reconciliation-marib',
    type: 'news',
    status: 'PUBLISHED',
    titleAr: 'عقد الاجتماع الأول للجنة المصالحة المجتمعية بمحافظة مأرب لتعزيز مسارات الوساطة المحلية',
    titleEn: 'First Meeting of Community Reconciliation Committee Convened in Marib to Advance Local Mediation',
    summaryAr: 'نظمت المؤسسة بمحافظة مأرب اللقاء التنسيقي الأول للوسطاء المحليين والوجهاء الاجتماعيين وممثلي السلطة المحلية لترسيخ آليات حل النزاعات وتسهيل الممرات الإنسانية.',
    summaryEn: 'The foundation organized the inaugural coordination meeting in Marib bringing together local mediators, tribal elders, and local authority delegates to institutionalize conflict resolution mechanisms.',
    bodyAr: `في إطار مشروع "تعزيز الوساطة المحلية في اليمن"، عقدت مؤسسة حماية القانون وتعزيز السلم الاجتماعي بمحافظة مأرب اللقاء الأول لأعضاء لجنة المصالحة المجتمعية، بمشاركة نخبة من الشخصيات الاجتماعية والوسطاء المحليين وقيادات الأحزاب وممثلي السلطات المحلية على مستوى المديريات والمحافظة.

ناقش اللقاء التحديات الميدانية التي تواجه الوسطاء المحليين في ظل تراجع المساحات المدنية، واستعرض النجاحات السابقة التي تحققت في تيسير التهدئة المجتمعية وتبادل المحتجزين واستعادة الجثامين عبر خطوط التماس.

وأكد المشاركون على ضرورة مأسسة عمل لجان الوساطة المجتمعية وتوفير الضمانات القانونية والأمنية الكفيلة بحماية الوسطاء، وتعزيز قنوات الاتصال والتنسيق المستمر مع مختلف الأطراف لتحقيق الاستقرار الإنساني والاجتماعي في المحافظة.`,
    bodyEn: `Within the framework of the "Enhancing Local Mediation in Yemen" project, the Law Protection & Social Peace Foundation (Provisional) in Marib convened the first meeting of the Community Reconciliation Committee. Participants included prominent local mediators, community leaders, and district authority representatives.

The meeting addressed critical operational challenges facing mediators amidst shrinking civic space, reviewing prior milestones in de-escalation, prisoner exchanges, and body recovery agreements across conflict lines.

Attendees underscored the vital necessity of institutionalizing community mediation committees, safeguarding mediators legally, and maintaining neutral communication channels across divides to advance humanitarian stability.`,
    category: 'وساطة محلية / Local Mediation',
    publishedAt: '2026-10-18',
    updatedAt: '2026-10-20',
    author: 'فريق الإعلام والاتصال / Communications Desk',
    tags: ['وساطة محلية', 'مأرب', 'حماية مدنية', 'مصالحة مجتمعية'],
  },
  {
    id: 'cnt-002',
    slug: 'legal-oversight-transparency-workshop-taiz',
    type: 'activity',
    status: 'PUBLISHED',
    titleAr: 'ورشة عمل حول "تعزيز آليات الرقابة القانونية ومبادئ النزاهة والشفافية" بمحافظة تعز',
    titleEn: 'Workshop on "Strengthening Legal Oversight Mechanisms and Principles of Transparency and Integrity" in Taiz',
    summaryAr: 'بمشاركة قضاة وأعضاء نيابة ومحامين وممثلي أجهزة رقابية، نفذت المؤسسة حلقة نقاشية لتعزيز إجراءات التقاضي العادل وضمانات المحتجزين.',
    summaryEn: 'Convening judges, prosecutors, lawyers, and oversight body representatives, the foundation conducted an expert roundtable advancing fair trial safeguards.',
    bodyAr: `أقامت مؤسسة حماية القانون وتعزيز السلم الاجتماعي في المقر الرئيسي بمدينة تعز ورشة عمل متخصصة بعنوان "تعزيز آليات الرقابة القانونية ومبادئ النزاهة والشفافية"، بمشاركة واسعة من القضاة ووكلاء النيابة والمحامين (من الجنسين) وممثلي الأجهزة الرقابية ومنظمات المجتمع المدني.

ركزت الورشة على تقييم إجراءات الضبط والاحتجاز، وضمان التزام مأموري الضبط القضائي بنصوص القوانين الوطنية والمواثيق الدولية المعنية بحقوق الإنسان، والحد من حالات الاحتجاز التعسفي أو الإطالة في الحبس الاحتياطي.

وخرجت الورشة بمجموعة من التوصيات العملية شملت تفعيل الرقابة الدورية على مراكز الاحتجاز، وتطوير التنسيق بين النيابة العامة ونقابة المحامين، وتقديم العون القضائي للفئات الضعيفة والأشد فقراً.`,
    bodyEn: `At its headquarters in Taiz, the Law Protection & Social Peace Foundation (Provisional) conducted a specialized workshop entitled "Strengthening Legal Oversight Mechanisms and Principles of Transparency and Integrity," attended by judges, public prosecutors, legal practitioners, and civil society oversight delegates.

Discussions focused on detention safeguards, ensuring law enforcement compliance with national statutes and international humanitarian norms, and eliminating unlawful detention practices.

Recommendations emphasized periodic inspections of detention facilities, structured coordination between prosecution offices and the bar association, and expanding legal aid for vulnerable populations.`,
    category: 'سيادة القانون / Rule of Law',
    publishedAt: '2026-10-14',
    updatedAt: '2026-10-15',
    author: 'وحدة الرقابة وحقوق الإنسان / Human Rights Unit',
    tags: ['سيادة القانون', 'تعز', 'عدالة', 'رقابة قانونية'],
  },
  {
    id: 'cnt-003',
    slug: 'digital-security-civilian-protection-training',
    type: 'activity',
    status: 'PUBLISHED',
    titleAr: 'دورة تدريبية في الأمن الرقمي وضوابط التفتيش القانوني لضباط الأمن والشرطة',
    titleEn: 'Digital Security and Lawful Search Protocol Training for Police and Security Officers',
    summaryAr: 'برنامج تدريبي لبناء قدرات مأموري الضبط القضائي في التعامل مع البيانات الرقمية وصون خصوصية المدنيين عند نقاط التفتيش.',
    summaryEn: 'Capacity-building program for law enforcement officers on managing digital evidence and safeguarding civilian digital privacy at checkpoints.',
    bodyAr: `اختتمت المؤسسة في تعز دورة تدريبية مكثفة شارك فيها 12 ضابطاً من منتسبي الأجهزة الأمنية والشرطة، تمحورت حول المعايير القانونية لحماية الخصوصية الرقمية للمواطنين عند نقاط التفتيش وإجراءات التوقيف والاشتباه.

تلقى المشاركون تدريبات تطبيقية حول الضوابط القانونية لتفتيش الهواتف والأجهزة الإلكترونية، والتمييز بين الإجراءات التحفظية القانونية والتعدي غير المبرر على سرية البيانات الشخصية، بهدف رفع الوعي المهني وحماية حقوق المواطنين وحرياتهم الأساسية.`,
    bodyEn: `The foundation concluded an intensive training program in Taiz for security officers on legal benchmarks safeguarding citizens' digital privacy during checkpoint stops and detention procedures.

Participants received practical guidance on legal limits for inspecting electronic devices, distinguishing between authorized judicial procedures and unlawful intrusions into personal data.`,
    category: 'حقوق الإنسان / Human Rights',
    publishedAt: '2026-10-08',
    updatedAt: '2026-10-09',
    author: 'وحدة التدريب وبناء القدرات / Training Unit',
    tags: ['أمن رقمي', 'حقوق المدنيين', 'تدريب', 'حماية'],
  },
  {
    id: 'cnt-004',
    slug: 'detainee-exchange-humanitarian-corridor-story',
    type: 'story',
    status: 'PUBLISHED',
    titleAr: 'قصة أثر: جهود الوساطة المحلية تنهي معاناة محتجزين وتفتح نافذة للأمل بين المحافظات',
    titleEn: 'Impact Story: Local Mediation Efforts Alleviate Detainee Suffering and Restore Community Hope Across Lines',
    summaryAr: 'كيف أسهم التدخل المحايد للوسطاء المحليين المدعومين من المؤسسة في تسهيل اتفاقات تبادل إنسانية وجمع شمل أسر مفككة.',
    summaryEn: 'How neutral intervention by community mediators facilitated humanitarian exchange agreements and reunited separated families.',
    bodyAr: `وسط تعقيدات المشهد الإنساني وصعوبة التوصل لحلول شاملة، أثبتت شبكات الوسطاء المحليين في اليمن قدرتها على إحداث اختراقات إنسانية ملموسة تنقذ الأرواح وتخفف معاناة المدنيين.

عبر تدريب وتوجيه فرق الوساطة المجتمعية وتوفير الغطاء القانوني واللوجستي المستقل، تدعم المؤسسة جهود تيسير مبادرات تبادل المحتجزين واستعادة الجثامين وبناء الثقة في نطاق العمليات المعتمد (تعز ومأرب وصنعاء) بالاعتماد على بناء الثقة الإنسانية دون أي تسييس.

تمثل هذه القصص دليلاً عملياً على أن السلام المستدام يبدأ من المجتمعات المحلية ويتحقق بأيدي أبنائها المخلصين.`,
    bodyEn: `Amidst multifaceted humanitarian obstacles, community mediator networks in Yemen have demonstrated an extraordinary ability to achieve tangible breakthroughs that alleviate civilian suffering.

Through technical training and independent operational support, the foundation supports the facilitation of humanitarian initiatives and detainee exchanges within operational hubs (Taiz, Marib, Sanaa) based on trust-building and depoliticized engagement.

These narratives demonstrate that durable peace is cultivated from the grassroots through trusted local actors.`,
    category: 'قصص نجاح / Success Stories',
    publishedAt: '2026-09-28',
    updatedAt: '2026-10-01',
    author: 'إدارة البرامج والمشاريع / Programs Division',
    tags: ['قصص أثر', 'تبادل محتجزين', 'سلام مجتمعي', 'إنساني'],
  },
  {
    id: 'cnt-005',
    slug: 'youth-peacebuilders-cohort-graduation',
    type: 'activity',
    status: 'IN_REVIEW',
    titleAr: 'تأهيل 20 شاباً وشابة في مهارات صناعة السلام المجتمعي وتوظيف الإعلام الرقمي',
    titleEn: 'Empowering 20 Young Women and Men in Community Peacebuilding and Digital Advocacy',
    summaryAr: 'برنامج تأهيلي رائد لتعزيز دور الشباب والنساء في مبادرات التماسك الاجتماعي ومكافحة خطاب الكراهية.',
    summaryEn: 'Pioneering training program bolstering youth and women leadership in social cohesion initiatives and countering hate speech.',
    bodyAr: `اختتمت في مركز التدريب المجتمعي فعاليات البرنامج التأهيلي لتمكين الشباب في مجال بناء السلم وفض النزاعات، بمشاركة 20 متدرباً ومتدربة. ركز البرنامج على مهارات التفاوض، تحليل النزاعات المحلية، وتوظيف منصات التواصل الاجتماعي لبث رسائل التسامح والتعايش السلمي.`,
    bodyEn: `The foundation finalized its capacity-building cohort for youth in conflict resolution, engaging 20 young peacebuilders in negotiation skills, dispute analysis, and constructive digital campaigning for tolerance.`,
    category: 'تمكين الشباب / Youth Empowerment',
    publishedAt: '2026-10-22',
    updatedAt: '2026-10-24',
    author: 'منسق برامج الشباب / Youth Officer',
    tags: ['تمكين الشباب', 'صناع السلام', 'تعايش'],
    reviewNotes: 'المادة مكتملة وبانتظار المراجعة اللغوية والاعتماد النهائي للنشر.',
  },
  {
    id: 'cnt-006',
    slug: 'quarterly-human-rights-monitoring-report-draft',
    type: 'news',
    status: 'DRAFT',
    titleAr: 'مسودة: المؤشرات الربعية لرصد حالة حقوق الإنسان والانتهاكات القانونية',
    titleEn: 'Draft: Quarterly Indicators on Human Rights Monitoring and Legal Violations',
    summaryAr: 'مسودة تقرير تحليلي داخلي ترصد انتهاكات الإجراءات القانونية وحالات التوقيف خارج إطار القضاء.',
    summaryEn: 'Internal draft analytical report tracking procedural legal infractions and extrajudicial detentions.',
    bodyAr: `يجري العمل حالياً على إعداد التقرير الدوري لرصد وتوثيق الإجراءات القضائية في المحافظات المستهدفة، بهدف تقديم توصيات للمانحين والجهات القضائية المعنية لتعزيز مبادئ المحاكمة العادلة وحماية الشهود والضحايا.`,
    bodyEn: `Drafting is underway for the quarterly monitoring report reviewing judicial proceedings across targeted regions, establishing recommendations for fair trial guarantees and witness protection.`,
    category: 'تقارير دورية / Monitoring Reports',
    publishedAt: '2026-10-24',
    updatedAt: '2026-10-24',
    author: 'وحدة الرصد والتوثيق / Documentation Desk',
    tags: ['رصد', 'تقارير', 'حقوق إنسان'],
    reviewNotes: 'مسودة عمل أولية — تحتاج إلى تدقيق إحصائي واستكمال جداول الرصد.',
  },
];

export const INITIAL_PROGRAMS: ProgramDemo[] = [
  {
    id: 'prg-001',
    slug: 'local-mediation-initiatives',
    pillar: 'mediation',
    titleAr: 'برنامج تعزيز الوساطة المحلية وفض النزاعات المجتمعية',
    titleEn: 'Local Mediation and Community Conflict Resolution Program',
    descriptionAr: 'برنامج مؤسسي استراتيجي يهدف إلى تمكين الوسطاء والوسيطات المحليين بالأدوات المهنية والشرعية المجتمعية لحل النزاعات على الموارد، فتح الطرقات الإنسانية، وتيسير اتفاقات تبادل الأسرى وجثامين الضحايا.',
    descriptionEn: 'A strategic institutional program equipping community mediators with professional methodologies and community legitimacy to resolve resource disputes, unlock humanitarian corridors, and broker detainee exchanges.',
    objectivesAr: [
      'تأسيس وتدريب شبكات وساطة محلية محايدة في المديريات عالية النزاع.',
      'تيسير اتفاقات المصالحة المجتمعية وفك الاختناقات الإنسانية المعقدة.',
      'توثيق الممارسات الفضلى والأعراف القبلية المتوافقة مع القانون الدولي الإنساني.',
    ],
    objectivesEn: [
      'Establish and train impartial community mediator networks in high-conflict districts.',
      'Facilitate community reconciliation pacts and humanitarian corridors.',
      'Codify customary and local mediation practices aligned with international humanitarian law.',
    ],
    location: 'تعز، مأرب / Taiz, Marib',
    status: 'ACTIVE',
    featured: true,
  },
  {
    id: 'prg-002',
    slug: 'rule-of-law-legal-protection',
    pillar: 'legal',
    titleAr: 'برنامج سيادة القانون والدفاع عن الحقوق والحريات',
    titleEn: 'Rule of Law and Civil Rights Defense Program',
    descriptionAr: 'يقدم البرنامج العون القضائي والاستشارات القانونية المجانية للضحايا والمحتجزين تعسفياً، مع الرقابة المباشرة على ضمانات المحاكمة العادلة وكرامة أماكن التوقيف.',
    descriptionEn: 'Providing free legal representation and consultations for vulnerable victims and detainees, alongside direct monitoring of fair trial procedures and detention facility standards.',
    objectivesAr: [
      'توفير محامين معتمدين للترافع عن الفئات الأشد احتياجاً والنساء والأطفال.',
      'الرقابة على الإجراءات الجزائية ومكافحة الحبس الاحتياطي غير القانوني.',
      'عقد دورات توعوية للمواطنين حول حقوقهم الدستورية والقانونية.',
    ],
    objectivesEn: [
      'Provide accredited legal counsel defending marginalized groups, women, and minors.',
      'Monitor criminal procedures to eliminate illegal preventive detentions.',
      'Conduct civic awareness clinics educating citizens on constitutional protections.',
    ],
    location: 'تعز، مأرب، صنعاء / Taiz, Marib, Sanaa',
    status: 'ACTIVE',
    featured: true,
  },
  {
    id: 'prg-003',
    slug: 'women-youth-peace-empowerment',
    pillar: 'empowerment',
    titleAr: 'برنامج تمكين النساء والشباب في قيادة السلام وصنع القرار',
    titleEn: 'Women and Youth Empowerment in Peace Leadership Program',
    descriptionAr: 'يهدف البرنامج إلى كسر الحواجز الاجتماعية وتعزيز مشاركة النساء والشباب في لجان المصالحة والتخطيط المحلي من خلال بناء القدرات القيادية والتحليلية والاتصالية.',
    descriptionEn: 'Breaking social barriers to institutionalize active participation of women and youth in reconciliation committees and local development decision-making.',
    objectivesAr: [
      'تأهيل 100 قيادية شابة في مهارات التفاوض والتأثير وصناعة السياسات.',
      'دعم مبادرات شبابية ميدانية لنبذ العنف وتعزيز التماسك الاجتماعي.',
      'إشراك النساء في لجان الوساطة وفض النزاعات المحلية بنسبة لا تقل عن 30%.',
    ],
    objectivesEn: [
      'Equip 100 young women leaders in negotiation, advocacy, and policy drafting.',
      'Fund and mentor grassroots youth campaigns countering violence and hate speech.',
      'Secure at least 30% women representation in local mediation councils.',
    ],
    location: 'تعز، مأرب / Taiz, Marib',
    status: 'ACTIVE',
    featured: true,
  },
  {
    id: 'prg-004',
    slug: 'institutional-governance-transparency',
    pillar: 'governance',
    titleAr: 'برنامج تعزيز الحوكمة والنزاهة المؤسسية لمنظمات المجتمع المدني',
    titleEn: 'Institutional Governance and NGO Transparency Program',
    descriptionAr: 'بناء قدرات المنظمات والمبادرات الأهلية في معايير الامتثال المالي والإداري، مكافحة غسل الأموال، والأمن السيبراني، بما يعزز ثقة المجتمعات والجهات المانحة.',
    descriptionEn: 'Strengthening CSO compliance in administrative integrity, anti-corruption, financial transparency, and cybersecurity to foster donor and community trust.',
    objectivesAr: [
      'تطوير أدلة إجرائية للحوكمة والامتثال متوافقة مع المتطلبات الدولية.',
      'تدريب كوادر المنظمات الشريكة على إدارة المخاطر وسرية البيانات.',
      'تعزيز الشراكات بين المجتمع المدني والأجهزة الرقابية الرسمية.',
    ],
    objectivesEn: [
      'Develop standard operating procedures for institutional governance and compliance.',
      'Train CSO personnel on risk mitigation and civilian data confidentiality.',
      'Facilitate constructive partnerships between civil society and statutory oversight bodies.',
    ],
    location: 'تعز، مأرب، صنعاء / Taiz, Marib, Sanaa',
    status: 'ACTIVE',
    featured: false,
  },
];

export const INITIAL_PUBLICATIONS: PublicationDemo[] = [
  {
    id: 'pub-001',
    slug: 'local-mediation-yemen-challenges-perspectives',
    titleAr: 'واقع الوساطة المحلية في اليمن: التحديات الميدانية والفرص الواعدة (2024 - 2026)',
    titleEn: 'Local Mediation Dynamics in Yemen: Operational Challenges and Emerging Opportunities',
    summaryAr: 'دراسة تحليلية شاملة توثق تجارب الوسطاء المحليين وتستخلص الدروس المستفادة في فتح الطرق وتيسير التهدئة الإنسانية.',
    summaryEn: 'Comprehensive policy paper documenting grassroots mediation milestones, de-escalation models, and lessons learned across conflict lines.',
    category: 'أوراق سياسات / Policy Papers',
    publishedAt: '2026-09-15',
    pages: 48,
    fileSize: '3.4 MB',
    downloadCount: 342,
  },
  {
    id: 'pub-002',
    slug: 'legal-safeguards-detention-monitoring-guide',
    titleAr: 'دليل الضمانات القانونية وإجراءات المحاكمة العادلة في التشريع اليمني والاتفاقيات الدولية',
    titleEn: 'Handbook on Legal Procedural Safeguards and Fair Trial Standards in Yemeni Jurisprudence',
    summaryAr: 'دليل تدريبي وعملي موجه للقضاة والمحامين ومأموري الضبط القضائي لحماية حقوق المحتجزين والمدنيين.',
    summaryEn: 'Practical guidance manual for legal practitioners, magistrates, and law enforcement on safeguarding civilian detainee rights.',
    category: 'أدلة إجرائية / Manuals',
    publishedAt: '2026-08-10',
    pages: 64,
    fileSize: '4.8 MB',
    downloadCount: 512,
  },
  {
    id: 'pub-003',
    slug: 'women-peace-security-local-councils-assessment',
    titleAr: 'تقييم مشاركة المرأة والشباب في لجان المصالحة وبناء السلام المحلي: مؤشرات وتوصيات',
    titleEn: 'Assessment of Women and Youth Inclusion in Local Peace and Reconciliation Committees',
    summaryAr: 'ورقة بحثية تسلط الضوء على العقبات الهيكلية والاجتماعية التي تواجه النساء في لجان الوساطة وتقترح حلولاً عملية لتعزيز دورهن القيادي.',
    summaryEn: 'Empirical assessment analyzing structural and societal barriers to women mediation leadership with actionable policy interventions.',
    category: 'دراسات بحثية / Research Studies',
    publishedAt: '2026-07-22',
    pages: 36,
    fileSize: '2.1 MB',
    downloadCount: 289,
  },
];

export const INITIAL_OFFICES: OfficeDemo[] = [
  {
    id: 'ofc-001',
    slug: 'taiz-headquarters',
    cityAr: 'محافظة تعز',
    cityEn: 'Taiz Governorate',
    roleAr: 'المقر الرئيسي ومركز القيادة والعمليات',
    roleEn: 'Headquarters & Core Operational Command',
    addressAr: 'شارع جمال، المجمع الإداري، مدينة تعز',
    addressEn: 'Gamal Street, Administrative Complex, Taiz City',
    scopeAr: 'إدارة وتنسيق كافة البرامج والعمليات الميدانية والمؤسسية للمؤسسة انطلاقاً من المقر الرئيسي في تعز.',
    scopeEn: 'Overall operational command, governance, and institutional management from Taiz headquarters.',
    phone: '+967 4 250 881',
    email: 'taiz@spplpf.org',
    isHeadquarters: true,
  },
  {
    id: 'ofc-002',
    slug: 'marib-branch',
    cityAr: 'محافظة مأرب',
    cityEn: 'Marib Governorate',
    roleAr: 'الفرع الميداني والتنفيذي',
    roleEn: 'Field Branch & Operational Hub',
    addressAr: 'حي السلام، بالقرب من المجمع الحكومي، مدينة مأرب',
    addressEn: 'Al-Salam District, Near Government Complex, Marib City',
    scopeAr: 'تنفيذ برامج الوساطة المجتمعية، حماية النازحين، والأنشطة الإنسانية بموجب تصريح فرعي يغطي عموم مديريات مأرب.',
    scopeEn: 'Delivering community mediation, IDP legal defense, and community reconciliation across all Marib districts.',
    phone: '+967 6 304 912',
    email: 'marib@spplpf.org',
    isHeadquarters: false,
  },
  {
    id: 'ofc-003',
    slug: 'sanaa-office',
    cityAr: 'أمانة العاصمة صنعاء',
    cityEn: 'Sanaa Capital Governorate',
    roleAr: 'مكتب التنسيق المتخصص',
    roleEn: 'Specialized Coordination Hub',
    addressAr: 'حي حدة، المنطقة الدبلوماسية، صنعاء',
    addressEn: 'Hadda District, Diplomatic Zone, Sanaa',
    scopeAr: 'تنفيذ المهام المتخصصة والمحايدة، والتنسيق القانوني للمسار الثاني بما يضمن سلامة الكادر واستقلالية المؤسسة.',
    scopeEn: 'Neutral track-two legal coordination, mediation engagements, and technical liaison under national registration.',
    phone: '+967 1 442 119',
    email: 'sanaa@spplpf.org',
    isHeadquarters: false,
  },
];

export const INITIAL_INQUIRIES: InquiryDemo[] = [
  {
    id: 'inq-001',
    fullName: 'عبدالله محمد الشميري / Abdullah Al-Shimiri',
    email: 'a.shimiri@example.org',
    phone: '+967 777 123 456',
    subject: 'طلب عون قضائي واستشارة قانونية لمحتجز احتياطياً',
    message: 'نرجو من الفريق القانوني بالمؤسسة تقديم المساندة القانونية لمواطن تم احتجازه دون أمر قضائي في مديرية المعافر وتجاوزت مدة توقيفه المهلة القانونية.',
    category: 'عون قانوني / Legal Aid',
    status: 'NEW',
    submittedAt: '2026-10-24 14:22',
  },
  {
    id: 'inq-002',
    fullName: 'أروى سلطان القباطي / Arwa Al-Qubati',
    email: 'arwa.qubati@example.net',
    phone: '+967 733 987 654',
    subject: 'استفسار حول التسجيل في دفعة برنامج القيادات الشابة لبناء السلام',
    message: 'أرغب بالاستفسار عن موعد إطلاق الدفعة الثانية من برنامج تدريب القيادات الشابة ومطابقة الشروط لممثلات المبادرات المجتمعية في مأرب.',
    category: 'تدريب وبناء قدرات / Capacity Building',
    status: 'IN_REVIEW',
    submittedAt: '2026-10-23 09:15',
    notes: 'تمت مراجعة الطلب وتحويله لمنسق التدريب لإرسال استمارة التسجيل الرسمية.',
  },
  {
    id: 'inq-003',
    fullName: 'د. طارق الحكيمي / Dr. Tariq Al-Hakimi',
    email: 't.hakimi@research-inst.org',
    phone: '+967 711 554 433',
    subject: 'طلب تعاون بحثي واقتباس من دراسة الوساطة المحلية',
    message: 'نود التنسيق مع فريق الدراسات بالمؤسسة لعقد جلسة نقاشية والاستفادة من مخرجات تقرير الوساطة المحلية الصادر عنكم مؤخراً.',
    category: 'شراكات ودراسات / Research Partnerships',
    status: 'RESPONDED',
    submittedAt: '2026-10-21 16:40',
    notes: 'تم الرد رسمياً عبر البريد الإلكتروني وتزويد الباحث بالنسخة الكاملة للدراسة.',
  },
];

export const INITIAL_USERS: UserDemo[] = [
  {
    id: 'usr-001',
    name: 'مهند حسن / Mohannad Hassan',
    email: 'admin@spplpf.org',
    role: 'SUPER_ADMIN',
    isActive: true,
    lastLoginAt: '2026-10-24 23:40',
  },
  {
    id: 'usr-002',
    name: 'سارة عبدالكريم / Sarah Abdulkarim',
    email: 'content.mgr@spplpf.org',
    role: 'CONTENT_MANAGER',
    isActive: true,
    lastLoginAt: '2026-10-24 18:22',
  },
  {
    id: 'usr-003',
    name: 'حذيفة المهدي / Hothifa Al-Mahdi',
    email: 'author@spplpf.org',
    role: 'CONTENT_AUTHOR',
    isActive: true,
    lastLoginAt: '2026-10-23 11:05',
  },
  {
    id: 'usr-004',
    name: 'مروان الشرجبي / Marwan Al-Sharjabi',
    email: 'compliance@spplpf.org',
    role: 'AUDITOR',
    isActive: true,
    lastLoginAt: '2026-10-22 15:30',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogDemo[] = [
  {
    id: 'aud-001',
    actor: 'admin@spplpf.org (SUPER_ADMIN)',
    action: 'CONTENT_PUBLISH',
    entity: 'ContentItem [cnt-001]',
    details: 'Published article "عقد الاجتماع الأول للجنة المصالحة المجتمعية بمحافظة مأرب"',
    timestamp: '2026-10-24 23:38:57',
  },
  {
    id: 'aud-002',
    actor: 'content.mgr@spplpf.org (CONTENT_MANAGER)',
    action: 'WORKFLOW_SUBMIT',
    entity: 'ContentItem [cnt-005]',
    details: 'Submitted article for review: "تأهيل 20 شاباً وشابة في مهارات صناعة السلام"',
    timestamp: '2026-10-24 19:10:14',
  },
  {
    id: 'aud-003',
    actor: 'admin@spplpf.org (SUPER_ADMIN)',
    action: 'USER_ROLE_ASSIGN',
    entity: 'User [usr-003]',
    details: 'Assigned role CONTENT_AUTHOR to Hothifa Al-Mahdi',
    timestamp: '2026-10-24 14:05:22',
  },
  {
    id: 'aud-004',
    actor: 'compliance@spplpf.org (AUDITOR)',
    action: 'AUDIT_LOG_VIEW',
    entity: 'AuditLogSubsystem',
    details: 'Auditor queried authentication and permission logs for the last 7 days',
    timestamp: '2026-10-23 10:18:45',
  },
];
