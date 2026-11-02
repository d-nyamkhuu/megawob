/*
 * kit/runtime/silent.js: silent failures (knob silent = on; J4). Once per episode, right after the 1st, 2nd or 3rd
 * agent action that lowered the error (3:2:1, drawn from its own fork 'silent-when', so a small decoy change
 * cannot absorb it), the page "saves" a believably wrong version of the change (text cut off, a
 * number rounded, one item of several dropped) and re-renders it as if all went well, sometimes with a "Saved"
 * toast. The agent must check the result instead of trusting the confirmation. A task finished in fewer improving
 * changes never meets it. Only for tasks with
 * silent(next, prev, spec, rng) -> model | null (kit/env.js header, task contract); applied only when the
 * corrupted model's error is above tolerance. Draws from env.rng.fork('silent'); grading is unchanged.
 */
(function () {
  'use strict';
  const kit = (window.__megawobKit = window.__megawobKit || {});

  // State: env._rt.silent, made by schedule() (null when the knob is off).
  const S = (env) => env._rt.silent;
  const on = (env) => !!S(env);

  const gate = (v, c) => kit.knobs.on(v) && typeof c.fam.silent === 'function';

  // Which improving change (1-based) is saved wrong: weights 3:2:1, like preempt's WHEN.
  const WHEN = [1, 1, 1, 2, 2, 3];

  function schedule(env) {
    env._rt.silent = env.episode.silent
      ? { rng: env.rng.fork('silent'), at: env.rng.fork('silent-when').pick(WHEN), seen: 0, called: false, applied: false }
      : null;
  }

  // stepClock hook: true when it replaced the model (the caller re-renders).
  function step(env, w) {
    const s = S(env);
    if (!s || s.called || !w.lowered) return false;
    if (++s.seen < s.at) return false;
    s.called = true; // the hook is asked once, at the drawn improving action (contract)
    const fam = env.taskDef;
    const bad = fam.silent(env.model, w.prev.model, env.spec, s.rng);
    if (!bad || !(fam.error(bad, env.spec) > env.tau + 1e-9)) {
      env.log('silent', { applied: false, at: s.at });
      return false;
    }
    s.applied = true;
    env.model = bad;
    env.log('silent', { applied: true, at: s.at });
    if (s.rng.fork('toast').bool(0.5)) kit.fault.banner(env, 'saved', s.rng);
    return true;
  }

  const record = (env) => (S(env) ? { applied: S(env).applied } : null);

  kit.silent = { gate, schedule, on, step, record };
})();
