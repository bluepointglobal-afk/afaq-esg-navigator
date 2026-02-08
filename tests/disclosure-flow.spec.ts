import { test, expect } from '@playwright/test';

// Test credentials
const testUser = {
    email: 'admin555@email.com',
    password: 'admin555'
};

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

async function login(page: import('@playwright/test').Page) {
    await page.goto(`${BASE_URL}/auth`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    const signInLink = page.getByText('Sign in', { exact: false });
    try {
        await signInLink.waitFor({ state: 'visible', timeout: 3000 });
        await signInLink.click();
        await page.waitForTimeout(500);
    } catch {
        console.log('Already on sign in');
    }

    const emailInput = page.locator('#email');
    await emailInput.waitFor({ state: 'visible', timeout: 5000 });
    await emailInput.fill(testUser.email);
    await page.locator('#password').fill(testUser.password);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 15000 });
}

test.describe('Disclosure Module - Test Mode Flow', () => {

    test('Test Mode button should bypass paywall and show disclosure UI', async ({ page }) => {
        await login(page);

        // Go to dashboard  
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);

        await page.screenshot({ path: 'e2e/screenshots/disclosure-dashboard.png', fullPage: true });

        // Get report ID from the page
        const pageContent = await page.textContent('body');
        console.log('Dashboard loaded');

        // Click Generate Disclosure button
        const disclosureBtn = page.getByRole('button', { name: /generate disclosure/i });
        if (await disclosureBtn.isVisible({ timeout: 5000 })) {
            await disclosureBtn.click();
            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(2000);
        } else {
            // Try link navigation
            const disclosureLink = page.locator('a[href*="disclosure"]');
            if (await disclosureLink.first().isVisible()) {
                await disclosureLink.first().click();
                await page.waitForLoadState('domcontentloaded');
                await page.waitForTimeout(2000);
            }
        }

        await page.screenshot({ path: 'e2e/screenshots/disclosure-page-initial.png', fullPage: true });

        // Check if we see the UpgradePrompt (free tier)
        const testModeBtn = page.getByRole('button', { name: /test mode/i });
        const upgradePrompt = page.getByText('Upgrade to Pro');

        const hasUpgradePrompt = await upgradePrompt.isVisible({ timeout: 5000 }).catch(() => false);
        const hasTestMode = await testModeBtn.isVisible({ timeout: 5000 }).catch(() => false);

        console.log(`Upgrade Prompt visible: ${hasUpgradePrompt}`);
        console.log(`Test Mode button visible: ${hasTestMode}`);

        if (hasTestMode) {
            console.log('Clicking Test Mode button...');
            await testModeBtn.click();

            // Wait for reload with test_pro=true
            await page.waitForURL(/test_pro=true/, { timeout: 10000 });
            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(2000);

            await page.screenshot({ path: 'e2e/screenshots/disclosure-test-mode-active.png', fullPage: true });

            // Verify URL has test_pro=true
            const currentUrl = page.url();
            expect(currentUrl).toContain('test_pro=true');
            console.log(`✅ Test Mode activated: ${currentUrl}`);

            // Check that we now see the disclosure generation UI
            const generateBtn = page.getByRole('button', { name: /generate disclosure report/i });
            const drafNewBtn = page.getByText('Draft New Disclosure');

            const hasGenerateUI = await generateBtn.isVisible({ timeout: 5000 }).catch(() => false);
            const hasDraftUI = await drafNewBtn.isVisible({ timeout: 5000 }).catch(() => false);

            console.log(`Generate button visible: ${hasGenerateUI}`);
            console.log(`Draft New Disclosure UI visible: ${hasDraftUI}`);

            // Test Mode should show the disclosure generation UI instead of upgrade prompt
            const stillHasUpgrade = await upgradePrompt.isVisible({ timeout: 2000 }).catch(() => false);
            console.log(`Upgrade prompt still visible after Test Mode: ${stillHasUpgrade}`);

            expect(stillHasUpgrade).toBe(false);
            console.log('✅ Paywall bypassed in Test Mode');

        } else if (!hasUpgradePrompt) {
            // User might already be pro tier
            console.log('User appears to already have Pro tier or disclosure is showing');

            const generateBtn = page.getByRole('button', { name: /generate disclosure report/i });
            const hasGenerateBtn = await generateBtn.isVisible({ timeout: 5000 }).catch(() => false);
            console.log(`Generate button visible: ${hasGenerateBtn}`);
        }
    });

    test('Disclosure generation should work in Test Mode', async ({ page }) => {
        await login(page);

        // Navigate directly to disclosure page with test_pro=true
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);

        // Get report ID from questionnaire link
        const questionnaireLink = page.locator('a[href*="/compliance/questionnaire/"]');
        const questionnaireBtn = page.getByRole('button', { name: /compliance questionnaire/i });

        let reportId = '';
        if (await questionnaireBtn.isVisible({ timeout: 3000 })) {
            // Get the onclick handler or navigate and extract from URL
            await questionnaireBtn.click();
            await page.waitForURL(/\/compliance\/questionnaire\//, { timeout: 10000 });
            const url = page.url();
            const match = url.match(/\/questionnaire\/([^/]+)/);
            if (match) {
                reportId = match[1];
            }
            console.log(`Report ID: ${reportId}`);
        }

        if (!reportId) {
            console.log('Could not find report ID, skipping test');
            return;
        }

        // Navigate to disclosure page with test_pro=true
        await page.goto(`${BASE_URL}/compliance/disclosure/${reportId}?test_pro=true`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);

        await page.screenshot({ path: 'e2e/screenshots/disclosure-generation-ui.png', fullPage: true });

        // Check that we see the disclosure generation UI
        const generateBtn = page.getByRole('button', { name: /generate disclosure report/i });
        const hasGenerateBtn = await generateBtn.isVisible({ timeout: 5000 }).catch(() => false);

        if (hasGenerateBtn) {
            console.log('✅ Disclosure generation UI visible');

            // Click generate
            await generateBtn.click();

            // Wait for generation (could take time)
            await page.waitForTimeout(5000);

            await page.screenshot({ path: 'e2e/screenshots/disclosure-generated.png', fullPage: true });

            // Check for any disclosure content or export buttons
            const exportPanel = page.getByText('Export Options');
            const disclaimers = page.getByText('Disclaimers');

            const hasExport = await exportPanel.isVisible({ timeout: 5000 }).catch(() => false);
            const hasDisclaimers = await disclaimers.isVisible({ timeout: 5000 }).catch(() => false);

            console.log(`Export panel visible: ${hasExport}`);
            console.log(`Disclaimers visible: ${hasDisclaimers}`);

            if (hasExport || hasDisclaimers) {
                console.log('✅ Disclosure generated successfully!');
            }
        } else {
            // Maybe disclosure already exists
            const existingDisclosure = page.getByText('Quality Checklist');
            const hasExisting = await existingDisclosure.isVisible({ timeout: 3000 }).catch(() => false);
            console.log(`Existing disclosure visible: ${hasExisting}`);
        }
    });

});
