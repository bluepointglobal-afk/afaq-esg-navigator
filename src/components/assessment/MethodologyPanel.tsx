import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Info } from 'lucide-react';
import type { ScoreExplanation } from '@/types/compliance';

interface MethodologyPanelProps {
  explanation: ScoreExplanation;
}

export function MethodologyPanel({ explanation }: MethodologyPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          How We Calculate Your Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="methodology">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">Scoring Methodology</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-line text-muted-foreground">{explanation.methodology}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="breakdown">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">Pillar Contribution Breakdown</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {explanation.pillarBreakdown.map((pb) => (
                  <div key={pb.pillar} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                        {pb.contribution}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium capitalize mb-1">
                        {pb.pillar.replace('_', ' & ')}
                      </div>
                      <p className="text-sm text-muted-foreground">{pb.reasoning}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="transparency">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">Transparency & Auditability</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">100% Deterministic:</strong> Our scoring algorithm uses
                  explicit, rule-based calculations—no AI or black-box methods. The same answers always produce
                  the same score.
                </p>
                <p>
                  <strong className="text-foreground">Transparent Weighting:</strong> Each question has a
                  documented weight (1-10) based on regulatory importance. Higher-weight questions have greater
                  impact on your score.
                </p>
                <p>
                  <strong className="text-foreground">Auditable Logic:</strong> Gap severity is determined by
                  objective criteria: question weight, answer score, and criticality flags. You can trace exactly
                  why each gap was identified.
                </p>
                <p>
                  <strong className="text-foreground">Jurisdiction-Aware:</strong> Questions and recommendations
                  are filtered based on your jurisdiction (UAE/KSA/Qatar) and listing status to ensure relevance.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
