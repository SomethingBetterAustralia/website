# Something Better Australia — Website

A hopeful, evidence-led grassroots movement working to create Australia's next major political party — energetic and constructive, focused on 10-year horizons, collaborative politics across the aisle, and outcomes that deliver for Australians, not the next election.

This repository is the monorepo for somethingbetteraustralia.com.

## Stack

- Frontend: Vite + React + TypeScript, Tailwind v4, shadcn-pattern UI primitives, `motion` for animation, `lucide-react` for icons
- Backend: Express + TypeScript
- Monorepo: npm workspaces

## Quick start

Requires Node 20+.

1. Install dependencies from the repo root (one install covers both workspaces):
   ```sh
   npm install
   ```
2. Copy each package's `.env.example` to `.env` and adjust if needed:
   ```sh
   cp packages/backend/.env.example packages/backend/.env
   cp packages/frontend/.env.example packages/frontend/.env
   ```
3. Start the whole app with a single command from the repo root:
   ```sh
   npm run dev
   ```

Open the **backend port** (set in `packages/backend/.env` → `PORT`). The backend serves `/api/*` directly and proxies everything else to the Vite dev server, so the entire site is reachable from one URL. You don't normally need to open Vite's port directly.

## Useful commands

- `npm run dev` — boots backend + frontend together (the supported flow)
- `npm run dev:backend` — backend only
- `npm run dev:frontend` — frontend only (note: `/api/*` won't resolve without the backend)
- `npm run build` — build all workspaces
- `npm run type-check` — TypeScript across the monorepo

## License

MIT. See `LICENSE`.
