/**
 * Seed utility for creating test questionnaire data in Supabase
 * Run with: npx tsx scripts/seed-questionnaire.ts
 */

import { createClient } from '@supabase/supabase-js';
import { buildQuestionnaireTemplate } from '../src/lib/questionnaire/builder';
import type { CompanyProfile } from '../src/types/compliance';

// Load from environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   - VITE_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease set these variables in your .env.local file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Test company profiles
const testProfiles: CompanyProfile[] = [
  {
    companyId: '11111111-1111-1111-1111-111111111111',
    companyName: 'Emirates Green Energy LLC',
    companyNameArabic: 'الإمارات للطاقة الخضراء ذ.م.م',
    jurisdiction: 'UAE',
    listingStatus: 'listed',
    stockExchange: 'ADX',
    sector: 'Energy',
    subsector: 'Renewable Energy',
    employeeCountBand: '51-250',
    annualRevenueBand: '10M-50M',
    revenueCurrency: 'AED',
    operationalYears: 7,
    hasInternationalOps: false,
    hasCriticalInfrastructure: true,
    hasFullTimeEmployees: true,
    hasContractors: true,
    hasRemoteWorkforce: false,
    fiscalYearEnd: 12,
    reportingYear: 2024,
  },
  {
    companyId: '22222222-2222-2222-2222-222222222222',
    companyName: 'Riyadh Tech Solutions Ltd',
    companyNameArabic: 'حلول الرياض التقنية المحدودة',
    jurisdiction: 'KSA',
    listingStatus: 'non-listed',
    stockExchange: undefined,
    sector: 'Technology',
    subsector: 'Software',
    employeeCountBand: '11-50',
    annualRevenueBand: '1M-10M',
    revenueCurrency: 'SAR',
    operationalYears: 3,
    hasInternationalOps: false,
    hasCriticalInfrastructure: false,
    hasFullTimeEmployees: true,
    hasContractors: false,
    hasRemoteWorkforce: true,
    fiscalYearEnd: 12,
    reportingYear: 2024,
  },
  {
    companyId: '33333333-3333-3333-3333-333333333333',
    companyName: 'Qatar Financial Services',
    companyNameArabic: 'الخدمات المالية القطرية',
    jurisdiction: 'Qatar',
    listingStatus: 'listed',
    stockExchange: 'QSE',
    sector: 'Finance',
    subsector: 'Banking',
    employeeCountBand: '251-500',
    annualRevenueBand: '50M-100M',
    revenueCurrency: 'QAR',
    operationalYears: 15,
    hasInternationalOps: true,
    hasCriticalInfrastructure: true,
    hasFullTimeEmployees: true,
    hasContractors: true,
    hasRemoteWorkforce: false,
    fiscalYearEnd: 12,
    reportingYear: 2024,
  },
];

async function main() {
  console.log('='.repeat(80));
  console.log('AFAQ Questionnaire Seeding Utility');
  console.log('='.repeat(80));

  // Step 1: Generate and insert templates
  console.log('\n📝 Step 1: Generating questionnaire templates...');
  console.log('-'.repeat(80));

  const templates = testProfiles.map((profile) => {
    const template = buildQuestionnaireTemplate(profile);
    console.log(`✅ Generated template for ${profile.companyName}`);
    console.log(`   ID: ${template.id}`);
    console.log(`   Version: ${template.version}`);
    console.log(`   Jurisdiction: ${template.jurisdiction}`);
    console.log(`   Sections: ${template.sections.length}`);
    console.log(`   Total Questions: ${template.sections.reduce((sum, s) => sum + s.questions.length, 0)}`);
    return template;
  });

  console.log('\n💾 Inserting templates into database...');
  for (const template of templates) {
    const { error } = await supabase.from('questionnaire_templates').upsert(
      {
        id: template.id,
        version: template.version,
        jurisdiction: template.jurisdiction,
        sections: template.sections as unknown as never,
        created_at: template.createdAt,
        updated_at: template.updatedAt,
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.error(`❌ Failed to insert template ${template.id}:`, error.message);
    } else {
      console.log(`✅ Inserted template ${template.id}`);
    }
  }

  // Step 2: Create mock reports
  console.log('\n📊 Step 2: Creating mock reports...');
  console.log('-'.repeat(80));

  const reportIds: string[] = [];
  for (let i = 0; i < testProfiles.length; i++) {
    const profile = testProfiles[i];
    const reportId = `report-${profile.jurisdiction.toLowerCase()}-${i + 1}`;
    reportIds.push(reportId);

    const { error } = await supabase.from('reports').upsert(
      {
        id: reportId,
        company_id: profile.companyId,
        reporting_year: profile.reportingYear,
        status: 'in_progress',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.error(`❌ Failed to create report ${reportId}:`, error.message);
    } else {
      console.log(`✅ Created report ${reportId} for ${profile.companyName}`);
    }
  }

  // Step 3: Create questionnaire responses
  console.log('\n📋 Step 3: Creating questionnaire responses...');
  console.log('-'.repeat(80));

  for (let i = 0; i < reportIds.length; i++) {
    const reportId = reportIds[i];
    const template = templates[i];

    const { error } = await supabase.from('questionnaire_responses').upsert(
      {
        id: `response-${i + 1}`,
        report_id: reportId,
        template_id: template.id,
        template_version: template.version,
        answers: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.error(`❌ Failed to create response for ${reportId}:`, error.message);
    } else {
      console.log(`✅ Created questionnaire response for ${reportId}`);
    }
  }

  // Summary
  console.log('\n✅ Seeding Summary');
  console.log('-'.repeat(80));
  console.log(`✅ Templates inserted: ${templates.length}`);
  console.log(`✅ Reports created: ${reportIds.length}`);
  console.log(`✅ Responses created: ${reportIds.length}`);
  console.log('\n' + '='.repeat(80));
  console.log('✅ SEEDING COMPLETE');
  console.log('='.repeat(80));
  console.log('\n💡 You can now log in and navigate to /compliance/questionnaire');
  console.log('   to test the questionnaire with pre-generated templates.\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ SEEDING FAILED:', error);
    process.exit(1);
  });
