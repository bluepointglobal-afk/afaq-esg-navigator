export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          name_arabic: string | null
          country: string
          industry: string
          employee_count: number | null
          annual_revenue: number | null
          revenue_currency: string | null
          is_listed: boolean
          stock_exchange: string | null
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_arabic?: string | null
          country: string
          industry: string
          employee_count?: number | null
          annual_revenue?: number | null
          revenue_currency?: string | null
          is_listed?: boolean
          stock_exchange?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_arabic?: string | null
          country?: string
          industry?: string
          employee_count?: number | null
          annual_revenue?: number | null
          revenue_currency?: string | null
          is_listed?: boolean
          stock_exchange?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          company_id: string | null
          role: string
          tier: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          company_id?: string | null
          role?: string
          tier?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          company_id?: string | null
          role?: string
          tier?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      reports: {
        Row: {
          id: string
          company_id: string
          reporting_year: number
          status: string
          overall_completion_pct: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          reporting_year: number
          status?: string
          overall_completion_pct?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          reporting_year?: number
          status?: string
          overall_completion_pct?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      questionnaire_responses: {
        Row: {
          id: string
          report_id: string
          template_id: string
          template_version: string
          answers: Json
          status: string
          completion_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          report_id: string
          template_id: string
          template_version?: string
          answers?: Json
          status?: string
          completion_rate?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          report_id?: string
          template_id?: string
          template_version?: string
          answers?: Json
          status?: string
          completion_rate?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_responses_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: true
            referencedRelation: "reports"
            referencedColumns: ["id"]
          }
        ]
      }
      assessment_results: {
        Row: {
          id: string
          report_id: string
          questionnaire_response_id: string
          overall_score: number
          pillar_scores: Json
          gaps: Json
          gap_count: number
          critical_gap_count: number
          recommendations: Json
          explanation: Json
          assessed_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          report_id: string
          questionnaire_response_id: string
          overall_score?: number
          pillar_scores?: Json
          gaps?: Json
          gap_count?: number
          critical_gap_count?: number
          recommendations?: Json
          explanation?: Json
          assessed_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          report_id?: string
          questionnaire_response_id?: string
          overall_score?: number
          pillar_scores?: Json
          gaps?: Json
          gap_count?: number
          critical_gap_count?: number
          recommendations?: Json
          explanation?: Json
          assessed_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_results_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_results_questionnaire_response_id_fkey"
            columns: ["questionnaire_response_id"]
            isOneToOne: false
            referencedRelation: "questionnaire_responses"
            referencedColumns: ["id"]
          }
        ]
      }
      disclosure_outputs: {
        Row: {
          id: string
          report_id: string
          assessment_id: string
          template_id: string | null
          version: string
          template_version: string | null
          jurisdiction: string
          generated_for_company: string
          sections: Json
          evidence_appendix: Json
          disclaimers: Json
          quality_checklist: Json | null
          listing_status: string | null
          status: string
          generated_at: string
          generated_by: string | null
          format: string
          errors: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          report_id: string
          assessment_id: string
          template_id?: string | null
          version?: string
          template_version?: string | null
          jurisdiction?: string
          generated_for_company: string
          sections?: Json
          evidence_appendix?: Json
          disclaimers?: Json
          quality_checklist?: Json | null
          listing_status?: string | null
          status?: string
          generated_at?: string
          generated_by?: string | null
          format?: string
          errors?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          report_id?: string
          assessment_id?: string
          template_id?: string | null
          version?: string
          template_version?: string | null
          jurisdiction?: string
          generated_for_company?: string
          sections?: Json
          evidence_appendix?: Json
          disclaimers?: Json
          quality_checklist?: Json | null
          listing_status?: string | null
          status?: string
          generated_at?: string
          generated_by?: string | null
          format?: string
          errors?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disclosure_outputs_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          }
        ]
      }
      report_narratives: {
        Row: {
          id: string
          report_id: string
          governance_text: string | null
          esg_text: string | null
          risk_text: string | null
          transparency_text: string | null
          gov_text: string | null
          governance_structured: Json | null
          esg_structured: Json | null
          risk_structured: Json | null
          transparency_structured: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          report_id: string
          governance_text?: string | null
          esg_text?: string | null
          risk_text?: string | null
          transparency_text?: string | null
          gov_text?: string | null
          governance_structured?: Json | null
          esg_structured?: Json | null
          risk_structured?: Json | null
          transparency_structured?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          report_id?: string
          governance_text?: string | null
          esg_text?: string | null
          risk_text?: string | null
          transparency_text?: string | null
          gov_text?: string | null
          governance_structured?: Json | null
          esg_structured?: Json | null
          risk_structured?: Json | null
          transparency_structured?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_narratives_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: true
            referencedRelation: "reports"
            referencedColumns: ["id"]
          }
        ]
      }
      metric_data: {
        Row: {
          id: string
          report_id: string
          metric_code: string
          category: string
          value_numeric: number | null
          value_text: string | null
          value_boolean: boolean | null
          unit: string | null
          data_tier: number | null
          data_source: string | null
          confidence_level: string | null
          calculation_method: string | null
          calculation_inputs: Json | null
          emission_factor_used: number | null
          emission_factor_source: string | null
          notes: string | null
          supporting_doc_url: string | null
          entered_by: string | null
          verified_by: string | null
          verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          report_id: string
          metric_code: string
          category: string
          value_numeric?: number | null
          value_text?: string | null
          value_boolean?: boolean | null
          unit?: string | null
          data_tier?: number | null
          data_source?: string | null
          confidence_level?: string | null
          calculation_method?: string | null
          calculation_inputs?: Json | null
          emission_factor_used?: number | null
          emission_factor_source?: string | null
          notes?: string | null
          supporting_doc_url?: string | null
          entered_by?: string | null
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          report_id?: string
          metric_code?: string
          category?: string
          value_numeric?: number | null
          value_text?: string | null
          value_boolean?: boolean | null
          unit?: string | null
          data_tier?: number | null
          data_source?: string | null
          confidence_level?: string | null
          calculation_method?: string | null
          calculation_inputs?: Json | null
          emission_factor_used?: number | null
          emission_factor_source?: string | null
          notes?: string | null
          supporting_doc_url?: string | null
          entered_by?: string | null
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "metric_data_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
    Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
    Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof Database["public"]["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof Database["public"]["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof Database["public"]["Enums"]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
