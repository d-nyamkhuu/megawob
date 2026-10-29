/* read-figure/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('read-figure', (T) => {
    const fam = T.def;
    const fails = T.fails;
    const { CAP, dE, FINE, glyphNames, GRID_CAP, LOW_BOARD, LOW_ITEM_COLORS, matches, phrase } = T.lib;
    const { GLYPHS, ITEM_COLORS } = T.helpers;
    const { error: errorOf, init: initOf, instruction: instructionOf, plan: planOf, solve: solveOf } = fam;
    const SCENARIOS = fam.scenarios;
    const V = env.scenariosOf('read-figure');
    const LOW_FLOOR = { board: 18, pair: 12 };
    // Low-contrast palette floors: readable on its board and pairwise distinct (CIEDE2000).
    const low = Object.entries(LOW_ITEM_COLORS);
    for (const [k, h] of low) T.check(!(dE(h, LOW_BOARD) < LOW_FLOOR.board), `low contrast: ${k} vs board ${dE(h, LOW_BOARD).toFixed(1)}`);
    for (let i = 0; i < low.length; i++) {
      for (let j = i + 1; j < low.length; j++) {
        const d = dE(low[i][1], low[j][1]);
        T.check(!(d < LOW_FLOOR.pair), `low contrast: ${low[i][0]} vs ${low[j][0]} ${d.toFixed(1)}`);
      }
    }
    T.check(!(Object.keys(LOW_ITEM_COLORS).join() !== Object.keys(ITEM_COLORS).join()), 'low contrast: color names differ');
    for (const set of Object.keys(GLYPHS)) {
      for (const [name, [ch, aliases]] of Object.entries(GLYPHS[set])) T.check(!(!ch || !aliases.length), `glyphs ${set}.${name}`);
    }
    T.sweep({ seeds: 60, rng: (seed) => new env.Rng(seed * 7919 + 17), sample: false }, ({ scenario, seed, rng }) => {
      const startMode = ['off', 'partial', 'wrong'][seed % 3];
      const ood = seed % 7 === 6;
      const recover = seed % 4 === 0 ? false : seed % 4 === 1 ? true : undefined;
      const tag = `${scenario} seed ${seed} ${startMode}${ood ? ' ood' : ''}`;
      let spec;
      let model;
      try {
        // Odd seeds: the opt-in traits and an opts.route value (every value, undefined included).
        const traits = seed % 2 ? { glyphs: ['line', 'symbol', 'emoji'], contrast: ['normal', 'low'] } : {};
        const route = seed % 2 ? [undefined, 'pointer', 'keyboard', 'wheel'][(seed >> 1) % 4] : undefined;
        spec = fam.sample(rng.fork('s'), { scenario, scenarios: SCENARIOS, traits, route, startMode, ood, recover, csplit: seed % 5 ? 'train' : 'heldout' });
        model = initOf(spec, rng.fork('init'));
      } catch (e) {
        fails.push(`${tag}: ${e.stack || e}`);
        return;
      }
      const e0 = errorOf(model, spec);
      T.check(!(startMode === 'off' && !(e0 > fam.tolerance(spec).minInitialError)), `${tag}: start error ${e0}`);
      T.check(e0 > 0, `${tag}: start error ${e0} within tau`);
      T.check(!(fam.ended(model, spec)), `${tag}: starts ended`);
      const text = instructionOf(spec, rng.fork('i'));
      T.check(text, `${tag}: empty instruction`);
      T.check(!(/submit/i.test(text)), `${tag}: names the end control: ${text}`);
      let m = model;
      let k = 0;
      try {
        for (; k < 40 && errorOf(m, spec) > 0; k++) {
          const step = planOf(m, spec);
          if (!step) break;
          m = simulate(m, spec, step);
          if (fam.ended(m, spec)) throw new Error(`plan ended the episode after ${JSON.stringify(step)}`);
        }
      } catch (e) {
        fails.push(`${tag}: ${e}`);
      }
      T.check(!(errorOf(m, spec) !== 0), `${tag}: plan ends at error ${errorOf(m, spec)} after ${k} steps`);
      T.check(!(k > 36), `${tag}: plan took ${k} steps`);
      T.check(!(errorOf(solveOf(spec, model), spec) !== 0), `${tag}: solve() not on target`);
      const check = V[scenario].selfCheck;
      if (check) check(spec, tag, fails);
      if (spec.glyphs === 'emoji') {
        const list = spec.scenario === 'scroll-count' ? spec.rows : spec.items.filter((it) => it.kind === 'icon');
        const cols = list.map((it) => it.color).concat(spec.desc ? [spec.desc.color] : []);
        T.check(!(cols.some(Boolean)), `${tag}: emoji glyphs with an item color`);
      }
      if (spec.glyphs && spec.glyphs !== 'line') {
        const names = glyphNames(spec.glyphs);
        const used = spec.scenario === 'scroll-count' ? spec.rows.map((r) => r.icon) : spec.items.filter((it) => it.kind === 'icon').map((it) => it.text);
        T.check(!(used.some((n) => !names.includes(n))), `${tag}: icon outside glyph set ${spec.glyphs}`);
      }
      T.check(!(spec.forcedRoute === 'keyboard' && !fam.inputs(spec).includes('keyboard')), `${tag}: keyboard route without keyboard input`);
      T.check(!(spec.forcedRoute === 'pointer' && fam.inputs(spec).some((x) => x !== 'pointer')), `${tag}: pointer route allows ${fam.inputs(spec)}`);
      T.check(!(spec.forcedRoute === 'wheel' && spec.route !== 'wheel'), `${tag}: wheel route not honoured`);
    });
    // Grading spot checks.
    const gs = { scenario: 'grid', target: [1, -2], recoverable: false };
    T.check(!(errorOf({ answer: '1,-1' }, gs) !== 1), 'grid: neighbor not graded 1');
    T.check(!(errorOf({ answer: null }, gs) !== GRID_CAP), 'grid: no click');
    const cs = { scenario: 'count', answer: 'buttons', truth: 4 };
    T.check(!(errorOf({ answer: 6 }, cs) !== 2), 'count: off by two');
    const ts = { scenario: 'addition', truth: 13 };
    T.check(!(errorOf({ text: ' 12 ' }, ts) !== 1 || errorOf({ text: '1x' }, ts) !== CAP || errorOf({ text: '13' }, ts) !== 0), 'addition: typed grading');
    const as = { scenario: 'ascending', order: [2, 0, 1], recoverable: false };
    T.check(!(Math.abs(errorOf({ clicks: [2, 1] }, as) - (2 / 3 + 0.5 / 3)) > 1e-9), 'ascending: wrong second click');
    T.check(fam.ended({ clicks: [2, 1], wrong: 1 }, as), 'ascending: wrong click does not end');
    T.check(!(fam.ended({ clicks: [2, 1], wrong: 1 }, { ...as, recoverable: true })), 'ascending: recoverable ends at once');
    const ss = { scenario: 'shades', target: 'red', tiles: [{ task: 'red' }, { task: 'red' }, { task: 'blue' }] };
    T.check(!(Math.abs(errorOf({ selected: [0, 2] }, ss) - 2 / 3) > 1e-9), 'shades: jaccard');
    T.check(matches({ size: 'large', color: 'red', kind: 'letter', text: 'K' }, { size: null, color: 'red', kind: 'letter', text: null }), 'matches: type');
    T.check(!(phrase({ size: null, color: 'orange', kind: null, text: null }, false) !== 'an orange item'), 'phrase: article');
    T.check(dE(FINE.teal, FINE.cyan) > 8, 'fine: teal ~ cyan');

    // Model-space effect of one plan step, as the base widget implements it (selfTest).
    function simulate(model, spec, step) {
      const { clickError, gridKey, prefix } = T.lib;
      const m = JSON.parse(JSON.stringify(model));
      if (step.type) {
        m.text = step.type[1];
        return m;
      }
      if (step.wheel) {
        m.top = Math.min(spec.rows.length - spec.view, (m.top || 0) + 4);
        m.seen = Math.max(m.seen, m.top + spec.view - 1);
        return m;
      }
      if (step.drag) {
        m.top = Math.min(spec.rows.length - spec.view, step.drag[1].scroll);
        m.seen = Math.max(m.seen, m.top + spec.view - 1);
        return m;
      }
      const t = step.click;
      const answer = (k) => {
        if (m.answer !== null && m.answer !== undefined) return;
        m.clicks.push(k);
        m.answer = k;
        if (clickError(spec, k) > 0) m.wrong++;
      };
      if (t.undo) {
        if (spec.scenario === 'ascending') m.clicks.pop();
        else m.answer = null;
      } else if (t.swatch !== undefined) answer(t.swatch);
      else if (t.item !== undefined) answer(t.item);
      else if (t.option !== undefined) answer(t.option);
      else if (t.point !== undefined) answer(gridKey(t.point));
      else if (t.number !== undefined) {
        if (m.clicks.length === prefix(m, spec)) {
          m.clicks.push(t.number);
          if (m.clicks.length > prefix(m, spec)) m.wrong++;
        }
      } else if (t.tile !== undefined) {
        if (spec.select === 'modifier' && !(step.modifiers || []).length) m.selected = [t.tile];
        else m.selected = m.selected.includes(t.tile) ? m.selected.filter((i) => i !== t.tile) : m.selected.concat([t.tile]).sort((a, b) => a - b);
      } else if (t.card !== undefined) {
        m.up = t.card;
        if (!m.seen.includes(t.card)) m.seen.push(t.card);
      } else if (t.cell !== undefined) {
        m.on = m.on.includes(t.cell) ? m.on.filter((i) => i !== t.cell) : m.on.concat([t.cell]).sort((a, b) => a - b);
      }
      return m;
    }
  });
})();
