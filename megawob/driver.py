"""Browser driver shared by the checker-style tools (check, audit, precision, golden, hackcheck, lint, scenarios,
describe, gallery, baselines/step_probe): boot a widget, send an action the way a pixel policy would, follow the oracle,
open Chromium, fan cells out to worker processes, and the command-line arguments they have in common.

    with driver.browser(raster=True) as b:                  # Chromium (raster=True: catalog.RASTER_ARGS for pixel checks)
        page = driver.new_context(b, (1280, 720)).new_page()
        driver.boot(page, widget, 0)                          # play.html of the widget, waits for __env.ready
        driver.reset(page, 3, "thumb", {**driver.PLAIN})    # __env.reset(seed, scenario, knobs)
        status, n = driver.run_oracle(page, steps=8)        # follow __env.oracle() to the end, then __env.status()

    results = driver.run_pool(run_cells, cells, jobs, opts)     # run_cells(chunk, opts) -> one result per cell
    # ... where run_cells(chunk, opts) is driver.run_cells(chunk, fn): a browser, a context per viewport, fn per cell
    driver.write_json(path, obj)  /  driver.append_jsonl(path, obj)   # the one way tools write JSON files

Only the browser needs Playwright, imported when browser() is called, so the pure helpers (oracle_loop, run_pool,
size, the argument helpers) work without it.
"""
from __future__ import annotations

import argparse
import inspect
import json
import os
import re
import sys
import time
from collections.abc import Callable, Iterable, Iterator
from concurrent.futures import ProcessPoolExecutor, as_completed
from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path
from typing import TYPE_CHECKING, Any

from . import catalog

if TYPE_CHECKING:
    from playwright.sync_api import Browser, BrowserContext, Page

MAX_ACTIONS = 40  # per episode; dragSteps=split episodes get 3x (each drag is a press, a move and a release)
# A stuck oracle (the same action again and again without changing the page) is ended after this many repeats
# instead of running to the budget: a failing cell otherwise repeats a blocked drag 40 times on every seed.
STUCK_AFTER = 10
VIEWPORT = (1280, 720)  # the size tools use unless they sweep viewports
# Plain episodes: no start variation, no overlay, a submit control. Tools that need more (a language, a level, no
# messy instruction) add it where they use it.
PLAIN = {"startState": "off", "popups": "off", "finishByMessage": "0"}


# ------------------------------------------------------------------------------------------------ page

def boot(page: Page, widget: catalog.Widget, seed: int = 0, scenario: str | None = None, **flags: object) -> None:
    """Open the widget's play.html (page options in flags, see catalog.page_url) and wait until it is ready."""
    page.goto(catalog.page_url(widget, seed, scenario, base=catalog.HTML.resolve().as_uri() + "/", **flags))
    page.wait_for_function("() => window.__env && (window.__env.ready || window.__env.bootError)")
    err = page.evaluate("() => window.__env.bootError")
    if err:
        raise RuntimeError(f"{widget.task}/{widget.site}/{widget.name}: {err}")


def reset(page: Page, seed: int, scenario: str | None = None, knobs: dict | None = None) -> dict:
    """__env.reset(seed, scenario, knobs): the episode's start score."""
    return page.evaluate("([s, v, o]) => __env.reset(s, v, o)", [seed, scenario, knobs or {}])


# Pixel tools pin text shaping: Chromium shapes "fi" / "fl" as a ligature or as two glyphs depending on process
# history (sticky for the rest of the page, 50/50 across runs under load), which moved a few anti-aliased pixels
# of every such word. The style tag lives in <head>, which a reset keeps. Episodes the agent sees are untouched.
PIN_TEXT = "*{font-variant-ligatures:none!important}"


def pin_text(page: Page) -> None:
    """Make screenshots independent of the ligature coin flip (call after boot)."""
    page.add_style_tag(content=PIN_TEXT)


def budget(page: Page) -> int:
    """MAX_ACTIONS, x3 for split drags (each drag is three actions), x2 when a clear or revert fault undoes the work
    done so far (the oracle redoes it: a terminal form typed a key per action needed 44 of 40)."""
    split = page.evaluate("() => __env.episode && __env.episode.drag") == "split"
    redo = page.evaluate("() => __env.episode && __env.episode.fault") in ("clear", "revert")
    return MAX_ACTIONS * (3 if split else 1) * (2 if redo else 1)


def act(page: Page, action: dict, steps: int) -> None:
    """Send one oracle-format action to the page the way BrowserGym would (mouse, keys, wheel), then step the clock."""
    # Modifier keys go down before a click / drag / path / down and up after a click / drag / path / up.
    kind = action["type"]
    mods = action.get("modifiers") or []
    if kind in ("click", "drag", "path", "down"):
        for m in mods:
            page.keyboard.down(m)
    _act(page, action, steps)
    if kind in ("click", "drag", "path", "up"):
        for m in reversed(mods):
            page.keyboard.up(m)
    # One action = stepMs of task time (overlays and timed tasks); the same call returns the step fingerprint.
    return page.evaluate(STEP, _point(action))


# After an action: advance the task clock, then a fingerprint of what an action can change (the model, the score,
# the page scroll, and the element under the action's point with its box and scroll, which moves when an inner
# pane scrolls). oracle_loop compares it to tell a repeated action that does nothing from one that makes progress.
STEP = """(p) => {
  __env.stepClock();
  const score = __env.score();
  let under = null;
  const e = p && document.elementFromPoint(p[0], p[1]);
  if (e) { const b = e.getBoundingClientRect(); under = [e.tagName, b.x, b.y, b.width, b.height, e.scrollTop, e.scrollLeft]; }
  return JSON.stringify([__env.model, score.error, score.progress, scrollX, scrollY, under]);
}"""


def _point(action: dict) -> object:
    """The action's pointer position, for the step fingerprint."""
    return action.get("at") or action.get("from") or (action.get("points") or [None])[0]


# Counts scroll events from here on (installed once per page); _act marks the count just before a wheel.
MARK_SCROLL = """() => {
  if (!window.__megawobScrolls) {
    window.__megawobScrolls = { n: 0, mark: 0 };
    document.addEventListener('scroll', () => { window.__megawobScrolls.n++; }, { capture: true, passive: true });
  }
  window.__megawobScrolls.mark = window.__megawobScrolls.n;
}"""

# Resolves once nothing has scrolled for 4 animation frames (10 if nothing scrolled yet; at most 2 s): a wheel's
# smooth scroll runs over several frames, so a fixed wall-time wait can read the page mid-scroll under load. A
# scroll that landed between MARK_SCROLL and this call needs only 2 quiet frames (any scroll handler and the frame
# after it have run): with smooth scrolling off (RASTER_ARGS) that is the usual case, and waiting 10 frames for a
# scroll that already came was most of a checker cell's time.
SETTLE_SCROLL = """() => new Promise((done) => {
  const sc = window.__megawobScrolls;
  const landed = !!sc && sc.n > sc.mark;
  let quiet = 0, frames = 0, seen = landed;
  const moved = () => { quiet = 0; seen = true; };
  document.addEventListener('scroll', moved, { capture: true, passive: true });
  const tick = () => {
    if (++quiet >= (landed ? 2 : seen ? 4 : 10) || ++frames > 120) {
      document.removeEventListener('scroll', moved, { capture: true });
      done();
    } else requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})"""


def _act(page: Page, action: dict, steps: int) -> None:
    """act() without the modifier-key handling."""
    kind = action["type"]
    if kind == "click":
        page.mouse.click(*action["at"])
    elif kind == "dblclick":
        page.mouse.dblclick(*action["at"])
    elif kind == "tripleclick":
        page.mouse.click(*action["at"], click_count=3)  # native triple click (detail 1, 2, 3)
    elif kind == "rightclick":
        page.mouse.click(*action["at"], button="right")
    elif kind == "type":
        page.mouse.click(*action["at"])
        page.keyboard.press("Control+A")
        if action["text"]:
            page.keyboard.type(action["text"])
        else:
            page.keyboard.press("Delete")
    elif kind == "key":
        page.keyboard.press(action["key"])
    elif kind == "move":
        for p in action.get("points") or [action["at"]]:
            page.mouse.move(*p, steps=steps if not action.get("points") else 2)
    elif kind == "down":
        page.mouse.move(*action["at"], steps=steps)
        page.mouse.down()
    elif kind == "up":
        page.mouse.move(*action["at"], steps=steps)
        page.mouse.up()
    elif kind == "wheel":
        page.mouse.move(*action["at"])
        page.evaluate(MARK_SCROLL)
        page.mouse.wheel(action.get("dx", 0), action["dy"])
        page.evaluate(SETTLE_SCROLL)  # let smooth scrolling settle before the next locate()
    elif kind == "wait":
        pass
    elif kind == "finish":
        page.evaluate("(m) => __env.finish(m)", action.get("message") or "")
    elif kind == "drag":
        page.mouse.move(*action["from"])
        page.mouse.down()
        page.mouse.move(*action["to"], steps=steps)
        page.mouse.up()
    elif kind == "path":
        pts = action["points"]
        page.mouse.move(*pts[0])
        page.mouse.down()
        for p in pts[1:]:
            page.mouse.move(*p, steps=2)
        page.mouse.up()
    else:
        raise ValueError(f"unknown oracle action {action}")


# ------------------------------------------------------------------------------------------------ oracle

@dataclass
class Run:
    """What oracle_loop did: actions sent, the last oracle action, its repeat count and why it ended."""
    n: int  # actions sent
    last: dict | None  # the last action the oracle gave
    repeats: int  # how often `last` came again just before it (0: it was new)
    ended: str  # oracle (gave none) | cap | until | finish | done | stuck


def oracle_loop(page: Page, steps: int, *, cap: int | None = None, until: Callable | None = None, until_finish: bool = False,
                stop_on_done: bool = False, stuck_after: int | None = None, send: Callable | None = None) -> Run:
    """Follow __env.oracle(): fetch an action, send it, repeat. Ends when the oracle has none, after `cap` actions
    (default: the episode's budget), when until(page) is true (checked before each fetch), at the oracle's finish
    action if until_finish (not sent), once the episode is done if stop_on_done, or when the same action came
    stuck_after times in a row after the first without changing the page (sent; act()'s step fingerprint, or what
    `send` returns). `send(page, action)` replaces the default act(page, action, steps), for tools that perturb,
    record or repeat what they send."""
    cap = budget(page) if cap is None else cap
    n, last, same, ended, mark = 0, None, 0, "cap", None
    while n < cap:
        if until is not None and until(page):
            ended = "until"
            break
        action = page.evaluate("() => __env.oracle()")
        if action is None:
            ended = "oracle"
            break
        if until_finish and action["type"] == "finish":
            ended = "finish"
            break
        repeat = action == last
        last = action
        before, mark = mark, (act(page, action, steps) if send is None else send(page, action))
        same = same + 1 if repeat and mark == before else 0
        n += 1
        if stop_on_done and page.evaluate("() => __env.done"):
            ended = "done"
            break
        if stuck_after is not None and same >= stuck_after:
            ended = "stuck"
            break
    return Run(n, last, same, ended)


def run_oracle(page: Page, steps: int) -> tuple[dict, int]:
    """Follow the oracle until the episode ends. Returns (status, actions); when it failed after repeating one
    action without effect, status["stuck"] says which action and what is under its point."""
    run = oracle_loop(page, steps, stuck_after=STUCK_AFTER)
    status = page.evaluate("() => __env.status()")
    if run.repeats >= 2 and not status["success"]:
        status["stuck"] = stuck_note(page, run.last, run.repeats + 1)
    return status, run.n


def run_oracle_until_within(page: Page, steps: int) -> tuple[dict, int]:
    """Oracle without the final submit click: stop once the score is within tolerance."""
    oracle_loop(page, steps, stuck_after=STUCK_AFTER,
                until=lambda p: p.evaluate("() => { const s = __env.score(); return s.error <= s.tau + 1e-9; }"))


def stuck_note(page: Page, action: dict, times: int) -> str:
    """'stuck: click at 645,197 repeated 38x, the point hits aside.perturb.promo "Get more"': the element on top
    of the oracle's point (a cover over the target, or a locate() that points at the wrong place)."""
    pt = action.get("at") or action.get("from") or (action.get("points") or [None])[0]
    where = f" at {round(pt[0])},{round(pt[1])}" if pt else ""
    note = f"stuck: {action['type']}{where} repeated {times}x without effect"
    if pt:
        hit = page.evaluate("""(p) => {
          const e = document.elementFromPoint(p[0], p[1]);
          if (!e) return 'nothing (outside the viewport)';
          const cls = typeof e.className === 'string' ? e.className.trim().split(/\\s+/).filter(Boolean) : [];
          const text = (e.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 40);
          return e.tagName.toLowerCase() + cls.map((c) => '.' + c).join('') + (text ? ` "${text}"` : '');
        }""", pt)
        note += f", the point hits {hit}"
        if action["type"] == "wheel":
            note += wheel_note(page, action, pt)
    return note


def wheel_note(page: Page, action: dict, pt: object) -> str:
    """For a stuck wheel: its distance and the scroll pane under its point, which usually says why (a pane
    squeezed shorter than the target gives a 0 distance; one at its end, or with overflow hidden, cannot move)."""
    pane = page.evaluate("""(p) => {
      const name = (e) => {
        const cls = typeof e.className === 'string' ? e.className.trim().split(/\\s+/).filter(Boolean) : [];
        return e.tagName.toLowerCase() + cls.map((c) => '.' + c).join('');
      };
      let clip = null;
      for (let e = document.elementFromPoint(p[0], p[1]); e && e !== document.documentElement; e = e.parentElement) {
        const cs = getComputedStyle(e);
        const over = e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth + 1;
        if (over && /auto|scroll/.test(cs.overflowY + cs.overflowX))
          return `scroll pane ${name(e)} (${e.clientHeight} px tall showing ${e.scrollHeight} px, scrollTop `
            + `${Math.round(e.scrollTop)} of ${e.scrollHeight - e.clientHeight})` + (clip ? `, inside it ${clip}` : '');
        if (over && !clip) clip = `${name(e)} clips its content with overflow ${cs.overflowY} (the wheel cannot scroll it)`;
      }
      return 'no scroll pane under the point' + (clip ? `; ${clip}` : '');
    }""", pt)
    dx, dy = round(action.get("dx") or 0), round(action.get("dy") or 0)
    note = f"; wheel dy {dy}" + (f" dx {dx}" if dx else "")
    if not dx and not dy:
        note += " (a 0 distance: the target does not fit in its scroll pane, which is too short at this viewport)"
    return f"{note}; {pane}"


# ------------------------------------------------------------------------------------------------ browser

# Chromium paces input to its frame rate: each interpolated mouse move waits for the next frame, so a drag of 8
# steps idled ~50 ms and a failing drag cell spent 31 of its 36 s there. Unthrottled frames: 9 s. Episodes run on
# the env's task clock (stepClock), not wall time. The cost is CPU: every input event draws its own frame, so a typed
# field (one key event per character) drew ~47 software frames instead of a few at 60 Hz, and a typing-heavy cell used
# ~35% more CPU (2026-10-24). Bulk runs that are CPU-bound pass fast=False (megawob.check --frame-limit): waiting for
# frames costs no CPU and the other workers fill it.
FAST_ARGS = ["--disable-frame-rate-limit", "--disable-gpu-vsync"]


class _CheapStack:
    """inspect, as Playwright's sync API sees it, with a cheap stack(): every API call records the caller's stack
    (for error messages and traces), and inspect.stack() resolves each frame's source file through
    inspect.getmodule, which scans sys.modules. That was a quarter of a checker's CPU. Frames here carry the code
    object's filename, which is all Playwright reads."""

    def __getattr__(self, name: str) -> Any:
        """Everything but stack() is the real inspect module's."""
        return getattr(inspect, name)

    @staticmethod
    def stack(context: int = 1) -> list:
        """The caller's frames, cheaply (see the class docstring)."""
        out, f = [], sys._getframe(1)
        while f is not None:
            out.append(inspect.FrameInfo(f, f.f_code.co_filename, f.f_lineno, f.f_code.co_name, None, None))
            f = f.f_back
        return out


def _cheap_call_stacks() -> None:
    """Swap in _CheapStack for inspect in Playwright's sync API, once."""
    from playwright._impl import _sync_base

    if getattr(_sync_base, "inspect", None) is inspect:  # only the layout this was written against
        _sync_base.inspect = _CheapStack()


@contextmanager
def browser(headed: bool = False, raster: bool = False, channel: str | None = None,
            fast: bool = True) -> Iterator[Browser]:
    """A Chromium (a Playwright Browser), closed on exit. raster=True adds catalog.RASTER_ARGS, which the tools that
    compare pixels need; channel="frame" runs the installed Chrome instead; fast=False keeps Chromium's frame-rate
    limit (no FAST_ARGS: less CPU per cell, more wall time; for CPU-bound parallel runs)."""
    from playwright.sync_api import sync_playwright

    _cheap_call_stacks()
    with sync_playwright() as pw:
        kwargs = {"channel": channel} if channel else {}
        args = [*(FAST_ARGS if fast else []), *(catalog.RASTER_ARGS if raster else [])]
        b = pw.chromium.launch(headless=not headed, args=args, **kwargs)
        try:
            yield b
        finally:
            b.close()


def size(spec: str) -> tuple[int, int, float]:
    """'1280x720' or '1280x720*1.5' (a device scale factor) as (width, height, dsf)."""
    wh, _, dsf = spec.partition("*")
    w, h = map(int, wh.split("x"))
    return w, h, float(dsf or 1)


def new_context(b: Browser, viewport: tuple[int, int] = VIEWPORT, dsf: float = 1.0) -> BrowserContext:
    """A context at `viewport` px with device scale factor `dsf`."""
    return b.new_context(viewport={"width": viewport[0], "height": viewport[1]}, device_scale_factor=dsf)


def page_error(exc: Any) -> str:
    """An uncaught page exception as its message and the frame that threw it (path from html/ on)."""
    frame = next((line.strip()[3:] for line in (exc.stack or "").splitlines() if line.strip().startswith("at ")), "")
    frame = re.sub(r"\S*/html/", "", frame)
    return f"{exc} at {frame}" if frame else str(exc)


def new_page(context: BrowserContext, block_navigation: bool = False) -> tuple[Page, list[str]]:
    """(page, errors): errors collects the page's uncaught exceptions. block_navigation aborts requests that would
    leave play.html (a probe that clicks at random must not follow links)."""
    page = context.new_page()
    errors: list[str] = []
    page.on("pageerror", lambda exc: errors.append(page_error(exc)))
    if block_navigation:
        page.route("**/*", lambda route: route.abort() if route.request.is_navigation_request()
                   and route.request.frame == page.main_frame and "play.html" not in route.request.url
                   else route.continue_())
    return page, errors


def page_scenarios(page: Page) -> list[str]:
    """The scenarios of the booted widget (its own list, else the task's)."""
    return page.evaluate("() => __env.widgetDef.scenarios || __env.taskDef.scenarios || []")


def probe_page(context: BrowserContext, widget: catalog.Widget,
               seed: int = 0) -> tuple[Page, list[str], list, str | None]:
    """(page, errors, scenarios, boot_error) for the tools that probe a widget with random or noisy input (audit,
    precision, step_probe): a page that blocks navigation away from play.html (a click on a link must not leave
    it), booted on `widget`. scenarios is [None] when the widget lists none (the page samples one); boot_error is the
    message when the boot failed (the page is closed, scenarios empty) and None otherwise."""
    page, errors = new_page(context, block_navigation=True)
    try:
        boot(page, widget, seed)
    except Exception as exc:  # noqa: BLE001
        page.close()
        return page, errors, [], str(exc)
    return page, errors, page_scenarios(page) or [None], None


# ------------------------------------------------------------------------------------------------ workers

def default_jobs() -> int:
    """Worker processes by default: half the CPUs, at most 8."""
    return max(1, min(8, (os.cpu_count() or 2) // 2))


# Chunks per worker: cells differ a lot in length (a failing oracle runs to its action limit on every seed), so a
# fixed slice per worker leaves most of them idle while the slowest finishes. Smaller chunks go to whichever worker
# is free; each chunk still pays one browser launch.
CHUNKS_PER_JOB = 4


def run_pool(fn: Callable, work: Iterable, jobs: int, *args: Any) -> list:
    """fn(chunk, *args) for chunks of `work` dealt round-robin into about CHUNKS_PER_JOB chunks per worker and run by
    `jobs` worker processes as they come free (inline when one), merged back in the order of `work`. fn is a
    module-level function and returns one result per item of its chunk (a result may itself be a list). Each finished
    chunk prints a progress line to stderr, so a long run can be watched."""
    work = list(work)
    jobs = max(1, min(jobs, len(work)))
    if jobs == 1:
        return list(fn(work, *args))
    n = min(len(work), jobs * CHUNKS_PER_JOB)
    out = [None] * len(work)
    start, done = time.monotonic(), 0
    with ProcessPoolExecutor(jobs) as pool:
        futures = {pool.submit(fn, work[i::n], *args): i for i in range(n)}
        for future in as_completed(futures):
            i = futures[future]
            out[i::n] = future.result()
            done += len(out[i::n])
            print(f"progress: {done}/{len(work)} cells, {time.monotonic() - start:.0f}s", file=sys.stderr, flush=True)
    return out


def run_cells(work: Iterable, fn: Callable, *, viewport: tuple[int, int] = VIEWPORT,
              viewport_of: Callable[[object], str] | None = None, on_error: Callable | None = None,
              after: Callable | None = None, **browser_kwargs) -> list:
    """The body every tool's `run_cells(chunk, ...)` shares: one browser, a context per viewport, `fn(context, item)`
    per item of `work`, results in order.

    viewport     the one context's size (default VIEWPORT), unless viewport_of(item) returns a size spec for each
                 item ('1280x720' or '1280x720*1.5', see size()); contexts are kept per spec
    on_error     on_error(item, exc) -> result: an exception in fn becomes that result and the item's context is
                 closed and replaced for the next item (a crashed page stays open in it); without it exceptions
                 propagate
    after        after(item, result, seconds) once per finished item (progress lines, appending to a JSONL file)
    browser_kwargs  passed to browser() (headed, raster, channel, fast)"""
    results = []
    contexts: dict = {}
    with browser(**browser_kwargs) as b:
        for item in work:
            start = time.monotonic()
            spec = viewport_of(item) if viewport_of else None
            if spec not in contexts:
                if spec is None:
                    contexts[spec] = new_context(b, viewport)
                else:
                    w, h, dsf = size(spec)
                    contexts[spec] = new_context(b, (w, h), dsf)
            try:
                result = fn(contexts[spec], item)
            except Exception as exc:  # noqa: BLE001 - the caller decides whether one broken item fails the run
                if on_error is None:
                    raise
                result = on_error(item, exc)
                contexts.pop(spec).close()
            results.append(result)
            if after:
                after(item, result, time.monotonic() - start)
    return results


# ------------------------------------------------------------------------------------------------ files

def write_json(path: str | os.PathLike, obj: object, *, indent: int | None = 1, sort_keys: bool = False,
               ensure_ascii: bool = True) -> None:
    """Write obj to path as UTF-8 JSON with a final newline (parent folders are created). Values json cannot encode,
    such as a Path, are written as their str."""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    text = json.dumps(obj, indent=indent, sort_keys=sort_keys, ensure_ascii=ensure_ascii, default=str)
    path.write_text(text + "\n", encoding="utf-8")


def append_jsonl(path: str | os.PathLike, obj: object) -> None:
    """Append obj as one JSON line (flushed when the file closes, so a crashed run keeps the lines before it)."""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "a", encoding="utf-8") as fh:
        fh.write(json.dumps(obj, default=str) + "\n")


# ------------------------------------------------------------------------------------------------ arguments

def parser(doc: str | None) -> argparse.ArgumentParser:
    """An ArgumentParser whose help is the tool's module docstring."""
    return argparse.ArgumentParser(description=doc, formatter_class=argparse.RawDescriptionHelpFormatter)


def add_select(p: argparse.ArgumentParser, site: str | None = None, widget: bool = False) -> None:
    """--site (default `site`), --task and optionally --widget: which widgets a tool runs on."""
    p.add_argument("--site", default=site)
    p.add_argument("--task")
    if widget:
        p.add_argument("--widget", help="only this widget name")


def add_steps(p: argparse.ArgumentParser) -> None:
    """Add --steps (interpolated mouse moves per drag)."""
    p.add_argument("--steps", type=int, default=8, help="interpolated mouse moves per drag")


def add_jobs(p: argparse.ArgumentParser, default: int | None = None) -> None:
    """Add --jobs (worker processes)."""
    p.add_argument("--jobs", type=int, default=default or default_jobs(),
                   help="worker processes, one browser each (default: half the CPUs, at most 8)")
