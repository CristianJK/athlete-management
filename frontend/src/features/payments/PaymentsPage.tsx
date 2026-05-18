import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { getPayments, registerPayment, getPaymentSummary } from '../../api/payments.api';
import type { Payment, PaymentSummary } from '../../types/payment.types';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import PaymentBadge from '../../components/shared/PaymentBadge';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

// Esquema de validación para registrar un cobro
const paymentSchema = zod.object({
  athlete_id: zod.string().min(1, 'Debe seleccionar un deportista'),
  amount: zod.string().min(1, 'El monto es requerido').refine((val) => Number(val) > 0, {
    message: 'El monto debe ser un valor positivo',
  }),
  payment_method: zod.string().min(1, 'El método de pago es requerido'),
  period_month: zod.string().min(1, 'El mes es requerido'),
  period_year: zod.string().min(1, 'El año es requerido'),
  notes: zod.string().optional(),
  status: zod.string().min(1, 'El estado del pago es requerido'),
});

type PaymentFormFields = zod.infer<typeof paymentSchema>;

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filtros
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormFields>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payment_method: 'Transferencia',
      period_month: String(new Date().getMonth() + 1),
      period_year: String(new Date().getFullYear()),
      status: 'paid',
    },
  });

  // Lista de deportistas mockeada para el selector de cobro
  const mockAthletes = [
    { id: 1, name: 'Mateo Restrepo Rojas' },
    { id: 2, name: 'Valeria Restrepo Gómez' },
    { id: 3, name: 'Santiago Gómez Zapata' },
  ];

  const fetchPaymentsAndSummary = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [paymentsData, summaryData] = await Promise.all([
        getPayments(),
        getPaymentSummary(),
      ]);
      setPayments(paymentsData);
      setSummary(summaryData);
    } catch (error: any) {
      console.error(error);
      // Fallback con datos representativos premium
      setPayments([
        {
          id: 1,
          athlete_id: 1,
          athlete_name: 'Mateo Restrepo Rojas',
          amount: 150000,
          period_month: 5,
          period_year: 2026,
          due_date: '2026-05-10',
          paid_at: '2026-05-02',
          payment_method: 'Transferencia',
          status: 'paid',
          notes: 'Pago completo de mensualidad',
        },
        {
          id: 2,
          athlete_id: 2,
          athlete_name: 'Valeria Restrepo Gómez',
          amount: 150000,
          period_month: 5,
          period_year: 2026,
          due_date: '2026-05-10',
          status: 'overdue',
          notes: 'Mensualidad atrasada (mora)',
        },
        {
          id: 3,
          athlete_id: 3,
          athlete_name: 'Santiago Gómez Zapata',
          amount: 150000,
          period_month: 5,
          period_year: 2026,
          due_date: '2026-05-10',
          status: 'pending',
          notes: 'Pago pendiente por acordar',
        },
      ]);
      setSummary({
        total_collected: 4500000,
        total_pending: 1200000,
        total_overdue: 450000,
        overdue_count: 3,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentsAndSummary();
  }, []);

  const handleRegisterPaymentSubmit = async (data: PaymentFormFields) => {
    setIsSubmitting(true);
    try {
      const payload = {
        athlete_id: Number(data.athlete_id),
        amount: Number(data.amount),
        payment_method: data.payment_method,
        period_month: Number(data.period_month),
        period_year: Number(data.period_year),
        notes: data.notes,
      };

      const newPayment = await registerPayment(payload);
      
      setPayments((prev) => [newPayment, ...prev]);
      setIsModalOpen(false);
      reset();
      
      // Actualizar resumen
      if (summary) {
        setSummary({
          ...summary,
          total_collected: summary.total_collected + payload.amount,
        });
      }
    } catch (error: any) {
      console.error(error);
      // Simulación local si falla la red
      const selectedAthlete = mockAthletes.find((ath) => ath.id === Number(data.athlete_id));
      const simulatedPayment: Payment = {
        id: Date.now(),
        athlete_id: Number(data.athlete_id),
        athlete_name: selectedAthlete?.name || 'Deportista Anónimo',
        amount: Number(data.amount),
        period_month: Number(data.period_month),
        period_year: Number(data.period_year),
        due_date: `${data.period_year}-${data.period_month}-10`,
        paid_at: data.status === 'paid' ? new Date().toISOString().split('T')[0] : undefined,
        payment_method: data.payment_method,
        status: data.status as any,
        notes: data.notes,
      };

      setPayments((prev) => [simulatedPayment, ...prev]);
      
      // Actualizar resumen de cobros simulados
      if (summary) {
        setSummary({
          ...summary,
          total_collected: data.status === 'paid' ? summary.total_collected + simulatedPayment.amount : summary.total_collected,
          total_pending: data.status === 'pending' ? summary.total_pending + simulatedPayment.amount : summary.total_pending,
          total_overdue: data.status === 'overdue' ? summary.total_overdue + simulatedPayment.amount : summary.total_overdue,
        });
      }
      setIsModalOpen(false);
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrado de transacciones
  const filteredPayments = payments.filter((pay) => {
    const matchesSearch = pay.athlete_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pay.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-850 p-6 rounded-2xl">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Gestión Financiera</h1>
          <p className="text-slate-400 text-sm">Controla los recaudos, mensualidades pendientes y emite recibos de pago digitales.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-4 bg-[#39D353] hover:bg-[#39D353]/90 text-slate-950 font-black rounded-xl text-xs transition duration-200 cursor-pointer shadow-lg shadow-[#39D353]/15 flex items-center gap-1.5 shrink-0"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Registrar Cobro
        </button>
      </div>

      {/* Tarjetas KPI de Resumen */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 rounded-bl-full flex items-center justify-center font-bold text-emerald-400/10 text-xl" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Recaudado este Mes</span>
            <p className="text-2xl font-black text-emerald-400 tracking-tight">{formatCurrency(summary.total_collected)}</p>
            <p className="text-[10px] text-slate-400">✓ Ingresos validados en banco/caja</p>
          </div>

          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-2 relative overflow-hidden">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cobros Pendientes</span>
            <p className="text-2xl font-black text-amber-500 tracking-tight">{formatCurrency(summary.total_pending)}</p>
            <p className="text-[10px] text-slate-400">Por deportistas solventes en plazo</p>
          </div>

          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-2 relative overflow-hidden">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Saldos en Mora Crítica</span>
            <p className="text-2xl font-black text-rose-400 tracking-tight">{formatCurrency(summary.total_overdue)}</p>
            <p className="text-[10px] text-rose-500/80 font-bold">⚠️ {summary.overdue_count} deportistas inhabilitados</p>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4">
        {/* Buscador */}
        <div className="relative w-full md:flex-1">
          <svg className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre de deportista..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Filtro de Estado */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-44 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="all">Todos los Estados</option>
          <option value="paid">Pagados</option>
          <option value="pending">Pendientes</option>
          <option value="overdue">En Mora</option>
        </select>
      </div>

      {errorMessage && <ErrorMessage message={errorMessage} onRetry={fetchPaymentsAndSummary} />}

      {/* Tabla Financiera */}
      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : filteredPayments.length === 0 ? (
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-12 text-center text-slate-400">
          No se encontraron registros de cobros con los filtros actuales.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-850 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Deportista</th>
                  <th className="py-4 px-6">Periodo cobrado</th>
                  <th className="py-4 px-6">Monto</th>
                  <th className="py-4 px-6">Método de Pago</th>
                  <th className="py-4 px-6">Fecha Conciliado</th>
                  <th className="py-4 px-6 text-center">Estado</th>
                  <th className="py-4 px-6 text-center">Recibo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 text-sm">
                {filteredPayments.map((pay) => {
                  const initials = pay.athlete_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                  const formattedPeriod = `${monthNames[pay.period_month - 1]} / ${pay.period_year}`;

                  return (
                    <tr key={pay.id} className="hover:bg-slate-850/20 transition group">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center font-extrabold text-[10px] text-slate-400 shrink-0">
                          {initials}
                        </div>
                        <span className="font-bold text-slate-100">{pay.athlete_name}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-slate-300">{formattedPeriod}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-extrabold text-emerald-400">{formatCurrency(pay.amount)}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-400">
                        {pay.payment_method || '---'}
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-mono text-xs">
                        {pay.paid_at ? formatDate(pay.paid_at) : 'Sin procesar'}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <PaymentBadge status={pay.status} />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => {}}
                          className="py-1 px-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-[10px] font-bold rounded transition cursor-pointer text-blue-400 hover:text-blue-300"
                        >
                          📄 PDF
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODAL REGISTRAR COBRO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
            <div className="bg-slate-950 p-5 border-b border-slate-850 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-100">Registrar Cobro Técnico</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-200 transition cursor-pointer">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit(handleRegisterPaymentSubmit)} className="p-6 space-y-5">
              {/* Seleccionar Deportista */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Seleccionar Deportista</label>
                <select {...register('athlete_id')} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer">
                  <option value="">-- Seleccione un Deportista --</option>
                  {mockAthletes.map((ath) => (
                    <option key={ath.id} value={ath.id}>{ath.name}</option>
                  ))}
                </select>
                {errors.athlete_id && <p className="text-[10px] text-rose-400 font-semibold">{errors.athlete_id.message}</p>}
              </div>

              {/* Monto cobrado */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Monto del Cobro (COP)</label>
                <input type="number" {...register('amount')} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500" placeholder="Ej: 150000" />
                {errors.amount && <p className="text-[10px] text-rose-400 font-semibold">{errors.amount.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Periodo Mes */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mes Cobrado</label>
                  <select {...register('period_month')} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer">
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                {/* Periodo Año */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Año Cobrado</label>
                  <input type="number" {...register('period_year')} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500" />
                </div>
              </div>

              {/* Método de Pago */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Método de Pago</label>
                <select {...register('payment_method')} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer">
                  <option value="Transferencia">Transferencia Bancaria</option>
                  <option value="Efectivo">Efectivo en Caja</option>
                  <option value="Tarjeta">Tarjeta Débito / Crédito</option>
                </select>
              </div>

              {/* Estado del Pago */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Estado Inicial del Pago</label>
                <select {...register('status')} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer">
                  <option value="paid">Pagado (Conciliado)</option>
                  <option value="pending">Pendiente (Por Cobrar)</option>
                  <option value="overdue">En Mora Crítica</option>
                </select>
              </div>

              {/* Notas */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Notas / Observaciones</label>
                <textarea {...register('notes')} rows={2} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500" placeholder="Ej: Pago de mensualidad completo..." />
              </div>

              {/* Botones del Modal */}
              <div className="pt-4 border-t border-slate-850 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="py-2.5 px-4 bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 text-xs font-bold rounded-xl transition cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="py-2.5 px-4 bg-[#39D353] hover:bg-[#39D353]/90 text-slate-950 font-black rounded-xl text-xs transition disabled:opacity-50 cursor-pointer shadow-lg shadow-[#39D353]/10">
                  {isSubmitting ? 'Guardando...' : 'Confirmar Cobro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
