import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest, { params }: { params: Promise<{ restaurantId: string }> }) {
	try {
		const { restaurantId } = await params;

		if (!restaurantId) {
			return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 });
		}

		// Fetch all customizations for the restaurant
		const { data: customizations, error } = await supabase
			.from("menu_item_customizations")
			.select("*")
			.eq("restaurant_id", restaurantId)
			.eq("is_active", true)
			.order("menu_item_id, display_order", { ascending: true });

		if (error) {
			console.error("Error fetching restaurant customizations:", error);
			return NextResponse.json({ error: "Failed to fetch customizations" }, { status: 500 });
		}

		// Group customizations by menu item ID
		const customizationsByItem = (customizations || []).reduce((acc, customization) => {
			const menuItemId = customization.menu_item_id;
			if (!acc[menuItemId]) {
				acc[menuItemId] = [];
			}
			acc[menuItemId].push(customization);
			return acc;
		}, {} as Record<string, typeof customizations>);

		return NextResponse.json({
			customizations: customizations || [],
			customizationsByItem,
		});
	} catch (error) {
		console.error("Unexpected error in restaurant customizations API:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
