// src/lib/session-management.ts
import { supabase, type TableSession, type SessionParticipant, type Restaurant } from "./supabase";
import { Order } from "./types";
import {
  SESSION_DURATIONS,
  TIME_MS,
  SESSION_EXTENSION,
  RESTAURANT_TYPES,
  SESSION_STATUS,
  CLOSE_REASONS,
  CLEANUP,
} from "./constants";

// Session activity tracking interface
export interface SessionActivity {
	lastOrderAt?: string;
	lastServiceRequestAt?: string;
	lastParticipantActivityAt?: string;
}

// Restaurant settings interface
export interface RestaurantSettings {
	type?: string;
	session_duration_minutes?: number;
	auto_extend_sessions?: boolean;
	allow_staff_reset?: boolean;
	cleanup_policy?: "aggressive" | "standard" | "lenient";
}

// Get session duration based on restaurant type
export const getSessionDuration = (restaurantType: string): number => {
	const typeMap: Record<string, number> = {
		[RESTAURANT_TYPES.FAST_CASUAL]: SESSION_DURATIONS.FAST_CASUAL,
		[RESTAURANT_TYPES.CASUAL_DINING]: SESSION_DURATIONS.CASUAL_DINING,
		[RESTAURANT_TYPES.FINE_DINING]: SESSION_DURATIONS.FINE_DINING,
		[RESTAURANT_TYPES.CAFE]: SESSION_DURATIONS.CAFE,
		[RESTAURANT_TYPES.BAR]: SESSION_DURATIONS.BAR,
		[RESTAURANT_TYPES.DEFAULT]: SESSION_DURATIONS.DEFAULT,
	};
	return typeMap[restaurantType] || SESSION_DURATIONS.DEFAULT;
};

// Check if session should be extended based on activity
export const shouldExtendSession = (session: TableSession, activity: SessionActivity): boolean => {
	const now = new Date();
	const lastActivity = new Date(
		Math.max(
			new Date(activity.lastOrderAt || 0).getTime(),
			new Date(activity.lastServiceRequestAt || 0).getTime(),
			new Date(activity.lastParticipantActivityAt || 0).getTime()
		)
	);

	// Extend if there's been activity in the last 30 minutes
	const activityThreshold = new Date(now.getTime() - SESSION_EXTENSION.ACTIVITY_THRESHOLD_MINUTES * TIME_MS.MINUTE);
	return lastActivity > activityThreshold;
};

// Generate unique session token
export const generateSessionToken = (): string => {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Get restaurant data
export const getRestaurant = async (restaurantId: string): Promise<Restaurant | null> => {
	const { data: restaurant } = await supabase.from("restaurants").select("*").eq("id", restaurantId).single();

	return restaurant;
};

// Find active session for a table
const findActiveSession = async (tableId: string) => {
	const now = new Date();
	return await supabase
		.from("table_sessions")
		.select(
			`
      *,
      participants:session_participants(*),
      orders:orders(*)
    `
		)
		.eq("table_id", tableId)
		.eq("status", SESSION_STATUS.ACTIVE)
		.gt("expires_at", now.toISOString())
		.maybeSingle();
};

// Calculate latest activity from participants and orders
const calculateLatestActivity = (participants: SessionParticipant[], orders: Order[]): SessionActivity => {
	const lastParticipantActivity = participants.length > 0
		? participants
				.map((p) => new Date(p.last_active_at))
				.reduce((latest, current) => (current > latest ? current : latest), new Date(0))
		: new Date(0);

	const lastOrderActivity = orders.length > 0
		? orders
				.map((o) => new Date(o.updated_at))
				.reduce((latest, current) => (current > latest ? current : latest), new Date(0))
		: new Date(0);

	return {
		lastParticipantActivityAt: lastParticipantActivity.toISOString(),
		lastOrderAt: lastOrderActivity.toISOString(),
	};
};

// Extend an existing session
const extendExistingSession = async (session: TableSession): Promise<TableSession> => {
	const now = new Date();
	const newExpiry = new Date(now.getTime() + SESSION_EXTENSION.DEFAULT_EXTENSION_MINUTES * TIME_MS.MINUTE);
	
	const { data: updatedSession, error } = await supabase
		.from("table_sessions")
		.update({ expires_at: newExpiry.toISOString() })
		.eq("id", session.id)
		.select()
		.single();

	if (error) throw new Error("Failed to extend session");
	return updatedSession;
};

// Close an inactive session
const closeInactiveSession = async (sessionId: string): Promise<void> => {
	await supabase
		.from("table_sessions")
		.update({ status: SESSION_STATUS.COMPLETED })
		.eq("id", sessionId);
};

// Create a new session
const createNewSession = async (tableId: string, restaurantId: string): Promise<TableSession> => {
	const now = new Date();
	const restaurant = await getRestaurant(restaurantId);
	const restaurantSettings = (restaurant?.settings as RestaurantSettings) || {};
	const sessionDuration = restaurantSettings.session_duration_minutes || 
		getSessionDuration(restaurantSettings.type || RESTAURANT_TYPES.DEFAULT);

	const expiresAt = new Date(now.getTime() + sessionDuration * TIME_MS.MINUTE);

	const { data: newSession, error: sessionError } = await supabase
		.from("table_sessions")
		.insert({
			table_id: tableId,
			restaurant_id: restaurantId,
			session_token: generateSessionToken(),
			expires_at: expiresAt.toISOString(),
			status: SESSION_STATUS.ACTIVE,
		})
		.select()
		.single();

	if (sessionError) {
		throw new Error("Failed to create session");
	}

	return newSession;
};

// Smart session creation or joining logic (refactored)
export const createOrJoinSession = async (tableId: string, restaurantId: string): Promise<TableSession> => {
	const { data: existingSession } = await findActiveSession(tableId);

	if (existingSession) {
		const participants = existingSession.participants as SessionParticipant[];
		const orders = existingSession.orders as Order[];

		if (participants.length > 0 || orders.length > 0) {
			const activity = calculateLatestActivity(participants, orders);

			if (shouldExtendSession(existingSession, activity)) {
				return await extendExistingSession(existingSession);
			} else {
				await closeInactiveSession(existingSession.id);
			}
		} else {
			// No participants or orders, return existing session
			return existingSession;
		}
	}

	// Create new session
	return await createNewSession(tableId, restaurantId);
};

// Update participant activity timestamp
export const updateParticipantActivity = async (participantId: string): Promise<void> => {
	const { error } = await supabase.from("session_participants").update({ last_active_at: new Date().toISOString() }).eq("id", participantId);

	if (error) {
		console.error("Failed to update participant activity:", error);
	}
};

// Extend session manually
export const extendSession = async (sessionId: string, additionalMinutes: number = SESSION_EXTENSION.DEFAULT_EXTENSION_MINUTES): Promise<void> => {
	const now = new Date();
	const newExpiry = new Date(now.getTime() + additionalMinutes * TIME_MS.MINUTE);

	const { error } = await supabase
		.from("table_sessions")
		.update({ expires_at: newExpiry.toISOString() })
		.eq("id", sessionId);

	if (error) {
		throw new Error("Failed to extend session");
	}
};

// End session manually
export const endSession = async (sessionId: string, reason: keyof typeof CLOSE_REASONS): Promise<void> => {
	const { error } = await supabase
		.from("table_sessions")
		.update({
			status: SESSION_STATUS.COMPLETED,
			settings: {
				closed_reason: CLOSE_REASONS[reason],
				closed_at: new Date().toISOString(),
			},
		})
		.eq("id", sessionId);

	if (error) {
		throw new Error("Failed to end session");
	}
};

// Staff can reset table (close current session and create new one)
export const staffResetTable = async (tableId: string, restaurantId: string, staffId: string): Promise<TableSession> => {
	// Close any active session
	await supabase
		.from("table_sessions")
		.update({
			status: SESSION_STATUS.COMPLETED,
			settings: {
				closed_by_staff: staffId,
				closed_reason: CLOSE_REASONS.STAFF_RESET,
				closed_at: new Date().toISOString(),
			},
		})
		.eq("table_id", tableId)
		.eq("status", SESSION_STATUS.ACTIVE);

	// Create fresh session
	return createOrJoinSession(tableId, restaurantId);
};

// Clean up expired sessions
export const cleanupExpiredSessions = async (): Promise<{ count: number }> => {
	const now = new Date();

	// Mark expired sessions as completed
	const { data: expiredSessions, error } = await supabase
		.from("table_sessions")
		.update({ status: SESSION_STATUS.COMPLETED })
		.eq("status", SESSION_STATUS.ACTIVE)
		.lt("expires_at", now.toISOString())
		.select();

	if (error) {
		throw new Error("Failed to cleanup expired sessions");
	}

	// Optional: Archive old completed sessions
	const archiveDate = new Date(now.getTime() - CLEANUP.ARCHIVE_AFTER_DAYS * TIME_MS.DAY);
	await supabase
		.from("table_sessions")
		.delete()
		.eq("status", SESSION_STATUS.COMPLETED)
		.lt("updated_at", archiveDate.toISOString());

	return { count: expiredSessions?.length || 0 };
};

// Get session with full details
export const getSessionDetails = async (sessionId: string) => {
	const { data: session, error } = await supabase
		.from("table_sessions")
		.select(
			`
      *,
      table:tables(*),
      restaurant:restaurants(*),
      participants:session_participants(*),
      orders:orders(
        *,
        items:order_items(
          *,
          menu_item:menu_items(*)
        )
      ),
      service_requests:service_requests(*)
    `
		)
		.eq("id", sessionId)
		.single();

	if (error) {
		throw new Error("Failed to get session details");
	}

	return session;
};

// Format time remaining for display
export const formatTimeRemaining = (expiresAt: string): string => {
	const now = new Date();
	const expires = new Date(expiresAt);
	const diffMs = expires.getTime() - now.getTime();

	if (diffMs <= 0) {
		return "Expired";
	}

	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

	if (diffHours > 0) {
		return `${diffHours}h ${diffMinutes}m remaining`;
	}
	return `${diffMinutes}m remaining`;
};
