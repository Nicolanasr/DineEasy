// src/hooks/use-activity-tracker.ts
"use client";

import { useEffect, useRef, useCallback } from "react";
import { updateParticipantActivity } from "@/lib/session-management";

interface ActivityTrackerOptions {
	updateInterval?: number; // milliseconds, default 2 minutes
	trackVisibility?: boolean; // track page visibility changes
	trackInteractions?: boolean; // track user interactions
	trackScroll?: boolean; // track scroll events
	debounceMs?: number; // debounce rapid interactions
}

const defaultOptions: Required<ActivityTrackerOptions> = {
	updateInterval: 2 * 60 * 1000, // 2 minutes
	trackVisibility: true,
	trackInteractions: true,
	trackScroll: true,
	debounceMs: 5000, // 5 seconds
};

export const useActivityTracker = (participantId: string | null, options: ActivityTrackerOptions = {}) => {
	const config = { ...defaultOptions, ...options };
	const lastUpdateRef = useRef<number>(0);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Debounced activity update function
	const debouncedUpdate = useCallback(async () => {
		if (!participantId) return;

		const now = Date.now();

		// Debounce rapid calls
		if (now - lastUpdateRef.current < config.debounceMs) {
			return;
		}

		lastUpdateRef.current = now;

		try {
			await updateParticipantActivity(participantId);
		} catch (error) {
			console.error("Failed to update participant activity:", error);
		}
	}, [participantId, config.debounceMs]);

	// Schedule activity update with debouncing
	const scheduleUpdate = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			debouncedUpdate();
		}, 100); // Small delay to batch rapid events
	}, [debouncedUpdate]);

	// Set up periodic activity updates
	useEffect(() => {
		if (!participantId) return;

		const interval = setInterval(() => {
			// Only update if page is visible
			if (!config.trackVisibility || document.visibilityState === "visible") {
				debouncedUpdate();
			}
		}, config.updateInterval);

		return () => {
			clearInterval(interval);
		};
	}, [participantId, config.updateInterval, config.trackVisibility, debouncedUpdate]);

	// Track page visibility changes
	useEffect(() => {
		if (!participantId || !config.trackVisibility) return;

		const handleVisibilityChange = () => {
			if (document.visibilityState === "visible") {
				scheduleUpdate();
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [participantId, config.trackVisibility, scheduleUpdate]);

	// Track user interactions
	useEffect(() => {
		if (!participantId || !config.trackInteractions) return;

		const handleInteraction = () => {
			scheduleUpdate();
		};

		// Mouse and touch events
		document.addEventListener("click", handleInteraction, { passive: true });
		document.addEventListener("touchstart", handleInteraction, { passive: true });
		document.addEventListener("keypress", handleInteraction, { passive: true });
		document.addEventListener("input", handleInteraction, { passive: true });

		return () => {
			document.removeEventListener("click", handleInteraction);
			document.removeEventListener("touchstart", handleInteraction);
			document.removeEventListener("keypress", handleInteraction);
			document.removeEventListener("input", handleInteraction);
		};
	}, [participantId, config.trackInteractions, scheduleUpdate]);

	// Track scroll events
	useEffect(() => {
		if (!participantId || !config.trackScroll) return;

		const handleScroll = () => {
			scheduleUpdate();
		};

		document.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			document.removeEventListener("scroll", handleScroll);
		};
	}, [participantId, config.trackScroll, scheduleUpdate]);

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	// Manual activity update function
	const updateActivity = useCallback(async () => {
		if (participantId) {
			await debouncedUpdate();
		}
	}, [participantId, debouncedUpdate]);

	return {
		updateActivity,
	};
};

// Hook for tracking specific events (orders, service requests, etc.)
export const useEventTracker = (participantId: string | null) => {
	const trackEvent = useCallback(
		async (eventType: string, metadata?: Record<string, unknown>) => {
			if (!participantId) return;

			try {
				// Update participant activity
				await updateParticipantActivity(participantId);

				// Optional: Log specific event for analytics
				console.log(`Event tracked: ${eventType}`, { participantId, metadata });
			} catch (error) {
				console.error("Failed to track event:", error);
			}
		},
		[participantId]
	);

	return { trackEvent };
};

// Hook for session heartbeat (lighter weight, just sends "I'm alive" signals)
export const useSessionHeartbeat = (
	sessionId: string | null,
	participantId: string | null,
	intervalMs: number = 30000 // 30 seconds
) => {
	useEffect(() => {
		if (!sessionId || !participantId) return;

		const interval = setInterval(async () => {
			if (document.visibilityState === "visible") {
				try {
					// Simple heartbeat - just update timestamp
					await updateParticipantActivity(participantId);
				} catch (error) {
					console.error("Heartbeat failed:", error);
				}
			}
		}, intervalMs);

		return () => {
			clearInterval(interval);
		};
	}, [sessionId, participantId, intervalMs]);
};

// Enhanced activity tracker with session management
export const useSessionActivityTracker = (
	sessionId: string | null,
	participantId: string | null,
	options: ActivityTrackerOptions & {
		enableHeartbeat?: boolean;
		heartbeatInterval?: number;
		autoExtendSession?: boolean;
		extendThreshold?: number; // minutes before expiry to auto-extend
	} = {}
) => {
	const activityTracker = useActivityTracker(participantId, options);

	// Optional heartbeat
	useSessionHeartbeat(sessionId, participantId, options.enableHeartbeat ? options.heartbeatInterval : undefined);

	// Auto-extend session feature (would need session expiry data)
	useEffect(() => {
		if (!options.autoExtendSession || !sessionId) return;

		// This would require additional logic to check session expiry
		// and automatically extend if user is active
		// Implementation depends on your session management needs
	}, [sessionId, options.autoExtendSession]);

	return activityTracker;
};
