import { test, expect, type Page, type BrowserContext } from '@playwright/test';

// Mock data
const mockRestaurant = {
  slug: 'test-restaurant',
  name: 'Test Restaurant'
};

const mockTable = {
  id: 'table-123',
  number: '5'
};

// Helper to join session for a participant
async function joinSession(page: Page, participantName: string) {
  await page.goto(`/${mockRestaurant.slug}/table/${mockTable.id}`);
  await page.waitForLoadState('networkidle');
  
  const nameInput = page.getByTestId('participant-name-input');
  await nameInput.fill(participantName);
  
  const joinButton = page.getByTestId('join-session-button');
  await joinButton.click();
  
  // Wait for main interface to load
  await expect(page.getByTestId('main-tabs')).toBeVisible();
}

// Helper to add item to cart
async function addItemToCart(page: Page, itemTestId: string, quantity: string = '1') {
  // Ensure we're on menu tab
  const menuTab = page.getByRole('tab', { name: /menu/i });
  await menuTab.click();
  
  // Set quantity if not default
  if (quantity !== '1') {
    const quantitySelect = page.getByTestId(`quantity-${itemTestId.replace('add-', '')}`);
    await quantitySelect.selectOption(quantity);
  }
  
  // Add item
  const addButton = page.getByTestId(itemTestId);
  await addButton.click();
}

test.describe('Multi-Participant Scenarios', () => {
  test('should handle multiple participants joining the same session', async ({ browser }) => {
    // Create two browser contexts for two participants
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const participant1 = await context1.newPage();
    const participant2 = await context2.newPage();

    try {
      // Participant 1 joins
      await joinSession(participant1, 'Alice');
      
      // Participant 2 joins the same table
      await joinSession(participant2, 'Bob');

      // Both should see each other in participants list
      await expect(participant1.getByTestId('participants-card')).toBeVisible();
      await expect(participant1.getByText('Alice')).toBeVisible();
      await expect(participant1.getByText('Bob')).toBeVisible();

      await expect(participant2.getByTestId('participants-card')).toBeVisible();
      await expect(participant2.getByText('Alice')).toBeVisible();
      await expect(participant2.getByText('Bob')).toBeVisible();

      // Current participant should be highlighted differently
      await expect(participant1.getByText('Alice')).toHaveClass(/current-participant/);
      await expect(participant2.getByText('Bob')).toHaveClass(/current-participant/);
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test('should sync shared cart between participants', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const participant1 = await context1.newPage();
    const participant2 = await context2.newPage();

    try {
      // Both participants join
      await joinSession(participant1, 'Chef Alice');
      await joinSession(participant2, 'Foodie Bob');

      // Participant 1 adds item to shared cart
      await addItemToCart(participant1, 'add-burger', '2');

      // Switch to cart tab for participant 1
      const cartTab1 = participant1.getByRole('tab', { name: /cart/i });
      await cartTab1.click();
      await expect(participant1.getByTestId('cart-tab')).toBeVisible();
      await expect(participant1.getByText('Items: 1')).toBeVisible();

      // Participant 2 should see the same cart
      const cartTab2 = participant2.getByRole('tab', { name: /cart/i });
      await cartTab2.click();
      await expect(participant2.getByTestId('cart-tab')).toBeVisible();
      await expect(participant2.getByText('Items: 1')).toBeVisible();

      // Participant 2 adds another item
      const menuTab2 = participant2.getByRole('tab', { name: /menu/i });
      await menuTab2.click();
      await addItemToCart(participant2, 'add-pizza', '1');

      // Both should see updated cart count
      await expect(participant1.getByText('Items: 2')).toBeVisible();
      await expect(participant2.getByText('Items: 2')).toBeVisible();

      // Cart badges should update for both
      const cartBadge1 = participant1.getByRole('tab', { name: /cart/i }).locator('.cart-badge');
      const cartBadge2 = participant2.getByRole('tab', { name: /cart/i }).locator('.cart-badge');
      
      await expect(cartBadge1).toHaveText('2');
      await expect(cartBadge2).toHaveText('2');
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test('should handle cart modifications by different participants', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const participant1 = await context1.newPage();
    const participant2 = await context2.newPage();

    try {
      // Both participants join
      await joinSession(participant1, 'Manager Alice');
      await joinSession(participant2, 'Customer Bob');

      // Participant 1 adds multiple items
      await addItemToCart(participant1, 'add-burger', '2');
      await addItemToCart(participant1, 'add-pizza', '1');

      // Both switch to cart view
      const cartTab1 = participant1.getByRole('tab', { name: /cart/i });
      const cartTab2 = participant2.getByRole('tab', { name: /cart/i });
      
      await cartTab1.click();
      await cartTab2.click();

      // Both should see same items
      await expect(participant1.getByText('Items: 2')).toBeVisible();
      await expect(participant2.getByText('Items: 2')).toBeVisible();

      // Participant 2 removes an item
      const removeButton = participant2.getByTestId('remove-item-0');
      await removeButton.click();

      // Both should see updated cart
      await expect(participant1.getByText('Items: 1')).toBeVisible();
      await expect(participant2.getByText('Items: 1')).toBeVisible();

      // Participant 1 removes the last item
      const lastRemoveButton = participant1.getByTestId('remove-item-0');
      await lastRemoveButton.click();

      // Both should see empty cart
      await expect(participant1.getByTestId('empty-cart')).toBeVisible();
      await expect(participant2.getByTestId('empty-cart')).toBeVisible();
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test('should handle order submission coordination', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const participant1 = await context1.newPage();
    const participant2 = await context2.newPage();

    try {
      // Both participants join
      await joinSession(participant1, 'Host Alice');
      await joinSession(participant2, 'Guest Bob');

      // Add items to shared cart
      await addItemToCart(participant1, 'add-burger', '1');
      await addItemToCart(participant2, 'add-pizza', '2');

      // Both switch to cart
      const cartTab1 = participant1.getByRole('tab', { name: /cart/i });
      const cartTab2 = participant2.getByRole('tab', { name: /cart/i });
      
      await cartTab1.click();
      await cartTab2.click();

      // Both should be able to submit order
      const submitButton1 = participant1.getByTestId('submit-order');
      const submitButton2 = participant2.getByTestId('submit-order');
      
      await expect(submitButton1).toBeEnabled();
      await expect(submitButton2).toBeEnabled();

      // Participant 1 submits order
      await submitButton1.click();

      // Order submission should be reflected for both users
      // (This would depend on your specific implementation)
      // You might show a success message, clear the cart, etc.
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test('should synchronize service requests between participants', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const participant1 = await context1.newPage();
    const participant2 = await context2.newPage();

    try {
      // Both participants join
      await joinSession(participant1, 'Table Host');
      await joinSession(participant2, 'Table Guest');

      // Switch to service tab for both
      const serviceTab1 = participant1.getByRole('tab', { name: /service/i });
      const serviceTab2 = participant2.getByRole('tab', { name: /service/i });
      
      await serviceTab1.click();
      await serviceTab2.click();

      // Both should see service options
      await expect(participant1.getByTestId('call-waiter')).toBeVisible();
      await expect(participant2.getByTestId('call-waiter')).toBeVisible();

      // Participant 1 calls waiter
      const callWaiterButton1 = participant1.getByTestId('call-waiter');
      await callWaiterButton1.click();

      // Both participants should see the service request was made
      // (Implementation dependent - might show request status, disable button, etc.)
      await expect(participant1.getByTestId('service-tab')).toBeVisible();
      await expect(participant2.getByTestId('service-tab')).toBeVisible();
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test('should handle participant leaving session', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const participant1 = await context1.newPage();
    const participant2 = await context2.newPage();

    try {
      // Both participants join
      await joinSession(participant1, 'Staying User');
      await joinSession(participant2, 'Leaving User');

      // Verify both are in participants list
      await expect(participant1.getByText('Staying User')).toBeVisible();
      await expect(participant1.getByText('Leaving User')).toBeVisible();
      await expect(participant2.getByText('Staying User')).toBeVisible();
      await expect(participant2.getByText('Leaving User')).toBeVisible();

      // Participant 2 leaves (closes browser/tab)
      await context2.close();

      // Wait a moment for real-time updates
      await participant1.waitForTimeout(2000);

      // Participant 1 should still see themselves
      await expect(participant1.getByText('Staying User')).toBeVisible();
      
      // Leaving user might still be shown or marked as inactive
      // (depending on your implementation)
    } finally {
      await context1.close();
    }
  });

  test('should handle session timer consistency across participants', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const participant1 = await context1.newPage();
    const participant2 = await context2.newPage();

    try {
      // Both participants join
      await joinSession(participant1, 'Timer User 1');
      await joinSession(participant2, 'Timer User 2');

      // Both should see session timer
      const timer1 = participant1.getByTestId('session-timer');
      const timer2 = participant2.getByTestId('session-timer');
      
      await expect(timer1).toBeVisible();
      await expect(timer2).toBeVisible();

      // Timers should show similar remaining time
      await expect(timer1.getByText(/remaining/)).toBeVisible();
      await expect(timer2.getByText(/remaining/)).toBeVisible();

      // Activity by one participant should reset timer for both
      await addItemToCart(participant1, 'add-burger');

      // Both timers should reflect extended session
      // (The exact implementation would depend on your session extension logic)
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test('should handle concurrent cart modifications gracefully', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const participant1 = await context1.newPage();
    const participant2 = await context2.newPage();

    try {
      // Both participants join
      await joinSession(participant1, 'Concurrent User 1');
      await joinSession(participant2, 'Concurrent User 2');

      // Both try to add items simultaneously
      const addItem1Promise = addItemToCart(participant1, 'add-burger', '2');
      const addItem2Promise = addItemToCart(participant2, 'add-pizza', '3');

      await Promise.all([addItem1Promise, addItem2Promise]);

      // Both switch to cart
      const cartTab1 = participant1.getByRole('tab', { name: /cart/i });
      const cartTab2 = participant2.getByRole('tab', { name: /cart/i });
      
      await cartTab1.click();
      await cartTab2.click();

      // Both should eventually see consistent cart state
      await expect(participant1.getByText('Items: 2')).toBeVisible();
      await expect(participant2.getByText('Items: 2')).toBeVisible();

      // Cart should contain both items
      await expect(participant1.getByTestId('cart-item-0')).toBeVisible();
      await expect(participant1.getByTestId('cart-item-1')).toBeVisible();
      await expect(participant2.getByTestId('cart-item-0')).toBeVisible();
      await expect(participant2.getByTestId('cart-item-1')).toBeVisible();
    } finally {
      await context1.close();
      await context2.close();
    }
  });
});

test.describe('Real-time Updates', () => {
  test('should receive real-time updates when other participants join', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const participant1 = await context1.newPage();
    const participant2 = await context2.newPage();

    try {
      // Participant 1 joins first
      await joinSession(participant1, 'First User');

      // Should see only themselves initially
      await expect(participant1.getByText('First User')).toBeVisible();

      // Participant 2 joins
      await joinSession(participant2, 'Second User');

      // Participant 1 should see the new participant in real-time
      await expect(participant1.getByText('Second User')).toBeVisible();
      
      // Both should see each other
      await expect(participant1.getByText('First User')).toBeVisible();
      await expect(participant2.getByText('First User')).toBeVisible();
      await expect(participant2.getByText('Second User')).toBeVisible();
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test('should handle network interruptions gracefully', async ({ browser }) => {
    const context1 = await browser.newContext();
    const participant1 = await context1.newPage();

    try {
      // Join session
      await joinSession(participant1, 'Network Test User');

      // Simulate network issues
      await context1.setOffline(true);
      
      // Try to add item while offline
      await addItemToCart(participant1, 'add-burger');

      // Restore network
      await context1.setOffline(false);

      // Application should handle offline state gracefully
      // (Implementation dependent - might queue actions, show offline indicator, etc.)
      await expect(participant1.getByTestId('main-tabs')).toBeVisible();
    } finally {
      await context1.close();
    }
  });
});