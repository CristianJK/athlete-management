# ClubApp — Guía de Desarrollo Frontend

> **Para agentes de IA:** Este archivo es la guía completa del frontend de ClubApp.
> El desarrollador conoce los fundamentos de React (componentes, props, useState) pero está aprendiendo conceptos intermedios como hooks personalizados, React Router, Zustand y Axios.
> **Tu rol es de tutor:** explica cada concepto nuevo con una analogía simple ANTES de mostrar el código. Usa comparaciones del estilo "antes hacíamos X, ahora con Y hacemos Z". No asumas conocimiento de TypeScript avanzado, Axios ni estado global. Sigue el orden del checklist sin saltarte fases.

---

## Contexto del Proyecto

**ClubApp** es una app web y móvil (PWA) para gestión de clubes deportivos.
El backend **ya está 100% terminado**: es una API REST en Laravel 13 con PostgreSQL.
El frontend se construye en **React** y debe funcionar bien en escritorio y móvil.

### Lo que ya existe — La API de Laravel
- ✅ Autenticación con Laravel Sanctum (tokens tipo Bearer)
- ✅ Módulos completos: Deportistas, Asistencia/QR, Pagos, Eventos, Notificaciones
- ✅ Documentación disponible en `/api/docs` (Scramble/OpenAPI)
- ✅ Todas las respuestas siguen esta estructura:
  ```json
  {
    "data": { ... },
    "message": "Operación exitosa",
    "errors": null
  }
  ```
- ✅ Todas las rutas bajo el prefijo `/api/v1/`
- ✅ El token va en cada petición así: `Authorization: Bearer {token}`

### Lo que vamos a construir — El Frontend
Una Single Page Application (SPA) en React que:
- Consume esa API con Axios
- Tiene rutas protegidas según el rol del usuario
- Sigue el diseño del mockup de Stitch
- Funciona como PWA (instalable en móvil)

---

## Cómo usar el Mockup de Stitch

> 💡 El mockup de Stitch es tu referencia visual. Antes de construir cada pantalla, mira la captura correspondiente y úsala como guía. No tienes que replicarla pixel a pixel — lo importante es la estructura y los elementos que contiene.
> 
> 🔗 **Enlace oficial del proyecto en Stitch:** [Stitch Mockup - ClubApp](https://stitch.withgoogle.com/projects/14480592572840340665)

### 🎨 Guía del Sistema de Diseño (Extraído de Stitch)

> [!IMPORTANT]
> Si cambias de agente de IA o necesitas reanudar el desarrollo en otra sesión, esta sección contiene la **identidad visual exacta** del proyecto para mantener la coherencia sin necesidad de volver a abrir el navegador.

#### 1. Paleta de Colores
*   **Azul Primario (Deep Navy):** `#1A3C6E` (Fondo del sidebar, headers, botones principales).
    *   *Tailwind equivalente:* Puedes usar colores de acento personalizados o mapearlos a clases con colores HSL/Hex en el archivo CSS global (`bg-[#1A3C6E]`, `text-[#1A3C6E]`).
*   **Verde Acento (Neon Green):** `#39D353` (Badges de "Activo"/"Pagado", scanner de QR, acentos de éxito).
    *   *Tailwind equivalente:* `bg-[#39D353]`.
*   **Naranja/Marrón de Advertencia (Amber):** `#5E3100` / `#F59E0B` (Estados pendientes, advertencias de mora).
    *   *Tailwind equivalente:* `text-[#5E3100]` o tonos amber/naranja premium.
*   **Rojo Alerta (Rose/Red):** `#F43F5E` / `#E11D48` (Estados inactivos, rechazados, cancelaciones, cierre de sesión).
*   **Gris Neutro (Slate/Gray):** Textos secundarios `#76777B` (Slate-500) y bordes `#E2E8F0` (Slate-200).
*   **Fondo de la App:** Fondo claro premium `#F4F6F9` (Slate-50) y fondo oscuro `#0F172A` (Slate-900).

#### 2. Tipografía y Micro-Interacciones
*   **Fuente:** **Inter** (debe importarse en `index.css`).
*   **Tamaños:** Títulos (`text-2xl` o `text-3xl` con `font-extrabold`), textos base (`text-sm` o `text-base`), etiquetas y badges (`text-xs` con `font-semibold`).
*   **Efecto Hover:** Micro-animaciones en botones y tarjetas (`transition-all duration-200 hover:scale-[1.01] hover:shadow-md`).

#### 3. Estructuras Visuales Clave
*   **Contenedores y Tarjetas:** Esquinas muy redondeadas (`rounded-xl` y `rounded-2xl`), fondo blanco sólido o pizarra oscuro, bordes delgados (`border border-slate-100` o `border-slate-800`), sombras flotantes (`shadow-sm` o `shadow-md`).
*   **Badges tipo "Píldora":** Relleno de color con opacidad del 10% y texto con opacidad del 100% (ej. `bg-emerald-500/10 text-emerald-500 font-semibold px-2.5 py-0.5 rounded-full text-xs`). Esto da un look sumamente moderno y limpio.
*   **Sidebar (Admin/Coach):** Fondo azul sólido `#1A3C6E` con íconos vectoriales simples en blanco, textos en gris claro, y el botón del menú activo resaltado con un fondo sutil semi-transparente o un borde izquierdo de color verde acento `#39D353`.
*   **Bottom Nav (Athlete - Móvil):** Barra inferior flotante blanca o pizarra, acentos de selección en azul primario, optimizado para pulgares.

### Cómo trabajar con las capturas en cada fase

Cuando vayas a construir una pantalla, haz esto:

1. **Abre la captura de Stitch** de esa pantalla
2. **Identifica los bloques** principales: ¿hay un formulario? ¿una tabla? ¿tarjetas? ¿un sidebar?
3. **Escribe en comentarios** dentro del componente qué sección estás construyendo
4. **Construye de afuera hacia adentro**: primero el contenedor, luego las secciones, luego los detalles

### Cómo darle el mockup a un agente de IA (Cursor, Claude Code, etc.)

Si tienes **capturas PNG/JPG**, pégalas directamente en el chat del agente con este mensaje:
```
Esta es la captura del mockup de [nombre de la pantalla].
Construye el componente React siguiendo este diseño.
Usa Tailwind CSS para los estilos.
La paleta de colores es: azul primario #1A3C6E, verde acento #39D353.
```

Si tienes **link de Stitch**, compártelo con:
```
Este es el link del mockup en Stitch: https://stitch.withgoogle.com/projects/14480592572840340665
Construye el componente React de la pantalla [nombre].
```

### Pantallas del mockup y su fase correspondiente

| Pantalla en Stitch | Fase en este documento |
|--------------------|----------------------|
| Login | Fase 8 |
| Dashboard (Admin) | Fase 9 |
| Dashboard (Coach) | Fase 9 |
| Dashboard (Athlete) | Fase 9 |
| Lista de Deportistas | Fase 10 |
| Perfil de Deportista | Fase 10 |
| Formulario de Deportista | Fase 10 |
| Generador QR | Fase 11 |
| Scanner QR | Fase 11 |
| Lista de Asistencia | Fase 11 |
| Pagos | Fase 12 |
| Calendario de Eventos | Fase 13 |
| Detalle de Evento | Fase 13 |
| Notificaciones | Fase 14 |
| Reportes | Fase 15 |
| Configuración | Fase 16 |

---

## Stack Frontend — Qué usamos y por qué

| Herramienta | Para qué sirve | Por qué la elegimos |
|-------------|----------------|---------------------|
| **React 19** | Construir la interfaz con componentes | Ya lo conoces |
| **Vite** | Servidor de desarrollo ultra rápido | Más rápido que Create React App |
| **TypeScript** | Le agrega "tipos" a JavaScript | Evita errores antes de ejecutar |
| **React Router v6** | Navegación entre páginas sin recargar | Estándar para SPAs |
| **Zustand** | Guardar quién está logueado globalmente | Más simple que Redux |
| **Axios** | Hacer peticiones HTTP a la API | Mucho más cómodo que `fetch` |
| **React Hook Form + Zod** | Formularios con validación | Menos código, más control |
| **Tailwind CSS** | Estilos con clases utilitarias | Sin escribir archivos CSS separados |
| **shadcn/ui** | Componentes visuales listos (botones, modals, etc.) | Accesibles y personalizables |
| **qrcode.react** | Generar el código QR de la sesión | Simple y funciona directo |
| **react-qr-reader** | Leer QR con la cámara del móvil | Para que el deportista registre asistencia |
| **Recharts** | Gráficas del dashboard | Fácil de integrar con React |
| **react-big-calendar** | Calendario visual de eventos | Listo para usar con vistas mes/semana/día |
| **vite-plugin-pwa** | Convertir la app en PWA instalable | Para móvil sin pasar por app store |

---

## El concepto más importante: cómo fluye la información

Antes de escribir una sola línea de código, entiende este flujo. Todo el frontend lo sigue:

```
[Usuario hace algo en la pantalla]
        ↓
[Componente React llama a una función del módulo api/]
        ↓
[Axios envía la petición HTTP con el token automáticamente]
        ↓
[La API de Laravel responde con { data, message, errors }]
        ↓
[El componente actualiza su estado con useState]
        ↓
[React re-renderiza y muestra los nuevos datos]
```

---

## Por qué usamos Axios y no fetch

> 💡 **Analogía:** `fetch` es como mandar una carta a mano: cada vez tienes que escribir el sobre, poner el remitente, agregar el sello, ir al correo. Axios es como tener un servicio de mensajería ya configurado: tú solo dices "envía esto a la API" y él ya sabe la dirección, agrega el token, y te avisa si algo falló.

### fetch puro — lo que tendrías que repetir en CADA llamada
```javascript
const response = await fetch('http://localhost:8000/api/v1/athletes', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,   // repetir en cada llamada
    'Content-Type': 'application/json',   // repetir en cada llamada
    'Accept': 'application/json',         // repetir en cada llamada
  }
})
if (!response.ok) throw new Error('Algo salió mal')
const data = await response.json()
```

### Con Axios — configuras UNA VEZ, funciona en toda la app
```javascript
// src/api/axios.ts — se configura una sola vez
const api = axios.create({ baseURL: 'http://localhost:8000/api/v1' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}` // automático
  return config
})

// Desde cualquier parte de la app, simplemente:
const { data } = await api.get('/athletes')            // limpio
const { data } = await api.post('/payments', payload)  // igual de limpio
```

---

## Por qué usamos TypeScript

> 💡 **Analogía:** JavaScript es como un formulario en blanco — puedes escribir lo que quieras. TypeScript es como un formulario con campos definidos: si la API te manda `nombre` pero tú esperas `name`, TypeScript te avisa antes de que la app se rompa en producción.

```typescript
// Sin TypeScript — no sabes qué viene y cualquier typo pasa desapercibido
const athlete = await getAthlete(1)
console.log(athlete.nmae) // error de tipeo, nadie te avisa

// Con TypeScript — defines la forma de los datos
interface Athlete {
  id: number
  name: string
  status: 'active' | 'inactive' | 'suspended'
}
const athlete: Athlete = await getAthlete(1)
console.log(athlete.nmae) // TypeScript avisa: "nmae no existe, ¿quisiste decir name?"
```

---

## Estructura de Carpetas — explicada

```
frontend/
│
├── public/
│   ├── manifest.json       # Cómo se ve la app cuando se instala en el móvil
│   └── icons/              # Íconos de la app (como los de una app nativa)
│
├── src/
│   │
│   ├── api/                ← AQUÍ van todas las llamadas a la API de Laravel
│   │   ├── axios.ts        # La instancia base: URL, token automático, manejo de errores
│   │   ├── auth.api.ts     # login(), logout(), getMe()
│   │   ├── athletes.api.ts # getAthletes(), createAthlete(), etc.
│   │   ├── attendance.api.ts
│   │   ├── payments.api.ts
│   │   ├── events.api.ts
│   │   └── notifications.api.ts
│   │
│   ├── components/
│   │   ├── ui/             ← Componentes base de shadcn (Button, Input, Modal...)
│   │   └── shared/         ← Componentes propios que se usan en varias pantallas
│   │       ├── StatusBadge.tsx       # "Activo"/"Inactivo"/"Suspendido" con colores
│   │       ├── PaymentBadge.tsx      # "Pagado"/"Pendiente"/"En mora" con colores
│   │       ├── AthleteCard.tsx       # Tarjeta resumen de un deportista
│   │       ├── EventCard.tsx         # Tarjeta de un evento
│   │       ├── ProtectedRoute.tsx    # Guardia de autenticación y rol
│   │       ├── LoadingSpinner.tsx    # Indicador de carga
│   │       └── ErrorMessage.tsx     # Mensaje de error reutilizable
│   │
│   ├── features/           ← Un módulo por cada sección grande de la app
│   │   ├── auth/           # Login y logout
│   │   ├── athletes/       # Deportistas (lista, perfil, formulario)
│   │   ├── attendance/     # QR y asistencia
│   │   ├── payments/       # Pagos y mensualidades
│   │   └── events/         # Eventos del club
│   │
│   ├── hooks/              ← Lógica reutilizable que no es componente ni API
│   │   └── useNotifications.ts
│   │
│   ├── layouts/            ← El "esqueleto" visual según el rol
│   │   ├── AdminLayout.tsx   # Sidebar + header completo
│   │   ├── CoachLayout.tsx   # Sidebar reducido
│   │   └── AthleteLayout.tsx # Bottom nav optimizado para móvil
│   │
│   ├── store/              ← Estado global (quién está logueado)
│   │   ├── authStore.ts      # user, token, isAuthenticated
│   │   └── notificationStore.ts
│   │
│   ├── types/              ← La "forma" de los datos que vienen de la API
│   │   ├── auth.types.ts
│   │   ├── athlete.types.ts
│   │   ├── payment.types.ts
│   │   ├── event.types.ts
│   │   └── attendance.types.ts
│   │
│   ├── utils/              ← Funciones pequeñas de apoyo
│   │   ├── formatDate.ts     # "2026-05-17" → "17 de mayo de 2026"
│   │   ├── formatCurrency.ts # 50000 → "$50.000"
│   │   └── constants.ts      # Labels, colores, textos fijos
│   │
│   ├── App.tsx             ← Define todas las rutas de la app
│   └── main.tsx            ← Punto de entrada (casi nunca se toca)
│
├── .env                    # Variables de entorno — NO va al repositorio
├── .env.example            # Plantilla de variables — SÍ va al repositorio
├── vite.config.ts
└── tsconfig.json
```

---

## Convenciones de Código

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Componente React | PascalCase | `AthleteCard.tsx` |
| Hook personalizado | prefijo `use` | `useAthletes.ts` |
| Archivo de API | sufijo `.api.ts` | `athletes.api.ts` |
| Tipos TypeScript | sufijo `.types.ts` | `athlete.types.ts` |
| Store Zustand | sufijo `Store` | `authStore.ts` |
| Utilidades | camelCase | `formatDate.ts` |

**Regla de oro:** un componente = un archivo. No pongas dos componentes en el mismo archivo.

---

## Checklist de Desarrollo

> Sigue el orden. Cada fase construye sobre la anterior.
> Marca con `[x]` al completar cada ítem.
> Si algo no funciona, no avances a la siguiente fase.

---

### FASE 1 — Instalación y Configuración Base

> 🎯 **Qué logras aquí:** Ver la app corriendo en el navegador con la estructura lista y los estilos funcionando. Nada de lógica todavía — solo el andamiaje.

#### Crear el proyecto
- [x] Ejecutar en la terminal (en la carpeta raíz del proyecto):
  ```bash
  npm create vite@latest frontend -- --template react-ts
  cd frontend
  npm install
  npm run dev
  ```
- [x] Verificar que se ve la pantalla de Vite en `http://localhost:5173`
- [ ] Limpiar los archivos de ejemplo:
  - `src/App.tsx` → dejar solo: `export default function App() { return <h1>ClubApp ✅</h1> }`
  - `src/App.css` → borrar todo el contenido
  - `src/index.css` → borrar todo el contenido

#### Instalar dependencias
- [ ] Tailwind CSS:
  ```bash
  npm install tailwindcss @tailwindcss/vite
  ```
- [ ] Componentes UI (shadcn):
  ```bash
  npx shadcn@latest init
  ```
  > Cuando pregunte: framework → Vite, color → Slate, CSS variables → Yes
- [ ] Navegación y estado global:
  ```bash
  npm install react-router-dom zustand
  ```
- [ ] Formularios y validación:
  ```bash
  npm install react-hook-form zod @hookform/resolvers
  ```
- [ ] HTTP client:
  ```bash
  npm install axios
  ```
- [ ] QR:
  ```bash
  npm install qrcode.react react-qr-reader
  ```
- [ ] UI avanzada:
  ```bash
  npm install recharts react-big-calendar date-fns react-hot-toast
  npm install @types/react-big-calendar --save-dev
  ```
- [ ] PWA:
  ```bash
  npm install vite-plugin-pwa --save-dev
  ```

#### Configurar Tailwind
- [ ] Actualizar `vite.config.ts`:
  ```ts
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  import tailwindcss from '@tailwindcss/vite'

  export default defineConfig({
    plugins: [react(), tailwindcss()],
  })
  ```
- [ ] Agregar al inicio de `src/index.css`:
  ```css
  @import "tailwindcss";
  ```
- [ ] Probar Tailwind: cambiar `App.tsx` a:
  ```tsx
  export default function App() {
    return <h1 className="text-3xl font-bold text-blue-900 p-8">ClubApp ✅</h1>
  }
  ```
  Si el texto se ve azul oscuro y grande, Tailwind funciona correctamente.

#### Variables de entorno
- [ ] Crear `frontend/.env`:
  ```
  VITE_API_URL=http://localhost:8000/api/v1
  ```
- [ ] Crear `frontend/.env.example` con el mismo contenido
- [ ] Verificar que `.env` está en `.gitignore`

#### Configurar PWA
- [ ] Agregar a `vite.config.ts`:
  ```ts
  import { VitePWA } from 'vite-plugin-pwa'

  // agregar dentro de plugins[]:
  VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'ClubApp',
      short_name: 'ClubApp',
      theme_color: '#1A3C6E',
      background_color: '#F4F6F9',
      display: 'standalone',
      start_url: '/',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
      ]
    }
  })
  ```
- [ ] Crear carpeta `public/icons/` y agregar íconos en PNG (192×192 y 512×512)

#### Crear estructura de carpetas vacía
- [ ] Crear dentro de `src/`:
  ```
  api/   components/shared/   features/auth/   features/athletes/
  features/attendance/   features/payments/   features/events/
  hooks/   layouts/   store/   types/   utils/
  ```

---

### FASE 2 — Tipos TypeScript del Dominio

> 🎯 **Qué logras aquí:** Definir la "forma" de los datos antes de usarlos. Es el plano del edificio: primero defines qué datos hay, luego construyes todo lo que los usa.

- [ ] Crear `src/types/auth.types.ts`:
  ```ts
  export type UserRole = 'admin' | 'coach' | 'athlete'

  export interface User {
    id: number
    name: string
    email: string
    role: UserRole
    avatar?: string
  }

  export interface AuthResponse {
    data: { token: string; user: User }
    message: string
  }
  ```

- [ ] Crear `src/types/athlete.types.ts`:
  ```ts
  export type AthleteStatus = 'active' | 'inactive' | 'suspended'

  export interface EmergencyContact {
    name: string
    phone: string
    relationship: string
  }

  export interface Athlete {
    id: number
    name: string
    document_number: string
    document_type: string
    birthdate: string
    gender: string
    phone: string
    email: string
    address: string
    sport: string
    group_name: string
    status: AthleteStatus
    joined_at: string
    emergency_contact: EmergencyContact
    habeas_data_accepted: boolean
    habeas_data_accepted_at?: string
  }

  export type CreateAthleteDto = Omit<Athlete, 'id' | 'joined_at' | 'habeas_data_accepted' | 'habeas_data_accepted_at'>
  ```

- [ ] Crear `src/types/payment.types.ts`:
  ```ts
  export type PaymentStatus = 'paid' | 'pending' | 'overdue'

  export interface Payment {
    id: number
    athlete_id: number
    athlete_name: string
    amount: number
    period_month: number
    period_year: number
    due_date: string
    paid_at?: string
    payment_method?: string
    status: PaymentStatus
    receipt_url?: string
    notes?: string
  }

  export interface PaymentSummary {
    total_collected: number
    total_pending: number
    total_overdue: number
    overdue_count: number
  }
  ```

- [ ] Crear `src/types/event.types.ts`:
  ```ts
  export type EventType = 'training' | 'tournament' | 'meeting' | 'other'
  export type EventStatus = 'upcoming' | 'ongoing' | 'finished' | 'cancelled'
  export type RSVPStatus = 'confirmed' | 'cancelled' | 'pending'

  export interface ClubEvent {
    id: number
    title: string
    description: string
    type: EventType
    location: string
    starts_at: string
    ends_at: string
    max_attendees?: number
    status: EventStatus
    attendees_count: number
    my_rsvp?: RSVPStatus
  }
  ```

- [ ] Crear `src/types/attendance.types.ts`:
  ```ts
  export interface AttendanceSession {
    id: number
    name: string
    qr_token: string
    expires_at: string
    group_name: string
    checked_in_count: number
  }

  export type CheckInMethod = 'qr' | 'manual'

  export interface AttendanceRecord {
    id: number
    athlete_id: number
    athlete_name: string
    session_name: string
    checked_in_at: string
    method: CheckInMethod
  }
  ```

---

### FASE 3 — Configuración de Axios

> 🎯 **Qué logras aquí:** El "mensajero" configurado que sabe hablar con la API con token automático y manejo de errores centralizado.
>
> 💡 **Concepto nuevo — Interceptores:** Son funciones que se ejecutan automáticamente en cada petición o respuesta, sin que tú las llames. Como un peaje automático: cada vez que pasa un auto (petición), el sistema le agrega el token sin que tengas que hacerlo manualmente.

- [ ] Crear `src/api/axios.ts`:
  ```ts
  import axios from 'axios'

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  })

  // Antes de cada petición: agrega el token si existe
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  // Después de cada respuesta: si el token venció (401), manda al login
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )

  export default api
  ```

- [ ] Crear `src/api/auth.api.ts`:
  ```ts
  import api from './axios'
  import type { AuthResponse, User } from '../types/auth.types'

  export const loginApi = async (credentials: { email: string; password: string }) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials)
    return response.data
  }

  export const logoutApi = async () => {
    await api.post('/auth/logout')
  }

  export const getMeApi = async (): Promise<{ data: User }> => {
    const response = await api.get('/auth/me')
    return response.data
  }
  ```

- [ ] Crear `src/api/athletes.api.ts` con funciones:
  `getAthletes(filters?)`, `getAthlete(id)`, `createAthlete(data)`, `updateAthlete(id, data)`, `changeAthleteStatus(id, status)`

- [ ] Crear `src/api/attendance.api.ts` con funciones:
  `createSession(data)`, `getSession(id)`, `checkIn(token)`, `manualCheckIn(sessionId, athleteId)`, `getRecords(filters?)`

- [ ] Crear `src/api/payments.api.ts` con funciones:
  `getPayments(filters?)`, `registerPayment(data)`, `getPaymentSummary()`, `downloadReceipt(id)`

- [ ] Crear `src/api/events.api.ts` con funciones:
  `getEvents(filters?)`, `getEvent(id)`, `createEvent(data)`, `updateEvent(id, data)`, `rsvp(eventId, status)`

- [ ] Crear `src/api/notifications.api.ts` con funciones:
  `getNotifications()`, `markAsRead(id)`, `markAllAsRead()`

- [ ] **Prueba rápida:** Abrir consola del navegador y verificar que Axios puede hablar con la API (importar y llamar `getMeApi()` desde la consola de DevTools).

---

### FASE 4 — Estado Global con Zustand

> 🎯 **Qué logras aquí:** Un "pizarrón central" donde cualquier componente puede leer quién está logueado, sin tener que pasar props de padre a hijo en cadena.
>
> 💡 **El problema que resuelve — Prop Drilling:**
> Imagina que tienes el usuario en `App.tsx` y lo necesitas en `Sidebar → NavItem → Avatar`.
> Sin Zustand: tienes que pasarlo como prop en cada nivel (4 veces).
> Con Zustand: `Avatar` lo lee directamente del store. Nadie más tiene que pasarlo.

- [ ] Crear `src/store/authStore.ts`:
  ```ts
  import { create } from 'zustand'
  import { persist } from 'zustand/middleware'
  import type { User } from '../types/auth.types'

  interface AuthStore {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    setAuth: (user: User, token: string) => void
    logout: () => void
  }

  export const useAuthStore = create<AuthStore>()(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        setAuth: (user, token) => {
          localStorage.setItem('token', token)
          set({ user, token, isAuthenticated: true })
        },
        logout: () => {
          localStorage.removeItem('token')
          set({ user: null, token: null, isAuthenticated: false })
        },
      }),
      { name: 'clubapp-auth' }
    )
  )
  ```

- [ ] Crear `src/store/notificationStore.ts` con estado `unreadCount` y acciones `setUnreadCount`, `decreaseUnread`
- [ ] **Prueba:** Usar el store en `App.tsx` temporalmente y confirmar que persiste al recargar la página

---

### FASE 5 — Utilidades y Componentes Compartidos Base

> 🎯 **Qué logras aquí:** Las piezas pequeñas que se usan en todas las pantallas. Conviene crearlas antes que las páginas.

- [ ] Crear `src/utils/constants.ts` con labels para status, tipos de evento y métodos de pago
- [ ] Crear `src/utils/formatDate.ts` con `formatDate()` y `formatTime()`
- [ ] Crear `src/utils/formatCurrency.ts` con `formatCurrency()` para pesos colombianos
- [ ] Crear `src/components/shared/LoadingSpinner.tsx`
- [ ] Crear `src/components/shared/ErrorMessage.tsx`
- [ ] Crear `src/components/shared/StatusBadge.tsx` — verde/gris/rojo según estado del deportista
- [ ] Crear `src/components/shared/PaymentBadge.tsx` — verde/naranja/rojo según estado del pago
- [ ] Crear `src/components/shared/AthleteCard.tsx` — avatar, nombre, deporte, StatusBadge
- [ ] Crear `src/components/shared/EventCard.tsx` — título, fecha, lugar, badge de tipo

---

### FASE 6 — Rutas y ProtectedRoute

> 🎯 **Qué logras aquí:** La app navega entre pantallas sin recargar, y protege las rutas privadas.
>
> 💡 **Concepto nuevo — React Router:** Permite cambiar lo que se muestra según la URL, sin recargar la página. Es lo que convierte la app en una SPA.
>
> 💡 **Concepto nuevo — ProtectedRoute:** Un componente "guardia" que antes de mostrar una página pregunta: ¿estás logueado? ¿tienes el rol correcto? Si no, te manda al login.

- [ ] Crear `src/components/shared/ProtectedRoute.tsx`:
  ```tsx
  import { Navigate } from 'react-router-dom'
  import { useAuthStore } from '../../store/authStore'
  import type { UserRole } from '../../types/auth.types'

  interface Props {
    children: React.ReactNode
    allowedRoles?: UserRole[]
  }

  export function ProtectedRoute({ children, allowedRoles }: Props) {
    const { isAuthenticated, user } = useAuthStore()

    if (!isAuthenticated) return <Navigate to="/login" replace />

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      return <Navigate to="/dashboard" replace />
    }

    return <>{children}</>
  }
  ```

- [ ] Crear `src/App.tsx` con rutas completas:
  - Pública: `/login`
  - Protegidas (todos): `/dashboard`, `/events`, `/notifications`
  - Protegidas (admin + coach): `/athletes`, `/athletes/:id`, `/attendance`
  - Protegidas (solo admin): `/payments`, `/reports`, `/settings`
  - Fallback: `*` → `/dashboard`

- [ ] Verificar que `/dashboard` sin token redirige a `/login`
- [ ] Verificar que un coach intenta entrar a `/payments` y es redirigido a `/dashboard`

---

### FASE 7 — Layouts por Rol

> 🎯 **Qué logras aquí:** El "esqueleto" visual que rodea cada pantalla según el rol.
>
> 💡 **Concepto nuevo — Layout y Outlet:** El Layout es el marco permanente (sidebar, header). `<Outlet />` es el hueco donde React Router inyecta la página actual. El marco se queda, la página dentro cambia.

- [ ] Crear `src/layouts/AdminLayout.tsx`:
  - Sidebar fijo (240px): logo, links de navegación con íconos, info del usuario abajo
  - Header: título de página, búsqueda global, campana de notificaciones, avatar con dropdown
  - Área de contenido: `<Outlet />`
  - En móvil (< 768px): sidebar oculto con menú hamburguesa

- [ ] Crear `src/layouts/CoachLayout.tsx`:
  - Igual al AdminLayout pero sin Pagos, Reportes y Configuración en el sidebar

- [ ] Crear `src/layouts/AthleteLayout.tsx` (optimizado para móvil):
  - Header simple: nombre del club + avatar
  - Bottom navigation bar: Inicio | QR | Eventos | Perfil
  - En desktop: sidebar vertical en lugar de bottom nav

- [ ] Actualizar `App.tsx` para anidar las rutas dentro del layout correspondiente:
  ```tsx
  <Route element={<AdminLayout />}>
    <Route path="/dashboard" element={<ProtectedRoute>...</ProtectedRoute>} />
    {/* etc. */}
  </Route>
  ```

---

### FASE 8 — Módulo de Autenticación

> 🎯 **Qué logras aquí:** Login funcional que guarda el token y redirige según el rol.
>
> 💡 **Concepto nuevo — Custom Hook:** Un custom hook es una función que empieza con `use` y guarda la lógica (llamadas a la API, manejo de errores, estados de carga). El componente solo se encarga de mostrar cosas — el hook hace el trabajo pesado.

- [ ] Crear `src/features/auth/useAuth.ts`:
  ```ts
  import { useState } from 'react'
  import { useNavigate } from 'react-router-dom'
  import { loginApi, logoutApi } from '../../api/auth.api'
  import { useAuthStore } from '../../store/authStore'

  export function useAuth() {
    const { setAuth, logout: clearAuth } = useAuthStore()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const login = async (email: string, password: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await loginApi({ email, password })
        setAuth(response.data.user, response.data.token)
        navigate('/dashboard')
      } catch (err: any) {
        setError(err.response?.data?.message || 'Credenciales incorrectas')
      } finally {
        setLoading(false)
      }
    }

    const logout = async () => {
      await logoutApi().catch(() => {}) // silenciar error si el token ya expiró
      clearAuth()
      navigate('/login')
    }

    return { login, logout, loading, error }
  }
  ```

- [ ] Crear `src/features/auth/LoginPage.tsx` siguiendo el mockup de Stitch:
  - Desktop: panel izquierdo con gradiente azul (#1A3C6E) y logo, panel derecho con formulario
  - Móvil: solo el formulario centrado
  - Formulario con React Hook Form + validación Zod
  - Botón "Ingresar" con spinner mientras carga
  - Mensaje de error en rojo si falla
  - Link "¿Olvidaste tu contraseña?" (sin funcionalidad aún)
  - Link de Política de Privacidad en el footer

- [ ] Verificar el flujo completo: login exitoso → dashboard, credenciales incorrectas → mensaje de error, recargar página → sigue logueado

---

### FASE 9 — Dashboard

> 🎯 **Qué logras aquí:** Pantalla de inicio con métricas personalizadas según el rol del usuario.

- [ ] Crear `src/pages/DashboardPage.tsx` con contenido diferente por rol:
  - **Admin:** 4 tarjetas KPI + gráfica de asistencia mensual (Recharts) + próximos eventos + acciones rápidas
  - **Coach:** Mis sesiones de hoy + deportistas en mis grupos + próximos eventos
  - **Athlete:** Mi asistencia del mes + estado de mi pago + próximo evento
- [ ] Conectar métricas con endpoints de resumen de la API
- [ ] Agregar acciones rápidas según rol: "Generar QR" (coach/admin), "Agregar Deportista" (admin), "Nuevo Evento" (admin)

---

### FASE 10 — Módulo Deportistas

> 🎯 **Qué logras aquí:** CRUD completo de deportistas con tabla, perfil y formulario + Habeas Data.

- [ ] Crear `src/features/athletes/useAthletes.ts`:
  - Estado: `athletes`, `loading`, `error`, `totalPages`, `currentPage`
  - Funciones: `fetchAthletes(filters)`, `updateStatus(id, status)`
  - Llama a `athletes.api.ts`

- [ ] Crear `src/features/athletes/AthletesPage.tsx` siguiendo el mockup:
  - Buscador + filtros (estado, deporte/grupo) + botón "Agregar Deportista"
  - Tabla: Avatar+Nombre, Documento, Deporte, Estado, Fecha ingreso, Acciones
  - Paginación

- [ ] Crear `src/features/athletes/AthleteProfilePage.tsx` siguiendo el mockup:
  - Encabezado con foto, nombre, deporte y StatusBadge
  - Tabs: Info Personal | Contacto de Emergencia | Historial de Pagos | Historial de Asistencia
  - Sección Habeas Data: estado y fecha de consentimiento

- [ ] Crear `src/features/athletes/AthleteForm.tsx`:
  - Sección 1: datos personales
  - Sección 2: datos de emergencia
  - Modal de Habeas Data obligatorio antes de guardar
  - Funciona para crear y editar

---

### FASE 11 — Módulo Asistencia y QR

> 🎯 **Qué logras aquí:** Generación de QR para sesiones y registro de asistencia por escaneo.

- [ ] Crear `src/features/attendance/QRGeneratorPage.tsx` (admin/coach):
  - Formulario: nombre de sesión, grupo, tiempo de expiración
  - QR generado con `qrcode.react`
  - Countdown del tiempo restante (useEffect + setInterval)
  - Lista en tiempo real de quién ya escaneó (polling cada 10 seg)
  - Botones: "Descargar QR", "Compartir"

- [ ] Crear `src/features/attendance/QRScannerPage.tsx` (athlete):
  - Solicitar permiso de cámara
  - Visor con `react-qr-reader`
  - Estado éxito: overlay verde + "Asistencia registrada" + hora
  - Estado error: overlay rojo + mensaje específico ("QR expirado", "Ya registraste hoy")
  - Botón "Reintentar"

- [ ] Crear `src/features/attendance/AttendancePage.tsx` (admin/coach):
  - Filtros: rango de fechas, sesión, deportista
  - Tabla de registros
  - Botón registro manual
  - Exportar PDF/Excel

---

### FASE 12 — Módulo Pagos

> 🎯 **Qué logras aquí:** Gestión de mensualidades con registro y seguimiento de estados.

- [ ] Crear `src/features/payments/PaymentsPage.tsx` siguiendo el mockup:
  - Selector de mes
  - 3 tarjetas resumen: Total cobrado / Pendientes / En mora
  - Tabla con PaymentBadge por fila
  - Filtros por estado y nombre

- [ ] Crear `src/features/payments/RegisterPaymentPanel.tsx`:
  - Panel lateral (drawer) que se desliza desde la derecha
  - Formulario: monto, periodo, método de pago, notas
  - Al guardar: cierra y actualiza la tabla

- [ ] Implementar descarga de recibo PDF (abre en nueva pestaña o descarga)

---

### FASE 13 — Módulo Eventos

> 🎯 **Qué logras aquí:** Calendario interactivo para ver y gestionar eventos del club.

- [ ] Crear `src/features/events/EventsPage.tsx` siguiendo el mockup:
  - Toggle: vista Calendario / vista Lista
  - Calendario con `react-big-calendar`, eventos coloreados por tipo
  - Botón "Nuevo Evento" (admin/coach)

- [ ] Crear `src/features/events/EventDetailPage.tsx`:
  - Datos del evento + sección RSVP para athletes
  - Lista de confirmados (admin/coach)
  - Botones Editar/Eliminar (admin/coach)

- [ ] Crear `src/features/events/EventForm.tsx`:
  - Campos: título, tipo, descripción, fechas, lugar, cupos
  - Validación: fecha fin > fecha inicio

---

### FASE 14 — Notificaciones

> 🎯 **Qué logras aquí:** Campana en el header con notificaciones en tiempo semi-real.
>
> 💡 **Concepto nuevo — Polling:** Como la API no "empuja" notificaciones, el frontend pregunta cada 30 segundos: "¿hay notificaciones nuevas?" Esto se implementa con `useEffect` + `setInterval`.

- [ ] Crear `src/hooks/useNotifications.ts` con polling cada 30 segundos
- [ ] Crear `src/components/shared/NotificationBell.tsx`:
  - Badge rojo con conteo de no leídas
  - Dropdown con las últimas 5 al hacer clic
  - Link "Ver todas"

- [ ] Crear `src/pages/NotificationsPage.tsx`:
  - Lista agrupada por fecha
  - Punto azul para no leídas
  - "Marcar todas como leídas"

---

### FASE 15 — Reportes (solo admin)

- [ ] Crear `src/pages/ReportsPage.tsx` con tabs: Asistencia | Pagos | Deportistas
- [ ] Cada tab: selector de fechas, filtros, tabla preview, botones exportar (PDF / Excel)
- [ ] Gráfica de tendencia con Recharts

---

### FASE 16 — Configuración (solo admin)

- [ ] Crear `src/pages/SettingsPage.tsx` con secciones:
  - Info del Club (nombre, logo, contacto)
  - Deportes y Grupos
  - Tarifas por grupo
  - Gestión de usuarios (admins y coaches)
  - Política de Habeas Data (texto editable)

---

### FASE 17 — Ajustes Finales y PWA

- [ ] Revisar todas las pantallas en 390px (móvil) y 1440px (desktop)
- [ ] Probar instalación PWA en Android (Chrome → "Agregar a pantalla de inicio")
- [ ] Probar instalación PWA en iOS (Safari → compartir → "Agregar a inicio")
- [ ] Verificar que QR Scanner pide permiso de cámara y funciona en móvil
- [ ] Agregar `react-hot-toast` para mensajes de éxito/error en todas las acciones
- [ ] Revisar accesibilidad: todos los inputs con label, suficiente contraste de colores
- [ ] Verificar que no hay errores en la consola del navegador

---

## Estado del Frontend

| Fase | Descripción | Estado |
|------|-------------|--------|
| Fase 1 | Instalación y configuración | ⬜ Pendiente |
| Fase 2 | Tipos TypeScript | ⬜ Pendiente |
| Fase 3 | Axios y capa API | ⬜ Pendiente |
| Fase 4 | Estado global Zustand | ⬜ Pendiente |
| Fase 5 | Componentes compartidos base | ⬜ Pendiente |
| Fase 6 | Rutas y ProtectedRoute | ⬜ Pendiente |
| Fase 7 | Layouts por rol | ⬜ Pendiente |
| Fase 8 | Autenticación | ⬜ Pendiente |
| Fase 9 | Dashboard | ⬜ Pendiente |
| Fase 10 | Módulo Deportistas | ⬜ Pendiente |
| Fase 11 | Módulo Asistencia y QR | ⬜ Pendiente |
| Fase 12 | Módulo Pagos | ⬜ Pendiente |
| Fase 13 | Módulo Eventos | ⬜ Pendiente |
| Fase 14 | Notificaciones | ⬜ Pendiente |
| Fase 15 | Reportes | ⬜ Pendiente |
| Fase 16 | Configuración | ⬜ Pendiente |
| Fase 17 | Ajustes finales y PWA | ⬜ Pendiente |

---

## Cómo pedir ayuda a un agente de IA para cada fase

```
Estoy desarrollando ClubApp (ver FRONTEND.md).
Voy a trabajar la [Fase X — Nombre].

Mi nivel de React: conozco componentes, props y useState. Estoy aprendiendo el resto.
Explícame el concepto nuevo antes del código, con una analogía simple.

La API de Laravel ya existe:
- URL base: http://localhost:8000/api/v1
- Token: Authorization: Bearer {token}
- Respuestas: { data, message, errors }
- Endpoint que necesito para esta fase: [describe cuál]

[Si tienes captura del mockup: adjunta la imagen aquí]
Construye el componente siguiendo este diseño con Tailwind CSS.
Paleta: azul #1A3C6E, verde #39D353.

Archivos listos:
- src/api/axios.ts ✅
- src/types/[módulo].types.ts ✅
- [lista lo que ya tienes]

Por favor:
1. Explica el concepto nuevo con analogía simple
2. Crea archivos en el orden correcto
3. Sigue las convenciones de nombres del proyecto
4. Muestra qué items del checklist quedan como [x] al terminar
```

---

> **Nota final para agentes de IA:** El desarrollador conoce componentes, props y useState, pero está aprendiendo hooks personalizados, React Router, Zustand y Axios. Explica siempre el "por qué" antes del "cómo". Usa analogías simples. Escribe código con comentarios cuando introduces algo nuevo. No te saltes fases ni des por sentado conocimiento intermedio.