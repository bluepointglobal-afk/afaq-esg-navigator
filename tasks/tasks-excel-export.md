# Tasks: Excel Export Feature

## Overview
Add Excel (.xlsx) download to the Disclosure page, exporting metrics and data points as a spreadsheet.

## User Story
**As a** Pro tier user
**I want to** download my ESG metrics as an Excel file
**So that** I can analyze data in spreadsheets and share with auditors

---

## Tasks

### Task 1: Install xlsx Library
**Description**: Add SheetJS (xlsx) package for Excel generation
**Files**: `package.json`
**Acceptance Criteria**:
- [ ] `xlsx` package installed
- [ ] Build passes

### Task 2: Create Excel Generation Utility
**Description**: Create utility to convert disclosure data to Excel workbook
**Files**: `src/lib/disclosure/excel-generator.ts`
**Acceptance Criteria**:
- [ ] Function generates multi-sheet workbook
- [ ] Sheet 1: Summary (company info, scores)
- [ ] Sheet 2: Metrics (all quantitative data)
- [ ] Sheet 3: Gaps (identified gaps with severity)
- [ ] Proper column headers and formatting

### Task 3: Add Excel Button to ExportPanel
**Description**: Add Excel download option to Evidence Appendix tab
**Files**: `src/components/disclosure/ExportPanel.tsx`
**Acceptance Criteria**:
- [ ] Excel download button in Appendix tab
- [ ] Updates ExportFormat type to include 'excel'

### Task 4: Wire Excel Handler in Disclosure Page
**Description**: Handle 'excel' format in handleExport
**Files**: `src/pages/Disclosure.tsx`
**Acceptance Criteria**:
- [ ] handleExport supports 'excel' format
- [ ] Passes metrics and assessment data to generator
- [ ] Downloads as .xlsx file

### Task 5: Build Verification
**Description**: Verify build and tests pass
**Acceptance Criteria**:
- [ ] `npm run build` succeeds
- [ ] `npm run test` passes
- [ ] No TypeScript errors

---

*Tasks generated: 2026-01-17*
