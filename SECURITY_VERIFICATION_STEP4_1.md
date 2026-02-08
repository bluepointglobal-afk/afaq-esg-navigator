# Security & QA Verification Guide (Step 4.1)

This document provides instructions for manual verification of multi-tenant isolation, entitlement gating, and disclosure safety guardrails.

## 1. Multi-Tenant Isolation (RLS)

### Objective
Ensure User A from Company A cannot read or write narratives/disclosures belonging to Company B.

### Setup
1. Identify/Create two test users:
   - **User A**: `user_a@example.com` (Company: `Company A`)
   - **User B**: `user_b@example.com` (Company: `Company B`)
2. Create a report for `Company A` with ID `REPORT_A`.

### Verification Steps (SQL Editor)
Run these commands in the Supabase SQL Editor:

```sql
-- 1. Assume identity of User B
-- (Replace USER_B_ID with the actual UUID of user_b)
SET request.jwt.claims = json_build_object('sub', 'USER_B_ID', 'role', 'authenticated')::text;

-- 2. Attempt to read Company A's narrative
SELECT * FROM report_narratives WHERE report_id = 'REPORT_A';
-- EXPECTED: 0 rows returned

-- 3. Attempt to insert into Company A's narrative
INSERT INTO report_narratives (report_id, governance_text) 
VALUES ('REPORT_A', 'Malicious edit');
-- EXPECTED: Error "new row violates row-level security policy"
```

---

## 2. Entitlement Gating (Free vs Pro)

### Objective
Verify that disclosure generation is restricted to Pro users.

### Verification Steps
1. **Free User Test**:
   - Log in as a user with `tier = 'free'`.
   - Navigate to `/compliance/disclosure/[ANY_ID]`.
   - **Expected**: "Upgrade to Pro" card is visible. The "Generate Disclosure" button should be hidden or trigger an upgrade modal.
2. **Pro User Test**:
   - Log in as a user with `tier = 'pro'`.
   - Navigate to the same URL.
   - **Expected**: "Generate Disclosure" button is visible and active. "Upgrade to Pro" card is hidden.

---

## 3. Narrative Data Quality & Safety

### Objective
Verify that the AI does not fabricate citations and handles missing data gracefully.

### Verification Steps
1. **Empty Narrative Verification**:
   - Create a report with **zero** answers in the questionnaire.
   - Generate a disclosure.
   - **Expected**: Each section should contain a paragraph stating: *"Information not provided for this section due to data limitations in the assessment."*
2. **Citation Integrity Verification**:
   - Inspect a generated narrative.
   - Search for regulatory references (e.g., "Corporate Governance Code").
   - **Expected**: Every regulatory reference must be immediately followed by or formatted as a placeholder: `[SOURCE_REQUIRED: Regulation Name, Article X]`.
   - **Failure Condition**: Any specific article number mentioned without the `[SOURCE_REQUIRED]` tag is a fail.

---

## 4. Regression Checklist

- [ ] Confirm `updated_at` trigger fires on `report_narratives` after manual SQL edit.
- [ ] Confirm `report_narratives` is deleted when the parent `report` is deleted (Cascade).
- [ ] Confirm Arabic narratives are generated alongside English (toggle works).
