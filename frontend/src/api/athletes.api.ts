import api from './axios';
import type { Athlete, AthleteStatus, CreateAthleteDto } from '../types/athlete.types';

/**
 * Obtiene la lista de todos los deportistas.
 * Opcionalmente se pueden pasar filtros (por ejemplo: búsqueda por nombre, grupo, estado, etc.)
 * que se enviarán como parámetros de consulta (query params).
 */
export const getAthletes = async (filters?: Record<string, any>): Promise<Athlete[]> => {
  const response = await api.get<Athlete[]>('/athletes', { params: filters });
  return response.data;
};

/**
 * Obtiene los detalles de un deportista específico a través de su ID.
 */
export const getAthlete = async (id: number): Promise<Athlete> => {
  const response = await api.get<Athlete>(`/athletes/${id}`);
  return response.data;
};

/**
 * Registra un nuevo deportista en el sistema.
 * Recibe un objeto con los datos del deportista (excluyendo id, fecha de ingreso, etc.)
 */
export const createAthlete = async (data: CreateAthleteDto): Promise<Athlete> => {
  const response = await api.post<Athlete>('/athletes', data);
  return response.data;
};

/**
 * Actualiza la información de un deportista existente.
 * Recibe el ID del deportista y un objeto con los datos modificados.
 */
export const updateAthlete = async (id: number, data: Partial<CreateAthleteDto>): Promise<Athlete> => {
  const response = await api.put<Athlete>(`/athletes/${id}`, data);
  return response.data;
};

/**
 * Cambia el estado de un deportista (por ejemplo, de "active" a "suspended" o "inactive").
 */
export const changeAthleteStatus = async (id: number, status: AthleteStatus): Promise<Athlete> => {
  const response = await api.post<Athlete>(`/athletes/${id}/change-status`, { status });
  return response.data;
};
