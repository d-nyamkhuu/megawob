/* reorder-items/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';

  // The episode loop retains the original early exits after sampling errors and failure limits.
  function checkEpisodes(T) {
    const fam = T.def;
    const { listPlan, kanbanPlan, orderError, kanbanError, STAGING } = T.lib;
    const { pin } = T.helpers;
    const modes = ['off', 'partial', 'wrong'];
    for (const scenario of fam.scenarios) {
      for (let seed = 0; seed < 80; seed++) {
        const tag = `${scenario} seed ${seed}`;
        const rng = new env.Rng(seed * 101 + 7);
        const startMode = modes[seed % 3];
        let spec;
        let model;
        try {
          spec = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode, ood: seed % 5 === 0,
            csplit: seed % 4 === 0 ? 'heldout' : 'train' });
          spec.startMode = startMode;
          model = fam.init(spec, rng.fork('i'));
        } catch (e) {
          T.fail(`${tag}: ${e.stack || e}`);
          continue;
        }
        if (fam.error(model, spec) <= 0 && startMode !== 'off') T.fail(`${tag}: ${startMode} start is solved`);
        if (fam.error(fam.solve(spec, model), spec) !== 0) T.fail(`${tag}: solve() not on target`);
        if (scenario !== 'kanban') {
          if (spec.items.length !== new Set(spec.items.map((id) => spec.labels[id].title)).size) T.fail(`${tag}: duplicate titles`);
          // Follow the drag plan in model space.
          const m = { order: model.order.slice() };
          const sp = { ...spec, route: 'drag' };
          let n = 0;
          for (; n < 40; n++) {
            const st = listPlan(m, sp);
            if (!st) break;
            const x = st.drag[0].item;
            const o = m.order.filter((id) => id !== x);
            o.splice(st.drag[1].slot, 0, x);
            m.order = pin(o, spec);
          }
          if (orderError(m, spec) !== 0) T.fail(`${tag}: plan ends at ${orderError(m, spec)} after ${n} steps`);
          // Forced keyboard route: click + arrow presses must fit the checker's 40-action budget.
          const ks = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode, ood: seed % 5 === 0, route: 'keyboard' });
          ks.startMode = startMode;
          if (!ks.keys || ks.route !== 'keys' || ks.locked) T.fail(`${tag}: route keyboard not forced`);
          const km = { order: fam.init(ks, rng.fork('i')).order.slice(), focus: null };
          let kn = 0;
          for (; kn < 60; kn++) {
            const st = listPlan(km, ks);
            if (!st) break;
            if (st.click) km.focus = st.click.item;
            else {
              const i = km.order.indexOf(km.focus);
              [km.order[i - 1], km.order[i]] = [km.order[i], km.order[i - 1]];
            }
          }
          if (orderError(km, ks) !== 0 || kn > 38) T.fail(`${tag}: keyboard plan ends at ${orderError(km, ks)} after ${kn} actions`);
        } else {
          const m = { columns: JSON.parse(JSON.stringify(model.columns)) };
          let n = 0;
          for (; n < 60; n++) {
            const st = kanbanPlan(m, spec);
            if (!st) break;
            const it = st.drag[0].item;
            const tgt = st.drag[1];
            for (const c of Object.keys(m.columns)) m.columns[c] = m.columns[c].filter((x) => x !== it);
            if (tgt.slot !== undefined) m.columns[tgt.column].splice(tgt.slot, 0, it);
            else m.columns[tgt.column].push(it);
          }
          if (kanbanError(m, spec) !== 0) T.fail(`${tag}: kanban plan ends at ${kanbanError(m, spec)}`);
          const ws = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode, route: 'wheel', traits: { cardMeta: true } });
          if (!ws.pane || ws.route !== 'wheel') T.fail(`${tag}: route wheel not forced`);
          if (!ws.items.every((id) => ws.labels[id].meta && ws.labels[id].meta.length === 2)) T.fail(`${tag}: cardMeta missing`);
          const plain = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode, ood: seed % 5 === 0,
            csplit: seed % 4 === 0 ? 'heldout' : 'train', traits: { cardMeta: true } });
          if (JSON.stringify(plain.columns) !== JSON.stringify(spec.columns) || plain.items.join() !== spec.items.join()) {
            T.fail(`${tag}: cardMeta changed the sampled board`);
          }
          const bsz = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode, traits: { boardSize: { columns: 2, perColumn: 6 } } });
          if (bsz.columns.length !== 2 || bsz.items.length !== 12) T.fail(`${tag}: boardSize gave ${bsz.columns.length} columns, ${bsz.items.length} cards`);
          // Staging tray: same board, every card in the tray at off / scene, plan empties the tray.
          const stMode = ['off', 'scene', 'partial', 'wrong'][seed % 4];
          const ssp = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode: stMode, ood: seed % 5 === 0,
            csplit: seed % 4 === 0 ? 'heldout' : 'train', traits: { staging: true } });
          ssp.startMode = stMode;
          if (JSON.stringify(ssp.columns) !== JSON.stringify(spec.columns) || ssp.items.join() !== spec.items.join()
            || ssp.staging !== STAGING || spec.staging) T.fail(`${tag}: staging changed the sampled board`);
          const sm = fam.init(ssp, rng.fork('i'));
          if (!(STAGING in sm.columns)) T.fail(`${tag}: staging group missing`);
          if ((stMode === 'off' || stMode === 'scene') && (sm.columns[STAGING].length !== ssp.items.length || ssp.columns.some((c) => sm.columns[c].length))) {
            T.fail(`${tag}: ${stMode} staging start is not all in the tray`);
          }
          if (stMode === 'wrong' && sm.columns[STAGING].length) T.fail(`${tag}: wrong staging start has tray cards`);
          if (kanbanError(sm, ssp) <= 0 && stMode !== 'wrong') T.fail(`${tag}: staging ${stMode} start is solved`);
          if (kanbanError(fam.solve(ssp, sm), ssp) !== 0) T.fail(`${tag}: staging solve() not on target`);
          const sm2 = { columns: JSON.parse(JSON.stringify(sm.columns)) };
          for (let n = 0; n < 60; n++) {
            const st = kanbanPlan(sm2, ssp);
            if (!st) break;
            const it = st.drag[0].item;
            const tgt = st.drag[1];
            for (const c of Object.keys(sm2.columns)) sm2.columns[c] = sm2.columns[c].filter((x) => x !== it);
            if (tgt.slot !== undefined) sm2.columns[tgt.column].splice(tgt.slot, 0, it);
            else sm2.columns[tgt.column].push(it);
          }
          if (kanbanError(sm2, ssp) !== 0 || sm2.columns[STAGING].length) T.fail(`${tag}: staging plan ends at ${kanbanError(sm2, ssp)}`);
        }
        if (T.fails.length > 12) return;
      }
    }
  }

  function checkHooks(T) {
    const fam = T.def;
    const { kanbanError, orderError } = T.lib;
    const factsOf = (...args) => fam.facts(...args);
    const silentOf = (...args) => fam.silent(...args);
    const retargetOf = (...args) => fam.retarget(...args);
    T.sweep({ seeds: 40, rng: (seed) => new env.Rng(seed * 7919 + 13), sample: false }, ({ scenario, seed, tag: baseTag, rng }) => {
      if (T.fails.length >= 12) return;
      const tag = `${baseTag} hooks`;
      try {
        const spec = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode: 'off', ood: seed % 5 === 0 });
        const m0 = fam.init(spec, rng.fork('i'));
        const solved = fam.solve(spec, m0);
        const facts = factsOf(solved, spec);
        if (facts.length < 2 || facts.some((f) => !f.label || typeof f.value !== 'string' || !f.value)) T.fail(`${tag}: facts ${JSON.stringify(facts)}`);
        const err = (m, sp) => (scenario === 'kanban' ? kanbanError(m, sp) : orderError(m, sp));
        const sil = silentOf(solved, m0, spec, new env.Rng(seed + 3));
        if (sil && err(sil, spec) <= 0) T.fail(`${tag}: silent copy has no error`);
        if (sil && JSON.stringify(Object.keys(sil)) !== JSON.stringify(Object.keys(solved))) T.fail(`${tag}: silent changed the model's shape`);
        const ns = retargetOf(spec, solved, new env.Rng(seed + 9));
        if (ns) {
          if (!(err(solved, ns) > 0)) T.fail(`${tag}: retarget already met`);
          if (!Number.isFinite(err(fam.init(ns, new env.Rng(seed + 1)), ns))) T.fail(`${tag}: retarget init error`);
          if (typeof fam.instruction(ns, new env.Rng(seed + 2)) !== 'string') T.fail(`${tag}: retarget instruction`);
          const s2 = fam.solve(ns, solved);
          if (err(s2, ns) !== 0) T.fail(`${tag}: retarget solve() not on target`);
        }
        for (const judge of fam.judgeModes) {
          const js = fam.sample(new env.Rng(seed * 31 + 5), { scenario, scenarios: fam.scenarios, startMode: 'off', judge });
          if (!js.judge) continue;
          const jm = fam.init(js, new env.Rng(seed + 7));
          if (err(jm, js) !== 0) T.fail(`${tag} ${judge}: start is not solved`);
          const text = fam.instruction(js, new env.Rng(seed + 4));
          const j = js.judge;
          const names = j.cands && j.cands.map((c) => c[0]);
          if (judge === 'ambiguous' && !(names && names.length >= 2 && names.every((n) => typeof n === 'string' && n))) T.fail(`${tag}: cands ${JSON.stringify(j.cands)}`);
          else if (judge === 'ambiguous' && scenario !== 'list' && scenario !== 'grid' && !text.toLowerCase().includes(names[0].toLowerCase())) T.fail(`${tag}: ambiguous text ${text}`);
          if (judge === 'impossible' && !(j.what && j.what.length)) T.fail(`${tag}: no what`);
        }
      } catch (e) {
        T.fail(`${tag}: ${e.stack || e}`);
      }
    });
  }

  env.selfTest('reorder-items', (T) => {
    checkEpisodes(T);
    // The original test returned before the hook checks after more than 12 episode failures.
    if (T.fails.length > 12) return;
    checkHooks(T);
    const { discord } = T.lib;
    const { pin } = T.helpers;
    T.check(discord(['a', 'b', 'c'], { a: 0, b: 0, c: 1 }) === 0, 'discord: ties should not count');
    T.check(Math.abs(discord(['c', 'a', 'b'], { a: 0, b: 1, c: 2 }) - 2 / 3) <= 1e-9, 'discord: wrong value');
    const p = pin(['b', 'a', 'c'], { locked: { a: 0 } });
    T.check(p.join() === 'a,b,c', `pin: ${p.join()}`);
  });
})();
