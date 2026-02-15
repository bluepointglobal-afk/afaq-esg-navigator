import type { CompanyProfile, AssessmentResult, Gap, PillarScore, MetricData } from '@/types/compliance';
import { buildOutline, type OutlineSection, type FrameworkCode, type JurisdictionCode } from '@/lib/framework/registry';

export interface DisclosurePack {
    companyProfile: CompanyProfile;
    frameworks: string[];
    outline: OutlineSection[];
    narratives: Record<string, string>;
    metrics: MetricData[];
    assessment: {
        scores: PillarScore[];
        gaps: Gap[];
    };
    missingEvidenceCount: number;
}

export type NarrativeInput = Record<string, unknown>;

/**
 * Orchestrates all data into a single package for the AI generator
 */
export function buildDisclosurePack(params: {
    company: CompanyProfile;
    selectedFrameworks: string[];
    assessmentResult: AssessmentResult | null;
    narrative: NarrativeInput | null;
    metrics: MetricData[] | null;
}): DisclosurePack {
    const { company, selectedFrameworks, assessmentResult, narrative, metrics } = params;

    // Normalize narratives to simple string map
    const narrativeTexts: Record<string, string> = {};
    if (narrative) {
        // Extract known text fields if they exist
        if (typeof narrative.governanceText === 'string') narrativeTexts.governanceText = narrative.governanceText;
        if (typeof narrative.esgText === 'string') narrativeTexts.esgText = narrative.esgText;
        if (typeof narrative.riskText === 'string') narrativeTexts.riskText = narrative.riskText;
        if (typeof narrative.transparencyText === 'string') narrativeTexts.transparencyText = narrative.transparencyText;

        // Also copy any other string properties that might be needed
        Object.keys(narrative).forEach(key => {
            if (typeof narrative[key] === 'string' && !narrativeTexts[key]) {
                narrativeTexts[key] = narrative[key];
            }
        });
    }

    // 1. Build Outline
    const outline = buildOutline({
        jurisdiction: (company.jurisdiction as JurisdictionCode) || 'UAE',
        isListed: company.listingStatus === 'listed',
        selectedFrameworks: selectedFrameworks as FrameworkCode[]
    });

    // 2. Count missing evidence (crude MVP check)
    let missingEvidenceCount = 0;
    outline.forEach(section => {
        section.items.forEach(req => {
            req.requiredEvidence.forEach(type => {
                if (type === 'narrative' && !narrativeTexts[`${(req.topic || '').toLowerCase()}Text`]) {
                    missingEvidenceCount++;
                }
                if (type === 'metric' && !metrics?.some(m => m.metricCode === req.id || m.metricCode === req.title)) {
                    // This check is approximate until metric codes are fully mapped
                    missingEvidenceCount++;
                }
            });
        });
    });

    return {
        companyProfile: company,
        frameworks: selectedFrameworks,
        outline,
        narratives: narrativeTexts,
        metrics: metrics || [],
        assessment: {
            scores: assessmentResult?.pillarScores || [],
            gaps: assessmentResult?.gaps || []
        },
        missingEvidenceCount
    };
}
