/* click-control/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('click-control', (T) => {
    const { def: fam } = T;
    const { simulate, norm, walk } = T.lib;
    const { quote: q } = env.util;
    const { ICONS, menuNode } = T.lib;
    const { pending, undoModel } = T.helpers;
    const { init: initModel, error: errorOf, instruction: instructionOf, plan: planOf, tick: tickOf,
      silent: silentOf, solve: solveOf, facts: factsOf, retarget: retargetOf } = fam;
    const modes = ['off', 'partial', 'wrong'];
    const byCount = {};
    T.sweep({ seeds: 60, rng: (seed) => new env.Rng(seed * 7919 + 13), sample: false }, ({ scenario, seed, rng }) => {
      const startMode = modes[seed % 3];
      const tag = `${scenario} seed ${seed} ${startMode}`;
      let spec;
      let model;
      try {
        spec = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, traits: {}, startMode,
          ood: seed % 5 === 4, csplit: seed % 7 === 3 ? 'heldout' : 'train', recover: seed % 2 === 0 });
        model = initModel(spec, rng.fork('init'));
      } catch (e) {
        T.fail(`${tag}: ${e && e.stack || e}`);
        return;
      }
      const e0 = errorOf(model, spec);
      if (startMode === 'off' && !(e0 > fam.tolerance(spec).minInitialError)) T.fail(`${tag}: start error ${e0}`);
      T.check(e0 > 0, `${tag}: starts solved`);
      T.check(!fam.ended(model, spec), `${tag}: start state already ended`);
      let text = '';
      try { text = instructionOf(spec, rng.fork('i')); } catch (e) { T.fail(`${tag}: instruction ${e}`); }
      if (!text || /undefined|\{\w+\}/.test(text)) T.fail(`${tag}: bad instruction ${JSON.stringify(text)}`);
      if (/\bsubmit\b/i.test(text)) T.fail(`${tag}: instruction names the end control: ${text}`);
      let m = model;
      let k = 0;
      const trng = rng.fork('t');
      try {
        for (; k < 30 && errorOf(m, spec) > 0; k++) {
          const step = planOf(m, spec);
          if (!step) break;
          const before = m;
          m = simulate(m, spec, step);
          for (let t = 0; t < 1000; t += 50) m = tickOf(m, spec, 50, t, trng);
          if (errorOf(m, spec) < errorOf(before, spec)) {
            const bad = silentOf(m, before, spec, trng);
            if (bad && !(errorOf(bad, spec) > 0)) T.fail(`${tag}: silent() result is solved`);
            if (bad && JSON.stringify(Object.keys(bad).sort()) !== JSON.stringify(Object.keys(m).sort())) T.fail(`${tag}: silent() changed the model shape`);
          }
          if (fam.ended(m, spec)) throw new Error(`plan ended the episode ${JSON.stringify(step)}`);
          if (pending(m, spec) && !pending(model, spec)) throw new Error(`plan made a wrong choice ${JSON.stringify(step)}`);
        }
      } catch (e) {
        T.fail(`${tag}: ${e}`);
      }
      if (errorOf(m, spec) !== 0) T.fail(`${tag}: plan ends at error ${errorOf(m, spec)} after ${k} steps`);
      if (k > 18) T.fail(`${tag}: plan took ${k} steps`);
      if (errorOf(solveOf(spec, model), spec) !== 0) T.fail(`${tag}: solve() not on target`);
      if (scenario === 'menu' && spec.by === 'icon' && !ICONS[menuNode(spec, spec.target).icon]) T.fail(`${tag}: icon target without icon`);
      if (scenario === 'flyout') {
        byCount[spec.by] = (byCount[spec.by] || 0) + 1;
        // A searched flyout never names the path: no department or category label in the instruction.
        const hide = spec.by === 'path' ? [] : spec.target.split('>').slice(0, 2).map((_, i, a) => a.slice(0, i + 1).join('>'));
        for (const k of hide) if (text.includes(q(menuNode(spec, k).label))) T.fail(`${tag}: ${spec.by} instruction names ${k}: ${text}`);
        const labs = [];
        walk(spec.tree, (n) => { if (n.key.split('>').length <= 3) labs.push(norm(n.label)); });
        if (spec.by !== 'path' && new Set(labs).size !== labs.length) T.fail(`${tag}: duplicate department / category / sub-category label in a searched flyout`);
        if (spec.by === 'clue' && !(spec.clue.startsWith(spec.target + '>') && menuNode(spec, spec.clue))) T.fail(`${tag}: clue not under the target`);
      }
      // Round 2 hooks: facts are strings, retarget gives a solvable new goal, judge=impossible starts untouched.
      for (const f of factsOf(solveOf(spec, model), spec)) if (!f.label || typeof f.value !== 'string') T.fail(`${tag}: bad fact`);
      const rt = retargetOf(spec, model, rng.fork('rt'));
      if (rt) {
        const rt0 = initModel(rt, rng.fork('ri'));
        if (!(errorOf(model, rt) > 0) || !Number.isFinite(errorOf(rt0, rt))) T.fail(`${tag}: retarget error`);
        let rtext = '';
        try { rtext = instructionOf(rt, rng.fork('rti')); } catch (e) { T.fail(`${tag}: retarget instruction ${e}`); }
        if (!rtext || /undefined|\{\w+\}/.test(rtext)) T.fail(`${tag}: bad retarget instruction ${JSON.stringify(rtext)}`);
        let r = model;
        for (let j = 0; j < 30 && errorOf(r, rt) > 0; j++) {
          const step = planOf(r, rt);
          if (!step) break;
          r = simulate(r, rt, step);
          for (let t = 0; t < 1000; t += 50) r = tickOf(r, rt, 50, t, trng);
        }
        if (errorOf(r, rt) !== 0) T.fail(`${tag}: retargeted plan ends at ${errorOf(r, rt)}`);
      }
      const js = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, traits: {}, startMode, judge: 'impossible',
        ood: seed % 5 === 4, csplit: seed % 7 === 3 ? 'heldout' : 'train', recover: seed % 2 === 0 });
      if (!js.judge) T.fail(`${tag}: judge impossible not built`);
      else {
        if (errorOf(initModel(js, rng.fork('ji')), js) !== 0) T.fail(`${tag}: judge start not untouched`);
        const jt = instructionOf(js, rng.fork('jt'));
        if (!jt || /undefined|\{\w+\}/.test(jt) || (/"/.test(js.judge.templates[0]) && !jt.includes(js.judge.value))) T.fail(`${tag}: bad judge instruction ${jt}`);
      }
    });
    for (const by of ['path', 'label', 'clue']) if (!byCount[by]) T.fail(`flyout: no ${by} episode in the self-test seeds`);
    // Grading spot checks.
    const sq = { scenario: 'sequence', order: ['b1', 'b0', 'b2'], buttons: [] };
    if (Math.abs(errorOf({ clicks: ['b1'] }, sq) - 2 / 3) > 1e-9) T.fail('sequence: one correct press');
    if (Math.abs(errorOf({ clicks: ['b1', 'b2'] }, sq) - 2 / 3) > 1e-9) T.fail('sequence: wrong second press');
    if (errorOf({ clicks: ['b1', 'b0', 'b2', 'b2'] }, sq) <= 0) T.fail('sequence: extra press still succeeds');
    const bt = { scenario: 'button', target: 'ok', elements: [{ type: 'button', key: 'b0', label: 'ok' }, { type: 'button', key: 'b1', label: 'no' }, { type: 'button', key: 'b2', label: 'ok' }, { type: 'button', key: 'b3', label: 'ok', disabled: true }] };
    if (errorOf({ clicks: ['b2'] }, bt) !== 0) T.fail('button: duplicate label not accepted');
    if (errorOf({ clicks: ['b3'] }, bt) === 0) T.fail('button: disabled twin accepted');
    if (errorOf({ clicks: ['b0', 'b1'] }, bt) !== 1 || !fam.ended({ clicks: ['b1'] }, bt)) T.fail('button: wrong click not graded');
    const rb = { ...bt, recoverable: true };
    const w1 = { clicks: ['b1'], undone: 0 };
    if (fam.ended(w1, rb) || errorOf(w1, rb) <= 1) T.fail('recoverable: first wrong choice ends or has no penalty');
    const u1 = undoModel(w1, rb);
    if (u1.clicks.length || u1.undone !== 1 || errorOf(u1, rb) !== 1) T.fail('recoverable: undo');
    if (!fam.ended({ clicks: ['b1'], undone: 1 }, rb)) T.fail('recoverable: second wrong choice does not end');
  if (errorOf({ clicks: ['b0'], undone: 1 }, rb) !== 0) T.fail('recoverable: correct after undo not accepted');
  });
})();
