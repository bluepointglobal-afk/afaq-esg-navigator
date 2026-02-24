import axios from 'axios';
import { logger } from '../utils/logger';

interface GenerateDisclosureParams {
  companyProfile: {
    id: string;
    name: string;
    industry: string;
    country: string;
  };
  frameworks: string[];
  questionnaireResponse: any;
  narratives: any;
  metrics: any[];
  assessment: any;
}

/**
 * Generate disclosure content using AI (OpenRouter/Claude)
 * No timeout constraints - can take 30-60 seconds
 */
export async function generateDisclosureContent(params: GenerateDisclosureParams) {
  const {
    companyProfile,
    frameworks,
    questionnaireResponse,
    narratives,
    metrics,
    assessment,
  } = params;

  logger.info('Generating disclosure with AI', {
    company: companyProfile.name,
    frameworks,
  });

  // Build prompt for AI
  const prompt = buildDisclosurePrompt(params);

  // Call OpenRouter API (Claude model)
  let response;
  try {
    response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: `You are AFAQ's ESG Intelligence Engine — an AI system embodying 30+ years of C-level ESG advisory experience across the GCC. You are the equivalent of a Senior Partner at a Big 4 firm who has:

- Led 200+ ESG engagements across Saudi Arabia, UAE, Qatar, Bahrain, Kuwait, and Oman
- Advised sovereign wealth funds (PIF, QIA, Mubadala, ADIA) on portfolio ESG strategy
- Guided IPO-track companies through Tadawul, ADX, QSE, and DFM disclosure requirements
- Sat on ESG committees of GCC family conglomerates navigating generational transitions
- Deep expertise in GCC-specific dynamics: Saudization/Emiratization quotas, water scarcity as Scope 3 multiplier, circular carbon economy positioning, Islamic finance ESG alignment

Your mandate: Transform fragmented company inputs into an investor-grade ESG Disclosure Report that would make a Big 4 partner say: "This is better than what my team of 6 produced in 8 weeks."

CORE PRINCIPLES:
1. Never fabricate data — if you can't estimate with defensible methodology, mark as gap
2. Never greenwash — if performance is poor, acknowledge with remediation pathway
3. Always apply Double Materiality (Impact × Financial) with GCC-specific context
4. Every estimate must declare its tier (Tier 1-4), methodology, and uncertainty range
5. Every gap must have an improvement roadmap
6. Financial context always — investors read ESG reports, show the business case
7. Honest but confident — "We made measurable progress" not "We are industry leaders"
8. Quantify everything — never "we care deeply", always "we invested SAR X achieving Y outcome"`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4, // Slightly higher for more sophisticated output
        max_tokens: 16000, // Doubled for Big 4-level depth
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.FRONTEND_URL,
          'X-Title': 'AFAQ ESG Navigator',
        },
        timeout: 90000, // 90 second timeout (plenty of time)
      }
    );
  } catch (error: any) {
    logger.error('OpenRouter API call failed', {
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw new Error(`AI API call failed: ${error.message}`);
  }

  // Validate API response structure
  if (!response.data) {
    logger.error('OpenRouter returned no data', { response });
    throw new Error('AI API returned empty response');
  }

  if (!response.data.choices || !Array.isArray(response.data.choices) || response.data.choices.length === 0) {
    logger.error('OpenRouter returned no choices', { data: response.data });
    throw new Error('AI API returned invalid response format');
  }

  const firstChoice = response.data.choices[0];
  if (!firstChoice?.message?.content) {
    logger.error('OpenRouter choice missing content', { choice: firstChoice });
    throw new Error('AI API returned empty content');
  }

  const aiContent = firstChoice.message.content;

  // Parse AI response into structured disclosure
  const disclosure = parseDisclosureResponse(aiContent, companyProfile, frameworks);

  return disclosure;
}

function buildDisclosurePrompt(params: GenerateDisclosureParams): string {
  const { companyProfile, frameworks, questionnaireResponse, narratives, metrics, assessment } = params;

  // ═══════════════════════════════════════════════════════════
  // PHASE 1: ENTITY CLASSIFICATION & REGULATORY SCAN
  // ═══════════════════════════════════════════════════════════

  const jurisdiction = companyProfile.country || 'UAE';
  const industry = companyProfile.industry || 'Unknown';

  // Determine regulatory framework based on jurisdiction
  let regulatoryFramework = 'GRI';
  let exchangeRequirements = '';

  if (jurisdiction === 'Saudi Arabia' || jurisdiction === 'KSA') {
    regulatoryFramework = 'ISSB S1/S2 (mandatory via CMA)';
    exchangeRequirements = 'Tadawul ESG Disclosure Guide';
  } else if (jurisdiction === 'UAE' || jurisdiction === 'United Arab Emirates') {
    regulatoryFramework = 'ISSB S1/S2 (mandatory 2025+)';
    exchangeRequirements = 'ADX ESG Guide / DFSA TCFD alignment';
  } else if (jurisdiction === 'Qatar') {
    regulatoryFramework = 'GRI recommended';
    exchangeRequirements = 'QSE 34 KPI template (voluntary moving mandatory)';
  }

  // ═══════════════════════════════════════════════════════════
  // PHASE 2: DATA INVENTORY WITH TIER CLASSIFICATION
  // ═══════════════════════════════════════════════════════════

  // Extract data from disclosure_narratives structure
  const toneOfVoice = narratives?.tone_of_voice || 'professional';
  const ceoMessage = narratives?.ceo_message_content || '';
  const ceoFormat = narratives?.ceo_message_format || 'bullet_points';
  const materialityRatings = narratives?.materiality_ratings || [];
  const esgPillars = narratives?.esg_pillars || [];
  const strategy = narratives?.esg_strategy_oneliner || '';
  const targets = narratives?.targets || [];
  const caseStudies = narratives?.case_studies || [];

  // Classify metrics by data tier
  const tier1Metrics = metrics?.filter((m: any) => m.data_tier === 1 || m.data_source === 'utility_bill') || [];
  const tier2Metrics = metrics?.filter((m: any) => m.data_tier === 2 || m.data_source === 'calculated') || [];
  const tier3Metrics = metrics?.filter((m: any) => m.data_tier === 3 || m.data_source === 'benchmark') || [];
  const tier4Metrics = metrics?.filter((m: any) => m.data_tier === 4) || [];

  const dataCoverage = {
    tier1: tier1Metrics.length,
    tier2: tier2Metrics.length,
    tier3: tier3Metrics.length,
    tier4: tier4Metrics.length,
    total: metrics?.length || 0,
    maturityScore: Math.round((tier1Metrics.length * 100 + tier2Metrics.length * 70 + tier3Metrics.length * 40) / Math.max((metrics?.length || 1) * 100, 1) * 100)
  };

  // ═══════════════════════════════════════════════════════════
  // PHASE 3: DOUBLE MATERIALITY MATRIX
  // ═══════════════════════════════════════════════════════════

  const doubleMaterialityText = materialityRatings.length > 0
    ? materialityRatings.map((r: any) => {
        const impactScore = r.societal_impact || 0;
        const financialScore = r.business_impact || 0;
        const classification = (impactScore >= 4 || financialScore >= 4) ? 'MATERIAL' :
                               (impactScore >= 3 || financialScore >= 3) ? 'WATCH' : 'NOT MATERIAL';

        return `━━━ ${r.topic} ━━━
│ Impact Materiality: ${impactScore}/5 (Societal) — ${impactScore >= 4 ? 'HIGH' : impactScore >= 3 ? 'MEDIUM' : 'LOW'}
│ Financial Materiality: ${financialScore}/5 (Business) — ${financialScore >= 4 ? 'HIGH' : financialScore >= 3 ? 'MEDIUM' : 'LOW'}
│ Classification: ${classification}
│ Priority: ${classification === 'MATERIAL' ? 'Must Report' : classification === 'WATCH' ? 'Should Report' : 'May Report'}`;
      }).join('\n\n')
    : 'No materiality assessment provided';

  // ═══════════════════════════════════════════════════════════
  // PHASE 4: STRUCTURED DATA PRESENTATION
  // ═══════════════════════════════════════════════════════════

  // Build pillars section with actions
  const pillarsText = esgPillars.length > 0
    ? esgPillars.map((p: any) =>
        `━━━ ${p.name} ━━━
│ Rationale: ${p.rationale}
│ Actions: ${p.actions?.join('; ') || 'Not specified'}
│ Target: ${p.target || 'Not specified'}`
      ).join('\n\n')
    : 'Not provided';

  // Build targets with baseline and progress tracking
  const targetsText = targets.length > 0
    ? targets.map((t: any) =>
        `━━━ ${t.what} ━━━
│ Timeline: ${t.by_when}
│ Baseline: ${t.baseline}
│ Progress: ${t.progress || 'Not yet tracked'}
│ Status: ${t.status || 'In progress'}
│ Owner: ${t.owner || 'To be assigned'}`
      ).join('\n\n')
    : 'No formal targets established yet';

  // Build case studies with Challenge-Action-Impact framework
  const caseStudiesText = caseStudies.length > 0
    ? caseStudies.map((cs: any, idx: number) =>
        `━━━ CASE STUDY ${idx + 1}${cs.title ? `: ${cs.title}` : ''} ━━━
│ CHALLENGE: ${cs.challenge}
│ ACTION: ${cs.action}
│ IMPACT: ${cs.impact}
│ Pillar: ${cs.pillar || 'General ESG'}`
      ).join('\n\n')
    : 'No case studies provided yet';

  return `═══════════════════════════════════════════════════════════════════════
AFAQ ESG INTELLIGENCE ENGINE — DISCLOSURE GENERATION
═══════════════════════════════════════════════════════════════════════

Your task: Generate an investor-grade, Big 4-quality ESG Disclosure Report that transforms the fragmented inputs below into a compelling narrative worthy of annual reporting.

═══════════════════════════════════════════════════════════════════════
SECTION 1: ENTITY CLASSIFICATION
═══════════════════════════════════════════════════════════════════════

Company: ${companyProfile.name}
Industry: ${industry}
Jurisdiction: ${jurisdiction}
Primary Framework: ${regulatoryFramework}
Exchange Requirements: ${exchangeRequirements}
Selected Frameworks: ${frameworks.join(', ')}

GCC-Specific Materiality Overrides (ALWAYS MATERIAL in this region):
✓ Nationalization quotas (Saudization/Emiratization/Qatarization)
✓ Water stewardship (existential water scarcity region)
✓ Heat stress and outdoor worker welfare (ILO midday work bans)
✓ Energy transition positioning (post-hydrocarbon economy readiness)
✓ Supply chain labor rights (kafala system legacy, migrant worker welfare)
✓ Local content and SME development (Vision 2030/2035 alignment)
✓ Circular carbon economy (CCUS, blue/green hydrogen, not just renewables)

═══════════════════════════════════════════════════════════════════════
SECTION 2: DATA INVENTORY & MATURITY ASSESSMENT
═══════════════════════════════════════════════════════════════════════

Data Maturity Score: ${dataCoverage.maturityScore}%
├── Tier 1 (Actual measured): ${dataCoverage.tier1} metrics
├── Tier 2 (Activity-based calculation): ${dataCoverage.tier2} metrics
├── Tier 3 (Industry benchmark adjusted): ${dataCoverage.tier3} metrics
└── Tier 4 (Pure benchmark - Year 1 only): ${dataCoverage.tier4} metrics

Total Metrics: ${dataCoverage.total}

TONE CALIBRATION: "${toneOfVoice}"
- professional: Big 4 audit style - Formal, rigorous, compliance-focused, investor-ready
- pragmatic: Business case emphasis - ROI linkage, financial materiality, strategic value
- authentic: Honest yet confident - Acknowledge gaps, show progress, avoid greenwashing
- technical: Data-driven - Methodologies, emission factors, calculation transparency
- visionary: Transformational - Vision 2030 alignment, leadership positioning, bold commitments

═══════════════════════════════════════════════════════════════════════
SECTION 3: LEADERSHIP MESSAGE INPUT
═══════════════════════════════════════════════════════════════════════

Format: ${ceoFormat === 'bullet_points' ? 'BULLET POINTS (transform into 300-400 word flowing narrative)' : 'DRAFT TEXT (polish and structure)'}

${ceoMessage || '*** CEO message not provided yet — create placeholder acknowledging this is planned for next reporting cycle ***'}

═══════════════════════════════════════════════════════════════════════
SECTION 4: DOUBLE MATERIALITY ASSESSMENT
═══════════════════════════════════════════════════════════════════════

${doubleMaterialityText}

═══════════════════════════════════════════════════════════════════════
SECTION 5: ESG STRATEGY & PILLARS
═══════════════════════════════════════════════════════════════════════

Strategy One-Liner:
${strategy || '*** Not provided — generate based on materiality and industry context ***'}

ESG Pillars & Action Plans:
${pillarsText}

═══════════════════════════════════════════════════════════════════════
SECTION 6: TARGETS & COMMITMENTS
═══════════════════════════════════════════════════════════════════════

${targetsText}

${targets.length === 0 ? `
*** No formal targets provided yet ***
REQUIRED: Generate a "Future Targets Development" section acknowledging:
- "We are in the process of establishing quantified ESG targets aligned with our materiality assessment"
- "Priority target areas identified: [infer from materiality matrix]"
- "Target-setting roadmap: H1 2026 for climate, H2 2026 for social metrics"
- This builds credibility through honesty vs. greenwashing through silence
` : ''}

═══════════════════════════════════════════════════════════════════════
SECTION 7: CASE STUDIES & IMPACT STORIES
═══════════════════════════════════════════════════════════════════════

${caseStudiesText}

CRITICAL INTEGRATION REQUIREMENT:
- DO NOT create a standalone "Case Studies" section
- WEAVE each case study into the relevant pillar narrative (Environmental/Social/Governance)
- Use Challenge-Action-Impact framework within flowing prose
- Example: "Our flagship energy efficiency initiative demonstrates this commitment in action. Faced with rising electricity costs [Challenge], we implemented LED retrofits across 12 facilities [Action], achieving 18% consumption reduction and SAR 240K annual savings [Impact]."

═══════════════════════════════════════════════════════════════════════
SECTION 8: QUANTITATIVE METRICS (WITH TIER CLASSIFICATION)
═══════════════════════════════════════════════════════════════════════

${metrics && metrics.length > 0 ? metrics.map((m: any) => `
Metric: ${m.metric_code}
├── Value: ${m.value_numeric || m.value_text || m.value_boolean || 'Not measured'}
├── Unit: ${m.unit || 'N/A'}
├── Category: ${m.category}
├── Data Tier: ${m.data_tier || 'Unknown'}
├── Source: ${m.data_source || 'Unknown'}
├── Confidence: ${m.confidence_level || 'Medium'}
└── Notes: ${m.notes || 'None'}
`).join('\n') : '*** Limited quantitative data provided — acknowledge gaps and provide improvement roadmap ***'}

GCC BENCHMARKS (use for contextualization):
Environmental:
- Scope 1+2 intensity: UAE 12.5, KSA 14.2, Qatar 16.8 tCO2e/employee (CDP MENA 2023)
- Grid emission factor: UAE 0.42, KSA 0.58, Qatar 0.49 tCO2e/MWh (IEA 2024)
- Water consumption: UAE 185, KSA 210, Qatar 195 m³/employee (FAO AQUASTAT)

Social:
- Female workforce: UAE 28%, KSA 22%, Qatar 18% (ILO 2023)
- Annual turnover: UAE 22%, KSA 24.5%, Qatar 20% (Regional surveys)
- Training hours: UAE 24, KSA 20, Qatar 22 hrs/employee (ATD)

═══════════════════════════════════════════════════════════════════════
SECTION 9: ASSESSMENT SCORES & GAP ANALYSIS
═══════════════════════════════════════════════════════════════════════

Overall ESG Score: ${assessment?.overall_score || 'N/A'}%
├── Governance: ${assessment?.governance_score || 'N/A'}%
├── Environmental: ${assessment?.environmental_score || 'N/A'}%
├── Social: ${assessment?.social_score || 'N/A'}%
└── Risk & Controls: ${assessment?.risk_controls_score || 'N/A'}%

Identified Gaps: ${assessment?.gap_count || 'Unknown'}
Critical Gaps: ${assessment?.critical_gap_count || 0}

${assessment?.gaps && assessment.gaps.length > 0 ? `
Priority Gaps to Address:
${assessment.gaps.slice(0, 5).map((g: any, idx: number) => `
${idx + 1}. ${g.title} (${g.severity || 'medium'})
   └─ ${g.description || 'No description'}
`).join('')}
` : ''}

═══════════════════════════════════════════════════════════════════════
SECTION 10: QUESTIONNAIRE INSIGHTS
═══════════════════════════════════════════════════════════════════════

${questionnaireResponse?.answers ? Object.entries(questionnaireResponse.answers).slice(0, 10).map(([key, value]) =>
  `Q: ${key}\nA: ${JSON.stringify(value)}`
).join('\n\n') : 'No questionnaire responses available'}

═══════════════════════════════════════════════════════════════════════
GENERATION TASK — 10-SECTION INVESTOR-GRADE DISCLOSURE
═══════════════════════════════════════════════════════════════════════

Generate a comprehensive ESG disclosure following this EXACT structure. Each section: 400-800 words.

MANDATORY REQUIREMENTS:
✓ Every section MUST include "pillar" field: "governance" | "environmental" | "social" | "esg"
✓ Every quantitative claim needs a number with source
✓ Every estimate needs Tier declaration and methodology
✓ Every gap needs improvement roadmap
✓ Weave case studies INTO pillar sections (not standalone)
✓ Transform CEO bullets into 300-word flowing Executive Summary opener
✓ Apply ${jurisdiction}-specific context (Vision 2030/2035, nationalization, water scarcity)
✓ Use financial materiality framing (business case, ROI, strategic value)
✓ Benchmark against GCC sector medians where data permits

WRITING RULES (NON-NEGOTIABLE):
❌ NEVER: "We are committed to sustainability"
✅ INSTEAD: "We allocated ${jurisdiction === 'KSA' ? 'SAR' : 'AED'} X to sustainability, targeting Y% reduction"

❌ NEVER: "Our people are our greatest asset"
✅ INSTEAD: "We invested X training hours per employee, with Y% promoted from internal pipeline"

❌ NEVER: "Aligned with Vision 2030"
✅ INSTEAD: "${jurisdiction === 'KSA' ? 'Our Saudization rate of X% exceeds Nitaqat requirements' : 'Our nationalization at X% supports UAE Vision goals'}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: EXECUTIVE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
id: "executive-summary"
pillar: "governance"

Requirements:
- Open with CEO message transformed into flowing 300-word narrative (NOT bullets)
- Overall ESG maturity: ${assessment?.overall_score || 'developing'}% with scorecard context
- Top 3 material topics from double materiality matrix
- Key achievements with quantified outcomes
- Forward commitments (targets with timelines)
- ${jurisdiction} Vision alignment with specific contribution

Data Points to Include:
- Overall ESG Score: ${assessment?.overall_score || 'N/A'}%
- Governance Score: ${assessment?.governance_score || 'N/A'}%
- Data Maturity: ${dataCoverage.maturityScore}%
- Material Topics: ${materialityRatings.length} identified

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: MATERIALITY & STRATEGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
id: "materiality-strategy"
pillar: "esg"

Requirements:
- Present double materiality matrix results with GCC-specific overrides
- Explain materiality methodology (stakeholder input, sector benchmarks, regulatory scan)
- Detail ESG strategic pillars with business rationale and action plans
- Show integration with corporate strategy and value creation
- Reference ${regulatoryFramework} compliance positioning

Use the double materiality data provided above.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: ENVIRONMENTAL PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
id: "environmental"
pillar: "environmental"

Requirements:
- Scope 1+2 GHG emissions with methodology notes and Tier classification
- If Scope 3 not measured: acknowledge gap + improvement roadmap
- Energy consumption, water usage (critical in ${jurisdiction}), waste generation
- Climate risks specific to ${jurisdiction} (physical: heat stress, water scarcity; transition: energy mix evolution)
- Circular carbon economy positioning (CCUS, hydrogen roadmap if applicable)
- WEAVE environmental case studies naturally into narrative using Challenge-Action-Impact
- Contextualize vs. GCC benchmarks
- ${jurisdiction}-specific: Water recycling % (critical), desalination dependency

Example Metric Integration:
"Our Scope 1+2 emissions totaled X tCO2e in FY2024, equivalent to Y tCO2e per employee — comparing favorably to the ${jurisdiction} ${industry} median of Z (source). This was achieved through [case study woven in]."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: SOCIAL RESPONSIBILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
id: "social"
pillar: "social"

Requirements:
- Workforce profile: headcount, gender diversity, nationalization %, age distribution
- ${jurisdiction}-specific: Saudization/Emiratization/Qatarization metrics and compliance status
- Health & safety: LTIFR, fatalities, heat stress management (GCC-critical)
- Diversity & inclusion: women in leadership, pay gap disclosure (if available)
- Training & development: hours per employee, career progression
- Labor practices: migrant worker welfare, grievance mechanisms (kafala legacy context)
- Community investment: CSR spend (% of profit), local procurement, volunteer hours
- WEAVE social case studies into narrative
- Benchmark against ${jurisdiction} sector medians

Example Integration:
"Our workforce of X employees includes Y% women, below the ${jurisdiction} sector median of Z% but improving from prior year A%. We invested B training hours per employee, with C% promoted internally — demonstrating our commitment to national talent development."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5: GOVERNANCE & RISK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
id: "governance"
pillar: "governance"

Requirements:
- Board composition: independence %, ESG expertise, diversity metrics
- ESG oversight structure (committee or lack thereof — be honest)
- Risk management: ESG integration in ERM, TCFD climate risk assessment
- Ethics & compliance: anti-corruption framework, code of conduct coverage, violations
- ${jurisdiction} regulatory compliance: nationalization quotas, environmental permits, labor law adherence
- If gaps exist (e.g., no ESG committee): acknowledge + roadmap

Example Transparency:
"We do not yet have a dedicated Board-level ESG committee. ESG oversight currently resides with the Audit & Risk Committee, which reviews quarterly ESG KPI dashboards. We plan to establish a standalone Sustainability Committee by Q3 2026 as we prepare for ${regulatoryFramework} mandatory reporting."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6: TARGETS & COMMITMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
id: "targets"
pillar: "esg"

Requirements:
- Short-term (1yr), medium-term (3yr), long-term (5yr+) targets by material topic
- Each target: baseline, current status, accountability owner, progress %
- Science-based where applicable (SBTi), aspirational otherwise
- If no formal targets: acknowledge this honestly + target-setting roadmap
- Link to ${jurisdiction} Vision 2030/2035 goals where applicable

Example Structure:
"Climate: Reduce Scope 1+2 emissions 30% by 2030 (baseline: FY2024 X tCO2e) — Current: Y% progress. Owner: COO. Pathway: LED retrofits (2025), solar PV (2027), fleet electrification (2029)."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 7: METHODOLOGY & DATA QUALITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
id: "methodology"
pillar: "governance"

Requirements:
- Reporting boundary and consolidation approach
- Data collection methodology by category (environmental, social, governance)
- Tier 1-4 classification breakdown (${dataCoverage.tier1} Tier 1, ${dataCoverage.tier2} Tier 2, etc.)
- Estimation methodologies: emission factors used, calculation approaches, assumptions
- Data gaps and improvement roadmap: "Year 1 → Year 3 data maturity plan"
- Assurance status: [Unassured currently / Limited assurance planned for FY2026]
- Framework compliance: ${regulatoryFramework}, ${frameworks.join(', ')}

Example Estimation Disclosure:
"Scope 2 emissions estimated using Tier 2 methodology: Annual electricity spend (${jurisdiction === 'KSA' ? 'SAR' : 'AED'} X) ÷ commercial tariff (Y per kWh) × grid emission factor (Z tCO2e/MWh, IEA 2024). Uncertainty: ±15%. Improvement: Install smart meters by Q2 2026 for Tier 1 actual readings."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 8: GAP ANALYSIS & IMPROVEMENT ROADMAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
id: "gap-analysis"
pillar: "governance"

Requirements:
- List all material metrics NOT yet measured (identified from materiality matrix vs. data inventory)
- For each gap: reason, interim action (Tier 3/4 estimate if feasible), remediation plan with timeline
- Overall data maturity score: ${dataCoverage.maturityScore}%
- Year-over-year improvement target: "Move X metrics from Tier 3/4 to Tier 1/2 by FY2026"
- Resource requirements: systems, budget, external support needed

Example Gap Disclosure:
"Scope 3 Category 1 (Purchased Goods): Not reported. Reason: Supplier engagement program not established. Interim: Applied EEIO screening estimate (~X tCO2e, ±40%). Roadmap: Q1 2026 survey top 20 suppliers, Q3 2026 implement supplier questionnaire, FY2027 report Tier 2 data. Frameworks affected: GRI 305-3, ${regulatoryFramework}."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 9: ASSURANCE & VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
id: "assurance"
pillar: "governance"

Requirements:
- Current assurance status: Unassured (typical for Year 1-2 GCC companies)
- Planned assurance pathway: Limited assurance FY2026, Reasonable by FY2028
- Internal controls: data management systems, approval processes, sign-offs
- External readiness: audit trail quality, documentation completeness

Example:
"This disclosure is currently unassured. We are developing assurance readiness in parallel with data system improvements. We plan to engage an external verifier (e.g., SGS, Bureau Veritas, EY, KPMG) for limited assurance of Scope 1+2 emissions in FY2026, expanding to full ESG limited assurance by FY2027."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 10: LOOKING FORWARD — STRATEGIC OUTLOOK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
id: "strategic-outlook"
pillar: "esg"

Requirements:
- ESG integration into business strategy (not bolted on — embedded)
- ${jurisdiction} Vision 2030/2035 contribution: specific KPIs and alignment areas
- Emerging risks and opportunities: energy transition, water scarcity, talent attraction
- Stakeholder engagement priorities: investors, regulators, customers, workforce
- Next reporting cycle commitments: data improvements, target-setting, assurance

═══════════════════════════════════════════════════════════════════════
OUTPUT FORMAT — JSON STRUCTURE
═══════════════════════════════════════════════════════════════════════

Return ONLY valid JSON (no markdown, no code blocks) matching this EXACT structure:

{
  "sections": [
    {
      "id": "executive-summary",
      "title": "Executive Summary",
      "pillar": "governance",
      "narrative": "400-800 word narrative integrating CEO message, scores, material topics...",
      "dataPoints": [
        { "label": "Overall ESG Score", "value": "${assessment?.overall_score || 'N/A'}%" },
        { "label": "Governance Score", "value": "${assessment?.governance_score || 'N/A'}%" },
        { "label": "Environmental Score", "value": "${assessment?.environmental_score || 'N/A'}%" },
        { "label": "Social Score", "value": "${assessment?.social_score || 'N/A'}%" },
        { "label": "Data Maturity", "value": "${dataCoverage.maturityScore}%" },
        { "label": "Material Topics Identified", "value": "${materialityRatings.length}" }
      ]
    }
    // ... 9 more sections following structure above
  ],
  "evidence_appendix": [
    {
      "metric": "Scope 2 GHG Emissions",
      "value": "X tCO2e",
      "tier": "Tier 2",
      "methodology": "Annual electricity spend ÷ tariff × grid emission factor (IEA 2024)",
      "uncertainty": "±15%",
      "improvement_pathway": "Install smart meters by Q2 2026 for Tier 1 data"
    }
    // ... one entry per estimated metric
  ],
  "disclaimers": [
    {
      "id": "disc-1",
      "type": "assurance",
      "text": "This disclosure is unassured. ${companyProfile.name} is developing external assurance readiness for FY2026 limited assurance engagement."
    },
    {
      "id": "disc-2",
      "type": "forward-looking",
      "text": "This report contains forward-looking statements regarding ESG targets and commitments. Actual results may differ due to factors beyond ${companyProfile.name}'s control."
    },
    {
      "id": "disc-3",
      "type": "estimation",
      "text": "Certain metrics are estimated using industry benchmarks and proxy data (Tier 2-4 methodologies). ${companyProfile.name} is investing in data infrastructure to improve measurement accuracy in future reporting periods."
    },
    {
      "id": "disc-4",
      "type": "scope",
      "text": "Reporting boundary: ${companyProfile.name} operations under direct operational control in ${jurisdiction}. Joint ventures and minority investments are excluded unless otherwise stated."
    }
  ],
  "quality_checklist": [
    { "item": "CEO message integrated in Executive Summary", "status": ${ceoMessage ? '"pass"' : '"warning"'}, "count": 1 },
    { "item": "Case studies woven into pillar narratives", "status": ${caseStudies.length > 0 ? '"pass"' : '"warning"'}, "count": ${caseStudies.length} },
    { "item": "Double materiality matrix completed", "status": ${materialityRatings.length >= 5 ? '"pass"' : materialityRatings.length > 0 ? '"warning"' : '"fail"'}, "count": ${materialityRatings.length} },
    { "item": "Quantitative metrics with Tier classification", "status": ${metrics?.length > 10 ? '"pass"' : metrics?.length > 0 ? '"warning"' : '"fail"'}, "count": ${metrics?.length || 0} },
    { "item": "Targets with baselines and owners", "status": ${targets.length > 0 ? '"pass"' : '"warning"'}, "count": ${targets.length} },
    { "item": "GCC benchmarks for contextualization", "status": "pass", "count": "Auto-applied" },
    { "item": "${jurisdiction} Vision alignment quantified", "status": ${jurisdiction === 'KSA' || jurisdiction === 'UAE' || jurisdiction === 'Qatar' ? '"required"' : '"n/a"'}, "count": 1 },
    { "item": "Gap disclosure with improvement roadmaps", "status": "required", "count": "All gaps" },
    { "item": "Financial materiality framing", "status": "required", "count": "All sections" },
    { "item": "No greenwashing triggers detected", "status": "pass", "count": 0 }
  ]
}

═══════════════════════════════════════════════════════════════════════
CRITICAL CONSTRAINTS — READ CAREFULLY
═══════════════════════════════════════════════════════════════════════

1. **NEVER FABRICATE DATA**: If a metric is not provided, write "Data collection in progress" or estimate using Tier 3/4 with FULL methodology disclosure

2. **NEVER GREENWASH**: Do NOT use:
   - "Carbon neutral" without verification
   - "Industry leader" without proof
   - "Best-in-class" without benchmarking
   - "We are committed" without quantified actions
   - "Zero waste" without methodology

3. **ALWAYS BENCHMARK**: Compare ${companyProfile.name} performance vs. ${jurisdiction} ${industry} medians using GCC benchmarks provided above

4. **ALWAYS SHOW BUSINESS CASE**: Every initiative needs financial context:
   - "LED retrofits reduced electricity costs by ${jurisdiction === 'KSA' ? 'SAR' : 'AED'} X"
   - "Water recycling avoided ${jurisdiction === 'KSA' ? 'SAR' : 'AED'} Y in projected tariff increases"
   - "Nationalization compliance unlocked government procurement eligibility worth ${jurisdiction === 'KSA' ? 'SAR' : 'AED'} Z"

5. **ALWAYS ACKNOWLEDGE GAPS HONESTLY**: Example:
   "We do not yet measure Scope 3 emissions. Reason: Supplier engagement program not established. Interim estimate using EEIO: ~X tCO2e (±40%, Tier 4). Roadmap: Q1 2026 supplier survey, FY2027 Tier 2 reporting."

6. **MANDATORY ${jurisdiction} CONTEXT**:
   ${jurisdiction === 'KSA' ? `
   - Reference Nitaqat compliance status and band
   - Cite Vision 2030 specific goals (e.g., 50% renewable energy by 2030)
   - Address circular carbon economy (CCUS, hydrogen)
   - Reference ISSB S1/S2 mandatory requirements via CMA
   ` : jurisdiction === 'UAE' ? `
   - Reference Emiratization compliance and tier
   - Cite UAE Net Zero 2050 and specific sectoral targets
   - Address water efficiency (critical in water-scarce UAE)
   - Reference ADX ESG Guide / DFSA sustainability requirements
   ` : jurisdiction === 'Qatar' ? `
   - Reference Qatarization compliance vs. MSAL requirements
   - Cite National Vision 2030 ESG priorities
   - Address water and energy efficiency (LNG leadership context)
   - Reference QSE 34 KPI voluntary disclosure moving mandatory
   ` : ''}

7. **DATA TIER TRANSPARENCY**: Every estimated metric needs:
   \`\`\`
   Metric: [Name]
   Value: [X]
   Tier: [1/2/3/4]
   Methodology: [Detailed calculation]
   Uncertainty: [±X%]
   Source: [Emission factor reference, benchmark source]
   Improvement: [How to get to Tier 1 by when]
   \`\`\`

═══════════════════════════════════════════════════════════════════════
SELF-CHECK BEFORE RETURNING OUTPUT
═══════════════════════════════════════════════════════════════════════

Run the "Skeptical Investor Test" on your draft:

1. ❓ "Show me your Scope 3." → Did you either report it OR explain gap + roadmap?
2. ❓ "How does this create shareholder value?" → Does every section link to financial materiality?
3. ❓ "Your water usage seems low for ${industry}." → Did you benchmark vs. sector?
4. ❓ "You mention Vision 2030 but I see no quantified contribution." → Did you provide specific KPIs?
5. ❓ "Your board has no ESG expertise. How do you govern this?" → Did you acknowledge governance gaps honestly?

If any answer would embarrass ${companyProfile.name}, revise before returning.

═══════════════════════════════════════════════════════════════════════
READY. GENERATE DISCLOSURE NOW.
═══════════════════════════════════════════════════════════════════════`;
}

function parseDisclosureResponse(aiContent: string, companyProfile: any, frameworks: string[]): any {
  try {
    // Parse AI-generated JSON response
    let parsed;
    try {
      parsed = JSON.parse(aiContent);
    } catch (error: any) {
      logger.error('Failed to parse AI response as JSON', {
        error: error.message,
        content: aiContent.substring(0, 500) // Log first 500 chars for debugging
      });
      throw new Error('AI returned non-JSON response');
    }

    // Validate structure
    if (!parsed || typeof parsed !== 'object') {
      logger.error('AI response is not an object', { parsed });
      throw new Error('AI response has invalid structure');
    }

    if (!Array.isArray(parsed.sections)) {
      logger.error('AI response missing sections array', { parsed });
      throw new Error('AI response missing sections array');
    }

    if (parsed.sections.length === 0) {
      logger.warn('AI returned empty sections array', { parsed });
    }

    // Validate each section has required fields
    const validSections = parsed.sections.filter((s: any) => {
      if (!s.id || !s.title || !s.narrative) {
        logger.warn('Section missing required fields', { section: s });
        return false;
      }
      return true;
    });

    return {
      template_id: null,
      template_version: '2.0',
      jurisdiction: companyProfile.country,
      generated_for_company: companyProfile.name,
      selected_frameworks: frameworks,
      sections: validSections,
      evidence_appendix: [],
      disclaimers: [
        {
          id: 'disc-1',
          type: 'educational',
          text: 'This disclosure is for educational purposes. Consult qualified professionals for compliance guidance.',
          order: 0,
        }
      ],
      quality_checklist: [],
      format: 'json',
    };
  } catch (error) {
    logger.error('Failed to parse AI response:', error);
    // Fallback: return structured format with AI content as narrative
    return {
      template_id: null,
      template_version: '2.0',
      jurisdiction: companyProfile.country,
      generated_for_company: companyProfile.name,
      selected_frameworks: frameworks,
      sections: [
        {
          id: 'ai-generated',
          title: 'Generated Disclosure',
          narrative: aiContent,
          dataPoints: [],
        }
      ],
      evidence_appendix: [],
      disclaimers: [],
      quality_checklist: [],
      format: 'json',
    };
  }
}
