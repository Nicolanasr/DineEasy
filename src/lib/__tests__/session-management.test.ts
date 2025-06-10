import {
  getSessionDuration,
  shouldExtendSession,
  generateSessionToken,
  formatTimeRemaining,
} from '../session-management'
import type { TableSession, SessionActivity } from '../session-management'

// Mock the complex functions and test the simple ones
jest.mock('../session-management', () => ({
  ...jest.requireActual('../session-management'),
  createOrJoinSession: jest.fn(),
  extendSession: jest.fn(),
  endSession: jest.fn(),
  cleanupExpiredSessions: jest.fn(),
  getSessionDetails: jest.fn(),
}))

// Mock constants if they exist
jest.mock('../constants', () => ({
  SESSION_DURATIONS: {
    FAST_CASUAL: 45,
    CASUAL_DINING: 90,
    FINE_DINING: 180,
    CAFE: 60,
    BAR: 240,
    DEFAULT: 120,
  },
  TIME_MS: {
    MINUTE: 60 * 1000,
  },
  SESSION_EXTENSION: {
    ACTIVITY_THRESHOLD_MINUTES: 30,
  },
  RESTAURANT_TYPES: {
    FAST_CASUAL: 'fast-casual',
    CASUAL_DINING: 'casual-dining',
    FINE_DINING: 'fine-dining',
    CAFE: 'cafe',
    BAR: 'bar',
    DEFAULT: 'default',
  },
}), { virtual: true })

describe('session-management', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getSessionDuration', () => {
    it('should return correct duration for fast-casual', () => {
      expect(getSessionDuration('fast-casual')).toBe(45)
    })

    it('should return correct duration for casual-dining', () => {
      expect(getSessionDuration('casual-dining')).toBe(90)
    })

    it('should return correct duration for fine-dining', () => {
      expect(getSessionDuration('fine-dining')).toBe(180)
    })

    it('should return correct duration for cafe', () => {
      expect(getSessionDuration('cafe')).toBe(60)
    })

    it('should return correct duration for bar', () => {
      expect(getSessionDuration('bar')).toBe(240)
    })

    it('should return default duration for unknown type', () => {
      expect(getSessionDuration('unknown')).toBe(120)
    })
  })

  describe('shouldExtendSession', () => {
    const mockSession: TableSession = {
      id: 'session-123',
      table_id: 'table-123',
      restaurant_id: 'restaurant-123',
      status: 'active',
      session_token: 'token-123',
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      total_amount: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    it('should extend session with recent activity', () => {
      const recentActivity: SessionActivity = {
        lastOrderAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
      }

      expect(shouldExtendSession(mockSession, recentActivity)).toBe(true)
    })

    it('should not extend session with old activity', () => {
      const oldActivity: SessionActivity = {
        lastOrderAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
      }

      expect(shouldExtendSession(mockSession, oldActivity)).toBe(false)
    })

    it('should consider most recent activity from multiple sources', () => {
      const mixedActivity: SessionActivity = {
        lastOrderAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
        lastServiceRequestAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
      }

      expect(shouldExtendSession(mockSession, mixedActivity)).toBe(true)
    })
  })

  describe('generateSessionToken', () => {
    it('should generate a string token', () => {
      const token = generateSessionToken()
      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)
    })

    it('should generate unique tokens', () => {
      const token1 = generateSessionToken()
      const token2 = generateSessionToken()
      expect(token1).not.toBe(token2)
    })
  })

  describe('formatTimeRemaining', () => {
    it('should format hours and minutes correctly', () => {
      const futureTime = new Date(Date.now() + 125 * 60 * 1000).toISOString() // 2h 5m
      const result = formatTimeRemaining(futureTime)
      expect(result).toBe('2h 5m remaining')
    })

    it('should format minutes only when less than an hour', () => {
      const futureTime = new Date(Date.now() + 45 * 60 * 1000).toISOString() // 45m
      const result = formatTimeRemaining(futureTime)
      expect(result).toBe('45m remaining')
    })

    it('should return "Expired" for past time', () => {
      const pastTime = new Date(Date.now() - 60 * 1000).toISOString() // 1 minute ago
      const result = formatTimeRemaining(pastTime)
      expect(result).toBe('Expired')
    })
  })
})