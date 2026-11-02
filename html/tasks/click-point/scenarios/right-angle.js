/* click-point/right-angle: sampling for the right-angle scenario. */
(function () {
  'use strict';
  const { exclusionRatio, horizontal, fitRange, inBoard, room, pt, r4 } = env.taskOf('click-point').lib;

  function sampleRightAngle(rng, ood, tr, g) {
    const ex = exclusionRatio(tr);
    const hz = horizontal(tr);
    const hr = rng.fork('orient');
    const er = rng.fork('exclusion');
    const k = g.k;
    // Horizontal |AB| the area's width can hold (B keeps 0.15 k from the right edge, A 0.06 from the left).
    const hzL = (lo, hi) => (g.custom ? fitRange([lo, hi], g.x1 - g.x0 - 0.15 * k - 0.1) : [lo, hi]);
    for (;;) {
      const b = [rng.float(g.x0 + 0.15 * k, g.x1 - 0.15 * k), rng.float(g.y0 + 0.15 * k, g.y1 - 0.15 * k)];
      let L = ood ? rng.float(0.12 * k, 0.2 * k) : rng.float(0.2 * k, 0.5 * k);
      let th = rng.float(0, 2 * Math.PI);
      if (hz) { // A left of B on one horizontal line, wide
        L = hr.float(...(ood ? hzL(0.3, 0.45) : hzL(0.5, 0.9)));
        th = Math.PI;
      }
      const a = [b[0] + L * Math.cos(th), b[1] + L * Math.sin(th)];
      if (!inBoard(a, 0.06, g)) continue;
      let minLen = rng.float(0.08 * k, 0.14 * k);
      if (ex) minLen = L / er.float(ex[0], ex[1]);
      const n = [-Math.sin(th), Math.cos(th)];
      if (Math.max(room(b, n, 0.05, g), room(b, [-n[0], -n[1]], 0.05, g)) < minLen + 0.15) continue;
      return { a: pt(a), b: pt(b), minLen: r4(minLen) };
    }
  }

  env.scenario('click-point', { name: 'right-angle', sample: sampleRightAngle });
})();
