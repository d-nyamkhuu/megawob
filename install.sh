#!/usr/bin/env bash
# Install megawob from this checkout (editable) with the extras you need, plus Playwright's Chromium.
#
#   ./install.sh                 browsergym + check + dev (train, check pages, run the tests)
#   ./install.sh serve           also the OpenEnv server (server/, megawob.serve)
#   ./install.sh baselines       also the LLM agent harness (baselines/)
#   ./install.sh --no-browser    skip `playwright install chromium`
#
# Why a script: browsergym-core (and OpenEnv's browsergym_env) pin playwright==1.44, while the checker needs 1.58
# (Chromium 125 deadlocks now and then), so pip cannot resolve both in one command. With uv on PATH the script
# installs in one step (pyproject.toml [tool.uv] overrides the pin); with pip it installs the BrowserGym extras first
# and then the check extra, which moves playwright to 1.58 (pip warns about the clash; that is expected).
# Run it inside the virtual environment you want to use.
set -euo pipefail
cd "$(dirname "$0")"

extras=(browsergym check dev)
browser=1
for arg in "$@"; do
  case "$arg" in
    serve|baselines) extras+=("$arg") ;;
    --no-browser) browser=0 ;;
    -h|--help) sed -n '2,13p' "$0"; exit 0 ;;
    *) echo "unknown argument: $arg (see ./install.sh --help)" >&2; exit 2 ;;
  esac
done
joined=$(IFS=,; echo "${extras[*]}")

if command -v uv >/dev/null 2>&1; then
  uv pip install -e ".[${joined}]"
else
  first=$(IFS=,; printf '%s\n' "${extras[@]}" | grep -vx check | paste -sd, -)
  python -m pip install -e ".[${first}]"
  python -m pip install -e ".[check]"
  echo "note: pip's warning that browsergym-core requires playwright==1.44 is expected; megawob uses 1.58"
fi

if [ "$browser" = 1 ]; then
  python -m playwright install chromium
fi
python -c "import megawob, playwright; from importlib.metadata import version; print('megawob', megawob.__version__, '| playwright', version('playwright'))"
