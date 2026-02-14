# PRD: ESG Disclosure Data Collection for SMEs

## Problem Statement

Currently, disclosure generation fails because users complete the questionnaire but aren't prompted to provide:
- Qualitative narratives (strategy, initiatives, case studies)
- Quantitative metrics (emissions, energy, water, diversity, etc.)
- Supporting evidence and documentation

**Result:** AI generates incomplete/low-quality disclosures from questionnaire data alone.

## Research: FTSE100 & Big 4 Reports Analysis

### What High-Quality ESG Reports Include

**1. GOVERNANCE NARRATIVE**
- Board oversight of ESG/climate
- Management accountability structures
- Risk governance processes
- Integration with strategy

**2. STRATEGY NARRATIVE**
- Climate risks and opportunities identified
- Impact on business model
- Scenario analysis (if conducted)
- Strategic response and resilience

**3. RISK MANAGEMENT NARRATIVE**
- How ESG risks are identified
- Assessment and prioritization processes
- Integration with enterprise risk management
- Case examples of risk mitigation

**4. METRICS & TARGETS**
- GHG emissions (Scope 1, 2, 3)
- Energy consumption and intensity
- Water usage
- Waste generation and recycling
- Diversity metrics (gender, age, ethnicity)
- Health & safety (incidents, training hours)
- Targets with baseline and timelines

**5. PERFORMANCE NARRATIVES**
- Progress against targets
- Key initiatives and their impact
- Challenges faced and lessons learned
- Stakeholder engagement outcomes

### The SME Challenge

**What SMEs typically DON'T have:**
- Formal ESG governance committees
- Comprehensive GHG accounting (especially Scope 3)
- Scenario analysis
- Verified/audited data
- Dedicated ESG resources

**What SMEs CAN provide:**
- Basic operational metrics (rough estimates OK)
- Description of informal practices
- High-level commitments
- Examples of initiatives (even small ones)
- Basic governance structure

## Solution: "Duct Tape" Data Collection

### Design Principles

1. **Progressive Disclosure**: Start simple, add detail over time
2. **Smart Defaults**: Pre-fill with industry benchmarks, allow override
3. **Narrative from Bullets**: Convert bullet points to polished narratives
4. **Estimate-Friendly**: Accept ranges and rough numbers
5. **Explain Gaps**: Allow "Not yet implemented" with rationale
6. **AI Augmentation**: Generate narratives from minimal inputs

### Data Collection Structure

#### Phase 1: Quick Wins (5 minutes)
**Collect minimum viable data immediately after questionnaire**

**A. Governance Story (3 questions)**
```
1. Who oversees ESG/sustainability at your company?
   - Board level
   - Executive team
   - Dedicated role/committee
   - Informal responsibility
   - Not yet assigned

2. How do you identify and manage ESG risks? (free text, 2-3 sentences)
   [AI will expand this into full narrative]

3. Any ESG-related policies or commitments? (bullet points)
   - Code of conduct
   - Environmental policy
   - Diversity commitment
   - Other: ___
```

**B. Strategy Highlights (3 questions)**
```
1. What are your top 2-3 ESG priorities? (checkboxes + custom)
   - Climate action / Net zero
   - Employee wellbeing
   - Diversity & inclusion
   - Circular economy
   - Community engagement
   - Other: ___

2. Describe one ESG initiative you're proud of (2-3 sentences)
   [Example: "We switched to LED lighting across all facilities, reducing energy use by 30%"]

3. Do you have any ESG targets or goals?
   - Yes → What are they? (bullet points)
   - Not yet → What's stopping you? (optional feedback for AI context)
```

**C. Quick Metrics (5-10 key metrics)**
```
We'll use these to generate your metrics table. Estimates are fine!

EMISSIONS (if known):
- Scope 1 (direct): ___ tonnes CO2e/year
- Scope 2 (electricity): ___ tonnes CO2e/year
- Scope 3: [ ] Not calculated yet

ENERGY:
- Total consumption: ___ kWh/year (or estimate from bills)
- Renewable %: ___% (0% if none)

WORKFORCE:
- Total employees: ___
- % Women: ___%
- % Women in leadership: ___%
- Employee turnover: ___%
- Training hours/employee: ___

HEALTH & SAFETY:
- Lost time injuries: ___
- Safety training hours: ___

[ ] I don't have these numbers yet
   → AI will generate narrative explaining data gaps and improvement plans
```

#### Phase 2: Rich Context (Optional - 10 more minutes)
**For users who want higher quality disclosures**

**D. Detailed Narratives**
```
1. Climate Strategy (if applicable)
   - What climate risks affect your business? (free text)
   - What opportunities? (free text)
   - What are you doing about it? (bullet points)

2. Case Studies (up to 3)
   [Template for each]:
   - Initiative name: ___
   - Challenge/opportunity: ___
   - What you did: ___
   - Impact/results: ___

3. Stakeholder Engagement
   - How do you engage with stakeholders on ESG? (free text)
   - Key feedback received: (bullet points)
```

**E. Evidence Upload**
```
Upload supporting documents (optional but recommended):
- Photos of initiatives
- Utility bills (for energy data)
- Diversity reports
- Safety records
- Sustainability report (if you have one)

[AI will extract data and reference in disclosure]
```

### AI "Duct Tape" Engine

**How we turn minimal inputs into quality disclosures:**

**1. Narrative Expansion**
```
User input: "We switched to LED lighting, saved 30% energy"

AI output: "In FY2024, the Company undertook a comprehensive LED retrofit across
all operational facilities, representing a strategic investment in energy efficiency.
This initiative resulted in a 30% reduction in electricity consumption, demonstrating
our commitment to operational excellence and environmental stewardship. The project
not only reduced our Scope 2 emissions but also generated cost savings that were
reinvested into further sustainability initiatives."
```

**2. Gap Acknowledgment**
```
User: [No Scope 3 emissions data]

AI output: "The Company currently tracks Scope 1 and Scope 2 emissions. We recognize
the importance of Scope 3 emissions accounting and have committed to implementing
comprehensive value chain emissions tracking in FY2025, beginning with our top
suppliers representing 80% of procurement spend."
```

**3. Industry Context**
```
User: "50 employees, 40% women, no formal diversity program"

AI output: "As a mid-sized organization in the [industry] sector, the Company has
achieved a 40% female workforce representation, comparing favorably to the industry
average of 35%. While we do not yet have a formalized diversity and inclusion program,
our leadership team is actively developing a structured approach to ensure continued
progress on this important dimension of our ESG performance."
```

**4. Forward-Looking from Current State**
```
User: "We recycle paper and plastic in the office"

AI output: "The Company has implemented baseline waste management practices including
paper and plastic recycling across office locations. Looking ahead, we are conducting
a comprehensive waste audit to identify opportunities for circular economy principles,
targeting a 50% waste diversion rate by 2026."
```

### User Flow

```
1. Complete Questionnaire (existing)
   ↓
2. "Let's add context for your disclosure" (NEW)
   ↓
3. Phase 1: Quick Data (5 min) - REQUIRED for paid workflow
   - Governance story
   - Strategy highlights
   - Quick metrics
   ↓
4. Phase 2: Rich Context (10 min) - OPTIONAL
   - Detailed narratives
   - Case studies
   - Evidence upload
   ↓
5. Review data completeness score
   [Progress bar: 60% complete - Good enough for first disclosure!]
   [Want better? Add case studies +15%, Upload evidence +10%]
   ↓
6. Generate Disclosure (Railway backend)
   - Fetches questionnaire + narratives + metrics
   - AI creates polished disclosure with duct-taped narratives
   - Flags data gaps with improvement roadmap
   ↓
7. Disclosure Output
   - Generated disclosure sections
   - Data completeness score
   - Recommendations for improvement
   - "Add more data and regenerate anytime"
```

## Database Schema Additions

### New Table: `report_narratives_v2`
```sql
CREATE TABLE report_narratives_v2 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,

  -- Governance
  esg_oversight TEXT, -- Who oversees ESG
  risk_management TEXT, -- How ESG risks are managed
  policies JSONB, -- Array of policies/commitments

  -- Strategy
  esg_priorities TEXT[], -- Top ESG priorities
  proud_initiative TEXT, -- One initiative they're proud of
  targets JSONB, -- {hasTargets: bool, targets: [...], blockers: "..."}

  -- Detailed narratives (Phase 2 - optional)
  climate_strategy JSONB, -- {risks, opportunities, actions}
  case_studies JSONB[], -- [{name, challenge, action, impact}]
  stakeholder_engagement TEXT,

  -- Metadata
  completeness_score INTEGER, -- 0-100
  phase_completed INTEGER, -- 1 or 2
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### New Table: `report_metrics_v2`
```sql
CREATE TABLE report_metrics_v2 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,

  -- Emissions (all nullable - OK if not available)
  scope1_tonnes_co2e NUMERIC,
  scope2_tonnes_co2e NUMERIC,
  scope3_calculated BOOLEAN DEFAULT FALSE,

  -- Energy
  total_energy_kwh NUMERIC,
  renewable_energy_percent NUMERIC,

  -- Workforce
  total_employees INTEGER,
  percent_women NUMERIC,
  percent_women_leadership NUMERIC,
  employee_turnover_percent NUMERIC,
  training_hours_per_employee NUMERIC,

  -- Health & Safety
  lost_time_injuries INTEGER,
  safety_training_hours NUMERIC,

  -- Metadata
  data_quality TEXT, -- 'estimated' | 'measured' | 'verified'
  baseline_year INTEGER,
  notes TEXT, -- Explain gaps or methodology

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### New Table: `report_evidence`
```sql
CREATE TABLE report_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,

  file_name TEXT NOT NULL,
  file_type TEXT, -- 'image' | 'pdf' | 'spreadsheet'
  storage_path TEXT, -- Supabase Storage path
  file_size_bytes INTEGER,

  evidence_type TEXT, -- 'initiative_photo' | 'utility_bill' | 'policy_doc'
  description TEXT,
  extracted_data JSONB, -- AI-extracted structured data

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Implementation Tasks

### Frontend (React Components)

1. **Create Narrative Collection Form**
   - `/src/components/narratives/NarrativeForm.tsx`
   - Multi-step wizard after questionnaire
   - Auto-save as user types
   - Smart placeholders and examples

2. **Create Metrics Input Form**
   - `/src/components/metrics/MetricsForm.tsx`
   - Number inputs with units
   - Ranges allowed ("100-150")
   - Calculator helpers (e.g., kWh from bills)

3. **Create Evidence Upload**
   - `/src/components/evidence/EvidenceUpload.tsx`
   - Drag-drop files
   - Preview uploaded items
   - AI extraction status

4. **Completeness Score Widget**
   - Shows data quality %
   - Recommendations for improvement
   - Celebrate milestones

### Backend (API Endpoints)

1. **POST `/api/narratives`** - Save narrative data
2. **POST `/api/metrics`** - Save metrics data
3. **POST `/api/evidence`** - Upload and process evidence
4. **GET `/api/completeness/:reportId`** - Calculate score

### AI Service Updates

1. **Enhance `generateDisclosureContent()`**
   - Accept narratives and metrics
   - Apply duct-tape expansion logic
   - Generate gap explanations
   - Create improvement roadmap

2. **Create `expandNarrative()` function**
   - Takes bullet points → full narrative
   - Industry context injection
   - Compliance language

3. **Create `generateGapExplanation()` function**
   - Acknowledges missing data
   - Explains limitations
   - Proposes timeline for improvement

## Success Criteria

1. **Users can complete basic data collection in <5 minutes**
2. **Disclosures generated from minimal data are coherent and professional**
3. **Data gaps are transparently acknowledged with improvement plans**
4. **Completeness score helps users understand quality**
5. **SMEs feel disclosure is representative even with limited data**

## Future Enhancements

- Import data from accounting/HR systems
- Industry-specific metric templates
- Peer benchmarking
- Multi-year trend tracking
- Auto-suggest targets based on baseline
