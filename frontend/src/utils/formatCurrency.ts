/**
 * Formatea un valor numérico a pesos colombianos (COP) sin decimales.
 * Ejemplo: 50000 -> "$ 50.000"
 */
export const formatCurrency = (value: number | undefined): string => {
  if (value === undefined || isNaN(value)) return '$ 0';
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
};
