/**
 * AFAQ Assessment Engine - Recommendation Generation Module
 *
 * Deterministic recommendation generation by matching gaps to curated recommendation database.
 * Recommendations are prioritized by severity, impact, and jurisdiction-relevance.
 */

import type { Gap, Recommendation, CompanyProfile, Question } from '@/types/compliance';
import type { DetailedGap } from '@/lib/gaps';
import {
  RECOMMENDATION_TEMPLATES,
  type RecommendationTemplate,
  type GapSeverity,
} from '@/data/recommendations/gap-to-recommendation-mapping';

/**
 * Match a gap to applicable recommendation templates
 */
function matchRecommendations(
  gap: DetailedGap,
  companyProfile: CompanyProfile
): RecommendationTemplate[] {
  const matches: RecommendationTemplate[] = [];

  RECOMMENDATION_TEMPLATES.forEach((template) => {
    let isMatch = false;

    // Match by question code (most specific)
    if (template.appliesToQuestionCodes && template.appliesToQuestionCodes.includes(gap.questionCode)) {
      isMatch = true;
    }

    // Match by pillar + severity
    if (
      !isMatch &&
      template.appliesToPillar === gap.pillar &&
      template.appliesToSeverity &&
      template.appliesToSeverity.includes(gap.severity as GapSeverity)
    ) {
      isMatch = true;
    }

    // Match by pillar only (broader match)
    if (!isMatch && template.appliesToPillar === gap.pillar && !template.appliesToSeverity) {
      isMatch = true;
    }

    // Match by severity only (general recommendations)
    if (
      !isMatch &&
      !template.appliesToQuestionCodes &&
      !template.appliesToPillar &&
      template.appliesToSeverity &&
      template.appliesToSeverity.includes(gap.severity as GapSeverity)
    ) {
      isMatch = true;
    }

    // Filter by jurisdiction if specified
    if (isMatch && template.appliesToJurisdictions && template.appliesToJurisdictions.length > 0) {
      if (!template.appliesToJurisdictions.includes(companyProfile.jurisdiction)) {
        isMatch = false;
      }
    }

    if (isMatch) {
      matches.push(template);
    }
  });

  return matches;
}

/**
 * Convert recommendation template to Recommendation object
 */
function templateToRecommendation(
  template: RecommendationTemplate,
  relatedGaps: string[]
): Recommendation {
  // Map effort to priority
  const priorityMap: Record<string, 1 | 2 | 3 | 4 | 5> = {
    'critical-high': 1,
    'critical-medium': 1,
    'critical-low': 2,
    'high-high': 2,
    'high-medium': 2,
    'high-low': 3,
    'medium-high': 3,
    'medium-medium': 3,
    'medium-low': 4,
    'low-high': 4,
    'low-medium': 4,
    'low-low': 5,
  };

  // Determine priority based on related gap severity and template priority
  const gapSeverities = relatedGaps.map((id) => id.split('-')[0]); // Simplified
  const hasCritical = gapSeverities.includes('critical');
  const hasHigh = gapSeverities.includes('high');

  let computedPriority: 1 | 2 | 3 | 4 | 5;
  if (hasCritical) {
    computedPriority = template.impact === 'high' ? 1 : 2;
  } else if (hasHigh) {
    computedPriority = template.impact === 'high' ? 2 : 3;
  } else {
    computedPriority = template.priority;
  }

  return {
    id: template.id,
    priority: computedPriority,
    title: template.title,
    description: template.description,
    relatedGaps,
    pillar: template.appliesToPillar || 'governance', // Default to governance
    effort: template.effort,
    impact: template.impact,
    timeframe: template.timeframe,
  };
}

/**
 * Generate recommendations from gaps
 */
export interface RecommendationGenerationResult {
  recommendations: Recommendation[];
  recommendationCount: number;
  criticalRecommendationCount: number;
}

export function generateRecommendations(
  gaps: DetailedGap[],
  companyProfile: CompanyProfile
): RecommendationGenerationResult {
  // Map to track unique recommendations and their related gaps
  const recommendationMap = new Map<string, { template: RecommendationTemplate; gaps: string[] }>();

  // Match each gap to recommendations
  gaps.forEach((gap) => {
    const matches = matchRecommendations(gap, companyProfile);

    matches.forEach((template) => {
      const existing = recommendationMap.get(template.id);
      if (existing) {
        // Add gap to existing recommendation
        existing.gaps.push(gap.questionId);
      } else {
        // Create new recommendation entry
        recommendationMap.set(template.id, {
          template,
          gaps: [gap.questionId],
        });
      }
    });
  });

  // Convert to Recommendation objects
  const recommendations: Recommendation[] = [];
  recommendationMap.forEach(({ template, gaps: relatedGaps }) => {
    recommendations.push(templateToRecommendation(template, relatedGaps));
  });

  // Sort by priority (ascending), then by impact (descending), then by effort (ascending)
  const impactOrder = { high: 3, medium: 2, low: 1 };
  const effortOrder = { low: 1, medium: 2, high: 3 };

  recommendations.sort((a, b) => {
    // Sort by priority first
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }

    // Then by impact (higher impact first)
    if (a.impact !== b.impact) {
      return impactOrder[b.impact] - impactOrder[a.impact];
    }

    // Then by effort (lower effort first)
    return effortOrder[a.effort] - effortOrder[b.effort];
  });

  // Limit to top 10 recommendations to avoid overwhelming users
  const topRecommendations = recommendations.slice(0, 10);

  // Count critical recommendations (priority 1 or 2)
  const criticalCount = topRecommendations.filter((r) => r.priority <= 2).length;

  return {
    recommendations: topRecommendations,
    recommendationCount: topRecommendations.length,
    criticalRecommendationCount: criticalCount,
  };
}

/**
 * Get detailed recommendation with actions
 */
export interface DetailedRecommendation extends Recommendation {
  titleArabic?: string;
  descriptionArabic?: string;
  whyItMatters: string;
  whyItMattersArabic?: string;
  actions: string[];
  actionsArabic?: string[];
}

export function getDetailedRecommendations(
  gaps: DetailedGap[],
  companyProfile: CompanyProfile
): DetailedRecommendation[] {
  const result = generateRecommendations(gaps, companyProfile);
  const detailedRecs: DetailedRecommendation[] = [];

  result.recommendations.forEach((rec) => {
    // Find original template
    const template = RECOMMENDATION_TEMPLATES.find((t) => t.id === rec.id);
    if (!template) {
      return;
    }

    detailedRecs.push({
      ...rec,
      titleArabic: template.titleArabic,
      descriptionArabic: template.descriptionArabic,
      whyItMatters: template.whyItMatters,
      whyItMattersArabic: template.whyItMattersArabic,
      actions: template.actions,
      actionsArabic: template.actionsArabic,
    });
  });

  return detailedRecs;
}
