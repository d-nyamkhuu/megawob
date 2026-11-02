/*
 * click-control / hover: hover-shape.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('click-control');
  const { T } = fam.lib;

  const HOVER_COLORS = ['green', 'blue', 'red'];

  function sampleHover(rng, ctx) {
    const n = ctx.ood ? 7 : 5;
    const size = +rng.float(ctx.ood ? 0.1 : 0.11, ctx.ood ? 0.13 : 0.16).toFixed(3);
    for (;;) {
      const shapes = [];
      for (let tries = 0; shapes.length < n && tries < 1000; tries++) {
        const s = { x: +rng.float(0, 1 - size).toFixed(3), y: +rng.float(0, 1 - size).toFixed(3), size };
        const gap = 0.04;
        if (shapes.every((q) => s.x + size + gap < q.x || q.x + size + gap < s.x || s.y + size + gap < q.y || q.y + size + gap < s.y)) shapes.push(s);
      }
      if (shapes.length < n) continue;
      const need = ctx.ood ? rng.pick([5000, 6000]) : rng.pick([2000, 3000, 3000, 4000]);
      return { shapes, color: rng.pick(HOVER_COLORS), need, period: 2000 };
    }
  }

  env.scenario('click-control', {
    name: 'hover',
    sample: sampleHover,
    baseModel(spec) {
      return { over: null, hl: spec.hl0, got: 0, t: 0 };
    },
    ownError: (model, spec) => Math.max(0, spec.need - model.got) / 1000,
    partial(spec) {
      return { got: spec.need / 2 };
    },
    planStep: (model) => model.over === model.hl ? { wait: true } : { move: { shape: model.hl } },
    solveDirect(m, spec) {
      return { ...m, got: spec.need };
    },
    tick(model, spec, dt, now, rng) {
      let { hl, got, t } = model;
      if (model.over === hl) got += dt;
      t += dt;
      if (t >= spec.period - 1e-9) {
        t -= spec.period;
        hl = rng.pick([...spec.shapes.keys()].filter((i) => i !== hl));
      }
      return { ...model, hl, got, t };
    },
    level(spec, lv) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      spec.need = Math.max(1000, Math.round((spec.need * (1 - 0.5 * lv)) / 500) * 500);
      spec.period = Math.round((spec.period * (1 + 0.5 * lv)) / 500) * 500;
      spec.shapes = spec.shapes.slice(0, k(3, 4));
    },
    phrase(spec, rng, P) {
      let core, terse, steps;
      core = P(T.hover, { c: spec.color, s: spec.need / 1000 });
      return { core, terse, steps };
    },
    phKind: () => 'hover',
    judgeError: (model, spec) => model.got >= spec.need ? 1 : 0,
  });
})();
