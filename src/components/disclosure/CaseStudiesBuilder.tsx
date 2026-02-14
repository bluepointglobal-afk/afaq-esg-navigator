import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Info, Plus, X, FileText, ListChecks, Upload } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { CaseStudy, CaseStudyFormat } from '@/types/disclosure-data';

interface CaseStudiesBuilderProps {
  caseStudies: CaseStudy[];
  onCaseStudiesChange: (studies: CaseStudy[]) => void;
}

export function CaseStudiesBuilder({ caseStudies, onCaseStudiesChange }: CaseStudiesBuilderProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleAddCaseStudy = () => {
    const newStudy: CaseStudy = {
      format: 'bullets',
      challenge: '',
      action: '',
      impact: '',
      title: '',
      photo_url: '',
    };
    onCaseStudiesChange([...caseStudies, newStudy]);
    setExpandedIndex(caseStudies.length);
  };

  const handleUpdateCaseStudy = (index: number, updates: Partial<CaseStudy>) => {
    const updated = caseStudies.map((s, i) => (i === index ? { ...s, ...updates } : s));
    onCaseStudiesChange(updated);
  };

  const handleRemoveCaseStudy = (index: number) => {
    onCaseStudiesChange(caseStudies.filter((_, i) => i !== index));
    if (expandedIndex === index) {
      setExpandedIndex(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Case Studies / Success Stories
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-md">
                <p>Share 2-3 specific examples of your ESG initiatives in action. Use the Challenge-Action-Impact framework to tell compelling stories.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          Share 2-3 concrete examples using the Challenge-Action-Impact framework
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Case Studies List */}
        <div className="space-y-4">
          {caseStudies.map((study, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              {/* Header */}
              <div
                className="flex items-center justify-between p-4 bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div className="flex items-center gap-3">
                  {study.format === 'bullets' ? (
                    <ListChecks className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <h4 className="font-medium text-sm">
                      {study.title || `Case Study ${index + 1}`}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {study.format === 'bullets' ? 'Bullet Format' : 'Story Format'}
                      {study.photo_url && ' • Has photo'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{study.format}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCaseStudy(index);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              {expandedIndex === index && (
                <div className="p-4 space-y-4 border-t">
                  {/* Format Selection */}
                  <div className="space-y-3">
                    <Label>Format</Label>
                    <RadioGroup
                      value={study.format}
                      onValueChange={(v) => handleUpdateCaseStudy(index, { format: v as CaseStudyFormat })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bullets" id={`bullets-${index}`} />
                        <Label htmlFor={`bullets-${index}`} className="font-normal cursor-pointer">
                          Bullets (Concise - AI expands to full narrative)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="story" id={`story-${index}`} />
                        <Label htmlFor={`story-${index}`} className="font-normal cursor-pointer">
                          Story (Full narrative - AI polishes)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Title (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor={`title-${index}`} className="text-sm">
                      Title (Optional)
                    </Label>
                    <Input
                      id={`title-${index}`}
                      value={study.title || ''}
                      onChange={(e) => handleUpdateCaseStudy(index, { title: e.target.value })}
                      placeholder="e.g., LED Retrofit Cuts Energy 30%"
                    />
                  </div>

                  {/* Challenge */}
                  <div className="space-y-2">
                    <Label htmlFor={`challenge-${index}`} className="text-sm">
                      Challenge / Problem
                    </Label>
                    <Textarea
                      id={`challenge-${index}`}
                      value={study.challenge}
                      onChange={(e) => handleUpdateCaseStudy(index, { challenge: e.target.value })}
                      placeholder={
                        study.format === 'bullets'
                          ? '• High energy bills\n• Aging lighting infrastructure\n• Staff complaints about lighting quality'
                          : 'Our energy costs were spiraling, with outdated lighting contributing to both high bills and poor working conditions...'
                      }
                      rows={study.format === 'bullets' ? 4 : 3}
                      className="text-sm font-mono"
                    />
                  </div>

                  {/* Action */}
                  <div className="space-y-2">
                    <Label htmlFor={`action-${index}`} className="text-sm">
                      Action / Solution
                    </Label>
                    <Textarea
                      id={`action-${index}`}
                      value={study.action}
                      onChange={(e) => handleUpdateCaseStudy(index, { action: e.target.value })}
                      placeholder={
                        study.format === 'bullets'
                          ? '• Retrofitted all facilities with LEDs\n• Completed in 6 months\n• Installed during evening shifts to minimize disruption'
                          : 'We launched a comprehensive LED retrofit program, replacing over 500 fixtures across our facilities. The 6-month project...'
                      }
                      rows={study.format === 'bullets' ? 4 : 3}
                      className="text-sm font-mono"
                    />
                  </div>

                  {/* Impact */}
                  <div className="space-y-2">
                    <Label htmlFor={`impact-${index}`} className="text-sm">
                      Impact / Results
                    </Label>
                    <Textarea
                      id={`impact-${index}`}
                      value={study.impact}
                      onChange={(e) => handleUpdateCaseStudy(index, { impact: e.target.value })}
                      placeholder={
                        study.format === 'bullets'
                          ? '• 30% energy reduction\n• £15k annual savings\n• 18 tonnes CO2e avoided\n• Improved workplace lighting quality'
                          : 'The results exceeded expectations: 30% energy reduction, £15k in annual savings, and 18 tonnes of CO2e avoided. Staff also reported...'
                      }
                      rows={study.format === 'bullets' ? 5 : 3}
                      className="text-sm font-mono"
                    />
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <Label htmlFor={`photo-${index}`} className="text-sm flex items-center gap-2">
                      Photo / Evidence (Optional)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Photos make case studies more engaging and credible</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    {study.photo_url ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={study.photo_url}
                          readOnly
                          className="flex-1 text-xs"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateCaseStudy(index, { photo_url: '' })}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Case Study Button */}
        {caseStudies.length < 5 && (
          <Button variant="outline" onClick={handleAddCaseStudy} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add {caseStudies.length === 0 ? 'First' : 'Another'} Case Study
          </Button>
        )}

        {caseStudies.length === 0 && (
          <div className="text-center py-6 space-y-3 border rounded-lg bg-muted/20">
            <div className="flex justify-center">
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">No case studies yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Share 2-3 concrete examples of your ESG work in action
              </p>
            </div>
          </div>
        )}

        {/* Helper Tips */}
        {caseStudies.length > 0 && (
          <div className="border-t pt-4">
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                💡 Tips for impactful case studies
              </summary>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <p><strong>Challenge:</strong> What problem were you trying to solve? Include context.</p>
                <p><strong>Action:</strong> What did you actually do? Be specific about timeline and approach.</p>
                <p><strong>Impact:</strong> What changed? Include both quantitative (numbers) and qualitative (feelings) results.</p>
                <p>• Choose diverse examples across different ESG topics</p>
                <p>• Use real numbers and data where possible</p>
                <p>• Be honest about challenges faced along the way</p>
                <p>• Photos dramatically increase engagement - include them!</p>
              </div>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
