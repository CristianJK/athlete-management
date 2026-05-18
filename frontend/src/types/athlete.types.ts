export type AthleteStatus = 'active' | 'inactive' | 'suspended'

export interface EmergencyContact {

    name: string
    phone: string
    relationship: string
}

export interface Athlete {
    id: number
    name: string
    document_number: string
    document_type: string
    birthdate: string
    gender: string
    phone: string
    email: string
    address: string
    sport: string
    group_name: string
    status: AthleteStatus
    joined_at: string
    emergency_contact: EmergencyContact
    habeas_data_accepted: boolean
    habeas_data_accepted_at?: string
}

export type CreateAthleteDto = Omit<Athlete, 'id' | 'joined_at' | 'habeas_data_accepted' | 'habeas_data_accepted_at'>