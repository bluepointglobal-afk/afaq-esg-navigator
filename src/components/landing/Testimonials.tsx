import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ahmed Al-Rashid",
    title: "CFO, Al-Fahad Manufacturing",
    location: "Riyadh, Saudi Arabia",
    industry: "Manufacturing, 180 employees",
    quote: "AFAQ reduced our ESG reporting prep time from 4 months to 2 weeks. The automated gap analysis alone saved us SAR 150,000 in consultant fees. Our disclosure report was audit-ready on first submission to Tadawul.",
    rating: 5,
    avatar: "🇸🇦",
    framework: "Tadawul ESG",
  },
  {
    name: "Fatima Al-Mansoori",
    title: "Sustainability Manager, Gulf Tech Solutions",
    location: "Dubai, UAE",
    industry: "Technology, 95 employees",
    quote: "As a first-time ESG reporter, I was overwhelmed. AFAQ's questionnaire was straightforward, and the generated report aligned perfectly with IFRS S1/S2 requirements. Our investors were impressed with the quality.",
    rating: 5,
    avatar: "🇦🇪",
    framework: "IFRS S1/S2",
  },
  {
    name: "Mohammed Al-Kuwari",
    title: "CEO, Green Horizon Energy",
    location: "Doha, Qatar",
    industry: "Energy, 120 employees",
    quote: "We needed TCFD disclosure for our sustainability-linked loan. AFAQ's AI-powered narrative generation captured our climate strategy perfectly. Closed our financing 3 weeks ahead of schedule.",
    rating: 5,
    avatar: "🇶🇦",
    framework: "TCFD",
  },
];

const stats = [
  { value: "50+", label: "GCC Companies" },
  { value: "SAR 12M+", label: "Saved in Consulting Fees" },
  { value: "92%", label: "First-Submission Pass Rate" },
  { value: "14 Days", label: "Avg. Time to Disclosure" },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by GCC CFOs & Sustainability Leaders
          </h2>
          <p className="text-lg text-muted-foreground">
            Join 50+ companies saving months of work and thousands in consultant fees
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <Card key={index} className="border-none shadow-sm">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              {/* Quote icon */}
              <div className="absolute top-4 right-4 text-primary/10">
                <Quote className="w-12 h-12" />
              </div>

              <CardContent className="pt-6 relative">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-foreground/90 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Framework badge */}
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-4">
                  ✓ {testimonial.framework}
                </div>

                {/* Author */}
                <div className="flex items-start gap-3 pt-4 border-t">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.title}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.industry}</div>
                    <div className="text-xs text-muted-foreground mt-1">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 pt-12 border-t border-border/50">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Aligned with leading ESG frameworks
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg border">
              <span className="text-xs font-semibold text-muted-foreground">IFRS S1/S2</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg border">
              <span className="text-xs font-semibold text-muted-foreground">TCFD</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg border">
              <span className="text-xs font-semibold text-muted-foreground">GRI Standards</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg border">
              <span className="text-xs font-semibold text-muted-foreground">Tadawul ESG</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg border">
              <span className="text-xs font-semibold text-muted-foreground">GCC Unified Metrics</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
