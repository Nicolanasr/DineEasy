import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest, { params }: { params: Promise<{ menuItemId: string }> }) {
	try {
		const { menuItemId } = await params; // <- This is the key change

		if (!menuItemId) {
			return NextResponse.json({ error: "Menu item ID is required" }, { status: 400 });
		}

		// Rest of your code stays the same
		const { data: customizations, error } = await supabase
			.from("menu_item_customizations")
			.select("*")
			.eq("menu_item_id", menuItemId)
			.eq("is_active", true)
			.order("display_order", { ascending: true });

		if (error) {
			console.error("Error fetching menu item customizations:", error);
			return NextResponse.json({ error: "Failed to fetch customizations" }, { status: 500 });
		}

		return NextResponse.json({
			customizations: customizations || [],
		});
	} catch (error) {
		console.error("Unexpected error in menu customizations API:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
