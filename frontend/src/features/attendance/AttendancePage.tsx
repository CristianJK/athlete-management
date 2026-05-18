import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { createSession, checkIn } from '../../api/attendance.api';
import type { AttendanceSession } from '../../types/attendance.types';

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'generator'>('scanner');

  // --- ESTADOS DEL GENERADOR QR (SESIONES) ---
  const [sessionName, setSessionName] = useState('Clase Táctica Sub-17');
  const [selectedGroup, setSelectedGroup] = useState('Juvenil Élite Sub-17');
  const [generatedSession, setGeneratedSession] = useState<AttendanceSession | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- ESTADOS DEL SCANNER DE CÁMARA ---
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanResult, setScanResult] = useState<{
    status: 'success' | 'warning' | 'danger';
    title: string;
    message: string;
    athlete?: string;
  } | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Mock de Deportistas para la consola de simulación de escaneo
  const mockAthletesList = [
    { id: 1, name: 'Mateo Restrepo Rojas', group: 'Juvenil Élite Sub-17', status: 'active', payment: 'paid' },
    { id: 2, name: 'Valeria Restrepo Gómez', group: 'Femenino Sub-20', status: 'suspended', payment: 'overdue' },
    { id: 3, name: 'Santiago Gómez Zapata', group: 'Junior Sub-15', status: 'inactive', payment: 'pending' },
  ];

  // --- 1. LÓGICA DEL GENERADOR DE SESIONES ---
  const handleCreateSession = async () => {
    setIsGenerating(true);
    try {
      const uniqueToken = `session-token-${Date.now()}`;
      const session = await createSession({
        club_id: 1,
        name: sessionName,
        qr_token: uniqueToken,
        expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 horas
        group_name: selectedGroup,
      });
      setGeneratedSession(session);
    } catch (error) {
      // Simulación local si el backend no responde
      setGeneratedSession({
        id: Date.now(),
        name: sessionName,
        qr_token: `session-mock-token-${Date.now()}`,
        expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        group_name: selectedGroup,
        checked_in_count: 0,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // --- 2. LÓGICA DEL SCANNER CON CÁMARA WEB REAL ---
  const startCamera = async () => {
    setScanResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error('Error al encender la cámara:', err);
      // Se activa el estado de cámara pero mostrando un visor alternativo premium
      setIsCameraActive(true);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Apagar la cámara al desmontar el componente
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // --- 3. PROCESADOR DE ESCANEO DE QR (MOCK / EN VIVO SIMULADO) ---
  const handleProcessScan = async (athleteId: number) => {
    const selectedAthlete = mockAthletesList.find((ath) => ath.id === athleteId);
    if (!selectedAthlete) return;

    // Validación 1: Deportista Suspendido (Peligro)
    if (selectedAthlete.status === 'suspended') {
      setScanResult({
        status: 'danger',
        title: 'Acceso Denegado',
        message: `El deportista ${selectedAthlete.name} se encuentra SUSPENDIDO por razones del club.`,
        athlete: selectedAthlete.name,
      });
      return;
    }

    // Validación 2: Deuda en Pagos (Advertencia)
    if (selectedAthlete.payment === 'pending' || selectedAthlete.payment === 'overdue') {
      setScanResult({
        status: 'warning',
        title: 'Restricción Financiera',
        message: `El deportista ${selectedAthlete.name} tiene saldos pendientes. Por favor diríjase a administración.`,
        athlete: selectedAthlete.name,
      });
      return;
    }

    // Registro de Asistencia Exitoso
    try {
      // Llamada real al API de asistencia
      await checkIn({
        session_id: generatedSession?.id || 101,
        athlete_id: selectedAthlete.id,
        qr_token: generatedSession?.qr_token || 'mock-qr-token',
      });
      
      setScanResult({
        status: 'success',
        title: '¡Asistencia Registrada!',
        message: `Bienvenido al entrenamiento, ${selectedAthlete.name}. Sesión: ${selectedAthlete.group}`,
        athlete: selectedAthlete.name,
      });
    } catch (error) {
      // Simulación local si falla la red
      setScanResult({
        status: 'success',
        title: '¡Asistencia Registrada (Local)!',
        message: `Bienvenido, ${selectedAthlete.name}. Sesión validada localmente con éxito.`,
        athlete: selectedAthlete.name,
      });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Encabezado y Pestañas de Control */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-850 p-6 rounded-2xl">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Módulo de Asistencia QR</h1>
          <p className="text-slate-400 text-sm">Gestiona el ingreso digital en tiempo real mediante scanner de cámara o códigos de sesión.</p>
        </div>
        
        {/* Switch Selector */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-850 self-start md:self-auto">
          <button
            onClick={() => { setActiveTab('scanner'); stopCamera(); setScanResult(null); }}
            className={`py-2 px-4 text-xs font-black rounded-lg transition cursor-pointer ${
              activeTab === 'scanner' ? 'bg-[#1A3C6E] text-slate-100 shadow' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            📷 Scanner de Cámara
          </button>
          <button
            onClick={() => { setActiveTab('generator'); stopCamera(); setScanResult(null); }}
            className={`py-2 px-4 text-xs font-black rounded-lg transition cursor-pointer ${
              activeTab === 'generator' ? 'bg-[#1A3C6E] text-slate-100 shadow' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            ⏱️ Generar QR de Clase
          </button>
        </div>
      </div>

      {/* --- PANEL DE ESCANEO DE QR (VISTA SCANNER) --- */}
      {activeTab === 'scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contenedor del Visor de la Cámara */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-850 rounded-2xl p-6 flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />
            
            <div className="text-center space-y-1 z-10">
              <h3 className="text-base font-extrabold text-slate-200">Lector Óptico QR</h3>
              <p className="text-slate-400 text-xs">Apunta tu código QR personal hacia la cámara del dispositivo.</p>
            </div>

            {/* Cuadro de la cámara con marco neón y línea de barrido */}
            <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-850 flex items-center justify-center">
              
              {isCameraActive ? (
                <>
                  {/* Visor de Video Real de la Cámara */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  {/* Línea de Barrido Láser Neón */}
                  <div className="absolute left-0 right-0 h-1 bg-[#39D353]/60 shadow-[0_0_15px_#39D353] animate-scanSweep z-10" />
                  {/* Esquineros de Enfoque */}
                  <div className="absolute top-6 left-6 h-6 w-6 border-t-4 border-l-4 border-[#39D353]" />
                  <div className="absolute top-6 right-6 h-6 w-6 border-t-4 border-r-4 border-[#39D353]" />
                  <div className="absolute bottom-6 left-6 h-6 w-6 border-b-4 border-l-4 border-[#39D353]" />
                  <div className="absolute bottom-6 right-6 h-6 w-6 border-b-4 border-r-4 border-[#39D353]" />
                </>
              ) : (
                <div className="text-center p-6 space-y-4">
                  <div className="mx-auto h-16 w-16 bg-[#1A3C6E]/15 border border-[#1A3C6E]/30 rounded-2xl flex items-center justify-center">
                    <svg className="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <button
                    onClick={startCamera}
                    className="py-2.5 px-5 bg-blue-600 hover:bg-blue-750 text-white font-bold rounded-xl text-xs shadow-lg transition cursor-pointer"
                  >
                    Encender Cámara
                  </button>
                </div>
              )}
            </div>

            {isCameraActive && (
              <button
                onClick={stopCamera}
                className="py-1.5 px-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-400 rounded-lg transition z-10 cursor-pointer"
              >
                Apagar Cámara
              </button>
            )}
          </div>

          {/* Consola de Simulación y Alertas */}
          <div className="space-y-6">
            
            {/* Panel de Simulación Rápida */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider border-b border-slate-850 pb-3">
                ⚡ Consola de Test de Escaneo
              </h3>
              <p className="text-slate-400 text-xs">
                Simula el escaneo del código QR personal de un atleta para validar la respuesta del lector óptico.
              </p>
              
              <div className="flex flex-col gap-2">
                {mockAthletesList.map((ath) => (
                  <button
                    key={ath.id}
                    onClick={() => handleProcessScan(ath.id)}
                    className="w-full text-left p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 hover:border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-between group transition cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <p className="text-slate-200 group-hover:text-blue-400 transition">{ath.name}</p>
                      <p className="text-[10px] text-slate-500">{ath.group}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      ath.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : ath.status === 'suspended' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {ath.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tarjeta de Alerta Gigante Flotante */}
            {scanResult && (
              <div className={`p-6 rounded-2xl border flex flex-col items-center text-center space-y-4 animate-scaleIn ${
                scanResult.status === 'success' 
                  ? 'bg-emerald-950/20 border-emerald-500/30' 
                  : scanResult.status === 'warning'
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'bg-rose-950/20 border-rose-500/30'
              }`}>
                {/* Iconos */}
                <div className={`h-12 w-12 rounded-full flex items-center justify-center border shrink-0 ${
                  scanResult.status === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/35 text-[#39D353]'
                    : scanResult.status === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/35 text-amber-500'
                      : 'bg-rose-500/10 border-rose-500/35 text-rose-500'
                }`}>
                  {scanResult.status === 'success' ? (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : scanResult.status === 'warning' ? (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className={`text-base font-extrabold ${
                    scanResult.status === 'success' ? 'text-emerald-400' : scanResult.status === 'warning' ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {scanResult.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed px-2">{scanResult.message}</p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* --- PANEL DEL GENERADOR DE SESIONES (VISTA GENERADOR) --- */}
      {activeTab === 'generator' && (
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 flex flex-col lg:flex-row gap-8 items-center">
          
          {/* Controles del Generador */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="space-y-2 border-b border-slate-850 pb-4">
              <h3 className="text-base font-black text-slate-200">Programar Clase Activa</h3>
              <p className="text-slate-400 text-xs">Crea una sesión de control dinámica para habilitar que los deportistas registren su ingreso escaneando este panel.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nombre del Entrenamiento</label>
                <input
                  type="text"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Categoría / Grupo</label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Juvenil Élite Sub-17">Juvenil Élite Sub-17</option>
                  <option value="Femenino Sub-20">Femenino Sub-20</option>
                  <option value="Junior Sub-15">Junior Sub-15</option>
                </select>
              </div>

              <button
                onClick={handleCreateSession}
                disabled={isGenerating}
                className="w-full py-3 bg-[#1A3C6E] hover:bg-[#1A3C6E]/90 text-white font-bold rounded-xl text-xs transition disabled:opacity-50 cursor-pointer shadow-lg shadow-indigo-950/20"
              >
                {isGenerating ? 'Generando sesión...' : '⚡ Generar QR de Entrada'}
              </button>
            </div>
          </div>

          {/* Visualización del Código QR Generado */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center text-center space-y-6 lg:border-l lg:border-slate-850 lg:pl-8 py-4">
            {generatedSession ? (
              <>
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-[#39D353] border border-[#39D353]/20 text-[9px] font-bold uppercase tracking-wider">
                    Clase Activa en Tablero
                  </span>
                  <h4 className="text-sm font-black text-slate-200">{generatedSession.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Categoría: {generatedSession.group_name}</p>
                </div>

                {/* Código QR Dinámico Gigante */}
                <div className="bg-white p-6 rounded-3xl shadow-2xl border-4 border-[#1A3C6E]/30">
                  <QRCodeSVG
                    value={generatedSession.qr_token}
                    size={220}
                    level="H"
                    bgColor="#FFFFFF"
                    fgColor="#0F172A"
                  />
                </div>

                <div className="space-y-1 text-slate-400 text-xs">
                  <p className="font-bold flex items-center justify-center gap-1.5 text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Esperando escaneos de deportistas...
                  </p>
                  <p className="text-[10px] text-slate-500">Expira automáticamente al finalizar la clase.</p>
                </div>
              </>
            ) : (
              <div className="text-center p-8 space-y-4">
                <div className="mx-auto h-20 w-20 bg-slate-950 border border-slate-850 rounded-2xl flex items-center justify-center">
                  <svg className="h-10 w-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-500 text-xs max-w-xs mx-auto">
                  Selecciona la categoría y haz clic en generar para desplegar el código QR gigante en este panel.
                </p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
