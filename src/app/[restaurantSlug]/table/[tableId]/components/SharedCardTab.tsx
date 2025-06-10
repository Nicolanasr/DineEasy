// src/app/[restaurantSlug]/table/[tableId]/components/SharedCartTab.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ShoppingCart, StickyNote, Trash2 } from 'lucide-react'
import type { SessionParticipant, MenuItem } from '@/lib/supabase'
import type { OrderItem } from '@/lib/types'

// Shared cart item with participant and menu info
type SharedCartItem = OrderItem & {
	menu_items: MenuItem;
	session_participants: SessionParticipant | null;
};

interface SharedCartTabProps {
    sharedCartItems: SharedCartItem[]
    isLoadingCart: boolean
    subscriptionStatus: string
    cartTotal: number
    currentParticipant: SessionParticipant | null
    onRemoveItem: (itemId: string) => Promise<void>
    onUpdateQuantity: (itemId: string, newQuantity: number) => Promise<void>
    onClearCart: () => Promise<void>
    onSubmitOrder: () => Promise<void>
    onLoadSharedCart: () => Promise<void>
    onSetActiveTab: (tab: string) => void
}

export function SharedCartTab({
    sharedCartItems,
    isLoadingCart,
    subscriptionStatus,
    cartTotal,
    currentParticipant,
    onRemoveItem,
    onUpdateQuantity,
    onClearCart,
    onSubmitOrder,
    onLoadSharedCart,
    onSetActiveTab
}: SharedCartTabProps) {
    if (isLoadingCart) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Shared Table Cart</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-20 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (sharedCartItems.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Shared Table Cart</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onLoadSharedCart}
                        >
                            Refresh
                        </Button>
                    </CardTitle>
                    <CardDescription>
                        Everyone{"'"}s items • Real-time updates • Total: $0.00
                        {subscriptionStatus !== 'SUBSCRIBED' && (
                            <span className="text-orange-600 ml-2">
                                (Subscription: {subscriptionStatus})
                            </span>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Shared cart is empty</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Browse the menu to add items
                        </p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => onSetActiveTab('menu')}
                        >
                            View Menu
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Shared Table Cart</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onLoadSharedCart}
                    >
                        Refresh
                    </Button>
                </CardTitle>
                <CardDescription>
                    Everyone{"'"}s items • Real-time updates • Total: ${cartTotal.toFixed(2)}
                    {subscriptionStatus !== 'SUBSCRIBED' && (
                        <span className="text-orange-600 ml-2">
                            (Subscription: {subscriptionStatus})
                        </span>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {sharedCartItems.map((cartItem) => (
                        <CartItemCard
                            key={cartItem.id}
                            cartItem={cartItem}
                            currentParticipant={currentParticipant}
                            onRemoveItem={onRemoveItem}
                            onUpdateQuantity={onUpdateQuantity}
                        />
                    ))}

                    <div className="border-t pt-4 space-y-4">
                        <div className="flex justify-between items-center text-lg font-semibold">
                            <span>Total:</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={onClearCart}
                                className="flex-1"
                            >
                                Clear Cart
                            </Button>
                            <Button
                                className="flex-1"
                                disabled={sharedCartItems.length === 0}
                                onClick={onSubmitOrder}
                            >
                                Submit Order (${cartTotal.toFixed(2)})
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

interface CartItemCardProps {
    cartItem: SharedCartItem
    currentParticipant: SessionParticipant | null
    onRemoveItem: (itemId: string) => Promise<void>
    onUpdateQuantity: (itemId: string, newQuantity: number) => Promise<void>
}

function CartItemCard({ cartItem, currentParticipant, onRemoveItem, onUpdateQuantity }: CartItemCardProps) {
    return (
        <div className="border rounded-lg p-4 space-y-3">
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
                            onClick={() => onUpdateQuantity(cartItem.id, cartItem.quantity - 1)}
                            className="h-6 w-6 p-0"
                        >
                            -
                        </Button>
                        <span className="text-sm w-8 text-center">{cartItem.quantity}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(cartItem.id, cartItem.quantity + 1)}
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
                        onClick={() => onRemoveItem(cartItem.id)}
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
                                {cartItem.customizations.map((customization: string, idx: number) => (
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
    )
}