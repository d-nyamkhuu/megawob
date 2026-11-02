/*
 * read-figure / color: click-color.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('read-figure');
  const { keepIdx } = env.util;
  const { clickError, dE, FINE, SWATCHES, targetKey } = fam.lib;

  env.scenario('read-figure', {
    name: 'color',
    sample(rng, o) {
      const n = o.ood ? rng.int(10, 12) : rng.int(4, 8);
      const mode = rng.bool(0.6) ? 'name' : 'sample';
      if (rng.bool(0.4)) {
        // Fine palette: the target plus 1-3 near duplicates (CIEDE2000 8-25), the rest any distinguishable names.
        for (;;) {
          const names = Object.keys(FINE);
          const t = rng.pick(names);
          const near = rng.shuffle(names.filter((x) => x !== t && dE(FINE[x], FINE[t]) >= 8 && dE(FINE[x], FINE[t]) <= 25));
          if (!near.length) continue;
          const chosen = [t, ...near.slice(0, rng.int(1, 3))];
          for (const x of rng.shuffle(names)) {
            if (chosen.length >= n) break;
            if (!chosen.includes(x) && chosen.every((y) => dE(FINE[x], FINE[y]) >= 8)) chosen.push(x);
          }
          if (chosen.length < n) continue;
          const colors = rng.shuffle(chosen);
          return { mode, palette: 'fine', colors, hex: colors.map((c) => FINE[c]), target: colors.indexOf(t) };
        }
      }
      const colors = rng.sample(Object.keys(SWATCHES), Math.min(n, 12));
      return { mode, palette: 'basic', colors, hex: colors.map((c) => SWATCHES[c]), target: rng.int(0, colors.length - 1) };
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      let keep;
      if (spec.palette === 'fine') {
        // The far-away names first: the near duplicates are what makes the fine palette hard.
        const t = spec.hex[spec.target];
        const far = spec.hex.map((h, i) => [dE(h, t), i]).filter(([, i]) => i !== spec.target).sort((a, b) => b[0] - a[0]).map(([, i]) => i);
        keep = [spec.target, ...far.slice(0, k(2, 4))].sort((a, b) => a - b);
      } else keep = keepIdx(r, spec.colors.length, [spec.target], k(2, 4));
      if (keep.length < spec.colors.length) {
        spec.colors = keep.map((i) => spec.colors[i]);
        spec.hex = keep.map((i) => spec.hex[i]);
        spec.target = keep.indexOf(spec.target);
      }
    },
    clickError(spec, key) {
      if (spec.palette === 'fine') return spec.hex[key] ? Math.min(1, dE(spec.hex[key], spec.hex[spec.target]) / 40) : 1;
      return key === spec.target ? 0 : 1;
    },
    correctKey: targetKey,
    wrongKey(spec, rng) {
      const others = spec.colors.map((_, i) => i).filter((i) => i !== spec.target);
      if (spec.palette === 'fine') others.sort((a, b) => dE(spec.hex[a], spec.hex[spec.target]) - dE(spec.hex[b], spec.hex[spec.target]));
      return spec.palette === 'fine' ? others[0] : rng.pick(others);
    },
    planStep(model, spec) {
      return { click: { swatch: spec.target } };
    },
    instruction(spec, rng, T, say) {
      if (spec.mode === 'sample') {
        return say(T([
          'Click the box with the same color as the sample.',
          'Click on the box that matches the sample color.',
          'Find the swatch whose color matches the sample and click it.',
          'Pick the color that is identical to the sample.',
          'Which swatch has the sample\'s color? Click it.',
          'Select the swatch that matches the sample exactly.',
          'The sample sets the color. Click its exact match.',
          'Use the sample to guide your click to an exact match.',
          'One box repeats the sample color. Click that box.',
          'Match the sample by clicking its color among the boxes.',
        ]), 'match the sample');
      }
      const name = spec.colors[spec.target];
      return say(T([
        'Click on the {c} colored box.',
        'Click the {c} box.',
        'Pick the {c} swatch.',
        'Select the swatch that is {c}.',
        'Find the {c} one and click it.',
        'Choose {c} from the color options.',
        'Which box is {c}? Click it.',
        '{c} is the target. Click its box.',
        'Go for the box in {c}.',
        'Pick out {c} in one click.',
        'Your choice should be {c}.',
      ], { c: name }), name);
    },
    judgeAsk(jr, spec, ph) {
      const all = Object.keys(spec.palette === 'fine' ? FINE : SWATCHES).concat(Object.keys(SWATCHES));
      const c = jr.pick(all.filter((n) => !spec.colors.includes(n)));
      return ph([
        'Click on the {c} colored box.', 'Click the {c} box.', 'Pick the {c} swatch.',
        'Select the swatch that is {c}.', 'Give the {c} box a click.', 'Let {c} be your box choice.'
      ], { c }, `there is no ${c} swatch on the page.`, [c, `${c} swatch`, `${c} box`]);
    },
    retargetEdit(spec, model, rng, out) {
      out.target = rng.pick(spec.colors.map((_, i) => i).filter((i) => i !== spec.target));
    },
    selfCheck(spec, tag, fails) {
      if (spec.palette === 'fine' && spec.colors.some((c, i) => i !== spec.target && clickError(spec, i) <= 0)) fails.push(`${tag}: fine palette duplicate`);
    },
  });
})();
