import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info, Lightbulb } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { ToneOfVoice, CEOMessageFormat } from '@/types/disclosure-data';
import { TONE_DESCRIPTIONS } from '@/types/disclosure-data';

interface CEOMessageInputProps {
  format: CEOMessageFormat;
  content: string;
  toneOfVoice: ToneOfVoice;
  onFormatChange: (format: CEOMessageFormat) => void;
  onContentChange: (content: string) => void;
  onToneChange: (tone: ToneOfVoice) => void;
}

const BULLET_PLACEHOLDER = `• What ESG means to your company
• Key achievements this year
• Your commitment to stakeholders
• Future goals`;

const FULL_TEXT_PLACEHOLDER = `As CEO, I'm proud to share our ESG progress this year. We've made significant strides in reducing our environmental impact while strengthening our relationships with employees and communities...`;

export function CEOMessageInput({
  format,
  content,
  toneOfVoice,
  onFormatChange,
  onContentChange,
  onToneChange,
}: CEOMessageInputProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          CEO / Leadership Message
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Your message sets the tone for the entire report. Keep it authentic and concise. AI will expand and polish your input based on your chosen tone.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          Share your ESG vision and commitments. Write naturally - AI will polish it for you.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Format Toggle */}
        <div className="space-y-3">
          <Label>Message Format</Label>
          <RadioGroup value={format} onValueChange={(v) => onFormatChange(v as CEOMessageFormat)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bullet_points" id="bullets" />
              <Label htmlFor="bullets" className="font-normal cursor-pointer">
                Bullet Points (Quickest - AI expands to full message)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="full_text" id="full" />
              <Label htmlFor="full" className="font-normal cursor-pointer">
                Full Text (AI polishes and formats)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Tone of Voice Selector */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="tone">Tone of Voice</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                </TooltipTrigger>
                <TooltipContent className="max-w-md">
                  <p className="font-semibold mb-2">Recommended: Authentic</p>
                  <p className="text-sm">SMEs benefit from honest, approachable language that builds trust without corporate jargon.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select value={toneOfVoice} onValueChange={(v) => onToneChange(v as ToneOfVoice)}>
            <SelectTrigger id="tone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(TONE_DESCRIPTIONS) as ToneOfVoice[]).map((tone) => (
                <SelectItem key={tone} value={tone}>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium capitalize">{tone}</span>
                    <span className="text-xs text-muted-foreground">{TONE_DESCRIPTIONS[tone]}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Content Input */}
        <div className="space-y-3">
          <Label htmlFor="content">Your Message</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={format === 'bullet_points' ? BULLET_PLACEHOLDER : FULL_TEXT_PLACEHOLDER}
            className="min-h-[200px] font-mono text-sm"
            rows={format === 'bullet_points' ? 8 : 12}
          />
          <p className="text-xs text-muted-foreground">
            {format === 'bullet_points'
              ? 'Enter 3-5 bullet points. AI will expand each into full paragraphs.'
              : 'Write naturally - AI will polish grammar, structure, and flow while keeping your voice.'
            }
          </p>
        </div>

        {/* Preview Toggle */}
        {content && (
          <div className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Hide' : 'Show'} AI Preview
            </Button>

            {showPreview && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <p className="text-sm font-medium mb-2">AI-Enhanced Preview:</p>
                <p className="text-sm text-muted-foreground italic">
                  Preview will be generated when you save this section. The AI will expand your input based on the selected "{toneOfVoice}" tone.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Helper Examples */}
        <div className="border-t pt-4">
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              See examples →
            </summary>
            <div className="mt-3 space-y-3 text-sm">
              <div className="border-l-2 border-blue-500 pl-3">
                <p className="font-medium text-blue-600">Your Input (Casual):</p>
                <p className="text-muted-foreground italic">"Been a tough year but proud of team. Cut energy 20% with LEDs. More to do on waste next year."</p>
              </div>
              <div className="border-l-2 border-green-500 pl-3">
                <p className="font-medium text-green-600">AI Output (Authentic Tone):</p>
                <p className="text-muted-foreground italic">"This year brought challenges, but I'm incredibly proud of what our team achieved. Our LED retrofit program delivered a 20% energy reduction—proving sustainability and cost savings go hand in hand. Looking ahead, we're tackling waste management with the same determination."</p>
              </div>
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
}
