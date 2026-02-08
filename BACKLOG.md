# AFAQ ESG Platform - Production Backlog

**Updated**: January 18, 2026
**Scope**: LOCKED

---

## Priority Backlog

| # | Feature | Value | Effort | Status |
|---|---------|-------|--------|--------|
| 1 | **Sustainability Report Generator** | CRITICAL | 1 week | **NEXT** |
| 2 | AI Benchmark Engine | HIGH | 2 weeks | Backlog |
| 3 | Custom Branding (Enterprise) | MEDIUM | 1 week | Backlog |
| 4 | API Access (Enterprise) | MEDIUM | 2 weeks | Backlog |

---

## #1 Feature: Sustainability Report Generator

### Problem
Current disclosure generates AI narratives only. Users need a **complete sustainability report** like expensive consultants produce:
- Structured narrative sections (Executive Summary, E/S/G sections, Methodology)
- Disclosure requirements mapped to jurisdiction
- Data annex tables at the end (GRI-style format)

### Solution
Enhance disclosure output to generate a full **Sustainability Report** with:

1. **Report Structure**
   - Executive Summary
   - Environmental Section (with metrics)
   - Social Section (with metrics)
   - Governance Section (with metrics)
   - Methodology & Scope
   - Data Annex (tables)

2. **Disclosure Mapping**
   - Map each section to jurisdiction requirements
   - Show which disclosures are addressed
   - Highlight gaps/omissions

3. **Data Annex**
   - Tabular format like GRI
   - Metric code, description, value, unit
   - Reference to report section

### Acceptance Criteria
- [ ] Report template with structured sections
- [ ] Executive summary auto-generated
- [ ] E/S/G sections with narrative + metrics
- [ ] Data annex with GRI-style tables
- [ ] PDF export maintains structure
- [ ] Build passes, tests pass

---

## Shipped Features (This Session)

| Feature | Status |
|---------|--------|
| PDF Export | ✅ |
| Excel Export | ✅ |
| Data Tier UX | ✅ |
| Gap Dashboard | ✅ |
| Multi-language UI | ✅ |

---

*Total shipped: 5 features*
