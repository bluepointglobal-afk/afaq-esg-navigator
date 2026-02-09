#!/usr/bin/env node
/**
 * Extract the complete sample report data from TypeScript file
 * and output it as JSON for testing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sampleReportPath = path.join(__dirname, 'src/lib/sample/sample-report.ts');
const content = fs.readFileSync(sampleReportPath, 'utf8');

// Extract the sections array using regex
const sectionsMatch = content.match(/sections:\s*\[([\s\S]*?)\s*\]\s*,?\s*\};/);

if (!sectionsMatch) {
  console.error('Could not extract sections from sample-report.ts');
  process.exit(1);
}

// Parse the sections (simplified extraction)
// The content is structured as objects with id, title, and content fields

// For now, let's just write the full TypeScript to a temporary file and import it
const tempFile = path.join(__dirname, 'temp-sample-report.mjs');
const tsContent = content
  .replace('export type SampleReportSection', '// export type SampleReportSection')
  .replace('export type SampleSustainabilityReport', '// export type SampleSustainabilityReport')
  .replace('export const SAMPLE_SUSTAINABILITY_REPORT', 'const SAMPLE_SUSTAINABILITY_REPORT')
  + '\nexport default SAMPLE_SUSTAINABILITY_REPORT;';

fs.writeFileSync(tempFile, tsContent);

// Import and use it
import(tempFile).then((module) => {
  const report = module.default;
  
  console.log(`✅ Extracted sample report:`);
  console.log(`   Company: ${report.companyName}`);
  console.log(`   Year: ${report.reportingYear}`);
  console.log(`   Sections: ${report.sections.length}`);
  
  report.sections.forEach((section, i) => {
    const lines = section.content.split('\n').length;
    const chars = section.content.length;
    console.log(`   ${i + 1}. ${section.title}: ${lines} lines, ${chars} chars`);
  });
  
  // Write to JSON for testing
  const outputPath = path.join(__dirname, 'sample-report-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Saved to: ${outputPath}`);
  
  // Cleanup
  fs.unlinkSync(tempFile);
}).catch(err => {
  console.error('Error importing:', err);
  if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
  process.exit(1);
});
