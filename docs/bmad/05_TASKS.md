# 05_TASKS.md — AFAQ ESG Platform

> **Document Type**: BMAD Task Definitions  
> **Version**: 1.1  
> **Created**: 2026-01-04  
> **Scope**: P1 Risk Hardening + Evidence Layer + Export Pack v1

---

## Authorized Tasks

### T-001 – T-010: Foundation & Risk Hardening (DONE)
(Tasks T-001 through T-010 are completed and verified.)

---

### T-011 – Add DB tables report_narratives + metric_data (lean)

| Field | Value |
|-------|-------|
| **Scope** | Ensure lean tables with correct RLS based on reports.company_id and user_profiles.company_id |
| **Files** | `supabase/migrations/20260104000004_evidence_layer_tables.sql` |
| **Acceptance** | Migration applies cleanly; RLS restricts access to company employees |
| **Verification** | `npm run test src/test/security.rls.test.ts` (DONE) |

---

### T-012 – Add React Query hooks use-report-narratives.ts and use-metric-data.ts

| Field | Value |
|-------|-------|
| **Scope** | CRUD hooks for narratives and metrics with cache invalidation |
| **Files** | `src/hooks/use-report-narratives.ts`, `src/hooks/use-metric-data.ts` |
| **Acceptance** | Hooks support fetch, save, update; invalidates related report queries |
| **Verification** | Type check and manual use (DONE) |

---

### T-013 – Add minimal UI to input narratives and metrics

| Field | Value |
|-------|-------|
| **Scope** | Connect Dashboard to NarrativeIntake and MetricInput; ensure functional forms |
| **Files** | `src/pages/NarrativeIntake.tsx`, `src/pages/MetricInput.tsx`, `src/pages/Dashboard.tsx` |
| **Acceptance** | Users can navigate from Dashboard to input data; data saves successfully |
| **Verification** | Manual walk-through (DONE) |

---

### T-014 – Add framework registry v0

| Field | Value |
|-------|-------|
| **Scope** | Registry for IFRS S1/S2, TCFD, GRI-lite with UAE/KSA/Qatar tags; outline builder |
| **Files** | `src/lib/framework/registry.ts`, `src/lib/framework/registry.test.ts` |
| **Acceptance** | Deterministic outline generated based on company tags; unit tests pass |
| **Verification** | `npm run test src/lib/framework/registry.test.ts` (DONE) |

---

### T-015 – Build deterministic disclosure_pack JSON

| Field | Value |
|-------|-------|
| **Scope** | Logic to merge profile, frameworks, scores, narratives, metrics into a single AI prompt context |
| **Files** | `src/lib/disclosure/orchestrator.ts` |
| **Acceptance** | Valid JSON disclosure_pack produced with data grounding and gap alignment |
| **Verification** | `npx tsx src/test/smoke-test-v1.ts` (DONE) |

---

### T-016 – Update generate_disclosure edge function

| Field | Value |
|-------|-------|
| **Scope** | Update AI logic to use disclosure_pack; structured output with grounding/limitations |
| **Files** | `supabase/functions/generate_disclosure/index.ts` |
| **Acceptance** | AI produces grounded output without fabricated citations; paid gating preserved |
| **Verification** | Log verification of AI prompt (DONE) |

---

### T-017 – Create ExportPanel component

| Field | Value |
|-------|-------|
| **Scope** | UI panel to select export formats (Narrative, Appendix, JSON) |
| **Files** | `src/components/disclosure/ExportPanel.tsx` |
| **Acceptance** | Clean UI with format toggles and download buttons |
| **Verification** | Visual check in dev server |

---

### T-018 – Implement renderDisclosureToHtml utility

| Field | Value |
|-------|-------|
| **Scope** | Utility to convert disclosure sections into a clean HTML document |
| **Files** | `src/lib/disclosure/export-utils.ts` |
| **Acceptance** | Valid HTML produced with styles; deterministic output |
| **Verification** | Unit tests for HTML structure |

---

### T-019 – Implement Evidence Appendix export

| Field | Value |
|-------|-------|
| **Scope** | Table-based export of metrics + narratives + sources/confidence |
| **Files** | `src/lib/disclosure/export-utils.ts` |
| **Acceptance** | Appendix includes all evidence used in the pack |
| **Verification** | Check export content against input metrics |

---

### T-020 – Integration into Disclosure page

| Field | Value |
|-------|-------|
| **Scope** | Wire ExportPanel to the Disclosure page; handle multi-file download |
| **Files** | `src/pages/Disclosure.tsx` |
| **Acceptance** | Real downloads for HTML/JSON artifacts |
| **Verification** | Manual download check |

---

## Task Execution Order

1. T-001..T-010 (Foundation & Risks) [DONE]
2. T-011 (Add DB tables report_narratives + metric_data lean) [DONE]
3. T-012 (Add React Query hooks) [DONE]
4. T-013 (Add minimal UI for intake) [DONE]
5. T-014 (Add framework registry v0) [DONE]
6. T-015 (Build disclosure_pack JSON) [DONE]
7. T-016 (Update generate_disclosure edge function) [DONE]
8. T-017 (Create ExportPanel component) [DONE]
9. T-018 (Implement renderDisclosureToHtml utility) [DONE]
10. T-019 (Implement Evidence Appendix export) [DONE]
11. T-020 (Integration into Disclosure page) [DONE]

---

*End of Document*
