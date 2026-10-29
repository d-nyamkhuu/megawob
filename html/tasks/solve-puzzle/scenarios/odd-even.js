/*
 * solve-puzzle / odd-even: mark every number odd or even.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('solve-puzzle');
  const { keepIdx } = env.util;
  const { isOdd, parity, say } = fam.lib;

  function sampleOddEven(rng, spec) {
    const n = spec.ood ? rng.int(7, 10) : rng.int(3, 6);
    const [lo, hi] = rng.pick([[-5, 11], [-5, 11], [0, 99], [-50, 50], [100, 999]]);
    for (;;) {
      const numbers = [];
      while (numbers.length < n) {
        const x = rng.int(lo, hi);
        if (!numbers.includes(x)) numbers.push(x);
      }
      const odd = numbers.filter(isOdd).length;
      if (odd > 0 && odd < n) return { numbers };
    }
  }

  env.scenario('solve-puzzle', {
    name: 'odd-even',
    sample: sampleOddEven,
    level(spec, r, { k }) {
      const odd = spec.numbers.map((v, i) => (isOdd(v) ? i : -1)).filter((i) => i >= 0);
      const even = spec.numbers.map((v, i) => (isOdd(v) ? -1 : i)).filter((i) => i >= 0);
      const keep = keepIdx(r, spec.numbers.length, [r.pick(odd), r.pick(even)], k(1, 2));
      spec.numbers = keep.map((i) => spec.numbers[i]);
    },
    judge(jr, spec, ph) {
      let n;
      do n = jr.int(100, 999); while (spec.numbers.includes(n));
      return ph(['Mark {n} as odd or even.', 'Mark the number {n} correctly.'], { n: String(n) }, `the number ${n} is not on the page.`, [String(n)]);
    },
    base(spec) {
      return { marks: spec.numbers.map(() => null) };
    },
    start(spec, m, mode, rng) {
      const n = spec.numbers.length;
      if (mode === 'partial') m.marks = spec.numbers.map((x, i) => (i < Math.floor(n / 2) ? parity(x) : null));
      else m.marks = spec.numbers.map((x, i) => (i % 2 === 0 ? (isOdd(x) ? 'even' : 'odd') : null));
      return m;
    },
    tolerance() {
      return { tau: 0, sigma: 0.3 };
    },
    error(model, spec) {
      const n = spec.numbers.length;
      return spec.numbers.filter((x, i) => model.marks[i] !== parity(x)).length / n;
    },
    instruction(spec, rng) {
      return say(rng, spec, ['Mark each number below as odd or even.', 'For every number, click Odd or Even.',
        'Classify the numbers as odd or even.', 'Label each number on the card odd or even.', 'Go through the list and mark every number as odd or even.',
        'Tag all of the numbers: odd or even.',
        'Odd or Even: choose one for each number.',
        'Use Odd and Even to mark the whole list.',
        'Each number needs an Odd or Even choice.',
        'Choose whether each number shown is odd or even.',
        'Set all numbers to Odd or Even as needed.'], {}, { terse: 'odd or even, each number' });
    },
    plan(model, spec) {
      const i = spec.numbers.findIndex((x, j) => model.marks[j] !== parity(x));
      return i < 0 ? null : { click: { mark: [i, parity(spec.numbers[i])] } };
    },
    simulate(model, spec, step) {
      const marks = model.marks.slice();
      marks[step.click.mark[0]] = step.click.mark[1];
      return { marks };
    },
    facts(model) {
      const odd = model.marks.filter((m) => m === 'odd').length;
      const even = model.marks.filter((m) => m === 'even').length;
      return odd + even ? [{ label: 'Marked odd', value: String(odd), labels: ['Odd numbers', 'Odd'] }, { label: 'Marked even', value: String(even), labels: ['Even numbers', 'Even'] }] : [];
    },
    silent(next, prev, spec, rng, pick) {
      const changed = next.marks.map((m, i) => (m !== prev.marks[i] ? i : -1)).filter((i) => i >= 0);
      if (!changed.length) return null;
      const i = rng.pick(changed);
      return pick({ ...next, marks: next.marks.map((m, k) => (k === i ? prev.marks[i] : m)) });
    },
  });
})();
