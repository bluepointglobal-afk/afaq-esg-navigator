# Step 3: Assessment Engine v1 - Implementation Plan

**Objective**: Deliver a deterministic, auditable compliance assessment engine that computes scores, identifies gaps, and generates actionable recommendations based on questionnaire responses.

**Constraints**:
- 100% deterministic (no AI, no external API calls)
- Jurisdiction-aware (UAE/KSA/Qatar)
- Listing-aware (listed/non-listed)
- Based solely on question bank metadata (weights, pillars, applicability, answer types)
- Stable, auditable, and explainable outputs
- Free tier: Assessment results visible to all users
- Paid tier: Disclosure document generation (boundary spec required)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Questionnaire Responses                       │
│              (QuestionAnswer[] + CompanyProfile)                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SCORING MODULE                              │
│  src/lib/scoring/                                                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ compute-scores.ts                                          │ │
│  │ • Per-pillar scores (0-100)                                │ │
│  │ • Overall weighted score                                   │ │
│  │ • Weighted normalization                                   │ │
│  │ • Answer type-specific scoring rules                       │ │
│  │ • Exclude conditional questions not shown                  │ │
│  │ • Handle unanswered/N/A                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GAP DETECTION MODULE                          │
│  src/lib/gaps/                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ detect-gaps.ts                                             │ │
│  │ • Identify missing/suboptimal answers                      │ │
│  │ • Severity: critical/high/medium/low                       │ │
│  │ • Derived from: weight + answer state + criticality        │ │
│  │ • Rationale + required_action + evidence_needed            │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              RECOMMENDATION GENERATION MODULE                    │
│  src/lib/recommendations/                                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ generate-recommendations.ts                                │ │
│  │ • Deterministic gap → recommendation mapping               │ │
│  │ • Maintained mapping table in src/data/recommendations/    │ │
│  │ • Effort/impact estimates                                  │ │
│  │ • "Why it matters" explanations                            │ │
│  │ • Jurisdiction-aware where relevant                        │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  ASSESSMENT ORCHESTRATOR                         │
│  src/lib/assessment/                                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ run-assessment.ts                                          │ │
│  │ • Orchestrates scoring → gaps → recommendations            │ │
│  │ • Builds explanation object                                │ │
│  │ • Returns AssessmentResult                                 │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PERSISTENCE LAYER                               │
│  src/hooks/use-assessment-results.ts                             │
│  • React Query hooks for save/load                              │
│  • Uses existing assessment_results table                       │
│  • No migration needed (schema already exists)                  │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       UI LAYER                                   │
│  src/pages/ComplianceResults.tsx (new route)                     │
│  src/components/assessment/                                      │
│  • ScoreCard.tsx - Overall + pillar scores                      │
│  • GapsList.tsx - Top gaps with severity                        │
│  • RecommendationsList.tsx - Actionable items                   │
│  • MethodologyPanel.tsx - "Explain methodology"                 │
│  • UpgradePrompt.tsx - Locked disclosure feature               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

1. **Input**: `QuestionnaireResponse` + `QuestionnaireTemplate` + `CompanyProfile`
2. **Scoring**: Compute per-pillar and overall scores using weighted normalization
3. **Gap Detection**: Identify gaps based on low scores, missing answers, critical questions
4. **Recommendation Generation**: Map gaps to actionable recommendations via lookup table
5. **Persistence**: Save `AssessmentResult` to Supabase
6. **Display**: Render results in UI with methodology explanation
7. **Boundary**: Show locked "Generate Disclosure" button for paid tier

---

## Scoring Methodology

### Answer Type-Specific Scoring Rules

#### Boolean Questions
- `true` (affirmative): **100 points** (full compliance)
- `false` (negative): **0 points** (gap identified)
- Unanswered: **0 points** (gap identified)

#### Single Choice Questions
- Each option has a `score` field (0-100) added to question bank
- Awarded score = selected option's score
- Unanswered: **0 points**

#### Multiple Choice Questions
- Each selected option contributes proportionally
- Score = (sum of selected option scores) / (sum of all option scores) × 100
- Unanswered: **0 points**

#### Number Questions
- Define `min`, `max`, `target` in question metadata
- Score = clamp((value - min) / (target - min) × 100, 0, 100)
- Example: "How many independent directors?" - min=0, target=3, max=15
- Unanswered: **0 points**

#### Percentage Questions
- Direct mapping: value = score (0-100)
- Example: "What percentage of board is independent?" - 40% → 40 points
- Unanswered: **0 points**

#### Text Questions
- Presence check only
- Non-empty text: **100 points** (disclosure provided)
- Empty/unanswered: **0 points** (gap)

#### Date Questions
- Recency check
- Define `max_age_months` in metadata
- If within max_age: **100 points**
- If older: scale linearly down to **50 points** at 2× max_age
- If beyond 2× max_age: **0 points**
- Unanswered: **0 points**

### Pillar Score Calculation

For each pillar (governance, esg, risk_controls, transparency):

```
pillar_score = Σ(question_score × question_weight) / Σ(question_weight)
```

Where:
- Only applicable questions (jurisdiction + listing status) are included
- Only visible questions (conditional logic passes) are included
- Unanswered questions score 0 but contribute to denominator

### Overall Score Calculation

```
overall_score = Σ(pillar_score × pillar_weight) / Σ(pillar_weight)
```

Pillar weights (configurable):
- Governance: **30%**
- ESG: **25%**
- Risk & Controls: **25%**
- Transparency: **20%**

---

## Gap Detection Methodology

### Severity Assignment (Deterministic)

```typescript
function determineSeverity(
  question: Question,
  answer: QuestionAnswer | undefined,
  score: number
): 'critical' | 'high' | 'medium' | 'low' {
  // Step 1: Check criticality metadata (new field added to question bank)
  if (question.criticality === 'critical' && score < 50) {
    return 'critical';
  }

  // Step 2: Check weight + score combination
  if (question.weight >= 8 && score === 0) {
    return 'critical'; // High-weight question completely unaddressed
  }

  if (question.weight >= 6 && score < 30) {
    return 'high';
  }

  if (question.weight >= 4 && score < 50) {
    return 'medium';
  }

  // Step 3: Low severity for minor gaps
  if (score < 70) {
    return 'low';
  }

  // No gap if score >= 70
  return null;
}
```

### Gap Structure

```typescript
interface Gap {
  id: string; // Generated UUID
  pillar: QuestionPillar;
  question_id: string;
  question_code: string;
  question_text: string;
  question_text_arabic?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  current_score: number; // 0-100
  rationale: string; // Auto-generated based on severity + answer state
  required_action: string; // Derived from question type + expected answer
  evidence_needed: string[]; // From question.evidenceHint
}
```

### Rationale Generation (Deterministic)

```typescript
function generateRationale(question: Question, answer: QuestionAnswer | undefined, score: number): string {
  if (!answer) {
    return `Question not answered: ${question.text}`;
  }

  if (question.type === 'boolean' && answer.value === false) {
    return `Negative response indicates gap: ${question.text}`;
  }

  if (score < 30) {
    return `Significant gap identified (score: ${score}/100): ${question.text}`;
  }

  if (score < 70) {
    return `Partial compliance (score: ${score}/100): ${question.text}`;
  }

  return `Improvement opportunity (score: ${score}/100): ${question.text}`;
}
```

---

## Recommendation Generation

### Mapping Table Structure

Located in `src/data/recommendations/gap-to-recommendation-mapping.ts`:

```typescript
interface RecommendationTemplate {
  id: string;
  // Matching criteria
  applies_to_question_codes?: string[]; // e.g., ['GOV-001', 'GOV-002']
  applies_to_pillar?: QuestionPillar;
  applies_to_severity?: GapSeverity[];
  applies_to_jurisdictions?: Jurisdiction[]; // Jurisdiction-specific recs

  // Recommendation content
  title: string;
  title_arabic?: string;
  description: string;
  description_arabic?: string;
  why_it_matters: string;
  why_it_matters_arabic?: string;

  // Effort/impact
  effort: 'low' | 'medium' | 'high'; // Implementation effort
  impact: 'low' | 'medium' | 'high'; // Business impact

  // Actions
  actions: string[]; // Step-by-step actions
  actions_arabic?: string[];
}
```

### Recommendation Generation Algorithm

1. For each gap, find matching recommendation templates
2. Match by: question_code (most specific) → pillar + severity → pillar only
3. Filter by jurisdiction if applicable
4. Return top 1-3 recommendations per gap
5. Deduplicate across gaps (same recommendation may apply to multiple gaps)
6. Sort final list by: severity DESC, impact DESC, effort ASC

---

## Question Bank Enhancements (Backward-Compatible)

Add optional metadata fields to `Question` interface:

```typescript
interface Question {
  // Existing fields...

  // NEW: Scoring metadata (optional, backward-compatible)
  criticality?: 'critical' | 'normal'; // Default: 'normal'
  scoring_rules?: {
    // For single_choice questions
    option_scores?: Record<string, number>; // option.value → score (0-100)

    // For number questions
    min?: number;
    target?: number;
    max?: number;

    // For date questions
    max_age_months?: number;
  };
}
```

Update question bank files to include scoring metadata for key questions. Example:

```typescript
// governance.ts
{
  id: 'GOV-001-uuid',
  code: 'GOV-001',
  text: 'Does your company have a formal board of directors?',
  type: 'boolean',
  weight: 8,
  criticality: 'critical', // NEW
  // ... rest of fields
}
```

---

## Free vs Paid Boundary Specification

### Free Tier (Current)
- ✅ Complete questionnaire
- ✅ View assessment results (scores, gaps, recommendations)
- ✅ Export results as PDF (basic)
- ✅ Methodology explanation

### Paid Tier (Future - Step 4+)
- 🔒 **Disclosure Generator**: AI-powered narrative generation using:
  - Company profile data
  - Assessment results
  - Jurisdiction-specific templates
  - Regulatory citation engine
- 🔒 Advanced analytics dashboard
- 🔒 Year-over-year comparison
- 🔒 Peer benchmarking

### UI Copy (Exact Strings)

**Free Compliance Check**:
```
Title: "Free Compliance Assessment"
Description: "Complete our questionnaire to receive instant compliance scores, gap analysis, and actionable recommendations."
```

**Results Page Header**:
```
Title: "Your Compliance Assessment Results"
Subtitle: "Based on {question_count} questions across {pillar_count} pillars"
Disclaimer: "This assessment provides educational insights only and does not constitute legal or regulatory advice. Consult qualified professionals for compliance guidance."
```

**Locked Disclosure Section**:
```
Title: "Generate Disclosure Report"
Lock Icon: 🔒
Message: "Upgrade to Pro to generate jurisdiction-compliant disclosure narratives based on your assessment results."
Button: "Upgrade to Pro"
Features List:
• AI-powered disclosure narrative generation
• Jurisdiction-specific templates (UAE, KSA, Qatar)
• Regulatory citation engine
• Export to Word/PDF
• Year-over-year tracking
```

**Methodology Panel**:
```
Title: "How We Calculate Your Score"
Content: "Your compliance score is calculated using a transparent, deterministic methodology:

1. Question Weighting: Each question has a weight (1-10) based on regulatory importance.
2. Answer Scoring: Answers are scored 0-100 based on best practices for each question type.
3. Pillar Scores: Weighted average of questions within each pillar (Governance, ESG, Risk & Controls, Transparency).
4. Overall Score: Weighted average across all pillars (Governance 30%, ESG 25%, Risk 25%, Transparency 20%).

Gap Severity: Determined by question weight, answer quality, and criticality flags.
Recommendations: Matched from a curated database based on your specific gaps."
```

---

## DB Schema (Existing - No Migration Needed)

The `assessment_results` table already exists with the correct schema:

```sql
CREATE TABLE assessment_results (
  id uuid PRIMARY KEY,
  report_id uuid REFERENCES reports(id),
  questionnaire_response_id uuid REFERENCES questionnaire_responses(id),
  overall_score numeric(5,2) CHECK (overall_score >= 0 AND overall_score <= 100),
  pillar_scores jsonb, -- Array of {pillar, score, question_count, answered_count}
  gaps jsonb, -- Array of Gap objects
  gap_count integer,
  critical_gap_count integer,
  recommendations jsonb, -- Array of Recommendation objects
  explanation jsonb, -- Methodology explanation + scoring breakdown
  assessed_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
);
```

RLS policies already enforce FREE tier access (all authenticated users can view/create their company's assessments).

---

## Implementation Tasks

### Task 2: Scoring Module
**File**: `src/lib/scoring/compute-scores.ts`
- Implement answer type-specific scoring functions
- Compute per-pillar scores with weighted normalization
- Compute overall score
- Handle conditional questions (exclude if not shown)
- Handle unanswered questions (score = 0)
- Export `computeScores(template, responses, companyProfile)`

### Task 3: Gap Detection Module
**File**: `src/lib/gaps/detect-gaps.ts`
- Implement severity determination logic
- Generate rationale strings
- Derive required_action from question type
- Extract evidence_needed from question metadata
- Export `detectGaps(template, responses, scores)`

### Task 4: Recommendation Generation
**Files**:
- `src/data/recommendations/gap-to-recommendation-mapping.ts` - Mapping table
- `src/lib/recommendations/generate-recommendations.ts` - Matching logic
- Create 10-15 recommendation templates covering common gaps
- Implement jurisdiction-aware filtering
- Export `generateRecommendations(gaps, companyProfile)`

### Task 5: DB Persistence
**File**: `src/hooks/use-assessment-results.ts`
- `useAssessmentResult(reportId)` - Fetch
- `useCreateAssessment()` - Create
- `useUpdateAssessment()` - Update
- React Query with cache invalidation

### Task 6: UI Integration
**New Route**: `/compliance/results/:reportId`
**Components**:
- `src/pages/ComplianceResults.tsx` - Main page
- `src/components/assessment/ScoreCard.tsx` - Score display
- `src/components/assessment/GapsList.tsx` - Gaps table
- `src/components/assessment/RecommendationsList.tsx` - Recommendations
- `src/components/assessment/MethodologyPanel.tsx` - Explanation
- `src/components/assessment/UpgradePrompt.tsx` - Paid tier CTA

Add "View Results" button to Questionnaire page when completion > 0%.

### Task 7: Entitlements Spec
**File**: `ENTITLEMENTS_SPEC.md`
- Document free vs paid features
- UI copy strings
- Legal disclaimers
- Upgrade flow description

### Task 8: Testing
**Files**:
- `src/lib/scoring/compute-scores.test.ts` - Unit tests for scoring
- `src/lib/gaps/detect-gaps.test.ts` - Unit tests for gap severity
- `src/test/assessment.acceptance.test.ts` - E2E tests with seeded data
- Verify deterministic outputs (same inputs → same outputs)
- Test UAE listed vs KSA non-listed scenarios

### Task 9: Completion Doc
**File**: `STEP3_COMPLETION.md`
- Summary of files changed
- Scoring methodology explanation
- Gap derivation logic
- Free/paid boundary copy
- Verification commands

---

## Acceptance Criteria

✅ **Scoring works correctly**:
- Per-pillar scores (0-100) computed for all 4 pillars
- Overall score (0-100) computed with correct weighting
- Unanswered questions handled (score = 0)
- Conditional questions excluded if not shown
- All answer types scored per specification

✅ **Gap detection is deterministic**:
- Severity (critical/high/medium/low) assigned consistently
- Same inputs always produce same gaps
- Rationale strings generated automatically
- Required actions derived from question context

✅ **Recommendations are actionable**:
- 1-3 recommendations per gap
- Effort/impact estimates provided
- Jurisdiction-aware where relevant
- "Why it matters" explanations included

✅ **Results persist to DB**:
- AssessmentResult saved to `assessment_results` table
- React Query hooks work (fetch/create/update)
- RLS policies enforced (free tier access)

✅ **UI displays results**:
- New route `/compliance/results/:reportId` accessible
- Score cards show overall + pillar scores
- Gaps list with severity indicators
- Recommendations list with actions
- Methodology panel explains scoring
- Locked disclosure section with upgrade CTA

✅ **Free/paid boundary clear**:
- Assessment results fully accessible (FREE)
- Disclosure generator locked with clear messaging
- Upgrade button visible with feature list
- Disclaimers present (not legal advice)

✅ **Tests pass**:
- `npm test` succeeds (all unit + acceptance tests)
- `npm run build` succeeds
- Deterministic outputs verified
- UAE listed vs KSA non-listed test cases

---

## Assumptions & Design Decisions

1. **Criticality Metadata**: Add optional `criticality` field to question bank without breaking Step 2. Default to 'normal' if not specified.

2. **Option Scores**: For single/multi choice questions, if `scoring_rules.option_scores` not defined, use heuristic: first option = 100, last option = 0, interpolate linearly.

3. **Pillar Weights**: Fixed at Governance 30%, ESG 25%, Risk 25%, Transparency 20%. Make configurable in future if needed.

4. **Recommendation Limit**: Return top 10 recommendations max to avoid overwhelming users. Prioritize by severity → impact → effort.

5. **Text Question Scoring**: Simple presence check (100 if non-empty, 0 if empty). Future: add sentiment/keyword analysis for nuance.

6. **Date Question Scoring**: Recency-based. Default `max_age_months = 12` if not specified.

7. **Explanation Object**: Include scoring breakdown (question-by-question) for full transparency. Users can drill down into how each question contributed.

8. **Gap Threshold**: Only create gaps for questions scoring < 70. Don't overwhelm users with minor issues.

9. **Jurisdiction-Specific Recommendations**: Only a subset of recommendations are jurisdiction-specific (e.g., "Comply with UAE Corporate Governance Code"). Most are universal.

10. **Determinism Guarantee**: No external API calls, no randomness, no AI inference. All logic is pure functions with explicit rules.

---

**Next Step**: Begin Task 2 - Implement scoring module in `src/lib/scoring/compute-scores.ts`
