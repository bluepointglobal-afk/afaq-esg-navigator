/**
 * AFAQ Assessment Engine - Scoring Module
 *
 * Deterministic scoring engine that computes compliance scores from questionnaire responses.
 * All scoring rules are explicit, transparent, and auditable.
 */

import type {
  Question,
  QuestionAnswer,
  QuestionnaireTemplate,
  QuestionnaireResponse,
  CompanyProfile,
  PillarScore,
  QuestionPillar,
} from '@/types/compliance';
import { shouldShowQuestion } from '@/lib/conditional-logic';

/**
 * Pillar weights for overall score calculation
 * Total = 100%
 */
export const PILLAR_WEIGHTS: Record<QuestionPillar, number> = {
  governance: 30,
  esg: 25,
  risk_controls: 25,
  transparency: 20,
};

/**
 * Compute score for a single question based on its answer
 * Returns 0-100
 */
export function scoreQuestion(question: Question, answer: QuestionAnswer | undefined): number {
  // Unanswered = 0
  if (!answer || answer.value === null || answer.value === undefined) {
    return 0;
  }

  switch (question.type) {
    case 'boolean':
      return scoreBooleanQuestion(question, answer);

    case 'single_choice':
      return scoreSingleChoiceQuestion(question, answer);

    case 'multiple_choice':
      return scoreMultipleChoiceQuestion(question, answer);

    case 'number':
      return scoreNumberQuestion(question, answer);

    case 'percentage':
      return scorePercentageQuestion(question, answer);

    case 'text':
      return scoreTextQuestion(question, answer);

    case 'date':
      return scoreDateQuestion(question, answer);

    default:
      console.warn(`Unknown question type: ${question.type}`);
      return 0;
  }
}

/**
 * Boolean questions: true = 100, false = 0
 */
function scoreBooleanQuestion(question: Question, answer: QuestionAnswer): number {
  const value = answer.value;
  if (typeof value !== 'boolean') {
    return 0;
  }
  return value ? 100 : 0;
}

/**
 * Single choice questions: lookup score from option_scores or use heuristic
 */
function scoreSingleChoiceQuestion(question: Question, answer: QuestionAnswer): number {
  const selectedValue = answer.value as string;

  // Use explicit option scores if defined
  if (question.scoringRules?.optionScores) {
    const score = question.scoringRules.optionScores[selectedValue];
    return score !== undefined ? Math.max(0, Math.min(100, score)) : 0;
  }

  // Fallback heuristic: first option = 100, last option = 0, interpolate linearly
  if (!question.options || question.options.length === 0) {
    return 0;
  }

  const optionIndex = question.options.findIndex((opt) => opt.value === selectedValue);
  if (optionIndex === -1) {
    return 0;
  }

  const optionCount = question.options.length;
  if (optionCount === 1) {
    return 100;
  }

  // Linear interpolation: first = 100, last = 0
  return Math.round(100 - (optionIndex / (optionCount - 1)) * 100);
}

/**
 * Multiple choice questions: proportional scoring
 * Score = (sum of selected option scores) / (sum of all option scores) × 100
 */
function scoreMultipleChoiceQuestion(question: Question, answer: QuestionAnswer): number {
  const selectedValues = answer.value as string[];
  if (!Array.isArray(selectedValues) || selectedValues.length === 0) {
    return 0;
  }

  if (!question.options || question.options.length === 0) {
    return 0;
  }

  // Use explicit option scores if defined
  if (question.scoringRules?.optionScores) {
    const totalPossible = Object.values(question.scoringRules.optionScores).reduce(
      (sum, score) => sum + score,
      0
    );

    const selectedScore = selectedValues.reduce((sum, value) => {
      const score = question.scoringRules!.optionScores![value] || 0;
      return sum + score;
    }, 0);

    return totalPossible > 0 ? Math.round((selectedScore / totalPossible) * 100) : 0;
  }

  // Fallback heuristic: each option worth equal points
  const totalOptions = question.options.length;
  const selectedCount = selectedValues.filter((v) =>
    question.options!.some((opt) => opt.value === v)
  ).length;

  return Math.round((selectedCount / totalOptions) * 100);
}

/**
 * Number questions: scale based on min/target/max
 * Score = clamp((value - min) / (target - min) × 100, 0, 100)
 */
function scoreNumberQuestion(question: Question, answer: QuestionAnswer): number {
  const value = answer.value as number;
  if (typeof value !== 'number' || isNaN(value)) {
    return 0;
  }

  const rules = question.scoringRules;
  if (!rules || rules.min === undefined || rules.target === undefined) {
    // No scoring rules defined - use presence as score (50 points for any answer)
    return 50;
  }

  const { min, target, max } = rules;

  // Below minimum = 0
  if (value < min) {
    return 0;
  }

  // At or above target = 100
  if (value >= target) {
    return 100;
  }

  // Between min and target: linear interpolation
  const score = ((value - min) / (target - min)) * 100;
  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Percentage questions: direct mapping (value = score)
 */
function scorePercentageQuestion(question: Question, answer: QuestionAnswer): number {
  const value = answer.value as number;
  if (typeof value !== 'number' || isNaN(value)) {
    return 0;
  }

  // Clamp to 0-100 range
  return Math.round(Math.max(0, Math.min(100, value)));
}

/**
 * Text questions: simple presence check
 * Non-empty = 100, empty = 0
 */
function scoreTextQuestion(question: Question, answer: QuestionAnswer): number {
  const value = answer.value as string;
  if (typeof value !== 'string') {
    return 0;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? 100 : 0;
}

/**
 * Date questions: recency-based scoring
 * Within max_age = 100, beyond 2× max_age = 0, linear decay in between
 */
function scoreDateQuestion(question: Question, answer: QuestionAnswer): number {
  const value = answer.value;
  let dateValue: Date;

  // Handle both Date objects and ISO strings
  if (value instanceof Date) {
    dateValue = value;
  } else if (typeof value === 'string') {
    dateValue = new Date(value);
  } else {
    return 0;
  }

  if (isNaN(dateValue.getTime())) {
    return 0;
  }

  const maxAgeMonths = question.scoringRules?.maxAgeMonths || 12; // Default: 12 months
  const now = new Date();
  const ageMonths = (now.getTime() - dateValue.getTime()) / (1000 * 60 * 60 * 24 * 30.44); // Approx months

  // Within max age = 100 points
  if (ageMonths <= maxAgeMonths) {
    return 100;
  }

  // Beyond 2× max age = 0 points
  if (ageMonths >= maxAgeMonths * 2) {
    return 0;
  }

  // Linear decay from 100 to 0 between max_age and 2× max_age
  const score = 100 - ((ageMonths - maxAgeMonths) / maxAgeMonths) * 100;
  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Compute per-pillar scores with weighted normalization
 */
export function computePillarScores(
  template: QuestionnaireTemplate,
  response: QuestionnaireResponse,
  companyProfile: CompanyProfile
): PillarScore[] {
  const pillarScores: PillarScore[] = [];

  // Group questions by pillar
  const questionsByPillar: Record<QuestionPillar, Question[]> = {
    governance: [],
    esg: [],
    risk_controls: [],
    transparency: [],
  };

  template.sections.forEach((section) => {
    section.questions.forEach((question) => {
      // Only include visible questions (conditional logic passes)
      const isVisible = shouldShowQuestion(question.conditionalRules, response.answers);
      if (isVisible) {
        questionsByPillar[question.pillar].push(question);
      }
    });
  });

  // Compute score for each pillar
  Object.entries(questionsByPillar).forEach(([pillar, questions]) => {
    if (questions.length === 0) {
      pillarScores.push({
        pillar: pillar as QuestionPillar,
        score: 0,
        weight: PILLAR_WEIGHTS[pillar as QuestionPillar],
        maxPossibleScore: 100,
        completedQuestions: 0,
        totalQuestions: 0,
      });
      return;
    }

    // Weighted sum of question scores
    let weightedSum = 0;
    let totalWeight = 0;
    let completedCount = 0;

    questions.forEach((question) => {
      const answer = response.answers[question.id];
      const score = scoreQuestion(question, answer);

      weightedSum += score * question.weight;
      totalWeight += question.weight;

      if (answer) {
        completedCount++;
      }
    });

    // Pillar score = weighted average (0-100)
    const pillarScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

    pillarScores.push({
      pillar: pillar as QuestionPillar,
      score: pillarScore,
      weight: PILLAR_WEIGHTS[pillar as QuestionPillar],
      maxPossibleScore: 100,
      completedQuestions: completedCount,
      totalQuestions: questions.length,
    });
  });

  return pillarScores;
}

/**
 * Compute overall score from pillar scores
 */
export function computeOverallScore(pillarScores: PillarScore[]): number {
  let weightedSum = 0;
  let totalWeight = 0;

  pillarScores.forEach((pillarScore) => {
    weightedSum += pillarScore.score * pillarScore.weight;
    totalWeight += pillarScore.weight;
  });

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

/**
 * Main entry point: Compute all scores from template and response
 */
export interface ScoringResult {
  pillarScores: PillarScore[];
  overallScore: number;
  questionScores: Record<string, number>; // question.id → score (0-100)
}

export function computeScores(
  template: QuestionnaireTemplate,
  response: QuestionnaireResponse,
  companyProfile: CompanyProfile
): ScoringResult {
  // Compute per-pillar scores
  const pillarScores = computePillarScores(template, response, companyProfile);

  // Compute overall score
  const overallScore = computeOverallScore(pillarScores);

  // Compute individual question scores for gap analysis
  const questionScores: Record<string, number> = {};
  template.sections.forEach((section) => {
    section.questions.forEach((question) => {
      const isVisible = shouldShowQuestion(question.conditionalRules, response.answers);
      if (isVisible) {
        const answer = response.answers[question.id];
        questionScores[question.id] = scoreQuestion(question, answer);
      }
    });
  });

  return {
    pillarScores,
    overallScore,
    questionScores,
  };
}
