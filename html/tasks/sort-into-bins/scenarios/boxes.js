/* sort-into-bins/scenarios/boxes.js: single, collect and sort starts and hooks. Shared internals live on the task lib. */
(function () {
  'use strict';
  const lib = env.taskOf('sort-into-bins').lib;

  function initBoxes(spec, rng) {
    const mode = lib.levelMode(spec);
    const n = spec.items.length;
    const pos = {};
    const remove = spec.rule.mode === 'remove';
    if (remove) {
      // Everything starts inside the box (that is the task: take the matching ones out).
      const c = spec.containers[0];
      const ss = rng.shuffle(lib.slots(spec, c));
      spec.items.forEach((it, i) => { pos[it.id] = ss[i]; });
      if (mode === 'partial') {
        const out = spec.items.filter((it) => spec.goal[it.id] === 'out');
        const m0 = { pos };
        for (const it of out.slice(0, Math.max(1, Math.floor(out.length / 2)))) m0.pos[it.id] = lib.freeOutside(spec, m0, it.id);
      } else if (mode === 'wrong') {
        // A wrong item taken out as well.
        const stay = spec.items.find((it) => spec.goal[it.id] !== 'out');
        pos[stay.id] = lib.freeOutside(spec, { pos }, stay.id);
      }
      return { pos, z: spec.items.map((it) => it.id) };
    }
    if (spec.scenario === 'single' && (mode === 'partial' || mode === 'wrong')) {
      // Dropped across the box edge: about half (partial) or a quarter (wrong) of the item inside.
      const c = spec.containers[0];
      const f = mode === 'partial' ? 0 : 0.25;
      const { w, h } = spec.item;
      const sides = [
        [c.x + f * w, c.y + c.h / 2], [c.x + c.w - f * w, c.y + c.h / 2],
        [c.x + c.w / 2, c.y + f * h], [c.x + c.w / 2, c.y + c.h - f * h],
      ].filter((p) => p[0] - w / 2 >= 0 && p[0] + w / 2 <= 1 && p[1] - h / 2 >= 0 && p[1] + h / 2 <= 1);
      if (sides.length) {
        const p = rng.pick(sides);
        return { pos: { [spec.items[0].id]: p }, z: [spec.items[0].id] };
      }
    }
    let pts = spec.startPos ? spec.items.map((it) => spec.startPos[it.id].slice()) : lib.scatter(rng, spec, n);
    if (spec.pile) pts = lib.pileUp(rng, spec, pts);
    spec.items.forEach((it, i) => { pos[it.id] = pts[i]; });
    const m = { pos, z: spec.items.map((it) => it.id) };
    if (mode === 'partial') {
      // About half of the right moves already made (a single remaining move is left half-way).
      const sim = { pos: { ...m.pos } };
      let total = 0;
      for (; total < 3 * n; total++) {
        const mv = lib.boxMove(sim, spec);
        if (!mv || !mv.to) break;
        sim.pos[mv.id] = mv.to;
      }
      const steps = Math.floor(total * (spec.level && spec.startMode === 'off' ? lib.levelFrac(spec) : 0.5));
      for (let k = 0; k < steps; k++) {
        const mv = lib.boxMove(m, spec);
        if (!mv || !mv.to) break;
        m.pos[mv.id] = mv.to;
      }
      if (!steps) {
        const mv = lib.boxMove(m, spec);
        if (mv && mv.to) {
          const old = m.pos[mv.id];
          m.pos[mv.id] = [(old[0] + mv.to[0]) / 2, (old[1] + mv.to[1]) / 2];
          if (lib.boxError(m, spec) === 0) m.pos[mv.id] = old;
        }
      }
    } else if (mode === 'wrong') {
      // Items that should stay out placed inside, or items in the wrong labeled box.
      const ids = spec.items.map((it) => it.id);
      const cands = rng.shuffle(ids);
      let moved = 0;
      for (const id of cands) {
        const g = spec.goal[id];
        const wrongBox = spec.containers.find((c) => c.id !== g && !(g === 'any'));
        if (!wrongBox) continue;
        const to = lib.freeSlot(spec, m, id, wrongBox);
        if (!to) continue;
        m.pos[id] = to;
        if (++moved >= Math.max(1, Math.floor(n / 3))) break;
      }
    }
    return m;
  }


  // single: 0 fully inside the bin; otherwise 0.25 + 0.75 x how far the item still has to travel to fit (the shortest
  // shift of its center that puts it fully inside, aspect-corrected, over half the board height, capped), so a drop
  // that lands short still counts for the distance it covered. Any miss stays above the 'off' minimum (0.2).
  function singleError(model, spec) {
    const it = spec.items[0];
    const p = model.pos[it.id];
    const c = spec.containers[0];
    if (lib.where(spec, p) === c.id) return 0;
    const hw = spec.item.w / 2;
    const hh = spec.item.h / 2;
    const cx = Math.min(Math.max(p[0], c.x + hw), c.x + c.w - hw);
    const cy = Math.min(Math.max(p[1], c.y + hh), c.y + c.h - hh);
    return 0.25 + 0.75 * Math.min(1, Math.hypot((p[0] - cx) * spec.aspect, p[1] - cy) / 0.5);
  }

  for (const scenario of ['single', 'collect', 'sort']) env.scenario('sort-into-bins', {
    name: scenario,
    sample(rng, base, opts) { return lib.addTraits(rng.fork('traits'), lib.buildSpec(rng, scenario, base, opts.traits), opts); },
    init: initBoxes,
    error: scenario === 'single' ? (model, spec) => spec.judge ? lib.boxError(model, spec) : singleError(model, spec) : lib.boxError,
    plan: lib.boxPlan,
  });
})();
