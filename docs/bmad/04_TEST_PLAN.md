# 04_TEST_PLAN.md — AFAQ ESG Platform

> **Document Type**: BMAD Freeze Specification  
> **Version**: 1.0  
> **Generated**: 2026-01-04  
> **Status**: CANONICAL — Do not modify without governance approval

---

## 1. PURPOSE

This document defines how correctness is verified in the AFAQ system TODAY. It documents existing tests, testing gaps, and verification procedures.

---

## 2. TEST INFRASTRUCTURE

### 2.1 Test Framework

| Attribute | Value |
|-----------|-------|
| **Framework** | Vitest |
| **Environment** | jsdom |
| **Config** | `/vitest.config.ts` |
| **Setup File** | `/src/test/setup.ts` |
| **Status** | **EXISTING** |

### 2.2 Test Location

All tests are located in `/src/test/`.

---

## 3. EXISTING TESTS

### 3.1 Test File Inventory

| File | Purpose | Status |
|------|---------|--------|
| `assessment.acceptance.test.ts` | Assessment flow acceptance tests | **EXISTING** (11,694 bytes) |
| `questionnaire.acceptance.test.ts` | Questionnaire flow acceptance tests | **EXISTING** (12,682 bytes) |
| `disclosure.gating.test.ts` | Freemium disclosure gating tests | **EXISTING** (1,904 bytes) |
| `disclosure.quality.test.ts` | Disclosure output quality tests | **EXISTING** (1,848 bytes) |
| `security.rls.test.ts` | RLS policy tests | **EXISTING** (2,734 bytes) |
| `setup.ts` | Test setup file | **EXISTING** (36 bytes) |

### 3.2 Additional Unit Tests

| File | Location | Purpose |
|------|----------|---------|
| `conditional-logic.test.ts` | `/src/lib/` | Conditional form logic tests |
| `NarrativeInput.test.tsx` | `/src/pages/` | NarrativeInput component tests |

---

## 4. TEST COVERAGE ANALYSIS

### 4.1 What IS Tested

| Area | Test File | Coverage |
|------|-----------|----------|
| Questionnaire submission flow | `questionnaire.acceptance.test.ts` | Acceptance-level |
| Assessment calculation flow | `assessment.acceptance.test.ts` | Acceptance-level |
| Disclosure tier gating | `disclosure.gating.test.ts` | Basic |
| Disclosure output structure | `disclosure.quality.test.ts` | Basic |
| RLS policy enforcement | `security.rls.test.ts` | Basic |
| Conditional form logic | `conditional-logic.test.ts` | Unit |
| NarrativeInput component | `NarrativeInput.test.tsx` | Component |

### 4.2 What is NOT Tested

| Area | Risk Level | Notes |
|------|------------|-------|
| Route protection (auth guards) | **High** | No auth guards exist to test |
| Edge function `generate_disclosure` | **High** | No edge function tests |
| AI response parsing | **High** | No tests for malformed AI responses |
| Supabase Auth flows | **Medium** | Auth.tsx not covered |
| Onboarding persistence | **Medium** | Onboarding.tsx not covered |
| Dashboard data loading | **Medium** | Dashboard.tsx not covered |
| Company ownership enforcement | **High** | RLS tests exist but may not cover ownership |
| Cross-tenant data isolation | **High** | No multi-tenant isolation tests |
| Error boundary behavior | **Medium** | No error boundary exists to test |
| PDF/Word export | N/A | Feature not implemented |

---

## 5. CRITICAL INVARIANTS

The following behaviors MUST NOT break under any circumstances:

### 5.1 Authentication

| Invariant | Current State |
|-----------|---------------|
| Unauthenticated users cannot access protected data | **NOT VERIFIED** — RLS uses `authenticated` role but routes unprotected |
| Session tokens are validated | **ASSUMED** — Supabase handles this |

### 5.2 Freemium Boundary

| Invariant | Current State |
|-----------|---------------|
| Free users cannot generate disclosures | **PARTIALLY TESTED** — `disclosure.gating.test.ts` exists |
| Free users cannot access paid endpoints | **NOT VERIFIED** — Server-side enforcement unclear |

### 5.3 Data Isolation

| Invariant | Current State |
|-----------|---------------|
| Users can only access their own company data | **NOT ENFORCED** — RLS uses `USING (true)` |
| Users can only see their own profile | **ENFORCED** — `user_profiles` RLS correct |

### 5.4 Data Integrity

| Invariant | Current State |
|-----------|---------------|
| Questionnaire responses reference valid templates | **ENFORCED** — FK constraint |
| Assessment results reference valid responses | **ENFORCED** — FK constraint |
| Disclosure outputs reference valid assessments | **ENFORCED** — FK constraint |

---

## 6. TEST EXECUTION

### 6.1 Running All Tests

```bash
npm run test
```

**Expected**: All tests pass.

### 6.2 Running Tests with Coverage

```bash
npm run test -- --coverage
```

**Note**: Coverage reporting may not be configured.

### 6.3 Running Specific Test File

```bash
npm run test -- src/test/assessment.acceptance.test.ts
```

---

## 7. MANUAL VERIFICATION PROCEDURES

The following must be verified manually until automated tests exist:

### 7.1 Authentication Flow

1. Navigate to `/auth`
2. Sign up with new email
3. Verify email redirect works
4. Verify user_profile created in database
5. Verify navigation to `/onboarding`

### 7.2 Onboarding Flow

1. Complete all 4 onboarding steps
2. Verify company record created
3. Verify report record created
4. Verify navigation to `/dashboard`

### 7.3 Freemium Boundary (Manual)

1. As free user, navigate to `/compliance/disclosure/:reportId`
2. Verify upgrade prompt shown
3. Verify generate button disabled or hidden
4. Attempt direct API call to edge function
5. Verify rejection (if server-side enforcement exists)

### 7.4 Disclosure Generation (Paid User)

1. As paid user, navigate to disclosure page
2. Click generate
3. Verify edge function called
4. Verify output saved to `disclosure_outputs`
5. Verify display in EN and AR

---

## 8. E2E TESTING STATUS

| Framework | Status |
|-----------|--------|
| Playwright | **PLANNED** — Not implemented |
| Cypress | **NOT USED** |

**ARCHITECTURE.md** states E2E tests are planned for critical user journeys.

---

## 9. CI/CD TEST INTEGRATION

| Integration | Status |
|-------------|--------|
| Tests run on PR | **NOT CONFIGURED** |
| Tests run on push | **NOT CONFIGURED** |
| Tests run before deploy | **NOT CONFIGURED** |

**Current State**: Tests must be run manually before merge.

---

## 10. TEST DATA / FIXTURES

| Location | Purpose |
|----------|---------|
| `/src/fixtures/` | Test fixtures (8 files) |

**Contents not verified in scope.**

---

## 11. RECOMMENDATIONS (DOCUMENTATION ONLY)

The following test gaps represent the highest risk if not addressed:

1. **Route protection tests** — Cannot test until auth guards implemented
2. **Edge function tests** — Critical for disclosure generation correctness
3. **Multi-tenant isolation tests** — Critical for data security
4. **AI parsing failure tests** — Critical for production stability

These are documented for awareness. **No action is implied by this document.**

---

*End of Document*
