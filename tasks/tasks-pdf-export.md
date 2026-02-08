# Tasks: PDF Export Feature

## Overview
Add native PDF download to the Disclosure page, converting the existing HTML output to a downloadable PDF file.

## User Story
**As a** Pro tier user
**I want to** download my ESG disclosure report as a PDF
**So that** I can submit it to regulators and share with stakeholders

---

## Tasks

### Task 1: Install PDF Library
**Description**: Add html2pdf.js package for client-side PDF generation
**Files**: `package.json`
**Acceptance Criteria**:
- [ ] `html2pdf.js` installed
- [ ] Build passes

### Task 2: Create PDF Generation Utility
**Description**: Create utility function to convert HTML string to PDF blob
**Files**: `src/lib/disclosure/pdf-generator.ts`
**Acceptance Criteria**:
- [ ] Function accepts HTML string and filename
- [ ] Returns downloadable PDF blob
- [ ] Supports RTL for Arabic content
- [ ] Handles page breaks properly

### Task 3: Add PDF Download Button to ExportPanel
**Description**: Add PDF download option to the export panel UI
**Files**: `src/components/disclosure/ExportPanel.tsx`
**Acceptance Criteria**:
- [ ] PDF download button in Narrative Report tab
- [ ] Loading state during generation
- [ ] Error handling with toast notification
- [ ] Downloads file with proper naming (company-disclosure-YYYY.pdf)

### Task 4: Update Disclosure Page Handler
**Description**: Wire PDF download handler in Disclosure page
**Files**: `src/pages/Disclosure.tsx`
**Acceptance Criteria**:
- [ ] handleDownload supports 'pdf' format
- [ ] Generates PDF from rendered HTML
- [ ] Works for both English and Arabic

### Task 5: Test PDF Generation
**Description**: Verify PDF output quality and content
**Acceptance Criteria**:
- [ ] PDF opens correctly in all viewers
- [ ] Arabic text renders RTL properly
- [ ] Data tables are readable
- [ ] Disclaimers appear at end
- [ ] File size is reasonable (<5MB)

### Task 6: Build Verification
**Description**: Ensure build passes and no regressions
**Acceptance Criteria**:
- [ ] `npm run build` succeeds
- [ ] `npm run test` passes (68 tests)
- [ ] No TypeScript errors

---

## Implementation Notes

### Recommended Approach
Use `html2pdf.js` for simplicity:
```typescript
import html2pdf from 'html2pdf.js';

const opt = {
  margin: 10,
  filename: 'disclosure-report.pdf',
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2, useCORS: true },
  jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
};

html2pdf().set(opt).from(htmlElement).save();
```

### RTL Support
For Arabic, add:
```typescript
jsPDF: {
  unit: 'mm',
  format: 'a4',
  orientation: 'portrait',
  putOnlyUsedFonts: true,
  floatPrecision: 16
}
```

### File Naming Convention
`{companyName}-esg-disclosure-{year}.pdf`

---

## Definition of Done
- PDF downloads from ExportPanel
- English and Arabic content supported
- Build passes
- No console errors
- File opens in standard PDF readers

---

*Tasks generated: 2026-01-17*
