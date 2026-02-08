// KSA Non-Listed Company Disclosure Template
// Targets private companies in Saudi Arabia

import type { DisclosureTemplate } from '../types';

export const KSA_NON_LISTED_TEMPLATE: DisclosureTemplate = {
  id: 'KSA_NON_LISTED_V1',
  version: '1.0.0',
  jurisdiction: 'KSA',
  listingStatus: 'non-listed',

  sections: [
    {
      id: 'governance',
      pillar: 'governance',
      title: 'Corporate Governance Disclosure',
      titleArabic: 'إفصاح حوكمة الشركات',
      order: 1,

      systemPrompt: `Corporate disclosure writer for Saudi non-listed companies (SMEs, family businesses). Hedged language, no legal advice, citation placeholders.`,

      userPromptTemplate: `Write governance disclosure for {{companyName}}, a non-listed Saudi company.

COMPANY: {{sector}} | {{employeeCountBand}} employees | {{operationalYears}} years operating

SCORES: Governance {{governanceScore}}/100 | Critical Gaps: {{criticalGapCount}}
GAPS: {{governanceGaps}}
RECOMMENDATIONS: {{governanceRecommendations}}

TASK: 200-400 words on ownership structure, management processes, internal policies appropriate for non-listed SMEs. Hedged language. [SOURCE_REQUIRED: ...] for citations.`,

      userPromptTemplateArabic: `اكتب إفصاحًا عن الحوكمة لشركة {{companyName}}، شركة سعودية غير مدرجة.

الدرجات: الحوكمة {{governanceScore}}/100

المهمة: 200-400 كلمة حول هيكل الملكية وعمليات الإدارة والسياسات الداخلية المناسبة للشركات الصغيرة والمتوسطة غير المدرجة.`,

      expectedDataPoints: [
        'Management structure',
        'Decision-making authority',
        'Documented policies',
      ],

      citationPlaceholders: [
        '[SOURCE_REQUIRED: KSA Companies Law, SME Governance Guidelines]',
      ],
    },

    {
      id: 'esg',
      pillar: 'esg',
      title: 'Environmental, Social & Sustainability Disclosure',
      titleArabic: 'إفصاح البيئة والمجتمع والاستدامة',
      order: 2,

      systemPrompt: `ESG disclosure for Saudi non-listed companies. Focus on practical practices. Hedged language, citation placeholders.`,

      userPromptTemplate: `Write ESG disclosure for {{companyName}}, non-listed Saudi company.

SCORES: ESG {{esgScore}}/100
GAPS: {{esgGaps}}

TASK: 200-400 words on environmental practices, Saudization efforts, employee welfare, community engagement. Align with Vision 2030 where applicable.`,

      userPromptTemplateArabic: `اكتب إفصاحًا عن البيئة والمجتمع لشركة {{companyName}}.

الدرجات: البيئة والمجتمع {{esgScore}}/100

المهمة: 200-400 كلمة حول الممارسات البيئية وجهود السعودة ورعاية الموظفين والمشاركة المجتمعية.`,

      expectedDataPoints: ['Environmental practices', 'Saudization rate', 'Employee programs'],

      citationPlaceholders: ['[SOURCE_REQUIRED: KSA Vision 2030 SME Guidelines]'],
    },

    {
      id: 'risk_controls',
      pillar: 'risk_controls',
      title: 'Risk Management & Internal Controls Disclosure',
      titleArabic: 'إفصاح إدارة المخاطر والضوابط الداخلية',
      order: 3,

      systemPrompt: `Risk disclosure for Saudi non-listed companies. Practical controls. Hedged language.`,

      userPromptTemplate: `Write risk disclosure for {{companyName}}, non-listed Saudi company.

SCORES: Risk {{riskScore}}/100
GAPS: {{riskGaps}}

TASK: 200-400 words on risk management processes, internal controls, financial oversight appropriate for SMEs.`,

      userPromptTemplateArabic: `اكتب إفصاحًا عن المخاطر لشركة {{companyName}}.

المهمة: 200-400 كلمة حول عمليات إدارة المخاطر والضوابط الداخلية المناسبة للشركات الصغيرة والمتوسطة.`,

      expectedDataPoints: ['Risk management approach', 'Internal controls'],

      citationPlaceholders: ['[SOURCE_REQUIRED: KSA Internal Control Standards]'],
    },

    {
      id: 'transparency',
      pillar: 'transparency',
      title: 'Transparency & Disclosure Practices',
      titleArabic: 'ممارسات الشفافية والإفصاح',
      order: 4,

      systemPrompt: `Transparency disclosure for Saudi non-listed companies. Hedged language.`,

      userPromptTemplate: `Write transparency disclosure for {{companyName}}, non-listed Saudi company.

SCORES: Transparency {{transparencyScore}}/100

TASK: 200-400 words on financial reporting, stakeholder communication, transparency practices.`,

      userPromptTemplateArabic: `اكتب إفصاحًا عن الشفافية لشركة {{companyName}}.

المهمة: 200-400 كلمة حول التقارير المالية والتواصل مع أصحاب المصلحة.`,

      expectedDataPoints: ['Financial reporting practices', 'Stakeholder communication'],

      citationPlaceholders: ['[SOURCE_REQUIRED: KSA Disclosure Guidelines for SMEs]'],
    },
  ],

  disclaimers: [
    {
      type: 'legal',
      text: 'Based on self-reported data. Not legal advice. Consult professionals for KSA compliance.',
      textArabic: 'بناءً على بيانات مبلغ عنها ذاتيًا. ليست استشارة قانونية. استشر متخصصين.',
      order: 1,
    },
    {
      type: 'methodology',
      text: 'AI-assisted narratives. Citations require verification.',
      textArabic: 'سرديات بمساعدة الذكاء الاصطناعي. الاستشهادات تتطلب التحقق.',
      order: 2,
    },
    {
      type: 'informational',
      text: 'For voluntary stakeholder communication. Non-listed entities have different requirements.',
      textArabic: 'للتواصل الطوعي مع أصحاب المصلحة. الكيانات غير المدرجة لديها متطلبات مختلفة.',
      order: 3,
    },
  ],

  createdAt: '2024-12-21T00:00:00Z',
  updatedAt: '2024-12-21T00:00:00Z',
};
