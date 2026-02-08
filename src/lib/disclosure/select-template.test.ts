/**
 * Tests for template selection logic
 */

import { describe, it, expect } from 'vitest';
import { selectTemplate, getTemplateId, hasTemplate } from './select-template';
import type { CompanyProfile } from '@/types/compliance';

describe('Template Selection', () => {
  const baseProfile: CompanyProfile = {
    companyId: 'test-123',
    companyName: 'Test Company',
    companyNameArabic: null,
    sector: 'Technology',
    subsector: null,
    employeeCountBand: '51-250',
    annualRevenueBand: '10M-50M',
    revenueCurrency: 'AED',
    operationalYears: 5,
    hasInternationalOps: false,
    hasCriticalInfrastructure: false,
    hasFullTimeEmployees: true,
    hasContractors: false,
    hasRemoteWorkforce: false,
    fiscalYearEnd: 12,
    reportingYear: 2024,
    stockExchange: null,
  };

  describe('UAE Listed Companies', () => {
    it('should select UAE_LISTED_V1 template', () => {
      const profile: CompanyProfile = {
        ...baseProfile,
        jurisdiction: 'UAE',
        listingStatus: 'listed',
        stockExchange: 'ADX',
      };

      const template = selectTemplate(profile);
      expect(template.id).toBe('UAE_LISTED_V1');
      expect(template.jurisdiction).toBe('UAE');
      expect(template.listingStatus).toBe('listed');
    });

    it('should have 4 sections (pillars)', () => {
      const profile: CompanyProfile = {
        ...baseProfile,
        jurisdiction: 'UAE',
        listingStatus: 'listed',
        stockExchange: 'ADX',
      };

      const template = selectTemplate(profile);
      expect(template.sections).toHaveLength(4);
      expect(template.sections.map((s) => s.pillar)).toEqual([
        'governance',
        'esg',
        'risk_controls',
        'transparency',
      ]);
    });
  });

  describe('UAE Non-Listed Companies', () => {
    it('should select UAE_NON_LISTED_V1 template', () => {
      const profile: CompanyProfile = {
        ...baseProfile,
        jurisdiction: 'UAE',
        listingStatus: 'non-listed',
      };

      const template = selectTemplate(profile);
      expect(template.id).toBe('UAE_NON_LISTED_V1');
      expect(template.jurisdiction).toBe('UAE');
      expect(template.listingStatus).toBe('non-listed');
    });
  });

  describe('KSA Listed Companies', () => {
    it('should select KSA_LISTED_V1 template', () => {
      const profile: CompanyProfile = {
        ...baseProfile,
        jurisdiction: 'KSA',
        listingStatus: 'listed',
        stockExchange: 'Tadawul',
      };

      const template = selectTemplate(profile);
      expect(template.id).toBe('KSA_LISTED_V1');
      expect(template.jurisdiction).toBe('KSA');
      expect(template.listingStatus).toBe('listed');
    });
  });

  describe('KSA Non-Listed Companies', () => {
    it('should select KSA_NON_LISTED_V1 template', () => {
      const profile: CompanyProfile = {
        ...baseProfile,
        jurisdiction: 'KSA',
        listingStatus: 'non-listed',
      };

      const template = selectTemplate(profile);
      expect(template.id).toBe('KSA_NON_LISTED_V1');
    });
  });

  describe('Qatar Listed Companies', () => {
    it('should select QATAR_LISTED_V1 template', () => {
      const profile: CompanyProfile = {
        ...baseProfile,
        jurisdiction: 'Qatar',
        listingStatus: 'listed',
        stockExchange: 'QSE',
      };

      const template = selectTemplate(profile);
      expect(template.id).toBe('QATAR_LISTED_V1');
      expect(template.jurisdiction).toBe('Qatar');
      expect(template.listingStatus).toBe('listed');
    });
  });

  describe('Qatar Non-Listed Companies', () => {
    it('should select QATAR_NON_LISTED_V1 template', () => {
      const profile: CompanyProfile = {
        ...baseProfile,
        jurisdiction: 'Qatar',
        listingStatus: 'non-listed',
      };

      const template = selectTemplate(profile);
      expect(template.id).toBe('QATAR_NON_LISTED_V1');
    });
  });

  describe('getTemplateId', () => {
    it('should return template ID without loading full template', () => {
      const profile: CompanyProfile = {
        ...baseProfile,
        jurisdiction: 'UAE',
        listingStatus: 'listed',
        stockExchange: 'ADX',
      };

      const templateId = getTemplateId(profile);
      expect(templateId).toBe('UAE_LISTED_V1');
    });
  });

  describe('hasTemplate', () => {
    it('should return true for valid jurisdiction + listing combinations', () => {
      const profile: CompanyProfile = {
        ...baseProfile,
        jurisdiction: 'UAE',
        listingStatus: 'listed',
        stockExchange: 'ADX',
      };

      expect(hasTemplate(profile)).toBe(true);
    });
  });

  describe('Template Structure Validation', () => {
    it('should have system prompts with guardrails for all sections', () => {
      const profile: CompanyProfile = {
        ...baseProfile,
        jurisdiction: 'UAE',
        listingStatus: 'listed',
        stockExchange: 'ADX',
      };

      const template = selectTemplate(profile);

      template.sections.forEach((section) => {
        // Check for guardrails (some templates have abbreviated forms)
        const prompt = section.systemPrompt.toLowerCase();
        expect(
          prompt.includes('no legal advice') || prompt.includes('not legal advice')
        ).toBe(true);
        expect(
          prompt.includes('hedged language') || prompt.includes('hedged')
        ).toBe(true);
        expect(
          prompt.includes('citation placeholder') || prompt.includes('source_required')
        ).toBe(true);
      });
    });

    it('should have bilingual prompts for all sections', () => {
      const profile: CompanyProfile = {
        ...baseProfile,
        jurisdiction: 'UAE',
        listingStatus: 'listed',
        stockExchange: 'ADX',
      };

      const template = selectTemplate(profile);

      template.sections.forEach((section) => {
        expect(section.userPromptTemplate).toBeTruthy();
        expect(section.userPromptTemplateArabic).toBeTruthy();
        expect(section.title).toBeTruthy();
        expect(section.titleArabic).toBeTruthy();
      });
    });

    it('should have disclaimers in all templates', () => {
      const profile: CompanyProfile = {
        ...baseProfile,
        jurisdiction: 'UAE',
        listingStatus: 'listed',
        stockExchange: 'ADX',
      };

      const template = selectTemplate(profile);

      expect(template.disclaimers.length).toBeGreaterThan(0);

      const legalDisclaimer = template.disclaimers.find((d) => d.type === 'legal');
      expect(legalDisclaimer).toBeTruthy();
      expect(legalDisclaimer?.text).toContain('not constitute legal');
      expect(legalDisclaimer?.textArabic).toBeTruthy();
    });
  });
});
