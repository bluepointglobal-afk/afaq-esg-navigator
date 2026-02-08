# 01_SYSTEM_MAP.md — AFAQ ESG Platform

> **Document Type**: BMAD Freeze Specification  
> **Version**: 1.0  
> **Generated**: 2026-01-04  
> **Status**: CANONICAL — Do not modify without governance approval

---

## 1. SYSTEM OVERVIEW

**AFAQ** is an ESG compliance and disclosure platform for SMEs in UAE, KSA, and Qatar.

| Boundary | Description |
|----------|-------------|
| **Module A (FREE)** | Compliance Engine — Assessment, scoring, gap analysis |
| **Module B (PAID)** | Disclosure Generator — AI-assisted narrative generation |

**Jurisdiction scope**: UAE, KSA, Qatar (with local framework variants)

---

## 2. MAJOR COMPONENTS

### 2.1 Frontend Application

| Attribute | Value |
|-----------|-------|
| **Framework** | React 18.3.1 + TypeScript 5.8.3 |
| **Build Tool** | Vite 5.4.19 |
| **Routing** | React Router 6.30.1 |
| **UI Library** | shadcn/ui (60+ Radix UI components) |
| **Styling** | Tailwind CSS 3.4.17 |
| **State** | React Query 5.83.0 (server state), local useState/useReducer |
| **Forms** | React Hook Form 7.61.1 + Zod 3.25.76 |
| **Location** | `/src/` |
| **Status** | **EXISTING** |

#### 2.1.1 Pages (Routes)

| Route | Component | Status |
|-------|-----------|--------|
| `/` | `Landing.tsx` | **EXISTING** |
| `/auth` | `Auth.tsx` | **EXISTING** |
| `/onboarding` | `Onboarding.tsx` | **EXISTING** |
| `/dashboard` | `Dashboard.tsx` | **EXISTING** |
| `/settings` | `CompanySettings.tsx` | **EXISTING** |
| `/compliance/questionnaire` | `Questionnaire.tsx` | **EXISTING** |
| `/compliance/results/:reportId` | `ComplianceResults.tsx` | **EXISTING** |
| `/compliance/narrative/:reportId` | `NarrativeIntake.tsx` | **EXISTING** |
| `/compliance/metrics/:reportId` | `MetricInput.tsx` | **EXISTING** |
| `/compliance/disclosure/:reportId` | `Disclosure.tsx` | **EXISTING** |
| `*` | `NotFound.tsx` | **EXISTING** |

**Observed Behavior**: Route protection (auth guards) is NOT implemented. Comment in `App.tsx` line 32 states: `"Protected routes (will add auth check later)"`.

#### 2.1.2 React Query Hooks

| Hook | Purpose | Status |
|------|---------|--------|
| `use-assessment-results.ts` | CRUD for assessment_results | **EXISTING** |
| `use-company.ts` | Company profile management | **EXISTING** |
| `use-disclosure-outputs.ts` | Disclosure CRUD + generation trigger | **EXISTING** |
| `use-metric-data.ts` | Metric data input/retrieval | **EXISTING** |
| `use-questionnaire-response.ts` | Questionnaire answer persistence | **EXISTING** |
| `use-questionnaire-template.ts` | Template fetching | **EXISTING** |
| `use-report-narratives.ts` | Narrative input persistence | **EXISTING** |
| `use-reports.ts` | Report CRUD | **EXISTING** |
| `use-toast.ts` | Toast notifications | **EXISTING** |

#### 2.1.3 Client-Side Business Logic

| Module | Location | Purpose | Status |
|--------|----------|---------|--------|
| Scoring Engine | `/src/lib/scoring/` | Calculate compliance scores | **EXISTING** |
| Gap Detection | `/src/lib/gaps/` | Identify compliance gaps | **EXISTING** |
| Recommendations | `/src/lib/recommendations/` | Generate recommendations | **EXISTING** |
| Assessment Orchestrator | `/src/lib/assessment/` | Coordinate scoring + gaps | **EXISTING** |
| Conditional Logic | `/src/lib/conditional-logic.ts` | Form conditional display | **EXISTING** |
| Disclosure Utils | `/src/lib/disclosure/` | Template selection helpers | **EXISTING** |
| Framework Utils | `/src/lib/framework/` | Framework detection | **EXISTING** |
| Questionnaire Builder | `/src/lib/questionnaire/` | Question bank logic | **EXISTING** |

---

### 2.2 Backend — Supabase

| Attribute | Value |
|-----------|-------|
| **Database** | PostgreSQL (Supabase hosted) |
| **Auth** | Supabase Auth (JWT) |
| **Storage** | Supabase Storage |
| **Edge Functions** | Deno runtime |
| **Status** | **EXISTING** |

#### 2.2.1 Database Tables

| Table | Purpose | RLS | Status |
|-------|---------|-----|--------|
| `companies` | Company profiles | Enabled (permissive) | **EXISTING** |
| `user_profiles` | User profiles with tier | Enabled (own-row) | **EXISTING** |
| `reports` | ESG reports per company/year | Enabled (permissive) | **EXISTING** |
| `questionnaire_templates` | Question templates by jurisdiction | Enabled (read-only) | **EXISTING** |
| `questionnaire_responses` | User answers | Enabled (permissive) | **EXISTING** |
| `assessment_results` | Scoring and gap results | Enabled (permissive) | **EXISTING** |
| `disclosure_outputs` | Generated disclosures | Enabled (permissive) | **EXISTING** |
| `report_narratives` | User narrative inputs | Enabled | **EXISTING** |
| `metric_data` | Individual metric values | Enabled | **EXISTING** |

**Observed Behavior**: Most RLS policies use `USING (true)` for authenticated users — effectively permissive. Only `user_profiles` enforces row-level ownership (`id = auth.uid()`).

#### 2.2.2 Migrations

| Migration | Purpose | Status |
|-----------|---------|--------|
| `20250118000001_create_base_tables.sql` | Core tables | **EXISTING** |
| `20250121000001_add_disclosure_fields.sql` | Disclosure extensions | **EXISTING** |
| `20250123000001_allow_anon_for_testing.sql` | Anon access for testing | **EXISTING** |
| `20250123000002_fix_disclosure_fk.sql` | FK fix | **EXISTING** |
| `20260101000000_create_report_narratives.sql` | Narrative storage | **EXISTING** |
| `20260102000000_fix_narratives_rls.sql` | RLS fix | **EXISTING** |
| `20260102000001_fix_schema_drift.sql` | Schema correction | **EXISTING** |
| `20260103000000_create_metric_data.sql` | Metric data table | **EXISTING** |

---

### 2.3 Edge Functions

| Function | Location | Purpose | Status |
|----------|----------|---------|--------|
| `generate_disclosure` | `/supabase/functions/generate_disclosure/` | AI disclosure generation | **EXISTING** |

**Implementation Details**:
- Uses OpenRouter API for AI access
- Contains embedded `FRAMEWORK_REGISTRY_V0` with IFRS S1, S2, GRI, UAE, KSA, Qatar local frameworks
- Functions: `buildDisclosureContext`, `getDisclosurePack`, `parseAIResponse`
- CORS headers configured for `*`

**Observed Behavior**: Tier enforcement is documented as intended but implementation details not verified in scope.

---

### 2.4 AI Integration

| Attribute | Value |
|-----------|-------|
| **Provider** | OpenRouter (abstraction layer) |
| **Model** | Claude 3.5 Sonnet (claude-3-5-sonnet-20241022) per ARCHITECTURE.md |
| **Usage** | Disclosure narrative generation only |
| **Status** | **EXISTING** |

---

### 2.5 Storage

| Attribute | Value |
|-----------|-------|
| **Provider** | Supabase Storage |
| **Purpose** | Documents/evidence (per ARCHITECTURE.md) |
| **Status** | **PARTIAL** — Referenced but usage not verified |

---

## 3. DATA FLOW

### 3.1 Authentication Flow

```
User → Auth.tsx → Supabase Auth API → user_profiles row created
                                     → Navigate to /onboarding or /dashboard
```

**Status**: **EXISTING**

### 3.2 Onboarding Flow

```
User → Onboarding.tsx (4 steps) → Company created in DB → Report created
  Step 1: Company Profile
  Step 2: Company Size
  Step 3: Data Availability
  Step 4: Framework Detection (auto)
```

**Status**: **EXISTING**

### 3.3 Compliance Flow (Module A — FREE)

```
User → /compliance/questionnaire → Template fetched
                                 → Answers saved to questionnaire_responses
                                 → Scoring engine runs (client-side)
                                 → Results saved to assessment_results
                                 → Navigate to /compliance/results/:reportId
```

**Status**: **EXISTING**

### 3.4 Disclosure Flow (Module B — PAID)

```
User → /compliance/narrative/:reportId → Narrative inputs saved to report_narratives
     → /compliance/metrics/:reportId → Metric data saved to metric_data
     → /compliance/disclosure/:reportId → Tier check (client-side)
                                        → If free: Show UpgradePrompt
                                        → If paid: Edge function called
                                        → AI generates sections
                                        → Saved to disclosure_outputs
                                        → Display with EN/AR toggle
```

**Status**: **EXISTING**

---

## 4. FREEMIUM BOUNDARY

| Enforcement Point | Type | Status |
|-------------------|------|--------|
| Client-side tier check in Disclosure.tsx | UI gating | **EXISTING** |
| Edge function tier verification | Server-side | **DOCUMENTED** — Not verified |
| RLS policy for `disclosure_outputs` | Database | **PARTIAL** — Uses permissive policy |

**Observed Behavior**: ARCHITECTURE.md shows planned RLS policy with tier check, but actual migration uses permissive `USING (true)`.

---

## 5. OUT-OF-SCOPE DECLARATIONS

The following are explicitly NOT part of the current system:

| Item | Status | Notes |
|------|--------|-------|
| Route protection (auth guards) | **PLANNED** | Comment in App.tsx |
| React Query DevTools | **PLANNED** | Dev mode only |
| Sentry integration | **PLANNED** | Per ARCHITECTURE.md |
| E2E tests (Playwright) | **PLANNED** | Per ARCHITECTURE.md |
| Lazy loading/code splitting | **PLANNED** | Per ARCHITECTURE.md |
| PDF/Word export | **PLANNED** | JSON only currently |
| Global error boundary | **PLANNED** | Per ARCHITECTURE.md |
| CI/CD pipeline | **PARTIAL** | Manual deploy to Lovable |

---

## 6. TECHNOLOGY BOUNDARIES

These technologies are FIXED and must not be changed:

| Category | Technology | Locked |
|----------|------------|--------|
| Frontend | React 18 + TypeScript | ✓ |
| Build | Vite | ✓ |
| UI | shadcn/ui + Tailwind | ✓ |
| Backend | Supabase (Postgres + Auth + Storage + Edge) | ✓ |
| AI | OpenRouter → Claude | ✓ |
| Validation | Zod + React Hook Form | ✓ |

---

## 7. COMPONENT STATUS SUMMARY

| Component | Classification |
|-----------|----------------|
| Frontend Pages (11) | **EXISTING** |
| React Query Hooks (10) | **EXISTING** |
| Business Logic Libs (8) | **EXISTING** |
| Database Tables (9) | **EXISTING** |
| Edge Functions (1) | **EXISTING** |
| RLS Policies | **PARTIAL** (permissive) |
| Route Protection | **PLANNED** |
| E2E Tests | **PLANNED** |
| PDF Export | **PLANNED** |

---

*End of Document*
