// Disclosure Template Types
// Defines structure for jurisdiction-specific disclosure templates

import type { Jurisdiction, ListingStatus, QuestionPillar } from '@/types/compliance';

/**
 * Template for a single disclosure section (pillar-based)
 */
export interface DisclosureTemplateSection {
  id: string; // e.g., 'governance'
  pillar: QuestionPillar;
  title: string;
  titleArabic: string;
  order: number;

  // AI prompts for narrative generation
  systemPrompt: string; // Role, guardrails, style
  userPromptTemplate: string; // What to write, data placeholders (English)
  userPromptTemplateArabic: string; // Arabic equivalent

  // Expected output structure
  expectedDataPoints: string[]; // e.g., ['Board composition', 'Meeting frequency']
  citationPlaceholders: string[]; // e.g., ['UAE_CORP_GOV_CODE', 'ADX_LISTING_RULES']
}

/**
 * Disclaimer template (legal, methodology, informational)
 */
export interface DisclaimerTemplate {
  type: 'legal' | 'informational' | 'methodology';
  text: string;
  textArabic: string;
  order: number;
}

/**
 * Complete disclosure template for jurisdiction + listing status
 */
export interface DisclosureTemplate {
  id: string; // e.g., 'UAE_LISTED_V1'
  version: string; // Semantic version
  jurisdiction: Jurisdiction;
  listingStatus: ListingStatus;

  // Sections (one per pillar)
  sections: DisclosureTemplateSection[];

  // Standard disclaimers
  disclaimers: DisclaimerTemplate[];

  // Metadata
  createdAt: string;
  updatedAt: string;
}

/**
 * Template registry - maps jurisdiction + listing status to template
 */
export interface TemplateRegistry {
  [key: string]: DisclosureTemplate; // key format: 'UAE_listed', 'KSA_non-listed', etc.
}
