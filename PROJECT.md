# athlete-management — Documento Maestro de Desarrollo

> **Para agentes de IA:** Este archivo es la fuente de verdad del proyecto. Antes de generar cualquier código, lee este documento completo. Respeta el stack, la estructura de carpetas, las convenciones de nomenclatura y el orden del checklist. Marca cada tarea como completada (`[x]`) al terminarla.

---

## Visión General

**athlete-management** es una aplicación web y móvil para la gestión integral de clubes deportivos. Permite controlar la asistencia de deportistas mediante códigos QR, administrar el pago de mensualidades y programar eventos, todo bajo cumplimiento de la normativa de protección de datos personales (Habeas Data — Ley 1581 de 2012, Colombia).

### Roles de usuario
| Rol | Descripción |
|-----|-------------|
| `admin` | Dueño o administrador del club. Acceso total al sistema. |
| `coach` | Entrenador. Gestiona asistencia y consulta deportistas. |
| `athlete` | Deportista. Accede a su perfil, asistencia, pagos y eventos. |

---

## Stack Tecnológico

### Frontend
| Elemento | Tecnología | Versión |
|----------|------------|---------|
| Framework UI | React | 18+ |
| Mobile | React (PWA) | — |
| Routing | React Router | v6 |
| Estado global | Zustand | — |
| Estilos | Tailwind CSS | v3 |
| Componentes UI | shadcn/ui | — |
| QR Generator | qrcode.react | — |
| QR Scanner | react-qr-reader | — |
| Formularios | React Hook Form + Zod | — |
| HTTP client | Axios | — |
| Calendario | react-big-calendar | — |
| Tablas | TanStack Table v8 | — |
| Notificaciones | react-hot-toast | — |
| Gráficas | Recharts | — |
| PWA | Vite PWA Plugin | — |

### Backend
| Elemento | Tecnología | Versión |
|----------|------------|---------|
| Framework | Laravel | 13 |
| Lenguaje | PHP | 8.4+ |
| API | RESTful JSON API | — |
| Autenticación | Laravel Sanctum (JWT) | — |
| Autorización | Laravel Policies + Gates | — |
| QR Generation | bacon/bacon-qr-code | — |
| Email | Laravel Mail + Mailgun | — |
| Colas | Laravel Queues (Redis) | — |
| Almacenamiento | Laravel Storage (S3 o local) | — |
| Documentación API | Scramble (OpenAPI) | — |
| Testing | PHPUnit + Pest | — |

### Base de Datos
| Elemento | Tecnología |
|----------|------------|
| Motor | PostgreSQL 16 |
| ORM | Eloquent (Laravel) |
| Migraciones | Laravel Migrations |
| Seeders | Laravel Seeders / Factories |

### Infraestructura
| Elemento | Tecnología |
|----------|------------|
| Contenedores | Docker + Docker Compose |
| Web server | Nginx |
| Cache | Redis |
| Variables de entorno | `.env` (nunca en repositorio) |
| CI/CD | GitHub Actions |
| Hosting sugerido | Railway / Render / DigitalOcean |

---

## Estructura de Carpetas

```
clubapp/
├── backend/                        # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/    # Controladores REST
│   │   │   ├── Middleware/         # Auth, Role, HabeasData
│   │   │   └── Requests/           # Form Requests (validación)
│   │   ├── Models/                 # Modelos Eloquent
│   │   ├── Services/               # Lógica de negocio
│   │   ├── Policies/               # Autorización por rol
│   │   └── Notifications/          # Notificaciones email/push
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── factories/
│   ├── routes/
│   │   └── api.php                 # Todas las rutas de la API
│   ├── tests/
│   └── .env.example
│
├── frontend/                       # React App
│   ├── public/
│   │   └── manifest.json           # PWA manifest
│   ├── src/
│   │   ├── api/                    # Llamadas Axios por módulo
│   │   ├── components/
│   │   │   ├── ui/                 # Componentes base (shadcn)
│   │   │   └── shared/             # Componentes reutilizables
│   │   ├── features/               # Módulos por funcionalidad
│   │   │   ├── auth/
│   │   │   ├── athletes/
│   │   │   ├── attendance/
│   │   │   ├── payments/
│   │   │   └── events/
│   │   ├── hooks/                  # Custom hooks
│   │   ├── layouts/                # Layouts por rol
│   │   ├── pages/                  # Páginas por ruta
│   │   ├── store/                  # Zustand stores
│   │   ├── types/                  # TypeScript types/interfaces
│   │   └── utils/                  # Helpers y constantes
│   ├── index.html
│   └── vite.config.ts
│
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci.yml
└── PROJECT.md                      # Este archivo
```

---

## Convenciones
 db:s
- **Backend:** Controladores en PascalCase, métodos en camelCase, rutas en kebab-case, modelos en singular (`Athlete`, no `Athletes`).
- **Frontend:** Componentes en PascalCase, hooks con prefijo `use`, stores con sufijo `Store`, archivos de tipos con sufijo `.types.ts`.
- **API:** Todas las rutas bajo prefijo `/api/v1/`. Respuestas siempre con estructura `{ data, message, errors }`.
- **Git:** Ramas `main` (producción), `develop` (integración), `feature/nombre-feature`, `fix/nombre-fix`.
- **Commits:** Conventional Commits — `feat:`, `fix:`, `chore:`, `docs:`, `test:`.

---

## Checklist de Desarrollo

> Marca cada item con `[x]` al completarlo. Sigue el orden establecido.

---

### FASE 0 — Configuración del Entorno

#### Infraestructura base
- [x] Crear repositorio en GitHub con estructura monorepo (`backend/` y `frontend/`)
- [x] Crear `.gitignore` para Laravel y React
- [x] Configurar `docker-compose.yml` con servicios: `app` (PHP-FPM), `nginx`, `postgres`, `redis`
- [x] Crear `Dockerfile` para el backend Laravel
- [x] Verificar que `docker compose up` levanta todos los servicios correctamente
- [x] Configurar variables de entorno — copiar `.env.example` a `.env` en backend y frontend
- [x] Confirmar conexión exitosa a PostgreSQL desde Laravel (`php artisan db:show`)

#### Backend — Instalación
- [x] Instalar Laravel 13 en `/backend`
- [x] Instalar dependencias: `laravel/sanctum`, `bacon/bacon-qr-code`, `scramble` (docs API)
- [x] Configurar `config/database.php` para PostgreSQL
- [x] Publicar y configurar Laravel Sanctum
- [x] Configurar Laravel Queue con driver Redis
- [x] Configurar Laravel Storage (disco local para desarrollo, S3 para producción)

#### Frontend — Instalación
- [x] Crear proyecto React con Vite + TypeScript en `/frontend`
- [x] Instalar y configurar Tailwind CSS (v4)
- [x] Instalar shadcn/ui y generar componentes base
- [x] Instalar dependencias: `axios`, `react-router-dom`, `zustand`, `react-hook-form`, `zod`, `qrcode.react`, `react-qr-reader`, `react-big-calendar`, `recharts`, `react-hot-toast`
- [x] Configurar Axios con `baseURL` apuntando a la API y interceptores para token
- [x] Configurar `vite-plugin-pwa` con manifest básico
- [x] Configurar React Router con rutas protegidas por rol

---

### FASE 1 — Base de Datos y Modelos

#### Migraciones
- [x] `users` — id, name, email, password, role (enum: admin/coach/athlete), avatar, active, timestamps
- [x] `clubs` — id, name, logo, address, phone, email, timestamps
- [x] `athletes` — id, user_id (FK), club_id (FK), document_type, document_number, birthdate, gender, address, phone, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, sport, group_name, status (enum: active/inactive/suspended), joined_at, timestamps
- [x] `habeas_data_consents` — id, athlete_id (FK), accepted_at, ip_address, user_agent, revoked_at, timestamps
- [x] `attendance_sessions` — id, club_id (FK), coach_id (FK), name, qr_token, expires_at, group_name, timestamps
- [x] `attendance_records` — id, session_id (FK), athlete_id (FK), checked_in_at, method (enum: qr/manual), timestamps
- [x] `payment_configs` — id, club_id (FK), group_name, sport, monthly_fee, timestamps
- [x] `payments` — id, athlete_id (FK), amount, period_month, period_year, due_date, paid_at, payment_method, status (enum: paid/pending/overdue), receipt_url, notes, registered_by (FK users), timestamps
- [x] `events` — id, club_id (FK), created_by (FK users), title, description, type (enum: training/tournament/meeting/other), location, starts_at, ends_at, max_attendees, status (enum: upcoming/ongoing/finished/cancelled), timestamps
- [x] `event_attendees` — id, event_id (FK), athlete_id (FK), rsvp_status (enum: confirmed/cancelled/pending), timestamps
- [x] `notifications` — id, user_id (FK), type, title, body, read_at, data (jsonb), timestamps

#### Modelos Eloquent
- [x] Crear modelo `User` con relaciones y cast de role
- [x] Crear modelo `Athlete` con relaciones a `User`, `Club`, `Payments`, `AttendanceRecords`, `HabeasDataConsent`
- [x] Crear modelo `Club` con relaciones a `Athletes`, `Events`, `AttendanceSessions`
- [x] Crear modelo `HabeasDataConsent`
- [x] Crear modelo `AttendanceSession` con relación a `AttendanceRecords`
- [x] Crear modelo `AttendanceRecord`
- [x] Crear modelo `Payment` con relación a `Athlete`
- [x] Crear modelo `Event` con relación a `EventAttendees`
- [x] Crear modelo `EventAttendee`
- [x] Crear modelo `Notification`
- [ ] Crear factories y seeders para datos de prueba (al menos 1 club, 1 admin, 2 coaches, 20 athletes)

---

### FASE 2 — Autenticación y Autorización

#### Backend
- [x] Crear `AuthController` con métodos: `login`, `logout`, `me`, `refreshToken`
- [ ] Configurar rutas de autenticación en `routes/api.php`
- [ ] Implementar middleware `CheckRole` para proteger rutas por rol
- [ ] Crear Policies: `AthletePolicy`, `PaymentPolicy`, `EventPolicy`, `AttendancePolicy`
- [ ] Implementar respuesta 401 y 403 con mensajes en español
- [ ] Endpoint `POST /api/v1/auth/login` — devuelve token + datos del usuario + rol
- [ ] Endpoint `POST /api/v1/auth/logout` — revoca token Sanctum
- [ ] Endpoint `GET /api/v1/auth/me` — devuelve perfil del usuario autenticado

#### Frontend
- [ ] Crear `authStore` con Zustand — estado: `user`, `token`, `isAuthenticated`
- [ ] Crear página `LoginPage` con formulario (React Hook Form + Zod)
- [ ] Implementar persistencia de token en `localStorage`
- [ ] Crear componente `ProtectedRoute` que redirige según rol
- [ ] Crear layouts: `AdminLayout`, `CoachLayout`, `AthleteLayout` con sidebar/navbar
- [ ] Implementar cierre de sesión automático al expirar token (interceptor Axios 401)

---

### FASE 3 — Módulo Habeas Data

#### Backend
- [ ] Crear `HabeasDataController` con métodos: `showPolicy`, `acceptConsent`, `revokeConsent`, `getConsentStatus`
- [ ] Endpoint `GET /api/v1/habeas-data/policy` — devuelve texto de política de privacidad
- [ ] Endpoint `POST /api/v1/habeas-data/consent` — registra aceptación con IP y user-agent
- [ ] Endpoint `DELETE /api/v1/habeas-data/consent/{athlete}` — revoca consentimiento
- [ ] Asegurar que campos sensibles (`emergency_contact_*`) están cifrados con `encrypted:` cast de Laravel
- [ ] Incluir validación: no se puede completar registro de deportista sin aceptar política

#### Frontend
- [ ] Crear componente `HabeasDataModal` — muestra política y botón de aceptación
- [ ] Mostrar modal obligatorio en el flujo de registro de deportista
- [ ] Mostrar estado de consentimiento en el perfil del deportista
- [ ] Crear página `PrivacyPolicyPage` accesible desde cualquier pantalla

---

### FASE 4 — Módulo Deportistas

#### Backend
- [ ] Crear `AthleteController` con: `index`, `store`, `show`, `update`, `destroy` (soft delete), `changeStatus`
- [ ] Crear `AthleteRequest` con validaciones completas
- [ ] Endpoint `GET /api/v1/athletes` — listado con filtros (status, sport, group, search) y paginación
- [ ] Endpoint `POST /api/v1/athletes` — crear deportista + registrar consentimiento
- [ ] Endpoint `GET /api/v1/athletes/{id}` — perfil completo
- [ ] Endpoint `PUT /api/v1/athletes/{id}` — actualizar datos
- [ ] Endpoint `PATCH /api/v1/athletes/{id}/status` — cambiar estado
- [ ] Endpoint `DELETE /api/v1/athletes/{id}` — eliminación lógica

#### Frontend
- [ ] Crear página `AthletesPage` con tabla (TanStack Table), buscador y filtros
- [ ] Crear página `AthleteProfilePage` con tabs: Info Personal, Contacto Emergencia, Pagos, Asistencia
- [ ] Crear formulario `AthleteForm` para creación y edición (con modal de Habeas Data integrado)
- [ ] Crear componente `StatusBadge` (Activo / Inactivo / Suspendido)
- [ ] Implementar cambio de estado con confirmación modal
- [ ] Conectar todas las vistas con la API usando hooks personalizados (`useAthletes`, `useAthlete`)

---

### FASE 5 — Módulo Asistencia y QR

#### Backend
- [ ] Crear `AttendanceSessionController`: `create`, `show`, `close`
- [ ] Crear `AttendanceRecordController`: `checkIn` (por QR), `manualCheckIn`, `index`
- [ ] Endpoint `POST /api/v1/attendance/sessions` — genera sesión y token QR único (UUID + firma HMAC)
- [ ] Endpoint `GET /api/v1/attendance/sessions/{id}` — detalle de sesión con lista de presentes
- [ ] Endpoint `POST /api/v1/attendance/check-in` — valida QR (token, expiración, duplicado) y registra asistencia
- [ ] Endpoint `POST /api/v1/attendance/manual-check-in` — registro manual por coach/admin
- [ ] Endpoint `GET /api/v1/attendance/records` — historial con filtros (athlete, session, date range)
- [ ] Endpoint `GET /api/v1/attendance/reports` — reporte exportable (PDF/Excel)
- [ ] Validar que un deportista no pueda registrarse dos veces en la misma sesión

#### Frontend
- [ ] Crear página `QRGeneratorPage` (admin/coach) — formulario de sesión + QR generado con `qrcode.react`
- [ ] Mostrar countdown del tiempo restante del QR
- [ ] Crear página `QRScannerPage` (athlete) — lector con `react-qr-reader`, feedback visual de éxito/error
- [ ] Crear página `AttendancePage` — lista de sesiones y registros con filtros
- [ ] Crear componente `AttendanceList` — tabla en tiempo real de presentes en sesión activa
- [ ] Implementar opción de registro manual con buscador de deportista

---

### FASE 6 — Módulo Pagos

#### Backend
- [ ] Crear `PaymentConfigController`: `index`, `store`, `update` (configuración de tarifas por grupo)
- [ ] Crear `PaymentController`: `index`, `store`, `show`, `generateReceipt`
- [ ] Endpoint `GET /api/v1/payments` — listado con filtros (status, athlete, period, month)
- [ ] Endpoint `POST /api/v1/payments` — registrar pago
- [ ] Endpoint `GET /api/v1/payments/{id}/receipt` — generar PDF de recibo
- [ ] Endpoint `GET /api/v1/payments/summary` — resumen del mes (total cobrado, pendientes, en mora)
- [ ] Comando Laravel `php artisan payments:mark-overdue` — marca como vencidos los pagos no realizados (correr con scheduler)
- [ ] Configurar Laravel Scheduler para ejecutar `payments:mark-overdue` diariamente
- [ ] Enviar notificación por email 3 días antes del vencimiento (queue job)

#### Frontend
- [ ] Crear página `PaymentsPage` con tabla de estados y filtros
- [ ] Crear componente `PaymentBadge` (Pagado / Pendiente / En mora)
- [ ] Crear drawer/panel lateral `RegisterPaymentPanel` con formulario de pago
- [ ] Crear página `PaymentSummaryPage` con tarjetas de resumen y gráfica mensual (Recharts)
- [ ] Implementar descarga de recibo en PDF
- [ ] Conectar con API usando hook `usePayments`

---

### FASE 7 — Módulo Eventos

#### Backend
- [ ] Crear `EventController`: `index`, `store`, `show`, `update`, `destroy`, `updateStatus`
- [ ] Crear `EventAttendeeController`: `rsvp`, `index` (lista de asistentes)
- [ ] Endpoint `GET /api/v1/events` — listado con filtros (type, status, date range)
- [ ] Endpoint `POST /api/v1/events` — crear evento
- [ ] Endpoint `PUT /api/v1/events/{id}` — editar evento
- [ ] Endpoint `DELETE /api/v1/events/{id}` — cancelar/eliminar evento
- [ ] Endpoint `POST /api/v1/events/{id}/rsvp` — confirmar o cancelar asistencia
- [ ] Endpoint `GET /api/v1/events/{id}/attendees` — lista de asistentes confirmados

#### Frontend
- [ ] Crear página `EventsPage` con vista calendario (`react-big-calendar`) y vista lista
- [ ] Crear formulario `EventForm` para creación y edición
- [ ] Crear página/modal `EventDetailPage` con info completa y sección RSVP
- [ ] Crear componente `EventCard` con badge de tipo de evento
- [ ] Implementar toggle entre vista calendario y lista
- [ ] Conectar con API usando hook `useEvents`

---

### FASE 8 — Notificaciones

#### Backend
- [ ] Crear `NotificationController`: `index`, `markAsRead`, `markAllAsRead`
- [ ] Endpoint `GET /api/v1/notifications` — listar notificaciones del usuario
- [ ] Endpoint `PATCH /api/v1/notifications/{id}/read` — marcar como leída
- [ ] Crear notificaciones Laravel para: pago próximo a vencer, nuevo evento asignado, asistencia registrada, cambio de estado del perfil
- [ ] Configurar envío de emails con las mismas notificaciones usando queue

#### Frontend
- [ ] Crear componente `NotificationBell` con badge contador en el header
- [ ] Crear página `NotificationsPage` con lista agrupada por fecha
- [ ] Marcar automáticamente como leídas al abrir el panel
- [ ] Conectar con API usando hook `useNotifications`

---

### FASE 9 — Reportes

#### Backend
- [ ] Endpoint `GET /api/v1/reports/attendance` — reporte de asistencia con filtros, exportable
- [ ] Endpoint `GET /api/v1/reports/payments` — reporte de pagos con filtros, exportable
- [ ] Endpoint `GET /api/v1/reports/athletes` — reporte de estado de deportistas, exportable
- [ ] Implementar exportación a PDF (Laravel DomPDF) y Excel (Laravel Excel)

#### Frontend
- [ ] Crear página `ReportsPage` con sub-secciones por tipo de reporte
- [ ] Implementar selector de rango de fechas y filtros por grupo/disciplina
- [ ] Mostrar preview de datos en tabla antes de exportar
- [ ] Botones de exportación PDF y Excel

---

### FASE 10 — Configuración y Ajustes

#### Backend
- [ ] Crear `ClubController`: `show`, `update` (datos del club)
- [ ] Crear `UserController`: `index`, `store`, `update`, `destroy` (gestión de usuarios por admin)
- [ ] Endpoint `GET /api/v1/club` — datos del club
- [ ] Endpoint `PUT /api/v1/club` — actualizar info del club
- [ ] Endpoint CRUD `/api/v1/users` — gestión de entrenadores y admins

#### Frontend
- [ ] Crear página `SettingsPage` con secciones: Info del Club, Deportes y Grupos, Tarifas, Usuarios, Privacidad
- [ ] Crear formulario de configuración de club con upload de logo
- [ ] Crear sección de gestión de usuarios (agregar/editar entrenadores)
- [ ] Crear sección de configuración de tarifas por grupo

---

### FASE 11 — PWA y Experiencia Móvil

- [ ] Configurar `manifest.json` con nombre, íconos, colores y `display: standalone`
- [ ] Configurar Service Worker con `vite-plugin-pwa` (cache de assets y rutas offline básicas)
- [ ] Verificar que la pantalla de QR Scanner funciona correctamente en móvil (permisos de cámara)
- [ ] Probar instalación como PWA en Android e iOS
- [ ] Optimizar imágenes y assets para carga rápida en móvil
- [ ] Verificar responsividad de todas las pantallas en viewport 390px

---

### FASE 12 — Testing

#### Backend
- [ ] Tests unitarios para `Services`: `AttendanceService`, `PaymentService`, `QRService`
- [ ] Tests de feature para todos los endpoints de la API (happy path + casos de error)
- [ ] Test de validación de QR (token expirado, token duplicado, token inválido)
- [ ] Test de autorización por rol en cada endpoint sensible
- [ ] Cobertura mínima: 70%

#### Frontend
- [ ] Tests de componentes clave con Vitest + React Testing Library: `LoginPage`, `QRScannerPage`, `AthleteForm`
- [ ] Test del flujo de aceptación de Habeas Data

---

### FASE 13 — Documentación y Despliegue

- [ ] Generar documentación de API con Scramble (`/api/docs`)
- [ ] Documentar variables de entorno en `.env.example` con comentarios
- [ ] Crear `README.md` con instrucciones de instalación local con Docker
- [ ] Configurar GitHub Actions: lint + tests en cada PR a `develop`
- [ ] Configurar pipeline de despliegue a producción desde `main`
- [ ] Configurar HTTPS con certificado SSL en producción
- [ ] Configurar backups automáticos de PostgreSQL
- [ ] Realizar prueba de carga básica (al menos 200 usuarios concurrentes)
- [ ] Revisión final de seguridad: headers HTTP, rate limiting, CORS

---

## Estado del Proyecto

| Fase | Descripción | Estado |
|------|-------------|--------|
| Fase 0 | Configuración del entorno | ⬜ Pendiente |
| Fase 1 | Base de datos y modelos | ⬜ Pendiente |
| Fase 2 | Autenticación y autorización | ⬜ Pendiente |
| Fase 3 | Módulo Habeas Data | ⬜ Pendiente |
| Fase 4 | Módulo Deportistas | ⬜ Pendiente |
| Fase 5 | Módulo Asistencia y QR | ⬜ Pendiente |
| Fase 6 | Módulo Pagos | ⬜ Pendiente |
| Fase 7 | Módulo Eventos | ⬜ Pendiente |
| Fase 8 | Notificaciones | ⬜ Pendiente |
| Fase 9 | Reportes | ⬜ Pendiente |
| Fase 10 | Configuración y ajustes | ⬜ Pendiente |
| Fase 11 | PWA y experiencia móvil | ⬜ Pendiente |
| Fase 12 | Testing | ⬜ Pendiente |
| Fase 13 | Documentación y despliegue | ⬜ Pendiente |

---

> **Nota para agentes de IA:** Cuando se te asigne una tarea específica, indica siempre al inicio qué fase y qué ítem del checklist estás resolviendo. Al finalizar, muestra el fragmento del checklist actualizado con el item marcado como `[x]`.