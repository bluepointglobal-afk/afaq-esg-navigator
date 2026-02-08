import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { AlertCircle, HelpCircle } from "lucide-react";
import { AnswerInput } from "./AnswerInput";
import { EvidenceField } from "./EvidenceField";
import type { Question, AnswerValue, QuestionAnswer } from "@/types/compliance";
import { shouldShowQuestion } from "@/lib/conditional-logic";
import { cn } from "@/lib/utils";

interface QuestionItemProps {
  question: Question;
  answer: QuestionAnswer | undefined;
  onAnswerChange: (value: AnswerValue, evidenceUrls?: string[], notes?: string) => void;
  allAnswers: Record<string, QuestionAnswer>;
  showArabic?: boolean;
}

export function QuestionItem({
  question,
  answer,
  onAnswerChange,
  allAnswers,
  showArabic = false,
}: QuestionItemProps) {
  const [showEvidence, setShowEvidence] = useState(false);

  // Check conditional visibility
  const isVisible = shouldShowQuestion(question.conditionalRules, allAnswers);

  if (!isVisible) {
    return (
      <div className="p-4 bg-muted/30 rounded-lg border border-dashed">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4" />
          <span>
            This question is not applicable until dependencies are answered
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-4 rounded-lg border bg-card",
      answer ? "border-primary/30 bg-primary/5" : "border-border"
    )}>
      {/* Question Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-2 flex-1">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Label className="text-base font-medium">
                {showArabic && question.textArabic ? question.textArabic : question.text}
              </Label>
              {question.required && (
                <Badge variant="destructive" className="text-xs">Required</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Code: {question.code}</span>
              <span>•</span>
              <span>Weight: {question.weight}/10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Hint */}
      {question.evidenceHint && (
        <div className="mb-3 p-2 bg-blue-50 rounded text-sm flex items-start gap-2">
          <HelpCircle className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
          <span className="text-blue-900">
            {showArabic && question.evidenceHintArabic ? question.evidenceHintArabic : question.evidenceHint}
          </span>
        </div>
      )}

      {/* Answer Input */}
      <div className="mb-3">
        <AnswerInput
          question={question}
          value={answer?.value}
          onChange={(value) => onAnswerChange(value, answer?.evidenceUrls, answer?.notes)}
        />
      </div>

      {/* Evidence Section */}
      <div className="mt-3">
        <button
          type="button"
          onClick={() => setShowEvidence(!showEvidence)}
          className="text-sm text-primary hover:underline"
        >
          {showEvidence ? 'Hide' : 'Add'} evidence & notes
        </button>
        {showEvidence && (
          <div className="mt-2">
            <EvidenceField
              evidenceUrls={answer?.evidenceUrls}
              notes={answer?.notes}
              onEvidenceChange={(urls, notes) => onAnswerChange(answer?.value, urls, notes)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
