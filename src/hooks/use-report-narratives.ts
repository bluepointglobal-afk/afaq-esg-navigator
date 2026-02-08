import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DEMO_NARRATIVE, isDemoReport } from '@/lib/demo-data';

export interface ReportNarrative {
  id?: string;
  reportId: string;
  governanceText: string;
  esgText: string;
  riskText: string;
  transparencyText: string;
  governanceStructured: Record<string, unknown>[];
  esgStructured: Record<string, unknown>[];
  riskStructured: Record<string, unknown>[];
  transparencyStructured: Record<string, unknown>[];
  createdAt?: string;
  updatedAt?: string;
}

interface DbReportNarrative {
  report_id: string;
  gov_text: string | null;
  esg_text: string | null;
  risk_text: string | null;
  transparency_text: string | null;
  gov_structured: Record<string, unknown>[] | null;
  esg_structured: Record<string, unknown>[] | null;
  risk_structured: Record<string, unknown>[] | null;
  transparency_structured: Record<string, unknown>[] | null;
  created_at?: string;
  updated_at?: string;
}

// Schema uses 'gov_text', 'esg_text', etc. and 'report_id' is the PK.

function mapDbToNarrative(row: DbReportNarrative): ReportNarrative {
  return {
    // The DB has report_id as PK, so we use it as the unique ID for the narrative entity too
    id: row.report_id,
    reportId: row.report_id,
    governanceText: row.gov_text || '',
    esgText: row.esg_text || '',
    riskText: row.risk_text || '',
    transparencyText: row.transparency_text || '',
    governanceStructured: row.gov_structured || [],
    esgStructured: row.esg_structured || [],
    riskStructured: row.risk_structured || [],
    transparencyStructured: row.transparency_structured || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function useReportNarrative(reportId: string) {
  return useQuery({
    queryKey: ['report-narrative', reportId],
    queryFn: async () => {
      // Return demo data if demo report
      if (isDemoReport(reportId)) {
        return {
          id: DEMO_NARRATIVE.id,
          reportId: DEMO_NARRATIVE.report_id,
          governanceText: DEMO_NARRATIVE.content,
          esgText: DEMO_NARRATIVE.content,
          riskText: DEMO_NARRATIVE.content,
          transparencyText: DEMO_NARRATIVE.content,
          governanceStructured: [],
          esgStructured: [],
          riskStructured: [],
          transparencyStructured: [],
        };
      }

      const { data, error } = await supabase
        .from('report_narratives')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching narrative:', error);
        throw error;
      }

      if (!data) return null;
      return mapDbToNarrative(data);
    },
    enabled: !!reportId,
  });
}

export function useUpdateReportNarrative() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (narrative: ReportNarrative) => {
      // Upsert: report_id is the PK, so we can just upsert directly
      const dbData: DbReportNarrative = {
        report_id: narrative.reportId,
        gov_text: narrative.governanceText,
        esg_text: narrative.esgText,
        risk_text: narrative.riskText,
        transparency_text: narrative.transparencyText,
        gov_structured: narrative.governanceStructured,
        esg_structured: narrative.esgStructured,
        risk_structured: narrative.riskStructured,
        transparency_structured: narrative.transparencyStructured,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('report_narratives')
        .upsert(dbData)
        .select()
        .single();

      if (error) throw error;
      return mapDbToNarrative(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['report-narrative', data.reportId],
      });
    },
  });
}

