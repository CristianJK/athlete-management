export interface AttendanceSession {
    id: number
    name: string
    qr_token: string
    expires_at: string
    group_name: string
    checked_in_count: number
}

export type CheckInMethod = 'qr' | 'manual'

export interface AttendanceRecord {
    id: number
    athlete_id: number
    athlete_name: string
    session_name: string
    checked_in_at: string
    method: CheckInMethod
}