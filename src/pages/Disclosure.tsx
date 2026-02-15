import { useState, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Download, FileJson, Edit3, RefreshCw, BarChart3, FileText, ShieldCheck, BookOpen, ClipboardList, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Logo } from '@/components/layout/Logo';
import { UpgradePrompt } from '@/components/assessment/UpgradePrompt';
import { useToast } from '@/hooks/use-toast';
import { useDisclosureOutput, useGenerateAndSaveDisclosure } from '@/hooks/use-disclosure-outputs';
import { useAssessmentResult } from '@/hooks/use-assessment-results';
import { useQuestionnaireResponse } from '@/hooks/use-questionnaire-response';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useReportNarrative } from '@/hooks/use-report-narratives';
import { useMetricData } from '@/hooks/use-metric-data';
import { buildDisclosurePack } from '@/lib/disclosure/orchestrator';
import { ExportPanel, type ExportFormat } from '@/components/disclosure/ExportPanel';
import { renderDisclosureToHtml, renderEvidenceAppendixToHtml } from '@/lib/disclosure/export-utils';
import { generatePdf, generatePdfFilename, generateReportPdfFilename } from '@/lib/disclosure/pdf-generator';
import { generateExcel, generateExcelFilename } from '@/lib/disclosure/excel-generator';
import { renderSustainabilityReportToHtml } from '@/lib/disclosure/export-utils';
import { ReportSection, DataAnnexTable, DisclosureIndex } from '@/components/report';
import { generateSustainabilityReport } from '@/lib/report/generate-report';
import { mapCountryToJurisdiction, mapIsListedToStatus } from '@/lib/utils/jurisdiction';
import type { MetricData } from '@/types/compliance';

// MOCK_COMPANY_PROFILE removed in favor of real company data from useCompany hook

import { useCompany } from '@/hooks/use-company';
import type { CompanyProfile } from '@/types/compliance';

const FRAMEWORK_OPTIONS = [
  { id: 'IFRS_S1', label: 'IFRS S1 (General)' },
  { id: 'IFRS_S2', label: 'IFRS S2 (Climate)' },
  { id: 'TCFD', label: 'TCFD' },
  { id: 'GRI', label: 'GRI Standards' },
  { id: 'LOCAL_UAE', label: 'UAE Regulations' },
  { id: 'LOCAL_KSA', label: 'KSA Regulations' },
  { id: 'LOCAL_QATAR', label: 'Qatar Regulations' },
];

export default function Disclosure() {
  const { reportId } = useParams<{ reportId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [languageView, setLanguageView] = useState<'en' | 'ar'>('en');
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(['IFRS_S1', 'IFRS_S2', 'TCFD']);
  const [activeView, setActiveView] = useState<'disclosure' | 'report'>('disclosure');

  const { data: company, isLoading: companyLoading } = useCompany();

  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const { data: existingDisclosure, isLoading: disclosureLoading } = useDisclosureOutput(reportId!);
  const { data: assessmentResult } = useAssessmentResult(reportId!);
  const { data: questionnaireResponse } = useQuestionnaireResponse(reportId!);
  const { data: narrative } = useReportNarrative(reportId!);
  const { data: metrics } = useMetricData(reportId!);
  const { generateAndSave } = useGenerateAndSaveDisclosure();

  // Check if user has paid tier access OR test mode is active
  const isTestMode = searchParams.get('test_pro') === 'true';
  const isPaidTier = userProfile?.tier === 'pro' || userProfile?.tier === 'enterprise' || isTestMode;

  // Generate sustainability report when disclosure and assessment are available
  const sustainabilityReport = useMemo(() => {
    if (!existingDisclosure || !assessmentResult || !company) return null;

    // Convert metrics to the format expected by the report generator
    const metricsForReport: MetricData[] = (metrics || []).map(m => ({
      metricCode: m.metricCode,
      category: m.category as 'environmental' | 'social' | 'governance',
      valueNumeric: m.valueNumeric ?? null,
      valueText: m.valueText ?? null,
      valueBoolean: m.valueBoolean ?? null,
      unit: m.unit || null,
    }));

    return generateSustainabilityReport({
      disclosure: existingDisclosure,
      assessment: assessmentResult,
      companyName: company.name,
      companyNameArabic: company.nameArabic || undefined,
      reportingYear: new Date().getFullYear(),
      metrics: metricsForReport,
    });
  }, [existingDisclosure, assessmentResult, company, metrics]);

  const handleGenerate = async () => {
    if (!questionnaireResponse || !company) {
      toast({
        title: 'Missing Information',
        description: 'Please ensure your company profile is complete and questionnaire is saved.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Map database company to CompanyProfile type
      const companyProfile: CompanyProfile = {
        companyId: company.id,
        companyName: company.name,
        companyNameArabic: company.nameArabic || company.name,
        jurisdiction: mapCountryToJurisdiction(company.country),
        listingStatus: mapIsListedToStatus(company.isListed),
        stockExchange: company.stockExchange || '',
        sector: company.industry,
        subsector: '',
        employeeCountBand: '51-250', // Simplified mapping for now
        annualRevenueBand: '10M-50M', // Simplified mapping for now
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

      // Build Disclosure Pack
      // Convert ReportNarrative to NarrativeInput (Record<string, unknown>)
      const narrativeInput = narrative ? {
        governanceText: narrative.governanceText,
        esgText: narrative.esgText,
        riskText: narrative.riskText,
        transparencyText: narrative.transparencyText,
      } : null;

      // Convert hook MetricData to compliance MetricData format
      const metricsForDisclosure = (metrics || []).map(m => ({
        id: m.id || '',
        report_id: m.reportId,
        metric_code: m.metricCode,
        category: m.category as 'environmental' | 'social' | 'governance',
        value_numeric: m.valueNumeric ?? null,
        value_text: m.valueText ?? null,
        value_boolean: m.valueBoolean ?? null,
        unit: m.unit || null,
        data_tier: (m.dataTier || 1) as 1 | 2 | 3 | 4,
        data_source: (m.dataSource || 'manual_entry') as 'utility_bill' | 'manual_entry' | 'calculated' | 'benchmark' | 'hr_records' | 'financial_records' | 'policy_review' | null,
        confidence_level: 'medium' as 'high' | 'medium' | 'low' | null,
        calculation_method: null,
        calculation_inputs: null,
        emission_factor_used: null,
        emission_factor_source: null,
        notes: m.notes || null,
        supporting_doc_url: null,
        entered_by: null,
        verified_by: null,
        verified_at: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      const disclosurePack = buildDisclosurePack({
        company: companyProfile,
        selectedFrameworks,
        assessmentResult: assessmentResult || null,
        narrative: narrativeInput,
        metrics: metricsForDisclosure,
      });

      await generateAndSave({
        reportId: reportId!,
        disclosurePack,
        onProgress: (progress) => setGenerationProgress(progress),
      });

      toast({
        title: 'Disclosure Generated',
        description: 'Your grounded disclosure document has been created successfully.',
      });
    } catch (error: unknown) {
      console.error('Generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      if (errorMessage === 'TIER_INSUFFICIENT') {
        toast({
          title: 'Upgrade Required',
          description: 'Disclosure generation requires a Pro or Enterprise subscription.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Generation Failed',
          description: errorMessage || 'Failed to generate disclosure. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format: ExportFormat) => {
    if (!existingDisclosure) return;

    // Handle PDF export separately
    if (format === 'pdf') {
      setIsPdfGenerating(true);
      try {
        const html = renderDisclosureToHtml(existingDisclosure, languageView);
        const filename = generatePdfFilename(
          existingDisclosure.generatedForCompany || company?.name || 'company',
          existingDisclosure.templateVersion || '2024',
          languageView
        );
        await generatePdf(html, {
          filename,
          isRtl: languageView === 'ar',
        });
        toast({
          title: 'PDF Generated',
          description: 'Your disclosure report has been downloaded as PDF.',
        });
      } catch (error) {
        console.error('PDF generation error:', error);
        toast({
          title: 'PDF Generation Failed',
          description: 'Failed to generate PDF. Please try the HTML export instead.',
          variant: 'destructive',
        });
      } finally {
        setIsPdfGenerating(false);
      }
      return;
    }

    // Handle Excel export
    if (format === 'excel') {
      try {
        const filename = generateExcelFilename(
          existingDisclosure.generatedForCompany || company?.name || 'company',
          existingDisclosure.templateVersion || '2024'
        );

        // Prepare metrics data for Excel
        const metricsForExcel = (metrics || []).map(m => ({
          metricCode: m.metricCode,
          category: m.category,
          valueNumeric: m.valueNumeric,
          valueText: m.valueText,
          valueBoolean: m.valueBoolean,
          unit: m.unit,
        }));

        // Prepare gaps data from assessment
        const gapsForExcel = assessmentResult?.gaps?.map(g => ({
          id: g.id,
          pillar: g.pillar,
          title: g.title,
          description: g.description,
          severity: g.severity,
        })) || [];

        // Prepare scores
        const scoresForExcel = assessmentResult?.scores?.map(s => ({
          pillar: s.pillar,
          score: s.score,
        })) || [];

        generateExcel({
          disclosure: existingDisclosure,
          metrics: metricsForExcel,
          gaps: gapsForExcel,
          scores: scoresForExcel,
        }, filename);

        toast({
          title: 'Excel Generated',
          description: 'Your ESG data has been downloaded as Excel.',
        });
      } catch (error) {
        console.error('Excel generation error:', error);
        toast({
          title: 'Excel Generation Failed',
          description: 'Failed to generate Excel file.',
          variant: 'destructive',
        });
      }
      return;
    }

    let content = '';
    let mimeType = '';
    let fileName = '';

    if (format === 'html') {
      content = renderDisclosureToHtml(existingDisclosure, languageView);
      mimeType = 'text/html';
      fileName = `disclosure-${reportId}-${languageView}.html`;
    } else if (format === 'appendix') {
      // Convert narrative to Record<string, string> for appendix rendering
      const narrativeTexts: Record<string, string> = narrative ? {
        governanceText: narrative.governanceText || '',
        esgText: narrative.esgText || '',
        riskText: narrative.riskText || '',
        transparencyText: narrative.transparencyText || '',
      } : {};
      content = renderEvidenceAppendixToHtml(existingDisclosure, metrics || [], narrativeTexts, languageView);
      mimeType = 'text/html';
      fileName = `appendix-${reportId}-${languageView}.html`;
    } else if (format === 'json') {
      content = JSON.stringify(existingDisclosure, null, 2);
      mimeType = 'application/json';
      fileName = `disclosure-${reportId}.json`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Successful',
      description: `${format.toUpperCase()} file has been downloaded.`,
    });
  };

  const handleExportReport = async () => {
    if (!sustainabilityReport) return;

    setIsPdfGenerating(true);
    try {
      const html = renderSustainabilityReportToHtml(sustainabilityReport, languageView);
      const filename = generateReportPdfFilename(
        sustainabilityReport.companyName,
        sustainabilityReport.reportingYear,
        languageView
      );
      await generatePdf(html, {
        filename,
        isRtl: languageView === 'ar',
      });
      toast({
        title: 'Report PDF Generated',
        description: 'Your sustainability report has been downloaded as PDF.',
      });
    } catch (error) {
      console.error('Report PDF generation error:', error);
      toast({
        title: 'PDF Generation Failed',
        description: 'Failed to generate report PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsPdfGenerating(false);
    }
  };

  if (disclosureLoading || profileLoading || companyLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="flex items-center gap-3 text-destructive mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Company Profile Not Found</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Please complete your company profile to generate a disclosure report.
          </p>
          <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate(`/compliance/results/${reportId}`)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Results
              </Button>
              <Logo size="sm" />
            </div>
            <div className="flex items-center gap-4">
              {existingDisclosure && (
                <>
                  <div className="flex items-center gap-2 border rounded-lg p-1">
                    <Button
                      variant={languageView === 'en' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setLanguageView('en')}
                    >
                      English
                    </Button>
                    <Button
                      variant={languageView === 'ar' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setLanguageView('ar')}
                    >
                      العربية
                    </Button>
                  </div>
                  <Button variant="outline" onClick={() => navigate(`/compliance/narrative/${reportId}`)}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Narratives
                  </Button>
                  <Button variant="outline" onClick={() => navigate(`/compliance/metrics/${reportId}`)}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Metrics
                  </Button>
                  <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                    {isGenerating ? 'Regenerate' : 'Regenerate'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-center sm:text-left">
            <h1 className="text-3xl font-bold">Disclosure Document</h1>
            <p className="text-muted-foreground mt-2">
              Stakeholder-ready ESG narratives grounded in verifiable evidence
            </p>
          </div>

          {/* Free Tier - Show Upgrade Prompt */}
          {!isPaidTier && <UpgradePrompt />}

          {/* Paid Tier - Show Generate or Display */}
          {isPaidTier && (
            <>
              {!existingDisclosure ? (
                <Card className="p-8 text-center border-dashed border-2 bg-white/50">
                  <div className="bg-primary/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold mb-4">Draft New Disclosure</h2>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Combine your assessment scores, qualitative narratives, and quantitative metrics into a single auditor-friendly package.
                  </p>

                  <div className="text-left max-w-md mx-auto mb-8 bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-slate-500">
                      <ShieldCheck className="w-4 h-4" /> Recommended Frameworks
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {FRAMEWORK_OPTIONS.map((fw) => (
                        <div key={fw.id} className="flex items-start space-x-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer" onClick={() => {
                          if (selectedFrameworks.includes(fw.id)) setSelectedFrameworks(selectedFrameworks.filter(id => id !== fw.id));
                          else setSelectedFrameworks([...selectedFrameworks, fw.id]);
                        }}>
                          <Checkbox
                            id={fw.id}
                            checked={selectedFrameworks.includes(fw.id)}
                            onCheckedChange={(checked) => {
                              if (checked) setSelectedFrameworks([...selectedFrameworks, fw.id]);
                              else setSelectedFrameworks(selectedFrameworks.filter(id => id !== fw.id));
                            }}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor={fw.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {fw.label}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button onClick={handleGenerate} disabled={isGenerating} size="lg" className="w-full px-12 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                          Analyzing Evidence...
                        </>
                      ) : (
                        'Generate Disclosure Report'
                      )}
                    </Button>
                    {isGenerating && (
                      <div className="space-y-2">
                        <Progress value={generationProgress} className="h-2" />
                        <p className="text-sm text-center text-muted-foreground">
                          {generationProgress}% complete
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ) : (
                <Tabs value={activeView} onValueChange={(v) => setActiveView(v as 'disclosure' | 'report')} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="disclosure" className="flex items-center gap-2">
                      <ClipboardList className="w-4 h-4" />
                      Disclosure View
                    </TabsTrigger>
                    <TabsTrigger value="report" className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Full Report
                    </TabsTrigger>
                  </TabsList>

                  {/* Disclosure View Tab */}
                  <TabsContent value="disclosure" className="space-y-8 animate-in fade-in duration-500">
                    {/* Export Panel - NEW T-017/T-020 */}
                    <ExportPanel
                      disclosure={existingDisclosure}
                      isGenerating={isGenerating}
                      isPdfGenerating={isPdfGenerating}
                      onDownload={handleExport}
                    />

                    {/* Quality Checklist */}
                    {existingDisclosure.qualityChecklist && existingDisclosure.qualityChecklist.length > 0 && (
                      <Card className="p-6">
                        <h3 className="font-semibold mb-4">Quality Checklist</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {existingDisclosure.qualityChecklist.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                              <div>
                                <div className="font-medium text-sm">
                                  {languageView === 'en' ? item.label : item.labelArabic}
                                </div>
                                {item.count !== undefined && (
                                  <div className="text-xs text-muted-foreground">Count: {item.count}</div>
                                )}
                              </div>
                              <div
                                className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'pass'
                                  ? 'bg-green-100 text-green-700'
                                  : item.status === 'warning'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                  }`}
                              >
                                {item.status?.toUpperCase() || 'N/A'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}

                    {/* Sections */}
                    {existingDisclosure.sections.map((section) => (
                      <Card key={section.id} className="p-6">
                        <h3 className="text-xl font-semibold mb-4">
                          {languageView === 'en' ? section.title : section.titleArabic}
                        </h3>
                        <div
                          className={`prose max-w-none mb-4 ${languageView === 'ar' ? 'text-right' : ''}`}
                          style={languageView === 'ar' ? { direction: 'rtl' } : {}}
                        >
                          <p className="whitespace-pre-wrap">
                            {languageView === 'en' ? section.narrative : section.narrativeArabic}
                          </p>
                        </div>

                        {/* Data Points */}
                        {section.dataPoints && section.dataPoints.length > 0 && (
                          <div className="mt-4 border-t pt-4">
                            <h4 className="font-medium text-sm mb-2">Key Data Points</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {section.dataPoints.map((dp, idx) => (
                                <div key={idx} className="text-sm">
                                  <span className="text-muted-foreground">
                                    {languageView === 'en' ? dp.label : dp.labelArabic || dp.label}:
                                  </span>{' '}
                                  <span className="font-medium">{dp.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Citation Placeholders */}
                        {section.citationPlaceholders && section.citationPlaceholders.length > 0 && (
                          <div className="mt-4 border-t pt-4 bg-yellow-50 p-3 rounded">
                            <h4 className="font-medium text-sm mb-2 text-yellow-800">
                              ⚠️ Citations Require Verification
                            </h4>
                            <ul className="text-xs text-yellow-700 space-y-1">
                              {section.citationPlaceholders.map((cit, idx) => (
                                <li key={idx}>{cit}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </Card>
                    ))}

                    {/* Disclaimers */}
                    <Card className="p-6 bg-gray-50">
                      <h3 className="font-semibold mb-4">Disclaimers</h3>
                      <div className="space-y-3">
                        {existingDisclosure.disclaimers.map((disclaimer, idx) => (
                          <div key={idx} className="text-sm">
                            <div className="font-medium text-xs uppercase text-muted-foreground mb-1">
                              {disclaimer.type}
                            </div>
                            <p className={languageView === 'ar' ? 'text-right' : ''}>
                              {languageView === 'en' ? disclaimer.text : disclaimer.textArabic}
                            </p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </TabsContent>

                  {/* Full Report Tab */}
                  <TabsContent value="report" className="space-y-8 animate-in fade-in duration-500">
                    {sustainabilityReport ? (
                      <>
                        {/* Report Header */}
                        <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <h2 className="text-2xl font-bold">{sustainabilityReport.companyName}</h2>
                              {sustainabilityReport.companyNameArabic && (
                                <p className="text-lg text-muted-foreground" dir="rtl">
                                  {sustainabilityReport.companyNameArabic}
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground mt-2">
                                Sustainability Report {sustainabilityReport.reportingYear} • {sustainabilityReport.jurisdiction}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-bold text-primary">
                                {assessmentResult?.overallScore || 0}%
                              </div>
                              <div className="text-sm text-muted-foreground">Overall ESG Score</div>
                              <Button
                                onClick={handleExportReport}
                                disabled={isPdfGenerating}
                                className="mt-3"
                                size="sm"
                              >
                                <Download className={`w-4 h-4 mr-2 ${isPdfGenerating ? 'animate-pulse' : ''}`} />
                                {isPdfGenerating ? 'Generating...' : 'Download PDF'}
                              </Button>
                            </div>
                          </div>
                        </Card>

                        {/* Report Sections */}
                        {sustainabilityReport.sections.map((section) => (
                          <ReportSection key={section.type} section={section} />
                        ))}

                        {/* Disclosure Index */}
                        <DisclosureIndex
                          disclosures={sustainabilityReport.sections.flatMap(s => s.disclosures)}
                          totalDisclosures={sustainabilityReport.totalDisclosures}
                          addressedDisclosures={sustainabilityReport.addressedDisclosures}
                          partialDisclosures={sustainabilityReport.partialDisclosures}
                          omittedDisclosures={sustainabilityReport.omittedDisclosures}
                        />

                        {/* Data Annex */}
                        <DataAnnexTable
                          data={sustainabilityReport.dataAnnex}
                          title="Data Annex - Quantitative Disclosures"
                        />

                        {/* Report Footer */}
                        <Card className="p-6 bg-gray-50">
                          <div className="text-center text-sm text-muted-foreground">
                            <p>
                              Generated on {new Date(sustainabilityReport.generatedAt).toLocaleDateString()} •
                              Template Version {sustainabilityReport.templateVersion} •
                              Status: <span className="font-medium capitalize">{sustainabilityReport.status}</span>
                            </p>
                            <p className="mt-2">
                              This report was prepared using the AFAQ ESG Platform in accordance with
                              {sustainabilityReport.jurisdiction === 'UAE' && ' ADX ESG Disclosure Guidelines'}
                              {sustainabilityReport.jurisdiction === 'KSA' && ' Tadawul ESG Disclosure Guidelines'}
                              {sustainabilityReport.jurisdiction === 'Qatar' && ' QSE Sustainability Reporting Guidelines'}
                            </p>
                          </div>
                        </Card>
                      </>
                    ) : (
                      <Card className="p-8 text-center">
                        <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Report Not Available</h3>
                        <p className="text-muted-foreground">
                          Complete your assessment to generate a full sustainability report.
                        </p>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
