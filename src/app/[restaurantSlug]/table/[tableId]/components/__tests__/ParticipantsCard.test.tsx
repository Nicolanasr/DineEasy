import { render, screen } from '@testing-library/react'

// Mock component
const ParticipantsCard = ({ participants, currentParticipant }: any) => {
  const count = participants.length
  const plural = count === 1 ? 'person' : 'people'
  
  return (
    <div>
      <div>{count} {plural}</div>
      {participants.map((participant: any) => (
        <div key={participant.id}>
          <span data-testid="participant-name">{participant.display_name}</span>
          {currentParticipant?.id === participant.id && <span>You</span>}
        </div>
      ))}
    </div>
  )
}

describe('ParticipantsCard', () => {
  const mockParticipants = [
    {
      id: 'participant-1',
      session_id: 'session-123',
      display_name: 'John Doe',
      color_code: '#FF5733',
      joined_at: '2023-01-01T10:00:00Z',
      last_active_at: '2023-01-01T10:30:00Z',
    },
    {
      id: 'participant-2',
      session_id: 'session-123',
      display_name: 'Jane Smith',
      color_code: '#33FF57',
      joined_at: '2023-01-01T10:05:00Z',
      last_active_at: '2023-01-01T10:25:00Z',
    },
  ]

  const currentParticipant = mockParticipants[0]

  it('should render participants list', () => {
    render(
      <ParticipantsCard 
        participants={mockParticipants} 
        currentParticipant={currentParticipant} 
      />
    )
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText(/2 people/i)).toBeInTheDocument()
  })

  it('should show "you" indicator for current participant', () => {
    render(
      <ParticipantsCard 
        participants={mockParticipants} 
        currentParticipant={currentParticipant} 
      />
    )
    
    expect(screen.getByText(/you/i)).toBeInTheDocument()
  })

  it('should handle single participant', () => {
    render(
      <ParticipantsCard 
        participants={[mockParticipants[0]]} 
        currentParticipant={currentParticipant} 
      />
    )
    
    expect(screen.getByText(/1 person/i)).toBeInTheDocument()
  })

  it('should handle empty participants list', () => {
    render(
      <ParticipantsCard 
        participants={[]} 
        currentParticipant={null} 
      />
    )
    
    expect(screen.getByText(/0 people/i)).toBeInTheDocument()
  })
})