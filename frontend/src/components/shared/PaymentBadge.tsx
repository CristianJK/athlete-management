import type { PaymentStatus } from '../../types/payment.types';
import { PAYMENT_STATUS_LABELS } from '../../utils/constants';

interface PaymentBadgeProps {
  status: PaymentStatus;
}

export default function PaymentBadge({ status }: PaymentBadgeProps) {
  const styles = {
    paid: {
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      dot: 'bg-emerald-400',
    },
    pending: {
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      dot: 'bg-amber-400',
    },
    overdue: {
      bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      dot: 'bg-rose-500',
    },
  };

  const currentStyle = styles[status] || styles.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${currentStyle.dot}`} />
      {PAYMENT_STATUS_LABELS[status] || status}
    </span>
  );
}
