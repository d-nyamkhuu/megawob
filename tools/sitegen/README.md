# sitegen: new design-* sites with Codex agents

The over 2,900 `design-*` sites were built this way: a model draws a design image for a task scenario, and a coding
agent rebuilds it as a site on the task's template, until the checker passes. `sitegen` is that workflow as one
command:

```bash
python tools/sitegen/sitegen.py new use-email archive            # one new design image, then its site
```

It needs the `sitegen` extra (`pip install -e '.[sitegen]'`, after the install steps in the main README: it uses
the checker's Playwright and Chromium), Node 22+ (the gate runs `node --check`) and a Codex sign-in:
`codex login` with a ChatGPT plan or an API key. The `openai-codex` package brings its own Codex runtime. Run it
from the repository root.

## Stages

Each stage writes its result to disk, so a stage can be rerun or inspected alone.

| Stage | Command | What it does | Output |
|---|---|---|---|
| card | `card <task>...` | Reads the task's `logic.js` header, start modes and sample goals and writes what the task's code renders at the start of each scenario, what it never renders, and 2-4 ways the task area can be laid out. Every current task has one. | `cards/<task>.json` |
| design | `design <task> <scenario> [--count N]` | Plans the next design (below), has Codex's image tool draw it, checks it (16:9, not blank) and has a separate turn review it against a checklist: accept, revise (an edit with one correction) or redraw, up to `--attempts` images. | `<out>/designs/<task>/<scenario>/<NN>/`: `design.json`, `prompt.txt`, `attempt-*.png`, `design.png` |
| build | `build <design.json or site>...` | Scaffolds the site from the base site (designs on its templates, so it passes the checker from the start), lets a Codex agent restyle it to the image, gates it and sends failures back; then a review scores it and a stronger model polishes it, kept only if the review does not drop. | `html/sites/design-<task>-<scenario>-<NN>/`, `<out>/runs/<site>.json` |
| | `new <task> <scenario>` | design, then build every accepted design | both |
| | `status` | designs and builds in `<out>` | |

`<out>` is `data/sitegen/` unless `--out` says otherwise. `--jobs N` runs designs or builds in parallel (each
build runs its own browsers and checker runs, so keep it to a few).

### Design images

A design image is one base screen at 1536x864, the largest training viewport, with no task note and no end
control: the hidden-instruction, finish-by-message episode, so it fits every episode setting; the build agent adds
the episode frame. Designs of one task differ in structure, not only in colour:

- **Style**: an era and visual language from `styles.json` (74 desktop and web profiles, 1984 to
  2026), the one the task's designs have used least and never one its scenario has; `--style <slug>` picks one.
- **Window arrangement**: one option per axis of `arrangements.json` (navigation, where the task area sits,
  what the secondary content is), a combination the task has not used yet.
- **Task-area arrangement**: from the card, taken in turn.
- **Goal**: a real goal of the scenario, sampled from the pages, so the depicted state matches what the env samples.

Existing designs count: the style and arrangement of every `design-<task>-*` site are read from its manifest's
`description`. The site number `NN` is the next free one of the scenario.

### Building

The agent works in the site folder (Codex's workspace-write sandbox; it cannot write anywhere else and its
approval requests are denied) with two tools from an MCP server (`render_server.py`) that runs outside the
sandbox:

- `render`: the design image beside the render, a crop of both at full size, the small viewports, or the four
  instruction modes, with page, console and layout errors; any seed, randomization parameter or popup, and the page
  after the oracle's first N actions.
- `check`: the static lint, then the oracle checker at three viewports.

The agent's brief is `prompts/build.md`: the site and widget contract, the episode settings the frame must handle
(instruction display, finish mode, end-control variation, decoys), what never to change, and how to report. It ends
with a JSON report (`prompts/result.schema.json`: fidelity 1-5, remaining differences and their cause, deviations).

A build runs in this order; no agent's own verdict accepts anything:

1. **Build** (`--model`, gpt-6-luna): the first turn, up to `--minutes`.
2. **Gate and fix** (`--fix-model`, gpt-6.1-terra): missing files, `node --check`, `megawob.lint`, then
   `megawob.check` at all five training viewports with `--seeds` plain seeds plus the parameter sweep. Failures, and
   a report that is not `done`, go back to the same thread (its context kept, the model switched) as a fix round, at
   most `--fix-rounds` times (default 2). A site that still fails stays in `html/sites/` for you to fix or remove
   (then run `python -m megawob.scenarios`); the run record says what failed.
3. **Review** (`--review-model`, gpt-6.1-sol): a separate read-only turn that did not build the page scores its
   fidelity 1-5 (`prompts/site_review.txt`) from the design image, the page beside it and the four instruction
   modes, and lists what still differs.
4. **Polish** (`--polish-model`, gpt-6.1-sol; `--no-polish` skips it): a fresh thread gets the brief and the
   review's list, then the gate (one fix round, on the fix model) and the review run again. The polish is kept only if the gate
   passes and the fidelity did not drop; otherwise the built files are restored. A page reviewed at 5 skips it.

The run record has every turn (model, report, gate result, time, tokens), both reviews and whether the polish was
kept; `status` shows each site's final review fidelity. A `KIT_REQUESTS.md` the agent writes (a kit or task change
it needed) is moved next to the run record.

Before you commit a site, look at it (`python -m megawob.gallery --serve`) and run the full check:
`python -m megawob.check --site <site> --seeds 20`.

## Models and cost

| Option | Default | Used for |
|---|---|---|
| `--model` | gpt-6-luna | the build turn |
| `--fix-model` | gpt-6.1-terra | fix rounds after a failed gate |
| `--polish-model` | gpt-6.1-sol | the polish pass (`--no-polish` skips it) |
| `--review-model` | gpt-6.1-sol | design-image and site reviews, capability cards |
| `--image-model` | gpt-6-luna | relaying the prompt to Codex's image tool (it only passes it on) |

The cheap model does the long build, a mid-size one fixes what the checker finds, and the strong model spends one
pass on what the review says still differs, and reviews. The reviewer is a separate thread with no tools, so it never grades its own work. `--effort`
sets the reasoning effort. A build is one long turn (`--minutes`, default 60, then interrupted), up to two shorter
fix turns, and the polish turn; most of the time is renders and checker runs. Token usage of every turn is in the
run record. Codex runs every thread as ephemeral, so nothing lands in your Codex history.

## Changing the workflow

- **Guidance for one task or scenario**: the scenario's `hint` in `cards/<task>.json` (rebuilding a card
  keeps the hints) or its `never` list.
- **A new task**: `sitegen.py card <task>` (the task needs a widget template for the scenario in
  `html/templates/<task>/`, which the scaffold uses).
- **More styles or arrangements**: add a profile to `styles.json` or an option to `arrangements.json`;
  existing designs keep theirs.
- **The agent's brief**: `prompts/build.md`; the image prompt and its review checklist: `prompts/image.txt`,
  `prompts/review.txt`; the site review: `prompts/site_review.txt`.

## Design notes

- One agent at a time per site, with a deterministic verifier (the checker and the lint) and a separate reviewer
  for the look, never the agent's own verdict. Fix rounds are capped, every turn has a time limit, and a polish
  that the review scores lower is rolled back.
- The Codex Python SDK (`agent.py`) drives Codex's app server over JSON-RPC: typed results (the image-generation
  item carries the PNG; the turn carries status and token usage) instead of parsing CLI output, and an interrupt at
  the time limit instead of killing a process.
- Tools through MCP: the agent needs a browser and the checker, which its sandbox blocks, and MCP servers run
  outside it.
- JSON answers (reviews, cards, the build report) are requested in the prompt and validated locally against their
  schema, with a retry: turns given a strict output schema stalled after their reasoning item with some models.
- State is files: a design is a folder, a build is a site folder plus a run record, so any stage can be rerun.
