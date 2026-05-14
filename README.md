# Requerimientos de Software
## Sistema de Gestión para Clubes Deportivos

**Versión:** 1.0  
**Fecha:** Mayo 2026  
**Nombre:** Athlete management/ 

---

## 1. Introducción

### 1.1 Propósito
Este documento describe los requerimientos funcionales y no funcionales para el desarrollo de una aplicación web y móvil destinada a la gestión de clubes deportivos. El sistema permitirá llevar el control de asistencia mediante código QR, administrar el pago de mensualidades y programar eventos, todo bajo el cumplimiento de la normativa de protección de datos personales (Habeas Data — Ley 1581 de 2012, Colombia).

### 1.2 Alcance
La aplicación cubrirá los siguientes módulos principales:
- Gestión de deportistas (base de datos, perfiles, estado)
- Control de asistencia por QR
- Administración de pagos y mensualidades
- Programación y gestión de eventos
- Roles de usuario (administrador/dueño del club, entrenador, deportista)

### 1.3 Stack Tecnológico Definido
| Capa | Tecnología |
|------|------------|
| Frontend / Móvil | React (Web) + React Native o PWA |
| Backend | Laravel (PHP) o Express (Node.js) |
| Base de Datos | MySQL / PostgreSQL |
| Autenticación | JWT + OAuth2 |
| Generación de QR | Librería QR en frontend (e.g., `qrcode.react`) |

---

## 2. Stakeholders y Roles

| Rol | Descripción |
|-----|-------------|
| **Administrador / Dueño del Club** | Gestión total del sistema: deportistas, pagos, eventos, entrenadores |
| **Entrenador** | Toma de asistencia, visualización de deportistas y eventos |
| **Deportista** | Visualización de su propio perfil, asistencia, pagos y eventos |

---

## 3. Requerimientos Funcionales

### RF-01 — Gestión de Deportistas

| ID | Requerimiento |
|----|---------------|
| RF-01.1 | El sistema debe permitir registrar un deportista con sus datos personales: nombre completo, fecha de nacimiento, número de documento, género, dirección, teléfono y correo electrónico. |
| RF-01.2 | El sistema debe registrar datos de contacto de emergencia: nombre del contacto, parentesco y teléfono. |
| RF-01.3 | El sistema debe permitir asignar un estado al deportista: **Activo**, **Inactivo** o **Suspendido**. |
| RF-01.4 | El sistema debe permitir actualizar, consultar y eliminar (lógicamente) el perfil de un deportista. |
| RF-01.5 | El sistema debe mostrar un listado de deportistas con filtros por estado, nombre y disciplina deportiva. |
| RF-01.6 | El sistema debe registrar la fecha de ingreso al club y el historial de cambios de estado del deportista. |
| RF-01.7 | El sistema debe asociar al deportista con la disciplina o grupo deportivo al que pertenece. |

### RF-02 — Habeas Data y Consentimiento

| ID | Requerimiento |
|----|---------------|
| RF-02.1 | Al momento del registro de un deportista, el sistema debe presentar el aviso de privacidad y política de tratamiento de datos personales, conforme a la Ley 1581 de 2012 (Colombia). |
| RF-02.2 | El sistema debe registrar y almacenar el consentimiento explícito del titular (o de su acudiente si es menor de edad) con fecha, hora y medio de aceptación. |
| RF-02.3 | El sistema debe permitir al deportista (o su acudiente) solicitar la consulta, corrección o eliminación de sus datos personales. |
| RF-02.4 | Los datos de contacto de emergencia y datos sensibles deben estar cifrados en reposo. |
| RF-02.5 | El sistema debe restringir el acceso a datos personales según el rol del usuario autenticado. |
| RF-02.6 | El sistema debe incluir una sección de política de privacidad accesible desde cualquier pantalla de la aplicación. |

### RF-03 — Control de Asistencia por QR

| ID | Requerimiento |
|----|---------------|
| RF-03.1 | El sistema debe permitir al administrador o entrenador generar un código QR único por sesión de entrenamiento o clase. |
| RF-03.2 | El código QR debe tener un tiempo de expiración configurable (ej. 15, 30 o 60 minutos). |
| RF-03.3 | El deportista debe poder escanear el QR desde la aplicación para registrar su asistencia. |
| RF-03.4 | El sistema debe validar que el QR no haya expirado ni sea reutilizado fraudulentamente (un QR = un registro por deportista). |
| RF-03.5 | El sistema debe registrar fecha, hora y ubicación (si se otorga permiso) de cada registro de asistencia. |
| RF-03.6 | El entrenador y el administrador deben poder consultar el registro de asistencia por sesión, por deportista y por rango de fechas. |
| RF-03.7 | El sistema debe permitir al entrenador registrar manualmente la asistencia de un deportista en caso de fallo técnico. |
| RF-03.8 | El sistema debe generar reportes de asistencia exportables en formato PDF o Excel. |

### RF-04 — Gestión de Pagos y Mensualidades

| ID | Requerimiento |
|----|---------------|
| RF-04.1 | El sistema debe permitir configurar el valor de la mensualidad por disciplina o grupo deportivo. |
| RF-04.2 | El sistema debe registrar los pagos realizados por cada deportista: fecha, monto, periodo cubierto y método de pago. |
| RF-04.3 | El sistema debe generar alertas automáticas cuando un deportista tenga un pago pendiente o vencido. |
| RF-04.4 | El sistema debe mostrar el estado de cuenta de cada deportista (al día, pendiente, en mora). |
| RF-04.5 | El administrador debe poder registrar pagos parciales y abonos. |
| RF-04.6 | El sistema debe generar un recibo o comprobante de pago descargable en PDF. |
| RF-04.7 | El sistema debe generar reportes de pagos por periodo, por deportista y por estado de cuenta. |
| RF-04.8 | El sistema debe permitir configurar descuentos o becas para deportistas específicos. |

### RF-05 — Programación de Eventos

| ID | Requerimiento |
|----|---------------|
| RF-05.1 | El administrador debe poder crear eventos (torneos, exhibiciones, reuniones, entrenamientos especiales) con nombre, descripción, fecha, hora, lugar y cupos. |
| RF-05.2 | El sistema debe permitir asignar eventos a grupos, disciplinas o deportistas específicos. |
| RF-05.3 | El sistema debe notificar a los deportistas asignados sobre nuevos eventos y recordatorios previos al evento. |
| RF-05.4 | El sistema debe mostrar un calendario de eventos con vistas mensual, semanal y diaria. |
| RF-05.5 | El deportista debe poder confirmar o cancelar su asistencia a un evento. |
| RF-05.6 | El administrador debe poder registrar los resultados o actas de un evento finalizado. |
| RF-05.7 | El sistema debe permitir adjuntar documentos o imágenes a un evento. |

### RF-06 — Autenticación y Seguridad

| ID | Requerimiento |
|----|---------------|
| RF-06.1 | El sistema debe contar con autenticación segura mediante usuario y contraseña, con soporte para autenticación de dos factores (2FA). |
| RF-06.2 | El sistema debe implementar control de acceso basado en roles (RBAC): Administrador, Entrenador, Deportista. |
| RF-06.3 | El sistema debe cerrar la sesión automáticamente tras un periodo de inactividad configurable. |
| RF-06.4 | El sistema debe registrar un log de auditoría de acciones críticas (modificación de datos, eliminaciones, generación de QR). |

### RF-07 — Notificaciones

| ID | Requerimiento |
|----|---------------|
| RF-07.1 | El sistema debe enviar notificaciones push (en móvil) y por correo electrónico para: pagos próximos a vencer, eventos agendados y cambios en el perfil. |
| RF-07.2 | El usuario debe poder gestionar sus preferencias de notificación desde su perfil. |

---

## 4. Requerimientos No Funcionales

### RNF-01 — Rendimiento

| ID | Requerimiento |
|----|---------------|
| RNF-01.1 | El sistema debe responder a las solicitudes del usuario en un tiempo máximo de 2 segundos bajo condiciones normales de uso. |
| RNF-01.2 | El sistema debe soportar al menos 200 usuarios concurrentes sin degradación perceptible del servicio. |
| RNF-01.3 | La generación y lectura de códigos QR debe completarse en menos de 1 segundo. |

### RNF-02 — Disponibilidad y Confiabilidad

| ID | Requerimiento |
|----|---------------|
| RNF-02.1 | El sistema debe tener una disponibilidad mínima del 99.5% mensual (excluyendo mantenimientos programados). |
| RNF-02.2 | El sistema debe contar con mecanismos de recuperación ante fallos (reintentos automáticos, manejo de errores). |
| RNF-02.3 | Se deben realizar respaldos automáticos de la base de datos al menos una vez al día. |

### RNF-03 — Seguridad

| ID | Requerimiento |
|----|---------------|
| RNF-03.1 | Toda la comunicación entre cliente y servidor debe realizarse mediante HTTPS/TLS 1.2 o superior. |
| RNF-03.2 | Las contraseñas deben almacenarse con hash seguro (bcrypt o Argon2). |
| RNF-03.3 | Los datos personales sensibles deben cifrarse en reposo (AES-256). |
| RNF-03.4 | El sistema debe protegerse contra ataques OWASP Top 10 (SQL Injection, XSS, CSRF, etc.). |
| RNF-03.5 | Los tokens de sesión deben tener expiración y rotación. |
| RNF-03.6 | El sistema debe cumplir con la Ley 1581 de 2012 (Habeas Data) y el Decreto 1377 de 2013 de Colombia. |

### RNF-04 — Usabilidad

| ID | Requerimiento |
|----|---------------|
| RNF-04.1 | La interfaz debe ser responsiva y funcionar correctamente en dispositivos móviles (iOS y Android) y en navegadores de escritorio. |
| RNF-04.2 | El flujo para registrar asistencia por QR no debe requerir más de 3 pasos desde que se abre la aplicación. |
| RNF-04.3 | El sistema debe seguir principios de accesibilidad WCAG 2.1 nivel AA. |
| RNF-04.4 | La aplicación debe estar disponible en español como idioma principal. |

### RNF-05 — Mantenibilidad y Escalabilidad

| ID | Requerimiento |
|----|---------------|
| RNF-05.1 | El código del backend (Laravel o Express) debe seguir principios SOLID y arquitectura en capas (controladores, servicios, repositorios). |
| RNF-05.2 | El frontend en React debe organizarse con componentes reutilizables y gestión de estado centralizada (Redux o Context API). |
| RNF-05.3 | La arquitectura debe permitir incorporar nuevas disciplinas, grupos y funcionalidades sin rediseño estructural. |
| RNF-05.4 | El sistema debe contar con documentación técnica de la API (Swagger / OpenAPI). |
| RNF-05.5 | Se debe contar con un entorno de desarrollo, uno de pruebas (staging) y uno de producción separados. |

### RNF-06 — Portabilidad

| ID | Requerimiento |
|----|---------------|
| RNF-06.1 | La aplicación web debe ser compatible con las últimas dos versiones de Chrome, Firefox, Safari y Edge. |
| RNF-06.2 | La versión móvil (PWA o React Native) debe funcionar en Android 10+ e iOS 14+. |

### RNF-07 — Cumplimiento Legal

| ID | Requerimiento |
|----|---------------|
| RNF-07.1 | El sistema debe cumplir con la normativa colombiana de protección de datos personales (Ley 1581 de 2012). |
| RNF-07.2 | El sistema debe mantener un registro auditable del consentimiento de tratamiento de datos de cada titular. |
| RNF-07.3 | En caso de menores de edad, se debe registrar el consentimiento del acudiente o representante legal. |

---

## 5. Restricciones del Proyecto

- El frontend debe desarrollarse obligatoriamente en **React** para garantizar compatibilidad web y móvil.
- El backend debe desarrollarse en **Laravel (PHP)** o **Express (Node.js)**, a definir por el equipo técnico.
- La aplicación debe ser funcional offline de forma parcial (consulta de perfil y generación de QR almacenado) cuando no haya conexión.
- Los datos de deportistas no podrán compartirse con terceros sin consentimiento explícito.

---

## 6. Glosario

| Término | Definición |
|---------|------------|
| **QR** | Código de respuesta rápida usado para el registro de asistencia |
| **Habeas Data** | Derecho fundamental a conocer, actualizar y rectificar información personal (Ley 1581/2012) |
| **Mensualidad** | Pago periódico mensual que realiza el deportista por pertenecer al club |
| **Evento** | Actividad programada dentro del club (torneo, exhibición, reunión, entrenamiento especial) |
| **RBAC** | Control de acceso basado en roles (Role-Based Access Control) |
| **PWA** | Aplicación web progresiva con capacidades móviles |


