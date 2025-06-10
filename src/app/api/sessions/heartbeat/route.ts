import { NextRequest, NextResponse } from "next/server";
import { updateParticipantActivity } from "@/lib/session-management";
import { 
  validateRequestBody, 
  validateSessionId, 
  createValidationError,
  handleApiError 
} from "@/lib/api-validation";

export async function POST(request: NextRequest) {
	try {
		const body = await validateRequestBody(request);
		const { participantId } = body;

		// Validate participant ID (using same validation as session ID)
		const validParticipantId = validateSessionId(participantId);
		if (!validParticipantId) {
			return createValidationError("Valid participant ID is required", "participantId");
		}

		await updateParticipantActivity(validParticipantId);

		return NextResponse.json({
			success: true,
			timestamp: new Date().toISOString(),
			message: "Heartbeat received",
		});
	} catch (error) {
		return handleApiError(error);
	}
}
