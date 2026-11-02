/* recall-info/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('recall-info', (T) => {
    const { def: self, lib } = T;
    const { clone } = env.util;
    const run = (tag, spec, model, maxSteps) => {
      let m = model;
      let k = 0;
      for (; k < maxSteps; k++) {
        if (self.error(m, spec) === 0) break;
        const step = self.plan(m, spec);
        if (!step) break;
        const nx = lib.effect(m, spec, step);
        if (JSON.stringify(nx) === JSON.stringify(m)) { T.fail(`${tag}: plan step ${JSON.stringify(step)} has no effect`); return m; }
        m = nx;
      }
      if (self.error(m, spec) !== 0) T.fail(`${tag}: plan ends at error ${self.error(m, spec).toFixed(3)} after ${k} steps`);
      if (k > 30) T.fail(`${tag}: plan took ${k} steps`);
      return m;
    };
    for (const scenario of self.scenarios) {
      for (const startMode of ['off', 'partial', 'wrong']) {
        T.sweep({ scenarios: [scenario], seeds: 24, sample: false, rng: (seed) => new env.Rng(seed * 7919 + 17) }, ({ seed, rng }) => {
          const ood = seed % 5 === 0;
          const level = seed % 7 === 1 ? 'easy' : seed % 7 === 2 ? 'medium' : 'normal';
          const tag = `${scenario}/${startMode}${ood ? '/ood' : ''}/${level} seed ${seed}`;
          let spec;
          let model;
          try {
            spec = self.sample(rng.fork('s'), { scenario, scenarios: self.scenarios, startMode, ood, level, isplit: 'all', csplit: 'all', route: seed % 3 === 0 ? 'wheel' : seed % 3 === 1 ? 'pointer' : undefined });
            model = self.init(spec, rng.fork('i'));
            self.instruction(spec, rng.fork('t'));
          } catch (e) {
            T.fail(`${tag}: ${e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e}`);
            return;
          }
          T.check(self.error(model, spec) > 0, `${tag}: starts solved`);
          const solved = self.solve(spec, model);
          if (self.error(solved, spec) !== 0) T.fail(`${tag}: solve() not on target`);
          const done = run(tag, spec, model, 40);
          const fs = self.facts(solved, spec);
          if (!fs.length || fs.some((f) => !f.label || typeof f.value !== 'string' || !f.value)) T.fail(`${tag}: facts ${JSON.stringify(fs)}`);
          // silent: from the state a correct step produced
          const sr = new env.Rng(seed + 99);
          const prev = clone(model);
          const sil = self.silent(solved, prev, spec, sr);
          if (sil && !(self.error(sil, spec) > 0)) T.fail(`${tag}: silent() leaves the model solved`);
          // retarget
          const nspec = self.retarget(spec, solved, new env.Rng(seed + 7));
          if (nspec) {
            if (!(self.error(solved, nspec) > 0)) T.fail(`${tag}: retarget() is already satisfied`);
            if (!Number.isFinite(self.error(model, nspec))) T.fail(`${tag}: retarget() error(init) not finite`);
            self.instruction(nspec, new env.Rng(5));
            run(`${tag} retargeted`, nspec, solved, 40);
          } else if (scenario !== 'code' && seed < 8 && scenario !== 'count') T.fail(`${tag}: retarget() returned null`);
          void done;
        });
      }
      // judge impossible
      {
        for (let seed = 0; seed < 6; seed++) {
          const rng = new env.Rng(seed + 400);
          const spec = self.sample(rng.fork('s'), { scenario, scenarios: self.scenarios, judge: 'impossible', isplit: 'all', csplit: 'all' });
          const model = self.init(spec, rng.fork('i'));
          if (!spec.judge || self.error(model, spec) !== 0) T.fail(`${scenario} judge seed ${seed}: not untouched`);
          self.instruction(spec, rng.fork('t'));
          if (scenario === 'paginate' && spec.rows.some((r) => r.cat === spec.ask.val)) T.fail(`${scenario} judge seed ${seed}: value is present`);
          if (scenario === 'compare' && spec.items.some((x) => x.colour === spec.ask.val)) T.fail(`${scenario} judge seed ${seed}: value is present`);
          if (scenario === 'crossref' && spec.tabs.some((t) => t.name === spec.judge.tab)) T.fail(`${scenario} judge seed ${seed}: tab exists`);
          if (!(spec.judge.what && spec.judge.what.length && spec.judge.what.every((w) => typeof w === 'string' && w))) T.fail(`${scenario} judge seed ${seed}: no what`);
        }
      }
    }
  });
})();
