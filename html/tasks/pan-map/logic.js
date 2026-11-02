/*
 * pan-map: pan and zoom a map to find and click named places.
 * A slippy map. Pan by dragging the map itself (the viewport moves over the map, nothing is moved
 * onto anything), zoom with the +/- buttons or, when the episode allows it, the mouse wheel, and click place
 * markers. The map is procedural and seeded: a coastline, river or lake, parks, named major roads, a minor
 * street grid (city blocks), district labels and 14-24 named places from the content banks (districts from
 * env.content.STATIONS, venues from VENUES, street names from STREET_NAMES). Like real maps, small places
 * only appear from their own zoom level on (label decluttering), so place.minZoom differs per place.
 * No MiniWoB counterpart (a pan drag where the viewport moves).
 *
 * Map units: 1 unit = 1 px at zoom 3. scaleOf(z) = 2^(z - 3) px per unit; zoom levels zmin..zmax = 1..5
 * (ood 1..6). The world is W x H units (train 3200 x 2200, ood 4800 x 3200); the map centre is clamped to
 * the world rectangle.
 *
 * A7 additions (legacy marker / center / zoom retain their original sampling and mechanics):
 *   pin: search a landmark/address or read labels, click the map or drag the dropped pin to its position.
 *   route: drag numbered waypoint handles onto the named places, in order.
 *   zone: click polygon vertices and close the boundary; cover include IDs and exclude all exclude IDs.
 *   zoomto: set level N and pan a named place to the centre; buttons, wheel and double-click zoom.
 * New spec: level, tau (map units), places[].address, stops[] (route), include[]/exclude[] (zone),
 *   column/rows (zone goal), searchRoute (pin). New model: pin:[x,y]|null, waypoints:[[x,y]],
 *   vertices:[[x,y]], closed:boolean, query/searchOpen/searchDone, tool:'edit'|'pan', plus c/z/sel/port.
 * New targets: {point:[x,y]}, {waypoint:index}, {pin:true}, {search:true}, {suggestion:id},
 *   {tool:'edit'|'pan'}, {clear:true}, {closeZone:true}. All geometry and graded errors use map units.
 * facts(model,spec): visible resulting address/coordinates, route length/stops, zone area/coverage, map scale.
 * silent(next,prev,spec,rng): once, a dropped pin snaps to a nearby wrong address; repeat placement repairs it.
 * retarget(spec,model,rng): switch destination, stop order or delivery column in the same map scene.
 * parts(model,spec): preempt=cancel: the map view (centre) and zoom level, plus the places (selected or not), the pin, the
 *   route stops or the delivery zone.
 * judgeModes: ambiguous (two identically named places, disambiguated by their addresses), impossible
 *   (a requested street address missing from this map). Both require leaving the map untouched and replying. The
 *   instruction uses the scenario's usual wording about the place (marker / centre wording, the pin wording for the editors).
 *   ambiguous   the reply asks (status ask), one option per place (spec.judge.cands: the two addresses; others: every
 *               other place's name and address)
 *   impossible  an address on a street this map does not have, number and street seeded from the content banks; status
 *               impossible, what names the address (spec.judge.what: the address, its street)
 * routeGeometry follows the surveyed street grid for the visible route; scoring still measures waypoint distances.
 *
 * scenarios
 *   marker  click the marker of a named place that starts outside the view: at the start zoom its offset
 *           from the map centre exceeds 520 px horizontally or 340 px vertically, so it is off-screen in any
 *           map viewport up to 1040 x 680 px (widgets keep their map viewport at most that big). The goal
 *           sometimes gives the direction from the current view or the district. Look-alike names share a
 *           district or a kind ("Old Town Library", "Old Town Station"). Clicking another marker only opens
 *           its card.
 *   center  pan so that a named place sits inside the circular reticle at the centre of the map. The
 *           reticle's radius is the tolerance in map units (spec.tau = 14 px at the start zoom; widgets draw it
 *           as tau * scaleOf(z) px, so it grows and shrinks with the zoom).
 *   zoom    set the zoom to level N and click the marker of a small place that only appears from level N on
 *           (N = that place's minZoom, 3-5, ood up to 6). The goal names a landmark near it that is visible
 *           at the start. 80% start zoomed out (zoom in), 20% at N + 1 (zoom out); the place is near the
 *           start view, but zooming pushes it off-centre, so the agent re-pans.
 *
 * spec   { scenario, startMode, isplit, csplit, ood, route (opts.route echo or null),
 *          wheel (wheel zoom allowed: adds 'wheel' to inputs), zoomRoute ('buttons' | 'wheel': how the
 *          oracle zooms), zmin, zmax, z0 (start zoom), c0: [x, y] (start centre, 'off' start),
 *          world: { W, H, grid: { g, ox, oy } (minor street spacing and phase), sea: [[x, y]] | null
 *            (polygon), lake: [[x, y]] | null, river: { pts: [[x, y]], w } | null, parks: [{ name, pts }],
 *            roads: [{ name, pts, kind ('avenue' | 'boulevard') }], streets: [[x1, y1, x2, y2]],
 *            districts: [{ name, x, y }] },
 *          places: [{ id, name, kind, label (kind label), tier, x, y, minZoom, district }],
 *          target (place id), N (zoom scenario: the zoom level to reach), tau (center: map units),
 *          d0 (marker: start distance from the centre to the target, map units),
 *          hint: { dir (compass word from the start centre), district, near (landmark name, zoom) } }
 * model  { c: [x, y] (map centre, units), z (zoom level), sel (selected place id: its card is open) | null,
 *          port: [w, h] | null (the map viewport in px; mirrored by the widget, unscored) }
 * error  marker  0 when the target is selected, else 0.6 + 0.4 * min(1, |c - target| / d0)   tau 0
 *        center  |c - target| in map units                                               tau spec.tau
 *        zoom    0.5 [target not selected] + 0.5 min(1, |z - N| / max(1, |z0 - N|))       tau 0
 * start modes  off; partial (marker: centre 70% of the way to the target; center: 25-40% of the start
 *        distance left; zoom: at level N, nothing selected); wrong (marker / center: a look-alike place
 *        centred and selected; zoom: at level N with a look-alike place's card open); solved.
 * Search fields and scrolling directories accept keyboard/wheel input on every scenario; spec.wheel gates map zoom.
 * routes  wheel zoom vs the +/- buttons: spec.wheel (50%) allows the wheel; when allowed the oracle zooms
 *        with { wheel } 60% of the time (spec.zoomRoute). opts.route: 'wheel' forces wheel zoom (allowed and
 *        used by the oracle), 'pointer' forces button zoom (wheel not allowed), 'keyboard' is ignored (no
 *        keyboard route). Widget traits.zoom: 'both' (default) | 'buttons' (no wheel zoom: never sampled) |
 *        'wheel' (no buttons: wheel always on and used). Route draws come from rng.fork('route').
 * ood    bigger world, 30-44 places, 6-9 districts, zoom level 6, targets farther away.
 * levels (the same map, an easier goal) easy / medium: marker: the start is at most ~900 / ~1300 px
 *        from the target instead of ~1900 (still off-screen), easy always names a direction or the district;
 *        center: the reticle is 2x / 1.5x as big (tau, sigma and the start distance scale with it) and the
 *        start is closer (500 / 800 px instead of 1100); zoom: always zoom in, from 1 / at most 2 levels below
 *        N (normal 1-3 below, or out from N + 1 a fifth of the time), the target nearer the start centre.
 *
 * plan targets (the widget's locate() maps them to viewport px)
 *   { marker: id }          the place's pin              { zoom: 'in' | 'out' }   a zoom button
 *   { map: 'center' }       the centre of the map viewport (wheel point)
 *   { grab: [dx, dy] } / { release: [dx, dy] }   a pan drag that moves the map content by [dx, dy] map units:
 *                           the widget converts with dragPx(model, spec, d) (clamped to 45% of the viewport,
 *                           direction kept) and returns centre - D/2 and centre + D/2, so the drag stays in
 *                           the middle of the map, away from corner controls
 *   { close: true }         the close button of the open place card
 * plan steps: { click: { close } } while a card other than the goal is open; zoom steps ({ click: { zoom } }
 *   or { wheel: [{ map: 'center' }, -100 (in) | 100 (out)] }) until the level is right (zoom: N; center:
 *   at least z0; marker: at least the target's minZoom); then { drag: [{ grab }, { release }] } until the
 *   target is near the centre (center: within tau); then { click: { marker } } (marker, zoom).
 *
 * Helpers (widget API, env.taskDef.helpers):
 *   scaleOf(z): pixels per map unit.
 *   placeById(spec, id): place record or null.
 *   visible(spec, place, z): whether a place is drawn at zoom z.
 *   toPort(model, [x, y]): map position to viewport pixels, using model.port.
 *   panPx(model, spec, [dx, dy]): pan the content by viewport pixels.
 *   zoomAt(model, spec, z, [px, py]?): zoom keeping the point under those pixels fixed (default centre).
 *   wheelSteps(deltaY): level change for one wheel event.
 *   dragPx(model, spec, d): clamped viewport displacement for a pan in map units.
 *   select(model, spec, id | null): select or clear a visible place.
 *   inPoly(point, polygon): point-in-polygon geometry.
 *   editorStats(model, spec): visible editor measurements and readouts.
 *   routeGeometry(model, spec): route following the surveyed street grid.
 *   fromPort(model, [px, py]): viewport pixels to map position.
 * Task-internal city generation lives in world.js (lib); tests live in selftest.js.
 */
(function () {
  'use strict';

  const { quote: q, dist } = env.util;

  const C = env.content;
  const I = env.instruct;
  const r0 = (x) => Math.round(x);

  const LEGACY = ['marker', 'center', 'zoom'];
  const EDITORS = ['pin', 'route', 'zone', 'zoomto'];
  const SCENARIOS = [...LEGACY, ...EDITORS];
  const TAU_PX = 14;          // center: reticle radius at the start zoom
  const OFF_X = 520;          // marker: start offset that is off-screen for viewports up to 1040 x 680
  const OFF_Y = 340;
  const DRAG_FRAC = 0.45;     // pan drags span at most this fraction of the viewport
  const NEAR_FRAC = 0.3;      // click a marker once it is within this fraction of the viewport from the centre

  const scaleOf = (z) => 2 ** (z - 3);

  // ---------------------------------------------------------------- geometry helpers

  function inPoly(p, poly) {
    if (!poly) return false;
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i];
      const [xj, yj] = poly[j];
      if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }

  function segDist(p, a, b) {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const L2 = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2));
    return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
  }

  function placeById(spec, id) {
    return spec.places.find((p) => p.id === id) || null;
  }

  const visible = (spec, place, z) => !!place && place.minZoom <= z;

  function compass(from, to) {
    const dx = to[0] - from[0];
    const dy = from[1] - to[1]; // north is up (smaller y)
    const a = (Math.atan2(dy, dx) * 180) / Math.PI;
    const dirs = ['east', 'north-east', 'north', 'north-west', 'west', 'south-west', 'south', 'south-east'];
    return dirs[((Math.round(a / 45) % 8) + 8) % 8];
  }

  // Name similarity for look-alike decoys: shared first word, or the same kind label.
  function lookAlikes(spec, target, filter = () => true) {
    const first = target.name.split(' ')[0];
    const score = (p) => (p.name.split(' ')[0] === first ? 2 : 0) + (p.kind === target.kind ? 1 : 0) + (p.district === target.district ? 0.5 : 0);
    return spec.places.filter((p) => p.id !== target.id && filter(p)).sort((a, b) => score(b) - score(a) || a.id.localeCompare(b.id));
  }

  // ---------------------------------------------------------------- model helpers (shared with widgets)

  function clampC(spec, c) {
    return [Math.max(0, Math.min(spec.world.W, c[0])), Math.max(0, Math.min(spec.world.H, c[1]))];
  }

  function portOf(model) {
    return model.port && model.port[0] > 0 ? model.port : [640, 400];
  }

  function toPort(model, p) {
    const s = scaleOf(model.z);
    const [w, h] = portOf(model);
    return [(p[0] - model.c[0]) * s + w / 2, (p[1] - model.c[1]) * s + h / 2];
  }

  // Content dragged by d px: the centre moves the other way.
  function panPx(model, spec, d) {
    const s = scaleOf(model.z);
    const c = clampC(spec, [model.c[0] - d[0] / s, model.c[1] - d[1] / s]);
    return { ...model, c: [Math.round(c[0] * 100) / 100, Math.round(c[1] * 100) / 100] };
  }

  function zoomAt(model, spec, z, at) {
    const nz = Math.max(spec.zmin, Math.min(spec.zmax, Math.round(z)));
    if (nz === model.z) return model;
    const [w, h] = portOf(model);
    const p = at || [w / 2, h / 2];
    const s0 = scaleOf(model.z);
    const s1 = scaleOf(nz);
    // The map point under p stays under p.
    const wx = model.c[0] + (p[0] - w / 2) / s0;
    const wy = model.c[1] + (p[1] - h / 2) / s0;
    const c = clampC(spec, [wx - (p[0] - w / 2) / s1, wy - (p[1] - h / 2) / s1]);
    return { ...model, z: nz, c: [Math.round(c[0] * 100) / 100, Math.round(c[1] * 100) / 100] };
  }

  // One wheel event: one level per notch (100 px of deltaY), 1-3 levels, wheel up zooms in.
  function wheelSteps(deltaY) {
    if (!deltaY) return 0;
    return -Math.sign(deltaY) * Math.max(1, Math.min(3, Math.round(Math.abs(deltaY) / 100)));
  }

  // Pan drag in px for a content displacement d (map units), clamped to DRAG_FRAC of the viewport.
  function dragPx(model, spec, d) {
    const s = scaleOf(model.z);
    const [w, h] = portOf(model);
    let D = [d[0] * s, d[1] * s];
    const k = Math.min(1, (DRAG_FRAC * w) / (Math.abs(D[0]) || 1e-9), (DRAG_FRAC * h) / (Math.abs(D[1]) || 1e-9));
    D = [D[0] * k, D[1] * k];
    return [Math.round(D[0] * 10) / 10, Math.round(D[1] * 10) / 10];
  }

  function select(model, spec, id) {
    if (id !== null && id !== undefined) {
      const p = placeById(spec, id);
      if (!p || !visible(spec, p, model.z)) return model;
    }
    return { ...model, sel: id === undefined ? null : id };
  }

  // ---------------------------------------------------------------- sampling

  function sampleLegacy(rng, opts) {
    const pool = opts.scenarios && opts.scenarios.length ? opts.scenarios.filter((v) => SCENARIOS.includes(v)) : SCENARIOS;
    const scenario = opts.scenario || rng.pick(pool.length ? pool : SCENARIOS);
    const ood = !!opts.ood;
    const csplit = opts.csplit || 'train';
    const traits = opts.traits || {};
    const lvl = opts.level === 'easy' || opts.level === 'medium' ? opts.level : 'normal';
    const easy = lvl === 'easy';
    const zmin = 1;
    const zmax = ood ? 6 : 5;

    // Input route first, from its own stream: route knobs never shift the map.
    const rr = rng.fork('route');
    let wheel = rr.bool(0.5);
    let zoomRoute = wheel && rr.bool(0.6) ? 'wheel' : 'buttons';
    if (opts.route === 'wheel') { wheel = true; zoomRoute = 'wheel'; }
    if (opts.route === 'pointer') { wheel = false; zoomRoute = 'buttons'; }
    const tz = traits.zoom || 'both';
    if (tz === 'buttons') { wheel = false; zoomRoute = 'buttons'; }
    if (tz === 'wheel') { wheel = true; zoomRoute = 'wheel'; }

    for (let attempt = 0; attempt < 40; attempt++) {
      const r = rng.fork(`map#${attempt}`);
      const world = lib.buildWorld(r.fork('world'), ood, csplit);
      const places = lib.buildPlaces(r.fork('places'), world, ood, csplit);
      const spec = { scenario, startMode: opts.startMode || 'off', isplit: opts.isplit || 'train', csplit, ood,
        route: opts.route || null, wheel, zoomRoute, zmin, zmax, world, places };
      const g = r.fork('goal');
      const W = world.W;
      const H = world.H;
      const inner = (p, m) => p.x > W * m && p.x < W * (1 - m) && p.y > H * m && p.y < H * (1 - m);

      if (scenario === 'marker') {
        spec.z0 = ood ? g.pick([3, 4, 4, 5]) : g.pick([3, 3, 4]);
        const s = scaleOf(spec.z0);
        const cands = places.filter((p) => p.minZoom <= spec.z0 && inner(p, 0.04));
        if (!cands.length) continue;
        const t = g.pick(cands);
        const maxD = (ood ? 3200 : easy ? 900 : lvl === 'medium' ? 1300 : 1900) / s;
        let c0 = null;
        for (let k = 0; k < 80 && !c0; k++) {
          const c = [r0(g.float(0.1, 0.9) * W), r0(g.float(0.1, 0.9) * H)];
          const off = [Math.abs(t.x - c[0]) * s, Math.abs(t.y - c[1]) * s];
          if ((off[0] > OFF_X + 40 || off[1] > OFF_Y + 40) && dist(c, [t.x, t.y]) < maxD) c0 = c;
        }
        if (!c0) continue;
        Object.assign(spec, { target: t.id, c0, d0: Math.round(dist(c0, [t.x, t.y])),
          hint: { mode: easy ? g.pick(['dir', 'district']) : g.pick(['dir', 'dir', 'district', 'none']), dir: compass(c0, [t.x, t.y]), district: t.district } });
        if (spec.hint.mode === 'district' && !t.district) spec.hint.mode = 'dir';
        return spec;
      }

      if (scenario === 'center') {
        spec.z0 = g.pick(ood ? [2, 3, 4, 5] : [2, 3, 3, 4]);
        const s = scaleOf(spec.z0);
        const cands = places.filter((p) => p.minZoom <= spec.z0 && inner(p, 0.06));
        if (!cands.length) continue;
        const t = g.pick(cands);
        let c0 = null;
        for (let k = 0; k < 80 && !c0; k++) {
          const a = g.float(0, Math.PI * 2);
          const dpx = g.float(160, ood ? 1800 : easy ? 500 : lvl === 'medium' ? 800 : 1100);
          const c = clampC({ world }, [r0(t.x + Math.cos(a) * dpx / s), r0(t.y + Math.sin(a) * dpx / s)]);
          if (dist(c, [t.x, t.y]) * s > 150) c0 = c;
        }
        if (!c0) continue;
        const tauK = easy ? 2 : lvl === 'medium' ? 1.5 : 1;
        Object.assign(spec, { target: t.id, c0, tau: Math.round((TAU_PX * tauK / s) * 100) / 100 });
        return spec;
      }

      // zoom
      const cands = places.filter((p) => p.minZoom >= 3 && inner(p, 0.08));
      if (!cands.length) continue;
      const t = g.pick(cands);
      const N = t.minZoom;
      const out = (N + 1 <= zmax && g.bool(0.2)) && lvl === 'normal';
      const z0 = out ? N + 1 : g.int(Math.max(zmin + 1, N - (easy ? 1 : lvl === 'medium' ? 2 : 3)), N - 1);
      const s0 = scaleOf(z0);
      // A landmark visible at the start, close to the target, that the goal can name.
      const near = places.filter((p) => p.id !== t.id && p.minZoom <= z0)
        .sort((a, b) => dist([a.x, a.y], [t.x, t.y]) - dist([b.x, b.y], [t.x, t.y]))[0];
      if (!near || dist([near.x, near.y], [t.x, t.y]) * s0 > 220) continue;
      const nf = easy ? 0.45 : lvl === 'medium' ? 0.75 : 1;
      const c0 = clampC({ world }, [r0(t.x + g.float(-130 * nf, 130 * nf) / s0), r0(t.y + g.float(-80 * nf, 80 * nf) / s0)]);
      Object.assign(spec, { target: t.id, N, z0, c0, hint: { near: near.name, district: t.district } });
      return spec;
    }
    throw new Error(`pan-map/${scenario}: could not sample a map`);
  }

  function init(spec, rng) {
    if (spec.judge && spec.judge.initial) return env.util.clone(spec.judge.initial);
    if (EDITORS.includes(spec.scenario)) return initEditor(spec);
    const t = placeById(spec, spec.target);
    const m = { c: spec.c0.slice(), z: spec.z0, sel: null, port: null };
    const mode = spec.startMode;
    const tp = [t.x, t.y];
    if (mode === 'partial') {
      if (spec.scenario === 'marker') m.c = clampC(spec, [spec.c0[0] + 0.7 * (t.x - spec.c0[0]), spec.c0[1] + 0.7 * (t.y - spec.c0[1])]).map(r0);
      else if (spec.scenario === 'center') {
        const f = rng.float(0.25, 0.4);
        m.c = [r0(t.x + (spec.c0[0] - t.x) * f), r0(t.y + (spec.c0[1] - t.y) * f)];
        if (dist(m.c, tp) < 3.5 * spec.tau) m.c = spec.c0.slice();
      } else m.z = spec.N;
    } else if (mode === 'wrong') {
      const zNow = spec.scenario === 'zoom' ? spec.N : spec.z0;
      const near = (p) => dist([p.x, p.y], tp) * scaleOf(zNow);
      const cands = lookAlikes(spec, t, (p) => visible(spec, p, zNow) && (spec.scenario !== 'center' || dist([p.x, p.y], tp) > 4 * spec.tau));
      const d = spec.scenario === 'zoom' ? cands.filter((p) => near(p) < 600)[0] || cands[0] : cands[0];
      if (d) {
        m.z = zNow;
        m.c = clampC(spec, [d.x, d.y]);
        m.sel = d.id;
      }
    }
    return m;
  }

  // ---------------------------------------------------------------- scoring

  function error(model, spec) {
    if (spec.judge) return judgeError(model, spec);
    if (EDITORS.includes(spec.scenario)) return editorError(model, spec);
    const t = placeById(spec, spec.target);
    const d = dist(model.c, [t.x, t.y]);
    if (spec.scenario === 'center') return d;
    if (spec.scenario === 'marker') return model.sel === t.id ? 0 : 0.6 + 0.4 * Math.min(1, d / Math.max(1, spec.d0));
    const zErr = Math.min(1, Math.abs(model.z - spec.N) / Math.max(1, Math.abs(spec.z0 - spec.N)));
    return 0.5 * (model.sel === t.id ? 0 : 1) + 0.5 * zErr;
  }

  function tolerance(spec) {
    if (spec.judge) return { tau: 0, sigma: 30 };
    if (EDITORS.includes(spec.scenario)) return { tau: spec.tau, sigma: 45, minInitialError: 3 * spec.tau };
    if (spec.scenario === 'center') return { tau: spec.tau, sigma: 2.5 * spec.tau, minInitialError: 3 * spec.tau };
    return { tau: 0, sigma: 0.35 };
  }

  // ---------------------------------------------------------------- instruction

  const T = {
    marker: [
      'Show me the details for {place}.', 'Find {place} on this map.',
      'Open the place details for {place}.', 'I need the map listing for {place}.',
      'Bring up {place} in the map.', 'Show the location information for {place}.',
      'Find the listing for {place}.',
      'The map entry I need is {place}.',
    ],
    hintDir: [
      'It is {dir} of the current view.', 'It should be to the {dir}.', 'The location is {dir} of here.',
      'Its bearing from here is {dir}.', 'It sits off to the {dir}.'
    ],
    hintDistrict: [
      'It is in {district}.', 'You will find it around {district}.', 'It is in the {district} area.',
      'The area is {district}.', '{district} contains that location.', 'Its district is {district}.'
    ],
    center: [
      'Centre the map on {place}.', 'Show {place} in the middle of the map.',
      'Make {place} the centre of this view.', 'I want a map view centred on {place}.',
      'Set the map centre to {place}.', 'Focus the map on {place}.',
      'Put {place} at the centre of the map.',
      'Pan to put {place} in the middle.',
      'Have {place} be at map centre.',
      '{place} belongs at map centre.',
    ],
    zoom: [
      'Show the details for {place}, near {near}, at zoom level {n}.',
      'Find {place} near {near} and leave the map at level {n}.',
      'Open the listing for {place} near {near}, with zoom level {n}.',
      'I need {place}, close to {near}, at map level {n}.',
      'Show {place} next to {near} at zoom level {n}.',
      'Bring up {place}, which is by {near}, at map level {n}.',
      'Find the map listing for {place} near {near}, at zoom {n}.',
      '{place} near {near} is the entry to show at zoom level {n}.',
      'Use zoom {n} for the listing of {place} near {near}.',
      'With {place} by {near} open, set the map to level {n}.',
    ],
  };

  function instruction(spec, rng) {
    if (spec.judge) return judgeInstruction(spec, rng);
    if (EDITORS.includes(spec.scenario)) return editorInstruction(spec, rng);
    const In = I;
    const sp = spec.isplit;
    const pick = (ts) => (In ? In.pick(rng, ts, sp) : rng.pick(ts));
    const fill = (t, vars) => (In ? In.fill(t, vars) : t.replace(/\{(\w+)\}/g, (m, k) => vars[k]));
    const say = (core, o) => (In ? In.say(rng, core, { isplit: sp, ...o }) : core);
    const t = placeById(spec, spec.target);
    const place = q(t.name);
    if (spec.scenario === 'marker') {
      let core = fill(pick(T.marker), { place });
      const h = spec.hint;
      if (h.mode === 'dir') core += ` ${fill(pick(T.hintDir), { dir: h.dir })}`;
      if (h.mode === 'district') core += ` ${fill(pick(T.hintDistrict), { district: h.district })}`;
      return say(core, { terse: `Find ${t.name}`, steps: [`find ${place}`, 'show its place details'] });
    }
    if (spec.scenario === 'center') {
      return say(fill(pick(T.center), { place }), { terse: `Centre on ${t.name}`, steps: [`find ${place}`, 'make it the centre of the map'] });
    }
    const vars = { place, n: spec.N, near: q(spec.hint.near), inout: spec.z0 < spec.N ? 'in' : 'out' };
    const core = fill(pick(T.zoom), vars);
    return say(In ? In.ucFirst(core) : core, { terse: `Show ${t.name}, level ${spec.N}`,
      steps: [`zoom to level ${spec.N}`, `find ${place} near ${q(spec.hint.near)}`, 'show its place details'] });
  }

  // ---------------------------------------------------------------- oracle

  function zoomStep(spec, dir) {
    if (spec.zoomRoute === 'wheel') return { wheel: [{ map: 'center' }, dir > 0 ? -100 : 100] };
    return { click: { zoom: dir > 0 ? 'in' : 'out' } };
  }

  function plan(model, spec) {
    if (spec.judge) return { finish: true, message: spec.judge.message };
    if (EDITORS.includes(spec.scenario)) return editorPlan(model, spec);
    const t = placeById(spec, spec.target);
    const goalSel = spec.scenario === 'center' ? null : t.id;
    if (model.sel && model.sel !== goalSel) return { click: { close: true } };
    if (spec.scenario === 'zoom' && model.z !== spec.N) return zoomStep(spec, model.z < spec.N ? 1 : -1);
    if (spec.scenario === 'center' && model.z < spec.z0) return zoomStep(spec, 1);
    if (spec.scenario === 'marker' && model.z < t.minZoom) return zoomStep(spec, 1);
    const d = [model.c[0] - t.x, model.c[1] - t.y];
    const pan = { drag: [{ grab: d }, { release: d }] };
    if (spec.scenario === 'center') return pan;
    if (model.sel === t.id) return null;
    const [w, h] = portOf(model);
    const p = toPort(model, [t.x, t.y]);
    if (Math.abs(p[0] - w / 2) <= NEAR_FRAC * w && Math.abs(p[1] - h / 2) <= NEAR_FRAC * h) return { click: { marker: t.id } };
    return pan;
  }

  function solve(spec, model) {
    if (spec.judge) return env.util.clone(spec.judge.initial);
    if (EDITORS.includes(spec.scenario)) return solveEditor(spec, model);
    const t = placeById(spec, spec.target);
    if (spec.scenario === 'center') return { ...model, c: [t.x, t.y] };
    if (spec.scenario === 'marker') return { ...model, z: Math.max(model.z, t.minZoom), sel: t.id };
    return { ...model, z: spec.N, c: [t.x, t.y], sel: t.id };
  }

  // ---------------------------------------------------------------- A7 map editors

  const xy = (p) => [p.x, p.y];
  const fromPort = (m, p) => [m.c[0] + (p[0] - portOf(m)[0] / 2) / scaleOf(m.z),
    m.c[1] + (p[1] - portOf(m)[1] / 2) / scaleOf(m.z)];
  const routePoints = (s) => s.stops.map((id) => xy(placeById(s, id)));
  function zoneOutline(s) {
    const pts = s.include.map((id) => xy(placeById(s, id)));
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const a = Math.min(...xs) - 60, b = Math.max(...xs) + 60;
    const c = Math.min(...ys) - 60, d = Math.max(...ys) + 60;
    return [[a, c], [b, c], [b, d], [a, d]];
  }
  function addressAt(m, s) {
    if (!m.pin) return 'No pin placed';
    return s.places.slice().sort((a, b) => dist(m.pin, xy(a)) - dist(m.pin, xy(b)))[0].address;
  }
  function routeGeometry(m, s) {
    const wp = m.waypoints || [];
    if (!wp.length) return [];
    const xs = s.world.streets.filter((l) => l[0] === l[2]).map((l) => l[0]);
    const ys = s.world.roads.map((r) => r.pts[0][1]);
    const nearestY = (y) => ys.reduce((a, b) => Math.abs(a - y) < Math.abs(b - y) ? a : b);
    const out = [wp[0]];
    for (let i = 1; i < wp.length; i++) {
      const a = wp[i - 1], b = wp[i], ay = nearestY(a[1]), by = nearestY(b[1]);
      out.push([a[0], ay]);
      if (ay !== by) {
        const x = xs.reduce((u, v) => Math.abs(u - a[0]) + Math.abs(u - b[0]) < Math.abs(v - a[0]) + Math.abs(v - b[0]) ? u : v);
        out.push([x, ay], [x, by]);
      }
      out.push([b[0], by], b);
    }
    return out;
  }
  function editorStats(m, s) {
    const vertices = m.vertices || [];
    let area = 0, length = 0;
    for (let i = 0; i < vertices.length; i++) {
      const a = vertices[i], b = vertices[(i + 1) % vertices.length];
      area += a[0] * b[1] - a[1] * b[0];
    }
    const wp = s.scenario === 'route' ? routeGeometry(m, s) : m.waypoints || [];
    for (let i = 1; i < wp.length; i++) length += dist(wp[i - 1], wp[i]);
    return { name: s.places.slice().sort((a, b) => dist(m.pin || m.c, xy(a)) - dist(m.pin || m.c, xy(b)))[0].name,
      coordinates: (m.pin || m.c).map((v) => v.toFixed(0)).join(', '),
      address: addressAt(m, s), length: `${(length * 2 / 1000).toFixed(2)} km`,
      area: `${(Math.abs(area) * 2 / 10000).toFixed(2)} ha`,
      covered: m.closed ? s.places.filter((p) => inPoly(xy(p), vertices)).length : 0,
      scale: `1:${Math.round(8000 / scaleOf(m.z))}` };
  }

  function sampleEditor(rng, opts) {
    const g = rng.fork('editor'), level = opts.level || 'normal', ood = !!opts.ood;
    const world = lib.buildWorld(g.fork('world'), ood, opts.csplit || 'train');
    const cx = world.W / 2, cy = world.H / 2, dx = ood ? 240 : 180, dy = ood ? 220 : 160;
    const names = C.sample(g.fork('names'), C.VENUES, 9, { csplit: opts.csplit });
    const streets = C.sample(g.fork('streets'), C.STREET_NAMES, 3, { csplit: opts.csplit });
    const places = [];
    for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {
      const i = row * 3 + col;
      places.push({ id: `e${i}`, name: names[i], address: `${12 + col * 28 + row * 2} ${streets[row]}`,
        x: cx + (col - 1) * dx, y: cy + (row - 1) * dy,
        minZoom: 1, tier: 2, kind: 'venue', label: 'Local place', district: 'Survey district', row, col });
    }
    // Local surveyed streets: addresses are on the labelled street, with a service road between columns.
    world.roads = streets.map((name, row) => ({ name, kind: 'avenue', pts: [[cx - 700, cy + (row - 1) * dy], [cx + 700, cy + (row - 1) * dy]] }));
    world.streets = [-2.5, -1.5, -.5, .5, 1.5, 2.5].map((n) => n * dx).map((x) => [cx + x, cy - 700, cx + x, cy + 700]);
    // Keep the surveyed block on dry land; the surrounding city retains its parks and districts.
    world.sea = null; world.lake = null; world.river = null;
    world.parks = world.parks.filter((p) => !inPoly([cx, cy], p.pts));
    const target = g.pick(places).id;
    const s = { scenario: opts.scenario, startMode: opts.startMode || 'off', level, ood,
      isplit: opts.isplit || 'train', csplit: opts.csplit || 'train', route: opts.route || null,
      world, places, spacing: [dx, dy], target, zmin: 1, zmax: ood ? 6 : 5, z0: 2,
      c0: [cx, cy], N: level === 'easy' ? 3 : g.int(3, ood ? 6 : 5),
      tau: level === 'easy' ? 18 : level === 'medium' ? 12 : 8,
      wheel: opts.route !== 'pointer', zoomRoute: opts.route === 'wheel' || (opts.route !== 'pointer' && g.bool()) ? 'wheel' : 'buttons',
      searchRoute: opts.route !== 'pointer' && g.bool(), byAddress: g.bool(),
      stops: g.shuffle(places.map((p) => p.id)).slice(0, level === 'easy' ? 2 : level === 'medium' ? 3 : ood ? 5 : 4),
      column: g.pick([0, 2]), rows: level === 'easy' ? 2 : 3 };
    s.include = places.filter((p) => p.col === s.column && p.row < s.rows).map((p) => p.id);
    s.exclude = places.filter((p) => !s.include.includes(p.id)).map((p) => p.id);
    if (s.scenario === 'zone') s.tau = 2;
    return s;
  }

  function sample(rng, opts) {
    // Keep legacy RNG streams intact when a pre-existing scenario is forced by its widget/index.
    const pool = opts.scenarios && opts.scenarios.length ? opts.scenarios.filter((v) => SCENARIOS.includes(v)) : SCENARIOS;
    const scenario = opts.scenario || rng.pick(pool.length ? pool : SCENARIOS);
    const s = EDITORS.includes(scenario) ? sampleEditor(rng, { ...opts, scenario }) : sampleLegacy(rng, { ...opts, scenario });
    if (['ambiguous', 'impossible'].includes(opts.judge)) {
      const t = placeById(s, s.target), j = { mode: opts.judge };
      s.places.forEach((p, i) => { if (!p.address) p.address = `${12 + i * 4} ${s.world.roads[i % s.world.roads.length].name}`; });
      if (j.mode === 'ambiguous') {
        const other = s.places.find((p) => p.id !== t.id);
        other.name = t.name;
        // Judges need both candidates readable without acting; editor search also lists both addresses.
        other.minZoom = t.minZoom = 1;
        if (!t.address) t.address = `24 ${s.world.roads[0].name}`;
        if (!other.address) other.address = `68 ${s.world.roads[1].name}`;
        j.name = t.name; j.addresses = [t.address, other.address];
        // The place's name is the shared word; the addresses tell the two apart. Every other place on the map (its name
        // and address) must not be offered.
        j.cands = [[t.address], [other.address]];
        const own = ` ${t.name.toLowerCase()} `;
        j.others = s.places.filter((p) => p !== t && p !== other).map((p) => (own.includes(` ${p.name.toLowerCase()} `) ? [p.address] : [p.name, p.address]));
        s.byAddress = false; // an editor pin task names the place, not its address
        j.message = `Which ${t.name} do you mean: ${t.address} or ${other.address}?`;
        s.c0 = [(t.x + other.x) / 2, (t.y + other.y) / 2]; s.z0 = 1;
      } else {
        // An address on a street this map does not have (number and street from the content banks, seeded).
        const jg = rng.fork('judge-what');
        const roads = new Set(s.world.roads.map((r) => r.name.toLowerCase()));
        const streets = C.STREET_NAMES.filter((n) => !roads.has(n.toLowerCase()));
        const street = streets[jg.int(0, streets.length - 1)];
        j.name = `${jg.int(101, 989)} ${street}`;
        j.what = [j.name, street];
        j.message = `I cannot place this: ${j.name} is not on this map.`;
      }
      s.judge = j;
      j.initial = init(s, rng.fork('judge-init'));
    }
    return s;
  }

  function initEditor(s) {
    const t = xy(placeById(s, s.target));
    const m = { c: s.c0.slice(), z: s.z0, port: null, sel: null, pin: null, query: '',
      searchOpen: false, searchDone: false, tool: 'edit', vertices: [], closed: false,
      waypoints: routePoints(s).map(([x, y], i) => [x + (i % 2 ? -85 : 85), y + 75]) };
    if (s.startMode === 'partial') {
      if (s.scenario === 'pin') m.pin = [t[0] + 65, t[1] + 50];
      if (s.scenario === 'route') m.waypoints[0] = routePoints(s)[0];
      if (s.scenario === 'zone') m.vertices = zoneOutline(s).slice(0, 2);
      if (s.scenario === 'zoomto') { m.z = s.N; m.c = [t[0] + 90, t[1] + 60]; }
    }
    if (s.startMode === 'wrong') {
      if (s.scenario === 'pin') m.pin = xy(s.places.find((p) => p.id !== s.target));
      if (s.scenario === 'route') m.waypoints = routePoints(s).slice().reverse();
      if (s.scenario === 'zone') { m.vertices = zoneOutline({ ...s, include: s.exclude }); m.closed = true; }
      if (s.scenario === 'zoomto') { m.z = s.N; m.c = xy(s.places.find((p) => p.id !== s.target)); }
    }
    return m;
  }

  function boundaryDistance(p, poly) {
    if (!poly.length) return 160;
    if (poly.length === 1) return dist(p, poly[0]);
    return Math.min(...poly.map((a, i) => segDist(p, a, poly[(i + 1) % poly.length])));
  }
  function crosses(poly) {
    const side = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    for (let i = 0; i < poly.length; i++) for (let j = i + 2; j < poly.length; j++) {
      if (i === 0 && j === poly.length - 1) continue;
      const a = poly[i], b = poly[(i + 1) % poly.length], c = poly[j], d = poly[(j + 1) % poly.length];
      if (side(a, b, c) * side(a, b, d) < 0 && side(c, d, a) * side(c, d, b) < 0) return true;
    }
    return false;
  }
  function editorError(m, s) {
    const t = xy(placeById(s, s.target));
    if (s.scenario === 'pin') return m.pin ? dist(m.pin, t) : 240;
    if (s.scenario === 'zoomto') return dist(m.c, t) + 100 * Math.abs(m.z - s.N);
    if (s.scenario === 'route') return routePoints(s).reduce((sum, p, i) => sum + dist(m.waypoints[i], p), 0) / s.stops.length;
    const pts = m.vertices;
    // Under three vertices there is no area yet: grade it as empty (the distance to one point or a segment would make
    // the first vertex of a right outline look worse than none).
    const misses = s.include.map((id) => {
      const p = xy(placeById(s, id));
      if (pts.length < 3) return boundaryDistance(p, []) + 24;
      return inPoly(p, pts) ? 0 : boundaryDistance(p, pts) + 24;
    });
    const spills = s.exclude.map((id) => {
      const p = xy(placeById(s, id));
      return pts.length >= 3 && inPoly(p, pts) ? boundaryDistance(p, pts) + 24 : 0;
    });
    return (misses.reduce((a, b) => a + b, 0) + spills.reduce((a, b) => a + b, 0)) / s.places.length
      + (!m.closed || pts.length < 3 ? 40 : 0) + (crosses(pts) ? 100 : 0);
  }
  function judgeError(m, s) {
    const a = s.judge.initial;
    if (!a) return 0;
    return dist(m.c, a.c) + 100 * Math.abs(m.z - a.z) + (m.sel !== a.sel ? 100 : 0)
      + (JSON.stringify([m.pin, m.waypoints, m.vertices, m.closed]) !== JSON.stringify([a.pin, a.waypoints, a.vertices, a.closed]) ? 100 : 0);
  }
  // The scenario's usual wording for naming a place (the pin wording for the editors), about the judged place.
  function judgeInstruction(s, rng) {
    const j = s.judge;
    const templates = EDITORS.includes(s.scenario) ? PIN_TEMPLATES : s.scenario === 'center' ? T.center : T.marker;
    return env.instruct.say(rng, env.instruct.phrase(rng, templates, { place: q(j.name) }, s.isplit),
      { isplit: s.isplit, terse: `Find ${j.name}` });
  }
  const PIN_TEMPLATES = [
    'Save a pin at {place}.', 'Mark the location of {place} on this map.', 'I need a saved map pin for {place}.',
    'A pin on the map belongs at {place}.'
  ];
  function editorInstruction(s, rng) {
    const t = placeById(s, s.target);
    const vars = { place: q(s.byAddress ? t.address : t.name), n: s.N,
      stops: s.stops.map((id) => q(placeById(s, id).name)).join(', then '),
      include: s.include.map((id) => q(placeById(s, id).address)).join(', '),
      exclude: s.exclude.map((id) => q(placeById(s, id).address)).join(', ') };
    const templates = {
      pin: PIN_TEMPLATES,
      route: [
        'Plan a route through {stops}, in that order.', 'The itinerary should visit {stops} in that order.',
        'Update this route to visit {stops}, following that sequence.',
        'For the route, the required stop order is {stops}.'
      ],
      zone: [
        'Set up a delivery zone covering {include}, excluding {exclude}.',
        'The delivery area should include {include} and leave {exclude} outside.',
        'Create a delivery zone containing {include} and none of {exclude}.',
        'Keep {exclude} outside the delivery area while enclosing {include}.',
        'I need {include} inside the delivery area, with {exclude} outside.',
        'Draw your delivery boundary to include {include} but not {exclude}.'
      ],
      zoomto: ['Set zoom level {n} and centre the map on {place}.', 'Show {place} in the centre of the map at level {n}.', 'I need a view centred on {place} at zoom level {n}.'],
    };
    return env.instruct.say(rng, env.instruct.phrase(rng, templates[s.scenario], vars, s.isplit), { isplit: s.isplit });
  }
  function editorPlan(m, s) {
    const t = xy(placeById(s, s.target));
    if (s.scenario === 'pin' && s.searchRoute && !m.searchDone) {
      if (!m.searchOpen || m.query !== placeById(s, s.target).address) return { type: [{ search: true }, placeById(s, s.target).address] };
      return { click: { suggestion: s.target } };
    }
    if (s.scenario === 'zoomto' && m.z !== s.N) return zoomStep(s, m.z < s.N ? 1 : -1);
    const panTo = (p) => m.tool !== 'pan' ? { click: { tool: 'pan' } }
      : { drag: [{ grab: [m.c[0] - p[0], m.c[1] - p[1]] }, { release: [m.c[0] - p[0], m.c[1] - p[1]] }] };
    const editStep = (step) => m.tool !== 'edit' ? { click: { tool: 'edit' } } : step;
    const onScreen = (p) => {
      const q = toPort(m, p), [w, h] = portOf(m);
      return q[0] >= 32 && q[0] <= w - 75 && q[1] >= 60 && q[1] <= h - 40;
    };
    if (s.scenario === 'zoomto') return panTo(t);
    if (s.scenario === 'pin') return onScreen(t) ? editStep({ click: { point: t } }) : panTo(t);
    if (s.scenario === 'route') {
      const goals = routePoints(s);
      const far = goals.map((p, k) => k).filter((k) => dist(m.waypoints[k], goals[k]) > s.tau);
      if (!far.length) return null;
      // Later markers are drawn on top: a waypoint under one cannot be grabbed (the drag would move the one on top, away
      // from its own stop), so move the uncovered ones first.
      const covered = (k) => m.waypoints.some((q, j) => j > k && dist(toPort(m, q), toPort(m, m.waypoints[k])) < 14);
      const i = far.find((k) => !covered(k)) ?? far[far.length - 1];
      if (!onScreen(m.waypoints[i])) return panTo(m.waypoints[i]);
      const [w, h] = portOf(m), p = toPort(m, goals[i]);
      // The next waypoint may be beyond the viewport: drag as far as the visible pane permits.
      const end = fromPort(m, [Math.max(50, Math.min(w - 85, p[0])), Math.max(60, Math.min(h - 65, p[1]))]);
      if (dist(end, m.waypoints[i]) < 4 / scaleOf(m.z)) return panTo(m.waypoints[i]);
      return editStep({ drag: [{ waypoint: i }, { point: end }] });
    }
    const outline = zoneOutline(s);
    if (m.closed || m.vertices.length > 4 || m.vertices.some((p, i) => dist(p, outline[i]) > 3)) return { click: { clear: true } };
    if (m.vertices.length === 4) return editStep({ click: { closeZone: true } });
    const p = outline[m.vertices.length];
    return onScreen(p) ? editStep({ click: { point: p } }) : panTo(p);
  }
  function solveEditor(s, m) {
    const t = xy(placeById(s, s.target));
    if (s.scenario === 'pin') return { ...m, pin: t, c: t, searchOpen: false };
    if (s.scenario === 'route') return { ...m, waypoints: routePoints(s) };
    if (s.scenario === 'zone') return { ...m, vertices: zoneOutline(s), closed: true };
    return { ...m, c: t, z: s.N };
  }
  // Values without ', ' (free-text replies split clauses there; words() makes the spellings equal); the original is an alias.
  function facts(m, s) {
    return rawFacts(m, s).map((f) => {
      const v = f.value.replace(/[,;.]\s+/g, ' ');
      return v === f.value ? f : { ...f, value: v, aliases: [f.value] };
    });
  }
  function rawFacts(m, s) {
    if (!EDITORS.includes(s.scenario)) {
      const nice = [10, 20, 50, 100, 200, 250, 500, 1000, 2000, 5000];
      const metres = nice.find((n) => n / (2 / scaleOf(m.z)) >= 70) || 5000;
      return [{ label: 'Level', value: String(m.z) }, { label: 'Scale', value: metres >= 1000 ? `${metres / 1000} km` : `${metres} m` }];
    }
    const st = editorStats(m, s);
    if (s.scenario === 'pin') return [s.byAddress ? { label: 'Nearest place', value: st.name } : { label: 'Street address', value: st.address }, { label: 'Coordinates', value: st.coordinates }];
    if (s.scenario === 'route') return [{ label: 'Route length', value: st.length }, { label: 'Stops', value: String(m.waypoints.length) }];
    if (s.scenario === 'zone') return [{ label: 'Covered addresses', value: String(st.covered) }, { label: 'Area', value: st.area }, { label: 'Boundary', value: m.closed ? 'Closed' : 'Draft' }];
    return [{ label: 'Centre coordinates', value: st.coordinates }, { label: 'Map scale', value: st.scale }];
  }
  // preempt=cancel: the view (centre) and zoom level, and what the task works on: the places (selected), the pin, the route
  // stops, the zone.
  function parts(m, s) {
    const out = [{ name: 'Map view', value: m.c.map(Math.round), aliases: ['Map centre', 'Map center', 'View', 'Map position'] },
      { name: 'Zoom level', value: m.z, aliases: ['Zoom', 'Map zoom'] }];
    const seen = new Set(out.map((x) => x.name));
    const add = (name, value, aliases) => { if (name && !seen.has(name)) { seen.add(name); out.push({ name, value, ...(aliases ? { aliases } : {}) }); } };
    if (s.scenario === 'pin') add('Pin', m.pin, ['Map pin']);
    else if (s.scenario === 'zone') add('Delivery zone', [m.vertices, m.closed], ['Zone', 'Delivery area']);
    else if (s.scenario === 'route') s.stops.forEach((id, i) => add(placeById(s, id).name, (m.waypoints || [])[i] || null));
    else if (s.scenario !== 'zoomto') s.places.forEach((p) => add(p.name, m.sel === p.id));
    return out;
  }
  function silent(next, prev, s, rng) {
    if (s.judge || s.scenario !== 'pin' || !next.pin || editorError(next, s) >= editorError(prev, s)) return null;
    const out = env.util.clone(next), t = placeById(s, s.target);
    const near = s.places.filter((p) => p.id !== t.id).sort((a, b) => dist(xy(a), xy(t)) - dist(xy(b), xy(t)));
    out.pin = xy(rng.pick(near.slice(0, 2)));
    return editorError(out, s) > s.tau ? out : null;
  }
  function retarget(spec, m, rng) {
    if (spec.judge) return null;
    const s = env.util.clone(spec);
    if (s.scenario === 'route') s.stops = s.stops.slice(1).concat(s.stops[0]);
    else if (s.scenario === 'zone') {
      s.column = s.column === 0 ? 2 : 0;
      s.include = s.places.filter((p) => p.col === s.column && p.row < s.rows).map((p) => p.id);
      s.exclude = s.places.filter((p) => !s.include.includes(p.id)).map((p) => p.id);
    } else {
      const candidates = rng.shuffle(s.places.filter((p) => p.id !== s.target));
      for (const p of candidates) {
        s.target = p.id;
        if (s.scenario === 'zoom') {
          if (p.minZoom < 3) continue;
          s.N = p.minZoom;
          s.hint.near = s.places.find((q) => q.id !== p.id && q.minZoom <= s.z0).name;
        }
        if (s.scenario === 'marker') { s.d0 = dist(s.c0, xy(p)); s.hint = { mode: 'district', district: p.district }; }
        if (error(m, s) > tolerance(s).tau) return s;
      }
      return null;
    }
    return error(m, s) > tolerance(s).tau ? s : null;
  }

  const lib = { inPoly, segDist, scaleOf, LEGACY };

  env.task({
    name: 'pan-map',
    files: ['world.js'],
    scenarios: SCENARIOS,
    startModes: ['off', 'partial', 'wrong', 'solved'],
    inputs: ['pointer', 'keyboard', 'wheel'],
    judgeModes: ['ambiguous', 'impossible'],
    facts, parts, silent, retarget,
    sample,
    init,
    error,
    tolerance,
    instruction,
    plan,
    solve,
    lib,
    helpers: {
      scaleOf,
      placeById,
      visible,
      toPort,
      panPx,
      zoomAt,
      wheelSteps,
      dragPx,
      select,
      inPoly, editorStats, routeGeometry, fromPort,
    },
  });
})();
