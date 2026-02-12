/**
 * Create Test Users for AFAQ ESG Navigator
 *
 * Run this script to set up test accounts with sample company data.
 * Usage: npx tsx scripts/create-test-users.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables:');
  console.error('   VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
  console.error('   Get service key from: Supabase Dashboard → Settings → API');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testUsers = [
  {
    email: 'ahmed@alfahad.sa',
    password: 'Test123!@#',
    fullName: 'Ahmed Al-Rashid',
    company: {
      name: 'Al-Fahad Manufacturing',
      nameArabic: 'شركة الفهد للصناعة',
      country: 'Saudi Arabia',
      industry: 'Manufacturing',
      employeeCount: 180,
      annualRevenue: 45000000,
      revenueCurrency: 'SAR',
      isListed: true,
      stockExchange: 'Tadawul'
    }
  },
  {
    email: 'fatima@gulftech.ae',
    password: 'Test123!@#',
    fullName: 'Fatima Al-Mansoori',
    company: {
      name: 'Gulf Tech Solutions',
      nameArabic: 'حلول الخليج التقنية',
      country: 'UAE',
      industry: 'Technology',
      employeeCount: 95,
      annualRevenue: 28000000,
      revenueCurrency: 'AED',
      isListed: false,
      stockExchange: null
    }
  },
  {
    email: 'test@afaq.local',
    password: 'Test123!@#',
    fullName: 'Test User',
    company: {
      name: 'Demo Corporation',
      nameArabic: 'الشركة التجريبية',
      country: 'Saudi Arabia',
      industry: 'Energy & Utilities',
      employeeCount: 250,
      annualRevenue: 120000000,
      revenueCurrency: 'SAR',
      isListed: true,
      stockExchange: 'Tadawul'
    }
  }
];

async function createTestUsers() {
  console.log('🚀 Creating test users for AFAQ ESG Navigator...\n');

  for (const testUser of testUsers) {
    console.log(`📧 Creating: ${testUser.email}`);

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true,
        user_metadata: {
          full_name: testUser.fullName
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`   ⚠️  User already exists, skipping...`);
          continue;
        }
        throw authError;
      }

      const userId = authData.user.id;
      console.log(`   ✅ Auth user created: ${userId}`);

      // 2. Create company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: testUser.company.name,
          name_arabic: testUser.company.nameArabic,
          country: testUser.company.country,
          industry: testUser.company.industry,
          employee_count: testUser.company.employeeCount,
          annual_revenue: testUser.company.annualRevenue,
          revenue_currency: testUser.company.revenueCurrency,
          is_listed: testUser.company.isListed,
          stock_exchange: testUser.company.stockExchange
        })
        .select()
        .single();

      if (companyError) throw companyError;
      console.log(`   ✅ Company created: ${companyData.id}`);

      // 3. Create user profile linking to company
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          email: testUser.email,
          company_id: companyData.id,
          role: 'admin',
          tier: 'free'
        });

      if (profileError) throw profileError;
      console.log(`   ✅ User profile linked to company`);
      console.log(`   🎉 Complete: ${testUser.email} → ${testUser.company.name}\n`);

    } catch (error) {
      console.error(`   ❌ Error creating ${testUser.email}:`, error);
      console.log('');
    }
  }

  console.log('✅ Test user creation complete!\n');
  console.log('📋 Test Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  testUsers.forEach(user => {
    console.log(`   Email:    ${user.email}`);
    console.log(`   Password: ${user.password}`);
    console.log(`   Company:  ${user.company.name}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });
  console.log('');
  console.log('🔗 Login at: https://afaq-esg-navigator.vercel.app/auth');
}

createTestUsers().catch(console.error);
