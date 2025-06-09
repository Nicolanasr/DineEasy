/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/[restaurantSlug]/table/[tableId]/components/RestaurantHeader.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Timer, LogOut } from "lucide-react";

interface RestaurantHeaderProps {
    restaurant: any;
    tableId: string;
    session: any;
    timeRemaining: string;
    currentParticipant: any;
    onLeaveSession: () => Promise<void>;
    onExtendSession: () => Promise<void>;
}

export function RestaurantHeader({
    restaurant,
    tableId,
    session,
    timeRemaining,
    currentParticipant,
    onLeaveSession,
    onExtendSession,
}: RestaurantHeaderProps) {
    const [isLeaving, setIsLeaving] = useState(false);
    const [isExtending, setIsExtending] = useState(false);

    const handleLeaveSession = async () => {
        try {
            setIsLeaving(true);
            await onLeaveSession();
        } catch (error) {
            console.error("Failed to leave session:", error);
        } finally {
            setIsLeaving(false);
        }
    };

    const handleExtendSession = async () => {
        try {
            setIsExtending(true);
            await onExtendSession();
        } catch (error) {
            console.error("Failed to extend session:", error);
        } finally {
            setIsExtending(false);
        }
    };

    const shouldShowExtendButton = session?.expires_at && new Date(session.expires_at).getTime() - new Date().getTime() < 30 * 60 * 1000;

    return (
        <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                    <h1 className="text-xl font-semibold text-foreground">{restaurant?.name}</h1>
                    <p className="text-sm text-muted-foreground">Table {tableId}</p>
                </div>
                {currentParticipant && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLeaveSession}
                        disabled={isLeaving}
                        className="text-destructive hover:text-destructive"
                    >
                        <LogOut className="w-4 h-4 mr-1" />
                        {isLeaving ? "Leaving..." : "Leave"}
                    </Button>
                )}
            </div>

            {session && (
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {timeRemaining}
                    </div>
                    {shouldShowExtendButton && (
                        <Button variant="outline" size="sm" onClick={handleExtendSession} disabled={isExtending} className="h-6 px-2 text-xs">
                            <Timer className="w-3 h-3 mr-1" />
                            {isExtending ? "Extending..." : "Extend"}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
