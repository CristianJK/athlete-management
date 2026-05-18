import type { AthleteStatus } from '../../types/athlete.types';
import { ATHLETE_STATUS_LABELS } from '../../utils/constants';

interface StatusBadgeProps {
  status: AthleteStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    active: {
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      dot: 'bg-[#39D353]',
    },
    inactive: {
      bg: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
      dot: 'bg-slate-400',
    },
    suspended: {
      bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      dot: 'bg-rose-500',
    },
  };

  const currentStyle = styles[status] || styles.inactive;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${currentStyle.dot}`} />
      {ATHLETE_STATUS_LABELS[status] || status}
    </span>
  );
}
