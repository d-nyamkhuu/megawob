"""MCP server (stdio) with the build agent's tools for one site: `render` and `check`.

Codex starts it outside the agent's sandbox, so it can run Chromium and the checker while the agent itself can
only write inside the site folder. build.py registers it; run by hand to debug:

    python tools/sitegen/render_server.py --site design-set-slider-horizontal-13 --task set-slider \
        --scenario horizontal --image data/sitegen/designs/set-slider/horizontal/13/design.png
"""
from __future__ import annotations

import argparse
import asyncio
import io
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
sys.path.insert(0, str(Path(__file__).resolve().parent))

from mcp.server.mcpserver import Image, MCPServer  # noqa: E402

import gate  # noqa: E402
from render import Renderer  # noqa: E402

parser = argparse.ArgumentParser()
for name in ("--site", "--task", "--scenario", "--image"):
    parser.add_argument(name, required=True)
ARGS = parser.parse_args()
POOL = ThreadPoolExecutor(1)  # Playwright's sync API stays on one thread
_renderer: list[Renderer] = []
server = MCPServer("megawob-site")


def _render(seed, view, crop, popups, params, play) -> list:
    if not _renderer:
        _renderer.append(Renderer(ARGS.site, ARGS.task, ARGS.scenario, Path(ARGS.image)))
    r = _renderer[0]
    params = dict(params or {})
    if play:
        params["play"] = play
    img, errors = r.compare(seed, view, tuple(crop) if crop else None, popups, params)
    buf = io.BytesIO()
    img.save(buf, "PNG")
    text = "\n".join([*(f"PLAY {n}" for n in r.notes), *(f"ERROR {e}" for e in errors)]) or "no page errors"
    return [Image(data=buf.getvalue(), format="png"), text]


@server.tool()
async def render(seed: int = 0, view: str = "design", crop: list[int] | None = None, popups: str | None = None,
                 params: dict[str, str] | None = None, play: int = 0) -> list:
    """Render the site and return the image plus any page, console and layout errors.

    view: "design" (the design image beside the render at the image's size, both scaled to 0.6), "small" (renders
    at 1280x720 and 1024x640, to check the fit) or "modes" (a 2x2 grid at 1024x640: the instruction as header,
    panel and toast, and hidden with finish by message, so no end control).
    crop: [x, y, w, h] in design-image pixels: that region of the design image and of the render at full size.
    popups: open this overlay kind from the start (cookie, toast, chat, promo, banner).
    params: randomization parameters, e.g. {"instructionDisplay": "panel", "startState": "scene",
    "pageFaults": "revert"}.
    play: first follow the oracle for this many actions (to see a checker failure mid-episode); lists them.
    seed: content and the per-episode frame choices (end-control placement and label, decoys) vary by seed.
    """
    return await asyncio.get_running_loop().run_in_executor(POOL, _render, seed, view, crop, popups, params, play)


@server.tool()
async def check() -> str:
    """The static lint, then the oracle checker (1 seed plus its parameter sweep at 1024x640, then 1366x768 and
    1536x864): up to 3 failures per viewport, each with its seed and parameters, or "check passed". About 1-2
    minutes. The final gate runs the same checks with more seeds at all five training viewports."""
    fails = await asyncio.get_running_loop().run_in_executor(None, gate.quick, ARGS.site)
    return "\n".join(f"FAIL {f}" for f in fails) if fails else "check passed"


if __name__ == "__main__":
    server.run()
