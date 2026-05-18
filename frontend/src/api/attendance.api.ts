import api from './axios';
import type { AttendanceSession, AttendanceRecord } from '../types/attendance.types';

/**
 * Crea una nueva sesión de asistencia (por ejemplo, para generar un QR de entrenamiento).
 */
export const createSession = async (data: {
  club_id: number;
  name: string;
  qr_token: string;
  expires_at: string;
  group_name?: string;
}): Promise<AttendanceSession> => {
  const response = await api.post<AttendanceSession>('/attendance/sessions', data);
  return response.data;
};

/**
 * Obtiene los detalles de una sesión de asistencia mediante su ID.
 */
export const getSession = async (id: number): Promise<AttendanceSession> => {
  const response = await api.get<AttendanceSession>(`/attendance/sessions/${id}`);
  return response.data;
};

/**
 * Registra asistencia mediante el escaneo de un código QR.
 */
export const checkIn = async (data: {
  session_id: number;
  athlete_id: number;
  qr_token: string;
}): Promise<AttendanceRecord> => {
  const response = await api.post<AttendanceRecord>('/attendance/records', data);
  return response.data;
};

/**
 * Registra la asistencia de un deportista de forma manual (por un entrenador o admin).
 */
export const manualCheckIn = async (sessionId: number, athleteId: number): Promise<AttendanceRecord> => {
  const response = await api.post<AttendanceRecord>('/attendance/records/manual', {
    session_id: sessionId,
    athlete_id: athleteId,
  });
  return response.data;
};

/**
 * Obtiene la lista de registros de asistencia de una sesión u otros filtros.
 */
export const getRecords = async (filters?: { session_id?: number; athlete_id?: number }): Promise<AttendanceRecord[]> => {
  const response = await api.get<AttendanceRecord[]>('/attendance/records', { params: filters });
  return response.data;
};
