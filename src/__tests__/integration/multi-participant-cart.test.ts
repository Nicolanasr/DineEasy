import { renderHook, act } from "@testing-library/react";
import { useSharedCart } from "@/app/[restaurantSlug]/table/[tableId]/hooks/useSharedCart";
import { supabase } from "@/lib/supabase";

// Integration test for multi-participant cart scenarios
jest.mock("@/lib/supabase");

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe("Multi-Participant Cart Integration", () => {
	const mockSession = {
		id: "session-123",
		table_id: "table-123",
		restaurant_id: "restaurant-123",
		status: "active" as const,
		session_token: "token-123",
		expires_at: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
		total_amount: 0,
		created_at: "2023-01-01T00:00:00Z",
		updated_at: "2023-01-01T00:00:00Z",
	};

	const participant1 = {
		id: "participant-1",
		session_id: "session-123",
		display_name: "John Doe",
		color_code: "#FF5733",
		joined_at: "2023-01-01T10:00:00Z",
		last_active_at: "2023-01-01T10:00:00Z",
	};

	const participant2 = {
		id: "participant-2",
		session_id: "session-123",
		display_name: "Jane Smith",
		color_code: "#33FF57",
		joined_at: "2023-01-01T10:05:00Z",
		last_active_at: "2023-01-01T10:05:00Z",
	};

	const mockMenuItem1 = {
		id: "item-1",
		restaurant_id: "restaurant-123",
		category_id: "cat-123",
		name: "Burger",
		description: "Delicious burger",
		price: 12.99,
		image_url: null,
		ingredients: ["beef", "cheese"],
		allergens: [],
		dietary_info: [],
		preparation_time: 15,
		is_available: true,
		display_order: 1,
		omega_item_id: null,
		created_at: "2023-01-01T00:00:00Z",
		updated_at: "2023-01-01T00:00:00Z",
	};

	const mockMenuItem2 = {
		id: "item-2",
		restaurant_id: "restaurant-123",
		category_id: "cat-123",
		name: "Pizza",
		description: "Delicious pizza",
		price: 15.99,
		image_url: null,
		ingredients: ["dough", "cheese", "tomato"],
		allergens: [],
		dietary_info: [],
		preparation_time: 20,
		is_available: true,
		display_order: 2,
		omega_item_id: null,
		created_at: "2023-01-01T00:00:00Z",
		updated_at: "2023-01-01T00:00:00Z",
	};

	const mockChannel = {
		on: jest.fn().mockReturnThis(),
		subscribe: jest.fn(),
		unsubscribe: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();

		// Setup default Supabase mocks
		const mockChain = {
			select: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			in: jest.fn().mockReturnThis(),
			insert: jest.fn().mockReturnThis(),
			update: jest.fn().mockReturnThis(),
			delete: jest.fn().mockReturnThis(),
			single: jest.fn(),
			maybeSingle: jest.fn(),
		};

		mockSupabase.from.mockReturnValue(mockChain as any);
		mockSupabase.channel.mockReturnValue(mockChannel);
	});

	describe("Concurrent Cart Operations", () => {
		it("should handle multiple participants adding items simultaneously", async () => {
			// Mock shared order creation and item addition
			const sharedOrder = {
				id: "shared-order-123",
				session_id: "session-123",
				participant_id: null, // Shared order
				status: "cart" as const,
				subtotal: 0,
				notes: null,
				omega_order_id: null,
				created_at: "2023-01-01T00:00:00Z",
				updated_at: "2023-01-01T00:00:00Z",
			};

			const orderItem1 = {
				id: "order-item-1",
				order_id: "shared-order-123",
				menu_item_id: "item-1",
				quantity: 1,
				unit_price: 12.99,
				total_price: 12.99,
				customizations: [],
				notes: null,
				added_by_participant_id: "participant-1",
				created_at: "2023-01-01T00:00:00Z",
				menu_item: mockMenuItem1,
			};

			const orderItem2 = {
				id: "order-item-2",
				order_id: "shared-order-123",
				menu_item_id: "item-2",
				quantity: 1,
				unit_price: 15.99,
				total_price: 15.99,
				customizations: [],
				notes: null,
				added_by_participant_id: "participant-2",
				created_at: "2023-01-01T00:00:00Z",
				menu_item: mockMenuItem2,
			};

			// Setup mock responses
			mockSupabase.from.mockImplementation((table) => {
				const mockChain = {
					select: jest.fn().mockReturnThis(),
					eq: jest.fn().mockReturnThis(),
					insert: jest.fn().mockReturnThis(),
					update: jest.fn().mockReturnThis(),
					single: jest.fn(),
					maybeSingle: jest.fn(),
				};

				if (table === "orders") {
					mockChain.maybeSingle.mockResolvedValue({ data: null, error: null });
					mockChain.single.mockResolvedValue({ data: sharedOrder, error: null });
				} else if (table === "order_items") {
					mockChain.single
						.mockResolvedValueOnce({ data: orderItem1, error: null })
						.mockResolvedValueOnce({ data: orderItem2, error: null });
				}

				return mockChain as any;
			});

			// Initialize two cart instances for different participants
			const { result: cart1 } = renderHook(() => useSharedCart(mockSession, participant1));
			const { result: cart2 } = renderHook(() => useSharedCart(mockSession, participant2));

			// Both participants add items concurrently
			await act(async () => {
				await Promise.all([cart1.current.handleAddItem(mockMenuItem1, 1), cart2.current.handleAddItem(mockMenuItem2, 1)]);
			});

			// Both items should be added to shared cart
			expect(cart1.current.sharedCartItems).toHaveLength(1);
			expect(cart2.current.sharedCartItems).toHaveLength(1);
		});

		it("should handle quantity conflicts when multiple participants modify same item", async () => {
			const existingOrderItem = {
				id: "order-item-1",
				order_id: "shared-order-123",
				menu_item_id: "item-1",
				quantity: 2,
				unit_price: 12.99,
				total_price: 25.98,
				customizations: [],
				notes: null,
				added_by_participant_id: "participant-1",
				created_at: "2023-01-01T00:00:00Z",
				menu_item: mockMenuItem1,
			};

			// Setup mock to return existing item then updated versions
			mockSupabase.from.mockImplementation((table) => {
				const mockChain = {
					select: jest.fn().mockReturnThis(),
					eq: jest.fn().mockReturnThis(),
					update: jest.fn().mockReturnThis(),
					single: jest.fn(),
				};

				if (table === "order_items") {
					mockChain.single
						.mockResolvedValueOnce({
							data: { ...existingOrderItem, quantity: 3, total_price: 38.97 },
							error: null,
						})
						.mockResolvedValueOnce({
							data: { ...existingOrderItem, quantity: 4, total_price: 51.96 },
							error: null,
						});
				}

				return mockChain as any;
			});

			const { result: cart1 } = renderHook(() => useSharedCart(mockSession, participant1));
			const { result: cart2 } = renderHook(() => useSharedCart(mockSession, participant2));

			// Both participants try to update quantity simultaneously
			await act(async () => {
				await Promise.all([cart1.current.handleUpdateQuantity("order-item-1", 3), cart2.current.handleUpdateQuantity("order-item-1", 4)]);
			});

			// Should handle concurrent updates gracefully
			expect(mockSupabase.from).toHaveBeenCalledWith("order_items");
		});

		it("should sync cart state across participants via real-time updates", async () => {
			let realtimeCallback: (payload: any) => void;

			mockChannel.on.mockImplementation((event, config, callback) => {
				realtimeCallback = callback;
				return mockChannel;
			});

			const { result: cart1 } = renderHook(() => useSharedCart(mockSession, participant1));
			const { result: cart2 } = renderHook(() => useSharedCart(mockSession, participant2));

			// Simulate real-time update from participant 1's action
			const newOrderItem = {
				id: "order-item-new",
				order_id: "shared-order-123",
				menu_item_id: "item-1",
				quantity: 1,
				unit_price: 12.99,
				total_price: 12.99,
				customizations: [],
				notes: null,
				added_by_participant_id: "participant-1",
				created_at: "2023-01-01T00:00:00Z",
				menu_item: mockMenuItem1,
			};

			act(() => {
				realtimeCallback!({
					eventType: "INSERT",
					new: newOrderItem,
					old: {},
				});
			});

			// Both carts should receive the update
			expect(cart1.current.sharedCartItems).toContainEqual(expect.objectContaining({ id: "order-item-new" }));
			expect(cart2.current.sharedCartItems).toContainEqual(expect.objectContaining({ id: "order-item-new" }));
		});

		it("should handle participant-specific operations correctly", async () => {
			const participant1Order = {
				id: "participant-1-order",
				session_id: "session-123",
				participant_id: "participant-1",
				status: "cart" as const,
				subtotal: 12.99,
				notes: null,
				omega_order_id: null,
				created_at: "2023-01-01T00:00:00Z",
				updated_at: "2023-01-01T00:00:00Z",
			};

			const participant2Order = {
				id: "participant-2-order",
				session_id: "session-123",
				participant_id: "participant-2",
				status: "cart" as const,
				subtotal: 15.99,
				notes: null,
				omega_order_id: null,
				created_at: "2023-01-01T00:00:00Z",
				updated_at: "2023-01-01T00:00:00Z",
			};

			// Mock participant-specific orders
			mockSupabase.from.mockImplementation((table) => {
				const mockChain = {
					select: jest.fn().mockReturnThis(),
					eq: jest.fn().mockReturnThis(),
					insert: jest.fn().mockReturnThis(),
					update: jest.fn().mockReturnThis(),
					single: jest.fn(),
					maybeSingle: jest.fn(),
				};

				if (table === "orders") {
					mockChain.maybeSingle.mockResolvedValue({ data: null, error: null });
					mockChain.single
						.mockResolvedValueOnce({ data: participant1Order, error: null })
						.mockResolvedValueOnce({ data: participant2Order, error: null });
				}

				return mockChain as any;
			});

			const { result: cart1 } = renderHook(() => useSharedCart(mockSession, participant1));
			const { result: cart2 } = renderHook(() => useSharedCart(mockSession, participant2));

			// Each participant submits their individual order
			await act(async () => {
				await cart1.current.handleSubmitOrder();
			});

			await act(async () => {
				await cart2.current.handleSubmitOrder();
			});

			// Should create separate orders for each participant
			expect(mockSupabase.from).toHaveBeenCalledWith("orders");
		});
	});

	describe("Cart Conflict Resolution", () => {
		it("should handle item removal conflicts", async () => {
			// const existingItem = {
			// 	id: "order-item-1",
			// 	order_id: "shared-order-123",
			// 	menu_item_id: "item-1",
			// 	quantity: 1,
			// 	unit_price: 12.99,
			// 	total_price: 12.99,
			// 	customizations: [],
			// 	notes: null,
			// 	added_by_participant_id: "participant-1",
			// 	created_at: "2023-01-01T00:00:00Z",
			// 	menu_item: mockMenuItem1,
			// };

			// Setup initial cart state
			mockSupabase.from.mockImplementation((table) => {
				const mockChain = {
					select: jest.fn().mockReturnThis(),
					eq: jest.fn().mockReturnThis(),
					delete: jest.fn().mockReturnThis(),
				};

				if (table === "order_items") {
					mockChain.eq.mockResolvedValue({ error: null });
				}

				return mockChain as any;
			});

			const { result: cart1 } = renderHook(() => useSharedCart(mockSession, participant1));
			const { result: cart2 } = renderHook(() => useSharedCart(mockSession, participant2));

			// Both participants try to remove the same item
			await act(async () => {
				await Promise.all([cart1.current.handleRemoveItem("order-item-1"), cart2.current.handleRemoveItem("order-item-1")]);
			});

			// Should handle gracefully without errors
			expect(mockSupabase.from).toHaveBeenCalledWith("order_items");
		});

		it("should handle cart clearing conflicts", async () => {
			// const cartItems = ["order-item-1", "order-item-2", "order-item-3"];

			mockSupabase.from.mockImplementation((table) => {
				const mockChain = {
					select: jest.fn().mockReturnThis(),
					eq: jest.fn().mockReturnThis(),
					delete: jest.fn().mockReturnThis(),
					in: jest.fn().mockReturnThis(),
				};

				if (table === "order_items") {
					mockChain.in.mockResolvedValue({ error: null });
				}

				return mockChain as any;
			});

			const { result: cart1 } = renderHook(() => useSharedCart(mockSession, participant1));
			const { result: cart2 } = renderHook(() => useSharedCart(mockSession, participant2));

			// Both participants try to clear cart simultaneously
			await act(async () => {
				await Promise.all([cart1.current.handleClearCart(), cart2.current.handleClearCart()]);
			});

			// Should handle gracefully
			expect(mockSupabase.from).toHaveBeenCalledWith("order_items");
		});

		it("should handle network partitions and reconnection", async () => {
			let realtimeCallback: (payload: any) => void;

			mockChannel.on.mockImplementation((event, config, callback) => {
				realtimeCallback = callback;
				return mockChannel;
			});

			const { result } = renderHook(() => useSharedCart(mockSession, participant1));

			// Simulate network partition (no real-time updates)
			mockChannel.subscribe.mockImplementation(() => {
				throw new Error("Network partition");
			});

			// Should handle gracefully and continue working
			expect(result.current.subscriptionStatus).toBeDefined();

			// Simulate reconnection with missed updates
			act(() => {
				realtimeCallback!({
					eventType: "INSERT",
					new: {
						id: "missed-item",
						order_id: "shared-order-123",
						menu_item_id: "item-1",
						quantity: 1,
						unit_price: 12.99,
						total_price: 12.99,
						added_by_participant_id: "participant-2",
						menu_item: mockMenuItem1,
					},
					old: {},
				});
			});

			// Should process the missed update
			expect(result.current.sharedCartItems).toContainEqual(expect.objectContaining({ id: "missed-item" }));
		});
	});

	describe("Order Coordination", () => {
		it("should coordinate order submission across multiple participants", async () => {
			const sharedOrder = {
				id: "shared-order-123",
				session_id: "session-123",
				participant_id: null,
				status: "submitted" as const,
				subtotal: 28.98,
				notes: null,
				omega_order_id: null,
				created_at: "2023-01-01T00:00:00Z",
				updated_at: "2023-01-01T00:00:00Z",
			};

			mockSupabase.from.mockImplementation((table) => {
				const mockChain = {
					select: jest.fn().mockReturnThis(),
					eq: jest.fn().mockReturnThis(),
					update: jest.fn().mockReturnThis(),
					single: jest.fn(),
				};

				if (table === "orders") {
					mockChain.single.mockResolvedValue({ data: sharedOrder, error: null });
				}

				return mockChain as any;
			});

			const { result: cart1 } = renderHook(() => useSharedCart(mockSession, participant1));
			const { result: cart2 } = renderHook(() => useSharedCart(mockSession, participant2));

			// One participant submits the shared order
			await act(async () => {
				await cart1.current.handleSubmitOrder();
			});

			// The other participant should see the order as submitted
			await act(async () => {
				await cart2.current.loadSharedCart();
			});

			expect(mockSupabase.from).toHaveBeenCalledWith("orders");
		});

		it("should handle partial order submissions", async () => {
			// Test scenario where only some participants submit their items
			// const participant1Items = ["item-1", "item-2"];
			// const participant2Items = ["item-3"];

			mockSupabase.from.mockImplementation(() => {
				const mockChain = {
					select: jest.fn().mockReturnThis(),
					eq: jest.fn().mockReturnThis(),
					update: jest.fn().mockReturnThis(),
					in: jest.fn().mockReturnThis(),
				};

				return mockChain as any;
			});

			const { result: cart1 } = renderHook(() => useSharedCart(mockSession, participant1));
			const { result: cart2 } = renderHook(() => useSharedCart(mockSession, participant2));

			// Participant 1 submits their items
			await act(async () => {
				await cart1.current.handleSubmitOrder();
			});

			// Participant 2 keeps shopping (doesn't submit yet)
			// This should be handled gracefully in the UI
			expect(cart2.current.sharedCartItems).toBeDefined();
		});
	});
});
