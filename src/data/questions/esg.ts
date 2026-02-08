// ESG/Sustainability Pillar Questions
// Environmental impact, social responsibility, workforce practices

import type { Question } from '@/types/compliance';

export const esgQuestions: Question[] = [
  // Environmental
  {
    id: 'ESG-001-uuid',
    pillar: 'esg',
    code: 'ESG-001',
    text: 'Does your company track its greenhouse gas (GHG) emissions?',
    textArabic: 'هل تتتبع شركتكم انبعاثات غازات الدفيئة؟',
    type: 'boolean',
    required: true,
    weight: 8,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed', 'non-listed'],
    materialityTags: ['environment', 'emissions', 'climate'],
    evidenceHint: 'GHG inventory report or carbon footprint assessment',
    evidenceHintArabic: 'تقرير جرد غازات الدفيئة أو تقييم البصمة الكربونية',
  },

  {
    id: 'ESG-002-uuid',
    pillar: 'esg',
    code: 'ESG-002',
    text: 'What are your total Scope 1 + 2 GHG emissions (tonnes CO2e) for the reporting year?',
    textArabic: 'ما هي إجمالي انبعاثاتكم من النطاق 1 + 2 (طن مكافئ CO2) لسنة التقرير؟',
    type: 'number',
    required: false,
    weight: 7,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed', 'non-listed'],
    materialityTags: ['emissions', 'quantitative'],
    evidenceHint: 'Emissions calculation worksheet or third-party verification',
    evidenceHintArabic: 'ورقة عمل حساب الانبعاثات أو التحقق من طرف ثالث',
    conditionalRules: [
      {
        dependsOnQuestionId: 'ESG-001-uuid',
        operator: 'equals',
        value: true,
        showWhen: true,
      },
    ],
  },

  // Social - Workforce
  {
    id: 'ESG-003-uuid',
    pillar: 'esg',
    code: 'ESG-003',
    text: 'What percentage of your workforce is female?',
    textArabic: 'ما هي نسبة الإناث في القوى العاملة؟',
    type: 'percentage',
    required: true,
    weight: 6,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed', 'non-listed'],
    materialityTags: ['diversity', 'gender', 'social'],
    evidenceHint: 'HR records or diversity report',
    evidenceHintArabic: 'سجلات الموارد البشرية أو تقرير التنوع',
  },

  {
    id: 'ESG-004-uuid',
    pillar: 'esg',
    code: 'ESG-004',
    text: 'Do you provide health and safety training to all employees?',
    textArabic: 'هل توفرون تدريبًا على الصحة والسلامة لجميع الموظفين؟',
    type: 'boolean',
    required: true,
    weight: 7,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed', 'non-listed'],
    materialityTags: ['health_safety', 'training'],
    evidenceHint: 'Training records or safety program documentation',
    evidenceHintArabic: 'سجلات التدريب أو مستندات برنامج السلامة',
  },

  // Community & Human Rights
  {
    id: 'ESG-005-uuid',
    pillar: 'esg',
    code: 'ESG-005',
    text: 'Does your company have a human rights policy?',
    textArabic: 'هل لدى شركتكم سياسة حقوق الإنسان؟',
    type: 'boolean',
    required: true,
    weight: 6,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed', 'non-listed'],
    materialityTags: ['human_rights', 'policy'],
    evidenceHint: 'Human rights policy document',
    evidenceHintArabic: 'مستند سياسة حقوق الإنسان',
  },
];

export const ESG_QUESTION_COUNT = esgQuestions.length;
