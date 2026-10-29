/* click-point/path-mid: sampling for the path-mid scenario. */
(function () {
  'use strict';
  const { r4, dist } = env.taskOf('click-point').lib;

  // Grid indices run from one cell inside the area's left / top edge to two cells inside its right / bottom edge
  // (1 .. cols - 1 on the whole board; aspect / placement areas keep 0.03 more). A small placement area gets a finer
  // grid (at least 12 cells across).
  function samplePath(rng, ood, g) {
    let grid = rng.pick([0.05, 0.0625, 0.075]);
    const s = Math.min(g.x1 - g.x0, g.y1 - g.y0);
    if (g.custom && s / grid < 12) grid = r4(s / 12);
    const m = g.custom ? 0.03 : 0;
    const cLo = Math.ceil((g.x0 + m) / grid) + 1;
    const cHi = Math.floor((g.x1 - m) / grid) - 2;
    const rLo = Math.ceil((g.y0 + m) / grid) + 1;
    const rHi = Math.floor((g.y1 - m) / grid) - 2;
    const nSeg = ood ? rng.int(7, 10) : rng.int(3, 6);
    for (let tries = 0; tries < 500; tries++) {
      let cur = [rng.int(cLo, cHi), rng.int(rLo, rHi)];
      const cells = [cur.join()];
      const pts = [cur];
      let horiz = rng.bool();
      let ok = true;
      for (let s = 0; s < nSeg && ok; s++) {
        const L = rng.int(2, Math.min(ood ? 5 : 7, (horiz ? cHi - cLo : rHi - rLo)));
        const sg = rng.bool() ? 1 : -1;
        const step = horiz ? [sg, 0] : [0, sg];
        let p = cur;
        for (let k = 0; k < L; k++) {
          p = [p[0] + step[0], p[1] + step[1]];
          if (p[0] < cLo || p[0] > cHi || p[1] < rLo || p[1] > rHi || cells.includes(p.join())) {
            ok = false;
            break;
          }
          cells.push(p.join());
        }
        if (!ok) break;
        cur = p;
        pts.push(cur);
        horiz = !horiz;
      }
      if (!ok) continue;
      const total = cells.length - 1;
      if (total < 8) continue;
      if (dist(pts[0], pts[pts.length - 1]) < 3) continue;
      return { grid, pts: pts.map((q) => [r4(q[0] * grid), r4(q[1] * grid)]), cells: total };
    }
    if (!g.custom) return { grid, pts: [[0.25, 0.5], [0.25, 0.25], [1.0, 0.25], [1.0, 0.75]], cells: 0 };
    // A U around the area's grid (never reached in practice; keeps the path inside the area).
    const U = [[cLo, rHi], [cLo, rLo], [cHi, rLo], [cHi, rHi]];
    return { grid, pts: U.map((q) => [r4(q[0] * grid), r4(q[1] * grid)]), cells: 2 * (rHi - rLo) + (cHi - cLo) };
  }

  env.scenario('click-point', { name: 'path-mid', sample(rng, ood, tr, g, cs, level) { return samplePath(rng, ood, g); } });
})();
