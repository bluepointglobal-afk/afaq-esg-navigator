import { 
  Zap, 
  Globe, 
  BarChart3, 
  FileText, 
  Layers, 
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Globe,
    title: "All 6 GCC Countries",
    description: "Built specifically for UAE, Saudi Arabia, Qatar, Bahrain, Kuwait, and Oman regulatory requirements.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Layers,
    title: "Smart Data Tiers",
    description: "Don't have utility bills? No problem. Our tiered system works with whatever data you have - from actual readings to spend estimates.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: BarChart3,
    title: "Auto Framework Detection",
    description: "We detect which frameworks apply to your company based on country, size, and listing status. One data entry, multiple frameworks.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: FileText,
    title: "Export Ready Reports",
    description: "Generate professional PDF, Excel, and Word reports with transparent data quality indicators and full audit trail.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: TrendingUp,
    title: "Gap Analysis Dashboard",
    description: "See exactly what's missing for compliance, prioritized by mandatory vs optional requirements.",
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    icon: Zap,
    title: "AI-Powered Estimates",
    description: "When you don't have exact data, our AI suggests industry benchmarks with full transparency in your final report.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
];

const frameworks = [
  "Tadawul ESG Guidelines",
  "ADX ESG Guide",
  "DFM ESG Disclosure",
  "QSE 34 KPIs",
  "BHB 32 KPIs",
  "MSX 30 Metrics",
  "GCC Unified Framework",
  "GRI Core",
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything You Need for
            <span className="text-gradient-primary"> ESG Compliance</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Built specifically for GCC SMEs who need compliant reports without dedicated sustainability teams or expensive consultants.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
              {/* Decorative gradient */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Card>
          ))}
        </div>

        {/* Frameworks section */}
        <div className="bg-gradient-to-br from-muted to-muted/50 rounded-3xl p-8 sm:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Compliant with All Major GCC Frameworks
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enter your data once, and we map it to every framework that applies to your company.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {frameworks.map((framework) => (
              <div 
                key={framework}
                className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-sm border border-border/50"
              >
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-foreground">{framework}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
