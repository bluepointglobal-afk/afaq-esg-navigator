import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from './use-company';
import { useToast } from './use-toast';
import { useNavigate } from 'react-router-dom';

export interface Report {
    id: string;
    companyId: string;
    reportingYear: number;
    status: string;
    overallCompletionPct: number;
    createdAt: string;
    updatedAt: string;
}

export function useActiveReport() {
    const { data: company } = useCompany();

    return useQuery({
        queryKey: ['active-report', company?.id],
        queryFn: async () => {
            if (!company?.id) return null;

            const { data, error } = await supabase
                .from('reports')
                .select('*')
                .eq('company_id', company.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error) {
                throw error;
            }

            if (!data) return null;

            return {
                id: data.id,
                companyId: data.company_id,
                reportingYear: data.reporting_year,
                status: data.status,
                overallCompletionPct: data.overall_completion_pct,
                createdAt: data.created_at,
                updatedAt: data.updated_at
            } as Report;
        },
        enabled: !!company?.id,
    });
}

export function useCreateReport() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const navigate = useNavigate();
    const { data: company } = useCompany();

    return useMutation({
        mutationFn: async (year: number) => {
            if (!company?.id) throw new Error("No company found");

            const { data, error } = await supabase
                .from('reports')
                .insert({
                    company_id: company.id,
                    reporting_year: year,
                    status: 'draft',
                    overall_completion_pct: 0
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['active-report'] });
            toast({
                title: 'Report Started',
                description: 'New ESG report initialized.',
            });
            // Navigate to questionnaire with the newly created report ID
            navigate(`/compliance/questionnaire/${data.id}`);
        },
        onError: (error) => {
            console.error('Create report error:', error);
            toast({
                title: 'Error',
                description: 'Failed to start report.',
                variant: 'destructive',
            });
        },
    });
}
