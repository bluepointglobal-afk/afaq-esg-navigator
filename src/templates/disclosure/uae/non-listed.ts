// UAE Non-Listed Company Disclosure Template
// Targets private companies in the UAE (SMEs, family businesses, private equity-backed)

import type { DisclosureTemplate } from '../types';

export const UAE_NON_LISTED_TEMPLATE: DisclosureTemplate = {
  id: 'UAE_NON_LISTED_V1',
  version: '1.0.0',
  jurisdiction: 'UAE',
  listingStatus: 'non-listed',

  sections: [
    {
      id: 'governance',
      pillar: 'governance',
      title: 'Corporate Governance Disclosure',
      titleArabic: 'إفصاح حوكمة الشركات',
      order: 1,

      systemPrompt: `You are a corporate disclosure writer specializing in UAE non-listed companies (private SMEs, family businesses). Generate professional governance narratives based on assessment data.

STRICT GUARDRAILS:
1. NO LEGAL ADVICE: Never provide legal opinions or definitive compliance statements.
2. HEDGED LANGUAGE: Use "appears to," "based on provided data," "may indicate," etc.
3. NO FABRICATED CITATIONS: Use placeholder format: [SOURCE_REQUIRED: UAE Commercial Companies Law, Article X]
4. EVIDENCE-BASED ONLY: Base narratives strictly on provided data.
5. HIGHLIGHT GAPS: Explicitly state missing information.
6. PROFESSIONAL TONE: Formal, suitable for stakeholder disclosure.

OUTPUT FORMAT: JSON with narrative, narrativeArabic, dataPoints, citationPlaceholders, missingInformation.`,

      userPromptTemplate: `Write a corporate governance disclosure narrative for {{companyName}}, a non-listed company in the UAE.

COMPANY PROFILE:
- Company Name: {{companyName}}
- Sector: {{sector}}
- Employee Count: {{employeeCountBand}}
- Operational Years: {{operationalYears}}

ASSESSMENT RESULTS:
- Overall Score: {{overallScore}}/100
- Governance Pillar Score: {{governanceScore}}/100
- Critical Gaps: {{criticalGapCount}}

KEY GOVERNANCE GAPS:
{{governanceGaps}}

RECOMMENDATIONS:
{{governanceRecommendations}}

QUESTIONNAIRE SUMMARY (Governance):
{{governanceAnswers}}

TASK:
Write a 200-400 word narrative for a non-listed company covering:
1. Ownership structure and decision-making processes
2. Board or management committee structure (if applicable)
3. Internal governance policies and procedures
4. Stakeholder engagement practices
5. Identified strengths and areas for improvement

Note: Non-listed companies have different governance expectations than listed entities. Focus on proportionate governance practices suitable for company size and maturity.

Use hedged language. Insert citation placeholders for UAE Commercial Companies Law where appropriate.`,

      userPromptTemplateArabic: `اكتب سردًا للإفصاح عن حوكمة الشركات لشركة {{companyName}}، وهي شركة غير مدرجة في الإمارات العربية المتحدة.

ملف الشركة:
- اسم الشركة: {{companyName}}
- القطاع: {{sector}}
- عدد الموظفين: {{employeeCountBand}}
- سنوات التشغيل: {{operationalYears}}

نتائج التقييم:
- الدرجة الإجمالية: {{overallScore}}/100
- درجة ركن الحوكمة: {{governanceScore}}/100
- الفجوات الحرجة: {{criticalGapCount}}

الفجوات الرئيسية في الحوكمة:
{{governanceGaps}}

التوصيات:
{{governanceRecommendations}}

ملخص الاستبيان (الحوكمة):
{{governanceAnswers}}

المهمة:
اكتب سردًا من 200-400 كلمة لشركة غير مدرجة يغطي:
1. هيكل الملكية وعمليات صنع القرار
2. هيكل مجلس الإدارة أو لجنة الإدارة (إن وجد)
3. سياسات وإجراءات الحوكمة الداخلية
4. ممارسات إشراك أصحاب المصلحة
5. نقاط القوة المحددة ومجالات التحسين

ملاحظة: الشركات غير المدرجة لديها توقعات حوكمة مختلفة عن الكيانات المدرجة. ركز على ممارسات الحوكمة المتناسبة مع حجم الشركة ونضجها.`,

      expectedDataPoints: [
        'Management structure',
        'Decision-making authority',
        'Internal policies documented',
        'Stakeholder communication mechanisms',
      ],

      citationPlaceholders: [
        '[SOURCE_REQUIRED: UAE Commercial Companies Law, Governance Requirements]',
        '[SOURCE_REQUIRED: UAE Economic Department Guidelines for SMEs]',
      ],
    },

    {
      id: 'esg',
      pillar: 'esg',
      title: 'Environmental, Social & Sustainability Disclosure',
      titleArabic: 'إفصاح البيئة والمجتمع والاستدامة',
      order: 2,

      systemPrompt: `You are an ESG disclosure specialist for UAE non-listed companies. Generate narratives based on assessment data.

GUARDRAILS: No legal advice, hedged language, citation placeholders, evidence-based only.`,

      userPromptTemplate: `Write an ESG disclosure narrative for {{companyName}}, a non-listed UAE company.

COMPANY PROFILE:
- Sector: {{sector}}
- Employee Count: {{employeeCountBand}}

ASSESSMENT RESULTS:
- ESG Pillar Score: {{esgScore}}/100

KEY ESG GAPS:
{{esgGaps}}

RECOMMENDATIONS:
{{esgRecommendations}}

QUESTIONNAIRE SUMMARY (ESG):
{{esgAnswers}}

TASK:
Write a 200-400 word narrative covering:
1. Environmental practices (energy, waste, resource management)
2. Social responsibility (employee welfare, community engagement)
3. Sustainability initiatives appropriate for company size
4. Strengths and improvement areas

Focus on practical ESG practices suitable for non-listed SMEs. Use hedged language.`,

      userPromptTemplateArabic: `اكتب سردًا للإفصاح عن البيئة والمجتمع والحوكمة لشركة {{companyName}}، وهي شركة إماراتية غير مدرجة.

ملف الشركة:
- القطاع: {{sector}}
- عدد الموظفين: {{employeeCountBand}}

نتائج التقييم:
- درجة ركن البيئة والمجتمع والحوكمة: {{esgScore}}/100

الفجوات الرئيسية:
{{esgGaps}}

التوصيات:
{{esgRecommendations}}

ملخص الاستبيان:
{{esgAnswers}}

المهمة:
اكتب سردًا من 200-400 كلمة يغطي:
1. الممارسات البيئية (الطاقة، النفايات، إدارة الموارد)
2. المسؤولية الاجتماعية (رعاية الموظفين، إشراك المجتمع)
3. مبادرات الاستدامة المناسبة لحجم الشركة
4. نقاط القوة ومجالات التحسين`,

      expectedDataPoints: [
        'Environmental practices status',
        'Employee welfare programs',
        'Community engagement activities',
      ],

      citationPlaceholders: ['[SOURCE_REQUIRED: UAE Environmental Guidelines for SMEs]'],
    },

    {
      id: 'risk_controls',
      pillar: 'risk_controls',
      title: 'Risk Management & Internal Controls Disclosure',
      titleArabic: 'إفصاح إدارة المخاطر والضوابط الداخلية',
      order: 3,

      systemPrompt: `You are a risk management disclosure writer for UAE non-listed companies. Generate narratives based on assessment data.

GUARDRAILS: No legal advice, hedged language, citation placeholders, evidence-based only.`,

      userPromptTemplate: `Write a risk management disclosure narrative for {{companyName}}, a non-listed UAE company.

ASSESSMENT RESULTS:
- Risk & Controls Pillar Score: {{riskScore}}/100

KEY RISK GAPS:
{{riskGaps}}

RECOMMENDATIONS:
{{riskRecommendations}}

QUESTIONNAIRE SUMMARY (Risk):
{{riskAnswers}}

TASK:
Write a 200-400 word narrative covering:
1. Risk identification and management processes
2. Internal control mechanisms
3. Financial controls and segregation of duties
4. Business continuity considerations
5. Strengths and gaps

Focus on practical risk management appropriate for non-listed companies. Use hedged language.`,

      userPromptTemplateArabic: `اكتب سردًا للإفصاح عن إدارة المخاطر لشركة {{companyName}}، وهي شركة إماراتية غير مدرجة.

نتائج التقييم:
- درجة ركن المخاطر والضوابط: {{riskScore}}/100

الفجوات الرئيسية:
{{riskGaps}}

التوصيات:
{{riskRecommendations}}

ملخص الاستبيان:
{{riskAnswers}}

المهمة:
اكتب سردًا من 200-400 كلمة يغطي إدارة المخاطر والضوابط الداخلية المناسبة للشركات غير المدرجة.`,

      expectedDataPoints: [
        'Risk management approach',
        'Internal controls presence',
        'Financial oversight mechanisms',
      ],

      citationPlaceholders: ['[SOURCE_REQUIRED: UAE Internal Control Standards]'],
    },

    {
      id: 'transparency',
      pillar: 'transparency',
      title: 'Transparency & Disclosure Practices',
      titleArabic: 'ممارسات الشفافية والإفصاح',
      order: 4,

      systemPrompt: `You are a transparency disclosure writer for UAE non-listed companies. Generate narratives based on assessment data.

GUARDRAILS: No legal advice, hedged language, citation placeholders, evidence-based only.`,

      userPromptTemplate: `Write a transparency disclosure narrative for {{companyName}}, a non-listed UAE company.

ASSESSMENT RESULTS:
- Transparency Pillar Score: {{transparencyScore}}/100

KEY TRANSPARENCY GAPS:
{{transparencyGaps}}

RECOMMENDATIONS:
{{transparencyRecommendations}}

QUESTIONNAIRE SUMMARY (Transparency):
{{transparencyAnswers}}

TASK:
Write a 200-400 word narrative covering:
1. Financial reporting practices
2. Stakeholder communication (investors, employees, customers)
3. Information disclosure policies
4. Transparency in operations
5. Strengths and gaps

Focus on practical transparency appropriate for non-listed companies. Use hedged language.`,

      userPromptTemplateArabic: `اكتب سردًا للإفصاح عن الشفافية لشركة {{companyName}}، وهي شركة إماراتية غير مدرجة.

نتائج التقييم:
- درجة ركن الشفافية: {{transparencyScore}}/100

الفجوات الرئيسية:
{{transparencyGaps}}

التوصيات:
{{transparencyRecommendations}}

ملخص الاستبيان:
{{transparencyAnswers}}

المهمة:
اكتب سردًا من 200-400 كلمة يغطي ممارسات الشفافية المناسبة للشركات غير المدرجة.`,

      expectedDataPoints: [
        'Financial reporting frequency',
        'Stakeholder engagement approach',
        'Information disclosure practices',
      ],

      citationPlaceholders: ['[SOURCE_REQUIRED: UAE Commercial Disclosure Standards]'],
    },
  ],

  disclaimers: [
    {
      type: 'legal',
      text: 'This disclosure is based on self-reported data and does not constitute legal or regulatory advice. Companies should consult qualified professionals for compliance guidance specific to UAE regulations for non-listed entities.',
      textArabic:
        'يستند هذا الإفصاح إلى بيانات مبلغ عنها ذاتيًا ولا يشكل استشارة قانونية أو تنظيمية. يجب على الشركات استشارة متخصصين مؤهلين للحصول على إرشادات الامتثال الخاصة باللوائح الإماراتية للكيانات غير المدرجة.',
      order: 1,
    },
    {
      type: 'methodology',
      text: 'Narratives generated using AI-assisted analysis of assessment results. All regulatory citations are placeholders requiring manual verification before use.',
      textArabic:
        'تم إنشاء السرديات باستخدام تحليل بمساعدة الذكاء الاصطناعي. جميع الاستشهادات التنظيمية هي عناصر نائبة تتطلب التحقق اليدوي قبل الاستخدام.',
      order: 2,
    },
    {
      type: 'informational',
      text: 'This disclosure is intended for voluntary stakeholder communication. Non-listed companies may have different disclosure requirements than publicly traded entities.',
      textArabic:
        'هذا الإفصاح مخصص للتواصل الطوعي مع أصحاب المصلحة. قد يكون لدى الشركات غير المدرجة متطلبات إفصاح مختلفة عن الكيانات المتداولة علنًا.',
      order: 3,
    },
  ],

  createdAt: '2024-12-21T00:00:00Z',
  updatedAt: '2024-12-21T00:00:00Z',
};
