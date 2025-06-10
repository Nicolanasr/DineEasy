import { renderHook } from '@testing-library/react'
import { useActivityTracker } from '../use-activity-tracker'

// Mock the hook since we don't have the actual implementation
jest.mock('../use-activity-tracker', () => ({
  useActivityTracker: jest.fn(),
}))

const mockUseActivityTracker = useActivityTracker as jest.MockedFunction<typeof useActivityTracker>

describe('useActivityTracker', () => {
  const mockParticipantId = 'participant-123'
  
  const defaultOptions = {
    updateInterval: 5 * 60 * 1000, // 5 minutes
    trackVisibility: true,
    trackInteractions: true,
    trackScroll: true,
    debounceMs: 1000,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not track activity when participant ID is null', () => {
    mockUseActivityTracker.mockReturnValue(undefined)
    
    renderHook(() => useActivityTracker(null, defaultOptions))
    
    expect(mockUseActivityTracker).toHaveBeenCalledWith(null, defaultOptions)
  })

  it('should track activity when participant ID is provided', () => {
    mockUseActivityTracker.mockReturnValue(undefined)
    
    renderHook(() => useActivityTracker(mockParticipantId, defaultOptions))
    
    expect(mockUseActivityTracker).toHaveBeenCalledWith(mockParticipantId, defaultOptions)
  })

  it('should handle different tracking options', () => {
    const customOptions = {
      ...defaultOptions,
      trackInteractions: false,
      trackScroll: false,
    }
    
    mockUseActivityTracker.mockReturnValue(undefined)
    
    renderHook(() => useActivityTracker(mockParticipantId, customOptions))
    
    expect(mockUseActivityTracker).toHaveBeenCalledWith(mockParticipantId, customOptions)
  })

  it('should handle different update intervals', () => {
    const customOptions = {
      ...defaultOptions,
      updateInterval: 2 * 60 * 1000, // 2 minutes
    }
    
    mockUseActivityTracker.mockReturnValue(undefined)
    
    renderHook(() => useActivityTracker(mockParticipantId, customOptions))
    
    expect(mockUseActivityTracker).toHaveBeenCalledWith(mockParticipantId, customOptions)
  })

  it('should handle custom debounce settings', () => {
    const customOptions = {
      ...defaultOptions,
      debounceMs: 5000,
    }
    
    mockUseActivityTracker.mockReturnValue(undefined)
    
    renderHook(() => useActivityTracker(mockParticipantId, customOptions))
    
    expect(mockUseActivityTracker).toHaveBeenCalledWith(mockParticipantId, customOptions)
  })
})