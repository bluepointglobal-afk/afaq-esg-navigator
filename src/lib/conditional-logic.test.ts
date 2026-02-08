import { describe, it, expect } from 'vitest';
import { shouldShowQuestion, evaluateConditionalRule } from './conditional-logic';
import type { ConditionalRule, QuestionAnswer } from '@/types/compliance';

describe('Conditional Logic', () => {
  describe('evaluateConditionalRule', () => {
    it('should return true for equals operator with matching value', () => {
      const rule: ConditionalRule = {
        dependsOnQuestionId: 'GOV-001',
        operator: 'equals',
        value: true,
        showWhen: true,
      };

      const answer: QuestionAnswer = {
        questionId: 'GOV-001',
        value: true,
        answeredAt: new Date().toISOString(),
        answeredBy: 'user-1',
      };

      expect(evaluateConditionalRule(rule, answer)).toBe(true);
    });

    it('should return false for equals operator with non-matching value', () => {
      const rule: ConditionalRule = {
        dependsOnQuestionId: 'GOV-001',
        operator: 'equals',
        value: true,
        showWhen: true,
      };

      const answer: QuestionAnswer = {
        questionId: 'GOV-001',
        value: false,
        answeredAt: new Date().toISOString(),
        answeredBy: 'user-1',
      };

      expect(evaluateConditionalRule(rule, answer)).toBe(false);
    });

    it('should return true for is_answered when answer exists', () => {
      const rule: ConditionalRule = {
        dependsOnQuestionId: 'GOV-001',
        operator: 'is_answered',
        showWhen: true,
      };

      const answer: QuestionAnswer = {
        questionId: 'GOV-001',
        value: 'any value',
        answeredAt: new Date().toISOString(),
        answeredBy: 'user-1',
      };

      expect(evaluateConditionalRule(rule, answer)).toBe(true);
    });

    it('should return false for is_answered when answer is undefined', () => {
      const rule: ConditionalRule = {
        dependsOnQuestionId: 'GOV-001',
        operator: 'is_answered',
        showWhen: true,
      };

      expect(evaluateConditionalRule(rule, undefined)).toBe(false);
    });

    it('should handle greater_than operator with numbers', () => {
      const rule: ConditionalRule = {
        dependsOnQuestionId: 'GOV-002',
        operator: 'greater_than',
        value: 5,
        showWhen: true,
      };

      const answer: QuestionAnswer = {
        questionId: 'GOV-002',
        value: 10,
        answeredAt: new Date().toISOString(),
        answeredBy: 'user-1',
      };

      expect(evaluateConditionalRule(rule, answer)).toBe(true);
    });

    it('should handle contains operator with arrays', () => {
      const rule: ConditionalRule = {
        dependsOnQuestionId: 'ENV-003',
        operator: 'contains',
        value: 'solar',
        showWhen: true,
      };

      const answer: QuestionAnswer = {
        questionId: 'ENV-003',
        value: ['solar', 'wind', 'hydro'],
        answeredAt: new Date().toISOString(),
        answeredBy: 'user-1',
      };

      expect(evaluateConditionalRule(rule, answer)).toBe(true);
    });
  });

  describe('shouldShowQuestion', () => {
    it('should return true when no conditional rules', () => {
      expect(shouldShowQuestion(undefined, {})).toBe(true);
      expect(shouldShowQuestion([], {})).toBe(true);
    });

    it('should return true when all rules pass (AND logic)', () => {
      const rules: ConditionalRule[] = [
        {
          dependsOnQuestionId: 'GOV-001',
          operator: 'equals',
          value: true,
          showWhen: true,
        },
        {
          dependsOnQuestionId: 'GOV-002',
          operator: 'greater_than',
          value: 3,
          showWhen: true,
        },
      ];

      const answers: Record<string, QuestionAnswer> = {
        'GOV-001': {
          questionId: 'GOV-001',
          value: true,
          answeredAt: new Date().toISOString(),
          answeredBy: 'user-1',
        },
        'GOV-002': {
          questionId: 'GOV-002',
          value: 5,
          answeredAt: new Date().toISOString(),
          answeredBy: 'user-1',
        },
      };

      expect(shouldShowQuestion(rules, answers)).toBe(true);
    });

    it('should return false when any rule fails (AND logic)', () => {
      const rules: ConditionalRule[] = [
        {
          dependsOnQuestionId: 'GOV-001',
          operator: 'equals',
          value: true,
          showWhen: true,
        },
        {
          dependsOnQuestionId: 'GOV-002',
          operator: 'greater_than',
          value: 10,
          showWhen: true,
        },
      ];

      const answers: Record<string, QuestionAnswer> = {
        'GOV-001': {
          questionId: 'GOV-001',
          value: true,
          answeredAt: new Date().toISOString(),
          answeredBy: 'user-1',
        },
        'GOV-002': {
          questionId: 'GOV-002',
          value: 5,
          answeredAt: new Date().toISOString(),
          answeredBy: 'user-1',
        },
      };

      expect(shouldShowQuestion(rules, answers)).toBe(false);
    });

    it('should hide question when dependent answer not provided', () => {
      const rules: ConditionalRule[] = [
        {
          dependsOnQuestionId: 'GOV-001',
          operator: 'equals',
          value: true,
          showWhen: true,
        },
      ];

      expect(shouldShowQuestion(rules, {})).toBe(false);
    });
  });
});
