# SME Market Friction Report — AFAQ ESG Platform
**Date:** 2026-02-04  
**Persona:** GCC Sustainability Manager at UAE SME (50-200 employees)  
**Scenario:** Received procurement ESG questionnaire from major buyer (ADNOC/Emirates/Emaar), 2-4 week deadline  
**Budget:** AED 5,000-15,000 discretionary (self-approvable), above requires board sign-off

---

## Executive Verdict: **WOULD EXPLORE** → **BOUNCE AT PAYWALL** (with caveats)

The product has a solid technical foundation and addresses a real pain point, but critical trust and value-demonstration gaps prevent immediate purchase. The free tier offers genuine utility (compliance assessment + gap analysis), but the transition to paid lacks the proof points an SME decision-maker needs.

---

## 1. Trust Killers 🔴

### 1.1 No Evidence of "Audit-Proof" Claims
**Problem:** The platform promises "audit-ready" disclosures but provides no visible evidence register, methodology documentation, or sample outputs until *after* payment.  
**SME Reaction:** *"How do I know this won't embarrass me if my buyer's consultant audits it?"*

**Locations:**
- Landing page: No sample report download
- Compliance Results: Gap analysis shown but no "how we calculated this" transparency
- Disclosure page: Paywall blocks seeing output quality

**Code Evidence:**
```typescript
// Disclosure.tsx - Line 15-19
// Paid tier check happens BEFORE showing any output
const isPaidTier = userProfile?.tier === 'pro' || userProfile?.tier === 'enterprise' || isTestMode;
// Shows <UpgradePrompt /> if not paid - no preview possible
```

### 1.2 Missing UAE/GCC Social Proof
**Problem:** Claims "Trusted by 500+ GCC Companies" (Hero.tsx) but zero named references, case studies, or UAE regulatory endorsements visible.  
**SME Reaction:** *"Could be fabricated. Where are the actual UAE companies?"*

**Gap:** No `/case-studies` page, no "Used by [Logos]" section with recognizable local brands.

### 1.3 AI Transparency Concerns
**Problem:** Uses Claude AI for narrative generation (Supabase Edge Function) but doesn't prominently disclose this or explain the guardrails to users upfront.  
**SME Reaction:** *"Is this just ChatGPT making things up? My buyer will check."*

**Code Evidence:**
```typescript
// supabase/functions/generate_disclosure/index.ts
// System prompt includes "No Fabricated Citations" but this isn't surfaced to users
// The SME never sees the safety mechanisms
```

### 1.4 No "Data Fabrication" Guarantee Visible
**Problem:** The persona's #1 fear is fabricated data. The platform *has* logic to show gaps (not fabricate) but this promise isn't prominent in the UX.  
**Gap:** No badge, no guarantee statement, no "We never make up numbers" messaging on landing or dashboard.

---

## 2. Value Gaps 🟡

### 2.1 Free Tier Ends Abruptly
**Journey:**
1. Landing → "Start Free Report" (clear CTA ✓)
2. Onboarding → 4-step wizard (smooth ✓)
3. Questionnaire → ~50-100 questions (time investment: 45-90 min)
4. Compliance Results → Gap analysis shown (value delivered ✓)
5. Disclosure/Report Generation → **Hard paywall** ← *Friction point*

**Problem:** After investing 1+ hour, user hits a wall with no preview of what $99 buys them. No "teaser" output, no redacted sample, no quality demonstration.

**Code Evidence:**
```typescript
// Disclosure.tsx - Lines 280-300
if (!isPaidTier) {
  return <UpgradePrompt />; // No preview, no sample, just "Upgrade to Pro"
}
```

### 2.2 Pricing Mismatch for SME Segment
**Displayed Pricing:** $99/report or $299/year (~AED 365/report or AED 1,100/year)  
**SME Budget:** AED 5,000-15,000 discretionary  
**Issue:** Price is actually *too low* relative to budget, which creates suspicion. "If it's this cheap, what's wrong with it?"

**Recommendation:** Test anchoring at AED 2,500-4,000 with clear value justification (vs. AED 25k+ consultant).

### 2.3 Missing "72-Hour Promise" Delivery
**Current:** No explicit timeline承诺 on the paid tier. User doesn't know if report generates instantly or takes days.  
**SME Need:** Urgency is driving the search. "When will I receive my report?" isn't answered until after payment.

### 2.4 No Procurement-Specific Positioning
**Problem:** The persona arrived because of a specific trigger (supplier questionnaire). The landing page speaks generally about "ESG Compliance" but doesn't address:
- "Got an ADNOC supplier questionnaire?"
- "Respond to Emirates procurement in 72 hours"
- "Complete your RFP ESG section"

**Code Evidence:**
```typescript
// Hero.tsx - Generic headline
<h1>ESG Compliance Made Simple</h1>
<p>Your first compliant ESG report in 2 hours, not 2 months</p>
// Missing: Trigger-based messaging for procurement deadlines
```

### 2.5 Framework Confusion
**Current:** Auto-detects frameworks (UAE SCA, Tadawul, etc.) which is excellent ✓  
**Gap:** User doesn't understand *which* framework their buyer is asking for. The tool assumes knowledge the SME doesn't have.

**Code Evidence:**
```typescript
// Onboarding.tsx - detectFrameworks() returns array of framework IDs
// But user sees: "UAE SCA ESG Guidance" — they don't know if this matches their buyer's request
// No "If your buyer is [X], you need [Y]" mapping
```

---

## 3. Buy Triggers 🟢

### 3.1 Strong Free Value (Hook)
The compliance assessment + gap analysis is genuinely useful and free. This builds trust and demonstrates competence. The scoring engine (client-side, no server cost) is smart product design.

**Code Evidence:**
```typescript
// ComplianceResults.tsx - Shows detailed gap analysis
<ScoreCard overallScore={assessment.overallScore} />
<GapsList gaps={assessment.gaps} />
<RecommendationsList recommendations={assessment.recommendations} />
```

### 3.2 Local Framework Detection
The automatic framework detection based on country/company size is a **market differentiator** vs. generic Western tools.

**Code Evidence:**
```typescript
// Onboarding.tsx - Lines 35-75
detectFrameworks(data) → returns UAE_SCA_ESG, TADAWUL_ESG, etc. based on inputs
// This is genuinely valuable for SMEs who don't know what they need
```

### 3.3 Speed Promise
"2 hours, not 2 months" is a compelling contrast to consultant timelines. This resonates with the urgent procurement deadline scenario.

### 3.4 Bilingual Architecture
The codebase shows Arabic support (companyNameArabic fields, language toggle component). For UAE/KSA this is table-stakes but necessary.

**Code Evidence:**
```typescript
// Multiple files include Arabic field support
nameArabic: company.nameArabic || company.name
// LanguageToggle component exists in layout/
```

### 3.5 Evidence Register (Technical Merit)
The data model includes `supporting_doc_url`, `verified_by`, `confidence_level` fields — the plumbing for audit-trail exists. This just isn't surfaced as a selling point.

---

## 4. Pricing Assessment 💰

| Aspect | Current State | SME Perception | Recommendation |
|--------|---------------|----------------|----------------|
| **Price Point** | $99/report, $299/year | "Suspiciously cheap" | Test AED 2,500-4,000 (~$680-$1,100) |
| **Value Anchor** | "Save vs Big 4" | Weak — no comparison shown | Add consultant cost comparison (AED 25k+) |
| **Payment Terms** | Stripe only | No invoice option for UAE | Add "Pay by bank transfer" for Enterprise |
| **Currency** | USD | Mental conversion friction | Display AED prominently |
| **Trial** | Free assessment only | No paid preview | Add "Generate 2-page sample" at $0 |

**Pricing Psychology Issue:** The current price is below the "self-approval threshold" sweet spot. At $99, it signals "low quality" to an SME manager who *can* spend AED 5,000. They're comparing against consultants at AED 25k+ — the gap is so large it creates distrust rather than delight.

---

## 5. Unnecessary Features / Friction ⚠️

### 5.1 "Enterprise" Plan Distraction
**Current:** 3-tier pricing (Free/Pro/Enterprise)  
**Problem:** SMEs don't self-identify as "Enterprise." The custom pricing CTA creates decision paralysis.  
**Fix:** Hide Enterprise or reframe as "Multi-entity Groups" with qualifier text.

### 5.2 Framework Selection Overload
**Current:** User can select IFRS S1, S2, TCFD, GRI, Local regs (Disclosure.tsx, lines 45-53)  
**Problem:** SME doesn't know which frameworks apply. Auto-detection is good, but manual selection is confusing.  
**Fix:** Default to auto-detected, hide advanced options behind "Expert Mode."

### 5.3 Narrative Input Burden
**Current:** Governance, ESG, Risk, Transparency narrative text fields (NarrativeInput.tsx)  
**Problem:** Asks user to write essays. SME doesn't have this content ready.  
**Gap:** No AI-assisted "help me write this" or template suggestions.

### 5.4 Questionnaire Length
**Current:** ~50-100 questions (estimated from builder logic)  
**Problem:** No progress indicator showing "You're 20% done — 15 minutes remaining."  
**Code Fix:** Add time estimate and completion % prominently.

### 5.5 "MOCK_REPORT_ID" Fallback
**Code Evidence:**
```typescript
// Questionnaire.tsx - Line 24
const { reportId = "MOCK_REPORT_ID" } = useParams();
// This suggests incomplete error handling for production
```

---

## 6. Technical Observations (From Code Review)

### 6.1 Strengths
- **React Query + Supabase:** Solid data fetching patterns
- **Freemium Enforcement:** Client-side + RLS policies for tier gating
- **Export Options:** PDF, Excel, JSON, HTML generators exist
- **Type Safety:** Comprehensive TypeScript coverage

### 6.2 Concerns
- **Mock Data Fallbacks:** Multiple files have `MOCK_REPORT_ID` or placeholder data paths
- **Missing Evidence Upload UI:** Database has `supporting_doc_url` fields but UI for uploading evidence isn't prominent in reviewed components
- **Claude API Dependency:** Single AI provider, no fallback mentioned

---

## 7. Top 3 Changes to Convert This Persona

### P0: Add Sample Output Preview
**Location:** Compliance Results page (free tier endpoint)  
**Change:** Show a redacted 3-page sample sustainability report with "Generated by AFAQ" watermark. Include evidence register sample.  
**Impact:** Addresses "What am I buying?" fear directly.

### P0: Procurement-Specific Landing Variant
**Location:** `/lp/procurement` or hero A/B test  
**Change:** Headline: "Respond to Your ADNOC/Emirates/Emaar ESG Questionnaire in 72 Hours"  
**Impact:** Matches the exact trigger event driving search.

### P1: "No Fabrication" Trust Badge
**Location:** Dashboard, Questionnaire, Disclosure pages  
**Change:** Prominent badge: "✓ We Never Generate Fake Data — Gaps Shown Clearly" with link to methodology.  
**Impact:** Addresses the #1 persona objection.

---

## 8. Competitive Position Summary

| Competitor | AFAQ Advantage | AFAQ Disadvantage |
|------------|----------------|-------------------|
| **Big 4 Consultant** | 100x cheaper, 10x faster | No brand trust, no human relationship |
| **DIY Templates** | Guided process, framework-aware | Costs money, unfamiliar tool |
| **Persefoni/OneTrust** | GCC-local, SME-priced | Less feature-rich, no enterprise pedigree |
| **ChatGPT** | Structured output, compliance logic | Not free, requires more setup |

**Moat:** Local framework detection + speed + price. These are defensible if executed well.

---

## 9. Final Recommendation

**Current State:** Product-market fit is *approaching* but not *achieved*. The free tier works. The paid tier conversion will be low until trust gaps are addressed.

**Go/No-Go:** **GO with fixes** — Don't scale marketing spend until:
1. Sample output preview is live
2. Landing page has procurement-specific variant
3. At least 3 UAE company testimonials with logos

**Expected Conversion Lift:** With these 3 fixes, estimate 2-3x improvement in free→paid conversion based on typical B2B SaaS patterns for trust-constrained buyers.

---

*Report generated from code review of AFAQ ESG platform (Feb 4, 2026)*  
*Persona: GCC Sustainability Manager, UAE SME, procurement-driven urgency*
