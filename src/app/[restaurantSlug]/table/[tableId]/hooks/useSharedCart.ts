// src/app/[restaurantSlug]/table/[tableId]/hooks/useSharedCart.ts
import { useState, useEffect, useCallback } from "react";
import { OrderInsert, OrderItemInsert, supabase, type MenuItem, type OrderItem, type SessionParticipant } from "@/lib/supabase";

// Shared cart item with participant and menu info
type SharedCartItem = OrderItem & {
	menu_items: MenuItem;
	session_participants: SessionParticipant | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useSharedCart(session: any, currentParticipant: any) {
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
				console.error("Error querying existing order:", orderQueryError);
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
				console.error("Error creating order:", createOrderError);
				return null;
			}

			return newOrder.id;
		} catch (error) {
			console.error("Failed to get or create shared order:", error);
			return null;
		}
	};

	// Add item to shared cart
	const handleAddItem = async (item: MenuItem, quantity: number, customizations?: string[], notes?: string) => {
		console.log("🛒 Starting handleAddItem process...");
		console.log("   Item:", item.name, "Quantity:", quantity);
		console.log("   Current participant:", currentParticipant?.id);
		console.log("   Session:", session?.id);

		if (!currentParticipant || !session) {
			console.error("❌ Missing required data:", {
				hasParticipant: !!currentParticipant,
				hasSession: !!session,
			});
			return;
		}

		try {
			console.log("🔍 Getting or creating shared order...");
			const orderId = await getOrCreateSharedOrder();

			if (!orderId) {
				console.error("❌ Could not get or create shared order");
				return;
			}

			console.log("✅ Using order ID:", orderId);

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

			console.log("📝 Inserting order item with data:", orderItemData);

			const { data, error: itemsError } = await supabase.from("order_items").insert(orderItemData).select();

			if (itemsError) {
				console.error("❌ Error inserting order item:", itemsError);
				return;
			}

			console.log("✅ Item inserted successfully:", data);
			console.log("🔄 Forcing cart reload...");

			// Force immediate reload
			await loadSharedCart();

			console.log("✅ handleAddItem completed successfully");
		} catch (error) {
			console.error("💥 Failed to add item to shared cart:", error);
		}
	};

	// Load shared cart
	const loadSharedCart = useCallback(async () => {
		if (!session?.id) {
			console.log("❌ No session ID, skipping cart load");
			return;
		}

		try {
			console.log("🔄 Loading shared cart for session:", session.id);
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

			console.log("📦 Raw order data from DB:", orderData);
			console.log("❌ Order query error:", orderError);

			if (orderError) {
				console.error("Error loading shared cart:", orderError);
				return;
			}

			if (orderData) {
				const items = (orderData.order_items || []) as unknown as SharedCartItem[];
				console.log("✅ Processed cart items:", items.length, items);
				setSharedCartItems(items);
				setSharedOrderId(orderData.id);
				console.log("✅ Cart state updated - items count:", items.length);
			} else {
				console.log("📭 No order found, setting empty cart");
				setSharedCartItems([]);
				setSharedOrderId(null);
			}
		} catch (error) {
			console.error("💥 Failed to load shared cart:", error);
		} finally {
			setIsLoadingCart(false);
			console.log("🏁 loadSharedCart completed");
		}
	}, [session?.id]);

	// Remove item from cart
	const handleRemoveItem = async (itemId: string) => {
		try {
			console.log("Removing item:", itemId);
			const { error } = await supabase.from("order_items").delete().eq("id", itemId);

			if (error) {
				console.error("Error removing item:", error);
				return;
			}

			console.log("Item removed, reloading cart");
			await loadSharedCart();
		} catch (error) {
			console.error("Failed to remove item:", error);
		}
	};

	// Update item quantity
	const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
		if (newQuantity <= 0) {
			await handleRemoveItem(itemId);
			return;
		}

		try {
			console.log("Updating quantity for item:", itemId, "to:", newQuantity);

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
				console.error("Error updating quantity:", error);
				return;
			}

			console.log("Quantity updated, reloading cart");
			await loadSharedCart();
		} catch (error) {
			console.error("Failed to update quantity:", error);
		}
	};

	// Clear entire cart
	const handleClearCart = async () => {
		if (!sharedOrderId) return;

		try {
			console.log("Clearing cart");
			const { error } = await supabase.from("order_items").delete().eq("order_id", sharedOrderId);

			if (error) {
				console.error("Error clearing cart:", error);
				return;
			}

			console.log("Cart cleared, reloading");
			await loadSharedCart();
		} catch (error) {
			console.error("Failed to clear cart:", error);
		}
	};

	// Submit order
	const handleSubmitOrder = async () => {
		if (!sharedOrderId) return;

		try {
			const { error } = await supabase.from("orders").update({ status: "submitted" }).eq("id", sharedOrderId);

			if (error) {
				console.error("Error submitting order:", error);
				return;
			}

			console.log("Order submitted successfully");
			await loadSharedCart();
		} catch (error) {
			console.error("Failed to submit order:", error);
		}
	};

	// Load cart when session is available
	useEffect(() => {
		if (session?.id) {
			console.log("Session available, loading cart");
			loadSharedCart();
		}
	}, [session?.id, loadSharedCart]);

	// Set up real-time subscriptions
	useEffect(() => {
		if (!session?.id) return;

		console.log("Setting up real-time subscriptions for session:", session.id);

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
					console.log("Order items changed:", payload.eventType, payload);
					loadSharedCart();
				}
			)
			.subscribe((status) => {
				console.log("Order items subscription status:", status);
				setSubscriptionStatus(status);
			});

		return () => {
			console.log("Cleaning up subscriptions");
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
