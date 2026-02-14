import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://afaq-esg-navigator-production.up.railway.app';

interface UploadEvidenceParams {
  reportId: string;
  file: File;
  evidenceType?: string;
  description?: string;
  linkedCaseStudyIndex?: number;
}

export function useUploadEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UploadEvidenceParams) => {
      const { reportId, file, evidenceType, description, linkedCaseStudyIndex } = params;

      // Get current user's session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('reportId', reportId);
      if (evidenceType) formData.append('evidenceType', evidenceType);
      if (description) formData.append('description', description);
      if (linkedCaseStudyIndex !== undefined) {
        formData.append('linkedCaseStudyIndex', linkedCaseStudyIndex.toString());
      }

      const response = await fetch(`${BACKEND_URL}/api/evidence/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['evidence', variables.reportId],
      });
    },
  });
}

export function useEvidence(reportId: string) {
  return useQuery({
    queryKey: ['evidence', reportId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${BACKEND_URL}/api/evidence/${reportId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch evidence');
      }

      return response.json();
    },
    enabled: !!reportId,
  });
}

export function useDeleteEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ evidenceId, reportId }: { evidenceId: string; reportId: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${BACKEND_URL}/api/evidence/${evidenceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete evidence');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['evidence', variables.reportId],
      });
    },
  });
}
