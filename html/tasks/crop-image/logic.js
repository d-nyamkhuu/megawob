/*
 * crop-image: move and resize a crop box so it frames a target.
 * Drag the handles of a crop box (or drag inside it to move it, or draw a new selection) so the box
 * frames a target. Port of legacy/crop.html, plus position / content naming, aspect-locked presets, marquee
 * selection, an in-app Apply step and keyboard nudging. No MiniWoB counterpart.
 *
 * All geometry is in normalized image coordinates: x and y run 0..1 across the image's width and
 * height, so a widget may render the image at any pixel size as long as it keeps spec.aspect.
 *
 * Scenarios
 *   default   the image shows 3-6 procedurally drawn objects; crop tightly around the one named by color and
 *             shape (target = its exact bounding box)
 *   outline   same image, plus a dashed rectangle drawn on it; match the crop box to the rectangle
 *   position  the target is named by where it is or how big it is ("the top-left object", "the object
 *             furthest to the right", "the largest shape"); only relations with a clear margin are used
 *   content   the image holds text signs (and shapes); crop to the sign that says "...", named by its text
 *   aspect    a ratio preset (1:1, 4:3, 16:9, 3:2, 2:3, 9:16) must be chosen; with a preset the box is locked to
 *             that ratio (corner handles only); target = the smallest box of that ratio centered on the object
 *   marquee   no selection at first: press on the image and drag to draw one (then handles and move work too)
 *   pan       the image is 1.4-2.4x larger than the window showing it (spec.zoom, spec.view = the visible
 *             fraction): find the object (the default naming), pan the view until it is in the window, then crop.
 *             Selection works as in marquee (off starts have none; a press outside the box draws one). Panning:
 *             the mouse wheel over the window (spec.panWheel: the episode allows wheel input; vertical wheel,
 *             Shift or deltaX = horizontal) and, always, a navigator thumbnail (click or drag it to centre the
 *             window there). The model keeps the window position in model.pan.
 * content scenario: the image holds 2-3 text signs and 1-2 face-like icons (kind 'face', yellow circle with an
 * expression: smiling, sad, surprised, winking, sunglasses, sleeping; spec.objects[i].expr); about 40% of the
 * episodes name a face icon ("the winking face icon"). Widgets draw them with taskDef.helpers.facePrims(expr).
 * Modes (any scenario): spec.apply (~30%): an in-app "Apply crop" button must be pressed after the crop is
 * right (any later change un-applies it); spec.keys (~25%): arrow keys nudge the focused box by 1 px (Shift:
 * 10 px), and in nudge episodes (spec.keyRoute) the oracle uses them; spec.bg.style: gradient, noise,
 * landscape, blobs or text (photo-like backgrounds, a caption or watermark).
 *
 * spec   { scenario, aspect (image width / height), bg: { hue, hue2, style, text, seed },
 *          objects: [{ kind ('shape' | 'label'), color, hex, shape, text?, sq: { x, y, w, h }, box: { l, t, r, b } }],
 *          goal (index into objects; null for outline), relation? (position scenario), ratio? (aspect),
 *          target: { l, t, r, b }, threshold (IoU), min: { w, h } (smallest crop size: 20 legacy px of the
 *          image as shown, in image fractions; pan too, where the image is zoom times the window), apply, keys,
 *          keyRoute, isplit, csplit, startMode, ood }
 *          sq is the object's cell (shapes: a square; labels: the sign's rectangle); box its tight bbox.
 *          pan adds: zoom { x, y } (image size / window size), view { w, h } (window as a fraction of the image),
 *          panWheel (wheel pans; otherwise the navigator is the way to pan)
 * model  { l, t, r, b, ratio ('free' | '1:1' ...; aspect only), on (marquee / pan: a selection exists),
 *          pan { x, y } (pan: the window's top-left corner in normalized image coords; unscored),
 *          applied (rect | null; apply mode), focus (keyboard focus on the box), px: { W, H } (rendered image
 *          size, mirrored by the widget for the keyboard plan) }
 * error  1 - IoU(model, target) (1 without a selection) + 0.3 when the aspect preset is wrong + 0.2 when an
 *        Apply is pending; tau = 1 - threshold (0.85 or 0.90 as in legacy; ood 0.92), sigma 0.25
 *
 * plan targets
 *   { handle, rect? }  handle 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' (that handle's position) or
 *                      'move' (the centre of the box); rect = where the handle sits on this rectangle
 *                      (omitted = the current crop box). A drag [{ handle: h, rect: A }, { handle: h, rect: B }]
 *                      moves handle h from its place on A to its place on B.
 *   { mark: [u, v] }   a point on the image (marquee: drag from one mark to another draws a selection)
 *   { preset: ratio }  the aspect preset button        { apply: true }  the in-app Apply button
 *   { view: true }     the centre of the image window (pan: wheel target)
 *   { nav: [u, v] }    the navigator thumbnail at the image point (u, v) (pan: click it to centre the window there)
 *   keys: { click: { handle: 'move' } } focuses the box, then { key: 'ArrowLeft' | 'Shift+ArrowLeft' ... }
 *
 * Start modes: off; partial (right size in the wrong place, or one corner right); wrong (the box frames another
 * object, the mirrored rectangle, the wrong preset, or a wrong crop already applied); solved.
 * Out of range (opts.ood): 7-9 smaller objects, threshold 0.92.
 * Levels (opts.level; spec.level is set for easy / medium only, normal is the task as it always was):
 *   easy    IoU threshold 0.70, 3 objects (pan 6) that are at least 84 px (of 560-880), no keyboard-nudge route, an
 *           off start 30% of the way to the target; the aspect / Apply penalties grow to tau + 0.1
 *   medium  IoU threshold 0.80, up to 4 objects (pan 7), objects at least 70 px, no nudge route
 *   Starts are still drawn at the normal distance from the target (3 x 0.15), so they stay clearly unsolved.
 * opts.traits.keys === false (a widget whose box has no keyboard nudging, e.g. the cropper widget): spec.keys is off.
 * image geometry (opt-in widget traits, every scenario unless noted; checked before any draw: a malformed value
 *   throws an Error, nothing is clamped; widgets without them sample exactly as before)
 *   aspect     number | [lo, hi]: the image's width / height, 0.6..2.4 (default: the legacy 560..880 x 380..540 px
 *              image, about 1.0..2.3). The legacy pixel area is kept and reshaped to this ratio, so spec.aspect
 *              follows it (to about 0.01); a [lo, hi] range is drawn per episode from rng.fork('aspect') (4
 *              decimals). pan: the window's width / height (the image behind it is zoomed as usual, so
 *              spec.aspect = that ratio * zoom.x / zoom.y).
 *   placement  'left' | 'right' | 'top' | 'bottom' | 'center' | { x, y, w, h } (image fractions): the part of the
 *              image the target lies in (the named object's box, the dashed outline, or the ratio box); the other
 *              objects still fill the whole image. spec.area = that part as { l, t, r, b }. Anchors: left / right
 *              = 55% of the width at that side, top / bottom = 60% of the height, center = the middle 60% x 60%.
 *              A rect must lie in 0..1 and span at least 0.4 x 0.4. The scene is redrawn from
 *              rng.fork('placement/<k>') streams until its target lies in the area; position names only a
 *              relation whose object lies in it (scenes with one are preferred; without, the object is named
 *              by color and shape), content only a sign or face icon in it.
 *   startBox   'full' | 'center' | { x, y, w, h } (image fractions, w and h at least 0.1): the crop box of off
 *              starts (not nudge episodes; not marquee or pan, which start without a selection): 'full' = the
 *              whole image (a cropper that opens on the full frame), 'center' = the middle 70% x 70%.
 *              spec.startBox = it as { l, t, r, b } (every scenario but marquee and pan). When it already frames
 *              the target too well (error under 3 tau) the usual random box is used instead.
 * opts.route: 'keyboard' forces the arrow-key nudge route (spec.keys + keyRoute) in the scenarios that have one
 * (not marquee / pan), 'pointer' forces pointer only; for pan 'wheel' makes the wheel the panning route and
 * 'pointer' the navigator (undefined = 50/50); ignored elsewhere.
 *
 * Round 2 hooks (optional, pure; see the html/kit/env.js header)
 *   facts(model, spec)       what the crop readout says at the end: "Crop size" ("W × H px" of the rendered image, which the
 *                            widget mirrors in model.px; [] without it or with no selection), "Crop x" and "Crop y" (the
 *                            readout's "at (x, y)", one number each) and "Crop status" ("Applied") in apply episodes.
 *                            aliases are other spellings of the value; label paraphrases go in labels.
 *   parts(model, spec)       preempt=cancel: "Crop size" and "Crop position" (the readout's two items; null before a marquee / pan
 *                            selection), "View" (pan: the visible window), "Aspect ratio" (aspect: the chosen preset) and, in apply episodes, "Applied crop"
 *                            (value: the applied rect or null).
 *   silent(next, prev, spec, rng)   the crop shrank: the box (and an applied copy) scales down about its top-left corner
 *                            by 4, 8, 12, 18, 26 or 36 px of width until error exceeds tau (ratio presets stay locked);
 *                            null with no selection, in judge episodes, or when no shrink does.
 *   retarget(spec, model, rng)   another thing to crop in the same scene: default / content / marquee / pan another object
 *                            (content: another sign or face), position another clear relation (spec.relation), aspect
 *                            another preset + object pair, outline a new dashed rectangle (spec.target; the widget draws
 *                            it from spec); null when the scene has no other target.
 *   judgeModes ambiguous, impossible, confirm (every scenario; spec.judge = { mode, message, text, templates, cands, others, what }):
 *     ambiguous   the default scenario's goal wording with "A or B" for the target (spec.judge.text): two objects of the image named
 *                 as the goal names them; the reply asks (status ask), one option per object (cands: [color shape], face names
 *                 or the sign text; others: the image's other objects, never offered)
 *     impossible  (status impossible naming what: the color + shape, sign text, 'dashed circle' or the ratio) an object that is not in the image (a color + shape, or a sign text for content), the dashed circle
 *                 (outline: only a dashed rectangle is drawn) or a ratio preset the toolbar lacks (aspect)
 *     confirm     (status confirm; judged() also checks the crop was not applied yet) the normal task, plus "but check with me before you press Apply" (apply episodes: the widgets call
 *                 ctx.flag('irreversible') on Apply; the Apply penalty is not scored in any judge episode and the oracle stops before
 *                 pressing it) or "before you submit" (the kit's end control)
 *
 * Helpers (widget API, env.taskDef.helpers): handlePoint(rect, handle) -> [x, y]; applyDrag(rect, handle, dx, dy,
 * spec) -> rect (rect.ratio set = aspect-locked corner drags; edge drags are no-ops when locked);
 * applyRatio(rect, ratio, spec) -> rect; marqueeRect(p, q, spec) -> rect | null; shapePoints(obj) -> polygon points
 * of a shape; ratioValue(ratio) -> number | null (null for 'free'); RATIOS (the preset names); nudge(model, key,
 * spec) -> model after that arrow key; facePrims(expr) -> [{ t: 'dot', x, y, r } | { t: 'line', pts, w } | { t: 'rect',
 * x, y, w, h }] features of a face icon in its unit square (ink colour FACE_INK).
 * lib (task-internal shared code): iou, inView(rect, pan, spec), rectOf, sameRect, the banks and scene helpers round2.js
 * reads; round2.js (listed in files, loaded after this one) adds DEFAULT_T, judgeOf, judgeInstruction, shrink and
 * otherTarget, the judge and round-2 code the hooks here call through lib. instructions.js adds instruction(spec, rng),
 * the goal wording for every scenario, called through lib by the instruction hook.
 * The self-test is in selftest.js (loaded by the checker and the node tests only).
 */
(function () {
  'use strict';

  const { clamp, isConfirm } = env.util;

  const COLORS = { red: '#e03131', blue: '#1c7ed6', green: '#2f9e44', orange: '#f76707',
    purple: '#7048e8', yellow: '#fab005', pink: '#e64980', teal: '#0ca678' };
  const SHAPES = ['circle', 'square', 'triangle', 'star', 'diamond'];
  const HANDLES = { nw: [0, 0], n: [0.5, 0], ne: [1, 0], e: [1, 0.5], se: [1, 1], s: [0.5, 1], sw: [0, 1], w: [0, 0.5], move: [0.5, 0.5] };
  const RATIOS = ['1:1', '4:3', '16:9', '3:2', '2:3', '9:16'];
  const SIGN_TEXTS = ['Fresh bread', 'Open late', 'Exit', 'Sale 30%', 'Parking', 'Coffee', 'Lost & found', 'Gate B',
    'Tickets', 'Free Wi-Fi', 'Library', 'No entry', 'Bike lane', 'Pharmacy', 'Platform 4', 'Help desk', 'Fish market',
    'Taxi', 'Room 214', 'Quiet zone', 'Lockers', 'Bakery', 'Pick-up', 'Recycling', 'Elevator', 'Cafe', 'Info',
    'Arrivals', 'Departures', 'Garden', 'Car wash', 'Museum', 'Toilets', 'First aid', 'Main hall', 'Studio 3',
    'Checkout', 'Returns', 'Bus stop', 'Florist', 'Books', 'Lunch 12-2', 'Open daily', 'Kiosk', 'Wet paint', 'Push',
    'Mind step', 'No smoking', 'Keep clear', 'Slow down', 'Sold out', 'Back at 2', 'Cash only', 'Fragile',
    'Queue here', 'Ring bell', 'Use ramp', 'Loading bay', 'Fire door', 'Stairs', 'Footpath', 'Detour', 'Ferry',
    'Campsite', 'Picnic area', 'Playground', 'Pool', 'Gym', 'Cinema', 'Arcade', 'Laundry', 'Barber', 'Tailor',
    'Shoe repair', 'Hardware', 'Toy shop', 'Pottery', 'Honey', 'Ice cream', 'Hot soup', 'Juice bar', 'Water tap',
    'Coat check', 'Live music', 'Rent a boat', 'Welcome', 'Wash hands', 'Wipe feet', 'No flash', 'Stay seated',
    'Shut gate', 'Low ceiling', 'Do not feed', 'Antiques', 'Fabrics', 'Rugs', 'Candles', 'Locksmith', 'Engraving',
    'Pretzels', 'Dumplings', 'Peaches', 'Spices', 'Last orders', 'Aquarium', 'Planetarium', 'Bowling', 'Archery',
    'Tennis', 'Board games', 'Bell tower', 'Courtyard', 'Toll bridge', 'Trail map', 'Viewpoint', 'Parcel drop',
    'Donations', 'Kennels', 'Auditions', 'Reserved', 'Alarm test', 'Wind chimes', 'Farm shop', 'Tea leaves', 'Noodles',
    'Fresh eggs', 'Berry jam', 'Olive oil', 'Wool yarn', 'Soap bars', 'Art prints', 'Tool hire', 'Photo booth',
    'Dance class', 'Craft fair', 'Puppet show', 'Greenhouse', 'Bandstand', 'Waterwheel', 'Lighthouse', 'Sand dunes',
    'Cave tours', 'Cable car', 'Airfield', 'Marina', 'Level 2', 'East wing', 'Hard hats', 'Sound horn', 'Switch off',
    'Lift lid', 'Hold rail', 'No drones', 'No glass', 'Class at 10', 'Daily menu', 'Mushrooms', 'Cider press'];
  const CAPTIONS = ['Summer 2024', 'Team offsite', 'Draft - do not share', 'Sample image', 'Northwind Studio',
    'Field notes', 'IMG_4821', 'Preview only', 'Spring market', 'Harbor view', 'Product shoot', 'Moodboard',
    'Autumn light', 'Crew portrait', 'Keep for review', 'Untitled frame', 'Travel journal', 'Color study',
    'Winter picnic', 'Old town rooftops', 'Ceramic session', 'Weekend archive', 'Golden hour', 'Behind the scenes',
    'Lot 08B', 'Proof copy', 'River bend', 'Family gathering', 'Frame 12 of 18', 'Late afternoon', 'Contact sheet',
    'Rainy window', 'Blue hour walk', 'Untitled study', 'Coastal morning', 'Paper lanterns', 'Garden textures',
    'A quiet Sunday', 'Glasshouse at noon', 'Maple Street dusk', 'Soft focus test', 'Weekend in June',
    'The long table', 'Light leaks', 'Portrait series 2', 'Cedar trail', 'Sunroom sketch', 'East pier fog',
    'Mosaic test', 'Linen and shade', 'Orchard path', 'After the rain', 'Studio take 4', 'Coastline log',
    'Birch shadows', 'Negative 18A', 'Canvas test', 'Ochre plaster wall', 'Old mill bridge', 'Daybook 2022',
    'Ferry deck view', 'Thread and timber', 'Lake study', 'Pine room portrait', 'Fog over slate', 'Quiet hillside',
    'Window seat 2', 'Evening grain', 'Blue linen test', 'October stills', 'Pebble shore 2', 'Dust on glass',
    'South window light', 'Lantern study', 'Morning on slate', 'Sunday negatives', 'Wool and window', 'Cedar room',
    'Soft rain film', 'Ink on linen', 'Courtyard light', 'Grain test B', 'Under glass', 'Coast in sepia',
    'Red roof study', 'Lightbox scan 2', 'Basin reflections', 'June roll 14', 'Paper and ash', 'The blue parcel',
    'Low tide notes', 'Film set 204', 'Haze on film', 'Orchard negatives', 'Velvet backdrop', 'Sunday at Lark',
    'Still frame 28'];
  const MIN_PX = 20; // legacy minimum crop size, in legacy image px
  const EPS = 0.002; // plan: an edge this close (normalized) counts as placed
  const RATIO_PENALTY = 0.3;
  const APPLY_PENALTY = 0.2;
  // Levels loosen tau; a wrong preset / pending Apply must still fail the episode, so the penalty stays above tau.
  const penalty = (spec, p) => (spec.level ? Math.max(p, 1 - spec.threshold + 0.1) : p);
  const WEIGHTS = { default: 2, outline: 1, position: 2, content: 2, aspect: 2, marquee: 2, pan: 2 };
  const FACE_EXPRS = ['smiling', 'sad', 'surprised', 'winking', 'sunglasses', 'sleeping'];
  const FACE_NAMES = { smiling: 'smiling face', sad: 'sad face', surprised: 'surprised face', winking: 'winking face',
    sunglasses: 'face with sunglasses', sleeping: 'sleeping face' };
  const FACE_COLOR = { color: 'yellow', hex: '#fcc419' };
  const FACE_INK = '#3b2f1a';
  const PAN_MARGIN = 0.07; // plan: keep drag points this far (fraction of the window) inside the window
  const r4 = (v) => Math.round(v * 1e4) / 1e4;

  // Image geometry traits (traits.aspect, traits.placement, traits.startBox).
  const ASPECT = [0.6, 2.4];
  const ANCHORS = { left: { x: 0, y: 0, w: 0.55, h: 1 }, right: { x: 0.45, y: 0, w: 0.55, h: 1 }, top: { x: 0, y: 0, w: 1, h: 0.6 },
    bottom: { x: 0, y: 0.4, w: 1, h: 0.6 }, center: { x: 0.2, y: 0.2, w: 0.6, h: 0.6 } };
  const MIN_AREA = 0.4;
  const STARTS = { full: { x: 0, y: 0, w: 1, h: 1 }, center: { x: 0.15, y: 0.15, w: 0.7, h: 0.7 } };
  const MIN_START = 0.1;
  const PLACEMENT_TRIES = 400;
  const fin = (v) => typeof v === 'number' && Number.isFinite(v);
  const show = (v) => (v === undefined ? 'undefined' : JSON.stringify(v));

  // A { x, y, w, h } rect in image fractions (validated) -> { l, t, r, b }.
  function fracRect(v, what, min) {
    const ok = v && typeof v === 'object' && !Array.isArray(v) && ['x', 'y', 'w', 'h'].every((k) => fin(v[k]))
      && v.x >= 0 && v.y >= 0 && v.w >= min && v.h >= min && v.x + v.w <= 1 + 1e-9 && v.y + v.h <= 1 + 1e-9;
    if (!ok) throw new Error(`crop: ${what} rect must be { x, y, w, h } in image fractions within 0..1 with w, h >= ${min} (got ${show(v)})`);
    return { l: r4(v.x), t: r4(v.y), r: r4(v.x + v.w), b: r4(v.y + v.h) };
  }

  // Validates the geometry traits; returns { aspect: null | number | [lo, hi], area, start } (rects or null).
  function imageGeometry(tr) {
    const out = { aspect: null, area: null, start: null };
    if (tr.aspect !== undefined) {
      const a = tr.aspect;
      const inR = (v) => fin(v) && v >= ASPECT[0] && v <= ASPECT[1];
      if (!(inR(a) || (Array.isArray(a) && a.length === 2 && inR(a[0]) && inR(a[1]) && a[0] <= a[1]))) {
        throw new Error(`crop: traits.aspect must be a number or [lo, hi] (lo <= hi) within ${ASPECT[0]}..${ASPECT[1]} (got ${show(a)})`);
      }
      out.aspect = a;
    }
    if (tr.placement !== undefined) {
      const p = tr.placement;
      if (typeof p === 'string') {
        if (!ANCHORS[p]) throw new Error(`crop: traits.placement must be 'left' | 'right' | 'top' | 'bottom' | 'center' or a { x, y, w, h } rect (got ${show(p)})`);
        out.area = fracRect(ANCHORS[p], 'traits.placement', MIN_AREA);
      } else out.area = fracRect(p, 'traits.placement', MIN_AREA);
    }
    if (tr.startBox !== undefined) {
      const s = tr.startBox;
      if (typeof s === 'string') {
        if (!STARTS[s]) throw new Error(`crop: traits.startBox must be 'full' | 'center' or a { x, y, w, h } rect (got ${show(s)})`);
        out.start = fracRect(STARTS[s], 'traits.startBox', MIN_START);
      } else out.start = fracRect(s, 'traits.startBox', MIN_START);
    }
    return out;
  }

  function iou(a, b) {
    const iw = Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l));
    const ih = Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));
    const inter = iw * ih;
    const area = (q) => (q.r - q.l) * (q.b - q.t);
    const union = area(a) + area(b) - inter;
    return union > 0 ? inter / union : 0;
  }

  const ratioValue = (ratio) => {
    if (!ratio || ratio === 'free') return null;
    const [a, b] = ratio.split(':').map(Number);
    return a / b;
  };

  // Outline of a shape inside its square cell (x, y, w, h), normalized. Circles and labels return null.
  function shapePoints(obj) {
    if (obj.kind === 'label') return null;
    const { x, y, w, h } = obj.sq;
    switch (obj.shape) {
      case 'circle': return null;
      case 'square': return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
      case 'triangle': return [[x + w / 2, y], [x + w, y + h], [x, y + h]];
      case 'diamond': return [[x + w / 2, y], [x + w, y + h / 2], [x + w / 2, y + h], [x, y + h / 2]];
      default: {
        const pts = [];
        for (let k = 0; k < 10; k++) {
          const a = -Math.PI / 2 + (k * Math.PI) / 5;
          const f = (k % 2 ? 0.4 : 1) / 2;
          pts.push([x + w / 2 + f * w * Math.cos(a), y + h / 2 + f * h * Math.sin(a)]);
        }
        return pts;
      }
    }
  }

  function bbox(obj) {
    const pts = shapePoints(obj);
    if (!pts) return { l: obj.sq.x, t: obj.sq.y, r: r4(obj.sq.x + obj.sq.w), b: r4(obj.sq.y + obj.sq.h) };
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    return { l: r4(Math.min(...xs)), t: r4(Math.min(...ys)), r: r4(Math.max(...xs)), b: r4(Math.max(...ys)) };
  }


  // Features of a face icon in its unit square (body = the inscribed circle), for any renderer.
  function facePrims(expr) {
    const arc = (cx, cy, r, a0, a1) => {
      const pts = [];
      for (let k = 0; k <= 10; k++) {
        const a = ((a0 + ((a1 - a0) * k) / 10) * Math.PI) / 180;
        pts.push([r4(cx + r * Math.cos(a)), r4(cy + r * Math.sin(a))]);
      }
      return pts;
    };
    const eyes = [{ t: 'dot', x: 0.36, y: 0.4, r: 0.065 }, { t: 'dot', x: 0.64, y: 0.4, r: 0.065 }];
    const smile = { t: 'line', pts: arc(0.5, 0.5, 0.24, 28, 152), w: 0.06 };
    switch (expr) {
      case 'sad': return [...eyes, { t: 'line', pts: arc(0.5, 0.78, 0.2, 208, 332), w: 0.06 }];
      case 'surprised': return [{ t: 'dot', x: 0.36, y: 0.38, r: 0.08 }, { t: 'dot', x: 0.64, y: 0.38, r: 0.08 }, { t: 'dot', x: 0.5, y: 0.7, r: 0.1 }];
      case 'winking': return [eyes[0], { t: 'line', pts: [[0.56, 0.4], [0.72, 0.4]], w: 0.06 }, smile];
      case 'sunglasses': return [{ t: 'rect', x: 0.18, y: 0.32, w: 0.29, h: 0.16 }, { t: 'rect', x: 0.53, y: 0.32, w: 0.29, h: 0.16 },
        { t: 'line', pts: [[0.47, 0.37], [0.53, 0.37]], w: 0.04 }, smile];
      case 'sleeping': return [{ t: 'line', pts: [[0.27, 0.42], [0.45, 0.42]], w: 0.055 }, { t: 'line', pts: [[0.55, 0.42], [0.73, 0.42]], w: 0.055 },
        { t: 'line', pts: [[0.42, 0.7], [0.58, 0.7]], w: 0.055 }];
      default: return [...eyes, smile];
    }
  }

  // Is rect inside the window at `pan` (with a margin of PAN_MARGIN of the window)?
  function inView(rect, pan, spec, margin = PAN_MARGIN) {
    const mx = margin * spec.view.w;
    const my = margin * spec.view.h;
    // At an image border the window cannot move further, so the margin does not apply there.
    const lo = (v, p, m) => v >= p + m || p <= 2e-3;
    const hi = (v, p, size, m) => v <= p + size - m || p + size >= 1 - 2e-3;
    return lo(rect.l, pan.x, mx) && hi(rect.r, pan.x, spec.view.w, mx) && lo(rect.t, pan.y, my) && hi(rect.b, pan.y, spec.view.h, my);
  }

  const C = env.content;

  // Legacy scene: objects placed in a W x H px image with 12 px margins and 16 px gaps, then normalized.
  // Shapes are squares of side d; labels (content scenario) are signs whose width follows their text.
  function sampleScene(rng, W, H, spec, opts) {
    const objects = [];
    const used = new Set();
    const px = [];
    let nObj = spec.scenario === 'pan' ? (opts.ood ? rng.int(10, 13) : rng.int(6, 10)) : opts.ood ? rng.int(7, 9) : rng.int(3, 6);
    // Levels: fewer objects (the least a scenario already has), and bigger ones.
    const lv = opts.level === 'easy' || opts.level === 'medium' ? opts.level : null;
    if (lv) nObj = Math.min(nObj, (spec.scenario === 'pan' ? 6 : 3) + (lv === 'easy' ? 0 : 1));
    const nLabels = spec.scenario === 'content' ? rng.int(2, Math.min(4, nObj - 1)) : 0;
    const nFaces = spec.scenario === 'content' ? Math.min(rng.int(1, 2), nObj - nLabels) : 0;
    const texts = nLabels ? C.sample(rng, SIGN_TEXTS, nLabels, spec) : [];
    const exprs = nFaces ? rng.sample(FACE_EXPRS, nFaces) : [];
    const dMax = opts.ood ? 110 : 150;
    const dMin = lv ? (lv === 'easy' ? 84 : 70) : opts.ood ? 44 : 56;
    for (let tries = 0; objects.length < nObj && tries < 600; tries++) {
      const color = rng.pick(Object.keys(COLORS));
      const isLabel = objects.filter((o) => o.kind === 'label').length < nLabels;
      const isFace = !isLabel && objects.filter((o) => o.kind === 'face').length < nFaces;
      let w;
      let h;
      let shape = null;
      let text = null;
      let expr = null;
      if (isFace) {
        expr = exprs[objects.filter((o) => o.kind === 'face').length];
        shape = 'circle';
        w = h = rng.int(dMin, dMax);
      } else if (isLabel) {
        text = texts[objects.filter((o) => o.kind === 'label').length];
        h = rng.int(40, 56);
        w = Math.round(text.length * h * 0.3 + h * 0.9);
      } else {
        shape = rng.pick(SHAPES);
        if (used.has(color + shape) || (nFaces && color === 'yellow' && shape === 'circle')) continue;
        w = h = rng.int(dMin, dMax);
      }
      if (w > W - 24 || h > H - 24) continue;
      const x = rng.int(12, W - w - 12);
      const y = rng.int(12, H - h - 12);
      if (px.some((p) => x < p.x + p.w + 16 && p.x < x + w + 16 && y < p.y + p.h + 16 && p.y < y + h + 16)) continue;
      if (shape && !isFace) used.add(color + shape);
      px.push({ x, y, w, h });
      const obj = { kind: isLabel ? 'label' : isFace ? 'face' : 'shape', color: isFace ? FACE_COLOR.color : color, hex: isFace ? FACE_COLOR.hex : COLORS[color], shape, text, ...(isFace ? { expr } : {}), sq: { x: r4(x / W), y: r4(y / H), w: r4(w / W), h: r4(h / H) } };
      obj.box = bbox(obj);
      objects.push(obj);
    }
    return objects;
  }

  // Position relations with a clear margin over the runner-up; null when none is clear.
  const RELATIONS = {
    leftmost: (b) => -(b.l + b.r) / 2, rightmost: (b) => (b.l + b.r) / 2, topmost: (b) => -(b.t + b.b) / 2,
    bottommost: (b) => (b.t + b.b) / 2, largest: (b) => (b.r - b.l) * (b.b - b.t), smallest: (b) => -(b.r - b.l) * (b.b - b.t),
    'top-left': (b) => -((b.l + b.r) / 2 + (b.t + b.b) / 2), 'bottom-right': (b) => (b.l + b.r) / 2 + (b.t + b.b) / 2,
    'top-right': (b) => (b.l + b.r) / 2 - (b.t + b.b) / 2, 'bottom-left': (b) => (b.t + b.b) / 2 - (b.l + b.r) / 2,
  };
  function clearRelations(objects) {
    const out = [];
    for (const [name, f] of Object.entries(RELATIONS)) {
      const scores = objects.map((o) => f(o.box));
      const order = scores.map((s, i) => [s, i]).sort((a, b) => b[0] - a[0]);
      const margin = name === 'largest' || name === 'smallest' ? Math.abs(order[0][0]) * 0.35 : 0.12;
      if (order.length > 1 && order[0][0] - order[1][0] >= margin) {
        const b = objects[order[0][1]].box;
        const cx = (b.l + b.r) / 2;
        const cy = (b.t + b.b) / 2;
        // Corner relations: the object must also sit in that quadrant.
        const ok = { 'top-left': cx < 0.5 && cy < 0.5, 'top-right': cx > 0.5 && cy < 0.5, 'bottom-left': cx < 0.5 && cy > 0.5, 'bottom-right': cx > 0.5 && cy > 0.5 }[name];
        if (ok === false) continue;
        out.push({ name, index: order[0][1] });
      }
    }
    return out;
  }

  // Smallest box of the ratio centered on b, shifted into the image; null if it does not fit.
  function ratioBox(b, ratio, aspect) {
    const rn = ratioValue(ratio) / aspect;
    const bw = b.r - b.l;
    const bh = b.b - b.t;
    let w = bw;
    let h = bw / rn;
    if (h < bh) {
      h = bh;
      w = bh * rn;
    }
    if (w > 0.98 || h > 0.98) return null;
    const cx = (b.l + b.r) / 2;
    const cy = (b.t + b.b) / 2;
    const l = clamp(cx - w / 2, 0, 1 - w);
    const t = clamp(cy - h / 2, 0, 1 - h);
    return { l: r4(l), t: r4(t), r: r4(l + w), b: r4(t + h) };
  }

  function handlePoint(rect, handle) {
    const [fx, fy] = HANDLES[handle];
    return [rect.l + fx * (rect.r - rect.l), rect.t + fy * (rect.b - rect.t)];
  }

  // The legacy crop mechanics: edges follow the pointer, clamped to the image and the minimum size;
  // 'move' translates the box, clamped to the image. With rect.ratio set (a preset), corner drags keep the
  // ratio about the opposite corner (the larger of the two pointer-implied sizes wins) and edge drags do
  // nothing.
  function applyDrag(rect, handle, dx, dy, spec) {
    const c = { l: rect.l, t: rect.t, r: rect.r, b: rect.b };
    const { w: mw, h: mh } = spec.min;
    const rv = ratioValue(rect.ratio);
    if (handle === 'move') {
      const w = c.r - c.l;
      const h = c.b - c.t;
      c.l = clamp(c.l + dx, 0, 1 - w);
      c.t = clamp(c.t + dy, 0, 1 - h);
      c.r = c.l + w;
      c.b = c.t + h;
    } else if (rv) {
      if (handle.length !== 2) return { ...c };
      const rn = rv / spec.aspect;
      const sx = handle.includes('e') ? 1 : -1;
      const sy = handle.includes('s') ? 1 : -1;
      const ax = sx > 0 ? c.l : c.r;
      const ay = sy > 0 ? c.t : c.b;
      let w = Math.max(c.r - c.l + sx * dx, (c.b - c.t + sy * dy) * rn);
      const wMax = Math.min(sx > 0 ? 1 - ax : ax, (sy > 0 ? 1 - ay : ay) * rn);
      w = clamp(w, Math.max(mw, mh * rn), wMax);
      const h = w / rn;
      c.l = sx > 0 ? ax : ax - w;
      c.r = sx > 0 ? ax + w : ax;
      c.t = sy > 0 ? ay : ay - h;
      c.b = sy > 0 ? ay + h : ay;
    } else {
      if (handle.includes('w')) c.l = clamp(c.l + dx, 0, c.r - mw);
      if (handle.includes('e')) c.r = clamp(c.r + dx, c.l + mw, 1);
      if (handle.includes('n')) c.t = clamp(c.t + dy, 0, c.b - mh);
      if (handle.includes('s')) c.b = clamp(c.b + dy, c.t + mh, 1);
    }
    return { l: r4(c.l), t: r4(c.t), r: r4(c.r), b: r4(c.b) };
  }

  // Choosing a preset reshapes the box to the ratio, keeping its center and area (fitted into the image).
  function applyRatio(rect, ratio, spec) {
    const rv = ratioValue(ratio);
    if (!rv) return { l: rect.l, t: rect.t, r: rect.r, b: rect.b };
    const rn = rv / spec.aspect;
    const area = (rect.r - rect.l) * (rect.b - rect.t);
    let w = Math.sqrt(area * rn);
    let h = w / rn;
    const k = Math.min(1, 1 / w, 1 / h);
    w *= k;
    h *= k;
    const l = clamp((rect.l + rect.r) / 2 - w / 2, 0, 1 - w);
    const t = clamp((rect.t + rect.b) / 2 - h / 2, 0, 1 - h);
    return { l: r4(l), t: r4(t), r: r4(l + w), b: r4(t + h) };
  }

  // Marquee: the rectangle spanned by two image points (clamped); null when smaller than the minimum.
  function marqueeRect(p, q, spec) {
    const l = clamp(Math.min(p[0], q[0]), 0, 1);
    const r = clamp(Math.max(p[0], q[0]), 0, 1);
    const t = clamp(Math.min(p[1], q[1]), 0, 1);
    const b = clamp(Math.max(p[1], q[1]), 0, 1);
    if (r - l < spec.min.w || b - t < spec.min.h) return null;
    return { l: r4(l), t: r4(t), r: r4(r), b: r4(b) };
  }

  const near = (a, b) => Math.abs(a - b) <= EPS;
  const sameRect = (a, b) => !!a && !!b && near(a.l, b.l) && near(a.t, b.t) && near(a.r, b.r) && near(a.b, b.b);
  const rectOf = (m) => ({ l: m.l, t: m.t, r: m.r, b: m.b });

  function baseError(model, spec) {
    if ((spec.scenario === 'marquee' || spec.scenario === 'pan') && !model.on) return 1;
    return 1 - iou(model, spec.target);
  }

  // Free-box plan (legacy): move when the size is right, else top-left then bottom-right.
  function freePlan(c, spec) {
    const t = spec.target;
    if (near(c.l, t.l) && near(c.t, t.t) && near(c.r, t.r) && near(c.b, t.b)) return null;
    if (near(c.r - c.l, t.r - t.l) && near(c.b - c.t, t.b - t.t)) {
      return { drag: [{ handle: 'move', rect: c }, { handle: 'move', rect: t }] };
    }
    if (!near(c.l, t.l) || !near(c.t, t.t)) {
      // The top-left handle reaches the target only if the box extends past it; otherwise open the box first.
      if (c.r - spec.min.w >= t.l && c.b - spec.min.h >= t.t) {
        return { drag: [{ handle: 'nw', rect: c }, { handle: 'nw', rect: t }] };
      }
      return { drag: [{ handle: 'se', rect: c }, { handle: 'se', rect: { ...c, r: 1, b: 1 } }] };
    }
    return { drag: [{ handle: 'se', rect: c }, { handle: 'se', rect: t }] };
  }

  // Aspect-locked plan: move the box so its top-left corner is on the target's, then drag the bottom-right
  // corner onto the target's (same ratio, so it lands exactly). Too-big boxes shrink first.
  function lockPlan(c, spec) {
    const T = spec.target;
    const cw = c.r - c.l;
    const ch = c.b - c.t;
    const Tw = T.r - T.l;
    const Th = T.b - T.t;
    if (near(cw, Tw) && near(ch, Th)) return { drag: [{ handle: 'move', rect: c }, { handle: 'move', rect: T }] };
    if (near(c.l, T.l) && near(c.t, T.t)) return { drag: [{ handle: 'se', rect: c }, { handle: 'se', rect: T }] };
    if (cw <= 1 - T.l + 1e-9 && ch <= 1 - T.t + 1e-9) {
      return { drag: [{ handle: 'move', rect: c }, { handle: 'move', rect: { l: T.l, t: T.t, r: T.l + cw, b: T.t + ch } }] };
    }
    return { drag: [{ handle: 'se', rect: c }, { handle: 'se', rect: { l: c.l, t: c.t, r: c.l + Tw, b: c.t + Th } }] };
  }

  // Keyboard nudge (box focused): 1 px per arrow, 10 px with Shift. Needs the rendered size (model.px).
  function nudgeKey(model, spec) {
    const { W, H } = model.px;
    const T = spec.target;
    const dx = (T.l - model.l) * W;
    const dy = (T.t - model.t) * H;
    const horiz = Math.abs(dx) >= Math.abs(dy);
    const d = horiz ? dx : dy;
    if (Math.abs(d) < 0.5) return null;
    const key = horiz ? (d > 0 ? 'ArrowRight' : 'ArrowLeft') : (d > 0 ? 'ArrowDown' : 'ArrowUp');
    return Math.abs(d) >= 7 ? `Shift+${key}` : key;
  }
  function nudge(model, key, spec) {
    const shift = key.startsWith('Shift+');
    const k = shift ? 10 : 1;
    const d = { ArrowRight: [k, 0], ArrowLeft: [-k, 0], ArrowDown: [0, k], ArrowUp: [0, -k] }[key.replace('Shift+', '')];
    if (!d || !model.px) return model;
    return { ...model, ...applyDrag(model, 'move', d[0] / model.px.W, d[1] / model.px.H, spec) };
  }

  const pickScenario = (rng, allowed) => env.util.pickWeighted(rng, allowed, WEIGHTS);

  // pan starts: a window position that does not show the whole target (the first thing to do is pan) ...
  function farPan(spec, rng) {
    const T = spec.target;
    const { w: vw, h: vh } = spec.view;
    for (let tries = 0; tries < 40; tries++) {
      const pan = { x: r4(rng.float(0, 1 - vw)), y: r4(rng.float(0, 1 - vh)) };
      if (!inView(T, pan, spec, 0.2)) return pan;
    }
    const cx = (T.l + T.r) / 2;
    const cy = (T.t + T.b) / 2;
    return { x: r4(cx < 0.5 ? 1 - vw : 0), y: r4(cy < 0.5 ? 1 - vh : 0) };
  }

  // ... and (partial / wrong) a box near the target, close enough that both fit in one window position.
  function panNearBox(spec, rng, mode, box, others) {
    const T = spec.target;
    const fits = (b) => Math.max(b.r, T.r) - Math.min(b.l, T.l) <= 0.78 * spec.view.w && Math.max(b.b, T.b) - Math.min(b.t, T.t) <= 0.78 * spec.view.h;
    if (mode === 'wrong' && others.length) {
      const near = others.map((i) => spec.objects[i].box).filter(fits);
      if (near.length) return { ...rng.pick(near) };
    }
    const Tw = T.r - T.l;
    const Th = T.b - T.t;
    const dx = 0.3 * spec.view.w;
    const dy = 0.3 * spec.view.h;
    for (let tries = 0; tries < 30; tries++) {
      const w = mode === 'partial' ? Tw : Tw * rng.float(0.6, 1.5);
      const h = mode === 'partial' ? Th : Th * rng.float(0.6, 1.5);
      const l = clamp(T.l + rng.float(-dx, dx), 0, 1 - w);
      const t = clamp(T.t + rng.float(-dy, dy), 0, 1 - h);
      const b = { l: r4(l), t: r4(t), r: r4(l + w), b: r4(t + h) };
      if (fits(b) && 1 - iou(b, T) > 3 * startTau(spec)) return b;
    }
    const w = Math.min(1 - T.l, Tw * 1.4);
    const h = Math.min(1 - T.t, Th * 1.4);
    return { l: T.l, t: T.t, r: r4(T.l + w), b: r4(T.t + h) };
  }

  // Pan guard: a drag is only issued when both of its points are inside the window; otherwise pan so that the
  // drag's bounding box is centred (the wheel when spec.panWheel, else a click on the navigator).
  function panGuard(step, model, spec) {
    if (!step || !step.drag) return step;
    const pts = step.drag.map((e) => (e.mark ? e.mark : handlePoint(e.rect || model, e.handle)));
    const hull = { l: Math.min(pts[0][0], pts[1][0]), t: Math.min(pts[0][1], pts[1][1]), r: Math.max(pts[0][0], pts[1][0]), b: Math.max(pts[0][1], pts[1][1]) };
    if (inView(hull, model.pan, spec)) return step;
    const { w: vw, h: vh } = spec.view;
    const want = { x: clamp((hull.l + hull.r) / 2 - vw / 2, 0, 1 - vw), y: clamp((hull.t + hull.b) / 2 - vh / 2, 0, 1 - vh) };
    if (spec.panWheel && model.px) {
      return { wheel: [{ view: true }, Math.round((want.y - model.pan.y) * model.px.H), Math.round((want.x - model.pan.x) * model.px.W)] };
    }
    return { click: { nav: [r4(want.x + vw / 2), r4(want.y + vh / 2)] } };
  }

  // The scene and its target: objects, goal (index), target rect, and the position relation / aspect ratio.
  // With an area ({ l, t, r, b }), only targets inside it: null when this scene has none (strict: position
  // also needs a clear relation inside it).
  function pickTarget(rng, W, H, spec, opts, area, strict) {
    const scenario = spec.scenario;
    const inA = (b) => !area || (b.l >= area.l && b.t >= area.t && b.r <= area.r && b.b <= area.b);
    const out = {};
    const objects = sampleScene(rng, W, H, spec, opts);
    const ok = objects.map((o, i) => (inA(o.box) ? i : -1)).filter((i) => i >= 0);
    // rng.pick over every index draws exactly as rng.int(0, n - 1).
    let goal = area ? rng.pick(ok) : rng.int(0, objects.length - 1);
    if (scenario === 'content') {
      const labels = objects.map((o, i) => (o.kind === 'label' && inA(o.box) ? i : -1)).filter((i) => i >= 0);
      const faces = objects.map((o, i) => (o.kind === 'face' && inA(o.box) ? i : -1)).filter((i) => i >= 0);
      if (faces.length && (!labels.length || rng.bool(0.4))) goal = rng.pick(faces);
      else if (labels.length) goal = rng.pick(labels);
      else if (area) return null;
    }
    if (scenario === 'position') {
      const rel = clearRelations(objects).filter((r) => inA(objects[r.index].box));
      if (rel.length) {
        const r = rng.pick(rel);
        out.relation = r.name;
        goal = r.index;
      } else if (strict) return null;
    }
    if (area && scenario !== 'outline' && goal === undefined) return null;
    let target = goal === undefined ? null : { ...objects[goal].box };
    if (scenario === 'outline') {
      if (!area) {
        const w = rng.int(110, Math.round(W * 0.55));
        const h = rng.int(90, Math.round(H * 0.6));
        const l = rng.int(12, W - w - 12);
        const t = rng.int(12, H - h - 12);
        target = { l: r4(l / W), t: r4(t / H), r: r4((l + w) / W), b: r4((t + h) / H) };
      } else {
        // The same draw inside the area (12 px from its edges).
        const ax = Math.ceil(area.l * W);
        const ay = Math.ceil(area.t * H);
        const ar = Math.floor(area.r * W);
        const ab = Math.floor(area.b * H);
        const wMax = Math.round(Math.min(W * 0.55, ar - ax - 24));
        const hMax = Math.round(Math.min(H * 0.6, ab - ay - 24));
        const w = rng.int(Math.min(110, wMax), wMax);
        const h = rng.int(Math.min(90, hMax), hMax);
        const l = rng.int(ax + 12, ar - w - 12);
        const t = rng.int(ay + 12, ab - h - 12);
        target = { l: r4(l / W), t: r4(t / H), r: r4((l + w) / W), b: r4((t + h) / H) };
      }
    }
    if (scenario === 'aspect') {
      // A ratio and an object whose ratio box fits in the image.
      const ratios = rng.shuffle(RATIOS);
      for (const ratio of ratios) {
        const fits = objects.map((o, i) => [i, ratioBox(o.box, ratio, spec.aspect)]).filter(([, b]) => b && inA(b));
        if (fits.length) {
          const [i, b] = rng.pick(fits);
          out.ratio = ratio;
          goal = i;
          target = b;
          break;
        }
      }
      if (!out.ratio) {
        if (area) return null;
        out.ratio = '1:1';
        target = ratioBox({ l: 0.4, t: 0.4, r: 0.5, b: 0.5 }, '1:1', spec.aspect);
      }
    }
    if (area && !inA(target)) return null;
    return { ...out, objects, goal, target };
  }

  // Tau the starts are drawn against: levels loosen the threshold but keep the usual distance of an off start.
  const startTau = (spec) => 1 - (spec.level ? 0.85 : spec.threshold);

  function planRaw(model, spec) {
    const tol = task.tolerance(spec);
    if (spec.scenario === 'aspect' && model.ratio !== spec.ratio) return { click: { preset: spec.ratio } };
    const base = baseError(model, spec);
    if (base <= tol.tau + 1e-9) {
      if (spec.apply && !isConfirm(spec) && !sameRect(model.applied, model)) return { click: { apply: true } };
      return null;
    }
    const T = spec.target;
    if (spec.scenario === 'marquee' || spec.scenario === 'pan') {
      // Draw a fresh selection when there is none, or when the current one is far off and the press point
      // is outside it (a press inside the box would move it).
      const inside = (p) => p[0] > model.l - 0.03 && p[0] < model.r + 0.03 && p[1] > model.t - 0.03 && p[1] < model.b + 0.03;
      if (!model.on) return { drag: [{ mark: [T.l, T.t] }, { mark: [T.r, T.b] }] };
      if (base > 0.6) {
        if (!inside([T.l, T.t])) return { drag: [{ mark: [T.l, T.t] }, { mark: [T.r, T.b] }] };
        if (!inside([T.r, T.b])) return { drag: [{ mark: [T.r, T.b] }, { mark: [T.l, T.t] }] };
      }
    }
    const c = rectOf(model);
    // Nudge with the keyboard when the size is right and the box is a few px off.
    if (spec.keyRoute && model.px && near(c.r - c.l, T.r - T.l) && near(c.b - c.t, T.b - T.t)) {
      const dpx = Math.abs(T.l - c.l) * model.px.W + Math.abs(T.t - c.t) * model.px.H;
      const key = dpx <= 70 ? nudgeKey(model, spec) : null;
      if (key) return model.focus ? { key } : { click: { handle: 'move' } };
    }
    if (ratioValue(model.ratio)) return lockPlan(c, spec);
    return freePlan(c, spec);
  }

  const lib = { iou, inView, rectOf, sameRect, COLORS, SHAPES, FACE_NAMES, SIGN_TEXTS, RATIOS, clearRelations, r4, ratioBox };

  const task = {
    name: 'crop-image',
    scenarios: ['default', 'outline', 'position', 'content', 'aspect', 'marquee', 'pan'],
    startModes: ['off', 'partial', 'wrong', 'solved'],
    judgeModes: ['ambiguous', 'impossible', 'confirm'],
    // Widget API (env.taskDef.helpers) and the task's shared code (lib, read by its self-test).
    helpers: { RATIOS, iou, shapePoints, handlePoint, applyDrag, applyRatio, marqueeRect, ratioValue, nudge, facePrims, FACE_INK },
    files: ['round2.js', 'instructions.js'],
    lib,

    inputs(spec) {
      const list = ['pointer'];
      if (spec && spec.keys) list.push('keyboard');
      if (spec && spec.panWheel) list.push('wheel');
      return list;
    },

    sample(rng, opts) {
      // Image geometry traits first: a malformed value throws before any draw.
      const geo = imageGeometry((opts && opts.traits) || {});
      const scenario = opts.scenario || pickScenario(rng, opts.scenarios && opts.scenarios.length ? opts.scenarios : this.scenarios);
      const spec = { scenario, isplit: opts.isplit || 'train', csplit: opts.csplit || 'train', startMode: opts.startMode || 'off', ood: !!opts.ood };
      let W = rng.int(560, 880);
      let H = rng.int(380, 540);
      if (geo.aspect !== null) {
        // traits.aspect: the same pixel area reshaped to the ratio (pan: the window's).
        const a = Array.isArray(geo.aspect) ? r4(rng.fork('aspect').float(geo.aspect[0], geo.aspect[1])) : geo.aspect;
        const px = W * H;
        W = Math.round(Math.sqrt(px * a));
        H = Math.round(W / a);
      }
      if (scenario === 'pan') {
        // The window shows W x H legacy px of an image zoom times larger.
        spec.zoom = { x: r4(rng.float(1.4, 2.4)), y: r4(rng.float(1.4, 2.4)) };
        spec.view = { w: r4(1 / spec.zoom.x), h: r4(1 / spec.zoom.y) };
        W = Math.round(W * spec.zoom.x);
        H = Math.round(H * spec.zoom.y);
      }
      const hue = rng.int(0, 359);
      spec.bg = { hue, hue2: (hue + rng.int(40, 140)) % 360, style: rng.pick(['gradient', 'gradient', 'noise', 'landscape', 'blobs', 'text']),
        seed: rng.int(1, 1e6), text: C.pick(rng, CAPTIONS, spec) };
      spec.aspect = r4(W / H);
      // 20 legacy px of the image as drawn (pan: W x H is already the zoomed image, so a pan target, 44+ px, never
      // falls below it).
      spec.min = { w: r4(MIN_PX / W), h: r4(MIN_PX / H) };
      spec.threshold = opts.ood ? 0.92 : rng.pick([0.85, 0.9]);
      // Levels: a looser IoU threshold (tau 0.30 easy, 0.20 medium; set in sample() once the scene is drawn).
      let pick = null;
      if (!geo.area) pick = pickTarget(rng, W, H, spec, opts, null);
      else {
        // The scene is redrawn on its own streams until the target lies in the placement area (position: with a
        // clear relation for the first half of the tries).
        spec.area = geo.area;
        for (let k = 0; !pick && k < PLACEMENT_TRIES; k++) pick = pickTarget(rng.fork(`placement/${k}`), W, H, spec, opts, geo.area, k < PLACEMENT_TRIES / 2);
        if (!pick) throw new Error(`crop: traits.placement: no ${scenario} scene with its target inside ${JSON.stringify(geo.area)}`);
      }
      const { objects, goal } = pick;
      let target = pick.target;
      if (pick.relation !== undefined) spec.relation = pick.relation;
      if (pick.ratio !== undefined) spec.ratio = pick.ratio;
      spec.objects = objects;
      spec.goal = scenario === 'outline' ? null : goal;
      spec.target = target;
      spec.apply = rng.bool(0.3);
      const keys = rng.bool(0.25);
      const keyRoute = keys && rng.bool(0.6);
      const noKeys = scenario === 'marquee' || scenario === 'pan' || (opts.traits && opts.traits.keys === false);
      // opts.route forces the nudge route (keyboard) or pointer only; the draws stay so seeds keep their content.
      spec.keys = !noKeys && (opts.route === 'keyboard' ? true : opts.route === 'pointer' ? false : keys);
      spec.keyRoute = spec.keys && (opts.route === 'keyboard' || keyRoute);
      if (scenario === 'pan') {
        const wheel = rng.bool(0.5);
        spec.panWheel = opts.route === 'wheel' ? true : opts.route === 'pointer' ? false : wheel;
      }
      if (geo.start && scenario !== 'marquee' && scenario !== 'pan') spec.startBox = geo.start;
      if (opts.level === 'easy' || opts.level === 'medium') {
        spec.level = opts.level;
        spec.threshold = opts.level === 'easy' ? 0.7 : 0.8;
        // Nudge starts sit a few px from the target: well inside the looser tolerance, so no keyboard route.
        spec.keyRoute = false;
      }
      if (task.judgeModes.includes(opts.judge)) {
        const j = lib.judgeOf(rng.fork('judge'), spec, opts.judge);
        if (j) spec.judge = j;
      }
      return spec;
    },

    // Legacy start box: 120 px .. W - 20 px wide, 100 px .. H - 20 px tall, anywhere in the image.
    init(spec, rng) {
      // ambiguous / impossible: nothing to change; the normal start supplies the unscored fields (pan, focus)
      if (spec.judge && !isConfirm(spec)) return task.solve(spec, task.init({ ...spec, judge: undefined }, rng));
      const mode = spec.startMode;
      const T = spec.target;
      const tau = startTau(spec);
      let box;
      // Clearly off: the legacy random box, redrawn until its IoU with the target is low.
      for (let tries = 0; tries < 40; tries++) {
        const w = rng.float(0.2, 0.97);
        const h = rng.float(0.24, 0.95);
        const l = rng.float(0, 1 - w);
        const t = rng.float(0, 1 - h);
        box = { l: r4(l), t: r4(t), r: r4(l + w), b: r4(t + h) };
        if (1 - iou(box, T) > 3 * tau) break;
      }
      const others = spec.objects.map((_, i) => i).filter((i) => i !== spec.goal);
      if (spec.keyRoute && mode === 'off') {
        // Nudge episode: the right size, a few px off.
        const Tw = T.r - T.l;
        const Th = T.b - T.t;
        for (let tries = 0; tries < 20; tries++) {
          const ox = (rng.bool(0.5) ? 1 : -1) * rng.float(0.02, 0.05);
          const oy = (rng.bool(0.5) ? 1 : -1) * rng.float(0.02, 0.05);
          const nl = clamp(T.l + ox, 0, 1 - Tw);
          const nt = clamp(T.t + oy, 0, 1 - Th);
          box = { l: r4(nl), t: r4(nt), r: r4(nl + Tw), b: r4(nt + Th) };
          if (1 - iou(box, T) > 2 * tau) break;
        }
      }
      // traits.startBox: the off start's box, unless it already frames the target too well.
      if (spec.startBox && mode === 'off' && !spec.keyRoute && 1 - iou(spec.startBox, T) > 3 * tau) box = { ...spec.startBox };
      if (spec.level === 'easy' && mode === 'off' && spec.scenario !== 'marquee' && spec.scenario !== 'pan') {
        // Easy: the off start is already part of the way to the target.
        const k = 0.3;
        const mix = (a, b) => r4(a + (b - a) * k);
        const pulled = { l: mix(box.l, T.l), t: mix(box.t, T.t), r: mix(box.r, T.r), b: mix(box.b, T.b) };
        // Keep it a box the handles can work on: moving one corner to the target must not squash it to a sliver.
        const room = 0.25;
        if (pulled.r - T.l > room && T.r - pulled.l > room && pulled.b - T.t > room && T.b - pulled.t > room) box = pulled;
      }
      if (mode === 'partial') {
        const Tw = T.r - T.l;
        const Th = T.b - T.t;
        if (rng.bool(0.5) || spec.scenario === 'aspect') {
          // Right size, wrong place.
          const nl = rng.float(0, 1 - Tw);
          const nt = rng.float(0, 1 - Th);
          box = { l: r4(nl), t: r4(nt), r: r4(nl + Tw), b: r4(nt + Th) };
        } else {
          // Top-left corner already right.
          box = { l: T.l, t: T.t, r: r4(rng.float(Math.min(1, T.r + 0.05), 1)), b: r4(rng.float(Math.min(1, T.b + 0.05), 1)) };
          if (box.r <= box.l + spec.min.w || box.b <= box.t + spec.min.h) box = { l: T.l, t: T.t, r: 1, b: 1 };
        }
      } else if (mode === 'wrong') {
        if (others.length && spec.scenario !== 'outline') {
          const o = spec.objects[rng.pick(others)];
          box = spec.scenario === 'aspect' ? (ratioBox(o.box, spec.ratio, spec.aspect) || { ...o.box }) : { ...o.box };
        } else {
          box = { l: r4(1 - T.r), t: r4(1 - T.b), r: r4(1 - T.l), b: r4(1 - T.t) };
        }
      }
      if (spec.scenario === 'pan' && mode !== 'off') box = panNearBox(spec, rng, mode, box, others);
      const m = { ...box, focus: false };
      if (spec.scenario === 'pan') m.pan = farPan(spec, rng);
      if (spec.scenario === 'aspect') {
        // Off / partial: free or the right preset; wrong: the right box under a wrong preset, or another object.
        m.ratio = mode === 'partial' ? spec.ratio : mode === 'wrong' && rng.bool(0.5) ? rng.pick(RATIOS.filter((r) => r !== spec.ratio)) : 'free';
        if (m.ratio !== 'free') Object.assign(m, applyRatio(m, m.ratio, spec));
        if (mode === 'wrong' && m.ratio !== 'free' && rng.bool(0.5)) Object.assign(m, applyRatio(T, m.ratio, spec));
      }
      if (spec.scenario === 'marquee' || spec.scenario === 'pan') m.on = mode !== 'off';
      if (spec.apply) m.applied = mode === 'wrong' ? rectOf(m) : null;
      return m;
    },

    error(model, spec) {
      let e = baseError(model, spec);
      if (spec.scenario === 'aspect' && model.ratio !== spec.ratio) e += penalty(spec, RATIO_PENALTY);
      if (spec.apply && !spec.judge && !sameRect(model.applied, model)) e += penalty(spec, APPLY_PENALTY);
      return e;
    },

    tolerance(spec) {
      const tau = Number((1 - spec.threshold).toFixed(2));
      if (spec.level) return { tau, sigma: 0.25 + tau, minInitialError: tau + 0.1 };
      return { tau, sigma: 0.25, minInitialError: spec.keyRoute ? 2 * tau : 3 * tau };
    },

    // confirm (the reply's status is graded by the kit): the question came before the crop was applied
    judged(model, spec) {
      return spec.judge.mode !== 'confirm' || !spec.apply || !sameRect(model.applied, model);
    },

    facts(model, spec) {
      if (!model.px || ((spec.scenario === 'marquee' || spec.scenario === 'pan') && !model.on)) return [];
      const { W, H } = model.px;
      const px = (v, s) => Math.round(v * s);
      const w = px(model.r - model.l, W);
      const h = px(model.b - model.t, H);
      const x = px(model.l, W);
      const y = px(model.t, H);
      const out = [
        { label: 'Crop size', value: `${w} × ${h} px`, aliases: [`${w}x${h}`, `${w} x ${h}`, `${w}×${h}`], labels: ['Size', 'Crop dimensions'] },
        // the readout shows "at (x, y)"; one number per fact, as a value with ', ' in it splits in a free-text reply
        { label: 'Crop x', value: String(x), labels: ['X', 'Crop left', 'Left'] },
        { label: 'Crop y', value: String(y), labels: ['Y', 'Crop top', 'Top'] },
      ];
      if (spec.apply && model.applied) out.push({ label: 'Crop status', value: 'Applied', aliases: ['Applied ✓'], labels: ['Status'] });
      return out;
    },

    // preempt=cancel: the readout's two items, the crop's size and position (null before a marquee / pan selection), the pan
    // window, the chosen ratio and, in apply episodes, the applied crop
    parts(model, spec) {
      const r4n = (x) => Number(x.toFixed(3));
      const none = (spec.scenario === 'marquee' || spec.scenario === 'pan') && !model.on;
      const out = [
        { name: 'Crop size', value: none ? null : [r4n(model.r - model.l), r4n(model.b - model.t)], aliases: ['Size', 'Dimensions', 'Width and height'] },
        { name: 'Crop position', value: none ? null : [r4n(model.l), r4n(model.t)], aliases: ['Position', 'Origin', 'Location', 'Offset'] },
      ];
      if (spec.scenario === 'pan' && model.pan) out.push({ name: 'View', value: [r4n(model.pan.x), r4n(model.pan.y)], aliases: ['Window', 'Visible area', 'Navigator'] });
      if (spec.scenario === 'aspect') out.push({ name: 'Aspect ratio', value: model.ratio || null, aliases: ['Ratio', 'Preset', 'Crop ratio'] });
      if (spec.apply) out.push({ name: 'Applied crop', value: model.applied ? [r4n(model.applied.l), r4n(model.applied.t), r4n(model.applied.r), r4n(model.applied.b)] : null, aliases: ['Applied'] });
      return out;
    },

    silent(next, prev, spec, rng) {
      if (spec.judge || ((spec.scenario === 'marquee' || spec.scenario === 'pan') && !next.on)) return null;
      const W = (next.px && next.px.W) || 700;
      const tau = task.tolerance(spec).tau;
      const start = rng.int(0, 2);
      const steps = [4, 8, 12, 18, 26, 36];
      for (let k = start; k < steps.length; k++) {
        const r = lib.shrink(next, steps[k], W);
        if (r.r - r.l < spec.min.w || r.b - r.t < spec.min.h) break;
        const out = { ...next, ...r };
        if (next.applied) out.applied = { ...r };
        if (task.error(out, spec) > tau) return out;
      }
      return null;
    },

    retarget(spec, model, rng) {
      if (spec.judge) return null;
      return lib.otherTarget(spec, model, rng);
    },

    instruction(spec, rng) {
      return lib.instruction(spec, rng);
    },

    plan(model, spec) {
      const step = planRaw(model, spec);
      return spec.scenario === 'pan' ? panGuard(step, model, spec) : step;
    },

    solve(spec, model) {
      const m = { ...(model || {}), ...spec.target };
      if (spec.scenario === 'aspect') m.ratio = spec.ratio;
      if (spec.scenario === 'marquee' || spec.scenario === 'pan') m.on = true;
      if (spec.apply) m.applied = { ...spec.target };
      return m;
    },
  };

  env.task(task);
})();
