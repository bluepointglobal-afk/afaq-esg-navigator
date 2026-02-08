import { describe, it, expect } from 'vitest';
import { scoreQuestion, computePillarScores, computeOverallScore, PILLAR_WEIGHTS } from './compute-scores';
import type { Question, QuestionAnswer, QuestionnaireTemplate, QuestionnaireResponse, CompanyProfile } from '@/types/compliance';

describe('Scoring Module', () => {
  describe('scoreQuestion', () => {
    it('should score boolean true as 100', () => {
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
        materialityTags: ['test'],
      };

      const answer: QuestionAnswer = {
        questionId: 'q1',
        value: true,
        answeredAt: new Date().toISOString(),
        answeredBy: 'user1',
      };

      expect(scoreQuestion(question, answer)).toBe(100);
    });

    it('should score boolean false as 0', () => {
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
        materialityTags: ['test'],
      };

      const answer: QuestionAnswer = {
        questionId: 'q1',
        value: false,
        answeredAt: new Date().toISOString(),
        answeredBy: 'user1',
      };

      expect(scoreQuestion(question, answer)).toBe(0);
    });

    it('should score unanswered question as 0', () => {
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
        materialityTags: ['test'],
      };

      expect(scoreQuestion(question, undefined)).toBe(0);
    });

    it('should score percentage question directly', () => {
      const question: Question = {
        id: 'q1',
        pillar: 'governance',
        code: 'TEST-002',
        text: 'Percentage question',
        type: 'percentage',
        required: true,
        weight: 5,
        applicableJurisdictions: ['UAE'],
        applicableListingStatuses: ['listed'],
        materialityTags: ['test'],
      };

      const answer: QuestionAnswer = {
        questionId: 'q1',
        value: 75,
        answeredAt: new Date().toISOString(),
        answeredBy: 'user1',
      };

      expect(scoreQuestion(question, answer)).toBe(75);
    });

    it('should score text question based on presence', () => {
      const question: Question = {
        id: 'q1',
        pillar: 'governance',
        code: 'TEST-003',
        text: 'Text question',
        type: 'text',
        required: true,
        weight: 5,
        applicableJurisdictions: ['UAE'],
        applicableListingStatuses: ['listed'],
        materialityTags: ['test'],
      };

      const answer: QuestionAnswer = {
        questionId: 'q1',
        value: 'Some disclosure text',
        answeredAt: new Date().toISOString(),
        answeredBy: 'user1',
      };

      expect(scoreQuestion(question, answer)).toBe(100);
    });

    it('should score empty text as 0', () => {
      const question: Question = {
        id: 'q1',
        pillar: 'governance',
        code: 'TEST-003',
        text: 'Text question',
        type: 'text',
        required: true,
        weight: 5,
        applicableJurisdictions: ['UAE'],
        applicableListingStatuses: ['listed'],
        materialityTags: ['test'],
      };

      const answer: QuestionAnswer = {
        questionId: 'q1',
        value: '   ',
        answeredAt: new Date().toISOString(),
        answeredBy: 'user1',
      };

      expect(scoreQuestion(question, answer)).toBe(0);
    });

    it('should score number question with scoring rules', () => {
      const question: Question = {
        id: 'q1',
        pillar: 'governance',
        code: 'TEST-004',
        text: 'Number question',
        type: 'number',
        required: true,
        weight: 7,
        applicableJurisdictions: ['UAE'],
        applicableListingStatuses: ['listed'],
        materialityTags: ['test'],
        scoringRules: {
          min: 0,
          target: 3,
          max: 10,
        },
      };

      // Value at target = 100
      expect(scoreQuestion(question, { questionId: 'q1', value: 3, answeredAt: '', answeredBy: '' })).toBe(100);

      // Value at midpoint (1.5) = 50
      expect(scoreQuestion(question, { questionId: 'q1', value: 1.5, answeredAt: '', answeredBy: '' })).toBe(50);

      // Value below min = 0
      expect(scoreQuestion(question, { questionId: 'q1', value: -1, answeredAt: '', answeredBy: '' })).toBe(0);

      // Value above target = 100
      expect(scoreQuestion(question, { questionId: 'q1', value: 10, answeredAt: '', answeredBy: '' })).toBe(100);
    });
  });

  describe('computePillarScores', () => {
    it('should compute weighted pillar scores correctly', () => {
      const template: QuestionnaireTemplate = {
        id: 'template1',
        version: '1.0.0',
        jurisdiction: 'UAE',
        sections: [
          {
            id: 'sec1',
            pillar: 'governance',
            title: 'Governance',
            description: 'Test',
            order: 1,
            questions: [
              {
                id: 'q1',
                pillar: 'governance',
                code: 'GOV-001',
                text: 'Q1',
                type: 'boolean',
                required: true,
                weight: 10,
                applicableJurisdictions: ['UAE'],
                applicableListingStatuses: ['listed'],
                materialityTags: [],
              },
              {
                id: 'q2',
                pillar: 'governance',
                code: 'GOV-002',
                text: 'Q2',
                type: 'boolean',
                required: true,
                weight: 5,
                applicableJurisdictions: ['UAE'],
                applicableListingStatuses: ['listed'],
                materialityTags: [],
              },
            ],
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response: QuestionnaireResponse = {
        id: 'resp1',
        reportId: 'report1',
        templateId: 'template1',
        templateVersion: '1.0.0',
        answers: {
          q1: { questionId: 'q1', value: true, answeredAt: '', answeredBy: '' }, // 100 * 10 = 1000
          q2: { questionId: 'q2', value: false, answeredAt: '', answeredBy: '' }, // 0 * 5 = 0
        },
        completedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const companyProfile: CompanyProfile = {
        companyId: 'c1',
        companyName: 'Test Co',
        companyNameArabic: null,
        jurisdiction: 'UAE',
        listingStatus: 'listed',
        stockExchange: 'ADX',
        sector: 'Tech',
        subsector: null,
        employeeCountBand: '11-50',
        annualRevenueBand: '1M-10M',
        revenueCurrency: 'AED',
        operationalYears: 5,
        hasInternationalOps: false,
        hasCriticalInfrastructure: false,
        hasFullTimeEmployees: true,
        hasContractors: false,
        hasRemoteWorkforce: false,
        fiscalYearEnd: 12,
        reportingYear: 2024,
      };

      const pillarScores = computePillarScores(template, response, companyProfile);

      // Governance: (100*10 + 0*5) / (10+5) = 1000/15 = 66.67 ~= 67
      const govScore = pillarScores.find((p) => p.pillar === 'governance');
      expect(govScore?.score).toBe(67);
      expect(govScore?.completedQuestions).toBe(2);
      expect(govScore?.totalQuestions).toBe(2);
    });
  });

  describe('computeOverallScore', () => {
    it('should compute overall score using pillar weights', () => {
      const pillarScores = [
        {
          pillar: 'governance' as const,
          score: 80,
          weight: PILLAR_WEIGHTS.governance,
          maxPossibleScore: 100,
          completedQuestions: 5,
          totalQuestions: 5,
        },
        {
          pillar: 'esg' as const,
          score: 60,
          weight: PILLAR_WEIGHTS.esg,
          maxPossibleScore: 100,
          completedQuestions: 3,
          totalQuestions: 5,
        },
        {
          pillar: 'risk_controls' as const,
          score: 70,
          weight: PILLAR_WEIGHTS.risk_controls,
          maxPossibleScore: 100,
          completedQuestions: 4,
          totalQuestions: 5,
        },
        {
          pillar: 'transparency' as const,
          score: 50,
          weight: PILLAR_WEIGHTS.transparency,
          maxPossibleScore: 100,
          completedQuestions: 2,
          totalQuestions: 5,
        },
      ];

      const overall = computeOverallScore(pillarScores);

      // (80*30 + 60*25 + 70*25 + 50*20) / 100 = (2400 + 1500 + 1750 + 1000) / 100 = 6650/100 = 66.5 ~= 67
      expect(overall).toBe(67);
    });
  });
});
