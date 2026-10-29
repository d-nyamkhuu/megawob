# Baselines: LLM agents on MegaWoB

| File | What it does |
|---|---|
| `benchmark.py` | The held-out benchmark behind the README's results: whole episodes on the first held-out design of every task, the model against the oracle. |
| `step_probe.py` | From a mid-episode state, a model takes a few actions, each scored by the change in progress. Shows whether a task's screen, instruction and actions are enough to make the next move. |
| `megawob.precision` | No model: the oracle with pointer noise. Shows whether a task asks for more precision than a pixel policy has. |

The checker, audit, hackcheck and lint ([docs/checks.md](../docs/checks.md)) show that a task can be solved and is
scored honestly. They cannot show whether a pixel policy can learn it, because the oracle reads hidden state and
clicks exact pixels.

The two probes measure that without training. Run them after a task, widget or tolerance change, or before an RL run
to pick tasks.

`benchmark.py` and `step_probe.py`:

- Drive the pages directly through Playwright (no BrowserGym).
- Talk to any OpenAI-compatible vision model. They use the Responses API by default, or Chat Completions with
  `--api chat` (vLLM, SGLang, Ollama, LM Studio, OpenRouter).
- Need the `baselines` extra. From the repo root, run:

  ```bash
  pip install -e '.[baselines]'
  playwright install chromium
  ```

To train or run other agents, use the BrowserGym or OpenEnv interface from the main README.

## Benchmark

`benchmark.py` plays whole episodes on designs no training run sees.

- **Episodes.** For every task it uses the first held-out `design-*` site (`megawob/design_splits.py`) and plays
  `--episodes` seeds (default 3) of plain episodes at 1280x720.
- **Each turn** the model gets the goal, the current screenshot and its whole rollout so far, and replies with one
  JSON action. An episode gets up to `--horizon` actions (default 30), and counts only if it ends in success.
- **The control** is the oracle playing the same episodes, with no action budget (`use-legacy-app` takes it 31 to
  35 actions).

Put the key in `OPENAI_API_KEY` (any value for a local server that ignores it). Run it from the repo root:

```bash
python baselines/benchmark.py --model gpt-6-luna                         # OpenAI (the README's numbers)
python baselines/benchmark.py --api chat --base-url http://localhost:8000/v1 --model Qwen/Qwen3-VL-8B-Instruct
python baselines/benchmark.py --api chat --base-url https://openrouter.ai/api/v1 --model <vendor/model>
python baselines/benchmark.py --model <model> --tasks set-slider fill-form --episodes 1   # a smoke run, a few minutes
```

A full run is 177 episodes and about 1,500 model calls for `gpt-6-luna`. Each call resends the conversation so far,
so long episodes cost more. At 3-6 s a call with `--workers 2`, that is one to two hours.

Results go to `data/benchmark/<model>-<timestamp>/` (or `--out`), and the run prints the README's results table.
The output folder holds:

- `config.json`: the options of the run.
- `records-*.jsonl`: every reply, action and score of every episode (the step probe's format).
- `shots/`: screenshots.
- `results.json`: per task, the site, episodes, model and oracle successes and action counts. It also has the totals
  and anything that did not run.

Rerunning with the same `--out` resumes. Tasks already recorded are skipped, so keep the other options the same.

To redraw the README chart from a new `results.json`, copy it to `docs/results/baseline-heldout.json`.

| Option | Effect |
|---|---|
| `--effort` | reasoning effort, for models that take one |
| `--images N` | keep only the last N screenshots in the conversation (default all, which a short-context model may not fit) |
| `--workers` | episodes in parallel, one Chromium each |
| `--timeout` | seconds per model call |

## Step probe

`step_probe.py` asks whether a task's screen, instruction and actions are enough for a policy to make the next move.

**How it works.** A state is a reset plus a random prefix of the oracle's actions. In one conversation the model gets
the goal, the prefix as its own earlier actions, and the screenshot. After each of its actions it gets what the
action did and the new screenshot. It takes up to `--horizon` actions (default 3), and each is scored by the change
in progress. The oracle's own next actions from the same state are the control.

**How to read it.**

- `good@H`: the rollout ends better than it started. `good@1` is the first action alone.
- `gain` against `o.gain`: the model's progress against the oracle's, per widget.
- `fail@H`: the episode ended early, usually because the model submitted before the task was done.
- If the oracle makes progress but a strong model is well below the task average, look at the screenshots. The
  usual causes are an unclear instruction, information that is not on screen, a value format the instruction does
  not give, or a target that is hard to see.

**Known limits.**

- With `--horizon 1`, a step that only gathers information (opening a tab, scrolling to read) scores `none` even
  when it is right.
- With `--images 1` (only the current screenshot) the model forgets what another tab showed.
- Without history (`--no-history`), relative goals ("halve the zoom") cannot be told apart from done.
- The probe's actions mirror BrowserGym's: `type` fills a field (click, select all, type) and `text` types at the
  caret.

It needs the `baselines` extra and an OpenAI-compatible endpoint:

- Put the key in `OPENAI_API_KEY`.
- For an endpoint other than OpenAI's, set `--base-url` (or `OPENAI_BASE_URL`).

The module docstring lists every logged field. Run it from the repo root:

```bash
python baselines/step_probe.py --task set-slider --widget classic --states 3 --workers 1  # live check, a few calls
python baselines/step_probe.py --site base --states 4 --horizon 5 --workers 4             # every base widget, up to ~2,500 calls
python baselines/step_probe.py --task fill-form --states 6 --set instructionDisplay=hidden  # one randomization parameter changed
```

| Option | Effect |
|---|---|
| `--model`, `--effort` | the model (default `gpt-6-luna`) and its reasoning effort |
| `--states` | states per widget |
| `--horizon` | model actions per state (default 3); a rollout stops when the episode ends |
| `--images N` | screenshots kept in the conversation (default all) |
| `--set k=v` | randomization parameters over the plain defaults |
| `--widget`, `--max-cells`, `--no-history`, `--workers`, `--out` | narrow the run, drop the history, parallel processes, output directory |

A call takes about 3-6 s. The conversation is resent each turn, with the repeated part served from the prompt cache.
A run on the base site with `--states 4 --horizon 5 --workers 5` takes roughly 1-2 h.

Keep the model, effort and randomization parameters fixed between runs you compare. `config.json` records them.

## Precision probe

`python -m megawob.precision --site base --seeds 6` needs no model and takes a few minutes with `--jobs 4`. It runs
the closed-loop oracle with Gaussian noise on every pointer coordinate (default sigma 8 and 16 px, roughly a VLM's
click error).

- `tight@8`: success within twice the clean action count plus 2. Below 80% is flagged `PRECISE`: the tolerance or a
  process rule asks for more precision than a policy has.
- `fails` says why:
  - `violation:*` is a process rule that a near miss breaks. For example, the slider widgets end the episode at 0
    when a drag starts a few px off the thumb.
  - `budget` is a tolerance too tight to reach by correcting.
- `x@s` above about 3 means the task is reachable but slow.

## Output of the probes

Both probes write to `data/<probe>/<timestamp>/` under the current directory (`--out` to choose):

- `config.json`.
- One JSONL line per widget (precision) or per state (step probe), written as it finishes, so a crashed run keeps
  what it did.
- `shots/`: screenshots.

What each probe keeps:

- **Precision:** for each failed noisy run, the per-action trace and an end screenshot.
- **Step probe:** every reply, the score after each model and oracle action, and the screenshots.

Both are seeded, so a rerun with the same arguments replays the same runs. To compare before and after a change, run
the same arguments into two `--out` directories.
