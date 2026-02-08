import { test, expect } from '@playwright/test';

function uniqueEmail() {
    const ts = Date.now();
    return `qa.test.${ts}@afaq.test`;
}

const BASE_URL = 'http://localhost:8080';

test.describe('AFAQ ESG Platform – Full E2E QA + SME Review', () => {
    test('Authentication flow', async ({ page }) => {
        await page.goto(`${BASE_URL}/auth`);
        const signUpTab = page.getByRole('tab', { name: /sign up/i });
        if (await signUpTab.isVisible()) await signUpTab.click();
        const email = uniqueEmail();
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', 'TestPass123!');
        await page.click('button:has-text("Submit"), button:has-text("Sign Up")');
        await expect(page).toHaveURL(/\/onboarding/);

        await page.goto(`${BASE_URL}/auth`);
        const signInTab = page.getByRole('tab', { name: /sign in/i });
        if (await signInTab.isVisible()) await signInTab.click();
        await page.fill('input[name="email"]', 'admin555@email.com');
        await page.fill('input[name="password"]', 'admin555');
        await page.click('button:has-text("Submit"), button:has-text("Sign In")');
        await expect(page).toHaveURL(/\/(dashboard|onboarding)/);
    });

    test('Onboarding – UAE listed SME', async ({ page }) => {
        await page.goto(`${BASE_URL}/onboarding`);
        await page.fill('input[name="companyNameEn"]', 'Al Noor Trading LLC');
        await page.fill('input[name="companyNameAr"]', 'شركة النور للتجارة ذ.م.م');
        await page.selectOption('select[name="country"]', { label: 'UAE' });
        await page.selectOption('select[name="industry"]', { label: 'Manufacturing' });
        await page.click('button:has-text("Next"), button:has-text("Continue")');
        await page.fill('input[name="employeeCount"]', '145');
        await page.fill('input[name="annualRevenue"]', '12500000');
        await page.selectOption('select[name="currency"]', { label: 'AED' });
        await page.check('input[name="listed"][value="yes"]');
        await page.selectOption('select[name="exchange"]', { label: 'DFM' });
        await page.click('button:has-text("Next"), button:has-text("Continue")');
        await page.check('input[name="dataUtilityBills"]');
        await page.check('input[name="dataHRSystem"]');
        await page.click('button:has-text("Next"), button:has-text("Continue")');
        const frameworkList = page.locator('[data-test-id="detected-frameworks"]');
        await expect(frameworkList).toBeVisible();
        await expect(frameworkList).toContainText(/ADX ESG/i);
        await page.click('button:has-text("Start Report"), button:has-text("Continue")');
        await expect(page).toHaveURL(/\/dashboard/);
    });

    test('Dashboard – create new report', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await expect(page.locator('text=Al Noor Trading LLC')).toBeVisible();
        await page.click('button:has-text("New Report")');
        await page.selectOption('select[name="reportYear"]', { label: '2024' });
        await page.click('button:has-text("Create"), button:has-text("Confirm")');
        await expect(page.locator('a', { hasText: '2024' })).toBeVisible();
    });

    test('Questionnaire – sample answers & progress', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.click('a:has-text("2024")');
        await page.click('a:has-text("Questionnaire")');
        await page.check('input[name="ghgScopeTracked"][value="yes"]');
        await expect(page.locator('input[name="employeeCount"]')).toHaveValue('145');
        await page.fill('input[name="boardIndependence"]', '40');
        const progress = page.locator('[role="progressbar"]');
        await expect(progress).toHaveAttribute('aria-valuenow', /[1-9][0-9]?/);
    });

    test('Compliance Results – score calculation', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.click('a:has-text("2024")');
        await page.click('a:has-text("Results")');
        await expect(page.locator('[data-test-id="score-E"]')).toBeVisible();
        await expect(page.locator('[data-test-id="score-S"]')).toBeVisible();
        await expect(page.locator('[data-test-id="score-G"]')).toBeVisible();
        await expect(page.locator('text=Mandatory')).toBeVisible();
    });

    test('Disclosure – freemium gating', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.click('a:has-text("2024")');
        await page.click('a:has-text("Disclosure")');
        await expect(page.locator('text=Upgrade to Pro')).toBeVisible();
        await expect(page.locator('button:has-text("Generate")')).toBeDisabled();
    });
});
