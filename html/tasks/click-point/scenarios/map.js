/* click-point/map: sampling for the map scenario. */
(function () {
  'use strict';
  const { roundTo, r4, pt, dir, cross, inBoard } = env.taskOf('click-point').lib;

  // The map fills the whole board (no placement); the aspect trait sets the number of longitude steps.
  function sampleMap(rng, ood, cs, g) {
    const mode = rng.pick(['coord', 'coord', 'intersection']);
    if (mode === 'coord') {
      const step = ood ? 0.5 : rng.pick([1, 1, 2, 5]);
      const nLat = 4;
      const nLon = g.custom ? Math.max(4, Math.round(g.W / 0.25)) : 6;
      const lat0 = roundTo(rng.int(-60 / step, (60 - nLat * step) / step) * step, step);
      const lon0 = roundTo(rng.int(-170 / step, (170 - nLon * step) / step) * step, step);
      const spec = { mode, step, lat0, lat1: lat0 + nLat * step, lon0, lon1: lon0 + nLon * step };
      const fracs = ood ? [0.1, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9] : [0.25, 0.5, 0.75];
      spec.lat = roundTo(lat0 + (rng.int(0, nLat - 1) + rng.pick(fracs)) * step, 0.0001);
      spec.lon = roundTo(lon0 + (rng.int(1, nLon - 2) + rng.pick(fracs)) * step, 0.0001);
      spec.style = ood ? rng.pick(['dm', 'deg']) : rng.pick(['deg', 'deg', 'signed']);
      if (spec.style === 'dm' && !ood) spec.style = 'deg';
      spec.land = [];
      for (let k = 0; k < rng.int(3, 6); k++) spec.land.push([r4(rng.float(0, g.W)), r4(rng.float(0, g.H)), r4(rng.float(0.12, 0.35))]);
      return spec;
    }
    // Street grid: two tasks of roughly parallel straight streets.
    const n1 = ood ? rng.int(4, 5) : rng.int(3, 4);
    const n2 = ood ? rng.int(5, 6) : rng.int(3, 5);
    const names = env.content.sample(rng, env.content.STREET_NAMES, n1 + n2, cs);
    const streets = [];
    const a1 = rng.float(-0.35, 0.35);
    const a2 = Math.PI / 2 + rng.float(-0.35, 0.35);
    for (let k = 0; k < n1; k++) {
      const y = 0.12 + (k + rng.float(0.2, 0.8)) * (0.76 / n1);
      streets.push({ name: names[k], p: pt([g.W / 2 + rng.float(-0.2, 0.2), y]), d: pt(dir(a1 + rng.float(-0.12, 0.12))) });
    }
    const span = g.custom ? g.W - 0.28 : 1.22;
    for (let k = 0; k < n2; k++) {
      const x = 0.14 + (k + rng.float(0.2, 0.8)) * (span / n2);
      streets.push({ name: names[n1 + k], p: pt([x, g.H / 2 + rng.float(-0.15, 0.15)]), d: pt(dir(a2 + rng.float(-0.12, 0.12))) });
    }
    const corners = [];
    for (let i = 0; i < n1; i++) {
      for (let j = n1; j < n1 + n2; j++) {
        const x = cross(streets[i], streets[j]);
        if (x && inBoard(x, 0.08, g)) corners.push([i, j]);
      }
    }
    return { mode, streets, pair: rng.pick(corners), corners };
  }

  env.scenario('click-point', { name: 'map', sample(rng, ood, tr, g, cs, level) { return sampleMap(rng, ood, cs, g); } });
})();
