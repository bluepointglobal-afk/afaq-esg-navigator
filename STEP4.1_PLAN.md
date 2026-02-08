# Step 4.1: Disclosure Quality Upgrade - Roadmap & Flow

**Status**: Planned (Step 4.1 Phase)
**Goal**: Elevate disclosure quality from "AI draft" to "Investment Grade" by formalizing the intake and interpretation flow.

---

## 1. Updated Functional Flow

The disclosure generation process follows a 5-stage sequential flow:

1.  **Questionnaire (Existing)**: User completes the jurisdiction-specific ESG/Governance questions.
2.  **Score/Gaps (Existing)**: Engine calculates scores and identifies missing data or compliance gaps.
3.  **Narrative Intake (New)**: Structured intake screen where users provide free-text context for each pillar (Governance, ESG, Risk, Transparency).
4.  **AI Interpretation (Refined)**: The Edge Function ingests assessment data + user narratives to build a unified interpretation.
5.  **Professional Disclosure**: Output of the final report using the contract defined in `DISCLOSURE_OUTPUT_SPEC.md`.

---

## 2. Definition of "Pass" vs "Fail" Disclosure

To maintain the "quality bar," every disclosure is evaluated against a checklist.

### ✅ PASS (Ship-Ready)
*   **Completeness**: All 4 pillars have at least 250 words of narrative.
*   **Data Integrity**: At least 80% of required "Key Data Points" are populated from assessment results.
*   **Actionability**: Every pillar includes specific "Next Steps" for both the 0–90d and 3–12m horizons.
*   **Caveats**: "Data Limitations" section explicitly mentions any low-confidence assessment scores.
*   **Citations**: All regulatory references follow the `[SOURCE_REQUIRED: ...]` placeholder format.

### ❌ FAIL (Research Grade / Reject)
*   **Hallucinations**: AI-generated specific "Article Numbers" or "Laws" that aren't verified (must use placeholders).
*   **Generics**: Narratives that provide general ESG advice without referencing company-specific data.
*   **Gap Blindness**: Failure to mention high-severity gaps identified in the "Score/Gaps" phase.
*   **Tone**: Use of definitive compliance claims (e.g., "Company is 100% compliant") instead of hedged language.

---

## 3. Gating & Entitlements

| Feature | Free Tier | Pro/Enterprise Tier |
| :--- | :--- | :--- |
| **Questionnaire/Scoring** | ✅ Full Access | ✅ Full Access |
| **Narrative Intake** | ✅ Full Access | ✅ Full Access |
| **Disclosure Generation** | ❌ Locked (Upgrade UI) | ✅ Unlimited |
| **Disclosure Export** | ❌ Locked | ✅ Full Export |

> [!IMPORTANT]
> Narrative intake is intentionally kept free to encourage users to invest time in the platform (increasing stickiness) before asking for payment for the high-value "Interpretation and Disclosure" output.

---

## 4. Pillar Structure Overview
1.  **Governance**: Board oversight, ethical conduct, stakeholder rights.
2.  **ESG (Environmental/Social)**: Carbon footprint, diversity, community impact.
3.  **Risk Management**: Identification, mitigation strategies, board role.
4.  **Transparency**: Financial/non-financial reporting, anti-corruption.
