/* align-layout/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('align-layout', (T) => {
    const { def } = T;
    const { error: errorOf, plan: planOf, solve: solveOf, instruction: instructionOf, facts: factsOf,
      silent: silentOf, retarget: retargetOf } = def;
    const { sum, rectsOverlap, simulate } = T.lib;
    const { sameJson } = env.util;

    const fails = [];
    T.sweep({ seeds: 60, sample: false }, ({ scenario, seed }) => {
      for (const startMode of ['off', 'partial', 'wrong', 'solved']) {
        for (const level of ['normal', 'medium', 'easy']) {
          const rng = new env.Rng(seed * 7919 + 17);
          const tag = `${scenario} seed ${seed} ${startMode} ${level}`;
          let spec;
          let m;
          try {
            spec = def.sample(rng.fork('s'), { scenario, startMode, level });
            m = def.init(spec, rng.fork('i'));
          } catch (e) {
            fails.push(`${tag}: ${e}`);
            continue;
          }
          const e0 = errorOf(m, spec);
          if (startMode === 'solved' ? e0 > spec.tau : startMode === 'off' && e0 <= spec.tau * 2) fails.push(`${tag}: init error ${e0}, tau ${spec.tau}`);
          if (startMode === 'wrong' && e0 <= spec.tau) fails.push(`${tag}: wrong start is within tau`);
          for (const r of m.r) {
            if (r.x < 0 || r.y < 0 || r.x + r.w > spec.W || r.y + r.h > spec.H) fails.push(`${tag}: rect outside canvas ${JSON.stringify(r)}`);
          }

          if (scenario === 'columns') m.cols.forEach((w, c) => { if (sum(spec.target.slice(0, c)) + w > spec.W - 4) fails.push(`${tag}: divider ${c} off the table`); });
          if (e0 <= spec.tau) continue;
          let k = 0;
          for (; k < 14; k++) {
            const step = planOf(m, spec);
            if (!step) break;
            const n = simulate(m, spec, step);
            if (sameJson(n, m)) { fails.push(`${tag}: step ${JSON.stringify(step)} changes nothing`); break; }
            m = n;
          }
          if (errorOf(m, spec) > spec.tau) fails.push(`${tag}: plan ends at error ${errorOf(m, spec)} after ${k} steps`);
          const s = solveOf(spec, m);
          if (errorOf(s, spec) > spec.tau) fails.push(`${tag}: solve error ${errorOf(s, spec)}`);
          const text = instructionOf(spec, rng.fork('instr'));
          if (/submit|press done|click done|save/i.test(text.replace(/"[^"]*"/g, ''))) fails.push(`${tag}: instruction names the end control: ${text}`);
        }
      }
    });
    // round 2: grid traits, judge modes, hooks
    const q2 = (spec, m, tag) => {
      const bad = (v) => v % spec.cell !== 0;
      spec.items.forEach((it, i) => { if (it.s !== undefined && (bad(it.s) || bad(it.cs) || bad(it.c))) fails.push(`${tag}: item ${i} off the grid`); });
      (spec.boxes || []).forEach((b, i) => { if (bad(b.tx) || bad(b.ty) || bad(b.tw) || bad(b.th)) fails.push(`${tag}: box ${i} target off the grid`); });
      m.r.forEach((r, i) => { if (bad(r.x) || bad(r.y) || bad(r.w) || bad(r.h)) fails.push(`${tag}: rect ${i} off the grid ${JSON.stringify(r)}`); });
      if (spec.noOverlap) m.r.forEach((a, i) => m.r.forEach((b, j) => { if (j > i && rectsOverlap(a, b)) fails.push(`${tag}: start boxes ${i} and ${j} overlap`); }));
    };
    for (const scenario of def.scenarios) {
      for (let seed = 0; seed < 40 && fails.length < 30; seed++) {
        const startMode = ['off', 'partial', 'wrong', 'solved'][seed % 4];
        for (const traits of [null, { cell: 10, noOverlap: true }, { cell: 5 }]) {
          if (traits && scenario === 'columns') continue;
          const rng = new env.Rng(seed * 104729 + 3);
          const tag = `${scenario} seed ${seed} ${startMode} ${traits ? `cell ${traits.cell}` : 'plain'}`;
          let spec;
          let m;
          try {
            spec = def.sample(rng.fork('s'), { scenario, startMode, traits: traits || undefined, level: seed % 3 ? 'normal' : 'easy' });
            m = def.init(spec, rng.fork('i'));
          } catch (e) {
            fails.push(`${tag}: ${e}`);
            continue;
          }
          if (traits) q2(spec, m, tag);
          if (traits && scenario === 'mockup' && spec.noOverlap && startMode !== 'solved' && errorOf(m, spec) <= spec.tau) fails.push(`${tag}: start is solved after separating`);
          let k = 0;
          for (; k < 16 && errorOf(m, spec) > spec.tau; k++) {
            const step = planOf(m, spec);
            if (!step) break;
            m = simulate(m, spec, step);
            if (spec.noOverlap && m.r.some((a, i) => m.r.some((b, j) => j > i && rectsOverlap(a, b)))) { fails.push(`${tag}: a plan step overlapped two items`); break; }
          }
          if (errorOf(m, spec) > spec.tau) fails.push(`${tag}: plan ends at ${errorOf(m, spec)} (grid)`);
          const solved = solveOf(spec, m);
          const facts = factsOf(solved, spec);
          if (facts.length < 2 || facts.some((f) => !f.label || typeof f.value !== 'string' || !f.value)) fails.push(`${tag}: facts ${JSON.stringify(facts)}`);
          const prev = def.init(spec, new env.Rng(seed + 11));
          const sil = silentOf(solved, prev, spec, new env.Rng(seed + 5));
          if (sil) {
            if (errorOf(sil, spec) <= spec.tau) fails.push(`${tag}: silent leaves error ${errorOf(sil, spec)}`);
            let mm = sil;
            for (let n = 0; n < 8 && errorOf(mm, spec) > spec.tau; n++) { const st = planOf(mm, spec); if (!st) break; mm = simulate(mm, spec, st); }
            if (errorOf(mm, spec) > spec.tau) fails.push(`${tag}: silent state is not fixable`);
          }
          const ns = retargetOf(spec, solved, new env.Rng(seed + 9));
          if (ns) {
            if (!(errorOf(solved, ns) > ns.tau)) fails.push(`${tag}: retarget is already met`);
            if (!Number.isFinite(errorOf(def.init(ns, new env.Rng(seed + 1)), ns))) fails.push(`${tag}: retarget init error`);
            if (typeof def.instruction(ns, new env.Rng(seed + 2)) !== 'string') fails.push(`${tag}: retarget instruction`);
            if (traits) q2(ns, solveOf(ns, solved), `${tag} retarget`);
            let mm = solved;
            for (let n = 0; n < 16 && errorOf(mm, ns) > ns.tau; n++) { const st = planOf(mm, ns); if (!st) break; mm = simulate(mm, ns, st); }
            if (errorOf(mm, ns) > ns.tau) fails.push(`${tag}: retarget is not reachable by the plan`);
          }
        }
        for (const judge of def.judgeModes) {
          const rng = new env.Rng(seed * 7 + 1);
          const tag = `${scenario} seed ${seed} judge ${judge}`;
          try {
            const spec = def.sample(rng.fork('s'), { scenario, startMode: 'off', judge });
            const m = def.init(spec, rng.fork('i'));
            if (!spec.judge || spec.judge.mode !== judge) fails.push(`${tag}: no spec.judge`);
            else {
              if (errorOf(m, spec) > spec.tau) fails.push(`${tag}: start is not solved (${errorOf(m, spec)})`);
              const text = def.instruction(spec, rng.fork('t'));
              const j = spec.judge;
              const low = String(text || '').toLowerCase();
              if (!text || (judge === 'ambiguous' && !low.includes(j.cands[0][0].toLowerCase()))) fails.push(`${tag}: instruction ${text}`);
              if (judge === 'ambiguous' && (j.cands.length !== 2 || j.others.some((o) => o[0] === j.cands[0][0]))) fails.push(`${tag}: cands ${JSON.stringify(j)}`);
              if (judge === 'impossible' && !(j.what && j.what.length)) fails.push(`${tag}: no what`);
            }
          } catch (e) {
            fails.push(`${tag}: ${e}`);
          }
        }
      }
    }
    return fails.slice(0, 30);
  });
})();
