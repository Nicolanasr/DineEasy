import { POST } from '../../cleanup/route'
import { NextRequest } from 'next/server'
import * as sessionManagement from '@/lib/session-management'

jest.mock('@/lib/session-management')

const mockSessionManagement = sessionManagement as jest.Mocked<typeof sessionManagement>

describe('/api/sessions/cleanup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST', () => {
    it('should cleanup expired sessions successfully', async () => {
      mockSessionManagement.cleanupExpiredSessions.mockResolvedValue({
        count: 5,
      })

      const request = new NextRequest('http://localhost:3000/api/sessions/cleanup', {
        method: 'POST',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.cleanedUp).toBe(5)
      expect(data.message).toBe('Cleanup completed successfully')
      expect(mockSessionManagement.cleanupExpiredSessions).toHaveBeenCalledTimes(1)
    })

    it('should handle zero expired sessions', async () => {
      mockSessionManagement.cleanupExpiredSessions.mockResolvedValue({
        count: 0,
      })

      const request = new NextRequest('http://localhost:3000/api/sessions/cleanup', {
        method: 'POST',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.cleanedUp).toBe(0)
      expect(data.message).toBe('Cleanup completed successfully')
    })

    it('should handle cleanup errors', async () => {
      mockSessionManagement.cleanupExpiredSessions.mockRejectedValue(
        new Error('Database connection failed')
      )

      const request = new NextRequest('http://localhost:3000/api/sessions/cleanup', {
        method: 'POST',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Database connection failed')
    })

    it('should handle non-Error exceptions', async () => {
      mockSessionManagement.cleanupExpiredSessions.mockRejectedValue('String error')

      const request = new NextRequest('http://localhost:3000/api/sessions/cleanup', {
        method: 'POST',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to cleanup expired sessions')
    })

    it('should log cleanup results', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
      
      mockSessionManagement.cleanupExpiredSessions.mockResolvedValue({
        count: 3,
      })

      const request = new NextRequest('http://localhost:3000/api/sessions/cleanup', {
        method: 'POST',
      })

      await POST(request)

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Cleanup completed: 3 sessions processed'
      )

      consoleLogSpy.mockRestore()
    })

    it('should log errors to console', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      
      mockSessionManagement.cleanupExpiredSessions.mockRejectedValue(
        new Error('Test error')
      )

      const request = new NextRequest('http://localhost:3000/api/sessions/cleanup', {
        method: 'POST',
      })

      await POST(request)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Cleanup error:',
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })

    it('should handle large cleanup operations', async () => {
      mockSessionManagement.cleanupExpiredSessions.mockResolvedValue({
        count: 1000,
      })

      const request = new NextRequest('http://localhost:3000/api/sessions/cleanup', {
        method: 'POST',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.cleanedUp).toBe(1000)
    })

    it('should handle permission errors', async () => {
      mockSessionManagement.cleanupExpiredSessions.mockRejectedValue(
        new Error('Insufficient permissions')
      )

      const request = new NextRequest('http://localhost:3000/api/sessions/cleanup', {
        method: 'POST',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Insufficient permissions')
    })
  })
})