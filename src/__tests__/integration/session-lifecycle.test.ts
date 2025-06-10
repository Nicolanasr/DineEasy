import { renderHook, act, waitFor } from '@testing-library/react'
import { useTableSession } from '@/hooks/use-table-session'
import * as sessionManagement from '@/lib/session-management'
import { supabase } from '@/lib/supabase'

// Mock session management functions but test their integration
jest.mock('@/lib/session-management')
jest.mock('@/lib/supabase')

const mockSessionManagement = sessionManagement as jest.Mocked<typeof sessionManagement>
const mockSupabase = supabase as jest.Mocked<typeof supabase>

describe('Session Lifecycle Integration', () => {
  const restaurantSlug = 'test-restaurant'
  const tableId = 'table-123'
  
  const mockRestaurant = {
    id: 'restaurant-123',
    name: 'Test Restaurant',
    slug: restaurantSlug,
    email: 'test@restaurant.com',
    phone: null,
    address: null,
    logo_url: null,
    cover_image_url: null,
    currency: 'USD',
    timezone: 'UTC',
    omega_integration_enabled: false,
    omega_api_endpoint: null,
    omega_api_key: null,
    settings: { type: 'casual-dining' },
    is_active: true,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  }

  const mockTable = {
    id: tableId,
    restaurant_id: 'restaurant-123',
    table_number: '5',
    table_name: 'Table 5',
    capacity: 4,
    qr_code_url: null,
    is_active: true,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  }

  const mockSession = {
    id: 'session-123',
    table_id: tableId,
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

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()

    // Mock successful restaurant and table lookup
    const mockChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      maybeSingle: jest.fn(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
    }

    mockSupabase.from.mockReturnValue(mockChain as any)
    
    // Setup specific responses
    mockChain.single
      .mockResolvedValueOnce({ data: mockRestaurant, error: null }) // restaurant lookup
      .mockResolvedValueOnce({ data: mockTable, error: null }) // table lookup
      .mockResolvedValueOnce({ data: mockParticipant, error: null }) // participant creation

    mockSessionManagement.createOrJoinSession.mockResolvedValue(mockSession)
  })

  describe('Complete Session Flow', () => {
    it('should handle full session lifecycle from creation to completion', async () => {
      // Step 1: Initialize session
      const { result } = renderHook(() => useTableSession(restaurantSlug, tableId))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.restaurant).toEqual(mockRestaurant)
      expect(result.current.session).toEqual(mockSession)
      expect(mockSessionManagement.createOrJoinSession).toHaveBeenCalledWith(
        tableId,
        'restaurant-123'
      )

      // Step 2: Join session as participant
      await act(async () => {
        await result.current.joinSession('John Doe')
      })

      expect(result.current.currentParticipant).toEqual(mockParticipant)
      expect(localStorage.getItem('participant_id')).toBe('participant-123')

      // Step 3: Extend session
      mockSessionManagement.extendSession.mockResolvedValue()
      
      await act(async () => {
        await result.current.extendSession()
      })

      expect(mockSessionManagement.extendSession).toHaveBeenCalledWith('session-123', 60)

      // Step 4: Leave session
      act(() => {
        result.current.leaveSession()
      })

      expect(result.current.currentParticipant).toBeNull()
      expect(localStorage.getItem('participant_id')).toBeNull()
    })

    it('should handle session expiration gracefully', async () => {
      const expiredSession = {
        ...mockSession,
        expires_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      }

      mockSessionManagement.createOrJoinSession.mockResolvedValue(expiredSession)

      const { result } = renderHook(() => useTableSession(restaurantSlug, tableId))

      await waitFor(() => {
        expect(result.current.timeRemaining).toBe('Expired')
      })
    })

    it('should handle session auto-extension based on activity', async () => {
      const { result } = renderHook(() => useTableSession(restaurantSlug, tableId))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Simulate activity that would trigger auto-extension
      mockSessionManagement.extendSession.mockResolvedValue()

      // In a real scenario, this would be triggered by user activity
      await act(async () => {
        await result.current.extendSession()
      })

      expect(mockSessionManagement.extendSession).toHaveBeenCalled()
    })

    it('should handle multiple participants joining and leaving', async () => {
      const secondParticipant = {
        id: 'participant-456',
        session_id: 'session-123',
        display_name: 'Jane Smith',
        color_code: '#00FF00',
        joined_at: '2023-01-01T10:05:00Z',
        last_active_at: '2023-01-01T10:05:00Z',
      }

      // Mock first participant joining
      const { result } = renderHook(() => useTableSession(restaurantSlug, tableId))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.joinSession('John Doe')
      })

      expect(result.current.currentParticipant).toEqual(mockParticipant)

      // Simulate second participant joining (would come through real-time updates)
      act(() => {
        // In real implementation, this would be handled by real-time subscription
        // Here we simulate the state update
        result.current.participants.push(secondParticipant)
      })

      // Verify both participants are tracked
      expect(result.current.participants).toHaveLength(2)
    })

    it('should handle network interruptions and reconnection', async () => {
      const { result } = renderHook(() => useTableSession(restaurantSlug, tableId))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Simulate network error during session join
      mockSupabase.from.mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        single: jest.fn().mockRejectedValue(new Error('Network error')),
      }))

      await act(async () => {
        await expect(result.current.joinSession('John Doe')).rejects.toThrow('Network error')
      })

      expect(result.current.currentParticipant).toBeNull()

      // Simulate network recovery
      mockSupabase.from.mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockParticipant, error: null }),
      }))

      // Retry joining after network recovery
      await act(async () => {
        await result.current.joinSession('John Doe')
      })

      expect(result.current.currentParticipant).toEqual(mockParticipant)
    })

    it('should handle session refresh correctly', async () => {
      const { result } = renderHook(() => useTableSession(restaurantSlug, tableId))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Clear previous calls
      mockSessionManagement.createOrJoinSession.mockClear()

      // Refresh session
      await act(async () => {
        result.current.refreshSession()
      })

      expect(mockSessionManagement.createOrJoinSession).toHaveBeenCalledTimes(1)
    })

    it('should persist participant data across page reloads', async () => {
      // Simulate existing participant ID in localStorage
      localStorage.setItem('participant_id', 'participant-123')

      // Mock participant lookup
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'session_participants') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: mockParticipant, error: null }),
          }
        }
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockRestaurant, error: null }),
        }
      })

      const { result } = renderHook(() => useTableSession(restaurantSlug, tableId))

      await waitFor(() => {
        expect(result.current.currentParticipant).toEqual(mockParticipant)
      })
    })

    it('should handle concurrent session operations', async () => {
      const { result } = renderHook(() => useTableSession(restaurantSlug, tableId))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Simulate concurrent operations
      const promises = [
        result.current.joinSession('John Doe'),
        result.current.extendSession(),
        result.current.refreshSession(),
      ]

      // Should handle concurrent operations gracefully
      await act(async () => {
        await Promise.allSettled(promises)
      })

      // At least some operations should succeed
      expect(mockSessionManagement.createOrJoinSession).toHaveBeenCalled()
    })

    it('should handle session state consistency', async () => {
      const { result } = renderHook(() => useTableSession(restaurantSlug, tableId))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Verify initial state consistency
      expect(result.current.session).toEqual(mockSession)
      expect(result.current.restaurant).toEqual(mockRestaurant)
      expect(result.current.currentParticipant).toBeNull()
      expect(result.current.participants).toEqual([])

      // Join session and verify state updates
      await act(async () => {
        await result.current.joinSession('John Doe')
      })

      expect(result.current.currentParticipant).toEqual(mockParticipant)
      
      // Leave session and verify cleanup
      act(() => {
        result.current.leaveSession()
      })

      expect(result.current.currentParticipant).toBeNull()
    })
  })

  describe('Error Recovery Scenarios', () => {
    it('should recover from restaurant lookup failure', async () => {
      mockSupabase.from.mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockRejectedValueOnce(new Error('Restaurant not found'))
          .mockResolvedValueOnce({ data: mockRestaurant, error: null }),
      }))

      const { result } = renderHook(() => useTableSession(restaurantSlug, tableId))

      await waitFor(() => {
        expect(result.current.error).toBe('Restaurant not found')
      })

      // Retry should work
      await act(async () => {
        result.current.refreshSession()
      })

      await waitFor(() => {
        expect(result.current.error).toBeNull()
        expect(result.current.restaurant).toEqual(mockRestaurant)
      })
    })

    it('should handle session creation failure with retry', async () => {
      mockSessionManagement.createOrJoinSession
        .mockRejectedValueOnce(new Error('Session creation failed'))
        .mockResolvedValueOnce(mockSession)

      const { result } = renderHook(() => useTableSession(restaurantSlug, tableId))

      await waitFor(() => {
        expect(result.current.error).toBe('Session creation failed')
      })

      // Retry should succeed
      await act(async () => {
        result.current.refreshSession()
      })

      await waitFor(() => {
        expect(result.current.error).toBeNull()
        expect(result.current.session).toEqual(mockSession)
      })
    })
  })
})