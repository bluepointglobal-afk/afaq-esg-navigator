# AFAQ ESG Platform - Entitlements & Free/Paid Boundary Specification

**Version**: 1.0
**Date**: December 20, 2024
**Status**: Active

---

## Overview

AFAQ ESG Platform implements a **freemium business model** with a clear boundary between free assessment services and paid disclosure generation services. This document defines the precise entitlements for each tier and specifies exact UI copy to ensure compliance, transparency, and user clarity.

---

## Tier Definitions

### Free Tier (Default for All Users)

**Access**: Immediate upon registration, no credit card required
**Duration**: Unlimited, no time restrictions
**User Limit**: Unlimited users per company

**Included Features**:
1. ✅ **Complete Questionnaire Access**
   - Full access to jurisdiction-specific compliance questionnaire
   - All question types (boolean, single choice, multiple choice, text, number, percentage, date)
   - Conditional question logic
   - Evidence upload (URLs and notes)
   - Auto-save functionality
   - Arabic language support

2. ✅ **Assessment Results Dashboard** (Step 3)
   - Overall compliance score (0-100)
   - Per-pillar scores (Governance, ESG, Risk & Controls, Transparency)
   - Gap analysis with severity ratings (critical/high/medium/low)
   - Actionable recommendations with effort/impact estimates
   - Methodology explanation
   - Strengths and weaknesses summary

3. ✅ **Basic Export** (Future)
   - Export results to PDF (basic template)
   - Print-friendly view

4. ✅ **Data Persistence**
   - Unlimited data storage
   - Progress auto-save
   - Resume questionnaire anytime

**Limitations**:
- ❌ No disclosure narrative generation
- ❌ No regulatory citation engine
- ❌ No year-over-year comparison
- ❌ No peer benchmarking
- ❌ No advanced analytics
- ❌ No priority support

---

### Pro Tier (Paid)

**Pricing**: TBD (subscription-based)
**Billing**: Monthly or annual
**User Limit**: TBD based on company size

**Includes All Free Tier Features Plus**:

1. 🔒 **AI-Powered Disclosure Generator** (Step 4+)
   - Narrative generation using company data + assessment results
   - Jurisdiction-specific templates (UAE, KSA, Qatar)
   - Regulatory framework alignment
   - Citation engine with automatic references to:
     - UAE Corporate Governance Code
     - KSA Capital Market Authority rules
     - Qatar Financial Markets Authority regulations
   - Export to Word/PDF/HTML
   - Custom branding options

2. 🔒 **Advanced Analytics**
   - Year-over-year trend analysis
   - Progress tracking across reporting periods
   - Custom reports and visualizations

3. 🔒 **Peer Benchmarking**
   - Anonymous comparison with industry peers
   - Sector-specific benchmarks
   - Best practice insights

4. 🔒 **Priority Support**
   - Email support with 24-hour response time
   - Dedicated account manager (Enterprise tier)
   - Implementation assistance

---

## UI Copy Specification

### Global Disclaimers

**Assessment Results Page Disclaimer**:
```
This assessment provides educational insights only and does not constitute legal or
regulatory advice. Consult qualified professionals for compliance guidance.
```

**Footer Disclaimer (All Pages)**:
```
AFAQ ESG Platform is a technology solution that provides compliance assessment and
disclosure tools. It does not provide legal, accounting, or regulatory advice. Users
should consult qualified professionals for compliance matters specific to their
jurisdiction and circumstances.
```

---

### Free Tier Copy

**Dashboard - Compliance Check Card**:
```
Title: "Free Compliance Assessment"

Description: "Complete our jurisdiction-specific questionnaire to receive instant
compliance scores, gap analysis, and actionable recommendations. No credit card required."

Badge: "Free Tier" (green background)
```

**Results Page Header**:
```
Title: "Your Compliance Assessment Results"

Subtitle: "Based on your responses across {question_count} questions in {pillar_count} pillars"

Footer: "✅ This assessment is 100% free and will remain accessible forever."
```

**Methodology Panel**:
```
Title: "How We Calculate Your Score"

Content: "Your compliance score is calculated using a transparent, deterministic methodology:

1. Question Weighting: Each question has a weight (1-10) based on regulatory importance.
2. Answer Scoring: Answers are scored 0-100 based on best practices for each question type.
3. Pillar Scores: Weighted average of questions within each pillar.
4. Overall Score: Weighted average across all pillars (Governance 30%, ESG 25%, Risk 25%, Transparency 20%).

Gap Severity: Determined by question weight, answer quality, and criticality flags.
Recommendations: Matched from a curated database based on your specific gaps."
```

---

### Paid Tier Copy (Upgrade Prompts)

**Locked Disclosure Section (Results Page)**:
```
Icon: 🔒

Title: "Generate Disclosure Report"

Message: "Upgrade to Pro to transform your assessment results into jurisdiction-compliant
disclosure narratives ready for stakeholder distribution."

Features List:
• AI-powered disclosure narrative generation
• Jurisdiction-specific templates (UAE, KSA, Qatar)
• Regulatory citation engine
• Export to Word/PDF with custom branding
• Year-over-year tracking and trend analysis

Button Text: "Upgrade to Pro"
Secondary Button: "Learn More"

Footer: "* Disclosure generation is a paid feature. Assessment results remain free forever."
```

**Upgrade Modal (When Clicking Locked Feature)**:
```
Title: "Unlock Professional Disclosure Tools"

Description: "Generate publication-ready disclosure narratives that comply with local
regulatory requirements and industry best practices."

Pricing:
- Pro: $X/month (billed monthly)
- Pro Annual: $Y/year (save Z%)
- Enterprise: Custom pricing

Call-to-Action: "Start 14-Day Free Trial" (No credit card required)
Secondary: "Schedule Demo"

Legal Fine Print:
"Trial includes full access to all Pro features. Cancel anytime during trial period
with no charges. Subscription auto-renews after trial unless cancelled."
```

**Navigation Bar Badge (When Pro Feature Clicked)**:
```
Badge: "PRO" (gold/yellow background)
Tooltip: "This feature requires Pro subscription"
```

---

### Compliance & Legal Copy

**Feature Boundary Enforcement**:
- Free tier users see locked disclosure section with clear upgrade path
- Clicking locked feature shows upgrade modal (not error message)
- All locked features marked with 🔒 icon
- "PRO" badge visible on locked features

**Terms of Service Reference**:
```
By using AFAQ ESG Platform, you agree to our Terms of Service and Privacy Policy.
Assessment results are based on your self-reported information and do not constitute
audit, assurance, or certification.
```

**Data Retention Notice**:
```
Free Tier: Your data is stored securely and remains accessible indefinitely.
Pro Tier: Includes additional data retention guarantees and backup services.
```

**Export Limitations Notice** (Free Tier):
```
Basic PDF export available. For Word export, custom branding, and advanced formatting,
upgrade to Pro.
```

---

## Implementation Guidelines

### UI/UX Requirements

1. **Clear Visual Distinction**:
   - Free features: Standard UI, no badges
   - Locked features: Greyed out with 🔒 icon and "PRO" badge
   - Upgrade buttons: High contrast, primary color

2. **Non-Intrusive Upselling**:
   - Locked features visible but clearly marked
   - No popup ads or interruptions during assessment
   - Upgrade prompts only when user clicks locked feature
   - "Dismiss" option on all upgrade modals

3. **Transparent Pricing**:
   - Pricing page always accessible
   - No hidden fees or surprise charges
   - Clear feature comparison table

4. **Seamless Upgrade Flow**:
   - One-click upgrade from any locked feature
   - Return to original page after upgrade
   - Immediate access to unlocked features

### Code Implementation

**Entitlement Check Hook** (`src/hooks/use-entitlements.ts`):
```typescript
export function useEntitlements() {
  const { data: profile } = useUserProfile();

  return {
    tier: profile?.tier || 'free',
    canGenerateDisclosure: profile?.tier === 'pro' || profile?.tier === 'enterprise',
    canAccessAnalytics: profile?.tier === 'pro' || profile?.tier === 'enterprise',
    canBenchmark: profile?.tier === 'pro' || profile?.tier === 'enterprise',
  };
}
```

**Feature Gate Component**:
```typescript
<FeatureGate feature="disclosure_generator">
  <DisclosureGeneratorButton />
</FeatureGate>

// If user lacks entitlement, shows:
<LockedFeature feature="disclosure_generator" />
```

### Database Schema

**user_profiles table** (existing, add tier column):
```sql
ALTER TABLE user_profiles
ADD COLUMN tier VARCHAR(20) DEFAULT 'free'
CHECK (tier IN ('free', 'pro', 'enterprise'));
```

**RLS Policy Update** (disclosure_outputs table):
```sql
-- Already exists in migration 20250120000004
-- Enforces that only pro/enterprise users can access disclosure outputs
CREATE POLICY "Only paid users can view disclosure outputs"
  ON disclosure_outputs FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.tier IN ('pro', 'enterprise')
    )
  );
```

---

## Testing Requirements

### Acceptance Tests

1. **Free Tier Access**:
   - ✅ Can complete questionnaire
   - ✅ Can view assessment results
   - ✅ Can see locked disclosure section
   - ❌ Cannot generate disclosure (shows upgrade modal)

2. **Pro Tier Access**:
   - ✅ Can do everything in Free tier
   - ✅ Can generate disclosure narratives
   - ✅ Can export to Word/PDF
   - ✅ Can access analytics

3. **Boundary Enforcement**:
   - ✅ Clicking locked feature shows upgrade modal (not error)
   - ✅ Database RLS prevents unauthorized access
   - ✅ API endpoints return 403 for unauthorized access

### Copy Verification

- All UI strings match specification exactly
- Disclaimers present on required pages
- No misleading or aggressive upselling language
- Legal compliance with local advertising regulations

---

## Future Enhancements

1. **Enterprise Tier**:
   - Multi-company management
   - SSO/SAML integration
   - API access
   - Custom reporting
   - Dedicated support

2. **Freemium Extensions**:
   - Limited year-over-year comparison (last 2 years only)
   - Basic peer benchmarking (sector averages only)

3. **Trial Extensions**:
   - 14-day Pro trial for all free users
   - Feature-specific trials (e.g., "Try Disclosure Generator")

---

## Changelog

**v1.0 - December 20, 2024**:
- Initial specification
- Free tier: Complete assessment + results
- Pro tier: Disclosure generation + analytics
- Clear UI copy and disclaimers defined

---

**Approved by**: Product & Legal Teams
**Next Review**: Q1 2025
