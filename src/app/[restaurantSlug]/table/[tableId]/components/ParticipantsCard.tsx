// src/app/[restaurantSlug]/table/[tableId]/components/ParticipantsCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'
import type { SessionParticipant } from '@/lib/supabase'

interface ParticipantsCardProps {
    participants: SessionParticipant[]
    currentParticipant: SessionParticipant | null
}

export function ParticipantsCard({ participants, currentParticipant }: ParticipantsCardProps) {
    if (participants.length === 0) {
        return null
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        People at Your Table
                    </div>
                    <Badge variant="secondary" className="ml-2">
                        {participants.length}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {participants.map((participant) => (
                        <Badge
                            key={participant.id}
                            variant="secondary"
                            className="participant-badge"
                            style={{
                                backgroundColor: `${participant.color_code}20`,
                                borderColor: participant.color_code,
                                color: participant.color_code
                            }}
                        >
                            {participant.display_name}
                            {participant.id === currentParticipant?.id && ' (You)'}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}