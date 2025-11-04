/**
 * Quick Error Detection Script
 *
 * This script quickly checks if the app has any JavaScript console errors.
 * Perfect for rapid iteration - returns exit code 0 if clean, 1 if errors.
 *
 * Usage: node tests/check-errors.mjs
 */

import { chromium } from 'playwright';

const URL = 'http://localhost:5175/';
const TIMEOUT = 10000; // 10 seconds

async function checkForErrors() {
  let browser;
  let hasErrors = false;
  const errors = [];

  try {
    // Launch browser
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        hasErrors = true;
        errors.push(msg.text());
      }
    });

    // Listen for page errors (uncaught exceptions)
    page.on('pageerror', error => {
      hasErrors = true;
      errors.push(`Uncaught exception: ${error.message}`);
    });

    // Navigate to the page
    console.log(`🔍 Checking ${URL} for errors...`);
    await page.goto(URL, { waitUntil: 'networkidle', timeout: TIMEOUT });

    // Wait a bit for React to initialize
    await page.waitForTimeout(2000);

    // Check results
    if (hasErrors) {
      console.log('\n❌ Console Errors Found:\n');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
      console.log('\n🐛 Fix needed!\n');
      process.exit(1);
    } else {
      console.log('✅ No console errors detected\n');
      process.exit(0);
    }

  } catch (error) {
    console.error(`\n❌ Test Failed: ${error.message}\n`);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

checkForErrors();
