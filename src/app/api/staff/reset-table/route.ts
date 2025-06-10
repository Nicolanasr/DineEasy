import { NextRequest, NextResponse } from "next/server";
import { staffResetTable } from "@/lib/session-management";
import { 
  validateRequestBody, 
  validateSessionId, 
  validateStaffId, 
  validateRestaurantId,
  createValidationError,
  handleApiError 
} from "@/lib/api-validation";

export async function POST(request: NextRequest) {
	try {
		const body = await validateRequestBody(request);
		const { tableId, restaurantId, staffId } = body;

		// Validate table ID
		const validTableId = validateSessionId(tableId); // Using same validation as session ID
		if (!validTableId) {
			return createValidationError("Valid table ID is required", "tableId");
		}

		// Validate restaurant ID
		const validRestaurantId = validateRestaurantId(restaurantId);
		if (!validRestaurantId) {
			return createValidationError("Valid restaurant ID is required", "restaurantId");
		}

		// Validate staff ID
		const validStaffId = validateStaffId(staffId);
		if (!validStaffId) {
			return createValidationError("Valid staff ID is required", "staffId");
		}

		const newSession = await staffResetTable(validTableId, validRestaurantId, validStaffId);

		return NextResponse.json({
			success: true,
			session: newSession,
			message: "Table reset successfully",
		});
	} catch (error) {
		return handleApiError(error);
	}
}
