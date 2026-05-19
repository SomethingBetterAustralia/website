# Something Better Australia — Website

Monorepo for somethingbetteraustralia.com.

## Stack

- Frontend: Vite + React + TypeScript
- Backend: Express + TypeScript
- Monorepo: npm workspaces

## Quick start

1. Install dependencies from the repo root:
   ```sh
   npm install
   ```
2. Copy each package's `.env.example` to `.env` and adjust if needed:
   ```sh
   cp packages/backend/.env.example packages/backend/.env
   cp packages/frontend/.env.example packages/frontend/.env
   ```
3. Start both packages:
   ```sh
   npm run dev
   ```

Open http://localhost:3000 — the backend serves the API and proxies everything else to the Vite dev server.

## Useful commands

- `npm run dev` — run backend + frontend
- `npm run dev:backend` — backend only
- `npm run dev:frontend` — frontend only
- `npm run build` — build both
- `npm run type-check` — TypeScript across the monorepo

## License

MIT. See `LICENSE`.
