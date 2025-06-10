import { render, screen } from '@testing-library/react'

// Mock component
const SessionTimer = ({ expiresAt }: { expiresAt: string }) => {
  const calculateTimeRemaining = (expiresAt: string): string => {
    const now = new Date()
    const expires = new Date(expiresAt)
    const diffMs = expires.getTime() - now.getTime()

    if (diffMs <= 0 || isNaN(diffMs)) {
      return 'Expired'
    }

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m remaining`
    }
    return `${diffMinutes}m remaining`
  }

  const timeRemaining = calculateTimeRemaining(expiresAt)
  
  return <div>{timeRemaining}</div>
}

describe('SessionTimer', () => {
  it('should display time remaining correctly', () => {
    const futureTime = new Date(Date.now() + 90 * 60 * 1000).toISOString() // 90 minutes later
    
    render(<SessionTimer expiresAt={futureTime} />)
    
    expect(screen.getByText(/remaining/i)).toBeInTheDocument()
  })

  it('should display hours and minutes when time exceeds 60 minutes', () => {
    const futureTime = new Date(Date.now() + 125 * 60 * 1000).toISOString() // 2h 5m later
    
    render(<SessionTimer expiresAt={futureTime} />)
    
    expect(screen.getByText(/2h \d+m remaining/i)).toBeInTheDocument()
  })

  it('should show expired status when time has passed', () => {
    const pastTime = new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
    
    render(<SessionTimer expiresAt={pastTime} />)
    
    expect(screen.getByText(/expired/i)).toBeInTheDocument()
  })

  it('should handle invalid date gracefully', () => {
    render(<SessionTimer expiresAt="invalid-date" />)
    
    expect(screen.getByText(/expired/i)).toBeInTheDocument()
  })
})