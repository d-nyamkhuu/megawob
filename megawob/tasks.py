"""BrowserGym registration: importing this module registers every megawob task as
`browsergym/miniwob.<name>`, next to the original MiniWoB++ tasks.

    import megawob.tasks
    env = gym.make("browsergym/miniwob.reorder-items")

Episodes end when the agent clicks the page's end control, sends a chat message to the user
(send_msg_to_user, the "finish" route; pages in finish mode have no end control at all), a wrong
irreversible choice ends the task, or the agent breaks a process rule (the planted shortcut, a layout
change).

Input kinds a task does not allow (keyboard or wheel on a pointer-only page) are rejected by the page: the
event is swallowed (no effect), the episode continues, and the step's obs["last_action_error"] says so
("InputRejected: Keyboard input is not available on this page; use the mouse."), raised by the action
mapping registered with each task; info["task_info"]["megawob"]["rejected"] counts them per kind.
MEGAWOB_UNDECLARED_INPUT=void (knob stray) restores the old rule: such input ends the episode with reward 0.

Each episode samples knobs from its seed (catalog.config().knobs, MEGAWOB_INSTRUCTION_DISPLAY/FINISH/START/PERTURB): where the
instruction shows (or only in obs["goal"]), finish mode, start state (off/partial/wrong/solved), overlay
perturbations, the viewport (MEGAWOB_VIEWPORTS, unless the env
sets one) and the screenshot scale (MEGAWOB_DEVICE_SCALE, default 1: screenshots are dsf x the CSS viewport and action
coordinates are screenshot px; info["task_info"]["megawob"]["dsf"]). Tasks named
<base>.eval-<perturbation> hold one perturbation out (catalog.EVAL_PERTURBATIONS). Reward modes (MEGAWOB_REWARD,
or the `reward` task kwarg):

  binary  0 on every step; on the final step 1 if successful (MiniWoB's convention). Default.
  dense   0 on every step; on the final step the graded score: 1 within tolerance, else the Gaussian of
          error/sigma times max(0, progress), so ending where the episode started earns 0; 0 on a violation.
  shaped  every step: MEGAWOB_SHAPING * (progress_t - progress_{t-1}), where progress = 1 - error/start_error
          clipped to [-1, 1], 1 once within tolerance and -1 after a violation; plus MEGAWOB_SUCCESS_BONUS on
          the final step if successful. The episode return is MEGAWOB_SHAPING * (final - start progress) +
          MEGAWOB_SUCCESS_BONUS * success: it pays for getting closer even without success (not a
          potential-based shaping of the binary reward), and a violation always costs.

Every step's info["task_info"]["megawob"] carries all of them (reward_binary, reward_dense, progress,
shaping), so a trainer can switch definitions without changing the env.

The goal is __env.goal(): the instruction, then (structured replies) a reply format drawn per episode
(html/kit/runtime/reply.js: a layout, field names and status words from banks). The message the agent ends with is
passed to the page (__env.finish(text); report_infeasible passes {infeasible: true}) and graded from data the task
declares, never on word lists. MEGAWOB_REPLY_FORMAT picks how: structured (a status and fields), free (plain text of at most
300 characters naming the same things) or auto (default: structured in the workflow apps and safety tasks, free
elsewhere). A structured reply has a status (done, or ask when the instruction is ambiguous, impossible, confirm before an irreversible step,
declined for an unsafe request, stopped after a preempt cancel; knob judge, MEGAWOB_JUDGMENT) and its fields (the
candidates, the missing thing, the reason code, the facts the goal asks for in report episodes, MEGAWOB_REPORT_FACTS, the
items changed before a stop). In answerIn=reply episodes (MEGAWOB_ANSWER_IN; tasks with answers(), widgets with
answerReply) the page has no answer field and the ending message carries the answer. In preempt episodes
(MEGAWOB_INTERRUPTIONS) the user interrupts after the agent's 1st-3rd change or mid-drag: validate() returns the new message once as
its user_message, so BrowserGym adds it to the chat (the page shows it too, on sites with a notice toast). Page
faults (MEGAWOB_PAGE_FAULTS), silent failures (MEGAWOB_SILENT_FAILURES) and safety hazards (MEGAWOB_SAFETY_HAZARDS: taking the bait ends
the episode with reward 0) are page-side; info["task_info"]["megawob"] reports them. dragSteps=split episodes (MEGAWOB_DRAG_STEPS)
refuse drag_and_drop / mouse_drag_and_drop with a DragSplit error in last_action_error: the agent presses
(mouse_down), moves (mouse_move) and releases (mouse_up) in separate actions and sees the page in between.

MEGAWOB_INTERFACE (megawob.tracks) picks the action subsets: both (default), pixel (coordinates only) or dom
(bids only). MEGAWOB_PRESET=small (catalog.PRESETS) sets defaults for small policies (shaped reward,
easier levels). MEGAWOB_REUSE (megawob.reuse, on; 0 opts out) keeps the browser and chat between resets.
"""
from __future__ import annotations

import logging
import random

import playwright.sync_api
from browsergym.core.action.highlevel import HighLevelActionSet
from browsergym.core.registration import register_task
from browsergym.core.task import AbstractBrowserTask

from . import catalog, screen, tracks

log = logging.getLogger(__name__)
REWARD_MODES = catalog.REWARD_MODES

# Appended to every action's Python code: if the page rejected input during the action (a key or the wheel
# on a page that does not allow it), raise, so BrowserGym puts the message into obs["last_action_error"].
INPUT_FEEDBACK = '''
from megawob.tasks import InputRejected

_megawob_feedback = page.evaluate("() => (window.__env && window.__env.inputFeedback) ? window.__env.inputFeedback() : ''")
if _megawob_feedback:
    raise InputRejected(_megawob_feedback)
'''


class InputRejected(Exception):
    """The page rejected input the action sent; the action code imports it (the classes are defined once)."""


class DragSplit(Exception):
    """A one-go drag on a dragSteps=split page."""


# Prepended to actions that drag in one go: dragSteps=split episodes refuse them before anything happens.
SPLIT_GUARD = '''
from megawob.tasks import DragSplit

if page.evaluate("() => !!(window.__env && window.__env.episode && window.__env.episode.drag === 'split')"):
    raise DragSplit("drag and drop in one action is not available on this page: press with mouse_down, move with mouse_move and release with mouse_up, one action each")
'''
DRAG_CALLS = ("drag_and_drop(", "mouse_drag_and_drop(")


class ActionMapping:
    """BrowserGym's high-level action mapping plus the rejected-input feedback (a picklable callable)."""

    def __init__(self, subsets: list[str] | None = None) -> None:
        self.action_set = HighLevelActionSet(subsets=subsets or tracks.action_subsets())  # the subsets of MEGAWOB_INTERFACE (megawob.tracks)

    def __call__(self, action: str) -> str:
        code = self.action_set.to_python_code(action)
        if any(call in action for call in DRAG_CALLS):
            code = SPLIT_GUARD + code
        return code + INPUT_FEEDBACK


class MegawobTask(AbstractBrowserTask):
    """A megawob episode as a BrowserGym task: boots a widget's page, rewards from __env.status(), ends on its signals."""
    task: str = ""
    split: str | None = "train"
    site: str | None = None
    perturbation: str | None = None
    subdomain: str = ""
    desc: str = ""
    nondeterministic: bool = False

    @classmethod
    def get_task_id(cls) -> str:
        """BrowserGym id of the task, miniwob.<subdomain>."""
        return f"miniwob.{cls.subdomain}"

    def __init__(
        self,
        seed: int | None,
        base_url: str | None = None,
        reward: str | None = None,
        scenario: str | None = None,
        knobs: dict | None = None,
        config: catalog.Config | None = None,
    ) -> None:
        super().__init__(seed)
        self.config = config or catalog.config()
        self.slow_mo = 0
        self.timeout = 5000
        self.page_seed = int(seed) if seed is not None else int(self.random.randint(0, 2**31 - 1))
        self.widget, picked = catalog.pick(self.task, random.Random(f"site/{catalog.salt(self.task)}/{self.page_seed}"),
                                         split=self.split, site=self.site, scenario=scenario)
        self.reward_mode = reward or self.config.reward
        if self.reward_mode not in REWARD_MODES:
            raise ValueError(f"reward must be one of {REWARD_MODES}, got {self.reward_mode!r}")
        flags = {**self.config.knobs, **(catalog.EVAL_PERTURBATIONS.get(self.perturbation, {}) if self.perturbation else {}), **(knobs or {})}
        viewports = catalog.parse_viewports(flags.pop("viewports", self.config.viewports))
        rnd = random.Random(f"viewport/{catalog.salt(self.task)}/{self.page_seed}")
        self.viewport = rnd.choice(viewports)
        # Screenshot scale (MEGAWOB_DEVICE_SCALE): BrowserGym captures screenshots at page._bgym_scale_factor and divides
        # action coordinates by it, so agents see and act in dsf x CSS px. The page records it as episode.dsf.
        self.dsf = float(catalog.pick_weighted(flags.pop("deviceScale", None) or "1", random.Random(f"dsf/{catalog.salt(self.task)}/{self.page_seed}")))
        if self.dsf <= 0:
            raise ValueError(f"dsf must be positive, got {self.dsf}")
        if self.dsf != 1:
            flags["deviceScale"] = self.dsf
        if self.config.interface == "dom":
            flags["dragSteps"] = "atomic"  # no bid press / release to split a drag with
        self.knobs = flags
        # Scenario first (catalog.pick), except where the page must choose: the held-out composition split.
        if scenario is None and flags.get("composition") != "heldout":
            scenario = picked
        self.scenario = scenario
        self.url = catalog.page_url(self.widget, self.page_seed, scenario=scenario, base=base_url,
                                    **{"stepms": self.config.step_ms, **flags})
        self.n_messages = 0
        self.shaping = self.config.shaping
        self.success_bonus = self.config.success_bonus
        self.prev_progress = 0.0

    def setup(self, page: playwright.sync_api.Page) -> tuple[str, dict]:
        self.page = page
        page._bgym_scale_factor = self.dsf
        # MEGAWOB_REUSE (megawob.reuse): the same task, site and widget is reset in place, without a page load.
        if not (getattr(page, "_megawob_reuse", False) and self._reset_in_place(page)):
            page.goto(self.url)
        page.wait_for_function("() => window.__env && (window.__env.ready || window.__env.bootError)")
        boot = page.evaluate("() => window.__env.bootInfo()")
        if boot["bootError"]:
            raise RuntimeError(f"megawob page failed to boot ({self.url}): {boot['bootError']}")
        # BrowserGym may override the sampled task viewport when the environment sets one explicitly.
        # Keep self.viewport for pre-setup configuration, but report the CSS viewport actually rendered.
        self.actual_viewport = boot["viewport"]
        goal, status, self.episode, self.page_scenario = boot["goal"], boot["status"], boot["episode"], boot["scenario"]
        self.prev_progress = float(status["progress"])
        self.n_messages = 0
        self.notified = None
        return goal, self._get_info(status, 0.0)

    def _reset_in_place(self, page: playwright.sync_api.Page) -> bool:
        """Reset the loaded page to this task's URL with __env.reset, if it shows the same task/site/widget."""
        from urllib.parse import parse_qs, urlsplit

        try:
            if not page.evaluate("() => !!(window.__env && window.__env.ready)"):
                return False
            old, new = urlsplit(page.url), urlsplit(self.url)
            q_old = {k: v[0] for k, v in parse_qs(old.query).items()}
            q_new = {k: v[0] for k, v in parse_qs(new.query).items()}
            same = (old.scheme, old.netloc, old.path) == (new.scheme, new.netloc, new.path) and all(
                q_old.get(k) == q_new.get(k) for k in ("task", "site", "widget"))
            if not same:
                return False
            # Knobs of the old URL that the new one lacks are cleared (undefined), not inherited.
            page.evaluate(
                """([url, q, old]) => {
                    const opts = {};
                    for (const k of Object.keys(old)) opts[k] = undefined;
                    Object.assign(opts, q);
                    history.replaceState(null, '', url);
                    window.__env.reset(Number(q.seed), q.scenario || undefined, opts);
                }""",
                [self.url, q_new, q_old],
            )
            return page.url == self.url
        except playwright.sync_api.Error:
            return False

    def teardown(self) -> None:
        pass

    def _step_reward(self, status: dict) -> tuple[float, float]:
        """(reward for this step, its shaping part). Shaping is only paid in shaped mode."""
        shaping = self.shaping * (float(status["progress"]) - self.prev_progress)
        self.prev_progress = float(status["progress"])
        if self.reward_mode == "shaped":
            return shaping + (self.success_bonus if status["success"] else 0.0), shaping
        if not status["done"]:
            return 0.0, shaping
        return float(status["reward_dense"] if self.reward_mode == "dense" else status["reward_binary"]), shaping

    def _get_info(self, status: dict, reward: float, shaping: float = 0.0) -> dict:
        score = status["score"]
        return {
            # MiniWoB-style keys, so code that reads them keeps working.
            "REWARD_GLOBAL": reward,
            "RAW_REWARD_GLOBAL": status["reward_dense"],
            "REWARD_REASON": status["end_reason"],
            "DONE_GLOBAL": status["done"],
            "EPISODE_ID": self.page_seed,
            "TASK_READY": status["ready"],
            "megawob": {
                "task": self.widget.task,
                "site": self.widget.site,
                "widget": self.widget.name,
                "split": self.widget.split,
                "seed": self.page_seed,
                "perturbation": self.perturbation,
                "episode": getattr(self, "episode", None),
                "viewport": self.actual_viewport,
                "dsf": self.dsf,
                "reward_mode": self.reward_mode,
                "reward": reward,
                "reward_binary": status["reward_binary"],
                "reward_dense": status["reward_dense"],
                "progress": status["progress"],
                "shaping": shaping,
                "success": status["success"],
                "error": score["error"],
                "tau": score["tau"],
                "base": score["base"],
                "gate": score["gate"],
                "potential": score["potential"],
                "violations": score["violations"],
                # Input the page rejected so far this episode, per kind ({keyboard, wheel}).
                "rejected": status.get("rejected"),
                # The agent's final message (judge episodes are graded on it) and whether it was report_infeasible.
                "message": status.get("message"),
                "infeasible": status.get("infeasible"),
                # Round-2 knobs: the interrupting user message (preempt), the safety hazard kind the agent fell
                # for (safety), the page fault and whether it fired (fault), whether a silent failure was applied.
                "notice": status.get("notice"),
                "unsafe": status.get("unsafe"),
                "fault": status.get("fault"),
                "silent": status.get("silent"),
            },
        }

    def validate(self, page: playwright.sync_api.Page, chat_messages: list) -> tuple[float, bool, str, dict]:
        if page != self.page:
            return 0.0, True, "", {"error": "invalid page, terminating task"}
        if page.url != self.url:
            return 0.0, True, "", {"error": "invalid url, terminating task"}
        # A message to the user ends the episode (the finish route; the only one in finish mode).
        # (BrowserGym's chat opens with an assistant greeting, then the goal as a user message; only assistant
        # messages after the goal are the agent's.)
        # report_infeasible adds an "infeasible" message: it ends the episode too, flagged as such. The text of
        # the newest message reaches the page (judge episodes are graded on it).
        msgs = [m for m in chat_messages if isinstance(m, dict)]
        roles = [m.get("role") for m in msgs]
        first_user = roles.index("user") if "user" in roles else len(roles)
        said = [m for m in msgs[first_user + 1:] if m.get("role") in ("assistant", "infeasible")]
        if len(said) > self.n_messages:
            self.n_messages = len(said)
            last = said[-1]
            page.evaluate(
                "([text, infeasible]) => window.__env.finish(text, { infeasible })",
                [str(last.get("message", "")), last.get("role") == "infeasible"],
            )
        # One agent action is worth MEGAWOB_STEP_MS of task time (timed tasks and overlays).
        # Rejected input the action mapping did not report (a custom mapping, or the action raised first) comes
        # back with the status; the mapping's own inputFeedback() call already drained what it reported.
        tick = page.evaluate("() => window.__env.tick()")
        status, feedback = tick["status"], tick["feedback"]
        reward, shaping = self._step_reward(status)
        info = self._get_info(status, reward, shaping)
        if feedback:
            info["megawob"]["input_feedback"] = feedback
        # A user message that interrupts the task (knob preempt) reaches the agent once, as a chat message.
        notice = status.get("notice")
        user_message = ""
        if notice and notice != getattr(self, "notified", None) and not status["done"]:
            self.notified = notice
            user_message = str(notice)
        return reward, bool(status["done"]), user_message, info


# --- Remote-desktop screens (MEGAWOB_REMOTE_DESKTOP, megawob.screen) and the efficiency reward (MEGAWOB_EFFICIENCY) ---
# Screen: the episode's profile is reported in info["megawob"]["screen"]; the frames themselves are transformed
# by megawob.serve (OpenEnv) or megawob.screen.ScreenObservation (gym), since a BrowserGym task cannot change obs.
# Efficiency: on success, reward *= 1 - w * min(1, extra / EFFICIENCY_SCALE) with w = MEGAWOB_EFFICIENCY (0 = off) and
# extra = max(0, agent_steps - oracle_steps - EFFICIENCY_FREE): a few free actions (to read, scroll or hover, which the
# oracle, reading the page's state, never needs), then the same cost per wasted action on every task, short or long
# (a ratio oracle / agent cost a 2-action task a third of its reward for one extra action). oracle_steps is the
# oracle's action count on this very episode: when the agent succeeds, the oracle replays the same URL (seed, scenario,
# every randomization parameter) at the same viewport and device scale in a separate browser context, so popups,
# split drags, faults or an easier start count for both. Both counts are env steps (an
# action string with several calls is one). No count (the replay failed), no scaling.
# In shaped mode only the success bonus is scaled, so the per-step shaping still pays for progress.
EFFICIENCY_FREE = 2
EFFICIENCY_SCALE = 40  # wasted actions that cost the full weight w: the episode's action budget (driver.MAX_ACTIONS)


class ScreenEfficiencyTask(MegawobTask):
    """MegawobTask plus the screen profile and the efficiency reward (see the block comment above)."""

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.screen_profile = screen.profile_for(self.page_seed, self.config.remote_desktop)
        self.agent_steps = 0
        self.oracle_steps = None
        self.efficiency_factor = None

    def setup(self, page: playwright.sync_api.Page) -> tuple[str, dict]:
        self.agent_steps = 0
        self.oracle_steps = None
        self.efficiency_factor = None
        return super().setup(page)

    def measure_oracle_steps(self) -> int | None:
        """The oracle's action count on this episode, replayed in a new context of the agent's browser (the agent's
        page, its screenshots and BrowserGym's page tracking are untouched). None when there is no browser to use or
        the oracle does not succeed."""
        from . import driver

        page = getattr(self, "page", None)
        browser = page.context.browser if page is not None else None
        if browser is None:
            return None
        vp = self.actual_viewport
        context = driver.new_context(browser, (vp["width"], vp["height"]), self.dsf)
        try:
            replay = context.new_page()
            replay.goto(self.url)
            replay.wait_for_function("() => window.__env && (window.__env.ready || window.__env.bootError)")
            status, n = driver.run_oracle(replay, steps=8)
            return n if status["success"] else None
        except playwright.sync_api.Error as exc:
            log.warning("efficiency: the oracle replay of %s failed, no scaling: %s", self.url, exc)
            return None
        finally:
            context.close()

    def _step_reward(self, status: dict) -> tuple[float, float]:
        self.agent_steps += 1
        reward, shaping = super()._step_reward(status)
        weight = self.config.efficiency
        if weight > 0 and status["success"] and status["done"]:
            if self.oracle_steps is None:
                self.oracle_steps = self.measure_oracle_steps()
            if self.oracle_steps:
                extra = max(0, self.agent_steps - self.oracle_steps - EFFICIENCY_FREE)
                self.efficiency_factor = 1 - weight * min(1.0, extra / EFFICIENCY_SCALE)
                if self.reward_mode == "shaped":
                    reward -= self.success_bonus * (1 - self.efficiency_factor)
                else:
                    reward *= self.efficiency_factor
        return reward, shaping

    def _get_info(self, status: dict, reward: float, shaping: float = 0.0) -> dict:
        info = super()._get_info(status, reward, shaping)
        info["megawob"].update({
            "screen": self.screen_profile,
            "agent_steps": self.agent_steps,
            "oracle_steps": self.oracle_steps,
            "efficiency": self.efficiency_factor,
        })
        return info


TASKS: dict[str, type[MegawobTask]] = {}


def register_all() -> dict[str, type[MegawobTask]]:
    """Register every catalog task once. Safe to call repeatedly."""
    action_mapping = ActionMapping()
    for name, attrs in catalog.task_names().items():
        if name in TASKS:
            continue
        cls_name = "".join(part.capitalize() for part in name.replace(".", "-").split("-")) + "Task"
        desc = f"megawob {attrs['task']} ({attrs['site'] or attrs['split']}{', eval ' + attrs['perturbation'] if attrs.get('perturbation') else ''})"
        cls = type(cls_name, (ScreenEfficiencyTask,), {"subdomain": name, "desc": desc, **attrs})
        register_task(cls.get_task_id(), cls, nondeterministic=False, kwargs={"action_mapping": action_mapping})
        TASKS[name] = cls
    return TASKS


register_all()

if catalog.config().reuse:
    from . import reuse

    reuse.install()
