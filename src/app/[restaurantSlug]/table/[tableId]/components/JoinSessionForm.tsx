// src/app/[restaurantSlug]/table/[tableId]/components/JoinSessionForm.tsx
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus } from 'lucide-react'

interface JoinSessionFormProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onJoinSession: (displayName: string) => Promise<any>
}

export function JoinSessionForm({ onJoinSession }: JoinSessionFormProps) {
    const [displayName, setDisplayName] = useState('')
    const [isJoining, setIsJoining] = useState(false)

    const handleJoinSession = async () => {
        if (!displayName.trim()) return

        try {
            setIsJoining(true)
            await onJoinSession(displayName.trim())
            setDisplayName('')
        } catch (error) {
            console.error('Failed to join session:', error)
        } finally {
            setIsJoining(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleJoinSession()
        }
    }

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Join Your Table
                </CardTitle>
                <CardDescription>
                    Enter your name to start ordering with your group
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="displayName">Your Name</Label>
                    <Input
                        id="displayName"
                        placeholder="Enter your name..."
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isJoining}
                        className="mt-1"
                    />
                </div>
                <Button
                    onClick={handleJoinSession}
                    disabled={!displayName.trim() || isJoining}
                    className="w-full"
                >
                    {isJoining ? 'Joining...' : 'Join Table'}
                </Button>
            </CardContent>
        </Card>
    )
}