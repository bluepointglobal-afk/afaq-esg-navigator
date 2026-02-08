// Disclosure Template Registry
// Central registry for all jurisdiction × listing status templates

import { UAE_LISTED_TEMPLATE } from './uae/listed';
import { UAE_NON_LISTED_TEMPLATE } from './uae/non-listed';
import { KSA_LISTED_TEMPLATE } from './ksa/listed';
import { KSA_NON_LISTED_TEMPLATE } from './ksa/non-listed';
import { QATAR_LISTED_TEMPLATE } from './qatar/listed';
import { QATAR_NON_LISTED_TEMPLATE } from './qatar/non-listed';
import type { DisclosureTemplate, TemplateRegistry } from './types';
import type { Jurisdiction, ListingStatus } from '@/types/compliance';

/**
 * Template registry mapping jurisdiction + listing status to templates
 */
export const TEMPLATE_REGISTRY: TemplateRegistry = {
  'UAE_listed': UAE_LISTED_TEMPLATE,
  'UAE_non-listed': UAE_NON_LISTED_TEMPLATE,
  'KSA_listed': KSA_LISTED_TEMPLATE,
  'KSA_non-listed': KSA_NON_LISTED_TEMPLATE,
  'Qatar_listed': QATAR_LISTED_TEMPLATE,
  'Qatar_non-listed': QATAR_NON_LISTED_TEMPLATE,
};

/**
 * Generate template key from jurisdiction and listing status
 */
export function getTemplateKey(jurisdiction: Jurisdiction, listingStatus: ListingStatus): string {
  return `${jurisdiction}_${listingStatus}`;
}

/**
 * Get disclosure template for given jurisdiction and listing status
 *
 * @param jurisdiction - Company jurisdiction (UAE, KSA, Qatar)
 * @param listingStatus - Listing status (listed, non-listed)
 * @returns Disclosure template or null if not found
 */
export function getTemplate(
  jurisdiction: Jurisdiction,
  listingStatus: ListingStatus
): DisclosureTemplate | null {
  const key = getTemplateKey(jurisdiction, listingStatus);
  return TEMPLATE_REGISTRY[key] || null;
}

/**
 * Get all available templates
 */
export function getAllTemplates(): DisclosureTemplate[] {
  return Object.values(TEMPLATE_REGISTRY);
}

/**
 * Get all template IDs
 */
export function getAllTemplateIds(): string[] {
  return getAllTemplates().map((t) => t.id);
}

// Re-export types
export type { DisclosureTemplate, DisclosureTemplateSection, DisclaimerTemplate } from './types';
