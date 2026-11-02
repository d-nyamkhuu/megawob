/*
 * solve-puzzle / tictactoe: play X against a seeded opponent.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('solve-puzzle');
  const { along, errorOf, hashUnit, round, say } = fam.lib;

  const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

  const winLine = (b) => LINES.find(([i, j, k]) => b[i] && b[i] === b[j] && b[i] === b[k]) || null;

  const wins = (b, who) => LINES.some(([i, j, k]) => b[i] === who && b[j] === who && b[k] === who);

  const free = (b) => b.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);

  function completing(b, who) {
    for (const c of free(b)) {
      const nb = b.slice();
      nb[c] = who;
      if (wins(nb, who)) return c;
    }
    return -1;
  }

  // The opponent: deterministic in (oppSeed, board). Opening moves are random (as in MiniWoB); later a
  // "smart" move with probability spec.skill: level 'casual' = MiniWoB's win-else-block, level 'expert' =
  // a minimax-optimal move; otherwise a random free cell.
  function oMove(b, spec) {
    const f = free(b);
    const key = `${spec.oppSeed}|${b.map((v) => v || '.').join('')}`;
    const r1 = hashUnit(`${key}|mode`);
    const r2 = hashUnit(`${key}|pick`);
    const pickOf = (xs) => xs[Math.min(xs.length - 1, Math.floor(r2 * xs.length))];
    if (f.length === 9 || r1 >= spec.skill) return pickOf(f);
    if (spec.level === 'expert') {
      const vals = f.map((c) => {
        const nb = b.slice();
        nb[c] = 'O';
        return minimax(nb, 'X', MINIMAX_MEMO);
      });
      const lo = Math.min(...vals);
      return pickOf(f.filter((c, i) => vals[i] === lo));
    }
    const w = completing(b, 'O');
    if (w >= 0) return w;
    const blk = completing(b, 'X');
    if (blk >= 0) return blk;
    return pickOf(f);
  }

  function play(model, spec, cell) {
    if (model.result || model.board[cell]) return model;
    const b = model.board.slice();
    b[cell] = 'X';
    if (wins(b, 'X')) return { board: b, result: 'win' };
    if (!free(b).length) return { board: b, result: 'draw' };
    b[oMove(b, spec)] = 'O';
    if (wins(b, 'O')) return { board: b, result: 'loss' };
    if (!free(b).length) return { board: b, result: 'draw' };
    return { board: b, result: null };
  }

  const VAL = { win: 2, draw: 1, loss: 0 };

  // Best result X can reach from model against the seeded opponent (2 win, 1 draw, 0 loss).
  function exactValue(model, spec, memo = new Map()) {
    if (model.result) return VAL[model.result];
    const key = model.board.join(',');
    if (memo.has(key)) return memo.get(key);
    let best = 0;
    for (const c of free(model.board)) {
      best = Math.max(best, exactValue(play(model, spec, c), spec, memo));
      if (best === 2) break;
    }
    memo.set(key, best);
    return best;
  }

  // Classic minimax value of board with `who` to move (X maximizes): 2 win, 1 draw, 0 loss for X.
  const MINIMAX_MEMO = new Map(); // pure in (board, who): shared across episodes

  function minimax(b, who, memo = MINIMAX_MEMO) {
    if (wins(b, 'X')) return 2;
    if (wins(b, 'O')) return 0;
    const f = free(b);
    if (!f.length) return 1;
    const key = b.join(',') + who;
    if (memo.has(key)) return memo.get(key);
    let v = who === 'X' ? -1 : 3;
    for (const c of f) {
      const nb = b.slice();
      nb[c] = who;
      const w = minimax(nb, who === 'X' ? 'O' : 'X', memo);
      v = who === 'X' ? Math.max(v, w) : Math.min(v, w);
    }
    memo.set(key, v);
    return v;
  }

  function initTictactoe(spec) {
    const board = Array(9).fill('');
    if (spec.oFirst) board[oMove(board, spec)] = 'O';
    return { board, result: null };
  }

  function sampleTictactoe(rng) {
    const level = rng.bool(0.65) ? 'casual' : 'expert';
    const skill = level === 'casual' ? round(rng.float(0.35, 0.75), 100) : rng.pick([1, 1, 0.97, 0.93]);
    const spec = { oFirst: rng.bool(0.5), level, skill, oppSeed: rng.int(1, 2 ** 30) };
    spec.best = exactValue(initTictactoe(spec), spec) === 2 ? 'win' : 'draw';
    return spec;
  }

  const xMoves = (model) => model.board.filter((v) => v === 'X').length;

  env.scenario('solve-puzzle', {
    name: 'tictactoe',
    sample: sampleTictactoe,
    level(spec, r, { k }) {
      spec.level = 'casual';
      spec.skill = round(Math.min(spec.level === 'casual' && spec.skill < 0.8 ? spec.skill : 0.6, k(0.3, 0.5)), 100);
      spec.best = exactValue(initTictactoe(spec), spec) === 2 ? 'win' : 'draw';
    },
    judge(jr, spec, ph) {
      return ph(['Win the game with your very first move.', 'Get three in a row on your first move.'], {}, 'nobody can win a game of tic-tac-toe in a single move.', ['win on the first move', 'win with the first move', 'first move win', 'win in one move', 'win in a single move']);
    },
    base(spec) {
      return initTictactoe(spec);
    },
    start(spec, m, mode, rng) {
      return mode === 'partial' ? along(m, spec, 1) : m;
    },
    tolerance() {
      return { tau: 0, sigma: 0.5, minInitialError: 0.5 };
    },
    error(model, spec) {
      if (model.result === 'win') return 0;
      if (model.result === 'draw') return spec.best === 'draw' ? 0 : 0.5;
      if (model.result === 'loss') return 1;
      return exactValue(model, spec) >= VAL[spec.best] ? 1 - 0.05 * xMoves(model) : 1;
    },
    locked(model, spec) {
      return !!model.result;
    },
    ended(model) {
      return model.result ? 'game-over' : null;
    },
    instruction(spec, rng) {
      return say(rng, spec, ['Play tic-tac-toe as X and win the game (or at least don’t lose).',
        'You are X. Beat the computer at tic-tac-toe, or at least force a draw.',
        'Win this game of tic-tac-toe as X; if a win is impossible, avoid losing.',
        'Play X against the computer and try to win; a draw is fine if you cannot.',
        'Finish the tic-tac-toe game as X without losing, winning if possible.',
        'Take on the computer at noughts and crosses (you are X) and don’t lose.',
        'As X, seek a win at tic-tac-toe; settle for a draw only if you must.',
        'In tic-tac-toe, guide X to a victory, or a draw if no win is possible.',
        'X is your side. Win against the computer if you can; otherwise, draw.',
        'Bring X through the tic-tac-toe game with a win, or failing that, a draw.'], {}, { terse: 'tic-tac-toe: win or draw' });
    },
    plan(model, spec) {
      if (model.result) return null;
      let best = null;
      const memo = new Map();
      for (const c of free(model.board)) {
        const next = play(model, spec, c);
        const v = exactValue(next, spec, memo);
        const nb = model.board.slice();
        nb[c] = 'X';
        const m = minimax(nb, 'O');
        if (!best || v > best.v || (v === best.v && m > best.m)) best = { v, m, c };
      }
      return best ? { click: { cell: best.c } } : null;
    },
    simulate(model, spec, step) {
      if (step.click.cell !== undefined) return play(model, spec, step.click.cell);
    },
    facts(model) {
      if (!model.result) return [];
      return [{ label: 'Result', value: { win: 'You win!', draw: "It's a draw.", loss: 'The computer wins.' }[model.result], labels: ['Outcome', 'Game result'], aliases: [model.result] },
        { label: 'X marks', value: String(xMoves(model)), labels: ['Your moves', 'Moves'] }];
    },
    silent(next, prev, spec, rng, pick) {
      return JSON.stringify(next.board) !== JSON.stringify(prev.board) ? pick({ ...prev }) : null;
    },
  });
  Object.assign(fam.lib, { minimax });
  Object.assign(fam.helpers, { play, winLine });
})();
