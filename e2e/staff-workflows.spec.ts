import { test, expect, type Page } from "@playwright/test";

const mockRestaurant = {
	id: "restaurant-123",
	slug: "test-restaurant",
	name: "Test Restaurant",
};

const mockTable = {
	id: "table-123",
	number: "5",
};

// Helper functions
async function loginAsStaff(page: Page) {
	await page.goto("/staff/login");
	await page.waitForLoadState("networkidle");

	// Mock authentication
	await page.addInitScript(() => {
		localStorage.setItem(
			"staff_auth",
			JSON.stringify({
				id: "staff-123",
				name: "John Staff",
				role: "waiter",
				restaurant_id: "restaurant-123",
			})
		);
	});
}

async function mockStaffResponses(page: Page) {
	await page.addInitScript(() => {
		(window as any).mockSupabaseStaff = {
			from: (table: string) => {
				if (table === "table_sessions") {
					return {
						select: () => ({
							eq: () => ({
								order: () =>
									Promise.resolve({
										data: [
											{
												id: "session-123",
												table_id: "table-123",
												status: "active",
												expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
												participants: [
													{ id: "p1", display_name: "Customer 1" },
													{ id: "p2", display_name: "Customer 2" },
												],
												orders: [{ id: "order-1", total_amount: 25.5, status: "pending" }],
											},
										],
										error: null,
									}),
							}),
						}),
						update: () => ({
							eq: () => Promise.resolve({ error: null }),
						}),
					};
				}
				if (table === "service_requests") {
					return {
						select: () => ({
							eq: () => ({
								order: () =>
									Promise.resolve({
										data: [
											{
												id: "request-1",
												table_id: "table-123",
												request_type: "call_waiter",
												status: "pending",
												created_at: new Date().toISOString(),
											},
										],
										error: null,
									}),
							}),
						}),
						update: () => ({
							eq: () => Promise.resolve({ error: null }),
						}),
					};
				}
				return { select: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }) };
			},
		};
	});
}

test.describe("Staff Dashboard", () => {
	test.beforeEach(async ({ page }) => {
		await mockStaffResponses(page);
		await loginAsStaff(page);
	});

	test("should display active table sessions", async ({ page }) => {
		await page.goto("/staff/dashboard");
		await page.waitForLoadState("networkidle");

		// Should show staff dashboard
		await expect(page.getByTestId("staff-dashboard")).toBeVisible();
		await expect(page.getByText("Staff Dashboard")).toBeVisible();

		// Should show active sessions
		await expect(page.getByTestId("active-sessions")).toBeVisible();
		await expect(page.getByText("Active Tables")).toBeVisible();

		// Should show specific table session
		await expect(page.getByTestId("session-card-session-123")).toBeVisible();
		await expect(page.getByText("Table 5")).toBeVisible();
		await expect(page.getByText("2 customers")).toBeVisible();
	});

	test("should show service requests queue", async ({ page }) => {
		await page.goto("/staff/dashboard");
		await page.waitForLoadState("networkidle");

		// Should show service requests section
		await expect(page.getByTestId("service-requests")).toBeVisible();
		await expect(page.getByText("Service Requests")).toBeVisible();

		// Should show pending requests
		await expect(page.getByTestId("request-request-1")).toBeVisible();
		await expect(page.getByText("Call Waiter")).toBeVisible();
		await expect(page.getByText("Table 5")).toBeVisible();
	});

	test("should handle service request completion", async ({ page }) => {
		await page.goto("/staff/dashboard");
		await page.waitForLoadState("networkidle");

		// Find and complete a service request
		const requestCard = page.getByTestId("request-request-1");
		await expect(requestCard).toBeVisible();

		const completeButton = requestCard.getByTestId("complete-request-btn");
		await completeButton.click();

		// Should show confirmation or update status
		await expect(page.getByText("Request completed")).toBeVisible();
	});

	test("should allow table reset functionality", async ({ page }) => {
		await page.goto("/staff/dashboard");
		await page.waitForLoadState("networkidle");

		// Find active session
		const sessionCard = page.getByTestId("session-card-session-123");
		await expect(sessionCard).toBeVisible();

		// Click reset table option
		const resetButton = sessionCard.getByTestId("reset-table-btn");
		await resetButton.click();

		// Should show confirmation dialog
		await expect(page.getByTestId("reset-confirmation-dialog")).toBeVisible();
		await expect(page.getByText("Reset Table Session?")).toBeVisible();

		// Confirm reset
		const confirmButton = page.getByTestId("confirm-reset-btn");
		await confirmButton.click();

		// Should show success message
		await expect(page.getByText("Table has been reset")).toBeVisible();
	});
});

test.describe("Staff Controls Integration", () => {
	test.beforeEach(async ({ page }) => {
		await mockStaffResponses(page);
	});

	test("should show staff controls when staff is logged in", async ({ page }) => {
		await loginAsStaff(page);

		// Visit a table page as staff
		await page.goto(`/${mockRestaurant.slug}/table/${mockTable.id}?staff=true`);
		await page.waitForLoadState("networkidle");

		// Should show staff controls overlay/section
		await expect(page.getByTestId("staff-controls")).toBeVisible();
		await expect(page.getByText("Staff Controls")).toBeVisible();

		// Should show session management options
		await expect(page.getByTestId("extend-session-btn")).toBeVisible();
		await expect(page.getByTestId("end-session-btn")).toBeVisible();
	});

	test("should allow extending session time", async ({ page }) => {
		await loginAsStaff(page);
		await page.goto(`/${mockRestaurant.slug}/table/${mockTable.id}?staff=true`);
		await page.waitForLoadState("networkidle");

		// Click extend session
		const extendButton = page.getByTestId("extend-session-btn");
		await extendButton.click();

		// Should show extension options
		await expect(page.getByTestId("extend-session-dialog")).toBeVisible();

		// Select extension duration
		const thirtyMinOption = page.getByTestId("extend-30-min");
		await thirtyMinOption.click();

		const confirmExtendButton = page.getByTestId("confirm-extend-btn");
		await confirmExtendButton.click();

		// Should show success message
		await expect(page.getByText("Session extended by 30 minutes")).toBeVisible();
	});

	test("should allow manual session termination", async ({ page }) => {
		await loginAsStaff(page);
		await page.goto(`/${mockRestaurant.slug}/table/${mockTable.id}?staff=true`);
		await page.waitForLoadState("networkidle");

		// Click end session
		const endButton = page.getByTestId("end-session-btn");
		await endButton.click();

		// Should show confirmation
		await expect(page.getByTestId("end-session-dialog")).toBeVisible();
		await expect(page.getByText("End table session?")).toBeVisible();

		const confirmEndButton = page.getByTestId("confirm-end-btn");
		await confirmEndButton.click();

		// Should redirect or show confirmation
		await expect(page.getByText("Session has been ended")).toBeVisible();
	});

	test("should show order management interface", async ({ page }) => {
		await loginAsStaff(page);
		await page.goto(`/${mockRestaurant.slug}/table/${mockTable.id}?staff=true`);
		await page.waitForLoadState("networkidle");

		// Should show order history/management
		await expect(page.getByTestId("staff-order-management")).toBeVisible();
		await expect(page.getByText("Table Orders")).toBeVisible();

		// Should show pending orders
		await expect(page.getByTestId("order-order-1")).toBeVisible();
		await expect(page.getByText("$25.50")).toBeVisible();
		await expect(page.getByText("Pending")).toBeVisible();
	});
});

test.describe("Staff Menu Management", () => {
	test.beforeEach(async ({ page }) => {
		await mockStaffResponses(page);
		await loginAsStaff(page);
	});

	test("should access menu management interface", async ({ page }) => {
		await page.goto("/staff/menu");
		await page.waitForLoadState("networkidle");

		// Should show menu management interface
		await expect(page.getByTestId("menu-management")).toBeVisible();
		await expect(page.getByText("Menu Management")).toBeVisible();

		// Should show menu categories
		await expect(page.getByTestId("menu-categories")).toBeVisible();

		// Should show add new item button
		await expect(page.getByTestId("add-menu-item-btn")).toBeVisible();
	});

	test("should toggle menu item availability", async ({ page }) => {
		await page.goto("/staff/menu");
		await page.waitForLoadState("networkidle");

		// Find a menu item
		const menuItem = page.getByTestId("menu-item-item-1");
		await expect(menuItem).toBeVisible();

		// Toggle availability
		const availabilityToggle = menuItem.getByTestId("availability-toggle");
		await availabilityToggle.click();

		// Should show status update
		await expect(page.getByText("Item availability updated")).toBeVisible();
	});

	test("should create new menu item", async ({ page }) => {
		await page.goto("/staff/menu");
		await page.waitForLoadState("networkidle");

		// Click add new item
		const addButton = page.getByTestId("add-menu-item-btn");
		await addButton.click();

		// Should show item creation form
		await expect(page.getByTestId("menu-item-form")).toBeVisible();

		// Fill form
		await page.getByTestId("item-name-input").fill("New Test Item");
		await page.getByTestId("item-description-input").fill("A delicious new item");
		await page.getByTestId("item-price-input").fill("19.99");

		// Select category
		await page.getByTestId("item-category-select").selectOption("appetizers");

		// Submit form
		const submitButton = page.getByTestId("submit-menu-item-btn");
		await submitButton.click();

		// Should show success message
		await expect(page.getByText("Menu item created successfully")).toBeVisible();
	});
});

test.describe("Staff Analytics", () => {
	test.beforeEach(async ({ page }) => {
		await mockStaffResponses(page);
		await loginAsStaff(page);
	});

	test("should display restaurant analytics dashboard", async ({ page }) => {
		await page.goto("/staff/analytics");
		await page.waitForLoadState("networkidle");

		// Should show analytics dashboard
		await expect(page.getByTestId("analytics-dashboard")).toBeVisible();
		await expect(page.getByText("Restaurant Analytics")).toBeVisible();

		// Should show key metrics
		await expect(page.getByTestId("total-revenue")).toBeVisible();
		await expect(page.getByTestId("active-sessions")).toBeVisible();
		await expect(page.getByTestId("avg-session-duration")).toBeVisible();
	});

	test("should show session analytics", async ({ page }) => {
		await page.goto("/staff/analytics");
		await page.waitForLoadState("networkidle");

		// Should show session statistics
		await expect(page.getByTestId("session-analytics")).toBeVisible();
		await expect(page.getByText("Session Statistics")).toBeVisible();

		// Should show charts/graphs
		await expect(page.getByTestId("session-duration-chart")).toBeVisible();
		await expect(page.getByTestId("table-utilization-chart")).toBeVisible();
	});

	test("should filter analytics by date range", async ({ page }) => {
		await page.goto("/staff/analytics");
		await page.waitForLoadState("networkidle");

		// Use date filter
		const dateFilter = page.getByTestId("date-range-filter");
		await dateFilter.click();

		// Select last 7 days
		const sevenDaysOption = page.getByTestId("last-7-days");
		await sevenDaysOption.click();

		// Should update analytics data
		await expect(page.getByText("Last 7 days")).toBeVisible();
	});
});

test.describe("Staff Table Management", () => {
	test.beforeEach(async ({ page }) => {
		await mockStaffResponses(page);
		await loginAsStaff(page);
	});

	test("should view table layout and status", async ({ page }) => {
		await page.goto("/staff/tables");
		await page.waitForLoadState("networkidle");

		// Should show table management interface
		await expect(page.getByTestId("table-management")).toBeVisible();
		await expect(page.getByText("Table Management")).toBeVisible();

		// Should show table layout
		await expect(page.getByTestId("table-layout")).toBeVisible();

		// Should show individual tables
		await expect(page.getByTestId("table-table-123")).toBeVisible();
		await expect(page.getByText("Table 5")).toBeVisible();
	});

	test("should show table session details", async ({ page }) => {
		await page.goto("/staff/tables");
		await page.waitForLoadState("networkidle");

		// Click on active table
		const tableCard = page.getByTestId("table-table-123");
		await tableCard.click();

		// Should show session details modal/panel
		await expect(page.getByTestId("table-session-details")).toBeVisible();
		await expect(page.getByText("Table 5 Session")).toBeVisible();

		// Should show session info
		await expect(page.getByText("2 customers")).toBeVisible();
		await expect(page.getByText("Customer 1")).toBeVisible();
		await expect(page.getByText("Customer 2")).toBeVisible();
	});

	test("should enable/disable tables", async ({ page }) => {
		await page.goto("/staff/tables");
		await page.waitForLoadState("networkidle");

		// Find table settings
		const tableCard = page.getByTestId("table-table-123");
		const settingsButton = tableCard.getByTestId("table-settings-btn");
		await settingsButton.click();

		// Should show table settings
		await expect(page.getByTestId("table-settings-modal")).toBeVisible();

		// Toggle table availability
		const availabilityToggle = page.getByTestId("table-availability-toggle");
		await availabilityToggle.click();

		// Save settings
		const saveButton = page.getByTestId("save-table-settings-btn");
		await saveButton.click();

		// Should show confirmation
		await expect(page.getByText("Table settings updated")).toBeVisible();
	});
});

test.describe("Staff Authentication & Permissions", () => {
	test("should redirect unauthenticated staff to login", async ({ page }) => {
		// Try to access staff dashboard without authentication
		await page.goto("/staff/dashboard");

		// Should redirect to login
		await expect(page).toHaveURL(/\/staff\/login/);
		await expect(page.getByTestId("staff-login-form")).toBeVisible();
	});

	test("should handle staff login flow", async ({ page }) => {
		await page.goto("/staff/login");
		await page.waitForLoadState("networkidle");

		// Fill login form
		await page.getByTestId("staff-email-input").fill("staff@restaurant.com");
		await page.getByTestId("staff-password-input").fill("password123");

		// Submit login
		const loginButton = page.getByTestId("staff-login-btn");
		await loginButton.click();

		// Should redirect to dashboard
		await expect(page).toHaveURL(/\/staff\/dashboard/);
		await expect(page.getByTestId("staff-dashboard")).toBeVisible();
	});

	test("should handle different staff roles", async ({ page }) => {
		// Login as manager
		await page.addInitScript(() => {
			localStorage.setItem(
				"staff_auth",
				JSON.stringify({
					id: "staff-manager",
					name: "Manager Jane",
					role: "manager",
					restaurant_id: "restaurant-123",
				})
			);
		});

		await page.goto("/staff/dashboard");
		await page.waitForLoadState("networkidle");

		// Manager should see additional options
		await expect(page.getByTestId("manager-controls")).toBeVisible();
		await expect(page.getByText("Manager Dashboard")).toBeVisible();
	});

	test("should handle staff logout", async ({ page }) => {
		await loginAsStaff(page);
		await page.goto("/staff/dashboard");
		await page.waitForLoadState("networkidle");

		// Click logout
		const logoutButton = page.getByTestId("staff-logout-btn");
		await logoutButton.click();

		// Should redirect to login
		await expect(page).toHaveURL(/\/staff\/login/);
	});
});
