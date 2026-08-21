# Gestor de Turnos — Backend

API REST para la gestión de turnos, servicios, disponibilidad, pagos y notificaciones de proveedores independientes (peluquerías, consultorios, talleres, etc.), con soporte para reservas de clientes registrados e invitados.

## Stack

- **Framework:** NestJS 11 (TypeScript)
- **Base de datos:** MongoDB + Mongoose
- **Autenticación:** JWT (Passport)
- **Pagos:** Mercado Pago (OAuth + Checkout + Webhooks)
- **Automatizaciones:** n8n (recordatorios y emails, repositorio `n8n-workflows` aparte)
- **Documentación de API:** Swagger / OpenAPI (`@nestjs/swagger`)

## Arquitectura

El backend sigue una variante de **Clean Architecture** aplicada por módulo. Cada módulo de negocio (`turnos`, `servicios`, `user`, `availability`, `pagos`, etc.) se organiza en capas:

```
src/<modulo>/
├── domain/          # Entidades e interfaces (reglas de negocio puras)
├── infrastructure/  # Schemas de Mongoose, repositorios, guards, tokens de inyección
├── presentation/     # Controllers y DTOs de request/response
└── services/         # Casos de uso (orquestan domain + infrastructure)
```

Esto desacopla la lógica de negocio del framework y de la base de datos, y permite testear los casos de uso sin depender de Mongoose ni de HTTP.

## Módulos

| Módulo | Responsabilidad |
|---|---|
| `auth` | Registro, login y perfil (JWT) |
| `user` | Perfil de usuario/proveedor, configuración de negocio y recordatorios |
| `servicios` | Catálogo de servicios ofrecidos por cada proveedor |
| `availability` | Horarios semanales y excepciones (feriados, horarios especiales) |
| `turnos` | Reservas, agenda, cancelaciones (individuales y masivas) |
| `pagos` | Consulta de pagos realizados/recibidos |
| `mercadopago` | Checkout, OAuth y webhooks de Mercado Pago |
| `dashboard` | Métricas y listado de clientes del proveedor |

## Requisitos previos

- Node.js 20+
- Una base MongoDB (local o Atlas)
- Credenciales de Mercado Pago en modo **sandbox** (prefijo `TEST-`) para desarrollo

## Instalación

```bash
npm install
```

Copiar `.env.example` a `.env` y completar las variables (Mongo, JWT, Mercado Pago, n8n, CORS, frontend). El archivo `.env.example` incluye comentarios explicando cada bloque.

```bash
cp .env.example .env
```

## Correr el proyecto

```bash
# desarrollo (watch mode)
npm run start:dev

# producción
npm run build
npm run start:prod
```

El servidor levanta por defecto en `http://localhost:3000`, con el prefijo global `/api` para todos los endpoints.

## Documentación de la API (Swagger)

Con el servidor corriendo, la documentación interactiva está disponible en:

```
http://localhost:3000/docs
```

Ahí se pueden ver todos los endpoints agrupados por módulo, sus DTOs de entrada/salida, y probarlos directamente (los protegidos requieren pegar un JWT vía el botón **Authorize**, obtenido desde `POST /api/auth/login`).

## Tests

```bash
npm run test        # unitarios
npm run test:e2e    # end-to-end
npm run test:cov     # cobertura
```

## Seed de datos

```bash
npm run seed
```

## Despliegue

Backend desplegado en Render. Variables de entorno sensibles (Mongo URI, JWT secret, credenciales de Mercado Pago, secreto de n8n) se configuran en el panel de Render, no en el repositorio.
