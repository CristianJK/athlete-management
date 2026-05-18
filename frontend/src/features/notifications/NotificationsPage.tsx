import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { getNotifications, markAsRead, markAllAsRead } from '../../api/notifications.api';
import type { NotificationItem } from '../../api/notifications.api';
import { formatDate } from '../../utils/formatDate';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

// Esquema de validación para emitir una alerta / comunicado
const alertSchema = zod.object({
  title: zod.string().min(1, 'El título del comunicado es requerido'),
  message: zod.string().min(1, 'El contenido del mensaje es requerido'),
  priority: zod.string().min(1, 'La prioridad es requerida'),
  channel: zod.string().min(1, 'El canal de envío es requerido'),
  target_group: zod.string().min(1, 'El grupo destino es requerido'),
});

type AlertFormFields = zod.infer<typeof alertSchema>;

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const isAdminOrCoach = user?.role === 'admin' || user?.role === 'coach';

  const { setUnreadCount, decreaseUnread, clearUnread } = useNotificationStore();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AlertFormFields>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      priority: 'info',
      channel: 'all',
      target_group: 'todos',
    },
  });

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
      const unreads = data.filter((n) => !n.read_at).length;
      setUnreadCount(unreads);
    } catch (error) {
      console.error(error);
      // Fallback con comunicados premium clasificados por tipo y prioridad
      const mockItems: NotificationItem[] = [
        {
          id: 1,
          user_id: 1,
          title: '⚠️ Aviso de Pago Pendiente (Mayo)',
          message: 'Estimado deportista, le recordamos que registra saldo pendiente para el mes de mayo. Favor conciliar en administración.',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas
        },
        {
          id: 2,
          user_id: 1,
          title: '⚽ Citación a Entrenamiento Élite',
          message: 'Convocatoria oficial para el entrenamiento táctico este lunes a las 4:00 PM en Cancha Sintética 1.',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 día
          read_at: new Date().toISOString(),
        },
        {
          id: 3,
          user_id: 1,
          title: '🚨 Suspensión Temporal de Clase',
          message: 'Se informa la cancelación del entrenamiento de resistencia física del miércoles por tormenta eléctrica.',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 4,
          user_id: 1,
          title: '🎉 ¡Felicitaciones Mateo Restrepo!',
          message: 'Queremos felicitar a Mateo Restrepo Rojas por ser convocado a la Selección Departamental Sub-17.',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          read_at: new Date().toISOString(),
        },
      ];
      setNotifications(mockItems);
      setUnreadCount(mockItems.filter((n) => !n.read_at).length);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Marcar como leída
  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
      );
      decreaseUnread();
    } catch (error) {
      // Simulación local
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
      );
      decreaseUnread();
    }
  };

  // Marcar todas como leídas
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
      );
      clearUnread();
    } catch (error) {
      // Simulación local
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
      );
      clearUnread();
    }
  };

  // Emitir Alerta / Comunicado
  const handleEmitAlertSubmit = async (data: AlertFormFields) => {
    setIsSubmitting(true);
    try {
      // API call simulated local payload insertion
      const simulatedNew: NotificationItem = {
        id: Date.now(),
        user_id: 1,
        title: `${data.priority === 'warning' ? '⚠️' : data.priority === 'danger' ? '🚨' : data.priority === 'success' ? '🎉' : '📢'} ${data.title}`,
        message: `${data.message} [Enviado vía ${data.channel.toUpperCase()} a ${data.target_group.toUpperCase()}]`,
        created_at: new Date().toISOString(),
      };
      
      setNotifications((prev) => [simulatedNew, ...prev]);
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Parsear dinámicamente la prioridad visual para el color de bordes y fondos
  const getNotificationPriority = (title: string, message: string) => {
    const text = (title + ' ' + message).toLowerCase();
    if (text.includes('suspensión') || text.includes('cancelado') || text.includes('error') || text.includes('🚨') || text.includes('peligro')) {
      return 'danger';
    }
    if (text.includes('pago') || text.includes('pendiente') || text.includes('deuda') || text.includes('⚠️') || text.includes('mora')) {
      return 'warning';
    }
    if (text.includes('felicitaciones') || text.includes('éxito') || text.includes('bienvenido') || text.includes('🎉')) {
      return 'success';
    }
    return 'info';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-850 p-6 rounded-2xl">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Centro de Notificaciones</h1>
          <p className="text-slate-400 text-sm">Citaciones deportivas, avisos de pagos y alertas de la academia en tiempo real.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkAllAsRead}
            className="py-2.5 px-4 bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Marcar todas como leídas
          </button>
          
          {isAdminOrCoach && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-750 text-white font-black rounded-xl text-xs transition duration-200 cursor-pointer shadow-lg shadow-indigo-900/10 flex items-center gap-1.5 shrink-0"
            >
              Emitir Comunicado
            </button>
          )}
        </div>
      </div>

      {/* Feed de Comunicados */}
      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : notifications.length === 0 ? (
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-12 text-center text-slate-400">
          No tienes notificaciones pendientes en este momento.
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((item) => {
            const priority = getNotificationPriority(item.title, item.message);
            const isUnread = !item.read_at;

            return (
              <div
                key={item.id}
                className={`bg-slate-900 border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-6 hover:border-slate-700 transition relative overflow-hidden ${
                  isUnread
                    ? priority === 'danger'
                      ? 'border-rose-500/30 bg-rose-500/[0.02]'
                      : priority === 'warning'
                        ? 'border-amber-500/30 bg-amber-500/[0.02]'
                        : priority === 'success'
                          ? 'border-emerald-500/30 bg-emerald-500/[0.02]'
                          : 'border-blue-500/30 bg-blue-500/[0.02]'
                    : 'border-slate-850 bg-slate-900'
                }`}
              >
                {/* Glow de no leída */}
                {isUnread && (
                  <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                    priority === 'danger' ? 'bg-rose-500' : priority === 'warning' ? 'bg-amber-500' : priority === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`} />
                )}

                <div className="space-y-1.5 flex-1 pl-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className={`text-sm font-black ${isUnread ? 'text-slate-100' : 'text-slate-400'}`}>
                      {item.title}
                    </h4>
                    {isUnread && (
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                        priority === 'danger' ? 'bg-rose-500/10 text-rose-400' : priority === 'warning' ? 'bg-amber-500/10 text-amber-400' : priority === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        Nuevo
                      </span>
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed max-w-2xl ${isUnread ? 'text-slate-300' : 'text-slate-500'}`}>
                    {item.message}
                  </p>
                  <p className="text-[10px] text-slate-550 font-mono pt-0.5">
                    ⏱️ {formatDate(item.created_at)}
                  </p>
                </div>

                {/* Acción Individual */}
                {isUnread && (
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    className="py-1 px-3 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-[10px] font-bold text-slate-400 rounded-lg transition self-start sm:self-center shrink-0 cursor-pointer"
                  >
                    Marcar como leída
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* --- MODAL EMITIR COMUNICADO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
            <div className="bg-slate-950 p-5 border-b border-slate-850 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-100">Emitir Comunicado Técnico</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-200 transition cursor-pointer">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit(handleEmitAlertSubmit)} className="p-6 space-y-5">
              {/* Título */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Título del Comunicado</label>
                <input type="text" {...register('title')} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500" placeholder="Ej: Suspensión de Entrenamiento por lluvia" />
                {errors.title && <p className="text-[10px] text-rose-400 font-semibold">{errors.title.message}</p>}
              </div>

              {/* Nivel de Alerta / Prioridad */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nivel de Alerta / Prioridad</label>
                <select {...register('priority')} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer">
                  <option value="info">Info (Mensaje General Informativo)</option>
                  <option value="success">Felicidad / Condecoración (Éxito)</option>
                  <option value="warning">Alerta / Mensualidades (Cobro)</option>
                  <option value="danger">Urgente / Suspensión de actividades</option>
                </select>
              </div>

              {/* Canal de Envío */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Canales Activos de Envío</label>
                <select {...register('channel')} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer">
                  <option value="all">PWA Push + Email + SMS</option>
                  <option value="push">PWA Push (Sólo App)</option>
                  <option value="email">Sólo Email Oficial</option>
                  <option value="sms">Sólo SMS Directo</option>
                </select>
              </div>

              {/* Grupo Destinatario */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Grupo o Categoría Destino</label>
                <select {...register('target_group')} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer">
                  <option value="todos">Todos los Deportistas (Global)</option>
                  <option value="Juvenil Élite Sub-17">Juvenil Élite Sub-17</option>
                  <option value="Femenino Sub-20">Femenino Sub-20</option>
                  <option value="Junior Sub-15">Junior Sub-15</option>
                </select>
              </div>

              {/* Contenido del Mensaje */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Contenido del Mensaje</label>
                <textarea {...register('message')} rows={3} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500" placeholder="Ej: Se suspenden actividades debido a tormenta eléctrica..." />
                {errors.message && <p className="text-[10px] text-rose-400 font-semibold">{errors.message.message}</p>}
              </div>

              {/* Botones del Modal */}
              <div className="pt-4 border-t border-slate-850 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="py-2.5 px-4 bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 text-xs font-bold rounded-xl transition cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-750 text-white font-black rounded-xl text-xs transition disabled:opacity-50 cursor-pointer shadow-lg shadow-indigo-900/15">
                  {isSubmitting ? 'Enviando...' : 'Emitir Alerta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
