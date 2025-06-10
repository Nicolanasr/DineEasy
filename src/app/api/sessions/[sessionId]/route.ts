// src/app/api/sessions/[sessionId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionDetails, endSession } from "@/lib/session-management";
import { 
  validateSessionId, 
  createValidationError,
  handleApiError 
} from "@/lib/api-validation";
import { CLOSE_REASONS } from "@/lib/constants";

export async function GET(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
	try {
		const { sessionId } = await params;
		
		// Validate session ID
		const validSessionId = validateSessionId(sessionId);
		if (!validSessionId) {
			return createValidationError("Valid session ID is required", "sessionId");
		}

		const sessionDetails = await getSessionDetails(validSessionId);
		return NextResponse.json(sessionDetails);
	} catch (error) {
		return handleApiError(error);
	}
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
	try {
		const { sessionId } = await params;
		
		// Validate session ID
		const validSessionId = validateSessionId(sessionId);
		if (!validSessionId) {
			return createValidationError("Valid session ID is required", "sessionId");
		}

		const url = new URL(request.url);
		const reasonParam = url.searchParams.get("reason") || "MANUAL_CLOSE";
		
		// Validate reason parameter
		const validReasons = Object.keys(CLOSE_REASONS) as (keyof typeof CLOSE_REASONS)[];
		const reason = validReasons.find(r => CLOSE_REASONS[r] === reasonParam || r === reasonParam) || "MANUAL_CLOSE";

		await endSession(validSessionId, reason);

		return NextResponse.json({
			success: true,
			message: "Session ended successfully",
		});
	} catch (error) {
		return handleApiError(error);
	}
}
