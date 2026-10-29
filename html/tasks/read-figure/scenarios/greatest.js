/*
 * read-figure / greatest: find-greatest.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('read-figure');
  const { keepIdx } = env.util;
  const { toleranceOrdered } = fam.lib;

  const argmax = (xs) => xs.indexOf(Math.max(...xs));

  env.scenario('read-figure', {
    name: 'greatest',
    sample(rng, o) {
      const n = o.ood ? rng.int(7, 8) : rng.int(3, 6);
      const hi = o.ood ? rng.pick([99, 250, 999]) : rng.pick([9, 15, 25, 50, 99]);
      const values = new Set();
      while (values.size < n) values.add(rng.int(0, hi));
      return { mode: rng.bool(0.6) ? 'cards' : 'open', values: [...values] };
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      const mx = spec.values.indexOf(Math.max(...spec.values));
      const keep = keepIdx(r, spec.values.length, [mx], k(2, 3));
      spec.values = keep.map((i) => spec.values[i]);
    },
    start(spec, rng, mode, half) {
      const open = spec.mode === 'open';
      const all = spec.values.map((_, i) => i);
      const max = spec.values.indexOf(Math.max(...spec.values));
      if (mode === 'partial' && !open) return { up: null, seen: half(all.filter((i) => i !== max)) };
      if (mode === 'wrong') {
        const lo = spec.values.indexOf(Math.min(...spec.values));
        return { up: lo, seen: open ? all : [lo] };
      }
      return { up: null, seen: open ? all : [] };
    },
    error(model, spec) {
      if (model.up === null || model.up === undefined) return 1;
      const max = Math.max(...spec.values);
      const min = Math.min(...spec.values);
      return (max - spec.values[model.up]) / (max - min);
    },
    tolerance: toleranceOrdered,
    planStep(model, spec) {
      // Read every card once (face down cards must be turned), then pick the greatest.
      const unseen = spec.values.findIndex((_, i) => !model.seen.includes(i));
      if (unseen >= 0) return { click: { card: unseen } };
      return { click: { card: argmax(spec.values) } };
    },
    solve(spec) {
      return { up: argmax(spec.values), seen: spec.values.map((_, i) => i) };
    },
    instruction(spec, rng, T, say) {
      return spec.mode === 'cards'
        ? say(T(['Find and pick the card with the greatest number.', 'Turn the cards over and leave the highest one face up.',
          'Which card hides the largest number? Leave it face up.', 'Look under the cards and choose the biggest number.',
          'Compare the cards. Leave the maximum value face up.',
          'Only the card with the largest value should stay up.',
          'Which number beats all others? Keep its card face up.']), 'highest card')
        : say(T(['Select the card with the greatest number.', 'Click the card showing the largest number.',
          'Pick the highest card.', 'Choose the card with the biggest value.', 'Compare values and pick the maximum.',
          'The largest number is your choice.']), 'highest card');
    },
    judgeAsk(jr, spec, ph) {
      const n = spec.values.length + jr.int(1, 3);
      return ph(['Click card number {n}.', 'Flip card number {n}.'], { n: String(n) }, `there are only ${spec.values.length} cards.`, [`card ${n}`, `card number ${n}`, String(n)]);
    },
    factRows(model, spec) {
      if (model.up === null || model.up === undefined) return [];
      return [{ label: 'Highest value', value: String(spec.values[model.up]), labels: ['Greatest value', 'Largest number', 'Face-up card', 'Card value'] }];
    },
    silentEdit(next, prev, spec, rng, wrong) {
      if (next.up === null || next.up === undefined || next.up === prev.up) return null;
      const out = { ...next, up: prev.up === undefined ? null : prev.up };
      return wrong(out) ? out : null;
    },
  });
})();
