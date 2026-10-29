/* fill-form/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  function docText(doc) {
    const out = [];
    const walk = (x) => {
      if (x === null || x === undefined) return;
      if (typeof x === 'string' || typeof x === 'number') out.push(String(x));
      else if (Array.isArray(x)) x.forEach(walk);
      else if (typeof x === 'object') Object.values(x).forEach(walk);
    };
    walk(doc);
    return out.join('\n');
  }

  env.selfTest('fill-form', (T) => {
    const { nonEmpty } = env.util;
    const { error: errorOf, plan: planOf } = T.def;
    const { wizardGo } = T.helpers;
    const { fieldOk, applyStep, formatOk, stepOf, kindOf, money, CURRENCIES, fmtForm, fmtDoc, addDays } = T.lib;

    const fam = T.def;
    const fails = T.fails;
    for (const scenario of fam.scenarios) {
      for (let seed = 0; seed < 60; seed++) {
        for (const startMode of ['off', 'partial', 'wrong']) {
          const rng = new env.Rng(seed * 7919 + 17);
          const tag = `${scenario} seed ${seed} ${startMode}`;
          const ood = seed % 7 === 6;
          let spec;
          let model;
          try {
            spec = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode, ood, csplit: seed % 3 === 2 ? 'heldout' : 'train' });
            model = fam.init(spec, rng.fork('i'));
          } catch (e) {
            fails.push(`${tag}: ${e && e.stack || e}`);
            continue;
          }
          const n = spec.fields.length;
          T.check(!(n < 4 || n > 11), `${tag}: ${n} fields`);
          const ids = new Set(spec.fields.map((f) => f.id));
          T.check(!(ids.size !== n), `${tag}: duplicate field ids`);
          const blanks = spec.fields.filter((f) => f.src === null).length;
          T.check(!(blanks > 3), `${tag}: ${blanks} blank-gold fields`);
          const text = docText(spec.doc);
          for (const f of spec.fields) {
            T.check(!(f.src !== null && !f.computed && (f.kind === 'text' || f.kind === 'date') && !text.includes(f.src)), `${tag}: ${f.id} source "${f.src}" not in the document`);
            T.check(!(f.src === null && f.gold !== '' && f.gold !== false), `${tag}: ${f.id} blank-gold with gold ${f.gold}`);
            T.check(!(f.src === null && f.kind !== 'text' && f.kind !== 'date'), `${tag}: ${f.id} blank-gold ${f.kind}`);
            T.check(!((f.kind === 'dropdown' || f.kind === 'radio') && !f.options.includes(f.gold)), `${tag}: ${f.id} gold not an option`);
            T.check(!(f.kind === 'date' && f.src !== null && !f.placeholder), `${tag}: ${f.id} date without a format`);
            T.check(!(f.wrong.some((w) => fieldOk(f, w))), `${tag}: ${f.id} a wrong value is right`);
          }
          T.check(!(spec.fields.some((f) => f.id === 'nights' && f.src !== null) && !(text.includes(spec.fields.find((f) => f.id === 'nights').src.split(' - ')[0]))), `${tag}: nights without dates`);
          const e0 = errorOf(model, spec);
          T.check(e0 > 0, `${tag}: starts solved`);
          let m = model;
          let k = 0;
          for (; k < 40; k++) {
            const step = planOf(m, spec);
            if (!step) break;
            m = applyStep(m, step, spec);
          }
          T.check(!(errorOf(m, spec) !== 0), `${tag}: plan ends at error ${errorOf(m, spec)} after ${k} steps`);
          T.check(!(k > 26), `${tag}: plan took ${k} steps`);
          T.check(!(errorOf(fam.solve(spec, model), spec) !== 0), `${tag}: solve() not on target`);
        }
      }
    }
    // Judge modes: the data the reply is graded from.
    for (const scenario of fam.scenarios.filter((v) => v !== 'fix')) {
      for (const mode of fam.judgeModes) {
        for (let seed = 0; seed < 12; seed++) {
          const tag = `${scenario} judge ${mode} seed ${seed}`;
          try {
            const rng = new env.Rng(seed * 7919 + 29);
            const sp = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode: 'off', judge: mode });
            const j = sp.judge;
            if (!j) { T.check(!(mode === 'impossible'), `${tag}: no spec.judge`); continue; }
            const text = fam.instruction(sp, rng.fork('t'));
            T.check(!(!text || text.includes('{') || /undefined/.test(text)), `${tag}: instruction ${text}`);
            if (mode === 'ambiguous') {
              if (!(j.cands.length >= 2 && j.cands.every(nonEmpty))) fails.push(`${tag}: cands ${JSON.stringify(j.cands)}`);
              else T.check(j.cands.every((c) => text.includes(c[0])), `${tag}: instruction lacks the candidates: ${text}`);
            } else T.check(nonEmpty(j.what), `${tag}: what ${JSON.stringify(j.what)}`);
          } catch (e) { fails.push(`${tag}: ${e && e.stack || e}`); }
        }
      }
    }
    // Opt-in modes (widget traits): wizard, PDF pane, dense ERP, keyboard routes, forced routes, fix.
    const combos = [{ wizard: true, keys: true }, { pdf: true, keys: true }, { dense: true, keys: true }, { keys: true }, { wizard: 0.5, pdf: 0.5, keys: true }];
    for (let seed = 0; seed < 160 && fails.length < 12; seed++) {
      const traits = combos[seed % combos.length];
      const scenario = fam.scenarios[Math.floor(seed / combos.length) % fam.scenarios.length];
      const startMode = ['off', 'partial', 'wrong'][seed % 3];
      const route = [undefined, 'keyboard', 'pointer', 'wheel'][Math.floor(seed / 5) % 4];
      const tag = `traits ${JSON.stringify(traits)} ${scenario} seed ${seed} ${startMode} route ${route}`;
      const rng = new env.Rng(seed * 104729 + 3);
      let spec;
      let model;
      try {
        spec = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode, ood: seed % 7 === 6, traits, route, csplit: 'train' });
        model = fam.init(spec, rng.fork('i'));
      } catch (e) {
        fails.push(`${tag}: ${e && e.stack || e}`);
        continue;
      }
      const L = spec.layout;
      const ids = spec.fields.map((f) => f.id);
      if (L.wizard) {
        const cover = L.wizard.steps.flatMap((st) => st.ids);
        T.check(!(cover.length !== ids.length || ids.some((id) => !cover.includes(id))), `${tag}: wizard steps do not partition the fields`);
        T.check(!(L.wizard.steps.length < 2 || L.wizard.steps.length > 4), `${tag}: ${L.wizard.steps.length} wizard steps`);
        T.check(!(L.long || L.pdf || L.dense), `${tag}: wizard with long/pdf/dense`);
        for (const f of spec.fields) T.check(!(f.gold !== '' && f.gold !== false && !formatOk(f, f.gold)), `${tag}: gold of ${f.id} fails its format check "${f.check}"`);
        // Next on an empty required step must refuse.
        const req = spec.fields.find((f) => f.required);
        if (req) {
          const probe = { ...model, step: stepOf(spec, req.id), fields: { ...model.fields, [req.id]: '' } };
          T.check(!(wizardGo(probe, spec, 'next').step !== probe.step), `${tag}: Next passes a blank required field`);
        }
      }
      T.check(!(L.dense && (spec.fields.length < 10 || L.cols !== 3 || !L.decoys.length)), `${tag}: dense shape`);
      if (spec.scenario === 'fix') {
        const bad = spec.fields.filter((f) => !fieldOk(f, f.id === spec.fix.id ? spec.fix.value : f.gold));
        T.check(!(bad.length !== 1 || bad[0].id !== spec.fix.id), `${tag}: fix does not break exactly one field`);
        T.check(!(spec.fix.mode === 'kind' && spec.fields.filter((f) => kindOf(f) === spec.fix.kind).length !== 1), `${tag}: ambiguous kind`);
      }
      T.check(!(route === 'keyboard' && spec.keys !== true), `${tag}: keyboard route not honoured`);
      T.check(!(route === 'pointer' && (spec.keys || (L.pdf && L.pdf.route !== 'thumb'))), `${tag}: pointer route not honoured`);
      T.check(!(route === 'wheel' && L.pdf && L.pdf.route !== 'wheel'), `${tag}: wheel route not honoured`);
      let m = model;
      if (L.pdf) {
        const total = 1500;
        m.pdf = { top: 0, view: 420, max: total - 420, seen: 420, pos: {} };
        for (const f of spec.fields) if (f.src !== null) m.pdf.pos[f.id] = rng.int(120, total);
      }
      if (L.dense && !L.tabs && L.startTab) m.tab = L.startTab;
      const kinds = new Set();
      let k = 0;
      for (; k < 70; k++) {
        const step = planOf(m, spec);
        if (!step) break;
        kinds.add(Object.keys(step)[0] + (step.click ? ':' + Object.keys(step.click)[0] : ''));
        m = applyStep(m, step, spec);
      }
      T.check(!(errorOf(m, spec) !== 0), `${tag}: plan ends at error ${errorOf(m, spec)} after ${k} steps`);
      T.check(!(errorOf(fam.solve(spec, model), spec) !== 0), `${tag}: solve() not on target`);
      T.check(!(spec.keys === false && [...kinds].some((x) => x === 'key')), `${tag}: key step without spec.keys`);
    }
    // Normalization primitives.
    const t = { kind: 'text', match: 'text', gold: 'Jane Smith' };
    T.check(fieldOk(t, '  jane   SMITH '), 'text match not case/space-insensitive');
    T.check(!(fieldOk(t, 'Jane Smit')), 'text match too lenient');
    const a = { kind: 'text', match: 'exact', gold: '1234.50' };
    T.check(!(fieldOk(a, '1,234.50') || fieldOk(a, '1234.5') || !fieldOk(a, ' 1234.50 ')), 'amount match wrong');
    const b = { kind: 'text', match: 'text', gold: '' };
    T.check(!(fieldOk(b, 'x') || !fieldOk(b, '  ')), 'blank-gold match wrong');
    T.check(!(money(123450, CURRENCIES[1], 'eu') !== '1.234,50 €' || money(5, CURRENCIES[0], 'symbol') !== '$0.05'), 'money format');
    T.check(!(fmtForm({ y: 2024, m: 3, d: 7 }, 'MM/DD/YYYY') !== '03/07/2024'), 'date format');
    T.check(!(fmtDoc(addDays({ y: 2024, m: 2, d: 28 }, 2), 'iso') !== '2024-03-01'), 'addDays leap');

  });
})();
