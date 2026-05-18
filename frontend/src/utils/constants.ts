export const ATHLETE_STATUS_LABELS = {
  active: 'Activo',
  inactive: 'Inactivo',
  suspended: 'Suspendido',
} as const;

export const PAYMENT_STATUS_LABELS = {
  paid: 'Pagado',
  pending: 'Pendiente',
  overdue: 'En Mora',
} as const;

export const EVENT_TYPE_LABELS = {
  training: 'Entrenamiento',
  tournament: 'Torneo',
  meeting: 'Reunión',
  other: 'Otro',
} as const;

export const EVENT_STATUS_LABELS = {
  upcoming: 'Próximo',
  ongoing: 'En Curso',
  finished: 'Finalizado',
  cancelled: 'Cancelado',
} as const;

export const RSVP_STATUS_LABELS = {
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
  pending: 'Pendiente',
} as const;

export const PAYMENT_METHODS = {
  cash: 'Efectivo',
  transfer: 'Transferencia Bancaria',
  card: 'Tarjeta de Crédito/Débito',
  other: 'Otro',
} as const;
