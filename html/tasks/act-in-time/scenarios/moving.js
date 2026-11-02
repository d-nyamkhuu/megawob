/*
 * act-in-time / moving: moving-items.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('act-in-time');
  const I = env.instruct;
  const { COLORS, itemAt, itemLeave, itemPos, itemX, round3, snap } = fam.lib;

  const SHAPES = ['circle', 'square', 'diamond'];

  function clickable(spec, i, t) {
    const x = itemX(spec, i, t);
    return x >= 1.2 * spec.r && x <= spec.A - 1.2 * spec.r;
  }

  function nextTarget(spec, hits, t) {
    let best = null;
    for (let i = 0; i < spec.items.length; i++) {
      if (!spec.items[i].target || hits.includes(i) || !clickable(spec, i, t)) continue;
      if (best === null || itemLeave(spec, i) < itemLeave(spec, best)) best = i;
    }
    return best;
  }

  function sampleMoving(rng, beat, o) {
    const A = 1.6;
    // traits.moving (opt-in, reference fidelity): { shapes: [..], items: n, targets: n, visible: true }; absent
    // keys keep the default draws exactly.
    const T = (o.traits && o.traits.moving) || {};
    const pool = T.shapes || SHAPES;
    const names = rng.sample(Object.keys(COLORS), 3);
    const colors = Object.fromEntries(names.map((c) => [c, COLORS[c]]));
    for (let tries = 0; tries < 300; tries++) {
      const r = round3(rng.float(0.06, 0.075));
      const L = 4;
      const lanes = [...Array(L).keys()].map((i) => ({
        y: round3((i + 0.5) / L), dir: rng.bool() ? 1 : -1, v: round3(rng.float(0.17, 0.26)),
      }));
      const n = T.items || (o.ood ? rng.int(12, 14) : rng.int(8, 11));
      const nT = T.targets || (o.ood ? rng.int(5, 6) : rng.int(3, 5));
      const roles = rng.shuffle([...Array(n).keys()].map((i) => i < nT));
      const items = roles.map((target) => ({
        lane: rng.int(0, L - 1),
        t0: snap(rng.float(-4, o.ood ? 9 : 7) * beat),
        color: target ? names[0] : rng.pick(names.slice(1)),
        shape: rng.pick(pool),
        target,
      }));
      if (T.visible) {
        // Every shape already on the board at t = 0, spread over its lane with room for two shapes between
        // neighbours (they share the lane's speed, so the spacing holds).
        const vr = rng.fork('visible');
        vr.shuffle(items.map((_, i) => i)).forEach((idx, k) => { items[idx].lane = k % L; });
        for (let l = 0; l < L; l++) {
          const mine = vr.shuffle(items.filter((it) => it.lane === l));
          const lo = 0.15;
          const slot = (A - 2 * lo) / mine.length;
          const jit = Math.max(0, (slot - (2 * r + 0.1)) / 2);
          mine.forEach((it, j) => {
            const x0 = lo + (j + 0.5) * slot + vr.float(-1, 1) * jit;
            const ln = lanes[l];
            it.t0 = snap((-(ln.dir > 0 ? x0 + r : A + r - x0) * beat) / ln.v);
          });
        }
      } else for (let l = 0; l < L; l++) {
        const mine = items.filter((it) => it.lane === l).sort((a, b) => a.t0 - b.t0);
        const gap = Math.ceil((((2 * r + 0.1) / lanes[l].v) * beat) / 50) * 50;
        for (let j = 1; j < mine.length; j++) mine[j].t0 = Math.max(mine[j].t0, mine[j - 1].t0 + gap);
      }
      const spec = { A, r, lanes, items, color: names[0], colors, nTargets: nT, beat };
      spec.end = Math.max(...items.map((_, i) => itemLeave(spec, i)));
      if (!items.some((_, i) => itemPos(spec, i, 0))) continue;
      // Feasible for the plan, also when one beat in the first four is lost (an overlay dismissed).
      if ([-1, 0, 1, 2, 3].some((skip) => simulateMoving(spec, skip) === null)) continue;
      delete spec.beat;
      // traits.orient 'vertical': the feasible horizontal schedule transposed (hit tests are symmetric in x and y).
      if (o.orient === 'vertical') return { ...spec, lanes: lanes.map(({ y, dir, v }) => ({ x: y, dir, v })), end: Math.round(spec.end), orient: 'vertical' };
      return { ...spec, end: Math.round(spec.end) };
    }
    throw new Error('act-in-time moving: no feasible schedule');
  }

  function simulateMoving(spec, skip = -1) {
    const hits = [];
    for (let k = 0; k < 28; k++) {
      const t = k * spec.beat;
      for (let i = 0; i < spec.items.length; i++) {
        if (spec.items[i].target && !hits.includes(i) && itemLeave(spec, i) <= t) return null;
      }
      if (hits.length === spec.nTargets) return k;
      if (k === skip) continue;
      const i = nextTarget(spec, hits, t);
      if (i === null) continue;
      if (itemAt(spec, t, itemPos(spec, i, t)) !== i) return null;
      hits.push(i);
    }
    return null;
  }

  const movingWrong = (model, spec) => model.hits.filter((i) => !spec.items[i].target).length;

  const T_MOVING = ['Click every {c} shape before it leaves the board.', 'Catch all the {c} shapes: click each one before it slides off.',
    'Click each {c} item as it moves past, and nothing else.', 'Tap all {c} shapes on the conveyor before they disappear.',
    'Only the {c} shapes count: click every one of them.', 'Pick off every {c} shape while it is on the board.',
    '{c} only: click them all before they leave the board.', 'Give each {c} shape a click before it goes. No others.',
    'On the board, click all shapes in {c} and no others.'];

  // The greedy one-per-beat plan from state (hits, t), losing the beat `skip` (simulateMoving, but from a live state).
  function movingFeasibleFrom(spec, hits, t, skip) {
    const h = hits.slice();
    const got = () => h.filter((i) => spec.items[i].target).length;
    for (let k = 0; k < 28; k++) {
      const tt = t + k * spec.beat;
      for (let i = 0; i < spec.items.length; i++) {
        if (spec.items[i].target && !h.includes(i) && itemLeave(spec, i) <= tt) return false;
      }
      if (got() === spec.nTargets) return true;
      if (k === skip) continue;
      const i = nextTarget(spec, h, tt);
      if (i === null) continue;
      if (itemAt(spec, tt, itemPos(spec, i, tt)) !== i) return false;
      h.push(i);
    }
    return false;
  }

  env.scenario('act-in-time', {
    name: 'moving',
    sample: sampleMoving,
    level(spec, lv, r, keep) {
      // Fewer targets and distractors; a subset of a feasible schedule stays feasible, but check anyway.
      const nT = keep(3, 4);
      const idx = spec.items.map((_, i) => i);
      const tg = r.shuffle(idx.filter((i) => spec.items[i].target)).slice(0, nT);
      const ds = r.shuffle(idx.filter((i) => !spec.items[i].target)).slice(0, keep(1, 2));
      const kept = new Set(tg.concat(ds));
      const items = spec.items.filter((_, i) => kept.has(i));
      const trial = { ...spec, items, nTargets: tg.length };
      trial.end = Math.round(Math.max(...items.map((_, i) => itemLeave(trial, i))));
      if ([-1, 0, 1, 2, 3].every((skip) => simulateMoving(trial, skip) !== null)) Object.assign(spec, { items, nTargets: tg.length, end: trial.end });
    },
    start(spec) {
      const mode = spec.startMode;
      const m = { t: 0, hits: [], misses: 0 };
      if (mode === 'partial') {
        const first = spec.items.map((_, i) => i).filter((i) => spec.items[i].target).sort((a, b) => itemLeave(spec, a) - itemLeave(spec, b))[0];
        m.hits = [first];
      }
      return m;
    },
    error(model, spec) {
      const got = model.hits.filter((i) => spec.items[i].target).length;
      return Math.min(1, (spec.nTargets - got + movingWrong(model, spec)) / spec.nTargets);
    },
    endedBy(model, spec) {
      const t = model.t;
      if (movingWrong(model, spec)) return 'wrong-click';
      for (let i = 0; i < spec.items.length; i++) {
        if (spec.items[i].target && !model.hits.includes(i) && itemLeave(spec, i) <= t) return 'missed';
      }
      return t >= spec.end ? 'time-up' : null;
    },
    plan(model, spec) {
      const t = model.t;
      const i = nextTarget(spec, model.hits, t);
      return i === null ? { wait: true } : { click: { item: i } };
    },
    solveBy(spec, model, m) {
      return { ...m, hits: spec.items.map((_, i) => i).filter((i) => spec.items[i].target) };
    },
    phrase(spec, rng, pick, say) {
      return say(I.fill(pick(T_MOVING), { c: spec.color }), { terse: `click all ${spec.color} shapes` });
    },
    judgeAsk(jr, spec, mk, cant) {
      const c = jr.pick(Object.keys(COLORS).filter((x) => !spec.colors[x]));
      return mk([`${c} shapes`, c], T_MOVING, { c }, cant(`there are no ${c} shapes on the board`));
    },
    factRows(model, spec, f) {
      const got = model.hits.filter((i) => spec.items[i].target).length;
      const left = spec.items.filter((_, i) => !model.hits.includes(i) && itemPos(spec, i, model.t)).length;
      return [f('Caught', `${got} of ${spec.nTargets}`, undefined, [`${got}/${spec.nTargets}`]), f('Missed clicks', model.misses, ['Misses']), f('On the board', left, ['Shapes left'])];
    },
    silentEdit(next, prev, spec, rng, m, out) {
      const beat = spec.beat;
      // A click on a target did not register: the shape is still there (only when the plan still catches every target).
      const fresh = next.hits.filter((i) => !prev.hits.includes(i) && spec.items[i].target);
      if (!fresh.length) return null;
      m.hits = next.hits.filter((i) => i !== fresh[fresh.length - 1]);
      return [-1, 0, 1].every((s) => movingFeasibleFrom(spec, m.hits, next.t + beat, s)) ? out(m) : null;
    },
    retargetEdit(spec, model, rng, base, good) {
      const beat = spec.beat;
      // Another color of the board is the target; the shapes caught so far must be of that color too, and the
      // plan must still reach every shape of it.
      for (const c of rng.shuffle(Object.keys(spec.colors).filter((x) => x !== spec.color && spec.items.some((it) => it.color === x)))) {
        const items = base.items.map((it) => ({ ...it, target: it.color === c }));
        const ns = { ...base, color: c, items, nTargets: items.filter((it) => it.target).length };
        if (movingWrong(model, ns) || ![-1, 0, 1].every((s) => movingFeasibleFrom(ns, model.hits, model.t + beat, s))) continue;
        const r = good(ns);
        if (r) return r;
      }
      return null;
    },
  });
})();
