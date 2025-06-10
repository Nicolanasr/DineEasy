import { test, expect } from '@playwright/test';

test.describe('DineEasy E2E Setup', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Basic smoke test to verify the app loads
    await expect(page).toHaveTitle(/.+/); // Any title
    
    // Verify the page loads without errors
    await page.waitForLoadState('networkidle');
    
    // Check for any console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Give time for any console errors to appear
    await page.waitForTimeout(1000);
    
    // Don't fail on common Next.js warnings
    const filteredErrors = errors.filter(error => 
      !error.includes('Unsupported metadata') && 
      !error.includes('viewport export')
    );
    
    expect(filteredErrors).toHaveLength(0);
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    await page.goto('/non-existent-page');
    
    // Should show a 404 page or handle gracefully
    // The exact behavior depends on your Next.js setup
    const response = await page.request.get('/non-existent-page');
    expect([200, 404]).toContain(response.status());
  });
});