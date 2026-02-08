/**
 * React Query hooks for Assessment Results
 * Handles CRUD operations for compliance assessment results
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AssessmentResult, PillarScore, Gap, Recommendation, ScoreExplanation } from '@/types/compliance';

interface DbAssessmentResult {
  id: string;
  report_id: string;
  questionnaire_response_id: string;
  overall_score: number;
  pillar_scores: PillarScore[];
  gaps: Gap[];
  gap_count: number;
  critical_gap_count: number;
  recommendations: Recommendation[];
  explanation: ScoreExplanation;
  assessed_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Map database row to AssessmentResult type
 */
function mapDbToAssessmentResult(row: DbAssessmentResult): AssessmentResult {
  return {
    id: row.id,
    reportId: row.report_id,
    questionnaireResponseId: row.questionnaire_response_id,
    overallScore: row.overall_score,
    pillarScores: row.pillar_scores || [],
    gaps: row.gaps || [],
    gapCount: row.gap_count,
    criticalGapCount: row.critical_gap_count,
    recommendations: row.recommendations || [],
    explanation: row.explanation || ({} as ScoreExplanation),
    assessedAt: row.assessed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Fetch assessment result for a report (gets the latest one)
 */
export function useAssessmentResult(reportId: string) {
  return useQuery({
    queryKey: ['assessment-result', reportId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('report_id', reportId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching assessment:', error);
        throw error;
      }
      if (!data) return null;
      return mapDbToAssessmentResult(data);
    },
    enabled: !!reportId,
  });
}

/**
 * Fetch assessment result by questionnaire response ID
 */
export function useAssessmentResultByResponse(responseId: string) {
  return useQuery({
    queryKey: ['assessment-result-by-response', responseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('questionnaire_response_id', responseId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      return mapDbToAssessmentResult(data);
    },
    enabled: !!responseId,
  });
}

/**
 * Create a new assessment result
 */
export function useCreateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assessment: AssessmentResult) => {
      const { data, error } = await supabase
        .from('assessment_results')
        .insert({
          id: assessment.id,
          report_id: assessment.reportId,
          questionnaire_response_id: assessment.questionnaireResponseId,
          overall_score: assessment.overallScore,
          pillar_scores: assessment.pillarScores as unknown as never,
          gaps: assessment.gaps as unknown as never,
          gap_count: assessment.gapCount,
          critical_gap_count: assessment.criticalGapCount,
          recommendations: assessment.recommendations as unknown as never,
          explanation: assessment.explanation as unknown as never,
          assessed_at: assessment.assessedAt,
          created_at: assessment.createdAt,
          updated_at: assessment.updatedAt,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ['assessment-result', data.report_id],
      });
      queryClient.invalidateQueries({
        queryKey: ['assessment-result-by-response', data.questionnaire_response_id],
      });
    },
  });
}

/**
 * Update an existing assessment result
 */
export function useUpdateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      assessmentId: string;
      assessment: Partial<AssessmentResult>;
    }) => {
      const { assessmentId, assessment } = params;

      const updateData: Partial<DbAssessmentResult> = {
        updated_at: new Date().toISOString(),
      };

      if (assessment.overallScore !== undefined) {
        updateData.overall_score = assessment.overallScore;
      }
      if (assessment.pillarScores !== undefined) {
        updateData.pillar_scores = assessment.pillarScores;
      }
      if (assessment.gaps !== undefined) {
        updateData.gaps = assessment.gaps;
        updateData.gap_count = assessment.gaps.length;
        updateData.critical_gap_count = assessment.gaps.filter((g) => g.severity === 'critical').length;
      }
      if (assessment.recommendations !== undefined) {
        updateData.recommendations = assessment.recommendations;
      }
      if (assessment.explanation !== undefined) {
        updateData.explanation = assessment.explanation;
      }

      const { data, error } = await supabase
        .from('assessment_results')
        .update(updateData)
        .eq('id', assessmentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['assessment-result', data.report_id],
      });
      queryClient.invalidateQueries({
        queryKey: ['assessment-result-by-response', data.questionnaire_response_id],
      });
    },
  });
}

/**
 * Delete an assessment result
 */
export function useDeleteAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assessmentId: string) => {
      const { error } = await supabase.from('assessment_results').delete().eq('id', assessmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['assessment-result'],
      });
    },
  });
}

/**
 * Helper: Run assessment and save to database
 */
export function useRunAndSaveAssessment() {
  const createAssessment = useCreateAssessment();

  return {
    runAndSave: async (assessment: AssessmentResult) => {
      return createAssessment.mutateAsync(assessment);
    },
    isLoading: createAssessment.isPending,
    error: createAssessment.error,
  };
}
