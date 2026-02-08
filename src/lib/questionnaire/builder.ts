// Questionnaire Template Builder
// Builds jurisdiction-aware questionnaire templates from question bank

import type {
  CompanyProfile,
  Question,
  QuestionnaireTemplate,
  QuestionSection,
  QuestionPillar,
  Jurisdiction,
  ListingStatus,
} from '@/types/compliance';
import { ALL_QUESTIONS, QUESTIONS_BY_PILLAR } from '@/data/questions';
import { v4 as uuidv4 } from 'uuid';

const CURRENT_VERSION = '1.0.0';

/**
 * Filters questions by jurisdiction
 */
export function filterByJurisdiction(questions: Question[], jurisdiction: Jurisdiction): Question[] {
  const filtered = questions.filter((q) => q.applicableJurisdictions.includes(jurisdiction));
  console.log(`[Jurisdiction Filter] ${filtered.length}/${questions.length} questions passed for ${jurisdiction}`);
  return filtered;
}

/**
 * Filters questions by listing status
 */
export function filterByListingStatus(questions: Question[], listingStatus: ListingStatus): Question[] {
  const filtered = questions.filter((q) => q.applicableListingStatuses.includes(listingStatus));
  console.log(`[Listing Status Filter] ${filtered.length}/${questions.length} questions passed for ${listingStatus}`);
  return filtered;
}

/**
 * Validates that all conditional dependencies exist in the question set
 */
export function validateConditionalDependencies(questions: Question[]): {
  valid: boolean;
  errors: string[];
} {
  const questionIds = new Set(questions.map((q) => q.id));
  const errors: string[] = [];

  questions.forEach((question) => {
    if (question.conditionalRules) {
      question.conditionalRules.forEach((rule) => {
        if (!questionIds.has(rule.dependsOnQuestionId)) {
          errors.push(
            `Question ${question.code} has conditional dependency on non-existent question ${rule.dependsOnQuestionId}`
          );
        }
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Groups questions into sections by pillar
 */
export function groupIntoSections(questions: Question[]): QuestionSection[] {
  const pillars: QuestionPillar[] = ['governance', 'esg', 'risk_controls', 'transparency'];

  const sections: QuestionSection[] = pillars.map((pillar, index) => {
    const pillarQuestions = questions.filter((q) => q.pillar === pillar);

    // Section metadata
    const sectionMetadata: Record<QuestionPillar, { title: string; titleArabic: string; description: string; descriptionArabic: string }> = {
      governance: {
        title: 'Corporate Governance',
        titleArabic: 'حوكمة الشركات',
        description: 'Board structure, ethics, compliance, and risk management',
        descriptionArabic: 'هيكل مجلس الإدارة والأخلاقيات والامتثال وإدارة المخاطر',
      },
      esg: {
        title: 'ESG & Sustainability',
        titleArabic: 'البيئة والاجتماعية والحوكمة والاستدامة',
        description: 'Environmental impact, social responsibility, and workforce practices',
        descriptionArabic: 'الأثر البيئي والمسؤولية الاجتماعية وممارسات القوى العاملة',
      },
      risk_controls: {
        title: 'Risk & Controls',
        titleArabic: 'المخاطر والضوابط',
        description: 'Cybersecurity, data privacy, business continuity, and internal controls',
        descriptionArabic: 'الأمن السيبراني وخصوصية البيانات واستمرارية الأعمال والضوابط الداخلية',
      },
      transparency: {
        title: 'Transparency & Disclosure',
        titleArabic: 'الشفافية والإفصاح',
        description: 'Financial reporting, stakeholder communication, and public disclosure',
        descriptionArabic: 'التقارير المالية والتواصل مع أصحاب المصلحة والإفصاح العام',
      },
    };

    const metadata = sectionMetadata[pillar];

    return {
      id: uuidv4(),
      pillar,
      title: metadata.title,
      titleArabic: metadata.titleArabic,
      description: metadata.description,
      descriptionArabic: metadata.descriptionArabic,
      order: index + 1,
      questions: pillarQuestions,
    };
  });

  // Filter out empty sections
  return sections.filter((section) => section.questions.length > 0);
}

/**
 * Builds a questionnaire template for a given company profile
 */
export function buildQuestionnaireTemplate(companyProfile: CompanyProfile): QuestionnaireTemplate {
  const { jurisdiction, listingStatus } = companyProfile;

  console.log(`[Template Builder] Starting: ${jurisdiction}, ${listingStatus}, ${ALL_QUESTIONS.length} total questions`);

  // Step 1: Filter by jurisdiction
  let applicableQuestions = filterByJurisdiction(ALL_QUESTIONS, jurisdiction);

  // Step 2: Filter by listing status
  applicableQuestions = filterByListingStatus(applicableQuestions, listingStatus);

  // Step 3: Validate conditional dependencies
  const validation = validateConditionalDependencies(applicableQuestions);
  if (!validation.valid) {
    console.warn('Conditional dependency warnings:', validation.errors);
    // Continue anyway - warnings only
  }

  // Step 4: Group into sections
  const sections = groupIntoSections(applicableQuestions);

  // Step 5: Create template
  const template: QuestionnaireTemplate = {
    id: uuidv4(),
    version: CURRENT_VERSION,
    jurisdiction,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return template;
}

/**
 * Get total question count for a template
 */
export function getTotalQuestionCount(template: QuestionnaireTemplate): number {
  return template.sections.reduce((total, section) => total + section.questions.length, 0);
}

/**
 * Get required question count for a template
 */
export function getRequiredQuestionCount(template: QuestionnaireTemplate): number {
  return template.sections.reduce(
    (total, section) => total + section.questions.filter((q) => q.required).length,
    0
  );
}
