/**
 * TypeScript types for ESG Disclosure Data Collection
 */

export type ToneOfVoice = 'professional' | 'pragmatic' | 'authentic' | 'technical' | 'visionary';

export type CEOMessageFormat = 'full_text' | 'bullet_points';

export type DataQuality = 'estimated' | 'measured' | 'verified' | 'audited';

export type EvidenceType = 'initiative_photo' | 'utility_bill' | 'policy_doc' | 'certification' | 'other';

export type CaseStudyFormat = 'bullets' | 'story';

// Materiality Rating for a single topic
export interface MaterialityRating {
  topic: string;
  business_impact: number; // 1-5
  societal_impact: number; // 1-5
  custom: boolean; // User-added topic vs pre-defined
}

// ESG Pillar/Focus Area
export interface ESGPillar {
  name: string;
  rationale: string; // Why this matters
  actions: string[]; // What you're doing
  target?: string; // Optional target
}

// Target/Commitment
export interface ESGTarget {
  what: string;
  by_when: string;
  baseline: string;
  progress: string;
  status: 'on-track' | 'behind' | 'achieved' | 'not-started';
}

// Case Study
export interface CaseStudy {
  title?: string;
  format: CaseStudyFormat;
  challenge: string;
  action: string;
  impact: string;
  photo_url?: string;
}

// Disclosure Narratives (complete structure)
export interface DisclosureNarratives {
  id?: string;
  report_id: string;

  // CEO Message
  ceo_message_format: CEOMessageFormat;
  ceo_message_content: string;
  tone_of_voice: ToneOfVoice;

  // Materiality
  materiality_ratings: MaterialityRating[];
  materiality_analysis?: string; // AI-generated

  // Strategy
  esg_pillars: ESGPillar[];
  esg_strategy_oneliner: string;

  // Targets
  targets: ESGTarget[];
  has_formal_targets: boolean;

  // Case Studies
  case_studies: CaseStudy[];

  // Governance
  esg_oversight: string;
  risk_management: string;
  policies: string[];

  // Optional Phase 2
  climate_strategy?: {
    risks: string;
    opportunities: string;
    actions: string;
  };
  stakeholder_engagement?: string;

  // Metadata
  completeness_score: number;
  phase_completed: 1 | 2;
  created_at?: string;
  updated_at?: string;
}

// Disclosure Metrics (complete structure)
export interface DisclosureMetrics {
  id?: string;
  report_id: string;

  // Emissions
  scope1_tonnes_co2e?: number;
  scope2_tonnes_co2e?: number;
  scope3_calculated: boolean;
  scope3_tonnes_co2e?: number;

  // Energy
  total_energy_kwh?: number;
  renewable_energy_percent?: number;

  // Water
  water_consumption_m3?: number;

  // Waste
  total_waste_tonnes?: number;
  waste_recycled_percent?: number;

  // Workforce
  total_employees?: number;
  percent_women?: number;
  percent_women_leadership?: number;
  employee_turnover_percent?: number;
  training_hours_per_employee?: number;

  // Health & Safety
  lost_time_injuries?: number;
  safety_training_hours?: number;
  fatalities?: number;

  // Supply Chain
  suppliers_assessed_esg?: number;
  local_suppliers_percent?: number;

  // Metadata
  data_quality: DataQuality;
  baseline_year?: number;
  reporting_period_start?: string;
  reporting_period_end?: string;
  notes?: string;

  created_at?: string;
  updated_at?: string;
}

// Disclosure Evidence
export interface DisclosureEvidence {
  id?: string;
  report_id: string;

  file_name: string;
  file_type: string;
  storage_path: string;
  file_size_bytes: number;
  mime_type: string;

  evidence_type: EvidenceType;
  description?: string;

  extracted_data?: Record<string, any>;
  extraction_status: 'pending' | 'processing' | 'completed' | 'failed' | 'not_applicable';

  linked_case_study_index?: number;
  linked_metric_type?: string;

  created_at?: string;
  created_by?: string;
}

// Pre-defined ESG topics for materiality assessment
export const MATERIALITY_TOPICS = [
  'Climate change & GHG emissions',
  'Energy efficiency',
  'Water management',
  'Waste & circular economy',
  'Employee health & safety',
  'Diversity & inclusion',
  'Employee development & training',
  'Community relations',
  'Supply chain ethics',
  'Data privacy & security',
  'Business ethics & governance',
  'Product sustainability',
  'Biodiversity & nature',
  'Human rights',
  'Air quality',
] as const;

// Tone of voice descriptions
export const TONE_DESCRIPTIONS: Record<ToneOfVoice, string> = {
  professional: 'Big 4 audit style - Formal, structured, compliance-focused',
  pragmatic: 'Investor-friendly - Business case, ROI, strategic value',
  authentic: 'Humanized & approachable - Natural language, honest, relatable',
  technical: 'Data-driven - Detailed metrics, methodologies, specifications',
  visionary: 'Inspiring & ambitious - Forward-looking, transformational, bold',
};

// Data quality descriptions
export const DATA_QUALITY_DESCRIPTIONS: Record<DataQuality, string> = {
  estimated: 'Rough estimate or calculation based on limited data',
  measured: 'Internally tracked with direct measurement',
  verified: 'Verified by independent third party',
  audited: 'Audited by accredited external auditor',
};
