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
            content: `You are a senior ESG disclosure consultant from a Big 4 advisory firm with 15+ years experience. Your writing combines:
- Deep technical expertise in ESG frameworks (IFRS S1/S2, GRI, TCFD, SASB, CDP)
- Strategic business acumen and value creation narratives
- Sophisticated stakeholder communication (investors, regulators, rating agencies)
- Audit-ready rigor with clear methodology and data lineage
- Industry-specific insights and peer benchmarking context

You craft disclosures that:
1. Transform raw user input into polished, professional narratives worthy of annual reports
2. Weave quantitative metrics seamlessly into qualitative storytelling
3. Demonstrate strategic linkage between ESG and business value
4. Anticipate and address stakeholder questions proactively
5. Balance authenticity with professional polish - never generic or templated
6. Acknowledge data gaps transparently without undermining credibility`
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

  // Extract data from new disclosure_narratives structure
  const toneOfVoice = narratives?.tone_of_voice || 'authentic';
  const ceoMessage = narratives?.ceo_message_content || '';
  const ceoFormat = narratives?.ceo_message_format || 'bullet_points';
  const materialityRatings = narratives?.materiality_ratings || [];
  const esgPillars = narratives?.esg_pillars || [];
  const strategy = narratives?.esg_strategy_oneliner || '';
  const targets = narratives?.targets || [];
  const caseStudies = narratives?.case_studies || [];

  // Build materiality section
  const materialityText = materialityRatings.length > 0
    ? materialityRatings.map((r: any) =>
        `- ${r.topic}: Business Impact ${r.business_impact}/5, Societal Impact ${r.societal_impact}/5`
      ).join('\n')
    : 'Not provided';

  // Build pillars section
  const pillarsText = esgPillars.length > 0
    ? esgPillars.map((p: any) =>
        `**${p.name}**\n  Rationale: ${p.rationale}\n  Actions: ${p.actions.join(', ')}\n  ${p.target ? `Target: ${p.target}` : ''}`
      ).join('\n\n')
    : 'Not provided';

  // Build targets section
  const targetsText = targets.length > 0
    ? targets.map((t: any) =>
        `- ${t.what} by ${t.by_when}\n  Baseline: ${t.baseline}\n  Progress: ${t.progress}\n  Status: ${t.status}`
      ).join('\n\n')
    : 'Not provided';

  // Build case studies section
  const caseStudiesText = caseStudies.length > 0
    ? caseStudies.map((cs: any, idx: number) =>
        `Case Study ${idx + 1}${cs.title ? `: ${cs.title}` : ''}\n` +
        `Challenge: ${cs.challenge}\n` +
        `Action: ${cs.action}\n` +
        `Impact: ${cs.impact}`
      ).join('\n\n')
    : 'Not provided';

  return `Generate a comprehensive, Big 4-quality ESG disclosure report that transforms the raw data below into a strategic, investor-grade narrative.

CRITICAL QUALITY STANDARDS:
✓ Each section should be 400-800 words of substantive content (not generic filler)
✓ Integrate ALL provided case studies, metrics, and targets naturally into narratives
✓ Demonstrate strategic linkage between ESG performance and business outcomes
✓ Use industry-specific terminology and context where relevant
✓ Include forward-looking commitments alongside historical performance
✓ Acknowledge data gaps transparently (e.g., "Scope 3 emissions tracking is in development")
✓ Maintain ${toneOfVoice} tone throughout

TONE GUIDANCE - "${toneOfVoice}":
- professional: Big 4 consulting style - Sophisticated, structured, stakeholder-ready, rigorous
- pragmatic: Investor-oriented - Business case emphasis, ROI linkage, strategic value creation
- authentic: Approachable yet credible - Natural language, honest progress narrative, relatable
- technical: Data-centric - Detailed methodologies, metrics transparency, scientific precision
- visionary: Transformational - Bold ambition, leadership positioning, future-focused

COMPANY PROFILE:
Name: ${companyProfile.name}
Industry: ${companyProfile.industry}
Country: ${companyProfile.country}
Frameworks: ${frameworks.join(', ')}

CEO/LEADERSHIP MESSAGE (${ceoFormat === 'bullet_points' ? 'expand bullets into flowing narrative' : 'polish and structure'}):
${ceoMessage}

ESG STRATEGY:
${strategy || 'Not provided'}

MATERIALITY ASSESSMENT (Double Materiality):
${materialityText}

ESG PILLARS & FOCUS AREAS:
${pillarsText}

TARGETS & COMMITMENTS:
${targetsText}

CASE STUDIES (expand and polish using Challenge-Action-Impact framework):
${caseStudiesText}

QUANTITATIVE METRICS:
${metrics ? JSON.stringify(metrics, null, 2) : 'Not provided'}

QUESTIONNAIRE RESPONSES:
${JSON.stringify(questionnaireResponse?.answers || {}, null, 2)}

ASSESSMENT SCORES:
Overall: ${assessment?.overall_score || 'N/A'}
Governance: ${assessment?.governance_score || 'N/A'}
Environmental: ${assessment?.environmental_score || 'N/A'}
Social: ${assessment?.social_score || 'N/A'}

GENERATION TASK:

Create a comprehensive ESG disclosure with these sections (400-800 words each).

IMPORTANT: Each section MUST include a "pillar" field mapping to: "governance", "environmental", "social", or "esg"

1. **Executive Summary** (id: "executive-summary", pillar: "governance")
   - Open with expanded CEO/leadership message (transform bullet points into flowing 300-word narrative)
   - Overall ESG maturity assessment and key achievements
   - Strategic priorities and material topics
   - Forward commitments and stakeholder value proposition

2. **Materiality & Strategic Context** (id: "materiality-strategy", pillar: "esg")
   - Double materiality analysis: business impact + societal impact
   - Strategic ESG pillars with rationale and action plans
   - Stakeholder engagement approach
   - Integration with business strategy and value creation

3. **Environmental Performance** (id: "environmental", pillar: "environmental")
   - GHG emissions (Scope 1, 2, 3 if available) with context and trends
   - Energy and resource management initiatives
   - Climate risks and adaptation measures
   - Environmental case studies woven into narrative (Challenge-Action-Impact)
   - Targets with baseline, progress, and accountability mechanisms

4. **Social Responsibility** (id: "social", pillar: "social")
   - Workforce demographics, diversity, and inclusion metrics
   - Employee wellbeing, development, and engagement
   - Community impact and stakeholder relationships
   - Social case studies integrated naturally
   - Labor practices, health & safety performance

5. **Governance & Ethics** (id: "governance", pillar: "governance")
   - Board oversight of ESG matters
   - Risk management and compliance frameworks
   - Ethics, anti-corruption, and transparency policies
   - Stakeholder grievance mechanisms

6. **Targets & Future Commitments** (id: "targets", pillar: "esg")
   - Science-based or aspirational targets by pillar
   - Roadmap and interim milestones
   - Accountability structure and progress tracking
   - Dependencies and enabling conditions

7. **Methodology & Data Limitations** (id: "methodology", pillar: "governance")
   - Data collection approach and verification
   - Reporting boundaries and exclusions
   - Estimation methodologies where actual data unavailable
   - Planned improvements to data quality

INTEGRATION REQUIREMENTS:
✓ CEO message MUST be prominently featured in Executive Summary (not as standalone section)
✓ ALL case studies MUST be woven into relevant pillars (Environmental/Social/Governance), not listed separately
✓ Targets MUST include baseline, current status, and accountability owner
✓ Materiality ratings MUST inform which topics get deeper treatment
✓ Metrics MUST be contextualized (industry benchmarks, year-over-year trends, strategic relevance)
✓ Data gaps MUST be acknowledged with remediation plans

OUTPUT FORMAT REQUIREMENTS:
Return valid JSON matching this exact structure:
{
  "sections": [
    {
      "id": "executive-summary",
      "title": "Executive Summary",
      "pillar": "governance",
      "narrative": "400-800 word paragraph incorporating CEO message...",
      "dataPoints": [
        { "label": "Overall ESG Score", "value": "${assessment?.overall_score}%" },
        { "label": "Material Topics Identified", "value": "X topics" }
      ]
    }
  ],
  "evidence_appendix": [],
  "disclaimers": [
    {
      "id": "disc-1",
      "type": "assurance",
      "text": "This disclosure is unaudited. [Company] is developing external assurance processes for future reporting periods."
    }
  ],
  "quality_checklist": [
    { "item": "CEO message integrated", "status": "pass", "count": 1 },
    { "item": "Case studies referenced", "status": "pass", "count": ${caseStudies.length} },
    { "item": "Quantitative metrics included", "status": ${metrics?.length > 0 ? '"pass"' : '"warning"'}, "count": ${metrics?.length || 0} }
  ]
}

CRITICAL: Do NOT fabricate metrics. If a metric isn't provided, describe the topic qualitatively or state "data collection in progress."`;
}

function parseDisclosureResponse(aiContent: string, companyProfile: any, frameworks: string[]): any {
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
