// Test definitions for the kit unit tests: a one-dimensional "line" task (move x to the target).
import assert from 'node:assert/strict';
export function lineTask(over = {}) {
  return {
    name: 'line',
    scenarios: ['a', 'b'],
    startModes: ['off', 'partial', 'solved'],
    sample(rng, opts) {
      this.lastOpts = opts;
      return { scenario: opts.scenario || rng.pick(opts.scenarios), target: rng.int(20, 80), isplit: opts.isplit };
    },
    init(spec, rng) {
      if (spec.startMode === 'partial') return { x: spec.target + 4 };
      return { x: rng.int(0, 100) };
    },
    error: (m, s) => Math.abs(m.x - s.target),
    tolerance: () => ({ tau: 2 }),
    instruction: (s) => `Set the value to ${s.target}.`,
    plan: (m, s) => ({ drag: [{ x: 100 + m.x, y: 300 }, { x: 100 + s.target, y: 300 }] }),
    solve: (s, m) => ({ ...m, x: s.target }),
    ...over,
  };
}

// Objects built inside the kit's vm context have that realm's prototypes, which deepStrictEqual rejects; compare
// plain JSON copies instead (undefined fields drop out on both sides).
export const plain = (x) => (x === undefined ? x : JSON.parse(JSON.stringify(x)));
export const same = (actual, expected, msg) => assert.deepEqual(plain(actual), plain(expected), msg);

// A unit page for the round-2 knobs (fault, report, preempt, silent, safety): testEnv with the line task, a widget
// that counts renders and keeps its ctx (ctx.update is the "agent's" change), and the site hooks fault / hazard /
// notice drawing stub elements (calls are recorded in `drawn`). act(a) plays one oracle action the way a browser
// would (pointer events through the window listeners; a drag only moves x when its press was not swallowed);
// play() runs the oracle with a stepClock after every action; widget adds keys to the widget. Returns { win, env,
// renders, drawn, fire, act, play }.
export async function roundPage({ knobs = {}, task = {}, site = {}, widget = {}, seed = 1 } = {}) {
  const { testEnv: make, element } = await import('./stubdom.mjs');
  const drawn = [];
  const renders = [];
  let win;
  const box = (rect, withDismiss) => {
    const el = element(win, 'aside', rect);
    const dismiss = withDismiss ? element(win, 'button', [rect[0] + 10, rect[1] + 10, 20, 20]) : null;
    if (dismiss) el.append(dismiss);
    return { el, dismiss };
  };
  const hooks = {
    fault: (ctx) => {
      drawn.push(['fault', ctx.kind]);
      if (ctx.kind === 'hang') return { el: box([0, 50, 1280, 600], false).el };
      if (ctx.kind === 'shift') return { el: box([0, 0, 1280, 40], false).el };
      const b = box([900, 0, 300, 60], true);
      b.dismiss.addEventListener('click', () => ctx.dismiss());
      return { el: b.el, dismiss: b.dismiss, ttlSteps: ctx.kind === 'saved' ? 2 : 0 };
    },
    hazard: (ctx) => {
      drawn.push(['hazard', ctx.kind, ctx.hazard]);
      const b = box([400, 200, 400, 200], true);
      b.ctx = ctx;
      hooks.lastHazard = ctx;
      return { el: b.el, dismiss: b.dismiss };
    },
    notice: (ctx) => {
      drawn.push(['notice', ctx.text]);
      const b = box([900, 560, 300, 80], true);
      return { el: b.el, dismiss: b.dismiss, ttlSteps: 4 };
    },
  };
  const page = make({ task: lineTask(task),
    site: { name: 'base', ...hooks, ...site },
    widget: { render(ctx) { renders.push(ctx); return { anchors: [] }; }, ...widget } });
  win = page.win;
  const { env } = page;
  env.reset(seed, knobs);
  const fire = (type, props = {}) => {
    const e = { type, target: win.document.body, button: 0, buttons: 0, clientX: 0, clientY: 0, defaultPrevented: false,
      _stopped: false, preventDefault() { this.defaultPrevented = true; }, stopImmediatePropagation() { this._stopped = true; },
      ...props };
    win.dispatchEvent(e);
    return e;
  };
  const ctx = () => renders[renders.length - 1];
  // One oracle action as the browser would play it.
  function act(a) {
    if (a.type === 'drag') {
      const down = fire('pointerdown', { clientX: a.from[0], clientY: a.from[1], buttons: 1 });
      fire('pointerup', { clientX: a.to[0], clientY: a.to[1] });
      if (!down._stopped) ctx().update({ ...env.model, x: a.to[0] - 100 });
    } else if (a.type === 'click') {
      const down = fire('pointerdown', { clientX: a.at[0], clientY: a.at[1], buttons: 1 });
      fire('pointerup', { clientX: a.at[0], clientY: a.at[1] });
      const click = fire('click', { clientX: a.at[0], clientY: a.at[1] });
      if (down._stopped || click._stopped) return;
      const ov = env._rt.overlay.extra.concat([env._rt.overlay.perturb, env._rt.overlay.initial]).find((o) => o && o.dismissEl && !o.gone
        && JSON.stringify(env.util.center(o.dismissEl)) === JSON.stringify(a.at));
      if (ov) env.dismissOverlay('button', ov);
      else if (env.submitEl && JSON.stringify(env.util.center(env.submitEl)) === JSON.stringify(a.at)) env.submit();
    } else if (a.type === 'finish') env.finish(a.message);
  }
  function play(max = 40) {
    const actions = [];
    for (let i = 0; i < max && !env.done; i++) {
      const a = env.oracle();
      if (!a) break;
      actions.push(a);
      act(a);
      env.stepClock();
    }
    return actions;
  }
  return { win, env, renders, drawn, hooks, fire, act, play, ctx };
}
