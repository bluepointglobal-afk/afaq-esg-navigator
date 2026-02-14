import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { DisclosureNarratives } from '@/types/disclosure-data';

interface DbDisclosureNarratives {
  id?: string;
  report_id: string;
  ceo_message_format: 'full_text' | 'bullet_points';
  ceo_message_content: string;
  tone_of_voice: 'professional' | 'pragmatic' | 'authentic' | 'technical' | 'visionary';
  materiality_ratings: any;
  materiality_analysis?: string;
  esg_pillars: any;
  esg_strategy_oneliner: string;
  targets: any;
  has_formal_targets: boolean;
  case_studies: any;
  esg_oversight: string;
  risk_management: string;
  policies: any;
  climate_strategy?: any;
  stakeholder_engagement?: string;
  completeness_score: number;
  phase_completed: 1 | 2;
  created_at?: string;
  updated_at?: string;
}

function mapDbToNarratives(row: DbDisclosureNarratives): DisclosureNarratives {
  return {
    id: row.id,
    report_id: row.report_id,
    ceo_message_format: row.ceo_message_format,
    ceo_message_content: row.ceo_message_content,
    tone_of_voice: row.tone_of_voice,
    materiality_ratings: row.materiality_ratings || [],
    materiality_analysis: row.materiality_analysis,
    esg_pillars: row.esg_pillars || [],
    esg_strategy_oneliner: row.esg_strategy_oneliner,
    targets: row.targets || [],
    has_formal_targets: row.has_formal_targets,
    case_studies: row.case_studies || [],
    esg_oversight: row.esg_oversight,
    risk_management: row.risk_management,
    policies: row.policies || [],
    climate_strategy: row.climate_strategy,
    stakeholder_engagement: row.stakeholder_engagement,
    completeness_score: row.completeness_score,
    phase_completed: row.phase_completed,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapNarrativesToDb(narratives: Partial<DisclosureNarratives>): Partial<DbDisclosureNarratives> {
  return {
    report_id: narratives.report_id,
    ceo_message_format: narratives.ceo_message_format,
    ceo_message_content: narratives.ceo_message_content,
    tone_of_voice: narratives.tone_of_voice,
    materiality_ratings: narratives.materiality_ratings,
    materiality_analysis: narratives.materiality_analysis,
    esg_pillars: narratives.esg_pillars,
    esg_strategy_oneliner: narratives.esg_strategy_oneliner,
    targets: narratives.targets,
    has_formal_targets: narratives.has_formal_targets,
    case_studies: narratives.case_studies,
    esg_oversight: narratives.esg_oversight,
    risk_management: narratives.risk_management,
    policies: narratives.policies,
    climate_strategy: narratives.climate_strategy,
    stakeholder_engagement: narratives.stakeholder_engagement,
    completeness_score: narratives.completeness_score,
    phase_completed: narratives.phase_completed,
  };
}

export function useDisclosureNarratives(reportId: string) {
  return useQuery({
    queryKey: ['disclosure-narratives', reportId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('disclosure_narratives')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching disclosure narratives:', error);
        throw error;
      }

      if (!data) return null;
      return mapDbToNarratives(data);
    },
    enabled: !!reportId,
  });
}

export function useUpdateDisclosureNarratives() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (narratives: Partial<DisclosureNarratives> & { report_id: string }) => {
      const dbData = mapNarrativesToDb(narratives);

      const { data, error } = await supabase
        .from('disclosure_narratives')
        .upsert(dbData)
        .select()
        .single();

      if (error) throw error;
      return mapDbToNarratives(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['disclosure-narratives', data.report_id],
      });
    },
  });
}
