// src/app/[restaurantSlug]/table/[tableId]/components/MainTabs.tsx
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Menu, ShoppingCart } from 'lucide-react'
import MenuDisplay, { type MenuItemCustomizationWithPrice } from '@/components/menu/MenuDisplay'
import { SharedCartTab } from './SharedCardTab'
import { ServiceTab } from './ServiceTab'
import type { MenuItem, Restaurant, SessionParticipant, OrderItem } from '@/lib/supabase'

// Shared cart item with participant and menu info
type SharedCartItem = OrderItem & {
    menu_items: MenuItem;
    session_participants: SessionParticipant | null;
};

interface MainTabsProps {
    activeTab: string
    onTabChange: (tab: string) => void
    restaurant: Restaurant | null
    sharedCartItems: SharedCartItem[]
    isLoadingCart: boolean
    subscriptionStatus: string
    cartTotal: number
    currentParticipant: SessionParticipant | null
    onAddItem: (item: MenuItem, quantity: number, customizations?: MenuItemCustomizationWithPrice[], notes?: string) => Promise<void>
    onRemoveItem: (itemId: string) => Promise<void>
    onUpdateQuantity: (itemId: string, newQuantity: number) => Promise<void>
    onClearCart: () => Promise<void>
    onSubmitOrder: () => Promise<void>
    onLoadSharedCart: () => Promise<void>
    onSetActiveTab: (tab: string) => void
}

export function MainTabs({
    activeTab,
    onTabChange,
    restaurant,
    sharedCartItems,
    isLoadingCart,
    subscriptionStatus,
    cartTotal,
    currentParticipant,
    onAddItem,
    onRemoveItem,
    onUpdateQuantity,
    onClearCart,
    onSubmitOrder,
    onLoadSharedCart,
    onSetActiveTab
}: MainTabsProps) {
    return (
        <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList className="grid w-full grid-cols-3 gap-2">
                <TabsTrigger value="menu" className="gap-2">
                    <Menu className="w-4 h-4" />
                    Menu
                </TabsTrigger>
                <TabsTrigger value="cart" className="gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Cart
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
                        onAddItem={onAddItem}
                    />
                )}
            </TabsContent>

            {/* Shared Cart Tab */}
            <TabsContent value="cart" className="mt-6">
                <SharedCartTab
                    sharedCartItems={sharedCartItems}
                    isLoadingCart={isLoadingCart}
                    subscriptionStatus={subscriptionStatus}
                    cartTotal={cartTotal}
                    currentParticipant={currentParticipant}
                    onRemoveItem={onRemoveItem}
                    onUpdateQuantity={onUpdateQuantity}
                    onClearCart={onClearCart}
                    onSubmitOrder={onSubmitOrder}
                    onLoadSharedCart={onLoadSharedCart}
                    onSetActiveTab={onSetActiveTab}
                />
            </TabsContent>

            {/* Service Tab */}
            <TabsContent value="service" className="mt-6">
                <ServiceTab />
            </TabsContent>
        </Tabs>
    )
}

export { MenuItemCustomizationWithPrice }
