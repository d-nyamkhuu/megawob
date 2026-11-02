"""OpenEnv BrowserGym server with megawob tasks registered.

Serves OpenEnv's `browsergym_env` (unmodified source) with megawob's tasks registered in the same process, so
`BrowserGymEnv.reset(task_name="reorder-items")` works next to the original MiniWoB++ tasks. The environment
class is a subclass that fixes two things for pixel agents:

  Screenshots. OpenEnv sends obs["screenshot"] as nested JSON lists of ints (about 15 MB per 1280x720 frame)
  and only when BROWSERGYM_INCLUDE_SCREENSHOT=true. Here the screenshot is an encoded image in the
  observation metadata, metadata["megawob_screenshot"] = {"format", "width", "height", "data" (base64)}, sent
  when MEGAWOB_SCREENSHOT is on (default: on unless MEGAWOB_INTERFACE=dom):
      MEGAWOB_SCREENSHOT          1 | 0
      MEGAWOB_SCREENSHOT_FORMAT   png (default, lossless) | jpeg | webp
      MEGAWOB_SCREENSHOT_QUALITY  jpeg / webp quality (default 90)
      MEGAWOB_SCREENSHOT_WIDTH    resize to this width before encoding (0 = keep; coordinates stay screenshot
                                  px, so a resized frame needs the agent's coordinates scaled back up)
  Plain PNG frames (the default: no resize, no MEGAWOB_REMOTE_DESKTOP profile, no nested-list field) are Chromium's own
  bytes, passed through undecoded; any other setting decodes once and encodes once.
  The nested-list field is still filled when BROWSERGYM_INCLUDE_SCREENSHOT=true (old clients).
  megawob.client.screenshot(observation) decodes it.

  Remote-desktop screens. MEGAWOB_REMOTE_DESKTOP (off default | citrix | rdp | vnc | lowres | mixed, or weights) runs
  every frame through megawob.screen before it is encoded; the profile is info["task_info"]["megawob"]["screen"].

  Tracks. MEGAWOB_INTERFACE=pixel strips the text modalities (text, axtree_txt, pruned_html) and every DOM-derived
  field of metadata["browsergym_obs"] (extra_element_properties is every element's bounding box), so a pixel
  policy only sees the screenshot, the goal and the chat; =dom sends no screenshot. See megawob.tracks.

    uvicorn megawob.serve:app --host 0.0.0.0 --port 8000
"""
from __future__ import annotations

import base64
import io
import os
import struct
import threading
from collections.abc import Callable
from contextlib import suppress
from functools import partial
from typing import Any

import numpy as np
from browsergym.core import env as bgym_env
from browsergym_env.models import BrowserGymAction, BrowserGymObservation
from browsergym_env.server import app as openenv_app
from browsergym_env.server.browsergym_environment import BrowserGymEnvironment
from openenv.core.env_server.http_server import create_app

import megawob.tasks  # noqa: F401  (registers browsergym/miniwob.<task>)
from megawob import catalog, screen, tracks


def encode_screenshot(array: Any, fmt: str | None = None, quality: int | None = None,
                      width: int | None = None) -> dict | None:
    """{"format", "width", "height", "data"} for an HxWx3 uint8 array (None for no screenshot). The defaults are
    catalog.config()'s MEGAWOB_SCREENSHOT_FORMAT / _QUALITY / _WIDTH."""
    if array is None:
        return None
    cfg = catalog.config()
    fmt = fmt or cfg.screenshot_format
    quality = quality or cfg.screenshot_quality
    width = cfg.screenshot_width if width is None else width
    from PIL import Image

    img = Image.fromarray(np.asarray(array, dtype=np.uint8))
    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")
    if width and img.width != width:
        img = img.resize((width, max(1, round(img.height * width / img.width))), Image.LANCZOS)
    buf = io.BytesIO()
    if fmt == "png":
        img.save(buf, format="PNG", optimize=False, compress_level=3)
    else:
        img.save(buf, format=fmt.upper(), quality=quality)
    return {"format": fmt, "width": img.width, "height": img.height,
            "data": base64.b64encode(buf.getvalue()).decode("ascii")}


# --- PNG pass-through ---
# BrowserGym's extract_screenshot (0.14.x, checked in megawob.reuse.check_browsergym) asks Chromium for a PNG over
# CDP, decodes it to an array, and the encoder above would encode it again. While a MegawobEnvironment can use the
# bytes as they are, the capture below takes the same CDP screenshot, keeps the bytes and gives BrowserGym a
# 1x1 stand-in array (nothing else reads obs["screenshot"] then).
_local = threading.local()
_extract_screenshot = bgym_env.extract_screenshot


def capture_png(page: Any) -> bytes:
    """Chromium's PNG of the page at the episode's screenshot scale (extract_screenshot without the decode)."""
    cdp = page.context.new_cdp_session(page)
    viewport = page.viewport_size or page.evaluate("() => ({width: window.innerWidth, height: window.innerHeight})")
    size = {"width": viewport["width"], "height": viewport["height"]}
    cdp.send("Emulation.setDeviceMetricsOverride",
             {**size, "deviceScaleFactor": getattr(page, "_bgym_scale_factor", 1.0), "mobile": False})
    answer = cdp.send("Page.captureScreenshot", {"format": "png"})
    cdp.send("Emulation.setDeviceMetricsOverride", {**size, "deviceScaleFactor": 1.0, "mobile": False})
    cdp.detach()
    return base64.b64decode(answer["data"])


def _capture(page: Any) -> Any:
    """BrowserGym's screenshot capture, or the PNG pass-through (see capture_png) when the server asked for it."""
    if not getattr(_local, "passthrough", False):
        return _extract_screenshot(page)
    _local.png = capture_png(page)
    return np.zeros((1, 1, 3), dtype=np.uint8)


bgym_env.extract_screenshot = _capture


def png_frame(png: bytes) -> dict:
    """The screenshot field for PNG bytes; width and height come from the IHDR chunk."""
    width, height = struct.unpack(">II", png[16:24])
    return {"format": "png", "width": width, "height": height, "data": base64.b64encode(png).decode("ascii")}


class MegawobEnvironment(BrowserGymEnvironment):
    """BrowserGymEnvironment with encoded screenshots and observation tracks (see the module docstring)."""

    def __init__(self, *args: Any, config: catalog.Config | None = None, **kwargs: Any) -> None:
        """Server-side environment configured from `config` (default: catalog.config())."""
        super().__init__(*args, **kwargs)
        self.config = config or catalog.config()
        self.track = self.config.interface
        self.screenshot = self.config.screenshot and self.track != "dom"
        self._screen = screen.Stream(self.config.remote_desktop)  # MEGAWOB_REMOTE_DESKTOP: remote-desktop frames (megawob.screen)
        self._passthrough = (self.screenshot and not self.include_screenshot and self.track != "both"
                             and self.config.screenshot_format == "png" and not self.config.screenshot_width
                             and self.config.remote_desktop == "off")

    def _observe(self, call: Callable, *args: Any, **kwargs: Any) -> Any:
        """call(...) with BrowserGym's screenshot capture keeping the PNG bytes (see PNG pass-through)."""
        _local.passthrough, _local.png = self._passthrough, None
        try:
            return call(*args, **kwargs)
        finally:
            _local.passthrough = False

    def reset(self, *args: Any, **kwargs: Any) -> Any:
        """Reset the screen transform's history, then the environment."""
        self._screen.reset()
        return self._observe(super().reset, *args, **kwargs)

    def step(self, *args: Any, **kwargs: Any) -> Any:
        """Step the environment, capturing the PNG for the observation."""
        return self._observe(super().step, *args, **kwargs)

    def _create_observation(self, obs: Any, info: Any, done: bool, reward: float) -> Any:
        """The OpenEnv observation with the megawob screenshot, track filter and screen transform applied."""
        png, _local.png = getattr(_local, "png", None), None
        if png is None and isinstance(obs, dict) and obs.get("screenshot") is not None:
            obs = {**obs, "screenshot": self._screen.frame(obs["screenshot"], info)}
        raw = obs.get("screenshot") if isinstance(obs, dict) else None
        if isinstance(obs, dict) and self.track != "both":
            obs = tracks.strip_obs(obs, self.track)
            if self.track == "pixel":
                # No text modality: the parent would otherwise rebuild axtree_txt / pruned_html from these.
                obs = {k: v for k, v in obs.items() if k not in ("dom_object", "axtree_object")}
        ob = super()._create_observation(obs, info, done, reward)
        meta = dict(ob.metadata or {})
        if self.screenshot:
            meta["megawob_screenshot"] = png_frame(png) if png else encode_screenshot(
                raw, self.config.screenshot_format, self.config.screenshot_quality, self.config.screenshot_width)
        if self.track == "dom":
            ob.screenshot = None
        ob.metadata = meta
        return ob


def build_app() -> Any:
    """The FastAPI app, configured from the same BROWSERGYM_* variables as OpenEnv's own app."""
    return create_app(
        partial(
            MegawobEnvironment,
            benchmark=openenv_app.benchmark,
            task_name=openenv_app.task_name,
            headless=openenv_app.headless,
            viewport_width=openenv_app.viewport_width,
            viewport_height=openenv_app.viewport_height,
            timeout=openenv_app.timeout,
            include_screenshot=openenv_app.include_screenshot,
        ),
        BrowserGymAction,
        BrowserGymObservation,
        env_name="browsergym_env",
        max_concurrent_envs=openenv_app.max_concurrent,
    )


app = build_app()


def main() -> None:
    """Run the OpenEnv server with uvicorn."""
    import uvicorn

    port = openenv_app.port
    if proxy_dir := os.environ.get("SBX_PROXY_DIR"):
        socket_path = os.path.join(proxy_dir, f"{port}.sock")
        os.makedirs(proxy_dir, exist_ok=True)
        with suppress(FileNotFoundError):
            os.unlink(socket_path)
        uvicorn.run(app, uds=socket_path)
    else:
        uvicorn.run(app, host="0.0.0.0", port=port)


if __name__ == "__main__":
    main()
