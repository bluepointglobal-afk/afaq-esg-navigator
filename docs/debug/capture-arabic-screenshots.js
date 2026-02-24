#!/usr/bin/env node

/**
 * Script to capture screenshots of Arabic content
 * for AFAQ ESG Navigator
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function captureScreenshots() {
  console.log('Starting screenshot capture...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    locale: 'ar-SA',
  });
  
  const page = await context.newPage();
  
  try {
    // 1. Homepage - English version
    console.log('Navigating to homepage (English)...');
    await page.goto('https://afaq-esg-navigator.vercel.app', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: 'screenshots/01-homepage-english.png',
      fullPage: false 
    });
    console.log('✓ Captured homepage (English)');
    
    // 2. Click language toggle to Arabic
    console.log('Switching to Arabic...');
    await page.click('button:has-text("عربي")');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'screenshots/02-homepage-arabic-hero.png',
      fullPage: false 
    });
    console.log('✓ Captured homepage (Arabic - Hero section)');
    
    // 3. Scroll down to see trust indicators
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: 'screenshots/03-homepage-arabic-trust-indicators.png',
      fullPage: false 
    });
    console.log('✓ Captured trust indicators (Arabic)');
    
    // 4. Navigate to Sample Report
    console.log('Navigating to Sample Report...');
    await page.click('button:has-text("عرض تقرير نموذجي")');
    await page.waitForTimeout(3000);
    await page.screenshot({ 
      path: 'screenshots/04-sample-report-arabic-header.png',
      fullPage: false 
    });
    console.log('✓ Captured Sample Report header (Arabic)');
    
    // 5. Scroll to show first section
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: 'screenshots/05-sample-report-arabic-sections.png',
      fullPage: false 
    });
    console.log('✓ Captured Sample Report sections (Arabic)');
    
    // 6. Full page screenshot of sample report
    await page.screenshot({ 
      path: 'screenshots/06-sample-report-arabic-full.png',
      fullPage: true 
    });
    console.log('✓ Captured Sample Report full page (Arabic)');
    
    console.log('\n✅ All screenshots captured successfully!');
    console.log('Screenshots saved to: screenshots/');
    
  } catch (error) {
    console.error('❌ Error capturing screenshots:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Run the capture
captureScreenshots()
  .then(() => {
    console.log('\n🎉 Screenshot capture complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Screenshot capture failed:', error);
    process.exit(1);
  });
