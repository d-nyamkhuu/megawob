/*
 * read-figure / spatial: items (glyphs or icons) on a board.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('read-figure');
  const { keepIdx } = env.util;
  const { clickByTarget, factsItem, glyphNames, ICON_NAMES, itemName, planItem, sampleBoard, sampleIconItem,
    sampleItem, SHAPES, targetKey } = fam.lib;

  const ORD = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];
  const ROW_PHRASE = (i, rows) => (i === 0 ? 'top row' : i === rows - 1 ? 'bottom row' : `${ORD[i]} row`);
  const COL_PHRASE = (i, cols) => (i === 0 ? 'leftmost column' : i === cols - 1 ? 'rightmost column' : `${ORD[i]} column`);

  // The spatial question (relation + target) of a board; null when none other than the current one comes up.
  function spatialQuestion(rng, spec) {
    const { cols, rows, items } = spec;
    const at = (c, r) => items.findIndex((it) => it.c === c && it.r === r);
    const unique = (i) => {
      const it = items[i];
      const sameText = items.filter((x) => x.kind === it.kind && x.text === it.text).length === 1;
      const sameFull = items.filter((x) => x.kind === it.kind && x.text === it.text && x.color === it.color).length === 1;
      return sameText ? 'text' : sameFull ? 'full' : null;
    };
    for (let k = 0; k < 40; k++) {
      let q = null;
      if (rng.bool(0.55)) {
        const rel = rng.pick(['left', 'right', 'above', 'below']);
        const cands = rng.shuffle(items.map((_, i) => i).filter((i) => unique(i)));
        for (const a of cands) {
          const it = items[a];
          const [dc, dr] = { left: [-1, 0], right: [1, 0], above: [0, -1], below: [0, 1] }[rel];
          let t = -1;
          for (let c = it.c + dc, r = it.r + dr; c >= 0 && c < cols && r >= 0 && r < rows; c += dc, r += dr) {
            t = at(c, r);
            if (t >= 0) break;
          }
          if (t < 0) continue;
          q = { query: { rel, anchor: a, named: unique(a) === 'text' && rng.bool(0.5) ? 'text' : 'full' }, target: t };
          break;
        }
      } else {
        const line = rng.bool(0.65) ? 'row' : 'col';
        const index = rng.int(0, line === 'row' ? rows - 1 : cols - 1);
        const inLine = items.map((it, i) => [it, i]).filter(([it]) => (line === 'row' ? it.r === index : it.c === index))
          .sort((p, w) => (line === 'row' ? p[0].c - w[0].c : p[0].r - w[0].r)).map(([, i]) => i);
        if (inLine.length >= 2) {
          const from = line === 'row' ? rng.pick(['left', 'right']) : rng.pick(['top', 'bottom']);
          const ordered = from === 'left' || from === 'top' ? inLine : inLine.slice().reverse();
          const n = rng.int(1, Math.min(4, ordered.length));
          q = { query: { rel: 'nth', line, index, from, n, last: n === ordered.length && rng.bool(0.5) }, target: ordered[n - 1] };
        }
      }
      if (q && q.target !== spec.target) return q;
    }
    return null;
  }

  env.scenario('read-figure', {
    name: 'spatial',
    sample(rng, o) {
      for (;;) {
        const cols = o.ood ? 8 : rng.int(5, 7);
        const rows = o.ood ? 5 : rng.int(3, 4);
        const set = rng.bool(0.5) ? 'icons' : 'glyphs';
        const pool = rng.sample(glyphNames(o.glyphs), 7);
        const make = set === 'icons' ? (r) => sampleIconItem(r, pool, o) : (r) => ({ ...sampleItem(r), size: 'large' });
        const items = sampleBoard(rng, cols, rows, Math.round(cols * rows * rng.float(0.45, 0.7)), make);
        const at = (c, r) => items.findIndex((it) => it.c === c && it.r === r);
        const unique = (i) => {
          const it = items[i];
          const sameText = items.filter((x) => x.kind === it.kind && x.text === it.text).length === 1;
          const sameFull = items.filter((x) => x.kind === it.kind && x.text === it.text && x.color === it.color).length === 1;
          return sameText ? 'text' : sameFull ? 'full' : null;
        };
        if (rng.bool(0.55)) {
          const rel = rng.pick(['left', 'right', 'above', 'below']);
          const cands = items.map((_, i) => i).filter((i) => unique(i));
          rng.shuffle(cands);
          for (const a of cands) {
            const it = items[a];
            const [dc, dr] = { left: [-1, 0], right: [1, 0], above: [0, -1], below: [0, 1] }[rel];
            let t = -1;
            for (let c = it.c + dc, r = it.r + dr; c >= 0 && c < cols && r >= 0 && r < rows; c += dc, r += dr) {
              t = at(c, r);
              if (t >= 0) break;
            }
            if (t < 0) continue;
            const named = unique(a) === 'text' && rng.bool(0.5) ? 'text' : 'full';
            return { cols, rows, set, items, query: { rel, anchor: a, named }, target: t };
          }
          continue;
        }
        const line = rng.bool(0.65) ? 'row' : 'col';
        const index = rng.int(0, line === 'row' ? rows - 1 : cols - 1);
        const inLine = items.map((it, i) => [it, i]).filter(([it]) => (line === 'row' ? it.r === index : it.c === index))
          .sort((p, q) => (line === 'row' ? p[0].c - q[0].c : p[0].r - q[0].r)).map(([, i]) => i);
        if (inLine.length < 2) continue;
        const from = line === 'row' ? rng.pick(['left', 'right']) : rng.pick(['top', 'bottom']);
        const ordered = from === 'left' || from === 'top' ? inLine : inLine.slice().reverse();
        const n = rng.int(1, Math.min(4, ordered.length));
        const last = n === ordered.length && rng.bool(0.5);
        return { cols, rows, set, items, query: { rel: 'nth', line, index, from, n, last }, target: ordered[n - 1] };
      }
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      const q = spec.query;
      const must = [spec.target];
      if (q.rel === 'nth') spec.items.forEach((it, i) => { if (q.line === 'row' ? it.r === q.index : it.c === q.index) must.push(i); });
      else must.push(q.anchor);
      const keep = keepIdx(r, spec.items.length, must, k(3, 6));
      if (keep.length < spec.items.length) {
        spec.target = keep.indexOf(spec.target);
        if (q.rel !== 'nth') q.anchor = keep.indexOf(q.anchor);
        spec.items = keep.map((i) => spec.items[i]);
      }
    },
    clickError: clickByTarget,
    correctKey: targetKey,
    wrongKey(spec, rng) {
      return spec.query.rel === 'nth' ? rng.pick(spec.items.map((_, i) => i).filter((i) => i !== spec.target)) : spec.query.anchor;
    },
    planStep: planItem,
    instruction(spec, rng, T, say) {
      const q = spec.query;
      const noun = spec.set === 'icons' ? 'icon' : 'item';
      if (q.rel !== 'nth') {
        const a = spec.items[q.anchor];
        const an = itemName(a, q.named === 'full');
        const rel = { left: 'to the left of', right: 'to the right of', above: 'above', below: 'below' }[q.rel];
        const near = { left: 'just left of', right: 'just right of', above: 'directly above', below: 'directly below' }[q.rel];
        return say(T([
          'Click the {noun} {near} the {a}.',
          'Click the nearest {noun} {rel} the {a} (same {line}).',
          'Find the {a}; click the {noun} next to it on the {side}.',
          'Select the {noun} that sits {near} the {a}.',
          'Which {noun} is {near} the {a}? Click it.',
          'Pick the closest {noun} {rel} the {a}.',
          'Click where the {noun} lies {near} the {a}.',
        ], { noun, near, rel, a: an, line: q.rel === 'left' || q.rel === 'right' ? 'row' : 'column', side: { left: 'left', right: 'right', above: 'top side', below: 'bottom side' }[q.rel] }), `${q.rel} of ${an}`);
      }
      const where = q.line === 'row' ? ROW_PHRASE(q.index, spec.rows) : COL_PHRASE(q.index, spec.cols);
      const nth = q.last ? 'last' : ORD[q.n - 1];
      const fromW = { left: 'from the left', right: 'from the right', top: 'from the top', bottom: 'from the bottom' }[q.from];
      return say(T([
        'Click the {nth} {noun} {from} in the {where}.',
        'In the {where}, click the {nth} {noun} counting {from}.',
        'Counting {from}, select the {nth} {noun} of the {where}.',
        'Pick the {nth} {noun} {from} in the {where}.',
        'Look at the {where} and click its {nth} {noun} {from}.',
        'Go to the {where}; the {nth} {noun} {from} is the one to click.',
      ], { nth, noun, from: fromW, where }), `${nth} ${fromW}, ${where}`);
    },
    judgeAsk(jr, spec, ph) {
      const names = (spec.glyphs ? glyphNames(spec.glyphs) : spec.set === 'icons' ? ICON_NAMES : SHAPES);
      const used = new Set(spec.items.map((it) => it.text));
      const free = names.filter((n) => !used.has(n));
      const what = free.length ? jr.pick(free) : 'ghost';
      const rel = jr.pick(['left', 'right', 'above', 'below']);
      const word = spec.set === 'icons' ? `${what} icon` : what;
      const place = { left: 'to the left of', right: 'to the right of', above: 'above', below: 'below' }[rel];
      return ph(['Click the item {place} the {word}.', 'Which item is {place} the {word}? Click it.'], { place, word }, `there is no ${word} on the board.`, [word, what]);
    },
    factRows: factsItem,
    retargetEdit(spec, model, rng, out) {
      const q = spatialQuestion(rng, spec);
      if (!q) return null;
      Object.assign(out, q);
    },
  });
})();
