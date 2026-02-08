import { Building2, ClipboardList, BarChart, FileOutput } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Building2,
    title: "Tell Us About Your Company",
    description: "2 minutes to set up your profile. We auto-detect which frameworks apply based on your country, size, and listing status.",
    color: "from-primary to-primary/70",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Answer Smart Questions",
    description: "Choose how to provide each metric - actual data, activity estimates, or let us calculate from benchmarks. Use whatever data you have.",
    color: "from-secondary to-secondary/70",
  },
  {
    number: "03",
    icon: BarChart,
    title: "Review Gap Analysis",
    description: "See exactly which mandatory metrics are missing. Our dashboard prioritizes what you need to complete for compliance.",
    color: "from-accent to-accent/70",
  },
  {
    number: "04",
    icon: FileOutput,
    title: "Export Your Report",
    description: "Download professional PDF, Excel, or Word reports with transparent data quality indicators. Ready for submission or internal use.",
    color: "from-amber-500 to-amber-600",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-sm font-semibold mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            From Zero to Compliant
            <span className="text-gradient-environmental"> in 4 Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            No sustainability expertise required. Our guided process walks you through everything.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection line */}
          <div className="absolute top-24 left-8 right-8 h-0.5 bg-gradient-to-r from-primary via-secondary to-amber-500 hidden lg:block" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative group">
                {/* Step number badge */}
                <div className={`relative z-10 w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <span className="text-sm font-bold text-muted-foreground/60 mb-2 block">
                    STEP {step.number}
                  </span>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
