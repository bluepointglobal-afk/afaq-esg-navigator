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

  return `Generate an ESG disclosure report for:

Company: ${companyProfile.name}
Industry: ${companyProfile.industry}
Country: ${companyProfile.country}
Frameworks: ${frameworks.join(', ')}

Questionnaire Responses:
${JSON.stringify(questionnaireResponse.answers, null, 2)}

User Narratives:
Governance: ${narratives?.governance_text || 'Not provided'}
ESG Strategy: ${narratives?.esg_text || 'Not provided'}
Risk Management: ${narratives?.risk_text || 'Not provided'}
Transparency: ${narratives?.transparency_text || 'Not provided'}

Metrics:
${JSON.stringify(metrics, null, 2)}

Assessment Scores:
Overall: ${assessment?.overall_score || 'N/A'}
Governance: ${assessment?.governance_score || 'N/A'}
Environmental: ${assessment?.environmental_score || 'N/A'}
Social: ${assessment?.social_score || 'N/A'}

Generate a comprehensive disclosure with:
1. Executive Summary
2. Governance Section
3. Environmental Section
4. Social Section
5. Gap Analysis
6. Recommendations

Format as JSON with sections array containing: { id, title, titleArabic, narrative, narrativeArabic, dataPoints[] }`;
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
