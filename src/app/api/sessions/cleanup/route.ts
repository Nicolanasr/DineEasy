// src/app/api/sessions/cleanup/route.ts
import { NextResponse } from "next/server";
import { cleanupExpiredSessions } from "@/lib/session-management";

export async function POST() {
	try {
		const result = await cleanupExpiredSessions();

		return NextResponse.json({
			success: true,
			sessionsCleanedUp: result.count,
			message: `Cleaned up ${result.count} expired sessions`,
		});
	} catch (error) {
		console.error("Session cleanup error:", error);
		return NextResponse.json({ error: error instanceof Error ? error.message : "Cleanup failed" }, { status: 500 });
	}
}
