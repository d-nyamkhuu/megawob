/*
 * draw / polygon: a map: click pins into a polygon, or outline an area.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('draw-shape');
  const { addPath, C, clampB, dist, EMPTY, ideal, inBoard, keyRoute, lastStroke, len, polyIoU, pt, ptsTargets, r4, shift,
    sub, T, tauK } = fam.lib;

  function pinsError(model, spec) {
    const pts = model.pts || [];
    if (model.closed && pts.length >= 3) return 1 - polyIoU(pts, spec.pins);
    const hit = spec.pins.filter((p) => pts.some((q) => dist(p, q) <= 0.03 * tauK(spec))).length;
    return 1 - 0.5 * (hit / spec.pins.length);
  }

  function blob(rng, c, r, n = 48) {
    const h = [rng.float(0.05, 0.14), rng.float(0.03, 0.09), rng.float(0.02, 0.05)];
    const ph = [rng.float(0, 6.28), rng.float(0, 6.28), rng.float(0, 6.28)];
    return Array.from({ length: n }, (_, i) => {
      const t = (i / n) * 2 * Math.PI;
      const rr = r * (1 + h[0] * Math.sin(2 * t + ph[0]) + h[1] * Math.sin(3 * t + ph[1]) + h[2] * Math.sin(5 * t + ph[2]));
      return pt([c[0] + rr * Math.cos(t) * 1.25, c[1] + rr * Math.sin(t)]);
    });
  }

  function samplePolygon(rng, opts, bd, F) {
    const cr = rng.fork('content');
    const cs = { csplit: opts.csplit };
    const names = C.sample(cr, C.STREET_NAMES, 4, cs);
    const streets = names.slice(0, rng.int(3, 4)).map((name, i) => {
      const vertical = i % 2 === 1;
      const u = rng.float(0.15, 0.85);
      const tilt = rng.float(-0.12, 0.12);
      return vertical
        ? { name, a: pt([u * bd.w - tilt, 0]), b: pt([u * bd.w + tilt, bd.h]) }
        : { name, a: pt([0, u - tilt]), b: pt([bd.w, u + tilt]) };
    });
    const river = rng.bool(0.5) ? { y0: r4(rng.float(0.2, 0.8)), amp: r4(rng.float(0.04, 0.1)), phase: r4(rng.float(0, 6)) } : null;
    const base = { streets, river };
    if (rng.bool(0.6)) {
      const k = opts.level ? (opts.level === 'easy' ? 4 : 5) : opts.ood ? rng.int(7, 8) : rng.int(4, 6);
      const capR = Math.min((F.w - 0.12) / 2.6 - 0.01, (F.h - 0.12) / 2 - 0.01); // the ring fits the frame
      for (;;) {
        const R = rng.float(Math.min(0.24, capR), Math.min(0.4, capR));
        const c = [F.x + rng.float(R * 1.3 + 0.06, F.w - R * 1.3 - 0.06), F.y + rng.float(R + 0.06, F.h - R - 0.06)];
        const th0 = rng.float(0, 6.28);
        const pins = Array.from({ length: k }, (_, i) => {
          const t = th0 + ((i + rng.float(-0.25, 0.25)) / k) * 2 * Math.PI;
          const rr = R * rng.float(0.65, 1);
          return pt([c[0] + rr * 1.3 * Math.cos(t), c[1] + rr * Math.sin(t)]);
        });
        let ok = pins.every((p) => inBoard(p, 0.05, F));
        for (let i = 0; i < k && ok; i++) for (let j = i + 1; j < k; j++) if (dist(pins[i], pins[j]) < 0.11) ok = false;
        if (!ok) continue;
        const { keys, keyRoute: kr } = keyRoute(rng, opts.route);
        let close = keys && rng.bool(0.5) ? 'enter' : rng.pick(['first', 'first', 'dblclick']);
        if (opts.level === 'easy') close = 'first';
        return { ...base, mode: 'pins', pins, close, keys, keyRoute: kr };
      }
    }
    const regionKind = rng.pick(['lake', 'park', 'campus', 'lot']);
    const capr = Math.min((F.w - 0.1) / 3 - 0.005, (F.h - 0.1) / 2.5 - 0.005); // the blob fits the frame
    const r = opts.ood ? rng.float(0.1, 0.13) : rng.float(Math.min(0.17, capr), Math.min(0.27, capr));
    const c = [F.x + rng.float(r * 1.5 + 0.05, F.w - r * 1.5 - 0.05), F.y + rng.float(r * 1.25 + 0.05, F.h - r * 1.25 - 0.05)];
    const region = blob(rng, c, r);
    const lakes = [
      'Mirror Lake', 'Lake Wren', 'Heron Pond', 'Silver Lake', 'Clearwater Pond', 'Lake Aster', 'Lake Oriel',
      'Plover Pond', 'Opal Mere', 'Thistle Lake', 'Blueglass Pond', 'Lake Veyle', 'Larkspur Mere', 'Pebble Pond',
      'Lake Neris', 'Duskwater Pond', 'Cinder Lake', 'Lake Brindle', 'Rillstone Pond', 'Fallow Mere', 'Lake Tern',
      'Mallow Pond', 'Cobalt Lake'
    ];
    const parks = [
      'Elm Park', 'Juniper Green', 'Fairview Park', 'Willow Commons', 'Harbor Park', 'Linden Gardens', 'Alder Green',
      'Mosslight Park', 'Fern Glade', 'Briar Gardens', 'Clover Glade', 'Sunward Green', 'Pine Hollow', 'Meadow Dell',
      'Mossbell Green', 'Dappled Fern', 'Bramble Lawn', 'Rain Garden', 'Hazel Nook', 'Foxglove Green', 'Moss Garden',
      'Wrenfield Park', 'Saffron Grove', 'Quiet Arbor'
    ];
    const campus = [
      'North Campus', 'Tech Park', 'Civic Center', 'Market Square', 'Old Town', 'Medical Campus', 'West Forum',
      'Orchard Hall', 'Foundry Hub', 'Cedar Hub', 'Atrium Commons', 'Civic Arcade', 'Lantern Arcade', 'Granary Hall',
      'Copper Hall', 'Studio Ward', 'Kiln Forum', 'Tandem Hall', 'Marble Hall', 'Gallery Ward', 'Mill Annex',
      'Mosaic Arcade', 'Crescent Hub', 'Vellum Hall'
    ];
    const lots = [
      'Lot B', 'East Parking', 'Depot Yard', 'Lot 7', 'Visitor Parking', 'Freight Yard', 'South Yard', 'Cargo Bay',
      'Rail Lot', 'Goods Yard', 'Cartage Lot', 'Service Pad', 'Trailer Lot', 'Load Bay', 'Parcel Bay', 'Tool Yard',
      'Spare Lot', 'Rack Lot', 'Crate Shed', 'Pipe Yard', 'Canopy Lot', 'Pump Yard', 'Supply Bay', 'Rope Shed'
    ];
    const bank = { lake: lakes, park: parks, campus, lot: lots }[regionKind];
    const name = C.pick(cr, bank, cs);
    return { ...base, mode: 'outline', region, regionKind, name, keys: false };
  }

  env.scenario('draw-shape', {
    name: 'polygon',
    placed: true,
    sample(rng, { o, board, F }) {
      return samplePolygon(rng, o, board, F);
    },
    tolerance(spec) {
      return spec.mode === 'pins' ? { tau: 0.04, sigma: 0.3 } : { tau: 0.08, sigma: 0.3 };
    },
    ideal(spec) {
      const reg = spec.region || spec.pins;
      return reg.concat([reg[0], reg[1]]);
    },
    init(spec, rng, mode) {
      if (spec.mode === 'outline') {
        if (mode === 'partial') return { strokes: [spec.region.slice(0, 26)] };
        if (mode === 'wrong') {
          const dx = spec.region[0][0] > spec.board.w / 2 ? -0.2 : 0.2;
          return { strokes: [shift(spec.region, [dx, 0], spec.board)] };
        }
        return { strokes: [] };
      }
      if (mode === 'partial' || (spec.level === 'easy' && spec.startMode === 'off')) return { drawing: true, pts: spec.pins.slice(0, 2).map(pt), closed: false };
      if (mode === 'wrong') {
        for (let tries = 0; tries < 20; tries++) {
          const i = rng.int(0, spec.pins.length - 1);
          const p = spec.pins[i];
          const cx = spec.pins.reduce((a, q) => a + q[0], 0) / spec.pins.length;
          const cy = spec.pins.reduce((a, q) => a + q[1], 0) / spec.pins.length;
          const v = sub(p, [cx, cy]);
          const l = len(v) || 1;
          const f = rng.pick([-0.6, 0.45]);
          const q = pt(clampB([p[0] + (v[0] / l) * f * l, p[1] + (v[1] / l) * f * l], spec.board));
          const pts = spec.pins.map((x, j) => (j === i ? q : x.slice()));
          const m = { drawing: true, pts, closed: true };
          if (pinsError(m, spec) > 0.12) return m;
        }
        return { drawing: true, pts: spec.pins.slice(0, 3).map((p) => pt(clampB([p[0] + 0.15, p[1]], spec.board))), closed: true };
      }
      return { drawing: false, pts: [], closed: false };
    },
    error(model, spec) {
      if (spec.mode === 'pins') return pinsError(model, spec);
      const k = lastStroke(model);
      if (!k || k.length < 3) return EMPTY;
      return 1 - polyIoU(k, spec.region);
    },
    solve(spec) {
      if (spec.mode === 'outline') return { strokes: [ideal(spec).map(pt)] };
      return { drawing: true, pts: spec.pins.map(pt), closed: true };
    },
    plan(model, spec) {
      if (spec.mode === 'outline') return { path: ptsTargets(ideal(spec)) };
      const pts = model.pts || [];
      if (model.closed) return { click: { control: 'clear' } };
      if (!model.drawing) return { click: { tool: 'polygon' } };
      const strayAt = pts.findIndex((p, i) => !spec.pins[i] || dist(p, spec.pins[i]) > 0.012);
      if (strayAt >= 0) return spec.keyRoute ? { key: 'Backspace' } : { click: { control: 'undo' } };
      const k = spec.pins.length;
      const i = pts.length;
      if (i < k - 1) return { click: { pin: i } };
      if (i === k - 1) return spec.close === 'dblclick' ? { dblclick: { pin: i } } : { click: { pin: i } };
      if (spec.close === 'enter' && spec.keys) return { key: 'Enter' };
      return { click: { pin: 0 } };
    },
    figurePts(spec) {
      return spec.mode === 'pins' ? spec.pins : spec.region;
    },
    instruction(spec, rng, say, tolP) {
      if (spec.mode === 'outline') {
        return say(T(rng, spec, [
          'Outline {name} on the map with one stroke.',
          'Draw around the edge of {name}.',
          'Trace the border of {name} in one closed loop.',
          'Circle {name} on the map, following its shoreline.',
          'Mark the area of {name} by drawing around it.',
          'Go around {name} with the pen so the loop follows its outline.',
          'Enclose {name} with one stroke along its edge.',
          'Keep one loop close to the boundary of {name}.',
          'For {name}, draw a loop that hugs its boundary.',
        ].map((s) => (spec.regionKind === 'lake' ? s : s.replace('shoreline', 'boundary'))), { name: spec.name }), `outline ${spec.name}`);
      }
      const k = spec.pins.length;
      const order = spec.pins.map((_, i) => i + 1).join('-');
      const closeHow = spec.close === 'enter' && spec.keys ? 'press Enter to close it' : spec.close === 'dblclick' ? 'double-click the last pin to close it' : 'click pin 1 again to close it';
      const core = T(rng, spec, [
        'Draw the delivery zone: a polygon through pins {order}, in that order.',
        'Mark the area enclosed by pins {order} as a polygon on the map.',
        'Start drawing an area and click pins 1 to {k} in order, then close the shape.',
        'Outline a zone with corners at the {k} numbered pins, going 1, 2, 3 and so on.',
        'Create an area polygon on the map with vertices at pins {order}.',
        'Draw a polygon that joins the numbered pins in order and closes back at pin 1.',
        'Use pins {order} as successive corners of a polygon, then close the area.',
        'Make a closed zone by connecting pins 1 through {k} in numerical order.',
        'From pin 1, join every numbered pin in sequence to form a closed polygon.',
        'For the boundary, follow pins {order} in sequence and close the polygon.',
        'Build a polygon corner by corner at pins 1 through {k}, then close it.',
        'Place each corner at the next pin in {order} and close the polygon.',
        'Work from pin 1 to pin {k} in order to draw an area, then close the shape.',
        'Follow the sequence {order} to set the polygon corners, then close the zone.',
        'Each pin is a vertex: draw a closed polygon through {order} in sequence.',
        'Draw a zone whose boundary meets pins 1 to {k} in order and closes.',
        'Enclose an area on the map using pins {order} as its ordered vertices.',
        'Make the area a closed polygon whose corners follow pins {order} in order.',
        'For a closed polygon, use {k} pins as corners, from lowest to highest.',
        'Every numbered pin must be a corner of a closed polygon, in increasing order.',
      ], { order, k });
      return say(rng.bool(0.35) ? `${core.replace(/\.$/, '')}; ${closeHow}.` : core, `zone ${order}`,
        ['start drawing an area', `click pins ${order} in order`, 'close the polygon']);
    },
    facts(model, spec, out) {
      if (spec.mode !== 'pins') return;
      out.push({ label: 'Corners', value: String(spec.pins.length), labels: ['Pins', 'Vertices'] });
      out.push({ label: 'Streets on the map', value: String(spec.streets.length), labels: ['Streets', 'Named streets'] });
    },
    parts(model, spec) {
      if (spec.mode === 'pins') {
        const pts = model.pts || [];
        return [{ name: 'Area', value: !!model.closed, aliases: ['Polygon'] },
          ...spec.pins.map((p, k) => ({ name: `Pin ${k + 1}`, value: pts.some((q) => dist(p, q) <= 0.03), aliases: [`Point ${k + 1}`] }))];
      }
      return [{ name: 'Outline', value: (model.strokes || []).length, aliases: ['Drawing'] }];
    },
    silent(next, prev, spec, rng, cands) {
      const C = env.util.clone;
      const p = prev || {};
      if (spec.mode !== 'pins') return;
      if (next.closed && !p.closed) cands.push(() => ({ ...C(next), closed: false }));
      else if ((next.pts || []).length > (p.pts || []).length) cands.push(() => ({ ...C(next), pts: C(next.pts.slice(0, -1)) }));
    },
    simulate(m, spec, step) {
      if (step.key) {
        if (step.key === 'Backspace') m.pts.pop();
        else if (step.key === 'Enter') { if (m.pts.length >= 3) m.closed = true; }
      } else if (step.path) addPath(m, step);
      else {
        const t = step.click || step.dblclick;
        if (t.tool) m.drawing = true;
        else if (t.control === 'undo') m.pts.pop();
        else if (t.control === 'clear') { m.pts = []; m.closed = false; }
        else if (t.pin !== undefined) {
          const p = spec.pins[t.pin];
          if (m.drawing && !m.closed) {
            if (m.pts.length >= 3 && dist(p, m.pts[0]) < 0.02) m.closed = true;
            else m.pts.push(p.slice());
            if (step.dblclick && m.pts.length >= 3) m.closed = true;
          }
        }
      }
      return m;
    },
  });
})();
