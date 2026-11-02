"""End-to-end smoke test against a running server, using OpenEnv's unmodified client.

    docker run --rm -p 8000:8000 megawob:dev
    python server/smoke_client.py http://localhost:8000

Checks an original MiniWoB++ task and every megawob task task: reset returns the goal, a coordinate
action executes, and finishing (send_msg_to_user) right away ends the episode; the reward is 0 unless the
episode happened to start solved (start mode 'solved').
(Solving tasks needs the in-page oracle; `python -m megawob.check` and the gym-level test cover that.)
"""
import asyncio
import re
import sys

from browsergym_env import BrowserGymAction, BrowserGymEnv

TASKS = ["reorder-items", "set-slider", "resize-element", "crop-image", "pick-color", "sort-into-bins", "select-text",
         "draw-shape", "rotate-object", "click-point", "type-text", "choose-option", "set-date", "fill-form", "click-control",
         "read-figure", "solve-puzzle", "find-fact", "handle-text", "act-in-time", "use-email", "use-social-feed", "use-shop",
         "use-desktop-tools", "scroll-page", "change-settings", "complete-wizard", "complete-goals", "use-data-grid", "use-file-manager",
         "transfer-items", "pan-map", "align-layout", "use-admin-console", "use-bank", "use-site-builder", "use-calendar",
         "use-chat", "use-dev-tools", "use-dispatch", "use-health-records", "use-accounting", "use-workflow-editor", "use-form-builder", "use-gov-portal",
         "use-smart-home", "use-hr", "use-legacy-app", "use-course-admin", "use-project-board", "use-spreadsheet", "use-slides", "use-travel",
         "avoid-dark-patterns", "resist-injection", "avoid-phishing", "protect-privacy", "use-text-editor", "recall-info", "set-slider.eval-all",
         "fill-form.eval-instructions", "use-email.eval-page-faults"]


def bid_of(text: str, role: str, name: str) -> str | None:
    m = re.search(rf"\[([^\]]+)\] {role} '{re.escape(name)}'", text)
    return m.group(1) if m else None


async def main(url: str) -> int:
    failures = 0
    async with BrowserGymEnv(base_url=url) as env:
        r = await env.reset(task_name="click-button", seed=0)
        print("click-button goal:", r.observation.goal)
        r = await env.step(BrowserGymAction(action_str="noop()"))
        print("  step ok, reward", r.reward, "done", r.done)

        for name in TASKS:
            try:
                r = await env.reset(task_name=name, seed=0)
            except Exception as exc:  # noqa: BLE001
                print(f"{name}: reset failed: {exc}")
                failures += 1
                continue
            obs = r.observation
            r = await env.step(BrowserGymAction(action_str="mouse_move(5, 700)"))
            # The end control's label and placement vary (some episodes have none): finish by message instead.
            r = await env.step(BrowserGymAction(action_str="send_msg_to_user('Done.')"))
            info = r.observation.metadata.get("browsergym_info", {}).get("task_info", {})
            start = info.get("megawob", {}).get("episode", {}) or {}
            ok = r.done and (r.reward == 0.0 or start.get("start") == "solved") and not r.observation.last_action_error
            failures += not ok
            print(f"{name}: goal={obs.goal[:60]!r} done={r.done} reward={r.reward} "
                  f"site={info.get('megawob', {}).get('site')} {'OK' if ok else 'FAIL'}")
    return failures


if __name__ == "__main__":
    sys.exit(1 if asyncio.run(main(sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000")) else 0)
