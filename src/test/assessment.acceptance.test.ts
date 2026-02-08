import { describe, it, expect } from 'vitest';
import { runAssessment } from '@/lib/assessment';
import { buildQuestionnaireTemplate } from '@/lib/questionnaire/builder';
import type { CompanyProfile, QuestionnaireResponse, QuestionAnswer } from '@/types/compliance';

describe('Assessment Engine - End-to-End Acceptance Tests', () => {
  /**
   * Test Case 1: UAE Listed Company with Good Compliance
   */
  it('should produce stable results for UAE listed company (high compliance)', () => {
    const uaeListedProfile: CompanyProfile = {
      companyId: 'uae-test-1',
      companyName: 'Emirates Tech Solutions',
      companyNameArabic: 'حلول الإمارات التقنية',
      jurisdiction: 'UAE',
      listingStatus: 'listed',
      stockExchange: 'ADX',
      sector: 'Technology',
      subsector: 'Software',
      employeeCountBand: '51-250',
      annualRevenueBand: '10M-50M',
      revenueCurrency: 'AED',
      operationalYears: 8,
      hasInternationalOps: false,
      hasCriticalInfrastructure: false,
      hasFullTimeEmployees: true,
      hasContractors: true,
      hasRemoteWorkforce: false,
      fiscalYearEnd: 12,
      reportingYear: 2024,
    };

    const template = buildQuestionnaireTemplate(uaeListedProfile);

    // Simulate good compliance responses (mostly true/high values)
    const answers: Record<string, QuestionAnswer> = {};
    template.sections.forEach((section) => {
      section.questions.forEach((question) => {
        const now = new Date().toISOString();
        if (question.type === 'boolean') {
          answers[question.id] = {
            questionId: question.id,
            value: true, // Good compliance
            answeredAt: now,
            answeredBy: 'test-user',
          };
        } else if (question.type === 'percentage') {
          answers[question.id] = {
            questionId: question.id,
            value: 80, // Good percentage
            answeredAt: now,
            answeredBy: 'test-user',
          };
        } else if (question.type === 'text') {
          answers[question.id] = {
            questionId: question.id,
            value: 'Detailed disclosure provided',
            answeredAt: now,
            answeredBy: 'test-user',
          };
        }
      });
    });

    const response: QuestionnaireResponse = {
      id: 'resp-uae-1',
      reportId: 'report-uae-1',
      templateId: template.id,
      templateVersion: template.version,
      answers,
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = runAssessment(template, response, uaeListedProfile, 'report-uae-1');

    // Assertions
    expect(result.overallScore).toBeGreaterThan(70); // Good compliance
    expect(result.pillarScores).toHaveLength(4); // All 4 pillars
    expect(result.gapCount).toBeLessThan(5); // Few gaps
    expect(result.criticalGapCount).toBe(0); // No critical gaps
    expect(result.recommendations.length).toBeLessThan(10); // Limited recommendations

    // Verify determinism: Running again should produce identical results
    const result2 = runAssessment(template, response, uaeListedProfile, 'report-uae-1');
    expect(result2.overallScore).toBe(result.overallScore);
    expect(result2.gapCount).toBe(result.gapCount);
    expect(result2.criticalGapCount).toBe(result.criticalGapCount);
  });

  /**
   * Test Case 2: KSA Non-Listed Company with Poor Compliance
   */
  it('should produce stable results for KSA non-listed company (poor compliance)', () => {
    const ksaNonListedProfile: CompanyProfile = {
      companyId: 'ksa-test-1',
      companyName: 'Riyadh Small Business',
      companyNameArabic: 'أعمال الرياض الصغيرة',
      jurisdiction: 'KSA',
      listingStatus: 'non-listed',
      stockExchange: null,
      sector: 'Retail',
      subsector: 'General',
      employeeCountBand: '11-50',
      annualRevenueBand: '1M-10M',
      revenueCurrency: 'SAR',
      operationalYears: 3,
      hasInternationalOps: false,
      hasCriticalInfrastructure: false,
      hasFullTimeEmployees: true,
      hasContractors: false,
      hasRemoteWorkforce: false,
      fiscalYearEnd: 12,
      reportingYear: 2024,
    };

    const template = buildQuestionnaireTemplate(ksaNonListedProfile);

    // Simulate poor compliance (many false/low values or unanswered)
    const answers: Record<string, QuestionAnswer> = {};
    let answerCount = 0;
    template.sections.forEach((section) => {
      section.questions.forEach((question, idx) => {
        const now = new Date().toISOString();
        // Answer only 50% of questions
        if (idx % 2 === 0) {
          if (question.type === 'boolean') {
            answers[question.id] = {
              questionId: question.id,
              value: false, // Poor compliance
              answeredAt: now,
              answeredBy: 'test-user',
            };
          } else if (question.type === 'percentage') {
            answers[question.id] = {
              questionId: question.id,
              value: 20, // Low percentage
              answeredAt: now,
              answeredBy: 'test-user',
            };
          } else if (question.type === 'text') {
            answers[question.id] = {
              questionId: question.id,
              value: '', // Empty
              answeredAt: now,
              answeredBy: 'test-user',
            };
          }
          answerCount++;
        }
        // Other 50% left unanswered
      });
    });

    const response: QuestionnaireResponse = {
      id: 'resp-ksa-1',
      reportId: 'report-ksa-1',
      templateId: template.id,
      templateVersion: template.version,
      answers,
      completedAt: null, // Not completed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = runAssessment(template, response, ksaNonListedProfile, 'report-ksa-1');

    // Assertions
    expect(result.overallScore).toBeLessThan(40); // Poor compliance
    expect(result.pillarScores).toHaveLength(4); // All 4 pillars (even if empty)
    expect(result.gapCount).toBeGreaterThan(5); // Many gaps
    expect(result.criticalGapCount).toBeGreaterThan(0); // Some critical gaps
    expect(result.recommendations.length).toBeGreaterThan(0); // Many recommendations

    // Verify explanation includes weaknesses
    expect(result.explanation.weaknesses.length).toBeGreaterThan(0);

    // Verify determinism
    const result2 = runAssessment(template, response, ksaNonListedProfile, 'report-ksa-1');
    expect(result2.overallScore).toBe(result.overallScore);
    expect(result2.gapCount).toBe(result.gapCount);
    expect(result2.criticalGapCount).toBe(result.criticalGapCount);
  });

  /**
   * Test Case 3: Partial Completion (50%)
   */
  it('should handle partial questionnaire completion', () => {
    const profile: CompanyProfile = {
      companyId: 'test-partial',
      companyName: 'Test Company',
      companyNameArabic: null,
      jurisdiction: 'Qatar',
      listingStatus: 'listed',
      stockExchange: 'QSE',
      sector: 'Finance',
      subsector: 'Banking',
      employeeCountBand: '251-1000',
      annualRevenueBand: '50M-250M',
      revenueCurrency: 'QAR',
      operationalYears: 12,
      hasInternationalOps: true,
      hasCriticalInfrastructure: true,
      hasFullTimeEmployees: true,
      hasContractors: true,
      hasRemoteWorkforce: false,
      fiscalYearEnd: 12,
      reportingYear: 2024,
    };

    const template = buildQuestionnaireTemplate(profile);

    // Answer exactly 50% of questions
    const answers: Record<string, QuestionAnswer> = {};
    let totalQuestions = 0;
    let answeredQuestions = 0;

    template.sections.forEach((section) => {
      section.questions.forEach((question, idx) => {
        totalQuestions++;
        if (idx % 2 === 0) {
          answers[question.id] = {
            questionId: question.id,
            value: question.type === 'boolean' ? true : 'answered',
            answeredAt: new Date().toISOString(),
            answeredBy: 'test-user',
          };
          answeredQuestions++;
        }
      });
    });

    const response: QuestionnaireResponse = {
      id: 'resp-partial',
      reportId: 'report-partial',
      templateId: template.id,
      templateVersion: template.version,
      answers,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = runAssessment(template, response, profile, 'report-partial');

    // Assertions
    expect(result.overallScore).toBeLessThan(70); // Incomplete
    expect(result.explanation.weaknesses.length).toBeGreaterThan(0); // Has weaknesses identified

    // Verify all pillar scores are calculated
    result.pillarScores.forEach((ps) => {
      expect(ps.score).toBeGreaterThanOrEqual(0);
      expect(ps.score).toBeLessThanOrEqual(100);
      expect(ps.totalQuestions).toBeGreaterThan(0);
    });
  });

  /**
   * Test Case 4: Verify Jurisdiction-Aware Recommendations
   */
  it('should provide jurisdiction-specific recommendations', () => {
    const uaeProfile: CompanyProfile = {
      companyId: 'uae-rec-test',
      companyName: 'UAE Test Co',
      companyNameArabic: null,
      jurisdiction: 'UAE',
      listingStatus: 'listed',
      stockExchange: 'ADX',
      sector: 'Energy',
      subsector: 'Oil & Gas',
      employeeCountBand: '251-1000',
      annualRevenueBand: '50M-250M',
      revenueCurrency: 'AED',
      operationalYears: 15,
      hasInternationalOps: true,
      hasCriticalInfrastructure: true,
      hasFullTimeEmployees: true,
      hasContractors: true,
      hasRemoteWorkforce: false,
      fiscalYearEnd: 12,
      reportingYear: 2024,
    };

    const template = buildQuestionnaireTemplate(uaeProfile);

    // Create gaps in governance
    const answers: Record<string, QuestionAnswer> = {};
    template.sections.forEach((section) => {
      section.questions.forEach((question) => {
        if (question.pillar === 'governance') {
          // Leave governance questions unanswered or false
          if (question.type === 'boolean') {
            answers[question.id] = {
              questionId: question.id,
              value: false,
              answeredAt: new Date().toISOString(),
              answeredBy: 'test-user',
            };
          }
        } else {
          // Answer other pillars well
          answers[question.id] = {
            questionId: question.id,
            value: question.type === 'boolean' ? true : 'good answer',
            answeredAt: new Date().toISOString(),
            answeredBy: 'test-user',
          };
        }
      });
    });

    const response: QuestionnaireResponse = {
      id: 'resp-uae-rec',
      reportId: 'report-uae-rec',
      templateId: template.id,
      templateVersion: template.version,
      answers,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = runAssessment(template, response, uaeProfile, 'report-uae-rec');

    // Should have governance-related recommendations
    expect(result.recommendations.some((r) => r.pillar === 'governance')).toBe(true);

    // Verify recommendations have required fields
    result.recommendations.forEach((rec) => {
      expect(rec.id).toBeTruthy();
      expect(rec.title).toBeTruthy();
      expect(rec.description).toBeTruthy();
      expect(rec.effort).toMatch(/^(low|medium|high)$/);
      expect(rec.impact).toMatch(/^(low|medium|high)$/);
      expect(rec.priority).toBeGreaterThan(0);
      expect(rec.priority).toBeLessThanOrEqual(5);
    });
  });
});
