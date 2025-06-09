import { NextRequest, NextResponse } from "next/server";
import { updateParticipantActivity } from "@/lib/session-management";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { participantId } = body;

		if (!participantId) {
			return NextResponse.json({ error: "participantId is required" }, { status: 400 });
		}

		await updateParticipantActivity(participantId);

		return NextResponse.json({
			success: true,
			timestamp: new Date().toISOString(),
			message: "Heartbeat received",
		});
	} catch (error) {
		console.error("Heartbeat error:", error);
		return NextResponse.json({ error: "Heartbeat failed" }, { status: 500 });
	}
}
