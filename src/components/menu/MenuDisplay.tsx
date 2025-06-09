// src/components/menu/MenuDisplay.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Filter, Clock, AlertCircle, Plus, Minus } from 'lucide-react'
import { useMenu, useDietaryFilters } from '@/hooks/use-menu'
import type { MenuItem } from '@/lib/supabase'

interface MenuDisplayProps {
    restaurantId: string
    onAddItem?: (item: MenuItem, quantity: number) => void
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
        searchItems
    } = useMenu(restaurantId)

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

    // Loading state
    if (isLoading) {
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
                    value={selectedCategory || ''}
                    onValueChange={setSelectedCategory}
                    className="w-full"
                >
                    <ScrollArea className="w-full whitespace-nowrap">
                        <TabsList className="grid w-full grid-cols-1 lg:grid-cols-4">
                            {categories.map((category) => (
                                <TabsTrigger
                                    key={category.id}
                                    value={category.id}
                                    className="text-sm"
                                >
                                    {category.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </ScrollArea>
                </Tabs>
            )}

            {/* Menu Items */}
            <div className="space-y-4">
                {searchQuery && (
                    <div className="text-sm text-muted-foreground">
                        {finalItems.length} result{finalItems.length !== 1 ? 's' : ''} for {"'"}{searchQuery}{"'"}
                    </div>
                )}

                {finalItems.length === 0 ? (
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
                    <div className="grid gap-4">
                        {finalItems.map((item) => (
                            <MenuItemCard
                                key={item.id}
                                item={item}
                                onAddItem={onAddItem}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// Individual menu item card component
interface MenuItemCardProps {
    item: MenuItem
    onAddItem?: (item: MenuItem, quantity: number) => void
}

const MenuItemCard = ({ item, onAddItem }: MenuItemCardProps) => {
    const [quantity, setQuantity] = useState(1)

    const handleAddItem = () => {
        if (onAddItem) {
            onAddItem(item, quantity)
            setQuantity(1) // Reset quantity after adding
        }
    }

    const incrementQuantity = () => setQuantity(prev => prev + 1)
    const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

    return (
        <Card className="menu-item-card">
            <CardContent className="p-4">
                <div className="flex gap-4">
                    {/* Item Image */}
                    {item.image_url && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <h3 className="font-semibold text-foreground line-clamp-1">
                                    {item.name}
                                </h3>

                                {item.description && (
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
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

                            {/* Price */}
                            <div className="text-right flex-shrink-0">
                                <div className="text-lg font-bold text-foreground">
                                    ${item.price.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        {/* Add to Cart Controls */}
                        {onAddItem && (
                            <div className="flex items-center justify-between mt-4">
                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2">
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
                                </div>

                                {/* Add to Cart Button */}
                                <Button
                                    onClick={handleAddItem}
                                    size="sm"
                                    className="gap-2"
                                >
                                    <Plus className="w-3 h-3" />
                                    Add ${(item.price * quantity).toFixed(2)}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
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

export default MenuDisplay