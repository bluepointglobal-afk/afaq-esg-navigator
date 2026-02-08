// AFAQ Types

export type Country = 'UAE' | 'KSA' | 'Qatar' | 'Bahrain' | 'Kuwait' | 'Oman';

export type Industry = 
  | 'Energy'
  | 'Materials'
  | 'Industrials'
  | 'Consumer Discretionary'
  | 'Consumer Staples'
  | 'Health Care'
  | 'Financials'
  | 'Information Technology'
  | 'Communication Services'
  | 'Utilities'
  | 'Real Estate'
  | 'Retail'
  | 'Hospitality'
  | 'Construction'
  | 'Transportation'
  | 'Professional Services'
  | 'Education'
  | 'Other';

export type StockExchange = 
  | 'Tadawul' 
  | 'ADX' 
  | 'DFM' 
  | 'QSE' 
  | 'BHB' 
  | 'Boursa Kuwait' 
  | 'MSX';

export type UserTier = 'free' | 'pro' | 'enterprise';

export type ReportStatus = 'draft' | 'in_progress' | 'complete' | 'exported';

export type MetricCategory = 'environmental' | 'social' | 'governance';

export type DataTier = 1 | 2 | 3 | 4;

export type DataSource = 
  | 'utility_bill' 
  | 'manual_entry' 
  | 'calculated' 
  | 'benchmark'
  | 'hr_records'
  | 'financial_records'
  | 'policy_review';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  company_id: string | null;
  role: 'user' | 'admin' | 'owner';
  tier: UserTier;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  name_arabic: string | null;
  country: Country;
  industry: Industry;
  industry_subsector: string | null;
  employee_count: number | null;
  annual_revenue: number | null;
  revenue_currency: string;
  is_listed: boolean;
  stock_exchange: StockExchange | null;
  fiscal_year_end: number;
  logo_url: string | null;
  primary_color: string;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  company_id: string;
  reporting_year: number;
  status: ReportStatus;
  overall_completion_pct: number;
  environmental_completion_pct: number;
  social_completion_pct: number;
  governance_completion_pct: number;
  data_quality_score: number;
  frameworks_selected: string[];
  frameworks_detected: string[];
  last_export_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MetricData {
  id: string;
  report_id: string;
  metric_code: string;
  category: MetricCategory;
  value_numeric: number | null;
  value_text: string | null;
  value_boolean: boolean | null;
  unit: string | null;
  data_tier: DataTier;
  data_source: DataSource | null;
  confidence_level: ConfidenceLevel | null;
  calculation_method: string | null;
  calculation_inputs: Record<string, unknown> | null;
  emission_factor_used: number | null;
  emission_factor_source: string | null;
  notes: string | null;
  supporting_doc_url: string | null;
  entered_by: string | null;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MetricDefinition {
  code: string;
  name: string;
  name_arabic?: string;
  category: MetricCategory;
  unit: string;
  description: string;
  tier1_input: string;
  tier2_input: string;
  tier3_input: string;
  required_frameworks: string[];
}

export interface Framework {
  code: string;
  name: string;
  country: Country | 'GCC';
  description: string;
  mandatory_for_listed: boolean;
  metrics_count: number;
}

export interface EmissionFactor {
  id: string;
  country: Country;
  factor_type: string;
  factor_value: number;
  unit: string;
  source: string;
  valid_from: string | null;
  valid_to: string | null;
}

export interface IndustryBenchmark {
  id: string;
  industry: Industry;
  country: Country | null;
  metric_code: string;
  benchmark_value: number;
  benchmark_unit: string;
  normalization_basis: string;
  source: string | null;
  year: number | null;
}

export interface OnboardingData {
  // Step 1: Company Profile
  companyName: string;
  companyNameArabic: string;
  country: Country | null;
  industry: Industry | null;
  
  // Step 2: Company Size
  employeeCount: number | null;
  annualRevenue: number | null;
  revenueCurrency: string;
  isListed: boolean;
  stockExchange: StockExchange | null;
  
  // Step 3: Data Availability
  hasUtilityBills: boolean;
  hasFuelReceipts: boolean;
  hasWasteRecords: boolean;
  hasEmployeeCount: boolean;
  hasHRSystem: boolean;
  hasTrainingRecords: boolean;
  hasFinancialStatements: boolean;
  hasExpenseBreakdown: boolean;
  hasPolicies: boolean;
  hasGovernanceDocs: boolean;
  
  // Step 4: Frameworks (auto-detected)
  detectedFrameworks: string[];
}

export interface GapAnalysisResult {
  framework_code: string;
  framework_name: string;
  total_metrics: number;
  completed_metrics: number;
  completion_percentage: number;
  missing_mandatory: MetricDefinition[];
  missing_optional: MetricDefinition[];
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'word';
  include_watermark: boolean;
  language: 'en' | 'ar' | 'both';
  include_methodology: boolean;
  include_gap_analysis: boolean;
}

// Country metadata
export const COUNTRIES: Record<Country, { name: string; flag: string; currency: string; currencySymbol: string }> = {
  UAE: { name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED', currencySymbol: 'د.إ' },
  KSA: { name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR', currencySymbol: 'ر.س' },
  Qatar: { name: 'Qatar', flag: '🇶🇦', currency: 'QAR', currencySymbol: 'ر.ق' },
  Bahrain: { name: 'Bahrain', flag: '🇧🇭', currency: 'BHD', currencySymbol: 'د.ب' },
  Kuwait: { name: 'Kuwait', flag: '🇰🇼', currency: 'KWD', currencySymbol: 'د.ك' },
  Oman: { name: 'Oman', flag: '🇴🇲', currency: 'OMR', currencySymbol: 'ر.ع' },
};

export const INDUSTRIES: Industry[] = [
  'Energy',
  'Materials',
  'Industrials',
  'Consumer Discretionary',
  'Consumer Staples',
  'Health Care',
  'Financials',
  'Information Technology',
  'Communication Services',
  'Utilities',
  'Real Estate',
  'Retail',
  'Hospitality',
  'Construction',
  'Transportation',
  'Professional Services',
  'Education',
  'Other',
];

export const STOCK_EXCHANGES: Record<Country, StockExchange[]> = {
  UAE: ['ADX', 'DFM'],
  KSA: ['Tadawul'],
  Qatar: ['QSE'],
  Bahrain: ['BHB'],
  Kuwait: ['Boursa Kuwait'],
  Oman: ['MSX'],
};

// Re-export Compliance Engine types
export * from './compliance';
