/**
 * Formatea una fecha en formato legible en español (ej: "17 de mayo de 2026").
 */
export const formatDate = (dateString: string | Date | undefined): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

/**
 * Formatea una fecha para extraer la hora en formato de 12 horas (ej: "8:30 p.m.").
 */
export const formatTime = (dateString: string | Date | undefined): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  
  return new Intl.DateTimeFormat('es-CO', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};
