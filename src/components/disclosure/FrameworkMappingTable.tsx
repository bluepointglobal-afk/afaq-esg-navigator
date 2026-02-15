import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface FrameworkMapping {
  questionId: string;
  questionText: string;
  pillar: 'governance' | 'environmental' | 'social';
  mappings: {
    framework: string;
    reference: string;
    requirement: string;
  }[];
}

const FRAMEWORK_MAPPINGS: FrameworkMapping[] = [
  {
    questionId: 'gov-board-oversight',
    questionText: 'Does your company have board-level ESG oversight?',
    pillar: 'governance',
    mappings: [
      { framework: 'IFRS S1', reference: 'Para 6(a)', requirement: 'Governance processes, controls and procedures' },
      { framework: 'TCFD', reference: 'Governance (a)', requirement: 'Board oversight of climate-related risks' },
      { framework: 'GRI 2-9', reference: '2-9', requirement: 'Governance structure and composition' },
      { framework: 'Tadawul ESG', reference: 'G1.1', requirement: 'Board committee for ESG' },
    ]
  },
  {
    questionId: 'env-ghg-emissions',
    questionText: 'Do you track Scope 1, 2, and 3 GHG emissions?',
    pillar: 'environmental',
    mappings: [
      { framework: 'IFRS S2', reference: 'Para 29(a)', requirement: 'Scope 1, 2, 3 GHG emissions' },
      { framework: 'TCFD', reference: 'Metrics (a)', requirement: 'GHG emissions (Scope 1, 2, and 3)' },
      { framework: 'GRI 305-1/2/3', reference: '305-1, 305-2, 305-3', requirement: 'Direct, indirect, and other GHG emissions' },
      { framework: 'Tadawul ESG', reference: 'E2.1', requirement: 'Total GHG emissions' },
    ]
  },
  {
    questionId: 'social-diversity',
    questionText: 'What is the gender distribution of your workforce?',
    pillar: 'social',
    mappings: [
      { framework: 'IFRS S1', reference: 'Para 53', requirement: 'Workforce composition metrics' },
      { framework: 'GRI 405-1', reference: '405-1', requirement: 'Diversity of governance bodies and employees' },
      { framework: 'Tadawul ESG', reference: 'S3.1', requirement: 'Employee diversity and inclusion' },
      { framework: 'GCC Unified', reference: 'SOC-001', requirement: 'Workforce diversity metrics' },
    ]
  },
  {
    questionId: 'env-water-management',
    questionText: 'Do you measure and manage water consumption?',
    pillar: 'environmental',
    mappings: [
      { framework: 'IFRS S2', reference: 'Para 15', requirement: 'Climate-related physical risks (water stress)' },
      { framework: 'GRI 303-5', reference: '303-5', requirement: 'Water consumption' },
      { framework: 'Tadawul ESG', reference: 'E3.1', requirement: 'Water usage and intensity' },
      { framework: 'GCC Unified', reference: 'ENV-003', requirement: 'Water withdrawal and consumption' },
    ]
  },
  {
    questionId: 'gov-ethics-policy',
    questionText: 'Do you have a formal ethics and compliance policy?',
    pillar: 'governance',
    mappings: [
      { framework: 'IFRS S1', reference: 'Para 6(b)', requirement: 'Controls and procedures for sustainability risks' },
      { framework: 'GRI 2-23', reference: '2-23', requirement: 'Policy commitments' },
      { framework: 'GRI 205-2', reference: '205-2', requirement: 'Communication on anti-corruption policies' },
      { framework: 'Tadawul ESG', reference: 'G2.1', requirement: 'Code of conduct and ethics' },
    ]
  },
  {
    questionId: 'social-health-safety',
    questionText: 'What is your occupational health and safety record?',
    pillar: 'social',
    mappings: [
      { framework: 'GRI 403-9', reference: '403-9', requirement: 'Work-related injuries' },
      { framework: 'GRI 403-10', reference: '403-10', requirement: 'Work-related ill health' },
      { framework: 'Tadawul ESG', reference: 'S2.1', requirement: 'Occupational health and safety' },
      { framework: 'GCC Unified', reference: 'SOC-004', requirement: 'Lost-time injury frequency rate' },
    ]
  }
];

const PILLAR_COLORS = {
  governance: 'bg-blue-100 text-blue-800 border-blue-300',
  environmental: 'bg-green-100 text-green-800 border-green-300',
  social: 'bg-purple-100 text-purple-800 border-purple-300',
};

export function FrameworkMappingTable() {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          Framework Cross-Reference Matrix
        </CardTitle>
        <CardDescription>
          Collect once, map to all frameworks. Each question satisfies multiple reporting requirements.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {FRAMEWORK_MAPPINGS.map((mapping, index) => (
          <div key={mapping.questionId} className="border-l-4 border-primary/30 pl-4 py-2">
            {/* Question */}
            <div className="flex items-start gap-3 mb-3">
              <Badge variant="outline" className={PILLAR_COLORS[mapping.pillar]}>
                {mapping.pillar ? mapping.pillar.charAt(0).toUpperCase() + mapping.pillar.slice(1) : 'Unknown'}
              </Badge>
              <div className="flex-1">
                <p className="font-medium text-sm">{mapping.questionText}</p>
              </div>
            </div>

            {/* Framework mappings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-2">
              {mapping.mappings.map((fm, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs bg-muted/30 p-2 rounded">
                  <ArrowRight className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-primary">{fm.framework}</span>
                    <span className="text-muted-foreground mx-1">•</span>
                    <span className="font-mono text-muted-foreground">{fm.reference}</span>
                    <p className="text-muted-foreground mt-0.5">{fm.requirement}</p>
                  </div>
                </div>
              ))}
            </div>

            {index < FRAMEWORK_MAPPINGS.length - 1 && (
              <div className="border-b border-border/50 mt-4" />
            )}
          </div>
        ))}

        {/* Summary */}
        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-6">
          <h4 className="font-semibold text-sm mb-2">Coverage Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <div className="font-semibold text-primary">IFRS S1/S2</div>
              <div className="text-muted-foreground">7 disclosures</div>
            </div>
            <div>
              <div className="font-semibold text-primary">TCFD</div>
              <div className="text-muted-foreground">4 recommendations</div>
            </div>
            <div>
              <div className="font-semibold text-primary">GRI Standards</div>
              <div className="text-muted-foreground">12 indicators</div>
            </div>
            <div>
              <div className="font-semibold text-primary">Tadawul ESG</div>
              <div className="text-muted-foreground">9 guidelines</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
