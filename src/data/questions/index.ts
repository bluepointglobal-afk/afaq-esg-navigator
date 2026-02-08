// Question Bank - Central Export
// Total: 25 questions across 4 pillars

import { governanceQuestions, GOVERNANCE_QUESTION_COUNT } from './governance';
import { esgQuestions, ESG_QUESTION_COUNT } from './esg';
import { riskControlsQuestions, RISK_CONTROLS_QUESTION_COUNT } from './risk-controls';
import { transparencyQuestions, TRANSPARENCY_QUESTION_COUNT } from './transparency';
import type { Question, QuestionPillar } from '@/types/compliance';

// All questions combined
export const ALL_QUESTIONS: Question[] = [
  ...governanceQuestions,
  ...esgQuestions,
  ...riskControlsQuestions,
  ...transparencyQuestions,
];

// Questions organized by pillar
export const QUESTIONS_BY_PILLAR: Record<QuestionPillar, Question[]> = {
  governance: governanceQuestions,
  esg: esgQuestions,
  risk_controls: riskControlsQuestions,
  transparency: transparencyQuestions,
};

// Counts
export const TOTAL_QUESTION_COUNT =
  GOVERNANCE_QUESTION_COUNT +
  ESG_QUESTION_COUNT +
  RISK_CONTROLS_QUESTION_COUNT +
  TRANSPARENCY_QUESTION_COUNT;

export const QUESTION_COUNTS_BY_PILLAR = {
  governance: GOVERNANCE_QUESTION_COUNT,
  esg: ESG_QUESTION_COUNT,
  risk_controls: RISK_CONTROLS_QUESTION_COUNT,
  transparency: TRANSPARENCY_QUESTION_COUNT,
};

// Validation
if (ALL_QUESTIONS.length !== TOTAL_QUESTION_COUNT) {
  throw new Error(
    `Question count mismatch: expected ${TOTAL_QUESTION_COUNT}, got ${ALL_QUESTIONS.length}`
  );
}

// Export individual question banks
export { governanceQuestions, esgQuestions, riskControlsQuestions, transparencyQuestions };
