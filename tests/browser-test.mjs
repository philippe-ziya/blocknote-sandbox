/**
 * Full Browser Test Script
 *
 * This script performs comprehensive testing:
 * - Captures screenshots
 * - Checks for DOM elements
 * - Tests interactions
 * - Provides detailed error reporting
 *
 * Usage: node tests/browser-test.mjs
 */

import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const URL = 'http://localhost:5175/';
const TIMEOUT = 15000; // 15 seconds
const SCREENSHOTS_DIR = './tests/screenshots';

async function runBrowserTest() {
  let browser;
  let testsPassed = 0;
  let testsFailed = 0;
  const errors = [];

  try {
    // Ensure screenshots directory exists
    if (!existsSync(SCREENSHOTS_DIR)) {
      await mkdir(SCREENSHOTS_DIR, { recursive: true });
    }

    // Launch browser
    console.log('🚀 Launching browser...\n');
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    // Listen for console messages
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text()
      });

      if (msg.type() === 'error') {
        errors.push(`Console Error: ${msg.text()}`);
      }
    });

    // Listen for page errors
    page.on('pageerror', error => {
      errors.push(`Uncaught Exception: ${error.message}\n${error.stack}`);
    });

    // Test 1: Navigate to page
    console.log('📋 Test 1: Navigate to page');
    try {
      await page.goto(URL, { waitUntil: 'networkidle', timeout: TIMEOUT });
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/01-initial-load.png` });
      console.log('✅ Page loaded\n');
      testsPassed++;
    } catch (error) {
      console.log(`❌ Failed: ${error.message}\n`);
      testsFailed++;
      errors.push(`Navigation failed: ${error.message}`);
    }

    // Wait for React to initialize
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/02-after-react-init.png` });

    // Test 2: Check for app container
    console.log('📋 Test 2: Check for app container');
    try {
      const appElement = await page.locator('.app').first();
      const isVisible = await appElement.isVisible({ timeout: 5000 }).catch(() => false);

      if (isVisible) {
        console.log('✅ App container found\n');
        testsPassed++;
      } else {
        console.log('❌ App container not visible\n');
        testsFailed++;
        errors.push('App container (.app) not visible');
      }
    } catch (error) {
      console.log(`❌ Failed: ${error.message}\n`);
      testsFailed++;
      errors.push(`App container check failed: ${error.message}`);
    }

    // Test 3: Check for header
    console.log('📋 Test 3: Check for header');
    try {
      const headerElement = await page.locator('.app-header').first();
      const isVisible = await headerElement.isVisible({ timeout: 5000 }).catch(() => false);

      if (isVisible) {
        console.log('✅ Header found\n');
        testsPassed++;
      } else {
        console.log('❌ Header not visible\n');
        testsFailed++;
        errors.push('Header (.app-header) not visible');
      }
    } catch (error) {
      console.log(`❌ Failed: ${error.message}\n`);
      testsFailed++;
      errors.push(`Header check failed: ${error.message}`);
    }

    // Test 4: Check for editor
    console.log('📋 Test 4: Check for BlockNote editor');
    try {
      // BlockNote uses .bn-editor class
      const editorElement = await page.locator('.bn-editor, .editor-wrapper, [role="textbox"]').first();
      const isVisible = await editorElement.isVisible({ timeout: 5000 }).catch(() => false);

      if (isVisible) {
        console.log('✅ Editor found\n');
        testsPassed++;
      } else {
        console.log('❌ Editor not visible\n');
        testsFailed++;
        errors.push('Editor not visible');
      }
    } catch (error) {
      console.log(`❌ Failed: ${error.message}\n`);
      testsFailed++;
      errors.push(`Editor check failed: ${error.message}`);
    }

    // Test 5: Check for comments sidebar toggle button
    console.log('📋 Test 5: Check for comments toggle button');
    try {
      const toggleButton = await page.locator('.toggle-button').first();
      const isVisible = await toggleButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (isVisible) {
        console.log('✅ Toggle button found\n');
        testsPassed++;
      } else {
        console.log('❌ Toggle button not visible\n');
        testsFailed++;
        errors.push('Toggle button not visible');
      }
    } catch (error) {
      console.log(`❌ Failed: ${error.message}\n`);
      testsFailed++;
      errors.push(`Toggle button check failed: ${error.message}`);
    }

    // Take final screenshot
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/03-final-state.png` });

    // Print console messages
    console.log('\n📜 Console Messages:');
    if (consoleMessages.length === 0) {
      console.log('  (none)');
    } else {
      consoleMessages.forEach(msg => {
        const icon = msg.type === 'error' ? '❌' : msg.type === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`  ${icon} [${msg.type}] ${msg.text}`);
      });
    }

    // Print results
    console.log('\n' + '='.repeat(50));
    console.log('📊 Test Results');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${testsPassed}`);
    console.log(`❌ Failed: ${testsFailed}`);
    console.log(`📸 Screenshots saved to: ${SCREENSHOTS_DIR}/`);

    if (errors.length > 0) {
      console.log('\n❌ Errors Found:\n');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}\n`);
      });
      console.log('🐛 Fix needed!\n');
      process.exit(1);
    } else {
      console.log('\n✅ All tests passed!\n');
      process.exit(0);
    }

  } catch (error) {
    console.error(`\n❌ Test Suite Failed: ${error.message}\n`);
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

runBrowserTest();
