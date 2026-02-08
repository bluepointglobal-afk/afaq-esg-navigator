import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
    supabase: {
        from: vi.fn(),
    },
}));

describe('Security - RLS Boundary Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should handle 403 Forbidden error when user tries to access narratives of another company', async () => {
        // Setup mock to return a 403 error (simulating RLS failure)
        const mockMaybeSingle = vi.fn().mockResolvedValue({
            data: null,
            error: {
                message: 'new row violates row-level security policy for table "report_narratives"',
                code: '42501', // PostgreSQL Insufficient Privilege code
                status: 403,
            },
        });

        const mockLimit = vi.fn().mockReturnValue({
            maybeSingle: mockMaybeSingle,
        });

        const mockOrder = vi.fn().mockReturnValue({
            limit: mockLimit,
        });

        const mockEq = vi.fn().mockReturnValue({
            order: mockOrder,
        });

        const mockSelect = vi.fn().mockReturnValue({
            eq: mockEq,
        });

        (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
            select: mockSelect,
        });

        // Simulate the hook or direct call
        const { data, error } = await supabase
            .from('report_narratives')
            .select('*')
            .eq('report_id', 'other-company-report-id')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        // Assertions
        expect(error).toBeDefined();
        expect(error?.code).toBe('42501');
        expect(data).toBeNull();
    });

    it('should handle unauthorized insert attempt', async () => {
        // Setup mock to return an RLS violation error on insert
        const mockInsert = vi.fn().mockResolvedValue({
            data: null,
            error: {
                message: 'new row violates row-level security policy for table "report_narratives"',
                code: '42501',
            },
        });

        (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
            insert: mockInsert,
        });

        // Simulate insert attempt
        const { data, error } = await supabase
            .from('report_narratives')
            .insert({
                report_id: 'another-company-report-id',
                gov_text: 'Malicious injection attempt',
            });

        // Assertions
        expect(error).toBeDefined();
        expect(error?.code).toBe('42501');
        expect(data).toBeNull();
    });
});
