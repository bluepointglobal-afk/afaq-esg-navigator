import * as XLSX from 'xlsx';
import { DisclosureOutput } from '@/types/compliance';

interface MetricItem {
  metricCode: string;
  category: string;
  valueNumeric?: number | null;
  valueText?: string | null;
  valueBoolean?: boolean | null;
  unit?: string | null;
}

interface GapItem {
  id: string;
  pillar: string;
  title: string;
  description: string;
  severity: string;
}

interface ExcelExportData {
  disclosure: DisclosureOutput;
  metrics?: MetricItem[];
  gaps?: GapItem[];
  scores?: { pillar: string; score: number }[];
}

/**
 * Generates an Excel workbook from disclosure data
 */
export function generateExcel(data: ExcelExportData, filename: string): void {
  const { disclosure, metrics = [], gaps = [], scores = [] } = data;

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Sheet 1: Summary
  const summaryData = [
    ['ESG Disclosure Report Summary'],
    [],
    ['Company', disclosure.generatedForCompany || 'N/A'],
    ['Report ID', disclosure.reportId],
    ['Generated At', new Date(disclosure.generatedAt).toLocaleString()],
    ['Template Version', disclosure.templateVersion || '1.0.0'],
    ['Total Sections', disclosure.sections.length],
    [],
    ['Pillar Scores'],
    ['Pillar', 'Score (%)'],
    ...scores.map(s => [s.pillar, s.score]),
    [],
    ['Sections Overview'],
    ['Section', 'Data Points'],
    ...disclosure.sections.map(s => [s.title, s.dataPoints?.length || 0]),
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary['!cols'] = [{ wch: 30 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  // Sheet 2: Metrics
  if (metrics.length > 0) {
    const metricsHeader = ['Metric Code', 'Category', 'Value', 'Unit'];
    const metricsRows = metrics.map(m => [
      m.metricCode,
      m.category,
      m.valueNumeric ?? m.valueText ?? (m.valueBoolean !== null ? String(m.valueBoolean) : 'N/A'),
      m.unit || '',
    ]);
    const wsMetrics = XLSX.utils.aoa_to_sheet([metricsHeader, ...metricsRows]);
    wsMetrics['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsMetrics, 'Metrics');
  }

  // Sheet 3: Gaps
  if (gaps.length > 0) {
    const gapsHeader = ['ID', 'Pillar', 'Title', 'Description', 'Severity'];
    const gapsRows = gaps.map(g => [
      g.id,
      g.pillar,
      g.title,
      g.description,
      g.severity,
    ]);
    const wsGaps = XLSX.utils.aoa_to_sheet([gapsHeader, ...gapsRows]);
    wsGaps['!cols'] = [{ wch: 15 }, { wch: 12 }, { wch: 30 }, { wch: 50 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, wsGaps, 'Gaps');
  }

  // Sheet 4: Data Points (from sections)
  const allDataPoints: string[][] = [['Section', 'Label', 'Value']];
  disclosure.sections.forEach(section => {
    if (section.dataPoints) {
      section.dataPoints.forEach(dp => {
        allDataPoints.push([section.title, dp.label, dp.value]);
      });
    }
  });
  if (allDataPoints.length > 1) {
    const wsDataPoints = XLSX.utils.aoa_to_sheet(allDataPoints);
    wsDataPoints['!cols'] = [{ wch: 25 }, { wch: 30 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, wsDataPoints, 'Data Points');
  }

  // Sheet 5: Disclaimers
  const disclaimersData = [
    ['Disclaimers'],
    [],
    ['Type', 'Text'],
    ...disclosure.disclaimers.map(d => [d.type, d.text]),
  ];
  const wsDisclaimers = XLSX.utils.aoa_to_sheet(disclaimersData);
  wsDisclaimers['!cols'] = [{ wch: 15 }, { wch: 80 }];
  XLSX.utils.book_append_sheet(wb, wsDisclaimers, 'Disclaimers');

  // Generate and download
  const xlsxFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  XLSX.writeFile(wb, xlsxFilename);
}

/**
 * Generates a filename for the Excel export
 */
export function generateExcelFilename(
  companyName: string,
  year: string | number
): string {
  const sanitizedName = (companyName || 'company')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${sanitizedName}-esg-data-${year}.xlsx`;
}
