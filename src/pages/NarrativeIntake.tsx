import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/layout/Logo';
import { useToast } from '@/hooks/use-toast';
import { useReportNarrative, useUpdateReportNarrative, type ReportNarrative } from '@/hooks/use-report-narratives';
import { NarrativeForm } from '@/components/compliance/NarrativeForm';

export default function NarrativeIntake() {
    const { reportId } = useParams<{ reportId: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

    const { data: narrative, isLoading } = useReportNarrative(reportId || '');
    const updateMutation = useUpdateReportNarrative();

    const handleSave = async (data: ReportNarrative) => {
        try {
            await updateMutation.mutateAsync(data);
            toast({
                title: 'Narrative Saved',
                description: 'Your company narrative has been updated successfully.',
            });
            // Optionally navigate back after a successful save
            // navigate(`/compliance/results/${reportId}`);
        } catch (error: unknown) {
            toast({
                title: 'Save Failed',
                description: error instanceof Error ? error.message : 'Failed to save narrative. Please try again.',
                variant: 'destructive',
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" onClick={() => navigate(`/compliance/results/${reportId}`)}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Results
                            </Button>
                            <Logo size="sm" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => navigate(`/compliance/results/${reportId}`)}>
                                View Results
                            </Button>
                            <Button onClick={() => navigate(`/compliance/disclosure/${reportId}`)}>
                                View Disclosure
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Company Narrative</h1>
                        <p className="text-muted-foreground mt-2">
                            Share your company's unique story, practices, and ESG journey to enrich your disclosure report.
                        </p>
                    </div>

                    <NarrativeForm
                        reportId={reportId || ''}
                        initialData={narrative}
                        onSave={handleSave}
                        isSaving={updateMutation.isPending}
                    />
                </div>
            </div>
        </div>
    );
}
