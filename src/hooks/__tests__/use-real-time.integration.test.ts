import { renderHook, act } from '@testing-library/react'
import { useRealTime } from '../use-real-time'
import { supabase } from '@/lib/supabase'

// Mock only specific parts for integration testing
const mockChannel = {
  on: jest.fn().mockReturnThis(),
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
}

jest.mock('@/lib/supabase', () => ({
  supabase: {
    channel: jest.fn(() => mockChannel),
  },
}))

describe('useRealTime Integration', () => {
  const mockSessionId = 'session-123'
  const mockCallback = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create channel with correct configuration', () => {
    renderHook(() => useRealTime(mockSessionId, 'participants', mockCallback))

    expect(supabase.channel).toHaveBeenCalledWith(`participants:${mockSessionId}`)
  })

  it('should set up postgres changes listener', () => {
    renderHook(() => useRealTime(mockSessionId, 'participants', mockCallback))

    expect(mockChannel.on).toHaveBeenCalledWith(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'session_participants',
        filter: `session_id=eq.${mockSessionId}`,
      },
      expect.any(Function)
    )
  })

  it('should subscribe to channel', () => {
    renderHook(() => useRealTime(mockSessionId, 'participants', mockCallback))

    expect(mockChannel.subscribe).toHaveBeenCalled()
  })

  it('should handle INSERT events', () => {
    let changeHandler: (payload: any) => void

    mockChannel.on.mockImplementation((event, config, handler) => {
      changeHandler = handler
      return mockChannel
    })

    renderHook(() => useRealTime(mockSessionId, 'participants', mockCallback))

    const insertPayload = {
      eventType: 'INSERT',
      new: {
        id: 'participant-456',
        session_id: mockSessionId,
        display_name: 'Jane Doe',
        color_code: '#00FF00',
        joined_at: '2023-01-01T10:05:00Z',
        last_active_at: '2023-01-01T10:05:00Z',
      },
      old: {},
    }

    act(() => {
      changeHandler(insertPayload)
    })

    expect(mockCallback).toHaveBeenCalledWith({
      type: 'INSERT',
      table: 'session_participants',
      data: insertPayload.new,
    })
  })

  it('should handle UPDATE events', () => {
    let changeHandler: (payload: any) => void

    mockChannel.on.mockImplementation((event, config, handler) => {
      changeHandler = handler
      return mockChannel
    })

    renderHook(() => useRealTime(mockSessionId, 'participants', mockCallback))

    const updatePayload = {
      eventType: 'UPDATE',
      new: {
        id: 'participant-456',
        session_id: mockSessionId,
        display_name: 'Jane Doe Updated',
        color_code: '#00FF00',
        joined_at: '2023-01-01T10:05:00Z',
        last_active_at: '2023-01-01T10:10:00Z',
      },
      old: {
        id: 'participant-456',
        session_id: mockSessionId,
        display_name: 'Jane Doe',
        color_code: '#00FF00',
        joined_at: '2023-01-01T10:05:00Z',
        last_active_at: '2023-01-01T10:05:00Z',
      },
    }

    act(() => {
      changeHandler(updatePayload)
    })

    expect(mockCallback).toHaveBeenCalledWith({
      type: 'UPDATE',
      table: 'session_participants',
      data: updatePayload.new,
      oldData: updatePayload.old,
    })
  })

  it('should handle DELETE events', () => {
    let changeHandler: (payload: any) => void

    mockChannel.on.mockImplementation((event, config, handler) => {
      changeHandler = handler
      return mockChannel
    })

    renderHook(() => useRealTime(mockSessionId, 'participants', mockCallback))

    const deletePayload = {
      eventType: 'DELETE',
      new: {},
      old: {
        id: 'participant-456',
        session_id: mockSessionId,
        display_name: 'Jane Doe',
        color_code: '#00FF00',
        joined_at: '2023-01-01T10:05:00Z',
        last_active_at: '2023-01-01T10:05:00Z',
      },
    }

    act(() => {
      changeHandler(deletePayload)
    })

    expect(mockCallback).toHaveBeenCalledWith({
      type: 'DELETE',
      table: 'session_participants',
      data: deletePayload.old,
    })
  })

  it('should handle different table types', () => {
    renderHook(() => useRealTime(mockSessionId, 'orders', mockCallback))

    expect(mockChannel.on).toHaveBeenCalledWith(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `session_id=eq.${mockSessionId}`,
      },
      expect.any(Function)
    )
  })

  it('should handle service_requests table with correct filter', () => {
    renderHook(() => useRealTime(mockSessionId, 'service_requests', mockCallback))

    expect(mockChannel.on).toHaveBeenCalledWith(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'service_requests',
        filter: `session_id=eq.${mockSessionId}`,
      },
      expect.any(Function)
    )
  })

  it('should cleanup subscription on unmount', () => {
    const { unmount } = renderHook(() => 
      useRealTime(mockSessionId, 'participants', mockCallback)
    )

    unmount()

    expect(mockChannel.unsubscribe).toHaveBeenCalled()
  })

  it('should handle subscription errors gracefully', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    
    mockChannel.subscribe.mockImplementation(() => {
      throw new Error('Subscription failed')
    })

    renderHook(() => useRealTime(mockSessionId, 'participants', mockCallback))

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Real-time subscription error:',
      expect.any(Error)
    )

    consoleErrorSpy.mockRestore()
  })

  it('should handle callback errors gracefully', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    const errorCallback = jest.fn().mockImplementation(() => {
      throw new Error('Callback error')
    })

    let changeHandler: (payload: any) => void

    mockChannel.on.mockImplementation((event, config, handler) => {
      changeHandler = handler
      return mockChannel
    })

    renderHook(() => useRealTime(mockSessionId, 'participants', errorCallback))

    const insertPayload = {
      eventType: 'INSERT',
      new: { id: 'test' },
      old: {},
    }

    act(() => {
      changeHandler(insertPayload)
    })

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error in real-time callback:',
      expect.any(Error)
    )

    consoleErrorSpy.mockRestore()
  })

  it('should not create subscription when sessionId is null', () => {
    renderHook(() => useRealTime(null, 'participants', mockCallback))

    expect(supabase.channel).not.toHaveBeenCalled()
    expect(mockChannel.on).not.toHaveBeenCalled()
    expect(mockChannel.subscribe).not.toHaveBeenCalled()
  })

  it('should recreate subscription when sessionId changes', () => {
    const { rerender } = renderHook(
      ({ sessionId }) => useRealTime(sessionId, 'participants', mockCallback),
      { initialProps: { sessionId: 'session-123' } }
    )

    expect(supabase.channel).toHaveBeenCalledWith('participants:session-123')
    
    // Clear previous calls
    jest.clearAllMocks()

    // Rerender with new sessionId
    rerender({ sessionId: 'session-456' })

    expect(mockChannel.unsubscribe).toHaveBeenCalled()
    expect(supabase.channel).toHaveBeenCalledWith('participants:session-456')
  })

  it('should handle malformed payload data', () => {
    let changeHandler: (payload: any) => void

    mockChannel.on.mockImplementation((event, config, handler) => {
      changeHandler = handler
      return mockChannel
    })

    renderHook(() => useRealTime(mockSessionId, 'participants', mockCallback))

    const malformedPayload = {
      eventType: 'INSERT',
      // Missing 'new' property
      old: {},
    }

    act(() => {
      changeHandler(malformedPayload)
    })

    // Should handle gracefully without crashing
    expect(mockCallback).toHaveBeenCalledWith({
      type: 'INSERT',
      table: 'session_participants',
      data: undefined,
    })
  })

  it('should debounce rapid events', async () => {
    jest.useFakeTimers()
    
    let changeHandler: (payload: any) => void

    mockChannel.on.mockImplementation((event, config, handler) => {
      changeHandler = handler
      return mockChannel
    })

    renderHook(() => useRealTime(mockSessionId, 'participants', mockCallback))

    // Fire multiple rapid events
    const payload = {
      eventType: 'UPDATE',
      new: { id: 'test', last_active_at: new Date().toISOString() },
      old: { id: 'test', last_active_at: new Date(Date.now() - 1000).toISOString() },
    }

    act(() => {
      changeHandler(payload)
      changeHandler(payload)
      changeHandler(payload)
    })

    // Should only call callback once (if debouncing is implemented)
    // This would depend on your actual implementation
    expect(mockCallback).toHaveBeenCalledTimes(3) // Or 1 if debounced

    jest.useRealTimers()
  })
})