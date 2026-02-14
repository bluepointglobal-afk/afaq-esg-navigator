import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Info, Plus, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { ESGTarget } from '@/types/disclosure-data';

interface TargetsManagerProps {
  targets: ESGTarget[];
  hasFormalTargets: boolean;
  onTargetsChange: (targets: ESGTarget[]) => void;
  onHasFormalTargetsChange: (has: boolean) => void;
}

const STATUS_COLORS = {
  'on-track': 'bg-green-500',
  'behind': 'bg-amber-500',
  'achieved': 'bg-blue-500',
  'not-started': 'bg-gray-400',
};

const STATUS_LABELS = {
  'on-track': 'On Track',
  'behind': 'Behind Schedule',
  'achieved': 'Achieved',
  'not-started': 'Not Started',
};

export function TargetsManager({
  targets,
  hasFormalTargets,
  onTargetsChange,
  onHasFormalTargetsChange,
}: TargetsManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddTarget = () => {
    const newTarget: ESGTarget = {
      what: '',
      by_when: '',
      baseline: '',
      progress: '',
      status: 'not-started',
    };
    onTargetsChange([...targets, newTarget]);
    setEditingIndex(targets.length);
  };

  const handleUpdateTarget = (index: number, updates: Partial<ESGTarget>) => {
    const updated = targets.map((t, i) => (i === index ? { ...t, ...updates } : t));
    onTargetsChange(updated);
  };

  const handleRemoveTarget = (index: number) => {
    onTargetsChange(targets.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Targets & Commitments
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-md">
                <p>Set measurable ESG targets with timelines. Even if you don't have formal targets, you can describe commitments or goals you're working toward.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          Define your ESG goals with timelines and track progress
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Formal Targets Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label htmlFor="formal-targets" className="text-sm font-medium">
              We have formal, board-approved ESG targets
            </Label>
            <p className="text-xs text-muted-foreground">
              Toggle this on if your targets are officially approved by leadership
            </p>
          </div>
          <Switch
            id="formal-targets"
            checked={hasFormalTargets}
            onCheckedChange={onHasFormalTargetsChange}
          />
        </div>

        {/* Targets List */}
        <div className="space-y-4">
          {targets.map((target, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-4">
                  {/* What */}
                  <div className="space-y-2">
                    <Label htmlFor={`target-what-${index}`} className="text-sm">
                      Target / Commitment
                    </Label>
                    <Input
                      id={`target-what-${index}`}
                      value={target.what}
                      onChange={(e) => handleUpdateTarget(index, { what: e.target.value })}
                      placeholder="e.g., Reduce Scope 1+2 emissions by 50%"
                      className="font-medium"
                    />
                  </div>

                  {/* When + Status */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`target-when-${index}`} className="text-sm">
                        Target Date
                      </Label>
                      <Input
                        id={`target-when-${index}`}
                        value={target.by_when}
                        onChange={(e) => handleUpdateTarget(index, { by_when: e.target.value })}
                        placeholder="e.g., By 2030"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`target-status-${index}`} className="text-sm">
                        Status
                      </Label>
                      <Select
                        value={target.status}
                        onValueChange={(v) => handleUpdateTarget(index, { status: v as ESGTarget['status'] })}
                      >
                        <SelectTrigger id={`target-status-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(STATUS_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[value as keyof typeof STATUS_COLORS]}`} />
                                {label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Baseline */}
                  <div className="space-y-2">
                    <Label htmlFor={`target-baseline-${index}`} className="text-sm">
                      Baseline
                    </Label>
                    <Input
                      id={`target-baseline-${index}`}
                      value={target.baseline}
                      onChange={(e) => handleUpdateTarget(index, { baseline: e.target.value })}
                      placeholder="e.g., 2023 baseline: 500 tonnes CO2e"
                    />
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <Label htmlFor={`target-progress-${index}`} className="text-sm">
                      Current Progress
                    </Label>
                    <Textarea
                      id={`target-progress-${index}`}
                      value={target.progress}
                      onChange={(e) => handleUpdateTarget(index, { progress: e.target.value })}
                      placeholder="Describe current progress, achievements, or challenges..."
                      rows={3}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Badge className={STATUS_COLORS[target.status]} variant="default">
                    {STATUS_LABELS[target.status]}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTarget(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Target Button */}
        <Button variant="outline" onClick={handleAddTarget} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add {targets.length === 0 ? 'First' : 'Another'} Target
        </Button>

        {targets.length === 0 && (
          <div className="text-center py-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              No targets yet? That's okay!
            </p>
            <p className="text-xs text-muted-foreground">
              Many SMEs start with commitments or goals before setting formal targets.
              You can describe your intentions even without specific numbers.
            </p>
          </div>
        )}

        {/* Helper Tips */}
        {targets.length > 0 && (
          <div className="border-t pt-4">
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                💡 Tips for effective targets
              </summary>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <p>• Be specific and measurable (use numbers and percentages)</p>
                <p>• Set realistic timelines based on your resources</p>
                <p>• Always include a baseline for comparison</p>
                <p>• Update progress regularly to track accountability</p>
                <p>• Align targets with your material topics and pillars</p>
                <p>• Consider science-based targets for climate goals</p>
              </div>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
