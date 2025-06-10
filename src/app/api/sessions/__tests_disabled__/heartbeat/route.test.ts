import { POST } from '../../heartbeat/route'
import { NextRequest } from 'next/server'
import * as sessionManagement from '@/lib/session-management'

jest.mock('@/lib/session-management')

const mockSessionManagement = sessionManagement as jest.Mocked<typeof sessionManagement>

describe('/api/sessions/heartbeat', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST', () => {
    it('should update participant activity successfully', async () => {
      mockSessionManagement.updateParticipantActivity.mockResolvedValue()

      const request = new NextRequest('http://localhost:3000/api/sessions/heartbeat', {
        method: 'POST',
        body: JSON.stringify({
          participantId: 'participant-123',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Activity updated successfully')
      expect(mockSessionManagement.updateParticipantActivity).toHaveBeenCalledWith(
        'participant-123'
      )
    })

    it('should handle missing participant ID', async () => {
      const request = new NextRequest('http://localhost:3000/api/sessions/heartbeat', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Participant ID is required')
      expect(mockSessionManagement.updateParticipantActivity).not.toHaveBeenCalled()
    })

    it('should handle empty participant ID', async () => {
      const request = new NextRequest('http://localhost:3000/api/sessions/heartbeat', {
        method: 'POST',
        body: JSON.stringify({
          participantId: '',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Participant ID is required')
    })

    it('should handle null participant ID', async () => {
      const request = new NextRequest('http://localhost:3000/api/sessions/heartbeat', {
        method: 'POST',
        body: JSON.stringify({
          participantId: null,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Participant ID is required')
    })

    it('should handle invalid JSON body', async () => {
      const request = new NextRequest('http://localhost:3000/api/sessions/heartbeat', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request body')
    })

    it('should handle missing request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/sessions/heartbeat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request body')
    })

    it('should handle participant not found error', async () => {
      mockSessionManagement.updateParticipantActivity.mockRejectedValue(
        new Error('Participant not found')
      )

      const request = new NextRequest('http://localhost:3000/api/sessions/heartbeat', {
        method: 'POST',
        body: JSON.stringify({
          participantId: 'nonexistent-participant',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Participant not found')
    })

    it('should handle database connection errors', async () => {
      mockSessionManagement.updateParticipantActivity.mockRejectedValue(
        new Error('Database connection failed')
      )

      const request = new NextRequest('http://localhost:3000/api/sessions/heartbeat', {
        method: 'POST',
        body: JSON.stringify({
          participantId: 'participant-123',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Database connection failed')
    })

    it('should handle non-Error exceptions', async () => {
      mockSessionManagement.updateParticipantActivity.mockRejectedValue('String error')

      const request = new NextRequest('http://localhost:3000/api/sessions/heartbeat', {
        method: 'POST',
        body: JSON.stringify({
          participantId: 'participant-123',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to update activity')
    })

    it('should log errors to console', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      
      mockSessionManagement.updateParticipantActivity.mockRejectedValue(
        new Error('Test error')
      )

      const request = new NextRequest('http://localhost:3000/api/sessions/heartbeat', {
        method: 'POST',
        body: JSON.stringify({
          participantId: 'participant-123',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      await POST(request)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Heartbeat error:',
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })

    it('should handle UUID validation', async () => {
      mockSessionManagement.updateParticipantActivity.mockResolvedValue()

      const validUuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
      
      const request = new NextRequest('http://localhost:3000/api/sessions/heartbeat', {
        method: 'POST',
        body: JSON.stringify({
          participantId: validUuid,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockSessionManagement.updateParticipantActivity).toHaveBeenCalledWith(validUuid)
    })

    it('should handle concurrent heartbeat requests', async () => {
      mockSessionManagement.updateParticipantActivity.mockResolvedValue()

      const requests = Array.from({ length: 5 }, () =>
        new NextRequest('http://localhost:3000/api/sessions/heartbeat', {
          method: 'POST',
          body: JSON.stringify({
            participantId: 'participant-123',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )

      const responses = await Promise.all(requests.map(req => POST(req)))

      responses.forEach(response => {
        expect(response.status).toBe(200)
      })

      expect(mockSessionManagement.updateParticipantActivity).toHaveBeenCalledTimes(5)
    })
  })
})