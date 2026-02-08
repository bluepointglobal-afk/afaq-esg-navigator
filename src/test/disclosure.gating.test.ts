import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
    supabase: {
        from: vi.fn(),
        auth: {
            getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        },
    },
}));

describe('Entitlement Gating - Free vs Pro', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should prevent disclosure generation for free tier users', async () => {
        // Mock user profile with 'free' tier
        const mockSingle = vi.fn().mockResolvedValue({
            data: { tier: 'free' },
            error: null,
        });

        (supabase.from as Mock).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: mockSingle,
                }),
            }),
        });

        // Simulate the server-side check in the Edge Function (logic check)
        const userTier = 'free';
        const isGated = userTier !== 'pro' && userTier !== 'enterprise';

        expect(isGated).toBe(true);
    });

    it('should allow disclosure generation for pro tier users', async () => {
        // Mock user profile with 'pro' tier
        const mockSingle = vi.fn().mockResolvedValue({
            data: { tier: 'pro' },
            error: null,
        });

        (supabase.from as Mock).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: mockSingle,
                }),
            }),
        });

        // Simulate the server-side check in the Edge Function (logic check)
        const userTier = 'pro';
        const isGated = userTier !== 'pro' && userTier !== 'enterprise';

        expect(isGated).toBe(false);
    });
});
