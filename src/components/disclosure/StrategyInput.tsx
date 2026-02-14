import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Info, Lightbulb } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StrategyInputProps {
  strategy: string;
  onStrategyChange: (strategy: string) => void;
}

const EXAMPLES = [
  'Building a resilient, low-carbon future while empowering our people and communities',
  'Sustainable growth through operational excellence and stakeholder value',
  'Net zero operations by 2030 with a thriving, diverse workforce',
];

export function StrategyInput({ strategy, onStrategyChange }: StrategyInputProps) {
  const wordCount = strategy.trim().split(/\s+/).filter(Boolean).length;
  const isGoodLength = wordCount >= 8 && wordCount <= 20;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ESG Strategy in One Sentence
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-md">
                <p>Your ESG strategy distilled into a single, memorable sentence. This appears prominently in your disclosure and should capture your overall ambition.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          Capture your ESG ambition in 10-15 words
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="strategy">Your ESG Strategy</Label>
            <span className={`text-xs ${isGoodLength ? 'text-green-600' : 'text-muted-foreground'}`}>
              {wordCount} words {isGoodLength && '✓'}
            </span>
          </div>
          <Textarea
            id="strategy"
            value={strategy}
            onChange={(e) => onStrategyChange(e.target.value)}
            placeholder="Building a sustainable future through..."
            rows={3}
            className="text-base font-medium"
          />
          <p className="text-xs text-muted-foreground">
            Think of this as your ESG tagline - clear, concise, and inspiring
          </p>
        </div>

        {/* Examples */}
        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <Label className="text-sm">Examples</Label>
          </div>
          <div className="space-y-2">
            {EXAMPLES.map((example, idx) => (
              <div
                key={idx}
                className="text-sm p-2 rounded bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => onStrategyChange(example)}
              >
                "{example}"
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="border-t pt-4">
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Tips for a strong strategy statement
            </summary>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>✓ Be specific about your ESG focus (climate, people, community, etc.)</p>
              <p>✓ Include a timeframe or endpoint if you have one</p>
              <p>✓ Balance ambition with authenticity - don't overstate</p>
              <p>✓ Link to your material topics and pillars</p>
              <p>✗ Avoid generic buzzwords like "sustainable excellence"</p>
              <p>✗ Don't make it too long or complex</p>
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
}
