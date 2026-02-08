import { v4 as uuidv4 } from 'uuid';
import type {
    DisclosureOutput,
    AssessmentResult,
    SustainabilityReport,
    ReportSection,
    ReportMetric,
    ReportDisclosure,
    DataAnnexRow,
    PillarScore,
    MetricData,
} from '@/types/compliance';

interface GenerateReportInput {
    disclosure: DisclosureOutput;
    assessment: AssessmentResult;
    companyName: string;
    companyNameArabic?: string;
    reportingYear: number;
    metrics?: MetricData[];
}

/**
 * Generate executive summary based on scores and gaps
 */
function generateExecutiveSummary(
    assessment: AssessmentResult,
    companyName: string
): string {
    const { overallScore, pillarScores, gapCount, criticalGapCount } = assessment;

    const scoreLevel = overallScore >= 80 ? 'strong' : overallScore >= 60 ? 'moderate' : 'developing';

    let summary = `${companyName} has achieved an overall ESG compliance score of ${overallScore}% based on the assessment conducted. `;

    summary += `This indicates a ${scoreLevel} level of ESG governance and disclosure readiness. `;

    // Pillar breakdown
    const topPillar = pillarScores.reduce((a, b) => (a.score > b.score ? a : b));
    const bottomPillar = pillarScores.reduce((a, b) => (a.score < b.score ? a : b));

    summary += `\n\nThe strongest performance area is ${formatPillarName(topPillar.pillar)} (${topPillar.score}%), `;
    summary += `while ${formatPillarName(bottomPillar.pillar)} (${bottomPillar.score}%) presents the greatest opportunity for improvement. `;

    // Gap analysis
    if (gapCount > 0) {
        summary += `\n\nThe assessment identified ${gapCount} compliance gap${gapCount !== 1 ? 's' : ''}`;
        if (criticalGapCount > 0) {
            summary += `, including ${criticalGapCount} critical gap${criticalGapCount !== 1 ? 's' : ''} requiring immediate attention`;
        }
        summary += '. Detailed recommendations are provided in the respective sections below.';
    } else {
        summary += '\n\nNo significant compliance gaps were identified during this assessment period.';
    }

    return summary;
}

/**
 * Format pillar name for display
 */
function formatPillarName(pillar: string): string {
    const names: Record<string, string> = {
        governance: 'Governance',
        esg: 'ESG',
        risk_controls: 'Risk & Controls',
        transparency: 'Transparency',
        environmental: 'Environmental',
        social: 'Social',
    };
    return names[pillar] || pillar;
}

/**
 * Map disclosure sections to report sections
 */
function mapDisclosureToReportSection(
    disclosure: DisclosureOutput,
    pillarScores: PillarScore[],
    sectionType: ReportSection['type']
): ReportSection {
    const pillarMap: Record<string, ReportSection['type']> = {
        governance: 'governance',
        esg: 'environmental', // Map ESG to environmental for now
        risk_controls: 'governance',
        transparency: 'governance',
    };

    // Find matching disclosure sections
    const matchingSections = disclosure.sections.filter((s) => {
        if (sectionType === 'environmental') {
            return s.pillar === 'esg' || s.title.toLowerCase().includes('environment');
        }
        if (sectionType === 'social') {
            return s.title.toLowerCase().includes('social') || s.title.toLowerCase().includes('employee');
        }
        if (sectionType === 'governance') {
            return s.pillar === 'governance' || s.pillar === 'risk_controls' || s.pillar === 'transparency';
        }
        return false;
    });

    // Combine narratives
    const narrative = matchingSections.map((s) => s.narrative).join('\n\n') ||
        `No specific ${formatPillarName(sectionType)} disclosures available for this reporting period.`;

    // Extract metrics
    const metrics: ReportMetric[] = matchingSections.flatMap((s) =>
        (s.dataPoints || []).map((dp) => ({
            code: `${s.pillar.toUpperCase()}-${Math.random().toString(36).substr(2, 4)}`,
            name: dp.label,
            value: dp.value,
            source: dp.source,
        }))
    );

    // Create disclosure references
    const disclosures: ReportDisclosure[] = matchingSections.map((s, idx) => ({
        id: `disc-${sectionType}-${idx}`,
        framework: disclosure.jurisdiction === 'UAE' ? 'ADX' : disclosure.jurisdiction === 'KSA' ? 'Tadawul' : 'QSE',
        code: `${sectionType.toUpperCase().substring(0, 3)}-${idx + 1}`,
        title: s.title,
        status: 'addressed' as const,
        reference: `Section ${sectionType}`,
    }));

    const sectionTitles: Record<ReportSection['type'], string> = {
        executive_summary: 'Executive Summary',
        environmental: 'Environmental Performance',
        social: 'Social Responsibility',
        governance: 'Corporate Governance',
        methodology: 'Methodology & Scope',
        data_annex: 'Data Annex',
    };

    const order: Record<ReportSection['type'], number> = {
        executive_summary: 1,
        environmental: 2,
        social: 3,
        governance: 4,
        methodology: 5,
        data_annex: 6,
    };

    return {
        type: sectionType,
        title: sectionTitles[sectionType],
        narrative,
        metrics,
        disclosures,
        order: order[sectionType],
    };
}

/**
 * Generate methodology section
 */
function generateMethodologySection(): ReportSection {
    return {
        type: 'methodology',
        title: 'Methodology & Scope',
        narrative: `This sustainability report has been prepared in accordance with applicable ESG disclosure requirements for the jurisdiction. The assessment methodology encompasses four key pillars: Governance, Environmental, Social, and Governance (ESG), Risk & Controls, and Transparency.

Data collection was performed through a structured questionnaire covering quantitative metrics and qualitative disclosures. Scoring is based on a weighted average methodology with critical items carrying higher weight.

The reporting boundary includes all operations under direct control of the organization. Where data was estimated or extrapolated, this has been noted in the relevant sections.

This report is intended to provide stakeholders with a comprehensive view of the organization's ESG performance and should be read in conjunction with the annual financial statements.`,
        metrics: [],
        disclosures: [],
        order: 5,
    };
}

/**
 * Generate data annex from metrics and disclosure data points
 */
function generateDataAnnex(
    disclosure: DisclosureOutput,
    metrics?: MetricData[]
): DataAnnexRow[] {
    const rows: DataAnnexRow[] = [];

    // Add metrics from disclosure sections
    disclosure.sections.forEach((section) => {
        (section.dataPoints || []).forEach((dp) => {
            rows.push({
                category: formatPillarName(section.pillar),
                metricCode: `${section.pillar.toUpperCase()}-${rows.length + 1}`,
                metricName: dp.label,
                value: dp.value,
                reportSection: section.title,
                disclosureRef: undefined,
            });
        });
    });

    // Add additional metrics if provided
    if (metrics) {
        metrics.forEach((m) => {
            rows.push({
                category: m.category,
                metricCode: m.metricCode,
                metricName: m.metricCode, // Could be enhanced with metric names
                value: m.valueNumeric ?? m.valueText ?? (m.valueBoolean ? 'Yes' : 'No'),
                unit: m.unit ?? undefined,
                reportSection: m.category,
                disclosureRef: undefined,
            });
        });
    }

    return rows;
}

/**
 * Generate a complete sustainability report
 */
export function generateSustainabilityReport(input: GenerateReportInput): SustainabilityReport {
    const { disclosure, assessment, companyName, companyNameArabic, reportingYear, metrics } = input;

    // Generate executive summary
    const executiveSummary: ReportSection = {
        type: 'executive_summary',
        title: 'Executive Summary',
        narrative: generateExecutiveSummary(assessment, companyName),
        metrics: assessment.pillarScores.map((ps) => ({
            code: ps.pillar.toUpperCase(),
            name: `${formatPillarName(ps.pillar)} Score`,
            value: ps.score,
            unit: '%',
        })),
        disclosures: [],
        order: 1,
    };

    // Generate content sections
    const environmentalSection = mapDisclosureToReportSection(disclosure, assessment.pillarScores, 'environmental');
    const socialSection = mapDisclosureToReportSection(disclosure, assessment.pillarScores, 'social');
    const governanceSection = mapDisclosureToReportSection(disclosure, assessment.pillarScores, 'governance');
    const methodologySection = generateMethodologySection();

    // Combine all sections
    const sections: ReportSection[] = [
        executiveSummary,
        environmentalSection,
        socialSection,
        governanceSection,
        methodologySection,
    ].sort((a, b) => a.order - b.order);

    // Generate data annex
    const dataAnnex = generateDataAnnex(disclosure, metrics);

    // Calculate disclosure stats
    const allDisclosures = sections.flatMap((s) => s.disclosures);
    const addressedDisclosures = allDisclosures.filter((d) => d.status === 'addressed').length;
    const partialDisclosures = allDisclosures.filter((d) => d.status === 'partial').length;
    const omittedDisclosures = allDisclosures.filter((d) => d.status === 'omitted').length;

    return {
        id: uuidv4(),
        reportId: disclosure.reportId,
        assessmentId: assessment.id,
        disclosureId: disclosure.id,
        companyName,
        companyNameArabic,
        jurisdiction: disclosure.jurisdiction,
        reportingYear,
        sections,
        dataAnnex,
        totalDisclosures: allDisclosures.length,
        addressedDisclosures,
        partialDisclosures,
        omittedDisclosures,
        generatedAt: new Date().toISOString(),
        templateVersion: '1.0.0',
        status: 'draft',
    };
}
