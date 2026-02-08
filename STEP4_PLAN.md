# Step 4: Disclosure Generator v1 - Implementation Plan

**Version**: 1.0
**Date**: December 21, 2024
**Status**: Planning
**Dependencies**: Step 0-3 Complete (Questionnaire + Assessment Engine + Results UI)

---

## Overview

Step 4 implements the **Disclosure Generator** as the flagship PAID feature, transforming compliance assessment results into professional, jurisdiction-compliant disclosure narratives. The system combines:

1. **Deterministic templates** (jurisdiction + listing variants)
2. **AI-assisted narrative generation** (Claude API via Supabase Edge Function)
3. **Strict safety guardrails** (no legal advice, no fabricated citations)
4. **Entitlement enforcement** (paid tier only, both UI and server-side)

**Critical Constraints**:
- ✅ Free tier remains fully functional (assessment + results)
- ✅ No "laws database" claims; use citation placeholders
- ✅ AI key never exposed in browser (server-side only)
- ✅ Hedged language only; no definitive compliance claims
- ✅ Bilingual output (English + Arabic)

---

## Scope

### In Scope (Step 4)

1. **Template System**
   - 6 template variants: UAE/KSA/Qatar × listed/non-listed
   - Section structure per pillar (Governance, ESG, Risk, Transparency)
   - Bilingual prompts and section titles
   - Template selection logic based on CompanyProfile

2. **AI Narrative Generation**
   - Supabase Edge Function with Claude API integration
   - Input: CompanyProfile + AssessmentResult + QuestionnaireResponse summary
   - Output: Structured DisclosureOutput with bilingual narratives
   - Guardrails: No legal advice, citation placeholders, hedged language

3. **Persistence & Entitlements**
   - Use existing `disclosure_outputs` table (may need minor schema additions)
   - React Query hooks for CRUD operations
   - Server-side tier check (pro/enterprise only)
   - UI-side locked state for free tier users

4. **Paid UI Flow**
   - New route: `/compliance/disclosure/:reportId`
   - Locked state with UpgradePrompt (reuse existing component)
   - Generate button → progress → rendered output
   - Basic export (JSON for v1, PDF/Word placeholders)

5. **Quality Guardrails**
   - Disclosure Quality Checklist component
   - Missing answers count, gaps severity, evidence coverage
   - Citation placeholders count (SOURCE_REQUIRED markers)
   - Standard disclaimers from ENTITLEMENTS_SPEC

### Out of Scope (Future Steps)

- ❌ Word/PDF export with formatting (Step 5)
- ❌ Custom branding and logo embedding (Step 5)
- ❌ Year-over-year comparison (Step 5)
- ❌ Peer benchmarking (Step 6)
- ❌ Multi-company management (Step 6)
- ❌ Regulatory knowledge pack with real citations (Step 7+)

---

## Architecture

### High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USER INITIATES (Paid Tier Only)                             │
│    - Navigates to /compliance/disclosure/:reportId              │
│    - UI checks tier (free → show UpgradePrompt)                 │
│    - Paid user clicks "Generate Disclosure"                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. CLIENT-SIDE (React)                                          │
│    - Fetch CompanyProfile from reports + companies              │
│    - Fetch AssessmentResult from assessment_results             │
│    - Fetch QuestionnaireResponse from questionnaire_responses   │
│    - Select template ID using selectTemplate(profile)           │
│    - Call Edge Function with payload                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. EDGE FUNCTION (Supabase)                                     │
│    - Verify authentication (JWT)                                │
│    - Check tier (pro/enterprise only) → 403 if free             │
│    - Validate input payload (Zod schema)                        │
│    - Load template structure                                    │
│    - Build prompts per section with strict guardrails           │
│    - Call Claude API (streaming response optional)              │
│    - Parse + validate AI output                                 │
│    - Return DisclosureOutput JSON                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. PERSISTENCE (Supabase)                                       │
│    - Save DisclosureOutput to disclosure_outputs table          │
│    - RLS enforces tier check on INSERT/SELECT                   │
│    - Return disclosure ID to client                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. UI RENDERING                                                 │
│    - Display sections with narratives (EN + AR toggle)          │
│    - Show Quality Checklist (gaps, evidence, citations)         │
│    - Show disclaimers (legal, methodology, limitations)         │
│    - Export buttons (JSON now, PDF/Word future)                 │
└─────────────────────────────────────────────────────────────────┘
```

### Template Structure

Each template defines:

```typescript
interface DisclosureTemplate {
  id: string; // e.g., 'UAE_LISTED_V1'
  version: string; // e.g., '1.0.0'
  jurisdiction: Jurisdiction;
  listingStatus: ListingStatus;

  sections: DisclosureTemplateSection[];
  disclaimers: DisclaimerTemplate[];

  createdAt: string;
  updatedAt: string;
}

interface DisclosureTemplateSection {
  id: string; // e.g., 'governance'
  pillar: QuestionPillar;
  title: string;
  titleArabic: string;
  order: number;

  // Prompts for AI narrative generation
  systemPrompt: string; // Role, guardrails, style
  userPromptTemplate: string; // What to write, data placeholders
  userPromptTemplateArabic: string; // Same for Arabic

  // Expected output structure
  expectedDataPoints: string[]; // e.g., ['Board composition', 'Meeting frequency']
  citationPlaceholders: string[]; // e.g., ['UAE_CORP_GOV_CODE', 'ADX_LISTING_RULES']
}

interface DisclaimerTemplate {
  type: 'legal' | 'informational' | 'methodology';
  text: string;
  textArabic: string;
  order: number;
}
```

### AI Prompt Structure (Per Section)

**System Prompt** (applies to all sections):
```
You are a corporate disclosure writer specializing in ESG and governance reporting for GCC companies.

STRICT GUARDRAILS:
1. NO LEGAL ADVICE: Never provide legal opinions or definitive compliance statements.
2. HEDGED LANGUAGE: Use "appears to," "based on provided data," "may indicate," etc.
3. NO FABRICATED CITATIONS: If a regulatory reference is needed, use placeholder format: [SOURCE_REQUIRED: UAE Corporate Governance Code, Article X]
4. EVIDENCE-BASED ONLY: Base narratives strictly on provided assessment data, scores, and user answers.
5. HIGHLIGHT GAPS: If data is missing, explicitly state "Information not provided" or "Further documentation required."
6. BILINGUAL: Provide parallel English and Arabic narratives with equivalent meaning.
7. PROFESSIONAL TONE: Formal, objective, suitable for stakeholder disclosure.

OUTPUT FORMAT:
Return a JSON object with:
{
  "narrative": "English narrative (200-400 words)",
  "narrativeArabic": "Arabic narrative (200-400 words)",
  "dataPoints": [
    {"label": "...", "value": "...", "source": "assessment_result | user_answer"}
  ],
  "citationPlaceholders": [
    "[SOURCE_REQUIRED: Regulation name, Article/Section]"
  ],
  "missingInformation": [
    "List of gaps or unanswered questions affecting this section"
  ]
}
```

**User Prompt Template** (example for Governance section):
```
Write a governance disclosure narrative for {{companyName}}, a {{listingStatus}} company in {{jurisdiction}}.

COMPANY PROFILE:
- Jurisdiction: {{jurisdiction}}
- Listing Status: {{listingStatus}}
- Stock Exchange: {{stockExchange}}
- Sector: {{sector}}
- Employee Count: {{employeeCountBand}}

ASSESSMENT RESULTS:
- Overall Score: {{overallScore}}/100
- Governance Pillar Score: {{governanceScore}}/100
- Critical Gaps: {{criticalGapCount}}
- High Gaps: {{highGapCount}}

KEY GAPS IN GOVERNANCE:
{{#each governanceGaps}}
- {{questionText}}: {{impact}} (Severity: {{severity}})
{{/each}}

RECOMMENDATIONS:
{{#each governanceRecommendations}}
- {{title}}: {{description}}
{{/each}}

QUESTIONNAIRE SUMMARY (Governance):
{{#each governanceAnswers}}
- Q: {{questionText}}
  A: {{answerValue}} {{#if evidenceUrls}}(Evidence: {{evidenceUrls}}){{/if}}
{{/each}}

TASK:
Write a 200-400 word narrative summarizing the company's governance practices, structures, and compliance readiness based ONLY on the data above. Identify strengths and weaknesses. Use hedged language. Insert citation placeholders where regulatory references would be appropriate. List any missing information that prevents full assessment.
```

### Disclosure Output Structure

```typescript
interface DisclosureOutput {
  id: string;
  reportId: string;
  assessmentId: string;

  // Template and version
  templateId: string;
  templateVersion: string;
  jurisdiction: Jurisdiction;
  listingStatus: ListingStatus;
  generatedForCompany: string;

  // Structured content
  sections: DisclosureSection[];
  evidenceAppendix: EvidenceReference[];
  disclaimers: DisclosureDisclaimer[];
  qualityChecklist: QualityChecklistItem[];

  // Metadata
  generatedAt: string;
  generatedBy: string | null; // User ID
  format: 'json' | 'pdf' | 'word'; // v1: json only
  status: 'draft' | 'final' | 'exported';

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

interface DisclosureSection {
  id: string;
  pillar: QuestionPillar;
  title: string;
  titleArabic: string;
  order: number;

  // AI-generated content
  narrative: string;
  narrativeArabic: string;

  // Extracted data points
  dataPoints: {
    label: string;
    labelArabic?: string;
    value: string;
    source: 'assessment_result' | 'user_answer' | 'calculated';
  }[];

  // Citation placeholders
  citationPlaceholders: string[]; // e.g., ['[SOURCE_REQUIRED: UAE Corp Gov Code]']

  // Gaps and missing info
  missingInformation: string[];
}

interface QualityChecklistItem {
  category: 'completeness' | 'evidence' | 'citations' | 'gaps';
  label: string;
  labelArabic: string;
  status: 'pass' | 'warning' | 'fail';
  count?: number;
  details?: string;
}
```

---

## File Structure

### New Files (Estimated 25 files)

#### Templates (12 files)
```
src/templates/disclosure/
├── index.ts                           # Template registry and loader
├── uae/
│   ├── listed.ts                      # UAE listed template
│   └── non-listed.ts                  # UAE non-listed template
├── ksa/
│   ├── listed.ts                      # KSA listed template
│   └── non-listed.ts                  # KSA non-listed template
├── qatar/
│   ├── listed.ts                      # Qatar listed template
│   └── non-listed.ts                  # Qatar non-listed template
└── types.ts                           # DisclosureTemplate interfaces
```

#### Disclosure Logic (8 files)
```
src/lib/disclosure/
├── index.ts                           # Exports
├── select-template.ts                 # Template resolver (jurisdiction + listing)
├── build-prompts.ts                   # Construct AI prompts from template + data
├── parse-ai-response.ts               # Validate and parse AI JSON output
├── generate-quality-checklist.ts      # Compute quality metrics
├── generate-disclaimers.ts            # Standard disclaimers from ENTITLEMENTS_SPEC
└── types.ts                           # Shared types
```

#### Edge Function (3 files)
```
supabase/functions/generate_disclosure/
├── index.ts                           # Main edge function
├── prompt-builder.ts                  # Build section prompts
└── guardrails.ts                      # Safety checks and validation
```

#### Hooks (1 file)
```
src/hooks/
└── use-disclosure-outputs.ts          # React Query hooks for disclosure CRUD
```

#### UI Components (6 files)
```
src/components/disclosure/
├── DisclosureSection.tsx              # Render single section (EN/AR toggle)
├── DisclosureSections.tsx             # Render all sections
├── QualityChecklist.tsx               # Display quality metrics
├── DisclaimersList.tsx                # Standard disclaimers
├── ExportButtons.tsx                  # JSON/PDF/Word export (v1: JSON only)
└── GenerateButton.tsx                 # Trigger generation with progress
```

#### Pages (1 file)
```
src/pages/
└── Disclosure.tsx                     # /compliance/disclosure/:reportId
```

#### Tests (4 files)
```
src/lib/disclosure/
├── select-template.test.ts            # Template selection logic
└── parse-ai-response.test.ts          # AI output validation

src/test/
└── disclosure.acceptance.test.ts      # E2E with mocked Edge Function
```

#### Documentation (2 files)
```
STEP4_COMPLETION.md                    # Completion summary
ARCHITECTURE.md (updated)              # Add disclosure flow
```

### Modified Files (Estimated 3 files)

1. **src/App.tsx** - Add `/compliance/disclosure/:reportId` route
2. **src/types/compliance.ts** - Add QualityChecklistItem interface (if not already present)
3. **supabase/migrations/20250120000004_create_disclosure_outputs.sql** (if schema needs fields added)

---

## Database Schema Changes

### Existing Table: `disclosure_outputs`

Current schema supports most needs. May need to add:

```sql
-- Optional additions (if not present):
ALTER TABLE disclosure_outputs ADD COLUMN IF NOT EXISTS template_id text;
ALTER TABLE disclosure_outputs ADD COLUMN IF NOT EXISTS template_version text;
ALTER TABLE disclosure_outputs ADD COLUMN IF NOT EXISTS listing_status text CHECK (listing_status IN ('listed', 'non-listed'));
ALTER TABLE disclosure_outputs ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft' CHECK (status IN ('draft', 'final', 'exported'));
ALTER TABLE disclosure_outputs ADD COLUMN IF NOT EXISTS quality_checklist jsonb DEFAULT '[]'::jsonb;
ALTER TABLE disclosure_outputs ADD COLUMN IF NOT EXISTS errors jsonb DEFAULT '[]'::jsonb;
```

**RLS Policies**: Already enforce paid tier (pro/enterprise) in existing migration.

---

## Entitlement Enforcement

### Two-Layer Protection

#### 1. UI Layer (Client-Side)
- Check user tier from `user_profiles.tier`
- If `tier === 'free'` → show `<UpgradePrompt />` (existing component)
- If `tier IN ('pro', 'enterprise')` → show Generate button

#### 2. Server Layer (Edge Function)
- Verify JWT authentication
- Query `user_profiles` joined with `companies` and `reports`
- If `tier !== 'pro' AND tier !== 'enterprise'` → return 403 with clear message:
  ```json
  {
    "error": "Disclosure generation requires Pro or Enterprise tier",
    "code": "TIER_INSUFFICIENT",
    "upgradeUrl": "/pricing"
  }
  ```

**Why Both?**
- UI layer: UX and performance (no wasted API calls)
- Server layer: Security (never trust client)

---

## AI Safety Guardrails

### Prompt Engineering

1. **System-Level Instructions** (every request):
   - "You are NOT a lawyer and must NOT provide legal advice."
   - "Use hedged language: 'appears to,' 'may indicate,' 'based on provided data.'"
   - "Never fabricate citations. Use placeholder format: [SOURCE_REQUIRED: ...]"
   - "Explicitly list missing information that prevents full assessment."

2. **Output Validation**:
   - Parse AI response as JSON (fail if invalid)
   - Check required fields: `narrative`, `narrativeArabic`, `dataPoints`, `citationPlaceholders`, `missingInformation`
   - Word count limits: 200-400 words per narrative
   - Count citation placeholders (track for quality checklist)

3. **Post-Processing**:
   - Scan narrative for forbidden phrases: "you must," "legally required," "in compliance with [specific law]"
   - Replace with hedged alternatives or flag for manual review
   - Prepend disclaimer to every section: "Based on self-reported data. Not legal advice."

### Rate Limiting & Abuse Prevention

- **Rate Limit**: Max 5 generations per user per hour (configurable)
- **Idempotency**: If disclosure already exists for reportId, return existing (unless force=true)
- **Timeout**: Edge function timeout at 60 seconds
- **Error Handling**: Structured errors with retry guidance

---

## Acceptance Criteria

### Functional Requirements

| Criterion | Definition of Done |
|-----------|-------------------|
| ✅ Template selection works | Given CompanyProfile, selectTemplate() returns correct template ID (UAE/KSA/Qatar × listed/non-listed) |
| ✅ Edge function generates output | POST /generate_disclosure returns DisclosureOutput JSON with all sections populated |
| ✅ Entitlements enforced | Free tier users get 403 from Edge Function; UI shows UpgradePrompt |
| ✅ Bilingual narratives | Each section has both `narrative` and `narrativeArabic` with equivalent meaning |
| ✅ Citation placeholders | AI never fabricates citations; uses [SOURCE_REQUIRED: ...] format |
| ✅ Quality checklist | UI displays gaps count, evidence coverage, citation placeholders count |
| ✅ Disclaimers present | All outputs include legal, methodology, and informational disclaimers |
| ✅ Persistence works | DisclosureOutput saved to DB and retrievable by reportId |
| ✅ UI renders sections | Disclosure page displays sections with EN/AR toggle |
| ✅ Export (JSON) | Download JSON button works (PDF/Word are placeholders for v2) |

### Non-Functional Requirements

| Criterion | Definition of Done |
|-----------|-------------------|
| ✅ Edge function < 60s | Generation completes within timeout |
| ✅ No AI key in browser | Claude API key only in Edge Function environment variables |
| ✅ Tests pass | Unit tests (template selection, AI parsing) + 1 integration test (mocked Edge Function) |
| ✅ Build succeeds | `npm run build` completes without errors |
| ✅ TypeScript clean | `npx tsc --noEmit` passes |
| ✅ Free tier unaffected | Existing questionnaire + assessment flows work without disclosure access |

---

## Risk Mitigation

### Risk 1: AI Hallucination (Legal Citations)
**Mitigation**:
- Explicit prompt: "Never invent citations. Use [SOURCE_REQUIRED: ...] format."
- Post-processing: Scan for citation-like patterns (e.g., "Article 5.2") and flag if not in placeholder format.
- Quality checklist shows count of placeholders (user knows they need manual review).

### Risk 2: Cost Overrun (AI API)
**Mitigation**:
- Rate limiting (5 generations/hour/user)
- Token limits in prompts (max 4000 tokens input, 1000 tokens output per section)
- Monitoring and alerts on usage spikes

### Risk 3: Poor Quality Output
**Mitigation**:
- Few-shot examples in system prompt (show good vs. bad narratives)
- Validation schema (Zod) enforces structure
- Quality checklist makes gaps transparent to user

### Risk 4: Entitlement Bypass
**Mitigation**:
- Server-side tier check (not just UI)
- RLS policies on disclosure_outputs table
- Audit log of who generated what

---

## Implementation Timeline

**Estimated Effort**: 8 tasks, sequential execution

| Task | Estimated Time | Description |
|------|---------------|-------------|
| Task 1 | 30 min | Create this plan document |
| Task 2 | 2 hours | Create 6 template variants (deterministic) |
| Task 3 | 3 hours | Implement Edge Function with AI integration |
| Task 4 | 1.5 hours | Hooks, schema migration (if needed), entitlement enforcement |
| Task 5 | 2 hours | Disclosure page UI with sections rendering |
| Task 6 | 1 hour | Quality checklist + disclaimers components |
| Task 7 | 1.5 hours | Tests (unit + integration with mocks) |
| Task 8 | 1 hour | STEP4_COMPLETION.md + ARCHITECTURE.md update |

**Total**: ~12 hours of focused implementation

---

## Future Extensions (Post-Step 4)

1. **Step 5: Advanced Export**
   - PDF generation with custom branding
   - Word export with editable narratives
   - Regulatory logo watermarks

2. **Step 6: Regulatory Knowledge Pack**
   - Replace citation placeholders with real references
   - UAE Corporate Governance Code database
   - KSA CMA rules index
   - Qatar QFMA regulations index
   - LLM-powered citation matching (semi-automated)

3. **Step 7: Year-over-Year Comparison**
   - Load previous year's disclosure
   - Generate "Changes from Last Year" section
   - Trend analysis narratives

4. **Step 8: Collaborative Review Workflow**
   - Internal review mode (draft → review → approved)
   - Comment threads on sections
   - Version history and rollback

---

## Dependencies

### External Services
- **Claude API** (Anthropic) - requires API key in Edge Function environment
- **Supabase Edge Functions** - runtime for server-side generation

### Internal Dependencies (Already Complete)
- ✅ Step 1: Domain model + database schema
- ✅ Step 2: Questionnaire UI + autosave
- ✅ Step 3: Assessment engine + results UI
- ✅ Entitlements spec (ENTITLEMENTS_SPEC.md)
- ✅ User tier in user_profiles table

### Configuration Required
- `ANTHROPIC_API_KEY` environment variable in Supabase Edge Functions
- Rate limiting configuration (max requests/hour)
- Optional: Sentry/logging for Edge Function monitoring

---

## Success Metrics (Post-Launch)

1. **Adoption**: % of paid users who generate at least one disclosure
2. **Quality**: User feedback rating on narrative quality (1-5 scale)
3. **Accuracy**: Count of citation placeholders per disclosure (lower = better, future)
4. **Performance**: P95 generation time < 45 seconds
5. **Support**: Reduction in "how do I create a disclosure?" support tickets

---

## Appendix: Example Template (UAE Listed)

```typescript
export const UAE_LISTED_TEMPLATE: DisclosureTemplate = {
  id: 'UAE_LISTED_V1',
  version: '1.0.0',
  jurisdiction: 'UAE',
  listingStatus: 'listed',

  sections: [
    {
      id: 'governance',
      pillar: 'governance',
      title: 'Corporate Governance Disclosure',
      titleArabic: 'إفصاح حوكمة الشركات',
      order: 1,

      systemPrompt: `You are a corporate disclosure writer for UAE-listed companies. Follow UAE Corporate Governance Code and ADX listing requirements. Use hedged language. Never provide legal advice. Use citation placeholders: [SOURCE_REQUIRED: ...]`,

      userPromptTemplate: `Write a governance disclosure for {{companyName}}, listed on {{stockExchange}}.

ASSESSMENT:
- Governance Score: {{governanceScore}}/100
- Critical Gaps: {{criticalGapCount}}
- Board Structure: {{boardStructureAnswer}}
- Audit Committee: {{auditCommitteeAnswer}}

TASK: 200-400 words on governance practices, board composition, committee structures. Identify strengths and gaps. Use citation placeholders for regulatory references.`,

      userPromptTemplateArabic: `اكتب إفصاحًا عن الحوكمة لشركة {{companyName}} المدرجة في {{stockExchange}}.

التقييم:
- درجة الحوكمة: {{governanceScore}}/100
- الفجوات الحرجة: {{criticalGapCount}}
- هيكل مجلس الإدارة: {{boardStructureAnswer}}
- لجنة المراجعة: {{auditCommitteeAnswer}}

المهمة: 200-400 كلمة حول ممارسات الحوكمة وتكوين المجلس وهياكل اللجان. حدد نقاط القوة والفجوات. استخدم عناصر نائبة للمراجع التنظيمية.`,

      expectedDataPoints: [
        'Board size',
        'Independent directors',
        'Board meeting frequency',
        'Committee count'
      ],

      citationPlaceholders: [
        '[SOURCE_REQUIRED: UAE Corporate Governance Code, Clause 3.1]',
        '[SOURCE_REQUIRED: ADX Listing Rules, Section 5.2]'
      ]
    },
    // ... ESG, Risk, Transparency sections
  ],

  disclaimers: [
    {
      type: 'legal',
      text: 'This disclosure is based on self-reported data and does not constitute legal or regulatory advice. Companies should consult qualified professionals for compliance guidance.',
      textArabic: 'يستند هذا الإفصاح إلى بيانات مبلغ عنها ذاتيًا ولا يشكل استشارة قانونية أو تنظيمية. يجب على الشركات استشارة متخصصين مؤهلين للحصول على إرشادات الامتثال.',
      order: 1
    },
    {
      type: 'methodology',
      text: 'Narratives generated using AI-assisted analysis of assessment results. All regulatory citations require manual verification before publication.',
      textArabic: 'تم إنشاء السرديات باستخدام تحليل بمساعدة الذكاء الاصطناعي لنتائج التقييم. تتطلب جميع الاستشهادات التنظيمية تحققًا يدويًا قبل النشر.',
      order: 2
    }
  ],

  createdAt: '2024-12-21T00:00:00Z',
  updatedAt: '2024-12-21T00:00:00Z'
};
```

---

**Plan Status**: ✅ COMPLETE
**Next Step**: Task 2 - Create disclosure templates
