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
  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: 'You are an expert ESG disclosure specialist. Generate professional, audit-ready ESG disclosures compliant with international frameworks.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3, // Lower for consistency
      max_tokens: 8000,
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

  const aiContent = response.data.choices[0].message.content;

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

  return `Generate a professional ESG disclosure report using the following data.

IMPORTANT TONE GUIDANCE: Use "${toneOfVoice}" tone throughout:
- professional: Big 4 audit style - Formal, structured, compliance-focused
- pragmatic: Investor-friendly - Business case, ROI, strategic value
- authentic: Humanized & approachable - Natural language, honest, relatable
- technical: Data-driven - Detailed metrics, methodologies, specifications
- visionary: Inspiring & ambitious - Forward-looking, transformational, bold

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

TASK:
Generate a comprehensive ESG disclosure report with these sections:
1. Executive Summary (including CEO message expanded to 200-300 words)
2. Materiality & Strategy (materiality analysis + strategy + pillars)
3. Environmental Performance (metrics, targets, case studies)
4. Social Performance (metrics, targets, case studies)
5. Governance & Risk (governance structure, risk management)
6. Targets & Future Commitments
7. Gap Analysis & Recommendations

For each section:
- Expand user's casual input into professional ${toneOfVoice} prose
- Integrate metrics and case studies naturally
- Highlight material topics from the assessment
- Be specific and data-driven where metrics exist
- Be honest about data gaps (don't fabricate)
- Keep the authentic voice - avoid AI blatancy and corporate jargon

Format as JSON: { sections: [{ id, title, narrative, dataPoints: [] }], evidence_appendix: [], disclaimers: [], quality_checklist: [] }`;
}

function parseDisclosureResponse(aiContent: string, companyProfile: any, frameworks: string[]): any {
  // Parse AI-generated JSON response
  try {
    const parsed = JSON.parse(aiContent);
    return {
      template_id: null,
      template_version: '2.0',
      jurisdiction: companyProfile.country,
      generated_for_company: companyProfile.name,
      selected_frameworks: frameworks,
      sections: parsed.sections || [],
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
