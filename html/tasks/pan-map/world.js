/* pan-map/world.js: seeded city geography and places, shared by all map scenarios (task-internal lib). */
(function () {
  'use strict';
  const { dist } = env.util;
  const C = env.content;
  const { inPoly, segDist, scaleOf } = env.taskOf('pan-map').lib;
  const r0 = (x) => Math.round(x);
  const LABEL_BOX = [176, 42]; // declutter box (px): two places closer than this never show together

  // [kind, label, tier]; tier: 1 big (from zoom 1), 2 medium (from 2), 3 small (from 3)
  const KINDS = [
    ['station', 'Station', 1], ['museum', 'Museum', 1], ['hospital', 'Hospital', 1], ['market', 'Market', 1],
    ['university', 'College', 1], ['stadium', 'Stadium', 1],
    ['library', 'Library', 2], ['school', 'School', 2], ['hotel', 'Hotel', 2], ['gallery', 'Gallery', 2],
    ['theatre', 'Theatre', 2], ['pool', 'Swimming Pool', 2], ['church', 'Chapel', 2], ['venue', '', 2],
    ['cafe', 'Café', 3], ['bakery', 'Bakery', 3], ['pharmacy', 'Pharmacy', 3], ['post', 'Post Office', 3],
    ['books', 'Bookshop', 3], ['clinic', 'Clinic', 3], ['florist', 'Florist', 3], ['gym', 'Gym', 3],
    ['grocer', 'Grocer', 3], ['laundry', 'Laundrette', 3],
  ];
  const KIND = Object.fromEntries(KINDS.map(([k, label, tier]) => [k, { label, tier }]));

  const DISTRICT_SKIP = /Terminal|Station|Interchange|Hospital|Library|Zoo|Stadium|Cathedral|Parliament|City Hall|Observatory|Racecourse|Yard|Center|Road|Street|Lane|Avenue|Gate\b|Square|Plaza|Grounds|Gardens|Row|Cross|\d/;
  const STREET_FALLBACK = ['Maple Avenue', 'Oak Street', 'Elm Street', 'Pine Street', 'Cedar Lane', 'Mill Road', 'High Street',
    'Station Road', 'Park Lane', 'Church Street', 'Bridge Street', 'King Street', 'Queen Street', 'River Road',
    'Ash Road', 'Willow Lane', 'Birch Street', 'Beech Avenue', 'Hazel Lane', 'Holly Street', 'Alder Road',
    'Linden Avenue', 'Meadow Lane', 'Heath Road', 'Vale Street', 'Cliff Road', 'Ridge Avenue', 'Shore Road',
    'Quarry Street', 'Orchard Lane', 'School Road', 'Market Street', 'Castle Avenue', 'Manor Lane', 'Forge Road',
    'Mason Street', 'Cooper Lane', 'Weaver Street', 'Tanner Road', 'Potter Lane', 'Baker Street', 'Amber Avenue',
    'Silver Street', 'Copper Road', 'Violet Lane', 'Clover Avenue', 'Beacon Road', 'Lantern Lane', 'Anchor Street',
    'Sail Road', 'Wren Lane', 'Falcon Avenue', 'Fox Street', 'Rowan Lane', 'Spruce Avenue', 'Aspen Road',
    'Laurel Street', 'Juniper Lane', 'Fern Street', 'Bramble Road', 'Daisy Lane', 'Flint Street', 'Slate Road',
    'Marble Avenue', 'Summit Road', 'Hollow Lane', 'Dune Street', 'Marsh Road', 'Harbor Avenue', 'Dawn Lane',
    'Comet Street', 'Chandler Road', 'Carver Street', 'Smith Lane', 'Porter Road', 'Badger Lane', 'Otter Road',
    'Heron Avenue', 'Raven Street', 'Acorn Lane', 'Spade Road', 'Anvil Street', 'Fiddle Lane', 'Bell Avenue',
    'Drum Street', 'Saffron Lane', 'Russet Avenue', 'Indigo Street', 'Cobalt Road', 'Ferry Street', 'Malt Road',
    'Thatch Lane', 'Walnut Street', 'Poplar Road', 'Yew Lane', 'Poppy Lane', 'Iris Street', 'Aster Avenue',
    'Sorrel Road', 'Nettle Lane', 'Swift Street', 'Finch Road', 'Lark Lane', 'Robin Street', 'Hare Road', 'Stoat Lane',
    'Stag Street', 'Granite Road', 'Basalt Street', 'Jasper Lane', 'Opal Avenue', 'Turner Street', 'Mercer Lane',
    'Fletcher Road', 'Joiner Street', 'Glover Avenue', 'Compass Road', 'Rudder Lane', 'Loom Street', 'Chisel Lane',
    'Kettle Road', 'Cavern Avenue', 'Grove Lane', 'Cinder Street', 'Autumn Avenue', 'Winter Road', 'Summer Lane',
    'Zenith Road'];
  const PARK_WORDS = [
    'Park', 'Gardens', 'Common', 'Green', 'Fields', 'Meadows', 'Grounds', 'Reserve', 'Grove', 'Heath', 'Glades',
    'Lawns'
  ];

  function lineDist(p, pts) {
    let d = Infinity;
    for (let i = 1; i < pts.length; i++) d = Math.min(d, segDist(p, pts[i - 1], pts[i]));
    return d;
  }

  function wet(world, p, pad = 0) {
    if (inPoly(p, world.sea) || inPoly(p, world.lake)) return true;
    if (pad && (world.sea && lineDist(p, world.sea) < pad)) return true;
    if (pad && (world.lake && lineDist(p, world.lake.concat([world.lake[0]])) < pad)) return true;
    return !!(world.river && lineDist(p, world.river.pts) < world.river.w / 2 + pad);
  }

  // A wobbly line from a to b through n inner points, jittered perpendicular by up to amp.
  function wobble(rng, a, b, n, amp) {
    const pts = [a];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const L = Math.hypot(dx, dy) || 1;
    const nx = -dy / L;
    const ny = dx / L;
    let off = 0;
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1);
      off = Math.max(-amp, Math.min(amp, off * 0.5 + rng.float(-amp, amp)));
      pts.push([r0(a[0] + dx * t + nx * off), r0(a[1] + dy * t + ny * off)]);
    }
    pts.push(b);
    return pts.map(([x, y]) => [r0(x), r0(y)]);
  }

  function blob(rng, cx, cy, rx, ry, n = 12) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const k = rng.float(0.78, 1.12);
      pts.push([r0(cx + Math.cos(a) * rx * k), r0(cy + Math.sin(a) * ry * k)]);
    }
    return pts;
  }

  // ---------------------------------------------------------------- world generation

  function buildWorld(rng, ood, csplit) {
    const pickN = (list, k) => C.sample(rng, list, k, { csplit });
    const W = ood ? 4800 : 3200;
    const H = ood ? 3200 : 2200;
    const world = { W, H, sea: null, lake: null, river: null, parks: [], roads: [], streets: [], districts: [] };

    // Water: a coastline on one side, or a river across, plus sometimes a lake.
    const waterKind = rng.pick(['river', 'river', 'river', 'coast', 'coast', 'lake']);
    const BIG = 2000; // the sea extends past the world so panning to the edge still shows water
    if (waterKind === 'coast') {
      const side = rng.pick(['top', 'bottom', 'left', 'right']);
      const depth = rng.float(0.1, 0.17);
      if (side === 'top' || side === 'bottom') {
        const y = side === 'top' ? H * depth : H * (1 - depth);
        const line = wobble(rng, [-BIG, y], [W + BIG, y], ood ? 16 : 12, H * 0.06);
        const edge = side === 'top' ? -BIG : H + BIG;
        world.sea = [...line, [W + BIG, edge], [-BIG, edge]];
      } else {
        const x = side === 'left' ? W * depth : W * (1 - depth);
        const line = wobble(rng, [x, -BIG], [x, H + BIG], ood ? 14 : 10, W * 0.05);
        const edge = side === 'left' ? -BIG : W + BIG;
        world.sea = [...line, [edge, H + BIG], [edge, -BIG]];
      }
    } else if (waterKind === 'river') {
      const across = rng.bool(0.6);
      const a = across ? [-200, H * rng.float(0.3, 0.7)] : [W * rng.float(0.3, 0.7), -200];
      const b = across ? [W + 200, H * rng.float(0.3, 0.7)] : [W * rng.float(0.3, 0.7), H + 200];
      world.river = { pts: wobble(rng, a, b, ood ? 12 : 9, (across ? H : W) * 0.12), w: r0(rng.float(60, 110)) };
    }
    if (waterKind === 'lake' || rng.bool(0.3)) {
      for (let k = 0; k < 20; k++) {
        const cx = rng.float(0.2, 0.8) * W;
        const cy = rng.float(0.2, 0.8) * H;
        const rx = rng.float(140, 260);
        const ry = rng.float(100, 200);
        const pts = blob(rng, cx, cy, rx, ry);
        if (!wet(world, [cx, cy], Math.max(rx, ry) + 80)) {
          world.lake = pts;
          break;
        }
      }
    }

    // Major roads: avenues roughly along each axis, sometimes a diagonal boulevard.
    const nh = ood ? rng.int(4, 5) : rng.int(3, 4);
    const nv = ood ? rng.int(4, 6) : rng.int(3, 4);
    const diag = rng.bool(0.45) ? 1 : 0;
    const names = pickN(C.STREET_NAMES, nh + nv + diag + 2);
    let ni = 0;
    for (let i = 0; i < nh; i++) {
      const y = H * ((i + 0.5) / nh) + rng.float(-0.08, 0.08) * H / nh;
      world.roads.push({ name: names[ni++ % names.length], kind: 'avenue', pts: wobble(rng, [-100, y], [W + 100, y], ood ? 10 : 7, 70) });
    }
    for (let i = 0; i < nv; i++) {
      const x = W * ((i + 0.5) / nv) + rng.float(-0.08, 0.08) * W / nv;
      world.roads.push({ name: names[ni++ % names.length], kind: 'avenue', pts: wobble(rng, [x, -100], [x, H + 100], ood ? 9 : 6, 70) });
    }
    if (diag) {
      const flip = rng.bool(0.5);
      world.roads.push({ name: names[ni++ % names.length], kind: 'boulevard',
        pts: wobble(rng, [-100, flip ? H + 100 : -100], [W + 100, flip ? -100 : H + 100], 8, 90) });
    }
    // Roads end at the sea or a lake: cut each polyline into dry runs (bridges over the river are kept).
    world.roads = world.roads.flatMap((road) => {
      const runs = [];
      let cur = [];
      const dense = [];
      for (let i = 1; i < road.pts.length; i++) {
        const [a, b] = [road.pts[i - 1], road.pts[i]];
        const n = Math.max(1, Math.ceil(dist(a, b) / 60));
        for (let k = i === 1 ? 0 : 1; k <= n; k++) dense.push([r0(a[0] + (b[0] - a[0]) * k / n), r0(a[1] + (b[1] - a[1]) * k / n)]);
      }
      for (const p of dense) {
        const dry = !inPoly(p, world.sea) && !inPoly(p, world.lake);
        if (dry) cur.push(p);
        else if (cur.length) { runs.push(cur); cur = []; }
      }
      if (cur.length) runs.push(cur);
      return runs.filter((r) => r.length >= 4).map((pts) => ({ ...road, pts: simplify(pts) }));
    });

    // Minor streets: a grid of segments with gaps, dry only.
    const g = r0(rng.float(120, 170));
    const grid = { g, ox: r0(rng.float(0, g)), oy: r0(rng.float(0, g)) };
    world.grid = grid;
    const seg = (x1, y1, x2, y2) => {
      const n = 6;
      for (let k = 0; k <= n; k++) if (wet(world, [x1 + (x2 - x1) * k / n, y1 + (y2 - y1) * k / n], 10)) return;
      world.streets.push([r0(x1), r0(y1), r0(x2), r0(y2)]);
    };
    for (let x = grid.ox; x < W; x += g) {
      let y = 0;
      while (y < H) {
        const len = g * rng.int(2, 5);
        if (rng.bool(0.82)) seg(x, y, x, Math.min(H, y + len));
        y += len;
      }
    }
    for (let y = grid.oy; y < H; y += g) {
      let x = 0;
      while (x < W) {
        const len = g * rng.int(2, 5);
        if (rng.bool(0.82)) seg(x, y, Math.min(W, x + len), y);
        x += len;
      }
    }

    // Districts: well-spread dry points.
    const nd = ood ? rng.int(6, 9) : rng.int(4, 6);
    const dnames = pickN(C.STATIONS.filter((s) => !DISTRICT_SKIP.test(s)), nd);
    for (const name of dnames) {
      for (let k = 0; k < 60; k++) {
        const p = [r0(rng.float(0.1, 0.9) * W), r0(rng.float(0.1, 0.9) * H)];
        if (wet(world, p, 60)) continue;
        if (world.districts.some((d) => dist([d.x, d.y], p) < Math.min(W, H) * 0.32)) continue;
        world.districts.push({ name, x: p[0], y: p[1] });
        break;
      }
    }

    // Parks: rounded blobs on land, named after a district or a street.
    const np = ood ? rng.int(4, 6) : rng.int(2, 4);
    for (let i = 0; i < np; i++) {
      for (let k = 0; k < 40; k++) {
        const cx = rng.float(0.08, 0.92) * W;
        const cy = rng.float(0.08, 0.92) * H;
        const rx = rng.float(90, 200);
        const ry = rng.float(70, 150);
        if (wet(world, [cx, cy], Math.max(rx, ry) + 20)) continue;
        if (world.parks.some((p) => dist(p.c, [cx, cy]) < 500)) continue;
        const near = nearestDistrict(world, [cx, cy]);
        const base = rng.bool(0.6) && near ? near.name : (names[ni++ % names.length] || 'City').split(' ')[0];
        world.parks.push({ name: `${base} ${rng.pick(PARK_WORDS)}`, c: [r0(cx), r0(cy)], pts: blob(rng, cx, cy, rx, ry, 10) });
        break;
      }
    }
    world.parks = world.parks.map(({ name, pts }) => ({ name, pts }));
    return world;
  }

  function simplify(pts) {
    // Keep every third point of a densified run (plus the ends): enough to follow the original wobble.
    return pts.filter((p, i) => i === 0 || i === pts.length - 1 || i % 3 === 0);
  }

  function nearestDistrict(world, p) {
    let best = null;
    for (const d of world.districts) if (!best || dist([d.x, d.y], p) < dist([best.x, best.y], p)) best = d;
    return best;
  }

  // Places: positions on dry land, names from districts / streets / venues, minZoom by decluttering.
  function buildPlaces(rng, world, ood, csplit) {
    const n = ood ? rng.int(30, 44) : rng.int(16, 24);
    const venues = C.sample(rng, C.VENUES, 8, { csplit })
      .filter((v) => !/,/.test(v));
    const raw = [];
    const used = new Set();
    for (let i = 0; i < n * 3 && raw.length < n; i++) {
      const p = [r0(rng.float(0.05, 0.95) * world.W), r0(rng.float(0.05, 0.95) * world.H)];
      if (wet(world, p, 30)) continue;
      if (raw.some((o) => dist([o.x, o.y], p) < 70)) continue;
      const district = nearestDistrict(world, p);
      const form = rng.next();
      let kind;
      let name;
      if (form < 0.12 && venues.length) {
        kind = 'venue';
        name = venues.shift();
      } else {
        const choices = KINDS.filter(([k]) => k !== 'venue');
        kind = rng.pick(choices)[0];
        const label = KIND[kind].label;
        if (form < 0.72 && district) name = `${district.name} ${label}`;
        else {
          let road = null;
          let best = Infinity;
          for (const r of world.roads) {
            const d = lineDist(p, r.pts);
            if (d < best) { best = d; road = r; }
          }
          name = `${(road ? road.name : rng.pick(STREET_FALLBACK)).split(' ')[0]} ${label}`;
        }
      }
      if (used.has(name)) continue;
      used.add(name);
      raw.push({ name, kind, label: KIND[kind].label, tier: KIND[kind].tier, x: p[0], y: p[1], district: district ? district.name : '' });
    }
    // Declutter: big places claim low zoom levels first.
    const zmax = ood ? 6 : 5;
    const order = rng.shuffle(raw).sort((a, b) => a.tier - b.tier);
    const placed = [];
    for (const p of order) {
      for (let z = p.tier; z <= zmax; z++) {
        const s = scaleOf(z);
        const clash = placed.some((o) => o.minZoom <= z && Math.abs(o.x - p.x) * s < LABEL_BOX[0] && Math.abs(o.y - p.y) * s < LABEL_BOX[1]);
        if (!clash) {
          p.minZoom = z;
          placed.push(p);
          break;
        }
      }
    }
    // Stable ids in reading order of the final list.
    return placed.map((p, i) => ({ id: `p${i}`, ...p }));
  }

  Object.assign(env.taskOf('pan-map').lib, { buildWorld, buildPlaces });
})();
