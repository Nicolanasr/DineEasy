// src/hooks/use-table-session.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, type TableSession, type SessionParticipant, type Restaurant } from "@/lib/supabase";
import { createOrJoinSession, formatTimeRemaining } from "@/lib/session-management";
import { PARTICIPANT_COLORS, SESSION_EXTENSION, API_TIMEOUTS } from "@/lib/constants";

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

	// Fetch restaurant by slug
	const fetchRestaurant = async (slug: string): Promise<Restaurant> => {
		const { data: restaurant, error } = await supabase.from("restaurants").select("*").eq("slug", slug).eq("is_active", true).single();

		if (error || !restaurant) {
			throw new Error(`Restaurant "${slug}" not found`);
		}

		return restaurant;
	};

	// Fetch table for restaurant
	const fetchTable = async (restaurantId: string, tableNum: string) => {
		const { data: table, error } = await supabase
			.from("tables")
			.select("*")
			.eq("restaurant_id", restaurantId)
			.eq("table_number", tableNum)
			.eq("is_active", true)
			.single();

		if (error || !table) {
			throw new Error(`Table ${tableNum} not found`);
		}

		return table;
	};

	// Load session participants
	const loadSessionParticipants = async (sessionId: string): Promise<SessionParticipant[]> => {
		const { data: participants } = await supabase
			.from("session_participants")
			.select("*")
			.eq("session_id", sessionId)
			.eq("has_left", false)
			.order("joined_at", { ascending: true });

		return participants || [];
	};

	// Get current participant from localStorage
	const getCurrentParticipant = (sessionId: string, participants: SessionParticipant[]): SessionParticipant | null => {
		const currentParticipantId = localStorage.getItem(`participant_${sessionId}`);
		return currentParticipantId ? participants.find((p) => p.id === currentParticipantId) || null : null;
	};

	// Initialize session (refactored)
	const initializeSession = useCallback(async () => {
		try {
			setState((prev) => ({ ...prev, isLoading: true, error: null }));

			// Fetch restaurant and table
			const restaurant = await fetchRestaurant(restaurantSlug);
			const table = await fetchTable(restaurant.id, tableNumber);

			// Create or join session
			const session = await createOrJoinSession(table.id, restaurant.id);

			// Load participants and determine current participant
			const participants = await loadSessionParticipants(session.id);
			const currentParticipant = getCurrentParticipant(session.id, participants);

			// Update state with all session data
			setState((prev) => ({
				...prev,
				session,
				restaurant,
				participants,
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
					handleParticipantChange({ ...payload, eventType: "DELETE" });
				}
			)
			.subscribe((status, err) => {
				if (err) {
					console.error("Subscription error:", err);
				}
				setState((prev) => ({
					...prev,
					isConnected: status === "SUBSCRIBED",
				}));
			});

		return () => {
			setState((prev) => ({ ...prev, isConnected: false }));
			supabase.removeChannel(subscription);
		};
	}, [state.session?.id]);

	// Refresh participants list manually
	const refreshParticipants = useCallback(async () => {
		if (!state.session?.id) return;

		try {
			const { data: participants } = await supabase
				.from("session_participants")
				.select("*")
				.eq("session_id", state.session.id)
				.order("joined_at", { ascending: true });

			setState((prev) => ({
				...prev,
				participants: participants || [],
			}));
		} catch (error) {
			console.error("Failed to refresh participants:", error);
		}
	}, [state.session?.id]);

	// Handle session updates from real-time subscription
	const handleSessionUpdate = useCallback(
		(payload: { new?: Record<string, unknown> }) => {
			if (payload.new) {
				// When session is updated, refresh participants to catch any missed changes
				refreshParticipants();

				setState((prev) => ({
					...prev,
					session: payload.new as TableSession,
					timeRemaining: formatTimeRemaining((payload.new as TableSession).expires_at),
				}));
			}
		},
		[refreshParticipants]
	);

	// Update time remaining every minute
	useEffect(() => {
		if (!state.session) return;

		const interval = setInterval(() => {
			setState((prev) => ({
				...prev,
				timeRemaining: formatTimeRemaining(state.session!.expires_at),
			}));
		}, SESSION_EXTENSION.UPDATE_INTERVAL_MS);

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
					handleSessionUpdate(payload);
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(sessionSubscription);
		};
	}, [state.session?.id, handleSessionUpdate]);

	// Handle participant changes from real-time subscription
	const handleParticipantChange = (payload: { eventType: string; new?: Record<string, unknown>; old?: Record<string, unknown> }) => {
		const { eventType, new: newRecord, old: oldRecord } = payload;

		setState((prev) => {
			let newParticipants = [...prev.participants];

			switch (eventType) {
				case "INSERT":
					if (newRecord && !newParticipants.find((p) => p.id === newRecord.id)) {
						newParticipants.push(newRecord as SessionParticipant);
					}
					break;
				case "UPDATE":
					if (newRecord) {
						newParticipants = newParticipants.map((p) => (p.id === newRecord.id ? (newRecord as SessionParticipant) : p));
					}
					break;
				case "DELETE":
					if (oldRecord) {
						const participantId = oldRecord.id as string;
						newParticipants = newParticipants.filter((p) => p.id !== participantId);

						// If the deleted participant was the current user, clear current participant
						if (prev.currentParticipant && prev.currentParticipant.id === participantId) {
							return {
								...prev,
								participants: newParticipants,
								currentParticipant: null,
							};
						}
					}
					break;
			}

			return { ...prev, participants: newParticipants };
		});
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

			// Remove from localStorage
			localStorage.removeItem(`participant_${state.session.id}`);

			// Update local state immediately (don't wait for real-time)
			setState((prev) => ({
				...prev,
				currentParticipant: null,
				participants: prev.participants.filter((p) => p.id !== state.currentParticipant!.id),
			}));

			// Force refresh for other clients after a short delay
			setTimeout(async () => {
				// Try to trigger a refresh by updating session timestamp
				await supabase.from("table_sessions").update({ updated_at: new Date().toISOString() }).eq("id", state.session?.id);
			}, API_TIMEOUTS.RETRY_DELAY_MS);
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
