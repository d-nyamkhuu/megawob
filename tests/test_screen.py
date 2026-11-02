"""Tests for megawob.screen (remote-desktop screen profiles): `python -m pytest tests/test_screen.py`."""
import numpy as np
from PIL import Image

from megawob import screen


def page(seed=0, size=(480, 300)):
    """A page-like frame: white ground, gradient header, coloured blocks, thin text-like stripes."""
    rng = np.random.default_rng(seed)
    w, h = size
    a = np.full((h, w, 3), 245, dtype=np.uint8)
    a[:40] = np.linspace([20, 60, 160], [90, 140, 220], w).astype(np.uint8)[None]
    for _ in range(12):
        x, y = int(rng.integers(0, w - 80)), int(rng.integers(50, h - 40))
        a[y:y + 30, x:x + int(rng.integers(30, 80))] = rng.integers(0, 256, 3)
    for y in range(60, h - 10, 9):
        a[y:y + 2, 20:int(rng.integers(100, w - 20)):2] = 20
    return Image.fromarray(a, "RGB")


def diff(a, b):
    return int(np.abs(np.asarray(a, dtype=int) - np.asarray(b, dtype=int)).sum())


def episode(profile, frames=3):
    imgs, prev = [], None
    for step in range(frames):
        out = screen.apply(page(step), profile, prev, screen.step_rng(profile, step))
        imgs.append(out)
        prev = out
    return imgs


def test_the_default_spec_comes_from_the_catalog_config():
    from megawob import catalog

    saved = catalog.config()
    try:
        assert screen.default_spec() == saved.remote_desktop
        catalog.set_config(catalog.Config.from_env({"MEGAWOB_REMOTE_DESKTOP": "rdp"}))
        assert screen.default_spec() == "rdp" and screen.parse_spec() == [("rdp", 1.0)]
        assert screen.profile_for(3)["name"] == "rdp"
    finally:
        catalog.set_config(saved)


def test_off_is_identity():
    img = page()
    profile = screen.profile_for(1, "off")
    assert profile["name"] == "off"
    assert screen.apply(img, profile, page(2), screen.step_rng(profile, 0)) is img
    arr = np.asarray(img)
    stream = screen.Stream("off")
    info = {"task_info": {"megawob": {"seed": 5}}}
    assert stream.frame(arr, info) is arr


def test_each_profile_changes_pixels_and_keeps_size():
    img = page()
    for name in ("citrix", "rdp", "vnc", "lowres", "mixed"):
        for seed in range(6):
            profile = screen.profile_for(seed, name)
            assert profile["name"] == name
            out = screen.apply(img, profile, None, screen.step_rng(profile, 0))
            assert out.size == img.size and out.mode == "RGB", (name, seed)
            assert diff(out, img) > 0, (name, seed)


def test_deterministic_in_seed_and_step():
    for name in ("citrix", "rdp", "vnc", "lowres", "mixed"):
        p1, p2 = screen.profile_for(7, name), screen.profile_for(7, name)
        assert p1 == p2
        a, b = episode(p1), episode(p2)
        for x, y in zip(a, b):
            assert x.tobytes() == y.tobytes(), name
        # An rng argument of another kind is accepted too.
        import random

        r1 = screen.apply(page(), p1, None, random.Random("x"))
        r2 = screen.apply(page(), p1, None, random.Random("x"))
        assert r1.tobytes() == r2.tobytes()


def test_seeds_and_steps_vary():
    profiles = {repr(screen.profile_for(s, "citrix")) for s in range(20)}
    assert len(profiles) > 5
    p = screen.profile_for(3, "mixed")
    assert len(p["stages"]) == 2 and p["stages"][0]["name"] != p["stages"][1]["name"]
    assert screen.step_rng(p, 0).random() != screen.step_rng(p, 1).random()


def test_spec_weights():
    names = [screen.profile_for(s, "off:.8,citrix:.1,vnc:.1")["name"] for s in range(400)]
    assert set(names) == {"off", "citrix", "vnc"}
    assert 0.65 < names.count("off") / len(names) < 0.95
    assert screen.profile_for(0, "")["name"] == "off"
    try:
        screen.profile_for(0, "teams")
    except ValueError:
        pass
    else:
        raise AssertionError("an unknown profile must raise")


def test_profile_ranges():
    for seed in range(30):
        c = screen.profile_for(seed, "citrix")
        assert 30 <= c["quality"] <= 60 and c["subsampling"] in (1, 2)
        assert 0.5 <= screen.profile_for(seed, "lowres")["scale"] <= 0.75
        assert screen.profile_for(seed, "rdp")["depth"] == 16


def test_vnc_palette():
    img = page()
    for seed in range(6):
        p = screen.profile_for(seed, "vnc")
        p["redraw_p"] = 0
        out = np.asarray(screen.apply(img, p, None, 0))
        colours = np.unique(out.reshape(-1, 3), axis=0)
        assert len(colours) <= 256, (p, len(colours))


def test_rdp_is_16_bit():
    out = np.asarray(screen.apply(page(), screen.profile_for(2, "rdp"), None, 0))
    assert set(np.unique(out[..., 0])) <= {(v << 3) | (v >> 2) for v in range(32)}
    assert set(np.unique(out[..., 1])) <= {(v << 2) | (v >> 4) for v in range(64)}


def test_stale_regions_copy_the_previous_frame():
    prev, img = page(1), page(2)
    stale = {"name": "citrix", "seed": 1, "quality": 40, "subsampling": 2, "stale_p": 1.0, "tile": 32}
    out = screen.apply(img, stale, prev, 11)
    base = screen.apply(img, {**stale, "stale_p": 0.0}, prev, 11)
    a, b, c = (np.asarray(x, dtype=int) for x in (out, base, prev))
    changed = (a != b).any(axis=-1)
    assert changed.any()
    assert (a[changed] == c[changed]).all()  # where it differs from the fresh frame it is the previous one
    redraw = {"name": "vnc", "seed": 1, "mode": "rgb332", "dither": False, "redraw_p": 1.0}
    out = screen.apply(img, redraw, prev, 12)
    base = screen.apply(img, {**redraw, "redraw_p": 0.0}, prev, 12)
    a, b, c = (np.asarray(x, dtype=int) for x in (out, base, prev))
    changed = (a != b).any(axis=-1)
    assert changed.any() and (a[changed] == c[changed]).all()
    # A previous frame of another size is ignored.
    assert screen.apply(img, stale, Image.new("RGB", (10, 10)), 11).size == img.size


def test_stream_follows_the_episode():
    arr = np.asarray(page())
    info = {"task_info": {"megawob": {"seed": 4}}}
    s1, s2 = screen.Stream("citrix"), screen.Stream("citrix")
    f1 = [s1.frame(np.asarray(page(i)), info) for i in range(3)]
    f2 = [s2.frame(np.asarray(page(i)), info) for i in range(3)]
    assert all((x == y).all() for x, y in zip(f1, f2))
    assert (f1[0] != np.asarray(page(0))).any() and f1[0].shape == arr.shape and f1[0].dtype == np.uint8
    s1.reset()  # a new episode with the same seed replays the same frames
    assert (s1.frame(np.asarray(page(0)), info) == f1[0]).all()
    # The profile reported in info wins over the spec; frames without megawob info pass through.
    forced = {"task_info": {"megawob": {"seed": 9, "screen": {"name": "lowres", "seed": 9, "scale": 0.5,
                                                              "down": "box", "up": "nearest"}}}}
    assert (screen.Stream("off").frame(arr, forced) != arr).any()
    assert screen.Stream("citrix").frame(arr, {}) is arr
    assert screen.Stream("citrix").frame(None, info) is None
