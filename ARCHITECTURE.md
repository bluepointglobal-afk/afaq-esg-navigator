# AFAQ ESG Platform - Architecture Documentation

## Overview
AFAQ is an ESG compliance and disclosure platform targeting UAE, KSA, and Qatar SMEs (listed and non-listed). The platform implements a strict freemium boundary:
- **Module A (Free)**: Compliance Engine - Assessment, scoring, gap analysis
- **Module B (Paid)**: Disclosure Generator - AI-assisted narrative generation

## Technology Stack

### Frontend
- **Framework**: React 18.3.1 + TypeScript 5.8.3
- **Build Tool**: Vite 5.4.19
- **Routing**: React Router 6.30.1
- **UI Library**: shadcn/ui (60+ Radix UI components)
- **Styling**: Tailwind CSS 3.4.17
- **State Management**: React Query 5.83.0 (for server state)
- **Forms**: React Hook Form 7.61.1 + Zod 3.25.76
- **Icons**: Lucide React
- **Charts**: Recharts 2.15.4

### Backend
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **API Pattern**: Direct Supabase client + React Query hooks
- **Storage**: Supabase Storage (for documents/evidence)
- **Edge Functions**: Supabase Edge Functions (Deno runtime)
- **AI Integration**: Anthropic Claude API (claude-3-5-sonnet-20241022)

## Current Folder Structure

```
AFAQesg/
├── src/
│   ├── pages/                    # Page components (routes)
│   │   ├── Landing.tsx          # Public landing page
│   │   ├── Auth.tsx             # Authentication (signup/signin)
│   │   ├── Onboarding.tsx       # 4-step company profile wizard
│   │   ├── Dashboard.tsx        # Main ESG report dashboard
│   │   ├── Questionnaire.tsx    # Compliance questionnaire (Step 2)
│   │   ├── ComplianceResults.tsx # Assessment results (Step 3)
│   │   ├── Disclosure.tsx       # Disclosure generator (Step 4 - PAID)
│   │   └── NotFound.tsx         # 404 page
│   │
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components (60+)
│   │   ├── layout/              # Layout components (Logo, etc.)
│   │   ├── landing/             # Landing page sections
│   │   ├── compliance/          # Questionnaire components (Step 2)
│   │   └── assessment/          # Results components (Step 3)
│   │
│   ├── templates/
│   │   └── disclosure/          # Disclosure templates (Step 4)
│   │       ├── uae/             # UAE templates (listed/non-listed)
│   │       ├── ksa/             # KSA templates (listed/non-listed)
│   │       └── qatar/           # Qatar templates (listed/non-listed)
│   │
│   ├── lib/
│   │   ├── questionnaire/       # Questionnaire builder (Step 2)
│   │   ├── scoring/             # Scoring engine (Step 3)
│   │   ├── gaps/                # Gap detection (Step 3)
│   │   ├── recommendations/     # Recommendation generation (Step 3)
│   │   ├── assessment/          # Assessment orchestrator (Step 3)
│   │   └── disclosure/          # Template selection (Step 4)
│   │
│   ├── data/
│   │   ├── questions/           # Question bank by jurisdiction
│   │   └── recommendations/     # Recommendation templates
│   │
│   ├── hooks/
│   │   ├── use-questionnaire-*.ts  # Questionnaire hooks
│   │   ├── use-assessment-*.ts     # Assessment hooks
│   │   ├── use-disclosure-*.ts     # Disclosure hooks (Step 4)
│   │   └── use-toast.ts         # Toast notifications
│   │
│   └── types/
│       └── compliance.ts        # Domain types
│
├── supabase/
│   ├── functions/               # Edge Functions
│   │   └── generate_disclosure/ # AI narrative generation (Step 4)
│   └── migrations/              # Database migrations
│       ├── 20250120000001_create_questionnaire_templates.sql
│       ├── 20250120000002_create_questionnaire_responses.sql
│       ├── 20250120000003_create_assessment_results.sql
│       ├── 20250120000004_create_disclosure_outputs.sql
│       └── 20250121000001_add_disclosure_fields.sql
│
└── [config files]
```

## Database Schema (Existing)

### Core Tables

**users** (via Supabase Auth)
- Standard Supabase auth.users table
- Extended with user_profiles table

**user_profiles**
```typescript
{
  id: string (FK to auth.users)
  full_name: string | null
  email: string
  company_id: string | null (FK to companies)
  role: 'user' | 'admin' | 'owner'
  tier: 'free' | 'pro' | 'enterprise'  // Freemium boundary
  created_at: timestamp
  updated_at: timestamp
}
```

**companies**
```typescript
{
  id: string (PK)
  name: string
  name_arabic: string | null
  country: 'UAE' | 'KSA' | 'Qatar' | 'Bahrain' | 'Kuwait' | 'Oman'
  industry: Industry (23 types)
  industry_subsector: string | null
  employee_count: number | null
  annual_revenue: number | null
  revenue_currency: string
  is_listed: boolean
  stock_exchange: StockExchange | null
  fiscal_year_end: number
  logo_url: string | null
  primary_color: string
  created_at: timestamp
  updated_at: timestamp
}
```

**reports**
```typescript
{
  id: string (PK)
  company_id: string (FK)
  reporting_year: number
  status: 'draft' | 'in_progress' | 'complete' | 'exported'
  overall_completion_pct: number
  environmental_completion_pct: number
  social_completion_pct: number
  governance_completion_pct: number
  data_quality_score: number
  frameworks_selected: string[]
  frameworks_detected: string[]
  last_export_at: timestamp | null
  created_at: timestamp
  updated_at: timestamp
}
```

**metric_data** (Individual data points)
```typescript
{
  id: string (PK)
  report_id: string (FK)
  metric_code: string
  category: 'environmental' | 'social' | 'governance'
  value_numeric: number | null
  value_text: string | null
  value_boolean: boolean | null
  unit: string | null
  data_tier: 1 | 2 | 3 | 4
  data_source: DataSource
  confidence_level: 'high' | 'medium' | 'low'
  calculation_method: string | null
  calculation_inputs: jsonb | null
  emission_factor_used: number | null
  emission_factor_source: string | null
  notes: string | null
  supporting_doc_url: string | null
  entered_by: string | null
  verified_by: string | null
  verified_at: timestamp | null
  created_at: timestamp
  updated_at: timestamp
}
```

### Reference Tables

**metric_definitions** (Question bank metadata)
**frameworks** (Regulatory frameworks by jurisdiction)
**emission_factors** (Country-specific emission factors)
**industry_benchmarks** (Peer comparison data)

## Data Flow Patterns

### Current Authentication Flow
```
User → Auth.tsx → Supabase Auth API → User Profile Creation
                                    → Navigate to /onboarding or /dashboard
```

### Current Onboarding Flow
```
User → Onboarding.tsx (4 steps) → Local State → (Not yet persisted to Supabase)
  Step 1: Company Profile
  Step 2: Company Size
  Step 3: Data Availability
  Step 4: Framework Detection (auto)
```

### Planned Compliance Engine Flow
```
User → Dashboard → Select Report → Compliance Analysis
                                 → Fetch Report + MetricData (React Query)
                                 → Run Scoring Engine (client-side)
                                 → Display Results (Free tier)
                                 → Persist to assessment_results table
```

### Disclosure Generator Flow (Paid - Step 4 Complete)
```
User (Paid Tier) → /compliance/disclosure/:reportId
                  → Check tier: free → Show UpgradePrompt
                  → Check tier: pro/enterprise → Show Generate Button
                  → Click Generate → React Hook calls Edge Function
                                   → Edge Function verifies tier (server-side)
                                   → Edge Function loads template
                                   → Edge Function calls Claude API (4 sections)
                                   → Edge Function returns DisclosureOutput
                  → Save to disclosure_outputs table (RLS enforced)
                  → Display sections with EN/AR toggle
                  → Show quality checklist + disclaimers
                  → Enable JSON download (PDF/Word future)
```

## Integration Patterns

### Supabase Client Usage
```typescript
// Centralized client
import { supabase } from '@/integrations/supabase/client';

// Direct queries (current pattern)
await supabase.auth.signUp({ ... });
await supabase.from('companies').select('*');

// Planned: React Query wrappers
const { data } = useQuery({
  queryKey: ['company', companyId],
  queryFn: () => supabase.from('companies').select('*').eq('id', companyId).single()
});
```

### State Management
- **Server State**: React Query (to be implemented)
- **UI State**: Local useState + useReducer
- **Form State**: React Hook Form
- **Global UI**: useToast hook (custom reducer)

## Routing Structure

### Current Routes
```
/ (Landing)           → Public marketing page
/auth                 → Signup/Signin
/onboarding          → Company profile setup (protected*)
/dashboard           → ESG report dashboard (protected*)
* = Protection not yet implemented
```

### Planned Routes (New Modules)
```
/compliance          → Compliance Engine (free)
/disclosure          → Disclosure Generator (paid, gated)
/settings            → User/company settings
```

## Component Patterns

### Page Component Structure
```typescript
// Standard page component pattern
export default function PageName() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [state, setState] = useState(...);

  const handleAction = async () => {
    try {
      // Supabase call or mutation
      toast({ title: "Success", ... });
      navigate('/next-route');
    } catch (error) {
      toast({ title: "Error", variant: "destructive", ... });
    }
  };

  return (
    <div className="container">
      <Card>...</Card>
    </div>
  );
}
```

### Form Pattern (with React Hook Form + Zod)
```typescript
const formSchema = z.object({
  field: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof formSchema>;

const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: { field: "" },
});

const onSubmit = async (values: FormValues) => {
  // Handle submission
};
```

## Key Entry Points for New Modules

### For Compliance Engine (Module A - Free)
1. **Route**: Create `/src/pages/Compliance.tsx`
2. **Components**: Create `/src/components/compliance/`
   - QuestionnaireForm.tsx
   - ScoringResults.tsx
   - GapAnalysis.tsx
3. **Hooks**: Create `/src/hooks/use-compliance.ts` (React Query)
4. **Types**: Extend `/src/types/index.ts`
5. **Database**: Add new tables via Supabase migrations

### For Disclosure Generator (Module B - Paid)
1. **Route**: Create `/src/pages/DisclosureGenerator.tsx`
2. **Components**: Create `/src/components/disclosure/`
   - TemplatePreview.tsx
   - NarrativeEditor.tsx
   - ExportOptions.tsx
3. **Middleware**: Add entitlement check hook
4. **Templates**: Create reusable disclosure templates
5. **AI Integration**: Edge function for narrative generation

## Freemium Boundary Implementation

### Client-Side Gating
```typescript
// Hook: useEntitlement()
const { tier, canAccessFeature } = useEntitlement();

if (!canAccessFeature('disclosure_generator')) {
  return <UpgradeCTA />;
}
```

### Server-Side Enforcement
```typescript
// Supabase RLS Policy
CREATE POLICY "disclosure_generator_paid_only"
ON disclosure_outputs
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM user_profiles
    WHERE tier IN ('pro', 'enterprise')
  )
);
```

## Development Workflow

### 1. Database Changes
```bash
# Create migration
supabase migration new feature_name

# Apply locally
supabase db reset

# Generate types
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

### 2. Add React Query Hook
```typescript
// src/hooks/use-feature.ts
export const useFeature = () => {
  return useQuery({
    queryKey: ['feature'],
    queryFn: async () => {
      const { data, error } = await supabase.from('table').select('*');
      if (error) throw error;
      return data;
    }
  });
};
```

### 3. Create Page Component
```typescript
// src/pages/Feature.tsx
export default function Feature() {
  const { data, isLoading } = useFeature();
  // Render UI
}
```

### 4. Add Route
```typescript
// src/App.tsx
<Route path="/feature" element={<Feature />} />
```

## Security Considerations

### Authentication
- Supabase handles JWT tokens
- Session persisted in localStorage
- Auto-refresh enabled

### Authorization
- Row-Level Security (RLS) policies on all tables
- Freemium tier checked server-side via RLS
- Company data isolated by company_id

### Data Validation
- Client: Zod schemas + React Hook Form
- Server: Supabase RLS + PostgreSQL constraints

## Performance Optimization

### React Query Configuration
- Stale time: 5 minutes (configurable)
- Cache time: 30 minutes
- Retry: 3 attempts with exponential backoff

### Code Splitting
- Route-based lazy loading (to be implemented)
- Component lazy loading for heavy modules

### Build Optimization
- Vite's built-in tree shaking
- Tailwind CSS purge on production build
- SWC compiler for faster builds

## Testing Strategy (To Be Implemented)

### Unit Tests
- Vitest + React Testing Library
- Test hooks, utilities, validation schemas

### Integration Tests
- Test React Query hooks with mock Supabase
- Test form submission flows

### E2E Tests
- Playwright for critical user journeys
- Test freemium boundary enforcement

## Monitoring & Observability (Step 7)

### Logging
- Supabase Edge Function logs
- Client-side error tracking (to be added)

### Metrics
- React Query DevTools (dev mode)
- Supabase dashboard analytics

### Error Handling
- Global error boundary (to be added)
- Toast notifications for user-facing errors
- Sentry integration (planned)

## Deployment

### Current Setup
- **Platform**: Lovable Cloud (connected)
- **Preview**: Vite preview server
- **Production**: Static build deployed to CDN

### CI/CD
- Push to main → Auto-deploy to Lovable
- Manual deployments via npm run build

## Next Steps (Implementation Plan)

1. **Step 0**: ✅ Architecture audit complete
2. **Step 1**: Define domain schemas (CompanyProfile, Questionnaire, etc.)
3. **Step 2**: Implement jurisdiction-aware question bank
4. **Step 3**: Build scoring and gap engine
5. **Step 4**: Enforce freemium boundary (client + server)
6. **Step 5**: Build disclosure generator with AI
7. **Step 6**: Add safety guardrails and disclaimers
8. **Step 7**: Implement observability and error handling

---

*Last Updated: 2025-12-20*
*Architecture Version: 1.0*
