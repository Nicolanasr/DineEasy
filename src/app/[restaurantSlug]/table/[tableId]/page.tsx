// src/app/[restaurantSlug]/table/[tableId]/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, MapPin, Clock, AlertCircle, Timer, UserPlus, LogOut, Menu, ShoppingCart, StickyNote, Trash2 } from 'lucide-react'
import { useTableSession } from '@/hooks/use-table-session'
import { useActivityTracker } from '@/hooks/use-activity-tracker'
import MenuDisplay from '@/components/menu/MenuDisplay'
import { OrderInsert, OrderItemInsert, supabase, type MenuItem, type OrderItem, type SessionParticipant } from '@/lib/supabase'

// Shared cart item with participant and menu info
type SharedCartItem = OrderItem & {
    menu_items: MenuItem;
    session_participants: SessionParticipant | null;
}

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

    // Form state
    const [displayName, setDisplayName] = useState('')
    const [isJoining, setIsJoining] = useState(false)
    const [isLeaving, setIsLeaving] = useState(false)
    const [isExtending, setIsExtending] = useState(false)
    const [showNameForm, setShowNameForm] = useState(false)
    const [activeTab, setActiveTab] = useState('menu')

    // Shared cart state
    const [sharedCartItems, setSharedCartItems] = useState<SharedCartItem[]>([])
    const [isLoadingCart, setIsLoadingCart] = useState(false)
    const [sharedOrderId, setSharedOrderId] = useState<string | null>(null)
    const [subscriptionStatus, setSubscriptionStatus] = useState<string>('disconnected')

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
            await leaveSession()
            setShowNameForm(true)
            setActiveTab('menu')
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

    // Get or create shared order
    const getOrCreateSharedOrder = async (): Promise<string | null> => {
        if (!session?.id || !currentParticipant?.id) return null

        try {
            const { data: existingOrder, error: orderQueryError } = await supabase
                .from('orders')
                .select('id')
                .eq('session_id', session.id)
                .eq('status', 'cart')
                .maybeSingle()

            if (orderQueryError) {
                console.error('Error querying existing order:', orderQueryError)
                return null
            }

            if (existingOrder) {
                return existingOrder.id
            }

            const newOrderData: OrderInsert = {
                session_id: session.id,
                participant_id: currentParticipant.id,
                status: 'cart',
                subtotal: 0,
                notes: 'Shared table cart'
            }

            const { data: newOrder, error: createOrderError } = await supabase
                .from('orders')
                .insert(newOrderData)
                .select('id')
                .single()

            if (createOrderError) {
                console.error('Error creating order:', createOrderError)
                return null
            }

            return newOrder.id
        } catch (error) {
            console.error('Failed to get or create shared order:', error)
            return null
        }
    }

    // Add item to shared cart
    const handleAddItem = async (
        item: MenuItem,
        quantity: number,
        customizations?: string[],
        notes?: string
    ) => {
        if (!currentParticipant || !session) {
            console.error('No participant or session found')
            return
        }

        try {
            console.log('Adding item to shared cart:', item.name)

            const orderId = await getOrCreateSharedOrder()
            if (!orderId) {
                console.error('Could not get or create shared order')
                return
            }

            const orderItemData: OrderItemInsert = {
                order_id: orderId,
                menu_item_id: item.id,
                quantity,
                unit_price: Number(item.price),
                total_price: Number(item.price) * quantity,
                customizations: customizations?.length ? customizations : null,
                notes: notes?.trim() || null,
                added_by_participant_id: currentParticipant.id
            }

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItemData)

            if (itemsError) {
                console.error('Error inserting order item:', itemsError)
                return
            }

            console.log('Item added successfully, triggering reload')
            await loadSharedCart()

        } catch (error) {
            console.error('Failed to add item to shared cart:', error)
        }
    }

    // Load shared cart
    const loadSharedCart = useCallback(async () => {
        if (!session?.id) {
            console.log('No session ID, skipping cart load')
            return
        }

        try {
            console.log('Loading shared cart for session:', session.id)
            setIsLoadingCart(true)

            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .select(`
                    id,
                    subtotal,
                    order_items(
                        id,
                        quantity,
                        unit_price,
                        total_price,
                        customizations,
                        notes,
                        added_by_participant_id,
                        created_at,
                        menu_items(
                            id,
                            name,
                            description,
                            image_url,
                            price
                        ),
                        session_participants(
                            id,
                            display_name,
                            color_code
                        )
                    )
                `)
                .eq('session_id', session.id)
                .eq('status', 'cart')
                .maybeSingle()

            if (orderError) {
                console.error('Error loading shared cart:', orderError)
                return
            }

            if (orderData) {
                const items = (orderData.order_items || []) as unknown as SharedCartItem[]
                console.log('Loaded cart items:', items.length)
                setSharedCartItems(items)
                setSharedOrderId(orderData.id)
            } else {
                console.log('No order found, setting empty cart')
                setSharedCartItems([])
                setSharedOrderId(null)
            }
        } catch (error) {
            console.error('Failed to load shared cart:', error)
        } finally {
            setIsLoadingCart(false)
        }
    }, [session?.id])

    // Remove item from cart
    const handleRemoveItem = async (itemId: string) => {
        try {
            console.log('Removing item:', itemId)
            const { error } = await supabase
                .from('order_items')
                .delete()
                .eq('id', itemId)

            if (error) {
                console.error('Error removing item:', error)
                return
            }

            console.log('Item removed, reloading cart')
            await loadSharedCart()
        } catch (error) {
            console.error('Failed to remove item:', error)
        }
    }

    // Update item quantity
    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            await handleRemoveItem(itemId)
            return
        }

        try {
            console.log('Updating quantity for item:', itemId, 'to:', newQuantity)

            const item = sharedCartItems.find(item => item.id === itemId)
            if (!item) return

            const newTotal = item.unit_price * newQuantity

            const { error } = await supabase
                .from('order_items')
                .update({
                    quantity: newQuantity,
                    total_price: newTotal
                })
                .eq('id', itemId)

            if (error) {
                console.error('Error updating quantity:', error)
                return
            }

            console.log('Quantity updated, reloading cart')
            await loadSharedCart()
        } catch (error) {
            console.error('Failed to update quantity:', error)
        }
    }

    // Clear entire cart
    const handleClearCart = async () => {
        if (!sharedOrderId) return

        try {
            console.log('Clearing cart')
            const { error } = await supabase
                .from('order_items')
                .delete()
                .eq('order_id', sharedOrderId)

            if (error) {
                console.error('Error clearing cart:', error)
                return
            }

            console.log('Cart cleared, reloading')
            await loadSharedCart()
        } catch (error) {
            console.error('Failed to clear cart:', error)
        }
    }

    // Submit order
    const handleSubmitOrder = async () => {
        if (!sharedOrderId) return

        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: 'submitted' })
                .eq('id', sharedOrderId)

            if (error) {
                console.error('Error submitting order:', error)
                return
            }

            console.log('Order submitted successfully')
            await loadSharedCart()
        } catch (error) {
            console.error('Failed to submit order:', error)
        }
    }

    // Load cart when session is available
    useEffect(() => {
        if (session?.id) {
            console.log('Session available, loading cart')
            loadSharedCart()
        }
    }, [session?.id, loadSharedCart])

    // Set up real-time subscriptions (NO POLLING)
    useEffect(() => {
        if (!session?.id) return

        console.log('Setting up real-time subscriptions for session:', session.id)

        const orderItemsChannel = supabase
            .channel(`order_items_${session.id}`)
            .on('postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'order_items'
                },
                (payload) => {
                    console.log('Order items changed:', payload.eventType, payload)
                    // Only reload if we don't have the data locally already
                    loadSharedCart()
                }
            )
            .subscribe((status) => {
                console.log('Order items subscription status:', status)
                setSubscriptionStatus(status)
            })

        return () => {
            console.log('Cleaning up subscriptions')
            supabase.removeChannel(orderItemsChannel)
            setSubscriptionStatus('disconnected')
        }
    }, [session?.id, loadSharedCart])

    // Calculate cart total
    const cartTotal = sharedCartItems.reduce((total, item) => total + Number(item.total_price), 0)

    const shouldShowNameForm = showNameForm || (!currentParticipant && !isLoading && !error)

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

    if (error) {
        return (
            <div className="table-session-container p-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button onClick={refreshSession} className="w-full mt-4" variant="outline">
                    Try Again
                </Button>
            </div>
        )
    }

    return (
        <div className="table-session-container p-4">
            {/* Debug info in development */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-2 bg-gray-100 text-xs rounded">
                    Subscription: {subscriptionStatus} | Cart Items: {sharedCartItems.length} | Order ID: {sharedOrderId}
                </div>
            )}

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

            {shouldShowNameForm ? (
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
                <div className="space-y-6">
                    {/* Participants */}
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
                                            className="participant-badge"
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
                                Shared Cart
                                {sharedCartItems.length > 0 && (
                                    <Badge variant="secondary" className="ml-1">
                                        {sharedCartItems.length}
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

                        {/* Shared Cart Tab */}
                        <TabsContent value="cart" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>Shared Table Cart</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={loadSharedCart}
                                        >
                                            Refresh
                                        </Button>
                                    </CardTitle>
                                    <CardDescription>
                                        Everyones items • Real-time updates • Total: ${cartTotal.toFixed(2)}
                                        {subscriptionStatus !== 'SUBSCRIBED' && (
                                            <span className="text-orange-600 ml-2">
                                                (Subscription: {subscriptionStatus})
                                            </span>
                                        )}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {isLoadingCart ? (
                                        <div className="space-y-4">
                                            {Array.from({ length: 3 }).map((_, i) => (
                                                <Skeleton key={i} className="h-20 w-full" />
                                            ))}
                                        </div>
                                    ) : sharedCartItems.length === 0 ? (
                                        <div className="text-center py-8">
                                            <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                            <p className="text-muted-foreground">Shared cart is empty</p>
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
                                            {sharedCartItems.map((cartItem) => (
                                                <div key={cartItem.id} className="border rounded-lg p-4 space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-medium">{cartItem.menu_items.name}</h4>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs"
                                                                    style={{
                                                                        backgroundColor: `${cartItem.session_participants?.color_code}20`,
                                                                        borderColor: cartItem.session_participants?.color_code,
                                                                        color: cartItem.session_participants?.color_code
                                                                    }}
                                                                >
                                                                    {cartItem.session_participants?.display_name || 'Unknown'}
                                                                    {cartItem.session_participants?.id === currentParticipant?.id && ' (You)'}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">
                                                                ${cartItem.unit_price.toFixed(2)} each
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-right">
                                                            <div className="flex items-center gap-1">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleUpdateQuantity(cartItem.id, cartItem.quantity - 1)}
                                                                    className="h-6 w-6 p-0"
                                                                >
                                                                    -
                                                                </Button>
                                                                <span className="text-sm w-8 text-center">{cartItem.quantity}</span>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleUpdateQuantity(cartItem.id, cartItem.quantity + 1)}
                                                                    className="h-6 w-6 p-0"
                                                                >
                                                                    +
                                                                </Button>
                                                            </div>
                                                            <span className="font-medium">
                                                                ${cartItem.total_price.toFixed(2)}
                                                            </span>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleRemoveItem(cartItem.id)}
                                                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {(cartItem.customizations?.length || cartItem.notes) && (
                                                        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                                                            {cartItem.customizations && cartItem.customizations.length > 0 && (
                                                                <div>
                                                                    <p className="text-xs font-medium text-muted-foreground mb-1">
                                                                        Customizations:
                                                                    </p>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {cartItem.customizations.map((customization, idx) => (
                                                                            <Badge key={idx} variant="outline" className="text-xs">
                                                                                {customization}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {cartItem.notes && (
                                                                <div>
                                                                    <p className="text-xs font-medium text-muted-foreground mb-1">
                                                                        Special Instructions:
                                                                    </p>
                                                                    <div className="flex items-start gap-1 text-xs text-muted-foreground">
                                                                        <StickyNote className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                                        <span>{cartItem.notes}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            <div className="border-t pt-4 space-y-4">
                                                <div className="flex justify-between items-center text-lg font-semibold">
                                                    <span>Total:</span>
                                                    <span>${cartTotal.toFixed(2)}</span>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={handleClearCart}
                                                        className="flex-1"
                                                    >
                                                        Clear Cart
                                                    </Button>
                                                    <Button
                                                        className="flex-1"
                                                        disabled={sharedCartItems.length === 0}
                                                        onClick={handleSubmitOrder}
                                                    >
                                                        Submit Order (${cartTotal.toFixed(2)})
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Service Tab */}
                        <TabsContent value="service" className="mt-6">
                            <div className="grid gap-4">
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