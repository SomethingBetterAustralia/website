# Naming conventions

Filenames within a page or feature folder follow a **big-item-first** rule so they cluster alphabetically. The page itself is the "big item"; everything inside the folder is a `<Page><Subitem>.tsx` variation that sorts under the page in file explorers, IDE sidebars, grep results, and tab-autocomplete.

This convention exists because page folders grow over time, and consistent clustering makes "what lives in this feature" instantly visible.

## When to split a page file

Don't pre-emptively split. Promote a single `src/pages/<Page>.tsx` file to a folder when **any** of these is true:

- The file exceeds ~500 lines.
- Multiple distinct top-level components live in the file and review would benefit from separation.
- You're about to add a new component that would push the file past comfortable size.

Below the threshold, a single `src/pages/<Page>.tsx` file is the right shape.

## Folder shape

When promoting, create `src/pages/<page-name>/` (lowercase folder name) and follow this layout. The example uses `People` as the canonical case (the first page split under this convention):

```
src/pages/people/
├── index.ts                  # one-line barrel: export { People } from './People'
├── People.tsx                # page entry (composes the children, the only thing the router imports)
├── PeopleBand.tsx            # state-branching shell (loading / error / ready)
├── PeopleChart.tsx           # the bulk of the interactive area
├── PeopleFinalCta.tsx        # final CTA section
├── PeopleHeader.tsx          # eyebrow + title block
├── PeopleMemberDetail.tsx    # expanded detail panel
├── PeopleShared.ts           # types + small helpers used by 2+ files in this folder
└── PeopleSurveyCta.tsx       # cross-page CTA, page-specific copy
```

Sorted case-insensitively, every file in the folder sits under `People`, with the bare `People.tsx` (the entry) at the top of the cluster.

## Naming rules

| Item | Convention | Example |
|---|---|---|
| Folder | `lowercase` (matches the package's existing `src/pages/` and `src/components/` style) | `people`, `bacon-board` |
| Page entry component file | `<Page>.tsx` (the un-prefixed PascalCase page name) | `People.tsx` |
| Subcomponent file | `<Page><Subitem>.tsx` PascalCase | `PeopleHeader.tsx`, `PeopleChart.tsx` |
| Shared types + utilities file | `<Page>Shared.ts` PascalCase (so it clusters with the `.tsx` files alphabetically) | `PeopleShared.ts` |
| Barrel | `index.ts` (one-line re-export of the entry component) | `export { People } from './People'` |
| File-local helper that's only used in one file | not extracted; lives inside the file with a descriptive function name | `ActivePortfolioPill` inside `PeopleChart.tsx` |

`.tsx` for files that export React components. `.ts` for types-only, barrel, or pure utility files.

## Router import

The router imports from the folder, not the entry file:

```ts
import { People } from '@/pages/people';   // resolves via people/index.ts → People.tsx
```

This keeps `App.tsx` stable if the entry file is later renamed or split further. The barrel is the contract.

## Subcomponents — exported vs file-local

- **File-local** (not exported, lives in the same file as its caller) when the helper is only used in one file. Don't pre-extract.
- **Exported from its own `<Page><Subitem>.tsx` file** when 2+ files in the folder use it, OR when the file's primary owner outgrows ~200 lines and pulling it out improves readability.

If a helper is reused outside this page (e.g., picked up by another feature), promote it to `src/components/<domain>/` and follow that folder's existing convention (see below).

## Difference from `src/components/<domain>/`

The pages convention (this doc) and the components convention diverge:

| | `src/pages/<page>/` (this doc) | `src/components/<domain>/` (existing) |
|---|---|---|
| Folder name | lowercase | lowercase |
| Component files | `<Page><Subitem>.tsx` PascalCase, prefix every file | `<Subitem>.tsx` PascalCase, no folder-prefix |
| Utility files | `<Page>Shared.ts` PascalCase (clusters with components) | `<descriptor>.ts` kebab-case (`leanings-math.ts`, `portfolio-icons.ts`) |
| Reason | Many `People*` files sit alongside many other pages' files at the same level; the prefix keeps them grouped | A component folder is already a namespace; the folder name is the prefix |

When adding to an existing `components/` folder, match the existing files in that folder, not the pages convention.

## Why this matters

- **Alphabetical clustering** — `PeopleChart.tsx`, `PeopleHeader.tsx`, … all sit together in the IDE sidebar. No scroll-hunting for "which file holds that bit".
- **Search-by-name** — typing `People` into the file finder returns every part of the page, in a sensible order.
- **Diff legibility** — reviewers see "all the People files changed in this PR" at a glance.
- **Refactor signal** — a new file showing up under the `People*` cluster instantly reads as "a new piece of the People page", not a mystery sibling.

## Don't

- Don't create `src/pages/people/index.tsx` that holds the entry component directly. Keep `index.ts` as a thin re-export so the entry file's name is discoverable.
- Don't add a `<Page>Types.ts` and `<Page>Helpers.ts` pair until `<Page>Shared.ts` actually grows past ~150 lines.
- Don't promote file-local helpers to their own file pre-emptively — extract only when reuse or readability demands it.
- Don't apply this prefix-everything convention to `src/components/` folders. They already have a folder-as-namespace.
