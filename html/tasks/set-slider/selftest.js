/* set-slider/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('set-slider', (T) => {
    const { def, lib } = T;
    const { valueAt, frac, fmtTime, keyApply } = T.helpers.scale;
    const Rng = env.Rng;

    // The value math round-trips on every scale bank; times format as h:mm:ss / m:ss.
    for (const s of [...lib.LINEAR, ...lib.LOG.map((x) => ({ ...x, log: true }))]) {
      for (let k = 0; k <= 20; k++) {
        const v = valueAt(s, k / 20);
        T.check(Math.abs(valueAt(s, frac(s, v)) - v) <= 1e-9, `valueAt/frac roundtrip ${JSON.stringify(s)} @${k / 20}`);
      }
    }
    T.check(fmtTime(3725) === '1:02:05' && fmtTime(65) === '1:05', 'fmtTime wrong');

    // The keyboard route reaches every scored target (simulated with keyApply).
    function keyboardRoute(ep, tag, tau) {
      let m = { values: ep.model.values.map((v) => v.slice()), focus: null };
      for (let n = 0; n < 80 && def.error(m, ep.spec) > tau + 1e-9; n++) {
        const st = def.plan(m, ep.spec);
        if (!st) break;
        if (st.click) m = { ...m, focus: st.click.slider };
        else if (st.key) {
          const vals = m.values.map((v) => v.slice());
          vals[m.focus] = [keyApply(ep.spec.sliders[m.focus], vals[m.focus][0], st.key)];
          m = { ...m, values: vals };
        } else if (st.drag) {
          const [, to] = st.drag;
          const vals = m.values.map((v) => v.slice());
          vals[to.slider][to.thumb] = to.value;
          m = { ...m, values: vals };
        }
      }
      T.check(def.error(m, ep.spec) <= tau + 1e-9, `${tag}: keyboard plan did not converge`);
    }

    // The player's toggle clicks and drags reach the goal (a volume drag unmutes).
    function playerRoute(ep, tag, tau, startMode) {
      const { spec, model } = ep;
      let m = { ...model, values: model.values.map((v) => v.slice()) };
      for (let n = 0; n < 8 && def.error(m, spec) > tau + 1e-9; n++) {
        const st = def.plan(m, spec);
        if (!st) break;
        if (st.click && st.click.toggle === 'mute') m = { ...m, muted: !m.muted };
        else if (st.click && st.click.toggle === 'captions') m = { ...m, captions: !m.captions };
        else if (st.drag) {
          const [, to] = st.drag;
          const vals = m.values.map((v) => v.slice());
          vals[to.slider][to.thumb] = to.value;
          m = { ...m, values: vals, muted: to.slider === 1 ? false : m.muted };
        }
      }
      T.check(def.error(m, spec) <= tau + 1e-9, `${tag}: player plan did not converge`);
      if (startMode === 'off') T.check(def.error(model, spec) > 3, `${tag}: player start error ${def.error(model, spec)}`);
    }

    // Every scenario and start mode: solve() sits at the target, the plan ends there, targets are well formed.
    T.sweep({ seeds: 60, rng: (seed) => new Rng(seed), sample: false }, ({ scenario, seed, rng }) => {
      for (const startMode of ['off', 'partial', 'wrong']) {
        const opts = { scenario, scenarios: def.scenarios, startMode, ood: seed % 7 === 0, isplit: 'train', csplit: 'train' };
        const spec = def.sample(rng.fork(scenario + startMode), opts);
        const model = def.init(spec, rng.fork('init' + scenario + startMode));
        const { tau } = def.tolerance(spec);
        const tag = `seed ${seed} ${scenario}/${startMode}`;
        const solved = def.solve(spec, model);
        T.check(def.error(solved, spec) <= 1e-9, `${tag}: solve() not at target`);
        T.check(def.plan(solved, spec) === null, `${tag}: plan() not null at target`);
        T.check(tau > 0, `${tag}: tau ${tau}`);
        if (startMode === 'off') T.check(def.error(model, spec) > 0, `${tag}: start error is 0`);
        for (const i of spec.scored) {
          const s = spec.sliders[i];
          T.check(!(s.target.length === 2 && !(s.target[0] < s.target[1])), `${tag}: range target not ordered`);
          T.check(!(model.values[i].length === 2 && model.values[i][0] > model.values[i][1]), `${tag}: range start not ordered`);
          T.check(!s.target.some((t) => t < s.min - 1e-9 || t > s.max + 1e-9), `${tag}: target out of range`);
          T.check(Math.abs(valueAt(s, frac(s, s.target[0])) - s.target[0]) <= 1e-9, `${tag}: target not on the value grid`);
        }
        T.check(/\S/.test(def.instruction(spec, rng.fork('i'))) && !/submit/i.test(def.instruction(spec, rng.fork('i'))), `${tag}: bad instruction`);
        const ep = { spec, model };
        if (spec.keyRoute) keyboardRoute(ep, tag, tau);
        if (scenario === 'player') playerRoute(ep, tag, tau, startMode);
      }
    });

    // Judge mode: impossible names what the page cannot do.
    T.sweep({ seeds: 12, rng: (seed) => new Rng(seed * 13 + 1), sample: false }, ({ scenario, seed, tag, rng }) => {
      tag = `${scenario} seed ${seed} impossible`;
      try {
        const js = def.sample(rng, { scenario, scenarios: def.scenarios, startMode: 'off', judge: 'impossible', isplit: 'train', csplit: 'train' });
        if (!js.judge) return;
        T.check(js.judge.what && js.judge.what.length && js.judge.what.every((w) => typeof w === 'string' && w), `${tag}: what ${JSON.stringify(js.judge.what)}`);
        T.check(def.instruction(js, new Rng(seed + 4)), `${tag}: no instruction`);
      } catch (e) {
        T.fail(`${tag}: ${e}`);
      }
    });
  });
})();
