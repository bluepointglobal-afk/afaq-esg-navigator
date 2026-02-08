// React Query hooks for Questionnaire Templates

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { QuestionnaireTemplate, Jurisdiction } from '@/types/compliance';

/**
 * Fetch questionnaire template by jurisdiction
 */
export function useQuestionnaireTemplate(jurisdiction: Jurisdiction, version: string = '1.0.0') {
  return useQuery({
    queryKey: ['questionnaire-template', jurisdiction, version],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questionnaire_templates')
        .select('*')
        .eq('jurisdiction', jurisdiction)
        .eq('version', version)
        .maybeSingle();

      if (error) {
        // Template doesn't exist yet - return null instead of throwing
        console.log('Template query error (might be expected):', error.code, error.message);
        return null;
      }

      return data as unknown as QuestionnaireTemplate;
    },
    staleTime: 1000 * 60 * 60, // 1 hour - templates are immutable
  });
}

/**
 * Create a new questionnaire template
 */
export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: QuestionnaireTemplate) => {
      const { data, error } = await supabase
        .from('questionnaire_templates')
        .insert({
          id: template.id,
          version: template.version,
          jurisdiction: template.jurisdiction,
          sections: template.sections as unknown as never,
          created_at: template.createdAt,
          updated_at: template.updatedAt,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['questionnaire-template'],
      });
    },
  });
}
