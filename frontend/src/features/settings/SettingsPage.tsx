import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

const settingsSchema = zod.object({
  clubName: zod.string().min(1, 'El nombre del club es requerido'),
  logoUrl: zod.string().url('Debe ingresar una URL de imagen válida (ej: https://...)'),
  address: zod.string().min(1, 'La dirección es requerida'),
  phone: zod.string().min(7, 'El teléfono debe tener al menos 7 dígitos'),
  email: zod.string().email('Debe ingresar un correo electrónico corporativo válido'),
  feeSub17: zod.number().min(0, 'La tarifa debe ser mayor o igual a 0'),
  feeSub20: zod.number().min(0, 'La tarifa debe ser mayor o igual a 0'),
  feeSub15: zod.number().min(0, 'La tarifa debe ser mayor o igual a 0'),
});

type SettingsFormFields = zod.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'fees' | 'preferences'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Preferencias del sistema
  const [pwaNotifications, setPwaNotifications] = useState(true);
  const [habeasDataRequired, setHabeasDataRequired] = useState(true);
  const [autoBackups, setAutoBackups] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormFields>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      clubName: 'Club Deportivo Antigravity',
      logoUrl: 'https://stitch.withgoogle.com/projects/14480592572840340665',
      address: 'Calle 10 # 50-25, Medellín, Colombia',
      phone: '3157896541',
      email: 'contacto@antigravityclub.com',
      feeSub17: 150000,
      feeSub20: 160000,
      feeSub15: 120000,
    },
  });

  const onSubmit = async (data: SettingsFormFields) => {
    setIsSaving(true);
    setShowSuccessAlert(false);
    
    // Simular guardado de configuraciones con delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Guardar en localStorage para persistencia rápida en desarrollo
    localStorage.setItem('club_settings', JSON.stringify({
      ...data,
      pwaNotifications,
      habeasDataRequired,
      autoBackups
    }));

    setIsSaving(false);
    setShowSuccessAlert(true);

    // Ocultar alerta después de 4 segundos
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Encabezado */}
      <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Configuración del Club</h1>
          <p className="text-slate-400 text-sm">Gestiona la identidad de la academia, tarifas de mensualidades y preferencias del sistema.</p>
        </div>
      </div>

      {/* Alerta de Éxito */}
      {showSuccessAlert && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 animate-slideIn">
          <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            ¡Configuración guardada exitosamente! Los cambios han sido persistidos e implementados en todo el club.
          </div>
        </div>
      )}

      {/* Navegación por Pestañas (Tabs) */}
      <div className="flex border-b border-slate-850 gap-4 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-1 text-xs font-bold uppercase tracking-wider transition-all duration-150 shrink-0 border-b-2 cursor-pointer ${
            activeTab === 'profile'
              ? 'border-indigo-500 text-indigo-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          💼 Perfil del Club
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`pb-3 px-1 text-xs font-bold uppercase tracking-wider transition-all duration-150 shrink-0 border-b-2 cursor-pointer ${
            activeTab === 'fees'
              ? 'border-indigo-500 text-indigo-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          💰 Tarifas y Mensualidades
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`pb-3 px-1 text-xs font-bold uppercase tracking-wider transition-all duration-150 shrink-0 border-b-2 cursor-pointer ${
            activeTab === 'preferences'
              ? 'border-indigo-500 text-indigo-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          ⚙️ Preferencias
        </button>
      </div>

      {/* Formulario General */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-6">
        
        {/* --- PESTAÑA: PERFIL DEL CLUB --- */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider">Identidad Corporativa</h3>
              <p className="text-xs text-slate-400">Datos públicos y de contacto que aparecerán en recibos de pago y notificaciones oficiales.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nombre */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nombre del Club</label>
                <input
                  type="text"
                  {...register('clubName')}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="Ej: Club Deportivo Antigravity"
                />
                {errors.clubName && <p className="text-[10px] text-rose-400 font-semibold">{errors.clubName.message}</p>}
              </div>

              {/* Logo URL */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">URL del Logotipo Oficial</label>
                <input
                  type="text"
                  {...register('logoUrl')}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="https://..."
                />
                {errors.logoUrl && <p className="text-[10px] text-rose-400 font-semibold">{errors.logoUrl.message}</p>}
              </div>

              {/* Dirección */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Dirección Física</label>
                <input
                  type="text"
                  {...register('address')}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="Calle, Carrera, Ciudad"
                />
                {errors.address && <p className="text-[10px] text-rose-400 font-semibold">{errors.address.message}</p>}
              </div>

              {/* Teléfono */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Teléfono de Contacto</label>
                <input
                  type="text"
                  {...register('phone')}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="Ej: 3157896541"
                />
                {errors.phone && <p className="text-[10px] text-rose-400 font-semibold">{errors.phone.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Correo Electrónico Corporativo</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="contacto@clubapp.com"
                />
                {errors.email && <p className="text-[10px] text-rose-400 font-semibold">{errors.email.message}</p>}
              </div>
            </div>
          </div>
        )}

        {/* --- PESTAÑA: TARIFAS Y MENSUALIDADES --- */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider">Configuración de Mensualidades</h3>
              <p className="text-xs text-slate-400">Define los cobros automáticos que se le facturarán mensualmente a cada atleta según su grupo deportivo.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Sub-17 */}
              <div className="space-y-1.5 bg-slate-950 p-4 border border-slate-850 rounded-xl">
                <label className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block">Juvenil Élite Sub-17 (COP)</label>
                <input
                  type="number"
                  {...register('feeSub17', { valueAsNumber: true })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
                {errors.feeSub17 && <p className="text-[10px] text-rose-400 font-semibold">{errors.feeSub17.message}</p>}
              </div>

              {/* Sub-20 */}
              <div className="space-y-1.5 bg-slate-950 p-4 border border-slate-850 rounded-xl">
                <label className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">Femenino Sub-20 (COP)</label>
                <input
                  type="number"
                  {...register('feeSub20', { valueAsNumber: true })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
                {errors.feeSub20 && <p className="text-[10px] text-rose-400 font-semibold">{errors.feeSub20.message}</p>}
              </div>

              {/* Sub-15 */}
              <div className="space-y-1.5 bg-slate-950 p-4 border border-slate-850 rounded-xl">
                <label className="text-[10px] uppercase font-bold text-purple-400 tracking-wider block">Junior Sub-15 (COP)</label>
                <input
                  type="number"
                  {...register('feeSub15', { valueAsNumber: true })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
                {errors.feeSub15 && <p className="text-[10px] text-rose-400 font-semibold">{errors.feeSub15.message}</p>}
              </div>
            </div>
          </div>
        )}

        {/* --- PESTAÑA: PREFERENCIAS --- */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider">Políticas y Operaciones</h3>
              <p className="text-xs text-slate-400">Activa o desactiva las funciones de control automatizado de la aplicación.</p>
            </div>

            <div className="space-y-4">
              {/* Notificaciones PWA */}
              <div className="flex items-center justify-between bg-slate-950 p-4 border border-slate-850 rounded-xl hover:border-slate-800 transition">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-200">Notificaciones Automáticas PWA Push</p>
                  <p className="text-[10px] text-slate-500">Envía alertas Push inmediatas al móvil de los atletas al programar eventos o cobros.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPwaNotifications(!pwaNotifications)}
                  className={`w-11 h-6 rounded-full transition duration-200 relative cursor-pointer ${
                    pwaNotifications ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`h-4 w-4 bg-white rounded-full absolute top-1 transition-all duration-200 ${
                      pwaNotifications ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Habeas Data */}
              <div className="flex items-center justify-between bg-slate-950 p-4 border border-slate-850 rounded-xl hover:border-slate-800 transition">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-200">Firma Obligatoria de Habeas Data</p>
                  <p className="text-[10px] text-slate-500">Exige a todos los atletas firmar digitalmente el consentimiento legal al primer ingreso.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setHabeasDataRequired(!habeasDataRequired)}
                  className={`w-11 h-6 rounded-full transition duration-200 relative cursor-pointer ${
                    habeasDataRequired ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`h-4 w-4 bg-white rounded-full absolute top-1 transition-all duration-200 ${
                      habeasDataRequired ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Copias de seguridad */}
              <div className="flex items-center justify-between bg-slate-950 p-4 border border-slate-850 rounded-xl hover:border-slate-800 transition">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-200">Copias de Seguridad Automáticas</p>
                  <p className="text-[10px] text-slate-500">Respaldar la base de datos de atletas y asistencia diariamente en almacenamiento en la nube.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoBackups(!autoBackups)}
                  className={`w-11 h-6 rounded-full transition duration-200 relative cursor-pointer ${
                    autoBackups ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`h-4 w-4 bg-white rounded-full absolute top-1 transition-all duration-200 ${
                      autoBackups ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Botón de Guardado General */}
        <div className="pt-4 border-t border-slate-850 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-750 hover:to-indigo-750 active:from-blue-800 active:to-indigo-800 text-white font-black rounded-xl text-xs transition duration-200 cursor-pointer shadow-lg shadow-indigo-900/15 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Guardando configuraciones...</span>
              </>
            ) : (
              <span>Guardar Todo</span>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
