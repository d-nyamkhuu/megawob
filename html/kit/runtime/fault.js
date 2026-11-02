/*
 * kit/runtime/fault.js: page faults (knob fault = miss | revert | clear | hang | shift; K1). The page misbehaves
 * once per episode the way real web apps do, and the agent has to notice and recover. Faults never change
 * grading: the episode is scored on the final model as always. Timing comes from env.rng.fork('fault'); the
 * clock calls step() after every agent action (kit/runtime/clock.js), reset() calls schedule().
 * miss, revert and clear fire at a seeded event, the 1st, 2nd or 3rd (3:2:1, own fork 'fault-when', so a small
 * decoy change cannot absorb the fault); an episode that ends before the drawn event never meets it.
 *
 *   miss    the n-th press inside the stage does nothing: the pointerdown and everything
 *           that belongs to it (moves while pressed, the release, the click / dblclick, a native dragstart) are
 *           swallowed in the capture phase. Needs no site support.
 *   revert  the n-th model change does not stick: at the next stepClock the model goes back to what it was
 *           before that action and the widget is re-rendered; the site shows a "Couldn't save ..." banner
 *   clear   after the n-th changing action (or sooner, the first that already reaches tolerance) the form resets
 *           to the start model, with a validation-error banner
 *   hang    after the first action the site shows a busy overlay for 2-3 steps; input to the stage is swallowed
 *           meanwhile and the oracle waits
 *   shift   after the first action the site inserts a banner that pushes the page down; the kit re-renders the
 *           widget and re-baselines the anchors (no layout violation), so earlier coordinates are stale
 * Site hook: fault(ctx) -> { el, dismiss?, ttlSteps? } (kit/env.js header, site contract); a site without one takes
 * the plain one in templates/site/hooks.js (kit/env.js boot). Tasks opt out with faults: false, or per episode with
 * faults(spec) -> false (a timing-critical scenario, where a lost press cannot be made up in time): the knob
 * draws as usual, schedule() then gives the episode no fault. Re-renders wait while the button is held (a split
 * drag in progress).
 */
(function () {
  'use strict';
  const kit = (window.__megawobKit = window.__megawobKit || {});

  // State: env._rt.fault, made by schedule() (null when the knob is off).
  const S = (env) => env._rt.fault;
  const on = (env) => !!S(env);

  const KINDS = ['miss', 'revert', 'clear', 'hang', 'shift'];
  // Which press / change (1-based) miss, revert and clear strike: weights 3:2:1, like preempt's WHEN.
  const WHEN = [1, 1, 1, 2, 2, 3];

  // Knob gating: a known kind on a task that allows faults (every site has fault(), its own or templates/site/hooks.js;
  // a definition without one, as in unit tests, gets miss).
  function gate(v, c) {
    if (!KINDS.includes(v) || c.fam.faults === false) return null;
    return v === 'miss' || typeof c.site.fault === 'function' ? v : 'miss';
  }

  // The context site.fault() gets.
  function siteCtx(env, kind, rng, ov) {
    return kit.overlay.siteCtx(env, { kind, rng }, { dismiss: (how = 'button') => ov && env.dismissOverlay(how, ov) },
      { stage: true });
  }

  // A banner of kind (revert | clear | saved) through the overlay channel, shown now.
  function banner(env, kind, rng) {
    if (typeof env.siteDef.fault !== 'function') return null;
    const ov = kit.overlay.add(env, 'fault', kind, 0, (o) => env.siteDef.fault(siteCtx(env, kind, rng.fork(kind), o)));
    ov.atMs = env.clockMs;
    kit.overlay.tick(env);
    return ov;
  }

  function schedule(env) {
    const kind = env.episode.fault;
    env._rt.fault = null;
    if (!kind) return;
    if (typeof env.taskDef.faults === 'function' && !env.taskDef.faults(env.spec)) {
      env.episode.fault = null;
      return;
    }
    const rng = env.rng.fork('fault');
    const f = { kind, rng, fired: false, changes: 0, presses: 0, missing: false, at: env.rng.fork('fault-when').pick(WHEN) };
    env._rt.fault = f;
    if (kind === 'hang' || kind === 'shift') {
      const at = 1; // after the agent's first action, so even a two-action episode meets it
      const ttl = rng.int(2, 3);
      f.ov = kit.overlay.add(env, 'fault', kind, at, (ov) => {
        const made = env.siteDef.fault(siteCtx(env, kind, rng.fork(kind), ov)) || {};
        f.fired = true;
        if (kind === 'hang') return { el: made.el, ttlSteps: made.ttlSteps || ttl };
        // shift: an in-flow banner that stays; re-render so the widget lays out in the smaller stage, or (the site
        // returned repaint: false: the stage kept its size) only re-baseline the anchors where they now are.
        return { el: made.el, after: made.repaint === false ? () => env.reanchor() : () => env._repaint() };
      });
    }
  }

  // stepClock hook (clock.js): the model before and after the last action, as the step watcher saw them.
  // Returns true when it changed the model (the caller re-renders).
  function step(env, w) {
    const f = S(env);
    if (!f) return false;
    if (f.kind === 'miss') f.missing = false;
    if (f.fired || !w.changed) return false;
    if (f.kind === 'revert') {
      if (++f.changes < f.at) return false;
      f.fired = true;
      env.model = w.prev.model;
      env.log('fault', { kind: 'revert', at: f.at });
      banner(env, 'revert', f.rng);
      return true;
    }
    if (f.kind === 'clear') {
      f.changes++;
      if (f.changes < f.at && w.error > env.tau + 1e-9) return false;
      f.fired = true;
      env.model = env.util.clone(kit.clock.startModel(env));
      env.log('fault', { kind: 'clear', at: f.at });
      banner(env, 'clear', f.rng);
      return true;
    }
    return false;
  }

  // Is the busy overlay up (hang)?
  const busy = (env) => !!(S(env) && S(env).kind === 'hang' && kit.overlay.openOf(env, 'fault').some((o) => o.kind === 'hang'));

  const inStage = (env, e) => {
    if (!env.stage || e.clientX === undefined) return false;
    const r = env.stage.getBoundingClientRect();
    return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  };

  // Window capture listeners, registered by env.js right after the input layer's (which still sees and logs
  // everything): miss swallows one press, hang swallows stage input while busy.
  function install(env) {
    const swallow = (e, what) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (what) env.log('fault-swallow', { what, type: e.type });
    };
    const live = () => (S(env) && !env.done ? S(env) : null);
    window.addEventListener('pointerdown', (e) => {
      const f = live();
      if (!f) return;
      if (f.kind === 'miss') {
        f.missing = false;
        if (!f.fired && inStage(env, e) && ++f.presses >= f.at) {
          f.fired = true;
          f.missing = true;
          env.log('fault', { kind: 'miss', at: f.at });
          return swallow(e, 'miss');
        }
      }
      if (busy(env) && inStage(env, e)) swallow(e, 'busy');
    }, true);
    const pressTypes = ['pointermove', 'mousedown', 'mousemove', 'pointerup', 'mouseup', 'click', 'dblclick',
      'auxclick', 'contextmenu', 'dragstart', 'selectstart'];
    for (const type of pressTypes) {
      window.addEventListener(type, (e) => {
        const f = live();
        if (!f) return;
        if (f.missing) {
          if (/move/.test(type) && !(e.buttons & 1)) return;
          swallow(e);
          if (type === 'click' || type === 'dblclick' || type === 'contextmenu') f.missing = false;
          return;
        }
        if (busy(env) && inStage(env, e)) swallow(e);
      }, true);
    }
    for (const type of ['keydown', 'keyup', 'beforeinput', 'wheel']) {
      window.addEventListener(type, (e) => {
        if (live() && busy(env)) swallow(e, type === 'keydown' || type === 'wheel' ? 'busy' : null);
      }, { capture: true, passive: false });
    }
  }

  // status().fault: what happened ({ kind, fired }), null when the knob is off.
  const record = (env) => (S(env) ? { kind: S(env).kind, fired: !!S(env).fired } : null);

  kit.fault = { KINDS, gate, schedule, on, step, busy, install, record, banner };
})();
