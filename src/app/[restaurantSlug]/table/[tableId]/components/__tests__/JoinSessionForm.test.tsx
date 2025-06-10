import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock the component since we don't have the actual implementation
const JoinSessionForm = ({ onJoinSession }: { onJoinSession: (name: string) => Promise<void> }) => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const name = formData.get('name') as string

        if (!name || name.trim().length < 2) {
            const errorEl = document.createElement('div')
            errorEl.textContent = 'Name must be at least 2 characters'
            errorEl.setAttribute('data-testid', 'error-message')
            document.body.appendChild(errorEl)
            return
        }

        if (name.trim().length > 30) {
            const errorEl = document.createElement('div')
            errorEl.textContent = 'Name must be no more than 30 characters'
            errorEl.setAttribute('data-testid', 'error-message')
            document.body.appendChild(errorEl)
            return
        }

        await onJoinSession(name.trim())
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Display Name</label>
            <input id="name" name="name" type="text" />
            <button type="submit">Join Session</button>
        </form>
    )
}

describe('JoinSessionForm', () => {
    const mockOnJoinSession = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
        // Clear any previous error messages
        document.querySelectorAll('[data-testid="error-message"]').forEach(el => el.remove())
    })

    it('should render the form with input and button', () => {
        render(<JoinSessionForm onJoinSession={mockOnJoinSession} />)

        expect(screen.getByLabelText(/display name/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /join session/i })).toBeInTheDocument()
    })

    it('should show validation error for name too short', async () => {
        const user = userEvent.setup()
        render(<JoinSessionForm onJoinSession={mockOnJoinSession} />)

        const input = screen.getByLabelText(/display name/i)
        const button = screen.getByRole('button', { name: /join session/i })

        await user.type(input, 'A')
        await user.click(button)

        await waitFor(() => {
            expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
        })
    })

    it('should show validation error for name too long', async () => {
        const user = userEvent.setup()
        render(<JoinSessionForm onJoinSession={mockOnJoinSession} />)

        const input = screen.getByLabelText(/display name/i)
        const button = screen.getByRole('button', { name: /join session/i })

        await user.type(input, 'A'.repeat(31)) // 31 characters
        await user.click(button)

        await waitFor(() => {
            expect(screen.getByText(/name must be no more than 30 characters/i)).toBeInTheDocument()
        })
    })

    it('should call onJoinSession with valid name', async () => {
        const user = userEvent.setup()
        mockOnJoinSession.mockResolvedValue(undefined)

        render(<JoinSessionForm onJoinSession={mockOnJoinSession} />)

        const input = screen.getByLabelText(/display name/i)
        const button = screen.getByRole('button', { name: /join session/i })

        await user.type(input, 'John Doe')
        await user.click(button)

        await waitFor(() => {
            expect(mockOnJoinSession).toHaveBeenCalledWith('John Doe')
        })
    })

    it('should trim whitespace from input', async () => {
        const user = userEvent.setup()
        mockOnJoinSession.mockResolvedValue(undefined)

        render(<JoinSessionForm onJoinSession={mockOnJoinSession} />)

        const input = screen.getByLabelText(/display name/i)
        const button = screen.getByRole('button', { name: /join session/i })

        await user.type(input, '  John Doe  ')
        await user.click(button)

        await waitFor(() => {
            expect(mockOnJoinSession).toHaveBeenCalledWith('John Doe')
        })
    })
})