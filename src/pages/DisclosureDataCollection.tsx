import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useDisclosureNarratives, useUpdateDisclosureNarratives } from '@/hooks/use-disclosure-narratives';
import { useDisclosureMetrics, useUpdateDisclosureMetrics } from '@/hooks/use-disclosure-metrics';
import { ArrowLeft, ArrowRight, Save, CheckCircle2 } from 'lucide-react';
import { CEOMessageInput } from '@/components/disclosure/CEOMessageInput';
import { MaterialityMatrix } from '@/components/disclosure/MaterialityMatrix';
import { ESGPillarsForm } from '@/components/disclosure/ESGPillarsForm';
import { StrategyInput } from '@/components/disclosure/StrategyInput';
import { TargetsManager } from '@/components/disclosure/TargetsManager';
import { CaseStudiesBuilder } from '@/components/disclosure/CaseStudiesBuilder';
import { MetricsInput } from '@/components/disclosure/MetricsInput';
import type { DisclosureNarratives, DisclosureMetrics } from '@/types/disclosure-data';

const TABS = [
  { id: 'ceo', label: 'CEO Message', icon: '💬' },
  { id: 'materiality', label: 'Materiality', icon: '📊' },
  { id: 'strategy', label: 'Strategy & Pillars', icon: '🎯' },
  { id: 'targets', label: 'Targets', icon: '🎪' },
  { id: 'cases', label: 'Case Studies', icon: '📖' },
  { id: 'metrics', label: 'Metrics', icon: '📈' },
];

export default function DisclosureDataCollection() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentTab, setCurrentTab] = useState('ceo');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch existing data
  const { data: existingNarratives, isLoading: narrativesLoading } = useDisclosureNarratives(reportId || '');
  const { data: existingMetrics, isLoading: metricsLoading } = useDisclosureMetrics(reportId || '');

  // Mutations
  const updateNarratives = useUpdateDisclosureNarratives();
  const updateMetrics = useUpdateDisclosureMetrics();

  // Local state
  const [narratives, setNarratives] = useState<Partial<DisclosureNarratives>>({
    ceo_message_format: 'bullet_points',
    ceo_message_content: '',
    tone_of_voice: 'authentic',
    materiality_ratings: [],
    esg_pillars: [],
    esg_strategy_oneliner: '',
    targets: [],
    has_formal_targets: false,
    case_studies: [],
    esg_oversight: '',
    risk_management: '',
    policies: [],
    completeness_score: 0,
    phase_completed: 1,
  });

  const [metrics, setMetrics] = useState<Partial<DisclosureMetrics>>({
    data_quality: 'estimated',
    scope3_calculated: false,
  });

  // Load existing data when available
  useEffect(() => {
    if (existingNarratives) {
      setNarratives(existingNarratives);
    }
  }, [existingNarratives]);

  useEffect(() => {
    if (existingMetrics) {
      setMetrics(existingMetrics);
    }
  }, [existingMetrics]);

  // Calculate completeness score
  const calculateCompleteness = (): number => {
    let score = 0;
    const checks = [
      !!narratives.ceo_message_content?.trim(), // 15%
      (narratives.materiality_ratings?.length || 0) >= 5, // 15%
      (narratives.esg_pillars?.length || 0) >= 3, // 15%
      !!narratives.esg_strategy_oneliner?.trim(), // 10%
      (narratives.targets?.length || 0) >= 1, // 15%
      (narratives.case_studies?.length || 0) >= 2, // 15%
      !!metrics.total_employees || !!metrics.scope1_tonnes_co2e, // 15%
    ];

    checks.forEach((check, idx) => {
      if (check) {
        if (idx === 0 || idx === 1 || idx === 2 || idx === 4 || idx === 5) score += 15;
        else if (idx === 3) score += 10;
        else score += 15;
      }
    });

    return Math.min(score, 100);
  };

  const completeness = calculateCompleteness();

  // Save function
  const handleSave = async (silent = false) => {
    if (!reportId) return;

    setIsSaving(true);
    try {
      const narrativesData: Partial<DisclosureNarratives> & { report_id: string } = {
        ...narratives,
        report_id: reportId,
        completeness_score: completeness,
      };

      const metricsData: Partial<DisclosureMetrics> & { report_id: string } = {
        ...metrics,
        report_id: reportId,
      };

      await Promise.all([
        updateNarratives.mutateAsync(narrativesData),
        updateMetrics.mutateAsync(metricsData),
      ]);

      if (!silent) {
        toast({
          title: 'Saved',
          description: 'Your data has been saved successfully',
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save data',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save on significant changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (reportId && (narratives.ceo_message_content || narratives.materiality_ratings?.length)) {
        handleSave(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [narratives, metrics]);

  const handleNext = () => {
    const currentIndex = TABS.findIndex(t => t.id === currentTab);
    if (currentIndex < TABS.length - 1) {
      setCurrentTab(TABS[currentIndex + 1].id);
      handleSave(true);
    }
  };

  const handlePrevious = () => {
    const currentIndex = TABS.findIndex(t => t.id === currentTab);
    if (currentIndex > 0) {
      setCurrentTab(TABS[currentIndex - 1].id);
    }
  };

  const handleComplete = async () => {
    await handleSave();
    toast({
      title: 'Data Collection Complete!',
      description: 'You can now generate your disclosure',
    });
    navigate(`/compliance/disclosure/${reportId}`);
  };

  const isLoading = narrativesLoading || metricsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <Badge variant="outline">
                {completeness}% Complete
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSave()}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">ESG Data Collection</h1>
            <p className="text-muted-foreground">
              Fill in what you have - AI will help polish and expand your input into a professional disclosure
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <Progress value={completeness} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {completeness < 30 && 'Just getting started - keep going!'}
              {completeness >= 30 && completeness < 60 && 'Good progress - you\'re building momentum'}
              {completeness >= 60 && completeness < 90 && 'Looking strong - almost there'}
              {completeness >= 90 && 'Excellent! Ready to generate your disclosure'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          {/* Tabs Navigation */}
          <TabsList className="grid w-full grid-cols-6 mb-8">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex flex-col gap-1 py-3">
                <span className="text-lg">{tab.icon}</span>
                <span className="text-xs">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="ceo" className="space-y-6">
            <CEOMessageInput
              format={narratives.ceo_message_format || 'bullet_points'}
              content={narratives.ceo_message_content || ''}
              toneOfVoice={narratives.tone_of_voice || 'authentic'}
              onFormatChange={(format) => setNarratives({ ...narratives, ceo_message_format: format })}
              onContentChange={(content) => setNarratives({ ...narratives, ceo_message_content: content })}
              onToneChange={(tone) => setNarratives({ ...narratives, tone_of_voice: tone })}
            />
          </TabsContent>

          <TabsContent value="materiality" className="space-y-6">
            <MaterialityMatrix
              ratings={narratives.materiality_ratings || []}
              onRatingsChange={(ratings) => setNarratives({ ...narratives, materiality_ratings: ratings })}
            />
          </TabsContent>

          <TabsContent value="strategy" className="space-y-6">
            <StrategyInput
              strategy={narratives.esg_strategy_oneliner || ''}
              onStrategyChange={(strategy) => setNarratives({ ...narratives, esg_strategy_oneliner: strategy })}
            />
            <ESGPillarsForm
              pillars={narratives.esg_pillars || []}
              onPillarsChange={(pillars) => setNarratives({ ...narratives, esg_pillars: pillars })}
            />
          </TabsContent>

          <TabsContent value="targets" className="space-y-6">
            <TargetsManager
              targets={narratives.targets || []}
              hasFormalTargets={narratives.has_formal_targets || false}
              onTargetsChange={(targets) => setNarratives({ ...narratives, targets })}
              onHasFormalTargetsChange={(has) => setNarratives({ ...narratives, has_formal_targets: has })}
            />
          </TabsContent>

          <TabsContent value="cases" className="space-y-6">
            <CaseStudiesBuilder
              reportId={reportId || ''}
              caseStudies={narratives.case_studies || []}
              onCaseStudiesChange={(studies) => setNarratives({ ...narratives, case_studies: studies })}
            />
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <MetricsInput
              metrics={metrics}
              onMetricsChange={setMetrics}
            />
          </TabsContent>
        </Tabs>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentTab === TABS[0].id}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentTab === TABS[TABS.length - 1].id ? (
            <Button
              onClick={handleComplete}
              disabled={completeness < 50}
              size="lg"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Complete & Generate Disclosure
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
