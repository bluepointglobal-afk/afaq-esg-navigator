#!/usr/bin/env node

/**
 * Test script for PDF API generation
 * Tests the PDF generation locally without needing Vercel
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the sample report
const sampleReportModule = fs.readFileSync(
  path.join(__dirname, 'src/lib/sample/sample-report.ts'),
  'utf8'
);

// Extract sections from the sample report
// Since it's TypeScript, we'll just use hardcoded test data
const testPayload = {
  companyName: 'Gulf Horizon Manufacturing LLC (Fictional Example)',
  reportingYear: 2025,
  jurisdiction: 'UAE (illustrative)',
  sections: [
    {
      id: 'executive_summary',
      title: 'Executive Summary',
      content: `**Report Purpose & Scope**
This report presents the ESG compliance assessment and sustainability performance of Gulf Horizon Manufacturing LLC for the reporting period FY2025.

**Overall ESG Readiness Score: 68/100 (Developing → Improving)**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    PILLAR SCORES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Environmental:        72/100  ████████████░░░░░
  Social:               65/100  ██████████░░░░░░░
  Governance:           67/100  ███████████░░░░░░
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Key Strengths Identified**
✓ Basic environmental monitoring systems in place (energy, water, waste)
✓ Defined ESG governance roles with executive sponsorship
✓ Initial health & safety procedures and incident tracking system
✓ Employee handbook with basic social policies
✓ Commitment to sustainability improvement roadmap`
    },
    {
      id: 'section2',
      title: 'Test Section 2',
      content: 'This is test content for section 2.'
    },
    {
      id: 'section3',
      title: 'Test Section 3',
      content: 'This is test content for section 3.'
    },
  ]
};

// Generate PDF
function generateTestPdf(payload) {
  const pdf = new PDFDocument({
    margin: 50,
    size: 'A4',
    bufferPages: true,
  });

  // Create output stream
  const outputPath = path.join(__dirname, 'test-report.pdf');
  const stream = fs.createWriteStream(outputPath);
  pdf.pipe(stream);

  // Add title page
  pdf.fontSize(28).font('Helvetica-Bold').text(payload.companyName, { align: 'center' });
  pdf.moveDown(0.5);
  pdf.fontSize(18).font('Helvetica').text('ESG Compliance & Sustainability Report', { align: 'center' });
  pdf.moveDown(0.5);
  pdf.fontSize(14).text(`Reporting Year ${payload.reportingYear}`, { align: 'center' });
  pdf.moveDown(0.2);
  pdf.fontSize(12).text(payload.jurisdiction, { align: 'center' });
  pdf.moveDown(1);

  // Add warning banner
  pdf.rect(50, pdf.y, 495, 60).stroke('#FF6B6B');
  pdf.fontSize(10).font('Helvetica-Bold').text('⚠️  SAMPLE REPORT WITH FICTIONAL DATA', 60, pdf.y + 5);
  pdf.fontSize(9).font('Helvetica').text('This is a demonstration report with fictional, redacted, and illustrative data.', 60, pdf.y + 5, { width: 475 });
  pdf.text('It is provided for demonstration purposes only and not for regulatory submission.', { width: 475 });
  pdf.moveDown(1);

  // Add table of contents
  pdf.addPage();
  pdf.fontSize(16).font('Helvetica-Bold').text('Table of Contents', { underline: true });
  pdf.moveDown(0.5);
  pdf.fontSize(11).font('Helvetica');
  
  payload.sections.forEach((section, index) => {
    pdf.text(`${index + 1}. ${section.title}`);
  });

  pdf.moveDown(1);
  pdf.fontSize(10).text('Generated: ' + new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }));

  // Add each section on new pages
  payload.sections.forEach((section) => {
    pdf.addPage();

    // Section title
    pdf.fontSize(16).font('Helvetica-Bold').text(section.title, { underline: true });
    pdf.moveDown(0.5);

    // Section content - split paragraphs and handle formatting
    const content = section.content;
    const lines = content.split('\n');

    pdf.fontSize(10).font('Helvetica');

    lines.forEach((line) => {
      // Handle bold text (marked with **)
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/);
        pdf.font('Helvetica');
        parts.forEach((part, i) => {
          if (i % 2 === 1) {
            pdf.font('Helvetica-Bold');
            pdf.text(part, { continued: true });
            pdf.font('Helvetica');
          } else if (part) {
            pdf.text(part, { continued: true });
          }
        });
        pdf.text(''); // newline
      } else if (line.trim() === '') {
        // Empty line - add spacing
        pdf.moveDown(0.2);
      } else if (line.startsWith('┌') || line.startsWith('├') || line.startsWith('│') || line.startsWith('└')) {
        // Box drawing characters - keep monospace
        pdf.font('Courier');
        pdf.fontSize(8).text(line);
        pdf.fontSize(10).font('Helvetica');
      } else if (line.startsWith('•') || line.startsWith('○') || line.startsWith('✓') || line.startsWith('⚠') || line.startsWith('🔴') || line.startsWith('🟡')) {
        // Bullet points and symbols
        pdf.text(line);
      } else if (line.startsWith('━')) {
        // Separator lines
        pdf.moveDown(0.2);
      } else {
        // Regular text
        pdf.text(line, { align: 'left' });
      }
    });

    pdf.moveDown(0.5);
  });

  // Add footer with page numbers
  const pages = pdf.bufferedPageRange().count;
  for (let i = 0; i < pages; i++) {
    pdf.switchToPage(i);
    pdf.fontSize(9).text(`Page ${i + 1} of ${pages}`, 50, 750, { align: 'center' });
  }

  // Finalize PDF
  pdf.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      resolve(outputPath);
    });
    stream.on('error', reject);
  });
}

// Run test
console.log('🚀 Generating test PDF...');
generateTestPdf(testPayload)
  .then((filepath) => {
    const stats = fs.statSync(filepath);
    console.log(`✅ PDF generated successfully at: ${filepath}`);
    console.log(`📄 File size: ${(stats.size / 1024).toFixed(2)} KB`);
  })
  .catch((err) => {
    console.error('❌ Error generating PDF:', err);
    process.exit(1);
  });
