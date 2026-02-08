import html2pdf from 'html2pdf.js';

export interface PdfOptions {
  filename: string;
  isRtl?: boolean;
}

/**
 * Generates a PDF from HTML content and triggers download
 * @param html - The HTML string to convert to PDF
 * @param options - PDF generation options including filename and RTL support
 * @returns Promise that resolves when PDF download is triggered
 */
export async function generatePdf(html: string, options: PdfOptions): Promise<void> {
  const { filename, isRtl = false } = options;

  // Create a temporary container for the HTML
  const container = document.createElement('div');
  container.innerHTML = html;
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '210mm'; // A4 width

  if (isRtl) {
    container.style.direction = 'rtl';
    container.setAttribute('dir', 'rtl');
  }

  document.body.appendChild(container);

  const pdfOptions = {
    margin: 10,
    filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait' as const,
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  try {
    await html2pdf().set(pdfOptions).from(container).save();
  } finally {
    // Clean up the temporary container
    document.body.removeChild(container);
  }
}

/**
 * Generates a filename for the disclosure PDF
 * @param companyName - The company name
 * @param year - The reporting year
 * @param language - The language code (en/ar)
 * @returns Formatted filename
 */
export function generatePdfFilename(
  companyName: string,
  year: string | number,
  language: 'en' | 'ar' = 'en'
): string {
  const sanitizedName = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const langSuffix = language === 'ar' ? '-ar' : '';
  return `${sanitizedName}-esg-disclosure-${year}${langSuffix}.pdf`;
}

/**
 * Generates a filename for the sustainability report PDF
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
  return `${sanitizedName}-sustainability-report-${year}${langSuffix}.pdf`;
}
