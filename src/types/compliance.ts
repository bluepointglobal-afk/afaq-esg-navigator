// AFAQ Compliance Engine - Domain Types

export type Jurisdiction = 'UAE' | 'KSA' | 'Qatar';

export type CompanySize = 'micro' | 'small' | 'medium' | 'large';

export type ListingStatus = 'listed' | 'non-listed';

// Extended Company Profile for Compliance Assessment
export interface CompanyProfile {
  // Core identification
  companyId: string;
  companyName: string;
  companyNameArabic: string | null;

  // Jurisdiction & regulatory context
  jurisdiction: Jurisdiction;
  listingStatus: ListingStatus;
  stockExchange: string | null;

  // Sector classification
  sector: string;
  subsector: string | null;

  // Size indicators (bands for privacy)
  employeeCountBand: '1-10' | '11-50' | '51-250' | '251-1000' | '1000+';
  annualRevenueBand: '<1M' | '1M-10M' | '10M-50M' | '50M-250M' | '250M+';
  revenueCurrency: string;

  // Operations context
  operationalYears: number;
  hasInternationalOps: boolean;
  hasCriticalInfrastructure: boolean;

  // Workforce context
  hasFullTimeEmployees: boolean;
  hasContractors: boolean;
  hasRemoteWorkforce: boolean;

  // Reporting context
  fiscalYearEnd: number;
  reportingYear: number;
}

// Questionnaire structure
export type QuestionType =
  | 'boolean'
  | 'single_choice'
  | 'multiple_choice'
  | 'text'
  | 'number'
  | 'date'
  | 'percentage';

export type QuestionPillar = 'governance' | 'esg' | 'risk_controls' | 'transparency';

export interface QuestionOption {
  value: string;
  label: string;
  labelArabic?: string;
}

// Conditional logic for dynamic question visibility
export type ConditionalOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'greater_than'
  | 'less_than'
  | 'is_answered'
  | 'is_not_answered';

export interface ConditionalRule {
  dependsOnQuestionId: string;
  operator: ConditionalOperator;
  value?: string | number | boolean | string[];
  showWhen: boolean; // true = show question, false = hide question
}

export interface Question {
  id: string;
  pillar: QuestionPillar;
  code: string;
  text: string;
  textArabic?: string;
  type: QuestionType;
  options?: QuestionOption[];
  required: boolean;
  weight: number;

  // Jurisdiction applicability
  applicableJurisdictions: Jurisdiction[];
  applicableListingStatuses: ListingStatus[];

  // Materiality and context
  materialityTags: string[];
  evidenceHint?: string;
  evidenceHintArabic?: string;

  // Conditional logic (array supports AND logic across rules)
  conditionalRules?: ConditionalRule[];

  // NEW: Scoring metadata (Step 3 - backward compatible)
  criticality?: 'critical' | 'normal'; // Default: 'normal'
  scoringRules?: {
    // For single_choice questions: map option value to score (0-100)
    optionScores?: Record<string, number>;

    // For number questions
    min?: number;
    target?: number;
    max?: number;

    // For date questions
    maxAgeMonths?: number;
  };
}

export interface QuestionSection {
  id: string;
  pillar: QuestionPillar;
  title: string;
  titleArabic?: string;
  description: string;
  descriptionArabic?: string;
  order: number;
  questions: Question[];
}

export interface QuestionnaireTemplate {
  id: string;
  version: string;
  jurisdiction: Jurisdiction;
  sections: QuestionSection[];
  createdAt: string;
  updatedAt: string;
}

// Questionnaire responses
export type AnswerValue =
  | boolean
  | string
  | string[]
  | number
  | Date;

export interface QuestionAnswer {
  questionId: string;
  value: AnswerValue;
  evidenceUrls?: string[];
  notes?: string;
  answeredAt: string;
  answeredBy: string;
}

export interface QuestionnaireResponse {
  id: string;
  reportId: string;
  templateId: string;
  templateVersion: string;
  answers: Record<string, QuestionAnswer>;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Assessment results
export interface PillarScore {
  pillar: QuestionPillar;
  score: number; // 0-100
  weight: number;
  maxPossibleScore: number;
  completedQuestions: number;
  totalQuestions: number;
}

export interface Gap {
  questionId: string;
  questionText: string;
  pillar: QuestionPillar;
  severity: 'critical' | 'high' | 'medium' | 'low';
  reason: 'missing_answer' | 'low_score' | 'missing_evidence' | 'inadequate_response';
  currentScore: number;
  targetScore: number;
  impact: string;
}

export interface Recommendation {
  id: string;
  priority: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  relatedGaps: string[]; // Gap question IDs
  pillar: QuestionPillar;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
}

export interface ScoreExplanation {
  overallScore: number;
  methodology: string;
  pillarBreakdown: {
    pillar: QuestionPillar;
    contribution: number;
    reasoning: string;
  }[];
  strengths: string[];
  weaknesses: string[];
}

export interface AssessmentResult {
  id: string;
  reportId: string;
  questionnaireResponseId: string;

  // Scores
  overallScore: number; // 0-100
  pillarScores: PillarScore[];

  // Gap analysis
  gaps: Gap[];
  gapCount: number;
  criticalGapCount: number;

  // Recommendations
  recommendations: Recommendation[];

  // Explainability
  explanation: ScoreExplanation;

  // Metadata
  assessedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Disclosure output
export interface DisclosureSection {
  id: string;
  pillar: QuestionPillar;
  title: string;
  titleArabic?: string;
  order: number;
  narrative: string;
  narrativeArabic?: string;
  dataPoints: {
    label: string;
    labelArabic?: string;
    value: string;
    source: 'assessment_result' | 'user_answer' | 'calculated';
  }[];
  citationPlaceholders?: string[];
  missingInformation?: string[];
}

export interface EvidenceReference {
  questionId: string;
  questionText: string;
  evidenceType: string;
  evidenceUrls: string[];
  notes?: string;
}

export interface DisclosureDisclaimer {
  type: 'legal' | 'informational' | 'methodology';
  text: string;
  textArabic?: string;
  order: number;
}

export interface QualityChecklistItem {
  category: 'completeness' | 'evidence' | 'citations' | 'gaps';
  label: string;
  labelArabic: string;
  status: 'pass' | 'warning' | 'fail';
  count?: number;
  details?: string;
}

export interface DisclosureOutput {
  id: string;
  reportId: string;
  assessmentId: string;

  // Template and version
  templateId?: string;
  templateVersion?: string;
  jurisdiction: Jurisdiction;
  listingStatus?: ListingStatus;
  generatedForCompany: string;

  // Structured content
  sections: DisclosureSection[];
  evidenceAppendix: EvidenceReference[];
  disclaimers: DisclosureDisclaimer[];
  qualityChecklist?: QualityChecklistItem[];

  // Metadata
  generatedAt: string;
  generatedBy: string | null; // User ID or 'system'
  format: 'json' | 'pdf' | 'word';
  status?: 'draft' | 'final' | 'exported';
  errors?: string[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface MetricData {
  id: string;
  reportId: string;
  metricCode: string;
  category: string;
  valueNumeric: number | null;
  valueText: string | null;
  valueBoolean: boolean | null;
  unit: string | null;
  dataTier: number | null;
  dataSource: string | null;
  confidenceLevel?: string | null;
  calculationMethod?: string | null;
  notes: string | null;
  supportingDocUrl?: string | null;
  enteredBy?: string | null;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Sustainability Report Types
export type ReportSectionType =
  | 'executive_summary'
  | 'environmental'
  | 'social'
  | 'governance'
  | 'methodology'
  | 'data_annex';

export interface ReportMetric {
  code: string;
  name: string;
  value: string | number;
  unit?: string;
  description?: string;
  source?: string;
}

export interface ReportDisclosure {
  id: string;
  framework: string; // e.g., 'GRI', 'ADX', 'QSE'
  code: string;
  title: string;
  status: 'addressed' | 'partial' | 'omitted';
  reference?: string; // Section reference in report
}

export interface ReportSection {
  type: ReportSectionType;
  title: string;
  titleArabic?: string;
  narrative: string;
  narrativeArabic?: string;
  metrics: ReportMetric[];
  disclosures: ReportDisclosure[];
  order: number;
}

export interface DataAnnexRow {
  category: string;
  metricCode: string;
  metricName: string;
  value: string | number;
  unit?: string;
  reportSection: string;
  disclosureRef?: string;
}

export interface SustainabilityReport {
  id: string;
  reportId: string;
  assessmentId: string;
  disclosureId: string;

  // Company info
  companyName: string;
  companyNameArabic?: string;
  jurisdiction: Jurisdiction;
  reportingYear: number;

  // Report content
  sections: ReportSection[];
  dataAnnex: DataAnnexRow[];

  // Disclosure tracking
  totalDisclosures: number;
  addressedDisclosures: number;
  partialDisclosures: number;
  omittedDisclosures: number;

  // Metadata
  generatedAt: string;
  templateVersion: string;
  status: 'draft' | 'final';
}
