/**
 * Server-side PDF generation using Vercel API
 * Generates full 50+ page ESG compliance reports
 */

export interface ReportSection {
  id: string;
  title: string;
  content: string;
}

export interface PdfGenerationPayload {
  companyName: string;
  reportingYear: number;
  jurisdiction: string;
  sections: ReportSection[];
}

/**
 * Generates a PDF report using server-side API
 * @param payload - Report data to generate PDF from
 * @param filename - Optional filename for download
 * @returns Promise that resolves when PDF download is triggered
 */
export async function generateServerPdf(
  payload: PdfGenerationPayload,
  filename?: string
): Promise<void> {
  try {
    // Call the server-side PDF generation API
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate PDF');
    }

    // Get the blob from response
    const blob = await response.blob();

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `${payload.companyName}-esg-report-${payload.reportingYear}.pdf`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
}

/**
 * Generates a filename for the PDF report
 * @param companyName - The company name
 * @param year - The reporting year
 * @param language - The language code (en/ar)
 * @returns Formatted filename
 */
export function generateReportPdfFilename(
  companyName: string,
  year: string | number,
  language: 'en' | 'ar' = 'en'
): string {
  const sanitizedName = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const langSuffix = language === 'ar' ? '-ar' : '';
  return `${sanitizedName}-esg-report-${year}${langSuffix}.pdf`;
}
