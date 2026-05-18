import type { ClubEvent } from '../../types/event.types';
import { EVENT_TYPE_LABELS } from '../../utils/constants';
import { formatTime } from '../../utils/formatDate';

interface EventCardProps {
  event: ClubEvent;
  onClick?: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  // Configuración de colores para los tipos de evento
  const typeStyles = {
    training: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    tournament: 'bg-[#39D353]/10 border-[#39D353]/20 text-[#39D353]',
    meeting: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    other: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
  };

  const currentTypeStyle = typeStyles[event.type] || typeStyles.other;

  // Extraer el día y mes para el bloque de calendario
  const eventDate = new Date(event.starts_at);
  const day = !isNaN(eventDate.getTime()) ? eventDate.getDate() : '-';
  const month = !isNaN(eventDate.getTime()) 
    ? eventDate.toLocaleString('es-CO', { month: 'short' }).replace('.', '').toUpperCase() 
    : '---';

  return (
    <div
      onClick={onClick}
      className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:border-slate-600/80 cursor-pointer group"
    >
      {/* Calendar Block (Left) */}
      <div className="h-14 w-12 rounded-xl bg-slate-900 border border-slate-750 flex flex-col items-center justify-center shrink-0 overflow-hidden shadow-inner group-hover:border-slate-650 transition">
        <span className="text-[10px] font-bold text-slate-500 tracking-wider pt-0.5">{month}</span>
        <span className="text-lg font-black text-slate-100 leading-none pb-1">{day}</span>
      </div>

      {/* Event Details */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <h4 className="text-sm font-bold text-slate-100 truncate group-hover:text-blue-400 transition">
          {event.title}
        </h4>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
          {/* Rango de Horas */}
          <span className="font-medium text-slate-300">
            {formatTime(event.starts_at)} - {formatTime(event.ends_at)}
          </span>
          {event.location && (
            <>
              <span className="h-1 w-1 rounded-full bg-slate-600 shrink-0" />
              <span className="truncate flex items-center gap-1">
                <svg className="h-3 w-3 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {event.location}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Event Type Badge (Right) */}
      <div className="shrink-0">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${currentTypeStyle}`}>
          {EVENT_TYPE_LABELS[event.type] || event.type}
        </span>
      </div>
    </div>
  );
}
