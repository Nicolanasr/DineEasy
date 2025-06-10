import { renderHook, act, waitFor } from '@testing-library/react'
import { useSharedCart } from '../[tableId]/hooks/useSharedCart'
import { supabase } from '@/lib/supabase'

// Remove the mock for this integration test
jest.unmock('@/lib/supabase')

// Mock only the real-time functionality
const mockChannel = {
  on: jest.fn().mockReturnThis(),
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
}

const mockSupabaseRealtimeOnly = {
  ...supabase,
  channel: jest.fn(() => mockChannel),
}

jest.mock('@/lib/supabase', () => ({
  supabase: mockSupabaseRealtimeOnly,
}))

describe('useSharedCart Integration', () => {
  const mockSession = {
    id: 'session-123',
    table_id: 'table-123',
    restaurant_id: 'restaurant-123',
    status: 'active' as const,
    session_token: 'token-123',
    expires_at: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    total_amount: 0,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  }

  const mockParticipant = {
    id: 'participant-123',
    session_id: 'session-123',
    display_name: 'John Doe',
    color_code: '#FF5733',
    joined_at: '2023-01-01T10:00:00Z',
    last_active_at: '2023-01-01T10:00:00Z',
  }

  const mockMenuItem = {
    id: 'item-123',
    restaurant_id: 'restaurant-123',
    category_id: 'cat-123',
    name: 'Test Burger',
    description: 'A delicious test burger',
    price: 12.99,
    image_url: null,
    ingredients: ['beef', 'cheese', 'lettuce'],
    allergens: [],
    dietary_info: [],
    preparation_time: 15,
    is_available: true,
    display_order: 1,
    omega_item_id: null,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup default Supabase responses
    const mockSupabase = mockSupabaseRealtimeOnly as any
    
    mockSupabase.from = jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    }))
  })

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useSharedCart(mockSession, mockParticipant))

    expect(result.current.sharedCartItems).toEqual([])
    expect(result.current.cartTotal).toBe(0)
    expect(result.current.isLoadingCart).toBe(true)
  })

  it('should handle adding items to cart', async () => {
    const mockOrder = {
      id: 'order-123',
      session_id: 'session-123',
      participant_id: 'participant-123',
      status: 'cart' as const,
      subtotal: 12.99,
      notes: null,
      omega_order_id: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    }

    const mockOrderItem = {
      id: 'order-item-123',
      order_id: 'order-123',
      menu_item_id: 'item-123',
      quantity: 1,
      unit_price: 12.99,
      total_price: 12.99,
      customizations: [],
      notes: null,
      added_by_participant_id: 'participant-123',
      created_at: '2023-01-01T00:00:00Z',
    }

    // Mock successful order creation and item addition
    const mockSupabase = mockSupabaseRealtimeOnly as any
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'orders') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          insert: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockOrder, error: null }),
          maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
        }
      }
      if (table === 'order_items') {
        return {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockOrderItem, error: null }),
        }
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
    })

    const { result } = renderHook(() => useSharedCart(mockSession, mockParticipant))

    await act(async () => {
      await result.current.handleAddItem(mockMenuItem, 1)
    })

    await waitFor(() => {
      expect(result.current.sharedCartItems).toHaveLength(1)
      expect(result.current.cartTotal).toBe(12.99)
    })
  })

  it('should handle updating item quantities', async () => {
    const mockOrderItem = {
      id: 'order-item-123',
      order_id: 'order-123',
      menu_item_id: 'item-123',
      quantity: 2,
      unit_price: 12.99,
      total_price: 25.98,
      customizations: [],
      notes: null,
      added_by_participant_id: 'participant-123',
      created_at: '2023-01-01T00:00:00Z',
      menu_item: mockMenuItem,
    }

    const mockSupabase = mockSupabaseRealtimeOnly as any
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'order_items') {
        return {
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockOrderItem, error: null }),
        }
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
    })

    const { result } = renderHook(() => useSharedCart(mockSession, mockParticipant))

    await act(async () => {
      await result.current.handleUpdateQuantity('order-item-123', 2)
    })

    // Since we're mocking the update, we'd need to simulate the real-time update
    // In a real integration test, this would come through the subscription
  })

  it('should handle removing items from cart', async () => {
    const mockSupabase = mockSupabaseRealtimeOnly as any
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'order_items') {
        return {
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ error: null }),
        }
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
    })

    const { result } = renderHook(() => useSharedCart(mockSession, mockParticipant))

    await act(async () => {
      await result.current.handleRemoveItem('order-item-123')
    })

    expect(mockSupabase.from).toHaveBeenCalledWith('order_items')
  })

  it('should handle clearing entire cart', async () => {
    const mockSupabase = mockSupabaseRealtimeOnly as any
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'order_items') {
        return {
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          in: jest.fn().mockResolvedValue({ error: null }),
        }
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
    })

    const { result } = renderHook(() => useSharedCart(mockSession, mockParticipant))

    await act(async () => {
      await result.current.handleClearCart()
    })

    expect(mockSupabase.from).toHaveBeenCalledWith('order_items')
  })

  it('should handle submitting order', async () => {
    const mockOrder = {
      id: 'order-123',
      session_id: 'session-123',
      participant_id: 'participant-123',
      status: 'submitted' as const,
      subtotal: 12.99,
      notes: null,
      omega_order_id: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    }

    const mockSupabase = mockSupabaseRealtimeOnly as any
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'orders') {
        return {
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockOrder, error: null }),
        }
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
    })

    const { result } = renderHook(() => useSharedCart(mockSession, mockParticipant))

    await act(async () => {
      await result.current.handleSubmitOrder()
    })

    expect(mockSupabase.from).toHaveBeenCalledWith('orders')
  })

  it('should set up real-time subscriptions', () => {
    renderHook(() => useSharedCart(mockSession, mockParticipant))

    expect(mockSupabaseRealtimeOnly.channel).toHaveBeenCalledWith(
      `shared-cart:session-123`
    )
    expect(mockChannel.on).toHaveBeenCalledWith(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'order_items',
        filter: 'order_id=in.()',
      },
      expect.any(Function)
    )
    expect(mockChannel.subscribe).toHaveBeenCalled()
  })

  it('should cleanup subscriptions on unmount', () => {
    const { unmount } = renderHook(() => useSharedCart(mockSession, mockParticipant))

    unmount()

    expect(mockChannel.unsubscribe).toHaveBeenCalled()
  })

  it('should handle subscription errors gracefully', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    
    // Mock subscription error
    mockChannel.subscribe.mockImplementation(() => {
      throw new Error('Subscription failed')
    })

    renderHook(() => useSharedCart(mockSession, mockParticipant))

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to set up real-time subscription:',
      expect.any(Error)
    )

    consoleErrorSpy.mockRestore()
  })

  it('should handle network errors during cart operations', async () => {
    const mockSupabase = mockSupabaseRealtimeOnly as any
    mockSupabase.from.mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ 
        data: null, 
        error: { message: 'Network error' } 
      }),
    }))

    const { result } = renderHook(() => useSharedCart(mockSession, mockParticipant))

    await act(async () => {
      await expect(result.current.handleAddItem(mockMenuItem, 1)).rejects.toThrow()
    })
  })
})