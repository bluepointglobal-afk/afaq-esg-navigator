/**
 * AFAQ Assessment Engine - Assessment Orchestrator
 *
 * Main entry point that coordinates scoring, gap detection, and recommendation generation
 * to produce a complete AssessmentResult.
 */

import type {
  AssessmentResult,
  QuestionnaireTemplate,
  QuestionnaireResponse,
  CompanyProfile,
  ScoreExplanation,
} from '@/types/compliance';
import { computeScores, PILLAR_WEIGHTS } from '@/lib/scoring';
import { getDetailedGaps } from '@/lib/gaps';
import { getDetailedRecommendations } from '@/lib/recommendations';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate explanation object for transparency
 */
function generateExplanation(
  overallScore: number,
  pillarScores: ReturnType<typeof computeScores>['pillarScores'],
  gapCount: number,
  criticalGapCount: number
): ScoreExplanation {
  // Determine strengths and weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  pillarScores.forEach((pillarScore) => {
    const pillarName =
      pillarScore.pillar === 'risk_controls'
        ? 'Risk & Controls'
        : pillarScore.pillar.charAt(0).toUpperCase() + pillarScore.pillar.slice(1);

    if (pillarScore.score >= 80) {
      strengths.push(`Strong performance in ${pillarName} (${pillarScore.score}/100)`);
    } else if (pillarScore.score < 50) {
      weaknesses.push(`Significant gaps in ${pillarName} (${pillarScore.score}/100)`);
    }
  });

  // Add completion-based observations
  const totalQuestions = pillarScores.reduce((sum, p) => sum + p.totalQuestions, 0);
  const completedQuestions = pillarScores.reduce((sum, p) => sum + p.completedQuestions, 0);
  const completionRate = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;

  if (completionRate < 80) {
    weaknesses.push(`Low questionnaire completion rate (${Math.round(completionRate)}%)`);
  }

  if (criticalGapCount > 0) {
    weaknesses.push(`${criticalGapCount} critical compliance gap(s) identified`);
  }

  // Default messages if none identified
  if (strengths.length === 0) {
    strengths.push('Completion of compliance assessment demonstrates commitment');
  }

  if (weaknesses.length === 0 && overallScore < 90) {
    weaknesses.push('Opportunities exist for continuous improvement');
  }

  // Build pillar breakdown
  const pillarBreakdown = pillarScores.map((ps) => ({
    pillar: ps.pillar,
    contribution: Math.round((ps.score * PILLAR_WEIGHTS[ps.pillar]) / 100),
    reasoning: `${ps.completedQuestions}/${ps.totalQuestions} questions answered with ${ps.score}/100 score (weight: ${ps.weight}%)`,
  }));

  return {
    overallScore,
    methodology: `Your compliance score is calculated using a transparent, deterministic methodology:

1. Question Weighting: Each question has a weight (1-10) based on regulatory importance.
2. Answer Scoring: Answers are scored 0-100 based on best practices for each question type.
3. Pillar Scores: Weighted average of questions within each pillar (Governance, ESG, Risk & Controls, Transparency).
4. Overall Score: Weighted average across all pillars (Governance ${PILLAR_WEIGHTS.governance}%, ESG ${PILLAR_WEIGHTS.esg}%, Risk & Controls ${PILLAR_WEIGHTS.risk_controls}%, Transparency ${PILLAR_WEIGHTS.transparency}%).

Gap Severity: Determined by question weight, answer quality, and criticality flags.
Recommendations: Matched from a curated database based on your specific gaps.`,
    pillarBreakdown,
    strengths,
    weaknesses,
  };
}

/**
 * Run complete assessment
 */
export function runAssessment(
  template: QuestionnaireTemplate,
  response: QuestionnaireResponse,
  companyProfile: CompanyProfile,
  reportId: string
): AssessmentResult {
  // Step 1: Compute scores
  const scoringResult = computeScores(template, response, companyProfile);

  // Step 2: Detect gaps
  const detailedGaps = getDetailedGaps(template, response, scoringResult.questionScores);

  // Convert DetailedGap to Gap (for storage)
  const gaps = detailedGaps.map((dg) => ({
    questionId: dg.questionId,
    questionText: dg.questionText,
    pillar: dg.pillar,
    severity: dg.severity,
    reason: dg.reason,
    currentScore: dg.currentScore,
    targetScore: dg.targetScore,
    impact: dg.impact,
  }));

  const gapCount = gaps.length;
  const criticalGapCount = gaps.filter((g) => g.severity === 'critical').length;

  // Step 3: Generate recommendations
  const detailedRecommendations = getDetailedRecommendations(detailedGaps, companyProfile);

  // Convert to standard Recommendation format
  const recommendations = detailedRecommendations.map((dr) => ({
    id: dr.id,
    priority: dr.priority,
    title: dr.title,
    description: dr.description,
    relatedGaps: dr.relatedGaps,
    pillar: dr.pillar,
    effort: dr.effort,
    impact: dr.impact,
    timeframe: dr.timeframe,
  }));

  // Step 4: Generate explanation
  const explanation = generateExplanation(
    scoringResult.overallScore,
    scoringResult.pillarScores,
    gapCount,
    criticalGapCount
  );

  // Build final result
  const now = new Date().toISOString();

  const assessmentResult: AssessmentResult = {
    id: uuidv4(),
    reportId,
    questionnaireResponseId: response.id,
    overallScore: scoringResult.overallScore,
    pillarScores: scoringResult.pillarScores,
    gaps,
    gapCount,
    criticalGapCount,
    recommendations,
    explanation,
    assessedAt: now,
    createdAt: now,
    updatedAt: now,
  };

  return assessmentResult;
}
