# ClubApp - Guía de Despliegue a Producción

> Paso a paso para desplegar la aplicación completa (Backend Laravel + Frontend React) usando servicios gratuitos. Basado en la estructura real del repositorio `CristianJK/athlete-management`.

---

## Opciones Gratuitas Recomendadas

| Servicio | Uso | Limitación |
|----------|-----|------------|
| **Railway** | Backend (Laravel + Nginx) + PostgreSQL + Redis | 500 horas/mes (cuenta todos los servicios) |
| **Vercel** | Frontend (React/Vite) | Ilimitado en el plan free |
| **Render** | Backend alternativo | Se "duerme" tras 15 min de inactividad |
| **Supabase** | Base de datos alternativa | Gratis con límites |

**Recomendación para presentación:** Railway (backend + DB + Redis) + Vercel (frontend)

> ⚠️ **Nota sobre horas Railway:** El plan gratuito da 500 horas/mes pero el contador corre por cada servicio activo (app + DB + Redis = ~3x). Apaga los servicios después de la presentación si no los necesitas.

---

## Preparación Previa

### 1. Verificar la estructura del proyecto

El repositorio tiene la siguiente estructura relevante:

```
athlete-management/
├── backend/          ← Laravel
├── frontend/         ← React + Vite
├── docker/
│   ├── Dockerfile    ← Dockerfile principal (¡está aquí, no en backend/)
│   └── nginx/
│       └── default.conf
└── docker-compose.yml
```

### 2. Crear cuentas en los servicios

- [ ] Crear cuenta en **Railway** (https://railway.app)
- [ ] Crear cuenta en **Vercel** (https://vercel.com)
- [ ] Confirmar que el repositorio está en GitHub y accesible

---

## Paso 1: Desplegar Backend en Railway

### 1.1 Crear proyecto en Railway

1. Iniciar sesión en Railway
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Seleccionar el repositorio `athlete-management`
4. Elegir la rama `main`

### 1.2 Configurar el Dockerfile (Railway necesita saber dónde está)

El Dockerfile del proyecto **no está en la raíz del backend**, está en `docker/Dockerfile`. En Railway, bajo **"Settings"** del servicio, configurar:

- **Build → Dockerfile Path:** `docker/Dockerfile`
- **Root Directory:** `/` (raíz del repo, no `/backend`)

Verificar que el Dockerfile exponga el puerto correcto. Railway detecta el puerto desde la variable `$PORT`. Asegúrate de que el Dockerfile o el entrypoint incluya algo como:

```dockerfile
# Al final del Dockerfile, el CMD debe arrancar Nginx en el puerto $PORT
# o usar el puerto 80 que Railway mapea automáticamente
EXPOSE 80
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
```

> Si el CMD actual solo arranca `php-fpm`, Railway no expondrá la app correctamente. Necesitas que Nginx también arranque (usa `supervisord` o un entrypoint script).

### 1.3 Provisionar PostgreSQL

1. En Railway dashboard: Click **"New"** → **"Database"** → **"PostgreSQL"**
2. Esperar a que se aprovisione (~1 min)
3. Click en la DB → **"Connect"** → copiar los valores individuales (host, user, pass, port, database)

### 1.4 Provisionar Redis (tu app lo usa)

1. En Railway: Click **"New"** → **"Database"** → **"Redis"**
2. Copiar la URL de conexión (`REDIS_URL`)

### 1.5 Configurar variables de entorno

En Railway, ir al servicio de la app → **"Variables"** y agregar:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-backend.railway.app
APP_KEY=                              # Generar con: php artisan key:generate --show

DB_CONNECTION=pgsql
DB_HOST=                              # Host de PostgreSQL en Railway
DB_PORT=5432
DB_DATABASE=railway
DB_USERNAME=postgres
DB_PASSWORD=                          # Password de la DB de Railway

REDIS_HOST=                           # Host de Redis en Railway
REDIS_PORT=6379
REDIS_PASSWORD=                       # Password de Redis (si aplica)

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

SANCTUM_STATEFUL_DOMAINS=tu-frontend.vercel.app
SESSION_DOMAIN=.railway.app
CORS_ALLOWED_ORIGINS=https://tu-frontend.vercel.app
```

### 1.6 Automatizar migraciones en el startup

En lugar de ejecutar migraciones manualmente cada vez, agrega un script de inicio. Crea o edita `docker/entrypoint.sh`:

```bash
#!/bin/bash
set -e

cd /var/www/backend

# Ejecutar migraciones automáticamente al arrancar
php artisan migrate --force
php artisan db:seed --force        # Solo si tienes seeders de datos de prueba
php artisan storage:link --force   # Necesario para imágenes y QR
php artisan config:cache
php artisan route:cache

exec "$@"
```

Y en el Dockerfile, asegúrate de que el entrypoint lo llame antes de arrancar los servicios.

### 1.7 Desplegar

1. Click **"Deploy"** en Railway
2. Ver los logs en tiempo real para confirmar que el build termina sin errores
3. Si falla, los logs de Railway muestran exactamente el error

### 1.8 Ejecutar migraciones (primera vez, si no tienes entrypoint automático)

1. En Railway → **"Shell"**
2. Ejecutar:

```bash
php artisan migrate --force
php artisan db:seed --force
php artisan storage:link
```

### 1.9 Verificar el backend

Visitar: `https://tu-backend.railway.app/api/v1/athletes`

Debe responder con JSON (puede ser `{"message":"Unauthenticated."}` — eso es correcto, significa que el backend está vivo).

---

## Paso 2: Desplegar Frontend en Vercel

### 2.1 Conectar repositorio

1. Ir a https://vercel.com → **"Add New..."** → **"Project"**
2. Importar el repositorio `athlete-management`
3. En **"Root Directory"**, seleccionar `frontend`

### 2.2 Configurar Build Settings

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 2.3 Configurar variables de entorno

```env
VITE_API_URL=https://tu-backend.railway.app/api/v1
```

> ✅ Esta variable **debe incluir** `/api/v1` al final. Es la URL base que usa Axios en el frontend.

### 2.4 Desplegar

Click **"Deploy"**. Vercel construirá y desplegará en ~2 minutos.

### 2.5 Obtener URL

Vercel asignará una URL como: `https://athlete-management-xyz.vercel.app`

---

## Paso 3: Actualizar CORS en el Backend

Con la URL de Vercel en mano, actualizar las variables en Railway:

```env
SANCTUM_STATEFUL_DOMAINS=athlete-management-xyz.vercel.app
CORS_ALLOWED_ORIGINS=https://athlete-management-xyz.vercel.app
```

Hacer **"Redeploy"** (sin borrar caché) para aplicar los cambios.

---

## Paso 4: Crear usuario de prueba

1. Ir a Railway → Shell del servicio de la app
2. Ejecutar:

```bash
php artisan tinker
```

```php
User::create([
    'name' => 'Administrador',
    'email' => 'admin@clubapp.com',
    'password' => bcrypt('password123'),
    'role' => 'admin'
]);
```

---

## Paso 5: Probar la aplicación

### Endpoints clave

| Endpoint | Método | URL |
|----------|--------|-----|
| Login | POST | `/api/v1/auth/login` |
| Deportistas | GET | `/api/v1/athletes` |
| Eventos | GET | `/api/v1/events` |

### Prueba en navegador

1. Abrir `https://athlete-management-xyz.vercel.app`
2. Verificar que carga el login
3. Iniciar sesión con el usuario creado

### Prueba en móvil (PWA)

1. Abrir la URL de Vercel en Chrome (Android) o Safari (iOS)
2. Menú → **"Agregar a pantalla de inicio"**
3. Probar escaneo de QR desde la app instalada

---

## Estructura final de URLs

```
Producción:
├── Frontend (PWA):  https://athlete-management-xyz.vercel.app
├── Backend (API):   https://tu-backend.railway.app/api/v1/
└── Docs (API):      https://tu-backend.railway.app/api/docs  (si tienes Swagger)
```

---

## Checklist de Despliegue

**Railway (Backend)**
- [ ] Cuenta en Railway creada
- [ ] Repositorio conectado a Railway
- [ ] Dockerfile Path configurado como `docker/Dockerfile`
- [ ] PostgreSQL aprovisionado en Railway
- [ ] Redis aprovisionado en Railway
- [ ] Variables de entorno configuradas (DB, Redis, CORS, APP_KEY)
- [ ] Migraciones ejecutadas
- [ ] `storage:link` ejecutado
- [ ] Usuario de prueba creado
- [ ] Endpoint `/api/v1/athletes` responde JSON

**Vercel (Frontend)**
- [ ] Cuenta en Vercel creada
- [ ] Repositorio conectado con root directory `frontend`
- [ ] Variable `VITE_API_URL` configurada (con `/api/v1`)
- [ ] Frontend desplegado correctamente
- [ ] Login funciona desde el navegador

**Integración**
- [ ] URLs de CORS actualizadas en Railway con la URL de Vercel
- [ ] Redeploy del backend hecho tras actualizar CORS
- [ ] Prueba completa en navegador (login → dashboard)
- [ ] Prueba en móvil (PWA instalable)

---

## Solución de Problemas Comunes

### "CORS error" en consola del navegador
→ `CORS_ALLOWED_ORIGINS` en Railway debe coincidir **exactamente** con la URL de Vercel, incluyendo `https://` y sin barra al final.

### "401 Unauthorized" al hacer requests autenticados
→ El token Sanctum/JWT no se está enviando. Verificar que el interceptor de Axios en el frontend adjunta el header `Authorization: Bearer <token>`.

### "Connection refused" a la DB
→ Verificar que las credenciales de PostgreSQL en Railway coinciden. La DB debe estar en el **mismo proyecto** que el backend.

### La app no carga (pantalla en blanco)
→ Verificar que `VITE_API_URL` en Vercel termina con `/api/v1` (no sin ello, no con barra extra).

### Imágenes o códigos QR no se generan
→ Confirmar que `php artisan storage:link` fue ejecutado. Verificar permisos en `storage/` y `bootstrap/cache/`.

### Railway no encuentra el Dockerfile
→ Confirmar que en Railway → Settings → Build, el **Dockerfile Path** está configurado como `docker/Dockerfile`.

### El servidor arranca pero las rutas dan 404
→ Verificar la configuración de Nginx en `docker/nginx/default.conf`. Debe tener `try_files $uri $uri/ /index.php?$query_string;`.

---

## Antes de la Presentación (30 min antes)

1. **Verificar que la app responde:**
   - [ ] Abrir el frontend en el navegador
   - [ ] Hacer login con el usuario de prueba
   - [ ] Probar al menos: listar deportistas, generar un QR, ver eventos

2. **Railway puede tardar ~2 min en "despertar"** si estuvo inactivo. Hacer una petición de prueba antes de que llegue el profesor.

3. **Preparar el móvil:**
   - URL de Vercel abierta en Chrome o Safari
   - Opción "Agregar a pantalla de inicio" lista para demostrar

4. **URLs de respaldo anotadas:**
   - Backend Railway: anotar la URL completa
   - Frontend Vercel: anotar la URL completa

---

## ¿Qué hacer si Railway falla el día de la presentación?

Alternativas de emergencia en orden de recomendación:

1. **Render** — Gratis, soporta Docker. Se duerme pero despierta en ~30 seg. Configura UptimeRobot para mantenerlo activo.
2. **Fly.io** — Plan free generoso, soporta Docker. Curva de configuración ligeramente mayor.
3. **Demo local** — Si todo falla: `docker-compose up` en tu máquina y conectar el móvil a la misma red WiFi. La URL sería `http://192.168.X.X:8080`.

---

> **Nota:** Los servicios gratuitos pueden cambiar sus términos. Verificar los límites vigentes antes de una presentación importante. Railway en particular ha ajustado su plan gratuito varias veces.