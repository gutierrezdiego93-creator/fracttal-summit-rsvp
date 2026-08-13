# Fracttal Partner Summit — RSVP

Landing page de confirmación de asistencia al Fracttal Partner Summit
(jueves 27 de agosto, evento virtual).

## Stack

- Next.js 15 (App Router) + TypeScript + React 19
- Tailwind CSS 4
- Vercel KV (Upstash Redis) para almacenar confirmaciones
- flag-icons para las banderas

## Rutas

- `/` — landing con horarios por país y formulario de RSVP
- `/api/rsvp` — endpoint POST que guarda cada confirmación en KV (`rsvp:summit`)
- `/admin` — tabla de asistentes confirmados (protegida con Basic Auth:
  usuario `admin`, contraseña en la variable de entorno `ADMIN_PASSWORD`)

## Variables de entorno

| Variable | Descripción |
|---|---|
| `KV_REST_API_URL` | La agrega la integración de KV/Upstash en Vercel |
| `KV_REST_API_TOKEN` | La agrega la integración de KV/Upstash en Vercel |
| `ADMIN_PASSWORD` | Contraseña para acceder a `/admin` |

## Desarrollo local

```bash
npm install
npm run dev
```

## Logo

El logo se sirve desde `public/logo.png`. Subir el archivo real con ese
nombre exacto (no se genera por código).
