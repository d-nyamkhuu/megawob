/* click-point/bisect: sampling for the bisect scenario. */
(function () {
  'use strict';
  const { exclusionRatio, DEG, r4, inBoard, room, dir, pt } = env.taskOf('click-point').lib;

  // Lengths scale by g.k (1 unless a placement area is smaller than one board height).
  function sampleBisect(rng, ood, tr, g) {
    const ex = exclusionRatio(tr);
    const er = rng.fork('exclusion');
    const k = g.k;
    for (;;) {
      const v = [rng.float(g.x0 + 0.15 * k, g.x1 - 0.15 * k), rng.float(g.y0 + 0.15 * k, g.y1 - 0.15 * k)];
      const theta = (ood ? rng.float(12, 28) : rng.float(28, 160)) / DEG;
      const phi = rng.float(0, 2 * Math.PI);
      let minLen = rng.float(0.08 * k, 0.14 * k);
      const rays = [phi - theta / 2, phi + theta / 2].map((angle) => ({ angle: r4(angle), len: r4(rng.float(0.24 * k, 0.5 * k)) }));
      if (ex) minLen = (rays[0].len + rays[1].len) / 2 / er.float(ex[0], ex[1]);
      if (!rays.every((ray) => inBoard([v[0] + Math.cos(ray.angle) * ray.len, v[1] + Math.sin(ray.angle) * ray.len], 0.05, g))) continue;
      if (room(v, dir(phi), 0.05, g) < minLen + 0.15) continue;
      return { v: pt(v), rays, minLen: r4(minLen), bisector: r4(Math.atan2(Math.sin(rays[0].angle) + Math.sin(rays[1].angle), Math.cos(rays[0].angle) + Math.cos(rays[1].angle))) };
    }
  }

  env.scenario('click-point', { name: 'bisect', sample: sampleBisect });
})();
