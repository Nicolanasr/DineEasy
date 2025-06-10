// src/lib/constants.ts

// Session duration constants (in minutes)
export const SESSION_DURATIONS = {
  FAST_CASUAL: 45,
  CASUAL_DINING: 90,
  FINE_DINING: 180,
  CAFE: 60,
  BAR: 240,
  DEFAULT: 120,
} as const;

// Time constants (in milliseconds)
export const TIME_MS = {
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

// Session extension constants
export const SESSION_EXTENSION = {
  ACTIVITY_THRESHOLD_MINUTES: 30,
  DEFAULT_EXTENSION_MINUTES: 60,
  UPDATE_INTERVAL_MS: 60 * 1000, // 1 minute
} as const;

// Participant constants
export const PARTICIPANT_COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#8B5CF6", // Purple
  "#F97316", // Orange
  "#06B6D4", // Cyan
  "#84CC16", // Lime
] as const;

// API timeouts and delays
export const API_TIMEOUTS = {
  DEFAULT_TIMEOUT_MS: 5000,
  RETRY_DELAY_MS: 500,
  HEARTBEAT_INTERVAL_MS: 30 * 1000, // 30 seconds
} as const;

// Database cleanup constants
export const CLEANUP = {
  ARCHIVE_AFTER_DAYS: 7,
  CLEANUP_BATCH_SIZE: 100,
} as const;

// Restaurant type mapping
export const RESTAURANT_TYPES = {
  FAST_CASUAL: "fast-casual",
  CASUAL_DINING: "casual-dining",  
  FINE_DINING: "fine-dining",
  CAFE: "cafe",
  BAR: "bar",
  DEFAULT: "default",
} as const;

// Session status constants
export const SESSION_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  EXPIRED: "expired",
} as const;

// Session close reasons
export const CLOSE_REASONS = {
  CUSTOMER_LEFT: "customer_left",
  MANUAL_CLOSE: "manual_close", 
  NEW_CUSTOMERS: "new_customers",
  STAFF_RESET: "staff_reset",
} as const;