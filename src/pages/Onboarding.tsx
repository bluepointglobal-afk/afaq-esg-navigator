import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Building2, Users, FileCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/layout/Logo";
import { Progress } from "@/components/ui/progress";
import { COUNTRIES, INDUSTRIES, STOCK_EXCHANGES, type Country, type Industry, type OnboardingData, type StockExchange } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useCreateCompany } from "@/hooks/use-company";

const steps = [
  { id: 1, title: "Company Profile", icon: Building2 },
  { id: 2, title: "Company Size", icon: Users },
  { id: 3, title: "Data Availability", icon: FileCheck },
  { id: 4, title: "Your Frameworks", icon: CheckCircle2 },
];

function detectFrameworks(data: OnboardingData): string[] {
  const frameworks: string[] = ["GCC_UNIFIED_29"];

  if (!data.country) return frameworks;

  switch (data.country) {
    case "UAE":
      frameworks.push("UAE_SCA_ESG");
      if ((data.employeeCount && data.employeeCount > 50) || (data.annualRevenue && data.annualRevenue > 10000000)) {
        frameworks.push("UAE_FEDERAL_GHG");
      }
      if (data.stockExchange === "ADX") frameworks.push("ADX_ESG");
      if (data.stockExchange === "DFM") frameworks.push("DFM_ESG");
      break;
    case "KSA":
      frameworks.push("TADAWUL_ESG");
      frameworks.push("VISION_2030_KPI");
      if (data.industry && ["Energy", "Financials"].includes(data.industry)) {
        frameworks.push("SAMA_ESG");
      }
      break;
    case "Qatar":
      frameworks.push("QSE_34_KPI");
      frameworks.push("QNV_2030");
      break;
    case "Bahrain":
      frameworks.push("CBB_ESG");
      frameworks.push("BHB_32_KPI");
      break;
    case "Kuwait":
      frameworks.push("BOURSA_ESG_GUIDE");
      break;
    case "Oman":
      frameworks.push("MSX_30_METRICS");
      frameworks.push("VISION_2040");
      break;
  }

  if (data.isListed) {
    frameworks.push("GRI_CORE");
  }

  return frameworks;
}

const frameworkNames: Record<string, { name: string; description: string }> = {
  GCC_UNIFIED_29: { name: "GCC Unified ESG Metrics", description: "29 standardized metrics across all GCC exchanges" },
  UAE_SCA_ESG: { name: "UAE SCA ESG Guidance", description: "Securities & Commodities Authority ESG framework" },
  UAE_FEDERAL_GHG: { name: "UAE Federal GHG Decree", description: "Federal Decree-Law No. 11/2024 requirements" },
  ADX_ESG: { name: "ADX ESG Disclosure Guide", description: "Abu Dhabi Securities Exchange requirements" },
  DFM_ESG: { name: "DFM ESG Reporting", description: "Dubai Financial Market disclosure requirements" },
  TADAWUL_ESG: { name: "Tadawul ESG Guidelines", description: "Saudi Stock Exchange ESG disclosure requirements" },
  VISION_2030_KPI: { name: "Vision 2030 KPIs", description: "Saudi Vision 2030 sustainability indicators" },
  SAMA_ESG: { name: "SAMA ESG Guidelines", description: "Saudi Central Bank ESG requirements for financials" },
  QSE_34_KPI: { name: "QSE 34 KPIs", description: "Qatar Stock Exchange sustainability metrics" },
  QNV_2030: { name: "Qatar National Vision 2030", description: "National sustainability framework" },
  CBB_ESG: { name: "CBB ESG Module", description: "Central Bank of Bahrain ESG requirements" },
  BHB_32_KPI: { name: "BHB 32 KPIs", description: "Bahrain Bourse disclosure requirements" },
  BOURSA_ESG_GUIDE: { name: "Boursa Kuwait ESG Guide", description: "Kuwait Stock Exchange sustainability framework" },
  MSX_30_METRICS: { name: "MSX 30 Metrics", description: "Muscat Securities Market ESG indicators" },
  VISION_2040: { name: "Oman Vision 2040", description: "National sustainability objectives" },
  GRI_CORE: { name: "GRI Core", description: "Global Reporting Initiative core standards" },
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createCompanyMutation = useCreateCompany();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    companyName: "",
    companyNameArabic: "",
    country: null,
    industry: null,
    employeeCount: null,
    annualRevenue: null,
    revenueCurrency: "USD",
    isListed: false,
    stockExchange: null,
    hasUtilityBills: false,
    hasFuelReceipts: false,
    hasWasteRecords: false,
    hasEmployeeCount: false,
    hasHRSystem: false,
    hasTrainingRecords: false,
    hasFinancialStatements: false,
    hasExpenseBreakdown: false,
    hasPolicies: false,
    hasGovernanceDocs: false,
    detectedFrameworks: [],
  });

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep === 3) {
      const frameworks = detectFrameworks(data);
      setData({ ...data, detectedFrameworks: frameworks });
    }
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final Step: Submit Data
      createCompanyMutation.mutate({
        name: data.companyName,
        nameArabic: data.companyNameArabic,
        country: data.country!,
        industry: data.industry!,
        employeeCount: data.employeeCount || 0,
        annualRevenue: data.annualRevenue || 0,
        revenueCurrency: data.revenueCurrency,
        isListed: data.isListed,
        stockExchange: data.stockExchange || undefined,
      });
      // Navigation happens in onSuccess of hook
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.companyName && data.country && data.industry;
      case 2:
        return data.employeeCount !== null;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center gap-2 ${step.id === currentStep
                  ? "text-primary"
                  : step.id < currentStep
                    ? "text-secondary"
                    : "text-muted-foreground"
                  }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${step.id === currentStep
                    ? "bg-primary text-primary-foreground"
                    : step.id < currentStep
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <Card className="border-0 shadow-xl">
          {currentStep === 1 && (
            <>
              <CardHeader>
                <CardTitle>Tell us about your company</CardTitle>
                <CardDescription>
                  We'll use this information to determine which ESG frameworks apply to you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter your company name"
                    value={data.companyName}
                    onChange={(e) => setData({ ...data, companyName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyNameArabic">الاسم بالعربية (Arabic Name)</Label>
                  <Input
                    id="companyNameArabic"
                    placeholder="أدخل اسم الشركة بالعربية"
                    dir="rtl"
                    className="font-arabic"
                    value={data.companyNameArabic}
                    onChange={(e) => setData({ ...data, companyNameArabic: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Country *</Label>
                  <Select
                    value={data.country || ""}
                    onValueChange={(value) => setData({ ...data, country: value as Country, stockExchange: null })}
                  >
                    <SelectTrigger data-testid="country-select">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(COUNTRIES).map(([code, { name, flag }]) => (
                        <SelectItem key={code} value={code} data-testid={`country-${code}`}>
                          <span className="flex items-center gap-2">
                            <span>{flag}</span>
                            <span>{name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Industry *</Label>
                  <Select
                    value={data.industry || ""}
                    onValueChange={(value) => setData({ ...data, industry: value as Industry })}
                  >
                    <SelectTrigger data-testid="industry-select">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry} data-testid={`industry-${industry.replace(/\s+/g, '-')}`}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 2 && (
            <>
              <CardHeader>
                <CardTitle>Company Size</CardTitle>
                <CardDescription>
                  This helps us determine regulatory thresholds and applicable frameworks.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="employees">Number of Employees *</Label>
                  <Input
                    id="employees"
                    type="number"
                    placeholder="e.g., 50"
                    value={data.employeeCount || ""}
                    onChange={(e) => setData({ ...data, employeeCount: parseInt(e.target.value) || null })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revenue">Annual Revenue (approximate)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="revenue"
                      type="number"
                      placeholder="e.g., 5000000"
                      className="flex-1"
                      value={data.annualRevenue || ""}
                      onChange={(e) => setData({ ...data, annualRevenue: parseFloat(e.target.value) || null })}
                    />
                    <Select
                      value={data.revenueCurrency}
                      onValueChange={(value) => setData({ ...data, revenueCurrency: value })}
                    >
                      <SelectTrigger className="w-24" data-testid="currency-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD" data-testid="currency-USD">USD</SelectItem>
                        <SelectItem value="AED" data-testid="currency-AED">AED</SelectItem>
                        <SelectItem value="SAR" data-testid="currency-SAR">SAR</SelectItem>
                        <SelectItem value="QAR" data-testid="currency-QAR">QAR</SelectItem>
                        <SelectItem value="BHD" data-testid="currency-BHD">BHD</SelectItem>
                        <SelectItem value="KWD" data-testid="currency-KWD">KWD</SelectItem>
                        <SelectItem value="OMR" data-testid="currency-OMR">OMR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This helps us determine applicable regulations
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="listed"
                      data-testid="listed-checkbox"
                      checked={data.isListed}
                      onCheckedChange={(checked) =>
                        setData({ ...data, isListed: checked as boolean, stockExchange: null })
                      }
                    />
                    <Label htmlFor="listed" className="text-sm font-normal cursor-pointer">
                      Is your company publicly listed?
                    </Label>
                  </div>

                  {data.isListed && data.country && (
                    <div className="space-y-2 pl-7">
                      <Label>Stock Exchange</Label>
                      <Select
                        value={data.stockExchange || ""}
                        onValueChange={(value) => setData({ ...data, stockExchange: value as StockExchange })}
                      >
                        <SelectTrigger data-testid="exchange-select">
                          <SelectValue placeholder="Select exchange" />
                        </SelectTrigger>
                        <SelectContent>
                          {STOCK_EXCHANGES[data.country]?.map((exchange) => (
                            <SelectItem key={exchange} value={exchange} data-testid={`exchange-${exchange}`}>
                              {exchange}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 3 && (
            <>
              <CardHeader>
                <CardTitle>What data do you have available?</CardTitle>
                <CardDescription>
                  Don't worry - we can work with whatever you have! This helps us customize your experience.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="font-medium text-sm flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-muted-foreground" />
                    Documents
                  </div>
                  <div className="grid gap-3 pl-6">
                    {[
                      { key: "hasUtilityBills", label: "Utility bills (electricity, water)" },
                      { key: "hasFuelReceipts", label: "Fuel receipts" },
                      { key: "hasWasteRecords", label: "Waste disposal records" },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center space-x-3">
                        <Checkbox
                          id={key}
                          checked={data[key as keyof OnboardingData] as boolean}
                          onCheckedChange={(checked) =>
                            setData({ ...data, [key]: checked as boolean })
                          }
                        />
                        <Label htmlFor={key} className="text-sm font-normal cursor-pointer">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="font-medium text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    HR & People
                  </div>
                  <div className="grid gap-3 pl-6">
                    {[
                      { key: "hasEmployeeCount", label: "Employee headcount" },
                      { key: "hasHRSystem", label: "HR system/records" },
                      { key: "hasTrainingRecords", label: "Training records" },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center space-x-3">
                        <Checkbox
                          id={key}
                          checked={data[key as keyof OnboardingData] as boolean}
                          onCheckedChange={(checked) =>
                            setData({ ...data, [key]: checked as boolean })
                          }
                        />
                        <Label htmlFor={key} className="text-sm font-normal cursor-pointer">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="font-medium text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    Financial & Policies
                  </div>
                  <div className="grid gap-3 pl-6">
                    {[
                      { key: "hasFinancialStatements", label: "Annual financial statements" },
                      { key: "hasExpenseBreakdown", label: "Operating expense breakdown" },
                      { key: "hasPolicies", label: "Written company policies" },
                      { key: "hasGovernanceDocs", label: "Board/governance documentation" },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center space-x-3">
                        <Checkbox
                          id={key}
                          checked={data[key as keyof OnboardingData] as boolean}
                          onCheckedChange={(checked) =>
                            setData({ ...data, [key]: checked as boolean })
                          }
                        />
                        <Label htmlFor={key} className="text-sm font-normal cursor-pointer">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 4 && (
            <>
              <CardHeader>
                <CardTitle>Your Compliance Requirements</CardTitle>
                <CardDescription>
                  Based on your profile, here are the frameworks you need to comply with.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                    <CheckCircle2 className="w-4 h-4" />
                    REQUIRED FRAMEWORKS
                  </div>
                  <div className="space-y-3">
                    {data.detectedFrameworks.slice(0, -1).map((code) => (
                      <Card key={code} className="border-secondary/30 bg-secondary/5">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                            <div>
                              <div className="font-medium">{frameworkNames[code]?.name || code}</div>
                              <div className="text-sm text-muted-foreground">
                                {frameworkNames[code]?.description}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {data.isListed && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <FileCheck className="w-4 h-4" />
                      RECOMMENDED
                    </div>
                    <Card className="border-primary/30 bg-primary/5">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <FileCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium">GRI Core</div>
                            <div className="text-sm text-muted-foreground">
                              Global standard for international investors
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                  <strong className="text-foreground">💡 Good news!</strong> AFAQ will collect data once and automatically map it to all applicable frameworks.
                </div>
              </CardContent>
            </>
          )}

          {/* Navigation */}
          <div className="p-6 pt-0 flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed() || createCompanyMutation.isPending}
            >
              {createCompanyMutation.isPending ? "Setting up..." : currentStep === steps.length ? "Start Report" : "Continue"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
