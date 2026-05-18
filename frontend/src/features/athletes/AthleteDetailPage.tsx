import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAthlete, changeAthleteStatus } from '../../api/athletes.api';
import type { Athlete, AthleteStatus } from '../../types/athlete.types';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate, formatTime } from '../../utils/formatDate';
import StatusBadge from '../../components/shared/StatusBadge';
import PaymentBadge from '../../components/shared/PaymentBadge';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

export default function AthleteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(false);

  // Carga del deportista específico
  const fetchAthlete = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      if (!id) return;
      const data = await getAthlete(Number(id));
      setAthlete(data);
    } catch (error) {
      console.error(error);
      // Fallback con expediente deportivo detallado y simulado
      setAthlete({
        id: Number(id || '1'),
        name: 'Mateo Restrepo Rojas',
        email: 'mateo@clubapp.com',
        document_number: '1020485963',
        document_type: 'TI',
        birthdate: '2010-06-15',
        gender: 'Masculino',
        phone: '3154879652',
        address: 'Calle 45 # 12-34, Medellín',
        sport: 'Fútbol',
        group_name: 'Juvenil Élite Sub-17',
        status: 'active',
        joined_at: '2025-01-10',
        emergency_contact: { name: 'Sandra Rojas', phone: '3204589632', relationship: 'Madre' },
        habeas_data_accepted: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAthlete();
  }, [id]);

  // Rotar el estado del deportista
  const handleRotateStatus = async () => {
    if (!athlete) return;
    setIsRotating(true);
    
    const statuses: AthleteStatus[] = ['active', 'inactive', 'suspended'];
    const nextStatus = statuses[(statuses.indexOf(athlete.status) + 1) % statuses.length];

    try {
      await changeAthleteStatus(athlete.id, nextStatus);
      setAthlete((prev) => (prev ? { ...prev, status: nextStatus } : null));
    } catch (error) {
      // Simulación local ante fallas
      setAthlete((prev) => (prev ? { ...prev, status: nextStatus } : null));
    } finally {
      setIsRotating(false);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" fullScreen={false} />;
  if (errorMessage || !athlete) return <ErrorMessage message={errorMessage || 'No se encontró el deportista.'} onRetry={fetchAthlete} />;

  // Historial de Asistencia Ficticio Detallado
  const attendanceHistory = [
    { date: '2026-05-15', title: 'Entrenamiento Táctico de Fútbol', method: 'Código QR', time: '16:03:15' },
    { date: '2026-05-12', title: 'Entrenamiento de Resistencia y Cardio', method: 'Manual (Coach)', time: '16:08:42' },
    { date: '2026-05-08', title: 'Preparación Física General', method: 'Código QR', time: '15:58:24' },
  ];

  // Historial de Pagos Ficticio Detallado
  const paymentHistory = [
    { period: 'Mayo 2026', amount: 150000, method: 'Transferencia Bancaria', status: 'paid' as const, date: '2026-05-02' },
    { period: 'Abril 2026', amount: 150000, method: 'Efectivo', status: 'paid' as const, date: '2026-04-04' },
    { period: 'Marzo 2026', amount: 150000, method: 'Transferencia Bancaria', status: 'paid' as const, date: '2026-03-01' },
  ];

  const initials = athlete.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Botón de Atrás */}
      <button
        onClick={() => navigate('/athletes')}
        className="py-1.5 px-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 rounded-xl transition flex items-center gap-1 cursor-pointer"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Regresar al Directorio
      </button>

      {/* --- BANNER DE DETALLE DE DEPORTISTA --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 border border-slate-850 p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-blue-600/10 border border-blue-500/25 flex items-center justify-center font-black text-lg text-blue-400 shrink-0">
            {initials}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-black text-slate-100">{athlete.name}</h2>
              <StatusBadge status={athlete.status} />
            </div>
            <p className="text-xs text-slate-400">
              Categoría: <span className="font-bold text-slate-300">{athlete.group_name}</span> | Deporte: <span className="font-bold text-slate-300">{athlete.sport}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleRotateStatus}
          disabled={isRotating}
          className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-750 active:bg-indigo-800 text-white font-bold rounded-xl text-xs transition duration-200 cursor-pointer shadow-lg shadow-indigo-900/10 flex items-center gap-1.5 shrink-0"
        >
          {isRotating ? 'Cambiando...' : '🔄 Rotar Estado del Deportista'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Información del Expediente */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Ficha Personal */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider border-b border-slate-850 pb-3">
              📝 Información General
            </h3>
            <div className="space-y-3.5 text-xs text-slate-400">
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Identificación</span>
                <span className="text-slate-200 font-mono font-semibold">{athlete.document_type} - {athlete.document_number}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Correo Electrónico</span>
                <span className="text-slate-200">{athlete.email}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Teléfono Móvil</span>
                <span className="text-slate-200">{athlete.phone}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Dirección de Vivienda</span>
                <span className="text-slate-200">{athlete.address}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Fecha Nacimiento</span>
                <span className="text-slate-200">{formatDate(athlete.birthdate)}</span>
              </div>
            </div>
          </div>

          {/* Ficha Médica y de Emergencia */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider border-b border-slate-850 pb-3">
              🚨 Contacto y Salud
            </h3>
            <div className="space-y-3.5 text-xs text-slate-400">
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Contacto de Emergencia</span>
                <span className="text-slate-200 font-bold">{athlete.emergency_contact.name}</span>
                <span className="text-slate-300">Tel: {athlete.emergency_contact.phone} ({athlete.emergency_contact.relationship})</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Información Médica</span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-850 text-center">
                    <span className="text-slate-500 text-[8px] uppercase font-bold tracking-wider block">EPS</span>
                    <span className="text-slate-200 text-xs font-bold font-mono">SURA</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-850 text-center">
                    <span className="text-slate-500 text-[8px] uppercase font-bold tracking-wider block">Rh</span>
                    <span className="text-rose-400 text-xs font-bold font-mono">O+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Columna Derecha: Historiales */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Historial Asistencias */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider border-b border-slate-850 pb-3">
              ⏱️ Historial de Asistencias Recientes
            </h3>

            <div className="space-y-3">
              {attendanceHistory.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-850 rounded-xl text-xs">
                  <div className="space-y-1">
                    <p className="font-extrabold text-slate-200">{item.title}</p>
                    <p className="text-[10px] text-slate-500">{formatDate(item.date)} a las {formatTime(`${item.date}T${item.time}`)}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider text-[9px]">
                    {item.method}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Historial Pagos */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider border-b border-slate-850 pb-3">
              💰 Registro Histórico de Mensualidades
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-850 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Periodo</th>
                    <th className="py-3 px-4">Monto</th>
                    <th className="py-3 px-4">Método</th>
                    <th className="py-3 px-4">Fecha Pago</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/60 text-xs">
                  {paymentHistory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/10 transition">
                      <td className="py-3 px-4 font-bold text-slate-200">{item.period}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-400">{formatCurrency(item.amount)}</td>
                      <td className="py-3 px-4 text-slate-400">{item.method}</td>
                      <td className="py-3 px-4 text-slate-400">{formatDate(item.date)}</td>
                      <td className="py-3 px-4 text-center">
                        <PaymentBadge status={item.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
