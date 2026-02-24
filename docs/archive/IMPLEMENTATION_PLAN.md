# AFAQ Compliance Engine & Disclosure Generator - Implementation Plan

## Module Scope
- **Module A**: Compliance Engine (Free tier)
- **Module B**: Disclosure Generator (Paid tier: pro/enterprise)
- **Target Markets**: UAE, KSA, Qatar SMEs (listed and non-listed)

## Files to Be Created

### Step 1: Domain Model & Schemas

#### Database Migrations
```
supabase/migrations/
├── 20250120000001_create_questionnaires.sql
├── 20250120000002_create_assessment_results.sql
├── 20250120000003_create_disclosure_outputs.sql
├── 20250120000004_create_company_profiles_extended.sql
└── 20250120000005_add_rls_policies.sql
```

#### Type Definitions
```
src/types/
├── index.ts                    # MODIFY: Add new domain types
├── compliance.ts               # NEW: Compliance engine types
├── questionnaire.ts            # NEW: Question bank types
├── assessment.ts               # NEW: Assessment result types
└── disclosure.ts               # NEW: Disclosure output types
```

#### Validation Schemas (Zod)
```
src/schemas/
├── company-profile.schema.ts   # NEW: CompanyProfile validation
├── questionnaire.schema.ts     # NEW: Questionnaire validation
├── assessment.schema.ts        # NEW: AssessmentResult validation
└── disclosure.schema.ts        # NEW: DisclosureOutput validation
```

#### Test Fixtures
```
src/fixtures/
├── uae-company.json           # NEW: UAE sample data
├── ksa-company.json           # NEW: KSA sample data
├── qatar-company.json         # NEW: Qatar sample data
├── uae-questionnaire.json     # NEW: UAE question responses
├── ksa-questionnaire.json     # NEW: KSA question responses
└── qatar-questionnaire.json   # NEW: Qatar question responses
```

---

### Step 2: Questionnaire System

#### Question Bank Data
```
src/data/
├── questions/
│   ├── governance.ts          # NEW: Governance pillar questions
│   ├── esg.ts                 # NEW: ESG/Sustainability questions
│   ├── risk-controls.ts       # NEW: Risk & Controls questions
│   └── transparency.ts        # NEW: Transparency questions
└── jurisdictions/
    ├── uae.ts                 # NEW: UAE-specific rules
    ├── ksa.ts                 # NEW: KSA-specific rules
    └── qatar.ts               # NEW: Qatar-specific rules
```

#### React Query Hooks
```
src/hooks/
├── use-questionnaire.ts       # NEW: Questionnaire CRUD hooks
├── use-questions.ts           # NEW: Question bank queries
└── use-jurisdiction.ts        # NEW: Jurisdiction detection
```

#### UI Components
```
src/components/compliance/
├── QuestionnaireForm.tsx      # NEW: Main questionnaire form
├── QuestionSection.tsx        # NEW: Section container
├── QuestionItem.tsx           # NEW: Individual question renderer
├── AnswerInput.tsx            # NEW: Dynamic input based on type
├── EvidenceUpload.tsx         # NEW: Supporting document upload
├── ProgressTracker.tsx        # NEW: Completion progress
└── SaveDraftButton.tsx        # NEW: Auto-save functionality
```

#### Pages
```
src/pages/
├── Compliance.tsx             # NEW: Compliance module entry
└── Questionnaire.tsx          # NEW: Full questionnaire page
```

#### Routes
```
src/App.tsx                    # MODIFY: Add /compliance routes
```

---

### Step 3: Scoring & Gap Engine

#### Core Logic
```
src/lib/
├── scoring/
│   ├── calculate-scores.ts    # NEW: Scoring algorithm
│   ├── weights.ts             # NEW: Question weights by jurisdiction
│   └── thresholds.ts          # NEW: Score thresholds
└── gap-analysis/
    ├── detect-gaps.ts         # NEW: Gap detection logic
    ├── prioritize.ts          # NEW: Recommendation prioritization
    └── explain.ts             # NEW: Explainability formatter
```

#### React Query Hooks
```
src/hooks/
├── use-scoring.ts             # NEW: Scoring calculation hook
├── use-gap-analysis.ts        # NEW: Gap detection hook
└── use-assessment.ts          # NEW: Assessment CRUD hooks
```

#### UI Components
```
src/components/compliance/
├── ScoreCard.tsx              # NEW: Overall score display
├── SectionScores.tsx          # NEW: Pillar-level scores
├── ScoreExplanation.tsx       # NEW: Why this score?
├── GapsList.tsx               # NEW: Missing/low-score items
├── Recommendations.tsx        # NEW: Prioritized action items
└── ComplianceReport.tsx       # NEW: Full compliance report (free)
```

#### Pages
```
src/pages/
└── AssessmentResults.tsx      # NEW: Results dashboard
```

#### Unit Tests
```
src/lib/scoring/__tests__/
├── calculate-scores.test.ts   # NEW: Scoring tests
├── detect-gaps.test.ts        # NEW: Gap detection tests
└── fixtures.ts                # NEW: Test data
```

---

### Step 4: Freemium Boundary

#### Entitlement System
```
src/lib/
└── entitlements/
    ├── check-access.ts        # NEW: Feature access checker
    ├── features.ts            # NEW: Feature flag definitions
    └── upgrade-prompts.ts     # NEW: CTA copy per feature
```

#### React Query Hooks
```
src/hooks/
├── use-entitlement.ts         # NEW: User tier & access check
└── use-subscription.ts        # NEW: Subscription management
```

#### UI Components
```
src/components/shared/
├── UpgradeCTA.tsx             # NEW: Upgrade call-to-action
├── FeatureLock.tsx            # NEW: Locked feature overlay
└── PricingModal.tsx           # NEW: In-app pricing modal
```

#### Middleware/Guards
```
src/middleware/
└── auth-guard.ts              # NEW: Route protection + tier check
```

#### Database
```
supabase/migrations/
└── 20250120000006_add_feature_gates.sql  # NEW: RLS for paid features
```

#### Server-Side Enforcement
```
supabase/functions/
└── check-entitlement/
    ├── index.ts               # NEW: Edge function for entitlement
    └── _shared/
        └── cors.ts            # NEW: CORS helper
```

---

### Step 5: Disclosure Generator (Paid)

#### Template System
```
src/templates/
├── disclosure/
│   ├── base-template.ts       # NEW: Base disclosure structure
│   ├── uae-template.ts        # NEW: UAE-specific template
│   ├── ksa-template.ts        # NEW: KSA-specific template
│   └── qatar-template.ts      # NEW: Qatar-specific template
└── sections/
    ├── governance.ts          # NEW: Governance section template
    ├── esg.ts                 # NEW: ESG section template
    ├── risk.ts                # NEW: Risk section template
    ├── transparency.ts        # NEW: Transparency section template
    └── appendix.ts            # NEW: Sources/evidence appendix
```

#### AI Integration
```
supabase/functions/
└── generate-narrative/
    ├── index.ts               # NEW: AI narrative generator
    ├── prompts/
    │   ├── governance.ts      # NEW: Governance prompts
    │   ├── esg.ts             # NEW: ESG prompts
    │   ├── risk.ts            # NEW: Risk prompts
    │   └── transparency.ts    # NEW: Transparency prompts
    └── _shared/
        ├── openai.ts          # NEW: OpenAI client (or Claude)
        └── sanitize.ts        # NEW: Input sanitization
```

#### React Query Hooks
```
src/hooks/
├── use-disclosure.ts          # NEW: Disclosure CRUD hooks
├── use-generate-narrative.ts  # NEW: AI generation mutation
└── use-export-disclosure.ts   # NEW: Export handler
```

#### UI Components
```
src/components/disclosure/
├── DisclosurePreview.tsx      # NEW: Live preview of disclosure
├── SectionEditor.tsx          # NEW: Section-by-section editor
├── NarrativeBlock.tsx         # NEW: Individual narrative block
├── EvidenceAppendix.tsx       # NEW: Evidence list formatter
├── ExportOptions.tsx          # NEW: Export format selector
├── GenerateButton.tsx         # NEW: AI generation trigger
└── DisclaimerBanner.tsx       # NEW: Legal disclaimer
```

#### Pages
```
src/pages/
└── DisclosureGenerator.tsx    # NEW: Main disclosure page
```

#### Export Utilities
```
src/lib/
└── export/
    ├── to-json.ts             # NEW: JSON exporter
    ├── to-pdf.ts              # NEW: PDF generator (planned)
    └── format-disclosure.ts   # NEW: Formatter utilities
```

---

### Step 6: Quality & Safety Guardrails

#### Security & Validation
```
src/lib/
└── security/
    ├── sanitize-input.ts      # NEW: Input sanitization
    ├── detect-injection.ts    # NEW: Prompt injection detection
    └── rate-limit.ts          # NEW: Client-side rate limiting
```

#### Disclaimers
```
src/components/shared/
├── LegalDisclaimer.tsx        # NEW: Legal disclaimer component
└── InformationalBanner.tsx    # NEW: "Not legal advice" banner
```

#### Testing
```
src/lib/security/__tests__/
├── sanitize-input.test.ts     # NEW: Sanitization tests
├── detect-injection.test.ts   # NEW: Injection detection tests
└── boundary-bypass.test.ts    # NEW: Red-team tests
```

#### Edge Function Security
```
supabase/functions/
└── generate-narrative/
    ├── validate-input.ts      # NEW: Server-side validation
    └── prompt-guards.ts       # NEW: Prompt safety checks
```

---

### Step 7: Observability & Developer Experience

#### Logging
```
src/lib/
└── observability/
    ├── logger.ts              # NEW: Structured logger
    ├── events.ts              # NEW: Event definitions
    └── error-tracker.ts       # NEW: Error tracking wrapper
```

#### Error Handling
```
src/components/shared/
├── ErrorBoundary.tsx          # NEW: Global error boundary
└── ErrorFallback.tsx          # NEW: Error UI component
```

#### Development Tools
```
src/lib/
└── dev/
    ├── debug-panel.tsx        # NEW: Debug panel (dev only)
    └── mock-data.ts           # NEW: Mock data generator
```

#### Monitoring Hooks
```
src/hooks/
├── use-analytics.ts           # NEW: Analytics events hook
└── use-error-logger.ts        # NEW: Error logging hook
```

---

## Files to Be Modified

### Existing Files

#### Type Extensions
```
src/types/index.ts
- Add: CompanyProfile extended fields
- Add: AssessmentResult interface
- Add: DisclosureOutput interface
- Add: Questionnaire interfaces
```

#### Database Schema
```
src/integrations/supabase/types.ts
- Will be auto-generated after migrations
- Run: supabase gen types typescript --local
```

#### Routing
```
src/App.tsx
- Add: /compliance route
- Add: /compliance/questionnaire route
- Add: /compliance/results route
- Add: /disclosure route (with auth guard)
```

#### Dashboard Integration
```
src/pages/Dashboard.tsx
- Add: Link to Compliance Analysis
- Add: Link to Disclosure Generator (if paid)
- Add: Upgrade CTA (if free tier)
```

#### Onboarding Flow
```
src/pages/Onboarding.tsx
- MODIFY: Persist company profile to Supabase
- MODIFY: Create initial report record
- MODIFY: Redirect to /compliance after completion
```

#### Navigation
```
src/components/landing/Navbar.tsx (if needed)
- Add: Links to new features (for logged-in users)
```

---

## Database Schema Changes

### New Tables

#### 1. questionnaire_templates
```sql
CREATE TABLE questionnaire_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  jurisdiction text NOT NULL, -- 'UAE' | 'KSA' | 'Qatar'
  version text NOT NULL,
  sections jsonb NOT NULL, -- Array of sections with questions
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### 2. questionnaire_responses
```sql
CREATE TABLE questionnaire_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES reports(id) ON DELETE CASCADE,
  template_id uuid REFERENCES questionnaire_templates(id),
  answers jsonb NOT NULL, -- { question_id: answer_value }
  evidence_urls jsonb, -- { question_id: [urls] }
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### 3. assessment_results
```sql
CREATE TABLE assessment_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES reports(id) ON DELETE CASCADE,
  overall_score numeric(5,2) NOT NULL,
  governance_score numeric(5,2) NOT NULL,
  esg_score numeric(5,2) NOT NULL,
  risk_score numeric(5,2) NOT NULL,
  transparency_score numeric(5,2) NOT NULL,
  gaps jsonb NOT NULL, -- Array of gap objects
  recommendations jsonb NOT NULL, -- Prioritized recommendations
  explanation jsonb NOT NULL, -- Score breakdown
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### 4. disclosure_outputs
```sql
CREATE TABLE disclosure_outputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES reports(id) ON DELETE CASCADE,
  assessment_id uuid REFERENCES assessment_results(id),
  jurisdiction text NOT NULL,
  version text NOT NULL,
  sections jsonb NOT NULL, -- Generated disclosure sections
  narratives jsonb NOT NULL, -- AI-generated narratives
  evidence_appendix jsonb,
  generated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### 5. feature_entitlements (Optional - if not using user_profiles.tier)
```sql
CREATE TABLE feature_entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_code text NOT NULL, -- 'disclosure_generator'
  granted_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  UNIQUE(user_id, feature_code)
);
```

### Row-Level Security (RLS) Policies

All tables will have RLS policies enforcing:
1. Users can only access data from their own company
2. Disclosure outputs require `tier IN ('pro', 'enterprise')`
3. Read/write permissions based on user role

---

## Environment Variables to Add

```env
# AI Integration (for Disclosure Generator)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000

# Or Claude API
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-sonnet-20240229

# Feature Flags (optional)
VITE_ENABLE_DISCLOSURE_GENERATOR=true
VITE_ENABLE_AI_NARRATIVES=true

# Rate Limiting
VITE_API_RATE_LIMIT_PER_MIN=10
```

---

## Dependencies to Install

### Production
```bash
npm install @anthropic-ai/sdk  # If using Claude for narratives
# OR
npm install openai             # If using OpenAI

npm install pdf-lib            # For PDF generation (Step 5 later)
npm install jspdf              # Alternative PDF library
```

### Development
```bash
npm install -D vitest          # Unit testing
npm install -D @testing-library/react
npm install -D @testing-library/jest-dom
npm install -D @testing-library/user-event
```

---

## Implementation Order & Acceptance Criteria

### Step 0: Audit & Baseline ✅
**Deliverables:**
- [x] ARCHITECTURE.md created
- [x] IMPLEMENTATION_PLAN.md created
- [x] Files to touch identified

**Acceptance:**
- Documentation reviewed and approved

---

### Step 1: Domain Model
**Deliverables:**
- [ ] Zod schemas for all domain objects
- [ ] TypeScript interfaces
- [ ] Supabase migrations
- [ ] Sample JSON fixtures for UAE/KSA/Qatar

**Acceptance:**
- All schemas pass Zod validation
- Fixtures load without errors
- Database tables created successfully
- Types generated and imported without errors

**Files to create:** ~15 files
**Estimated changes:** +800 lines

---

### Step 2: Questionnaire v1
**Deliverables:**
- [ ] Jurisdiction-aware question bank (4 pillars × 3 jurisdictions)
- [ ] Dynamic questionnaire UI
- [ ] Auto-save functionality
- [ ] Evidence upload integration

**Acceptance:**
- User can complete questionnaire for UAE/KSA/Qatar
- Answers persist to database
- No console errors during form interaction
- Evidence files upload successfully

**Files to create:** ~20 files
**Estimated changes:** +1200 lines

---

### Step 3: Scoring & Gap Engine
**Deliverables:**
- [ ] Deterministic scoring algorithm
- [ ] Gap detection logic
- [ ] Recommendation prioritization
- [ ] Explainability formatter
- [ ] Unit tests for scoring

**Acceptance:**
- Given fixtures, results match expected scores (±2%)
- Gap detection identifies all missing/low-score items
- Recommendations are prioritized correctly
- Unit tests pass with 80%+ coverage

**Files to create:** ~15 files
**Estimated changes:** +600 lines

---

### Step 4: Freemium Boundary
**Deliverables:**
- [ ] Client-side entitlement hooks
- [ ] Server-side RLS policies
- [ ] Upgrade CTAs
- [ ] Feature lock UI

**Acceptance:**
- Free users see scores/gaps but not disclosure generator
- Attempting to access paid features returns 403
- RLS policies block database access for free tier
- UI clearly shows upgrade path

**Files to create:** ~10 files
**Estimated changes:** +400 lines

---

### Step 5: Disclosure Generator v1
**Deliverables:**
- [ ] Jurisdiction-specific templates
- [ ] AI narrative generator (Edge Function)
- [ ] Disclosure preview UI
- [ ] JSON export

**Acceptance:**
- For each jurisdiction fixture, generator outputs complete disclosure
- Narratives are consistent and jurisdiction-appropriate
- Free users cannot access any paid content
- Exports are valid JSON

**Files to create:** ~25 files
**Estimated changes:** +1500 lines

---

### Step 6: Quality & Safety Guardrails
**Deliverables:**
- [ ] Legal disclaimers
- [ ] Input sanitization
- [ ] Prompt injection detection
- [ ] Red-team bypass tests

**Acceptance:**
- Disclaimers visible on all disclosure pages
- Injection attempts are blocked
- Red-team tests show no boundary bypass
- Generator ignores malicious instructions

**Files to create:** ~8 files
**Estimated changes:** +300 lines

---

### Step 7: Observability & DX
**Deliverables:**
- [ ] Structured logging
- [ ] Error boundary
- [ ] Analytics events
- [ ] Debug panel (dev mode)

**Acceptance:**
- Events logged for assessment/generation
- Errors caught and logged
- Error UI displays user-friendly messages
- Debug panel shows relevant state

**Files to create:** ~6 files
**Estimated changes:** +200 lines

---

## Total Estimated Scope

- **New Files**: ~99 files
- **Modified Files**: ~5 files
- **Total Lines of Code**: ~5000 lines
- **Database Tables**: 5 new tables
- **Edge Functions**: 2 functions
- **Unit Tests**: 10+ test files

---

## Commit Strategy

Each step will be committed separately with clear commit messages:

```
Step 1: Add domain schemas and validation
- Add Zod schemas for CompanyProfile, Questionnaire, Assessment, Disclosure
- Create Supabase migrations for new tables
- Add sample fixtures for UAE/KSA/Qatar
- Generate TypeScript types from Supabase

Step 2: Implement questionnaire system
- Add jurisdiction-aware question bank
- Create questionnaire UI components
- Wire React Query hooks for CRUD operations
- Implement auto-save and evidence upload

Step 3: Build scoring and gap engine
- Implement deterministic scoring algorithm
- Add gap detection and prioritization
- Create explainability formatter
- Add unit tests for scoring logic

Step 4: Enforce freemium boundary
- Add entitlement checking system
- Implement RLS policies for paid features
- Create upgrade CTAs and feature locks
- Add server-side enforcement

Step 5: Build disclosure generator (paid)
- Create jurisdiction-specific templates
- Implement AI narrative generator
- Add disclosure preview UI
- Create JSON export functionality

Step 6: Add safety guardrails
- Add legal disclaimers
- Implement input sanitization
- Add prompt injection detection
- Create red-team bypass tests

Step 7: Add observability
- Implement structured logging
- Add error boundary and tracking
- Create analytics event hooks
- Build debug panel for development
```

---

*Implementation Plan v1.0 - Ready for Step 1*
