import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { QuestionItem } from "./QuestionItem";
import type { QuestionSection, QuestionAnswer, AnswerValue } from "@/types/compliance";

interface QuestionSectionProps {
  section: QuestionSection;
  answers: Record<string, QuestionAnswer>;
  onAnswerChange: (questionId: string, value: AnswerValue, evidenceUrls?: string[], notes?: string) => void;
  allAnswers: Record<string, QuestionAnswer>;
  showArabic?: boolean;
}

export function QuestionSection({
  section,
  answers,
  onAnswerChange,
  allAnswers,
  showArabic = false,
}: QuestionSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {showArabic && section.titleArabic ? section.titleArabic : section.title}
        </CardTitle>
        <CardDescription className="text-base">
          {showArabic && section.descriptionArabic ? section.descriptionArabic : section.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {section.questions.map((question) => (
            <QuestionItem
              key={question.id}
              question={question}
              answer={answers[question.id]}
              onAnswerChange={(value, evidenceUrls, notes) =>
                onAnswerChange(question.id, value, evidenceUrls, notes)
              }
              allAnswers={allAnswers}
              showArabic={showArabic}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
