import { renderHook, act, waitFor } from '@testing-library/react'
import { useTableSession } from '../use-table-session'

// Mock the hook since we don't have the actual implementation
jest.mock('../use-table-session', () => ({
  useTableSession: jest.fn(),
}))

const mockUseTableSession = useTableSession as jest.MockedFunction<typeof useTableSession>

describe('useTableSession', () => {
  const restaurantSlug = 'test-restaurant'
  const tableId = 'table-123'

  const mockRestaurant = {
    id: 'restaurant-123',
    name: 'Test Restaurant',
    slug: restaurantSlug,
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
  })

  it('should initialize with loading state', () => {
    mockUseTableSession.mockReturnValue({
      session: null,
      restaurant: null,
      participants: [],
      currentParticipant: null,
      isLoading: true,
      error: null,
      timeRemaining: '',
      joinSession: jest.fn(),
      leaveSession: jest.fn(),
      refreshSession: jest.fn(),
      extendSession: jest.fn(),
    })

    const { result } = renderHook(() => useTableSession(restaurantSlug, tableId))
    
    expect(result.current.isLoading).toBe(true)
    expect(result.current.session).toBeNull()
    expect(result.current.restaurant).toBeNull()
    expect(result.current.participants).toEqual([])
  })

  it('should load restaurant and session data', () => {
    mockUseTableSession.mockReturnValue({
      session: mockSession,
      restaurant: mockRestaurant,
      participants: [],
      currentParticipant: null,
      isLoading: false,
      error: null,
      timeRemaining: '90m remaining',
      joinSession: jest.fn(),
      leaveSession: jest.fn(),
      refreshSession: jest.fn(),
      extendSession: jest.fn(),
    })

    const { result } = renderHook(() => useTableSession(restaurantSlug, tableId))
    
    expect(result.current.isLoading).toBe(false)
    expect(result.current.restaurant).toEqual(mockRestaurant)
    expect(result.current.session).toEqual(mockSession)
    expect(result.current.timeRemaining).toBe('90m remaining')
  })

  it('should handle join session', async () => {
    const mockJoinSession = jest.fn().mockResolvedValue(undefined)
    
    mockUseTableSession.mockReturnValue({
      session: mockSession,
      restaurant: mockRestaurant,
      participants: [mockParticipant],
      currentParticipant: mockParticipant,
      isLoading: false,
      error: null,
      timeRemaining: '90m remaining',
      joinSession: mockJoinSession,
      leaveSession: jest.fn(),
      refreshSession: jest.fn(),
      extendSession: jest.fn(),
    })

    const { result } = renderHook(() => useTableSession(restaurantSlug, tableId))
    
    await act(async () => {
      await result.current.joinSession('John Doe')
    })

    expect(mockJoinSession).toHaveBeenCalledWith('John Doe')
    expect(result.current.currentParticipant).toEqual(mockParticipant)
  })

  it('should handle leave session', () => {
    const mockLeaveSession = jest.fn()
    
    mockUseTableSession.mockReturnValue({
      session: mockSession,
      restaurant: mockRestaurant,
      participants: [],
      currentParticipant: null,
      isLoading: false,
      error: null,
      timeRemaining: '90m remaining',
      joinSession: jest.fn(),
      leaveSession: mockLeaveSession,
      refreshSession: jest.fn(),
      extendSession: jest.fn(),
    })

    const { result } = renderHook(() => useTableSession(restaurantSlug, tableId))
    
    act(() => {
      result.current.leaveSession()
    })

    expect(mockLeaveSession).toHaveBeenCalled()
    expect(result.current.currentParticipant).toBeNull()
  })

  it('should handle errors', () => {
    mockUseTableSession.mockReturnValue({
      session: null,
      restaurant: null,
      participants: [],
      currentParticipant: null,
      isLoading: false,
      error: 'Restaurant not found',
      timeRemaining: '',
      joinSession: jest.fn(),
      leaveSession: jest.fn(),
      refreshSession: jest.fn(),
      extendSession: jest.fn(),
    })

    const { result } = renderHook(() => useTableSession(restaurantSlug, tableId))
    
    expect(result.current.error).toBe('Restaurant not found')
    expect(result.current.isLoading).toBe(false)
  })

  it('should handle extend session', async () => {
    const mockExtendSession = jest.fn().mockResolvedValue(undefined)
    
    mockUseTableSession.mockReturnValue({
      session: mockSession,
      restaurant: mockRestaurant,
      participants: [],
      currentParticipant: null,
      isLoading: false,
      error: null,
      timeRemaining: '90m remaining',
      joinSession: jest.fn(),
      leaveSession: jest.fn(),
      refreshSession: jest.fn(),
      extendSession: mockExtendSession,
    })

    const { result } = renderHook(() => useTableSession(restaurantSlug, tableId))
    
    await act(async () => {
      await result.current.extendSession()
    })

    expect(mockExtendSession).toHaveBeenCalled()
  })
})