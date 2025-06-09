// src/hooks/use-table-session.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, type TableSession, type SessionParticipant, type Restaurant } from "@/lib/supabase";
import { createOrJoinSession, formatTimeRemaining } from "@/lib/session-management";

interface TableSessionState {
	session: TableSession | null;
	restaurant: Restaurant | null;
	participants: SessionParticipant[];
	currentParticipant: SessionParticipant | null;
	isLoading: boolean;
	error: string | null;
	timeRemaining: string;
	isConnected: boolean;
}

interface UseTableSessionReturn extends TableSessionState {
	joinSession: (displayName: string) => Promise<SessionParticipant>;
	leaveSession: () => Promise<void>;
	refreshSession: () => Promise<void>;
	extendSession: () => Promise<void>;
	refreshParticipants: () => Promise<void>;
}

export const useTableSession = (restaurantSlug: string, tableNumber: string): UseTableSessionReturn => {
	const [state, setState] = useState<TableSessionState>({
		session: null,
		restaurant: null,
		participants: [],
		currentParticipant: null,
		isLoading: true,
		error: null,
		timeRemaining: "",
		isConnected: false,
	});

	// Available participant colors
	const PARTICIPANT_COLORS = [
		"#3B82F6", // Blue
		"#EF4444", // Red
		"#10B981", // Green
		"#F59E0B", // Yellow
		"#8B5CF6", // Purple
		"#F97316", // Orange
		"#06B6D4", // Cyan
		"#84CC16", // Lime
	];

	// Initialize session
	const initializeSession = useCallback(async () => {
		try {
			setState((prev) => ({ ...prev, isLoading: true, error: null }));

			// Get restaurant by slug
			const { data: restaurant, error: restaurantError } = await supabase
				.from("restaurants")
				.select("*")
				.eq("slug", restaurantSlug)
				.eq("is_active", true)
				.single();

			if (restaurantError || !restaurant) {
				throw new Error(`Restaurant "${restaurantSlug}" not found`);
			}

			// Get table for this restaurant
			const { data: table, error: tableError } = await supabase
				.from("tables")
				.select("*")
				.eq("restaurant_id", restaurant.id)
				.eq("table_number", tableNumber)
				.eq("is_active", true)
				.single();

			if (tableError || !table) {
				throw new Error(`Table ${tableNumber} not found at ${restaurant.name}`);
			}

			// Create or join session using enhanced logic
			const session = await createOrJoinSession(table.id, restaurant.id);

			//  Load existing par ticipants
			const { data: participants } = await supabase
				.from("session_participants")
				.select("*")
				.eq("session_id", session.id)
				.eq("has_left", false)
				.order("joined_at", { ascending: true });

			// Check if user is already a participant
			const currentParticipantId = localStorage.getItem(`participant_${session.id}`);
			const currentParticipant = currentParticipantId ? participants?.find((p) => p.id === currentParticipantId) || null : null;

			setState((prev) => ({
				...prev,
				session,
				restaurant,
				participants: participants || [],
				currentParticipant,
				isLoading: false,
				timeRemaining: formatTimeRemaining(session.expires_at),
			}));
		} catch (error) {
			setState((prev) => ({
				...prev,
				error: error instanceof Error ? error.message : "Failed to load table session",
				isLoading: false,
			}));
		}
	}, [restaurantSlug, tableNumber]);

	// Set up real-time subscription for participants
	useEffect(() => {
		if (!state.session?.id) return;

		console.log("Setting up real-time subscription for session:", state.session.id);

		// Create unique channel name
		const channelName = `session_participants_${state.session.id}`;

		const subscription = supabase
			.channel(channelName)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "session_participants",
					filter: `session_id=eq.${state.session.id}`,
				},
				(payload) => {
					console.log("INSERT event received:", payload);
					handleParticipantChange({ ...payload, eventType: "INSERT" });
				}
			)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "session_participants",
					filter: `session_id=eq.${state.session.id}`,
				},
				(payload) => {
					console.log("UPDATE event received:", payload);
					handleParticipantChange({ ...payload, eventType: "UPDATE" });
				}
			)
			.on(
				"postgres_changes",
				{
					event: "DELETE",
					schema: "public",
					table: "session_participants",
					filter: `session_id=eq.${state.session.id}`,
				},
				(payload) => {
					console.log("DELETE event received:", payload);
					handleParticipantChange({ ...payload, eventType: "DELETE" });
				}
			)
			.subscribe((status, err) => {
				console.log("Subscription status:", status, err);
				if (err) {
					console.error("Subscription error:", err);
				}
				setState((prev) => ({
					...prev,
					isConnected: status === "SUBSCRIBED",
				}));
			});

		return () => {
			console.log("Cleaning up subscription");
			setState((prev) => ({ ...prev, isConnected: false }));
			supabase.removeChannel(subscription);
		};
	}, [state.session?.id]);

	// Update time remaining every minute
	useEffect(() => {
		if (!state.session) return;

		const interval = setInterval(() => {
			setState((prev) => ({
				...prev,
				timeRemaining: formatTimeRemaining(state.session!.expires_at),
			}));
		}, 60000); // Update every minute

		return () => clearInterval(interval);
	}, [state.session]);

	// Set up session updates subscription
	useEffect(() => {
		if (!state.session?.id) return;

		const sessionChannelName = `session_updates_${state.session.id}`;

		const sessionSubscription = supabase
			.channel(sessionChannelName)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "table_sessions",
					filter: `id=eq.${state.session.id}`,
				},
				(payload) => {
					console.log("Session update received:", payload);
					handleSessionUpdate(payload);
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(sessionSubscription);
		};
	}, [state.session?.id]);

	// Handle participant changes from real-time subscription
	const handleParticipantChange = (payload: { eventType: string; new?: Record<string, unknown>; old?: Record<string, unknown> }) => {
		console.log("Processing participant change:", payload);
		const { eventType, new: newRecord, old: oldRecord } = payload;

		setState((prev) => {
			let newParticipants = [...prev.participants];
			console.log("Current participants before update:", newParticipants.length);

			switch (eventType) {
				case "INSERT":
					if (newRecord && !newParticipants.find((p) => p.id === newRecord.id)) {
						console.log("Adding new participant:", newRecord.display_name);
						newParticipants.push(newRecord as SessionParticipant);
					}
					break;
				case "UPDATE":
					if (newRecord) {
						console.log("Updating participant:", newRecord.display_name);
						newParticipants = newParticipants.map((p) => (p.id === newRecord.id ? (newRecord as SessionParticipant) : p));
					}
					break;
				case "DELETE":
					if (oldRecord) {
						console.log("Removing participant:", oldRecord.display_name || oldRecord.id);
						const participantId = oldRecord.id as string;
						newParticipants = newParticipants.filter((p) => p.id !== participantId);

						// If the deleted participant was the current user, clear current participant
						if (prev.currentParticipant && prev.currentParticipant.id === participantId) {
							console.log("Current participant was deleted, clearing current participant");
							return {
								...prev,
								participants: newParticipants,
								currentParticipant: null,
							};
						}
					}
					break;
			}

			console.log("Participants after update:", newParticipants.length);
			return { ...prev, participants: newParticipants };
		});
	};

	// Handle session updates from real-time subscription
	const handleSessionUpdate = (payload: { new?: Record<string, unknown> }) => {
		if (payload.new) {
			console.log("Session updated, refreshing participants list");
			// When session is updated, refresh participants to catch any missed changes
			refreshParticipants();

			setState((prev) => ({
				...prev,
				session: payload.new as TableSession,
				timeRemaining: formatTimeRemaining((payload.new as TableSession).expires_at),
			}));
		}
	};

	// Refresh participants list manually
	const refreshParticipants = async () => {
		if (!state.session?.id) return;

		try {
			console.log("Manually refreshing participants list");
			const { data: participants } = await supabase
				.from("session_participants")
				.select("*")
				.eq("session_id", state.session.id)
				.order("joined_at", { ascending: true });

			setState((prev) => ({
				...prev,
				participants: participants || [],
			}));

			console.log("Participants refreshed:", participants?.length || 0);
		} catch (error) {
			console.error("Failed to refresh participants:", error);
		}
	};

	// Join session as a new participant
	const joinSession = async (displayName: string): Promise<SessionParticipant> => {
		if (!state.session || !displayName.trim()) {
			throw new Error("Invalid session or display name");
		}

		try {
			// Get next available color
			const usedColors = state.participants.map((p) => p.color_code);
			const availableColor = PARTICIPANT_COLORS.find((color) => !usedColors.includes(color)) || PARTICIPANT_COLORS[0];

			const { data: participant, error } = await supabase
				.from("session_participants")
				.insert({
					session_id: state.session.id,
					display_name: displayName.trim(),
					color_code: availableColor,
				})
				.select()
				.single();

			if (error) {
				throw new Error("Failed to join session");
			}

			// Store participant ID in localStorage
			localStorage.setItem(`participant_${state.session.id}`, participant.id);

			setState((prev) => ({
				...prev,
				currentParticipant: participant,
			}));

			return participant;
		} catch (error) {
			throw new Error(error instanceof Error ? error.message : "Failed to join session");
		}
	};

	// Leave session (remove participant)
	const leaveSession = async (): Promise<void> => {
		if (!state.currentParticipant || !state.session) {
			throw new Error("No active participant to remove");
		}

		try {
			console.log("Leaving session, soft deleting participant:", state.currentParticipant.display_name);

			// Soft delete: mark as left instead of actually deleting
			const { error } = await supabase
				.from("session_participants")
				.update({
					has_left: true,
					left_at: new Date().toISOString(), // Optional: track when they left
				})
				.eq("id", state.currentParticipant.id);

			if (error) {
				console.error("Error updating participant:", error);
				throw new Error("Failed to leave session");
			}

			console.log("Successfully marked participant as left in database");

			// Remove from localStorage
			localStorage.removeItem(`participant_${state.session.id}`);

			// Update local state immediately (don't wait for real-time)
			setState((prev) => ({
				...prev,
				currentParticipant: null,
				participants: prev.participants.filter((p) => p.id !== state.currentParticipant!.id),
			}));

			console.log("Local state updated after leaving");

			// Force refresh for other clients after a short delay
			setTimeout(async () => {
				console.log("Broadcasting participant change via manual trigger");
				// Try to trigger a refresh by updating session timestamp
				await supabase.from("table_sessions").update({ updated_at: new Date().toISOString() }).eq("id", state.session?.id);
			}, 500);
		} catch (error) {
			console.error("Leave session error:", error);
			throw new Error(error instanceof Error ? error.message : "Failed to leave session");
		}
	};

	// Refresh session data
	const refreshSession = async (): Promise<void> => {
		await initializeSession();
	};

	// Extend current session
	const extendSession = async (): Promise<void> => {
		if (!state.session) {
			throw new Error("No active session to extend");
		}

		try {
			const response = await fetch("/api/sessions/extend", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ sessionId: state.session.id }),
			});

			if (!response.ok) {
				throw new Error("Failed to extend session");
			}

			// Refresh to get updated session data
			await refreshSession();
		} catch (error) {
			throw new Error(error instanceof Error ? error.message : "Failed to extend session");
		}
	};

	// Initialize on mount
	useEffect(() => {
		initializeSession();
	}, [initializeSession]);

	return {
		...state,
		joinSession,
		leaveSession,
		refreshSession,
		extendSession,
		refreshParticipants,
	};
};
