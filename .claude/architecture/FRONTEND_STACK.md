# Frontend stack

`packages/frontend` uses a Tailwind v4 + shadcn-style stack. Designer and coder phases default to this stack — no bespoke CSS files for new components.

## Packages

| Purpose | Package | Import |
|---|---|---|
| Styling | `tailwindcss` (v4) + `@tailwindcss/vite` | Utility classes; theme in `src/index.css` via `@theme` |
| Icons | `lucide-react` | `import { ArrowRight } from 'lucide-react'` |
| Variants | `class-variance-authority` | `import { cva, type VariantProps } from 'class-variance-authority'` |
| Class composition | `clsx` + `tailwind-merge` (via `cn`) | `import { cn } from '@/lib/utils'` |
| Accessible primitives | `@radix-ui/react-*` | `import { Slot } from '@radix-ui/react-slot'` |
| Animation | `motion` | `import { motion } from 'motion/react'` |

## Conventions

- **Mobile-first, always.** Unprefixed Tailwind utilities target mobile (smallest viewport); larger viewports get explicit breakpoint prefixes (`min-[880px]:`, `sm:`, `md:`, …). Do not use `max-*` / "hide-on-small" patterns. Every layout, type ramp, and spacing decision starts at the mobile size and scales up.
- **No bespoke CSS files.** All styling is Tailwind utilities. The only `.css` file is `src/index.css`, which holds the Tailwind import, `@theme` tokens, and global base styles.
- **Brand tokens** live in `@theme` as `--color-sb-*` and `--font-*`. They produce utilities like `bg-sb-navy`, `text-sb-accent`, `font-display`.
- **Shadcn semantic tokens** (`--color-primary`, `--color-background`, `--radius`, …) are also defined and mapped onto the brand so future `npx shadcn add` output works without surgery.
- **Path alias** `@/*` → `src/*` (registered in both `vite.config.ts` and `tsconfig.json`).
- **Reusable UI** that follows the shadcn pattern lives under `src/components/ui/`. Use `cva` for variants and `cn` for class composition. `forwardRef`. `Slot` for `asChild` when the component should be polymorphic.
- **Icons** are imported individually from `lucide-react` (tree-shakable).
- **Animations** use `motion/react`. Respect `prefers-reduced-motion` — `index.css` already disables transitions/animations globally for users who request it.
- **No `any`.** Use `unknown` + narrowing, or define the type. Backend types are imported from `@backend/*`; do not retype.

## Seed files

- `src/lib/utils.ts` — `cn()`.
- `src/components/ui/button.tsx` — shadcn Button pattern (cva, `Slot`, brand-mapped variants).
- `src/index.css` — Tailwind import + `@theme` tokens + base styles.

## Adding a new shadcn component

Manual copy, not the CLI. Author at `src/components/ui/<name>.tsx`, follow the Button pattern (cva variants, `cn`, `forwardRef`, `Slot` for `asChild`), reference semantic tokens (`bg-primary`, `text-primary-foreground`, etc.) so the component theme-follows.
