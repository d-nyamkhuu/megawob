/*
 * read-figure / count: mode 'shapes' (count matching items, may be 0) or 'sides' (sides of a polygon).
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('read-figure');
  const { keepIdx } = env.util;
  const { clickByCount, describe, factsCount, matches, phrase, planOption, sampleBoard, sampleItem,
    selfCheckCounted, toleranceCounted, truthKey, wrongOption } = fam.lib;

  env.scenario('read-figure', {
    name: 'count',
    sample(rng, o) {
      const mode = rng.bool(0.6) ? 'shapes' : 'sides';
      const answer = rng.bool(0.7) ? 'buttons' : 'typed';
      if (mode === 'sides') {
        const sides = o.ood ? rng.int(9, 10) : rng.int(3, 8);
        return {
          mode, answer, sides, truth: sides, options: o.ood ? [6, 7, 8, 9, 10, 11] : [3, 4, 5, 6, 7, 8],
          rot: rng.int(0, 180), scale: +rng.float(0.7, 1).toFixed(3), color: rng.pick(['black', 'blue', 'red', 'green', 'purple']),
        };
      }
      const cols = o.ood ? 8 : rng.int(6, 7);
      const rows = o.ood ? 6 : rng.int(4, 5);
      const items = sampleBoard(rng, cols, rows, o.ood ? rng.int(12, 18) : rng.int(3, 10));
      // 30%: a description sampled independently of the board (the answer may be 0), as in MiniWoB.
      const desc = rng.bool(0.3) ? describe(rng, sampleItem(rng), false) : describe(rng, rng.pick(items), false);
      const truth = items.filter((it) => matches(it, desc)).length;
      const pool = rng.shuffle([...Array(o.ood ? 19 : 11).keys()].filter((v) => v !== truth)).slice(0, 4);
      return { mode, answer, cols, rows, items, desc, truth, options: [...pool, truth].sort((a, b) => a - b) };
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      if (spec.mode === 'sides') {
        const top = k(5, 6);
        if (spec.sides > top) {
          spec.sides = r.int(3, top);
          spec.truth = spec.sides;
        }
        spec.options = spec.options.filter((v) => v === spec.truth || Math.abs(v - spec.truth) <= k(2, 3));
      } else {
        const must = spec.items.map((it, i) => (matches(it, spec.desc) ? i : -1)).filter((i) => i >= 0);
        const keep = keepIdx(r, spec.items.length, must, k(2, 4));
        spec.items = keep.map((i) => spec.items[i]);
        spec.truth = spec.items.filter((it) => matches(it, spec.desc)).length;
        if (!spec.options.includes(spec.truth)) spec.options = [spec.truth, ...spec.options.slice(1)].sort((a, b) => a - b);
      }
    },
    clickError: clickByCount,
    correctKey: truthKey,
    wrongKey: wrongOption,
    tolerance: toleranceCounted,
    planStep: planOption,
    instruction(spec, rng, T, say) {
      if (spec.mode === 'sides') {
        return spec.answer === 'typed'
          ? say(T(['Type the number of sides of the shape into the answer box.', 'How many sides does the shape have? Type the number.',
            'Count the sides of the polygon and enter that number.', 'Enter the number of edges of the shape.',
            'Record how many sides the polygon has in the answer box.',
            'How many edges form this shape? Enter a number.']), 'sides?')
          : say(T(['How many sides does the shape have?', 'Count the sides of the polygon and click that number.',
            'Click the number of edges the shape has.', 'Pick how many sides the figure has.',
            'The polygon has how many sides? Pick one.']), 'sides?');
      }
      const what = phrase(spec.desc, true);
      return spec.answer === 'typed'
        ? say(T(['Count the {w} and type the number into the answer box.', 'How many {w} are there? Type the answer.',
          'Enter the number of {w} on the board.', 'Type how many {w} you can see.', 'Count every {w} and write the total in the box.',
          'Fill in the count of {w}.',
          'What is the count of {w}? Enter it.',
          'The board has how many {w}? Enter a number.'], { w: what }), `count ${what}`)
        : say(T(['How many {w} are there?', 'Count the {w} and click the right number.', 'Click the number of {w} on the board.',
          'Pick how many {w} there are.', 'How many {w} can you find? Choose the count.', 'Select the total number of {w}.',
          'Which answer is the count of {w}?', 'Use the {w} count to pick an answer.',
          'What is the count of {w}? Click it.'], { w: what }), `count ${what}`);
    },
    judgeAsk(jr, spec, ph) {
      return spec.mode === 'sides'
        ? ph(['Give the number of sides of the second polygon.', 'How many sides does the second shape have? Answer it.'], {}, 'there is only one polygon on the page.', ['second polygon', 'second shape'])
        : ph([
          'Give the number of items on the second board.', 'How many items are on the right-hand board? Answer it.',
          'Count items on the second board and give a total.', 'What is the item count for the right-hand board?',
          'Report how many items you see on the right-hand board.'
        ], {}, 'there is only one board on the page.', ['second board', 'right-hand board', 'right board']);
    },
    factRows: factsCount,
    retargetEdit(spec, model, rng, out) {
      if (spec.mode === 'shapes') {
        for (let k = 0; k < 30; k++) {
          const d = rng.bool(0.3) ? describe(rng, sampleItem(rng), false) : describe(rng, rng.pick(spec.items), false);
          if (JSON.stringify(d) === JSON.stringify(spec.desc)) continue;
          const truth = spec.items.filter((it) => matches(it, d)).length;
          const pool = rng.shuffle([...Array(spec.ood ? 19 : 11).keys()].filter((x) => x !== truth)).slice(0, 4);
          Object.assign(out, { desc: d, truth, options: [...pool, truth].sort((a, b) => a - b) });
          break;
        }
        if (out.desc === spec.desc) return null;
      } else {
        return null;
      }
    },
    selfCheck: selfCheckCounted,
  });
})();
