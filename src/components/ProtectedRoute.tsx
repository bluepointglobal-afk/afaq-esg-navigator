import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * ProtectedRoute - Guards routes requiring authentication.
 * Redirects unauthenticated users to /auth.
 * 
 * BMAD Task: T-001
 * Risk Addressed: 02_RISKS.md §2.1 - Missing Route Protection
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Check current session
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
            setIsLoading(false);
        };

        checkAuth();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setIsAuthenticated(!!session);
                setIsLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    if (isLoading) {
        // Minimal loading state - preserves existing behavior
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to auth, preserving intended destination
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
