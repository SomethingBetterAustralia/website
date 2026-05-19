# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Standing rules

- **No backwards compatibility.** No shims, no legacy adapters, no transitional dual paths. Update all callers in the same change.
- **No tests at this stage.** Sub-skills do not write or run tests. Verification is type-check + manual smoke.
- **Mocks are allowed.** Mark every mock with a `MOCK:` comment prefix and an `_isMock: true` flag where the object shape allows. Greppable mocks are the contract.
- **No `any` types.** Use `unknown` + narrowing, or define the type.
- **Backend types are the source of truth.** Frontend imports them; do not redefine.
- **No docs / no comments** unless explicitly asked or required by a non-obvious technical reason. `MOCK:` markers are the one standing exception.
- **Prefer deletion over preservation.** Remove obsolete code rather than wrapping it.
- **All ports from `.env`.** Never hardcode `3000`, `5173`, etc.

## Anti-stop policy

Sub-skills do not stop to ask the user. The only valid hard blockers are:

1. Missing credential / API key / secret
2. Irreversible destructive operation needing explicit authorisation
3. External resource physically unavailable (network, third-party, port)

Ambiguity, scope uncertainty, style preferences, missing fixtures, and "which approach should we use" are NOT blockers. Default to the lightest reasonable choice, state the assumption, and proceed.

## Dev URL

Open the backend port (`packages/backend/.env` → `PORT`). The backend serves `/api/*` directly and proxies everything else to the Vite dev server (`VITE_DEV_PORT`). The Vite port itself (`packages/frontend/.env` → `VITE_PORT`) is also reachable, but `/api/*` won't resolve there — single-port URL is the supported flow.

## Commands

```bash
# Root
npm install
npm run dev
npm run build
npm run type-check

# Frontend
cd packages/frontend
npm run dev

# Backend
cd packages/backend
npm run dev
```

## Skill chain

| Task shape | Chain |
|---|---|
| Bugfix | coder → reviewer |
| Small (one module, no new contract) | planner → coder → reviewer |
| Medium (multi-module / new contract) | planner → designer → coder → reviewer |
| Architecture (cross-package contracts, layering changes) | planner → designer → coder → reviewer |
| Repo review (read-only audit) | reviewer only |

The orchestrator chooses one and hands off. Each sub-skill self-propagates via `Skill(<next>)`.
