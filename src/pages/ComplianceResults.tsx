import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Logo } from '@/components/layout/Logo';
import { useAssessmentResult } from '@/hooks/use-assessment-results';
import { ScoreCard } from '@/components/assessment/ScoreCard';
import { GapsList } from '@/components/assessment/GapsList';
import { GapSummaryCards } from '@/components/assessment/GapSummaryCards';
import { GapSeverityChart } from '@/components/assessment/GapSeverityChart';
import { GapPillarChart } from '@/components/assessment/GapPillarChart';
import { RecommendationsList } from '@/components/assessment/RecommendationsList';
import { MethodologyPanel } from '@/components/assessment/MethodologyPanel';
import { UpgradePrompt } from '@/components/assessment/UpgradePrompt';
import { useUserProfile } from '@/hooks/use-user-profile';

export default function ComplianceResults() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const { data: assessment, isLoading, error } = useAssessmentResult(reportId || '');
  const { data: userProfile } = useUserProfile();
  const isFreeTier = userProfile?.tier === 'free' || !userProfile;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading assessment results...</p>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="flex items-center gap-3 text-destructive mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Assessment Not Found</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            No assessment results found for this report. Please complete the questionnaire first.
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
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Logo size="sm" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate(`/compliance/narrative/${reportId}`)}>
                <FileText className="w-4 h-4 mr-2" />
                Add company narrative
              </Button>
              <Button onClick={() => navigate(`/compliance/disclosure/${reportId}`)}>
                Continue to Disclosure
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Your Compliance Assessment Results</h1>
          <p className="text-muted-foreground">
            Based on your responses across {assessment.pillarScores.reduce((sum, p) => sum + p.totalQuestions, 0)} questions
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            <strong>Disclaimer:</strong> This assessment provides educational insights only and does not
            constitute legal or regulatory advice. Consult qualified professionals for compliance guidance.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Score Card */}
          <ScoreCard
            overallScore={assessment.overallScore}
            pillarScores={assessment.pillarScores}
            explanation={assessment.explanation}
          />

          {/* Gap Summary Cards */}
          <GapSummaryCards gaps={assessment.gaps} />

          {/* Gap Charts */}
          {assessment.gaps.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <GapSeverityChart gaps={assessment.gaps} />
              <GapPillarChart gaps={assessment.gaps} />
            </div>
          )}

          {/* Gaps and Recommendations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gaps */}
            <GapsList
              gaps={assessment.gaps}
              gapCount={assessment.gapCount}
              criticalGapCount={assessment.criticalGapCount}
            />

            {/* Recommendations */}
            <RecommendationsList recommendations={assessment.recommendations} />
          </div>

          {/* Methodology */}
          <MethodologyPanel explanation={assessment.explanation} />

          {/* Free Tier Trust Builder: Sample Report Preview */}
          {isFreeTier && (
            <Card className="p-6 border-2 border-dashed bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">See what a finished report looks like</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    View a public sample sustainability report with fictional data (no login or payment required).
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={() => window.open('/sample-report', '_blank')}>
                    <FileText className="w-4 h-4 mr-2" />
                    View Sample Report
                  </Button>

                  <Button asChild variant="default">
                    <a href="/sample-sustainability-report-redacted.pdf" download>
                      <FileText className="w-4 h-4 mr-2" />
                      Download Sample PDF
                    </a>
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Sample is watermarked and contains example-only content.
              </p>
            </Card>
          )}

          {/* Upgrade Prompt (Locked Disclosure Feature) */}
          <UpgradePrompt />
        </div>
      </div>
    </div>
  );
}
