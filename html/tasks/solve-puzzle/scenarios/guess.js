/*
 * solve-puzzle / guess: guess a hidden number from higher / lower hints.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('solve-puzzle');
  const { along, errorOf, lockedOf, parseNumber, say } = fam.lib;

  function sampleGuess(rng, spec) {
    const span = spec.ood ? rng.pick([200, 250, 500, 1000]) : rng.pick([10, 10, 16, 20, 25, 30, 50, 64, 100]);
    const lo = span === 10 ? rng.pick([0, 1]) : rng.pick([0, 1, 1, 10, 50, 100]);
    const hi = lo + span - 1;
    const secret = rng.int(lo, hi);
    const spare = spec.startMode === 'wrong' || spec.startMode === 'partial' ? 1 : 0;
    const budget = Math.ceil(Math.log2(span + 1)) + rng.int(0, 2) + spare;
    return { lo, hi, secret, budget, route: rng.pick(['button', 'enter']) };
  }

  const solvedGuess = (model) => model.guesses.some((g) => g.verdict === 'correct');

  function makeGuess(model, spec) {
    if (lockedOf(model, spec)) return model;
    const v = parseNumber(model.text);
    if (v === null || !Number.isInteger(v) || v < spec.lo || v > spec.hi) return { ...model, note: 'invalid' };
    const verdict = v === spec.secret ? 'correct' : spec.secret > v ? 'higher' : 'lower';
    return { ...model, text: '', guesses: model.guesses.concat([{ value: v, verdict }]), note: null };
  }

  function guessInterval(model, spec) {
    let lo = spec.lo;
    let hi = spec.hi;
    for (const g of model.guesses) {
      if (g.verdict === 'higher') lo = Math.max(lo, g.value + 1);
      else if (g.verdict === 'lower') hi = Math.min(hi, g.value - 1);
    }
    return [lo, hi];
  }

  env.scenario('solve-puzzle', {
    name: 'guess',
    sample: sampleGuess,
    level(spec, r, { k }) {
      const old = Math.ceil(Math.log2(spec.hi - spec.lo + 2));
      const span = Math.min(spec.hi - spec.lo + 1, k(10, 30));
      spec.secret = spec.lo + ((spec.secret - spec.lo) % span);
      spec.hi = spec.lo + span - 1;
      spec.budget = Math.ceil(Math.log2(span + 1)) + (spec.budget - old) + k(2, 1);
    },
    judge(jr, spec, ph) {
      return ph(['Guess the secret word in as few tries as you can.', 'Find the hidden word by guessing.'], {}, 'this page hides a number, not a word.', ['secret word', 'hidden word']);
    },
    base(spec) {
      return { text: '', guesses: [], note: null, focus: false };
    },
    start(spec, m, mode, rng) {
      if (mode === 'partial') return along(m, spec, rng.int(1, 2) * 2);
      // A wasted guess at one end of the range (still a valid guess), and its number left in the field.
      return { ...makeGuess({ ...m, text: String(spec.secret === spec.lo ? spec.hi : spec.lo) }, spec), text: String(spec.secret === spec.hi ? spec.lo : spec.hi) };
    },
    tolerance(spec) {
      return { tau: 0, sigma: Math.max(1, (spec.hi - spec.lo + 1) / 8) };
    },
    error(model, spec) {
      if (solvedGuess(model)) return 0;
      const g = model.guesses;
      return g.length ? Math.abs(g[g.length - 1].value - spec.secret) : spec.hi - spec.lo + 2;
    },
    locked(model, spec) {
      return solvedGuess(model) || model.guesses.length >= spec.budget;
    },
    left(model, spec) {
      return spec.budget - model.guesses.length;
    },
    ended(model, spec) {
      return !solvedGuess(model) && model.guesses.length >= spec.budget ? 'out-of-guesses' : null;
    },
    instruction(spec, rng) {
      return say(rng, spec, ['Guess the number between {lo} and {hi}.', 'Find the hidden number ({lo}–{hi}) in {b} guesses or fewer.',
        'Guess the secret number from {lo} to {hi}.', 'Use the higher/lower hints to find the number between {lo} and {hi}.',
        'Find the mystery number; it is somewhere from {lo} to {hi}.', 'Figure out the hidden number ({lo} to {hi}) with as few guesses as you can.',
        'The range is {lo}–{hi}. Keep guessing until you find the secret.',
        'Higher/lower hints guide you to the number in {lo}–{hi}.',
        'Start in {lo}–{hi} and narrow it down to the secret number.',
        'Your target is a secret integer in {lo}–{hi}. Find it.',
        'You have {b} guesses to identify the secret from {lo} to {hi}.'],
      { lo: spec.lo, hi: spec.hi, b: spec.budget }, { terse: `guess ${spec.lo}-${spec.hi}` });
    },
    plan(model, spec) {
      if (lockedOf(model, spec)) return null;
      const [lo, hi] = guessInterval(model, spec);
      if (lo > hi) return null;
      const mid = String(Math.floor((lo + hi) / 2));
      if (model.text.trim() !== mid) return { type: [{ field: 'answer' }, mid] };
      return spec.route === 'enter' && model.focus ? { key: 'Enter' } : { click: { button: 'guess' } };
    },
    simulate(model, spec, step) {
      if (step.type) return { ...model, text: step.type[1], note: null, focus: true };
      if (step.key === 'Enter') return makeGuess(model, spec);
      if (step.click.button === 'guess') return { ...makeGuess(model, spec), focus: false };
    },
    target(spec) {
      return { text: '', guesses: [{ value: spec.secret, verdict: 'correct' }], note: null, focus: false };
    },
    facts(model, spec) {
      const last = model.guesses[model.guesses.length - 1];
      if (!last || last.verdict !== 'correct') return [];
      return [{ label: 'Secret number', value: String(last.value).replace('-', '−'), labels: ['The number', 'Correct number', 'Hidden number'] },
        { label: 'Guesses left', value: String(spec.budget - model.guesses.length), labels: ['Guesses remaining'] }];
    },
    silent(next, prev, spec, rng, pick) {
      if (next.guesses.length <= prev.guesses.length) return null;
      return pick({ ...next, guesses: prev.guesses, note: null, text: String(next.guesses[next.guesses.length - 1].value) });
    },
  });
  Object.assign(fam.helpers, { makeGuess });
})();
