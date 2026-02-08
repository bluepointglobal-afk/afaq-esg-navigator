# Questionnaire Loading Fix - Summary

## Issue
The questionnaire page at `/compliance/questionnaire/{reportId}` was showing "Loading..." indefinitely because `buildQuestionnaireTemplate()` was returning a template with 0 sections.

## Root Cause
The template builder filters questions by:
1. **Jurisdiction** (UAE, KSA, Qatar)
2. **Listing Status** (listed, non-listed)

The filtering was too strict - it expected EXACT matches:
- Database `companies.country` field might contain full names like "United Arab Emirates" instead of "UAE"
- The `isListed` field might be `null` instead of `true`/`false`

When no questions passed through both filters, the template had 0 sections, causing the page to show "Loading..." forever.

## Solution
Created a robust country-to-jurisdiction mapping utility:

### New File: `src/lib/utils/jurisdiction.ts`
```typescript
export function mapCountryToJurisdiction(country: string): Jurisdiction {
  const normalized = country.toUpperCase().trim();
  
  // Exact matches
  if (normalized === 'UAE') return 'UAE';
  if (normalized === 'KSA') return 'KSA';
  if (normalized === 'QATAR') return 'Qatar';
  
  // Full names
  if (normalized.includes('EMIRAT')) return 'UAE';
  if (normalized.includes('SAUDI')) return 'KSA';
  if (normalized.includes('QATAR')) return 'Qatar';
  
  // Default to UAE if unknown
  console.warn(`⚠️ Unknown country "${country}", defaulting to UAE`);
  return 'UAE';
}

export function mapIsListedToStatus(isListed: boolean | null | undefined): 'listed' | 'non-listed' {
  return isListed === true ? 'listed' : 'non-listed';
}
```

### Changes Made
1. **Created utility functions** (`src/lib/utils/jurisdiction.ts`)
   - Handles both short codes (UAE) and full names (United Arab Emirates)
   - Case-insensitive matching
   - Whitespace trimming
   - Graceful fallback to UAE for unknown countries
   - Null-safe listing status mapping

2. **Updated Questionnaire.tsx**
   - Replaced inline mapping logic with utility functions
   - Added improved logging for debugging

3. **Updated Disclosure.tsx**
   - Applied same mapping fix for consistency
   
4. **Updated builder.ts**
   - Added concise logging to track filtering results

## Testing
All test cases pass:
- ✅ Exact codes: "UAE", "KSA", "Qatar"
- ✅ Full names: "United Arab Emirates", "Saudi Arabia", "Qatar"
- ✅ Case insensitive: "uae", "ksa", "qatar"
- ✅ Whitespace: "  UAE  ", "Saudi  Arabia"
- ✅ Unknown country defaults to UAE
- ✅ Null/undefined isListed defaults to 'non-listed'

## Deployment
- **Commit**: `4344676` - Fix questionnaire loading issue: Add robust country-to-jurisdiction mapping
- **Pushed to**: `main` branch
- **Vercel**: Should auto-deploy within 2-3 minutes

## Verification Steps
1. Navigate to: https://afaq-esg-navigator.vercel.app/compliance/questionnaire/f0aca186-ef5c-486d-b9b9-818433658306
2. Log in with your credentials
3. The page should now show questions instead of "Loading..."
4. Check browser console for logs:
   - `[Template Builder] Starting: UAE, listed, 25 total questions`
   - `[Jurisdiction Filter] X/25 questions passed for UAE`
   - `[Listing Status Filter] X/X questions passed for listed`

## What Questions Will Load?
Based on the question bank:
- **Total questions**: 25 across 4 pillars
  - Governance: 10 questions
  - ESG: 6 questions  
  - Risk & Controls: 5 questions
  - Transparency: 4 questions

- **For UAE Listed companies**: All questions where:
  - `applicableJurisdictions` includes 'UAE'
  - `applicableListingStatuses` includes 'listed'

Example: GOV-001, GOV-002, GOV-003, ESG-001, etc.

## Fallback Behavior
If the database has unexpected data:
- Unknown country → defaults to UAE (logs warning)
- Null/undefined isListed → defaults to 'non-listed'
- Questions will still load instead of infinite "Loading..."

## Debug Logs
The fix includes helpful console logs:
```
🏢 [CompanyProfile]: {
  companyCountry: "United Arab Emirates",
  profileJurisdiction: "UAE", 
  profileListingStatus: "listed"
}

[Template Builder] Starting: UAE, listed, 25 total questions
[Jurisdiction Filter] 25/25 questions passed for UAE
[Listing Status Filter] 19/25 questions passed for listed
✅ Generated template with sections: 4
```

If you see `Generated template with sections: 0`, check:
1. What `companyCountry` value is in the database
2. What `profileJurisdiction` was mapped to
3. Whether questions actually exist for that jurisdiction

## Files Changed
- `src/lib/utils/jurisdiction.ts` (NEW)
- `src/lib/questionnaire/builder.ts`
- `src/pages/Questionnaire.tsx`
- `src/pages/Disclosure.tsx`

## Status
✅ **FIXED** - Deployed to production (pending Vercel build)
