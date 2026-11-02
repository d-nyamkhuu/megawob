/* solve-puzzle/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('solve-puzzle', (T) => {
    const { def: fam, lib, helpers } = T;
    const { hashUnit, parseNumber, simulate, genError, minimax, VALID } = lib;
    const { makeGuess, locked: lockedOf, fieldValid } = helpers;
    const errorOf = (model, spec) => fam.error(model, spec);
    const fails = T.fails;
    const modes = ['off', 'partial', 'wrong'];
    T.sweep({ seeds: 60, rng: (seed) => new env.Rng(seed * 7919 + 17), sample: false }, ({ scenario, seed, tag, rng }) => {
      const startMode = modes[seed % 3];
      let spec;
      let model;
      try {
        spec = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode, ood: seed % 5 === 4, isplit: seed % 2 ? 'heldout' : 'train', csplit: seed % 7 === 3 ? 'heldout' : 'train' });
        model = fam.init(spec, rng.fork('init'));
      } catch (e) {
        T.fail(`${tag}: ${e.stack || e}`);
        return;
      }
      const tol = fam.tolerance(spec);
      const e0 = errorOf(model, spec);
      if (startMode === 'off') T.check(e0 > (tol.minInitialError ?? 3 * tol.tau), `${tag}: start error ${e0}`);
      T.check(e0 > tol.tau, `${tag} (${startMode}): starts solved`);
      T.check(!fam.ended(model, spec), `${tag} (${startMode}): starts ended`);
      const text = fam.instruction(spec, rng.fork('i'));
      T.check(!!text, `${tag}: empty instruction`);
      T.check(!/submit/i.test(text), `${tag}: instruction names the end control: ${text}`);
      let m = model;
      let k = 0;
      try {
        for (; k < 40 && errorOf(m, spec) > tol.tau + 1e-9; k++) {
          const step = fam.plan(m, spec);
          if (!step) break;
          // Emulate pixel rounding of clicks on the board.
          if (step.click && step.click.point) step.click.point = step.click.point.map((x) => x + (hashUnit(`${seed}/${k}/${x}`) - 0.5) * 0.2);
          m = simulate(m, spec, step);
          if (fam.ended(m, spec) && errorOf(m, spec) > tol.tau + 1e-9) throw new Error(`ended: ${fam.ended(m, spec)}`);
        }
      } catch (e) {
        T.fail(`${tag} (${startMode}): ${e}`);
      }
      T.check(!(errorOf(m, spec) > tol.tau + 1e-9), `${tag} (${startMode}): plan ends at error ${errorOf(m, spec)} after ${k} steps`);
      T.check(k <= 32, `${tag}: plan took ${k} steps`);
      T.check(!(errorOf(fam.solve(spec, model), spec) > tol.tau + 1e-9), `${tag}: solve() not on target`);
      if (scenario === 'fix-error') {
        const okCount = spec.fields.filter((_, i) => fieldValid(spec, i, spec.fields.map((f) => f.value))).length;
        T.check(okCount === spec.fields.length - 1, `${tag}: ${spec.fields.length - okCount} invalid fields at start`);
        T.check(fieldValid(spec, spec.bad, spec.fields.map((f) => f.fix)), `${tag}: the fix is not valid`);
      }
    });
    // Grading spot checks, in scenario order.
    T.check(!(parseNumber(' -12 ') !== -12 || parseNumber('−3') !== -3 || parseNumber('1.5') !== 1.5 || parseNumber('') !== null || parseNumber('$1,234.50') !== 1234.5), 'parseNumber');
    const checks = {
      guess() {
        const gs = { scenario: 'guess', lo: 0, hi: 9, secret: 6, budget: 4 };
        let gm = makeGuess({ text: '4', guesses: [], note: null }, gs);
        if (gm.guesses[0].verdict !== 'higher' || errorOf(gm, gs) !== 2) fails.push('guess: verdict / error');
        if (makeGuess({ text: '12', guesses: [], note: null }, gs).note !== 'invalid') fails.push('guess: out of range accepted');
        gm = makeGuess({ ...gm, text: '6' }, gs);
        if (errorOf(gm, gs) !== 0 || !lockedOf(gm, gs)) fails.push('guess: correct guess');
      },
      generate() {
        const ge = { scenario: 'generate', kind: 'less', k: 6 };
        if (genError(ge, 5) !== 0 || genError(ge, 6) !== 1 || genError(ge, null) !== 6) fails.push('generate: less error');
      },
      tictactoe() {
        const tt = { scenario: 'tictactoe', best: 'win', skill: 0, oppSeed: 1 };
        if (errorOf({ board: [], result: 'draw' }, tt) !== 0.5 || errorOf({ board: [], result: 'draw' }, { ...tt, best: 'draw' }) !== 0) fails.push('tictactoe: draw grading');
        if (minimax(Array(9).fill(''), 'X') !== 1) fails.push('tictactoe: minimax of the empty board is not a draw');
      },
      'fix-error'() {
        if (!VALID.date('02/29/2024') || VALID.date('13/01/2024') || VALID.email('a@b') || !VALID.phone('(415) 555-0132')) fails.push('validators');
      },
    };
    for (const scenario of fam.scenarios) if (checks[scenario]) checks[scenario]();
  });
})();
