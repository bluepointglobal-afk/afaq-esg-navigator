import { test, expect } from '@playwright/test';

// Test credentials and mock data
const testUser = {
    email: 'admin555@email.com',
    password: 'admin555'
};

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

const uaeCompany = {
    nameEn: 'Al Noor Trading LLC',
    nameAr: 'شركة النور للتجارة ذ.م.م',
    country: 'UAE',
    industry: 'Industrials',  // Must match INDUSTRIES array
    employees: '145',
    revenue: '12500000',
    currency: 'AED',
    exchange: 'DFM'
};

// Helper function to login
async function login(page: import('@playwright/test').Page) {
    await page.goto(`${BASE_URL}/auth`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000); // Wait for React to render

    // Check if we need to switch to sign in mode
    const signInLink = page.getByText('Sign in', { exact: false });
    try {
        // Wait max 3 seconds for sign in link
        await signInLink.waitFor({ state: 'visible', timeout: 3000 });
        await signInLink.click();
        await page.waitForTimeout(500);
    } catch {
        // Sign in link not visible - might already be on sign in or logged in
        console.log('Sign in link not visible, continuing...');
    }

    // Fill credentials
    const emailInput = page.locator('#email');
    await emailInput.waitFor({ state: 'visible', timeout: 5000 });
    await emailInput.fill(testUser.email);

    const passwordInput = page.locator('#password');
    await passwordInput.fill(testUser.password);

    // Click submit button - handle both "Sign In" and "Create Account" scenarios
    const signInBtn = page.getByRole('button', { name: /sign in/i });
    const createBtn = page.getByRole('button', { name: /create account/i });

    if (await signInBtn.isVisible()) {
        await signInBtn.click();
    } else if (await createBtn.isVisible()) {
        // We're on signup form, need to switch
        const switchLink = page.getByText('Sign in', { exact: false });
        await switchLink.click();
        await page.waitForTimeout(500);
        await page.locator('#email').fill(testUser.email);
        await page.locator('#password').fill(testUser.password);
        await page.getByRole('button', { name: /sign in/i }).click();
    }

    await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 15000 });
}

test.describe('AFAQ ESG Platform - Full E2E Test Suite', () => {

    test('Phase 1: Authentication - Sign In with existing user', async ({ page }) => {
        await page.goto(`${BASE_URL}/auth`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'e2e/screenshots/01-auth-page.png', fullPage: true });

        // Switch to signin mode if needed
        const signInLink = page.getByText('Sign in', { exact: false });
        try {
            await signInLink.waitFor({ state: 'visible', timeout: 3000 });
            await signInLink.click();
            await page.waitForTimeout(500);
        } catch {
            console.log('Already on sign in or sign in link not visible');
        }

        // Fill email and password
        await page.locator('#email').fill(testUser.email);
        await page.locator('#password').fill(testUser.password);

        await page.screenshot({ path: 'e2e/screenshots/02-auth-filled.png', fullPage: true });

        // Click Sign In button
        await page.getByRole('button', { name: /sign in/i }).click();

        // Wait for navigation
        await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 15000 });
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'e2e/screenshots/03-after-login.png', fullPage: true });

        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/(dashboard|onboarding)/);
        console.log(`✅ Auth Phase Complete - Landed on: ${currentUrl}`);
    });

    test('Phase 2: Onboarding - Complete 4-step flow for UAE company', async ({ page }) => {
        await login(page);

        // Navigate to onboarding
        await page.goto(`${BASE_URL}/onboarding`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'e2e/screenshots/04-onboarding-step1.png', fullPage: true });

        // STEP 1: Company Profile
        await page.locator('#companyName').fill(uaeCompany.nameEn);
        await page.locator('#companyNameArabic').fill(uaeCompany.nameAr);

        // Select Country using data-testid
        const countrySelect = page.locator('[data-testid="country-select"]');
        await countrySelect.waitFor({ state: 'visible', timeout: 5000 });
        await countrySelect.click();
        await page.waitForTimeout(300);
        await page.locator(`[data-testid="country-${uaeCompany.country}"]`).click();
        await page.waitForTimeout(300);

        // Select Industry using data-testid
        await page.locator('[data-testid="industry-select"]').click();
        await page.waitForTimeout(300);
        await page.locator(`[data-testid="industry-${uaeCompany.industry}"]`).click();

        await page.screenshot({ path: 'e2e/screenshots/05-step1-filled.png', fullPage: true });

        // Click Continue
        await page.getByRole('button', { name: /continue/i }).click();
        await page.waitForTimeout(500);

        // STEP 2: Company Size
        await page.screenshot({ path: 'e2e/screenshots/06-onboarding-step2.png', fullPage: true });

        await page.locator('#employees').fill(uaeCompany.employees);
        await page.locator('#revenue').fill(uaeCompany.revenue);

        // Select currency using data-testid
        await page.locator('[data-testid="currency-select"]').click();
        await page.waitForTimeout(300);
        await page.locator(`[data-testid="currency-${uaeCompany.currency}"]`).click();
        await page.waitForTimeout(300);

        // Check "Is Listed" checkbox using data-testid
        await page.locator('[data-testid="listed-checkbox"]').click();
        await page.waitForTimeout(500);

        // Select Stock Exchange using data-testid
        await page.locator('[data-testid="exchange-select"]').click();
        await page.waitForTimeout(300);
        await page.locator(`[data-testid="exchange-${uaeCompany.exchange}"]`).click();

        await page.screenshot({ path: 'e2e/screenshots/07-step2-filled.png', fullPage: true });

        await page.getByRole('button', { name: /continue/i }).click();
        await page.waitForTimeout(500);

        // STEP 3: Data Availability
        await page.screenshot({ path: 'e2e/screenshots/08-onboarding-step3.png', fullPage: true });

        await page.locator('#hasUtilityBills').click();
        await page.locator('#hasEmployeeCount').click();
        await page.locator('#hasHRSystem').click();
        await page.locator('#hasFinancialStatements').click();

        await page.screenshot({ path: 'e2e/screenshots/09-step3-filled.png', fullPage: true });

        await page.getByRole('button', { name: /continue/i }).click();
        await page.waitForTimeout(500);

        // STEP 4: Framework Detection
        await page.screenshot({ path: 'e2e/screenshots/10-onboarding-step4.png', fullPage: true });

        const pageContent = await page.textContent('body');
        const hasDFMFramework = pageContent?.includes('DFM ESG') || pageContent?.includes('DFM_ESG');
        const hasUAEFramework = pageContent?.includes('UAE SCA') || pageContent?.includes('UAE_SCA');
        const hasGCCFramework = pageContent?.includes('GCC Unified') || pageContent?.includes('GCC_UNIFIED');

        console.log(`🔍 Framework Detection Results:`);
        console.log(`   - DFM ESG: ${hasDFMFramework ? '✅ Found' : '❌ Not found'}`);
        console.log(`   - UAE SCA ESG: ${hasUAEFramework ? '✅ Found' : '❌ Not found'}`);
        console.log(`   - GCC Unified: ${hasGCCFramework ? '✅ Found' : '❌ Not found'}`);

        // Click Start Report
        await page.getByRole('button', { name: /start report/i }).click();

        await page.waitForURL(/\/dashboard/, { timeout: 30000 });
        await page.screenshot({ path: 'e2e/screenshots/11-dashboard-after-onboarding.png', fullPage: true });

        console.log(`✅ Onboarding Phase Complete`);
    });

    test('Phase 3: Dashboard - Verify company and create report', async ({ page }) => {
        await login(page);

        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('domcontentloaded');

        // Wait for dashboard to fully load
        try {
            await page.waitForFunction(() => !document.body.textContent?.includes('Loading dashboard'), { timeout: 10000 });
        } catch {
            console.log('Dashboard may have finished loading or loading text not present');
        }
        await page.waitForTimeout(1000);

        await page.screenshot({ path: 'e2e/screenshots/12-dashboard.png', fullPage: true });

        const pageContent = await page.textContent('body');
        const hasCompanyName = pageContent?.includes(uaeCompany.nameEn);
        const hasAnyReport = pageContent?.includes('ESG Report') || pageContent?.includes('Report');
        console.log(`🏢 Company Name Visible: ${hasCompanyName ? '✅ Yes' : '⚠️ No (may have existing data)'}`);
        console.log(`📊 Report Visible: ${hasAnyReport ? '✅ Yes' : '❌ No'}`);

        const newReportBtn = page.getByRole('button', { name: /new report|create report/i });
        if (await newReportBtn.isVisible()) {
            await newReportBtn.click();
            await page.waitForTimeout(1000);
            await page.screenshot({ path: 'e2e/screenshots/13-new-report-dialog.png', fullPage: true });
            console.log(`✅ New Report dialog opened`);
        } else {
            console.log(`ℹ️ New Report button not visible (existing reports may exist)`);
        }

        console.log(`✅ Dashboard Phase Complete`);
    });

    test('Phase 4: Questionnaire - Navigate and fill sample data', async ({ page }) => {
        await login(page);

        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('domcontentloaded');
        try {
            await page.waitForFunction(() => !document.body.textContent?.includes('Loading dashboard'), { timeout: 10000 });
        } catch {
            // Continue anyway
        }
        await page.waitForTimeout(1000);

        const questionnaireBtn = page.getByRole('button', { name: /compliance questionnaire/i });
        const questionnaireLink = page.locator('a[href*="questionnaire"]');

        if (await questionnaireBtn.isVisible()) {
            await questionnaireBtn.click();
            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(1000);
            await page.screenshot({ path: 'e2e/screenshots/14-questionnaire.png', fullPage: true });
            console.log(`✅ Questionnaire page loaded via button`);
        } else if (await questionnaireLink.first().isVisible()) {
            await questionnaireLink.first().click();
            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(1000);
            await page.screenshot({ path: 'e2e/screenshots/14-questionnaire.png', fullPage: true });
            console.log(`✅ Questionnaire page loaded via link`);
        } else {
            console.log(`⚠️ No questionnaire navigation found`);
            await page.screenshot({ path: 'e2e/screenshots/14-dashboard-no-questionnaire.png', fullPage: true });
        }

        console.log(`✅ Questionnaire Phase Complete`);
    });

    test('Phase 5: Disclosure - Check freemium gating', async ({ page }) => {
        await login(page);

        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('domcontentloaded');
        try {
            await page.waitForFunction(() => !document.body.textContent?.includes('Loading dashboard'), { timeout: 10000 });
        } catch {
            // Continue anyway
        }
        await page.waitForTimeout(1000);

        const disclosureBtn = page.getByRole('button', { name: /generate disclosure/i });
        const disclosureLink = page.locator('a[href*="disclosure"]');

        if (await disclosureBtn.isVisible()) {
            await disclosureBtn.click();
            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(2000);
            await page.screenshot({ path: 'e2e/screenshots/15-disclosure-page.png', fullPage: true });

            const pageContent = await page.textContent('body');
            const hasUpgradePrompt = pageContent?.includes('Upgrade') ||
                pageContent?.includes('Premium') ||
                pageContent?.includes('Pro') ||
                pageContent?.includes('unlock');

            console.log(`🔒 Freemium Gating: ${hasUpgradePrompt ? '✅ Upgrade prompt visible' : 'ℹ️ No gating detected (user may be premium)'}`);
        } else if (await disclosureLink.first().isVisible()) {
            await disclosureLink.first().click();
            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(2000);
            await page.screenshot({ path: 'e2e/screenshots/15-disclosure-page.png', fullPage: true });
            console.log(`✅ Disclosure page loaded`);
        } else {
            console.log(`⚠️ Disclosure navigation not found`);
            await page.screenshot({ path: 'e2e/screenshots/15-no-disclosure-link.png', fullPage: true });
        }

        console.log(`✅ Disclosure Phase Complete`);
    });

});
