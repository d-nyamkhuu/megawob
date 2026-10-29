/*
 * solve-puzzle / arithmetic: compute "a op b" and type the result.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('solve-puzzle');
  const { answerError, say, txt, typedPlan, typedSilent, typedStart } = fam.lib;

  function sampleArithmetic(rng, spec) {
    const level = spec.ood ? 'big' : rng.pick(['digit', 'digit', 'multi']);
    let a;
    let b;
    let op;
    if (level === 'big') {
      op = rng.pick(['+', '-', '*']);
      if (op === '*') {
        a = rng.int(13, 99);
        b = rng.int(3, 9);
      } else {
        a = rng.int(100, 999);
        b = rng.int(100, 999);
      }
    } else if (level === 'digit') {
      a = rng.int(0, 9);
      b = rng.int(0, 9);
      op = rng.pick(['+', '-', '*']);
    } else {
      op = rng.pick(['+', '-', '*', '/']);
      if (op === '+' || op === '-') {
        a = rng.int(10, 99);
        b = rng.int(10, 99);
      } else if (op === '*') {
        a = rng.int(2, 12);
        b = rng.int(2, 12);
      } else {
        b = rng.int(2, 9);
        a = b * rng.int(2, 12);
      }
    }
    const answer = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a / b;
    return { level, a, b, op, expr: `${a} ${op} ${b}`, answer };
  }

  // A new arithmetic problem of the same operation and size (the digit ranges of the current one).
  function otherArithmetic(spec, rng) {
    const { op } = spec;
    for (let k = 0; k < 40; k++) {
      let a;
      let b;
      const dig = (n) => (n < 10 ? [0, 9] : n < 100 ? [10, 99] : [100, 999]);
      if (op === '/') {
        b = rng.int(2, 9);
        a = b * rng.int(2, 12);
      } else if (op === '*' && spec.level === 'multi') {
        a = rng.int(2, 12);
        b = rng.int(2, 12);
      } else if (op === '*' && spec.level === 'big') {
        a = rng.int(13, 99);
        b = rng.int(3, 9);
      } else {
        const [al, ah] = dig(spec.a);
        const [bl, bh] = dig(spec.b);
        a = rng.int(al, Math.max(ah === 9 ? Math.max(5, spec.a, spec.b) : ah, al));
        b = rng.int(bl, Math.max(bh === 9 ? Math.max(5, spec.a, spec.b) : bh, bl));
        if (op === '-' && spec.a >= spec.b && a < b) [a, b] = [b, a];
      }
      const answer = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a / b;
      if (answer !== spec.answer && (a !== spec.a || b !== spec.b)) return { a, b, expr: `${a} ${op} ${b}`, answer };
    }
    return null;
  }

  env.scenario('solve-puzzle', {
    name: 'arithmetic',
    sample: sampleArithmetic,
    level(spec, r, { easy, k }) {
      if (!easy && spec.level === 'digit') return;
      const top = k(5, 9);
      let a = r.int(0, top);
      let b = r.int(0, top);
      const op = r.pick(easy ? ['+', '-'] : ['+', '-', '*']);
      if (op === '-' && easy && a < b) [a, b] = [b, a];
      Object.assign(spec, { level: 'digit', a, b, op, expr: `${a} ${op} ${b}`, answer: op === '+' ? a + b : op === '-' ? a - b : a * b });
    },
    judge(jr, spec, ph) {
      return ph(['Solve the second problem and type its answer.', 'Type the answer to the second calculation.'], {}, 'there is only one problem on the page.', ['second problem', 'second calculation', 'second sum']);
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
      return say(rng, spec, ['Solve the math problem and type your answer.', 'Compute the result shown and type it in the box.',
        'Type the answer to the math problem.', 'Work out the problem on the card and enter the result.', 'What does the expression on the page equal? Type it.',
        'Calculate the problem shown and fill in the answer.',
        'Use the answer box to record the computed value.',
        'The problem needs a numeric answer. Type it in.'], {}, { terse: 'solve it' });
    },
    plan(model, spec) {
      return typedPlan(model, spec);
    },
    simulate(model, spec, step) {
      if (step.type) return { ...model, answer: step.type[1] };
    },
    facts(model) {
      return txt(model.answer) ? [{ label: 'Answer', value: txt(model.answer), labels: ['Result', 'Solution'] }] : [];
    },
    silent(next, prev, spec, rng, pick) {
      return typedSilent(next, pick);
    },
    retarget(spec, model, rng) {
      const r = otherArithmetic(spec, rng);
      return r ? { ...spec, ...r } : null;
    },
  });
})();
