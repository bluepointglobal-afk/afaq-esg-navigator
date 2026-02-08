// Fixture Validation Script
// Run this to validate all JSON fixtures against Zod schemas

import { companyProfileSchema } from '../schemas/compliance.schema';
import uaeListedCompany from './uae-listed-company.json';
import uaeNonListedCompany from './uae-nonlisted-company.json';
import ksaListedCompany from './ksa-listed-company.json';
import ksaNonListedCompany from './ksa-nonlisted-company.json';
import qatarListedCompany from './qatar-listed-company.json';
import qatarNonListedCompany from './qatar-nonlisted-company.json';

interface ValidationResult {
  fixture: string;
  valid: boolean;
  errors?: string[];
}

function validateFixture(fixture: unknown, name: string): ValidationResult {
  const result = companyProfileSchema.safeParse(fixture);

  if (result.success) {
    return {
      fixture: name,
      valid: true,
    };
  } else {
    return {
      fixture: name,
      valid: false,
      errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
    };
  }
}

export function validateAllFixtures(): ValidationResult[] {
  const fixtures = [
    { data: uaeListedCompany, name: 'UAE Listed Company' },
    { data: uaeNonListedCompany, name: 'UAE Non-Listed Company' },
    { data: ksaListedCompany, name: 'KSA Listed Company' },
    { data: ksaNonListedCompany, name: 'KSA Non-Listed Company' },
    { data: qatarListedCompany, name: 'Qatar Listed Company' },
    { data: qatarNonListedCompany, name: 'Qatar Non-Listed Company' },
  ];

  return fixtures.map(({ data, name }) => validateFixture(data, name));
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🔍 Validating AFAQ Fixtures...\n');

  const results = validateAllFixtures();

  results.forEach(result => {
    if (result.valid) {
      console.log(`✅ ${result.fixture}: PASSED`);
    } else {
      console.log(`❌ ${result.fixture}: FAILED`);
      result.errors?.forEach(err => console.log(`   - ${err}`));
    }
  });

  const allValid = results.every(r => r.valid);

  console.log('\n' + '='.repeat(50));
  if (allValid) {
    console.log('✅ All fixtures validated successfully!');
    process.exit(0);
  } else {
    console.log('❌ Some fixtures failed validation');
    process.exit(1);
  }
}
