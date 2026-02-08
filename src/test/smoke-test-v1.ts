import { buildDisclosurePack } from '../lib/disclosure/orchestrator';
import type { CompanyProfile, AssessmentResult } from '../types/compliance';

const MOCK_COMPANY: CompanyProfile = {
    companyId: 'test-123',
    companyName: 'Emirates Green Energy LLC',
    companyNameArabic: 'شركة الإمارات للطاقة الخضراء ش.ذ.م.م',
    jurisdiction: 'UAE',
    listingStatus: 'listed',
    stockExchange: 'ADX',
    sector: 'Energy',
    subsector: 'Renewable Energy',
    employeeCountBand: '51-250',
    annualRevenueBand: '10M-50M',
    revenueCurrency: 'AED',
    operationalYears: 5,
    hasInternationalOps: false,
    hasCriticalInfrastructure: true,
    hasFullTimeEmployees: true,
    hasContractors: true,
    hasRemoteWorkforce: false,
    fiscalYearEnd: 12,
    reportingYear: 2024,
};

const MOCK_NARRATIVES = {
    reportId: 'report-123',
    governanceText: 'Our board oversees ESG through a dedicated committee meeting quarterly. The CEO is responsible for implementation.',
    esgText: 'We prioritize carbon reduction and employee safety. We have a 30% diversity target for management.',
    riskText: 'Climate risks are integrated into our ERM framework. Supply chain audits are conducted annually.',
    transparencyText: 'We report annually using GRI and IFRS S2 standards. Data is verified internally.',
    governanceStructured: [],
    esgStructured: [],
    riskStructured: [],
    transparencyStructured: [],
};

const MOCK_METRICS = [
    { metricCode: 'IFRS-S2-MET-1', title: 'GHG Scope 1 & 2', valueNumeric: 1250.5, unit: 'tCO2e', category: 'metrics' },
    { metricCode: 'KSA-TADAWUL-1', title: 'Saudization Rate', valueNumeric: 45, unit: '%', category: 'social' },
    { metricCode: 'WATER-USAGE', title: 'Water Consumption', valueNumeric: 5000, unit: 'm3', category: 'metrics' },
    { metricCode: 'BOARD-DIVERSITY', title: 'Board Gender Diversity', valueNumeric: 25, unit: '%', category: 'gov' },
];

const MOCK_ASSESSMENT: Partial<AssessmentResult> = {
    pillarScores: [
        { pillar: 'governance', score: 85, weight: 1, maxPossibleScore: 100, completedQuestions: 5, totalQuestions: 5 },
        { pillar: 'esg', score: 70, weight: 1, maxPossibleScore: 100, completedQuestions: 7, totalQuestions: 10 }
    ],
    gaps: [
        {
            questionId: 'q1',
            questionText: 'Do you have a net zero target?',
            pillar: 'esg',
            severity: 'high',
            reason: 'missing_answer',
            currentScore: 0,
            targetScore: 100,
            impact: 'High'
        }
    ],
};

const pack = buildDisclosurePack({
    company: MOCK_COMPANY,
    selectedFrameworks: ['IFRS_S1', 'IFRS_S2', 'TCFD', 'LOCAL_UAE'],
    assessmentResult: MOCK_ASSESSMENT as AssessmentResult,
    narrative: MOCK_NARRATIVES,
    metrics: MOCK_METRICS,
});

console.log('--- DISCLOSURE PACK STRUCTURE ---');
console.log(JSON.stringify(pack, null, 2));

console.log('\n--- SIMULATED PROMPT HIGHLIGHTS ---');
console.log(`Topic: GOV`);
console.log(`Narrative: ${pack.narratives.governanceText}`);
console.log(`Metrics: ${JSON.stringify(pack.metrics.filter(m => m.category === 'gov'))}`);
