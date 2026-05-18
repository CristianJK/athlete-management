import api from './axios';

export interface NotificationItem {
  id: number;
  user_id: number;
  title: string;
  message: string;
  read_at?: string;
  created_at: string;
}

/**
 * Obtiene la lista de notificaciones para el usuario autenticado.
 */
export const getNotifications = async (): Promise<NotificationItem[]> => {
  const response = await api.get<NotificationItem[]>('/notifications');
  return response.data;
};

/**
 * Marca una notificación específica como leída.
 */
export const markAsRead = async (id: number): Promise<NotificationItem> => {
  const response = await api.post<NotificationItem>(`/notifications/${id}/read`);
  return response.data;
};

/**
 * Marca todas las notificaciones del usuario como leídas.
 */
export const markAllAsRead = async (): Promise<NotificationItem[]> => {
  const response = await api.post<NotificationItem[]>('/notifications/mark-all-read');
  return response.data;
};
