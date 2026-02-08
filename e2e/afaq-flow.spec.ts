import { test, expect } from '@playwright/test';

// Mock data
const testUser = {
  email: 'admin555@email.com',
  password: 'admin555'
};

const uaeCompany = {
  nameEn: 'Al Noor Trading LLC',
  nameAr: 'شركة النور للتجارة ذ.م.م',
  country: 'UAE',
  industry: 'Manufacturing',
  employees: '145',
  revenue: '12500000',
  currency: 'AED',
  listed: true,
  exchange: 'DFM'
};

test.describe('AFAQ ESG Platform E2E', () => {
  
  test('1. Authentication - Sign In', async ({ page }) => {
    await page.goto('http://localhost:8080/auth');
    await page.screenshot({ path: 'e2e/screenshots/01-auth-page.png' });
    
    // Fill login form - adjust selectors based on actual UI
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/password/i).fill(testUser.password);
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should redirect to dashboard or onboarding
    await expect(page).toHaveURL(/\/(dashboard|onboarding)/);
    await page.screenshot({ path: 'e2e/screenshots/02-after-login.png' });
  });

  test('2. Onboarding - Company Profile', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:8080/auth');
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/password/i).fill(testUser.password);
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Navigate to onboarding if not redirected
    await page.goto('http://localhost:8080/onboarding');
    await page.screenshot({ path: 'e2e/screenshots/03-onboarding-start.png' });
    
    // Step 1: Company basics
    await page.getByLabel(/company name/i).first().fill(uaeCompany.nameEn);
    await page.screenshot({ path: 'e2e/screenshots/04-onboarding-filled.png' });
  });

  test('3. Dashboard - Load and Create Report', async ({ page }) => {
    await page.goto('http://localhost:8080/auth');
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/password/i).fill(testUser.password);
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await page.goto('http://localhost:8080/dashboard');
    await expect(page.locator('body')).toBeVisible();
    await page.screenshot({ path: 'e2e/screenshots/05-dashboard.png' });
  });

});
