/*
 * kit/runtime/clock.js: the task clock (knob clock = step | real | action; see the env.js header). advance() runs
 * the task's tick() and the overlay schedule; stepClock() is one agent action (stepMs of task time);
 * stop() and start() end and begin the frame loops of clock=real and clock=action at reset.
 *
 * stepClock() also runs the step watcher of the round-2 knobs (fault revert / clear, silent, preempt): before the
 * clock moves, it compares the model with the one after the previous stepClock (snap) and lets each module act
 * on the change; the page re-renders once if one of them replaced the model or the spec. It waits while the
 * button is held (a split drag in progress), and it is off (no clone, no error call) unless one of them is on.
 * cursorLag=1 moves the drawn cursor here too (input.js lagCursor).
 *
 * State (env._rt.clock, made by reset()): steps (stepClock calls this episode; ends click runs and atomic drags),
 * raf (the frame loop), recovering (site.pauseOnOverlay: the dismissing action is free), animMs (clock=action:
 * each CSS animation's own time), start (the start model, for pageFaults=clear and preempt) and last (the watcher's
 * baseline); start and last are set only when the watcher is on.
 */
(function () {
  'use strict';
  const kit = (window.__megawobKit = window.__megawobKit || {});

  const S = (env) => env._rt.clock;

  // clock=action: pause every CSS animation / transition and set it to its own time plus ms (an animation
  // first seen starts at 0). Finished ones drop out of getAnimations() by themselves.
  function holdAnimations(env, ms) {
    for (const a of document.getAnimations()) {
      const anim = S(env).animMs;
      const t = (anim.has(a) ? anim.get(a) : 0) + ms;
      anim.set(a, t);
      if (a.playState !== 'paused') a.pause();
      try { a.currentTime = t; } catch (e) { /* an animation without a timeline */ }
    }
  }

  // Run the task's tick() for ms of task time in fixed sub-steps, then redraw once. The clock also runs
  // for untimed tasks, because the perturbation channel (overlays) is scheduled on it.
  function advance(env, ms) {
    const fam = env.taskDef;
    if (env.done || !(ms > 0)) return env.score();
    if (!env.timed) {
      env.clockMs += ms;
      env.taskMs += ms;
      kit.overlay.tick(env);
      env.render();
      return env.score();
    }
    const dt = fam.tickMs || 50;
    const before = env.model;
    let left = ms;
    const pause = !!env.siteDef.pauseOnOverlay;
    while (left > 1e-9 && !env.done) {
      const d = Math.min(dt, left);
      env.clockMs += d;
      left -= d;
      if (!(pause && (S(env).recovering || kit.overlay.showing(env)))) {
        env.taskMs += d;
        env.model = fam.tick(env.model, env.spec, d, env.taskMs, env.tickRng);
        const reason = fam.ended && fam.ended(env.model, env.spec);
        if (reason) kit.score.end(env, reason);
      }
      kit.overlay.tick(env);
    }
    S(env).recovering = false;
    // While the button is held between actions (dragSteps=split) and time changed nothing, do not redraw: a
    // re-render or sync would drop the drag in progress (a text selection, a grabbed card).
    if (!(kit.input.buttonHeld(env) && env.model === before)) env._sync();
    env.render();
    return env.score();
  }

  // Round-2 knobs that watch what each agent action did.
  const watching = (env) => kit.fault.on(env) || kit.silent.on(env) || kit.preempt.on(env);

  // The model and error after this stepClock: what the next action is compared with.
  function snap(env) {
    S(env).last = { model: env.util.clone(env.model), error: kit.answer.errorOf(env) };
  }

  function watch(env) {
    const prev = S(env).last;
    if (env.done || !prev) return false;
    if (kit.input.buttonHeld(env)) { kit.preempt.held(env); return false; }
    const error = kit.answer.errorOf(env);
    const w = { prev, error, changed: Math.abs(error - prev.error) > 1e-9, lowered: error < prev.error - 1e-9 };
    // A reverted or cleared change did not happen: nothing else reacts to it.
    let repaint = kit.fault.step(env, w);
    if (!repaint) {
      if (kit.silent.step(env, w)) repaint = true;
      if (kit.preempt.step(env, w)) repaint = true;
    }
    if (repaint && !env.done) env._repaint();
    return true;
  }

  // Called by the harness after every agent action: one action is worth stepMs of task time.
  function step(env) {
    S(env).steps++; // ends a click run (util.clickCount)
    kit.input.lagCursor(env);
    const watched = watching(env) && watch(env);
    if (env.clockMode === 'real') {
      if (watched) snap(env);
      return env.score();
    }
    const out = advance(env, env.stepMs);
    if (env.clockMode === 'action') holdAnimations(env, env.stepMs);
    if (watched && !env.done) snap(env);
    return out;
  }

  // reset() hook: stop the previous episode's frame loop, then a fresh slot.
  function reset(env) {
    const old = S(env);
    if (old && old.raf) cancelAnimationFrame(old.raf);
    env._rt.clock = { steps: 0, raf: null, recovering: false, animMs: new WeakMap(), start: null, last: null };
  }

  // After the first render: the start model and the watcher's first baseline, when a round-2 knob watches.
  function baseline(env) {
    if (!watching(env)) return;
    S(env).start = env.util.clone(env.model);
    snap(env);
  }

  // Read by other modules: stepClock calls this episode (0 before the first reset), the start model (pageFaults=clear,
  // preempt), and overlay.dismiss() marking the dismissing action as free.
  const steps = (env) => (S(env) ? S(env).steps : 0);
  const startModel = (env) => S(env).start;
  const recover = (env) => { S(env).recovering = true; };

  // Frame loops started by reset(): clock=real advances by wall time while something is timed or an overlay is
  // still to come; clock=action holds new animations at their start.
  function start(env) {
    if (env.clockMode === 'real' && (env.timed || kit.overlay.pending(env))) {
      let last = performance.now();
      const loop = (now) => {
        if (env.done) return;
        // timescale < 1 slows the page down (a slow policy keeps up with a fast task), > 1 speeds it up;
        // CSS animations and transitions follow the same rate.
        if (env.timescale !== 1) {
          for (const a of document.getAnimations()) if (a.playbackRate !== env.timescale) a.playbackRate = env.timescale;
        }
        advance(env, (now - last) * env.timescale);
        last = now;
        S(env).raf = requestAnimationFrame(loop);
      };
      S(env).raf = requestAnimationFrame(loop);
    }
    if (env.clockMode === 'action') {
      // Animations start in wall time (a transition the action set off, a spinner the widget drew); every
      // frame holds new ones at their start. They move only in stepClock().
      const hold = () => {
        if (env.done) return;
        holdAnimations(env, 0);
        S(env).raf = requestAnimationFrame(hold);
      };
      holdAnimations(env, 0);
      S(env).raf = requestAnimationFrame(hold);
    }
  }

  kit.clock = { holdAnimations, advance, step, reset, baseline, start, snap, steps, startModel, recover };
})();
