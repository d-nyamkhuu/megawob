/* complete-goals/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('complete-goals', (T) => {
    const { def } = T;
    const { isHeld, isReversed, wrap, tidy } = T.lib;
    for (const scenario of def.scenarios) {
      for (const startMode of ['off', 'partial', 'wrong']) {
        T.sweep({ scenarios: [scenario], seeds: 6, rng: (seed) => new env.Rng(seed * 104729 + 7), sample: false }, ({ seed, rng }) => {
          const tag = `${scenario}/${startMode} seed ${seed}`;
          try {
            const spec = def.sample(rng.fork('s'), { scenario, scenarios: def.scenarios, startMode, ood: seed === 5 });
            const model = def.init(spec, rng.fork('i'));
            const text = def.instruction(spec, rng.fork('t'));
            T.check(text && !/\bsubmit\b/i.test(text.replace(/"[^"]*"/g, '')), `${tag}: instruction names submit: ${text}`);
            T.check(def.error(model, spec) > 0, `${tag}: starts solved`);
            T.check(def.error(def.solve(spec, model), spec) === 0, `${tag}: solve() not on target`);
            const step = def.plan(model, spec);
            if (!step) T.fail(`${tag}: no plan step`);
            else {
              const t = step.click || step.drag?.[0] || step.type?.[0] || step.path?.[0] || step.wheel?.[0] || step.move || step.down;
              T.check(!t || t.part !== undefined, `${tag}: plan target not wrapped: ${JSON.stringify(step)}`);
            }
            const ins = def.inputs(spec);
            T.check(ins.includes('pointer'), `${tag}: inputs ${ins}`);
          } catch (e) {
            T.fail(`${tag}: ${e && e.stack ? e.stack.split('\n').slice(0, 2).join(' ') : e}`);
          }
        });
      }
    }
    // Held-out split: train never samples a held-out scenario, the date + slider / date + color pairs or a
    // reversed 3-part order; heldout episodes always do.
    const BAD = [['set-date', 'set-slider'], ['set-date', 'pick-color']];
    const has = (spec, f) => spec.parts.some((p) => p.task === f);
    for (let seed = 0; seed < 60; seed++) {
      for (const compose of ['train', 'heldout']) {
        for (const startMode of ['off', 'partial']) {
          const tag = `compose ${compose}/${startMode} seed ${seed}`;
          try {
            const spec = def.sample(new env.Rng(seed * 7919 + 11), { scenarios: def.scenarios, compose, startMode, ood: seed % 7 === 6 });
            const bad = BAD.some(([a, b]) => has(spec, a) && has(spec, b)) || isHeld(spec.scenario) || isReversed(spec.order);
            T.check(compose !== 'train' || !bad, `${tag}: held-out combination in training (${spec.scenario} ${spec.order})`);
            T.check(compose !== 'heldout' || (spec.heldKind && bad), `${tag}: heldout episode is not held out (${spec.scenario} ${spec.order})`);
            T.check(spec.compose === compose, `${tag}: spec.compose ${spec.compose}`);
          } catch (e) {
            T.fail(`${tag}: ${e && e.stack ? e.stack.split('\n').slice(0, 2).join(' ') : e}`);
          }
        }
      }
    }
    // judge impossible: the phantom goal is in the instruction, what names it, and it varies across seeds
    const phantoms = new Set();
    T.sweep({ seeds: 12, sample: false }, ({ scenario, seed }) => {
      const tag = `judge ${scenario} seed ${seed}`;
      try {
        const spec = def.sample(new env.Rng(seed * 104729 + 3), { scenario, scenarios: def.scenarios, startMode: 'off', judge: 'impossible' });
        const j = spec.judge;
        if (!j || !Array.isArray(j.what) || !j.what.length || j.what.some((x) => typeof x !== 'string' || !x.trim())) { T.fail(`${tag}: what ${JSON.stringify(j && j.what)}`); return; }
        phantoms.add(j.what[0]);
        T.check(def.instruction(spec, new env.Rng(seed)).includes(j.what[0]), `${tag}: instruction does not name ${j.what[0]}`);
      } catch (e) {
        T.fail(`${tag}: ${e && e.stack ? e.stack.split('\n').slice(0, 2).join(' ') : e}`);
      }
    });
    T.check(phantoms.size >= 30, `judge phantoms: only ${phantoms.size} distinct`);
    const w = wrap({ drag: [{ a: 1 }, { b: 2 }] }, 1);
    T.check(w.drag[0].part === 1 && w.drag[1].t.b === 2, 'wrap drag');
    T.check(tidy('Pick Lima, then finish.') === 'Pick Lima.', `tidy: ${tidy('Pick Lima, then finish.')}`);
  });
})();
