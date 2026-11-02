"""Reset in place (MEGAWOB_REUSE=1): keep BrowserGym's browser, context, page and chat between megawob episodes.

BrowserGym's BrowserEnv.reset closes and relaunches two Chromium browsers (the task page and the chat) on every
episode, which dominates reset time for short tasks. install() patches BrowserEnv.reset so that when both the
previous and the next task are megawob tasks it instead:

  - releases the mouse button and modifier keys, closes extra tabs, clears the chat;
  - resizes the viewport if the next task wants another size;
  - runs the next task's setup on the same page: the same task / site / widget is reset in place with
    __env.reset (no page load), anything else is a page.goto;
  - then does the rest of BrowserGym's reset (goal into the chat, observation, info) as BrowserGym 0.14 does.

Anything else (the first reset, a non-megawob task, video recording, a closed browser) goes through BrowserGym's
own reset. On by default; MEGAWOB_REUSE=0 opts out. tests/test_reuse_parity.py checks that reused and fresh episodes
give identical observations, rewards and info. The episode content is the same either way: pages are seeded and the kit's reset rebuilds the page.
"""
from __future__ import annotations

import importlib.metadata
import logging
import time
from typing import Any

import playwright.sync_api
from browsergym.core import env as bgym_env
from browsergym.core.chat import CHATBOX_DIR, get_chatbox_modern

logger = logging.getLogger(__name__)
_original_reset = None
BROWSERGYM_SERIES = "0.14"  # _reset_reused copies the tail of BrowserEnv.reset (and serve.capture_png its screenshot) from here


def check_browsergym() -> str:
    """The installed browsergym-core version; raises unless it is the series whose internals are copied here."""
    version = importlib.metadata.version("browsergym-core")
    if ".".join(version.split(".")[:2]) != BROWSERGYM_SERIES:
        raise RuntimeError(f"megawob.reuse copies BrowserGym {BROWSERGYM_SERIES}.x internals, found browsergym-core "
                           f"{version}: compare BrowserEnv.reset with _reset_reused, then update BROWSERGYM_SERIES, "
                           "or set MEGAWOB_REUSE=0")
    return version


def _reusable(env: Any) -> bool:
    """Whether this task's reset can reuse the open page (see the module docstring)."""
    from .tasks import MegawobTask

    # A BrowserEnv's task entrypoint never changes, so a megawob task last time means a megawob task next time.
    return (
        isinstance(env.task, MegawobTask)
        and not env.record_video_dir
        and not env.resizeable_window
        and env.browser is not None and env.browser.is_connected()
        and env.chat is not None and env.chat.browser.is_connected()
        and env.page is not None and not env.page.is_closed()
    )


def _reset(self: Any, seed: int | None = None, *args: Any, **kwargs: Any) -> Any:
    """BrowserEnv.reset: in place when the open page can be reused, else the original."""
    if not _reusable(self):
        return _original_reset(self, seed, *args, **kwargs)
    try:
        return _reset_reused(self, seed, *args, **kwargs)
    except (playwright.sync_api.Error, RuntimeError) as err:  # fall back to a clean relaunch
        logger.warning("megawob reuse: reset in place failed (%s); relaunching the browser", err)
        return _original_reset(self, seed, *args, **kwargs)


def _reset_reused(self: Any, seed: int | None = None, *args: Any, **kwargs: Any) -> Any:
    """BrowserEnv.reset without relaunching the browser: reset the task on the open page (BrowserGym 0.14.x internals)."""
    super(bgym_env.BrowserEnv, self).reset(seed=seed, *args, **kwargs)
    self.np_random = None
    self.task.teardown()
    page = self.page
    # Nothing held over from the last episode: buttons, modifiers, other tabs.
    page.mouse.up()
    for key in ("Shift", "Control", "Alt", "Meta"):
        page.keyboard.up(key)
    for other in list(self.context.pages):
        if other is not page:
            other.close()
    self.page_history = {page: None}

    self.task = self.task_entrypoint(seed=seed, **self.task_kwargs)
    viewport = self.viewport or self.task.viewport
    if viewport and page.viewport_size != viewport:
        page.set_viewport_size(viewport)
    self.context.set_default_timeout(self.timeout if self.timeout is not None else self.task.timeout)

    # A fresh chat: same page, content reloaded (the exposed send_user_message survives set_content).
    self.chat.messages = []
    self.chat.page.set_content(get_chatbox_modern(CHATBOX_DIR))

    page._megawob_reuse = True
    try:
        task_goal, task_info = self.task.setup(page=page)
    finally:
        page._megawob_reuse = False

    # From here on as BrowserGym 0.14.x's BrowserEnv.reset.
    if task_goal is None:
        self.goal_object = []
    elif isinstance(task_goal, str):
        self.goal_object = [{"type": "text", "text": task_goal}]
    elif isinstance(task_goal, list):
        self.goal_object = task_goal
    else:
        raise ValueError(f"task_goal should be of type str or list, got {task_goal.__class__}")
    self.chat.add_message(
        role="assistant",
        msg="Hi! I am your UI assistant, I can perform web tasks for you. What can I help you with?",
    )
    for message in self.goal_object:
        if message["type"] == "text":
            self.chat.add_message(role="user", msg=message["text"])
        elif message["type"] == "image_url":
            src = message["image_url"]
            self.chat.add_message(role="user_image", msg=src["url"] if isinstance(src, dict) else src)
        else:
            raise ValueError(f"Unknown message type {message['type']!r} in the task goal.")
    self._wait_dom_loaded()
    self._active_page_check()
    self.start_time = time.time()
    self.last_action = ""
    self.last_action_error = ""
    self.infeasible_message_received = False
    self._wait_for_user_message()
    obs = self._get_obs()
    return obs, {"task_info": task_info}


def install() -> None:
    """Patch BrowserEnv.reset (idempotent)."""
    global _original_reset
    if _original_reset is not None:
        return
    check_browsergym()
    _original_reset = bgym_env.BrowserEnv.reset
    bgym_env.BrowserEnv.reset = _reset
