// src/lib/api-validation.ts

import { NextResponse } from "next/server";

// Common validation error responses
export const createValidationError = (message: string, field?: string) => {
  return NextResponse.json(
    { 
      error: message,
      field,
      code: "VALIDATION_ERROR"
    }, 
    { status: 400 }
  );
};

export const createServerError = (message: string = "Internal server error") => {
  return NextResponse.json(
    { 
      error: message,
      code: "SERVER_ERROR"
    }, 
    { status: 500 }
  );
};

export const createNotFoundError = (resource: string) => {
  return NextResponse.json(
    { 
      error: `${resource} not found`,
      code: "NOT_FOUND"
    }, 
    { status: 404 }
  );
};

// Session ID validation
export const validateSessionId = (sessionId: unknown): string | null => {
  if (!sessionId || typeof sessionId !== 'string') {
    return null;
  }
  
  // Basic UUID format validation (adjust based on your ID format)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(sessionId)) {
    return null;
  }
  
  return sessionId;
};

// Minutes validation
export const validateMinutes = (minutes: unknown): number | null => {
  if (typeof minutes !== 'number') {
    const parsed = Number(minutes);
    if (isNaN(parsed)) {
      return null;
    }
    minutes = parsed;
  }
  
  const numMinutes = minutes as number;
  if (numMinutes < 1 || numMinutes > 480) { // Max 8 hours
    return null;
  }
  
  return numMinutes;
};

// Table number validation
export const validateTableNumber = (tableNumber: unknown): string | null => {
  if (!tableNumber || typeof tableNumber !== 'string') {
    return null;
  }
  
  // Allow alphanumeric table numbers with some special characters
  const tableRegex = /^[A-Za-z0-9\-_]{1,20}$/;
  if (!tableRegex.test(tableNumber)) {
    return null;
  }
  
  return tableNumber;
};

// Staff ID validation 
export const validateStaffId = (staffId: unknown): string | null => {
  if (!staffId || typeof staffId !== 'string') {
    return null;
  }
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(staffId)) {
    return null;
  }
  
  return staffId;
};

// Restaurant ID validation
export const validateRestaurantId = (restaurantId: unknown): string | null => {
  if (!restaurantId || typeof restaurantId !== 'string') {
    return null;
  }
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(restaurantId)) {
    return null;
  }
  
  return restaurantId;
};

// Request body validation helper
export const validateRequestBody = async (request: Request): Promise<Record<string, unknown>> => {
  try {
    const body = await request.json();
    return body as Record<string, unknown>;
  } catch {
    throw new Error("Invalid JSON in request body");
  }
};

// Common error handler for API routes
export const handleApiError = (error: unknown): NextResponse => {
  console.error("API Error:", error);
  
  if (error instanceof Error) {
    // Handle known validation errors
    if (error.message.includes("not found")) {
      return createNotFoundError(error.message.replace(" not found", ""));
    }
    
    if (error.message.includes("Invalid") || error.message.includes("required")) {
      return createValidationError(error.message);
    }
    
    return createServerError(error.message);
  }
  
  return createServerError();
};