export type UserRole = 'admin' | 'coach' | 'athlete'

export interface User {
    id: string
    name: string
    email: string
    role: UserRole
    avatar?: string
    accessToken: string
    refreshToken: string
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
    message?: string;
}