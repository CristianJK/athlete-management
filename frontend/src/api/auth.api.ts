import api from "./axios";
import type { AuthResponse, User } from '../types/auth.types'

export const loginApi = async (credentials: { email: string; password: string }) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials)
    return response.data
}

export const logoutApi = async () => {
    const response = await api.post('/auth/logout')
    return response.data
}


export const meApi = async (): Promise<{ data: User }> => {
    const response = await api.get('/auth/me')
    return response.data
}