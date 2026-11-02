/* click-point/midpoint: sampling for the midpoint scenario. */
(function () {
  'use strict';
  const { horizontal, pt, fitRange, dist } = env.taskOf('click-point').lib;

  function sampleMidpoint(rng, ood, tr, g) {
    let [lo, hi] = ood ? (rng.bool() ? [0.1, 0.22] : [1.2, 1.5]) : [0.25, 1.2];
    const rw = g.x1 - g.x0;
    const rh = g.y1 - g.y0;
    if (horizontal(tr)) {
      const hr = rng.fork('orient');
      const Lhi = Math.min(hi, rw - 0.2);
      let Llo = Math.max(lo, ood ? 0 : 0.6);
      if (Llo > Lhi) Llo = Lhi * 0.6; // a narrow area (aspect / placement)
      const L = hr.float(Llo, Lhi);
      const x0 = hr.float(g.x0 + 0.1, g.x1 - 0.1 - L);
      const my = Math.min(0.25, rh * 0.3);
      const y = hr.float(g.y0 + my, g.y1 - my);
      return { a: pt([x0, y]), b: pt([x0 + L, y]) };
    }
    // Lengths the area can hold (placement areas, narrow boards): at most 0.8 of the inner diagonal.
    if (g.custom) [lo, hi] = fitRange([lo, hi], 0.8 * Math.hypot(rw - 0.16, rh - 0.16));
    for (;;) {
      const a = [rng.float(g.x0 + 0.08, g.x1 - 0.08), rng.float(g.y0 + 0.08, g.y1 - 0.08)];
      const b = [rng.float(g.x0 + 0.08, g.x1 - 0.08), rng.float(g.y0 + 0.08, g.y1 - 0.08)];
      const L = dist(a, b);
      if (L >= lo && L <= hi) return { a: pt(a), b: pt(b) };
    }
  }

  env.scenario('click-point', { name: 'midpoint', sample: sampleMidpoint });
})();
