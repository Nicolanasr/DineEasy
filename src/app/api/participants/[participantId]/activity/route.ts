// src/app/api/participants/[participantId]/activity/route.ts
import { NextRequest, NextResponse } from "next/server";
import { updateParticipantActivity } from "@/lib/session-management";

type Context = {
	params: { participantId: string };
};

export async function PUT(request: NextRequest, context: Context) {
	try {
		const { participantId } = context.params;
		await updateParticipantActivity(participantId);

		return NextResponse.json({
			success: true,
			message: "Activity updated successfully",
		});
	} catch (error) {
		console.error("Update activity error:", error);
		return NextResponse.json({ error: "Failed to update activity" }, { status: 500 });
	}
}
