/* handle-text/selftest.js: model checks, loaded only by the kit/selftest.js harness. */
(function () {
  'use strict';
  // Model-level simulation of one plan step. One action advances the original kit-clock ticks.
  function simulate(T, m, spec, step, clock) {
    const { def: fam, lib, helpers } = T;
    m = JSON.parse(JSON.stringify(m));
    const v = spec.scenario;
    if (step.type) {
      const [t, text] = step.type;
      if (t.field === 'name') m.name = text;
      else if (t.efield !== undefined) { m.values[t.efield] = text; m.focus = `f${t.efield}`; m.caret = text.length; m.sel = null; }
      else if (t.spin) { const p = helpers.parseSpin(spec, text); if (p !== null) m.value = p; m.focus = true; }
      else m.field = text;
      if (helpers.isCopy(spec)) { m.focus = 'field'; m.sel = null; }
    } else if (step.key === 'Control+a') {
      if (v === 'edit') m.sel = { box: true, start: 0, end: spec.snippet.text.length };
      else m.sel = { box: spec.want.box, start: 0, end: spec.boxes[spec.want.box].text.length };
    } else if (step.key === 'Control+c') m.clip = v === 'edit' ? spec.snippet.text : helpers.copyText(spec, m.sel);
    else if (step.key === 'Control+x') {
      const s = m.sel;
      m.clip = m.values[0].slice(s.start, s.end);
      m.values[0] = m.values[0].slice(0, s.start) + m.values[0].slice(s.end);
      m.caret = s.start;
      m.sel = null;
    } else if (step.key === 'Control+v') {
      if (v === 'edit') {
        const i = Number(m.focus.slice(1));
        const c = m.caret ?? m.values[i].length;
        m.values[i] = m.values[i].slice(0, c) + m.clip + m.values[i].slice(c);
        m.caret = c + m.clip.length;
      } else m.field += m.clip;
    } else if (step.key === 'Control+z') m.values[0] = m.history.pop();
    else if (step.key === 'ArrowUp' || step.key === 'ArrowDown') m.value += step.key === 'ArrowUp' ? 1 : -1;
    else if (step.key) {
      const ch = step.key === 'Space' ? ' ' : step.key;
      m.values[0] = m.values[0].slice(0, m.caret) + ch + m.values[0].slice(m.caret);
      m.caret += 1;
    } else if (step.click && step.click.field) { m.focus = 'field'; m.sel = null; }
    else if (step.click && step.click.box !== undefined) { m.focus = `box:${step.click.box}`; m.sel = null; }
    else if (step.click && step.click.snippet) { m.focus = 'box'; m.sel = null; }
    else if (step.click && step.click.efield !== undefined) { m.focus = `f${step.click.efield}`; m.caret = m.values[step.click.efield].length; }
    else if (step.click && step.click.caret) { m.focus = `f${step.click.caret[0]}`; m.caret = step.click.caret[1]; m.sel = null; }
    else if (step.click && step.click.choice !== undefined) {
      m.clicked = step.click.choice;
      if (!helpers.buttonCorrect(m, spec)) m.wrongs = (m.wrongs || 0) + 1;
    } else if (step.click && step.click.undo) {
      if (v === 'unicode') m.clicked = null;
      else { m.pressed = null; m.signed = null; }
    } else if (step.click && step.click.button) {
      m.pressed = step.click.button;
      m.signed = m.name;
      if (!helpers.signCorrect(m, spec)) m.wrongs = (m.wrongs || 0) + 1;
    } else if (step.click && step.click.spin) {
      if (step.click.spin === 'value') m.focus = true;
      else m.value += step.click.spin === 'up' ? 1 : -1;
    } else if (step.down) {
      const dir = step.down.spin === 'up' ? 1 : -1;
      m.value += dir;
      m.hold = { dir, since: clock.t, n: 0 };
    } else if (step.up) m.hold = null;
    else if (step.wait) { /* time passes below */ }
    else if (step.wheel) {
      if (v === 'find') m.where = 0;
      else {
        const dy = step.wheel[1];
        const s = Math.max(0, Math.min(helpers.maxScroll(spec), (m.scroll || 0) + dy / lib.LINE_PX));
        m = helpers.scrolled(m, spec, s);
      }
    } else if (step.drag && step.drag[0].caret) {
      m.sel = { field: 0, start: step.drag[0].caret[1], end: step.drag[1].caret[1] };
      m.focus = 'f0';
    } else if (step.drag && step.drag[0].doc) m.sel = { start: step.drag[0].char, end: step.drag[1].char + 1 };
    else if (step.drag && step.drag[0].box !== undefined) {
      m.sel = { box: step.drag[0].box, start: step.drag[0].char, end: step.drag[1].char + 1 };
      m.focus = `box:${step.drag[0].box}`;
    } else if (step.drag) {
      if (v === 'find') m.where = 0;
      else {
        const t = step.drag[1];
        const s = t.scroll !== undefined ? t.scroll : t.scrollEdge === 'top' ? 0 : helpers.maxScroll(spec);
        m = helpers.scrolled(m, spec, s);
      }
    } else throw new Error(`cannot simulate ${JSON.stringify(step)}`);
    // One action = stepMs of task time.
    const ms = spec.stepMs || 1000;
    for (let t = 0; t < ms; t += 50) {
      clock.t += 50;
      m = fam.tick(m, spec, 50, clock.t);
    }
    return m;
  }

  env.selfTest('handle-text', (T) => {
    const { def: fam, lib, helpers } = T;
    const { nonEmpty } = env.util;
    const SCENARIOS = fam.scenarios;

    const modes = ['off', 'partial', 'wrong'];
    T.sweep({ seeds: 60, rng: (seed) => new env.Rng(seed * 7919 + 17), sample: false }, ({ scenario, seed, rng, tag }) => {
      const startMode = modes[seed % 3];
      let spec;
      let m;
      try {
        spec = fam.sample(rng.fork('s'), { scenario, scenarios: SCENARIOS, traits: {}, startMode, stepMs: 1000, ood: seed % 5 === 4,
          isplit: seed % 2 ? 'heldout' : 'train', csplit: seed % 7 === 3 ? 'heldout' : 'train' });
        m = fam.init(spec, rng.fork('i'));
      } catch (e) {
        T.fail(`${tag}: ${e.stack || e}`);
        return;
      }
      const tol = fam.tolerance(spec);
      const e0 = fam.error(m, spec);
      if (startMode === 'off' && !(e0 > (tol.minInitialError ?? 3 * tol.tau))) T.fail(`${tag}: start error ${e0}`);
      T.check(e0 > tol.tau, `${tag} (${startMode}): starts solved`);
      if (fam.ended(m, spec)) T.fail(`${tag} (${startMode}): starts ended`);
      const text = fam.instruction(spec, rng.fork('n'));
      T.check(!!text, `${tag}: empty instruction`);
      if (/submit/i.test(text)) T.fail(`${tag}: instruction names the end control: ${text}`);
      if (helpers.isCopy(spec) && helpers.copyText(spec, spec.want) !== spec.answer) T.fail(`${tag}: want range != answer`);
      if (helpers.isCopy(spec) && spec.answer !== spec.answer.trim()) T.fail(`${tag}: answer has outer whitespace`);
      if (scenario === 'scroll-text' && spec.mode !== 'edge' && lib.visible(spec, 0, spec.line)) T.fail(`${tag}: target line starts in view`);
      if (scenario === 'scroll-text' && spec.mode !== 'edge' && !spec.answer) T.fail(`${tag}: empty answer`);
      if (scenario === 'spinner' && ((spec.min !== null && spec.target < spec.min) || (spec.max !== null && spec.target > spec.max))) T.fail(`${tag}: target out of range`);
      if (scenario === 'find' && spec.doc.slice(spec.want.start, spec.want.end) !== spec.phrase) T.fail(`${tag}: want range != phrase`);
      let k = 0;
      const clock = { t: 0 };
      try {
        for (; k < 36 && fam.error(m, spec) > tol.tau; k++) {
          const step = fam.plan(m, spec);
          if (!step) break;
          m = simulate(T, m, spec, step, clock);
          if (fam.ended(m, spec)) throw new Error(`plan made a wrong choice ${JSON.stringify(step)}`);
        }
      } catch (e) {
        T.fail(`${tag} (${startMode}): ${e}`);
      }
      if (fam.error(m, spec) > tol.tau) T.fail(`${tag} (${startMode}): plan ends at error ${fam.error(m, spec)} after ${k} steps`);
      if (k > 30) T.fail(`${tag}: plan took ${k} steps`);
      if (fam.error(fam.solve(spec, fam.init(spec, null)), spec) > tol.tau) T.fail(`${tag}: solve() not on target`);
    });
    // Judge data (structural: the reply is graded from spec.judge, never from the message text).
    for (const scenario of SCENARIOS) {
      for (const judge of ['ambiguous', 'impossible']) {
        for (let seed = 0; seed < 14; seed++) {
          const tag = `judge ${judge} ${scenario} seed ${seed}`;
          try {
            const sp = fam.sample(new env.Rng(seed * 104729 + 5), { scenario, scenarios: SCENARIOS, traits: {}, startMode: 'off', stepMs: 1000, judge,
              isplit: seed % 2 ? 'heldout' : 'train', csplit: seed % 3 === 2 ? 'heldout' : 'train' });
            const j = sp.judge;
            if (!j || j.mode !== judge) { T.fail(`${tag}: no judge`); continue; }
            const text = fam.instruction(sp, new env.Rng(seed));
            if (!text || /\{|\}|undefined|NaN/.test(text)) T.fail(`${tag}: instruction ${text}`);
            if (/forgot which|or maybe|disagree|ask me/i.test(text)) T.fail(`${tag}: tell phrase in ${text}`);
            if (judge === 'ambiguous') {
              if (!Array.isArray(j.cands) || j.cands.length < 2 || !j.cands.every(nonEmpty)) T.fail(`${tag}: cands ${JSON.stringify(j.cands)}`);
              if (!Array.isArray(j.others) || !j.others.every(nonEmpty)) T.fail(`${tag}: others ${JSON.stringify(j.others)}`);
            } else if (!nonEmpty(j.what)) T.fail(`${tag}: what ${JSON.stringify(j.what)}`);
          } catch (e) {
            T.fail(`${tag}: ${e.stack || e}`);
          }
        }
      }
    }
    const eq = (a, b, what) => T.check(a === b, `${what}: got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`);
    eq(lib.levenshtein('kitten', 'sitting'), 3, 'levenshtein');
    eq(lib.levenshtein('确定', '取消'), 2, 'levenshtein CJK');
    eq(lib.levenshtein('😀a', 'a'), 1, 'levenshtein astral');
    eq(lib.dist(' Grüße ', 'Grüße'), 0, 'dist trims');
    eq(lib.dist('Grüße', 'Grüße'), 0, 'dist NFC');
    eq(lib.wordDist('dolor.', 'dolor'), 0, 'wordDist punctuation');
    eq(lib.wrap('aa bb cc dd', 5).join('|'), 'aa bb|cc dd', 'wrap');
    eq(helpers.fmtSpin({ step: 0.5, decimals: 1 }, -1), '-0.5', 'fmtSpin');
    eq(helpers.fmtSpin({ step: 1, decimals: 0 }, 0), '0', 'fmtSpin zero');
    eq(helpers.parseSpin({ step: 0.25, min: 0, max: null }, '2.75'), 11, 'parseSpin');
    eq(helpers.parseSpin({ step: 0.25, min: 0, max: null }, '2.7'), null, 'parseSpin off-grid');
    const hs = { scenario: 'spinner', min: null, max: null };
    let hm = { value: 0, hold: { dir: 1, since: 0, n: 0 } };
    for (let t = 50; t <= 1000; t += 50) hm = fam.tick(hm, hs, 50, t);
    eq(hm.value, 6, 'hold auto-repeat after one second');

  });
})();
