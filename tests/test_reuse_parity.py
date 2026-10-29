"""Reset in place (megawob.reuse) must not change an episode: the first observations, rewards and info of a
sequence of episodes are identical with MEGAWOB_REUSE=1 and with MEGAWOB_REUSE=0 (a fresh browser per reset).
The OpenEnv server's PNG pass-through (megawob.serve) must give the pixels the decode and re-encode path gives.

Needs BrowserGym, gymnasium and Chromium (the Docker image, see docs/checks.md); skipped where they are missing:

    docker run --rm --shm-size=1g $U -v "$PWD":/opt/megawob -w /opt/megawob --entrypoint python megawob -m pytest -q tests/test_reuse_parity.py

Each mode runs in its own process (python tests/test_reuse_parity.py trace <0|1>) that prints one JSON trace.
"""
import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
# Same task twice in a row (reset in place when the seeds pick the same widget), another task (page load), back again.
EPISODES = [("set-slider", 0), ("set-slider", 1), ("set-slider", 0), ("reorder-items", 2), ("use-email", 3),
            ("set-slider", 4), ("set-slider", 5)]
STEPS = 4
DROP_INFO = ("action_exec_start", "action_exec_stop", "action_exec_timeout", "wait_for_page_loading_start",
             "wait_for_page_loading_stop", "validation_start", "validation_stop", "get_observation_start",
             "get_observation_stop")


def _obs(obs):
    from browsergym.utils.obs import flatten_axtree_to_str

    shot = obs["screenshot"]
    return {"goal": obs["goal"], "url": obs["url"], "axtree": flatten_axtree_to_str(obs["axtree_object"]),
            "boxes": obs["extra_element_properties"], "focus": obs["focused_element_bid"],
            "error": obs["last_action_error"],
            "chat": [m["message"] for m in obs["chat_messages"]],
            "shot": [list(shot.shape), hashlib.sha1(shot.tobytes()).hexdigest()]}


def _info(info):
    return {k: v for k, v in info.items() if k not in DROP_INFO}


def trace() -> list:
    import gymnasium as gym

    sys.path.insert(0, str(ROOT))
    import megawob.tasks  # noqa: F401
    from server.smoke_gym import scaled, to_action

    out, env, task = [], None, None
    for name, seed in EPISODES:
        if task != name:
            env and env.close()
            env, task = gym.make(f"browsergym/miniwob.{name}", headless=True), name
        obs, info = env.reset(seed=seed)
        rec = [{"obs": _obs(obs), "info": _info(info)}]
        page = env.unwrapped.page
        for _ in range(STEPS):
            action = page.evaluate("() => __env.oracle()")
            if action is None:
                break
            obs, reward, term, trunc, info = env.step(to_action(scaled(action, info["task_info"]["megawob"]["dsf"])))
            rec.append({"obs": _obs(obs), "reward": reward, "term": term, "trunc": trunc, "info": _info(info)})
            if term:
                break
        out.append({"task": name, "seed": seed, "steps": rec})
    env.close()
    return out


def _run(reuse: str) -> list:
    done = subprocess.run([sys.executable, __file__, "trace", reuse], capture_output=True, text=True, timeout=600,
                          env={**os.environ, "MEGAWOB_REUSE": reuse, "PYTHONPATH": os.pathsep.join(filter(None, [str(ROOT), os.environ.get("PYTHONPATH")]))})
    assert done.returncode == 0, done.stderr[-2000:]
    return json.loads(done.stdout.splitlines()[-1])


def test_reused_episodes_match_fresh_ones():
    pytest.importorskip("browsergym.core")
    pytest.importorskip("gymnasium")
    fresh, reused = _run("0"), _run("1")
    assert len(fresh) == len(reused) == len(EPISODES)
    for a, b in zip(fresh, reused):
        assert a == b, f"{a['task']} seed {a['seed']}: reused episode differs from the fresh one"


def test_serve_png_passthrough_matches_reencode():
    pytest.importorskip("browsergym.core")
    pytest.importorskip("browsergym_env")
    from browsergym_env.models import BrowserGymAction

    from megawob import client, serve

    def frames(passthrough):
        env = serve.MegawobEnvironment(benchmark="miniwob", task_name="set-slider", headless=True)
        env._passthrough = passthrough
        try:
            first = env.reset(seed=1)
            second = env.step(BrowserGymAction(action_str="mouse_click(100, 100)"))
            return [client.screenshot(o, array=True) for o in (first, second)]
        finally:
            env.close()

    for a, b in zip(frames(True), frames(False)):
        assert a.shape == b.shape and (a == b).all()


if __name__ == "__main__" and sys.argv[1:2] == ["trace"]:
    print(json.dumps(trace(), default=str))
