// src/app/api/sessions/extend/route.ts
import { NextRequest, NextResponse } from "next/server";
import { extendSession } from "@/lib/session-management";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { sessionId, additionalMinutes = 60 } = body;

		if (!sessionId) {
			return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
		}

		await extendSession(sessionId, additionalMinutes);

		return NextResponse.json({
			success: true,
			message: `Session extended by ${additionalMinutes} minutes`,
		});
	} catch (error) {
		console.error("Session extension error:", error);
		return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to extend session" }, { status: 500 });
	}
}
