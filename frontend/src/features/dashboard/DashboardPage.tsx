import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../utils/formatCurrency';
import PaymentBadge from '../../components/shared/PaymentBadge';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const role = user?.role || 'athlete';

  // --- 1. SECCIÓN DE DASHBOARD ADMINISTRADOR ---
  if (role === 'admin') {
    // Datos mockup representativos del club
    const kpis = [
      {
        title: 'Total Deportistas',
        value: '142',
        trend: '+12% este mes',
        trendUp: true,
        icon: (
          <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
      },
      {
        title: 'Asistencia Hoy',
        value: '89.4%',
        trend: '+2.1% vs ayer',
        trendUp: true,
        icon: (
          <svg className="h-6 w-6 text-[#39D353]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        title: 'Ingresos Mensuales',
        value: formatCurrency(5450000),
        trend: '+8.4% vs meta',
        trendUp: true,
        icon: (
          <svg className="h-6 w-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        title: 'Pagos Pendientes',
        value: '9',
        trend: '3 en mora crítica',
        trendUp: false,
        icon: (
          <svg className="h-6 w-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
      },
    ];

    const recentAlerts = [
      { id: 1, name: 'Santiago Gómez', issue: 'Inasistencia reiterada (3 clases)', type: 'warning' },
      { id: 2, name: 'Valeria Restrepo', issue: 'Mensualidad de Mayo en Mora', type: 'danger' },
      { id: 3, name: 'Andrés Felipe', issue: 'Documento de matrícula pendiente', type: 'info' },
    ];

    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Banner de Bienvenida */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-850 p-6 rounded-2xl">
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-slate-100">
              ¡Bienvenido de vuelta, {user?.name}!
            </h1>
            <p className="text-slate-400 text-sm">
              Aquí tienes el estado operativo e ingresos de tu club para el día de hoy.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Sincronizado en tiempo real
            </span>
          </div>
        </div>

        {/* Malla de KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-4 hover:border-slate-800 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.title}</span>
                <div className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center shrink-0 border border-slate-800">
                  {kpi.icon}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black text-slate-100 tracking-tight">{kpi.value}</p>
                <div className="flex items-center gap-1 text-[11px] font-semibold">
                  <span className={kpi.trendUp ? 'text-emerald-400' : 'text-rose-400'}>
                    {kpi.trend}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sección de Reporte Gráfico y Alertas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico de Ingresos Vectorial Premium */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                📈 Comportamiento de Recaudo (Últimos 6 meses)
              </h3>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                COP
              </span>
            </div>
            
            {/* SVG Chart */}
            <div className="relative h-60 w-full flex items-end">
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                {/* Defs for gradients */}
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1A3C6E" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#1A3C6E" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area Path */}
                <path
                  d="M0 100 L 0 55 Q 20 40, 40 45 T 80 20 L 100 25 L 100 100 Z"
                  fill="url(#chartGradient)"
                />
                {/* Line Path */}
                <path
                  d="M0 55 Q 20 40, 40 45 T 80 20 L 100 25"
                  fill="none"
                  stroke="#39D353"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Ejes y Labels simulados */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[9px] text-slate-600 font-bold font-mono">
                <div className="border-b border-slate-850/50 w-full pb-1 text-right">$6.0M</div>
                <div className="border-b border-slate-850/50 w-full pb-1 text-right">$4.0M</div>
                <div className="border-b border-slate-850/50 w-full pb-1 text-right">$2.0M</div>
                <div className="w-full text-right">$0</div>
              </div>
            </div>

            {/* Meses en el Eje X */}
            <div className="grid grid-cols-6 text-center text-[10px] font-bold text-slate-500 pt-2 border-t border-slate-850">
              <span>Dic</span>
              <span>Ene</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Abr</span>
              <span>May</span>
            </div>
          </div>

          {/* Alertas Operativas Recientes */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-slate-850 pb-4">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  ⚠️ Novedades de Deportistas
                </h3>
              </div>

              <div className="space-y-3.5">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 bg-slate-950 border border-slate-850 rounded-xl">
                    <span className={`h-2.5 w-2.5 rounded-full shrink-0 mt-1 ${
                      alert.type === 'danger' ? 'bg-rose-500' : alert.type === 'warning' ? 'bg-amber-500' : 'bg-blue-400'
                    }`} />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-200">{alert.name}</p>
                      <p className="text-[11px] text-slate-400">{alert.issue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link to="/athletes" className="w-full text-center py-2 px-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs font-semibold rounded-lg transition duration-200 cursor-pointer">
              Gestionar Expedientes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. SECCIÓN DE DASHBOARD ENTRENADOR ---
  if (role === 'coach') {
    const classSessions = [
      { id: 1, name: 'Clase A: Juvenil Sub-17', time: '4:00 PM - 5:30 PM', group: 'Grupo Vanguardia', active: true },
      { id: 2, name: 'Clase B: Infantil Avanzado', time: '5:45 PM - 7:15 PM', group: 'Grupo Élite', active: false },
    ];

    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Banner Entrenador */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-850 p-6 rounded-2xl">
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-slate-100">
              ¡Hola, Profe {user?.name.split(' ')[1] || user?.name}!
            </h1>
            <p className="text-slate-400 text-sm">
              Prepara tus entrenamientos de hoy y registra la asistencia de tus deportistas.
            </p>
          </div>
          <Link to="/attendance" className="py-2.5 px-4 bg-[#39D353] hover:bg-[#39D353]/90 text-slate-950 font-black rounded-xl text-xs transition duration-200 cursor-pointer shadow-lg shadow-[#39D353]/10">
            ⏱️ Iniciar Escaneo QR
          </Link>
        </div>

        {/* KPIs rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Deportistas a Cargo</span>
            <p className="text-2xl font-black text-slate-100">48</p>
            <p className="text-[10px] text-slate-400">Asignados a tu categoría</p>
          </div>
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sesiones esta Semana</span>
            <p className="text-2xl font-black text-slate-100">12 horas</p>
            <p className="text-[10px] text-emerald-400">✓ Entrenamientos programados</p>
          </div>
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Asistencia Promedio</span>
            <p className="text-2xl font-black text-slate-100">92.1%</p>
            <p className="text-[10px] text-blue-400">¡Nivel de compromiso excelente!</p>
          </div>
        </div>

        {/* Sesiones programadas de hoy */}
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-850 pb-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              📅 Sesiones de Entrenamiento de Hoy
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classSessions.map((session) => (
              <div key={session.id} className="bg-slate-950 border border-slate-850 p-5 rounded-xl space-y-4 hover:border-slate-700 transition flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#39D353]">{session.group}</span>
                    {session.active && (
                      <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-100">{session.name}</h4>
                  <p className="text-xs text-slate-500">{session.time}</p>
                </div>
                <div className="pt-3 border-t border-slate-900 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {}} 
                    className="py-1.5 px-3 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    Ver Plan de Clase
                  </button>
                  <Link
                    to="/attendance" 
                    className="py-1.5 px-3 bg-[#1A3C6E] hover:bg-[#1A3C6E]/90 text-slate-100 text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    Generar QR de Ingreso
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- 3. SECCIÓN DE DASHBOARD DEPORTISTA / ATLETA ---
  // Datos del deportista autenticado
  const athleteMockData = {
    group: 'Juvenil Élite Sub-17',
    paymentStatus: 'paid' as const, // 'paid', 'pending', 'overdue'
    nextTraining: {
      title: 'Entrenamiento Táctico de Alto Rendimiento',
      date: 'Hoy, 4:00 PM',
      coach: 'Carlos Mendoza',
      location: 'Cancha Central (Sede Norte)',
    },
  };

  const athleteInitials = user?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AT';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
      {/* Columna Izquierda: Tarjeta QR de Acceso Físico */}
      <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-6 text-center flex flex-col items-center justify-center">
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            Acceso Digital QR
          </span>
          <h2 className="text-lg font-black text-slate-100">Código de Asistencia</h2>
          <p className="text-slate-400 text-xs max-w-xs mx-auto">
            Presenta este código al entrenador o en la tableta del club para validar tu ingreso.
          </p>
        </div>

        {/* QR Vectorial real generado con la librería de package.json */}
        <div className="bg-white p-5 rounded-2xl shadow-inner border border-slate-200">
          <QRCodeSVG
            value={`clubapp-athlete-${user?.id || '3'}`}
            size={180}
            level="H"
            bgColor="#FFFFFF"
            fgColor="#0F172A"
          />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-300">{user?.name}</p>
          <p className="text-[10px] font-mono text-slate-500">ID: CA-{1000 + Number(user?.id || 3)}</p>
        </div>
      </div>

      {/* Columna Derecha: Estado de Cuenta y Entrenamientos */}
      <div className="lg:col-span-2 space-y-6">
        {/* Banner de Estado de Pago y Grupo */}
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Estado de Cuenta</span>
            <div className="flex items-center gap-3">
              <PaymentBadge status={athleteMockData.paymentStatus} />
              <span className="text-xs text-slate-400">Mensualidad de Mayo</span>
            </div>
          </div>
          <div className="space-y-2 border-t sm:border-t-0 sm:border-l border-slate-850 pt-4 sm:pt-0 sm:pl-6">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Categoría Asignada</span>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-[#1A3C6E] flex items-center justify-center font-bold text-slate-200 text-[10px]">
                {athleteInitials}
              </div>
              <span className="text-sm font-bold text-slate-200">{athleteMockData.group}</span>
            </div>
          </div>
        </div>

        {/* Próximo entrenamiento programado */}
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-850 pb-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              📅 Próximo Entrenamiento Programado
            </h3>
          </div>

          <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl space-y-4 hover:border-slate-800 transition">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider">
                  Entrenamiento
                </span>
                <h4 className="text-sm font-extrabold text-slate-100">{athleteMockData.nextTraining.title}</h4>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-bold text-[#39D353]">{athleteMockData.nextTraining.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-900 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Profesor:</span>
                <span className="text-slate-300 font-semibold">{athleteMockData.nextTraining.coach}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Ubicación:</span>
                <span className="text-slate-300 truncate">{athleteMockData.nextTraining.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
