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
  gap_count: 12,
  critical_gap_count: 3,
  gaps: [
    {
      id: 'gap-1',
      pillar: 'governance',
      severity: 'critical',
      title: 'Board ESG Oversight',
      description: 'No dedicated ESG committee or board oversight documented',
      framework: 'GRI',
      recommendation: 'Establish ESG committee with quarterly reporting to board',
    },
    {
      id: 'gap-2',
      pillar: 'environmental',
      severity: 'critical',
      title: 'GHG Emissions Tracking',
      description: 'Scope 1, 2, 3 emissions not measured or reported',
      framework: 'TCFD',
      recommendation: 'Implement emissions tracking system and baseline',
    },
    {
      id: 'gap-3',
      pillar: 'social',
      severity: 'critical',
      title: 'Employee Diversity Metrics',
      description: 'No gender or nationality diversity data collected',
      framework: 'GRI',
      recommendation: 'Establish diversity baseline and annual tracking',
    },
    {
      id: 'gap-4',
      pillar: 'governance',
      severity: 'high',
      title: 'Ethics & Compliance Program',
      description: 'No formal ethics policy or whistleblower mechanism',
      framework: 'IFRS_S1',
      recommendation: 'Develop ethics code and anonymous reporting channel',
    },
    {
      id: 'gap-5',
      pillar: 'environmental',
      severity: 'high',
      title: 'Water Management',
      description: 'No water usage tracking or conservation targets',
      framework: 'GRI',
      recommendation: 'Baseline water consumption and set reduction targets',
    },
  ],
  recommendations: [
    {
      id: 'rec-1',
      priority: 'critical',
      title: 'Establish ESG Governance',
      description: 'Create board-level ESG oversight with quarterly KPI review',
      timeline: '0-3 months',
      estimatedCost: 50000,
    },
    {
      id: 'rec-2',
      priority: 'critical',
      title: 'Implement GHG Emissions Framework',
      description: 'Deploy emissions accounting and reporting system',
      timeline: '3-6 months',
      estimatedCost: 120000,
    },
    {
      id: 'rec-3',
      priority: 'high',
      title: 'Launch Diversity Initiative',
      description: 'Collect baseline diversity data and set 2030 targets',
      timeline: '1-3 months',
      estimatedCost: 25000,
    },
  ],
  explanation: {
    overall: 'This company has foundational ESG practices but significant gaps in measurement and governance. Score reflects emerging maturity.',
    strengths: [
      'ISO 14001 environmental management certification',
      'Established health & safety program',
      'Annual supplier code of conduct',
    ],
    opportunities: [
      'Board-level ESG oversight needed',
      'GHG emissions tracking not yet implemented',
      'Diversity and inclusion data gaps',
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
