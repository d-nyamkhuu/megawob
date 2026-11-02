/* transfer-items/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('transfer-items', (T) => {
    const { def, lib: { simulate }, helpers: { apply } } = T;
    const lc = (s) => s.toLowerCase();

    T.sweep({ seeds: 80, sample: false }, ({ scenario, seed }) => {
      for (const startMode of ['off', 'partial', 'wrong']) {
        const rng = new env.Rng(seed * 7919 + 31);
        const ood = seed % 5 === 4;
        const tag = `${scenario} seed ${seed} ${startMode}${ood ? ' ood' : ''}`;
        let spec;
        let m;
        try {
          spec = def.sample(rng.fork('s'), { scenario, startMode, ood, csplit: seed % 3 === 2 ? 'heldout' : 'train' });
          m = def.init(spec, rng.fork('i'));
        } catch (e) {
          T.fail(`${tag}: ${e}`);
          continue;
        }
        T.check(new Set(spec.items).size === spec.items.length, `${tag}: duplicate items`);
        if (spec.scenario === 'filter') {
          for (const x of spec.items) T.check(lc(x).includes(spec.queries[x]), `${tag}: query of ${x}`);
        }
        if (def.error(m, spec) < 1) continue; // the kit resamples
        let k = 0;
        for (; k < 36; k++) {
          const step = def.plan(m, spec);
          if (!step) break;
          const n = simulate(m, spec, step);
          if (JSON.stringify(n) === JSON.stringify(m)) { T.fail(`${tag}: step ${JSON.stringify(step)} changes nothing`); break; }
          m = n;
        }
        T.check(def.error(m, spec) === 0, `${tag}: plan ends at error ${def.error(m, spec)} after ${k} steps`);
        T.check(k <= 30, `${tag}: plan took ${k} steps`);
        const text = def.instruction(spec, rng.fork('instr'));
        if (startMode === 'off' && seed < 24) {
          for (const judge of def.judgeModes) {
            const js = def.sample(new env.Rng(seed * 31 + 3), { scenario, csplit: 'train', judge });
            const jd = js.judge;
            if (!jd) continue;
            T.check(def.instruction(js, new env.Rng(seed + 4)), `${tag} ${judge}: no instruction`);
            if (judge === 'impossible' && !(jd.what && jd.what.length)) T.fail(`${tag}: no what`);
            if (judge === 'ambiguous' && !(jd.cands && jd.cands.length === 2 && jd.cands.every((c) => c.length && c.every((n) => n)))) T.fail(`${tag}: cands ${JSON.stringify(jd.cands)}`);
          }
        }
        if (/submit|press done|click done|save/i.test(text.replace(/"[^"]*"/g, ''))) T.fail(`${tag}: instruction names the end control: ${text}`);
      }
    });
    // apply(): shift range, drop reorder.
    const s = { scenario: 'ordered', items: ['a', 'b', 'c', 'd'], targets: ['c', 'a'] };
    let m = { right: [], selL: [], selR: [], anchor: { L: '', R: '' }, qL: '', qR: '' };
    m = apply(apply(m, s, { sel: ['L', 'a', ''] }), s, { sel: ['L', 'c', 'shift'] });
    T.check(m.selL.join() === 'a,b,c', `shift range ${m.selL}`);
    m = apply(m, s, { btn: 'R' });
    T.check(m.right.join() === 'a,b,c', `move right ${m.right}`);
    m = apply(m, s, { drop: ['R', 'c', 'R', 0] });
    T.check(m.right.join() === 'c,a,b', `drop reorder ${m.right}`);
  });
})();
