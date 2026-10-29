/* use-course-admin/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('use-course-admin', (T) => {
    const { def } = T, { error } = def;
    // The original test samples from the 'sample' fork, rather than T.sweep's default 's'.
    T.sweep({ seeds: 18, rng: seed => new env.Rng(seed + 13), sample: false }, ({ scenario, seed, rng }) => {
      const tag = `${scenario}/${seed}`;
      const s = def.sample(rng.fork('sample'), { scenario, level: ['easy', 'medium', 'normal'][seed % 3],
        ood: seed % 5 === 0, csplit: seed % 4 === 0 ? 'heldout' : 'train', startMode: 'off' });
      const m = def.init(s, rng.fork('init')), solved = def.solve(s, m);
      T.check(error(m, s) > 0 && error(solved, s) === 0, `${tag}: start/solve`);
      const before = JSON.stringify([s, m, solved]);
      const bad = def.silent(solved, m, s, rng.fork('silent'));
      T.check(bad && error(bad, s) > 0, `${tag}: silent must leave a wrong state`);
      const switched = def.retarget(s, solved, rng.fork('retarget'));
      T.check(switched && error(solved, switched) > 0 && Number.isFinite(error(m, switched)), `${tag}: retarget`);
      T.check(JSON.stringify([s, m, solved]) === before, `${tag}: hook mutated its argument`);
      T.check(!def.facts(solved, s).some(x => typeof x.value !== 'string'), `${tag}: fact formatting`);
      const ambiguous = def.sample(rng.fork('judge'), { scenario, judge: 'ambiguous' });
      const jm = def.init(ambiguous, rng.fork('ji'));
      const j = ambiguous.judge, text = def.instruction(ambiguous, rng.fork('jt'));
      T.check(error(jm, ambiguous) === 0 && def.judged(jm, ambiguous) && j.cands.length >= 2
        && !j.cands.some(c => !c.length || c.some(x => !x)) && new Set(j.cands.map(c => c[0])).size === j.cands.length
        && String(text).toLowerCase().includes(j.name.toLowerCase()), `${tag}: judge`);
    });
  });
})();
