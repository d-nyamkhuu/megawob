/*
 * read-figure / shades: click-shades.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('read-figure');
  const { silentToggle, toleranceSet } = fam.lib;

  const SHADE_HUES = { red: 0, green: 120, blue: 226 };

  function targetTiles(spec) {
    return spec.tiles.map((t, i) => (t.task === spec.target ? i : -1)).filter((i) => i >= 0);
  }

  env.scenario('read-figure', {
    name: 'shades',
    sample(rng, o) {
      const n = o.ood ? rng.pick([20, 21, 24, 25]) : rng.pick([9, 10, 12, 12, 14, 15, 16]);
      const cols = o.ood ? (n % 5 === 0 ? 5 : n === 21 ? 7 : 6) : n <= 10 ? 5 : n === 12 || n === 16 ? 4 : n === 15 ? 5 : 7;
      const fams = rng.shuffle(Object.keys(SHADE_HUES));
      // Every task gets at least 2 tiles; the rest are spread at random.
      const counts = { [fams[0]]: 2, [fams[1]]: 2, [fams[2]]: 2 };
      for (let i = 6; i < n; i++) counts[rng.pick(fams)]++;
      const list = [];
      for (const f of fams) for (let i = 0; i < counts[f]; i++) list.push(f);
      const tiles = rng.shuffle(list).map((task) => ({
        task,
        h: (SHADE_HUES[task] + rng.int(-8, 8) + 360) % 360,
        s: rng.int(38, 90),
        l: rng.int(30, 72),
      }));
      return { cols, tiles, target: rng.pick(fams), select: rng.bool(0.3) ? 'modifier' : 'toggle' };
    },
    level(spec, lv) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      const cap = k(2, 3);
      const seen = {};
      spec.tiles = spec.tiles.filter((t) => (seen[t.task] = (seen[t.task] || 0) + 1) <= cap);
      if (easy) spec.select = 'toggle';
    },
    start(spec, rng, mode, half) {
      const t = targetTiles(spec);
      if (mode === 'partial') return { selected: half(t) };
      if (mode === 'wrong') {
        const non = spec.tiles.map((_, i) => i).filter((i) => !t.includes(i));
        return { selected: rng.sample(non, Math.min(non.length, rng.int(2, 3))).sort((a, b) => a - b) };
      }
      return { selected: [] };
    },
    error(model, spec) {
      const target = targetTiles(spec);
      const sel = new Set(model.selected);
      const inter = target.filter((i) => sel.has(i)).length;
      const union = new Set([...target, ...model.selected]).size;
      return 1 - inter / union;
    },
    tolerance: toleranceSet,
    planStep(model, spec) {
      const target = targetTiles(spec);
      const sel = model.selected;
      const mod = spec.select === 'modifier';
      const extra = sel.find((i) => !target.includes(i));
      const miss = target.find((i) => !sel.includes(i));
      if (mod) {
        // A plain click replaces the selection; Ctrl+click toggles one tile.
        const goodSel = sel.filter((i) => target.includes(i)).length;
        if (miss !== undefined && !goodSel) return { click: { tile: miss } };
        if (extra !== undefined) return { click: { tile: extra }, modifiers: ['Control'] };
        return miss !== undefined ? { click: { tile: miss }, modifiers: ['Control'] } : null;
      }
      if (miss !== undefined) return { click: { tile: miss } };
      return extra !== undefined ? { click: { tile: extra } } : null;
    },
    solve(spec) {
      return { selected: targetTiles(spec) };
    },
    instruction(spec, rng, T, say) {
      const how = spec.select === 'modifier' && rng.bool(0.4) ? ' (hold Ctrl to select more than one)' : '';
      return say(T([
        'Select all the shades of {c}{how}.',
        'Select every {c} tile{how}.',
        'Pick all tiles that are a shade of {c}{how}, and nothing else.',
        'Mark each {c}-ish tile{how}.',
        'Highlight all the {c} tiles{how}; leave the others unselected.',
        'Choose every tile in the {c} family{how}.',
        'Keep all and only {c} tiles selected{how}.',
        'For {c}, select the full range of shades{how}.',
      ], { c: spec.target, how }), `all ${spec.target} tiles`);
    },
    judgeAsk(jr, spec, ph) {
      const c = jr.pick(['yellow', 'orange', 'purple', 'pink', 'gray']);
      return ph([
        'Select every {c} tile.', 'Click all of the {c} shades.', 'Pick all {c} tiles.', 'Leave no {c} tiles out.'
      ], { c }, `there are no ${c} tiles on the page.`, [`${c} tiles`, `${c} shades`, c]);
    },
    factRows(model) {
      return model.selected.length ? [{ label: 'Selected tiles', value: String(model.selected.length), labels: ['Tiles selected', 'Selected', 'Checked tiles'] }] : [];
    },
    silentEdit: silentToggle,
    retargetEdit(spec, model, rng, out) {
      out.target = rng.pick(Object.keys(SHADE_HUES).filter((f) => f !== spec.target));
    },
  });
})();
