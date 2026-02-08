import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MetricData {
    id?: string;
    reportId: string;
    metricCode: string;
    category: 'environmental' | 'social' | 'governance' | 'economic';
    valueNumeric?: number | null;
    valueText?: string | null;
    valueBoolean?: boolean | null;
    unit: string;
    dataTier?: number;
    dataSource?: string;
    notes?: string;
}

interface DbMetricData {
    id: string;
    report_id: string;
    metric_code: string;
    category: MetricData['category'];
    value_numeric: number | null;
    value_text: string | null;
    value_boolean: boolean | null;
    unit: string;
    data_tier: number | null;
    data_source: string | null;
    notes: string | null;
    created_at?: string;
    updated_at?: string;
}

export function useMetricData(reportId: string) {
    return useQuery({
        queryKey: ['metric-data', reportId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('metric_data')
                .select('*')
                .eq('report_id', reportId);

            if (error) throw error;

            // Transform snake_case to camelCase
            return (data as DbMetricData[] || []).map((item) => ({
                id: item.id,
                reportId: item.report_id,
                metricCode: item.metric_code,
                category: item.category,
                valueNumeric: item.value_numeric,
                valueText: item.value_text,
                valueBoolean: item.value_boolean,
                unit: item.unit,
                dataTier: item.data_tier,
                dataSource: item.data_source,
                notes: item.notes,
            })) as MetricData[];
        },
        enabled: !!reportId,
    });
}

export function useUpdateMetricData() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (metric: MetricData) => {
            // Transform camelCase to snake_case
            const payload = {
                report_id: metric.reportId,
                metric_code: metric.metricCode,
                category: metric.category,
                value_numeric: metric.valueNumeric,
                value_text: metric.valueText,
                value_boolean: metric.valueBoolean,
                unit: metric.unit,
                data_tier: metric.dataTier,
                data_source: metric.dataSource,
                notes: metric.notes,
            };

            // If ID exists, update. If not, insert/upsert based on code?
            // For MVP, we'll assume ID handles edit, but let's use UPSERT on (report_id, metric_code) if unique constraint existed?
            // Currently `metric_data` doesn't have unique constraint on (report_id, metric_code) explicitly in my SQL, but logically it should.
            // I'll stick to ID if present, otherwise insert.

            if (metric.id) {
                const { data, error } = await supabase
                    .from('metric_data')
                    .update(payload)
                    .eq('id', metric.id)
                    .select()
                    .single();
                if (error) throw error;
                return data;
            } else {
                const { data, error } = await supabase
                    .from('metric_data')
                    .insert(payload)
                    .select()
                    .single();
                if (error) throw error;
                return data;
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['metric-data', variables.reportId] });
            toast({
                title: 'Metric Saved',
                description: 'Data point has been updated successfully.',
            });
        },
        onError: (error) => {
            console.error('Error saving metric:', error);
            toast({
                title: 'Error',
                description: 'Failed to save metric. Please try again.',
                variant: 'destructive',
            });
        },
    });
}

export function useDeleteMetricData() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('metric_data')
                .delete()
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['metric-data'] });
            toast({
                title: 'Metric Deleted',
                description: 'Data point removed.',
            });
        },
    });
}
