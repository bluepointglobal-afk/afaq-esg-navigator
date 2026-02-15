import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { DisclosureMetrics } from '@/types/disclosure-data';

interface DbDisclosureMetrics {
  id?: string;
  report_id: string;
  scope1_tonnes_co2e?: number;
  scope2_tonnes_co2e?: number;
  scope3_calculated: boolean;
  scope3_tonnes_co2e?: number;
  total_energy_kwh?: number;
  renewable_energy_percent?: number;
  water_consumption_m3?: number;
  total_waste_tonnes?: number;
  waste_recycled_percent?: number;
  total_employees?: number;
  percent_women?: number;
  percent_women_leadership?: number;
  employee_turnover_percent?: number;
  training_hours_per_employee?: number;
  lost_time_injuries?: number;
  safety_training_hours?: number;
  fatalities?: number;
  suppliers_assessed_esg?: number;
  local_suppliers_percent?: number;
  data_quality: 'estimated' | 'measured' | 'verified' | 'audited';
  baseline_year?: number;
  reporting_period_start?: string;
  reporting_period_end?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

function mapDbToMetrics(row: DbDisclosureMetrics): DisclosureMetrics {
  return {
    id: row.id,
    report_id: row.report_id,
    scope1_tonnes_co2e: row.scope1_tonnes_co2e,
    scope2_tonnes_co2e: row.scope2_tonnes_co2e,
    scope3_calculated: row.scope3_calculated,
    scope3_tonnes_co2e: row.scope3_tonnes_co2e,
    total_energy_kwh: row.total_energy_kwh,
    renewable_energy_percent: row.renewable_energy_percent,
    water_consumption_m3: row.water_consumption_m3,
    total_waste_tonnes: row.total_waste_tonnes,
    waste_recycled_percent: row.waste_recycled_percent,
    total_employees: row.total_employees,
    percent_women: row.percent_women,
    percent_women_leadership: row.percent_women_leadership,
    employee_turnover_percent: row.employee_turnover_percent,
    training_hours_per_employee: row.training_hours_per_employee,
    lost_time_injuries: row.lost_time_injuries,
    safety_training_hours: row.safety_training_hours,
    fatalities: row.fatalities,
    suppliers_assessed_esg: row.suppliers_assessed_esg,
    local_suppliers_percent: row.local_suppliers_percent,
    data_quality: row.data_quality,
    baseline_year: row.baseline_year,
    reporting_period_start: row.reporting_period_start,
    reporting_period_end: row.reporting_period_end,
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapMetricsToDb(metrics: Partial<DisclosureMetrics>): Partial<DbDisclosureMetrics> {
  return {
    report_id: metrics.report_id,
    scope1_tonnes_co2e: metrics.scope1_tonnes_co2e,
    scope2_tonnes_co2e: metrics.scope2_tonnes_co2e,
    scope3_calculated: metrics.scope3_calculated,
    scope3_tonnes_co2e: metrics.scope3_tonnes_co2e,
    total_energy_kwh: metrics.total_energy_kwh,
    renewable_energy_percent: metrics.renewable_energy_percent,
    water_consumption_m3: metrics.water_consumption_m3,
    total_waste_tonnes: metrics.total_waste_tonnes,
    waste_recycled_percent: metrics.waste_recycled_percent,
    total_employees: metrics.total_employees,
    percent_women: metrics.percent_women,
    percent_women_leadership: metrics.percent_women_leadership,
    employee_turnover_percent: metrics.employee_turnover_percent,
    training_hours_per_employee: metrics.training_hours_per_employee,
    lost_time_injuries: metrics.lost_time_injuries,
    safety_training_hours: metrics.safety_training_hours,
    fatalities: metrics.fatalities,
    suppliers_assessed_esg: metrics.suppliers_assessed_esg,
    local_suppliers_percent: metrics.local_suppliers_percent,
    data_quality: metrics.data_quality,
    baseline_year: metrics.baseline_year,
    reporting_period_start: metrics.reporting_period_start,
    reporting_period_end: metrics.reporting_period_end,
    notes: metrics.notes,
  };
}

export function useDisclosureMetrics(reportId: string) {
  return useQuery({
    queryKey: ['disclosure-metrics', reportId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('disclosure_metrics')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching disclosure metrics:', error);
        throw error;
      }

      if (!data) return null;
      return mapDbToMetrics(data);
    },
    enabled: !!reportId,
  });
}

export function useUpdateDisclosureMetrics() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (metrics: Partial<DisclosureMetrics> & { report_id: string }) => {
      const dbData = mapMetricsToDb(metrics);

      const { data, error } = await supabase
        .from('disclosure_metrics')
        .upsert(dbData, { onConflict: 'report_id' })
        .select()
        .single();

      if (error) throw error;
      return mapDbToMetrics(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['disclosure-metrics', data.report_id],
      });
    },
  });
}
