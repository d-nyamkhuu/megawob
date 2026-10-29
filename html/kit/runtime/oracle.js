/*
 * kit/runtime/oracle.js: the golden-path oracle (env.oracle(); action types in the env.js header). In order: the
 * rest of a held split drag, the report after a interruptions=cancel notice (the notice is left open), an open overlay's
 * dismiss control (also fault banners, safety hazards by their safe control), a wait while a pageFaults=hang busy
 * overlay is up, the judge ending, the end control (report episodes: a finish message with the facts; answerIn=reply:
 * with the answer) once within tolerance, else the task's plan() step located by the widget; on scrollable pages a
 * wheel step first when a point the action needs is off screen.
 */
(function () {
  'use strict';
  const kit = (window.__megawobKit = window.__megawobKit || {});

  const { clamp } = kit.data;

  function next(env) {
    if (env.done) return null;
    // dragSteps=split: the rest of a press-move-release split across actions (overlays wait while it is held).
    if (kit.split.pending(env)) return kit.split.next(env);
    // interruptions=cancel: the user said stop, so report and end at once (closing the notice is a page action: on a page
    // that moves with the clock or a hover, it could change what the stop has to leave alone).
    if (kit.preempt.pending(env)) return { type: 'finish', message: kit.preempt.reply(env) };
    const dismiss = kit.overlay.dismissAction(env);
    if (dismiss) return dismiss;
    // pageFaults=hang: the page is busy.
    if (kit.fault.busy(env)) return { type: 'wait' };
    const judge = kit.judge.active(env);
    // ambiguous / impossible: leave the page alone and say so; confirm: prepare, then ask instead of submitting.
    if (judge && judge.mode !== 'confirm') return { type: 'finish', message: kit.judge.say(env, judge) };
    let act;
    let step = null;
    // check() records a moved layout (it ends the episode at the next score()).
    kit.score.check(env);
    if (kit.score.compute(env).error <= env.tau + 1e-9) {
      act = judge ? { type: 'finish', message: kit.judge.say(env, judge) } : endAction(env);
    } else {
      step = env.taskDef.plan(env.model, env.spec);
      if (!step) return null;
      act = action(env, step);
    }
    // Inner-pane reveals are wheel actions: only where the episode accepts the wheel (inputs may vary by scenario).
    const scroll = (kit.input.inputs(env).includes('wheel') && targetScroll(act))
      || (env.episode.scrollable && scrollFor(env, act));
    if (scroll) return scroll;
    if (env.episode.drag === 'split' && (act.type === 'drag' || act.type === 'path')) return kit.split.start(env, act, step);
    return act;
  }

  // The end control, or finish when the episode has none (finish mode) with a structured reply (status done; report
  // episodes with the facts; answerIn=reply episodes with the answer, and the report facts after it).
  const reportOn = (env) => env.episode.report && kit.report.active(env);
  const endMessage = (env) => (kit.answer.active(env)
    ? kit.answer.message(env, reportOn(env) ? kit.report.facts(env).map((f) => [String(f.label), String(f.value)]) : [])
    : reportOn(env) ? kit.report.message(env) : kit.reply.format(env, { status: 'done' }));
  const endAction = (env) => (env.submitEl ? { type: 'click', at: env.util.center(env.submitEl) }
    : { type: 'finish', message: endMessage(env) });

  // A plan step in viewport px (widget.locate).
  function action(env, step) {
    const loc = (t) => env.widgetDef.locate(t, env);
    const mods = step.modifiers ? { modifiers: step.modifiers } : {};
    if (step.drag) return { type: 'drag', from: loc(step.drag[0]), to: loc(step.drag[1]), ...mods };
    if (step.path) return { type: 'path', points: step.path.map(loc), ...mods };
    if (step.click) return { type: 'click', at: loc(step.click), ...mods };
    if (step.dblclick) return { type: 'dblclick', at: loc(step.dblclick) };
    if (step.tripleclick) return { type: 'tripleclick', at: loc(step.tripleclick) };
    if (step.rightclick) return { type: 'rightclick', at: loc(step.rightclick) };
    if (step.type) return { type: 'type', at: loc(step.type[0]), text: String(step.type[1]) };
    if (step.key) return { type: 'key', key: step.key };
    if (step.move) return { type: 'move', at: loc(step.move) };
    if (step.down) return { type: 'down', at: loc(step.down) };
    if (step.up) return { type: 'up', at: loc(step.up) };
    if (step.wheel) {
      const [t, dy, dx = 0] = step.wheel;
      return { type: 'wheel', at: loc(t), dx, dy };
    }
    if (step.wait) return { type: 'wait' };
    // A task's finish step: the judge ending in judge episodes, else the end action (its message is not used).
    if (step.finish) {
      const judge = kit.judge.active(env);
      return judge ? { type: 'finish', message: kit.judge.say(env, judge) } : endAction(env);
    }
    throw new Error(`unknown plan step ${JSON.stringify(step)}`);
  }

  // A locate point may carry a non-enumerable `element` property. Its target ancestry lets the oracle
  // reveal clipped inner controls without guessing from overlapping rects or changing scroll offsets in locate().
  // Metadata stays inside this call: serialized actions still contain only [x, y]. Page scrolling remains opt-in.
  function targetScroll(act) {
    const pts = act.points || [act.at, act.from, act.to].filter(Boolean);
    for (const p of pts) {
      const target = p && p.element;
      if (!target || !target.isConnected) continue;
      for (let pane = target.parentElement; pane && pane !== document.body && pane !== document.documentElement; pane = pane.parentElement) {
        const sx = scrolls(pane, 'X');
        const sy = scrollsY(pane);
        if (!sx && !sy) continue;
        const r = pane.getBoundingClientRect();
        const left = Math.max(0, r.left + pane.clientLeft);
        const right = Math.min(window.innerWidth, r.left + pane.clientLeft + pane.clientWidth);
        const top = Math.max(0, r.top + pane.clientTop);
        const bottom = Math.min(window.innerHeight, r.top + pane.clientTop + pane.clientHeight);
        if (right <= left || bottom <= top) continue;
        const dx = sx && (p[0] < left + 2 || p[0] > right - 2)
          ? Math.round(clamp(p[0] - (left + right) / 2, -pane.scrollLeft, pane.scrollWidth - pane.clientWidth - pane.scrollLeft)) : 0;
        const dy = sy && (p[1] < top + 2 || p[1] > bottom - 2)
          ? Math.round(clamp(p[1] - (top + bottom) / 2, -pane.scrollTop, pane.scrollHeight - pane.clientHeight - pane.scrollTop)) : 0;
        if (!dx && !dy) continue;
        // Dispatch where this pane will receive each wheel axis; a nested scroll pane must not consume it.
        const owns = (el) => {
          for (let e = el; e && e !== pane; e = e.parentElement) {
            if ((dx && scrolls(e, 'X')) || (dy && scrollsY(e))) return false;
          }
          return pane.contains(el);
        };
        for (const fy of [0.5, 0.25, 0.75, 0.05, 0.95]) {
          for (const fx of [0.5, 0.25, 0.75, 0.05, 0.95]) {
            const at = [Math.floor(left + (right - left) * fx), Math.floor(top + (bottom - top) * fy)];
            const hit = document.elementFromPoint(at[0], at[1]);
            if (hit && owns(hit)) return { type: 'wheel', at, dx, dy };
          }
        }
      }
    }
    return null;
  }

  // Page-level scroll for scrollable widgets: if a point the action needs is outside the viewport (or under
  // the top 72 px, where sticky headers live), wheel the page so it lands mid-screen. The wheel point is a
  // spot that is not inside an inner scroll pane. A page whose document does not scroll may scroll in a pane
  // that holds the stage (an app shell of fixed height): a point that pane clips is wheeled into its middle.
  function scrollFor(env, act) {
    const pts = act.points || [act.at, act.from, act.to].filter(Boolean);
    const H = window.innerHeight;
    const W = window.innerWidth;
    const off = pts.find((p) => p && (p[1] < 72 || p[1] > H - 12 || p[0] < 0 || p[0] > W || covered(env, p)));
    if (!off) return paneScroll(env, pts);
    const doc = document.scrollingElement || document.documentElement;
    const maxY = doc.scrollHeight - H;
    const dy = Math.round(clamp(off[1] - H / 2, -window.scrollY, maxY - window.scrollY));
    if (Math.abs(dy) < 2) return paneScroll(env, pts);
    return { type: 'wheel', at: wheelPoint(), dx: 0, dy };
  }

  const scrolls = (e, axis) => /(auto|scroll)/.test(getComputedStyle(e)['overflow' + axis])
    && (axis === 'X' ? e.scrollWidth > e.clientWidth + 1 : e.scrollHeight > e.clientHeight + 1);
  const scrollsY = (e) => scrolls(e, 'Y');

  // The innermost pane holding the stage (the stage itself or an ancestor) that clips a point, or lets site frame
  // outside it lie over the point, and can scroll toward it: a wheel over the pane, at a spot whose own scroll
  // container is that pane and that is not on a widget the task reads the wheel from (an anchor holding no other
  // anchor).
  function paneScroll(env, pts) {
    for (let pane = env.stage; pane && pane !== document.body && pane !== document.documentElement; pane = pane.parentElement) {
      if (!scrollsY(pane)) continue;
      const r = pane.getBoundingClientRect();
      const top = Math.max(r.top, 0);
      const bottom = Math.min(r.bottom, window.innerHeight);
      const off = pts.find((p) => p && (p[1] < top + 4 || p[1] > bottom - 12 || frameOver(env, pane, p)));
      if (!off) return null;
      const maxY = pane.scrollHeight - pane.clientHeight;
      const dy = Math.round(clamp(off[1] - (top + bottom) / 2, -pane.scrollTop, maxY - pane.scrollTop));
      if (Math.abs(dy) < 2) continue;
      const at = paneWheelPoint(env, pane, r, top, bottom);
      if (at) return { type: 'wheel', at, dx: 0, dy };
    }
    return null;
  }

  // Site frame outside the pane (an app shell's footer or banner) on top of point p.
  function frameOver(env, pane, p) {
    const el = document.elementFromPoint(p[0], p[1]);
    if (!el || pane.contains(el) || (env.submitEl && env.submitEl.contains(el))) return false;
    return (env.frameEls || []).some((c) => c.contains(el));
  }

  function paneWheelPoint(env, pane, r, top, bottom) {
    const els = env.anchors.map(([el]) => el);
    const leaves = els.filter((el) => !els.some((o) => o !== el && el.contains(o)));
    const ownPane = (el) => {
      for (let e = el; e && e !== pane; e = e.parentElement) if (scrollsY(e)) return false;
      return true;
    };
    for (const fy of [0.5, 0.35, 0.65, 0.2, 0.8]) {
      for (const fx of [0.04, 0.5, 0.96, 0.25, 0.75]) {
        const p = [Math.round(r.left + (r.right - r.left) * fx), Math.round(top + (bottom - top) * fy)];
        const el = document.elementFromPoint(p[0], p[1]);
        if (el && pane.contains(el) && ownPane(el) && !leaves.some((a) => a.contains(el))) return p;
      }
    }
    return null;
  }

  // True when a fixed or sticky piece of site frame (instruction note, sticky header, floating dock) lies
  // over viewport point p, so a click there would not reach the task.
  function covered(env, p) {
    const el = document.elementFromPoint(p[0], p[1]);
    if (!el || env.stage.contains(el) || (env.submitEl && env.submitEl.contains(el))) return false;
    const frameEl = (env.frameEls || []).find((c) => c.contains(el));
    if (!frameEl) return false;
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      if (/fixed|sticky/.test(getComputedStyle(e).position)) return true;
    }
    return false;
  }

  function wheelPoint() {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const inPane = (el) => {
      for (let e = el; e && e !== document.body && e !== document.documentElement; e = e.parentElement) {
        const cs = getComputedStyle(e);
        if (/(auto|scroll)/.test(cs.overflowY) && e.scrollHeight > e.clientHeight + 1) return true;
      }
      return false;
    };
    for (const fy of [0.5, 0.35, 0.65, 0.2, 0.8]) {
      for (const fx of [0.04, 0.5, 0.96, 0.25, 0.75]) {
        const p = [Math.round(W * fx), Math.round(H * fy)];
        const el = document.elementFromPoint(p[0], p[1]);
        if (el && !inPane(el)) return p;
      }
    }
    return [Math.round(W / 2), Math.round(H / 2)];
  }

  kit.oracle = { next, action };
})();
