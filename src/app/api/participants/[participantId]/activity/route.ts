import { NextRequest, NextResponse } from "next/server";
import { updateParticipantActivity } from "@/lib/session-management";

type ParticipantActivityRouteContext = {
	params: {
		participantId: string;
	};
};

export async function PUT(request: NextRequest, context: ParticipantActivityRouteContext) {
	const { participantId } = context.params;

	try {
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
