// src/app/api/sessions/[sessionId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionDetails, endSession } from "@/lib/session-management";

export async function GET(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
	try {
		const { sessionId } = await params; // Note the 'await' here
		const sessionDetails = await getSessionDetails(sessionId);
		return NextResponse.json(sessionDetails);
	} catch (error) {
		console.error("Get session error:", error);
		return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to get session" }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
	try {
		const { sessionId } = await params; // Note the 'await' here
		const url = new URL(request.url);
		const reason = (url.searchParams.get("reason") as "customer_left" | "manual_close" | "new_customers" | "staff_reset") || "manual_close";

		await endSession(sessionId, reason);

		return NextResponse.json({
			success: true,
			message: "Session ended successfully",
		});
	} catch (error) {
		console.error("End session error:", error);
		return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to end session" }, { status: 500 });
	}
}
