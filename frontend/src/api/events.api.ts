import api from './axios';
import type { ClubEvent, RSVPStatus } from '../types/event.types';

/**
 * Obtiene la lista de todos los eventos (entrenamientos, torneos, reuniones) del club.
 */
export const getEvents = async (filters?: Record<string, any>): Promise<ClubEvent[]> => {
  const response = await api.get<ClubEvent[]>('/events', { params: filters });
  return response.data;
};

/**
 * Obtiene los detalles de un evento particular mediante su ID.
 */
export const getEvent = async (id: number): Promise<ClubEvent> => {
  const response = await api.get<ClubEvent>(`/events/${id}`);
  return response.data;
};

/**
 * Crea un nuevo evento para el club (entrenamiento, torneo, etc.).
 */
export const createEvent = async (data: {
  club_id: number;
  title: string;
  description?: string;
  starts_at: string;
  ends_at: string;
  location?: string;
  type: 'training' | 'tournament' | 'meeting' | 'other';
  status?: 'upcoming' | 'ongoing' | 'finished' | 'cancelled';
  max_attendees?: number;
}): Promise<ClubEvent> => {
  const response = await api.post<ClubEvent>('/events', data);
  return response.data;
};

/**
 * Actualiza la información de un evento existente.
 */
export const updateEvent = async (id: number, data: Partial<ClubEvent>): Promise<ClubEvent> => {
  const response = await api.put<ClubEvent>(`/events/${id}`, data);
  return response.data;
};

/**
 * Confirma o cancela la asistencia (RSVP) a un evento para un deportista.
 */
export const rsvp = async (eventId: number, status: RSVPStatus, athleteId?: number): Promise<any> => {
  const response = await api.post('/events/attendees', {
    event_id: eventId,
    status: status,
    athlete_id: athleteId,
  });
  return response.data;
};
