/* resize-element/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('resize-element', (T) => {
    const task = T.def;
    const { chebyshev, GRIP_ANCHOR, lockedSize } = T.lib;
    const { keyApply } = T.helpers;
    const { facts: factsOf, silent: silentOf, retarget: retargetOf } = task;
    T.check(chebyshev({ w: 10, h: 20 }, { w: 13, h: 15 }) === 5, 'chebyshev error wrong');
    for (let s = 0; s < 150; s++) {
      for (const scenario of task.scenarios) {
        for (const startMode of ['off', 'partial', 'wrong']) {
          const rng = new env.Rng(s);
          const opts = { scenario, scenarios: task.scenarios, startMode, ood: s % 9 === 0, traits: { lock: s % 3 !== 0 } };
          const spec = task.sample(rng.fork('spec'), opts);
          const m = task.init(spec, rng.fork('init'));
          const tag = `seed ${s} ${scenario}/${startMode}`;
          T.check(!(task.error(task.solve(spec, m), spec) > spec.tau), `${tag}: solve() is not on target`);
          T.check(spec.tau > 0, `${tag}: tau ${spec.tau}`);
          const ins = task.instruction(spec, rng.fork('i'));
          T.check(!(/submit/i.test(ins) || /\{\w+\}/.test(ins)), `${tag}: bad instruction ${ins}`);
          if (scenario === 'split') {
            const span = spec.total - spec.div;
            T.check(!(spec.target < spec.min || spec.target > span - spec.min), `${tag}: split target out of range`);
          } else if (scenario === 'column') {
            const t = spec.goal.kind === 'equal' ? spec.columns[spec.ref].w : spec.target;
            T.check(!(t < spec.min || t > spec.max), `${tag}: column target out of range`);
            T.check(!(spec.columns.reduce((a, c, i) => a + (i === spec.col ? spec.max : c.w), 0) > spec.budget), `${tag}: table exceeds budget`);
          } else {
            const { min, max, target } = spec;
            T.check(!(max.w + 100 > 800 || max.h + 80 > 470), `${tag}: max ${max.w}x${max.h} does not fit the smallest stage`);
            T.check(!(target.w < min.w || target.w > max.w || target.h < min.h || target.h > max.h), `${tag}: target out of bounds`);
            T.check(!(m.w < min.w || m.w > max.w || m.h < min.h || m.h > max.h), `${tag}: start out of bounds`);
            T.check(!(!GRIP_ANCHOR[spec.grip]), `${tag}: bad grip`);
          }
          // The plan converges in model space (drags land exactly; keys via keyApply).
          let mm = { ...m };
          for (let n = 0; n < 40 && task.error(mm, spec) > spec.tau + 1e-9; n++) {
            const st = task.plan(mm, spec);
            if (!st) break;
            if (st.click && st.click.lock) mm = { ...mm, lock: !mm.lock };
            else if (st.click) mm = { ...mm, focus: true };
            else if (st.key) {
              const shift = st.key.startsWith('Shift+');
              mm = keyApply(spec, mm, st.key.replace('Shift+', ''), shift);
            } else if (st.drag) {
              const to = st.drag[1];
              if (to.size && spec.scenario === 'aspect' && mm.lock) mm = { ...mm, ...lockedSize(spec, mm, to.size, to.handle) };
              else if (to.size) mm = { ...mm, w: Math.max(spec.min.w, Math.min(spec.max.w, to.size.w)), h: Math.max(spec.min.h, Math.min(spec.max.h, to.size.h)) };
              else if (to.width !== undefined) { const cols = mm.cols.slice(); cols[to.col] = to.width; mm = { ...mm, cols }; }
              else if (to.pos !== undefined) mm = { ...mm, pos: to.pos };
            }
          }
          T.check(!(task.error(mm, spec) > spec.tau + 1e-9), `${tag}: plan did not converge (${task.error(mm, spec)})`);
        }
      }
    }
    // traits.geometry: portrait start, larger target on both axes, bounds hold both; the rest of the spec is unchanged.
    const geo = { start: { w: [340, 400], h: [410, 460] }, target: { w: [450, 500], h: [460, 520] }, portrait: true, grow: true };
    for (let s = 0; s < 60; s++) {
      for (const scenario of ['numeric', 'ghost']) {
        for (const startMode of ['off', 'partial', 'wrong']) {
          const tag = `geometry seed ${s} ${scenario}/${startMode}`;
          const base = task.sample(new env.Rng(s).fork('spec'), { scenario, scenarios: task.scenarios, startMode });
          const spec = task.sample(new env.Rng(s).fork('spec'), { scenario, scenarios: task.scenarios, startMode, traits: { geometry: geo } });
          if (spec.goal.kind !== 'abs' || !spec.startSize) { T.fail(`${tag}: geometry not applied`); continue; }
          T.check(!(spec.grip !== base.grip || spec.tau !== base.tau || spec.axes !== base.axes || spec.title !== base.title), `${tag}: geometry changed the rest of the spec`);
          const st = spec.startSize;
          const t = spec.target;
          T.check(!(!(st.h > st.w) || !(t.w > st.w && t.h > st.h)), `${tag}: start ${st.w}x${st.h} target ${t.w}x${t.h}`);
          T.check(!(t.w > spec.max.w || t.h > spec.max.h || st.w > spec.max.w || st.h > spec.max.h), `${tag}: bounds do not hold the sizes`);
          T.check(!(spec.keyRoute), `${tag}: key route with geometry`);
          const m = task.init(spec, new env.Rng(s).fork('init'));
          T.check(!(startMode === 'off' && (m.w !== st.w || m.h !== st.h)), `${tag}: off start is not startSize`);
          T.check(!(task.error(task.solve(spec, m), spec) > spec.tau), `${tag}: solve() is not on target`);
          let mm = { ...m };
          for (let n = 0; n < 40 && task.error(mm, spec) > spec.tau + 1e-9; n++) {
            const step = task.plan(mm, spec);
            if (!step) break;
            if (step.drag) mm = { ...mm, ...step.drag[1].size };
            else if (step.key) mm = keyApply(spec, mm, step.key.replace('Shift+', ''), step.key.startsWith('Shift+'));
            else if (step.click) mm = { ...mm, focus: true };
          }
          T.check(!(task.error(mm, spec) > spec.tau + 1e-9), `${tag}: plan did not converge`);
        }
      }
    }
    // round 2: facts, silent, retarget, judge modes
    for (const scenario of task.scenarios) {
      for (let s = 0; s < 60 && T.fails.length < 12; s++) {
        const tag = `hooks seed ${s} ${scenario}`;
        try {
          const rng = new env.Rng(s * 31 + 7);
          const spec = task.sample(rng.fork('spec'), { scenario, scenarios: task.scenarios, startMode: 'off', ood: s % 9 === 0, traits: { lock: s % 3 !== 0 } });
          const m0 = task.init(spec, rng.fork('init'));
          const solved = task.solve(spec, m0);
          const facts = factsOf(solved, spec);
          T.check(!(!facts.length || facts.some((f) => !f.label || typeof f.value !== 'string' || !f.value)), `${tag}: facts ${JSON.stringify(facts)}`);
          const sil = silentOf(solved, m0, spec, new env.Rng(s + 3));
          T.check(!(sil && !(task.error(sil, spec) > spec.tau)), `${tag}: silent copy within tau`);
          const ns = retargetOf(spec, solved, new env.Rng(s + 9));
          if (ns) {
            T.check(task.error(solved, ns) > ns.tau, `${tag}: retarget already met`);
            T.check(Number.isFinite(task.error(task.init(ns, new env.Rng(s + 1)), ns)), `${tag}: retarget init error`);
            T.check(!(task.error(task.solve(ns, solved), ns) > ns.tau), `${tag}: retarget solve() off target`);
            T.check(typeof task.instruction(ns, new env.Rng(s + 2)) === 'string', `${tag}: retarget instruction`);
          }
          for (const judge of task.judgeModes) {
            const js = task.sample(new env.Rng(s * 13 + 1), { scenario, scenarios: task.scenarios, startMode: 'off', judge, traits: { lock: true } });
            if (!js.judge) continue;
            const jm = task.init(js, new env.Rng(s + 5));
            T.check(!(task.error(jm, js) > js.tau), `${tag} ${judge}: start not solved`);
            const j = js.judge;
            T.check(!(judge === 'ambiguous' && !(j.cands && j.cands.length >= 2 && j.cands.every((c) => c[0]))), `${tag}: cands ${JSON.stringify(j.cands)}`);
            T.check(!(judge === 'impossible' && !(j.what && j.what.length)), `${tag}: no what`);
            T.check(!!task.instruction(js, new env.Rng(s + 4)), `${tag} ${judge}: no instruction`);
          }
        } catch (e) {
          T.fail(`${tag}: ${e.stack || e}`);
        }
      }
    }
  });
})();
