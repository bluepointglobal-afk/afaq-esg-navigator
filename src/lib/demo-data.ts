/**
 * Demo data for MVP evaluation
 * Used when reportId is 'demo' or testing mode is active
 */

export const DEMO_ASSESSMENT = {
  id: 'demo-assessment-1',
  report_id: 'demo',
  questionnaire_response_id: 'demo-response-1',
  overall_score: 68,
  pillar_scores: [
    { pillar: 'governance', score: 72, completeness: 85, totalQuestions: 12, answeredQuestions: 10 },
    { pillar: 'environmental', score: 65, completeness: 75, totalQuestions: 15, answeredQuestions: 11 },
    { pillar: 'social', score: 67, completeness: 78, totalQuestions: 13, answeredQuestions: 10 },
  ],
  gap_count: 5,
  critical_gap_count: 3,
  gaps: [
    {
      questionId: 'gov-q1',
      questionText: 'Does your company have a board-level ESG committee?',
      pillar: 'governance',
      severity: 'critical',
      reason: 'missing_answer',
      currentScore: 0,
      targetScore: 100,
      impact: 'Board oversight is mandatory for compliance',
    },
    {
      questionId: 'env-q2',
      questionText: 'What are your Scope 1, 2, and 3 GHG emissions?',
      pillar: 'environmental',
      severity: 'critical',
      reason: 'missing_evidence',
      currentScore: 0,
      targetScore: 100,
      impact: 'GHG tracking required for TCFD and GRI disclosure',
    },
    {
      questionId: 'soc-q3',
      questionText: 'What is the gender distribution of your workforce?',
      pillar: 'social',
      severity: 'critical',
      reason: 'missing_answer',
      currentScore: 0,
      targetScore: 100,
      impact: 'Diversity metrics are mandatory GRI indicators',
    },
    {
      questionId: 'gov-q4',
      questionText: 'Do you have a formal ethics and compliance policy?',
      pillar: 'governance',
      severity: 'high',
      reason: 'low_score',
      currentScore: 30,
      targetScore: 100,
      impact: 'Ethics framework strengthens governance score',
    },
    {
      questionId: 'env-q5',
      questionText: 'What is your annual water consumption and targets?',
      pillar: 'environmental',
      severity: 'high',
      reason: 'inadequate_response',
      currentScore: 40,
      targetScore: 100,
      impact: 'Water management is increasingly material for GCC companies',
    },
  ],
  recommendations: [
    {
      id: 'rec-1',
      priority: 1,
      title: 'Establish ESG Governance',
      description: 'Create board-level ESG oversight with quarterly KPI review and committee structure',
      relatedGaps: ['gov-q1'],
      pillar: 'governance',
      effort: 'medium',
      impact: 'high',
      timeframe: 'immediate',
    },
    {
      id: 'rec-2',
      priority: 1,
      title: 'Implement GHG Emissions Framework',
      description: 'Deploy emissions accounting and reporting system covering Scope 1, 2, 3',
      relatedGaps: ['env-q2'],
      pillar: 'environmental',
      effort: 'high',
      impact: 'high',
      timeframe: 'short_term',
    },
    {
      id: 'rec-3',
      priority: 1,
      title: 'Launch Diversity & Inclusion Program',
      description: 'Collect baseline diversity data and set 2030 targets aligned with GRI standards',
      relatedGaps: ['soc-q3'],
      pillar: 'social',
      effort: 'medium',
      impact: 'high',
      timeframe: 'immediate',
    },
  ],
  explanation: {
    overallScore: 68,
    methodology: 'Assessment based on GRI, TCFD, and IFRS S1/S2 frameworks. Weighted by materiality for GCC region.',
    pillarBreakdown: [
      {
        pillar: 'governance',
        contribution: 72,
        reasoning: 'Board structure exists but ESG committee and oversight gaps present',
      },
      {
        pillar: 'environmental',
        contribution: 65,
        reasoning: 'ISO 14001 certified but emissions tracking and water management gaps',
      },
      {
        pillar: 'social',
        contribution: 67,
        reasoning: 'Health & safety program strong, diversity data gaps',
      },
    ],
    strengths: [
      'ISO 14001 environmental management certification',
      'Established health & safety program',
      'Annual supplier code of conduct',
    ],
    weaknesses: [
      'No board-level ESG oversight',
      'GHG emissions not tracked',
      'Diversity metrics not reported',
    ],
  },
  assessed_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEMO_COMPANY = {
  id: 'd9584a70-b721-4abb-a3b3-f5ac326afccd',
  name: 'Horizon Energy Solutions',
  industry: 'Energy & Utilities',
  region: 'Middle East',
  employees: 2500,
  revenue_sar: 850000000,
  founded_year: 2010,
  headquarters: 'Riyadh, Saudi Arabia',
  website: 'https://example-company.com',
  description: 'Leading renewable energy and sustainable utilities provider in the GCC region',
};

export const DEMO_QUESTIONNAIRE_RESPONSE = {
  id: 'demo-response-1',
  report_id: 'demo',
  company_id: 'd9584a70-b721-4abb-a3b3-f5ac326afccd',
  responses: {
    'governance-1': 'Yes, board-level oversight exists but needs formalization',
    'environmental-1': 'Currently tracking water usage only',
    'social-1': 'No formal diversity program',
  },
  completed_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEMO_DISCLOSURE = {
  id: 'demo-disclosure-1',
  reportId: 'demo',
  assessmentId: 'demo-assessment-1',
  templateId: null,
  templateVersion: '1.0',
  jurisdiction: 'KSA' as const,
  generatedForCompany: 'Horizon Energy Solutions',
  sections: [
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      titleArabic: 'الملخص التنفيذي',
      narrative: 'Horizon Energy Solutions is committed to transparent ESG reporting aligned with international frameworks. This disclosure provides a comprehensive assessment of our sustainability performance and material issues.',
      narrativeArabic: 'تلتزم حلول الأفق للطاقة بالإفصاح الشفاف عن ESG وفقاً للأطر الدولية. يوفر هذا الكشف تقييماً شاملاً لأدائنا في الاستدامة والمسائل المادية.',
      dataPoints: [
        { label: 'Overall Compliance Score', labelArabic: 'درجة الامتثال الإجمالية', value: '68/100', source: 'calculated' },
        { label: 'GHG Emissions Tracked', labelArabic: 'انبعاثات الغازات الدفيئة المتتبعة', value: 'Partial (Scope 1, 2 only)', source: 'manual_entry' },
        { label: 'Board ESG Oversight', labelArabic: 'إشراف مجلس الإدارة على ESG', value: 'In Development', source: 'manual_entry' },
      ],
      citationPlaceholders: [],
    },
    {
      id: 'governance',
      title: 'Governance & Ethics',
      titleArabic: 'الحوكمة والأخلاقيات',
      narrative: 'Our governance framework is built on transparent decision-making and stakeholder accountability. We are implementing board-level ESG oversight with quarterly KPI reviews.',
      narrativeArabic: 'يقوم إطار الحوكمة لدينا على صنع القرارات الشفافة ومساءلة أصحاب المصلحة. نحن ننفذ الإشراف على ESG على مستوى المجلس مع استعراضات مؤشرات الأداء الرئيسية ربع السنوية.',
      dataPoints: [
        { label: 'Board Independence', labelArabic: 'استقلال المجلس', value: '67%', source: 'manual_entry' },
        { label: 'Ethics Policy Adoption', labelArabic: 'اعتماد سياسة الأخلاقيات', value: 'Scheduled Q1 2026', source: 'manual_entry' },
        { label: 'Whistleblower Mechanism', labelArabic: 'آلية الإبلاغ عن الانتهاكات', value: 'Established', source: 'manual_entry' },
      ],
      citationPlaceholders: [],
    },
    {
      id: 'environmental',
      title: 'Environmental Stewardship',
      titleArabic: 'الإدارة البيئية',
      narrative: 'We are committed to reducing our environmental footprint through emissions tracking, water management, and renewable energy adoption.',
      narrativeArabic: 'نحن ملتزمون بتقليل بصمتنا البيئية من خلال تتبع الانبعاثات وإدارة المياه واعتماد الطاقة المتجددة.',
      dataPoints: [
        { label: 'Scope 1 GHG Emissions', labelArabic: 'انبعاثات الغازات الدفيئة المباشرة', value: '12,500 tCO2e', source: 'calculated' },
        { label: 'Scope 2 GHG Emissions', labelArabic: 'انبعاثات الغازات الدفيئة غير المباشرة', value: '8,300 tCO2e', source: 'calculated' },
        { label: 'Water Intensity', labelArabic: 'كثافة المياه', value: '2.3 m³ per unit produced', source: 'calculated' },
      ],
      citationPlaceholders: [],
    },
    {
      id: 'social',
      title: 'Social Impact & Inclusion',
      titleArabic: 'التأثير الاجتماعي والشمول',
      narrative: 'Our workforce is our greatest asset. We invest in talent development, safety, and inclusive workplace practices aligned with GRI standards.',
      narrativeArabic: 'قوتنا العاملة هي أعظم أصولنا. نستثمر في تطوير المواهب والسلامة وممارسات مكان العمل الشاملة المتوافقة مع معايير GRI.',
      dataPoints: [
        { label: 'Women in Workforce', labelArabic: 'النساء في القوة العاملة', value: '28%', source: 'hr_records' },
        { label: 'Employee Turnover', labelArabic: 'معدل دوران الموظفين', value: '12.5%', source: 'hr_records' },
        { label: 'Safety Incidents (per 1M hours)', labelArabic: 'حوادث السلامة (لكل 1 مليون ساعة)', value: '0.8', source: 'manual_entry' },
      ],
      citationPlaceholders: [],
    },
  ],
  evidenceAppendix: [
    {
      id: 'ev-1',
      sectionId: 'governance',
      title: 'Board Resolution on ESG Committee',
      source: 'Board Minutes, January 2026',
      data: 'Board approved establishment of ESG committee with quarterly oversight mandate',
      verificationStatus: 'verified' as const,
    },
    {
      id: 'ev-2',
      sectionId: 'environmental',
      title: 'GHG Emissions Verification Report',
      source: 'Third-party auditor',
      data: 'Scope 1 and 2 emissions verified per ISO 14064-3',
      verificationStatus: 'verified' as const,
    },
    {
      id: 'ev-3',
      sectionId: 'social',
      title: 'Diversity Data 2024',
      source: 'HR Systems',
      data: 'Baseline diversity metrics established for reporting period 2024',
      verificationStatus: 'preliminary' as const,
    },
  ],
  disclaimers: [
    {
      id: 'disc-1',
      type: 'methodology' as const,
      text: 'This disclosure provides educational insights only and does not constitute legal or regulatory advice. Consult qualified professionals for compliance guidance.',
      order: 0,
    },
    {
      id: 'disc-2',
      type: 'forward_looking' as const,
      text: 'Forward-looking statements regarding ESG targets are subject to risks and uncertainties. Actual results may differ materially.',
      order: 1,
    },
  ],
  qualityChecklist: [
    {
      id: 'qc-1',
      category: 'Data accuracy',
      label: 'Data Accuracy',
      status: 'pass' as const,
      notes: 'All Scope 1, 2 data verified',
    },
    {
      id: 'qc-2',
      category: 'Boundary definition',
      label: 'Boundary Definition',
      status: 'pass' as const,
      notes: 'Organizational boundaries clearly defined',
    },
    {
      id: 'qc-3',
      category: 'Stakeholder relevance',
      label: 'Stakeholder Relevance',
      status: 'attention' as const,
      notes: 'Scope 3 emissions and supply chain data pending',
    },
    {
      id: 'qc-4',
      category: 'Completeness',
      label: 'Completeness',
      status: 'pass' as const,
      notes: 'All mandatory frameworks covered',
    },
  ],
  status: 'draft' as const,
  generatedBy: 'system',
  format: 'json' as const,
  generatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const DEMO_NARRATIVE = {
  id: 'demo-narrative-1',
  report_id: 'demo',
  section: 'introduction',
  content:
    'Horizon Energy Solutions is committed to sustainability and transparent ESG reporting. This assessment evaluates our current maturity against leading frameworks.',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEMO_METRICS = [
  {
    metricCode: 'GRI-305-1',
    category: 'environmental',
    metricName: 'Direct (Scope 1) GHG Emissions',
    valueNumeric: 12500,
    unit: 'tCO2e',
  },
  {
    metricCode: 'GRI-305-2',
    category: 'environmental',
    metricName: 'Energy Indirect (Scope 2) GHG Emissions',
    valueNumeric: 8300,
    unit: 'tCO2e',
  },
  {
    metricCode: 'GRI-401-1',
    category: 'social',
    metricName: 'Employee Turnover Rate',
    valueNumeric: 12.5,
    unit: '%',
  },
  {
    metricCode: 'GRI-405-1',
    category: 'social',
    metricName: 'Gender Diversity - Women %',
    valueNumeric: 28,
    unit: '%',
  },
];

export function isDemoReport(reportId?: string): boolean {
  return reportId === 'demo' || reportId === 'demo-sample' || !reportId;
}
