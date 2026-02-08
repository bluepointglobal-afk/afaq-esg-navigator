// KSA Listed Company Disclosure Template
// Targets companies listed on Saudi Stock Exchange (Tadawul)

import type { DisclosureTemplate } from '../types';

export const KSA_LISTED_TEMPLATE: DisclosureTemplate = {
  id: 'KSA_LISTED_V1',
  version: '1.0.0',
  jurisdiction: 'KSA',
  listingStatus: 'listed',

  sections: [
    {
      id: 'governance',
      pillar: 'governance',
      title: 'Corporate Governance Disclosure',
      titleArabic: 'إفصاح حوكمة الشركات',
      order: 1,

      systemPrompt: `You are a corporate disclosure writer for Saudi-listed companies. Generate governance narratives aligned with KSA Corporate Governance Regulations.

STRICT GUARDRAILS: No legal advice, hedged language only, citation placeholders [SOURCE_REQUIRED: ...], evidence-based, highlight gaps.`,

      userPromptTemplate: `Write a corporate governance disclosure for {{companyName}}, listed on Tadawul.

COMPANY: {{companyName}} | Sector: {{sector}} | Employees: {{employeeCountBand}}

SCORES: Overall {{overallScore}}/100 | Governance {{governanceScore}}/100 | Critical Gaps: {{criticalGapCount}}

GAPS: {{governanceGaps}}
RECOMMENDATIONS: {{governanceRecommendations}}
ANSWERS: {{governanceAnswers}}

TASK: 200-400 words covering board composition, committee structures, Sharia compliance (if applicable), governance policies, strengths, and gaps. Use hedged language. Insert [SOURCE_REQUIRED: KSA CMA Regulations, Article X] for citations.`,

      userPromptTemplateArabic: `اكتب إفصاحًا عن حوكمة الشركات لشركة {{companyName}}، المدرجة في تداول.

الشركة: {{companyName}} | القطاع: {{sector}} | الموظفون: {{employeeCountBand}}

الدرجات: الإجمالية {{overallScore}}/100 | الحوكمة {{governanceScore}}/100 | الفجوات الحرجة: {{criticalGapCount}}

الفجوات: {{governanceGaps}}
التوصيات: {{governanceRecommendations}}
الإجابات: {{governanceAnswers}}

المهمة: 200-400 كلمة تغطي تكوين المجلس وهياكل اللجان والامتثال الشرعي (إن وجد) وسياسات الحوكمة ونقاط القوة والفجوات.`,

      expectedDataPoints: [
        'Board size and composition',
        'Independent directors percentage',
        'Board committees',
        'Sharia board presence (if applicable)',
      ],

      citationPlaceholders: [
        '[SOURCE_REQUIRED: KSA Corporate Governance Regulations, Article 17]',
        '[SOURCE_REQUIRED: Tadawul Listing Rules, Governance Section]',
      ],
    },

    {
      id: 'esg',
      pillar: 'esg',
      title: 'Environmental, Social & Sustainability Disclosure',
      titleArabic: 'إفصاح البيئة والمجتمع والاستدامة',
      order: 2,

      systemPrompt: `ESG disclosure writer for Saudi-listed companies. Align with Vision 2030 sustainability goals. Hedged language, no legal advice, citation placeholders.`,

      userPromptTemplate: `Write ESG disclosure for {{companyName}}, Tadawul-listed.

SCORES: ESG {{esgScore}}/100
GAPS: {{esgGaps}}
RECOMMENDATIONS: {{esgRecommendations}}
ANSWERS: {{esgAnswers}}

TASK: 200-400 words on environmental practices, social responsibility (Saudization, labor rights), sustainability aligned with Vision 2030. Hedged language. Use [SOURCE_REQUIRED: ...] for citations.`,

      userPromptTemplateArabic: `اكتب إفصاحًا عن البيئة والمجتمع والحوكمة لشركة {{companyName}}.

الدرجات: البيئة والمجتمع {{esgScore}}/100
الفجوات: {{esgGaps}}
التوصيات: {{esgRecommendations}}

المهمة: 200-400 كلمة حول الممارسات البيئية والمسؤولية الاجتماعية (السعودة، حقوق العمال) والاستدامة بما يتماشى مع رؤية 2030.`,

      expectedDataPoints: [
        'Environmental management status',
        'Saudization percentage',
        'Employee training programs',
        'Vision 2030 alignment initiatives',
      ],

      citationPlaceholders: [
        '[SOURCE_REQUIRED: KSA Vision 2030 - Environmental Objectives]',
        '[SOURCE_REQUIRED: Saudi Labor Law, Worker Rights]',
      ],
    },

    {
      id: 'risk_controls',
      pillar: 'risk_controls',
      title: 'Risk Management & Internal Controls Disclosure',
      titleArabic: 'إفصاح إدارة المخاطر والضوابط الداخلية',
      order: 3,

      systemPrompt: `Risk management disclosure writer for Saudi-listed companies. Hedged language, citation placeholders, evidence-based.`,

      userPromptTemplate: `Write risk management disclosure for {{companyName}}, Tadawul-listed.

SCORES: Risk {{riskScore}}/100
GAPS: {{riskGaps}}
RECOMMENDATIONS: {{riskRecommendations}}

TASK: 200-400 words on risk governance, internal controls, audit functions, business continuity. Use [SOURCE_REQUIRED: ...] for KSA regulations.`,

      userPromptTemplateArabic: `اكتب إفصاحًا عن إدارة المخاطر لشركة {{companyName}}.

الدرجات: المخاطر {{riskScore}}/100

المهمة: 200-400 كلمة حول حوكمة المخاطر والضوابط الداخلية ووظائف المراجعة واستمرارية الأعمال.`,

      expectedDataPoints: ['Risk committee', 'Internal audit function', 'ERM framework'],

      citationPlaceholders: [
        '[SOURCE_REQUIRED: KSA CMA Regulations, Risk Management Requirements]',
      ],
    },

    {
      id: 'transparency',
      pillar: 'transparency',
      title: 'Transparency & Disclosure Practices',
      titleArabic: 'ممارسات الشفافية والإفصاح',
      order: 4,

      systemPrompt: `Transparency disclosure writer for Saudi-listed companies. Hedged language, citation placeholders.`,

      userPromptTemplate: `Write transparency disclosure for {{companyName}}, Tadawul-listed.

SCORES: Transparency {{transparencyScore}}/100
GAPS: {{transparencyGaps}}

TASK: 200-400 words on financial reporting, stakeholder communication, disclosure policies, related party transactions. Use [SOURCE_REQUIRED: ...].`,

      userPromptTemplateArabic: `اكتب إفصاحًا عن الشفافية لشركة {{companyName}}.

الدرجات: الشفافية {{transparencyScore}}/100

المهمة: 200-400 كلمة حول التقارير المالية والتواصل مع أصحاب المصلحة وسياسات الإفصاح.`,

      expectedDataPoints: ['Annual report status', 'Disclosure policy', 'RPT transparency'],

      citationPlaceholders: ['[SOURCE_REQUIRED: Tadawul Continuous Disclosure Rules]'],
    },
  ],

  disclaimers: [
    {
      type: 'legal',
      text: 'This disclosure is based on self-reported data and does not constitute legal or regulatory advice. Companies should consult qualified professionals for KSA CMA compliance guidance.',
      textArabic:
        'يستند هذا الإفصاح إلى بيانات مبلغ عنها ذاتيًا ولا يشكل استشارة قانونية أو تنظيمية. يجب على الشركات استشارة متخصصين مؤهلين للامتثال.',
      order: 1,
    },
    {
      type: 'methodology',
      text: 'Narratives generated using AI-assisted analysis. All regulatory citations require manual verification.',
      textArabic: 'تم إنشاء السرديات بمساعدة الذكاء الاصطناعي. تتطلب جميع الاستشهادات التحقق اليدوي.',
      order: 2,
    },
    {
      type: 'informational',
      text: 'This disclosure is for stakeholder communication and does not replace formal Tadawul filings.',
      textArabic: 'هذا الإفصاح للتواصل مع أصحاب المصلحة ولا يحل محل إيداعات تداول الرسمية.',
      order: 3,
    },
  ],

  createdAt: '2024-12-21T00:00:00Z',
  updatedAt: '2024-12-21T00:00:00Z',
};
