# CLAUDE.md — AFAQ ESG Navigator

## What This Is
AI-powered ESG compliance reporting platform for GCC/MENA SMEs.
Companies answer a questionnaire → system maps to frameworks → generates disclosure reports.

## Stack
- Frontend: React 18 + Vite 5 + TypeScript + Tailwind CSS + shadcn/ui
- Backend: Supabase (Auth + PostgreSQL + Storage + Edge Functions)
- Secondary Backend: Express.js in /backend/ (Railway) for heavy disclosure generation
- Deployment: Vercel (frontend) + Railway (backend API)
- State: TanStack React Query for server state, React hooks for local state
- Routing: React Router v6
- i18n: Arabic + English (src/locales/)

## Project Structure
```
src/
  pages/           # Route components (Dashboard, Questionnaire, Disclosure, etc.)
  components/      # UI components organized by feature
    ui/            # shadcn/ui primitives (DO NOT manually edit)
    assessment/    # Assessment/questionnaire UI
    compliance/    # Compliance display
    disclosure/    # Disclosure generation/display
    evidence/      # Evidence upload
    landing/       # Landing page sections
    layout/        # Header, Logo, LanguageToggle
    report/        # Report rendering
    tier/          # Tier badge/upgrade
  hooks/           # Custom React hooks (ALL data fetching goes here)
  lib/             # Business logic (NO UI code here)
    disclosure/    # Disclosure generation, templates, export
    framework/     # ESG framework mapping
    gaps/          # Gap analysis
    scoring/       # Scoring algorithms
    sample/        # Sample report data
    report/        # Report generation
  contexts/        # React contexts (Language)
  types/           # TypeScript type definitions
  schemas/         # Zod validation schemas
  data/            # Static data (questions, recommendations)
  templates/       # Disclosure templates
  integrations/    # Supabase client + generated types
backend/           # Express.js API for heavy processing (Railway)
supabase/          # Migrations + Edge Functions
api/               # Vercel serverless functions
```

## Routes
| Path | Component | Auth | Purpose |
|------|-----------|------|---------|
| / | Landing | No | Marketing page |
| /auth | Auth | No | Login/Signup |
| /sample-report | SampleReport | No | Public sample |
| /terms, /privacy | Terms, Privacy | No | Legal pages |
| /onboarding | Onboarding | Yes | Company setup wizard |
| /dashboard | Dashboard | Yes | Main hub after login |
| /settings | CompanySettings | Yes | Company profile |
| /compliance/questionnaire/:reportId | Questionnaire | Yes | ESG assessment |
| /compliance/results/:reportId | ComplianceResults | Yes | Gap analysis results |
| /compliance/narrative/:reportId | NarrativeIntake | Yes | CEO message etc |
| /compliance/metrics/:reportId | MetricInput | Yes | Metric data entry |
| /disclosure/data/:reportId | DisclosureDataCollection | Yes | Data collection |
| /compliance/disclosure/:reportId | Disclosure | Yes | Generate/view report |
| /payment/success, /payment/cancel | Payment pages | Mixed | Stripe callbacks |

## Key Data Flow
1. User signs up → creates company profile (Onboarding)
2. Creates a report for a given year (Dashboard)
3. Completes questionnaire → stored in questionnaire_responses
4. Enters data → stored in disclosure_narratives + metric_data
5. Generates disclosure → backend builds via AI → stored in disclosure_outputs
6. Exports as PDF/JSON/Excel

## Database (Supabase PostgreSQL)
Key tables: companies, reports, questionnaire_responses, questionnaire_templates,
disclosure_narratives, metric_data, disclosure_outputs, evidence_documents,
assessment_results, user_profiles

All tables use Row Level Security (RLS). Migrations are in supabase/migrations/.

## Environment Variables (.env — NEVER commit, NEVER modify)
- VITE_SUPABASE_URL
- VITE_SUPABASE_PUBLISHABLE_KEY
- VITE_STRIPE_PUBLISHABLE_KEY
- VITE_BACKEND_API_URL

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build (MUST pass after every change)
- `npm run lint` — ESLint
- `npm test` — Vitest unit tests
- `npm run test:e2e` — Playwright E2E

## Rules for Working on This Codebase
1. Run `npm run build` after every change — it must pass
2. Use existing shadcn/ui components before creating new ones
3. All data fetching through custom hooks in src/hooks/
4. Business logic goes in src/lib/, NOT in page/component files
5. TypeScript strict mode — no `any` types
6. Commit messages use conventional format: feat:/fix:/chore:/docs:
7. One concern per commit — don't bundle unrelated changes

## Known Technical Debt
- Disclosure.tsx is 801 lines — needs decomposition into sub-components
- disclosure build chunk is 1.35 MB — needs further code splitting
- backend/src/services/disclosure.service.ts is 800 lines — needs modularization

## DO NOT TOUCH (not part of the running application)
- docs/archive/ — Historical process documents
- .bmad-core/ — Agent framework scaffolding
- web-bundles/ — Bundled agent configs
- execution-engine/ — Task execution framework
- .env files — Never modify, never commit
- screenshots/, images_debug/, e2e/screenshots/ — Static assets only
