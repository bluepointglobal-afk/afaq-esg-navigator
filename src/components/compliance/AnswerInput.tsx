import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Question, AnswerValue } from "@/types/compliance";

interface AnswerInputProps {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
}

export function AnswerInput({ question, value, onChange }: AnswerInputProps) {
  switch (question.type) {
    case 'boolean':
      return (
        <RadioGroup
          value={value === true ? 'yes' : value === false ? 'no' : undefined}
          onValueChange={(v) => onChange(v === 'yes')}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id={`${question.id}-yes`} data-testid={`answer-yes-${question.id}`} />
            <Label htmlFor={`${question.id}-yes`}>Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id={`${question.id}-no`} data-testid={`answer-no-${question.id}`} />
            <Label htmlFor={`${question.id}-no`}>No</Label>
          </div>
        </RadioGroup>
      );

    case 'single_choice':
      return (
        <Select
          value={typeof value === 'string' ? value : undefined}
          onValueChange={(v) => onChange(v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {question.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
                {option.labelArabic && ` / ${option.labelArabic}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'multiple_choice': {
      const selectedValues = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-2">
          {question.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${question.id}-${option.value}`}
                checked={selectedValues.includes(option.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onChange([...selectedValues, option.value]);
                  } else {
                    onChange(selectedValues.filter((v) => v !== option.value));
                  }
                }}
              />
              <Label htmlFor={`${question.id}-${option.value}`}>
                {option.label}
                {option.labelArabic && ` / ${option.labelArabic}`}
              </Label>
            </div>
          ))}
        </div>
      );
    }

    case 'text':
      return (
        <Textarea
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your answer"
          rows={3}
        />
      );

    case 'number':
      return (
        <Input
          type="number"
          value={typeof value === 'number' ? value : ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          placeholder="Enter a number"
        />
      );

    case 'percentage':
      return (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            max="100"
            value={typeof value === 'number' ? value : ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            placeholder="0"
          />
          <span className="text-muted-foreground">%</span>
        </div>
      );

    case 'date':
      return (
        <Input
          type="date"
          value={value instanceof Date ? value.toISOString().split('T')[0] : typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    default:
      return <div className="text-muted-foreground">Unsupported question type</div>;
  }
}
