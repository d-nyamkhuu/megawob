/* click-point/dense: sampling for the dense scenario. */
(function () {
  'use strict';
  const { BOARD, r4, dist, pt, DOT_COLORS } = env.taskOf('click-point').lib;

  function sampleDense(rng, ood, g, level) {
    let n = ood ? rng.int(90, 140) : rng.int(30, 60);
    if (level === 'easy') n = rng.fork('level').int(12, 20);
    else if (level === 'medium') n = rng.fork('level').int(20, 32);
    // Fewer dots on an placement area smaller than the default board (same density).
    if (g.custom) n = Math.max(8, Math.round(n * Math.min(1, ((g.x1 - g.x0) * (g.y1 - g.y0)) / (BOARD.w * BOARD.h))));
    let r = r4(ood ? 0.006 : rng.float(0.007, 0.011));
    if (level === 'easy' || level === 'medium') r = r4(r * (level === 'easy' ? 1.6 : 1.3));
    const by = rng.pick(['label', 'label', 'odd']);
    const minD = by === 'label' ? Math.max(4.2 * r, ood ? 0.05 : 0.07) : Math.max(4.2 * r, 0.035);
    const dots = [];
    for (let k = 0; k < 6000 && dots.length < n; k++) {
      const p = [rng.float(g.x0 + 0.04, g.x1 - 0.09), rng.float(g.y0 + 0.05, g.y1 - 0.04)];
      if (dots.every((d) => dist(d.p, p) >= minD)) dots.push({ p: pt(p) });
    }
    const base = rng.pick(Object.keys(DOT_COLORS));
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const used = new Set();
    for (const d of dots) {
      let label;
      do label = letters[rng.int(0, letters.length - 1)] + rng.int(1, 99); while (used.has(label));
      used.add(label);
      Object.assign(d, { label, kind: 'dot', color: base });
    }
    const target = rng.int(0, dots.length - 1);
    const spec = { dots, target, r, by, base };
    if (by === 'odd') {
      spec.odd = rng.pick(['hollow', 'square', 'color']);
      if (spec.odd === 'color') dots[target].color = rng.pick(Object.keys(DOT_COLORS).filter((c) => c !== base));
      else dots[target].kind = spec.odd;
    }
    return spec;
  }

  env.scenario('click-point', { name: 'dense', sample(rng, ood, tr, g, cs, level) { return sampleDense(rng, ood, g, level); } });
})();
