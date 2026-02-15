import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Leaf,
  Users,
  Building2,
  Download,
  AlertCircle,
  ChevronRight,
  BarChart3,
  Settings,
  LogOut,
  TrendingUp,
  FileText,
  FileJson,
  ClipboardCheck,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/layout/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCompany } from "@/hooks/use-company";
import { useActiveReport, useCreateReport } from "@/hooks/use-reports";
import { useDisclosureOutput } from "@/hooks/use-disclosure-outputs";
import { useUserProfile } from "@/hooks/use-user-profile";
import { TierBadge } from "@/components/tier/TierBadge";
import { LanguageToggle } from "@/components/layout/LanguageToggle";

const CATEGORIES = [
  {
    id: "environmental",
    name: "Environmental",
    icon: Leaf,
    color: "bg-emerald-500",
    textColor: "text-emerald-500",
    bgLight: "bg-emerald-50",
    linkPrefix: "/compliance/metrics", // Goes to Metrics
    query: "?category=environmental"
  },
  {
    id: "social",
    name: "Social",
    icon: Users,
    color: "bg-violet-500",
    textColor: "text-violet-500",
    bgLight: "bg-violet-50",
    linkPrefix: "/compliance/metrics", // Goes to Metrics
    query: "?category=social"
  },
  {
    id: "governance",
    name: "Governance",
    icon: Building2,
    color: "bg-primary",
    textColor: "text-primary",
    bgLight: "bg-primary/10",
    linkPrefix: "/compliance/narrative", // Goes to Narrative
    query: ""
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  // Real Data Hooks
  const { data: company, isLoading: companyLoading } = useCompany();
  const { data: report, isLoading: reportLoading } = useActiveReport();
  const { data: disclosure } = useDisclosureOutput(report?.id || ""); // Fetched disclosure data
  const { data: userProfile } = useUserProfile();
  const createReportMutation = useCreateReport();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleCreateReport = () => {
    createReportMutation.mutate(new Date().getFullYear(), {
      onSuccess: (data) => {
        // Navigate to questionnaire after report is created
        navigate(`/compliance/questionnaire/${data.id}`);
      }
    });
  };

  const handleExport = (format: string) => {
    if (!disclosure) {
      toast({
        title: "No disclosure found",
        description: "Please generate a disclosure before exporting.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      if (format === "json") {
        const blob = new Blob([JSON.stringify(disclosure, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `afaq-disclosure-${report?.reportingYear}-${report?.id}.json`;
        a.click();
        URL.revokeObjectURL(url);

        toast({
          title: "Export successful",
          description: "Your JSON report has been downloaded.",
        });
      } else {
        // Fallback for non-JSON for now
        toast({
          title: "Format not supported yet",
          description: "Currently only JSON export is fully supported.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Export error:", err);
      toast({
        title: "Export failed",
        description: "An error occurred while generating your export.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (companyLoading || reportLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  // Fallback if no company (shouldn't happen if guarded)
  if (!company) {
    return <div className="p-8">No company profile found. <Button onClick={() => navigate('/onboarding')}>Go to Onboarding</Button></div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Logo size="sm" />

          <div className="flex items-center gap-4">
            {report && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={isExporting}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport("json")}>
                    <FileJson className="w-4 h-4 mr-2" /> {/* Changed icon to FileJson */}
                    JSON Report {/* Changed text to JSON Report */}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <LanguageToggle />

            {userProfile && (
              <div onClick={() => navigate('/settings')} className="cursor-pointer">
                <TierBadge tier={userProfile.tier} />
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {company.name ? company.name.charAt(0).toUpperCase() : 'C'}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Report header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {report ? `${report.reportingYear} ESG Report` : 'Dashboard'}
            </h1>
            <p className="text-muted-foreground">
              {company.name} | {company.country} | {company.industry}
            </p>
          </div>
          {report && (
            <Badge variant="secondary" className="text-sm">
              <TrendingUp className="w-3 h-3 mr-1" />
              {report.status === 'draft' ? 'In Progress' : report.status}
            </Badge>
          )}
        </div>

        {!report ? (
          // Empty State
          <Card className="border-dashed border-2 p-8 text-center pt-12 pb-12">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <PlusCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Start Your ESG Journey</h2>
              <p className="text-muted-foreground max-w-md">
                Begin your {new Date().getFullYear()} compliance report. We'll guide you through data collection and disclosure generation.
              </p>
              <Button onClick={handleCreateReport} disabled={createReportMutation.isPending}>
                {createReportMutation.isPending ? "Creating..." : `Start ${new Date().getFullYear()} Report`}
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Overall progress card */}
            <Card className="mb-8 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                  {/* Progress circle */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          strokeLinecap="round"
                          className="text-primary"
                          strokeDasharray={`${report.overallCompletionPct * 3.52} 352`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">{Math.round(report.overallCompletionPct)}%</span>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground mt-2">Overall Progress</span>
                  </div>

                  <div className="flex-1 space-y-4">
                    <h3 className="text-lg font-semibold">Your ESG Action Plan</h3>
                    <p className="text-muted-foreground text-sm">
                      Complete the sections below to generate your disclosure.
                      Data inputs will be automatically mapped to your required frameworks.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className="h-auto p-4 justify-start text-left"
                        onClick={() => navigate(`/compliance/questionnaire/${report.id}`)}
                      >
                        <ClipboardCheck className="w-5 h-5 mr-3 text-blue-500" />
                        <div>
                          <div className="font-semibold">Compliance Questionnaire</div>
                          <div className="text-xs text-muted-foreground">Assess your gaps</div>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className="h-auto p-4 justify-start text-left"
                        onClick={() => navigate(`/compliance/disclosure/${report.id}`)}
                      >
                        <FileText className="w-5 h-5 mr-3 text-green-500" />
                        <div>
                          <div className="font-semibold">Generate Disclosure</div>
                          <div className="text-xs text-muted-foreground">AI-powered reporting</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {CATEGORIES.map((category) => (
                <Card
                  key={category.id}
                  className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
                  onClick={() => navigate(`${category.linkPrefix}/${report.id}${category.query || ''}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${category.bgLight}`}>
                        <category.icon className={`w-6 h-6 ${category.textColor}`} />
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>

                    <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Input evidence & metrics
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
