// src/components / menu / MenuDisplay.tsx
'use client'

import { SetStateAction, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Search, Filter, Clock, AlertCircle, Plus, Settings, StickyNote } from 'lucide-react'
import { useMenu, useDietaryFilters } from '@/hooks/use-menu'
import { useRestaurantCustomizations } from '@/hooks/use-menu-customizations'
import type { MenuItem } from '@/lib/supabase'

export interface MenuItemCustomizationWithPrice {
    name: string
    price_adjustment: number
}

interface MenuDisplayProps {
    restaurantId: string
    onAddItem?: (item: MenuItem, quantity: number, customizations?: MenuItemCustomizationWithPrice[], notes?: string) => void
    className?: string
}

export const MenuDisplay = ({
    restaurantId,
    onAddItem,
    className = ''
}: MenuDisplayProps) => {
    const {
        categories,
        isLoading,
        error,
        selectedCategory,
        setSelectedCategory,
        filteredItems,
        searchItems,
        getItemsByCategory
    } = useMenu(restaurantId)

    const {
        getCustomizationsForItem,
        isLoading: customizationsLoading
    } = useRestaurantCustomizations(restaurantId)

    const {
        activeFilters,
        availableDietaryOptions,
        filteredItems: dietaryFilteredItems,
        toggleFilter,
        clearFilters
    } = useDietaryFilters(filteredItems)

    const [searchQuery, setSearchQuery] = useState('')
    const [showFilters, setShowFilters] = useState(false)

    // Final filtered items (category + dietary + search)
    const finalItems = searchQuery.trim()
        ? searchItems(searchQuery).filter(item => {
            if (activeFilters.length === 0) return true
            return activeFilters.every(filter => item.dietary_info?.includes(filter))
        })
        : dietaryFilteredItems

    // Group items by category for "All" tab
    const itemsByCategory = categories.map(category => ({
        category,
        items: getItemsByCategory(category.id).filter(item => {
            // Apply dietary filters
            if (activeFilters.length > 0) {
                return activeFilters.every(filter => item.dietary_info?.includes(filter))
            }
            return true
        }).filter(item => {
            // Apply search filter
            if (searchQuery.trim()) {
                const searchTerm = searchQuery.toLowerCase()
                return item.name.toLowerCase().includes(searchTerm) ||
                    item.description?.toLowerCase().includes(searchTerm) ||
                    item.ingredients?.some(ingredient =>
                        ingredient.toLowerCase().includes(searchTerm)
                    )
            }
            return true
        })
    })).filter(group => group.items.length > 0)

    // Loading state
    if (isLoading || customizationsLoading) {
        return (
            <div className={`space-y-6 ${className}`}>
                <MenuDisplaySkeleton />
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <Alert variant="destructive" className={className}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Search and Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search menu items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Filter Toggle */}
                        <div className="flex items-center justify-between">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className="gap-2"
                            >
                                <Filter className="w-4 h-4" />
                                Dietary Filters
                                {activeFilters.length > 0 && (
                                    <Badge variant="secondary" className="ml-1">
                                        {activeFilters.length}
                                    </Badge>
                                )}
                            </Button>

                            {activeFilters.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>

                        {/* Dietary Filters */}
                        {showFilters && (
                            <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
                                {availableDietaryOptions.map((option) => (
                                    <Button
                                        key={option}
                                        variant={activeFilters.includes(option) ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => toggleFilter(option)}
                                        className="text-xs"
                                    >
                                        {option}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Category Tabs */}
            {!searchQuery && categories.length > 0 && (
                <Tabs
                    value={selectedCategory || 'all'}
                    onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)}
                    className="w-full"
                >
                    <div className="w-full overflow-x-auto">
                        <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-max gap-2">
                            <TabsTrigger value="all" className="text-sm whitespace-nowrap">
                                All
                            </TabsTrigger>
                            {categories.map((category) => (
                                <TabsTrigger
                                    key={category.id}
                                    value={category.id}
                                    className="text-sm whitespace-nowrap"
                                >
                                    {category.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                </Tabs>
            )}

            {/* Menu Items */}
            <div className="space-y-6">
                {searchQuery && (
                    <div className="text-sm text-muted-foreground">
                        {finalItems.length} result{finalItems.length !== 1 ? 's' : ''} for {"'"}{searchQuery}{"'"}
                    </div>
                )}

                {/* Show items by category when "All" is selected or searching */}
                {(!selectedCategory || searchQuery) ? (
                    itemsByCategory.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <p className="text-muted-foreground">
                                    {searchQuery
                                        ? `No items found for "${searchQuery}"`
                                        : 'No items match your dietary filters'
                                    }
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        itemsByCategory.map(({ category, items }) => (
                            <div key={category.id} className="space-y-4">
                                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                                    {category.name}
                                </h2>
                                <div className="grid gap-4">
                                    {items.map((item) => (
                                        <MenuItemCard
                                            key={item.id}
                                            item={item}
                                            onAddItem={onAddItem}
                                            customizations={getCustomizationsForItem(item.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))
                    )
                ) : (
                    /* Show items for selected category */
                    finalItems.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <p className="text-muted-foreground">
                                    No items match your dietary filters
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {finalItems.map((item) => (
                                <MenuItemCard
                                    key={item.id}
                                    item={item}
                                    onAddItem={onAddItem}
                                    customizations={getCustomizationsForItem(item.id)}
                                />
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

// Individual menu item card component
interface MenuItemCardProps {
    item: MenuItem
    onAddItem?: (item: MenuItem, quantity: number, customizations?: MenuItemCustomizationWithPrice[], notes?: string) => void
    customizations?: import('@/lib/supabase').MenuItemCustomization[]
}

const MenuItemCard = ({ item, onAddItem, customizations: availableCustomizations = [] }: MenuItemCardProps) => {
    const [quantity, setQuantity] = useState(1)
    const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([])
    const [notes, setNotes] = useState('')
    const [isCustomizationOpen, setIsCustomizationOpen] = useState(false)

    const handleAddItem = () => {
        if (onAddItem) {
            // Convert selected customization names to full objects with prices
            const customizationsWithPrices: MenuItemCustomizationWithPrice[] = selectedCustomizations.map(customizationName => {
                const customization = availableCustomizations.find(c => c.name === customizationName)
                return {
                    name: customizationName,
                    price_adjustment: customization?.price_adjustment || 0
                }
            })

            onAddItem(item, quantity, customizationsWithPrices, notes)
            setQuantity(1) // Reset quantity after adding
            setSelectedCustomizations([]) // Reset customizations
            setNotes('') // Reset notes
            setIsCustomizationOpen(false)
        }
    }

    // const incrementQuantity = () => setQuantity(prev => prev + 1)
    // const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

    const toggleCustomization = (customizationName: string) => {
        setSelectedCustomizations(prev =>
            prev.includes(customizationName)
                ? prev.filter(c => c !== customizationName)
                : [...prev, customizationName]
        )
    }

    // Calculate price with customizations
    const calculateItemPrice = () => {
        const basePrice = item.price
        const customizationPriceAdjustment = selectedCustomizations.reduce((total, customizationName) => {
            const customization = availableCustomizations.find(c => c.name === customizationName)
            return total + (customization?.price_adjustment || 0)
        }, 0)
        return basePrice + customizationPriceAdjustment
    }

    return (
        <Card className="menu-item-card relative">
            <CardContent className="px-0">
                <div className="flex gap-4 items-center">
                    {/* Item Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted relative">
                        {item.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="object-cover"
                                sizes="96px"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <span className="text-xs text-center">No Image</span>
                            </div>
                        )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <h3 className="font-semibold text-foreground">
                                    {item.name}
                                </h3>

                                {item.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {item.description}
                                    </p>
                                )}

                                {/* Dietary Info */}
                                {item.dietary_info && item.dietary_info.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {item.dietary_info.slice(0, 3).map((info) => (
                                            <Badge
                                                key={info}
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {info}
                                            </Badge>
                                        ))}
                                        {item.dietary_info.length > 3 && (
                                            <Badge variant="secondary" className="text-xs">
                                                +{item.dietary_info.length - 3}
                                            </Badge>
                                        )}
                                    </div>
                                )}

                                {/* Preparation Time */}
                                {item.preparation_time && (
                                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                        <Clock className="w-3 h-3" />
                                        {item.preparation_time} min
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Add to Cart Controls */}
                        {onAddItem && (
                            <>
                                <div className="flex items-center justify-between mt-4">
                                    {/* Quantity Controls */}
                                    {/* <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={decrementQuantity}
                                            disabled={quantity <= 1}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </Button>

                                        <span className="text-sm font-medium w-8 text-center">
                                            {quantity}
                                        </span>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={incrementQuantity}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </Button>
                                    </div> */}

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 absolute top-0 right-0">
                                        {/* Customization Button - only show if customizations are available */}
                                        {availableCustomizations.length > 0 && (
                                            <Dialog open={isCustomizationOpen} onOpenChange={setIsCustomizationOpen}>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-1"
                                                    >
                                                        <Settings className="w-3 h-3" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-md bg-white">
                                                    <DialogHeader>
                                                        <DialogTitle>Customize {item.name}</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        {/* Customization Options */}
                                                        {availableCustomizations.length > 0 && (
                                                            <div>
                                                                <Label className="text-sm font-medium">Customizations</Label>
                                                                <div className="grid grid-cols-1 gap-2 mt-2">
                                                                    {availableCustomizations.map((customization) => (
                                                                        <div key={customization.id} className="flex items-center justify-between">
                                                                            <Button
                                                                                variant={selectedCustomizations.includes(customization.name) ? "default" : "outline"}
                                                                                size="sm"
                                                                                onClick={() => toggleCustomization(customization.name)}
                                                                                className="text-xs justify-start flex-1 mr-2"
                                                                            >
                                                                                {customization.name}
                                                                                {customization.is_required && (
                                                                                    <span className="ml-1 text-red-500">*</span>
                                                                                )}
                                                                            </Button>
                                                                            {customization.price_adjustment !== 0 && (
                                                                                <span className="text-xs text-muted-foreground min-w-0">
                                                                                    {customization.price_adjustment > 0 ? '+' : ''}${customization.price_adjustment.toFixed(2)}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Notes */}
                                                        <div>
                                                            <Label htmlFor="notes" className="text-sm font-medium">
                                                                Special Instructions
                                                            </Label>
                                                            <Textarea
                                                                id="notes"
                                                                placeholder="Any special requests..."
                                                                value={notes}
                                                                onChange={(e: { target: { value: SetStateAction<string> } }) => setNotes(e.target.value)}
                                                                className="mt-1"
                                                                rows={3}
                                                            />
                                                        </div>

                                                        {/* Apply Button */}
                                                        <Button
                                                            onClick={() => setIsCustomizationOpen(false)}
                                                            className="w-full"
                                                        >
                                                            Apply Customizations
                                                        </Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        )}

                                    </div>
                                    {/* Add to Cart Button */}
                                </div>
                            </>
                        )}


                    </div>
                </div>
                {/* Show active customizations */}
                {(selectedCustomizations.length > 0 || notes) && (
                    <div className="p-2 bg-muted/50 rounded-lg">
                        {selectedCustomizations.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                                {selectedCustomizations.map((customizationName) => {
                                    const customization = availableCustomizations.find(c => c.name === customizationName)
                                    return (
                                        <Badge key={customizationName} variant="outline" className="text-xs">
                                            {customizationName}
                                            {customization?.price_adjustment && customization.price_adjustment !== 0 && (
                                                <span className="ml-1">
                                                    ({customization.price_adjustment > 0 ? '+' : ''}${customization.price_adjustment.toFixed(2)})
                                                </span>
                                            )}
                                        </Badge>
                                    )
                                })}
                            </div>
                        )}
                        {notes && (
                            <div className="flex items-start gap-1 text-xs text-muted-foreground">
                                <StickyNote className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                <span>{notes}</span>
                            </div>
                        )}
                    </div>
                )}
                <Button
                    onClick={handleAddItem}
                    variant="outline"
                    size="sm"
                    className="gap-2 w-full mt-2"
                >
                    <Plus className="w-3 h-3" />
                    Add ${(calculateItemPrice() * quantity).toFixed(2)}
                </Button>
            </CardContent>
        </Card>
    )
}

// Loading skeleton component
const MenuDisplaySkeleton = () => (
    <>
        {/* Search Skeleton */}
        <Card>
            <CardContent className="pt-6">
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>

        {/* Category Tabs Skeleton */}
        <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-24" />
            ))}
        </div>

        {/* Menu Items Skeleton */}
        <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            <Skeleton className="w-20 h-20 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-1/2" />
                                <div className="flex justify-between items-center mt-4">
                                    <Skeleton className="h-8 w-24" />
                                    <Skeleton className="h-8 w-20" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </>
)

export default MenuDisplay;