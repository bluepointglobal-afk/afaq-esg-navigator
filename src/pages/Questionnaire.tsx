import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/layout/Logo";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { buildQuestionnaireTemplate, getTotalQuestionCount } from "@/lib/questionnaire/builder";
import { useCreateTemplate, useQuestionnaireTemplate } from "@/hooks/use-questionnaire-template";
import { useQuestionnaireResponse, calculateCompletion } from "@/hooks/use-questionnaire-response";
import { useCreateAssessment } from "@/hooks/use-assessment-results";
import { runAssessment } from "@/lib/assessment";
import { QuestionnaireNav } from "@/components/compliance/QuestionnaireNav";
import { QuestionSection } from "@/components/compliance/QuestionSection";
import { ProgressTracker } from "@/components/compliance/ProgressTracker";
import { useCompany } from "@/hooks/use-company";
import { mapCountryToJurisdiction, mapIsListedToStatus } from "@/lib/utils/jurisdiction";
import type { CompanyProfile, QuestionAnswer, QuestionnaireResponse } from "@/types/compliance";

export default function Questionnaire() {
  const { reportId = "MOCK_REPORT_ID" } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | 'idle'>('idle');
  const [template, setTemplate] = useState<ReturnType<typeof buildQuestionnaireTemplate> | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [localResponseId, setLocalResponseId] = useState<string | null>(null);

  // Refs to prevent infinite loops
  const initializationAttempted = useRef(false);
  const lastSavedAnswers = useRef<string>('{}');

  const { data: company, isLoading: companyLoading } = useCompany();
  const { data: existingTemplate } = useQuestionnaireTemplate(company?.country || 'UAE');
  const createTemplate = useCreateTemplate();
  const { data: response, isLoading: responseLoading, refetch: refetchResponse } = useQuestionnaireResponse(reportId);
  const createAssessment = useCreateAssessment();

  const { watch, setValue, getValues } = useForm<{ answers: Record<string, QuestionAnswer> }>({
    defaultValues: { answers: {} },
  });

  const rawAnswers = watch('answers');
  const answers = useMemo(() => rawAnswers || {}, [rawAnswers]);

  // Form profile from company data
  const companyProfile: CompanyProfile | null = useMemo(() => {
    if (!company) return null;
    
    const profile = {
      companyId: company.id,
      companyName: company.name,
      companyNameArabic: company.nameArabic || company.name,
      jurisdiction: mapCountryToJurisdiction(company.country),
      listingStatus: mapIsListedToStatus(company.isListed),
      stockExchange: company.stockExchange || '',
      sector: company.industry,
      subsector: '',
      employeeCountBand: '1-50',
      annualRevenueBand: '1M-10M',
      revenueCurrency: company.revenueCurrency,
      operationalYears: 1,
      hasInternationalOps: false,
      hasCriticalInfrastructure: false,
      hasFullTimeEmployees: true,
      hasContractors: false,
      hasRemoteWorkforce: false,
      fiscalYearEnd: 12,
      reportingYear: 2024,
    };
    
    console.log('🏢 [CompanyProfile]:', {
      companyCountry: company.country,
      profileJurisdiction: profile.jurisdiction,
      profileListingStatus: profile.listingStatus,
    });
    
    return profile;
  }, [company]);

  // Generate or load template - only run once
  useEffect(() => {
    if (template) return; // Already have template

    if (existingTemplate) {
      console.log('📄 Loading existing template:', existingTemplate);
      setTemplate(existingTemplate);
    } else if (companyProfile && !createTemplate.isPending) {
      console.log('🏗️ Generating new template for:', companyProfile);
      const generated = buildQuestionnaireTemplate(companyProfile);
      console.log('✅ Generated template with sections:', generated.sections.length);
      
      if (generated.sections.length === 0) {
        console.error('❌ Template has 0 sections! Check filtering logic.');
        console.error('   Jurisdiction:', companyProfile.jurisdiction);
        console.error('   Listing Status:', companyProfile.listingStatus);
      }
      
      setTemplate(generated);
      createTemplate.mutate(generated);
    }
  }, [existingTemplate, companyProfile, template, createTemplate]);

  // Initialize questionnaire response if it doesn't exist - only attempt once
  useEffect(() => {
    const initializeResponse = async () => {
      if (!template || !company || initializationAttempted.current || response || responseLoading) {
        return;
      }

      initializationAttempted.current = true;
      setIsInitializing(true);

      try {
        // First check if response already exists
        const { data: existingResponse } = await supabase
          .from('questionnaire_responses')
          .select('id')
          .eq('report_id', reportId)
          .maybeSingle();

        if (existingResponse) {
          setLocalResponseId(existingResponse.id);
          await refetchResponse();
          setIsInitializing(false);
          return;
        }

        // Check if report exists, if not create it
        const { data: existingReport } = await supabase
          .from('reports')
          .select('id')
          .eq('id', reportId)
          .maybeSingle();

        if (!existingReport && reportId !== "MOCK_REPORT_ID") {
          await supabase.from('reports').insert({
            id: reportId,
            company_id: company.id,
            reporting_year: new Date().getFullYear(),
            status: 'in_progress',
          });
        }

        // Create the questionnaire response
        const { data: newResponse, error } = await supabase
          .from('questionnaire_responses')
          .insert({
            report_id: reportId,
            template_id: template.id,
            template_version: template.version,
            answers: {},
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating response:', error);
          toast({
            title: "Error",
            description: "Failed to initialize questionnaire. Please refresh.",
            variant: "destructive",
          });
        } else if (newResponse) {
          setLocalResponseId(newResponse.id);
          await refetchResponse();
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    if (template && !response && !responseLoading && reportId !== "MOCK_REPORT_ID" && !initializationAttempted.current) {
      initializeResponse();
    }
  }, [template, response, responseLoading, reportId, company, refetchResponse, toast]);

  // Load saved answers when response is available - only once
  useEffect(() => {
    if (response?.answers && Object.keys(response.answers).length > 0) {
      const savedAnswersStr = JSON.stringify(response.answers);
      if (savedAnswersStr !== lastSavedAnswers.current) {
        console.log('Loading saved answers:', Object.keys(response.answers).length);
        lastSavedAnswers.current = savedAnswersStr;
        setValue('answers', response.answers);
      }
    }
  }, [response, setValue]);

  // Update local response ID when response loads
  useEffect(() => {
    if (response?.id && !localResponseId) {
      setLocalResponseId(response.id);
    }
  }, [response, localResponseId]);

  // Auto-save with debounce - use stable comparison
  useEffect(() => {
    const responseId = response?.id || localResponseId;
    if (!responseId) return;

    const currentAnswersStr = JSON.stringify(answers);
    if (currentAnswersStr === '{}' || currentAnswersStr === lastSavedAnswers.current) {
      return;
    }

    const timer = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        const { error } = await supabase
          .from('questionnaire_responses')
          .update({
            answers: answers as unknown as never,
            updated_at: new Date().toISOString(),
          })
          .eq('id', responseId);

        if (error) {
          console.error('Save error:', error);
          setSaveStatus('error');
        } else {
          lastSavedAnswers.current = currentAnswersStr;
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
        }
      } catch (err) {
        console.error('Save error:', err);
        setSaveStatus('error');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [answers, response?.id, localResponseId]);

  // Check if company profile exists
  if (!companyLoading && !company) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 p-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <h2 className="text-xl font-semibold">Company Profile Required</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Please complete your company profile before starting the questionnaire.
        </p>
        <Button onClick={() => navigate('/onboarding')}>
          Complete Profile
        </Button>
      </div>
    );
  }

  if (!template || companyLoading || !template.sections || template.sections.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Loading questionnaire...</div>;
  }

  if (responseLoading || isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Initializing questionnaire...</p>
      </div>
    );
  }

  const totalQuestions = getTotalQuestionCount(template);
  const completion = calculateCompletion(answers, totalQuestions);

  const handleSaveNow = async () => {
    const responseId = response?.id || localResponseId;
    if (!responseId) {
      toast({
        title: "Cannot save",
        description: "Questionnaire not initialized. Please refresh.",
        variant: "destructive",
      });
      return;
    }

    setSaveStatus('saving');
    try {
      const currentAnswers = getValues('answers');
      const { error } = await supabase
        .from('questionnaire_responses')
        .update({
          answers: currentAnswers as unknown as never,
          updated_at: new Date().toISOString(),
        })
        .eq('id', responseId);

      if (error) throw error;

      lastSavedAnswers.current = JSON.stringify(currentAnswers);
      setSaveStatus('saved');
      toast({
        title: "Saved",
        description: "Your progress has been saved.",
      });
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Manual save error:', err);
      setSaveStatus('error');
      toast({
        title: "Save failed",
        description: "Could not save your progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewResults = async () => {
    if (!template || !companyProfile) {
      toast({
        title: "Error",
        description: "Missing template or company profile.",
        variant: "destructive",
      });
      return;
    }

    const responseId = response?.id || localResponseId;
    if (!responseId) {
      toast({
        title: "Error",
        description: "Questionnaire not saved. Please save first.",
        variant: "destructive",
      });
      return;
    }

    // First save current answers
    await handleSaveNow();

    try {
      // Build the response object for assessment
      const currentResponse: QuestionnaireResponse = {
        id: responseId,
        reportId: reportId,
        templateId: template.id,
        templateVersion: template.version,
        answers: answers,
        completedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const assessmentResult = runAssessment(template, currentResponse, companyProfile, reportId);
      await createAssessment.mutateAsync(assessmentResult);

      toast({
        title: "Assessment complete!",
        description: "Your results are ready.",
      });

      navigate(`/compliance/results/${reportId}`);
    } catch (error) {
      console.error('Assessment generation failed:', error);
      toast({
        title: "Assessment failed",
        description: "Could not generate assessment results. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Logo size="sm" />
            </div>
            <div className="flex items-center gap-4">
              {/* Save Button */}
              <Button variant="outline" onClick={handleSaveNow} disabled={saveStatus === 'saving'}>
                {saveStatus === 'saving' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Progress'
                )}
              </Button>

              {/* View Results - show when >= 30% complete */}
              {completion >= 30 && (
                <Button onClick={handleViewResults} disabled={createAssessment.isPending}>
                  {createAssessment.isPending ? 'Generating...' : 'View Results'}
                </Button>
              )}

              {saveStatus === 'saved' && (
                <span className="text-sm text-green-600 flex items-center gap-1 animate-in fade-in">
                  <CheckCircle className="w-4 h-4" />
                  Saved
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Save failed
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Company Context */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="font-medium text-primary">{company?.name}</span>
              <span className="mx-2 text-slate-300">•</span>
              <span>{company?.country}</span>
              <span className="mx-2 text-slate-300">•</span>
              <span className="capitalize">{company?.industry}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <ProgressTracker
            completion={completion}
            answeredCount={Object.keys(answers).length}
            totalCount={totalQuestions}
            sections={template.sections}
            answers={answers}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Navigation */}
          <div className="md:col-span-3">
            <Card className="sticky top-6 border-slate-200/60 shadow-sm">
              <QuestionnaireNav
                sections={template.sections}
                currentSection={currentSection}
                onSectionChange={setCurrentSection}
                answers={answers}
              />
            </Card>
          </div>

          {/* Questions */}
          <div className="md:col-span-9">
            {template.sections[currentSection] && (
            <QuestionSection
              section={template.sections[currentSection]}
              answers={answers}
              onAnswerChange={(questionId, value, evidenceUrls, notes) => {
                const newAnswer: QuestionAnswer = {
                  questionId,
                  value,
                  evidenceUrls,
                  notes,
                  answeredAt: new Date().toISOString(),
                  answeredBy: 'current-user-id',
                };
                setValue(`answers.${questionId}`, newAnswer);
              }}
              allAnswers={answers}
            />
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentSection(Math.max(0, currentSection - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentSection === 0}
              >
                Previous Section
              </Button>
              <Button
                onClick={() => {
                  setCurrentSection(Math.min(template.sections.length - 1, currentSection + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentSection === template.sections.length - 1}
              >
                Next Section
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
