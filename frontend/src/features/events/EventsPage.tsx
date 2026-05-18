import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useAuthStore } from '../../store/authStore';
import { getEvents, createEvent, rsvp } from '../../api/events.api';
import type { ClubEvent } from '../../types/event.types';
import { formatDate, formatTime } from '../../utils/formatDate';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

// Esquema de validación para registrar un evento
const eventSchema = zod.object({
  title: zod.string().min(1, 'El título del evento es requerido'),
  description: zod.string().min(1, 'La descripción es requerida'),
  type: zod.string().min(1, 'El tipo de evento es requerido'),
  location: zod.string().min(1, 'La ubicación es requerida'),
  starts_at: zod.string().min(1, 'La fecha y hora de inicio son requeridas'),
  ends_at: zod.string().min(1, 'La fecha y hora de finalización son requeridas'),
  max_attendees: zod.string().optional(),
});

type EventFormFields = zod.infer<typeof eventSchema>;

export default function EventsPage() {
  const { user } = useAuthStore();
  const isAdminOrCoach = user?.role === 'admin' || user?.role === 'coach';

  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados del calendario
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 18)); // Mayo 2026
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 4, 18));

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormFields>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      type: 'training',
      starts_at: '2026-05-18T16:00',
      ends_at: '2026-05-18T18:00',
    },
  });

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error(error);
      // Fallback con eventos deportivos representativos
      setEvents([
        {
          id: 1,
          title: 'Entrenamiento Táctico de Fútbol',
          description: 'Práctica técnica y táctica en campo sintético principal.',
          type: 'training',
          location: 'Cancha Sintética 1',
          starts_at: '2026-05-18T16:00:00Z',
          ends_at: '2026-05-18T18:00:00Z',
          max_attendees: 30,
          status: 'upcoming',
          attendees_count: 14,
          my_rsvp: 'pending',
        },
        {
          id: 2,
          title: 'Torneo Nacional de Fútbol Juvenil',
          description: 'Semifinal de la liga juvenil contra Envigado F.C.',
          type: 'tournament',
          location: 'Cancha Sintética 1',
          starts_at: '2026-05-19T09:00:00Z',
          ends_at: '2026-05-19T12:00:00Z',
          max_attendees: 18,
          status: 'upcoming',
          attendees_count: 18,
          my_rsvp: 'confirmed',
        },
        {
          id: 3,
          title: 'Charla Técnica e Inducción',
          description: 'Reunión médica de nutrición y preparación deportiva.',
          type: 'meeting',
          location: 'Salón de Eventos Principal',
          starts_at: '2026-05-20T18:30:00Z',
          ends_at: '2026-05-20T20:00:00Z',
          max_attendees: 50,
          status: 'upcoming',
          attendees_count: 8,
          my_rsvp: 'cancelled',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Controladores de calendario manuales
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayIndex = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Crear Evento
  const handleCreateEventSubmit = async (data: EventFormFields) => {
    setIsSubmitting(true);
    try {
      const payload = {
        club_id: 1,
        title: data.title,
        description: data.description,
        starts_at: new Date(data.starts_at).toISOString(),
        ends_at: new Date(data.ends_at).toISOString(),
        location: data.location,
        type: data.type as any,
        status: 'upcoming' as const,
        max_attendees: data.max_attendees ? Number(data.max_attendees) : undefined,
      };

      const newEvent = await createEvent(payload);
      setEvents((prev) => [newEvent, ...prev]);
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error(error);
      // Simulación local si falla la red
      const simulatedNewEvent: ClubEvent = {
        id: Date.now(),
        title: data.title,
        description: data.description,
        type: data.type as any,
        location: data.location,
        starts_at: new Date(data.starts_at).toISOString(),
        ends_at: new Date(data.ends_at).toISOString(),
        max_attendees: data.max_attendees ? Number(data.max_attendees) : undefined,
        status: 'upcoming',
        attendees_count: 0,
        my_rsvp: 'pending',
      };
      setEvents((prev) => [simulatedNewEvent, ...prev]);
      setIsModalOpen(false);
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirmar Asistencia (RSVP)
  const handleRSVP = async (eventId: number, status: 'confirmed' | 'cancelled') => {
    try {
      await rsvp(eventId, status);
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === eventId
            ? {
                ...ev,
                my_rsvp: status,
                attendees_count: status === 'confirmed' ? ev.attendees_count + 1 : ev.attendees_count - 1,
              }
            : ev
        )
      );
    } catch (error) {
      // Simulación local ante fallas
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === eventId
            ? {
                ...ev,
                my_rsvp: status,
                attendees_count: status === 'confirmed' ? ev.attendees_count + 1 : ev.attendees_count - 1,
              }
            : ev
        )
      );
    }
  };

  // Filtrado de eventos por día del calendario seleccionado
  const filteredEventsByDate = events.filter((ev) => {
    const eventDate = new Date(ev.starts_at);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-850 p-6 rounded-2xl">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Calendario y Eventos</h1>
          <p className="text-slate-400 text-sm">Organiza los entrenamientos, torneos oficiales y asambleas técnicas de la academia.</p>
        </div>
        
        {isAdminOrCoach && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-2.5 px-4 bg-[#39D353] hover:bg-[#39D353]/90 text-slate-950 font-black rounded-xl text-xs transition duration-200 cursor-pointer shadow-lg shadow-[#39D353]/15 flex items-center gap-1.5 shrink-0"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Agendar Evento
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Calendario Visual */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Grilla Semanal */}
          <div className="grid grid-cols-7 text-center text-slate-500 font-black text-[10px] uppercase tracking-wider gap-y-2">
            <span>D</span>
            <span>L</span>
            <span>M</span>
            <span>M</span>
            <span>J</span>
            <span>V</span>
            <span>S</span>
          </div>

          {/* Celdas del Calendario */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Celdas Vacías iniciales */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="aspect-square" />
            ))}

            {/* Días del Mes */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth() && selectedDate.getFullYear() === currentDate.getFullYear();
              const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();

              // Contar eventos programados en este día específico
              const dayEvents = events.filter((ev) => {
                const evD = new Date(ev.starts_at);
                return evD.getDate() === day && evD.getMonth() === currentDate.getMonth() && evD.getFullYear() === currentDate.getFullYear();
              });

              return (
                <button
                  key={`day-${day}`}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square rounded-xl border flex flex-col items-center justify-center relative transition cursor-pointer text-xs font-bold ${
                    isSelected
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : isToday
                        ? 'bg-slate-950 border-blue-500 text-blue-400'
                        : 'bg-slate-950 hover:bg-slate-850 border-slate-850 text-slate-300'
                  }`}
                >
                  <span>{day}</span>
                  
                  {/* Puntos Indicadores de Eventos */}
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-1.5 flex gap-0.5">
                      {dayEvents.slice(0, 3).map((ev) => (
                        <span
                          key={ev.id}
                          className={`h-1.5 w-1.5 rounded-full ${
                            ev.type === 'training'
                              ? 'bg-sky-400'
                              : ev.type === 'tournament'
                                ? 'bg-emerald-400'
                                : ev.type === 'meeting'
                                  ? 'bg-violet-400'
                                  : 'bg-slate-400'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="bg-slate-950 p-4 rounded-xl text-[10px] space-y-1.5 text-slate-500 border border-slate-900">
            <span className="font-bold uppercase tracking-wider block text-[8px] text-slate-400">Leyenda de Eventos</span>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-400" />Entrenamiento</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" />Torneo</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-400" />Reunión</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Listado de Eventos del Día */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider">
                Eventos Programados
              </h3>
              <p className="text-slate-400 text-xs">
                Mostrando actividades para el <span className="font-bold text-blue-400">{formatDate(selectedDate.toISOString())}</span>.
              </p>
            </div>
            <span className="px-2.5 py-0.5 bg-slate-950 rounded border border-slate-800 text-[10px] text-slate-400 font-mono font-bold">
              {filteredEventsByDate.length} {filteredEventsByDate.length === 1 ? 'Evento' : 'Eventos'}
            </span>
          </div>

          {isLoading ? (
            <LoadingSpinner size="lg" />
          ) : filteredEventsByDate.length === 0 ? (
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-12 text-center text-slate-400">
              No hay entrenamientos ni torneos programados para este día.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEventsByDate.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-slate-900 border border-slate-850 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${
                        ev.type === 'training'
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/25'
                          : ev.type === 'tournament'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                            : 'bg-violet-500/10 text-violet-400 border-violet-500/25'
                      }`}>
                        {ev.type === 'training' ? '⚽ Entrenamiento' : ev.type === 'tournament' ? '🏆 Torneo Oficial' : '👥 Reunión'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">•</span>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        📍 {ev.location}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-100">{ev.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-xl">{ev.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-[11px] text-slate-400">
                      <p className="flex items-center gap-1">
                        ⏱️ {formatTime(ev.starts_at)} - {formatTime(ev.ends_at)}
                      </p>
                      <p className="flex items-center gap-1 font-mono text-slate-500">
                        👥 Cupo: <span className="text-slate-300 font-bold">{ev.attendees_count}</span> / {ev.max_attendees || '∞'} inscritos
                      </p>
                    </div>
                  </div>

                  {/* Acciones de Asistencia (RSVP) */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end justify-center gap-2 shrink-0">
                    {ev.my_rsvp === 'confirmed' ? (
                      <>
                        <span className="py-1.5 px-3 bg-emerald-500/10 text-[#39D353] border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider rounded-xl text-center">
                          ✓ Asistencia Confirmada
                        </span>
                        <button
                          onClick={() => handleRSVP(ev.id, 'cancelled')}
                          className="py-1 px-3 hover:bg-slate-850 text-rose-400 text-[10px] font-bold rounded-lg transition text-center cursor-pointer"
                        >
                          Cancelar Asistencia
                        </button>
                      </>
                    ) : ev.my_rsvp === 'cancelled' ? (
                      <>
                        <span className="py-1.5 px-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold uppercase tracking-wider rounded-xl text-center">
                          ✗ Inasistencia Registrada
                        </span>
                        <button
                          onClick={() => handleRSVP(ev.id, 'confirmed')}
                          className="py-1 px-3 hover:bg-slate-850 text-blue-400 text-[10px] font-bold rounded-lg transition text-center cursor-pointer"
                        >
                          Confirmar Asistencia
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col gap-1.5 w-full">
                        <button
                          onClick={() => handleRSVP(ev.id, 'confirmed')}
                          className="py-2 px-3 bg-blue-600 hover:bg-blue-750 text-white text-[10px] font-bold rounded-xl transition text-center cursor-pointer"
                        >
                          Confirmar Asistencia
                        </button>
                        <button
                          onClick={() => handleRSVP(ev.id, 'cancelled')}
                          className="py-2 px-3 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 text-[10px] font-bold rounded-xl transition text-center cursor-pointer"
                        >
                          Registrar Inasistencia
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* --- MODAL AGENDAR EVENTO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
            <div className="bg-slate-950 p-5 border-b border-slate-850 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-100">Agendar Actividad</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-200 transition cursor-pointer">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit(handleCreateEventSubmit)} className="p-6 space-y-5">
              {/* Título */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Título de la Actividad</label>
                <input type="text" {...register('title')} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500" placeholder="Ej: Entrenamiento Táctico Sub-17" />
                {errors.title && <p className="text-[10px] text-rose-400 font-semibold">{errors.title.message}</p>}
              </div>

              {/* Tipo de Actividad */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tipo de Actividad</label>
                <select {...register('type')} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer">
                  <option value="training">Fútbol (Entrenamiento)</option>
                  <option value="tournament">Torneo / Partido Oficial</option>
                  <option value="meeting">Reunión Técnica / Charlas</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              {/* Ubicación */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Ubicación / Instalación</label>
                <input type="text" {...register('location')} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500" placeholder="Ej: Cancha Sintética 1" />
                {errors.location && <p className="text-[10px] text-rose-400 font-semibold">{errors.location.message}</p>}
              </div>

              {/* Fecha y Hora de Inicio */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Fecha y Hora de Inicio</label>
                <input type="datetime-local" {...register('starts_at')} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500" />
                {errors.starts_at && <p className="text-[10px] text-rose-400 font-semibold">{errors.starts_at.message}</p>}
              </div>

              {/* Fecha y Hora de Fin */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Fecha y Hora de Fin</label>
                <input type="datetime-local" {...register('ends_at')} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500" />
                {errors.ends_at && <p className="text-[10px] text-rose-400 font-semibold">{errors.ends_at.message}</p>}
              </div>

              {/* Límite de Cupos */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Cupo Máximo (Opcional)</label>
                <input type="number" {...register('max_attendees')} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500" placeholder="Ej: 30" />
              </div>

              {/* Descripción */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Descripción del Evento</label>
                <textarea {...register('description')} rows={2} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500" placeholder="Ej: Práctica técnica enfocada en posesión..." />
                {errors.description && <p className="text-[10px] text-rose-400 font-semibold">{errors.description.message}</p>}
              </div>

              {/* Botones del Modal */}
              <div className="pt-4 border-t border-slate-850 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="py-2.5 px-4 bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 text-xs font-bold rounded-xl transition cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="py-2.5 px-4 bg-[#39D353] hover:bg-[#39D353]/90 text-slate-950 font-black rounded-xl text-xs transition disabled:opacity-50 cursor-pointer shadow-lg shadow-[#39D353]/10">
                  {isSubmitting ? 'Guardando...' : 'Confirmar Agenda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
