/*
 * read-figure / icon: a board of UI icons (ICONS.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('read-figure');
  const { keepIdx } = env.util;
  const I = env.instruct;
  const { clickByTarget, glyphAliases, glyphNames, planItem, sampleBoard, sampleIconItem, targetKey } = fam.lib;

  env.scenario('read-figure', {
    name: 'icon',
    sample(rng, o) {
      for (;;) {
        const tiny = rng.bool(o.ood ? 0.5 : 0.25);
        const cols = o.ood ? 8 : rng.int(5, 7);
        const rows = o.ood ? 5 : rng.int(3, 4);
        const pool = rng.sample(glyphNames(o.glyphs), o.ood ? 14 : rng.int(6, 10));
        const items = sampleBoard(rng, cols, rows, Math.min(cols * rows - 2, o.ood ? rng.int(14, 20) : rng.int(6, 12)), (r) => sampleIconItem(r, pool, o));
        if (tiny) for (const it of items) it.size = 'tiny';
        const t = rng.int(0, items.length - 1);
        const it = items[t];
        const sameKind = items.filter((x) => x.text === it.text).length;
        const sameFull = items.filter((x) => x.text === it.text && x.color === it.color).length;
        if (sameFull > 1) continue;
        const color = sameKind > 1 || rng.bool(0.25) ? it.color : null;
        return { cols, rows, items, desc: { text: it.text, color }, target: t, tiny };
      }
    },
    level(spec, lv, r, untiny) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      const keep = keepIdx(r, spec.items.length, [spec.target], k(3, 6));
      spec.target = keep.indexOf(spec.target);
      spec.items = keep.map((i) => spec.items[i]);
      untiny(spec.items);
    },
    clickError: clickByTarget,
    correctKey: targetKey,
    wrongKey: (spec, rng) => rng.pick(spec.items.map((_, i) => i).filter((i) => i !== spec.target)),
    planStep: planItem,
    instruction(spec, rng, T, say) {
      const d = spec.desc;
      const word = I.alias(rng, d.text, glyphAliases(spec.glyphs, d.text), 0.45);
      const label = d.color ? `${d.color} ${word}` : word;
      return say(T(d.color ? [
        'Click the {c} {w} icon.',
        'Find the {c} {w} icon and click it.',
        'Select the {w} icon that is {c}.',
        'Which one is the {c} {w} icon? Click it.',
        'Click the {w} icon drawn in {c}.',
        'Tap the {c} {w} symbol.',
        'Make the {c} {w} icon your pick.',
      ] : [
        'Click the {w} icon.',
        'Find the {w} icon and click it.',
        'Select the {w} icon.',
        'Which one is the {w} icon? Click it.',
        'Click on the icon for {w}.',
        'Tap the {w} symbol.',
        'Give the {w} icon a click.',
        'Can you select the {w} icon?',
      ], { w: word, c: d.color }), `${label} icon`);
    },
    judgeAsk(jr, spec, ph) {
      const used = new Set(spec.items.map((it) => it.text));
      const free = glyphNames(spec.glyphs).filter((n) => !used.has(n));
      const t = free.length ? jr.pick(free) : 'ghost';
      return ph(['Click the {t} icon.', 'Find the {t} icon and click it.', 'Select the {t} icon.'], { t }, `there is no ${t} icon on the board.`, [`${t} icon`, t]);
    },
    retargetEdit(spec, model, rng, out) {
      let found = false;
      for (let k = 0; k < 40 && !found; k++) {
        const t = rng.int(0, spec.items.length - 1);
        const it = spec.items[t];
        if (t === spec.target || spec.items.filter((x) => x.text === it.text && x.color === it.color).length > 1) continue;
        const sameKind = spec.items.filter((x) => x.text === it.text).length;
        out.desc = { text: it.text, color: sameKind > 1 || rng.bool(0.25) ? it.color : null };
        out.target = t;
        found = true;
      }
      if (!found) return null;
    },
    selfCheck(spec, tag, fails) {
      if (spec.items.filter((it) => it.text === spec.desc.text && (!spec.desc.color || it.color === spec.desc.color)).length !== 1) fails.push(`${tag}: icon target not unique`);
    },
  });
})();
