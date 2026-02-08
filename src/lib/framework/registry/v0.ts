import { z } from 'zod';

// ===========================================
// TYPES & SCHEMAS
// ===========================================

export type JurisdictionCode = 'UAE' | 'KSA' | 'QATAR' | 'GLOBAL';
export type FrameworkCode = 'IFRS_S1' | 'IFRS_S2' | 'TCFD' | 'GRI' | 'LOCAL_UAE' | 'LOCAL_KSA' | 'LOCAL_QATAR';
export type EvidenceType = 'narrative' | 'metric' | 'boolean' | 'document';
export type TopicCode = 'GOV' | 'STRATEGY' | 'RISK' | 'METRICS' | 'CLIMATE' | 'SOCIAL' | 'ETHICS';

export interface DisclosureItem {
    id: string; // e.g. 'IFRS_S2_GOV_1'
    title: string;
    description?: string;
    framework: FrameworkCode;
    topic: TopicCode;
    required_evidence: EvidenceType[];
    jurisdiction_relevance: JurisdictionCode[];
    min_evidence_threshold: 'low' | 'medium' | 'high'; // 'low' = just mention, 'high' = data + doc
}

export const DisclosureItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    framework: z.enum(['IFRS_S1', 'IFRS_S2', 'TCFD', 'GRI', 'LOCAL_UAE', 'LOCAL_KSA', 'LOCAL_QATAR']),
    topic: z.enum(['GOV', 'STRATEGY', 'RISK', 'METRICS', 'CLIMATE', 'SOCIAL', 'ETHICS']),
    required_evidence: z.array(z.enum(['narrative', 'metric', 'boolean', 'document'])),
    jurisdiction_relevance: z.array(z.enum(['UAE', 'KSA', 'QATAR', 'GLOBAL'])),
});

// ===========================================
// FRAMEWORK REGISTRY v0 (MVP)
// ===========================================

const GLOBAL_JURISDICTIONS: JurisdictionCode[] = ['UAE', 'KSA', 'QATAR', 'GLOBAL'];

export const FRAMEWORK_REGISTRY: DisclosureItem[] = [
    // --- IFRS S1 (General) ---
    {
        id: 'IFRS_S1_GOV_1',
        title: 'Governance Body Oversight',
        description: 'Describe the governance body(s) or individual(s) responsible for oversight of sustainability-related risks and opportunities.',
        framework: 'IFRS_S1',
        topic: 'GOV',
        required_evidence: ['narrative'],
        jurisdiction_relevance: GLOBAL_JURISDICTIONS,
        min_evidence_threshold: 'medium'
    },
    {
        id: 'IFRS_S1_STRAT_1',
        title: 'Sustainability Risks & Opportunities',
        description: 'Describe the sustainability-related risks and opportunities that could reasonably be expected to affect the entity’s prospects.',
        framework: 'IFRS_S1',
        topic: 'STRATEGY',
        required_evidence: ['narrative'],
        jurisdiction_relevance: GLOBAL_JURISDICTIONS,
        min_evidence_threshold: 'medium'
    },

    // --- IFRS S2 (Climate) ---
    {
        id: 'IFRS_S2_GOV_1',
        title: 'Climate Governance',
        description: 'Describe the governance body’s oversight of climate-related risks and opportunities.',
        framework: 'IFRS_S2',
        topic: 'GOV',
        required_evidence: ['narrative'],
        jurisdiction_relevance: GLOBAL_JURISDICTIONS,
        min_evidence_threshold: 'medium'
    },
    {
        id: 'IFRS_S2_STRAT_1',
        title: 'Climate Resilience',
        description: 'Describe the resilience of the entity’s strategy to climate-related changes.',
        framework: 'IFRS_S2',
        topic: 'STRATEGY',
        required_evidence: ['narrative', 'metric'],
        jurisdiction_relevance: GLOBAL_JURISDICTIONS,
        min_evidence_threshold: 'high'
    },
    {
        id: 'IFRS_S2_MET_1',
        title: 'GHG Emissions (Scope 1, 2, 3)',
        description: 'Disclose absolute gross greenhouse gas emissions generated during the reporting period.',
        framework: 'IFRS_S2',
        topic: 'METRICS',
        required_evidence: ['metric'],
        jurisdiction_relevance: GLOBAL_JURISDICTIONS,
        min_evidence_threshold: 'high'
    },

    // --- TCFD (Climate - specific mapping usually overlaps S2, but distinct for legacy support) ---
    {
        id: 'TCFD_GOV_A',
        title: 'Board Oversight of Climate',
        framework: 'TCFD',
        topic: 'GOV',
        required_evidence: ['narrative'],
        jurisdiction_relevance: GLOBAL_JURISDICTIONS,
        min_evidence_threshold: 'medium'
    },
    {
        id: 'TCFD_RISK_A',
        title: 'Climate Risk Identification Process',
        framework: 'TCFD',
        topic: 'RISK',
        required_evidence: ['narrative'],
        jurisdiction_relevance: GLOBAL_JURISDICTIONS,
        min_evidence_threshold: 'medium'
    },
    {
        id: 'TCFD_MET_A',
        title: 'key Climate Metrics',
        framework: 'TCFD',
        topic: 'METRICS',
        required_evidence: ['metric'],
        jurisdiction_relevance: GLOBAL_JURISDICTIONS,
        min_evidence_threshold: 'medium'
    },

    // --- GRI (Impact) ---
    {
        id: 'GRI_2_9',
        title: 'Governance Structure and Composition',
        framework: 'GRI',
        topic: 'GOV',
        required_evidence: ['narrative'],
        jurisdiction_relevance: GLOBAL_JURISDICTIONS,
        min_evidence_threshold: 'medium'
    },
    {
        id: 'GRI_305_1',
        title: 'Direct (Scope 1) GHG Emissions',
        framework: 'GRI',
        topic: 'CLIMATE',
        required_evidence: ['metric'],
        jurisdiction_relevance: GLOBAL_JURISDICTIONS,
        min_evidence_threshold: 'high'
    },
    {
        id: 'GRI_405_1',
        title: 'Diversity of Governance Bodies and Employees',
        framework: 'GRI',
        topic: 'SOCIAL',
        required_evidence: ['metric', 'narrative'],
        jurisdiction_relevance: GLOBAL_JURISDICTIONS,
        min_evidence_threshold: 'medium'
    },

    // --- LOCAL: UAE (SCA / ADX / DFM) ---
    {
        id: 'UAE_E1',
        title: 'GHG Emissions (UAE Pivot)',
        framework: 'LOCAL_UAE',
        topic: 'CLIMATE',
        required_evidence: ['metric'],
        jurisdiction_relevance: ['UAE'],
        min_evidence_threshold: 'high'
    },
    {
        id: 'UAE_S1',
        title: 'CEO Pay Ratio',
        framework: 'LOCAL_UAE',
        topic: 'SOCIAL',
        required_evidence: ['metric'],
        jurisdiction_relevance: ['UAE'],
        min_evidence_threshold: 'medium'
    },
    {
        id: 'UAE_G1',
        title: 'Board Diversity',
        framework: 'LOCAL_UAE',
        topic: 'GOV',
        required_evidence: ['metric', 'narrative'],
        jurisdiction_relevance: ['UAE'],
        min_evidence_threshold: 'medium'
    },

    // --- LOCAL: KSA (Tadawul) ---
    {
        id: 'KSA_E_1',
        title: 'Environmental Oversight',
        framework: 'LOCAL_KSA',
        topic: 'GOV',
        required_evidence: ['narrative'],
        jurisdiction_relevance: ['KSA'],
        min_evidence_threshold: 'medium'
    },
    {
        id: 'KSA_S_3',
        title: 'Saudization Rate',
        framework: 'LOCAL_KSA',
        topic: 'SOCIAL',
        required_evidence: ['metric'],
        jurisdiction_relevance: ['KSA'],
        min_evidence_threshold: 'high'
    },

    // --- LOCAL: QATAR (QSE) ---
    {
        id: 'QAT_ENV_1',
        title: 'Energy Consumption',
        framework: 'LOCAL_QATAR',
        topic: 'CLIMATE',
        required_evidence: ['metric'],
        jurisdiction_relevance: ['QATAR'],
        min_evidence_threshold: 'medium'
    },
];

// ===========================================
// CROSSWALK & HELPERS
// ===========================================

export interface CrosswalkEntry {
    topic: TopicCode;
    description: string;
    mapped_items: string[]; // List of IDs
}

export const getDisclosurePack = (
    selectedFrameworks: FrameworkCode[],
    jurisdiction: JurisdictionCode
) => {
    // Filter items by framework AND jurisdiction
    const relevantItems = FRAMEWORK_REGISTRY.filter(item =>
        selectedFrameworks.includes(item.framework) &&
        (item.jurisdiction_relevance.includes('GLOBAL') || item.jurisdiction_relevance.includes(jurisdiction))
    );

    // Group by Topic
    const pack: Record<TopicCode, DisclosureItem[]> = {
        GOV: [], STRATEGY: [], RISK: [], METRICS: [], CLIMATE: [], SOCIAL: [], ETHICS: []
    };

    relevantItems.forEach(item => {
        if (pack[item.topic]) {
            pack[item.topic].push(item);
        }
    });

    return pack;
};

// ===========================================
// GAP LOGIC (MVP)
// ===========================================

export type GapStatus = 'complete' | 'partial' | 'missing';

export const calculateGapStatus = (
    item: DisclosureItem,
    evidence: { narrativePresent: boolean; metricPresent: boolean; docPresent: boolean }
): GapStatus => {
    const needsNarrative = item.required_evidence.includes('narrative');
    const needsMetric = item.required_evidence.includes('metric');

    let score = 0;
    let maxScore = 0;

    if (needsNarrative) {
        maxScore++;
        if (evidence.narrativePresent) score++;
    }

    if (needsMetric) {
        maxScore++;
        if (evidence.metricPresent) score++;
    }

    // If no specific evidence required, assume narrative is default
    if (maxScore === 0) {
        return evidence.narrativePresent ? 'complete' : 'missing';
    }

    if (score === maxScore) return 'complete';
    if (score > 0) return 'partial';
    return 'missing';
};
