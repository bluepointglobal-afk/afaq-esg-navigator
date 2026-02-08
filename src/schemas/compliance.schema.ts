// AFAQ Compliance Engine - Zod Validation Schemas

import { z } from 'zod';

// Base enums and primitives
export const jurisdictionSchema = z.enum(['UAE', 'KSA', 'Qatar']);

export const listingStatusSchema = z.enum(['listed', 'non-listed']);

export const questionPillarSchema = z.enum(['governance', 'esg', 'risk_controls', 'transparency']);

export const questionTypeSchema = z.enum([
  'boolean',
  'single_choice',
  'multiple_choice',
  'text',
  'number',
  'date',
  'percentage',
]);

// Company Profile Schema
export const companyProfileSchema = z.object({
  companyId: z.string().uuid(),
  companyName: z.string().min(1, 'Company name is required'),
  companyNameArabic: z.string().nullable(),

  jurisdiction: jurisdictionSchema,
  listingStatus: listingStatusSchema,
  stockExchange: z.string().nullable(),

  sector: z.string().min(1, 'Sector is required'),
  subsector: z.string().nullable(),

  employeeCountBand: z.enum(['1-10', '11-50', '51-250', '251-1000', '1000+']),
  annualRevenueBand: z.enum(['<1M', '1M-10M', '10M-50M', '50M-250M', '250M+']),
  revenueCurrency: z.string().length(3, 'Currency must be 3-letter code'),

  operationalYears: z.number().int().min(0),
  hasInternationalOps: z.boolean(),
  hasCriticalInfrastructure: z.boolean(),

  hasFullTimeEmployees: z.boolean(),
  hasContractors: z.boolean(),
  hasRemoteWorkforce: z.boolean(),

  fiscalYearEnd: z.number().int().min(1).max(12),
  reportingYear: z.number().int().min(2020).max(2030),
});

// Questionnaire Schema
export const questionOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  labelArabic: z.string().optional(),
});

// Conditional logic schema
export const conditionalOperatorSchema = z.enum([
  'equals',
  'not_equals',
  'contains',
  'not_contains',
  'greater_than',
  'less_than',
  'is_answered',
  'is_not_answered',
]);

export const conditionalRuleSchema = z.object({
  dependsOnQuestionId: z.string().uuid(),
  operator: conditionalOperatorSchema,
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]).optional(),
  showWhen: z.boolean(),
});

export const questionSchema = z.object({
  id: z.string().uuid(),
  pillar: questionPillarSchema,
  code: z.string().regex(/^[A-Z]{3}-\d{3}$/, 'Code must be format ABC-123'),
  text: z.string().min(1),
  textArabic: z.string().optional(),
  type: questionTypeSchema,
  options: z.array(questionOptionSchema).optional(),
  required: z.boolean(),
  weight: z.number().min(0).max(10),

  applicableJurisdictions: z.array(jurisdictionSchema).min(1),
  applicableListingStatuses: z.array(listingStatusSchema).min(1),

  materialityTags: z.array(z.string()),
  evidenceHint: z.string().optional(),
  evidenceHintArabic: z.string().optional(),

  conditionalRules: z.array(conditionalRuleSchema).optional(),
});

export const questionSectionSchema = z.object({
  id: z.string().uuid(),
  pillar: questionPillarSchema,
  title: z.string().min(1),
  titleArabic: z.string().optional(),
  description: z.string(),
  descriptionArabic: z.string().optional(),
  order: z.number().int().min(1),
  questions: z.array(questionSchema),
});

export const questionnaireTemplateSchema = z.object({
  id: z.string().uuid(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be semver format'),
  jurisdiction: jurisdictionSchema,
  sections: z.array(questionSectionSchema).min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Questionnaire Response Schema
export const answerValueSchema = z.union([
  z.boolean(),
  z.string(),
  z.array(z.string()),
  z.number(),
  z.date(),
]);

export const questionAnswerSchema = z.object({
  questionId: z.string().uuid(),
  value: answerValueSchema,
  evidenceUrls: z.array(z.string().url()).optional(),
  notes: z.string().optional(),
  answeredAt: z.string().datetime(),
  answeredBy: z.string().uuid(),
});

export const questionnaireResponseSchema = z.object({
  id: z.string().uuid(),
  reportId: z.string().uuid(),
  templateId: z.string().uuid(),
  templateVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  answers: z.record(z.string(), questionAnswerSchema),
  completedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Assessment Result Schema
export const pillarScoreSchema = z.object({
  pillar: questionPillarSchema,
  score: z.number().min(0).max(100),
  weight: z.number().min(0).max(1),
  maxPossibleScore: z.number().min(0).max(100),
  completedQuestions: z.number().int().min(0),
  totalQuestions: z.number().int().min(0),
});

export const gapSchema = z.object({
  questionId: z.string().uuid(),
  questionText: z.string(),
  pillar: questionPillarSchema,
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  reason: z.enum(['missing_answer', 'low_score', 'missing_evidence', 'inadequate_response']),
  currentScore: z.number().min(0).max(100),
  targetScore: z.number().min(0).max(100),
  impact: z.string(),
});

export const recommendationSchema = z.object({
  id: z.string().uuid(),
  priority: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  title: z.string().min(1),
  description: z.string().min(1),
  relatedGaps: z.array(z.string().uuid()),
  pillar: questionPillarSchema,
  effort: z.enum(['low', 'medium', 'high']),
  impact: z.enum(['low', 'medium', 'high']),
  timeframe: z.enum(['immediate', 'short_term', 'medium_term', 'long_term']),
});

export const scoreExplanationSchema = z.object({
  overallScore: z.number().min(0).max(100),
  methodology: z.string(),
  pillarBreakdown: z.array(
    z.object({
      pillar: questionPillarSchema,
      contribution: z.number().min(0).max(100),
      reasoning: z.string(),
    })
  ),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
});

export const assessmentResultSchema = z.object({
  id: z.string().uuid(),
  reportId: z.string().uuid(),
  questionnaireResponseId: z.string().uuid(),

  overallScore: z.number().min(0).max(100),
  pillarScores: z.array(pillarScoreSchema).length(4),

  gaps: z.array(gapSchema),
  gapCount: z.number().int().min(0),
  criticalGapCount: z.number().int().min(0),

  recommendations: z.array(recommendationSchema),

  explanation: scoreExplanationSchema,

  assessedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Disclosure Output Schema
export const disclosureSectionSchema = z.object({
  id: z.string().uuid(),
  pillar: questionPillarSchema,
  title: z.string().min(1),
  titleArabic: z.string().optional(),
  order: z.number().int().min(1),
  narrative: z.string().min(1),
  narrativeArabic: z.string().optional(),
  dataPoints: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      source: z.string().optional(),
    })
  ),
});

export const evidenceReferenceSchema = z.object({
  questionId: z.string().uuid(),
  questionText: z.string(),
  evidenceType: z.string(),
  evidenceUrls: z.array(z.string().url()),
  notes: z.string().optional(),
});

export const disclosureDisclaimerSchema = z.object({
  type: z.enum(['legal', 'informational', 'methodology']),
  text: z.string().min(1),
  textArabic: z.string().optional(),
  order: z.number().int().min(1),
});

export const disclosureOutputSchema = z.object({
  id: z.string().uuid(),
  reportId: z.string().uuid(),
  assessmentId: z.string().uuid(),

  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  jurisdiction: jurisdictionSchema,
  generatedForCompany: z.string().min(1),

  sections: z.array(disclosureSectionSchema).min(1),
  evidenceAppendix: z.array(evidenceReferenceSchema),
  disclaimers: z.array(disclosureDisclaimerSchema).min(1),

  generatedAt: z.string().datetime(),
  generatedBy: z.string().uuid().nullable(),
  format: z.enum(['json', 'pdf', 'word']),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Export type inference helpers
export type CompanyProfileInput = z.infer<typeof companyProfileSchema>;
export type QuestionnaireTemplateInput = z.infer<typeof questionnaireTemplateSchema>;
export type QuestionnaireResponseInput = z.infer<typeof questionnaireResponseSchema>;
export type AssessmentResultInput = z.infer<typeof assessmentResultSchema>;
export type DisclosureOutputInput = z.infer<typeof disclosureOutputSchema>;
