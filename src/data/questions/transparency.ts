// Transparency Pillar Questions
// Financial disclosure, stakeholder communication, reporting practices

import type { Question } from '@/types/compliance';

export const transparencyQuestions: Question[] = [
  // Financial Disclosure
  {
    id: 'TRN-001-uuid',
    pillar: 'transparency',
    code: 'TRN-001',
    text: 'Do you publish audited financial statements annually?',
    textArabic: 'هل تنشرون قوائم مالية مدققة سنويًا؟',
    type: 'boolean',
    required: true,
    weight: 9,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed', 'non-listed'],
    materialityTags: ['financial_reporting', 'transparency'],
    evidenceHint: 'Most recent audited financial statements',
    evidenceHintArabic: 'أحدث قوائم مالية مدققة',
  },

  {
    id: 'TRN-002-uuid',
    pillar: 'transparency',
    code: 'TRN-002',
    text: 'Who is your external auditor?',
    textArabic: 'من هو مدقق الحسابات الخارجي؟',
    type: 'text',
    required: false,
    weight: 6,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed', 'non-listed'],
    materialityTags: ['audit', 'external_assurance'],
    evidenceHint: 'Audit report or engagement letter',
    evidenceHintArabic: 'تقرير التدقيق أو خطاب التعاقد',
    conditionalRules: [
      {
        dependsOnQuestionId: 'TRN-001-uuid',
        operator: 'equals',
        value: true,
        showWhen: true,
      },
    ],
  },

  // Stakeholder Communication
  {
    id: 'TRN-003-uuid',
    pillar: 'transparency',
    code: 'TRN-003',
    text: 'Do you publish an annual sustainability or ESG report?',
    textArabic: 'هل تنشرون تقرير استدامة أو تقرير ESG سنويًا؟',
    type: 'boolean',
    required: true,
    weight: 7,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed', 'non-listed'],
    materialityTags: ['sustainability_reporting', 'esg_disclosure'],
    evidenceHint: 'Sustainability report or integrated report',
    evidenceHintArabic: 'تقرير الاستدامة أو التقرير المتكامل',
  },

  {
    id: 'TRN-004-uuid',
    pillar: 'transparency',
    code: 'TRN-004',
    text: 'Do you have a dedicated investor relations function or contact?',
    textArabic: 'هل لديكم وظيفة أو جهة اتصال مخصصة لعلاقات المستثمرين؟',
    type: 'boolean',
    required: true,
    weight: 6,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed'],
    materialityTags: ['investor_relations', 'stakeholder_engagement'],
    evidenceHint: 'Investor relations page on website or contact details',
    evidenceHintArabic: 'صفحة علاقات المستثمرين على الموقع الإلكتروني أو معلومات الاتصال',
  },

  // Website & Public Information
  {
    id: 'TRN-005-uuid',
    pillar: 'transparency',
    code: 'TRN-005',
    text: 'Does your company website include corporate governance information?',
    textArabic: 'هل يتضمن موقع شركتكم الإلكتروني معلومات عن حوكمة الشركات؟',
    type: 'boolean',
    required: false,
    weight: 5,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed', 'non-listed'],
    materialityTags: ['disclosure', 'website'],
    evidenceHint: 'URL of governance section on website',
    evidenceHintArabic: 'رابط قسم الحوكمة على الموقع الإلكتروني',
  },
];

export const TRANSPARENCY_QUESTION_COUNT = transparencyQuestions.length;
