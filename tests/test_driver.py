"""Tests for megawob.driver: the oracle loop, action sending, worker pool and size parsing against a fake page.
No browser: `python -m pytest tests/test_driver.py`."""
import pytest

from megawob import driver


class FakeMouse:
    def __init__(self, log):
        self.log = log

    def __getattr__(self, name):
        return lambda *a, **kw: self.log.append(("mouse." + name, *a, *kw.items()))


class FakeKeyboard(FakeMouse):
    def __getattr__(self, name):
        return lambda *a, **kw: self.log.append(("key." + name, *a))


class FakePage:
    """Plays back a list of oracle actions; the episode is `done` once they are used up and `end_after` is reached."""

    def __init__(self, actions, drag="atomic", done_after=None, score=None):
        self.actions, self.drag, self.done_after = list(actions), drag, done_after
        self.log, self.sent = [], []
        self.mouse, self.keyboard = FakeMouse(self.log), FakeKeyboard(self.log)
        self.score = score or [{"error": 5, "tau": 1}]

    def evaluate(self, script, arg=None):
        if "__env.oracle()" in script:
            return self.actions.pop(0) if self.actions else None
        if "__env.episode.drag" in script:
            return self.drag
        if "__env.episode.fault" in script:
            return getattr(self, "fault", None)
        if "__env.done" in script:
            return self.done_after is not None and len(self.sent) >= self.done_after
        if "__env.stepClock" in script:
            self.sent.append("tick")
            return None
        if "__env.score()" in script:
            return {**self.score[min(len(self.sent), len(self.score) - 1)]}
        if "__env.status()" in script:
            return {"success": False, "done": False}
        if script == driver.MARK_SCROLL:
            self.log.append(("mark",))
            return None
        if script == driver.SETTLE_SCROLL:
            self.log.append(("settle",))
            return None
        if "__env.finish" in script:
            self.log.append(("finish", arg))
            return None
        raise AssertionError(script)

    def wait_for_timeout(self, ms):
        self.log.append(("wait", ms))


CLICK = {"type": "click", "at": [10, 20]}


def test_budget_triples_for_split_drags():
    assert driver.budget(FakePage([])) == driver.MAX_ACTIONS
    assert driver.budget(FakePage([], drag="split")) == 3 * driver.MAX_ACTIONS


def test_budget_doubles_when_a_fault_undoes_work():
    for kind, factor in (("clear", 2), ("revert", 2), ("miss", 1), (None, 1)):
        page = FakePage([])
        page.fault = kind
        assert driver.budget(page) == factor * driver.MAX_ACTIONS


def test_oracle_loop_runs_until_the_oracle_has_no_action():
    page = FakePage([CLICK, {"type": "key", "key": "Enter"}])
    run = driver.oracle_loop(page, 8)
    assert (run.n, run.ended, run.repeats) == (2, "oracle", 0)
    assert [e[0] for e in page.log] == ["mouse.click", "key.press"]


def test_oracle_loop_cap_and_default_budget():
    page = FakePage([CLICK] * 100)
    assert driver.oracle_loop(page, 8, cap=3) == driver.Run(3, CLICK, 2, "cap")
    page = FakePage([CLICK] * 100)
    assert driver.oracle_loop(page, 8).n == driver.MAX_ACTIONS
    assert driver.oracle_loop(FakePage([CLICK]), 8, cap=0).n == 0


def test_oracle_loop_counts_repeats_and_stops_when_stuck():
    page = FakePage([CLICK] * 10)
    run = driver.oracle_loop(page, 8, stuck_after=3)
    assert (run.n, run.ended, run.repeats) == (4, "stuck", 3)
    page = FakePage([CLICK, {"type": "wait"}, CLICK, CLICK])
    run = driver.oracle_loop(page, 8, stuck_after=3)
    assert run.ended == "oracle" and run.repeats == 1


def test_oracle_loop_stuck_counts_only_repeats_without_effect():
    class Page(FakePage):  # the step fingerprint changes with every action: a repeated click that makes progress
        def evaluate(self, script, arg=None):
            out = super().evaluate(script, arg)
            return f"step {len(self.sent)}" if "__env.stepClock" in script else out
    run = driver.oracle_loop(Page([CLICK] * 10), 8, stuck_after=3)
    assert (run.n, run.ended) == (10, "oracle")


def test_oracle_loop_until_is_checked_before_each_fetch():
    page = FakePage([CLICK] * 5)
    run = driver.oracle_loop(page, 8, until=lambda p: len(p.sent) >= 2)
    assert (run.n, run.ended) == (2, "until")
    assert len(page.actions) == 3  # no action was fetched after the condition held


def test_oracle_loop_until_finish_does_not_send_the_finish():
    page = FakePage([CLICK, {"type": "finish", "message": "done"}])
    run = driver.oracle_loop(page, 8, until_finish=True)
    assert (run.n, run.ended) == (1, "finish")
    assert not any(e[0] == "finish" for e in page.log)
    page = FakePage([CLICK, {"type": "finish", "message": "done"}])
    assert driver.oracle_loop(page, 8).n == 2
    assert ("finish", "done") in page.log


def test_oracle_loop_stop_on_done():
    page = FakePage([CLICK] * 5, done_after=2)
    run = driver.oracle_loop(page, 8, stop_on_done=True)
    assert (run.n, run.ended) == (2, "done")


def test_oracle_loop_send_replaces_the_default_act():
    page, seen = FakePage([CLICK, CLICK]), []
    run = driver.oracle_loop(page, 8, send=lambda p, a: seen.append(a))
    assert run.n == 2 and seen == [CLICK, CLICK] and page.log == []


def test_run_oracle_reports_the_stuck_point():
    class Page(FakePage):
        def evaluate(self, script, arg=None):
            if "elementFromPoint" in script:
                return 'aside.promo "Get more"'
            if "__env.status()" in script:
                return {"success": False, "done": False}
            return super().evaluate(script, arg)
    status, n = driver.run_oracle(Page([CLICK] * 5), 8)
    assert n == 5
    assert status["stuck"] == 'stuck: click at 10,20 repeated 5x without effect, the point hits aside.promo "Get more"'


def test_run_oracle_has_no_stuck_note_on_success():
    class Page(FakePage):
        def evaluate(self, script, arg=None):
            if "__env.status()" in script:
                return {"success": True}
            return super().evaluate(script, arg)
    status, _ = driver.run_oracle(Page([CLICK] * 4), 8)
    assert "stuck" not in status


def test_run_oracle_until_within_stops_at_the_tolerance():
    class Page(FakePage):
        def evaluate(self, script, arg=None):
            if "const s = __env.score()" in script:
                return len(self.sent) >= 2  # each action ticks the clock once
            return super().evaluate(script, arg)
    page = Page([CLICK] * 10)
    driver.run_oracle_until_within(page, 8)
    assert len([e for e in page.log if e[0] == "mouse.click"]) == 2 and len(page.actions) == 8


def test_act_wraps_modifiers_around_pointer_actions():
    page = FakePage([])
    driver.act(page, {"type": "click", "at": [1, 2], "modifiers": ["Shift", "Control"]}, 8)
    assert page.log == [("key.down", "Shift"), ("key.down", "Control"), ("mouse.click", 1, 2),
                        ("key.up", "Control"), ("key.up", "Shift")]
    assert page.sent == ["tick"]  # one action = one clock step


def test_act_kinds():
    page = FakePage([])
    driver.act(page, {"type": "drag", "from": [1, 1], "to": [5, 5]}, 8)
    driver.act(page, {"type": "tripleclick", "at": [3, 4]}, 8)
    driver.act(page, {"type": "type", "at": [3, 4], "text": ""}, 8)
    driver.act(page, {"type": "wheel", "at": [3, 4], "dy": 100}, 8)
    driver.act(page, {"type": "path", "points": [[0, 0], [1, 1], [2, 2]]}, 8)
    driver.act(page, {"type": "finish", "message": "ok"}, 8)
    kinds = [e[0] for e in page.log]
    assert kinds == ["mouse.move", "mouse.down", "mouse.move", "mouse.up",
                     "mouse.click", "mouse.click", "key.press", "key.press",
                     "mouse.move", "mark", "mouse.wheel", "settle",
                     "mouse.move", "mouse.down", "mouse.move", "mouse.move", "mouse.up", "finish"]
    assert ("mouse.click", 3, 4, ("click_count", 3)) in page.log
    assert page.log[-1] == ("finish", "ok")
    assert ("key.press", "Delete") in page.log
    with pytest.raises(ValueError):
        driver.act(page, {"type": "teleport"}, 8)


def test_size_parses_viewport_specs():
    assert driver.size("1280x720") == (1280, 720, 1.0)
    assert driver.size("1024x640*1.5") == (1024, 640, 1.5)


def double(chunk, k):
    return [x * k for x in chunk]


def test_run_pool_inline_keeps_the_order():
    assert driver.run_pool(double, [1, 2, 3], 1, 10) == [10, 20, 30]
    assert driver.run_pool(double, [], 4, 2) == []


def test_run_pool_workers_merge_back_in_work_order():
    work = list(range(11))
    assert driver.run_pool(double, work, 3, 2) == [x * 2 for x in work]
    assert driver.run_pool(double, work, 99, 3) == [x * 3 for x in work]  # more jobs than items


def test_argument_helpers():
    p = driver.parser("doc")
    driver.add_select(p, site="base", widget=True)
    driver.add_steps(p)
    driver.add_jobs(p, default=3)
    args = p.parse_args([])
    assert (args.site, args.task, args.widget, args.steps, args.jobs) == ("base", None, None, 8, 3)
    args = p.parse_args(["--site", "x", "--task", "slider", "--jobs", "2"])
    assert (args.site, args.task, args.jobs) == ("x", "slider", 2)
    q = driver.parser(None)
    driver.add_select(q)
    assert q.parse_args([]).site is None
