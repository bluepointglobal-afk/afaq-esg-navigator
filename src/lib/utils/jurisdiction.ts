// Jurisdiction Mapping Utilities
// Maps database country values to Jurisdiction types

import type { Jurisdiction } from '@/types/compliance';

/**
 * Maps a country string from the database to a Jurisdiction code
 * Handles both short codes (UAE, KSA, Qatar) and full names
 */
export function mapCountryToJurisdiction(country: string): Jurisdiction {
  const normalized = (country || '').toUpperCase().trim();
  
  // Handle exact matches first
  if (normalized === 'UAE') return 'UAE';
  if (normalized === 'KSA') return 'KSA';
  if (normalized === 'QATAR') return 'Qatar';
  
  // Handle full country names
  if (normalized.includes('EMIRAT')) return 'UAE';
  if (normalized.includes('SAUDI')) return 'KSA';
  if (normalized.includes('QATAR')) return 'Qatar';
  
  // Default to UAE if unknown
  console.warn(`⚠️ Unknown country "${country}", defaulting to UAE`);
  return 'UAE';
}

/**
 * Maps a boolean isListed flag to ListingStatus
 * Handles null/undefined as 'non-listed'
 */
export function mapIsListedToStatus(isListed: boolean | null | undefined): 'listed' | 'non-listed' {
  return isListed === true ? 'listed' : 'non-listed';
}
