# MVP Smoke Test Script: Step 4.1 (Disclosure Quality)

**Goal**: Verify the end-to-end flow from questionnaire to disclosure generation, ensuring the quality bar and gating logic are enforced.

---

## Prerequisites
- User is logged in.
- A company profile exists with jurisdiction (UAE/KSA/Qatar) and listing status.
- Anthropic API key is configured in Supabase Edge Functions.

---

## Test Cases

### 1. The Intake Flow (Free Tier)
1.  **Navigate** to `/compliance/questionnaire/:reportId`.
2.  **Complete** at least one question in each pillar (Governance, ESG, Risk, Transparency).
3.  **Navigate** to `/compliance/results/:reportId`.
4.  **Verify** scores and gaps are displayed.
5.  **Click** "Next: Narrative Intake".
6.  **Verify** the Narrative Intake screen loads and allows free-text entry for all 4 pillars.
7.  **Enter** sample text (e.g., "Our board consists of 5 members with diverse backgrounds...") and click **Save**.
8.  **Verify** redirect to `/compliance/disclosure/:reportId`.
9.  **Verify** "Upgrade Required" prompt is visible (since the user is in the Free tier).

---

### 2. Disclosure Generation (Paid Tier)
1.  **Simulate/Set** user tier to `pro` or `enterprise`.
2.  **Navigate** to `/compliance/disclosure/:reportId`.
3.  **Verify** the "Generate Disclosure" button is visible and NOT the upgrade prompt.
4.  **Click** "Generate Disclosure".
5.  **Wait** for the progress indicator (Edge Function call).
6.  **Verify** the resulting document renders 4 sections (Governance, ESG, Risk, Transparency).

---

### 3. Quality Bar Validation
For each section in the generated disclosure, **Verify**:
1.  **Narrative Length**: Content appears descriptive (not just a single sentence).
2.  **GCC Context**: Text mentions the specific jurisdiction (e.g., "In the UAE...").
3.  **Subsections Present**:
    - [ ] Current Posture
    - [ ] Gaps & Implications
    - [ ] Next Steps (0–90d and 3–12m)
    - [ ] Key Data Points
4.  **Citations**: Regulatory references are in the placeholder format `[SOURCE_REQUIRED: ...]`.
5.  **Bilingual Toggle**: Switching to "Arabic" updates all headings and narratives correctly.

---

### 4. Persistence & Export
1.  **Refresh** the page.
2.  **Verify** the disclosure persists (fetched from `disclosure_outputs` table, not re-generated).
3.  **Click** "Download JSON".
4.  **Verify** the downloaded file follows the structure defined in `DISCLOSURE_OUTPUT_SPEC.md`.

---

## Success Criteria
- ✅ Flow remains unbroken from start to finish.
- ✅ Free users can provide narratives but cannot generate the report.
- ✅ Paid users receive a structured, pillar-based report with roadmap and placeholders.
