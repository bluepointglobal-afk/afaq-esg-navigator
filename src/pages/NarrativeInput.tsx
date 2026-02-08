import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/layout/Logo';
import { useToast } from '@/hooks/use-toast';
import { useReportNarrative, useUpdateReportNarrative, ReportNarrative } from '@/hooks/use-report-narratives';

interface NarrativeFormValues {
  governance_text: string;
  esg_text: string;
  risk_text: string;
  transparency_text: string;
}

const pillarPrompts = {
  governance: [
    'Describe your company’s board structure and key governance policies.',
    'How does your company handle shareholder rights and communication?',
    'What are the primary ethical guidelines your leadership team follows?',
  ],
  esg: [
    'What are your key environmental initiatives or policies (e.g., energy use, waste management)?',
    'Describe your company’s approach to employee well-being, diversity, and community engagement.',
    'How do you manage sustainability in your supply chain?',
  ],
  risk: [
    'What is your formal process for identifying and mitigating business risks?',
    'How does the board oversee risk management?',
    'Are there specific compliance or operational risks you actively monitor?',
  ],
  transparency: [
    'How do you ensure transparency in your financial and non-financial reporting?',
    'What are your policies on anti-corruption and conflicts of interest?',
    'Describe how you communicate with external stakeholders (investors, regulators, public).',
  ],
};

export default function NarrativeInput() {
  const navigate = useNavigate();
  const { reportId } = useParams<{ reportId: string }>();
  const { toast } = useToast();

  // Data fetching and mutation hooks
  const { data: narrativeData, isLoading } = useReportNarrative(reportId!);
  const updateNarrativeMutation = useUpdateReportNarrative();

  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<NarrativeFormValues>({
    defaultValues: {
      governance_text: '',
      esg_text: '',
      risk_text: '',
      transparency_text: '',
    },
  });

  // Populate form when data loads
  useEffect(() => {
    if (narrativeData) {
      reset({
        governance_text: narrativeData.governanceText || '',
        esg_text: narrativeData.esgText || '',
        risk_text: narrativeData.riskText || '',
        transparency_text: narrativeData.transparencyText || '',
      });
    }
  }, [narrativeData, reset]);

  const onSubmit = async (data: NarrativeFormValues) => {
    if (!reportId) return;

    try {
      const narrativePayload: ReportNarrative = {
        reportId,
        governanceText: data.governance_text,
        esgText: data.esg_text,
        riskText: data.risk_text,
        transparencyText: data.transparency_text,
      };

      await updateNarrativeMutation.mutateAsync(narrativePayload);

      toast({
        title: 'Narratives Saved',
        description: 'Your company-specific information has been saved.',
      });

      // Navigate to the disclosure page
      navigate(`/compliance/disclosure/${reportId}`);
    } catch (error) {
      console.error('Error saving narrative:', error);
      toast({
        title: 'Save Failed',
        description: 'There was an error saving your changes. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading narrative data...</p>
        </div>
      </div>
    );
  }

  const isSaving = updateNarrativeMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate(`/compliance/disclosure/${reportId}`)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Disclosure
              </Button>
              <Logo size="sm" />
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={handleSubmit(onSubmit)} disabled={isSaving || !isDirty}>
                {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save & Continue</>}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Company Narrative Input</CardTitle>
              <p className="text-sm text-muted-foreground">
                Provide specific details about your company’s practices. This information is crucial for generating a high-quality, defensible disclosure report.
              </p>
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-md mt-2">
                <strong>Hint:</strong> We will use this text to generate your disclosure; do not include confidential secrets or personally identifiable information you do not wish to be disclosed.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Governance */}
                <div>
                  <h3 className="text-lg font-semibold">Governance</h3>
                  <p className="text-sm text-muted-foreground mb-2">Describe your governance framework and practices.</p>
                  <Label htmlFor="governance_text">Governance Narrative</Label>
                  <Textarea
                    id="governance_text"
                    {...register('governance_text')}
                    rows={8}
                    placeholder={pillarPrompts.governance.join('\n- ')}
                  />
                </div>

                {/* ESG */}
                <div>
                  <h3 className="text-lg font-semibold">ESG & Sustainability</h3>
                  <p className="text-sm text-muted-foreground mb-2">Detail your environmental, social, and sustainability efforts.</p>
                  <Label htmlFor="esg_text">ESG Narrative</Label>
                  <Textarea
                    id="esg_text"
                    {...register('esg_text')}
                    rows={8}
                    placeholder={pillarPrompts.esg.join('\n- ')}
                  />
                </div>

                {/* Risk */}
                <div>
                  <h3 className="text-lg font-semibold">Risk Management</h3>
                  <p className="text-sm text-muted-foreground mb-2">Explain your approach to identifying, managing, and mitigating risks.</p>
                  <Label htmlFor="risk_text">Risk Narrative</Label>
                  <Textarea
                    id="risk_text"
                    {...register('risk_text')}
                    rows={8}
                    placeholder={pillarPrompts.risk.join('\n- ')}
                  />
                </div>

                {/* Transparency */}
                <div>
                  <h3 className="text-lg font-semibold">Transparency</h3>
                  <p className="text-sm text-muted-foreground mb-2">Describe your commitment and practices for transparency.</p>
                  <Label htmlFor="transparency_text">Transparency Narrative</Label>
                  <Textarea
                    id="transparency_text"
                    {...register('transparency_text')}
                    rows={8}
                    placeholder={pillarPrompts.transparency.join('\n- ')}
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
