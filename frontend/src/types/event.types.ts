export type EventType = 'training' | 'tournament' | 'meeting' | 'other'
export type EventStatus = 'upcoming' | 'ongoing' | 'finished' | 'cancelled'
export type RSVPStatus = 'confirmed' | 'cancelled' | 'pending'

export interface ClubEvent {
    id: number
    title: string
    description: string
    type: EventType
    location: string
    starts_at: string
    ends_at: string
    max_attendees?: number
    status: EventStatus
    attendees_count: number
    my_rsvp?: RSVPStatus
}