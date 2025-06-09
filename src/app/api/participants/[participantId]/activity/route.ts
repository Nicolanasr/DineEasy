// src/app/api/participants/[participantId]/activity/route.ts
import { NextRequest, NextResponse } from "next/server";
import { updateParticipantActivity } from "@/lib/session-management";

export async function PUT(request: NextRequest, { params }: { params: { participantId: string } }) {
	try {
		await updateParticipantActivity(params.participantId);

		return NextResponse.json({
			success: true,
			message: "Activity updated successfully",
		});
	} catch (error) {
		console.error("Update activity error:", error);
		return NextResponse.json({ error: "Failed to update activity" }, { status: 500 });
	}
}
