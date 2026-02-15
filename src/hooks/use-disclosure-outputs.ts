/**
 * React Query hooks for Disclosure Outputs
 * Handles CRUD operations and AI generation for disclosure documents (PAID TIER ONLY)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { DisclosureOutput, DisclosureSection, EvidenceReference, DisclosureDisclaimer as Disclaimer, QualityChecklistItem } from '@/types/compliance';
import type { DisclosurePack } from '@/lib/disclosure/orchestrator';
import { DEMO_DISCLOSURE, isDemoReport } from '@/lib/demo-data';

interface DbDisclosureOutput {
  id: string;
  report_id: string;
  assessment_id: string;
  template_id: string | null;
  version: string;
  jurisdiction: string;
  generated_for_company: string;
  sections: DisclosureSection[];
  evidence_appendix: EvidenceReference[];
  disclaimers: Disclaimer[];
  quality_checklist: QualityChecklistItem[];
  status: string;
  generated_at: string;
  generated_by: string | null;
  format: string;
  created_at: string;
  updated_at: string;
}

interface AiGeneratedDataPoint {
  label: string;
  value: string;
}

interface AiGeneratedSection {
  id: string;
  title: string;
  narrative: string;
  dataPoints?: AiGeneratedDataPoint[];
  limitations?: string[];
}

/**
 * Fetch disclosure output for a report
 */
export function useDisclosureOutput(reportId: string) {
  return useQuery({
    queryKey: ['disclosure-output', reportId],
    queryFn: async () => {
      // Return demo data if demo report
      if (isDemoReport(reportId)) {
        return DEMO_DISCLOSURE as unknown as DisclosureOutput;
      }

      const { data, error } = await supabase
        .from('disclosure_outputs')
        .select('*')
        .eq('report_id', reportId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        // Handle 409 conflict - may indicate RLS or concurrency issue
        if (error.code === '409' || error.message?.includes('conflict')) {
          console.warn('Disclosure output query conflict, returning null:', error);
          return null;
        }
        // Don't throw on PGRST116 (no rows) - just return null
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching disclosure output:', error);
        throw error;
      }
      return data as unknown as DisclosureOutput | null;
    },
    enabled: !!reportId,
    retry: (failureCount, error) => {
      // Don't retry on conflict errors
      if ((error as unknown as { code?: string })?.code === '409') return false;
      return failureCount < 2;
    },
  });
}

/**
 * Fetch disclosure output by ID
 */
export function useDisclosureOutputById(disclosureId: string) {
  return useQuery({
    queryKey: ['disclosure-output-by-id', disclosureId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('disclosure_outputs')
        .select('*')
        .eq('id', disclosureId)
        .single();

      if (error) throw error;
      return data as unknown as DisclosureOutput;
    },
    enabled: !!disclosureId,
  });
}

/**
 * Generate disclosure using Railway backend (no timeout limits)
 * Calls server-side AI generation (PAID TIER ONLY)
 */
export function useGenerateDisclosure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      reportId: string;
      disclosurePack: DisclosurePack;
      language?: 'en' | 'ar';
      onProgress?: (progress: number) => void;
    }) => {
      // Get current session token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error('Authentication required');
      }

      const backendUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001';

      // Step 1: Queue the job
      const queueResponse = await fetch(
        `${backendUrl}/api/disclosure/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            reportId: params.reportId,
            frameworks: ['ifrs-s1', 'ifrs-s2'], // Extract from disclosurePack if needed
            companyProfile: {
              name: params.disclosurePack.companyProfile?.companyName,
              industry: params.disclosurePack.companyProfile?.industry,
              jurisdiction: params.disclosurePack.companyProfile?.jurisdiction,
            },
            language: params.language || 'en',
          }),
        }
      );

      if (!queueResponse.ok) {
        const errorData = await queueResponse.json().catch(() => ({ error: 'Unknown API error' }));
        if (errorData.error === 'TIER_INSUFFICIENT') throw new Error('TIER_INSUFFICIENT');
        throw new Error(errorData.error || 'Failed to queue disclosure generation');
      }

      const { jobId } = await queueResponse.json();

      // Step 2: Poll for job status
      const maxAttempts = 120; // 2 minutes max (1 second intervals)
      let attempts = 0;

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

        const statusResponse = await fetch(
          `${backendUrl}/api/disclosure/status/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        if (!statusResponse.ok) {
          throw new Error('Failed to check job status');
        }

        const statusData = await statusResponse.json();
        const { status, progress, result, error } = statusData;

        // Update progress callback
        if (params.onProgress && typeof progress === 'number') {
          params.onProgress(progress);
        }

        // Job completed successfully
        if (status === 'completed' && result) {
          return result;
        }

        // Job failed
        if (status === 'failed') {
          throw new Error(error || 'Disclosure generation failed');
        }

        attempts++;
      }

      throw new Error('Job timed out after 2 minutes');
    },
  });
}

/**
 * Save disclosure output to database
 * Used after Edge Function generation
 * Uses upsert to allow regeneration of disclosures
 */
export function useSaveDisclosure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (disclosure: DisclosureOutput) => {
      // First check if a disclosure already exists for this report
      const { data: existing } = await supabase
        .from('disclosure_outputs')
        .select('id')
        .eq('report_id', disclosure.reportId)
        .maybeSingle();

      if (existing) {
        // Update existing disclosure
        const { data, error } = await supabase
          .from('disclosure_outputs')
          .update({
            assessment_id: disclosure.assessmentId,
            version: disclosure.templateVersion || '1.0.0',
            jurisdiction: disclosure.jurisdiction,
            generated_for_company: disclosure.generatedForCompany,
            sections: disclosure.sections as unknown as never,
            evidence_appendix: disclosure.evidenceAppendix as unknown as never,
            disclaimers: disclosure.disclaimers as unknown as never,
            quality_checklist: disclosure.qualityChecklist as unknown as never,
            generated_at: disclosure.generatedAt,
            generated_by: disclosure.generatedBy === '00000000-0000-0000-0000-000000000000' ? null : disclosure.generatedBy,
            format: disclosure.format,
            status: disclosure.status || 'draft',
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          if (error.message?.includes('policy')) {
            throw new Error('TIER_INSUFFICIENT');
          }
          throw error;
        }

        return data;
      } else {
        // Insert new disclosure
        const { data, error } = await supabase
          .from('disclosure_outputs')
          .insert({
            id: disclosure.id,
            report_id: disclosure.reportId,
            assessment_id: disclosure.assessmentId,
            version: disclosure.templateVersion || '1.0.0',
            jurisdiction: disclosure.jurisdiction,
            generated_for_company: disclosure.generatedForCompany,
            sections: disclosure.sections as unknown as never,
            evidence_appendix: disclosure.evidenceAppendix as unknown as never,
            disclaimers: disclosure.disclaimers as unknown as never,
            quality_checklist: disclosure.qualityChecklist as unknown as never,
            generated_at: disclosure.generatedAt,
            generated_by: disclosure.generatedBy === '00000000-0000-0000-0000-000000000000' ? null : disclosure.generatedBy,
            format: disclosure.format,
            status: disclosure.status || 'draft',
            created_at: disclosure.createdAt,
            updated_at: disclosure.updatedAt,
          })
          .select()
          .single();

        if (error) {
          // Check if it's an RLS policy error (tier insufficient)
          if (error.message?.includes('policy')) {
            throw new Error('TIER_INSUFFICIENT');
          }
          throw error;
        }

        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['disclosure-output', data.report_id],
      });
    },
  });
}

/**
 * Update disclosure output
 */
export function useUpdateDisclosure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { disclosureId: string; updates: Partial<DisclosureOutput> }) => {
      const { disclosureId, updates } = params;

      const updateData: Partial<DbDisclosureOutput> = {
        updated_at: new Date().toISOString(),
      };

      if (updates.sections !== undefined) {
        updateData.sections = updates.sections;
      }
      if (updates.status !== undefined) {
        updateData.status = updates.status;
      }
      if (updates.format !== undefined) {
        updateData.format = updates.format;
      }

      const { data, error } = await supabase
        .from('disclosure_outputs')
        .update(updateData)
        .eq('id', disclosureId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['disclosure-output', data.report_id],
      });
      queryClient.invalidateQueries({
        queryKey: ['disclosure-output-by-id', data.id],
      });
    },
  });
}

/**
 * Delete disclosure output
 */
export function useDeleteDisclosure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (disclosureId: string) => {
      const { error } = await supabase.from('disclosure_outputs').delete().eq('id', disclosureId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['disclosure-output'],
      });
    },
  });
}

/**
 * Combined hook: Generate and save disclosure in one operation
 */
export function useGenerateAndSaveDisclosure() {
  const generateDisclosure = useGenerateDisclosure();
  const queryClient = useQueryClient();

  return {
    generateAndSave: async (params: {
      reportId: string;
      disclosurePack: DisclosurePack;
      language?: 'en' | 'ar';
      onProgress?: (progress: number) => void;
    }) => {
      // 1. Generate via Railway backend (backend saves to database)
      const result = await generateDisclosure.mutateAsync(params);

      // 2. Validate result
      if (!result || !result.success || !result.disclosureId) {
        console.error('Invalid backend result:', result);
        throw new Error('Backend returned invalid response format. Please try again.');
      }

      // 3. Invalidate queries to fetch fresh disclosure from database
      queryClient.invalidateQueries({
        queryKey: ['disclosure-output', params.reportId],
      });

      return {
        id: result.disclosureId,
        reportId: result.reportId,
      };
    },
    isLoading: generateDisclosure.isPending,
    error: generateDisclosure.error,
  };
}
