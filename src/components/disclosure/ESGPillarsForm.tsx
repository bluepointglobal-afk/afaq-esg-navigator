import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, Plus, X, GripVertical } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { ESGPillar } from '@/types/disclosure-data';

interface ESGPillarsFormProps {
  pillars: ESGPillar[];
  onPillarsChange: (pillars: ESGPillar[]) => void;
}

const SUGGESTED_PILLARS = [
  { name: 'Climate Action', rationale: 'Reduce environmental impact through energy efficiency and emissions reduction' },
  { name: 'People & Culture', rationale: 'Build a diverse, inclusive workplace where everyone can thrive' },
  { name: 'Responsible Operations', rationale: 'Ensure ethical practices across our supply chain and business operations' },
  { name: 'Community Impact', rationale: 'Create positive outcomes for the communities where we operate' },
];

export function ESGPillarsForm({ pillars, onPillarsChange }: ESGPillarsFormProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleAddPillar = (template?: { name: string; rationale: string }) => {
    const newPillar: ESGPillar = {
      name: template?.name || '',
      rationale: template?.rationale || '',
      actions: [],
      target: '',
    };
    onPillarsChange([...pillars, newPillar]);
    setEditingIndex(pillars.length);
    setShowSuggestions(false);
  };

  const handleUpdatePillar = (index: number, updates: Partial<ESGPillar>) => {
    const updated = pillars.map((p, i) => (i === index ? { ...p, ...updates } : p));
    onPillarsChange(updated);
  };

  const handleRemovePillar = (index: number) => {
    onPillarsChange(pillars.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const handleAddAction = (pillarIndex: number, action: string) => {
    if (!action.trim()) return;

    const pillar = pillars[pillarIndex];
    handleUpdatePillar(pillarIndex, {
      actions: [...pillar.actions, action.trim()],
    });
  };

  const handleRemoveAction = (pillarIndex: number, actionIndex: number) => {
    const pillar = pillars[pillarIndex];
    handleUpdatePillar(pillarIndex, {
      actions: pillar.actions.filter((_, i) => i !== actionIndex),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ESG Pillars / Focus Areas
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-md">
                <p>Define 3-4 strategic ESG priorities that guide your sustainability efforts. Each pillar should have a clear rationale and concrete actions.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          Define your key ESG priorities (recommended: 3-4 pillars)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Suggested Pillars */}
        {showSuggestions && pillars.length === 0 && (
          <div className="space-y-3">
            <Label>Quick Start - Use Suggested Pillars</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SUGGESTED_PILLARS.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg p-3 cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors"
                  onClick={() => handleAddPillar(suggestion)}
                >
                  <h4 className="font-medium text-sm mb-1">{suggestion.name}</h4>
                  <p className="text-xs text-muted-foreground">{suggestion.rationale}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setShowSuggestions(false); handleAddPillar(); }}
              >
                Or create from scratch
              </Button>
            </div>
          </div>
        )}

        {/* Pillars List */}
        <div className="space-y-4">
          {pillars.map((pillar, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-start gap-3">
                <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-move" />
                <div className="flex-1 space-y-4">
                  {/* Pillar Name */}
                  <div className="space-y-2">
                    <Label htmlFor={`pillar-name-${index}`} className="text-sm">
                      Pillar Name
                    </Label>
                    <Input
                      id={`pillar-name-${index}`}
                      value={pillar.name}
                      onChange={(e) => handleUpdatePillar(index, { name: e.target.value })}
                      placeholder="e.g., Climate Action, People & Culture"
                      className="font-medium"
                    />
                  </div>

                  {/* Rationale */}
                  <div className="space-y-2">
                    <Label htmlFor={`pillar-rationale-${index}`} className="text-sm">
                      Why This Matters
                    </Label>
                    <Textarea
                      id={`pillar-rationale-${index}`}
                      value={pillar.rationale}
                      onChange={(e) => handleUpdatePillar(index, { rationale: e.target.value })}
                      placeholder="Explain why this pillar is important to your business and stakeholders..."
                      rows={3}
                      className="text-sm"
                    />
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Label className="text-sm">What You're Doing</Label>
                    <div className="space-y-2">
                      {pillar.actions.map((action, actionIdx) => (
                        <div key={actionIdx} className="flex items-center gap-2">
                          <Badge variant="secondary" className="flex-1 justify-between py-1.5 px-3">
                            <span className="text-xs">{action}</span>
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-destructive"
                              onClick={() => handleRemoveAction(index, actionIdx)}
                            />
                          </Badge>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add an action..."
                          className="text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddAction(index, e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            handleAddAction(index, input.value);
                            input.value = '';
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      List specific initiatives, programs, or practices (3-5 actions recommended)
                    </p>
                  </div>

                  {/* Optional Target */}
                  <div className="space-y-2">
                    <Label htmlFor={`pillar-target-${index}`} className="text-sm">
                      Target / Commitment (Optional)
                    </Label>
                    <Input
                      id={`pillar-target-${index}`}
                      value={pillar.target || ''}
                      onChange={(e) => handleUpdatePillar(index, { target: e.target.value })}
                      placeholder="e.g., 50% emissions reduction by 2030"
                      className="text-sm"
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemovePillar(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Pillar Button */}
        {pillars.length < 6 && (
          <Button
            variant="outline"
            onClick={() => handleAddPillar()}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add {pillars.length === 0 ? 'First' : 'Another'} Pillar
          </Button>
        )}

        {pillars.length >= 6 && (
          <p className="text-sm text-amber-600 dark:text-amber-400">
            ⚠️ You have {pillars.length} pillars. Consider consolidating to 3-4 for clarity and focus.
          </p>
        )}

        {/* Helper Tips */}
        {pillars.length > 0 && (
          <div className="border-t pt-4">
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                💡 Tips for strong pillars
              </summary>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <p>• Keep pillar names concise and memorable (2-4 words)</p>
                <p>• Rationale should explain both business value and stakeholder impact</p>
                <p>• Actions should be specific and tangible, not vague aspirations</p>
                <p>• Link pillars to your materiality assessment results</p>
                <p>• Each pillar should have 3-5 concrete actions</p>
              </div>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
