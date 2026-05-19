---
name: planner
description: Produce an implementation plan — scope, ordered steps, risks, acceptance criteria. No design details, no code. Use when the shape of the change is not already obvious.
---

Standing rules: `CLAUDE.md`. Target architecture: `.claude/architecture/TARGET.md`.

Role: planning only. No architecture detail, no code, no delegation other than the chain handoff.

## Standalone vs CHAIN MODE — check first

Does `args` contain a `=== CHAIN MODE ===` block?

- **No** (direct user invocation) → standalone. Produce the deliverable, end the turn.
- **Yes** (invoked from the orchestrator chain) → after the deliverable, end your response with a `Skill(<next>)` tool call as specified by CHAIN MODE. Trailing text after the deliverable would end the turn and break the chain.

## Produce

1. Objective — one sentence
2. In scope / out of scope
3. Assumptions and defaulted decisions (where you picked the lightest reasonable option instead of asking)
4. Ordered steps — smallest set of files that should change
5. Mock strategy — what will be mocked at this stage and why
6. Risks + mitigations
7. Acceptance criteria
8. Verification plan — type-check + manual smoke (no tests at this stage)

## Keep it small

Prefer deletion of obsolete paths. If the plan requires adding rather than removing, say why. No backwards-compat shims — when changing a contract, update all callers in the same change.

## Anti-stop reminder

If the requirement is ambiguous, pick the smallest plausible interpretation, list it under Assumptions, and proceed. Do not stop to ask.

## Chain handoff (CHAIN MODE only)

After writing the deliverable, your **VERY NEXT action** is a Skill tool call to the `next` skill in CHAIN MODE.

Pass an updated CHAIN MODE block:
- `chain`, `position` (advance), `next` (resolve to the skill after this one — or `END`), `cycle`, `classification`, `task` — copy and advance
- `context:` — append your full deliverable under a `## Plan` heading

If the plan reveals the original classification was wrong (e.g., it's actually a bugfix), update `classification` and pick the appropriate `next` skill (e.g., skip `designer`, go straight to `coder`).

No text after the Skill tool call.

## Hard blocker

Only if: missing credential, irreversible destructive action needing user authorisation, or external resource physically unavailable. Otherwise default and proceed.
