"""Client-side helpers for the megawob OpenEnv server (megawob.serve).

    from megawob.client import screenshot
    result = env.step(BrowserGymAction(action_str="mouse_click(300, 200)"))
    img = screenshot(result.observation)          # PIL.Image (RGB), or None
    arr = screenshot(result.observation, array=True)  # HxWx3 uint8

Works with OpenEnv's stock BrowserGymEnv client: the encoded frame travels in observation.metadata.
"""
from __future__ import annotations

import base64
import io


def screenshot(observation: object, array: bool = False) -> object:
    """Decode metadata["megawob_screenshot"] (falls back to the nested-list observation.screenshot)."""
    meta = getattr(observation, "metadata", None) or (observation.get("metadata") if isinstance(observation, dict) else None) or {}
    shot = meta.get("megawob_screenshot")
    if shot:
        from PIL import Image

        img = Image.open(io.BytesIO(base64.b64decode(shot["data"]))).convert("RGB")
        if not array:
            return img
        import numpy as np

        return np.asarray(img)
    raw = getattr(observation, "screenshot", None)
    if raw is None:
        return None
    import numpy as np

    arr = np.asarray(raw, dtype=np.uint8)
    if array:
        return arr
    from PIL import Image

    return Image.fromarray(arr)
