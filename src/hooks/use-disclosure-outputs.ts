/**
 * React Query hooks for Disclosure Outputs
 * Handles CRUD operations and AI generation for disclosure documents (PAID TIER ONLY)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { DisclosureOutput, DisclosureSection, EvidenceReference, DisclosureDisclaimer as Disclaimer, QualityChecklistItem } from '@/types/compliance';
import type { DisclosurePack } from '@/lib/disclosure/orchestrator';

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
 * Generate disclosure using Edge Function
 * Calls server-side AI generation (PAID TIER ONLY)
 */
export function useGenerateDisclosure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      reportId: string;
      disclosurePack: DisclosurePack;
      language?: 'en' | 'ar';
    }) => {
      // Get current session token (optional for testing)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Call Edge Function (allow anonymous for testing)
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate_disclosure`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token || 'anonymous'}`,
          },
          body: JSON.stringify(params),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown API error' }));
        if (errorData.error === 'TIER_INSUFFICIENT') throw new Error('TIER_INSUFFICIENT');
        throw new Error(errorData.error || 'Disclosure generation failed');
      }

      return await response.json();
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
  const saveDisclosure = useSaveDisclosure();

  return {
    generateAndSave: async (params: {
      reportId: string;
      disclosurePack: DisclosurePack;
      language?: 'en' | 'ar';
    }) => {
      // 1. Generate via Edge Function
      const aiResult = await generateDisclosure.mutateAsync(params);
      const isArabic = params.language === 'ar';

      // 2. Map AI result to DisclosureOutput structure
      const disclosureOutput: Partial<DisclosureOutput> = {
        id: crypto.randomUUID(),
        reportId: params.reportId,
        assessmentId: params.disclosurePack.assessment?.id || '00000000-0000-0000-0000-000000000000',
        jurisdiction: params.disclosurePack.companyProfile?.jurisdiction || 'UAE',
        generatedForCompany: params.disclosurePack.companyProfile?.companyName || 'Unknown',
        sections: aiResult.sections.map((s: AiGeneratedSection, idx: number) => ({
          id: s.id,
          pillar: s.id as 'governance' | 'esg' | 'risk' | 'metrics',
          title: isArabic ? s.title : s.title,
          titleArabic: isArabic ? s.title : undefined,
          order: idx,
          narrative: isArabic ? s.narrative : s.narrative,
          narrativeArabic: isArabic ? s.narrative : undefined,
          dataPoints: (s.dataPoints || []).map((dp: AiGeneratedDataPoint) => ({
            label: dp.label,
            labelArabic: isArabic ? dp.label : undefined,
            value: dp.value,
            source: 'calculated'
          })),
          missingInformation: s.limitations || []
        })),
        evidenceAppendix: [],
        disclaimers: [
          {
            type: 'methodology',
            text: 'Generated based on company-provided evidence and framework requirements.',
            textArabic: 'تم الإنشاء بناءً على الأدلة المقدمة من الشركة ومتطلبات الإطار.',
            order: 0
          }
        ],
        qualityChecklist: [
          {
            category: 'completeness',
            label: 'Framework Coverage',
            labelArabic: 'تغطية المعايير',
            status: (params.disclosurePack.assessment?.gaps?.length || 0) === 0 ? 'pass' : 'warning',
            count: params.disclosurePack.assessment?.gaps?.length || 0
          }
        ],
        generatedAt: new Date().toISOString(),
        generatedBy: (await supabase.auth.getUser()).data.user?.id || null,
        format: 'json',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 3. Save to database
      await saveDisclosure.mutateAsync(disclosureOutput as DisclosureOutput);

      return disclosureOutput;
    },
    isLoading: generateDisclosure.isPending || saveDisclosure.isPending,
    error: generateDisclosure.error || saveDisclosure.error,
  };
}
