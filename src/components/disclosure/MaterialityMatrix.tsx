import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Info, Plus, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { MaterialityRating } from '@/types/disclosure-data';
import { MATERIALITY_TOPICS } from '@/types/disclosure-data';

interface MaterialityMatrixProps {
  ratings: MaterialityRating[];
  onRatingsChange: (ratings: MaterialityRating[]) => void;
}

export function MaterialityMatrix({ ratings, onRatingsChange }: MaterialityMatrixProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [customTopic, setCustomTopic] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);

  const handleAddTopic = (topic: string, isCustom: boolean = false) => {
    if (ratings.find(r => r.topic === topic)) {
      return; // Already added
    }

    const newRating: MaterialityRating = {
      topic,
      business_impact: 3,
      societal_impact: 3,
      custom: isCustom,
    };

    onRatingsChange([...ratings, newRating]);
    setSelectedTopic(topic);
  };

  const handleRemoveTopic = (topic: string) => {
    onRatingsChange(ratings.filter(r => r.topic !== topic));
    if (selectedTopic === topic) {
      setSelectedTopic(null);
    }
  };

  const handleUpdateRating = (topic: string, field: 'business_impact' | 'societal_impact', value: number) => {
    onRatingsChange(
      ratings.map(r =>
        r.topic === topic ? { ...r, [field]: value } : r
      )
    );
  };

  const handleAddCustomTopic = () => {
    if (customTopic.trim()) {
      handleAddTopic(customTopic.trim(), true);
      setCustomTopic('');
      setShowAddCustom(false);
    }
  };

  const currentRating = selectedTopic ? ratings.find(r => r.topic === selectedTopic) : null;

  // Calculate matrix position for visualization
  const getMatrixPosition = (rating: MaterialityRating) => ({
    x: rating.business_impact,
    y: rating.societal_impact,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Double Materiality Assessment
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-md">
                <p className="font-semibold mb-2">What is Double Materiality?</p>
                <p className="text-sm mb-2"><strong>Financial Materiality:</strong> How much does this topic impact your business? (Revenue, costs, reputation)</p>
                <p className="text-sm"><strong>Impact Materiality:</strong> How much does your business impact society/environment on this topic?</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          Select 5-10 material topics and rate their importance to your business and stakeholders
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Topic Selection */}
        <div className="space-y-3">
          <Label>Select ESG Topics ({ratings.length} selected)</Label>
          <div className="flex flex-wrap gap-2">
            {MATERIALITY_TOPICS.map((topic) => {
              const isSelected = ratings.some(r => r.topic === topic);
              return (
                <Button
                  key={topic}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => isSelected ? handleRemoveTopic(topic) : handleAddTopic(topic)}
                  className="h-auto py-2 px-3 text-xs"
                >
                  {topic}
                  {isSelected && <X className="ml-1 h-3 w-3" />}
                </Button>
              );
            })}
          </div>

          {/* Add Custom Topic */}
          <div className="pt-2">
            {!showAddCustom ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddCustom(true)}
                className="text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Custom Topic
              </Button>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Enter custom topic..."
                  className="text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTopic()}
                />
                <Button size="sm" onClick={handleAddCustomTopic}>Add</Button>
                <Button size="sm" variant="ghost" onClick={() => { setShowAddCustom(false); setCustomTopic(''); }}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Rating Interface */}
        {ratings.length > 0 && (
          <>
            <div className="border-t pt-4 space-y-3">
              <Label>Rate Selected Topics</Label>
              <p className="text-sm text-muted-foreground">
                Click a topic below to rate it on both dimensions
              </p>
              <div className="flex flex-wrap gap-2">
                {ratings.map((rating) => (
                  <Badge
                    key={rating.topic}
                    variant={selectedTopic === rating.topic ? 'default' : 'secondary'}
                    className="cursor-pointer px-3 py-1.5"
                    onClick={() => setSelectedTopic(rating.topic)}
                  >
                    {rating.topic}
                    {rating.custom && <span className="ml-1 text-xs">(custom)</span>}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Rating Sliders */}
            {currentRating && (
              <div className="border rounded-lg p-4 bg-muted/30 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{currentRating.topic}</h4>
                    <p className="text-sm text-muted-foreground">Rate on both dimensions (1=Low, 5=High)</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTopic(currentRating.topic)}
                  >
                    Remove
                  </Button>
                </div>

                {/* Business Impact */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Financial Materiality (Impact on Business)</Label>
                    <Badge variant="outline">{currentRating.business_impact}</Badge>
                  </div>
                  <Slider
                    value={[currentRating.business_impact]}
                    onValueChange={([value]) => handleUpdateRating(currentRating.topic, 'business_impact', value)}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    How much does this topic affect your revenue, costs, or reputation?
                  </p>
                </div>

                {/* Societal Impact */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Impact Materiality (Impact on Society)</Label>
                    <Badge variant="outline">{currentRating.societal_impact}</Badge>
                  </div>
                  <Slider
                    value={[currentRating.societal_impact]}
                    onValueChange={([value]) => handleUpdateRating(currentRating.topic, 'societal_impact', value)}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    How much does your business impact people or environment on this topic?
                  </p>
                </div>
              </div>
            )}

            {/* Visual Matrix Preview */}
            <div className="border-t pt-4">
              <Label className="mb-3 block">Materiality Matrix Preview</Label>
              <div className="relative bg-gradient-to-tr from-green-50 via-yellow-50 to-red-50 dark:from-green-950 dark:via-yellow-950 dark:to-red-950 border rounded-lg p-4">
                <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 pointer-events-none">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className="border-gray-200 dark:border-gray-700 border-r border-b last:border-r-0" />
                  ))}
                </div>

                {/* Axis Labels */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground">
                  Financial Materiality →
                </div>
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-medium text-muted-foreground whitespace-nowrap">
                  Impact Materiality →
                </div>

                {/* Plot Points */}
                <div className="relative h-[300px]">
                  {ratings.map((rating) => {
                    const pos = getMatrixPosition(rating);
                    return (
                      <TooltipProvider key={rating.topic}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="absolute w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform"
                              style={{
                                left: `${(pos.x / 5) * 100}%`,
                                bottom: `${(pos.y / 5) * 100}%`,
                              }}
                              onClick={() => setSelectedTopic(rating.topic)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-medium">{rating.topic}</p>
                            <p className="text-xs">Business: {rating.business_impact} | Society: {rating.societal_impact}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Topics in the top-right corner are highly material and should be prioritized in your ESG strategy
              </p>
            </div>
          </>
        )}

        {ratings.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Select at least 5 topics to begin your materiality assessment</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
