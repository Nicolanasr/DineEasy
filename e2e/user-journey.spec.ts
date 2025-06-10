import { test, expect, type Page } from '@playwright/test';

// Mock data for testing
const mockRestaurant = {
  slug: 'test-restaurant',
  name: 'Test Restaurant',
  description: 'A wonderful test restaurant'
};

const mockTable = {
  id: 'table-123',
  number: '5'
};

// Helper functions
async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
}

async function mockSupabaseResponses(page: Page) {
  // Mock Supabase client methods
  await page.addInitScript(() => {
    // Mock the global supabase object
    (window as any).mockSupabase = {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ 
              data: {
                id: 'restaurant-123',
                name: 'Test Restaurant',
                slug: 'test-restaurant',
                description: 'A wonderful test restaurant'
              },
              error: null 
            })
          })
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ 
              data: {
                id: 'session-123',
                table_id: 'table-123',
                restaurant_id: 'restaurant-123',
                status: 'active',
                session_token: 'token-123',
                expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
              },
              error: null 
            })
          })
        })
      })
    };
  });
}

test.describe('Complete User Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Set up mocks before each test
    await mockSupabaseResponses(page);
  });

  test('should complete full customer dining experience', async ({ page }) => {
    // Step 1: Customer scans QR code and lands on table page
    await page.goto(`/${mockRestaurant.slug}/table/${mockTable.id}`);
    await waitForPageLoad(page);

    // Step 2: Customer sees join session form
    await expect(page.getByTestId('join-session-form')).toBeVisible();
    await expect(page.getByText('Join Table Session')).toBeVisible();

    // Step 3: Customer enters their name and joins session
    const nameInput = page.getByTestId('participant-name-input');
    await nameInput.fill('John Doe');
    
    const joinButton = page.getByTestId('join-session-button');
    await joinButton.click();

    // Step 4: Customer sees the main interface with tabs
    await expect(page.getByTestId('main-tabs')).toBeVisible();
    await expect(page.getByRole('tab', { name: /menu/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /cart/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /service/i })).toBeVisible();

    // Step 5: Customer browses menu (default tab)
    await expect(page.getByTestId('menu-tab')).toBeVisible();
    await expect(page.getByText('Test Restaurant Menu')).toBeVisible();

    // Step 6: Customer adds items to cart
    const firstMenuItem = page.getByTestId('add-burger').first();
    await firstMenuItem.click();

    // Step 7: Customer checks cart
    const cartTab = page.getByRole('tab', { name: /cart/i });
    await cartTab.click();
    
    await expect(page.getByTestId('cart-tab')).toBeVisible();
    await expect(page.getByText('Your Cart')).toBeVisible();

    // Step 8: Customer reviews cart items
    await expect(page.getByTestId('cart-item-0')).toBeVisible();
    
    // Step 9: Customer submits order
    const submitButton = page.getByTestId('submit-order');
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Step 10: Customer makes service request
    const serviceTab = page.getByRole('tab', { name: /service/i });
    await serviceTab.click();
    
    await expect(page.getByTestId('service-tab')).toBeVisible();
    await expect(page.getByTestId('call-waiter')).toBeVisible();
    
    const callWaiterButton = page.getByTestId('call-waiter');
    await callWaiterButton.click();

    // Step 11: Verify session timer is visible
    await expect(page.getByTestId('session-timer')).toBeVisible();
    
    // Step 12: Verify participants card shows current user
    await expect(page.getByTestId('participants-card')).toBeVisible();
    await expect(page.getByText('John Doe')).toBeVisible();
  });

  test('should handle form validation correctly', async ({ page }) => {
    await page.goto(`/${mockRestaurant.slug}/table/${mockTable.id}`);
    await waitForPageLoad(page);

    // Try to join without entering name
    const joinButton = page.getByTestId('join-session-button');
    await joinButton.click();

    // Should show validation error
    await expect(page.getByText('Display name is required')).toBeVisible();

    // Enter name that's too short
    const nameInput = page.getByTestId('participant-name-input');
    await nameInput.fill('Jo');
    await joinButton.click();

    // Should show length validation error
    await expect(page.getByText('Display name must be at least 3 characters')).toBeVisible();

    // Enter valid name
    await nameInput.fill('John Doe');
    await joinButton.click();

    // Should proceed successfully
    await expect(page.getByTestId('main-tabs')).toBeVisible();
  });

  test('should handle menu interactions correctly', async ({ page }) => {
    // Join session first
    await page.goto(`/${mockRestaurant.slug}/table/${mockTable.id}`);
    await waitForPageLoad(page);
    
    const nameInput = page.getByTestId('participant-name-input');
    await nameInput.fill('Jane Doe');
    const joinButton = page.getByTestId('join-session-button');
    await joinButton.click();

    // Test menu interactions
    await expect(page.getByTestId('menu-tab')).toBeVisible();

    // Test quantity selection
    const quantitySelect = page.getByTestId('quantity-item-1').first();
    await quantitySelect.selectOption('3');

    // Add item with custom quantity
    const addButton = page.getByTestId('add-burger').first();
    await addButton.click();

    // Switch to cart and verify
    const cartTab = page.getByRole('tab', { name: /cart/i });
    await cartTab.click();

    await expect(page.getByText('Qty: 3')).toBeVisible();
    await expect(page.getByText('Items: 1')).toBeVisible();

    // Test removing items
    const removeButton = page.getByTestId('remove-item-0');
    await removeButton.click();

    // Cart should be empty
    await expect(page.getByTestId('empty-cart')).toBeVisible();
    await expect(page.getByText('Your cart is empty')).toBeVisible();
  });

  test('should display restaurant information correctly', async ({ page }) => {
    await page.goto(`/${mockRestaurant.slug}/table/${mockTable.id}`);
    await waitForPageLoad(page);

    // Should show restaurant header
    await expect(page.getByTestId('restaurant-header')).toBeVisible();
    await expect(page.getByText('Test Restaurant')).toBeVisible();
    await expect(page.getByText('Table 5')).toBeVisible();
  });

  test('should handle session timer correctly', async ({ page }) => {
    // Join session
    await page.goto(`/${mockRestaurant.slug}/table/${mockTable.id}`);
    await waitForPageLoad(page);
    
    const nameInput = page.getByTestId('participant-name-input');
    await nameInput.fill('Timer Test User');
    const joinButton = page.getByTestId('join-session-button');
    await joinButton.click();

    // Verify timer is visible
    const timer = page.getByTestId('session-timer');
    await expect(timer).toBeVisible();

    // Timer should show remaining time
    await expect(timer.getByText(/remaining/)).toBeVisible();
  });

  test('should handle cart badge updates', async ({ page }) => {
    // Join session
    await page.goto(`/${mockRestaurant.slug}/table/${mockTable.id}`);
    await waitForPageLoad(page);
    
    const nameInput = page.getByTestId('participant-name-input');
    await nameInput.fill('Badge Test User');
    const joinButton = page.getByTestId('join-session-button');
    await joinButton.click();

    // Initially no badge
    const cartTab = page.getByRole('tab', { name: /cart/i });
    await expect(cartTab.locator('.cart-badge')).not.toBeVisible();

    // Add item
    const addButton = page.getByTestId('add-burger').first();
    await addButton.click();

    // Badge should appear
    await expect(cartTab.locator('.cart-badge')).toBeVisible();
    await expect(cartTab.locator('.cart-badge')).toHaveText('1');

    // Add another item
    const addPizzaButton = page.getByTestId('add-pizza').first();
    await addPizzaButton.click();

    // Badge should update
    await expect(cartTab.locator('.cart-badge')).toHaveText('2');
  });
});

test.describe('Error Scenarios', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate network failure
    await page.route('**/api/**', route => route.abort());
    
    await page.goto(`/${mockRestaurant.slug}/table/${mockTable.id}`);
    
    // Should show error state or loading state
    // This would depend on your error handling implementation
    await expect(page.getByTestId('join-session-form')).toBeVisible();
  });

  test('should handle invalid restaurant slug', async ({ page }) => {
    await page.goto('/invalid-restaurant/table/123');
    
    // Should show 404 or error page
    // This depends on your error handling implementation
    await expect(page).toHaveURL(/invalid-restaurant/);
  });

  test('should handle invalid table ID', async ({ page }) => {
    await page.goto(`/${mockRestaurant.slug}/table/invalid-table`);
    
    // Should show error or redirect
    await expect(page).toHaveURL(/invalid-table/);
  });
});

test.describe('Mobile Experience', () => {
  test.use({ 
    viewport: { width: 375, height: 667 } // iPhone SE size
  });

  test('should work correctly on mobile devices', async ({ page }) => {
    await page.goto(`/${mockRestaurant.slug}/table/${mockTable.id}`);
    await waitForPageLoad(page);

    // Mobile-specific checks
    await expect(page.getByTestId('join-session-form')).toBeVisible();
    
    // Join session
    const nameInput = page.getByTestId('participant-name-input');
    await nameInput.fill('Mobile User');
    const joinButton = page.getByTestId('join-session-button');
    await joinButton.click();

    // Check tabs work on mobile
    await expect(page.getByTestId('main-tabs')).toBeVisible();
    
    const cartTab = page.getByRole('tab', { name: /cart/i });
    await cartTab.click();
    await expect(page.getByTestId('cart-tab')).toBeVisible();

    const serviceTab = page.getByRole('tab', { name: /service/i });
    await serviceTab.click();
    await expect(page.getByTestId('service-tab')).toBeVisible();
  });
});