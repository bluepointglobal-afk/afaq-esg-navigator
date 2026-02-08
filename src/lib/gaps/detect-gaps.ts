/**
 * AFAQ Assessment Engine - Gap Detection Module
 *
 * Deterministic gap detection that identifies compliance gaps based on:
 * - Question weight (importance)
 * - Answer score (quality)
 * - Criticality metadata (regulatory importance)
 *
 * All gap severity assignments are explicit and auditable.
 */

import type {
  Question,
  QuestionAnswer,
  QuestionnaireTemplate,
  QuestionnaireResponse,
  Gap,
  QuestionPillar,
} from '@/types/compliance';
import { shouldShowQuestion } from '@/lib/conditional-logic';
import { scoreQuestion } from '@/lib/scoring';

/**
 * Gap severity thresholds
 */
const SEVERITY_THRESHOLDS = {
  // Critical: High-weight or critical questions with very low scores
  CRITICAL_WEIGHT: 8,
  CRITICAL_SCORE_MAX: 50,

  // High: Medium-high weight with low scores
  HIGH_WEIGHT: 6,
  HIGH_SCORE_MAX: 30,

  // Medium: Medium weight with mediocre scores
  MEDIUM_WEIGHT: 4,
  MEDIUM_SCORE_MAX: 50,

  // Low: Any question with suboptimal scores
  LOW_SCORE_MAX: 70,
};

/**
 * Determine gap severity based on question weight, score, and criticality
 */
export function determineSeverity(
  question: Question,
  answer: QuestionAnswer | undefined,
  score: number
): 'critical' | 'high' | 'medium' | 'low' | null {
  // No gap if score is good (>= 70)
  if (score >= SEVERITY_THRESHOLDS.LOW_SCORE_MAX) {
    return null;
  }

  // CRITICAL: Explicitly marked critical questions with poor scores
  if (question.criticality === 'critical' && score < SEVERITY_THRESHOLDS.CRITICAL_SCORE_MAX) {
    return 'critical';
  }

  // CRITICAL: High-weight questions completely unaddressed
  if (question.weight >= SEVERITY_THRESHOLDS.CRITICAL_WEIGHT && score === 0) {
    return 'critical';
  }

  // HIGH: High-weight questions with very low scores
  if (question.weight >= SEVERITY_THRESHOLDS.HIGH_WEIGHT && score < SEVERITY_THRESHOLDS.HIGH_SCORE_MAX) {
    return 'high';
  }

  // MEDIUM: Medium-weight questions with poor scores
  if (question.weight >= SEVERITY_THRESHOLDS.MEDIUM_WEIGHT && score < SEVERITY_THRESHOLDS.MEDIUM_SCORE_MAX) {
    return 'medium';
  }

  // LOW: Any other question with suboptimal scores
  if (score < SEVERITY_THRESHOLDS.LOW_SCORE_MAX) {
    return 'low';
  }

  return null;
}

/**
 * Generate human-readable rationale for a gap
 */
export function generateRationale(
  question: Question,
  answer: QuestionAnswer | undefined,
  score: number
): string {
  // Unanswered
  if (!answer || answer.value === null || answer.value === undefined) {
    return `Question not answered: "${question.text}"`;
  }

  // Type-specific rationale
  switch (question.type) {
    case 'boolean':
      if (answer.value === false) {
        return `Negative response indicates non-compliance: "${question.text}"`;
      }
      break;

    case 'single_choice':
    case 'multiple_choice':
      if (score === 0) {
        return `Response indicates no compliance measures in place for: "${question.text}"`;
      } else if (score < 30) {
        return `Response indicates minimal compliance measures for: "${question.text}"`;
      }
      break;

    case 'number':
      if (score === 0) {
        return `Value does not meet minimum requirements for: "${question.text}"`;
      } else if (score < 50) {
        return `Value below target threshold for: "${question.text}"`;
      }
      break;

    case 'percentage':
      if (score < 30) {
        return `Very low percentage (${score}%) for: "${question.text}"`;
      } else if (score < 70) {
        return `Below recommended percentage (${score}%) for: "${question.text}"`;
      }
      break;

    case 'text':
      if (score === 0) {
        return `No disclosure provided for: "${question.text}"`;
      }
      break;

    case 'date':
      if (score === 0) {
        return `Information severely outdated or missing for: "${question.text}"`;
      } else if (score < 50) {
        return `Information outdated for: "${question.text}"`;
      }
      break;
  }

  // Generic rationale based on score
  if (score === 0) {
    return `Complete gap identified (score: 0/100): "${question.text}"`;
  } else if (score < 30) {
    return `Significant gap identified (score: ${score}/100): "${question.text}"`;
  } else if (score < 70) {
    return `Partial compliance gap (score: ${score}/100): "${question.text}"`;
  }

  return `Improvement opportunity (score: ${score}/100): "${question.text}"`;
}

/**
 * Generate required action based on question type and gap
 */
export function generateRequiredAction(
  question: Question,
  answer: QuestionAnswer | undefined,
  score: number
): string {
  // Unanswered
  if (!answer || answer.value === null || answer.value === undefined) {
    return `Provide answer for: ${question.code}`;
  }

  // Type-specific actions
  switch (question.type) {
    case 'boolean':
      if (answer.value === false) {
        return `Implement required control or policy for ${question.code}`;
      }
      return `Review and update response for ${question.code}`;

    case 'single_choice':
    case 'multiple_choice':
      if (score < 30) {
        return `Implement higher-level compliance measures for ${question.code}`;
      }
      return `Upgrade current compliance measures for ${question.code}`;

    case 'number':
      if (score < 50) {
        return `Increase value to meet target threshold for ${question.code}`;
      }
      return `Improve metric to optimal level for ${question.code}`;

    case 'percentage':
      if (score < 50) {
        return `Substantially increase percentage for ${question.code}`;
      }
      return `Improve percentage to recommended level for ${question.code}`;

    case 'text':
      if (score === 0) {
        return `Provide detailed disclosure for ${question.code}`;
      }
      return `Enhance existing disclosure for ${question.code}`;

    case 'date':
      if (score === 0) {
        return `Update information immediately for ${question.code}`;
      }
      return `Refresh outdated information for ${question.code}`;

    default:
      return `Address compliance gap for ${question.code}`;
  }
}

/**
 * Extract evidence needed from question metadata
 */
export function extractEvidenceNeeded(question: Question): string[] {
  const evidence: string[] = [];

  // Use evidence hint if available
  if (question.evidenceHint) {
    evidence.push(question.evidenceHint);
  }

  // Add type-specific evidence requirements
  switch (question.type) {
    case 'boolean':
      if (question.evidenceHint) {
        // Already added above
      } else {
        evidence.push('Policy document or formal procedure');
      }
      break;

    case 'number':
    case 'percentage':
      evidence.push('Supporting documentation with metrics');
      break;

    case 'date':
      evidence.push('Dated documentation or report');
      break;

    case 'text':
      evidence.push('Written disclosure or narrative');
      break;
  }

  return evidence.length > 0 ? evidence : ['Supporting documentation'];
}

/**
 * Detect all gaps in a questionnaire response
 */
export interface GapDetectionResult {
  gaps: Gap[];
  gapCount: number;
  criticalGapCount: number;
  highGapCount: number;
  mediumGapCount: number;
  lowGapCount: number;
}

export function detectGaps(
  template: QuestionnaireTemplate,
  response: QuestionnaireResponse,
  questionScores: Record<string, number>
): GapDetectionResult {
  const gaps: Gap[] = [];
  let criticalGapCount = 0;
  let highGapCount = 0;
  let mediumGapCount = 0;
  let lowGapCount = 0;

  // Iterate through all visible questions
  template.sections.forEach((section) => {
    section.questions.forEach((question) => {
      // Only check visible questions
      const isVisible = shouldShowQuestion(question.conditionalRules, response.answers);
      if (!isVisible) {
        return;
      }

      const answer = response.answers[question.id];
      const score = questionScores[question.id] || 0;

      // Determine if this is a gap
      const severity = determineSeverity(question, answer, score);
      if (!severity) {
        return; // No gap
      }

      // Count by severity
      switch (severity) {
        case 'critical':
          criticalGapCount++;
          break;
        case 'high':
          highGapCount++;
          break;
        case 'medium':
          mediumGapCount++;
          break;
        case 'low':
          lowGapCount++;
          break;
      }

      // Determine gap reason
      let reason: Gap['reason'];
      if (!answer) {
        reason = 'missing_answer';
      } else if (score === 0) {
        reason = 'inadequate_response';
      } else if (!answer.evidenceUrls || answer.evidenceUrls.length === 0) {
        reason = 'missing_evidence';
      } else {
        reason = 'low_score';
      }

      // Create gap object
      const gap: Gap = {
        questionId: question.id,
        questionText: question.text,
        pillar: question.pillar,
        severity,
        reason,
        currentScore: score,
        targetScore: 70, // Minimum acceptable score
        impact: generateRationale(question, answer, score),
      };

      gaps.push(gap);
    });
  });

  // Sort gaps by severity (critical > high > medium > low) then by score (lowest first)
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  gaps.sort((a, b) => {
    if (a.severity !== b.severity) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return a.currentScore - b.currentScore;
  });

  return {
    gaps,
    gapCount: gaps.length,
    criticalGapCount,
    highGapCount,
    mediumGapCount,
    lowGapCount,
  };
}

/**
 * Get detailed gap information including required actions and evidence
 */
export interface DetailedGap extends Gap {
  questionCode: string;
  questionTextArabic?: string;
  requiredAction: string;
  evidenceNeeded: string[];
}

export function getDetailedGaps(
  template: QuestionnaireTemplate,
  response: QuestionnaireResponse,
  questionScores: Record<string, number>
): DetailedGap[] {
  const detectionResult = detectGaps(template, response, questionScores);
  const detailedGaps: DetailedGap[] = [];

  // Build question lookup map
  const questionMap = new Map<string, Question>();
  template.sections.forEach((section) => {
    section.questions.forEach((question) => {
      questionMap.set(question.id, question);
    });
  });

  // Enhance gaps with detailed information
  detectionResult.gaps.forEach((gap) => {
    const question = questionMap.get(gap.questionId);
    if (!question) {
      return;
    }

    const answer = response.answers[gap.questionId];
    const score = questionScores[gap.questionId] || 0;

    detailedGaps.push({
      ...gap,
      questionCode: question.code,
      questionTextArabic: question.textArabic,
      requiredAction: generateRequiredAction(question, answer, score),
      evidenceNeeded: extractEvidenceNeeded(question),
    });
  });

  return detailedGaps;
}
