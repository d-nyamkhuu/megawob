/*
 * solve-puzzle / algebra: solve a linear equation for x and type x.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('solve-puzzle');
  const { answerError, say, txt, typedPlan, typedSilent, typedStart } = fam.lib;

  function sampleAlgebra(rng, spec) {
    const form = spec.ood ? rng.pick(['ax', 'ax+b', 'ax+b']) : rng.pick(['x+d', 'd+x', 'x-d', 'd-x', 'x+d', 'x-d', 'ax', 'ax+b']);
    if (form === 'ax') {
      const a = spec.ood ? rng.int(11, 19) : rng.int(2, 9);
      const x = spec.ood ? rng.int(5, 25) : rng.int(1, 12);
      return { form, expr: `${a}x = ${a * x}`, answer: x };
    }
    if (form === 'ax+b') {
      const a = spec.ood ? rng.int(7, 15) : rng.int(2, 6);
      const x = spec.ood ? rng.int(4, 20) : rng.int(1, 10);
      const b = spec.ood ? rng.int(20, 90) : rng.int(1, 20);
      return { form, expr: `${a}x + ${b} = ${a * x + b}`, answer: x };
    }
    const d = rng.int(0, 9);
    const m = rng.int(0, 99);
    if (form === 'x+d') return { form, expr: `x + ${d} = ${m}`, answer: m - d };
    if (form === 'd+x') return { form, expr: `${d} + x = ${m}`, answer: m - d };
    if (form === 'x-d') return { form, expr: `x - ${d} = ${m}`, answer: m + d };
    return { form, expr: `${d} - x = ${m}`, answer: d - m };
  }

  // A new equation of the same form and size.
  function otherAlgebra(spec, rng) {
    for (let k = 0; k < 40; k++) {
      const form = spec.form;
      let r;
      if (form === 'ax') {
        const a = spec.ood ? rng.int(11, 19) : rng.int(2, 9);
        const x = spec.ood ? rng.int(5, 25) : rng.int(1, 12);
        r = { expr: `${a}x = ${a * x}`, answer: x };
      } else if (form === 'ax+b') {
        const a = spec.ood ? rng.int(7, 15) : rng.int(2, 6);
        const x = spec.ood ? rng.int(4, 20) : rng.int(1, 10);
        const b = spec.ood ? rng.int(20, 90) : rng.int(1, 20);
        r = { expr: `${a}x + ${b} = ${a * x + b}`, answer: x };
      } else {
        const d = rng.int(0, 9);
        const m = rng.int(0, 99);
        r = form === 'x+d' ? { expr: `x + ${d} = ${m}`, answer: m - d } : form === 'd+x' ? { expr: `${d} + x = ${m}`, answer: m - d }
          : form === 'x-d' ? { expr: `x - ${d} = ${m}`, answer: m + d } : { expr: `${d} - x = ${m}`, answer: d - m };
      }
      if (r.answer !== spec.answer) return r;
    }
    return null;
  }

  env.scenario('solve-puzzle', {
    name: 'algebra',
    sample: sampleAlgebra,
    level(spec, r, { easy }) {
      if (easy) {
        const d = r.int(0, 9);
        const x = r.int(1, 12);
        Object.assign(spec, { form: 'x+d', expr: `x + ${d} = ${x + d}`, answer: x });
      } else if (spec.form === 'ax+b') {
        const a = r.int(2, 5);
        const x = r.int(1, 9);
        Object.assign(spec, { form: 'ax', expr: `${a}x = ${a * x}`, answer: x });
      }
    },
    judge(jr, spec, ph) {
      return ph(['Solve the second equation for x.', 'Type the value of x for the second equation.'], {}, 'there is only one equation on the page.', ['second equation']);
    },
    base(spec) {
      return { answer: '' };
    },
    start(spec, m, mode, rng) {
      return typedStart(spec, m, mode, rng);
    },
    tolerance() {
      return { tau: 0, sigma: 1 };
    },
    error(model, spec) {
      return answerError(model, spec);
    },
    instruction(spec, rng) {
      return say(rng, spec, ['Solve for x and type your answer.', 'Find the value of x and type it in the box.',
        'Type the value of x that solves the equation.', 'Work out x from the equation shown and enter it.', 'What is x? Type the number.',
        'Enter the solution of the equation on the page.',
        'Which number makes this true? Enter x.',
        'Fill the answer box with the number x equals.',
        'Use the equation to get x and enter it.',
        'Give x as a number in the answer field.',
        'Determine x. Put that number in the box.'], {}, { terse: 'x = ?' });
    },
    plan(model, spec) {
      return typedPlan(model, spec);
    },
    simulate(model, spec, step) {
      if (step.type) return { ...model, answer: step.type[1] };
    },
    facts(model) {
      return txt(model.answer) ? [{ label: 'Answer', value: txt(model.answer), labels: ['Result', 'x'] }] : [];
    },
    silent(next, prev, spec, rng, pick) {
      return typedSilent(next, pick);
    },
    retarget(spec, model, rng) {
      const r = otherAlgebra(spec, rng);
      return r ? { ...spec, ...r } : null;
    },
  });
})();
