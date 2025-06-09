import { NextRequest, NextResponse } from "next/server";
import { staffResetTable } from "@/lib/session-management";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { tableId, restaurantId, staffId } = body;

		if (!tableId || !restaurantId || !staffId) {
			return NextResponse.json({ error: "tableId, restaurantId, and staffId are required" }, { status: 400 });
		}

		const newSession = await staffResetTable(tableId, restaurantId, staffId);

		return NextResponse.json({
			success: true,
			session: newSession,
			message: "Table reset successfully",
		});
	} catch (error) {
		console.error("Staff reset table error:", error);
		return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to reset table" }, { status: 500 });
	}
}
