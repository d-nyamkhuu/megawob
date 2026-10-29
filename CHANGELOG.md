# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.0] - 2026-10-29

First public release.

- **59 tasks, 434 scenarios**: precise mouse control, forms, clicking and reading, 27 app workflows and 4 safety
  tasks. Each registers as a BrowserGym MiniWoB++ task (`browsergym/miniwob.<task>`), with suffixes for held-out
  designs (`.heldout`), one site (`.base`) and eval perturbations (`.eval-<name>`).
- **2,942 single-design `design-*` sites** built from model-generated design images, a `base` site with a widget
  for every task, and three eval-only `mock-*` sites.
- **Graded rewards**: binary, dense or shaped, with near misses measured in task units, and an optional efficiency
  term.
- **Randomization parameters** sampled per episode from the seed (instruction display, start state, popups,
  difficulty, viewport, page faults, safety hazards, ambiguous or impossible goals, ...), set with `MEGAWOB_*`
  variables, presets, task kwargs or URL params; 21 eval perturbations.
- **A scripted oracle per task**, and a checker that runs it on every widget at five training viewports.
- **OpenEnv server image** at `ghcr.io/d-nyamkhuu/megawob`, serving MegaWoB next to the original MiniWoB++ tasks.
- **Gallery** (`python -m megawob.gallery --serve`) to browse and play every page.
- **LLM agent harness** in `baselines/` with a held-out benchmark and a step probe; a site generator in
  `tools/sitegen/`.
- Documentation (architecture, configuration, randomization, glossary, tasks, checks, kit guide) and CI: Python
  tests and lint, kit unit tests, contract lint and a scheduled browser check.

[Unreleased]: https://github.com/d-nyamkhuu/megawob/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/d-nyamkhuu/megawob/releases/tag/v0.1.0
