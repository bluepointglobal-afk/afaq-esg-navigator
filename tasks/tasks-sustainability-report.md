# Tasks: Sustainability Report Generator

## Overview
Enhance disclosure output to generate a complete sustainability report with structured sections and data annex tables (GRI-style).

---

## Stories

### SR-001: Create Report Template Types
- [ ] Define `SustainabilityReport` interface in types/compliance.ts
- [ ] Add sections: executive_summary, environmental, social, governance, methodology, data_annex
- [ ] Each section has: title, narrative, metrics[], disclosures[]

### SR-002: Create Report Section Components
- [ ] Create `ReportSection` component for narrative + metrics display
- [ ] Create `DataAnnexTable` component for GRI-style data tables
- [ ] Create `DisclosureIndex` component showing addressed disclosures

### SR-003: Create Report Generator Utility
- [ ] Create `src/lib/report/generate-report.ts`
- [ ] Transform DisclosureOutput + AssessmentResult into SustainabilityReport
- [ ] Auto-generate executive summary from scores and gaps
- [ ] Map metrics to appropriate sections

### SR-004: Update Disclosure Page with Report View
- [ ] Add "Full Report" tab to Disclosure page
- [ ] Render structured report with all sections
- [ ] Include data annex at bottom

### SR-005: Update PDF Generator for Report Format
- [ ] Update pdf-generator to handle full report structure
- [ ] Add table of contents
- [ ] Format data annex tables properly

### SR-006: Build Verification
- [ ] npm run build succeeds
- [ ] npm run test passes
- [ ] No TypeScript errors

---

## Out of Scope
- Custom report branding
- Multiple report templates
- Report versioning/history
