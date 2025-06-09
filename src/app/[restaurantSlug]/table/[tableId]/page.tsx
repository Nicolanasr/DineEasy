// src/app/[restaurantSlug]/table/[tableId]/page.tsx
'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { useTableSession } from '@/hooks/use-table-session'
import { useActivityTracker } from '@/hooks/use-activity-tracker'
import { RestaurantHeader } from './components/RestaurantHeader'
import { JoinSessionForm } from './components/JoinSessionForm'
import { ParticipantsCard } from './components/ParticipantsCard'
import { MainTabs } from './components/MainTabs'
import { useSharedCart } from './hooks/useSharedCart'

export default function TableSessionPage() {
    const params = useParams()
    const restaurantSlug = params.restaurantSlug as string
    const tableId = params.tableId as string

    const {
        session,
        restaurant,
        participants,
        currentParticipant,
        isLoading,
        error,
        timeRemaining,
        joinSession,
        leaveSession,
        refreshSession,
        extendSession
    } = useTableSession(restaurantSlug, tableId)

    useActivityTracker(currentParticipant?.id || null, {
        updateInterval: 2 * 60 * 1000,
        trackVisibility: true,
        trackInteractions: true,
        trackScroll: true,
        debounceMs: 5000
    })

    const {
        sharedCartItems,
        isLoadingCart,
        subscriptionStatus,
        cartTotal,
        handleAddItem,
        handleRemoveItem,
        handleUpdateQuantity,
        handleClearCart,
        handleSubmitOrder,
        loadSharedCart
    } = useSharedCart(session, currentParticipant)

    const [activeTab, setActiveTab] = useState('menu')

    const shouldShowNameForm = (!currentParticipant && !isLoading && !error)

    if (isLoading) {
        return <LoadingSkeleton />
    }

    if (error) {
        return <ErrorDisplay error={error} onRetry={refreshSession} />
    }

    return (
        <div className="table-session-container p-4">
            {/* Debug info in development */}
            {process.env.NODE_ENV === 'development' && (
                <DebugInfo
                    subscriptionStatus={subscriptionStatus}
                    cartItemsCount={sharedCartItems.length}
                    sharedOrderId={null} // You'll need to expose this from useSharedCart
                    sessionId={session?.id}
                    participantId={currentParticipant?.id}
                />
            )}

            <RestaurantHeader
                restaurant={restaurant}
                tableId={tableId}
                session={session}
                timeRemaining={timeRemaining}
                currentParticipant={currentParticipant}
                onLeaveSession={leaveSession}
                onExtendSession={extendSession}
            />

            {shouldShowNameForm ? (
                <JoinSessionForm
                    onJoinSession={async (displayName: string) => {
                        await joinSession(displayName)
                    }}
                />
            ) : (
                <div className="space-y-6">
                    <ParticipantsCard
                        participants={participants}
                        currentParticipant={currentParticipant}
                    />

                    <MainTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        restaurant={restaurant}
                        sharedCartItems={sharedCartItems}
                        isLoadingCart={isLoadingCart}
                        subscriptionStatus={subscriptionStatus}
                        cartTotal={cartTotal}
                        currentParticipant={currentParticipant}
                        onAddItem={handleAddItem}
                        onRemoveItem={handleRemoveItem}
                        onUpdateQuantity={handleUpdateQuantity}
                        onClearCart={handleClearCart}
                        onSubmitOrder={handleSubmitOrder}
                        onLoadSharedCart={loadSharedCart}
                        onSetActiveTab={setActiveTab}
                    />
                </div>
            )}
        </div>
    )
}

// Loading skeleton component
function LoadingSkeleton() {
    return (
        <div className="table-session-container p-4">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="flex-1">
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        </div>
    )
}

// Error display component
function ErrorDisplay({ error, onRetry }: { error: string; onRetry: () => void }) {
    return (
        <div className="table-session-container p-4">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={onRetry} className="w-full mt-4" variant="outline">
                Try Again
            </Button>
        </div>
    )
}

// Debug info component
function DebugInfo({
    subscriptionStatus,
    cartItemsCount,
    sharedOrderId,
    sessionId,
    participantId
}: {
    subscriptionStatus: string
    cartItemsCount: number
    sharedOrderId: string | null
    sessionId?: string
    participantId?: string
}) {
    return (
        <div className="mb-4 p-2 bg-gray-100 text-xs rounded">
            Subscription: {subscriptionStatus} | Cart Items: {cartItemsCount} | Order ID: {sharedOrderId}
            <br />
            Session ID: {sessionId} | Participant ID: {participantId}
        </div>
    )
}