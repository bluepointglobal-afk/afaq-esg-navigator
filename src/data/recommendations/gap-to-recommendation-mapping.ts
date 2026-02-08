/**
 * AFAQ Assessment Engine - Recommendation Mapping Database
 *
 * Curated database of actionable recommendations mapped to compliance gaps.
 * Each recommendation includes effort/impact estimates and jurisdiction-specific guidance.
 */

import type { Jurisdiction, QuestionPillar } from '@/types/compliance';

export type GapSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface RecommendationTemplate {
  id: string;

  // Matching criteria (at least one must be specified)
  appliesToQuestionCodes?: string[]; // e.g., ['GOV-001', 'GOV-002']
  appliesToPillar?: QuestionPillar;
  appliesToSeverity?: GapSeverity[];
  appliesToJurisdictions?: Jurisdiction[]; // Empty = applies to all

  // Recommendation content
  title: string;
  titleArabic?: string;
  description: string;
  descriptionArabic?: string;
  whyItMatters: string;
  whyItMattersArabic?: string;

  // Effort/impact estimates
  effort: 'low' | 'medium' | 'high'; // Implementation effort
  impact: 'low' | 'medium' | 'high'; // Business impact
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';

  // Step-by-step actions
  actions: string[];
  actionsArabic?: string[];

  // Priority (1-5, lower = higher priority)
  priority: 1 | 2 | 3 | 4 | 5;
}

/**
 * Curated recommendation templates
 */
export const RECOMMENDATION_TEMPLATES: RecommendationTemplate[] = [
  // GOVERNANCE RECOMMENDATIONS
  {
    id: 'REC-GOV-001',
    appliesToQuestionCodes: ['GOV-001'],
    appliesToSeverity: ['critical', 'high'],
    title: 'Establish Formal Board of Directors',
    titleArabic: 'إنشاء مجلس إدارة رسمي',
    description: 'Formalize corporate governance structure by establishing a board of directors with documented charter, roles, and responsibilities.',
    descriptionArabic: 'إضفاء الطابع الرسمي على هيكل حوكمة الشركات من خلال إنشاء مجلس إدارة مع ميثاق موثق والأدوار والمسؤوليات.',
    whyItMatters: 'A formal board provides oversight, strategic direction, and accountability—essential for regulatory compliance and investor confidence.',
    whyItMattersArabic: 'يوفر المجلس الرسمي الرقابة والتوجيه الاستراتيجي والمساءلة - وهي ضرورية للامتثال التنظيمي وثقة المستثمرين.',
    effort: 'medium',
    impact: 'high',
    timeframe: 'short_term',
    priority: 1,
    actions: [
      'Draft board charter defining composition, roles, and meeting frequency',
      'Appoint qualified directors with relevant expertise',
      'Document board procedures and decision-making protocols',
      'Schedule regular board meetings (at least quarterly)',
      'Establish board committees (audit, risk, nomination)',
    ],
    actionsArabic: [
      'صياغة ميثاق مجلس الإدارة الذي يحدد التكوين والأدوار وتكرار الاجتماعات',
      'تعيين مديرين مؤهلين ذوي خبرة ذات صلة',
      'توثيق إجراءات مجلس الإدارة وبروتوكولات اتخاذ القرار',
      'جدولة اجتماعات مجلس الإدارة المنتظمة (على الأقل ربع سنوية)',
      'إنشاء لجان مجلس الإدارة (التدقيق والمخاطر والترشيح)',
    ],
  },

  {
    id: 'REC-GOV-002',
    appliesToQuestionCodes: ['GOV-002'],
    appliesToSeverity: ['high', 'medium'],
    appliesToJurisdictions: ['UAE', 'KSA'],
    title: 'Increase Independent Director Representation',
    titleArabic: 'زيادة تمثيل المديرين المستقلين',
    description: 'Enhance board independence by appointing additional independent directors to meet regulatory requirements and best practices.',
    descriptionArabic: 'تعزيز استقلالية مجلس الإدارة من خلال تعيين مديرين مستقلين إضافيين لتلبية المتطلبات التنظيمية وأفضل الممارسات.',
    whyItMatters: 'Independent directors provide objective oversight, reduce conflicts of interest, and are often required for listed companies.',
    whyItMattersArabic: 'يوفر المديرون المستقلون إشرافًا موضوعيًا ويقللون من تضارب المصالح وغالبًا ما يكونون مطلوبين للشركات المدرجة.',
    effort: 'medium',
    impact: 'high',
    timeframe: 'short_term',
    priority: 2,
    actions: [
      'Review regulatory requirements for board independence (UAE: min 3 independent, KSA: min 2)',
      'Define independence criteria based on local regulations',
      'Identify and vet qualified independent candidates',
      'Obtain shareholder approval for new appointments',
      'Document independence assessments annually',
    ],
  },

  {
    id: 'REC-GOV-003',
    appliesToPillar: 'governance',
    appliesToSeverity: ['medium', 'low'],
    title: 'Implement Board Performance Evaluation',
    titleArabic: 'تنفيذ تقييم أداء مجلس الإدارة',
    description: 'Establish annual board performance evaluation process to assess effectiveness and identify improvement areas.',
    descriptionArabic: 'إنشاء عملية تقييم أداء مجلس الإدارة السنوية لتقييم الفعالية وتحديد مجالات التحسين.',
    whyItMatters: 'Regular evaluations ensure board effectiveness, promote continuous improvement, and demonstrate commitment to good governance.',
    whyItMattersArabic: 'تضمن التقييمات المنتظمة فعالية مجلس الإدارة وتعزز التحسين المستمر وتظهر الالتزام بالحوكمة الجيدة.',
    effort: 'low',
    impact: 'medium',
    timeframe: 'medium_term',
    priority: 3,
    actions: [
      'Develop board evaluation questionnaire covering structure, processes, and individual performance',
      'Conduct annual self-assessments or hire external evaluator',
      'Review evaluation results in board meeting',
      'Create action plan to address identified weaknesses',
      'Track implementation of improvement actions',
    ],
  },

  // ESG RECOMMENDATIONS
  {
    id: 'REC-ESG-001',
    appliesToQuestionCodes: ['ENV-001', 'ENV-002'],
    appliesToSeverity: ['critical', 'high'],
    title: 'Establish Environmental Management System',
    titleArabic: 'إنشاء نظام إدارة بيئية',
    description: 'Implement structured approach to managing environmental impacts, including emissions tracking, resource efficiency, and waste management.',
    descriptionArabic: 'تنفيذ نهج منظم لإدارة التأثيرات البيئية، بما في ذلك تتبع الانبعاثات وكفاءة الموارد وإدارة النفايات.',
    whyItMatters: 'Environmental management reduces operational risks, improves efficiency, and meets growing stakeholder expectations for sustainability.',
    whyItMattersArabic: 'تقلل الإدارة البيئية من المخاطر التشغيلية وتحسن الكفاءة وتلبي التوقعات المتزايدة لأصحاب المصلحة للاستدامة.',
    effort: 'high',
    impact: 'high',
    timeframe: 'medium_term',
    priority: 2,
    actions: [
      'Conduct baseline environmental impact assessment',
      'Set measurable environmental targets (emissions, energy, water, waste)',
      'Implement ISO 14001 or equivalent framework',
      'Train staff on environmental procedures',
      'Monitor and report environmental metrics quarterly',
    ],
  },

  {
    id: 'REC-ESG-002',
    appliesToPillar: 'esg',
    appliesToSeverity: ['high', 'medium'],
    title: 'Develop ESG Reporting Framework',
    titleArabic: 'تطوير إطار إعداد تقارير ESG',
    description: 'Create systematic ESG reporting aligned with recognized standards (GRI, SASB, or local requirements).',
    descriptionArabic: 'إنشاء تقارير ESG منهجية تتماشى مع المعايير المعترف بها (GRI أو SASB أو المتطلبات المحلية).',
    whyItMatters: 'Transparent ESG reporting enhances credibility, attracts sustainable investors, and prepares for upcoming mandatory disclosure requirements.',
    whyItMattersArabic: 'تعزز تقارير ESG الشفافة المصداقية وتجذب المستثمرين المستدامين وتستعد لمتطلبات الإفصاح الإلزامية القادمة.',
    effort: 'medium',
    impact: 'high',
    timeframe: 'short_term',
    priority: 2,
    actions: [
      'Select appropriate ESG reporting framework (GRI, SASB, or TCFD)',
      'Identify material ESG topics relevant to industry and stakeholders',
      'Collect baseline data for key ESG metrics',
      'Draft initial ESG report with quantitative and qualitative disclosures',
      'Publish ESG report annually and update stakeholders',
    ],
  },

  // RISK & CONTROLS RECOMMENDATIONS
  {
    id: 'REC-RISK-001',
    appliesToQuestionCodes: ['RISK-001', 'RISK-002'],
    appliesToSeverity: ['critical', 'high'],
    title: 'Implement Enterprise Risk Management Framework',
    titleArabic: 'تنفيذ إطار إدارة المخاطر المؤسسية',
    description: 'Establish comprehensive risk management framework covering identification, assessment, mitigation, and monitoring of key risks.',
    descriptionArabic: 'إنشاء إطار شامل لإدارة المخاطر يغطي تحديد وتقييم وتخفيف ومراقبة المخاطر الرئيسية.',
    whyItMatters: 'Proactive risk management protects assets, ensures business continuity, and is increasingly required by regulators and investors.',
    whyItMattersArabic: 'تحمي إدارة المخاطر الاستباقية الأصول وتضمن استمرارية الأعمال وتزداد متطلباتها من قبل الجهات التنظيمية والمستثمرين.',
    effort: 'high',
    impact: 'high',
    timeframe: 'medium_term',
    priority: 1,
    actions: [
      'Conduct enterprise-wide risk assessment workshop',
      'Document risk register with likelihood and impact ratings',
      'Assign risk owners and define mitigation strategies',
      'Establish risk committee or integrate into board audit committee',
      'Review and update risk register quarterly',
    ],
  },

  {
    id: 'REC-RISK-002',
    appliesToPillar: 'risk_controls',
    appliesToSeverity: ['high', 'medium'],
    title: 'Strengthen Internal Audit Function',
    titleArabic: 'تعزيز وظيفة التدقيق الداخلي',
    description: 'Establish or enhance internal audit function to provide independent assurance on governance, risk management, and controls.',
    descriptionArabic: 'إنشاء أو تعزيز وظيفة التدقيق الداخلي لتوفير ضمان مستقل بشأن الحوكمة وإدارة المخاطر والضوابط.',
    whyItMatters: 'Internal audit provides objective assurance, detects control weaknesses early, and is often required for listed companies.',
    whyItMattersArabic: 'يوفر التدقيق الداخلي ضمانًا موضوعيًا ويكتشف نقاط الضعف في الضوابط مبكرًا وغالبًا ما يكون مطلوبًا للشركات المدرجة.',
    effort: 'medium',
    impact: 'high',
    timeframe: 'short_term',
    priority: 2,
    actions: [
      'Hire or outsource qualified internal auditor (consider Big 4 or local firms)',
      'Develop risk-based annual audit plan',
      'Define audit scope covering financial, operational, and compliance risks',
      'Report audit findings to audit committee',
      'Track management action plans to remediate findings',
    ],
  },

  // TRANSPARENCY RECOMMENDATIONS
  {
    id: 'REC-TRANS-001',
    appliesToQuestionCodes: ['TRANS-001', 'TRANS-002'],
    appliesToSeverity: ['high', 'medium'],
    title: 'Enhance Financial Reporting Quality',
    titleArabic: 'تعزيز جودة التقارير المالية',
    description: 'Improve financial reporting through adoption of international standards, external audit, and timely disclosure.',
    descriptionArabic: 'تحسين التقارير المالية من خلال اعتماد المعايير الدولية والتدقيق الخارجي والإفصاح في الوقت المناسب.',
    whyItMatters: 'High-quality financial reporting builds trust with investors, lenders, and regulators, and is mandatory for listed companies.',
    whyItMattersArabic: 'تبني التقارير المالية عالية الجودة الثقة مع المستثمرين والمقرضين والجهات التنظيمية وهي إلزامية للشركات المدرجة.',
    effort: 'medium',
    impact: 'high',
    timeframe: 'short_term',
    priority: 2,
    actions: [
      'Adopt IFRS or local GAAP for financial reporting',
      'Engage reputable external auditor (Big 4 or recognized local firm)',
      'Publish audited financial statements within regulatory deadlines',
      'Ensure audit committee reviews financial statements before approval',
      'Implement quarterly financial close process for timely reporting',
    ],
  },

  {
    id: 'REC-TRANS-002',
    appliesToPillar: 'transparency',
    appliesToSeverity: ['medium', 'low'],
    title: 'Improve Stakeholder Communication',
    titleArabic: 'تحسين التواصل مع أصحاب المصلحة',
    description: 'Establish regular communication channels with investors, employees, customers, and other stakeholders.',
    descriptionArabic: 'إنشاء قنوات اتصال منتظمة مع المستثمرين والموظفين والعملاء وأصحاب المصلحة الآخرين.',
    whyItMatters: 'Proactive stakeholder engagement builds trust, manages expectations, and provides early warning of emerging issues.',
    whyItMattersArabic: 'يبني المشاركة الاستباقية مع أصحاب المصلحة الثقة ويدير التوقعات ويوفر إنذارًا مبكرًا بالقضايا الناشئة.',
    effort: 'low',
    impact: 'medium',
    timeframe: 'short_term',
    priority: 3,
    actions: [
      'Develop stakeholder engagement strategy identifying key groups',
      'Publish annual report or sustainability report',
      'Hold regular investor relations calls or meetings',
      'Create investor relations section on company website',
      'Respond to stakeholder inquiries within defined timeframes',
    ],
  },

  // GENERAL BEST PRACTICES
  {
    id: 'REC-GEN-001',
    appliesToSeverity: ['critical', 'high'],
    title: 'Develop Compliance Roadmap',
    titleArabic: 'تطوير خارطة طريق الامتثال',
    description: 'Create prioritized action plan to address critical compliance gaps systematically.',
    descriptionArabic: 'إنشاء خطة عمل ذات أولوية لمعالجة فجوات الامتثال الحرجة بشكل منهجي.',
    whyItMatters: 'A structured roadmap ensures efficient use of resources, tracks progress, and demonstrates commitment to compliance improvement.',
    whyItMattersArabic: 'تضمن خارطة الطريق المنظمة الاستخدام الفعال للموارد وتتبع التقدم وتظهر الالتزام بتحسين الامتثال.',
    effort: 'low',
    impact: 'high',
    timeframe: 'immediate',
    priority: 1,
    actions: [
      'Review all critical and high-severity gaps',
      'Prioritize gaps by regulatory urgency and business impact',
      'Assign owners and deadlines for each gap',
      'Allocate budget for external expertise if needed',
      'Track progress monthly and report to board',
    ],
  },

  {
    id: 'REC-GEN-002',
    appliesToSeverity: ['medium', 'low'],
    title: 'Conduct Compliance Training',
    titleArabic: 'إجراء تدريب الامتثال',
    description: 'Implement regular compliance training program for board, management, and staff on relevant regulations and policies.',
    descriptionArabic: 'تنفيذ برنامج تدريب امتثال منتظم لمجلس الإدارة والإدارة والموظفين بشأن اللوائح والسياسات ذات الصلة.',
    whyItMatters: 'Training ensures awareness of compliance requirements, reduces risk of violations, and fosters culture of integrity.',
    whyItMattersArabic: 'يضمن التدريب الوعي بمتطلبات الامتثال ويقلل من مخاطر الانتهاكات ويعزز ثقافة النزاهة.',
    effort: 'low',
    impact: 'medium',
    timeframe: 'short_term',
    priority: 3,
    actions: [
      'Develop compliance training materials covering key regulations',
      'Conduct annual training for board and senior management',
      'Provide role-specific training (e.g., anti-bribery for sales, data privacy for IT)',
      'Track training attendance and maintain records',
      'Update training content as regulations evolve',
    ],
  },
];
