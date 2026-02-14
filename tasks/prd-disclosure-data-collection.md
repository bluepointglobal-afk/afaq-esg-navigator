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

#### Phase 1: Quick Wins (5-10 minutes)
**Collect minimum viable data immediately after questionnaire**

**A. CEO/Leadership Message**
```
Your CEO or leadership team's perspective on ESG (choose format):

[ ] Write a message (2-4 paragraphs)
    [Text editor with placeholder: "Write naturally - what matters to you about sustainability?"]

[ ] OR provide bullet points (AI will craft the message)
    - Why ESG matters to our company
    - Our commitment
    - What we're focusing on
    - Future vision

Tone of Voice:
[Dropdown]
- Professional & Formal (Big 4 audit style)
- Business-focused & Pragmatic (investor-friendly)
- Authentic & Conversational (humanized, approachable)
- Technical & Detailed (for technical audiences)
- Inspiring & Visionary (forward-looking, ambitious)

Example: "As a family-run business, we've always believed in doing right by our people
and our planet. This isn't about box-ticking - it's about building a company our kids
will be proud of."

[AI will humanize and polish while keeping the authentic voice]
```

**B. Materiality Assessment (NEW - Interactive)**
```
What ESG topics matter most to YOUR business and stakeholders?

[Quick double materiality tool]:

Rate each topic (1-5) on TWO dimensions:
1. Impact on business (financial materiality)
2. Your impact on society/environment (impact materiality)

Topics to rate:
- Climate change & emissions
- Energy efficiency
- Water management
- Waste & circular economy
- Employee health & safety
- Diversity & inclusion
- Employee development
- Community relations
- Supply chain ethics
- Data privacy & security
- Business ethics & governance
- Product sustainability
- [Add custom topic]

[System generates visual materiality matrix automatically]
[AI analyzes results: "Your materiality assessment identifies Climate Change,
Employee Wellbeing, and Business Ethics as high-priority topics based on both
stakeholder importance and business impact."]
```

**C. ESG Pillars & Focus Areas**
```
Based on your materiality assessment, what are your 3-4 KEY ESG FOCUS AREAS?

[Pre-filled from materiality assessment + allow editing]

Pillar 1: _____________ (e.g., "Climate Action")
  - Why this matters to your business: (1 sentence)
  - What you're doing: (bullet points)
  - Target (if any): ___

Pillar 2: _____________ (e.g., "People First")
  - Why this matters to your business: (1 sentence)
  - What you're doing: (bullet points)
  - Target (if any): ___

Pillar 3: _____________ (e.g., "Responsible Operations")
  - Why this matters to your business: (1 sentence)
  - What you're doing: (bullet points)
  - Target (if any): ___

Pillar 4: _____________ (optional)
  - Why this matters to your business: (1 sentence)
  - What you're doing: (bullet points)
  - Target (if any): ___
```

**D. ESG Strategy (One Sentence)**
```
Sum up your ESG approach in one sentence:

[Text input with examples]:
Examples:
- "Building a carbon-neutral business while creating meaningful jobs in our community"
- "Delivering quality products sustainably while empowering our workforce"
- "Transitioning to renewable energy and supporting local suppliers"

Your strategy: _______________

[AI will weave this throughout the disclosure as the strategic thread]
```

**E. Targets & Commitments**
```
Do you have specific ESG targets?

[Dynamic form - add as many as needed]:

Target 1:
- What: _______________ (e.g., "Reduce electricity use by 25%")
- By when: _______________ (e.g., "2026")
- Baseline: _______________ (e.g., "2023: 100,000 kWh")
- Progress so far: _______________

Target 2: [+ Add another target]

[ ] We don't have formal targets yet
    → AI will generate: "While the Company has not yet established formal
       quantitative targets, we have committed to systematic emissions reduction
       through our LED retrofit program and renewable energy procurement, with
       target-setting planned for FY2025."
```

**F. Case Studies (1-3 Stories)**
```
Share 1-3 real examples of ESG actions you've taken.
These bring your disclosure to life!

Case Study 1: [+ Add case study]

Format Option 1: Quick Bullets
- What was the challenge/opportunity?
- What did you do?
- What was the result/impact?

Format Option 2: Story Mode
[Free text - write naturally, AI will structure it]

Example (bullets):
- Challenge: "High energy costs, old lighting"
- Action: "Replaced all bulbs with LEDs over 6 months"
- Impact: "30% energy reduction, £15k annual savings, happier workspace"

Example (story mode):
"Last year, our electricity bills were out of control and the old fluorescent lighting
gave everyone headaches. We decided to bite the bullet and retrofit the whole place
with LEDs. Took us 6 months working evenings and weekends. Now we're using 30% less
power, saving £15k a year, and people actually enjoy being in the office. Win-win-win."

[AI will polish into professional disclosure format while keeping authenticity]
```

**G. Governance Story (simplified)**
```
1. Who oversees ESG/sustainability at your company?
   - CEO directly
   - Board-level committee
   - Designated executive (COO, CFO, etc.)
   - Sustainability manager/coordinator
   - Team effort (informal)
   - Not formally assigned yet

2. How do you identify and manage ESG risks? (free text, 2-3 sentences)
   Write naturally - AI will formalize it.

   Example: "We talk about risks in monthly management meetings. The big ones for
   us are energy costs and keeping good people. We track what competitors are doing
   and what customers are asking for."

3. Any ESG-related policies or commitments? (checkboxes)
   - Code of conduct / Ethics policy
   - Environmental policy
   - Health & safety policy
   - Equal opportunity / Anti-discrimination
   - Whistleblower protection
   - Supplier code of conduct
   - Other: ___
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

### AI "Duct Tape" Engine - HUMANIZED VERSION

**How we turn minimal inputs into quality disclosures (while sounding human):**

**CRITICAL: Avoid AI Blatancy**
- NO "comprehensive initiatives" or "strategic investments"
- NO "demonstrating commitment" or "environmental stewardship"
- NO corporate jargon overload
- YES specific details, natural language, authentic voice
- YES acknowledge limitations honestly
- YES show the human side of business decisions

**1. Narrative Expansion (with different tone options)**

```
User input: "We switched to LED lighting, saved 30% energy"

PROFESSIONAL TONE:
"During 2024, we replaced conventional lighting with LED fixtures across all facilities.
This upgrade reduced our electricity consumption by 30%, cutting both costs and emissions.
The investment paid for itself in under two years."

AUTHENTIC TONE:
"We finally bit the bullet and replaced all our old lighting with LEDs last year. It
was a bigger job than we expected - took six months working around operations - but
the results speak for themselves. We're using 30% less electricity, which means lower
bills and a smaller carbon footprint. Should have done it years ago."

TECHNICAL TONE:
"FY2024 LED retrofit program delivered 30% electricity reduction across 15,000 sq ft
of operational space. Baseline consumption: 120,000 kWh/year. Post-retrofit: 84,000
kWh/year. Estimated Scope 2 emissions reduction: 18 tonnes CO2e annually."
```

**2. Gap Acknowledgment (honest, forward-looking)**

```
User: [No Scope 3 emissions data]

AVOID (too corporate):
"The Company currently tracks Scope 1 and Scope 2 emissions. We recognize the importance
of Scope 3 emissions accounting..."

USE (more honest):
"We're tracking our direct emissions (Scope 1) and electricity use (Scope 2), but we
haven't tackled Scope 3 yet - that's everything in our supply chain. It's on the list
for 2025. We're starting with our biggest suppliers since they make up 80% of our spend.
Rome wasn't built in a day."

OR (professional but honest):
"Our emissions accounting currently covers Scope 1 and Scope 2 emissions. Scope 3
presents a more complex challenge given our supply chain structure. We're developing
a phased approach, beginning with engagement of major suppliers in 2025."
```

**3. CEO Message Expansion**

```
User bullets:
- ESG matters because customers care
- We're a family business, thinking long-term
- Focus on energy and people
- Want to be around in 50 years

AUTHENTIC TONE OUTPUT:
"As a family-run business, we're not thinking in quarters - we're thinking in decades.
Our customers increasingly care about sustainability, and honestly, so do we. We want
to be around in 50 years, which means taking care of our energy use and our people today.
It's that simple.

This report reflects where we are on that journey. We're not perfect, and we're not
trying to claim we are. But we're taking meaningful steps: cutting our energy footprint,
investing in our workforce, and building a business we can be proud of. There's plenty
more to do, but we're committed to doing it."
```

**4. Materiality Analysis (from ratings)**

```
User rates topics 1-5 on two dimensions:
- Climate (Business: 5, Impact: 4)
- Employee Safety (Business: 5, Impact: 5)
- Diversity (Business: 3, Impact: 2)
- Water (Business: 1, Impact: 1)

AVOID (generic):
"The Company's materiality assessment identified Climate Change and Employee Safety
as high-priority topics based on stakeholder engagement..."

USE (specific and honest):
"We asked ourselves two questions about each ESG topic: Does it affect our business?
And do we affect it? The clear priorities that emerged are employee safety - it's
non-negotiable in our industry - and climate, particularly energy costs which hit our
bottom line hard. Diversity matters but we're a small team, so our impact is limited.
Water barely registers for an office-based business.

This honest assessment helps us focus resources where they matter most."
```

**5. Case Study Expansion**

```
User story mode:
"Last year, our electricity bills were out of control and the old fluorescent lighting
gave everyone headaches. We decided to bite the bullet and retrofit the whole place
with LEDs. Took us 6 months working evenings and weekends. Now we're using 30% less
power, saving £15k a year, and people actually enjoy being in the office."

PROFESSIONAL OUTPUT (keeps the human elements):
"Case Study: LED Retrofit Program

Challenge
Rising electricity costs and aging fluorescent lighting created both a financial burden
and workplace quality issues. Annual energy costs exceeded £50,000 for lighting alone.

Response
In H1 2024, we undertook a complete LED retrofit across our 15,000 sq ft facility.
Given operational constraints, the work was completed over six months during evening
shifts to avoid disrupting daily operations.

Impact
- Energy consumption: reduced by 30% (36,000 kWh annually)
- Cost savings: £15,000 per year
- Emissions reduction: 18 tonnes CO2e annually
- Workplace quality: improved lighting quality, reduced eye strain complaints

The project delivered both environmental and economic benefits while improving employee
wellbeing - a clear demonstration of ESG value creation."

[Note: Keeps specific details, acknowledges constraints, quantifies impact, but cleans
up the casual language for disclosure context]
```

**6. Target Setting (even without formal targets)**

```
User: "We don't have targets yet"

AVOID:
"While the Company has not yet established formal quantitative targets, we have committed
to systematic emissions reduction..."

USE (honest but forward-looking):
"We haven't set formal percentage targets yet - we're still establishing our baseline
and figuring out what's realistic. But we're not waiting around either. The LED project
delivered 30% energy savings. The solar panel feasibility study is underway. We're
measuring more this year so we can commit to specific numbers in 2025."

OR (if they have informal goals):
User: "Want to cut energy 50% over 5 years"

OUTPUT:
"Target: 50% energy reduction by 2028 (baseline: 2023)
Progress: 30% reduction achieved through LED retrofit (2024)
Next steps: Solar feasibility study (Q2 2025), HVAC optimization (2026)"
```

**7. Industry Context (relatable, not stuffy)**

```
User: "50 employees, 40% women"

AVOID:
"As a mid-sized organization in the sector, the Company has achieved a 40% female
workforce representation, comparing favorably to the industry average of 35%..."

USE:
"We're a 50-person team with 40% women, which is decent for our industry (manufacturing
typically sits around 35%). We don't have a formal diversity program - we just hire
good people. That said, we're conscious that our leadership team is still majority male,
and we're thinking about what succession planning looks like."
```

**8. Tone Calibration Examples**

```
SAME FACT, FOUR TONES:

Fact: "Reduced emissions 20%, installed solar panels, switched suppliers"

PROFESSIONAL & FORMAL:
"The Company achieved a 20% reduction in carbon emissions through renewable energy
procurement and on-site solar installation, complemented by sustainable sourcing initiatives."

BUSINESS-FOCUSED & PRAGMATIC:
"We cut emissions by 20% last year through three moves: solar panels on the roof,
switching to a green energy tariff, and choosing suppliers with better environmental
credentials. All three improved our competitive position with ESG-conscious clients."

AUTHENTIC & CONVERSATIONAL:
"We made some big changes last year that added up to a 20% emissions cut. Solar panels
on the roof (they're finally paying for themselves), a switch to renewable electricity,
and we started choosing suppliers based on their environmental track record, not just
price."

TECHNICAL & DETAILED:
"Emissions reduction: 20% YoY (baseline: 450 tCO2e, current: 360 tCO2e)
- Solar PV installation: 50 kW capacity, 42,000 kWh generation (Scope 2: -22 tCO2e)
- Renewable energy procurement: 100% of grid electricity (Scope 2: -68 tCO2e)
- Supply chain engagement: emissions criteria in procurement (estimated Scope 3 impact)"
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

  -- CEO/Leadership Message
  ceo_message_format TEXT, -- 'full_text' | 'bullet_points'
  ceo_message_content TEXT, -- Either full message or bullet points
  tone_of_voice TEXT, -- 'professional' | 'pragmatic' | 'authentic' | 'technical' | 'visionary'

  -- Materiality Assessment (NEW)
  materiality_ratings JSONB, -- [{topic, business_impact: 1-5, societal_impact: 1-5}]
  materiality_matrix_data JSONB, -- Generated visualization data
  materiality_analysis TEXT, -- AI-generated analysis of results

  -- ESG Pillars/Focus Areas (NEW)
  esg_pillars JSONB, -- [{name, rationale, actions: [], target}]
  esg_strategy_oneliner TEXT, -- Strategic direction in one sentence

  -- Targets & Commitments (NEW - structured)
  targets JSONB, -- [{what, by_when, baseline, progress, status}]
  has_formal_targets BOOLEAN DEFAULT FALSE,

  -- Case Studies (NEW - structured format)
  case_studies JSONB[], -- [{title, challenge, action, impact, format: 'bullets'|'story'}]

  -- Governance
  esg_oversight TEXT, -- Who oversees ESG
  risk_management TEXT, -- How ESG risks are managed
  policies JSONB, -- Array of policies/commitments

  -- Detailed narratives (Phase 2 - optional)
  climate_strategy JSONB, -- {risks, opportunities, actions}
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

1. **CEO Message Component**
   - `/src/components/narratives/CEOMessageInput.tsx`
   - Toggle between full text editor and bullet points
   - Tone of voice selector dropdown
   - Live preview of AI-expanded version
   - Character count and guidance

2. **Materiality Assessment Tool** (NEW - Key Component)
   - `/src/components/materiality/MaterialityMatrix.tsx`
   - Interactive 5x5 grid visualization
   - Drag-and-drop topics onto matrix
   - OR slider-based rating (mobile-friendly)
   - Real-time visual update
   - Auto-generate written analysis
   - Export matrix as image for disclosure

   Features:
   - Pre-populated list of common ESG topics
   - Add custom topics
   - Tooltips explaining financial vs impact materiality
   - Color-coded quadrants (High/High = priority)
   - Single-user mode (no multi-stakeholder complexity)

3. **ESG Pillars Builder**
   - `/src/components/narratives/PillarsForm.tsx`
   - Auto-suggests pillars from materiality assessment
   - 3-4 pillar cards
   - For each: name, rationale, actions, optional target
   - Drag to reorder priority

4. **Strategy One-Liner**
   - `/src/components/narratives/StrategyInput.tsx`
   - Single text input with smart examples
   - AI suggestions based on industry and pillars
   - Character limit (max 150 chars)

5. **Targets Manager**
   - `/src/components/narratives/TargetsForm.tsx`
   - Add multiple targets
   - Each target: what, when, baseline, progress
   - Visual progress bars
   - "No formal targets yet" fallback

6. **Case Studies Builder**
   - `/src/components/narratives/CaseStudiesForm.tsx`
   - Choose format: bullets or story mode
   - Template for structured input
   - Photo upload option
   - Live preview of formatted output

7. **Create Metrics Input Form**
   - `/src/components/metrics/MetricsForm.tsx`
   - Number inputs with units
   - Ranges allowed ("100-150")
   - Calculator helpers (e.g., kWh from bills)
   - Data quality indicator (estimated/measured/verified)

8. **Create Evidence Upload**
   - `/src/components/evidence/EvidenceUpload.tsx`
   - Drag-drop files
   - Preview uploaded items
   - AI extraction status

9. **Completeness Score Widget**
   - Shows data quality %
   - Recommendations for improvement
   - Celebrate milestones
   - Breakdown by section

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
