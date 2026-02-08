// Conditional Logic Evaluator for Dynamic Questionnaire Rendering
// Use this in Step 2 to determine which questions to show/hide

import type { ConditionalRule, QuestionAnswer } from '@/types/compliance';

/**
 * Evaluates a single conditional rule against an answer
 */
export function evaluateConditionalRule(
  rule: ConditionalRule,
  answer: QuestionAnswer | undefined
): boolean {
  const { operator, value, showWhen } = rule;

  let conditionMet = false;

  // Handle "is_answered" and "is_not_answered" operators
  if (operator === 'is_answered') {
    conditionMet = answer !== undefined && answer.value !== null && answer.value !== '';
  } else if (operator === 'is_not_answered') {
    conditionMet = answer === undefined || answer.value === null || answer.value === '';
  } else {
    // All other operators require an answer to exist
    if (!answer) {
      conditionMet = false;
    } else {
      const answerValue = answer.value;

      switch (operator) {
        case 'equals':
          conditionMet = answerValue === value;
          break;

        case 'not_equals':
          conditionMet = answerValue !== value;
          break;

        case 'contains':
          if (Array.isArray(answerValue) && typeof value === 'string') {
            conditionMet = answerValue.includes(value);
          } else if (Array.isArray(value) && typeof answerValue === 'string') {
            conditionMet = value.includes(answerValue);
          } else if (Array.isArray(answerValue) && Array.isArray(value)) {
            conditionMet = value.some((v) => answerValue.includes(v));
          } else {
            conditionMet = false;
          }
          break;

        case 'not_contains':
          if (Array.isArray(answerValue) && typeof value === 'string') {
            conditionMet = !answerValue.includes(value);
          } else if (Array.isArray(value) && typeof answerValue === 'string') {
            conditionMet = !value.includes(answerValue);
          } else if (Array.isArray(answerValue) && Array.isArray(value)) {
            conditionMet = !value.some((v) => answerValue.includes(v));
          } else {
            conditionMet = true;
          }
          break;

        case 'greater_than':
          if (typeof answerValue === 'number' && typeof value === 'number') {
            conditionMet = answerValue > value;
          } else {
            conditionMet = false;
          }
          break;

        case 'less_than':
          if (typeof answerValue === 'number' && typeof value === 'number') {
            conditionMet = answerValue < value;
          } else {
            conditionMet = false;
          }
          break;

        default:
          conditionMet = false;
      }
    }
  }

  // Apply showWhen logic: if showWhen=true, return conditionMet; if showWhen=false, invert
  return showWhen ? conditionMet : !conditionMet;
}

/**
 * Evaluates all conditional rules for a question (AND logic)
 * Returns true if the question should be shown
 */
export function shouldShowQuestion(
  conditionalRules: ConditionalRule[] | undefined,
  answers: Record<string, QuestionAnswer>
): boolean {
  // No rules = always show
  if (!conditionalRules || conditionalRules.length === 0) {
    return true;
  }

  // ALL rules must evaluate to true (AND logic)
  return conditionalRules.every((rule) => {
    const dependentAnswer = answers[rule.dependsOnQuestionId];
    return evaluateConditionalRule(rule, dependentAnswer);
  });
}

/**
 * Example usage in Step 2:
 *
 * const visibleQuestions = questions.filter(q =>
 *   shouldShowQuestion(q.conditionalRules, answers)
 * );
 */
