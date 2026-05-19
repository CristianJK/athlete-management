import { useState } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';

export default function ReportsPage() {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  // Datos consolidados iniciales que reaccionan de manera simulada pero dinámica al filtro de categoría
  const initialKPIs = {
    all: {
      totalAthletes: 20,
      activeAthletes: 18,
      avgAttendance: 89.2,
      collectedPayments: 1250000,
      pendingPayments: 450000,
      distribution: [
        { name: 'Juvenil Élite Sub-17', count: 8, percentage: 40, color: 'bg-blue-500' },
        { name: 'Femenino Sub-20', count: 7, percentage: 35, color: 'bg-emerald-500' },
        { name: 'Junior Sub-15', count: 5, percentage: 25, color: 'bg-purple-500' },
      ],
      monthlyAttendance: [
        { month: 'Ene', value: 85, height: 'h-[85%]' },
        { month: 'Feb', value: 88, height: 'h-[88%]' },
        { month: 'Mar', value: 92, height: 'h-[92%]' },
        { month: 'Abr', value: 87, height: 'h-[87%]' },
        { month: 'May', value: 91, height: 'h-[91%]' },
      ]
    },
    'sub17': {
      totalAthletes: 8,
      activeAthletes: 7,
      avgAttendance: 91.5,
      collectedPayments: 500000,
      pendingPayments: 180000,
      distribution: [
        { name: 'Juvenil Élite Sub-17', count: 8, percentage: 100, color: 'bg-blue-500' },
        { name: 'Otros Grupos', count: 0, percentage: 0, color: 'bg-slate-800' },
      ],
      monthlyAttendance: [
        { month: 'Ene', value: 90, height: 'h-[90%]' },
        { month: 'Feb', value: 92, height: 'h-[92%]' },
        { month: 'Mar', value: 94, height: 'h-[94%]' },
        { month: 'Abr', value: 89, height: 'h-[89%]' },
        { month: 'May', value: 93, height: 'h-[93%]' },
      ]
    },
    'sub20': {
      totalAthletes: 7,
      activeAthletes: 6,
      avgAttendance: 86.8,
      collectedPayments: 450000,
      pendingPayments: 150000,
      distribution: [
        { name: 'Femenino Sub-20', count: 7, percentage: 100, color: 'bg-emerald-500' },
        { name: 'Otros Grupos', count: 0, percentage: 0, color: 'bg-slate-800' },
      ],
      monthlyAttendance: [
        { month: 'Ene', value: 82, height: 'h-[82%]' },
        { month: 'Feb', value: 84, height: 'h-[84%]' },
        { month: 'Mar', value: 89, height: 'h-[89%]' },
        { month: 'Abr', value: 85, height: 'h-[85%]' },
        { month: 'May', value: 88, height: 'h-[88%]' },
      ]
    },
    'sub15': {
      totalAthletes: 5,
      activeAthletes: 5,
      avgAttendance: 88.0,
      collectedPayments: 300000,
      pendingPayments: 120000,
      distribution: [
        { name: 'Junior Sub-15', count: 5, percentage: 100, color: 'bg-purple-500' },
        { name: 'Otros Grupos', count: 0, percentage: 0, color: 'bg-slate-800' },
      ],
      monthlyAttendance: [
        { month: 'Ene', value: 83, height: 'h-[83%]' },
        { month: 'Feb', value: 87, height: 'h-[87%]' },
        { month: 'Mar', value: 90, height: 'h-[90%]' },
        { month: 'Abr', value: 86, height: 'h-[86%]' },
        { month: 'May', value: 89, height: 'h-[89%]' },
      ]
    }
  };

  const currentData = initialKPIs[selectedGroup as keyof typeof initialKPIs] || initialKPIs.all;
  const totalFinancial = currentData.collectedPayments + currentData.pendingPayments;
  const collectedPercentage = totalFinancial > 0 ? Math.round((currentData.collectedPayments / totalFinancial) * 100) : 0;
  const pendingPercentage = 100 - collectedPercentage;

  // Exportador de CSV Funcional
  const handleExportCSV = () => {
    const csvContent = [
      ['Reporte Consolidado de Gestion ClubApp - Mayo 2026'],
      ['Categoria / Filtro Seleccionado', selectedGroup.toUpperCase()],
      [],
      ['Metrica', 'Valor'],
      ['Total Deportistas Registrados', currentData.totalAthletes],
      ['Deportistas Activos', currentData.activeAthletes],
      ['Asistencia Promedio (%)', `${currentData.avgAttendance}%`],
      ['Total Recaudado (COP)', `$${currentData.collectedPayments}`],
      ['Cartera Pendiente (COP)', `$${currentData.pendingPayments}`],
      ['Eficiencia de Recaudo (%)', `${collectedPercentage}%`],
      [],
      ['Distribucion de Atletas por Grupo'],
      ['Grupo', 'Cantidad de Deportistas', 'Porcentaje (%)'],
      ...currentData.distribution.map(d => [d.name, d.count, `${d.percentage}%`]),
      [],
      ['Historico de Asistencia Mensual'],
      ['Mes', 'Porcentaje de Asistencia (%)'],
      ...currentData.monthlyAttendance.map(a => [a.month, `${a.value}%`]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_consolidado_${selectedGroup}_mayo_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn print:space-y-4">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-850 p-6 rounded-2xl print:bg-white print:border-none print:p-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-100 tracking-tight print:text-black">
            Inteligencia de Negocio y Reportes
          </h1>
          <p className="text-slate-400 text-sm print:text-slate-650">
            Resumen consolidado del rendimiento deportivo, control financiero e histórico de asistencia de la academia.
          </p>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="py-2.5 px-4 bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            🖨️ Imprimir PDF
          </button>
          <button
            onClick={handleExportCSV}
            className="py-2.5 px-4 bg-[#39D353] hover:bg-[#39D353]/90 text-slate-950 font-black rounded-xl text-xs transition duration-200 cursor-pointer shadow-lg shadow-[#39D353]/15 flex items-center gap-1.5 shrink-0"
          >
            📥 Exportar Reporte (CSV)
          </button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Categoría de Análisis:</span>
        </div>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="w-full sm:w-64 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="all">Todas las Categorías (Global)</option>
          <option value="sub17">Juvenil Élite Sub-17</option>
          <option value="sub20">Femenino Sub-20</option>
          <option value="sub15">Junior Sub-15</option>
        </select>
      </div>

      {/* Tarjetas de Métricas Consolidadas (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
        {/* Total Atletas */}
        <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-2 relative overflow-hidden print:bg-white print:border-slate-300">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Atletas Inscritos</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-slate-100 tracking-tight print:text-black">
              {currentData.totalAthletes}
            </h3>
            <span className="text-xs font-bold text-[#39D353] bg-[#39D353]/10 px-2 py-0.5 rounded-lg print:border print:border-[#39D353]">
              {currentData.activeAthletes} Activos
            </span>
          </div>
        </div>

        {/* Asistencia */}
        <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-2 relative overflow-hidden print:bg-white print:border-slate-300">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Asistencia Promedio</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-slate-100 tracking-tight print:text-black">
              {currentData.avgAttendance}%
            </h3>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg print:border print:border-blue-400">
              Meta 85%
            </span>
          </div>
        </div>

        {/* Cobrado */}
        <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-2 relative overflow-hidden print:bg-white print:border-slate-300">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Recaudo Conciliado</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-emerald-400 tracking-tight">
              {formatCurrency(currentData.collectedPayments)}
            </h3>
            <span className="text-[9px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
              {collectedPercentage}% Efic.
            </span>
          </div>
        </div>

        {/* Cartera Pendiente */}
        <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-2 relative overflow-hidden print:bg-white print:border-slate-300">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Cartera en Mora</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-rose-400 tracking-tight">
              {formatCurrency(currentData.pendingPayments)}
            </h3>
            <span className="text-[9px] font-extrabold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-lg">
              {pendingPercentage}% Pend.
            </span>
          </div>
        </div>
      </div>

      {/* Bloque de Gráficos Tácticos Premium */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3">
        {/* Historial Asistencia Mensual (Gráfico de Barras Verticales) */}
        <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-6 flex flex-col justify-between print:bg-white print:border-slate-300">
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-100 tracking-tight print:text-black">Historial Asistencia</h4>
            <p className="text-[10px] text-slate-400">Porcentaje de asistencia grupal consolidado mes a mes.</p>
          </div>

          {/* Gráfico en CSS Puro */}
          <div className="h-44 flex items-end justify-between gap-3 pt-4 border-b border-slate-800 pb-2">
            {currentData.monthlyAttendance.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="text-[9px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition duration-150">
                  {item.value}%
                </div>
                <div
                  className={`w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-500 ${item.height} group-hover:brightness-125`}
                  title={`Asistencia en ${item.month}: ${item.value}%`}
                />
                <span className="text-[10px] font-bold text-slate-500">{item.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold pt-1">
            <span>Mínimo: 85%</span>
            <span>Máximo: 92%</span>
          </div>
        </div>

        {/* Distribución Deportistas (Gráfico de Barras Horizontales) */}
        <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-5 print:bg-white print:border-slate-300">
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-100 tracking-tight print:text-black">Deportistas por Grupo</h4>
            <p className="text-[10px] text-slate-400">Cantidad y proporción de inscritos por categoría deportiva.</p>
          </div>

          <div className="space-y-4 pt-2">
            {currentData.distribution.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-300 print:text-slate-700">
                  <span>{item.name}</span>
                  <span>{item.count} Atletas ({item.percentage}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conciliación Financiera (CSS Circular Progress Ring) */}
        <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-6 flex flex-col justify-between print:bg-white print:border-slate-300">
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-100 tracking-tight print:text-black">Eficiencia de Recaudo</h4>
            <p className="text-[10px] text-slate-400">Porcentaje cobrado vs mensualidades en mora o pendiente.</p>
          </div>

          {/* Círculo de Progreso con CSS Puro */}
          <div className="flex items-center justify-center py-4">
            <div className="relative h-32 w-32 flex items-center justify-center bg-slate-950 rounded-full border border-slate-850 shadow-inner">
              <div className="absolute inset-2 bg-slate-900 rounded-full flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-emerald-400">{collectedPercentage}%</span>
                <span className="text-[8px] uppercase tracking-wider font-extrabold text-slate-500">Cobrado</span>
              </div>
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  className="stroke-emerald-500"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="364.4"
                  strokeDashoffset={364.4 - (364.4 * collectedPercentage) / 100}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold border-t border-slate-800/80 pt-4">
            <div className="space-y-0.5 border-r border-slate-850">
              <span className="text-[9px] uppercase tracking-wider text-emerald-500">Recaudado</span>
              <p className="text-slate-100 print:text-black">{formatCurrency(currentData.collectedPayments)}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase tracking-wider text-rose-500">Pendiente</span>
              <p className="text-slate-100 print:text-black">{formatCurrency(currentData.pendingPayments)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
