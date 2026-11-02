/* pan-map/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('pan-map', (T) => {
    const { sample, init, instruction, tolerance, error, solve, plan, scenarios: SCENARIOS } = T.def;
    const { LEGACY } = T.lib;
    const { placeById, toPort, select, zoomAt, wheelSteps, dragPx, panPx } = T.helpers;
    const { nonEmpty } = env.util;
    const PORTS = [[620, 380], [940, 600]];
    for (const scenario of LEGACY) {
      for (const startMode of ['off', 'partial', 'wrong']) {
        T.sweep({ scenarios: [scenario], seeds: 8, sample: false, rng: (seed) => new env.Rng(seed * 7919 + 13) }, ({ seed, rng }) => {
          const tag = `${scenario}/${startMode} seed ${seed}`;
          try {
            const route = [undefined, 'wheel', 'pointer'][seed % 3];
            const spec = sample(rng.fork('s'), { scenario, scenarios: SCENARIOS, startMode, ood: seed === 7, route });
            const t = placeById(spec, spec.target);
            if (route === 'wheel' && !(spec.wheel && spec.zoomRoute === 'wheel')) T.fail(`${tag}: route wheel ignored`);
            if (route === 'pointer' && spec.wheel) T.fail(`${tag}: route pointer still allows the wheel`);
            if (new Set(spec.places.map((p) => p.name)).size !== spec.places.length) T.fail(`${tag}: duplicate place names`);
            let m = { ...init(spec, rng.fork('i')), port: PORTS[seed % 2] };
            const text = instruction(spec, rng.fork('t'));
            if (!text || /\bsubmit\b/i.test(text.replace(/"[^"]*"/g, '')) || !text.includes(t.name)) T.fail(`${tag}: instruction ${text}`);
            const tol = tolerance(spec);
            T.check(error(m, spec) > tol.tau, `${tag}: starts solved`);
            if (scenario === 'marker' && startMode === 'off') {
              const p = toPort({ ...m, port: [1040, 680] }, [t.x, t.y]);
              if (p[0] >= 0 && p[0] <= 1040 && p[1] >= 0 && p[1] <= 680) T.fail(`${tag}: target starts on screen`);
            }
            if (error(solve(spec, m), spec) > tol.tau + 1e-9) T.fail(`${tag}: solve() not on target`);
            // Simulate the oracle with the widget's mechanics.
            let n = 0;
            for (; n < 40 && error(m, spec) > tol.tau + 1e-9; n++) {
              const st = plan(m, spec);
              if (!st) break;
              if (st.click && st.click.close) m = select(m, spec, null);
              else if (st.click && st.click.zoom) m = zoomAt(m, spec, m.z + (st.click.zoom === 'in' ? 1 : -1));
              else if (st.wheel) m = zoomAt(m, spec, m.z + wheelSteps(st.wheel[1]));
              else if (st.click && st.click.marker) {
                const p = toPort(m, [t.x, t.y]);
                if (p[0] < 0 || p[1] < 0 || p[0] > m.port[0] || p[1] > m.port[1]) T.fail(`${tag}: clicks an off-screen marker`);
                m = select(m, spec, st.click.marker);
              } else if (st.drag) {
                const D = dragPx(m, spec, st.drag[0].grab);
                if (Math.hypot(D[0], D[1]) < 5) T.fail(`${tag}: pan drag below the click threshold`);
                m = panPx(m, spec, D);
              } else T.fail(`${tag}: unexpected step ${JSON.stringify(st)}`);
            }
            if (error(m, spec) > tol.tau + 1e-9) T.fail(`${tag}: simulated oracle failed (${n} steps, error ${error(m, spec)})`);
            if (route === 'wheel' && scenario === 'zoom' && startMode === 'off' && n === 0) T.fail(`${tag}: no steps`);
          } catch (e) {
            T.fail(`${tag}: ${e && e.stack ? e.stack.split('\n').slice(0, 2).join(' ') : e}`);
          }
        });
      }
    }
    // Judge modes: the data the reply is graded from.
    for (const scenario of SCENARIOS) {
      for (const mode of ['ambiguous', 'impossible']) {
        T.sweep({ scenarios: [scenario], seeds: 6, sample: false, rng: (seed) => new env.Rng(seed * 7919 + 23) }, ({ seed, rng }) => {
          const tag = `${scenario} judge ${mode} seed ${seed}`;
          try {
            const spec = sample(rng.fork('s'), { scenario, scenarios: SCENARIOS, startMode: 'off', judge: mode });
            const j = spec.judge;
            if (!j) { T.fail(`${tag}: no spec.judge`); return; }
            const text = instruction(spec, rng.fork('t'));
            if (!text || text.includes('{') || /undefined/.test(text) || !text.includes(j.name)) T.fail(`${tag}: instruction ${text}`);
            if (mode === 'ambiguous') {
              if (!(j.cands && j.cands.length >= 2 && j.cands.every(nonEmpty)) || !Array.isArray(j.others)) T.fail(`${tag}: cands ${JSON.stringify(j.cands)}`);
              else if (j.cands.some((c) => text.includes(c[0]))) T.fail(`${tag}: instruction names an address: ${text}`);
              if (spec.places.filter((p) => p.name === j.name).length !== 2) T.fail(`${tag}: ${j.name} is not on the map twice`);
            } else {
              if (!nonEmpty(j.what)) T.fail(`${tag}: what ${JSON.stringify(j.what)}`);
              else if (spec.places.some((p) => p.address === j.name)) T.fail(`${tag}: ${j.name} is on the map`);
            }
          } catch (e) {
            T.fail(`${tag}: ${e && e.stack ? e.stack.split('\n').slice(0, 2).join(' ') : e}`);
          }
        });
      }
    }
    T.check(wheelSteps(-100) === 1 && wheelSteps(250) === -3 && wheelSteps(0) === 0, 'wheelSteps');
  });
})();
