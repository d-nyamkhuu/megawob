"""Solve megawob tasks through BrowserGym's gym API, sending the page oracle's actions as BrowserGym
action strings (mouse_drag_and_drop, mouse_down/move/up, mouse_click, keyboard_press/type).

    python server/smoke_gym.py                          # every task, every scenario, seed 0, binary reward
    python server/smoke_gym.py set-slider fill-form --seeds 0 1 2
    MEGAWOB_REWARD=shaped python server/smoke_gym.py    # also checks the shaped episode return
    python server/smoke_gym.py --plain --set dragSteps=split judgment=confirm difficulty=easy instructionNoise=mixed
    docker exec <container> python /opt/megawob/server/smoke_gym.py

Each episode must terminate with the success return for the reward mode: 1 (binary, dense) or
MEGAWOB_SHAPING + MEGAWOB_SUCCESS_BONUS (shaped, where per-step rewards telescope).
"""
import sys

import gymnasium as gym

import megawob.tasks
from megawob import catalog, driver

MAX_STEPS = 50


def scaled(a, s):
    """The oracle action in screenshot px: BrowserGym divides action coordinates by the episode's dsf."""
    if s == 1:
        return a
    a = dict(a)
    for k in ("at", "from", "to"):
        if k in a:
            a[k] = [v * s for v in a[k]]
    if "points" in a:
        a["points"] = [[v * s for v in p] for p in a["points"]]
    return a


def to_action(a):
    # Modifier keys go down before a click / drag / path / down and up after a click / drag / path / up.
    mods = a.get("modifiers") or []
    pre = [f"keyboard_down({m!r})" for m in mods] if a["type"] in ("click", "drag", "path", "down") else []
    post = [f"keyboard_up({m!r})" for m in reversed(mods)] if a["type"] in ("click", "drag", "path", "up") else []
    return "\n".join(pre + [_to_action(a)] + post)


def _to_action(a):
    if a["type"] == "click":
        return "mouse_click({:.1f}, {:.1f})".format(*a["at"])
    if a["type"] == "dblclick":
        return "mouse_dblclick({:.1f}, {:.1f})".format(*a["at"])
    if a["type"] == "tripleclick":
        # BrowserGym 0.14.3 has no triple click (mouse_click/mouse_dblclick take no click count) and its parser
        # only accepts action calls, so the route is three mouse_click calls in one action. They arrive as three
        # detail-1 clicks; pages count the run with util.clickCount(e) (same spot, same action, 500 ms).
        return "\n".join(["mouse_click({:.1f}, {:.1f})".format(*a["at"])] * 3)
    if a["type"] == "rightclick":
        return "mouse_click({:.1f}, {:.1f}, button='right')".format(*a["at"])
    if a["type"] == "down":
        return "mouse_move({:.1f}, {:.1f})\nmouse_down({:.1f}, {:.1f})".format(*a["at"], *a["at"])
    if a["type"] == "up":
        return "mouse_move({:.1f}, {:.1f})\nmouse_up({:.1f}, {:.1f})".format(*a["at"], *a["at"])
    if a["type"] == "wheel":
        return "scroll_at({:.0f}, {:.0f}, {:.0f}, {:.0f})".format(*a["at"], a.get("dx", 0), a["dy"])
    if a["type"] == "finish":
        return "send_msg_to_user({!r})".format(a.get("message") or "Done.")
    if a["type"] == "type":
        fill = "keyboard_type({!r})".format(a["text"]) if a["text"] else "keyboard_press('Delete')"
        return "mouse_click({:.1f}, {:.1f})\nkeyboard_press('Control+a')\n{}".format(*a["at"], fill)
    if a["type"] == "key":
        return "keyboard_press({!r})".format(a["key"])
    if a["type"] == "move":
        return "\n".join("mouse_move({:.1f}, {:.1f})".format(*p) for p in (a.get("points") or [a["at"]]))
    if a["type"] == "wait":
        return "noop(0)"
    if a["type"] == "drag":
        return "mouse_drag_and_drop({:.1f}, {:.1f}, {:.1f}, {:.1f})".format(*a["from"], *a["to"])
    pts = a["points"]
    calls = ["mouse_move({:.1f}, {:.1f})".format(*pts[0]), "mouse_down({:.1f}, {:.1f})".format(*pts[0])]
    calls += ["mouse_move({:.1f}, {:.1f})".format(*p) for p in pts[1:]]
    calls.append("mouse_up({:.1f}, {:.1f})".format(*pts[-1]))
    return "\n".join(calls)


def episode(name, seed, scenario=None, viewport=None, knobs=None):
    kwargs = {"task_kwargs": {"scenario": scenario, "knobs": knobs}}
    if viewport:
        kwargs["viewport"] = viewport
    env = gym.make(f"browsergym/miniwob.{name}", headless=True, **kwargs)
    try:
        obs, info = env.reset(seed=seed)
        p0 = info.get("task_info", {}).get("megawob", {}).get("progress", 0.0)
        dsf = info.get("task_info", {}).get("megawob", {}).get("dsf", 1.0)
        page = env.unwrapped.page
        scenarios = page.evaluate("() => __env.widgetDef.scenarios || __env.taskDef.scenarios || []")
        total, steps, term, errors = 0.0, 0, False, []
        # As the checker's budget: a split drag takes three actions (down, move, up).
        cap = MAX_STEPS * (3 if page.evaluate("() => __env.episode && __env.episode.drag") == "split" else 1)
        while not term and steps < cap:
            a = page.evaluate("() => __env.oracle()")
            if a is None:
                break
            obs, r, term, trunc, info = env.step(to_action(scaled(a, dsf)))
            total += r
            steps += 1
            if obs["last_action_error"]:
                errors.append(obs["last_action_error"])
        d = info.get("task_info", {}).get("megawob", {})
        ep = d.get("episode") or {}
        return {"goal": obs["goal"], "total": total, "steps": steps, "done": term, "errors": errors, "p0": p0,
                "knobs": f"{ep.get('start')}/{ep.get('instr')}/{'finish' if ep.get('finish') else 'submit'}"
                         f"/{ep.get('perturb') or '-'}/{ep.get('lang') or 'en'}/dsf{dsf:g}"
                         + "".join(f"/{v}" for v in (ep.get("level") if ep.get("level") != "normal" else None,
                                                      ep.get("judge"), ep.get("messy") if ep.get("messy") != "off" else None,
                                                      "split" if ep.get("drag") == "split" else None) if v), "viewport": d.get("viewport"),
                "shot": list(obs["screenshot"].shape[:2]),
                "dsf": dsf,
                "site": d.get("site"), "widget": d.get("widget"), "scenarios": scenarios,
                "scenario": page.evaluate("() => __env.spec.scenario")}
    finally:
        env.close()


def main():
    parser = driver.parser(__doc__)
    parser.add_argument("tasks", nargs="*", help="task names (default: one per task)")
    parser.add_argument("--seeds", type=int, nargs="+", default=[0])
    parser.add_argument("--no-scenarios", action="store_true", help="only the seed's own scenario")
    parser.add_argument("--plain", action="store_true", help="no randomization parameters: off start, header, submit, no overlay")
    parser.add_argument("--viewport", help="WxH for every episode (default: the task samples one per episode)")
    parser.add_argument("--set", nargs="+", default=[], metavar="KNOB=VALUE",
                        help="override randomization parameters, e.g. --set deviceScale=2 undeclaredInput=void")
    args = parser.parse_args()
    knobs = {"startState": "off", "instructionDisplay": "header", "finishByMessage": "0", "popups": "off"} if args.plain else None
    if args.set:
        knobs = {**(knobs or {}), **dict(kv.split("=", 1) for kv in args.set)}
    vp = dict(zip(("width", "height"), map(int, args.viewport.split("x")))) if args.viewport else None

    mode = catalog.config().reward
    shaping = catalog.config().shaping
    bonus = catalog.config().success_bonus
    # Shaped returns telescope: shaping * (1 - start progress) + bonus (start progress is 1 for solved starts).
    want_of = (lambda p0: shaping * (1 - p0) + bonus) if mode == "shaped" else (lambda p0: 1.0)
    names = args.tasks or [f for f in catalog.tasks()]
    unknown = [n for n in names if n not in megawob.tasks.TASKS]
    if unknown:
        sys.exit(f"unknown tasks: {unknown}")

    fail = 0
    for name in names:
        # A task's held-out scenarios (heldoutScenarios) are never forced: catalog.pick refuses them, and the
        # held-out composition split (composition=heldout) lets the page choose them.
        held = set(catalog.scenarios_index()["tasks"].get(megawob.tasks.TASKS[name].task, {}).get("heldout", []))
        for seed in args.seeds:
            first = episode(name, seed, None, vp, knobs)
            runs = [(first["scenario"], first)]
            if not args.no_scenarios:
                runs += [(v, episode(name, seed, v, vp, knobs)) for v in first["scenarios"]
                         if v != first["scenario"] and v not in held]
            for scenario, res in runs:
                vpd, dsf = res["viewport"] or {}, res["dsf"]
                want_shot = [round(vpd.get("height", 0) * dsf), round(vpd.get("width", 0) * dsf)]
                ok = (res["done"] and abs(res["total"] - want_of(res["p0"])) < 1e-6 and not res["errors"]
                      and res["shot"] == want_shot)
                fail += not ok
                print(f"{name:<14} seed {seed} {scenario or '-':<12} {res['site']}/{res['widget']} {res['knobs']:<28} "
                      f"steps={res['steps']:<2} return={res['total']:.3f} {'OK' if ok else 'FAIL'}  {res['goal'][:50]!r}"
                      + (f"  shot={res['shot']} want {want_shot}" if res["shot"] != want_shot else "")
                      + (f"  errors={res['errors'][:2]}" if res["errors"] else ""))
    print(f"reward mode {mode}: {'all OK' if not fail else f'{fail} FAILED'}")
    sys.exit(1 if fail else 0)


if __name__ == "__main__":
    main()
