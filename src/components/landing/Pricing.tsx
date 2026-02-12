import { useState } from "react";
import { Check, X, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useCheckout, type PriceType } from "@/hooks/use-checkout";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Free",
    price: "SAR 0",
    period: "forever",
    description: "Perfect for trying out AFAQ",
    features: [
      { text: "1 report per year", included: true },
      { text: "Full data collection", included: true },
      { text: "Gap analysis dashboard", included: true },
      { text: "Watermarked exports", included: true },
      { text: "30-day data storage", included: true },
      { text: "Audit trail", included: false },
      { text: "Multi-year tracking", included: false },
      { text: "Custom branding", included: false },
    ],
    cta: "Start Free",
    popular: false,
    priceType: null as PriceType | null,
  },
  {
    name: "Pro",
    price: "SAR 369",
    period: "per report",
    alternatePrice: "or SAR 1,099/year unlimited",
    description: "For companies needing compliant reports",
    savings: "Save SAR 10,000+ vs. Big 4 consultants",
    features: [
      { text: "Unlimited reports", included: true },
      { text: "Full data collection", included: true },
      { text: "Gap analysis dashboard", included: true },
      { text: "Clean exports (no watermark)", included: true },
      { text: "Unlimited data storage", included: true },
      { text: "Full audit trail", included: true },
      { text: "Multi-year tracking", included: true },
      { text: "Logo & branding", included: true },
    ],
    cta: "Upgrade to Pro",
    popular: true,
    priceType: 'per_report' as PriceType,
  },
  {
    name: "Enterprise",
    price: "SAR 10k-30k",
    period: "per year",
    description: "For multi-entity groups and large organizations",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Multi-entity consolidation", included: true },
      { text: "API access", included: true },
      { text: "Custom frameworks", included: true },
      { text: "SSO integration", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Assurance-ready docs", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
    priceType: null as PriceType | null,
  },
];

export function Pricing() {
  const navigate = useNavigate();
  const { checkout, isLoading } = useCheckout();
  const { toast } = useToast();
  const [selectedPriceType, setSelectedPriceType] = useState<PriceType>('annual');

  const handlePlanClick = (planName: string, priceType: PriceType | null) => {
    if (planName === "Free") {
      navigate('/auth');
    } else if (planName === "Enterprise") {
      window.location.href = 'mailto:enterprise@afaq.ae?subject=Enterprise%20Inquiry';
    } else if (planName === "Pro" && priceType) {
      checkout(
        { priceType: selectedPriceType },
        {
          onError: (error) => {
            toast({
              title: "Checkout Error",
              description: error.message || "Please sign in first to upgrade",
              variant: "destructive",
            });
            // If not authenticated, redirect to auth
            if (error.message?.includes('authenticated')) {
              navigate('/auth');
            }
          },
        }
      );
    }
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Save thousands compared to consultants. Big 4 firms charge SAR 20,000-75,000 per report.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                plan.popular
                  ? 'border-2 border-primary shadow-xl shadow-primary/10'
                  : 'border shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />
              )}

              <CardHeader className="pb-4">
                {plan.popular && (
                  <div className="flex items-center gap-1.5 text-primary text-sm font-semibold mb-2">
                    <Sparkles className="w-4 h-4" />
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/{plan.period}</span>
                </div>
                {plan.alternatePrice && (
                  <p className="text-sm text-secondary font-medium mt-1">{plan.alternatePrice}</p>
                )}
                <p className="text-muted-foreground mt-2">{plan.description}</p>
                {'savings' in plan && plan.savings && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                    💰 {plan.savings}
                  </div>
                )}
              </CardHeader>

              <CardContent>
                {/* Pro plan pricing toggle */}
                {plan.name === "Pro" && (
                  <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg">
                    <button
                      onClick={() => setSelectedPriceType('per_report')}
                      className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors ${
                        selectedPriceType === 'per_report'
                          ? 'bg-background shadow text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      SAR 369/report
                    </button>
                    <button
                      onClick={() => setSelectedPriceType('annual')}
                      className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors ${
                        selectedPriceType === 'annual'
                          ? 'bg-background shadow text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      SAR 1,099/year
                    </button>
                  </div>
                )}

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground/40 shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? 'text-foreground' : 'text-muted-foreground/60'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                  onClick={() => handlePlanClick(plan.name, plan.priceType)}
                  disabled={isLoading && plan.name === "Pro"}
                >
                  {isLoading && plan.name === "Pro" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    plan.cta
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust badge */}
        <p className="text-center text-muted-foreground mt-12">
          Secure payment via Stripe | Invoice available for Enterprise
        </p>
      </div>
    </section>
  );
}
