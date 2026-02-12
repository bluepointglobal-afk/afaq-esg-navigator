# Test Users for AFAQ ESG Navigator

## Quick Access

**Login URL**: https://afaq-esg-navigator.vercel.app/auth

All test users have the same password: `Test123!@#`

---

## Available Test Accounts

### 1. Ahmed Al-Rashid (Saudi Manufacturing CFO)
- **Email**: `ahmed@alfahad.sa`
- **Password**: `Test123!@#`
- **Company**: Al-Fahad Manufacturing (شركة الفهد للصناعة)
- **Industry**: Manufacturing
- **Employees**: 180
- **Revenue**: SAR 45M
- **Listing**: Tadawul listed
- **Use Case**: Test Tadawul ESG compliance, Saudi-specific frameworks

---

### 2. Fatima Al-Mansoori (UAE Tech Sustainability Manager)
- **Email**: `fatima@gulftech.ae`
- **Password**: `Test123!@#`
- **Company**: Gulf Tech Solutions (حلول الخليج التقنية)
- **Industry**: Technology
- **Employees**: 95
- **Revenue**: AED 28M
- **Listing**: Not listed
- **Use Case**: Test non-listed company flow, UAE frameworks

---

### 3. Generic Test User
- **Email**: `test@afaq.local`
- **Password**: `Test123!@#`
- **Company**: Demo Corporation (الشركة التجريبية)
- **Industry**: Energy & Utilities
- **Employees**: 250
- **Revenue**: SAR 120M
- **Listing**: Tadawul listed
- **Use Case**: General testing, walkthroughs, demos

---

## Creating Test Users

### Prerequisites
1. Supabase service role key (from Dashboard → Settings → API)
2. Add to `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
   ```

### Run Script
```bash
npx tsx scripts/create-test-users.ts
```

The script will:
1. Create auth users in Supabase Auth
2. Create company records in `companies` table
3. Link users to companies in `user_profiles` table
4. Skip users that already exist

---

## Manual Testing Flow

### 1. Fresh User Signup
1. Go to `/auth`
2. Click "Create one"
3. Enter email, password, full name
4. Click "Create Account"
5. Should redirect to `/onboarding`
6. Complete 4-step onboarding
7. Should see personalized dashboard with company name

### 2. Existing User Login
1. Go to `/auth`
2. Enter test credentials above
3. Click "Sign In"
4. Should redirect to `/dashboard`
5. Verify company name matches test user's company

### 3. Test Data Isolation (CRITICAL)
1. Login as Ahmed (ahmed@alfahad.sa)
2. Note company name: "Al-Fahad Manufacturing"
3. Logout
4. Login as Fatima (fatima@gulftech.ae)
5. Verify company name changed to: "Gulf Tech Solutions"
6. ✅ PASS if names are different (data isolated)
7. ❌ FAIL if same name shown (P0-1 bug regression)

### 4. Test Protected Routes
1. Open incognito window
2. Navigate to: `/dashboard`
3. Should redirect to `/auth` (not show dashboard)
4. Login with test user
5. Should now see dashboard

### 5. Test Questionnaire Flow
1. Login as test user
2. Go to `/dashboard`
3. Click "Start New Assessment"
4. Should redirect to `/compliance/questionnaire/:reportId`
5. Verify:
   - Progress bar shows 0%
   - Time estimate shows (~N min remaining)
   - Company profile loaded (not "Failed to initialize")
6. Answer 3-5 questions
7. Wait for auto-save (check for "Saved" indicator)
8. Refresh page
9. Verify answers persisted

---

## Troubleshooting

### "Failed to initialize questionnaire"
- **Cause**: User has no company profile
- **Fix**: Complete onboarding first at `/onboarding`

### "Not authenticated" error
- **Cause**: Session expired or not logged in
- **Fix**: Login at `/auth`

### "Company not found"
- **Cause**: User profile exists but no company linked
- **Fix**: Re-run `create-test-users.ts` script to create company

### Wrong company name showing
- **Cause**: P0-1 data isolation bug regression
- **Fix**: Check `use-company.ts` - should NOT return demo company for authenticated users

---

## Security Notes

⚠️ **Production Safety**:
- Test users use weak passwords (`Test123!@#`)
- Delete test accounts before production launch
- Use strong passwords for real users
- Enable MFA for admin accounts

🔒 **Data Isolation**:
- Each user sees ONLY their company's data
- RLS policies enforce isolation at database level
- Test by logging in as different users

---

## Database Schema Reference

### `companies` table
- `id` (uuid, PK)
- `name` (text)
- `name_arabic` (text)
- `country` (text)
- `industry` (text)
- `employee_count` (int)
- `annual_revenue` (numeric)
- `revenue_currency` (text)
- `is_listed` (boolean)
- `stock_exchange` (text)

### `user_profiles` table
- `id` (uuid, PK, FK to auth.users)
- `email` (text)
- `company_id` (uuid, FK to companies)
- `role` (text)
- `tier` (text: 'free' | 'pro' | 'enterprise')

### `reports` table
- `id` (uuid, PK)
- `company_id` (uuid, FK to companies)
- `reporting_year` (int)
- `status` (text)

### `questionnaire_responses` table
- `id` (uuid, PK)
- `report_id` (uuid, FK to reports)
- `template_id` (uuid)
- `answers` (jsonb)

---

## Walker Testing with Test Users

When running M2M walker evaluations:

1. **Use real auth flow** (not demo mode)
2. **Test with Ahmed's account** (KSA CFO persona)
3. **Verify data isolation** (company name matches)
4. **Test full flow**: signup → onboarding → questionnaire → disclosure
5. **Check time estimates** work correctly
6. **Verify SAR pricing** displays

Expected walker score after Sprint 0,1,2: **7.0+/10** (up from 4.0)
