import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { DEMO_COMPANY, isDemoReport } from '@/lib/demo-data';

export interface CompanyData {
    id: string;
    name: string;
    nameArabic?: string;
    country: string;
    industry: string;
    employeeCount?: number;
    annualRevenue?: number;
    revenueCurrency: string;
    isListed: boolean;
    stockExchange?: string;
    logoUrl?: string;
    created_at?: string;
}

export function useCompany() {
    return useQuery({
        queryKey: ['company'],
        queryFn: async () => {
            // Check if in demo mode
            const pathReportId = window.location.pathname.split('/').pop();
            if (isDemoReport(pathReportId)) {
                return {
                    id: DEMO_COMPANY.id,
                    name: DEMO_COMPANY.name,
                    country: DEMO_COMPANY.region,
                    industry: DEMO_COMPANY.industry,
                    employeeCount: DEMO_COMPANY.employees,
                    annualRevenue: DEMO_COMPANY.revenue_sar,
                    revenueCurrency: 'SAR',
                    isListed: false,
                } as CompanyData;
            }

            // 1. Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // 2. Get user profile to find company_id
            const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('company_id')
                .eq('id', user.id)
                .maybeSingle();

            if (profileError) throw profileError;
            if (!profile?.company_id) return null;

            // 3. Get company details
            const { data: company, error: companyError } = await supabase
                .from('companies')
                .select('*')
                .eq('id', profile.company_id)
                .maybeSingle();

            if (companyError) throw companyError;
            if (!company) return null;

            // Transform to camelCase
            return {
                id: company.id,
                name: company.name,
                nameArabic: company.name_arabic,
                country: company.country,
                industry: company.industry,
                employeeCount: company.employee_count,
                annualRevenue: company.annual_revenue,
                revenueCurrency: company.revenue_currency,
                isListed: company.is_listed,
                stockExchange: company.stock_exchange,
                logoUrl: company.logo_url,
                created_at: company.created_at
            } as CompanyData;
        },
    });
}

export function useCreateCompany() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (data: Omit<CompanyData, 'id'>) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // 1. Insert Company
            const { data: company, error: createError } = await supabase
                .from('companies')
                .insert({
                    name: data.name,
                    name_arabic: data.nameArabic,
                    country: data.country,
                    industry: data.industry,
                    employee_count: data.employeeCount,
                    annual_revenue: data.annualRevenue,
                    revenue_currency: data.revenueCurrency || 'USD',
                    is_listed: data.isListed,
                    stock_exchange: data.stockExchange,
                })
                .select()
                .single();

            if (createError) throw createError;

            // 2. Update User Profile to link to this company
            // Check if profile exists first
            const { data: existingProfile } = await supabase
                .from('user_profiles')
                .select('id')
                .eq('id', user.id)
                .maybeSingle();

            if (existingProfile) {
                const { error: linkError } = await supabase
                    .from('user_profiles')
                    .update({ company_id: company.id })
                    .eq('id', user.id);
                if (linkError) throw linkError;
            } else {
                // Create profile if missing (fallback)
                const { error: createProfileError } = await supabase
                    .from('user_profiles')
                    .insert({
                        id: user.id,
                        email: user.email!, // Assuming email is present
                        company_id: company.id,
                        role: 'admin', // First user is admin
                        tier: 'free'
                    });
                if (createProfileError) throw createProfileError;
            }

            return company;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['company'] });
            toast({
                title: 'Company Created',
                description: 'Your company profile has been set up.',
            });
            navigate('/dashboard');
        },
        onError: (error) => {
            console.error('Create company error:', error);
            toast({
                title: 'Error',
                description: 'Failed to create company profile.',
                variant: 'destructive',
            });
        },
    });
}

export function useUpdateCompany() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (data: Partial<CompanyData> & { id: string }) => {
            const { error } = await supabase
                .from('companies')
                .update({
                    name: data.name,
                    name_arabic: data.nameArabic,
                    country: data.country,
                    industry: data.industry,
                    employee_count: data.employeeCount,
                    annual_revenue: data.annualRevenue,
                    revenue_currency: data.revenueCurrency,
                    is_listed: data.isListed,
                    stock_exchange: data.stockExchange,
                })
                .eq('id', data.id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['company'] });
            toast({
                title: 'Company Updated',
                description: 'Your changes have been saved.',
            });
        },
        onError: (error) => {
            console.error('Update company error:', error);
            toast({
                title: 'Update Failed',
                description: 'Could not update company details.',
                variant: 'destructive',
            });
        },
    });
}
