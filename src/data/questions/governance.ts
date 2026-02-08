// Governance Pillar Questions
// Corporate governance, board oversight, ethics, compliance structure

import type { Question, Jurisdiction, ListingStatus } from '@/types/compliance';

export const governanceQuestions: Question[] = [
  // Board Structure & Oversight
  {
    id: 'GOV-001-uuid',
    pillar: 'governance',
    code: 'GOV-001',
    text: 'Does your company have a formal board of directors or equivalent governance body?',
    textArabic: 'هل لدى شركتكم مجلس إدارة رسمي أو هيئة حوكمة مماثلة؟',
    type: 'boolean',
    required: true,
    weight: 8,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed', 'non-listed'],
    materialityTags: ['governance_structure', 'mandatory'],
    evidenceHint: 'Board charter, incorporation documents, or governance policy',
    evidenceHintArabic: 'ميثاق مجلس الإدارة أو المستندات التأسيسية أو سياسة الحوكمة',
  },

  {
    id: 'GOV-002-uuid',
    pillar: 'governance',
    code: 'GOV-002',
    text: 'How many independent directors serve on your board?',
    textArabic: 'كم عدد الأعضاء المستقلين في مجلس الإدارة؟',
    type: 'number',
    required: true,
    weight: 7,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed'],
    materialityTags: ['board_independence', 'listed_mandatory'],
    evidenceHint: 'Board composition report or annual report',
    evidenceHintArabic: 'تقرير تكوين مجلس الإدارة أو التقرير السنوي',
    conditionalRules: [
      {
        dependsOnQuestionId: 'GOV-001-uuid',
        operator: 'equals',
        value: true,
        showWhen: true,
      },
    ],
  },

  {
    id: 'GOV-003-uuid',
    pillar: 'governance',
    code: 'GOV-003',
    text: 'Does your board have an audit committee?',
    textArabic: 'هل يوجد لدى مجلس الإدارة لجنة تدقيق؟',
    type: 'boolean',
    required: true,
    weight: 6,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed'],
    materialityTags: ['audit_committee', 'financial_oversight'],
    evidenceHint: 'Committee charter or terms of reference',
    evidenceHintArabic: 'ميثاق اللجنة أو صلاحياتها',
    conditionalRules: [
      {
        dependsOnQuestionId: 'GOV-001-uuid',
        operator: 'equals',
        value: true,
        showWhen: true,
      },
    ],
  },

  // Ethics & Code of Conduct
  {
    id: 'GOV-004-uuid',
    pillar: 'governance',
    code: 'GOV-004',
    text: 'Does your company have a written code of conduct or ethics policy?',
    textArabic: 'هل لدى شركتكم مدونة سلوك أو سياسة أخلاقيات مكتوبة؟',
    type: 'boolean',
    required: true,
    weight: 7,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed', 'non-listed'],
    materialityTags: ['ethics', 'code_of_conduct'],
    evidenceHint: 'Code of conduct document or employee handbook',
    evidenceHintArabic: 'مستند مدونة السلوك أو دليل الموظفين',
  },

  {
    id: 'GOV-005-uuid',
    pillar: 'governance',
    code: 'GOV-005',
    text: 'What percentage of employees have been trained on the code of conduct in the past 12 months?',
    textArabic: 'ما هي نسبة الموظفين الذين تم تدريبهم على مدونة السلوك في الـ 12 شهرًا الماضية؟',
    type: 'percentage',
    required: false,
    weight: 5,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed', 'non-listed'],
    materialityTags: ['training', 'ethics'],
    evidenceHint: 'Training records or HR reports',
    evidenceHintArabic: 'سجلات التدريب أو تقارير الموارد البشرية',
    conditionalRules: [
      {
        dependsOnQuestionId: 'GOV-004-uuid',
        operator: 'equals',
        value: true,
        showWhen: true,
      },
    ],
  },

  // Anti-Corruption & Whistleblowing
  {
    id: 'GOV-006-uuid',
    pillar: 'governance',
    code: 'GOV-006',
    text: 'Does your company have an anti-corruption or anti-bribery policy?',
    textArabic: 'هل لدى شركتكم سياسة مكافحة الفساد أو الرشوة؟',
    type: 'boolean',
    required: true,
    weight: 8,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed', 'non-listed'],
    materialityTags: ['anti_corruption', 'compliance'],
    evidenceHint: 'Anti-corruption policy document',
    evidenceHintArabic: 'مستند سياسة مكافحة الفساد',
  },

  {
    id: 'GOV-007-uuid',
    pillar: 'governance',
    code: 'GOV-007',
    text: 'Do you have a whistleblower mechanism or hotline for reporting misconduct?',
    textArabic: 'هل لديكم آلية للإبلاغ عن المخالفات (خط ساخن للمبلغين)؟',
    type: 'boolean',
    required: false,
    weight: 6,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed', 'non-listed'],
    materialityTags: ['whistleblowing', 'transparency'],
    evidenceHint: 'Whistleblower policy or hotline documentation',
    evidenceHintArabic: 'سياسة المبلغين أو مستندات الخط الساخن',
  },

  // Risk Management
  {
    id: 'GOV-008-uuid',
    pillar: 'governance',
    code: 'GOV-008',
    text: 'Does your company have a formal risk management framework?',
    textArabic: 'هل لدى شركتكم إطار رسمي لإدارة المخاطر؟',
    type: 'boolean',
    required: true,
    weight: 7,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed', 'non-listed'],
    materialityTags: ['risk_management', 'framework'],
    evidenceHint: 'Risk management policy or framework document',
    evidenceHintArabic: 'سياسة إدارة المخاطر أو مستند الإطار',
  },

  {
    id: 'GOV-009-uuid',
    pillar: 'governance',
    code: 'GOV-009',
    text: 'How frequently does the board review the risk register?',
    textArabic: 'ما هي وتيرة مراجعة مجلس الإدارة لسجل المخاطر؟',
    type: 'single_choice',
    options: [
      { value: 'monthly', label: 'Monthly', labelArabic: 'شهريًا' },
      { value: 'quarterly', label: 'Quarterly', labelArabic: 'ربع سنوي' },
      { value: 'semi-annually', label: 'Semi-annually', labelArabic: 'نصف سنوي' },
      { value: 'annually', label: 'Annually', labelArabic: 'سنويًا' },
      { value: 'never', label: 'Never reviewed', labelArabic: 'لا تتم المراجعة' },
    ],
    required: false,
    weight: 5,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed', 'non-listed'],
    materialityTags: ['risk_oversight', 'board_activity'],
    evidenceHint: 'Board meeting minutes or risk committee reports',
    evidenceHintArabic: 'محاضر اجتماعات مجلس الإدارة أو تقارير لجنة المخاطر',
    conditionalRules: [
      {
        dependsOnQuestionId: 'GOV-008-uuid',
        operator: 'equals',
        value: true,
        showWhen: true,
      },
    ],
  },

  // Shareholder Rights (Listed Companies)
  {
    id: 'GOV-010-uuid',
    pillar: 'governance',
    code: 'GOV-010',
    text: 'Do all shareholders have equal voting rights?',
    textArabic: 'هل جميع المساهمين لديهم حقوق تصويت متساوية؟',
    type: 'boolean',
    required: true,
    weight: 6,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed'],
    materialityTags: ['shareholder_rights', 'equity'],
    evidenceHint: 'Articles of association or shareholder agreement',
    evidenceHintArabic: 'النظام الأساسي أو اتفاقية المساهمين',
  },
];

// Export count for validation
export const GOVERNANCE_QUESTION_COUNT = governanceQuestions.length;
