// src/components/session/SessionTimer.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, AlertTriangle, Timer, RefreshCw } from 'lucide-react'
import { formatTimeRemaining } from '@/lib/session-management'

interface SessionTimerProps {
    expiresAt: string
    onExtend?: () => Promise<void>
    onRefresh?: () => Promise<void>
    showExtendButton?: boolean
    extendThresholdMinutes?: number
    className?: string
}

export const SessionTimer = ({
    expiresAt,
    onExtend,
    onRefresh,
    showExtendButton = true,
    extendThresholdMinutes = 30,
    className = ''
}: SessionTimerProps) => {
    const [timeRemaining, setTimeRemaining] = useState('')
    const [isExpired, setIsExpired] = useState(false)
    const [isNearExpiry, setIsNearExpiry] = useState(false)
    const [isExtending, setIsExtending] = useState(false)

    // Update timer every minute
    useEffect(() => {
        const updateTimer = () => {
            const now = new Date()
            const expires = new Date(expiresAt)
            const diffMs = expires.getTime() - now.getTime()

            if (diffMs <= 0) {
                setTimeRemaining('Expired')
                setIsExpired(true)
                setIsNearExpiry(false)
            } else {
                setTimeRemaining(formatTimeRemaining(expiresAt))
                setIsExpired(false)

                // Check if near expiry (within threshold)
                const thresholdMs = extendThresholdMinutes * 60 * 1000
                setIsNearExpiry(diffMs <= thresholdMs)
            }
        }

        // Update immediately
        updateTimer()

        // Update every minute
        const interval = setInterval(updateTimer, 60000)

        return () => clearInterval(interval)
    }, [expiresAt, extendThresholdMinutes])

    // Handle extend session
    const handleExtend = async () => {
        if (!onExtend) return

        try {
            setIsExtending(true)
            await onExtend()
        } catch (error) {
            console.error('Failed to extend session:', error)
        } finally {
            setIsExtending(false)
        }
    }

    // Handle refresh
    const handleRefresh = async () => {
        if (!onRefresh) return

        try {
            await onRefresh()
        } catch (error) {
            console.error('Failed to refresh session:', error)
        }
    }

    // Determine timer appearance
    const getTimerVariant = () => {
        if (isExpired) return 'destructive'
        if (isNearExpiry) return 'secondary'
        return 'default'
    }

    const getTimerIcon = () => {
        if (isExpired) return <AlertTriangle className="w-4 h-4" />
        if (isNearExpiry) return <Timer className="w-4 h-4" />
        return <Clock className="w-4 h-4" />
    }

    const getTimerColor = () => {
        if (isExpired) return 'text-destructive'
        if (isNearExpiry) return 'text-orange-600'
        return 'text-muted-foreground'
    }

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Timer Display */}
            <div className={`flex items-center gap-1 text-sm ${getTimerColor()}`}>
                {getTimerIcon()}
                <span className="font-medium">{timeRemaining}</span>
            </div>

            {/* Status Badge */}
            {(isExpired || isNearExpiry) && (
                <Badge variant={getTimerVariant()} className="text-xs">
                    {isExpired ? 'Expired' : 'Expiring Soon'}
                </Badge>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
                {/* Extend Button */}
                {showExtendButton && onExtend && (isNearExpiry || isExpired) && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExtend}
                        disabled={isExtending}
                        className="h-6 px-2 text-xs"
                    >
                        <Timer className="w-3 h-3 mr-1" />
                        {isExtending ? 'Extending...' : 'Extend'}
                    </Button>
                )}

                {/* Refresh Button */}
                {onRefresh && isExpired && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        className="h-6 px-2 text-xs"
                    >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Refresh
                    </Button>
                )}
            </div>
        </div>
    )
}

// Compact version for headers/status bars
export const CompactSessionTimer = ({
    expiresAt,
    onExtend,
    className = ''
}: Pick<SessionTimerProps, 'expiresAt' | 'onExtend' | 'className'>) => {
    return (
        <SessionTimer
            expiresAt={expiresAt}
            onExtend={onExtend}
            showExtendButton={false}
            className={`text-xs ${className}`}
        />
    )
}

// Full-featured timer card
export const SessionTimerCard = ({
    expiresAt,
    onExtend,
    onRefresh,
    sessionStatus = 'active'
}: SessionTimerProps & { sessionStatus?: string }) => {
    return (
        <Card className="p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-sm">Session Status</h3>
                    <p className="text-xs text-muted-foreground capitalize">{sessionStatus}</p>
                </div>
                <SessionTimer
                    expiresAt={expiresAt}
                    onExtend={onExtend}
                    onRefresh={onRefresh}
                    showExtendButton={true}
                    extendThresholdMinutes={30}
                />
            </div>
        </Card>
    )
}

// Hook for timer logic (reusable)
export const useSessionTimer = (expiresAt: string, updateInterval: number = 60000) => {
    const [timeData, setTimeData] = useState({
        timeRemaining: '',
        isExpired: false,
        isNearExpiry: false,
        minutesRemaining: 0
    })

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date()
            const expires = new Date(expiresAt)
            const diffMs = expires.getTime() - now.getTime()
            const minutesRemaining = Math.floor(diffMs / (1000 * 60))

            if (diffMs <= 0) {
                setTimeData({
                    timeRemaining: 'Expired',
                    isExpired: true,
                    isNearExpiry: false,
                    minutesRemaining: 0
                })
            } else {
                setTimeData({
                    timeRemaining: formatTimeRemaining(expiresAt),
                    isExpired: false,
                    isNearExpiry: minutesRemaining <= 30,
                    minutesRemaining
                })
            }
        }

        updateTimer()
        const interval = setInterval(updateTimer, updateInterval)

        return () => clearInterval(interval)
    }, [expiresAt, updateInterval])

    return timeData
}