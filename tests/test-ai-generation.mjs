import { chromium } from 'playwright';

console.log('🤖 Testing AI generation...\n');

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

// Capture all console messages
page.on('console', msg => {
  const type = msg.type();
  const text = msg.text();
  console.log(`[${type}] ${text}`);
});

// Navigate to app
await page.goto('http://localhost:5175/');
await page.waitForTimeout(2000);

console.log('\n✅ Page loaded\n');

// Wait for AI input to appear
await page.waitForSelector('.ai-input-field', { timeout: 5000 });
console.log('✅ AI input found\n');

// Type a prompt
console.log('⌨️  Typing prompt...');
await page.fill('.ai-input-field', 'Write a short project plan');
await page.waitForTimeout(500);

// Click generate button
console.log('🚀 Clicking generate button...\n');
await page.click('.ai-generate-button');

// Wait for generation to complete (or error)
console.log('⏳ Waiting for generation...\n');
await page.waitForTimeout(10000);

console.log('\n📊 Test complete - check console output above for errors\n');

// Keep browser open for manual inspection
console.log('Browser staying open for 30 seconds for inspection...');
await page.waitForTimeout(30000);

await browser.close();
