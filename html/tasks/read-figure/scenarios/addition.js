/*
 * read-figure / addition: visual-addition.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('read-figure');
  const { toleranceCounted } = fam.lib;

  env.scenario('read-figure', {
    name: 'addition',
    sample(rng, o) {
      const a = o.ood ? rng.int(11, 18) : rng.int(1, 10);
      const b = o.ood ? rng.int(11, 18) : rng.int(1, 10);
      return { a, b, truth: a + b };
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      const top = k(5, 8);
      if (spec.a > top) spec.a = r.int(1, top);
      if (spec.b > top) spec.b = r.int(1, top);
      spec.truth = spec.a + spec.b;
    },
    tolerance: toleranceCounted,
    instruction(spec, rng, T, say) {
      return say(T(['Type the total number of blocks into the textbox.', 'Add up the blocks in both groups and enter the sum.',
        'How many blocks are there altogether? Type the number.', 'Count all the blocks and type the total.',
        'What do both block counts add up to? Enter a number.', 'Use the textbox for the combined block count.',
        'Combine the two block counts. Enter your answer.']), 'total blocks');
    },
    judgeAsk(jr, spec, ph) {
      return ph(['Enter the total of the three groups of blocks.', 'Add up all three block groups and type the total.'], {}, 'there are only two groups of blocks.', ['third group', 'third group of blocks', 'three groups']);
    },
    factRows(model, spec, ans) {
      if (!ans) return [];
      return [{ label: 'Total', value: ans, labels: ['Answer', 'Sum'] }, { label: 'First group', value: String(spec.a), labels: ['Left group', 'First box'] },
        { label: 'Second group', value: String(spec.b), labels: ['Right group', 'Second box'] }];
    },
  });
})();
