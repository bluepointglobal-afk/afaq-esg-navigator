/**
 * Template Selection Logic
 * Selects the appropriate disclosure template based on CompanyProfile
 */

import { getTemplate, getTemplateKey } from '@/templates/disclosure';
import type { DisclosureTemplate } from '@/templates/disclosure';
import type { CompanyProfile } from '@/types/compliance';

/**
 * Select disclosure template based on company profile
 *
 * Uses jurisdiction and listing status to determine the appropriate template variant.
 *
 * @param profile - Company profile with jurisdiction and listing status
 * @returns Disclosure template
 * @throws Error if no template found for jurisdiction + listing combination
 */
export function selectTemplate(profile: CompanyProfile): DisclosureTemplate {
  const { jurisdiction, listingStatus } = profile;

  const template = getTemplate(jurisdiction, listingStatus);

  if (!template) {
    throw new Error(
      `No disclosure template found for ${jurisdiction} ${listingStatus} companies. ` +
        `Template key: ${getTemplateKey(jurisdiction, listingStatus)}`
    );
  }

  return template;
}

/**
 * Get template ID for a company profile (without loading full template)
 *
 * @param profile - Company profile
 * @returns Template ID string
 */
export function getTemplateId(profile: CompanyProfile): string {
  const template = selectTemplate(profile);
  return template.id;
}

/**
 * Validate that a template exists for given jurisdiction and listing status
 *
 * @param profile - Company profile
 * @returns True if template exists, false otherwise
 */
export function hasTemplate(profile: CompanyProfile): boolean {
  try {
    selectTemplate(profile);
    return true;
  } catch {
    return false;
  }
}
