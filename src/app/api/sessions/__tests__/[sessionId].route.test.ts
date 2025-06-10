import { GET, DELETE } from '../[sessionId]/route'
import { createMockRequest, createMockParams } from '@/__tests__/setup/api-test-utils'
import * as sessionManagement from '@/lib/session-management'

jest.mock('@/lib/session-management')

const mockSessionManagement = sessionManagement as jest.Mocked<typeof sessionManagement>

describe('/api/sessions/[sessionId]', () => {
  const sessionId = 'session-123'
  const mockSessionDetails = {
    id: sessionId,
    table_id: 'table-123',
    restaurant_id: 'restaurant-123',
    status: 'active',
    session_token: 'token-123',
    expires_at: '2023-01-01T12:00:00Z',
    total_amount: 0,
    created_at: '2023-01-01T10:00:00Z',
    updated_at: '2023-01-01T10:00:00Z',
    table: {
      id: 'table-123',
      table_number: '5',
      restaurant_id: 'restaurant-123',
    },
    restaurant: {
      id: 'restaurant-123',
      name: 'Test Restaurant',
      slug: 'test-restaurant',
    },
    participants: [],
    orders: [],
    service_requests: [],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return session details successfully', async () => {
      mockSessionManagement.getSessionDetails.mockResolvedValue(mockSessionDetails)

      const request = createMockRequest('http://localhost:3000/api/sessions/session-123')
      const params = createMockParams({ sessionId })

      const response = await GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockSessionDetails)
      expect(mockSessionManagement.getSessionDetails).toHaveBeenCalledWith(sessionId)
    })

    it('should handle session not found error', async () => {
      mockSessionManagement.getSessionDetails.mockRejectedValue(
        new Error('Session not found')
      )

      const request = createMockRequest('http://localhost:3000/api/sessions/session-123')
      const params = createMockParams({ sessionId })

      const response = await GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Session not found')
    })

    it('should handle database connection errors', async () => {
      mockSessionManagement.getSessionDetails.mockRejectedValue(
        new Error('Database connection failed')
      )

      const request = createMockRequest('http://localhost:3000/api/sessions/session-123')
      const params = createMockParams({ sessionId })

      const response = await GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Database connection failed')
    })

    it('should handle non-Error exceptions', async () => {
      mockSessionManagement.getSessionDetails.mockRejectedValue('String error')

      const request = createMockRequest('http://localhost:3000/api/sessions/session-123')
      const params = createMockParams({ sessionId })

      const response = await GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to get session')
    })
  })

  describe('DELETE', () => {
    it('should end session with default reason', async () => {
      mockSessionManagement.endSession.mockResolvedValue()

      const request = createMockRequest('http://localhost:3000/api/sessions/session-123', {
        method: 'DELETE',
      })
      const params = createMockParams({ sessionId })

      const response = await DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Session ended successfully')
      expect(mockSessionManagement.endSession).toHaveBeenCalledWith(
        sessionId,
        'manual_close'
      )
    })

    it('should end session with custom reason', async () => {
      mockSessionManagement.endSession.mockResolvedValue()

      const request = createMockRequest(
        'http://localhost:3000/api/sessions/session-123?reason=customer_left',
        { method: 'DELETE' }
      )
      const params = createMockParams({ sessionId })

      const response = await DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockSessionManagement.endSession).toHaveBeenCalledWith(
        sessionId,
        'customer_left'
      )
    })

    it('should handle invalid reason parameter', async () => {
      mockSessionManagement.endSession.mockResolvedValue()

      const request = createMockRequest(
        'http://localhost:3000/api/sessions/session-123?reason=invalid_reason',
        { method: 'DELETE' }
      )
      const params = createMockParams({ sessionId })

      const response = await DELETE(request, { params })

      expect(mockSessionManagement.endSession).toHaveBeenCalledWith(
        sessionId,
        'manual_close' // Should fallback to default
      )
    })

    it('should handle session end failure', async () => {
      mockSessionManagement.endSession.mockRejectedValue(
        new Error('Failed to end session')
      )

      const request = createMockRequest('http://localhost:3000/api/sessions/session-123', {
        method: 'DELETE',
      })
      const params = createMockParams({ sessionId })

      const response = await DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to end session')
    })

    it('should handle all valid reason types', async () => {
      const validReasons = ['customer_left', 'manual_close', 'new_customers', 'staff_reset']
      mockSessionManagement.endSession.mockResolvedValue()

      for (const reason of validReasons) {
        const request = createMockRequest(
          `http://localhost:3000/api/sessions/session-123?reason=${reason}`,
          { method: 'DELETE' }
        )
        const params = createMockParams({ sessionId })

        await DELETE(request, { params })

        expect(mockSessionManagement.endSession).toHaveBeenCalledWith(
          sessionId,
          reason
        )
      }
    })

    it('should handle database transaction errors', async () => {
      mockSessionManagement.endSession.mockRejectedValue(
        new Error('Transaction failed')
      )

      const request = createMockRequest('http://localhost:3000/api/sessions/session-123', {
        method: 'DELETE',
      })
      const params = createMockParams({ sessionId })

      const response = await DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Transaction failed')
    })

    it('should handle non-Error exceptions in delete', async () => {
      mockSessionManagement.endSession.mockRejectedValue('String error')

      const request = createMockRequest('http://localhost:3000/api/sessions/session-123', {
        method: 'DELETE',
      })
      const params = createMockParams({ sessionId })

      const response = await DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to end session')
    })
  })

  describe('Error Handling', () => {
    it('should log errors to console', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      
      mockSessionManagement.getSessionDetails.mockRejectedValue(
        new Error('Test error')
      )

      const request = createMockRequest('http://localhost:3000/api/sessions/session-123')
      const params = createMockParams({ sessionId })

      await GET(request, { params })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Get session error:',
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })
  })
})