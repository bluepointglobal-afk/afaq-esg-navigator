# Step 2: Questionnaire v1 - Implementation Checklist

## Objective
Build jurisdiction-aware questionnaire system with UI, persistence, and conditional logic for UAE/KSA/Qatar SMEs (listed/non-listed).

---

## Phase 1: Question Bank Data Structure ⏳

### 1.1 Create Question Definitions
- [ ] `src/data/questions/governance.ts` - Governance pillar questions
- [ ] `src/data/questions/esg.ts` - ESG/Sustainability questions
- [ ] `src/data/questions/risk-controls.ts` - Risk & Controls questions
- [ ] `src/data/questions/transparency.ts` - Transparency questions
- [ ] Each file exports typed question arrays with:
  - Bilingual text (EN/AR)
  - Jurisdiction applicability (UAE/KSA/Qatar)
  - Listing status applicability (listed/non-listed)
  - Weight (0-10)
  - Evidence hints
  - Conditional rules (structured)

### 1.2 Create Jurisdiction Rules
- [ ] `src/data/jurisdictions/uae.ts` - UAE-specific metadata
- [ ] `src/data/jurisdictions/ksa.ts` - KSA-specific metadata
- [ ] `src/data/jurisdictions/qatar.ts` - Qatar-specific metadata
- [ ] Export jurisdiction configurations (pillar weights, mandatory questions)

### 1.3 Create Question Bank Index
- [ ] `src/data/questions/index.ts` - Central export of all questions
- [ ] Type-safe exports organized by pillar
- [ ] Total question count validation

**Acceptance:** 40-60 questions total, covering all 4 pillars × 3 jurisdictions

---

## Phase 2: Questionnaire Builder Logic ⏳

### 2.1 Create Selection Logic
- [ ] `src/lib/questionnaire/builder.ts` - Template builder
  - `buildTemplate(companyProfile): QuestionnaireTemplate`
  - Filters questions by jurisdiction
  - Filters by listing status
  - Applies size-based filtering (if needed)
  - Groups into sections by pillar
  - Validates conditional dependencies

### 2.2 Create Filtering Utilities
- [ ] `src/lib/questionnaire/filters.ts` - Question filtering
  - `filterByJurisdiction(questions, jurisdiction)`
  - `filterByListingStatus(questions, listingStatus)`
  - `validateConditionalDependencies(questions)`

### 2.3 Create Template Versioning
- [ ] `src/lib/questionnaire/versioning.ts` - Template version management
  - `getCurrentVersion(): string` - Returns current semver
  - `generateTemplateId(jurisdiction, version): string`

**Acceptance:** Given company profile, builder produces correct template with only applicable questions

---

## Phase 3: Supabase Persistence Layer ⏳

### 3.1 Create React Query Hooks
- [ ] `src/hooks/use-questionnaire-template.ts`
  - `useQuestionnaireTemplate(jurisdiction)` - Fetch/create template
  - `useCreateTemplate()` - Mutation to create new template

- [ ] `src/hooks/use-questionnaire-response.ts`
  - `useQuestionnaireResponse(reportId)` - Fetch response
  - `useCreateResponse()` - Create new response
  - `useUpdateResponse()` - Update answers (auto-save)
  - `useCompleteResponse()` - Mark as completed

### 3.2 Create Supabase Service Layer
- [ ] `src/lib/services/questionnaire.service.ts`
  - `getOrCreateTemplate(jurisdiction, version)`
  - `createResponse(reportId, templateId)`
  - `saveAnswers(responseId, answers)`
  - `calculateCompletion(answers, totalQuestions)`

### 3.3 Error Handling
- [ ] Handle RLS failures gracefully
- [ ] Handle network errors with retry
- [ ] Show user-friendly error messages

**Acceptance:** Templates and responses persist to Supabase, auto-save works

---

## Phase 4: UI Components ⏳

### 4.1 Questionnaire Navigation
- [ ] `src/components/compliance/QuestionnaireNav.tsx`
  - Section tabs (4 pillars)
  - Progress indicator per section
  - Overall completion percentage

### 4.2 Question Rendering
- [ ] `src/components/compliance/QuestionSection.tsx`
  - Renders section with title/description
  - Shows section progress

- [ ] `src/components/compliance/QuestionItem.tsx`
  - Renders individual question
  - Shows required indicator
  - Handles bilingual display

- [ ] `src/components/compliance/AnswerInput.tsx`
  - Dynamic input based on question type:
    - Boolean: Radio Yes/No
    - Single choice: Radio group
    - Multiple choice: Checkboxes
    - Text: Textarea
    - Number: Number input
    - Date: Date picker
    - Percentage: Number input (0-100)

### 4.3 Evidence Attachment
- [ ] `src/components/compliance/EvidenceUpload.tsx`
  - URL input field
  - Multiple URLs support
  - Notes textarea
  - File upload placeholder (future)

### 4.4 Progress & Actions
- [ ] `src/components/compliance/ProgressTracker.tsx`
  - Overall completion bar
  - Per-pillar completion
  - Questions answered count

- [ ] `src/components/compliance/QuestionnaireActions.tsx`
  - Save Draft button (auto-saves every 30s)
  - Complete & Continue button
  - Validation error display

**Acceptance:** All question types render correctly, conditional logic hides/shows questions, evidence fields work

---

## Phase 5: Questionnaire Page & Routing ⏳

### 5.1 Create Questionnaire Page
- [ ] `src/pages/Questionnaire.tsx`
  - Main questionnaire container
  - React Hook Form integration
  - Zod validation
  - Section navigation
  - Auto-save on change
  - Resume from saved state
  - Show validation errors

### 5.2 Update Dashboard Entry Point
- [ ] Modify `src/pages/Dashboard.tsx`
  - Add "Compliance Check (Free)" card
  - Link to `/compliance/questionnaire`
  - Show completion status if started

### 5.3 Add Routing
- [ ] Modify `src/App.tsx`
  - Add route: `/compliance/questionnaire`
  - Protected route (requires auth)

### 5.4 Create Compliance Landing
- [ ] `src/pages/Compliance.tsx` (optional)
  - Overview of compliance module
  - Link to start questionnaire

**Acceptance:** User can navigate from dashboard to questionnaire, form saves automatically, can resume

---

## Phase 6: Seed Data & Dev Utilities ⏳

### 6.1 Create Seed Data
- [ ] `src/data/seed/templates.ts`
  - Generate templates for UAE/KSA/Qatar
  - Use builder to create templates
  - Export as seed data

### 6.2 Create Dev Utility
- [ ] `src/lib/dev/seed-questionnaires.ts`
  - Script to insert templates into Supabase
  - Can be run manually for testing
  - Generates templates for all 6 fixture profiles

### 6.3 Create Mock Data Generator
- [ ] `src/lib/dev/mock-answers.ts`
  - Generate sample answers for testing
  - Useful for Step 3 scoring development

**Acceptance:** Can seed templates locally, mock data available for testing

---

## Phase 7: Testing & Validation ⏳

### 7.1 Template Generation Tests
- [ ] Test UAE template has correct questions
- [ ] Test KSA template has correct questions
- [ ] Test Qatar template has correct questions
- [ ] Test listed vs non-listed filtering

### 7.2 Conditional Logic Tests
- [ ] Test questions show/hide based on answers
- [ ] Test AND logic (multiple rules)
- [ ] Test all 8 operators

### 7.3 Persistence Tests
- [ ] Test create template
- [ ] Test create response
- [ ] Test save answers
- [ ] Test calculate completion
- [ ] Test resume from saved state

### 7.4 End-to-End Flow
- [ ] User selects company profile
- [ ] Template generated/loaded
- [ ] User answers questions
- [ ] Conditional questions appear
- [ ] Evidence fields save
- [ ] Progress updates
- [ ] Draft saves
- [ ] Can resume
- [ ] Completion marked

**Acceptance:** All tests pass, no console errors

---

## Phase 8: Documentation ⏳

### 8.1 Create Step 2 Summary
- [ ] `STEP2_SUMMARY.md`
  - What was built
  - File structure
  - How to run locally
  - How to seed data
  - Acceptance test results

### 8.2 Update Architecture Docs
- [ ] Update `ARCHITECTURE.md` with questionnaire flow
- [ ] Document data persistence patterns

**Acceptance:** Documentation is clear and complete

---

## Commit Strategy

Each phase will be a separate commit:

1. `Step 2.1: Add question bank data structure`
2. `Step 2.2: Add questionnaire builder logic`
3. `Step 2.3: Add Supabase persistence layer`
4. `Step 2.4: Add UI components for questionnaire`
5. `Step 2.5: Add questionnaire page and routing`
6. `Step 2.6: Add seed data and dev utilities`
7. `Step 2.7: Add tests and validation`
8. `Step 2.8: Add documentation`

---

## Current Status

- [x] Step 0: Architecture baseline
- [x] Step 1: Domain model schemas
- [ ] **Step 2: Questionnaire v1** ← IN PROGRESS
- [ ] Step 3: Scoring & Gap Engine
- [ ] Step 4: Freemium Boundary
- [ ] Step 5: Disclosure Generator
- [ ] Step 6: Safety Guardrails
- [ ] Step 7: Observability

---

*Checklist created: 2025-12-20*
