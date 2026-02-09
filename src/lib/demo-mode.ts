/**
 * Demo Mode - Enable full app access without authentication
 * For M2M evaluation and public demos
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Check if user is authenticated
 * Returns false for anonymous/demo mode
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}

/**
 * Check if we should use demo mode
 * Returns true when no user is authenticated OR reportId is 'demo'
 */
export async function shouldUseDemoMode(reportId?: string): Promise<boolean> {
  if (reportId === 'demo' || reportId === 'demo-sample') {
    return true;
  }
  return !(await isAuthenticated());
}

/**
 * Get demo user context
 */
export function getDemoUser() {
  return {
    id: 'demo-user-1',
    email: 'demo@afaq-esg.com',
    company_id: 'd9584a70-b721-4abb-a3b3-f5ac326afccd',
  };
}
