/*
 * kit/selftest.js: the harness of the tasks' self-tests (checks of sampling, scoring, oracle and instructions in
 * model terms, with no page). It is not part of an episode: play.html never loads it. The checker (megawob/check.py)
 * and tests/kit/selftest.test.mjs load it after boot, then tasks/<task>/selftest.js where the task has one,
 * and call env.runSelfTest(task).
 *
 *   env.selfTest(task, run)    registers the task's self-test (once); a tasks/<f>/selftest.js file calls it.
 *                                run(T) reports through T.fail / T.check (it may also return an array of failures).
 *   env.runSelfTest(task)      runs it: the failure strings (at most LIMIT), [] when the task has no self-test
 *
 * The harness T:
 *   T.def, T.lib, T.helpers      the task definition (env.taskOf(task)), its lib and its helpers
 *   T.fail(msg)                  records a failure; T.check(ok, msg) records msg unless ok
 *   T.sweep(opts, fn)            for each scenario and seed: fn(ep), where ep = { scenario, seed, tag, rng, spec, model }.
 *                                opts: scenarios (default def.scenarios), seeds (a count, from 0, or an array; default
 *                                20), rng(seed, scenario) (default new env.Rng(seed)), sample(scenario, seed) -> sample()
 *                                opts merged over { scenario, scenarios } (default {}), or sample: false to leave spec
 *                                and model unset (fn samples itself). Otherwise spec = def.sample(rng.fork('s'), ...)
 *                                and model = def.init(spec, rng.fork('init')). tag is '<scenario> seed <seed>'. An
 *                                error thrown by sample, init or fn is a failure under the tag and the sweep goes on.
 *   T.converge(ep, step, opts)   runs the task's plan in model terms from ep.model: model = step(model, plan) until
 *                                error <= tau (+1e-9), plan() returns nothing, or maxSteps (default 40). Returns
 *                                { model, steps, done }; a run that ends above tau is a failure ('plan ends at error').
 *   T.LIMIT                      at most this many failures are kept (50)
 */
(function () {
  'use strict';
  const env = window.env;
  const LIMIT = 50;
  const tests = {};

  function harness(task) {
    const def = env.taskOf(task);
    const fails = [];
    const T = {
      def, lib: def.lib, helpers: def.helpers, LIMIT, fails,
      fail(msg) { if (fails.length < LIMIT) fails.push(String(msg)); },
      check(ok, msg) { if (!ok) T.fail(msg); },
      sweep(opts, fn) {
        const { scenarios = def.scenarios, seeds = 20, rng = (seed) => new env.Rng(seed), sample = () => ({}) } = opts || {};
        const list = Array.isArray(seeds) ? seeds : Array.from({ length: seeds }, (_, i) => i);
        for (const scenario of scenarios) {
          for (const seed of list) {
            const tag = `${scenario} seed ${seed}`;
            try {
              const ep = { scenario, seed, tag, rng: rng(seed, scenario) };
              if (sample) {
                ep.spec = def.sample(ep.rng.fork('s'), { scenario, scenarios: def.scenarios, ...sample(scenario, seed) });
                ep.model = def.init(ep.spec, ep.rng.fork('init'));
              }
              fn(ep);
            } catch (e) {
              T.fail(`${tag}: ${(e && e.stack) || e}`);
            }
          }
        }
      },
      converge(ep, step, { maxSteps = 40 } = {}) {
        const { tau } = def.tolerance(ep.spec);
        let model = ep.model;
        let steps = 0;
        let done = false;
        for (; steps < maxSteps && def.error(model, ep.spec) > tau + 1e-9; steps++) {
          const p = def.plan(model, ep.spec);
          if (!p) break;
          model = step(model, p);
        }
        done = def.error(model, ep.spec) <= tau + 1e-9;
        if (!done) T.fail(`${ep.tag}: plan ends at error ${def.error(model, ep.spec)} after ${steps} steps`);
        return { model, steps, done };
      },
    };
    return T;
  }

  env.selfTest = function (task, run) {
    if (typeof run !== 'function') throw new Error(`env.selfTest('${task}'): run must be a function`);
    if (tests[task]) throw new Error(`env.selfTest('${task}'): registered twice`);
    tests[task] = run;
  };

  env.runSelfTest = function (task) {
    const run = tests[task];
    if (!run) return [];
    const T = harness(task);
    try {
      const out = run(T);
      if (Array.isArray(out)) for (const f of out) T.fail(f);
    } catch (e) {
      T.fail(`selfTest threw: ${(e && e.stack) || e}`);
    }
    return T.fails.slice();
  };
})();
