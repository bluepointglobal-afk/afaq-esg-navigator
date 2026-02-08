// Supabase Edge Function: Generate Disclosure
// AI-powered disclosure narrative generation (PAID TIER ONLY)
// Uses OpenRouter for cost-effective AI access
// Version: 11 - Evidence Layer + Framework Registry v0 + Evidence-Based Prompt

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Re-using the Registry Types for context (simplified)
const FRAMEWORK_REGISTRY_V0 = [
  // --- IFRS S1 (General) ---
  { id: 'IFRS_S1_GOV_1', title: 'Governance Body Oversight', topic: 'GOV', framework: 'IFRS_S1' },
  { id: 'IFRS_S1_STRAT_1', title: 'Sustainability Risks & Opportunities', topic: 'STRATEGY', framework: 'IFRS_S1' },
  // --- IFRS S2 (Climate) ---
  { id: 'IFRS_S2_GOV_1', title: 'Climate Governance', topic: 'GOV', framework: 'IFRS_S2' },
  { id: 'IFRS_S2_STRAT_1', title: 'Climate Resilience', topic: 'STRATEGY', framework: 'IFRS_S2' },
  { id: 'IFRS_S2_MET_1', title: 'GHG Emissions (Scope 1, 2, 3)', topic: 'METRICS', framework: 'IFRS_S2' },
  // --- TCFD ---
  { id: 'TCFD_GOV_A', title: 'Board Oversight of Climate', topic: 'GOV', framework: 'TCFD' },
  { id: 'TCFD_RISK_A', title: 'Climate Risk Identification Process', topic: 'RISK', framework: 'TCFD' },
  { id: 'TCFD_MET_A', title: 'Key Climate Metrics', topic: 'METRICS', framework: 'TCFD' },
  // --- GRI ---
  { id: 'GRI_2_9', title: 'Governance Structure and Composition', topic: 'GOV', framework: 'GRI' },
  { id: 'GRI_305_1', title: 'Direct (Scope 1) GHG Emissions', topic: 'CLIMATE', framework: 'GRI' },
  { id: 'GRI_405_1', title: 'Diversity of Governance Bodies and Employees', topic: 'SOCIAL', framework: 'GRI' },
  // --- LOCAL: UAE ---
  { id: 'UAE_E1', title: 'GHG Emissions (UAE Pivot)', topic: 'CLIMATE', framework: 'LOCAL_UAE' },
  { id: 'UAE_S1', title: 'CEO Pay Ratio', topic: 'SOCIAL', framework: 'LOCAL_UAE' },
  { id: 'UAE_G1', title: 'Board Diversity', topic: 'GOV', framework: 'LOCAL_UAE' },
  // --- LOCAL: KSA ---
  { id: 'KSA_E_1', title: 'Environmental Oversight', topic: 'GOV', framework: 'LOCAL_KSA' },
  { id: 'KSA_S_3', title: 'Saudization Rate', topic: 'SOCIAL', framework: 'LOCAL_KSA' },
  // --- LOCAL: QATAR ---
  { id: 'QAT_ENV_1', title: 'Energy Consumption', topic: 'CLIMATE', framework: 'LOCAL_QATAR' },
];

interface CompanyProfile {
  id: string;
  name: string;
  industry: string;
  industry_subsector?: string;
  country: string;
  is_listed: boolean;
  stock_exchange?: string;
  employee_count?: number;
  annual_revenue?: number;
  revenue_currency: string;
}

interface Gap {
  id: string;
  pillar: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface Metric {
  metricCode: string;
  valueNumeric?: number | null;
  valueText?: string | null;
  unit: string;
  category: string;
}

interface DisclosurePack {
  companyProfile: CompanyProfile;
  frameworks: string[];
  outline: { id: string; title: string; topic: string; items: { id: string; title: string; requiredEvidence: string[] }[] }[];
  narratives: Record<string, string>;
  metrics: Metric[];
  assessment: {
    scores: { pillar: string; score: number }[];
    gaps: Gap[];
  };
}

interface GenerateDisclosureRequest {
  reportId: string;
  disclosurePack: DisclosurePack;
  language?: 'en' | 'ar';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader || '' } } }
    );

    // 1. T-003: SERVER-SIDE TIER VERIFICATION
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { data: profile } = await supabaseClient.from('user_profiles').select('tier').eq('id', user.id).single();
    if (!profile || !['pro', 'enterprise'].includes(profile.tier)) {
      return new Response(JSON.stringify({ error: 'TIER_INSUFFICIENT' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const payload: GenerateDisclosureRequest = await req.json();
    const { reportId, disclosurePack, language = 'en' } = payload;
    if (!reportId || !disclosurePack) throw new Error('Missing reportId or disclosurePack');

    const openrouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
    const model = 'claude-3-5-sonnet-20241022'; // Use Sonnet for high-quality grounded narratives

    interface Section {
      id: string;
      title: string;
      narrative: string;
      dataPoints: { label: string; value: string }[];
      limitations: string[];
    }
    const generatedSections: Section[] = [];

    // 2. Generate Each Section from Outline
    for (const section of disclosurePack.outline) {
      const topic = section.topic;
      const metricsForTopic = disclosurePack.metrics.filter(m => m.category === topic.toLowerCase());
      const narrativeForTopic = disclosurePack.narratives[`${topic.toLowerCase()}Text`];

      const systemPrompt = `You are an ESG Disclosure Specialist.
Task: Write the "${topic}" section of the ESG Report.

CONTEXT:
Company: ${disclosurePack.companyProfile.name} (${disclosurePack.companyProfile.industry})
Frameworks: ${disclosurePack.frameworks.join(', ')}

EVIDENCE (STRICT GROUNDING):
Narrative provided: "${narrativeForTopic || 'No specific narrative provided.'}"
Metrics provided: ${JSON.stringify(metricsForTopic.map(m => ({ code: m.metricCode, value: m.valueNumeric ?? m.valueText, unit: m.unit })))}
Assessment Gaps: ${JSON.stringify(disclosurePack.assessment.gaps.filter(g => g.pillar === topic.toLowerCase()))}

REQUIREMENTS:
1. DATA GROUNDING: Cite provided metrics explicitly. Do not fabricate numbers.
2. FUTURE OUTLOOK: Based on narratives/profile, draft a plausible forward-looking statement or note its absence.
3. GAP CLOSURE: Reference the assessment gaps and how the company intends to address them.
4. LIMITATIONS: Explicitly list any missing data or framework requirements not met.
5. NO FABRICATED CITATIONS: Only reference the provided evidence.

Tone: Professional, Audit-Friendly, Objective.
Output Language: ${language === 'ar' ? 'Arabic' : 'English'}.

Return JSON in this format:
{
  "title": "Section Title",
  "narrative": "Detailed markdown text...",
  "dataPoints": [{"label": "Metric Name", "value": "Value"}],
  "limitations": ["Item 1", "Item 2"]
}`;

      const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openrouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://afaq.ae', // Placeholder
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'system', content: systemPrompt }],
          temperature: 0.1,
          response_format: { type: 'json_object' },
        }),
      });

      if (!aiResponse.ok) {
        console.error('AI Error:', await aiResponse.text());
        continue;
      }

      const aiJson = await aiResponse.json();

      let content;
      try {
        content = JSON.parse(aiJson.choices[0].message.content);
      } catch (parseError) {
        console.error('Failed to parse AI response for topic:', topic, parseError);
        content = {
          title: topic,
          narrative: "Could not generate narrative due to formatting issues.",
          dataPoints: [],
          limitations: ["AI parsing failed"]
        };
      }

      generatedSections.push({
        id: topic.toLowerCase(),
        ...content
      });
    }

    const output = {
      reportId,
      sections: generatedSections,
      generatedAt: new Date().toISOString(),
      status: 'success'
    };

    return new Response(JSON.stringify(output), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

