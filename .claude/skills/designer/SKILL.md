---
name: designer
description: Turn an approved plan into concrete interfaces, contracts, and a file-level change map. No code. Use after planner on medium or architecture tasks.
---

Standing rules: `CLAUDE.md`. Target architecture: `.claude/architecture/TARGET.md`.

Role: design only. No implementation, no delegation other than the chain handoff.

## Standalone vs CHAIN MODE — check first

Does `args` contain `=== CHAIN MODE ===`?

- **No** → standalone. Produce the deliverable, end the turn.
- **Yes** → after the deliverable, end your response with `Skill(coder)`.

Read the prior `## Plan` block from `context:` before designing. The design must respect the approved plan.

## Produce

1. Design summary
2. Constraints and defaulted decisions
3. Contracts — TypeScript types, API request/response shapes
4. File-level change map — exact files to create / modify / delete
5. Mock surfaces — which boundaries are mocked at this stage and how the mocks are flagged (`MOCK:` + `_isMock` where applicable)
6. Rollback / revert notes
7. Coding handoff checklist

## Name the layer

State explicitly where each piece lives:

**Backend:**
- `src/routes/` — HTTP only, no business logic
- `src/logic/` — reusable business logic
- `src/services/` — external integrations

**Frontend:**
- `src/pages/` — route-level
- `src/components/` — reusable UI
- `src/hooks/` — React hooks
- `src/lib/` — non-React utilities and API client

If logic ends up in a route, fix it in design — don't let it slip to coding.

## Frontend stack (when designing UI)

`packages/frontend` uses Tailwind v4 + a shadcn-style component pattern. See `.claude/architecture/FRONTEND_STACK.md` for the full list.

When designing frontend changes:

- **Design mobile-first.** Specify the mobile layout/type/spacing as the base; describe larger-viewport overrides with explicit breakpoint prefixes (`min-[880px]:`, `sm:`, `md:`). Do not specify desktop-only states that hide content on mobile via `max-*` rules.
- Style with **Tailwind utility classes**. No new bespoke `.css` files. Brand colors are available as `bg-sb-navy`, `text-sb-accent`, etc.; semantic tokens are `bg-primary`, `text-foreground`, etc.
- Reusable UI goes under `src/components/ui/` and follows the shadcn pattern (`cva` variants, `cn` for class composition, `Slot` for `asChild`, `forwardRef`).
- Icons → `lucide-react`. Animations → `motion/react`. Accessible primitives → `@radix-ui/*` (via shadcn-style wrappers under `src/components/ui/`).
- Import from `@/lib/utils`, `@/components/ui/*` using the `@` alias.
- Do not redefine brand or semantic tokens locally — extend `src/index.css` `@theme` if a token is genuinely missing.

## No backwards compatibility

When a contract changes, the design must update all call sites. Do not introduce a parallel old-and-new path. If the call-site count is large, that's a real cost to surface in the design, not a reason to add a shim.

## Chain handoff (CHAIN MODE only)

After writing the deliverable, the **VERY NEXT action** is `Skill(coder, ...)`.

Pass an updated CHAIN MODE block:
- Advance `position`, set `next: reviewer`
- `context:` — append the prior `## Plan` AND your full deliverable under `## Design`

No text after the Skill tool call.

## Hard blocker

Only the three narrow conditions. If the plan is workable with mocks (which it usually is), proceed.
