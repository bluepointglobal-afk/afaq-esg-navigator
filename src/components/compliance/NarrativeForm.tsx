import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

import { ReportNarrative } from '@/hooks/use-report-narratives';

interface NarrativeFormProps {
    initialData: ReportNarrative | null;
    onSave: (data: ReportNarrative) => void;
    isSaving: boolean;
    reportId: string;
}

const SECTIONS = [
    {
        id: 'governanceText',
        title: 'Governance',
        prompts: [
            'How does your board oversee ESG issues?',
            'Who is the senior executive responsible for ESG?',
            'What are your key governance policies (e.g., Code of Conduct)?',
        ],
        helperText: 'Describe current practice; formal or informal; no secrets.',
        limit: 2000,
    },
    {
        id: 'esgText',
        title: 'Environmental & Social',
        prompts: [
            'What are your environmental priorities (e.g., carbon, waste)?',
            'How do you manage employee wellbeing and diversity?',
            'What is your approach to community engagement?',
        ],
        helperText: 'Focus on material topics; be specific about initiatives.',
        limit: 2000,
    },
    {
        id: 'riskText',
        title: 'Risk Management',
        prompts: [
            'How are ESG risks integrated into your standard risk framework?',
            'What are the most significant climate-related risks for your business?',
            'How do you manage supply chain risks?',
        ],
        helperText: 'Describe processes for identifying and mitigate risks.',
        limit: 2000,
    },
    {
        id: 'transparencyText',
        title: 'Transparency & Reporting',
        prompts: [
            'What reporting frameworks do you follow (e.g., GRI, SASB)?',
            'How do you verify the accuracy of your ESG data?',
            'What is your frequency of public ESG reporting?',
        ],
        helperText: 'Mention external audits or internal validation processes.',
        limit: 2000,
    },
];

export function NarrativeForm({ initialData, onSave, isSaving, reportId }: NarrativeFormProps) {
    const [formData, setFormData] = useState<ReportNarrative>({
        reportId,
        governanceText: '',
        esgText: '',
        riskText: '',
        transparencyText: '',
        governanceStructured: [],
        esgStructured: [],
        riskStructured: [],
        transparencyStructured: [],
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (id: string, value: string) => {
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {SECTIONS.map((section) => (
                <Card key={section.id} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-semibold">{section.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{section.helperText}</p>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-blue-900 mb-2">Guided Prompts:</h4>
                            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                                {section.prompts.map((prompt, idx) => (
                                    <li key={idx}>{prompt}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={section.id}>Narrative</Label>
                            <Textarea
                                id={section.id}
                                placeholder="Type your narrative here..."
                                className="min-h-[200px]"
                                value={(formData as unknown as Record<string, string>)[section.id] || ''}
                                onChange={(e) => handleChange(section.id, e.target.value)}
                                maxLength={section.limit}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{((formData as unknown as Record<string, string>)[section.id] || '').length} / {section.limit} characters</span>
                                {(((formData as unknown as Record<string, string>)[section.id] || '').length) > section.limit * 0.9 && (
                                    <span className="text-amber-600 font-medium">Approaching character limit</span>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            ))}

            <div className="flex justify-end gap-4">
                <Button
                    type="submit"
                    size="lg"
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save Narrative'}
                </Button>
            </div>
        </form>
    );
}
