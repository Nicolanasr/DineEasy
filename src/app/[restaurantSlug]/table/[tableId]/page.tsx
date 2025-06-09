// src/app/[restaurantSlug]/table/[tableId]/page.tsx
'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, MapPin, Clock, AlertCircle, Timer, UserPlus, LogOut, Menu, ShoppingCart } from 'lucide-react'
import { useTableSession } from '@/hooks/use-table-session'
import { useActivityTracker } from '@/hooks/use-activity-tracker'
import MenuDisplay from '@/components/menu/MenuDisplay'
import type { MenuItem } from '@/lib/supabase'

export default function TableSessionPage() {
    const params = useParams()
    const restaurantSlug = params.restaurantSlug as string
    const tableId = params.tableId as string

    // Use enhanced session management hook
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

    // Activity tracking for current participant
    useActivityTracker(currentParticipant?.id || null, {
        updateInterval: 2 * 60 * 1000, // 2 minutes
        trackVisibility: true,
        trackInteractions: true,
        trackScroll: true,
        debounceMs: 5000
    })

    // Form state
    const [displayName, setDisplayName] = useState('')
    const [isJoining, setIsJoining] = useState(false)
    const [isLeaving, setIsLeaving] = useState(false)
    const [isExtending, setIsExtending] = useState(false)
    const [showNameForm, setShowNameForm] = useState(false)
    const [activeTab, setActiveTab] = useState('menu')

    // Temporary cart state (we'll enhance this later)
    const [cartItems, setCartItems] = useState<{ item: MenuItem; quantity: number }[]>([])

    // Handle joining session
    const handleJoinSession = async () => {
        if (!displayName.trim()) return

        try {
            setIsJoining(true)
            await joinSession(displayName.trim())
            setShowNameForm(false)
            setDisplayName('')
        } catch (error) {
            console.error('Failed to join session:', error)
        } finally {
            setIsJoining(false)
        }
    }

    // Handle leaving session
    const handleLeaveSession = async () => {
        if (!currentParticipant) return

        try {
            setIsLeaving(true)
            console.log('Starting leave process for:', currentParticipant.display_name)
            await leaveSession()
            console.log('Leave process completed')
            setShowNameForm(true)
            setActiveTab('join') // Go back to join tab
        } catch (error) {
            console.error('Failed to leave session:', error)
        } finally {
            setIsLeaving(false)
        }
    }

    // Handle extending session
    const handleExtendSession = async () => {
        try {
            setIsExtending(true)
            await extendSession()
        } catch (error) {
            console.error('Failed to extend session:', error)
        } finally {
            setIsExtending(false)
        }
    }

    // Handle adding item to cart (temporary implementation)
    const handleAddItem = (item: MenuItem, quantity: number) => {
        console.log('Adding item to cart:', item.name, 'x', quantity)

        setCartItems(prev => {
            const existingItem = prev.find(cartItem => cartItem.item.id === item.id)
            if (existingItem) {
                return prev.map(cartItem =>
                    cartItem.item.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + quantity }
                        : cartItem
                )
            }
            return [...prev, { item, quantity }]
        })

        // Show success feedback (you can enhance this with a toast)
        console.log('Item added to cart successfully')
    }

    // Calculate cart total
    const cartTotal = cartItems.reduce((total, { item, quantity }) => total + (item.price * quantity), 0)

    // Show join form if no current participant
    const shouldShowNameForm = showNameForm || (!currentParticipant && !isLoading && !error)

    // Loading state
    if (isLoading) {
        return (
            <div className="table-session-container p-4">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="table-session-container p-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button
                    onClick={refreshSession}
                    className="w-full mt-4"
                    variant="outline"
                >
                    Try Again
                </Button>
            </div>
        )
    }

    return (
        <div className="table-session-container p-4">
            {/* Restaurant Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-xl font-semibold text-foreground">
                            {restaurant?.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Table {tableId}
                        </p>
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
                            {isLeaving ? 'Leaving...' : 'Leave'}
                        </Button>
                    )}
                </div>

                {/* Session Status */}
                {session && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {timeRemaining}
                        </div>
                        {session.expires_at && new Date(session.expires_at).getTime() - new Date().getTime() < 30 * 60 * 1000 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleExtendSession}
                                disabled={isExtending}
                                className="h-6 px-2 text-xs"
                            >
                                <Timer className="w-3 h-3 mr-1" />
                                {isExtending ? 'Extending...' : 'Extend'}
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Main Content */}
            {shouldShowNameForm ? (
                /* Join Session Form */
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="w-5 h-5" />
                            Join Your Table
                        </CardTitle>
                        <CardDescription>
                            Enter your name to start ordering with your group
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="displayName">Your Name</Label>
                            <Input
                                id="displayName"
                                placeholder="Enter your name..."
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleJoinSession()}
                                disabled={isJoining}
                                className="mt-1"
                            />
                        </div>
                        <Button
                            onClick={handleJoinSession}
                            disabled={!displayName.trim() || isJoining}
                            className="w-full"
                        >
                            {isJoining ? 'Joining...' : 'Join Table'}
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                /* Main App Interface */
                <div className="space-y-6">
                    {/* Current Participants */}
                    {participants.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5" />
                                        People at Your Table
                                    </div>
                                    <Badge variant="secondary" className="ml-2">
                                        {participants.length}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {participants.map((participant) => (
                                        <Badge
                                            key={participant.id}
                                            variant="secondary"
                                            className="participant-badge animate-slide-up"
                                            style={{
                                                backgroundColor: `${participant.color_code}20`,
                                                borderColor: participant.color_code,
                                                color: participant.color_code
                                            }}
                                        >
                                            {participant.display_name}
                                            {participant.id === currentParticipant?.id && ' (You)'}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Main Navigation Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="menu" className="gap-2">
                                <Menu className="w-4 h-4" />
                                Menu
                            </TabsTrigger>
                            <TabsTrigger value="cart" className="gap-2">
                                <ShoppingCart className="w-4 h-4" />
                                Cart
                                {cartItems.length > 0 && (
                                    <Badge variant="secondary" className="ml-1">
                                        {cartItems.length}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="service" className="gap-2">
                                Service
                            </TabsTrigger>
                        </TabsList>

                        {/* Menu Tab */}
                        <TabsContent value="menu" className="mt-6">
                            {restaurant && (
                                <MenuDisplay
                                    restaurantId={restaurant.id}
                                    onAddItem={handleAddItem}
                                />
                            )}
                        </TabsContent>

                        {/* Cart Tab */}
                        <TabsContent value="cart" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Order</CardTitle>
                                    <CardDescription>
                                        Review your items before adding to the shared cart
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {cartItems.length === 0 ? (
                                        <div className="text-center py-8">
                                            <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                            <p className="text-muted-foreground">Your cart is empty</p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Browse the menu to add items
                                            </p>
                                            <Button
                                                variant="outline"
                                                className="mt-4"
                                                onClick={() => setActiveTab('menu')}
                                            >
                                                View Menu
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {/* Cart Items */}
                                            {cartItems.map((cartItem, index) => (
                                                <div key={`${cartItem.item.id}-${index}`} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium">{cartItem.item.name}</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            ${cartItem.item.price.toFixed(2)} each
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm">Qty: {cartItem.quantity}</span>
                                                        <span className="font-medium">
                                                            ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setCartItems(prev => prev.filter((_, i) => i !== index))
                                                            }}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Cart Total */}
                                            <div className="border-t pt-4">
                                                <div className="flex justify-between items-center text-lg font-semibold">
                                                    <span>Total:</span>
                                                    <span>${cartTotal.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            {/* Cart Actions */}
                                            <div className="flex gap-2 pt-4">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setCartItems([])}
                                                    className="flex-1"
                                                >
                                                    Clear Cart
                                                </Button>
                                                <Button
                                                    className="flex-1"
                                                    disabled={cartItems.length === 0}
                                                >
                                                    Add to Shared Cart
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Service Tab */}
                        <TabsContent value="service" className="mt-6">
                            <div className="grid gap-4">
                                {/* Quick Service Requests */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Call for Service</CardTitle>
                                        <CardDescription>
                                            Get assistance from your server
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-3">
                                        <Button variant="outline" className="justify-start gap-2">
                                            🙋‍♂️ Call Waiter
                                        </Button>
                                        <Button variant="outline" className="justify-start gap-2">
                                            💧 Request Water Refill
                                        </Button>
                                        <Button variant="outline" className="justify-start gap-2">
                                            🧾 Request Check
                                        </Button>
                                        <Button variant="outline" className="justify-start gap-2">
                                            ❓ Ask a Question
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Order Status */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Order Status</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center py-4">
                                            <p className="text-muted-foreground">
                                                No orders submitted yet
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            )}

        </div>
    )
}