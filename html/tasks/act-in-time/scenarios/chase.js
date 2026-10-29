/*
 * act-in-time / chase: chase-circle.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('act-in-time');
  const I = env.instruct;
  const { chasePos, round2, round3, sec1, secs } = fam.lib;

  const CHASE_TAU = 0.2;
  function sampleChase(rng, beat, o) {
    const A = 1.5;
    const r = round3(o.ood ? rng.float(0.07, 0.085) : rng.float(0.085, 0.12));
    const n = o.ood ? rng.int(13, 16) : rng.int(8, 12);
    const Ax = A / 2 - r - 0.04;
    const Ay = 0.5 - r - 0.04;
    const fx = rng.float(0.55, 0.8);
    const fy = rng.float(0.55, 0.8);
    const ax = [round3(Ax * fx), round3(Ax * (1 - fx))];
    const ay = [round3(Ay * fy), round3(Ay * (1 - fy))];
    let wx = [rng.float(0.35, 0.6), rng.float(0.8, 1.3)];
    let wy = [rng.float(0.35, 0.6), rng.float(0.8, 1.3)];
    const px = [rng.float(0, 2 * Math.PI), rng.float(0, 2 * Math.PI)].map(round3);
    const py = [rng.float(0, 2 * Math.PI), rng.float(0, 2 * Math.PI)].map(round3);
    // Upper bound of the speed (units per beat) for any s; scale time so it equals k * r.
    const bound = Math.hypot(ax[0] * wx[0] + ax[1] * wx[1], ay[0] * wy[0] + ay[1] * wy[1]);
    const k = rng.float(0.9, 1.6);
    const scale = (k * r) / bound;
    wx = wx.map((w) => round3(w * scale));
    wy = wy.map((w) => round3(w * scale));
    const vmax = round3(Math.hypot(ax[0] * wx[0] + ax[1] * wx[1], ay[0] * wy[0] + ay[1] * wy[1]));
    const dur = n * beat;
    const need = Math.round((1 - CHASE_TAU) * dur);
    // traits.orient 'vertical': the same path with x and y swapped, on an upright 1 x A board.
    if (o.orient === 'vertical') return { n, dur, A, orient: 'vertical', r, cx: 0.5, cy: A / 2, ax: ay, ay: ax, wx: wy, wy: wx, px: py, py: px, vmax, need };
    return { n, dur, A, r, cx: A / 2, cy: 0.5, ax, ay, wx, wy, px, py, vmax, need };
  }

  const T_CHASE = ['Keep the mouse pointer inside the moving circle{need}.', 'Follow the moving circle with your mouse{need}.',
    'Track the circle with the pointer and stay inside it{need}.', 'Chase the circle around the board with the cursor{need}.',
    'Hover over the moving circle and keep following it{need}.', 'Keep your cursor on the drifting circle until the round ends{need}.',
    'Use the mouse to stay within the circle as it moves{need}.',
    'Let the cursor follow the circle from inside it{need}.',
    'Guide the cursor to stay within the moving circle{need}.'];

  // Things an impossible goal can name that no episode's page has.
  const ABSENT_SHAPES = ['square', 'triangle', 'diamond', 'star', 'hexagon'];

  env.scenario('act-in-time', {
    name: 'chase',
    sample: sampleChase,
    level(spec, lv, r) {
      // A bigger circle (the path keeps its margin to the board edge) and a looser time requirement.
      spec.r = round3(spec.r * (1 + 0.25 * lv));
      spec.tau = round2(CHASE_TAU + 0.15 * lv);
      spec.need = Math.round((1 - spec.tau) * spec.dur);
    },
    start() {
      return { t: 0, p: null, inside: 0 };
    },
    error: (model, spec) => Math.max(0, 1 - model.inside / spec.dur),
    endedBy(model, spec) {
      const t = model.t;
      return t >= spec.dur - 1e-9 ? 'time-up' : null;
    },
    tolerance(spec) {
      return { tau: spec.tau === undefined ? CHASE_TAU : spec.tau, sigma: 0.3, minInitialError: 0.8 };
    },
    tickBy(model, spec, dt, t) {
      let inside = model.inside;
      if (t <= spec.dur + 1e-9 && model.p) {
        const c = chasePos(spec, t);
        if (Math.hypot(model.p[0] - c[0], model.p[1] - c[1]) <= spec.r) inside += dt;
      }
      return { ...model, t, inside };
    },
    plan(model, spec) {
      const t = model.t;
      if (t >= spec.dur) return null;
      return { move: { point: chasePos(spec, t + spec.beat / 2).map((v) => round3(v)) } };
    },
    solveBy(spec, model, m) {
      return { ...m, inside: spec.dur };
    },
    phrase(spec, rng, pick, say) {
      const need = I.tol(rng, rng.pick([` for at least ${secs(spec.need)} of the ${secs(spec.dur)} seconds`, ` (at least ${secs(spec.need)} s inside)`]), 0.6);
      return say(I.fill(pick(T_CHASE), { need }), { terse: 'follow the circle' });
    },
    judgeAsk(jr, spec, mk, cant) {
      const sh = jr.pick(ABSENT_SHAPES);
      return mk([sh, `${sh} on the board`], ['Keep the mouse pointer inside the moving {sh}.', 'Follow the moving {sh} with your mouse for the whole round.',
        'Track the {sh} with the pointer and stay inside it.', 'Chase the {sh} around the board with the cursor.'], { sh }, cant(`there is no ${sh} on the board, only a circle`));
    },
    factRows(model, spec, f) {
      return [f('Time inside', `${sec1(model.inside)} s`, ['Time in the circle', 'Inside'], [sec1(model.inside), `${sec1(model.inside)} seconds`]),
      f('Time left', `${sec1(Math.max(0, spec.dur - model.t))} s`, ['Remaining time'], [sec1(Math.max(0, spec.dur - model.t)), `${sec1(Math.max(0, spec.dur - model.t))} seconds`])];
    },
  });
})();
