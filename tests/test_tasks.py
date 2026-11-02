"""Tests for megawob.tasks: the step reward in every mode (with the efficiency scaling), validate()'s chat parsing,
the action mapping and the task's URL, against a stub page. Needs BrowserGym (`pip install -e '.[browsergym]'`), no
browser: `python -m pytest tests/test_tasks.py`."""
import pytest

pytest.importorskip("browsergym.core")

from megawob import catalog, tasks  # noqa: E402


def make(reward="binary", env=None, name="set-slider", seed=3, **kw):
    cfg = catalog.Config.from_env(env or {})
    return tasks.TASKS[name](seed=seed, reward=reward, config=cfg, **kw)


def status(progress=0.0, done=False, success=False, dense=0.0, binary=0.0, **extra):
    score = {"error": 1.0, "tau": 0.1, "base": 1.0, "gate": 1.0, "potential": 0.0, "violations": []}
    return {"progress": progress, "done": done, "success": success, "reward_dense": dense, "reward_binary": binary,
            "end_reason": None, "ready": True, "score": score, **extra}


# ---------------------------------------------------------------- rewards

def test_binary_pays_only_on_the_last_step():
    t = make("binary")
    assert t._step_reward(status(0.4)) == (0.0, 0.4)
    assert t._step_reward(status(0.9, done=True, success=True, dense=1.0, binary=1.0)) == (1.0, pytest.approx(0.5))
    t = make("binary")
    assert t._step_reward(status(0.2, done=True, success=False, dense=0.3, binary=0.0))[0] == 0.0


def test_dense_pays_the_graded_score_at_the_end():
    t = make("dense")
    assert t._step_reward(status(0.4))[0] == 0.0
    assert t._step_reward(status(0.6, done=True, dense=0.37, binary=0.0))[0] == 0.37


def test_shaped_pays_progress_every_step_and_a_bonus_on_success():
    t = make("shaped", {"MEGAWOB_SHAPING": "0.5", "MEGAWOB_SUCCESS_BONUS": "2"})
    r1 = t._step_reward(status(0.4))
    r2 = t._step_reward(status(0.2))  # a worse step costs
    r3 = t._step_reward(status(1.0, done=True, success=True, dense=1.0, binary=1.0))
    assert r1 == (pytest.approx(0.2), pytest.approx(0.2))
    assert r2 == (pytest.approx(-0.1), pytest.approx(-0.1))
    assert r3 == (pytest.approx(0.4 + 2.0), pytest.approx(0.4))
    assert sum([r1[0], r2[0], r3[0]]) == pytest.approx(0.5 * 1.0 + 2.0)  # shaping * (final - start progress) + bonus


def test_shaped_without_success_has_no_bonus_and_a_violation_costs():
    t = make("shaped")
    assert t._step_reward(status(1.0))[0] == 1.0
    assert t._step_reward(status(-1.0, done=True, success=False))[0] == -2.0


def test_reward_mode_comes_from_the_config_unless_given():
    assert make(reward=None, env={"MEGAWOB_REWARD": "dense"}).reward_mode == "dense"
    assert make(reward=None, env={"MEGAWOB_PRESET": "small"}).reward_mode == "shaped"
    assert make("binary", {"MEGAWOB_PRESET": "small"}).reward_mode == "binary"
    with pytest.raises(ValueError):
        make("sparse")


def efficient(reward, w, ref, steps_before=0):
    t = make(reward, {"MEGAWOB_EFFICIENCY": str(w)})
    t.oracle_steps = ref
    t.agent_steps = steps_before
    return t


def test_efficiency_costs_the_same_per_wasted_action_after_the_free_ones():
    t = efficient("binary", 0.5, ref=2, steps_before=13)
    reward, _ = t._step_reward(status(1.0, done=True, success=True, binary=1.0, dense=1.0))  # agent step 14
    assert t.efficiency_factor == pytest.approx(1 - 0.5 * (14 - 2 - tasks.EFFICIENCY_FREE) / tasks.EFFICIENCY_SCALE)
    assert reward == pytest.approx(0.875)
    for ref in (2, 20):  # two free extra actions on a short task and on a long one
        t = efficient("binary", 1.0, ref=ref, steps_before=ref + 1)
        assert t._step_reward(status(1.0, done=True, success=True, binary=1.0))[0] == 1.0
        t = efficient("binary", 1.0, ref=ref, steps_before=ref + 2)  # the third extra action costs 1/40 on both
        assert t._step_reward(status(1.0, done=True, success=True, binary=1.0))[0] == pytest.approx(1 - 1 / 40)


def test_efficiency_bottoms_out_at_one_minus_the_weight():
    t = efficient("binary", 0.4, ref=1, steps_before=500)
    assert t._step_reward(status(1.0, done=True, success=True, binary=1.0))[0] == pytest.approx(0.6)


def test_efficiency_is_capped_at_one_and_needs_a_reference():
    t = efficient("binary", 1.0, ref=10, steps_before=1)
    assert t._step_reward(status(1.0, done=True, success=True, binary=1.0))[0] == 1.0
    t = efficient("binary", 1.0, ref=None, steps_before=9)
    assert t._step_reward(status(1.0, done=True, success=True, binary=1.0))[0] == 1.0 and t.efficiency_factor is None


def test_efficiency_leaves_failures_and_unfinished_steps_alone():
    t = efficient("binary", 1.0, ref=1, steps_before=5)
    assert t._step_reward(status(0.5))[0] == 0.0 and t.efficiency_factor is None
    assert t._step_reward(status(0.5, done=True, success=False, binary=0.0))[0] == 0.0


def test_efficiency_scales_only_the_bonus_in_shaped_mode():
    t = efficient("shaped", 0.5, ref=1, steps_before=22)  # step 23, 20 wasted: factor 0.75
    reward, shaping = t._step_reward(status(1.0, done=True, success=True))
    assert shaping == pytest.approx(1.0) and reward == pytest.approx(1.0 + 1.0 - 0.25)


def test_efficiency_measures_the_oracle_on_the_episode_once(monkeypatch):
    t = efficient("binary", 1.0, ref=None, steps_before=24)
    calls = []
    monkeypatch.setattr(t, "measure_oracle_steps", lambda: calls.append(1) or 3)
    assert t._step_reward(status(0.5))[0] == 0.0 and not calls  # measured only when the agent succeeds
    reward, _ = t._step_reward(status(1.0, done=True, success=True, binary=1.0))  # agent step 26, 21 wasted
    assert calls == [1] and t.oracle_steps == 3 and reward == pytest.approx(1 - 21 / 40)


def test_efficiency_without_a_page_measures_nothing():
    assert make("binary", {"MEGAWOB_EFFICIENCY": "1"}).measure_oracle_steps() is None


def test_efficiency_off_by_default():
    t = make("binary")
    t.oracle_steps = 1
    assert t._step_reward(status(1.0, done=True, success=True, binary=1.0))[0] == 1.0


# ---------------------------------------------------------------- the task's URL and config

def test_task_url_carries_the_config_knobs_and_step_ms():
    t = make(env={"MEGAWOB_START_STATE": "partial", "MEGAWOB_STEP_MS": "500"}, seed=5)
    assert "startState=partial" in t.url and "stepms=500" in t.url and "seed=5" in t.url
    assert t.knobs["startState"] == "partial" and "stepms" not in t.knobs
    assert t.viewport in catalog.parse_viewports(catalog.DEFAULT_VIEWPORTS)


def test_task_knobs_argument_beats_the_config():
    t = make(env={"MEGAWOB_START_STATE": "partial"}, knobs={"startState": "solved", "viewports": "800x600"})
    assert "startState=solved" in t.url and t.viewport == {"width": 800, "height": 600}


def test_eval_axis_overrides_the_config():
    t = make(env={"MEGAWOB_START_STATE": "off"}, name="set-slider.eval-start-state")
    assert t.knobs["startState"] == catalog.EVAL_PERTURBATIONS["start-state"]["startState"]


def test_task_is_deterministic_for_a_seed():
    a, b = make(seed=11), make(seed=11)
    assert (a.widget, a.url, a.viewport) == (b.widget, b.url, b.viewport)


# ---------------------------------------------------------------- validate

class StubPage:
    """Answers the few __env calls setup() and validate() make."""

    def __init__(self, st=None, feedback=""):
        self.url, self.st, self.feedback, self.finished, self.ticks = "about:blank", st or status(), feedback, [], 0

    def goto(self, url):
        self.url = url

    def wait_for_function(self, script):
        pass

    def evaluate(self, script, arg=None):
        if "__env.finish" in script:
            self.finished.append(arg)
        elif "__env.tick()" in script:
            self.ticks += 1
            return {"status": self.st, "feedback": self.feedback}
        elif "__env.bootInfo()" in script:
            return {"ready": True, "bootError": None, "viewport": {"width": 1280, "height": 720}, "goal": "the goal",
                    "status": self.st, "episode": {"start": "off"}, "scenario": None}
        else:
            raise AssertionError(script)


def chat(*messages):
    """BrowserGym's chat: an assistant greeting, the goal as a user message, then what was said."""
    return [{"role": "assistant", "message": "Hi!"}, {"role": "user", "message": "the goal"}, *messages]


def started(**kw):
    t, page = make(**kw), StubPage()
    goal, info = t.setup(page)
    assert goal == "the goal" and page.url == t.url and info["megawob"]["viewport"] == {"width": 1280, "height": 720}
    page.ticks = 0
    return t, page


def test_validate_rejects_another_page_or_url():
    t, page = started()
    assert t.validate(StubPage(), chat())[:3] == (0.0, True, "")
    page.url = "file:///elsewhere"
    reward, done, msg, info = t.validate(page, chat())
    assert (reward, done, msg, info) == (0.0, True, "", {"error": "invalid url, terminating task"})


def test_validate_without_a_message_only_ticks_the_clock():
    t, page = started()
    reward, done, msg, info = t.validate(page, chat())
    assert (reward, done, msg) == (0.0, False, "") and page.finished == [] and page.ticks == 1
    assert info["megawob"]["reward_mode"] == "binary" and info["EPISODE_ID"] == t.page_seed


def test_validate_passes_an_assistant_message_to_the_page_once():
    t, page = started()
    said = chat({"role": "assistant", "message": "All done."})
    t.validate(page, said)
    t.validate(page, said)
    assert page.finished == [["All done.", False]]
    t.validate(page, said + [{"role": "assistant", "message": "Really done."}])
    assert page.finished[-1] == ["Really done.", False] and len(page.finished) == 2


def test_validate_flags_infeasible_messages():
    t, page = started()
    t.validate(page, chat({"role": "infeasible", "message": "It cannot be done."}))
    assert page.finished == [["It cannot be done.", True]]


def test_validate_ignores_the_greeting_user_turns_and_non_dicts():
    t, page = started()
    t.validate(page, ["junk", {"role": "assistant", "message": "Hi!"}, {"role": "user", "message": "goal"},
                      {"role": "user", "message": "later user text"}, None])
    assert page.finished == []
    # no user message yet: nothing counts as said
    t, page = started()
    t.validate(page, [{"role": "assistant", "message": "Hi!"}])
    assert page.finished == []


def test_validate_reports_done_reward_and_input_feedback():
    t, page = started()
    page.st = status(1.0, done=True, success=True, dense=1.0, binary=1.0)
    page.feedback = "Keyboard input is not available on this page; use the mouse."
    reward, done, msg, info = t.validate(page, chat())
    assert (reward, done) == (1.0, True)
    assert info["megawob"]["input_feedback"].startswith("Keyboard input")
    assert info["megawob"]["reward_binary"] == 1.0 and info["REWARD_GLOBAL"] == 1.0


def test_validate_hands_the_notice_to_the_agent_once():
    t, page = started()
    page.st = status(0.3, notice="Stop, I changed my mind.")
    assert t.validate(page, chat())[2] == "Stop, I changed my mind."
    assert t.validate(page, chat())[2] == ""
    page.st = status(0.3, notice="New goal.")
    assert t.validate(page, chat())[2] == "New goal."
    page.st = status(0.3, notice="Newer.", done=True)  # not after the episode ended
    assert t.validate(page, chat())[2] == ""


# ---------------------------------------------------------------- action mapping

def test_action_mapping_guards_drags_and_reports_rejected_input():
    mapping = tasks.ActionMapping()
    drag = mapping("mouse_drag_and_drop(1, 2, 3, 4)")
    assert drag.startswith(tasks.SPLIT_GUARD) and drag.endswith(tasks.INPUT_FEEDBACK)
    click = mapping("mouse_click(5, 6)")
    assert tasks.SPLIT_GUARD not in click and click.endswith(tasks.INPUT_FEEDBACK)
