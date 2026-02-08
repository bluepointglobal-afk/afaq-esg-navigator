import { ArrowRight, Clock, Shield, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-secondary" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse-subtle" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-secondary/20 rounded-full blur-3xl animate-pulse-subtle delay-1000" />
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-white/10 rounded-full blur-2xl float" />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 fade-in-up">
            <Shield className="w-4 h-4" />
            <span>Trusted by 500+ GCC Companies</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 fade-in-up delay-100">
            ESG Compliance
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-white">
              Made Simple
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 fade-in-up delay-200">
            Your first compliant ESG report in <span className="text-white font-semibold">2 hours</span>, not 2 months. 
            No sustainability team required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 fade-in-up delay-300">
            <Button 
              size="xl" 
              className="bg-white text-primary hover:bg-white/90 shadow-2xl hover:shadow-white/20"
              onClick={() => navigate('/auth')}
            >
              Start Free Report
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              variant="heroOutline" 
              size="xl"
              onClick={() => navigate('/sample-report')}
            >
              View Sample Report
              <FileCheck className="w-5 h-5" />
            </Button>
            <Button 
              variant="heroOutline" 
              size="xl"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See How It Works
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto fade-in-up delay-400">
            <div className="flex flex-col items-center gap-2 p-4 bg-white/5 backdrop-blur-sm rounded-2xl">
              <Clock className="w-8 h-8 text-emerald-300" />
              <span className="text-2xl font-bold text-white">2 Hours</span>
              <span className="text-sm text-white/70">Average completion time</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-white/5 backdrop-blur-sm rounded-2xl">
              <FileCheck className="w-8 h-8 text-emerald-300" />
              <span className="text-2xl font-bold text-white">29 Metrics</span>
              <span className="text-sm text-white/70">GCC Unified Framework</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-white/5 backdrop-blur-sm rounded-2xl">
              <Shield className="w-8 h-8 text-emerald-300" />
              <span className="text-2xl font-bold text-white">6 Countries</span>
              <span className="text-sm text-white/70">Full GCC coverage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
        </svg>
      </div>
    </section>
  );
}
