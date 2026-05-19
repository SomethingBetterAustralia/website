---
name: orchestrator
description: Triage a task into the right ceremony, then run planner / designer / coder / reviewer in a self-propagating chain. Use when a task spans more than one role or its shape is unclear.
---

Standing rules: `CLAUDE.md`. Target architecture: `.claude/architecture/TARGET.md`.

## How chaining works (read once, do not violate)

The orchestrator delegates each phase to a specialised sub-skill via the Skill tool. The chain is **self-propagating**: each sub-skill, when invoked in CHAIN MODE, ends its response with a `Skill(<next>)` tool call rather than with text. A tool call is a continuation point; trailing text would end the turn.

The orchestrator's job is narrow:

1. Classify the task and pick the entry point.
2. Make exactly one Skill call — to the first sub-skill — with CHAIN MODE args.
3. Stop writing. The chain runs itself from there.

The orchestrator does NOT:
- Inline the work of any sub-skill.
- Re-invoke itself between phases.
- Print "ready for next phase" messages.
- Wait for user confirmation to advance.
- Ask the user to confirm classification.

## Classify the task

Pick one. If ambiguous, pick the lightest plausible classification and state it in the opening report. **Do not pause to ask.**

| Classification | Trigger | Chain |
|---|---|---|
| **Bugfix** | known defect, localised | `coder → reviewer` |
| **Small** | single module, no new contracts | `planner → coder → reviewer` |
| **Medium** | multi-module, new contract, new route, new component family | `planner → designer → coder → reviewer` |
| **Architecture** | cross-package contracts, layering changes, infra introduction | `planner → designer → coder → reviewer` |
| **Repo review** | read-only audit | `reviewer` only |

## Loop rules

- Max 3 review cycles per task. Reviewer enforces and escalates on cycle 3.
- After Changes Required, reviewer routes to the appropriate phase (designer for design defects, coder for implementation defects, planner for plan defects).
- Orchestrator is not re-invoked mid-chain.
- Each cycle increments a counter passed through `args` between phases.

## Opening output (the orchestrator's only output)

```
## Orchestrator
Classification: <Bugfix|Small|Medium|Architecture|Repo review>
Chain: <e.g. planner → designer → coder → reviewer>
Cycle: 1/3
Assumptions: <brief, only if you defaulted on something ambiguous>
```

Then make exactly one Skill tool call to the first sub-skill.

## CHAIN MODE args contract

Every Skill call from any phase MUST include a CHAIN MODE block in `args`:

```
=== CHAIN MODE ===
chain: <full chain, e.g. planner → designer → coder → reviewer>
position: <your position, e.g. 1/4>
next: <next skill name, or END if last>
cycle: <N>/3
classification: <Bugfix|Small|Medium|Architecture|Repo review>
task: |
  <verbatim user task description>
context: |
  <accumulated context from prior phases — empty for the first call>
=== END CHAIN MODE ===
```

The first call has `context:` empty and `cycle: 1/3`. Each sub-skill appends its deliverable to `context` when it makes the next Skill call.

## Hard blocker

The orchestrator never hard-blocks. The task is always classifiable into one of the five buckets. If it genuinely seems unclassifiable, pick `Small`, state the assumption, and let the chain decide.
