// React Query hooks for Questionnaire Responses

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { QuestionnaireResponse, QuestionAnswer } from '@/types/compliance';
import { DEMO_QUESTIONNAIRE_RESPONSE, isDemoReport } from '@/lib/demo-data';

interface DbQuestionnaireResponse {
  id: string;
  report_id: string;
  template_id: string;
  template_version: string;
  answers: Record<string, QuestionAnswer>;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Map database row to QuestionnaireResponse type
 */
function mapDbToQuestionnaireResponse(row: DbQuestionnaireResponse): QuestionnaireResponse {
  return {
    id: row.id,
    reportId: row.report_id,
    templateId: row.template_id,
    templateVersion: row.template_version,
    answers: row.answers || {},
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Fetch questionnaire response for a report (gets the latest one)
 */
export function useQuestionnaireResponse(reportId: string) {
  return useQuery({
    queryKey: ['questionnaire-response', reportId],
    queryFn: async () => {
      // Return demo data if demo report
      if (isDemoReport(reportId)) {
        return mapDbToQuestionnaireResponse(DEMO_QUESTIONNAIRE_RESPONSE as DbQuestionnaireResponse);
      }

      const { data, error } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('report_id', reportId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching questionnaire response:', error);
        throw error;
      }
      if (!data) return null;
      return mapDbToQuestionnaireResponse(data);
    },
    enabled: !!reportId,
  });
}

/**
 * Create a new questionnaire response
 */
export function useCreateResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      reportId: string;
      templateId: string;
      templateVersion: string;
    }) => {
      const { data, error } = await supabase
        .from('questionnaire_responses')
        .insert({
          report_id: params.reportId,
          template_id: params.templateId,
          template_version: params.templateVersion,
          answers: {},
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['questionnaire-response', data.report_id],
      });
    },
  });
}

/**
 * Update questionnaire response answers (auto-save)
 */
export function useUpdateResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      responseId: string;
      answers: Record<string, QuestionAnswer>;
    }) => {
      const { data, error } = await supabase
        .from('questionnaire_responses')
        .update({
          answers: params.answers as unknown as never,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.responseId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ['questionnaire-response', data.report_id],
        data
      );
    },
  });
}

/**
 * Mark questionnaire as completed
 */
export function useCompleteResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (responseId: string) => {
      const { data, error } = await supabase
        .from('questionnaire_responses')
        .update({
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', responseId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['questionnaire-response', data.report_id],
      });
    },
  });
}

/**
 * Calculate completion percentage
 */
export function calculateCompletion(
  answers: Record<string, QuestionAnswer>,
  totalQuestions: number
): number {
  const answeredCount = Object.keys(answers).length;
  return totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
}
