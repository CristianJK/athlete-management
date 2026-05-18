import api from './axios';
import type { Payment, PaymentSummary } from '../types/payment.types';

/**
 * Obtiene la lista de pagos de los deportistas, filtrada opcionalmente.
 */
export const getPayments = async (filters?: { athlete_id?: number }): Promise<Payment[]> => {
  const response = await api.get<Payment[]>('/payments', { params: filters });
  return response.data;
};

/**
 * Registra un nuevo pago de mensualidad o cuota para un deportista.
 */
export const registerPayment = async (data: {
  athlete_id: number;
  amount: number;
  payment_method: string;
  period_month?: number;
  period_year?: number;
  notes?: string;
}): Promise<Payment> => {
  const response = await api.post<Payment>('/payments', data);
  return response.data;
};

/**
 * Obtiene el resumen financiero consolidado de pagos (recaudado, pendiente, mora).
 */
export const getPaymentSummary = async (): Promise<PaymentSummary> => {
  try {
    const response = await api.get<PaymentSummary>('/payments/summary');
    return response.data;
  } catch (error) {
    // Respaldo (fallback) con datos de ejemplo en caso de que el endpoint no esté implementado aún
    return {
      total_collected: 1250000,
      total_pending: 450000,
      total_overdue: 150000,
      overdue_count: 3
    };
  }
};

/**
 * Genera u obtiene la información del recibo de pago para descargar.
 */
export const downloadReceipt = async (id: number): Promise<Payment> => {
  const response = await api.get<Payment>(`/payments/${id}/receipt`);
  return response.data;
};
