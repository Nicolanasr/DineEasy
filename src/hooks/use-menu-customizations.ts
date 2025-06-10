import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { MenuItemCustomization } from '@/lib/supabase'

export const useMenuCustomizations = (menuItemId: string) => {
  const [customizations, setCustomizations] = useState<MenuItemCustomization[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomizations = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('menu_item_customizations')
          .select('*')
          .eq('menu_item_id', menuItemId)
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (fetchError) {
          throw fetchError
        }

        setCustomizations(data || [])
      } catch (err) {
        console.error('Error fetching menu item customizations:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch customizations')
      } finally {
        setIsLoading(false)
      }
    }

    if (menuItemId) {
      fetchCustomizations()
    }
  }, [menuItemId])

  return { customizations, isLoading, error }
}

export const useRestaurantCustomizations = (restaurantId: string) => {
  const [customizationsByItem, setCustomizationsByItem] = useState<Record<string, MenuItemCustomization[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllCustomizations = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('menu_item_customizations')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (fetchError) {
          throw fetchError
        }

        // Group customizations by menu item ID
        const grouped = (data || []).reduce((acc, customization) => {
          const menuItemId = customization.menu_item_id
          if (!acc[menuItemId]) {
            acc[menuItemId] = []
          }
          acc[menuItemId].push(customization)
          return acc
        }, {} as Record<string, MenuItemCustomization[]>)

        setCustomizationsByItem(grouped)
      } catch (err) {
        console.error('Error fetching restaurant customizations:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch customizations')
      } finally {
        setIsLoading(false)
      }
    }

    if (restaurantId) {
      fetchAllCustomizations()
    }
  }, [restaurantId])

  const getCustomizationsForItem = (menuItemId: string): MenuItemCustomization[] => {
    return customizationsByItem[menuItemId] || []
  }

  return { 
    customizationsByItem, 
    getCustomizationsForItem, 
    isLoading, 
    error 
  }
}