import { Progress } from "@/components/ui/progress";
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

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm text-muted-foreground ml-2">
            {answeredCount} of {totalCount} questions answered
          </span>
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
