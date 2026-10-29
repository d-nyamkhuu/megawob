/*
 * read-figure / identify: identify-shape.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('read-figure');
  const { keepIdx } = env.util;
  const { DIGITS, ITEM_COLORS, LETTERS, planOption } = fam.lib;

  const ID_SHAPES = ['circle', 'square', 'triangle', 'diamond', 'star', 'pentagon', 'hexagon'];

  env.scenario('read-figure', {
    name: 'identify',
    sample(rng) {
      const r = rng.next();
      const kind = r < 0.35 ? 'letter' : r < 0.7 ? 'digit' : 'shape';
      const text = kind === 'letter' ? rng.pick(LETTERS) : kind === 'digit' ? rng.pick(DIGITS) : rng.pick(ID_SHAPES);
      const truth = kind === 'shape' ? text : kind;
      const others = rng.sample(ID_SHAPES.filter((s) => s !== text), rng.int(3, 4) - (kind === 'shape' ? 1 : 0));
      const options = rng.shuffle(['letter', 'digit', ...others, ...(kind === 'shape' ? [text] : [])]);
      const figure = {
        kind, text, color: rng.pick(Object.keys(ITEM_COLORS)),
        x: +rng.float(0, 1).toFixed(3), y: +rng.float(0, 1).toFixed(3), scale: +rng.float(0.75, 1).toFixed(3),
      };
      return { figure, options, truth };
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      const must = spec.options.map((o, i) => (o === spec.truth ? i : -1)).filter((i) => i >= 0);
      const keep = keepIdx(r, spec.options.length, must, k(2, 3));
      spec.options = keep.map((i) => spec.options[i]);
    },
    clickError: (spec, key) => key === spec.truth ? 0 : 1,
    correctKey: (spec) => spec.truth,
    wrongKey: (spec, rng) => rng.pick(spec.options.filter((k) => k !== spec.truth)),
    planStep: planOption,
    instruction(spec, rng, T, say) {
      return say(T([
        'Click the button that best describes the figure.',
        'What is shown in the frame? Click the matching button.',
        'Identify the figure and choose the right label.',
        'Pick the label that names the shape or character in the frame.',
        'Look at the figure, then click the word that describes it.',
        'Choose the option that matches what is drawn.',
        'The figure fits one of the labels. Click that label.',
        'Which label goes with the figure? Make your choice.',
        'Use the answer buttons to tell what the figure is.',
        'Your choice of label should describe the figure shown.',
        'Give the figure a label by clicking the correct answer.',
        'From the labels provided, select one for the figure.',
      ]), 'name the figure');
    },
    judgeAsk(jr, spec, ph) {
      const t = jr.pick(ID_SHAPES.concat(['octagon', 'heart']).filter((n) => !spec.options.includes(n)));
      return ph([
        'Click the button that says “{t}”.', 'Click the “{t}” button.', 'Press the {t} answer.',
        'Find “{t}” and click it.', 'The answer to press is {t}.'
      ], { t }, `there is no “${t}” button.`, [t, `${t} button`]);
    },
    selfCheck(spec, tag, fails) {
      if (!spec.options.includes(spec.truth)) fails.push(`${tag}: truth not offered`);
    },
  });
})();
