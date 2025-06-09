// src/lib/session-management.ts
import { supabase, type TableSession, type SessionParticipant, type Restaurant } from "./supabase";

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
	const durations = {
		"fast-casual": 45, // minutes
		"casual-dining": 90,
		"fine-dining": 180,
		cafe: 60,
		bar: 240,
		default: 120,
	};
	return durations[restaurantType as keyof typeof durations] || durations.default;
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
	const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
	return lastActivity > thirtyMinutesAgo;
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

// Smart session creation or joining logic
export const createOrJoinSession = async (tableId: string, restaurantId: string): Promise<TableSession> => {
	const now = new Date();

	// Look for active session with related data
	const { data: existingSession } = await supabase
		.from("table_sessions")
		.select(
			`
      *,
      participants:session_participants(*),
      orders:orders(*)
    `
		)
		.eq("table_id", tableId)
		.eq("status", "active")
		.gt("expires_at", now.toISOString())
		.maybeSingle();

	if (existingSession) {
		// Check if session should be extended based on activity
		const participants = existingSession.participants as SessionParticipant[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const orders = existingSession.orders as any[];

		if (participants.length > 0 || orders.length > 0) {
			const lastParticipantActivity =
				participants.length > 0
					? participants
							.map((p) => new Date(p.last_active_at))
							.reduce((latest, current) => (current > latest ? current : latest), new Date(0))
					: new Date(0);

			const lastOrderActivity =
				orders.length > 0
					? orders.map((o) => new Date(o.updated_at)).reduce((latest, current) => (current > latest ? current : latest), new Date(0))
					: new Date(0);

			const activity: SessionActivity = {
				lastParticipantActivityAt: lastParticipantActivity.toISOString(),
				lastOrderAt: lastOrderActivity.toISOString(),
			};

			if (shouldExtendSession(existingSession, activity)) {
				// Extend session by 1 hour
				const newExpiry = new Date(now.getTime() + 60 * 60 * 1000);
				const { data: updatedSession, error } = await supabase
					.from("table_sessions")
					.update({ expires_at: newExpiry.toISOString() })
					.eq("id", existingSession.id)
					.select()
					.single();

				if (error) throw new Error("Failed to extend session");
				return updatedSession;
			} else {
				// Close inactive session
				await supabase.from("table_sessions").update({ status: "completed" }).eq("id", existingSession.id);
			}
		} else {
			// No participants or orders, return existing session
			return existingSession;
		}
	}

	// Create new session
	const restaurant = await getRestaurant(restaurantId);
	const restaurantSettings = (restaurant?.settings as RestaurantSettings) || {};
	const sessionDuration = restaurantSettings.session_duration_minutes || getSessionDuration(restaurantSettings.type || "default");

	const expiresAt = new Date(now.getTime() + sessionDuration * 60 * 1000);

	const { data: newSession, error: sessionError } = await supabase
		.from("table_sessions")
		.insert({
			table_id: tableId,
			restaurant_id: restaurantId,
			session_token: generateSessionToken(),
			expires_at: expiresAt.toISOString(),
			status: "active",
		})
		.select()
		.single();

	if (sessionError) {
		throw new Error("Failed to create session");
	}

	return newSession;
};

// Update participant activity timestamp
export const updateParticipantActivity = async (participantId: string): Promise<void> => {
	const { error } = await supabase.from("session_participants").update({ last_active_at: new Date().toISOString() }).eq("id", participantId);

	if (error) {
		console.error("Failed to update participant activity:", error);
	}
};

// Extend session manually
export const extendSession = async (sessionId: string, additionalMinutes: number = 60): Promise<void> => {
	const now = new Date();
	const newExpiry = new Date(now.getTime() + additionalMinutes * 60 * 1000);

	const { error } = await supabase.from("table_sessions").update({ expires_at: newExpiry.toISOString() }).eq("id", sessionId);

	if (error) {
		throw new Error("Failed to extend session");
	}
};

// End session manually
export const endSession = async (sessionId: string, reason: "customer_left" | "manual_close" | "new_customers" | "staff_reset"): Promise<void> => {
	const { error } = await supabase
		.from("table_sessions")
		.update({
			status: "completed",
			settings: {
				closed_reason: reason,
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
			status: "completed",
			settings: {
				closed_by_staff: staffId,
				closed_reason: "staff_reset",
				closed_at: new Date().toISOString(),
			},
		})
		.eq("table_id", tableId)
		.eq("status", "active");

	// Create fresh session
	return createOrJoinSession(tableId, restaurantId);
};

// Clean up expired sessions
export const cleanupExpiredSessions = async (): Promise<{ count: number }> => {
	const now = new Date();

	// Mark expired sessions as completed
	const { data: expiredSessions, error } = await supabase
		.from("table_sessions")
		.update({ status: "completed" })
		.eq("status", "active")
		.lt("expires_at", now.toISOString())
		.select();

	if (error) {
		throw new Error("Failed to cleanup expired sessions");
	}

	// Optional: Archive old completed sessions (7 days+)
	const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
	await supabase.from("table_sessions").delete().eq("status", "completed").lt("updated_at", sevenDaysAgo.toISOString());

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
