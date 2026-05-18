import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';
import ErrorMessage from '../../components/shared/ErrorMessage';

// Esquema de validación usando Zod
const loginSchema = zod.object({
  email: zod
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Debe ingresar un correo electrónico válido'),
  password: zod
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormFields = zod.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormFields) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Llamada real al API de Laravel Sanctum
      const response = await loginApi(data);
      
      // Guardar sesión en Zustand (user y token)
      setAuth(response.user, response.access_token);
      
      // Redirigir al Dashboard
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      console.error(error);
      const apiMessage = error.response?.data?.message || 'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.';
      setErrorMessage(apiMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Ayudante para Simulación Rápida en ambiente de desarrollo/test
  const handleQuickLogin = (role: 'admin' | 'coach' | 'athlete') => {
    const mockUsers = {
      admin: { id: '1', name: 'Administrador Principal', email: 'admin@clubapp.com', role: 'admin' as const },
      coach: { id: '2', name: 'Entrenador Carlos', email: 'coach@clubapp.com', role: 'coach' as const },
      athlete: { id: '3', name: 'Deportista Mateo', email: 'athlete@clubapp.com', role: 'athlete' as const },
    };

    const mockUser = mockUsers[role];
    setAuth(
      {
        ...mockUser,
        accessToken: 'mock-token',
        refreshToken: 'mock-token',
      },
      'mock-jwt-token'
    );
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-100 w-full">
      {/* --- PANEL IZQUIERDO: DECORACIÓN PREMIUM DE STITCH (SOLO EN DESKTOP) --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1A3C6E] relative overflow-hidden items-center justify-center p-12">
        {/* Patrón de gradientes e iluminación tipo neón */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-[#1A3C6E]/95 to-emerald-950/40 z-0" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-45 -right-45 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

        {/* Contenido Motivacional */}
        <div className="relative z-10 space-y-6 max-w-md">
          <div className="h-14 w-14 rounded-2xl bg-slate-900 border border-slate-700/35 flex items-center justify-center font-black text-slate-100 text-xl shadow-lg">
            CA
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
              Athletic Intelligence <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-[#39D353] bg-clip-text text-transparent">
                ProClubs Performance
              </span>
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              El centro de control inteligente para atletas de alto rendimiento. Gestiona entrenamientos,
              asistencia digital mediante códigos QR y el seguimiento financiero consolidado en una sola plataforma.
            </p>
          </div>
          <div className="border-t border-slate-700/50 pt-6 flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-[#39D353] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Conectado a la Red del Club
            </span>
          </div>
        </div>
      </div>

      {/* --- PANEL DERECHO: FORMULARIO DE ACCESO (SIEMPRE VISIBLE) --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-950 relative">
        <div className="max-w-md w-full space-y-8 bg-slate-900/40 border border-slate-900 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative z-10">
          
          {/* Logo arriba en móviles */}
          <div className="lg:hidden text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-xl bg-[#1A3C6E] flex items-center justify-center font-black text-slate-100 text-lg shadow-md border border-indigo-500/25">
              CA
            </div>
            <h2 className="text-xl font-bold tracking-tight">ClubApp</h2>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-100">
              ¡Hola de nuevo!
            </h2>
            <p className="text-slate-400 text-xs">
              Ingresa tus credenciales para acceder a tu panel personalizado.
            </p>
          </div>

          {/* Mostrar error si falla la llamada al API */}
          {errorMessage && (
            <ErrorMessage message={errorMessage} />
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Input Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold uppercase text-slate-400 tracking-wider block">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="ejemplo@clubapp.com"
                {...register('email')}
                className={`w-full bg-slate-900 border ${
                  errors.email ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                } rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                  errors.email ? 'focus:ring-rose-500/20' : 'focus:ring-indigo-500/20'
                } transition`}
              />
              {errors.email && (
                <p className="text-xs text-rose-400 font-semibold">{errors.email.message}</p>
              )}
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-bold uppercase text-slate-400 tracking-wider block">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className={`w-full bg-slate-900 border ${
                  errors.password ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                } rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                  errors.password ? 'focus:ring-rose-500/20' : 'focus:ring-indigo-500/20'
                } transition`}
              />
              {errors.password && (
                <p className="text-xs text-rose-400 font-semibold">{errors.password.message}</p>
              )}
            </div>

            {/* Botón de Submit con Spinner */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-750 hover:to-indigo-750 active:from-blue-800 active:to-indigo-800 text-white font-bold rounded-xl text-sm shadow-lg hover:shadow-indigo-650/20 hover:scale-[1.01] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Validando credenciales...</span>
                </>
              ) : (
                <span>Ingresar al Club</span>
              )}
            </button>
          </form>

          {/* --- ACCESOS DIRECTOS DE PRUEBA RÁPIDA --- */}
          <div className="border-t border-slate-800/80 pt-6 space-y-3">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                ⚡ Acceso de Pruebas de Desarrollo
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickLogin('admin')}
                className="py-1.5 px-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-[10px] font-bold text-blue-400 transition cursor-pointer"
              >
                ADMIN
              </button>
              <button
                onClick={() => handleQuickLogin('coach')}
                className="py-1.5 px-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-[10px] font-bold text-indigo-400 transition cursor-pointer"
              >
                COACH
              </button>
              <button
                onClick={() => handleQuickLogin('athlete')}
                className="py-1.5 px-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-[10px] font-bold text-emerald-400 transition cursor-pointer"
              >
                ATLETA
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
