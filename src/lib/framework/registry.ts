import { z } from 'zod';

export type JurisdictionCode = 'UAE' | 'KSA' | 'QATAR';
export type FrameworkCode = 'IFRS_S1' | 'IFRS_S2' | 'TCFD' | 'GRI' | 'LOCAL_UAE' | 'LOCAL_KSA' | 'LOCAL_QATAR';
export type EvidenceType = 'narrative' | 'metric' | 'document';
export type TopicCode = 'GOV' | 'STRATEGY' | 'RISK' | 'METRICS' | 'CLIMATE' | 'SOCIAL';

export interface DisclosureRequirement {
    id: string;
    title: string;
    framework: FrameworkCode;
    topic: TopicCode;
    requiredEvidence: EvidenceType[];
    jurisdiction: JurisdictionCode | 'GLOBAL';
    isListedOnly: boolean;
}

export const FRAMEWORK_REGISTRY: DisclosureRequirement[] = [
    // IFRS S1
    { id: 'IFRS-S1-GOV-1', title: 'Governance Oversight', framework: 'IFRS_S1', topic: 'GOV', requiredEvidence: ['narrative'], jurisdiction: 'GLOBAL', isListedOnly: false },

    // IFRS S2
    { id: 'IFRS-S2-MET-1', title: 'GHG Scope 1 & 2', framework: 'IFRS_S2', topic: 'METRICS', requiredEvidence: ['metric'], jurisdiction: 'GLOBAL', isListedOnly: false },

    // TCFD
    { id: 'TCFD-RISK-1', title: 'Climate Risk Identification', framework: 'TCFD', topic: 'RISK', requiredEvidence: ['narrative'], jurisdiction: 'GLOBAL', isListedOnly: false },

    // GRI-lite
    { id: 'GRI-405-1', title: 'Diversity & Inclusion', framework: 'GRI', topic: 'SOCIAL', requiredEvidence: ['metric', 'narrative'], jurisdiction: 'GLOBAL', isListedOnly: false },

    // Local UAE (Listed)
    { id: 'UAE-ADX-1', title: 'SCA Governance Report Alignment', framework: 'LOCAL_UAE', topic: 'GOV', requiredEvidence: ['narrative'], jurisdiction: 'UAE', isListedOnly: true },

    // Local KSA
    { id: 'KSA-TADAWUL-1', title: 'Saudization KPIs', framework: 'LOCAL_KSA', topic: 'SOCIAL', requiredEvidence: ['metric'], jurisdiction: 'KSA', isListedOnly: false },
];

export interface OutlineSection {
    topic: TopicCode;
    items: DisclosureRequirement[];
}

/**
 * Builds a deterministic outline based on company profile and selected frameworks
 */
export function buildOutline(params: {
    jurisdiction: JurisdictionCode;
    isListed: boolean;
    selectedFrameworks: FrameworkCode[];
}): OutlineSection[] {
    const { jurisdiction, isListed, selectedFrameworks } = params;

    // 1. Filter registry
    const filtered = FRAMEWORK_REGISTRY.filter(req => {
        const isGlobal = req.jurisdiction === 'GLOBAL';
        const isLocalMatch = req.jurisdiction === jurisdiction;
        const isFrameworkMatch = selectedFrameworks.includes(req.framework);
        const listedMatch = !req.isListedOnly || isListed;

        return isFrameworkMatch && (isGlobal || isLocalMatch) && listedMatch;
    });

    // 2. Group by topic
    const topics: TopicCode[] = ['GOV', 'STRATEGY', 'RISK', 'METRICS', 'SOCIAL'];
    return topics.map(topic => ({
        topic,
        items: filtered.filter(f => f.topic === topic)
    })).filter(section => section.items.length > 0);
}
