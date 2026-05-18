import type { Athlete } from '../../types/athlete.types';
import StatusBadge from './StatusBadge';

interface AthleteCardProps {
  athlete: Athlete;
  onClick?: () => void;
}

export default function AthleteCard({ athlete, onClick }: AthleteCardProps) {
  // Genera iniciales para el avatar en caso de no tener imagen cargada
  const initials = athlete.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      onClick={onClick}
      className={`bg-slate-800 border border-slate-700/60 rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:border-slate-600/80 cursor-pointer group`}
    >
      {/* Avatar Container */}
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-indigo-500/20 flex items-center justify-center text-indigo-300 font-extrabold text-sm tracking-wide shrink-0 shadow-inner group-hover:from-blue-600/40 group-hover:to-indigo-600/40 transition">
        {initials}
      </div>

      {/* Athlete Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <h4 className="text-sm font-bold text-slate-100 truncate group-hover:text-blue-400 transition">
          {athlete.name}
        </h4>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="truncate">{athlete.sport}</span>
          <span className="h-1 w-1 rounded-full bg-slate-600" />
          <span className="truncate font-medium text-slate-300">{athlete.group_name}</span>
        </div>
      </div>

      {/* Badge Container */}
      <div className="shrink-0">
        <StatusBadge status={athlete.status} />
      </div>
    </div>
  );
}
