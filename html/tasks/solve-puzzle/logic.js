/*
 * solve-puzzle: small reasoning puzzles answered by typing or clicking. MiniWoB counterparts:
 * simple-arithmetic, simple-algebra, odd-or-even, guess-number, generate-number, hot-cold, tic-tac-toe;
 * compute and fix-error go beyond MiniWoB (computing from page data, repairing a form).
 * inputs ['pointer', 'keyboard']: answers are typed into text fields (Enter also submits a guess).
 *
 * scenarios
 *   arithmetic   compute "a op b" and type the result. level 'digit' (MiniWoB: a, b in 0..9, op + - x) or
 *                'multi' (two-digit + and -, times tables up to 12, exact division); ood: three-digit + / -,
 *                two-digit x one-digit
 *   algebra      solve a linear equation for x and type x. forms 'x+d', 'd+x', 'x-d', 'd-x' (MiniWoB:
 *                d in 0..9, right side 0..99, x may be negative), 'ax' (a in 2..9) and 'ax+b' (ood: a up to 15)
 *   odd-even     3-6 numbers (ood 7-10), each with an Odd and an Even button; mark every number
 *   guess        guess-number: a hidden integer in [lo, hi] (span 10..100, ood 200..1000); type a guess and
 *                press Guess (or Enter); the page answers "higher" / "lower" / "correct". At most spec.budget
 *                guesses (binary search needs ceil(log2(span + 1)); the budget adds 0-2 spare, +1 for a
 *                wrong / partial start). The episode ends when the budget is used up (ended -> 'out-of-guesses')
 *   generate     generate-number: a Generate button shows a random number 0..10 per press (the sequence is
 *                spec.draws, consumed in order); finish once the shown number satisfies the condition:
 *                kind 'less' (< k), 'greater' (> k), 'odd', 'even' (MiniWoB) or 'between' (a..b inclusive)
 *   hot-cold     find a hidden spot on a W x H board (W = 100 units, H 50..75) by clicking: each click
 *                reports a temperature band (HOT < r, WARM < 2.5r, COLD < 8r, else ICE COLD, as in MiniWoB)
 *                and whether it is warmer or colder than the previous click. At most spec.budget clicks
 *                (ended -> 'out-of-clicks' once used up while the last click is not HOT). ood: r = 3
 *   tictactoe    play X against a seeded deterministic opponent O (level 'casual' = MiniWoB's policy: a
 *                random move with probability 1 - skill (0.35..0.75), else win if possible, else block,
 *                else random; level 'expert': a minimax-optimal move with probability skill (0.93..1); O
 *                opens half the time). spec.best is the best result X can force against THIS opponent
 *                (exact search; 'win' or 'draw'). The episode ends when the game is over ('game-over')
 *   compute      compute from page data. mode 'sum' (the total of a money column of an invoice / expense
 *                report, all rows or only the rows of one category), 'count' (how many rows have a given
 *                status), 'pick' (3-6 offer cards, ood 7-9; choose the cheapest / most expensive / best rated
 *                / fastest one with its Select button; choosing is reversible)
 *   fix-error    a form (4-6 fields, ood 7-9) after a failed save: one field shows an inline error (invalid
 *                email, ZIP with a letter or an extra digit, phone with a digit missing, quantity out of range,
 *                confirmation that does not match, date in the wrong format, empty required field, URL
 *                without a scheme). Correct that field without breaking the others; fields re-validate live.
 *
 * spec   { scenario, isplit, csplit, ood, startMode, ... }
 *   arithmetic   level, a, b, op ('+' | '-' | '*' | '/'), expr ('7 * 3'), answer
 *   algebra      form, expr ('x - 4 = 17', '3x + 2 = 20', ASCII '-' and no '*'), answer
 *   odd-even     numbers: [int]
 *   guess        lo, hi, secret, budget, route ('button' | 'enter')
 *   generate     kind, k (less / greater) | a, b (between), draws: [24 ints in 0..10], initial? (trait)
 *   hot-cold     W, H, radius (r, the HOT tolerance), target: [u, v], budget
 *   tictactoe    oFirst, level ('casual' | 'expert'), skill, oppSeed, best ('win' | 'draw')
 *   compute      mode, title, cols: [names], rows: [[cells]], money (column index), cat? (sum: category
 *                filter), status? (count), answer (number); pick: crit ('cheapest' | 'priciest' | 'rated' |
 *                'fastest'), cards: [{ name, price, rating, days }], target
 *   fix-error    title, fields: [{ label, kind, value (initial), fix (target), msg, aliases }], bad (index)
 * model
 *   arithmetic / algebra / compute (sum, count)   { answer: '' }
 *   compute (pick)          { chosen: null | card index }
 *   odd-even                { marks: [null | 'odd' | 'even'] }
 *   guess                   { text: '', guesses: [{ value, verdict }], note, focus (field focused; mirrored) }
 *   generate                { value: null | int, presses }
 *   hot-cold                { probes: [[u, v], ...] }
 *   tictactoe               { board: [9 x '' | 'X' | 'O'], result: null | 'win' | 'draw' | 'loss' }
 *   fix-error               { values: [string per field] }
 * error (task units; tau 0 except hot-cold and compute sums)
 *   arithmetic / algebra / compute sum, count   |typed - answer| for a number (unicode minus, $ and
 *                          thousands separators accepted), else |answer| + 10; sigma 1 (sums: half the mean
 *                          row amount; tau 0.004 for cents)
 *   compute pick           none chosen 1, else rank of the chosen card by the criterion / (n - 1)
 *   odd-even               fraction of numbers not marked correctly; sigma 0.3
 *   guess                  0 after a correct guess, else |last guess - secret|, span + 1 with no guess
 *   generate               how far the shown number is from satisfying the condition (no number: worst + 1)
 *   hot-cold               distance from the last click to the spot; tau = r, sigma 2r
 *   tictactoe              win 0; draw 0 if spec.best is 'draw', else 0.5; loss 1; game in progress:
 *                          1 - 0.05 * X moves while spec.best is still reachable, else 1. sigma 0.5
 *   fix-error              invalid fields count 1 each, valid fields changed away from their original value
 *                          0.5 each (the bad field counts only while invalid). sigma 0.5
 * start modes: off; partial (first digits typed, half the numbers marked, a few guesses / clicks / moves
 *   made along the oracle path, a subtotal typed); wrong (an off-by-one or sign-flipped answer, numbers
 *   marked wrongly, a wasted guess, the second-best card chosen, a different invalid value in the bad
 *   field); solved; scene (generate only: a number that does not satisfy the condition is already showing;
 *   the other scenarios start like 'off'; previews / eval only).
 * Opt-in trait: traits.generate { initial: true } puts spec.initial (a wrong number near the condition, from
 *   rng.fork('initial')) into the generate model's start value (model.value) in every start mode; without it
 *   the display starts empty (value null).
 *
 * Round 2 hooks (optional, pure; see the html/kit/env.js header)
 *   facts(model, spec)       what the page shows at the end: arithmetic / algebra "Answer" (the typed text), compute "Total" /
 *                            "Count" / "Selected offer" + "Price", odd-even "Marked odd" / "Marked even", guess "Secret
 *                            number" + "Guesses left" (the confirmation and the footer), generate "Number shown", hot-cold
 *                            "Temperature" (HOT) + "Clicks left", tictactoe "Result" (the status line) + "X marks", fix-error
 *                            the fixed field's value + "Form status" (the banner). [] while the thing is not shown yet.
 *                            The task's facts() lists the labels and values of the solved page while nothing is shown yet, so the
 *                            report request names them from the start. Label paraphrases go in labels, aliases are other spellings
 *                            of the value (a value with a comma also accepts the part before it).
 *   silent(next, prev, spec, rng)   an update that did not take: typed answers lose their last character, odd-even a mark just
 *                            set is not kept, guess / generate / hot-cold the last guess / press / click is not recorded (the
 *                            number stays in the field; a repeated press consumes the same draw), tictactoe the move does not
 *                            register (board as before), compute pick the neighbouring offer is chosen, fix-error the field
 *                            shows its truncated text or its old value. null when the result would still be right.
 *   retarget(spec, model, rng)   a new question on the same page: arithmetic / algebra a new problem of the same size,
 *                            generate a new condition that a draw within the next six presses satisfies, hot-cold a new hidden
 *                            spot (past clicks are re-judged against it; the budget is extended to 20 more clicks), compute sum
 *                            another category, count another status, pick another criterion. null for odd-even, guess,
 *                            tictactoe and fix-error (the history or the form is the question) and in judge episodes.
 *   judgeModes impossible only (every scenario; spec.judge = { mode, what, templates, vars, message }; the page starts solved;
 *                            what: [the missing thing as the goal names it, other short ways to say it], which the reply must name):
 *                            the instruction names something the page does not have: a second problem / equation / board, a
 *                            number not listed (odd-even), a hidden word instead of a number (guess), a number above the
 *                            generator's range, a first-move win (tictactoe), a table column or offer attribute that is
 *                            absent (compute), a form field that is absent (fix-error). No ambiguous mode (nothing on
 *                            these pages can be named two ways) and no confirm (nothing is irreversible).
 *
 * Levels (opts.level easy | medium, normal unchanged): the sampled episode is eased in place from
 * rng.fork('level') (levelAdjust): arithmetic: digits 0..5 and + / - on easy, digits only on medium; algebra: x + d
 * on easy, no ax + b on medium; odd-even: 3 / 4 numbers; guess: a span of 10 / 30 and more spare guesses;
 * generate: 'less than 7-9' on easy and a satisfying draw within the first 3 presses; hot-cold: a 1.5x / 1.25x
 * spot and more clicks; tictactoe: a weaker (random) opponent; compute: 3 / 4 cards, 3-4 rows; fix-error:
 * the bad field plus 1 / 2 others.
 *
 * plan targets (the widget's locate() maps them to viewport px)
 *   { field: 'answer' }          the answer field (arithmetic, algebra, guess, compute)
 *   { button: 'guess' | 'generate' }
 *   { mark: [i, 'odd' | 'even'] } the Odd / Even button of number i
 *   { cell: i }                  tic-tac-toe cell 0..8 (row-major)
 *   { point: [u, v] }            a board point in board units (hot-cold)
 *   { card: i }                  the Select button of offer card i (compute pick)
 *   { ffield: i }                form field i (fix-error)
 * plan steps: { type: [{ field }, text] } then (guess) { click: { button: 'guess' } } or { key: 'Enter' }
 *   (route 'enter', while the field has focus); { click } otherwise; fix-error { type: [{ ffield }, value] }.
 * Oracles: guess = binary search on the feedback history; hot-cold = the feasible region is the board
 * cut by one half-plane per warmer/colder answer; the next click mirrors the last click across a line that
 * splits the region evenly; tictactoe = game-tree search against the seeded opponent policy.
 *
 * Files (files: [...] below, loaded in order after this one): scenarios/<scenario>.js, one env.scenario('solve-puzzle', {...}) per scenario
 * with its sampler, model, error, oracle, instruction and round-2 hooks (hook list above the dispatch section). This file
 * holds the header, helpers the scenarios share (lib) and the dispatch.
 *
 * Self-tests live in selftest.js, loaded only by the checker and node tests.
 * Helpers (widget API, env.taskDef.helpers; pure, shared with scoring):
 *   makeGuess(model, spec) -> model after checking the typed guess
 *   locked(model, spec) -> whether the page takes no more input
 *   left(model, spec) -> guesses / clicks remaining, or null
 *   generate(model, spec) -> model after consuming the next draw
 *   probe(model, spec, [u, v]) -> model after clicking the board
 *   feedback(spec, probes, i) -> temperature and trend of probe i
 *   play(model, spec, cell) -> model after X's move and the opponent's response
 *   winLine(board) -> winning cell indices, or null
 *   fieldValid(spec, i, values) -> whether form field i is valid
 */
(function () {
  'use strict';

  const C = env.content;
  const I = env.instruct;

  // ---------------------------------------------------------------- shared

  function hashUnit(s) {
    let h = 0x811c9dc5;
    for (const ch of String(s)) {
      h ^= ch.codePointAt(0);
      h = Math.imul(h, 0x01000193);
    }
    h ^= h >>> 15;
    h = Math.imul(h, 0x2c1b3c6d);
    h ^= h >>> 12;
    return (h >>> 0) / 4294967296;
  }

  function parseNumber(text) {
    const t = String(text ?? '').trim().replace(/^\$\s*/, '').replace(/(\d),(?=\d{3}\b)/g, '$1');
    const m = /^([-−]?)(\d{1,9})(\.\d{1,2})?$/.exec(t);
    if (!m) return null;
    const v = Number(m[2] + (m[3] || ''));
    return m[1] ? -v : v;
  }

  const { dist } = env.util;
  const round = (x, k = 1e4) => Math.round(x * k) / k;

  // ---------------------------------------------------------------- arithmetic / algebra

  function answerError(model, spec) {
    const v = parseNumber(model.answer);
    return v === null ? Math.abs(spec.answer) + 10 : Math.abs(v - spec.answer);
  }

  // ---------------------------------------------------------------- odd-even

  const isOdd = (n) => Math.abs(n % 2) === 1;
  const parity = (n) => (isOdd(n) ? 'odd' : 'even');

  // ---------------------------------------------------------------- guess

  // ---------------------------------------------------------------- generate

  // ---------------------------------------------------------------- hot-cold

  // ---------------------------------------------------------------- tic-tac-toe


  // ---------------------------------------------------------------- compute (from page data)

  // ---------------------------------------------------------------- fix-error (a form with one invalid field)

  // ---------------------------------------------------------------- dispatch


  // ---------------------------------------------------------------- difficulty ladder

  // ================================================================ dispatch: one object per scenario
  //
  // Each scenarios/<scenario>.js registers env.scenario('solve-puzzle', {name, ...}); logic.js calls its hooks:
  //   sample(rng, base, opts)  the scenario's spec fields (base: scenario, isplit, csplit, ood, startMode)
  //   level(spec, r, { lv, easy, k })  eases the sampled spec in place (see Levels in the header; r: the 'level' fork;
  //     k(easy value, medium value))
  //   judge(jr, spec, ph)  the 'impossible' judge record: ph(templates, vars, message, what)
  //   base(spec)  the model of an 'off' start; start(spec, m, mode, rng)  the partial / wrong start (default: m);
  //     scene(spec, m, rng)  the 'scene' start (default: m)
  //   tolerance(spec), error(model, spec), instruction(spec, rng), plan(model, spec)
  //   simulate(model, spec, step)  the model after one plan step (undefined: not a step of this scenario)
  // optional: locked(model, spec) (the page takes no more input), left(model, spec) (guesses / clicks left), ended(model, spec),
  //   target(spec) (the target state, when the oracle cannot reach it), facts(model, spec), silent(next, prev, spec, rng, pick),
  //   retarget(spec, model, rng) (a new spec, checked by the dispatch).

  const V = env.scenariosOf('solve-puzzle');

  const txt = (s) => String(s ?? '').trim();

  // opts.level 'easy' (lv 1) / 'medium' (lv 0.5): the sampled episode is eased in place (smaller numbers, fewer
  // rows / cards / fields / numbers, a narrower guess range with spare guesses, a bigger hot-cold spot, a weaker
  // opponent), drawing only from the 'level' fork, so normal samples exactly what it always did.
  function levelAdjust(spec, lv, r) {
    const easy = lv >= 1;
    V[spec.scenario].level(spec, r, { lv, easy, k: (e, m) => (easy ? e : m) });
  }

  // ---------------------------------------------------------------- round 2: judge, facts, silent, retarget

  function judgeOf(jr, spec) {
    // what: the missing thing as the instruction names it, with other short ways to say it (the reply's missing item)
    const ph = (templates, vars, message, what) => ({ mode: 'impossible', what, templates, vars, message: `I can't do that: ${message}` });
    return V[spec.scenario].judge(jr, spec, ph);
  }

  function judgeInstruction(spec, rng) {
    return I.phrase(rng, spec.judge.templates, spec.judge.vars, spec.isplit);
  }

  function factsOf(model, spec) {
    return V[spec.scenario].facts(model, spec);
  }

  // A silent failure of the update that produced `next` (null = none fits).
  function silentOf(next, prev, spec, rng) {
    const bad = (m) => errorOf(m, spec) > toleranceOf(spec).tau + 1e-9;
    const pick = (m) => (m && bad(m) && JSON.stringify(m) !== JSON.stringify(next) ? m : null);
    return V[spec.scenario].silent(next, prev, spec, rng, pick);
  }

  function retargetOf(spec, model, rng) {
    if (spec.judge) return null;
    const out = V[spec.scenario].retarget ? V[spec.scenario].retarget(spec, model, rng) : null;
    return out && errorOf(model, out) > toleranceOf(out).tau + 1e-9 ? out : null;
  }

  // ---------------------------------------------------------------- typed answers (arithmetic, algebra, compute sum / count)

  // partial: the first digits of the answer; wrong: off by one or ten (algebra: sometimes the sign flipped)
  function typedStart(spec, m, mode, rng) {
    const ans = spec.answer;
    if (mode === 'partial') {
      const t = String(ans);
      m.answer = t.length > 1 ? t.slice(0, Math.ceil(t.length / 2)) : '';
      if (parseNumber(m.answer) === ans) m.answer = '';
    } else {
      const off = rng.pick([1, -1, 10, -10]);
      m.answer = String(spec.scenario === 'algebra' && ans !== 0 && rng.bool(0.4) ? -ans : Math.round((ans + off) * 100) / 100);
    }
    return m;
  }

  function typedPlan(model, spec, want = String(spec.answer)) {
    if (errorOf(model, spec) <= toleranceOf(spec).tau + 1e-9) return null;
    return { type: [{ field: 'answer' }, want] };
  }

  // the answer loses its last character
  function typedSilent(next, pick) {
    const t = String(next.answer ?? '');
    return t ? pick({ ...next, answer: t.slice(0, -1) }) : null;
  }

  // ---------------------------------------------------------------- model, error, plan

  // Follow the oracle for k steps (partial starts that are on the golden path).
  function along(model, spec, k) {
    let m = model;
    for (let i = 0; i < k; i++) {
      const step = planOf(m, spec);
      if (!step) break;
      const n = simulate(m, spec, step);
      if (errorOf(n, spec) <= toleranceOf(spec).tau + 1e-9 || endedOf(n, spec)) break;
      m = n;
    }
    return m;
  }

  function initModel(spec, rng) {
    const v = V[spec.scenario];
    const m = v.base(spec);
    const mode = spec.startMode;
    rng = rng || new env.Rng(11);
    // scene: the reference screen's state. Only generate has one (a number already showing, not yet right).
    if (mode === 'scene') return v.scene ? v.scene(spec, m, rng) : m;
    if (mode !== 'partial' && mode !== 'wrong') return m;
    return v.start ? v.start(spec, m, mode, rng) : m;
  }

  const lockedOf = (model, spec) => (V[spec.scenario].locked ? V[spec.scenario].locked(model, spec) : false);

  function leftOf(model, spec) {
    const v = V[spec.scenario];
    return v.left ? v.left(model, spec) : null;
  }

  const errorOf = (model, spec) => V[spec.scenario].error(model, spec);
  const toleranceOf = (spec) => V[spec.scenario].tolerance(spec);

  // ---------------------------------------------------------------- instructions

  const instructionOf = (spec, rng) => V[spec.scenario].instruction(spec, rng);

  // ---------------------------------------------------------------- plan

  const planOf = (model, spec) => V[spec.scenario].plan(model, spec);

  // Model-space effect of one plan step, as the base widget implements it (selftest.js, solve).
  function simulate(model, spec, step) {
    const next = V[spec.scenario].simulate(model, spec, step);
    if (next === undefined) throw new Error(`cannot simulate ${JSON.stringify(step)}`);
    return next;
  }

  function solveOf(spec, model) {
    let m = model;
    for (let k = 0; k < 40; k++) {
      if (errorOf(m, spec) <= toleranceOf(spec).tau + 1e-9) return m;
      const step = planOf(m, spec);
      if (!step) break;
      m = simulate(m, spec, step);
    }
    // Fallback (e.g. a budget already spent): the target state itself.
    const v = V[spec.scenario];
    return v.target ? v.target(spec) : m;
  }

  function endedOf(model, spec) {
    const v = V[spec.scenario];
    return v.ended ? v.ended(model, spec) : null;
  }

  // ---------------------------------------------------------------- round 2: judge, facts, silent, retarget

  function judgeInstruction(spec, rng) {
    return I.phrase(rng, spec.judge.templates, spec.judge.vars, spec.isplit);
  }

  // Follow the oracle for k steps (partial starts that are on the golden path).
  function along(model, spec, k) {
    let m = model;
    for (let i = 0; i < k; i++) {
      const step = planOf(m, spec);
      if (!step) break;
      const n = simulate(m, spec, step);
      if (errorOf(n, spec) <= toleranceOf(spec).tau + 1e-9 || endedOf(n, spec)) break;
      m = n;
    }
    return m;
  }

  // ---------------------------------------------------------------- instructions

  const say = (rng, spec, templates, vars = {}, extra = {}) => {
    const core = I.fill(I.pick(rng, templates, spec.isplit), vars).replace(/\s+/g, ' ').trim();
    const question = /^(What|Which|How|Who|Where|When)\b/.test(core);
    return I.say(rng, core, { isplit: spec.isplit, ...(question ? { registers: { polite: 0 } } : {}), ...extra });
  };

  // ---------------------------------------------------------------- plan

  env.task({
    name: 'solve-puzzle',
    scenarios: ['arithmetic', 'algebra', 'odd-even', 'guess', 'generate', 'hot-cold', 'tictactoe', 'compute', 'fix-error'],
    files: ['scenarios/arithmetic.js', 'scenarios/algebra.js', 'scenarios/odd-even.js', 'scenarios/guess.js', 'scenarios/generate.js',
      'scenarios/hot-cold.js', 'scenarios/tictactoe.js', 'scenarios/compute.js', 'scenarios/fix-error.js'],
    startModes: ['off', 'partial', 'wrong', 'solved', 'scene'],
    judgeModes: ['impossible'],
    inputs: ['pointer', 'keyboard'],

    // Helpers the scenario files share (they read env.taskOf('solve-puzzle').lib).
    lib: {
      along, answerError, C, dist, errorOf, hashUnit, I, isOdd, lockedOf, parity, parseNumber, round, say, txt,
      simulate, typedPlan, typedSilent, typedStart
    },

    // Widget API (the scenario files add their own helpers).
    helpers: { locked: lockedOf, left: leftOf },

    sample(rng, opts) {
      const list = opts.scenarios && opts.scenarios.length ? opts.scenarios : this.scenarios;
      const scenario = opts.scenario || rng.pick(list);
      const base = { scenario, isplit: opts.isplit || 'train', csplit: opts.csplit || 'train', ood: !!opts.ood, startMode: opts.startMode || 'off' };
      const spec = { ...base, ...V[scenario].sample(rng, base, opts) };
      const lv = opts.level === 'easy' ? 1 : opts.level === 'medium' ? 0.5 : 0;
      if (lv) levelAdjust(spec, lv, rng.fork('level'));
      if (opts.judge === 'impossible') spec.judge = judgeOf(rng.fork('judge'), spec);
      return spec;
    },

    // impossible starts solved (nothing to do); the normal start supplies the unscored fields
    init: (spec, rng) => (spec.judge ? solveOf(spec, initModel({ ...spec, judge: undefined, startMode: 'off' }, rng)) : initModel(spec, rng)),
    error: errorOf,
    tolerance: toleranceOf,
    facts: env.util.reportFactsOf(factsOf, solveOf),
    silent: (next, prev, spec, rng) => (spec.judge ? null : silentOf(next, prev, spec, rng)),
    retarget: retargetOf,
    instruction: (spec, rng) => (spec.judge ? judgeInstruction(spec, rng) : instructionOf(spec, rng)),
    plan: planOf,
    solve: solveOf,
    ended: endedOf,

  });
})();
