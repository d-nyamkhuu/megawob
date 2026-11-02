/*
 * read-figure / shape: click-shape.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('read-figure');
  const { keepIdx } = env.util;
  const { describe, factsItem, ITEM_COLORS, LETTERS, matches, phrase, planItem, sampleBoard } = fam.lib;

  env.scenario('read-figure', {
    name: 'shape',
    sample(rng, o) {
      const cols = o.ood ? rng.int(9, 10) : rng.int(6, 8);
      const rows = o.ood ? 6 : rng.int(4, 5);
      const tiny = rng.bool(o.ood ? 0.5 : 0.2);
      const items = sampleBoard(rng, cols, rows, rng.int(4, Math.min(o.ood ? 22 : 14, Math.floor(cols * rows * 0.45))));
      if (tiny) for (const it of items) it.size = 'tiny';
      const desc = describe(rng, rng.pick(items), true, tiny);
      return { cols, rows, items, desc, tiny };
    },
    level(spec, lv, r, untiny) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      const keep = keepIdx(r, spec.items.length, spec.items.map((it, i) => (matches(it, spec.desc) ? i : -1)).filter((i) => i >= 0), k(3, 6));
      spec.items = keep.map((i) => spec.items[i]);
      untiny(spec.items);
    },
    clickError: (spec, key) => spec.items[key] && matches(spec.items[key], spec.desc) ? 0 : 1,
    correctKey: (spec) => spec.items.findIndex((it) => matches(it, spec.desc)),
    wrongKey(spec, rng) {
      const non = spec.items.map((_, i) => i).filter((i) => !matches(spec.items[i], spec.desc));
      return non.length ? rng.pick(non) : null;
    },
    planStep: planItem,
    instruction(spec, rng, T, say) {
      const p = phrase(spec.desc, false);
      return say(T([
        'Click on {p}.', 'Click {p} on the board.', 'Find {p} and click it.', 'Select {p}.',
        'Somewhere on the board there is {p}; click it.', 'Pick {p} from the grid.', 'Give {p} a click.',
        'Make one click on {p}.', 'Choose by clicking {p}.', 'Your click target here is {p}.',
      ], { p }), p.replace(/^an? /, ''));
    },
    judgeAsk(jr, spec, ph) {
      const texts = [...LETTERS].filter((t) => !spec.items.some((it) => it.text === t));
      const t = jr.pick(texts);
      const color = jr.pick(Object.keys(ITEM_COLORS));
      return ph(['Click a {color} letter {t}.', 'Click on the {color} {t}.', 'Find the letter {t} in {color} and click it.'], { color, t }, `there is no letter ${t} on the board.`, [`letter ${t}`, `${color} ${t}`, ...(t === 'A' ? [] : [t])]);
    },
    factRows: factsItem,
    retargetEdit(spec, model, rng, out) {
      const set = (x) => spec.items.map((it, i) => (matches(it, x) ? i : -1)).filter((i) => i >= 0).join();
      for (let k = 0; k < 30; k++) {
        const d = describe(rng, rng.pick(spec.items), true, spec.tiny);
        if (set(d) !== set(spec.desc)) {
          out.desc = d;
          break;
        }
      }
      if (out.desc === spec.desc) return null;
    },
    selfCheck(spec, tag, fails) {
      if (!spec.items.some((it) => matches(it, spec.desc))) fails.push(`${tag}: no item matches`);
    },
  });
})();
