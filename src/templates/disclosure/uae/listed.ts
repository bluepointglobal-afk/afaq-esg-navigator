// UAE Listed Company Disclosure Template
// Targets companies listed on ADX, DFM, or other UAE exchanges

import type { DisclosureTemplate } from '../types';

export const UAE_LISTED_TEMPLATE: DisclosureTemplate = {
  id: 'UAE_LISTED_V1',
  version: '1.0.0',
  jurisdiction: 'UAE',
  listingStatus: 'listed',

  sections: [
    {
      id: 'governance',
      pillar: 'governance',
      title: 'Corporate Governance Disclosure',
      titleArabic: 'إفصاح حوكمة الشركات',
      order: 1,

      systemPrompt: `You are a corporate disclosure writer specializing in UAE-listed companies. Your task is to generate professional governance narratives based on assessment data.

STRICT GUARDRAILS:
1. NO LEGAL ADVICE: Never provide legal opinions or definitive compliance statements.
2. HEDGED LANGUAGE: Use "appears to," "based on provided data," "may indicate," "suggests that," etc.
3. NO FABRICATED CITATIONS: If a regulatory reference is needed, use placeholder format: [SOURCE_REQUIRED: UAE Corporate Governance Code, Article X]
4. EVIDENCE-BASED ONLY: Base narratives strictly on provided assessment scores, gaps, and user answers.
5. HIGHLIGHT GAPS: Explicitly state "Information not provided" or "Further documentation required" for missing data.
6. PROFESSIONAL TONE: Formal, objective, suitable for stakeholder disclosure.

OUTPUT FORMAT: JSON with narrative, narrativeArabic, dataPoints, citationPlaceholders, missingInformation.`,

      userPromptTemplate: `Write a corporate governance disclosure narrative for {{companyName}}, a company listed on {{stockExchange}} in the UAE.

COMPANY PROFILE:
- Company Name: {{companyName}}
- Stock Exchange: {{stockExchange}}
- Sector: {{sector}}
- Employee Count: {{employeeCountBand}}
- Reporting Year: {{reportingYear}}

ASSESSMENT RESULTS:
- Overall Score: {{overallScore}}/100
- Governance Pillar Score: {{governanceScore}}/100
- Critical Gaps: {{criticalGapCount}}
- High Gaps: {{highGapCount}}

KEY GOVERNANCE GAPS:
{{governanceGaps}}

RECOMMENDATIONS:
{{governanceRecommendations}}

QUESTIONNAIRE SUMMARY (Governance):
{{governanceAnswers}}

TASK:
Write a 200-400 word narrative summarizing the company's governance practices, board structures, committee effectiveness, and compliance readiness based ONLY on the data above.

Structure:
1. Board composition and leadership structure
2. Committee structures (audit, risk, nomination)
3. Governance policies and frameworks
4. Identified strengths
5. Areas requiring attention (gaps)

Use hedged language throughout. Insert citation placeholders where regulatory references to UAE Corporate Governance Code or stock exchange rules would be appropriate. List any missing information that prevents full assessment.`,

      userPromptTemplateArabic: `اكتب سردًا للإفصاح عن حوكمة الشركات لشركة {{companyName}}، وهي شركة مدرجة في {{stockExchange}} في الإمارات العربية المتحدة.

ملف الشركة:
- اسم الشركة: {{companyName}}
- البورصة: {{stockExchange}}
- القطاع: {{sector}}
- عدد الموظفين: {{employeeCountBand}}
- سنة الإبلاغ: {{reportingYear}}

نتائج التقييم:
- الدرجة الإجمالية: {{overallScore}}/100
- درجة ركن الحوكمة: {{governanceScore}}/100
- الفجوات الحرجة: {{criticalGapCount}}
- الفجوات العالية: {{highGapCount}}

الفجوات الرئيسية في الحوكمة:
{{governanceGaps}}

التوصيات:
{{governanceRecommendations}}

ملخص الاستبيان (الحوكمة):
{{governanceAnswers}}

المهمة:
اكتب سردًا من 200-400 كلمة يلخص ممارسات الحوكمة للشركة وهياكل المجلس وفعالية اللجان وجاهزية الامتثال بناءً فقط على البيانات أعلاه.

الهيكل:
1. تكوين مجلس الإدارة وهيكل القيادة
2. هياكل اللجان (المراجعة، المخاطر، الترشيحات)
3. سياسات وأطر الحوكمة
4. نقاط القوة المحددة
5. المجالات التي تتطلب الاهتمام (الفجوات)

استخدم لغة محايدة في جميع الأنحاء. أدرج عناصر نائبة للاستشهاد حيثما تكون المراجع التنظيمية لقواعد حوكمة الشركات الإماراتية أو قواعد البورصة مناسبة. اذكر أي معلومات مفقودة تمنع التقييم الكامل.`,

      expectedDataPoints: [
        'Board size and composition',
        'Independent directors percentage',
        'Board meeting frequency',
        'Audit committee presence',
        'Risk committee presence',
        'Nomination committee presence',
      ],

      citationPlaceholders: [
        '[SOURCE_REQUIRED: UAE Corporate Governance Code, Clause 3.1 - Board Composition]',
        '[SOURCE_REQUIRED: UAE Corporate Governance Code, Clause 5.1 - Committee Requirements]',
        '[SOURCE_REQUIRED: ADX/DFM Listing Rules, Section on Governance Compliance]',
      ],
    },

    {
      id: 'esg',
      pillar: 'esg',
      title: 'Environmental, Social & Sustainability Disclosure',
      titleArabic: 'إفصاح البيئة والمجتمع والاستدامة',
      order: 2,

      systemPrompt: `You are an ESG disclosure specialist for UAE-listed companies. Generate narratives based on assessment data with strict adherence to non-legal, hedged language.

GUARDRAILS: Same as governance section - no legal advice, hedged language, citation placeholders, evidence-based only.`,

      userPromptTemplate: `Write an ESG disclosure narrative for {{companyName}}, listed on {{stockExchange}}.

COMPANY PROFILE:
- Sector: {{sector}}
- Has International Operations: {{hasInternationalOps}}
- Has Critical Infrastructure: {{hasCriticalInfrastructure}}

ASSESSMENT RESULTS:
- ESG Pillar Score: {{esgScore}}/100
- Critical Gaps: {{esgCriticalGapCount}}

KEY ESG GAPS:
{{esgGaps}}

RECOMMENDATIONS:
{{esgRecommendations}}

QUESTIONNAIRE SUMMARY (ESG):
{{esgAnswers}}

TASK:
Write a 200-400 word narrative covering:
1. Environmental management practices (energy, emissions, waste)
2. Social responsibility (labor, community, diversity)
3. Sustainability initiatives and goals
4. Identified strengths and gaps

Use hedged language. Insert citation placeholders for UAE environmental regulations or sustainability guidelines where appropriate.`,

      userPromptTemplateArabic: `اكتب سردًا للإفصاح عن البيئة والمجتمع والحوكمة (ESG) لشركة {{companyName}}، المدرجة في {{stockExchange}}.

ملف الشركة:
- القطاع: {{sector}}
- لديها عمليات دولية: {{hasInternationalOps}}
- لديها بنية تحتية حرجة: {{hasCriticalInfrastructure}}

نتائج التقييم:
- درجة ركن البيئة والمجتمع والحوكمة: {{esgScore}}/100
- الفجوات الحرجة: {{esgCriticalGapCount}}

الفجوات الرئيسية في البيئة والمجتمع والحوكمة:
{{esgGaps}}

التوصيات:
{{esgRecommendations}}

ملخص الاستبيان (البيئة والمجتمع والحوكمة):
{{esgAnswers}}

المهمة:
اكتب سردًا من 200-400 كلمة يغطي:
1. ممارسات الإدارة البيئية (الطاقة، الانبعاثات، النفايات)
2. المسؤولية الاجتماعية (العمالة، المجتمع، التنوع)
3. مبادرات وأهداف الاستدامة
4. نقاط القوة والفجوات المحددة

استخدم لغة محايدة. أدرج عناصر نائبة للاستشهاد للوائح البيئية الإماراتية أو إرشادات الاستدامة حيثما كان ذلك مناسبًا.`,

      expectedDataPoints: [
        'Environmental management system status',
        'Carbon emissions tracking',
        'Waste management practices',
        'Employee diversity metrics',
        'Community engagement programs',
      ],

      citationPlaceholders: [
        '[SOURCE_REQUIRED: UAE Environmental Regulations]',
        '[SOURCE_REQUIRED: UAE Vision 2021 - Sustainability Guidelines]',
      ],
    },

    {
      id: 'risk_controls',
      pillar: 'risk_controls',
      title: 'Risk Management & Internal Controls Disclosure',
      titleArabic: 'إفصاح إدارة المخاطر والضوابط الداخلية',
      order: 3,

      systemPrompt: `You are a risk management disclosure writer for UAE-listed companies. Generate narratives based on assessment data.

GUARDRAILS: No legal advice, hedged language, citation placeholders, evidence-based only.`,

      userPromptTemplate: `Write a risk management disclosure narrative for {{companyName}}, listed on {{stockExchange}}.

COMPANY PROFILE:
- Sector: {{sector}}
- Has International Operations: {{hasInternationalOps}}
- Has Critical Infrastructure: {{hasCriticalInfrastructure}}

ASSESSMENT RESULTS:
- Risk & Controls Pillar Score: {{riskScore}}/100
- Critical Gaps: {{riskCriticalGapCount}}

KEY RISK GAPS:
{{riskGaps}}

RECOMMENDATIONS:
{{riskRecommendations}}

QUESTIONNAIRE SUMMARY (Risk):
{{riskAnswers}}

TASK:
Write a 200-400 word narrative covering:
1. Risk governance framework and oversight
2. Key risk categories identified (financial, operational, compliance, strategic)
3. Internal control systems and monitoring
4. Business continuity and crisis management
5. Identified strengths and gaps

Use hedged language. Insert citation placeholders for UAE risk management standards where appropriate.`,

      userPromptTemplateArabic: `اكتب سردًا للإفصاح عن إدارة المخاطر لشركة {{companyName}}، المدرجة في {{stockExchange}}.

ملف الشركة:
- القطاع: {{sector}}
- لديها عمليات دولية: {{hasInternationalOps}}
- لديها بنية تحتية حرجة: {{hasCriticalInfrastructure}}

نتائج التقييم:
- درجة ركن المخاطر والضوابط: {{riskScore}}/100
- الفجوات الحرجة: {{riskCriticalGapCount}}

الفجوات الرئيسية في المخاطر:
{{riskGaps}}

التوصيات:
{{riskRecommendations}}

ملخص الاستبيان (المخاطر):
{{riskAnswers}}

المهمة:
اكتب سردًا من 200-400 كلمة يغطي:
1. إطار حوكمة المخاطر والإشراف
2. فئات المخاطر الرئيسية المحددة (المالية، التشغيلية، الامتثال، الاستراتيجية)
3. أنظمة الرقابة الداخلية والمراقبة
4. استمرارية الأعمال وإدارة الأزمات
5. نقاط القوة والفجوات المحددة

استخدم لغة محايدة. أدرج عناصر نائبة للاستشهاد لمعايير إدارة المخاطر الإماراتية حيثما كان ذلك مناسبًا.`,

      expectedDataPoints: [
        'Risk committee existence',
        'Enterprise risk management framework',
        'Internal audit function',
        'Business continuity plan status',
      ],

      citationPlaceholders: [
        '[SOURCE_REQUIRED: UAE Corporate Governance Code, Risk Management Requirements]',
      ],
    },

    {
      id: 'transparency',
      pillar: 'transparency',
      title: 'Transparency & Disclosure Practices',
      titleArabic: 'ممارسات الشفافية والإفصاح',
      order: 4,

      systemPrompt: `You are a financial transparency disclosure writer for UAE-listed companies. Generate narratives based on assessment data.

GUARDRAILS: No legal advice, hedged language, citation placeholders, evidence-based only.`,

      userPromptTemplate: `Write a transparency disclosure narrative for {{companyName}}, listed on {{stockExchange}}.

ASSESSMENT RESULTS:
- Transparency Pillar Score: {{transparencyScore}}/100
- Critical Gaps: {{transparencyCriticalGapCount}}

KEY TRANSPARENCY GAPS:
{{transparencyGaps}}

RECOMMENDATIONS:
{{transparencyRecommendations}}

QUESTIONNAIRE SUMMARY (Transparency):
{{transparencyAnswers}}

TASK:
Write a 200-400 word narrative covering:
1. Financial reporting quality and timeliness
2. Stakeholder communication practices
3. Disclosure policies and procedures
4. Related party transaction transparency
5. Identified strengths and gaps

Use hedged language. Insert citation placeholders for UAE disclosure requirements and stock exchange rules.`,

      userPromptTemplateArabic: `اكتب سردًا للإفصاح عن الشفافية لشركة {{companyName}}، المدرجة في {{stockExchange}}.

نتائج التقييم:
- درجة ركن الشفافية: {{transparencyScore}}/100
- الفجوات الحرجة: {{transparencyCriticalGapCount}}

الفجوات الرئيسية في الشفافية:
{{transparencyGaps}}

التوصيات:
{{transparencyRecommendations}}

ملخص الاستبيان (الشفافية):
{{transparencyAnswers}}

المهمة:
اكتب سردًا من 200-400 كلمة يغطي:
1. جودة التقارير المالية وتوقيتها
2. ممارسات التواصل مع أصحاب المصلحة
3. سياسات وإجراءات الإفصاح
4. شفافية معاملات الأطراف ذات العلاقة
5. نقاط القوة والفجوات المحددة

استخدم لغة محايدة. أدرج عناصر نائبة للاستشهاد لمتطلبات الإفصاح الإماراتية وقواعد البورصة.`,

      expectedDataPoints: [
        'Annual report publication status',
        'Stakeholder engagement mechanisms',
        'Related party disclosure policy',
      ],

      citationPlaceholders: [
        '[SOURCE_REQUIRED: UAE Corporate Governance Code, Disclosure Requirements]',
        '[SOURCE_REQUIRED: Stock Exchange Continuous Disclosure Rules]',
      ],
    },
  ],

  disclaimers: [
    {
      type: 'legal',
      text: 'This disclosure is based on self-reported data and does not constitute legal or regulatory advice. Companies should consult qualified professionals for compliance guidance specific to UAE regulations and stock exchange requirements.',
      textArabic:
        'يستند هذا الإفصاح إلى بيانات مبلغ عنها ذاتيًا ولا يشكل استشارة قانونية أو تنظيمية. يجب على الشركات استشارة متخصصين مؤهلين للحصول على إرشادات الامتثال الخاصة باللوائح الإماراتية ومتطلبات البورصة.',
      order: 1,
    },
    {
      type: 'methodology',
      text: 'Narratives generated using AI-assisted analysis of assessment results. All regulatory citations are placeholders requiring manual verification and replacement with authoritative sources before publication.',
      textArabic:
        'تم إنشاء السرديات باستخدام تحليل بمساعدة الذكاء الاصطناعي لنتائج التقييم. جميع الاستشهادات التنظيمية هي عناصر نائبة تتطلب التحقق اليدوي والاستبدال بمصادر موثوقة قبل النشر.',
      order: 2,
    },
    {
      type: 'informational',
      text: 'This disclosure is intended for informational purposes and stakeholder communication. It does not replace formal regulatory filings required by UAE authorities or stock exchanges.',
      textArabic:
        'هذا الإفصاح مخصص لأغراض إعلامية والتواصل مع أصحاب المصلحة. لا يحل محل الإيداعات التنظيمية الرسمية المطلوبة من قبل السلطات الإماراتية أو البورصات.',
      order: 3,
    },
  ],

  createdAt: '2024-12-21T00:00:00Z',
  updatedAt: '2024-12-21T00:00:00Z',
};
