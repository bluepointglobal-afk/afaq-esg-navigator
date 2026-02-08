// Qatar Listed Company Disclosure Template
// Targets companies listed on Qatar Stock Exchange (QSE)

import type { DisclosureTemplate } from '../types';

export const QATAR_LISTED_TEMPLATE: DisclosureTemplate = {
  id: 'QATAR_LISTED_V1',
  version: '1.0.0',
  jurisdiction: 'Qatar',
  listingStatus: 'listed',

  sections: [
    {
      id: 'governance',
      pillar: 'governance',
      title: 'Corporate Governance Disclosure',
      titleArabic: 'إفصاح حوكمة الشركات',
      order: 1,

      systemPrompt: `Corporate disclosure writer for Qatar-listed companies (QSE). Align with QFMA governance code. Hedged language, no legal advice, citation placeholders.`,

      userPromptTemplate: `Write governance disclosure for {{companyName}}, listed on Qatar Stock Exchange.

COMPANY: {{companyName}} | {{stockExchange}} | {{sector}}

SCORES: Overall {{overallScore}}/100 | Governance {{governanceScore}}/100 | Critical Gaps: {{criticalGapCount}}

GAPS: {{governanceGaps}}
RECOMMENDATIONS: {{governanceRecommendations}}
ANSWERS: {{governanceAnswers}}

TASK: 200-400 words covering board composition aligned with QFMA requirements, committee structures, governance frameworks, strengths, and gaps. Use hedged language. [SOURCE_REQUIRED: QFMA Governance Code, Article X] for citations.`,

      userPromptTemplateArabic: `اكتب إفصاحًا عن حوكمة الشركات لشركة {{companyName}}، المدرجة في بورصة قطر.

الدرجات: الإجمالية {{overallScore}}/100 | الحوكمة {{governanceScore}}/100 | الفجوات الحرجة: {{criticalGapCount}}

المهمة: 200-400 كلمة تغطي تكوين مجلس الإدارة بما يتماشى مع متطلبات هيئة قطر للأسواق المالية وهياكل اللجان وأطر الحوكمة.`,

      expectedDataPoints: [
        'Board size and composition',
        'Independent directors',
        'Board committees',
        'QFMA compliance status',
      ],

      citationPlaceholders: [
        '[SOURCE_REQUIRED: QFMA Governance Code for Listed Companies]',
        '[SOURCE_REQUIRED: QSE Listing Rules, Governance Requirements]',
      ],
    },

    {
      id: 'esg',
      pillar: 'esg',
      title: 'Environmental, Social & Sustainability Disclosure',
      titleArabic: 'إفصاح البيئة والمجتمع والاستدامة',
      order: 2,

      systemPrompt: `ESG disclosure writer for Qatar-listed companies. Align with Qatar National Vision 2030. Hedged language, citation placeholders.`,

      userPromptTemplate: `Write ESG disclosure for {{companyName}}, QSE-listed.

SCORES: ESG {{esgScore}}/100
GAPS: {{esgGaps}}
RECOMMENDATIONS: {{esgRecommendations}}
ANSWERS: {{esgAnswers}}

TASK: 200-400 words on environmental practices, social responsibility (Qatarization, labor rights), sustainability aligned with Qatar National Vision 2030, FIFA 2022 legacy commitments (if applicable). Hedged language. [SOURCE_REQUIRED: ...] for citations.`,

      userPromptTemplateArabic: `اكتب إفصاحًا عن البيئة والمجتمع لشركة {{companyName}}.

الدرجات: البيئة والمجتمع {{esgScore}}/100

المهمة: 200-400 كلمة حول الممارسات البيئية والمسؤولية الاجتماعية (القطرة، حقوق العمال) والاستدامة بما يتماشى مع رؤية قطر الوطنية 2030.`,

      expectedDataPoints: [
        'Environmental management',
        'Qatarization percentage',
        'Employee welfare programs',
        'Qatar Vision 2030 alignment',
      ],

      citationPlaceholders: [
        '[SOURCE_REQUIRED: Qatar National Vision 2030 - Environmental Pillar]',
        '[SOURCE_REQUIRED: Qatar Labor Law]',
      ],
    },

    {
      id: 'risk_controls',
      pillar: 'risk_controls',
      title: 'Risk Management & Internal Controls Disclosure',
      titleArabic: 'إفصاح إدارة المخاطر والضوابط الداخلية',
      order: 3,

      systemPrompt: `Risk disclosure writer for Qatar-listed companies. Hedged language, citation placeholders.`,

      userPromptTemplate: `Write risk disclosure for {{companyName}}, QSE-listed.

SCORES: Risk {{riskScore}}/100
GAPS: {{riskGaps}}
RECOMMENDATIONS: {{riskRecommendations}}

TASK: 200-400 words on risk governance, internal controls, audit functions, business continuity aligned with QFMA requirements. [SOURCE_REQUIRED: ...].`,

      userPromptTemplateArabic: `اكتب إفصاحًا عن إدارة المخاطر لشركة {{companyName}}.

الدرجات: المخاطر {{riskScore}}/100

المهمة: 200-400 كلمة حول حوكمة المخاطر والضوابط الداخلية ووظائف المراجعة واستمرارية الأعمال.`,

      expectedDataPoints: ['Risk committee', 'Internal audit', 'ERM framework'],

      citationPlaceholders: ['[SOURCE_REQUIRED: QFMA Risk Management Requirements]'],
    },

    {
      id: 'transparency',
      pillar: 'transparency',
      title: 'Transparency & Disclosure Practices',
      titleArabic: 'ممارسات الشفافية والإفصاح',
      order: 4,

      systemPrompt: `Transparency disclosure writer for Qatar-listed companies. Hedged language.`,

      userPromptTemplate: `Write transparency disclosure for {{companyName}}, QSE-listed.

SCORES: Transparency {{transparencyScore}}/100
GAPS: {{transparencyGaps}}

TASK: 200-400 words on financial reporting, stakeholder communication, disclosure policies, related party transactions. [SOURCE_REQUIRED: ...].`,

      userPromptTemplateArabic: `اكتب إفصاحًا عن الشفافية لشركة {{companyName}}.

الدرجات: الشفافية {{transparencyScore}}/100

المهمة: 200-400 كلمة حول التقارير المالية والتواصل مع أصحاب المصلحة وسياسات الإفصاح.`,

      expectedDataPoints: ['Annual report', 'Disclosure policy', 'RPT disclosure'],

      citationPlaceholders: ['[SOURCE_REQUIRED: QSE Continuous Disclosure Rules]'],
    },
  ],

  disclaimers: [
    {
      type: 'legal',
      text: 'Based on self-reported data. Not legal advice. Consult professionals for QFMA compliance.',
      textArabic: 'بناءً على بيانات مبلغ عنها ذاتيًا. ليست استشارة قانونية. استشر متخصصين.',
      order: 1,
    },
    {
      type: 'methodology',
      text: 'AI-assisted narratives. All regulatory citations require verification.',
      textArabic: 'سرديات بمساعدة الذكاء الاصطناعي. جميع الاستشهادات تتطلب التحقق.',
      order: 2,
    },
    {
      type: 'informational',
      text: 'For stakeholder communication. Does not replace formal QSE filings.',
      textArabic: 'للتواصل مع أصحاب المصلحة. لا يحل محل إيداعات بورصة قطر الرسمية.',
      order: 3,
    },
  ],

  createdAt: '2024-12-21T00:00:00Z',
  updatedAt: '2024-12-21T00:00:00Z',
};
