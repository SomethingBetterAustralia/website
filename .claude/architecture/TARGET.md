# Target architecture

A marketing/content website with a thin API.

## Shape

- **Frontend** (`packages/frontend`) — Vite + React + TypeScript. Public-facing pages. Calls the backend via relative `/api/*` paths.
- **Backend** (`packages/backend`) — Express + TypeScript. Currently exposes `/api/hello` and `/api/liveness`. Will grow to handle contact forms, mailing list signups, etc. In dev, Express proxies non-`/api` traffic to the Vite dev server, so the whole app is reachable on the backend port.
- **Shared types** — backend defines types; frontend imports them.
- **Ports** — each package has its own `.env`:
  - `packages/backend/.env` — `PORT` (Express), `VITE_DEV_PORT` (proxy target)
  - `packages/frontend/.env` — `VITE_PORT` (Vite dev server)

## Layering

The current `packages/*/src/` directories are flat. The target layout below applies as the codebase grows — new modules belong under these folders rather than the package root.

**Backend:**
- `src/routes/` — HTTP only, no business logic
- `src/logic/` — reusable business logic
- `src/services/` — external integrations (email, etc.)

**Frontend:**
- `src/pages/` — route-level components
- `src/components/` — reusable UI (shadcn-pattern primitives under `src/components/ui/`)
- `src/hooks/` — React hooks
- `src/lib/` — non-React utilities and API client
- See `.claude/architecture/FRONTEND_STACK.md` for the frontend stack and conventions.

## Stage of life

Early. Mocks are first-class — when an external dependency isn't ready yet, mock it with a `MOCK:` marker and move on. Backwards-compat shims are not allowed; when a contract changes, update all call sites in the same change.
