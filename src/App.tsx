import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import { lazy, Suspense } from "react";

// Eager load (critical pages)
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

// Lazy load (heavy pages)
const Questionnaire = lazy(() => import("./pages/Questionnaire"));
const ComplianceResults = lazy(() => import("./pages/ComplianceResults"));
const Disclosure = lazy(() => import("./pages/Disclosure"));
const NarrativeIntake = lazy(() => import("./pages/NarrativeIntake"));
const MetricInput = lazy(() => import("./pages/MetricInput"));
const CompanySettings = lazy(() => import("./pages/CompanySettings"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentCancel = lazy(() => import("./pages/PaymentCancel"));
const SampleReport = lazy(() => import("./pages/SampleReport"));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/sample-report" element={<SampleReport />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Protected routes */}
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><CompanySettings /></ProtectedRoute>} />
            <Route path="/compliance/questionnaire/:reportId" element={<ProtectedRoute><Questionnaire /></ProtectedRoute>} />
            <Route path="/compliance/results/:reportId" element={<ProtectedRoute><ComplianceResults /></ProtectedRoute>} />
            <Route path="/compliance/narrative/:reportId" element={<ProtectedRoute><NarrativeIntake /></ProtectedRoute>} />
            <Route path="/compliance/metrics/:reportId" element={<ProtectedRoute><MetricInput /></ProtectedRoute>} />
            <Route path="/compliance/disclosure/:reportId" element={<ProtectedRoute><Disclosure /></ProtectedRoute>} />

            {/* Payment routes */}
            <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />

              {/* Fallback */}
              <Route path="*" element={<Landing />} />
            </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
