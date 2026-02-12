import { Router } from 'express';
import PDFDocument from 'pdfkit';
import { supabase } from '../server';
import { logger } from '../utils/logger';

const router = Router();

/**
 * POST /api/pdf/generate
 *
 * Generate PDF from disclosure (no timeout limits)
 */
router.post('/generate', async (req, res) => {
  try {
    const { reportId } = req.body;
    const userId = req.user!.id;

    // Verify access
    const { data: report } = await supabase
      .from('reports')
      .select('company_id')
      .eq('id', reportId)
      .single();

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('company_id')
      .eq('id', userId)
      .single();

    if (profile?.company_id !== report.company_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Get disclosure
    const { data: disclosure } = await supabase
      .from('disclosure_outputs')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!disclosure) {
      return res.status(404).json({ error: 'Disclosure not found' });
    }

    // Generate PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="disclosure-${reportId}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Title page
    doc.fontSize(24).text(disclosure.generated_for_company || 'ESG Disclosure Report', {
      align: 'center',
    });
    doc.moveDown();
    doc.fontSize(14).text(`Reporting Year: ${new Date().getFullYear()}`, {
      align: 'center',
    });
    doc.moveDown(2);

    // Sections
    if (disclosure.sections && Array.isArray(disclosure.sections)) {
      for (const section of disclosure.sections) {
        doc.addPage();
        doc.fontSize(18).text(section.title || 'Section', { underline: true });
        doc.moveDown();
        doc.fontSize(12).text(section.narrative || '', { align: 'justify' });
        doc.moveDown();
      }
    }

    // Finalize
    doc.end();

    logger.info('PDF generated', { reportId, userId });

  } catch (error) {
    logger.error('PDF generation error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'PDF generation failed' });
    }
  }
});

export default router;
