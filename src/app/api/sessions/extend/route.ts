// src/app/api/sessions/extend/route.ts
import { NextRequest, NextResponse } from "next/server";
import { extendSession } from "@/lib/session-management";
import { 
  validateRequestBody, 
  validateSessionId, 
  validateMinutes, 
  createValidationError,
  handleApiError 
} from "@/lib/api-validation";
import { SESSION_EXTENSION } from "@/lib/constants";

export async function POST(request: NextRequest) {
	try {
		const body = await validateRequestBody(request);
		const { sessionId, additionalMinutes = SESSION_EXTENSION.DEFAULT_EXTENSION_MINUTES } = body;

		// Validate session ID
		const validSessionId = validateSessionId(sessionId);
		if (!validSessionId) {
			return createValidationError("Valid session ID is required", "sessionId");
		}

		// Validate additional minutes
		const validMinutes = validateMinutes(additionalMinutes);
		if (validMinutes === null) {
			return createValidationError("Additional minutes must be between 1 and 480", "additionalMinutes");
		}

		await extendSession(validSessionId, validMinutes);

		return NextResponse.json({
			success: true,
			message: `Session extended by ${validMinutes} minutes`,
		});
	} catch (error) {
		return handleApiError(error);
	}
}
