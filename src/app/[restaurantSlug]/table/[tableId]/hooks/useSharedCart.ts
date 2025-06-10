// src/app/[restaurantSlug]/table/[tableId]/hooks/useSharedCart.ts
import { useState, useEffect, useCallback } from "react";
import { OrderInsert, OrderItemInsert, supabase, type MenuItem, type OrderItem, type SessionParticipant, type TableSession } from "@/lib/supabase";
import { logger } from "@/lib/logger";

// Shared cart item with participant and menu info
type SharedCartItem = OrderItem & {
	menu_items: MenuItem;
	session_participants: SessionParticipant | null;
};

export function useSharedCart(session: TableSession | null, currentParticipant: SessionParticipant | null) {
	const [sharedCartItems, setSharedCartItems] = useState<SharedCartItem[]>([]);
	const [isLoadingCart, setIsLoadingCart] = useState(false);
	const [sharedOrderId, setSharedOrderId] = useState<string | null>(null);
	const [subscriptionStatus, setSubscriptionStatus] = useState<string>("disconnected");

	// Get or create shared order
	const getOrCreateSharedOrder = async (): Promise<string | null> => {
		if (!session?.id || !currentParticipant?.id) return null;

		try {
			const { data: existingOrder, error: orderQueryError } = await supabase
				.from("orders")
				.select("id")
				.eq("session_id", session.id)
				.eq("status", "cart")
				.maybeSingle();

			if (orderQueryError) {
				logger.cartLogger.error("Error querying existing order", orderQueryError);
				return null;
			}

			if (existingOrder) {
				return existingOrder.id;
			}

			const newOrderData: OrderInsert = {
				session_id: session.id,
				participant_id: currentParticipant.id,
				status: "cart",
				subtotal: 0,
				notes: "Shared table cart",
			};

			const { data: newOrder, error: createOrderError } = await supabase.from("orders").insert(newOrderData).select("id").single();

			if (createOrderError) {
				logger.cartLogger.error("Error creating order", createOrderError);
				return null;
			}

			return newOrder.id;
		} catch (error) {
			logger.cartLogger.error("Failed to get or create shared order", error);
			return null;
		}
	};

	// Add item to shared cart
	const handleAddItem = async (item: MenuItem, quantity: number, customizations?: string[], notes?: string) => {
		logger.cartLogger.debug("Starting add item process", {
			item: item.name,
			quantity,
			participantId: currentParticipant?.id,
			sessionId: session?.id,
		});

		if (!currentParticipant || !session) {
			logger.cartLogger.error("Missing required data", {
				hasParticipant: !!currentParticipant,
				hasSession: !!session,
			});
			return;
		}

		try {
			logger.cartLogger.debug("Getting or creating shared order");
			const orderId = await getOrCreateSharedOrder();

			if (!orderId) {
				logger.cartLogger.error("Could not get or create shared order");
				return;
			}

			logger.cartLogger.debug("Using order ID", { orderId });

			const orderItemData: OrderItemInsert = {
				order_id: orderId,
				menu_item_id: item.id,
				quantity,
				unit_price: Number(item.price),
				total_price: Number(item.price) * quantity,
				customizations: customizations?.length ? customizations : null,
				notes: notes?.trim() || null,
				added_by_participant_id: currentParticipant.id,
			};

			logger.cartLogger.debug("Inserting order item", orderItemData);

			const { data, error: itemsError } = await supabase.from("order_items").insert(orderItemData).select();

			if (itemsError) {
				logger.cartLogger.error("Error inserting order item", itemsError);
				return;
			}

			logger.cartLogger.info("Item added successfully", { itemId: data?.[0]?.id });

			// Force immediate reload
			await loadSharedCart();
		} catch (error) {
			logger.cartLogger.error("Failed to add item to shared cart", error);
		}
	};

	// Load shared cart
	const loadSharedCart = useCallback(async () => {
		if (!session?.id) {
			logger.cartLogger.debug("No session ID, skipping cart load");
			return;
		}

		try {
			logger.cartLogger.debug("Loading shared cart", { sessionId: session.id });
			setIsLoadingCart(true);

			const { data: orderData, error: orderError } = await supabase
				.from("orders")
				.select(
					`
                    id,
                    subtotal,
                    order_items(
                        id,
                        quantity,
                        unit_price,
                        total_price,
                        customizations,
                        notes,
                        added_by_participant_id,
                        created_at,
                        menu_items(
                            id,
                            name,
                            description,
                            image_url,
                            price
                        ),
                        session_participants(
                            id,
                            display_name,
                            color_code
                        )
                    )
                `
				)
				.eq("session_id", session.id)
				.eq("status", "cart")
				.maybeSingle();

			if (orderError) {
				logger.cartLogger.error("Error loading shared cart", orderError);
				return;
			}

			if (orderData) {
				const items = (orderData.order_items || []) as unknown as SharedCartItem[];
				logger.cartLogger.debug("Cart loaded", { itemCount: items.length });
				setSharedCartItems(items);
				setSharedOrderId(orderData.id);
			} else {
				logger.cartLogger.debug("No order found, setting empty cart");
				setSharedCartItems([]);
				setSharedOrderId(null);
			}
		} catch (error) {
			logger.cartLogger.error("Failed to load shared cart", error);
		} finally {
			setIsLoadingCart(false);
		}
	}, [session?.id]);

	// Remove item from cart
	const handleRemoveItem = async (itemId: string) => {
		try {
			logger.cartLogger.debug("Removing item", { itemId });
			const { error } = await supabase.from("order_items").delete().eq("id", itemId);

			if (error) {
				logger.cartLogger.error("Error removing item", error);
				return;
			}

			logger.cartLogger.info("Item removed", { itemId });
			await loadSharedCart();
		} catch (error) {
			logger.cartLogger.error("Failed to remove item", error);
		}
	};

	// Update item quantity
	const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
		if (newQuantity <= 0) {
			await handleRemoveItem(itemId);
			return;
		}

		try {
			logger.cartLogger.debug("Updating quantity", { itemId, newQuantity });

			const item = sharedCartItems.find((item) => item.id === itemId);
			if (!item) return;

			const newTotal = item.unit_price * newQuantity;

			const { error } = await supabase
				.from("order_items")
				.update({
					quantity: newQuantity,
					total_price: newTotal,
				})
				.eq("id", itemId);

			if (error) {
				logger.cartLogger.error("Error updating quantity", error);
				return;
			}

			logger.cartLogger.info("Quantity updated", { itemId, newQuantity });
			await loadSharedCart();
		} catch (error) {
			logger.cartLogger.error("Failed to update quantity", error);
		}
	};

	// Clear entire cart
	const handleClearCart = async () => {
		if (!sharedOrderId) return;

		try {
			logger.cartLogger.info("Clearing cart", { orderId: sharedOrderId });
			const { error } = await supabase.from("order_items").delete().eq("order_id", sharedOrderId);

			if (error) {
				logger.cartLogger.error("Error clearing cart", error);
				return;
			}

			logger.cartLogger.info("Cart cleared successfully");
			await loadSharedCart();
		} catch (error) {
			logger.cartLogger.error("Failed to clear cart", error);
		}
	};

	// Submit order
	const handleSubmitOrder = async () => {
		if (!sharedOrderId) return;

		try {
			const { error } = await supabase.from("orders").update({ status: "submitted" }).eq("id", sharedOrderId);

			if (error) {
				logger.cartLogger.error("Error submitting order", error);
				return;
			}

			logger.cartLogger.info("Order submitted successfully", { orderId: sharedOrderId });
			await loadSharedCart();
		} catch (error) {
			logger.cartLogger.error("Failed to submit order", error);
		}
	};

	// Set up real-time subscriptions first, then load cart
	useEffect(() => {
		if (!session?.id) return;

		logger.cartLogger.debug("Setting up real-time subscriptions", { sessionId: session.id });
		let hasLoadedInitialData = false;

		// Set up subscription before loading data to avoid race conditions
		const orderItemsChannel = supabase
			.channel(`order_items_${session.id}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "order_items",
				},
				(payload) => {
					logger.cartLogger.debug("Order items changed", { eventType: payload.eventType });
					// Only reload if we've already loaded initial data
					if (hasLoadedInitialData) {
						loadSharedCart();
					}
				}
			)
			.subscribe((status) => {
				logger.cartLogger.debug("Subscription status changed", { status });
				setSubscriptionStatus(status);

				// Load cart data after subscription is established
				if (status === "SUBSCRIBED" && !hasLoadedInitialData) {
					logger.cartLogger.info("Subscription established, loading cart");
					hasLoadedInitialData = true;
					loadSharedCart();
				}
			});

		return () => {
			logger.cartLogger.debug("Cleaning up subscriptions");
			supabase.removeChannel(orderItemsChannel);
			setSubscriptionStatus("disconnected");
		};
	}, [session?.id, loadSharedCart]);

	// Calculate cart total
	const cartTotal = sharedCartItems.reduce((total, item) => total + Number(item.total_price), 0);

	return {
		sharedCartItems,
		isLoadingCart,
		sharedOrderId,
		subscriptionStatus,
		cartTotal,
		handleAddItem,
		handleRemoveItem,
		handleUpdateQuantity,
		handleClearCart,
		handleSubmitOrder,
		loadSharedCart,
	};
}
