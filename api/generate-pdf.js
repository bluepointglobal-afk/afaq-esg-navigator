import PDFDocument from 'pdfkit';

/**
 * Serverless function to generate a full ESG compliance report PDF
 * Deployed to Vercel as /api/generate-pdf
 * 
 * Request body:
 * {
 *   "companyName": "Company Name",
 *   "reportingYear": 2025,
 *   "jurisdiction": "UAE",
 *   "sections": [
 *     {
 *       "id": "section-id",
 *       "title": "Section Title",
 *       "content": "Section content..."
 *     }
 *   ]
 * }
 * 
 * Returns: PDF binary stream with proper headers
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { companyName, reportingYear, jurisdiction, sections = [] } = req.body;

    // Validate input
    if (!companyName || !reportingYear || !sections.length) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create PDF document
    const pdf = new PDFDocument({
      margin: 50,
      size: 'A4',
      bufferPages: true,
    });

    // Set response headers for PDF download
    const filename = `${companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-esg-report-${reportingYear}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Pipe PDF to response
    pdf.pipe(res);

    // Add title page
    pdf.fontSize(28).font('Helvetica-Bold').text(companyName, { align: 'center' });
    pdf.moveDown(0.5);
    pdf.fontSize(18).font('Helvetica').text('ESG Compliance & Sustainability Report', { align: 'center' });
    pdf.moveDown(0.5);
    pdf.fontSize(14).text(`Reporting Year ${reportingYear}`, { align: 'center' });
    pdf.moveDown(0.2);
    pdf.fontSize(12).text(jurisdiction, { align: 'center' });
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
    
    sections.forEach((section, index) => {
      pdf.text(`${index + 1}. ${section.title}`);
    });

    pdf.moveDown(1);
    pdf.fontSize(10).text('Generated: ' + new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));

    // Add each section on new pages
    sections.forEach((section) => {
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
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF', message: error.message });
  }
}
