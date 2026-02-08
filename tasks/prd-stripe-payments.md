# PRD: Stripe Payment Integration

## Overview
Enable paid tier upgrades via Stripe Checkout for AFAQ ESG Platform.

## Scope
- Per-report payment ($99)
- Annual subscription ($299/year)
- Checkout flow
- Webhook handling
- Tier upgrade on successful payment

## User Stories

### Story 1: Checkout Session Creation
**As a** free tier user
**I want to** click an upgrade button
**So that** I can start the Stripe Checkout flow

**Acceptance Criteria:**
- Upgrade button on Pricing page and UpgradePrompt component
- Clicking initiates Stripe Checkout session via Edge Function
- Redirects to Stripe-hosted checkout page
- Support both per-report and annual subscription options

### Story 2: Webhook Processing
**As the** system
**When** Stripe sends a checkout.session.completed webhook
**Then** update user_profiles.tier to 'pro'

**Acceptance Criteria:**
- Edge Function receives and verifies Stripe webhook
- Updates user tier in database
- Handles subscription vs one-time payment

### Story 3: Success/Cancel Pages
**As a** user completing checkout
**I want to** see a confirmation page
**So that** I know my payment was successful

**Acceptance Criteria:**
- /payment/success route shows confirmation
- /payment/cancel route allows retry
- Auto-redirect to disclosure page after success

## Technical Approach

### Dependencies to Add
- `@stripe/stripe-js` (frontend)

### Files to Create
1. `supabase/functions/create-checkout/index.ts` - Create Stripe checkout session
2. `supabase/functions/stripe-webhook/index.ts` - Handle webhook events
3. `src/pages/PaymentSuccess.tsx` - Success confirmation page
4. `src/pages/PaymentCancel.tsx` - Cancel/retry page
5. `src/hooks/use-checkout.ts` - Checkout mutation hook

### Files to Modify
1. `src/components/landing/Pricing.tsx` - Wire up checkout buttons
2. `src/components/assessment/UpgradePrompt.tsx` - Wire up checkout
3. `src/App.tsx` - Add payment routes

### Environment Variables
```
STRIPE_SECRET_KEY=sk_test_xxx (Edge Function secret)
STRIPE_WEBHOOK_SECRET=whsec_xxx (Edge Function secret)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx (frontend)
```

## Out of Scope
- Subscription management portal (future)
- Refunds UI (handle via Stripe dashboard)
- Invoice customization
- Multiple currencies (USD only for MVP)

## Success Metrics
- Checkout flow completes without errors
- Tier upgrades immediately after payment
- Disclosure page accessible after upgrade

---
*PRD Version: 1.0 | Created: 2026-01-17*
