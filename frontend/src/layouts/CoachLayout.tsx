import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

export default function CoachLayout() {
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Menú reducido para entrenadores (sin Pagos, Reportes y Configuración)
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
      </svg>
    )},
    { path: '/athletes', label: 'Deportistas', icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 01-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )},
    { path: '/attendance', label: 'Asistencia', icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { path: '/events', label: 'Eventos', icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
  ];

  const userInitials = user?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CH';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row font-sans text-slate-100">
      {/* --- SIDEBAR MÓVIL (HEADER EN PANTALLAS PEQUEÑAS) --- */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#1A3C6E] flex items-center justify-center font-bold text-slate-100 text-xs shadow border border-indigo-500/20">
            CA
          </div>
          <span className="font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent text-sm">
            ClubApp Coach
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-slate-200 transition cursor-pointer"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* --- SIDEBAR DESKTOP & MENÚ MÓVIL --- */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-60 bg-slate-900 border-r border-slate-850 flex flex-col justify-between p-4 z-10 transition-transform duration-300 md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0 pt-20 md:pt-4' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Logo */}
          <div className="hidden md:flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-xl bg-[#1A3C6E] flex items-center justify-center font-black text-slate-100 text-sm shadow-md border border-indigo-500/25">
              CA
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-tight text-slate-100">ClubApp</span>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Entrenadores</span>
            </div>
          </div>

          {/* Menú de Navegación */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#1A3C6E] text-white shadow-lg shadow-indigo-950/30 border-l-3 border-[#39D353]'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <span className={isActive ? 'text-[#39D353]' : 'text-slate-500 group-hover:text-slate-300'}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Info de Usuario Inferior */}
        <div className="border-t border-slate-800 pt-4 flex items-center justify-between px-2 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-750 flex items-center justify-center text-slate-300 font-black text-xs shrink-0">
              {userInitials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-200 truncate">{user?.name}</span>
              <span className="text-[10px] text-slate-500 truncate">{user?.email}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 hover:bg-rose-500/10 text-rose-500 hover:text-rose-400 rounded-lg transition shrink-0 cursor-pointer"
            title="Cerrar Sesión"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </aside>

      {/* --- PANEL DE CONTENIDO PRINCIPAL --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Desktop */}
        <header className="hidden md:flex bg-slate-900 border-b border-slate-850 h-16 shrink-0 items-center justify-between px-8 z-10">
          <h3 className="text-sm font-black text-slate-400 tracking-wider uppercase">
            {location.pathname.replace('/', '') || 'Dashboard'}
          </h3>

          <div className="flex items-center gap-6">
            {/* Campana de Notificaciones */}
            <Link to="/notifications" className="relative p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-emerald-500 rounded-full flex items-center justify-center text-[9px] font-black text-slate-950">
                  {unreadCount}
                </span>
              )}
            </Link>

            <span className="h-4 w-px bg-slate-800" />

            {/* Credencial Corta */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">Rol:</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                {user?.role}
              </span>
            </div>
          </div>
        </header>

        {/* Inyección de Páginas Hijas */}
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
