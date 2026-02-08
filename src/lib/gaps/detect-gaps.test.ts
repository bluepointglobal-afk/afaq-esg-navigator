import { describe, it, expect } from 'vitest';
import { determineSeverity, generateRationale, generateRequiredAction } from './detect-gaps';
import type { Question, QuestionAnswer } from '@/types/compliance';

describe('Gap Detection Module', () => {
  describe('determineSeverity', () => {
    const createQuestion = (weight: number, criticality?: 'critical' | 'normal'): Question => ({
      id: 'q1',
      pillar: 'governance',
      code: 'TEST-001',
      text: 'Test question',
      type: 'boolean',
      required: true,
      weight,
      applicableJurisdictions: ['UAE'],
      applicableListingStatuses: ['listed'],
      materialityTags: [],
      criticality,
    });

    it('should return null for good scores (>= 70)', () => {
      const question = createQuestion(5);
      const answer: QuestionAnswer = {
        questionId: 'q1',
        value: true,
        answeredAt: '',
        answeredBy: '',
      };

      expect(determineSeverity(question, answer, 70)).toBe(null);
      expect(determineSeverity(question, answer, 80)).toBe(null);
      expect(determineSeverity(question, answer, 100)).toBe(null);
    });

    it('should return critical for critical questions with low scores', () => {
      const question = createQuestion(5, 'critical');
      const answer: QuestionAnswer = {
        questionId: 'q1',
        value: false,
        answeredAt: '',
        answeredBy: '',
      };

      expect(determineSeverity(question, answer, 30)).toBe('critical');
      expect(determineSeverity(question, answer, 0)).toBe('critical');
    });

    it('should return critical for high-weight questions with score 0', () => {
      const question = createQuestion(8);

      expect(determineSeverity(question, undefined, 0)).toBe('critical');
    });

    it('should return high for weight >= 6 and score < 30', () => {
      const question = createQuestion(6);
      const answer: QuestionAnswer = {
        questionId: 'q1',
        value: false,
        answeredAt: '',
        answeredBy: '',
      };

      expect(determineSeverity(question, answer, 20)).toBe('high');
      expect(determineSeverity(question, answer, 29)).toBe('high');
    });

    it('should return medium for weight >= 4 and score < 50', () => {
      const question = createQuestion(4);
      const answer: QuestionAnswer = {
        questionId: 'q1',
        value: 'partial',
        answeredAt: '',
        answeredBy: '',
      };

      expect(determineSeverity(question, answer, 40)).toBe('medium');
      expect(determineSeverity(question, answer, 49)).toBe('medium');
    });

    it('should return low for score < 70', () => {
      const question = createQuestion(3);
      const answer: QuestionAnswer = {
        questionId: 'q1',
        value: 'partial',
        answeredAt: '',
        answeredBy: '',
      };

      expect(determineSeverity(question, answer, 50)).toBe('low');
      expect(determineSeverity(question, answer, 69)).toBe('low');
    });
  });

  describe('generateRationale', () => {
    it('should generate rationale for unanswered question', () => {
      const question: Question = {
        id: 'q1',
        pillar: 'governance',
        code: 'TEST-001',
        text: 'Test question text',
        type: 'boolean',
        required: true,
        weight: 5,
        applicableJurisdictions: ['UAE'],
        applicableListingStatuses: ['listed'],
        materialityTags: [],
      };

      const rationale = generateRationale(question, undefined, 0);
      expect(rationale).toContain('not answered');
      expect(rationale).toContain('Test question text');
    });

    it('should generate rationale for boolean false', () => {
      const question: Question = {
        id: 'q1',
        pillar: 'governance',
        code: 'TEST-001',
        text: 'Test question',
        type: 'boolean',
        required: true,
        weight: 5,
        applicableJurisdictions: ['UAE'],
        applicableListingStatuses: ['listed'],
        materialityTags: [],
      };

      const answer: QuestionAnswer = {
        questionId: 'q1',
        value: false,
        answeredAt: '',
        answeredBy: '',
      };

      const rationale = generateRationale(question, answer, 0);
      expect(rationale).toContain('non-compliance');
    });

    it('should generate rationale for low scores', () => {
      const question: Question = {
        id: 'q1',
        pillar: 'governance',
        code: 'TEST-001',
        text: 'Test question',
        type: 'percentage',
        required: true,
        weight: 5,
        applicableJurisdictions: ['UAE'],
        applicableListingStatuses: ['listed'],
        materialityTags: [],
      };

      const answer: QuestionAnswer = {
        questionId: 'q1',
        value: 20,
        answeredAt: '',
        answeredBy: '',
      };

      const rationale = generateRationale(question, answer, 20);
      expect(rationale).toContain('20%');
    });
  });

  describe('generateRequiredAction', () => {
    it('should generate action for unanswered question', () => {
      const question: Question = {
        id: 'q1',
        pillar: 'governance',
        code: 'GOV-001',
        text: 'Test question',
        type: 'boolean',
        required: true,
        weight: 5,
        applicableJurisdictions: ['UAE'],
        applicableListingStatuses: ['listed'],
        materialityTags: [],
      };

      const action = generateRequiredAction(question, undefined, 0);
      expect(action).toContain('GOV-001');
      expect(action).toContain('Provide answer');
    });

    it('should generate action for boolean false', () => {
      const question: Question = {
        id: 'q1',
        pillar: 'governance',
        code: 'GOV-001',
        text: 'Test question',
        type: 'boolean',
        required: true,
        weight: 5,
        applicableJurisdictions: ['UAE'],
        applicableListingStatuses: ['listed'],
        materialityTags: [],
      };

      const answer: QuestionAnswer = {
        questionId: 'q1',
        value: false,
        answeredAt: '',
        answeredBy: '',
      };

      const action = generateRequiredAction(question, answer, 0);
      expect(action).toContain('Implement');
      expect(action).toContain('GOV-001');
    });

    it('should generate action for low number score', () => {
      const question: Question = {
        id: 'q1',
        pillar: 'governance',
        code: 'GOV-002',
        text: 'Test question',
        type: 'number',
        required: true,
        weight: 5,
        applicableJurisdictions: ['UAE'],
        applicableListingStatuses: ['listed'],
        materialityTags: [],
      };

      const answer: QuestionAnswer = {
        questionId: 'q1',
        value: 1,
        answeredAt: '',
        answeredBy: '',
      };

      const action = generateRequiredAction(question, answer, 30);
      expect(action).toContain('Increase');
      expect(action).toContain('GOV-002');
    });
  });
});
