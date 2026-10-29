/*
 * click-control / sequence: click-button-sequence.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('click-control');
  const C = env.content;
  const { allLabels, endish, norm, NUMBERS, PEN, pickIn, seqMatched, spread, T } = fam.lib;

  function sampleSequence(rng, ctx) {
    const { o, ood } = ctx;
    const n = ood ? rng.int(5, 6) : rng.pick([2, 2, 3, 4]);
    const words = rng.bool(0.35);
    const labels = words
      ? C.sample(rng, allLabels().filter((l) => l.length <= 10 && !/[…]|\.\.\./.test(l) && !endish(l)), n, o)
      : NUMBERS.slice(0, n);
    if (labels.length < n || new Set(labels.map(norm)).size < n) return sampleSequence(rng, { ...ctx, o: { csplit: 'all' } });
    const pts = spread(rng, n, n > 4 ? 0.3 : 0.45);
    const buttons = labels.map((label, i) => ({ key: `b${i}`, label, ...pts[i] }));
    const k = ood ? rng.int(4, Math.min(5, n)) : n === 2 ? 2 : rng.int(2, 3);
    let order = rng.sample(buttons.map((b) => b.key), k);
    if (n === 2 && rng.bool(0.6)) order = ['b0', 'b1'];
    return { labels: words ? 'words' : 'numbers', buttons, order };
  }

  env.scenario('click-control', {
    name: 'sequence',
    sample: sampleSequence,
    ownError(model, spec) {
      const m = seqMatched(model, spec);
      const e = 1 - m / spec.order.length;
      if (model.clicks.length > m) return spec.recoverable || model.planted ? e + PEN : Math.max(e, 1 / spec.order.length);
      return e;
    },
    result(spec, key) {
      const b = spec.buttons.find((x) => x.key === key);
      return `Pressed ${b ? b.label : key}`;
    },
    wrongFinal(spec, rng) {
      return { key: rng.pick(spec.buttons.filter((b) => b.key !== spec.order[0]).map((b) => b.key)) };
    },
    partial: (spec) => spec.order.length > 1 ? { clicks: spec.order.slice(0, 1) } : null,
    planStep(model, spec) {
      return { click: { button: spec.order[model.clicks.length] } };
    },
    solveDirect(m, spec) {
      return { ...m, clicks: spec.order.slice() };
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      spec.order = spec.order.slice(0, k(2, 3));
      const ord = new Set(spec.order);
      const extra = new Set(pickIn(r, spec.buttons.filter((b) => !ord.has(b.key)), () => false, k(0, 1)).map((b) => b.key));
      spec.buttons = spec.buttons.filter((b) => ord.has(b.key) || extra.has(b.key));
    },
    phrase(spec, rng, P) {
      let core, terse, steps;
      const labels = spec.order.map((k) => spec.buttons.find((b) => b.key === k).label);
      if (labels.length === 2) core = P(T.seq2, { a: labels[0], b: labels[1] });
      else core = P(T.seqN, { list: labels.join(', ') });
      terse = labels.join(' → ');
      steps = labels.map((l) => `click ${l}`);
      return { core, terse, steps };
    },
    phKind: () => 'button',
  });
})();
