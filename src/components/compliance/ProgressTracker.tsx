import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";
import type { QuestionSection, QuestionAnswer } from "@/types/compliance";

interface ProgressTrackerProps {
  completion: number;
  answeredCount: number;
  totalCount: number;
  sections: QuestionSection[];
  answers: Record<string, QuestionAnswer>;
}

export function ProgressTracker({
  completion,
  answeredCount,
  totalCount,
  sections,
  answers,
}: ProgressTrackerProps) {
  const getSectionCompletion = (section: QuestionSection) => {
    const sectionQuestionIds = section.questions.map(q => q.id);
    const answeredInSection = sectionQuestionIds.filter(id => answers[id]).length;
    return section.questions.length > 0
      ? Math.round((answeredInSection / section.questions.length) * 100)
      : 0;
  };

  // Calculate time estimate (avg 2 min per question)
  const remainingQuestions = totalCount - answeredCount;
  const estimatedMinutes = remainingQuestions * 2;
  const estimatedTime = estimatedMinutes < 60
    ? `${estimatedMinutes} min`
    : `${Math.round(estimatedMinutes / 60)} hr ${estimatedMinutes % 60} min`;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm text-muted-foreground ml-2">
            {answeredCount} of {totalCount} questions answered
          </span>
          {remainingQuestions > 0 && (
            <div className="flex items-center gap-1.5 mt-1">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                ~{estimatedTime} remaining
              </span>
            </div>
          )}
        </div>
        <span className="text-2xl font-bold text-primary">{completion}%</span>
      </div>
      <Progress value={completion} className="h-3 mb-4" />

      {/* Section Progress */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        {sections.map((section) => {
          const sectionCompletion = getSectionCompletion(section);
          return (
            <div key={section.id} className="text-center">
              <div className="text-xs font-medium mb-1">{section.title}</div>
              <div className="text-lg font-bold text-muted-foreground">{sectionCompletion}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
