import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
    id: string;
    email: string;
    companyId?: string;
    role: string;
    tier: "free" | "pro" | "enterprise";
    createdAt?: string;
}

export function useUserProfile() {
    return useQuery({
        queryKey: ["user-profile"],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();

            // Check if in demo mode
            const pathReportId = window.location.pathname.split('/').pop();
            const isDemo = pathReportId === 'demo' || pathReportId === 'demo-sample';

            // Only return demo profile if explicitly in demo mode
            if (!user && isDemo) {
                return {
                    id: "demo-user",
                    email: "demo@afaq.local",
                    companyId: "demo-company",
                    role: 'admin',
                    tier: 'pro',
                    createdAt: undefined,
                } as UserProfile;
            }

            // Require authentication for non-demo routes
            if (!user) {
                throw new Error('Not authenticated');
            }

            const { data: profile, error } = await supabase
                .from("user_profiles")
                .select("*")
                .eq("id", user.id)
                .maybeSingle();

            if (error) throw error;

            // Return default profile if none exists (new user)
            if (!profile) {
                return {
                    id: user.id,
                    email: user.email || '',
                    companyId: undefined,
                    role: 'user',
                    tier: 'free',
                    createdAt: undefined,
                } as UserProfile;
            }

            return {
                id: profile.id,
                email: profile.email,
                companyId: profile.company_id,
                role: profile.role,
                tier: profile.tier,
                createdAt: profile.created_at,
            } as UserProfile;
        },
    });
}
