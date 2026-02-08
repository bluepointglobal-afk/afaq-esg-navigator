// Risk & Controls Pillar Questions
// Cybersecurity, data privacy, operational controls, business continuity

import type { Question } from '@/types/compliance';

export const riskControlsQuestions: Question[] = [
  // Cybersecurity
  {
    id: 'RSK-001-uuid',
    pillar: 'risk_controls',
    code: 'RSK-001',
    text: 'Does your company have a cybersecurity policy?',
    textArabic: 'هل لدى شركتكم سياسة للأمن السيبراني؟',
    type: 'boolean',
    required: true,
    weight: 8,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed', 'non-listed'],
    materialityTags: ['cybersecurity', 'information_security'],
    evidenceHint: 'Cybersecurity policy document or IT security framework',
    evidenceHintArabic: 'مستند سياسة الأمن السيبراني أو إطار أمن تكنولوجيا المعلومات',
  },

  {
    id: 'RSK-002-uuid',
    pillar: 'risk_controls',
    code: 'RSK-002',
    text: 'Have you experienced any material cybersecurity incidents in the past 12 months?',
    textArabic: 'هل تعرضتم لأي حوادث أمن سيبراني مادية في الـ 12 شهرًا الماضية؟',
    type: 'boolean',
    required: true,
    weight: 7,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed', 'non-listed'],
    materialityTags: ['cybersecurity', 'incidents'],
    evidenceHint: 'Incident reports or security logs',
    evidenceHintArabic: 'تقارير الحوادث أو سجلات الأمن',
  },

  // Data Privacy
  {
    id: 'RSK-003-uuid',
    pillar: 'risk_controls',
    code: 'RSK-003',
    text: 'Do you have a data privacy policy compliant with local regulations?',
    textArabic: 'هل لديكم سياسة خصوصية البيانات متوافقة مع اللوائح المحلية؟',
    type: 'boolean',
    required: true,
    weight: 7,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed', 'non-listed'],
    materialityTags: ['data_privacy', 'compliance'],
    evidenceHint: 'Data privacy policy or GDPR/local compliance documentation',
    evidenceHintArabic: 'سياسة خصوصية البيانات أو مستندات الامتثال المحلي',
  },

  // Business Continuity
  {
    id: 'RSK-004-uuid',
    pillar: 'risk_controls',
    code: 'RSK-004',
    text: 'Do you have a business continuity plan (BCP) or disaster recovery plan?',
    textArabic: 'هل لديكم خطة استمرارية الأعمال أو خطة التعافي من الكوارث؟',
    type: 'boolean',
    required: true,
    weight: 6,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed', 'non-listed'],
    materialityTags: ['business_continuity', 'resilience'],
    evidenceHint: 'BCP document or disaster recovery plan',
    evidenceHintArabic: 'مستند خطة استمرارية الأعمال أو خطة التعافي',
  },

  // Internal Controls
  {
    id: 'RSK-005-uuid',
    pillar: 'risk_controls',
    code: 'RSK-005',
    text: 'Do you conduct regular internal audits?',
    textArabic: 'هل تجرون عمليات تدقيق داخلي بانتظام؟',
    type: 'boolean',
    required: true,
    weight: 7,
    applicableJurisdictions: ['UAE', 'KSA', 'Qatar'],
    applicableListingStatuses: ['listed', 'non-listed'],
    materialityTags: ['internal_audit', 'controls'],
    evidenceHint: 'Internal audit reports or audit schedule',
    evidenceHintArabic: 'تقارير التدقيق الداخلي أو جدول التدقيق',
  },
];

export const RISK_CONTROLS_QUESTION_COUNT = riskControlsQuestions.length;
