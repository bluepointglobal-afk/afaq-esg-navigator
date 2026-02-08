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
    { pillar: 'governance', score: 72, completeness: 85 },
    { pillar: 'environmental', score: 65, completeness: 75 },
    { pillar: 'social', score: 67, completeness: 78 },
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
  id: 'demo-company-1',
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
  company_id: 'demo-company-1',
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
  report_id: 'demo',
  company_id: 'demo-company-1',
  assessment_id: 'demo-assessment-1',
  disclosure_html: '<div>Sample disclosure content</div>',
  disclosure_json: {
    frameworks: ['IFRS_S1', 'IFRS_S2', 'TCFD', 'GRI'],
    sections: [],
  },
  generated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
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
