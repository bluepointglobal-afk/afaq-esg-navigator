import { CheckCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import type { QuestionSection, QuestionAnswer } from "@/types/compliance";
import { cn } from "@/lib/utils";

interface QuestionnaireNavProps {
  sections: QuestionSection[];
  currentSection: number;
  onSectionChange: (index: number) => void;
  answers: Record<string, QuestionAnswer>;
}

export function QuestionnaireNav({
  sections,
  currentSection,
  onSectionChange,
  answers,
}: QuestionnaireNavProps) {
  const getSectionProgress = (section: QuestionSection) => {
    const sectionQuestionIds = section.questions.map(q => q.id);
    const answeredInSection = sectionQuestionIds.filter(id => answers[id]).length;
    return {
      answered: answeredInSection,
      total: section.questions.length,
      isComplete: answeredInSection === section.questions.length && section.questions.length > 0,
    };
  };

  return (
    <CardContent className="p-4">
      <h3 className="font-semibold mb-4">Sections</h3>
      <div className="space-y-2">
        {sections.map((section, index) => {
          const progress = getSectionProgress(section);
          const isCurrent = index === currentSection;

          return (
            <Button
              key={section.id}
              variant={isCurrent ? "default" : "ghost"}
              className={cn(
                "w-full justify-start text-left h-auto py-3",
                isCurrent && "bg-primary text-primary-foreground"
              )}
              onClick={() => onSectionChange(index)}
            >
              <div className="flex items-start gap-3 w-full">
                {progress.isComplete ? (
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{section.title}</div>
                  <div className={cn(
                    "text-xs",
                    isCurrent ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {progress.answered}/{progress.total} answered
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </CardContent>
  );
}
