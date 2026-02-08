# 02_RISKS.md — AFAQ ESG Platform

> **Document Type**: BMAD Freeze Specification  
> **Version**: 1.0  
> **Generated**: 2026-01-04  
> **Status**: CANONICAL — Do not modify without governance approval

---

## 1. PURPOSE

This document identifies concrete technical risks in the AFAQ system that may cause regression, data integrity issues, or security vulnerabilities during execution.

Each risk is labeled with:
- **Likelihood**: Low / Medium / High
- **Impact**: Low / Medium / High

---

## 2. SECURITY RISKS

### 2.1 Missing Route Protection

| Field | Value |
|-------|-------|
| **Location** | `/src/App.tsx` lines 32-40 |
| **Description** | Protected routes (`/dashboard`, `/onboarding`, `/settings`, `/compliance/*`) have no authentication guards. Any unauthenticated user can navigate directly to these URLs. |
| **Evidence** | Comment in code: `"Protected routes (will add auth check later)"` |
| **Likelihood** | **High** |
| **Impact** | **High** |

**Observed Behavior**: Navigation to `/dashboard` without authentication succeeds. Supabase queries will fail at the API level, but UI renders without protection.

---

### 2.2 Permissive RLS Policies

| Field | Value |
|-------|-------|
| **Location** | `/supabase/migrations/20250118000001_create_base_tables.sql` |
| **Description** | Most tables use `USING (true)` RLS policies for authenticated users. This allows any authenticated user to read/write any row in: `companies`, `reports`, `questionnaire_responses`, `assessment_results`, `disclosure_outputs`. |
| **Likelihood** | **High** |
| **Impact** | **High** |

**Affected Tables**:
- `companies` — Any authenticated user can modify any company
- `reports` — Any authenticated user can access any report
- `questionnaire_responses` — No ownership check
- `assessment_results` — No ownership check
- `disclosure_outputs` — No ownership check

**Exception**: `user_profiles` correctly enforces `id = auth.uid()`.

---

### 2.3 Freemium Boundary Not Enforced Server-Side

| Field | Value |
|-------|-------|
| **Location** | Edge function `generate_disclosure` + RLS policies |
| **Description** | ARCHITECTURE.md documents a planned RLS policy to restrict `disclosure_outputs` to paid tiers, but the actual migration uses permissive `USING (true)`. Freemium enforcement may rely solely on client-side checks. |
| **Likelihood** | **Medium** |
| **Impact** | **High** |

**Ambiguity**: Edge function tier verification is documented but code inspection scope did not include full verification of enforcement logic.

---

### 2.4 CORS Wildcard on Edge Function

| Field | Value |
|-------|-------|
| **Location** | `/supabase/functions/generate_disclosure/index.ts` line 10 |
| **Description** | CORS header `'Access-Control-Allow-Origin': '*'` allows any origin to call the disclosure generation endpoint. |
| **Likelihood** | **Low** (requires valid Supabase JWT) |
| **Impact** | **Low** |

---

### 2.5 Anon Access Migration Exists

| Field | Value |
|-------|-------|
| **Location** | `/supabase/migrations/20250123000001_allow_anon_for_testing.sql` |
| **Description** | A migration exists that enables anonymous access "for testing". If this migration is active in production, it bypasses authentication requirements. |
| **Likelihood** | **Medium** |
| **Impact** | **High** |

**Status Unknown**: Cannot verify if migration is applied in production.

---

## 3. DATA INTEGRITY RISKS

### 3.1 No Foreign Key Enforcement on Company Ownership

| Field | Value |
|-------|-------|
| **Location** | Database schema |
| **Description** | `reports.company_id` has FK to `companies`, but there is no RLS check ensuring the user belongs to that company. Users can create reports for arbitrary companies. |
| **Likelihood** | **High** |
| **Impact** | **Medium** |

---

### 3.2 Questionnaire Response Orphaning

| Field | Value |
|-------|-------|
| **Location** | `/supabase/migrations/20250118000001_create_base_tables.sql` line 131 |
| **Description** | `questionnaire_responses.template_id` uses `ON DELETE RESTRICT`. If a template is modified or needs deletion, existing responses block the operation. |
| **Likelihood** | **Low** |
| **Impact** | **Low** |

---

### 3.3 No Uniqueness on Report Per Company/Year

| Field | Value |
|-------|-------|
| **Location** | `reports` table |
| **Description** | No unique constraint on `(company_id, reporting_year)`. Multiple draft reports for the same year can be created, leading to potential confusion. |
| **Likelihood** | **Medium** |
| **Impact** | **Low** |

---

## 4. COUPLING RISKS

### 4.1 Embedded Framework Registry in Edge Function

| Field | Value |
|-------|-------|
| **Location** | `/supabase/functions/generate_disclosure/index.ts` lines 15-40 |
| **Description** | `FRAMEWORK_REGISTRY_V0` is hardcoded in the edge function. Any framework updates require redeploying the edge function. No database-driven registry. |
| **Likelihood** | **High** (for any framework change) |
| **Impact** | **Medium** |

---

### 4.2 Client-Side Scoring Engine

| Field | Value |
|-------|-------|
| **Location** | `/src/lib/scoring/`, `/src/lib/gaps/`, `/src/lib/assessment/` |
| **Description** | All scoring, gap detection, and assessment logic runs client-side. Results are saved to DB but can be manipulated before save. No server-side validation of scores. |
| **Likelihood** | **Medium** |
| **Impact** | **Medium** |

---

### 4.3 AI Response Parsing Fragility

| Field | Value |
|-------|-------|
| **Location** | `/supabase/functions/generate_disclosure/index.ts` function `parseAIResponse` |
| **Description** | AI-generated content must match expected JSON structure. If AI output format changes or is malformed, parsing may fail silently or produce corrupt data. |
| **Likelihood** | **Medium** |
| **Impact** | **Medium** |

---

## 5. OPERATIONAL RISKS

### 5.1 No Global Error Boundary

| Field | Value |
|-------|-------|
| **Location** | React application root |
| **Description** | No React error boundary wraps the application. An unhandled exception in any component will crash the entire UI. |
| **Likelihood** | **Medium** |
| **Impact** | **Medium** |

---

### 5.2 No Centralized Logging

| Field | Value |
|-------|-------|
| **Location** | Entire codebase |
| **Description** | No structured logging or error tracking (Sentry planned but not implemented). Debugging production issues requires manual log review. |
| **Likelihood** | **High** (when debugging) |
| **Impact** | **Low** |

---

### 5.3 Manual Deployment

| Field | Value |
|-------|-------|
| **Location** | Deployment process |
| **Description** | Deployment is via push to main → Lovable auto-deploy, or manual `npm run build`. No CI pipeline for test verification before deploy. |
| **Likelihood** | **High** |
| **Impact** | **Medium** |

---

## 6. RISK MATRIX SUMMARY

| Risk | Likelihood | Impact | Priority |
|------|------------|--------|----------|
| Missing Route Protection | High | High | **P1** |
| Permissive RLS Policies | High | High | **P1** |
| Freemium Boundary Not Enforced | Medium | High | **P1** |
| Anon Access Migration | Medium | High | **P1** |
| No Company Ownership Check | High | Medium | **P2** |
| Embedded Framework Registry | High | Medium | **P2** |
| Client-Side Scoring | Medium | Medium | **P2** |
| AI Response Parsing | Medium | Medium | **P2** |
| No Error Boundary | Medium | Medium | **P2** |
| Manual Deployment | High | Medium | **P2** |
| CORS Wildcard | Low | Low | **P3** |
| Report Uniqueness | Medium | Low | **P3** |
| Template FK Restrict | Low | Low | **P3** |
| No Centralized Logging | High | Low | **P3** |

---

*End of Document*
