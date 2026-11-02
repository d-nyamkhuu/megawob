/*
 * solve-puzzle / generate: press Generate until the number shown satisfies a condition.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('solve-puzzle');
  const { isOdd, say } = fam.lib;

  const DRAW_MAX = 10;

  function genError(spec, v) {
    if (v === null || v === undefined) {
      let worst = 0;
      for (let x = 0; x <= DRAW_MAX; x++) worst = Math.max(worst, genError(spec, x));
      return worst + 1;
    }
    switch (spec.kind) {
      case 'less': return Math.max(0, v - (spec.k - 1));
      case 'greater': return Math.max(0, spec.k + 1 - v);
      case 'between': return v < spec.a ? spec.a - v : v > spec.b ? v - spec.b : 0;
      case 'odd': return isOdd(v) ? 0 : 1;
      default: return isOdd(v) ? 1 : 0;
    }
  }

  // A shown number that does not satisfy the condition and is near it (error 1-2): the reference screens
  // that already show a number before the first press.
  function genInitial(spec, rng) {
    const ks = [];
    for (let x = 0; x <= DRAW_MAX; x++) if (genError(spec, x) > 0 && genError(spec, x) <= 2) ks.push(x);
    return rng.pick(ks);
  }

  function sampleGenerate(rng, base, opts) {
    const kind = rng.pick(['less', 'greater', 'odd', 'even', 'between']);
    const spec = { kind };
    if (kind === 'less') spec.k = rng.int(5, 8);
    if (kind === 'greater') spec.k = rng.int(2, 5);
    if (kind === 'between') {
      spec.a = rng.int(2, 6);
      spec.b = spec.a + rng.int(2, 3);
    }
    // The first satisfying draw comes within the first six presses.
    for (;;) {
      const draws = Array.from({ length: 24 }, () => rng.int(0, DRAW_MAX));
      const first = draws.findIndex((v) => genError(spec, v) === 0);
      if (first >= 0 && first <= 5) {
        // traits.generate { initial: true }: the display starts on a wrong number instead of empty.
        const T = (opts && opts.traits && opts.traits.generate) || {};
        return T.initial ? { ...spec, draws, initial: genInitial(spec, rng.fork('initial')) } : { ...spec, draws };
      }
    }
  }

  function condition(spec) {
    switch (spec.kind) {
      case 'less': return `less than ${spec.k}`;
      case 'greater': return `greater than ${spec.k}`;
      case 'between': return `from ${spec.a} to ${spec.b}`;
      case 'odd': return 'an odd number';
      default: return 'an even number';
    }
  }

  function generate(model, spec) {
    return { value: spec.draws[model.presses % spec.draws.length], presses: model.presses + 1 };
  }

  env.scenario('solve-puzzle', {
    name: 'generate',
    sample: sampleGenerate,
    level(spec, r, { easy }) {
      if (easy) {
        spec.kind = 'less';
        spec.k = r.int(7, 9);
        delete spec.a;
        delete spec.b;
      }
      const ok = [...Array(DRAW_MAX + 1).keys()].filter((v) => genError(spec, v) === 0);
      const at = r.int(0, 2);
      if (!spec.draws.slice(0, at + 1).some((v) => genError(spec, v) === 0)) spec.draws[at] = r.pick(ok);
      if (spec.initial !== undefined) spec.initial = genInitial(spec, r.fork('initial'));
    },
    judge(jr, spec, ph) {
      const k = DRAW_MAX + jr.int(1, 5);
      return ph(['Press Generate until the number shown is greater than {k}.', 'Keep generating until you get a number above {k}.'], { k: String(k) }, `the generator only shows numbers from 0 to ${DRAW_MAX}.`, [`number above ${k}`, `above ${k}`, `greater than ${k}`, `over ${k}`]);
    },
    base(spec) {
      return { value: spec.initial ?? null, presses: 0 };
    },
    start(spec, m, mode, rng) {
      const first = spec.draws.findIndex((x) => genError(spec, x) === 0);
      if (first < 1) return m;
      let g = m;
      for (let i = 0; i < Math.min(first, mode === 'partial' ? 1 : 2); i++) g = generate(g, spec);
      return g;
    },
    scene(spec, m, rng) {
      return m.value === null ? { ...m, value: genInitial(spec, rng.fork('scene')) } : m;
    },
    tolerance(spec) {
      return { tau: 0, sigma: spec.kind === 'odd' || spec.kind === 'even' ? 0.5 : 2 };
    },
    error(model, spec) {
      return genError(spec, model.value);
    },
    instruction(spec, rng) {
      const c = condition(spec);
      return say(rng, spec, ['Generate {c2}.', 'Press Generate until you get {c2}.', 'Get a generated number that is {c}.',
        'Keep generating until the display shows {c2}, then stop.', 'Roll for {c2}.', 'Use the generator to get {c2}.',
        'Make {c2} appear with Generate.', 'Stop generating at {c2}.', 'Your target for Generate is {c2}.'],
      { c, c2: /^an? /.test(c) ? c : `a number ${c}` }, { terse: `number ${c}` });
    },
    plan(model, spec) {
      return genError(spec, model.value) === 0 ? null : { click: { button: 'generate' } };
    },
    simulate(model, spec, step) {
      if (step.click.button === 'generate') return generate(model, spec);
    },
    target(spec) {
      const i = spec.draws.findIndex((v) => genError(spec, v) === 0);
      return { value: spec.draws[i], presses: i + 1 };
    },
    facts(model) {
      return model.value === null || model.value === undefined ? [] : [{ label: 'Number shown', value: String(model.value), labels: ['Generated number', 'Display', 'Number'] }];
    },
    silent(next, prev, spec, rng, pick) {
      return next.presses > prev.presses ? pick({ ...next, value: prev.value, presses: prev.presses }) : null;
    },
    retarget(spec, model, rng) {
      let out = null;
      for (let k = 0; k < 40 && !out; k++) {
        const kind = rng.pick(['less', 'greater', 'odd', 'even', 'between']);
        const s = { ...spec, kind, k: undefined, a: undefined, b: undefined };
        if (kind === 'less') s.k = rng.int(5, 8);
        if (kind === 'greater') s.k = rng.int(2, 5);
        if (kind === 'between') {
          s.a = rng.int(2, 6);
          s.b = s.a + rng.int(2, 3);
        }
        if (JSON.stringify([kind, s.k, s.a, s.b]) === JSON.stringify([spec.kind, spec.k, spec.a, spec.b])) continue;
        let first = -1;
        for (let j = 0; j < 6 && first < 0; j++) if (genError(s, spec.draws[(model.presses + j) % spec.draws.length]) === 0) first = j;
        if (first >= 0 && genError(s, model.value) > 0) out = s;
      }
      return out;
    },
  });
  Object.assign(fam.lib, { genError });
  Object.assign(fam.helpers, { generate });
})();
