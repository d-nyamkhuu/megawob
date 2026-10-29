"""Remote-desktop screens (MEGAWOB_REMOTE_DESKTOP): what the agent sees when the app runs behind Citrix, RDP or VNC.

A screenshot transform, applied to the frame the agent gets (never to the checker's own screenshots). Pixels
change, geometry does not: the frame keeps its size, so action coordinates stay valid. Profiles (profile_for):

  off      the frame as rendered (default)
  citrix   JPEG quality 30-60 with chroma subsampling, and now and then tile-aligned regions that still show
           the previous frame (a stale tile the server has not refreshed)
  rdp      mild downscale + upscale, ClearType-like horizontal colour fringing, 16-bit (RGB565) colour
  vnc      256 colours (RGB332 or the 6x6x6 web cube, optionally dithered) and partial redraws: random
           rectangles keep the previous frame
  lowres   downscale to 0.5-0.75 and back up (a thin-client or low-bandwidth session)
  mixed    two of the above, one after the other

MEGAWOB_REMOTE_DESKTOP is one profile or weights, e.g. `citrix` or `off:.8,citrix:.1,vnc:.1`; the profile of an episode
is drawn from the episode seed (profile_for), reported in info["task_info"]["megawob"]["screen"], and applied
per frame by apply() with an rng derived from the profile and the step number (step_rng), so the same seed and
the same actions give the same frames. `prev` is the previous frame the agent saw (the transformed one).

Where it is applied: the OpenEnv server (megawob.serve) transforms every observation it sends; with plain
gymnasium, wrap the env: `env = ScreenObservation(gym.make("browsergym/miniwob.reorder-items"))`
(BrowserGym tasks cannot change the observation themselves).

    python -m megawob.screen in.png out.png --profile citrix --seed 3 --step 1
"""
from __future__ import annotations

import hashlib
import io
import random
from typing import Any

import numpy as np
from PIL import Image

from . import catalog, driver

NAMES = ("off", "citrix", "rdp", "vnc", "lowres", "mixed")
LEAVES = ("citrix", "rdp", "vnc", "lowres")

# 4x4 Bayer matrix in [-0.5, 0.5) for ordered dithering.
_BAYER = (np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]], dtype=np.float32) + 0.5) / 16 - 0.5


def default_spec() -> str:
    """The screen spec from MEGAWOB_REMOTE_DESKTOP."""
    return catalog.config().remote_desktop  # MEGAWOB_REMOTE_DESKTOP, read by catalog.Config


def parse_spec(spec: str | None = None) -> list[tuple[str, float]]:
    """[(name, weight)] of a spec: `citrix` or `off:.8,citrix:.1,vnc:.1`."""
    spec = (default_spec() if spec is None else str(spec)).strip() or "off"
    parts = []
    for item in spec.split(","):
        name, _, w = item.partition(":")
        name = name.strip()
        if name not in NAMES:
            raise ValueError(f"MEGAWOB_REMOTE_DESKTOP profile must be one of {NAMES}, got {name!r}")
        weight = float(w) if w.strip() else 1.0
        if weight > 0:
            parts.append((name, weight))
    if not parts:
        raise ValueError(f"MEGAWOB_REMOTE_DESKTOP has no positive weight: {spec!r}")
    return parts


def _make(name: str, rnd: random.Random) -> dict:
    if name == "citrix":
        return {"name": name, "quality": rnd.randint(30, 60), "subsampling": rnd.choice([1, 2, 2]),
                "stale_p": round(rnd.uniform(0.15, 0.4), 2), "tile": rnd.choice([32, 64])}
    if name == "rdp":
        return {"name": name, "scale": round(rnd.uniform(0.85, 0.95), 2), "cleartype": round(rnd.uniform(0.35, 0.7), 2),
                "depth": 16}
    if name == "vnc":
        return {"name": name, "mode": rnd.choice(["rgb332", "web216"]), "dither": rnd.random() < 0.5,
                "redraw_p": round(rnd.uniform(0.3, 0.6), 2)}
    if name == "lowres":
        return {"name": name, "scale": round(rnd.uniform(0.5, 0.75), 2), "down": rnd.choice(["box", "bilinear"]),
                "up": rnd.choice(["bilinear", "bicubic", "nearest"])}
    raise ValueError(name)


def profile_for(seed: int, spec: str | None = None) -> dict:
    """The episode's screen profile, a JSON-safe dict {"name", "seed", <parameters>} drawn from the seed.
    `spec` defaults to MEGAWOB_REMOTE_DESKTOP. mixed carries "stages": two leaf profiles applied in order."""
    parts = parse_spec(spec)
    seed = int(seed)
    if len(parts) == 1:
        name = parts[0][0]
    else:
        x = random.Random(f"screen/pick/{seed}").random() * sum(w for _, w in parts)
        name = parts[-1][0]
        for n, w in parts:
            x -= w
            if x < 0:
                name = n
                break
    profile = {"name": name, "seed": seed}
    rnd = random.Random(f"screen/{seed}")
    if name in LEAVES:
        profile.update({k: v for k, v in _make(name, rnd).items() if k != "name"})
    elif name == "mixed":
        profile["stages"] = [_make(n, rnd) for n in rnd.sample(LEAVES, 2)]
    return profile


def step_rng(profile: dict, step: int = 0) -> np.random.Generator:
    """The frame's rng: a function of the profile's seed and the step number only."""
    digest = hashlib.sha256(f"screen/{profile.get('seed', 0)}/{int(step)}".encode()).digest()
    return np.random.default_rng(int.from_bytes(digest[:8], "big"))


def _gen(rng: Any) -> np.random.Generator:
    if isinstance(rng, np.random.Generator):
        return rng
    if isinstance(rng, random.Random):
        return np.random.default_rng(rng.getrandbits(64))
    return np.random.default_rng(rng)


def _paste_prev(out: Image.Image, prev: Image.Image, box: tuple) -> None:
    out.paste(prev.crop(box), box)


def _stale_tiles(out: Image.Image, prev: Image.Image, rng: np.random.Generator, tile: int) -> None:
    w, h = out.size
    cols, rows = -(-w // tile), -(-h // tile)
    for _ in range(int(rng.integers(1, 4))):
        span = int(rng.integers(1, 4))
        cx, cy = int(rng.integers(0, cols)), int(rng.integers(0, rows))
        _paste_prev(out, prev, (cx * tile, cy * tile, min(w, (cx + span) * tile), min(h, (cy + 1) * tile)))


def _stale_rects(out: Image.Image, prev: Image.Image, rng: np.random.Generator) -> None:
    w, h = out.size
    for _ in range(int(rng.integers(1, 5))):
        rw, rh = int(w * rng.uniform(0.1, 0.35)), int(h * rng.uniform(0.1, 0.35))
        x, y = int(rng.integers(0, max(1, w - rw))), int(rng.integers(0, max(1, h - rh)))
        _paste_prev(out, prev, (x, y, x + rw, y + rh))


def _citrix(img: Image.Image, p: dict, prev: Image.Image | None, rng: np.random.Generator) -> Image.Image:
    q = int(np.clip(p["quality"] + int(rng.integers(-5, 6)), 30, 60))
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=q, subsampling=int(p["subsampling"]))
    out = Image.open(io.BytesIO(buf.getvalue())).convert("RGB")
    if prev is not None and rng.random() < p["stale_p"]:
        _stale_tiles(out, prev, rng, int(p["tile"]))
    return out


def _rgb565(a: np.ndarray) -> np.ndarray:
    r, g, b = a[..., 0] >> 3, a[..., 1] >> 2, a[..., 2] >> 3
    return np.stack([(r << 3) | (r >> 2), (g << 2) | (g >> 4), (b << 3) | (b >> 2)], axis=-1).astype(np.uint8)


def _rdp(img: Image.Image, p: dict, prev: Image.Image | None, rng: np.random.Generator) -> Image.Image:
    w, h = img.size
    s = float(p["scale"])
    out = img.resize((max(1, round(w * s)), max(1, round(h * s))), Image.BILINEAR).resize((w, h), Image.BILINEAR)
    a = np.asarray(out, dtype=np.float32)
    # Horizontal [1 2 1] smoothing, then the colour channels sampled one pixel apart (R left, B right): the
    # coloured fringes of sub-pixel text rendering.
    pad = np.pad(a, ((0, 0), (1, 1), (0, 0)), mode="edge")
    blur = (pad[:, :-2] + 2 * pad[:, 1:-1] + pad[:, 2:]) / 4
    pb = np.pad(blur, ((0, 0), (1, 1), (0, 0)), mode="edge")
    fringe = np.stack([pb[:, :-2, 0], pb[:, 1:-1, 1], pb[:, 2:, 2]], axis=-1)
    c = float(p["cleartype"])
    mixed = np.clip(np.rint(a * (1 - c) + fringe * c), 0, 255).astype(np.uint8)
    return Image.fromarray(_rgb565(mixed), "RGB")


def _vnc(img: Image.Image, p: dict, prev: Image.Image | None, rng: np.random.Generator) -> Image.Image:
    a = np.asarray(img, dtype=np.float32)
    h, w = a.shape[:2]
    noise = np.tile(_BAYER, (-(-h // 4), -(-w // 4)))[:h, :w, None] if p["dither"] else 0.0
    if p["mode"] == "rgb332":
        steps = np.array([255 / 7, 255 / 7, 255 / 3], dtype=np.float32)
    else:  # the 6x6x6 web cube
        steps = np.full(3, 51.0, dtype=np.float32)
    q = np.clip(np.rint(a / steps + noise), 0, np.rint(255 / steps)) * steps
    out = Image.fromarray(np.clip(np.rint(q), 0, 255).astype(np.uint8), "RGB")
    if prev is not None and rng.random() < p["redraw_p"]:
        _stale_rects(out, prev, rng)
    return out


_DOWN = {"box": Image.BOX, "bilinear": Image.BILINEAR}
_UP = {"bilinear": Image.BILINEAR, "bicubic": Image.BICUBIC, "nearest": Image.NEAREST}


def _lowres(img: Image.Image, p: dict, prev: Image.Image | None, rng: np.random.Generator) -> Image.Image:
    w, h = img.size
    s = float(p["scale"])
    small = img.resize((max(1, round(w * s)), max(1, round(h * s))), _DOWN[p["down"]])
    return small.resize((w, h), _UP[p["up"]])


_STAGES = {"citrix": _citrix, "rdp": _rdp, "vnc": _vnc, "lowres": _lowres}


def apply(img: Image.Image, profile: dict, prev: Image.Image | None = None, rng: Any = None) -> Image.Image:
    """The frame as the profile's remote session shows it: same size, RGB. `prev` is the previous frame shown
    (stale tiles and partial redraws copy from it; ignored when its size differs); `rng` a numpy Generator,
    random.Random or int (default step_rng(profile, 0)). Deterministic given the arguments; `off` returns img."""
    name = profile.get("name", "off")
    if name == "off":
        return img
    rng = _gen(step_rng(profile, 0) if rng is None else rng)
    if img.mode != "RGB":
        img = img.convert("RGB")
    if prev is not None:
        prev = prev.convert("RGB") if prev.mode != "RGB" else prev
        if prev.size != img.size:
            prev = None
    for stage in (profile["stages"] if name == "mixed" else [profile]):
        img = _STAGES[stage["name"]](img, stage, prev, rng)
    return img


class Stream:
    """Per-environment state for the frames of one episode: the step counter and the previous frame shown.

    frame(array, info) transforms one HxWx3 uint8 screenshot; the profile comes from the step's info
    (info["task_info"]["megawob"]["screen"], else drawn from its seed with MEGAWOB_REMOTE_DESKTOP). Frames of
    environments that are not megawob tasks (no info["task_info"]["megawob"]) pass through. Call reset()
    at each env reset (a new seed also starts a new episode)."""

    def __init__(self, spec: str | None = None) -> None:
        self.spec = spec
        self.reset()

    def reset(self) -> None:
        self.step = 0
        self.prev = None
        self.seed = None
        self.profile = None

    def _profile(self, info: Any) -> dict | None:
        info = info if isinstance(info, dict) else {}
        d = (info.get("task_info") or {}).get("megawob") or info.get("megawob")
        if not isinstance(d, dict):
            return self.profile
        if d.get("seed") != self.seed:
            self.reset()
            self.seed = d.get("seed")
        if self.profile is None:
            self.profile = d.get("screen") or profile_for(d.get("seed") or 0, self.spec)
        return self.profile

    def frame(self, array: Any, info: Any = None) -> Any:
        """The screenshot array run through the episode's profile (unchanged without one)."""
        profile = self._profile(info)
        if array is None or profile is None:
            return array
        step, self.step = self.step, self.step + 1
        if profile.get("name", "off") == "off":
            return array
        arr = np.asarray(array, dtype=np.uint8)
        out = apply(Image.fromarray(arr[..., :3] if arr.ndim == 3 else arr), profile, self.prev, step_rng(profile, step))
        self.prev = out
        res = np.asarray(out, dtype=np.uint8)
        return np.concatenate([res, arr[..., 3:]], axis=-1) if arr.ndim == 3 and arr.shape[-1] > 3 else res


try:
    import gymnasium as gym
except ImportError:  # the pure transform needs no gymnasium
    gym = None

if gym is not None:

    class ScreenObservation(gym.Wrapper):
        """Applies the episode's screen profile to obs["screenshot"] (direct gym use; the OpenEnv server does it itself)."""

        def __init__(self, env: gym.Env, spec: str | None = None) -> None:
            super().__init__(env)
            self.stream = Stream(spec)

        def _xf(self, obs: Any, info: Any) -> Any:
            if isinstance(obs, dict) and obs.get("screenshot") is not None:
                obs = {**obs, "screenshot": self.stream.frame(obs["screenshot"], info)}
            return obs

        def reset(self, **kwargs: Any) -> tuple:
            """Reset the stream and the environment; the observation's screenshot is transformed."""
            self.stream.reset()
            obs, info = self.env.reset(**kwargs)
            return self._xf(obs, info), info

        def step(self, action: Any) -> tuple:
            """Step the environment; the observation's screenshot is transformed."""
            obs, reward, terminated, truncated, info = self.env.step(action)
            return self._xf(obs, info), reward, terminated, truncated, info


def main() -> None:
    """Command line: transform one image."""
    parser = driver.parser(__doc__)
    parser.add_argument("input", nargs="?", help="image to transform")
    parser.add_argument("output", nargs="?")
    parser.add_argument("--profile", default="citrix", help="profile or weights (default citrix)")
    parser.add_argument("--seed", type=int, default=0)
    parser.add_argument("--step", type=int, default=0)
    args = parser.parse_args()
    if not (args.input and args.output):
        parser.error("input and output images are required")
    profile = profile_for(args.seed, args.profile)
    out = apply(Image.open(args.input).convert("RGB"), profile, None, step_rng(profile, args.step))
    out.save(args.output)
    print(profile)


if __name__ == "__main__":
    main()
