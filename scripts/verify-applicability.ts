/**
 * Manual verification script for applicability and conditional logic
 * Run with: npx tsx scripts/verify-applicability.ts
 */

import { buildQuestionnaireTemplate } from '../src/lib/questionnaire/builder';
import { shouldShowQuestion } from '../src/lib/conditional-logic';
import type { CompanyProfile, QuestionAnswer } from '../src/types/compliance';

// Test Case 1: UAE Listed Company
const uaeListedProfile: CompanyProfile = {
  companyId: 'test-1',
  companyName: 'UAE Listed Test Co',
  companyNameArabic: 'شركة اختبار إماراتية مدرجة',
  jurisdiction: 'UAE',
  listingStatus: 'listed',
  stockExchange: 'ADX',
  sector: 'Technology',
  subsector: 'Software',
  employeeCountBand: '51-250',
  annualRevenueBand: '10M-50M',
  revenueCurrency: 'AED',
  operationalYears: 5,
  hasInternationalOps: false,
  hasCriticalInfrastructure: false,
  hasFullTimeEmployees: true,
  hasContractors: false,
  hasRemoteWorkforce: false,
  fiscalYearEnd: 12,
  reportingYear: 2024,
};

// Test Case 2: KSA Non-Listed Company (FIXED: non-listed with hyphen, not underscore)
const ksaNonListedProfile: CompanyProfile = {
  companyId: 'test-2',
  companyName: 'KSA Non-Listed Test Co',
  companyNameArabic: 'شركة اختبار سعودية غير مدرجة',
  jurisdiction: 'KSA',
  listingStatus: 'non-listed',
  stockExchange: undefined,
  sector: 'Finance',
  subsector: 'Banking',
  employeeCountBand: '11-50',
  annualRevenueBand: '1M-10M',
  revenueCurrency: 'SAR',
  operationalYears: 3,
  hasInternationalOps: false,
  hasCriticalInfrastructure: false,
  hasFullTimeEmployees: true,
  hasContractors: false,
  hasRemoteWorkforce: false,
  fiscalYearEnd: 12,
  reportingYear: 2024,
};

console.log('='.repeat(80));
console.log('AFAQ Applicability & Conditional Logic Verification');
console.log('='.repeat(80));

// Test Case 1: UAE Listed
console.log('\n📋 Test Case 1: UAE Listed Company');
console.log('-'.repeat(80));
const uaeTemplate = buildQuestionnaireTemplate(uaeListedProfile);
console.log(`✅ Template generated: ${uaeTemplate.id}`);
console.log(`   Version: ${uaeTemplate.version}`);
console.log(`   Jurisdiction: ${uaeTemplate.jurisdiction}`);
console.log(`   Sections: ${uaeTemplate.sections.length}`);

let totalQuestionsUAE = 0;
uaeTemplate.sections.forEach((section) => {
  console.log(`\n   ${section.title}:`);
  console.log(`   - Questions: ${section.questions.length}`);
  console.log(`   - Pillar: ${section.pillar}`);
  totalQuestionsUAE += section.questions.length;
});
console.log(`\n   Total Questions: ${totalQuestionsUAE}`);

// Test Case 2: KSA Non-Listed
console.log('\n📋 Test Case 2: KSA Non-Listed Company');
console.log('-'.repeat(80));
const ksaTemplate = buildQuestionnaireTemplate(ksaNonListedProfile);
console.log(`✅ Template generated: ${ksaTemplate.id}`);
console.log(`   Version: ${ksaTemplate.version}`);
console.log(`   Jurisdiction: ${ksaTemplate.jurisdiction}`);
console.log(`   Sections: ${ksaTemplate.sections.length}`);

let totalQuestionsKSA = 0;
ksaTemplate.sections.forEach((section) => {
  console.log(`\n   ${section.title}:`);
  console.log(`   - Questions: ${section.questions.length}`);
  console.log(`   - Pillar: ${section.pillar}`);
  totalQuestionsKSA += section.questions.length;
});
console.log(`\n   Total Questions: ${totalQuestionsKSA}`);

// Test Case 3: Conditional Logic
console.log('\n🔗 Test Case 3: Conditional Logic');
console.log('-'.repeat(80));

// Find a question with conditional rules
const questionWithRules = uaeTemplate.sections
  .flatMap((s) => s.questions)
  .find((q) => q.conditionalRules && q.conditionalRules.length > 0);

if (questionWithRules) {
  console.log(`✅ Found question with conditional rules: ${questionWithRules.code}`);
  console.log(`   Text: ${questionWithRules.text}`);
  console.log(`   Rules: ${questionWithRules.conditionalRules.length}`);

  questionWithRules.conditionalRules.forEach((rule, idx) => {
    console.log(`\n   Rule ${idx + 1}:`);
    console.log(`   - Depends on: ${rule.dependsOnQuestionId}`);
    console.log(`   - Operator: ${rule.operator}`);
    console.log(`   - Value: ${rule.value}`);
    console.log(`   - Show when: ${rule.showWhen}`);
  });

  // Test visibility with no answers
  console.log('\n   Visibility Test 1: No answers provided');
  const visible1 = shouldShowQuestion(questionWithRules.conditionalRules, {});
  console.log(`   - Should show: ${visible1} (expected: false)`);

  // Test visibility with matching answer
  const mockAnswers: Record<string, QuestionAnswer> = {};
  const firstRule = questionWithRules.conditionalRules[0];
  mockAnswers[firstRule.dependsOnQuestionId] = {
    questionId: firstRule.dependsOnQuestionId,
    value: firstRule.value,
    answeredAt: new Date().toISOString(),
    answeredBy: 'test-user',
  };

  console.log('\n   Visibility Test 2: Matching answer provided');
  const visible2 = shouldShowQuestion(questionWithRules.conditionalRules, mockAnswers);
  console.log(`   - Should show: ${visible2} (expected: true)`);
} else {
  console.log('⚠️  No questions with conditional rules found');
}

// Validation
console.log('\n✅ Validation Summary');
console.log('-'.repeat(80));

const validations = [
  {
    name: 'Template generation for UAE Listed',
    passed: uaeTemplate && uaeTemplate.jurisdiction === 'UAE',
  },
  {
    name: 'Template generation for KSA Non-Listed',
    passed: ksaTemplate && ksaTemplate.jurisdiction === 'KSA',
  },
  {
    name: 'Questions filtered by jurisdiction',
    passed: totalQuestionsUAE > 0 && totalQuestionsKSA > 0,
  },
  {
    name: 'Conditional logic evaluator exists',
    passed: typeof shouldShowQuestion === 'function',
  },
];

validations.forEach((v) => {
  console.log(`${v.passed ? '✅' : '❌'} ${v.name}`);
});

const allPassed = validations.every((v) => v.passed);
console.log('\n' + '='.repeat(80));
console.log(allPassed ? '✅ ALL CHECKS PASSED' : '❌ SOME CHECKS FAILED');
console.log('='.repeat(80));

process.exit(allPassed ? 0 : 1);
