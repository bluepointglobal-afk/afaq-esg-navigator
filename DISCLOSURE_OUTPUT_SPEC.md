# Disclosure Output Specification (Step 4.1)

**Version**: 1.1
**Objective**: Define the required schema and content structure for investment-grade ESG disclosures.

---

## 1. Global Core Schema

Every generated disclosure must include the following global metadata:
- `disclosure_id`: Unique UUID.
- `report_id`: Reference to the source report.
- `generated_at`: ISO timestamp.
- `jurisdiction`: [UAE, KSA, Qatar].
- `listing_status`: [Listed, Non-Listed].

---

## 2. Pillar Subsections (Core Contract)

Each of the four pillars (**Governance, ESG, Risk, Transparency**) MUST contain the following subsections in the output:

### A. Current Posture
- **Definition**: A narrative summary of existing policies, committees, and practices based on user answers and metrics.
- **Goal**: Establish the "As-Is" state.

### B. Gaps & Implications
- **Definition**: Explicit mention of missing data or non-compliance areas identified during assessment.
- **Goal**: Transparency regarding weaknesses.

### C. Next Steps (Roadmap)
- **Short-Term (0–90d)**: Specific, high-priority actions to address critical gaps.
- **Medium-Term (3–12m)**: Strategic improvements and evidence-building tasks.

### D. Key Data Points
- **Definition**: A table/list of specific metrics (e.g., % independent directors, energy consumption totals) extracted directly from `metric_data`.

### E. Data Limitations
- **Definition**: Disclosure of where data was estimated, self-reported without evidence, or is entirely missing.

### F. Citations Placeholder
- **Format**: `[SOURCE_REQUIRED: {Regulator} {Code/Law} Section X]`
- **Constraint**: No specific article numbers unless verified by the Regulatory Knowledge Pack (Step 6+).

---

## 3. Pillar-Specific Requirements

| Pillar | Required Data Points (Examples) |
| :--- | :--- |
| **Governance** | Board size, % Independent, Meeting frequency, Code of Ethics presence. |
| **ESG** | Total Emissions (Scope 1/2), Water usage, Employee turnover, Gender pay gap. |
| **Risk** | Risk committee presence, Mitigation process, Cyber-security protocol. |
| **Transparency** | Audit firm name, Reporting frequency, Conflict of Interest policy. |

---

## 4. Technical Constraints (Claude Prompting)

The Edge Function prompt must enforce:
1.  **Strict JSON Output**: Return an array of `DisclosureSection` objects.
2.  **Word Count**: 250–500 words for the combined narrative parts of each section.
3.  **Tone**: Professional, formal, GCC-focused corporate language.
4.  **Bilingual**: Parallel `content_en` and `content_ar` fields for all narratives and labels.
