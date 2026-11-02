/*
 * align-layout: drag and resize boxes until they line up, are evenly spaced or match a mockup.
 * Design-tool precision. Drag cards so their edges line up, space cards evenly, move and resize boxes
 * to match a mockup, drag table column dividers to given widths. Pure placement precision on a canvas: there
 * is no structure to exploit (no sort order, no grid snapping) and no readout of the quantity being judged.
 * Builds on the drag and resize primitives (a card moves by its body, a box resizes by a corner handle, a
 * column by its divider). MiniWoB counterpart: none (layout and design precision).
 *
 * Scenarios
 *   align    3-5 cards (easy 3, medium 3-4) stacked down (or spread across) a canvas. Drag them so their left /
 *            right edges or centres (top / bottom / middle for a horizontal guide) sit on a dashed guide line,
 *            or on the edge / centre of one locked "pinned" card. Only the aligned coordinate is graded;
 *            where a card ends up along the other axis is free
 *   spacing  3-5 cards in a row (or column) with different sizes along it. "equal": the first and last card
 *            are locked, drag the ones between so all gaps (edge to edge) are equal; "gap": the first card
 *            is locked, every gap between neighbours must be exactly N px
 *   mockup   a canvas with 2-4 labelled boxes and a small mockup thumbnail beside it (half scale, with the
 *            same rulers). Move and resize each box until it covers the mockup's box: IoU per box
 *   columns  a table header with 3-5 columns and cell chips of known width. Drag the column dividers until
 *            the columns have the given widths ("widths"), or each column just fits its widest cell with the
 *            stated padding on each side ("fit", the widest chip + 2 * pad). Dragging a divider changes the
 *            column on its left; the columns after it shift
 *
 * spec   { scenario, level, isplit, startMode, W, H (canvas, px), tau,
 *          align:   axis 'x' | 'y' (x: a vertical guide and x coordinates), edge 'min' | 'max' | 'mid',
 *                   anchor 'guide' | 'card', ref (index of the locked card, anchor 'card'), t (target coordinate),
 *          spacing: axis, mode 'equal' | 'gap', g (the target gap), p0 (first card's position along the axis),
 *          mockup:  boxes: [{ label, hue, tx, ty, tw, th }]   (target rect, canvas px; items[i] is a box too)
 *          columns: goal 'widths' | 'fit', names: [string], target: [px], cells: [[chip px]], pad, left
 *          items: [{ label, hue, s (size along the axis), cs (cross size), c (cross start), fix (locked rect) }] }
 *        Canvas coordinates are px with the origin at the canvas's top-left; the canvas is drawn 1:1.
 * model  { r: [{ x, y, w, h }] (one per item / box), cols: [px] (columns), z: unscored }
 * error  px-like task units. align: the largest |edge - t| over the movable cards. spacing: the largest
 *        |gap - g| when within tau, else 2 x the largest offset of a card from its solved place (p0, then
 *        size + g each), so placing a card never moves the error onto its neighbour's gap. columns: the largest |width - target| (fit: target = widest chip + 2 pad). mockup:
 *        100 * (1 - the smallest IoU over the boxes), so tau 12 means every box has IoU >= 0.88.
 *        tau: align / spacing 2, columns 3, mockup 12 (easy x2, medium x1.5, rounded).
 *
 * levels (opts.level): easy = fewer items, tau x2, and about half of the movable items already
 *        in place; medium = fewer items than normal, tau x1.5, one item already in place; normal unchanged.
 * start modes: off (every movable item clearly off), partial (some already in place), wrong (near misses, or
 *        a consistent but wrong arrangement: align all on a common wrong coordinate; spacing equal gaps of
 *        the wrong size / small alternating errors; columns off by 10-22 px; mockup right size, offset),
 *        solved.
 * inputs: pointer only.
 *
 * Widget traits (opts.traits): cell n (px): the widget lays its widgets on a grid of n-px cells (n divides the canvas,
 * 5 or 10). sample() snaps every size, position and target of align, spacing and mockup to the grid after the
 * normal draws (no new rng draws; spec.cell = n), so each goal is reachable with snapping widgets, and init() snaps
 * the start rects. noOverlap (spacing, mockup): a widget whose widgets push each other aside. mockup start boxes never
 * overlap each other, and the plan of spacing and mockup only drags a card or box along a path that is free of
 * every other one (it moves the outermost cards first); spec.noOverlap. columns ignores both. Without the traits
 * episodes are exactly as before.
 *
 * Round 2 hooks (optional, pure; see the html/kit/env.js header)
 *   facts(model, spec)       what the page shows once solved, as a person reports it back: align "Cards aligned" and the
 *                            first card (top / leftmost); spacing "Cards" and the last card; mockup "Boxes placed" and
 *                            "Largest box"; columns "Columns" and "Widest column" (counts and labels read off the page,
 *                            not the instruction's px values: the page has rulers but no readout of the judged quantity).
 *                            Label paraphrases go in labels.
 *   parts(model, spec)       preempt=cancel: each card / box by its label (value: its rect) or column (value: its width).
 *   silent(next, prev, spec, rng)   the item (or column divider) the last update moved did not stick quite right: it ends
 *                            one or two cells (10-24 px) off along the graded axis (mockup: a box shifted until
 *                            IoU falls below the tolerance); null in judge episodes or when nothing moved.
 *   retarget(spec, model, rng)   align (guide anchor): a new guide position or another edge; (card anchor): another edge of the
 *                            locked card; spacing 'gap': another gap; mockup: the layout mirrored left-right or top-bottom;
 *                            columns 'widths': new widths. null for spacing 'equal' and columns 'fit' (their goal is fixed by
 *                            locked cards / cell content) and in judge episodes.
 *   judgeModes ambiguous, impossible (confirm has no irreversible step; spec.judge = { mode, message, templates, vars, cands, others, what })
 *     impossible  the page starts solved; the instruction asks for a value off the canvas (align: a coordinate past the
 *                 canvas; spacing: a gap that cannot fit; mockup: a box that does not exist; columns: a column that
 *                 does not exist); status impossible, what names the value or the missing thing (spec.judge.what)
 *     ambiguous   the page starts solved and two cards / boxes / columns carry the same name; the instruction moves "the
 *                 <name> card"; the reply asks, with one option per same-named thing (cands: the name twice;
 *                 others: the page's other names, never offered)
 *
 * plan targets (the widget's locate() maps them to viewport px; dx, dy are canvas px, 1:1 with viewport px)
 *   { grab: i, dx?, dy? }              the visible body of card / box i, plus an offset (the drop point)
 *   { handle: i, h: 'se', dx?, dy? }   a corner handle of box i (nw ne se sw), plus an offset
 *   { div: c, dx? }                    the divider on the right edge of column c, plus an offset
 * plan steps: { drag: [from, to] } where `to` is the same target with the offset the pointer ends at; the
 *        displacement is to.dx - from.dx (the grab point itself is the widget's choice). Moves are clamped to the
 *        canvas, box sizes to >= 24 px, columns to >= 40 px, as in the helpers below.
 *
 * Helpers (widget API, env.taskDef.helpers):
 *   moveRect(spec, rect, dx, dy) move a rect within the canvas.
 *   resizeRect(spec, rect, handle, dx, dy) resize from a corner within the canvas.
 *   setCol(spec, cols, c, w) set a column width, keeping its divider on the canvas.
 *   colLeft(cols, c) the column's left edge, in canvas px.
 *   locked(spec, i) whether an item is pinned.
 *   MIN_BOX minimum box side, 24 px.
 *
 * Files: scenarios/<scenario>.js own sampling, starts, scoring, plans and solved states;
 * shared geometry and sampling helpers live on lib. Checks live in selftest.js.
 */
(function () {
  'use strict';

  const { quote, clamp } = env.util;

  const I = env.instruct;
  const even = (n) => Math.round(n / 2) * 2;
  const sum = (xs) => xs.reduce((a, b) => a + b, 0);

  const MIN_BOX = 24;
  const MIN_COL = 40;
  const MARGIN = 14;

  const LABELS = ['Revenue', 'Orders', 'Users', 'Traffic', 'Refunds', 'Uptime', 'Tasks', 'Alerts', 'Notes', 'Calendar',
    'Profile', 'Billing', 'Inbox', 'Stats', 'Goals', 'Reports', 'Search', 'Activity', 'Messages', 'Devices', 'Teams',
    'Support', 'Settings', 'Storage', 'Security', 'History', 'Queue', 'Drafts', 'Archive', 'Feedback', 'Widgets',
    'Trends', 'Sources', 'Regions', 'Catalog', 'Pipeline', 'Access', 'Roles', 'Events', 'Projects', 'Assets',
    'Imports', 'Exports', 'Forms', 'Boards', 'Tags', 'Themes', 'Network', 'Home', 'Leads', 'Deals', 'Quotes',
    'Vendors', 'Partners', 'Coupons', 'Products', 'Services', 'Reviews', 'Ratings', 'Comments', 'Replies', 'Posts',
    'Pages', 'Media', 'Library', 'Files', 'Uploads', 'Snippets', 'Variants', 'Funnels', 'Sessions', 'Segments',
    'Cohorts', 'Roadmap', 'Sprints', 'Releases', 'Surveys', 'Domains'];

  // ---------------------------------------------------------------- geometry (shared with widgets)

  const locked = (spec, i) => !!spec.items[i].fix;

  // Move a rect by (dx, dy), kept inside the canvas.
  function moveRect(spec, r, dx, dy) {
    return { x: clamp(Math.round(r.x + dx), 0, spec.W - r.w), y: clamp(Math.round(r.y + dy), 0, spec.H - r.h), w: r.w, h: r.h };
  }

  // Drag corner handle `h` ('nw' 'ne' 'se' 'sw') of a rect by (dx, dy): the opposite corner stays.
  function resizeRect(spec, r, h, dx, dy) {
    let l = r.x;
    let t = r.y;
    let rt = r.x + r.w;
    let b = r.y + r.h;
    if (h.includes('w')) l = clamp(Math.round(l + dx), 0, rt - MIN_BOX);
    else rt = clamp(Math.round(rt + dx), l + MIN_BOX, spec.W);
    if (h.includes('n')) t = clamp(Math.round(t + dy), 0, b - MIN_BOX);
    else b = clamp(Math.round(b + dy), t + MIN_BOX, spec.H);
    return { x: l, y: t, w: rt - l, h: b - t };
  }

  const colLeft = (cols, c) => sum(cols.slice(0, c));

  // Set column c's width (the columns after it shift); the table clips at spec.W.
  function setCol(spec, cols, c, w) {
    const out = cols.slice();
    out[c] = clamp(Math.round(w), MIN_COL, Math.max(MIN_COL, spec.W - colLeft(cols, c) - 4));
    return out;
  }

  const iou = (a, b) => {
    const ix = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
    const iy = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
    const i = ix * iy;
    const u = a.w * a.h + b.w * b.h - i;
    return u > 0 ? i / u : 0;
  };
  const targetRect = (b) => ({ x: b.tx, y: b.ty, w: b.tw, h: b.th });

  // Along-axis coordinate of a card's edge / centre (axis 'x': x, else y).
  function edgeOf(spec, r) {
    const p = spec.axis === 'x' ? r.x : r.y;
    const s = spec.axis === 'x' ? r.w : r.h;
    return spec.edge === 'min' ? p : spec.edge === 'max' ? p + s : p + s / 2;
  }
  const alongPos = (spec, val, s) => (spec.edge === 'min' ? val : spec.edge === 'max' ? val - s : val - s / 2);
  // Rect of item i with its along-axis start at p.
  function rectAt(spec, i, p) {
    const it = spec.items[i];
    return spec.axis === 'x' ? { x: p, y: it.c, w: it.s, h: it.cs } : { x: it.c, y: p, w: it.cs, h: it.s };
  }
  const startOf = (spec, r) => (spec.axis === 'x' ? r.x : r.y);
  const sizeOf = (spec, r) => (spec.axis === 'x' ? r.w : r.h);

  // Gaps (edge to edge, in item order) of the spacing scenario.
  function gapsOf(spec, model) {
    const out = [];
    for (let i = 0; i + 1 < model.r.length; i++) out.push(startOf(spec, model.r[i + 1]) - startOf(spec, model.r[i]) - sizeOf(spec, model.r[i]));
    return out;
  }

  const fitTarget = (spec) => spec.names.map((_, c) => Math.max(...spec.cells.map((row) => row[c])) + 2 * spec.pad);

  // ---------------------------------------------------------------- grid traits (cell, noOverlap)

  const snapTo = (v, q) => Math.round(v / q) * q;
  const cellOf = (opts) => {
    const c = opts && opts.traits && opts.traits.cell;
    return c > 1 ? c : 0;
  };
  const rectsOverlap = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

  // Range of the guide / reference coordinate t for the current item sizes (the sampler's bounds).
  function tRange(spec) {
    const L = spec.axis === 'x' ? spec.W : spec.H;
    const maxs = Math.max(...spec.items.map((it) => it.s));
    const lo = spec.edge === 'min' ? MARGIN : spec.edge === 'max' ? maxs + MARGIN : maxs / 2 + MARGIN;
    const hi = spec.edge === 'min' ? L - maxs - MARGIN : spec.edge === 'max' ? L - MARGIN : L - maxs / 2 - MARGIN;
    return [Math.ceil(lo), Math.floor(hi)];
  }

  // Snap a sampled spec to a grid of q px (spec.cell = q). Throws when the snapped spec does not fit (the sampler
  // draws again).
  function quantSpec(spec, q) {
    if (spec.W % q || spec.H % q) throw new Error(`layout: traits.cell ${q} must divide the ${spec.W} x ${spec.H} canvas`);
    spec.cell = q;
    const v = spec.scenario;
    if (v === 'align') {
      const n = spec.items.length;
      const crossLen = spec.axis === 'x' ? spec.H : spec.W;
      const unit = spec.edge === 'mid' ? 2 * q : q; // a centre lands on the grid only for sizes of two cells
      const band = Math.floor(crossLen / q / n) * q; // each card has its own band across the canvas: no overlaps
      spec.items.forEach((it, i) => {
        it.s = Math.max(unit, snapTo(it.s, unit));
        it.cs = Math.max(q, Math.min(band - q, snapTo(it.cs, q)));
        it.c = i * band + Math.round((band - it.cs) / (2 * q)) * q;
      });
      const [lo, hi] = tRange(spec);
      spec.t = Math.min(Math.floor(hi / q) * q, Math.max(Math.ceil(lo / q) * q, snapTo(spec.t, q)));
      if (spec.anchor === 'card') spec.items[spec.ref].fix = rectAt(spec, spec.ref, alongPos(spec, spec.t, spec.items[spec.ref].s));
    } else if (v === 'spacing') {
      const n = spec.items.length;
      const L = spec.axis === 'x' ? spec.W : spec.H;
      for (const it of spec.items) {
        it.s = Math.max(2 * q, snapTo(it.s, q));
        it.cs = Math.max(2 * q, snapTo(it.cs, q));
        it.c = Math.max(0, snapTo(it.c, q));
      }
      const total = sum(spec.items.map((it) => it.s));
      let g = Math.max(q, snapTo(spec.g, q));
      while (g > q && total + (n - 1) * g > L - 2 * q) g -= q;
      if (total + (n - 1) * g > L - 2 * q) throw new Error('layout spacing: the grid does not fit');
      spec.g = g;
      const span = total + (n - 1) * g;
      spec.p0 = Math.max(q, Math.min(snapTo(spec.p0, q), L - q - span));
      let p = spec.p0;
      spec.items.forEach((it, i) => {
        it.fix = i === 0 || (spec.mode === 'equal' && i === n - 1) ? rectAt(spec, i, p) : null;
        p += it.s + spec.g;
      });
    } else if (v === 'mockup') {
      for (const b of spec.boxes) {
        const x0 = snapTo(b.tx, q);
        const y0 = snapTo(b.ty, q);
        b.tw = Math.max(3 * q, snapTo(b.tx + b.tw, q) - x0);
        b.th = Math.max(3 * q, snapTo(b.ty + b.th, q) - y0);
        b.tx = x0;
        b.ty = y0;
      }
      spec.boxes.forEach((a, i) => {
        if (a.tx < 0 || a.ty < 0 || a.tx + a.tw > spec.W || a.ty + a.th > spec.H) throw new Error('layout mockup: snapped box off the canvas');
        spec.boxes.forEach((b, j) => { if (j > i && rectsOverlap(targetRect(a), targetRect(b))) throw new Error('layout mockup: snapped boxes overlap'); });
      });
    }
  }

  // Snap a start model to the grid (rect positions; mockup sizes too).
  function quantModel(model, spec) {
    const q = spec.cell;
    const r = model.r.map((rect, i) => {
      if (locked(spec, i)) return rect;
      const w = spec.scenario === 'mockup' ? Math.max(3 * q, snapTo(rect.w, q)) : rect.w;
      const h = spec.scenario === 'mockup' ? Math.max(3 * q, snapTo(rect.h, q)) : rect.h;
      return { x: clamp(snapTo(rect.x, q), 0, spec.W - w), y: clamp(snapTo(rect.y, q), 0, spec.H - h), w, h };
    });
    return { ...model, r };
  }

  // ---------------------------------------------------------------- error

  function errorOf(model, spec) {
    return V[spec.scenario].error(model, spec);
  }

  // ---------------------------------------------------------------- sampling

  const TAU = { align: 2, spacing: 2, columns: 3, mockup: 12 };
  const LEVEL_TAU = { easy: 2, medium: 1.5, normal: 1 };

  // Fraction of the movable items that start in place, by level (normal: none). Drawn from rng.fork('level').
  function placedCount(spec, movable, rng) {
    const lv = spec.level;
    if (lv === 'normal' || movable < 2) return 0;
    const k = lv === 'medium' ? 1 : Math.floor(movable / 2);
    return Math.min(k, movable - 1) * (rng.bool(0.85) ? 1 : 0);
  }

  function baseSpec(scenario, rng, opts) {
    const level = opts.level === 'easy' || opts.level === 'medium' ? opts.level : 'normal';
    return { scenario, level, isplit: opts.isplit || 'train', startMode: opts.startMode || 'off',
      tau: Math.round(TAU[scenario] * LEVEL_TAU[level]) };
  }

  // ---------------------------------------------------------------- plan steps that never cross another item (noOverlap)

  const bbox = (a, b) => ({ x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.max(a.x + a.w, b.x + b.w) - Math.min(a.x, b.x), h: Math.max(a.y + a.h, b.y + b.h) - Math.min(a.y, b.y) });
  const clear = (model, i, region) => model.r.every((o, k) => k === i || !rectsOverlap(region, o));

  function planOf(model, spec) {
    if (errorOf(model, spec) <= spec.tau) return null;
    return V[spec.scenario].plan(model, spec);
  }

  function solveOf(spec, model) {
    return V[spec.scenario].solve(spec, model);
  }

  // Model-space effect of a plan step (what the base widget does); used by selftest.js.
  function simulate(model, spec, step) {
    const [a, b] = step.drag;
    const dx = (b.dx || 0) - (a.dx || 0);
    const dy = (b.dy || 0) - (a.dy || 0);
    const m = { ...model, r: model.r.map((r) => ({ ...r })), cols: model.cols.slice() };
    if (a.grab !== undefined) { if (!locked(spec, a.grab)) m.r[a.grab] = moveRect(spec, m.r[a.grab], dx, dy); }
    else if (a.handle !== undefined) m.r[a.handle] = resizeRect(spec, m.r[a.handle], a.h, dx, dy);
    else m.cols = setCol(spec, m.cols, a.div, m.cols[a.div] + dx);
    return m;
  }

  // ---------------------------------------------------------------- instructions

  const T = {
    alignGuide: ['Align the {what} of all the cards with {to}.', 'Drag the cards so that their {what} line up with {to}.',
      'Line up the {what} of every card with {to}.', 'Move the cards until their {what} sit exactly on {to}.',
      'Make the {what} of the cards flush with {to}.',
      'Use {to} to line up the {what} of all cards.',
      'All cards need their {what} aligned exactly with {to}.'],
    alignCard: ['Align the {what} of the other cards with {to}.', 'Drag the cards so that their {what} line up with {to}.',
      'Line up the {what} of every unlocked card with {to}.', 'Move the other cards until their {what} match {to}.',
      'Use {to} to align all the other cards by their {what}.'],
    spacingEqual: ['Space the cards evenly: the gaps between neighbouring cards should all be equal.',
      'Distribute the cards so the gap between each pair of neighbours is the same. The first and last stay put.',
      'Make the spacing between the cards equal (edge to edge); leave the locked end cards where they are.',
      'Even out the gaps between the cards.',
      'The end cards stay fixed. Keep card order and equal gaps between neighbouring edges.'],
    spacingGap: ['Set the gap between each pair of neighbouring cards to {g} px.', 'Space the cards {g} px apart, edge to edge.',
      'Every card should be exactly {g} px from the next one. Leave the locked card where it is.',
      'Arrange the cards with a {g} px gap between neighbours.',
      'Keep order and first card fixed, with {g} px edge gaps.',
      'Follow card order from the fixed first card, with {g} px edge gaps.'],
    mockup: ['Match the layout to the mockup: move and resize the boxes so each covers the same area as in the thumbnail.',
      'Rebuild the mockup on the canvas. Each box must end up where, and as big as, it is in the thumbnail.',
      'Make the canvas look like the mockup next to it (same position and size for every box).',
      'Move and resize the boxes to reproduce the mockup layout.',
      'Use mockup rulers to place and size each labelled box on the canvas to match its counterpart.',
      'Recreate every labelled box from the mockup at its ruler position and size on the canvas.',
      'Follow the ruler scale: give each box its mockup position, width, and height.'],
    widths: ['Set the column widths to {spec} (px).', 'Resize the columns: {spec}.', 'Drag the column dividers so the widths are {spec} px.',
      'Make the columns {spec} px wide.',
      'Column widths in px: {spec}.',
      'Use {spec} as the column widths in px.',
      'Each column has a target width (px): {spec}.',
      'Match these column widths (px): {spec}.'],
    fit: ['Resize every column to fit its widest cell (ignore the header), with {pad} px of padding on each side.',
      'Fit each column to its longest cell, leaving {pad} px left and right of it.',
      'Make each column exactly as wide as its widest cell plus {pad} px of padding on each side.'],
  };

  const WHAT = { 'x-min': 'left edges', 'x-max': 'right edges', 'x-mid': 'horizontal centres', 'y-min': 'top edges', 'y-max': 'bottom edges', 'y-mid': 'vertical centres' };

  function instructionOf(spec, rng) {
    if (spec.judge) return judgeInstruction(spec, rng);
    const fill = (key, vars) => I.fill(I.pick(rng, T[key], spec.isplit), vars);
    let core;
    let terse;
    let steps;
    if (spec.scenario === 'align') {
      const what = WHAT[`${spec.axis}-${spec.edge}`];
      if (spec.anchor === 'guide') {
        const to = rng.pick([`the dashed ${spec.axis === 'x' ? 'vertical' : 'horizontal'} guide`, 'the dashed guide line', 'the guide']);
        core = fill('alignGuide', { what, to });
        terse = `${what} on the guide`;
      } else {
        const label = spec.items[spec.ref].label;
        core = fill('alignCard', { what, to: rng.pick([`the locked ${quote(label)} card`, `the pinned ${quote(label)} card`]) });
        terse = `${what} to ${label}`;
      }
    } else if (spec.scenario === 'spacing') {
      core = spec.mode === 'equal' ? fill('spacingEqual', {}) : fill('spacingGap', { g: spec.g });
      terse = spec.mode === 'equal' ? 'equal gaps' : `gaps ${spec.g} px`;
    } else if (spec.scenario === 'mockup') {
      core = fill('mockup', {}) + I.tol(rng, ` (every box needs IoU ≥ ${(1 - spec.tau / 100).toFixed(2)})`, 0.4);
      terse = 'match the mockup';
    } else if (spec.goal === 'widths') {
      const list = spec.names.map((n, c) => `${n} ${spec.target[c]}`);
      const txt = list.length === 1 ? list[0] : `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`;
      core = fill('widths', { spec: txt });
      terse = list.join(', ');
      steps = spec.names.map((n, c) => `make ${n} ${spec.target[c]} px wide`);
    } else {
      core = fill('fit', { pad: spec.pad });
      terse = `fit columns, ${spec.pad} px padding`;
    }
    core = I.ucFirst(core);
    return I.say(rng, core, { isplit: spec.isplit, terse, steps });
  }

  // ---------------------------------------------------------------- round 2: judge modes

  const ABSENT_BOXES = [
    'Pricing table', 'Video player', 'Cookie banner', 'Newsletter', 'Testimonials', 'Map', 'Contact form', 'Logo',
    'Calculator', 'Seat picker', 'Size guide', 'Chessboard', 'Piano keys', 'Metronome', 'Word cloud', 'Magnifier',
    'Barcode', 'Watermark', 'Compass', 'Font preview', 'Virtual pet', 'Split view', 'Spin wheel', 'Ruler overlay',
    'Abacus', 'Dice roller', 'Crossword', 'Bubble level', 'Protractor', 'Music staff', 'Morse key', 'Sound mixer'
  ];
  const ABSENT_COLUMNS = [
    'Fax', 'Middle name', 'Nickname', 'Passport', 'Manager', 'Language', 'Currency', 'Country', 'Postcode',
    'Timezone', 'Flavour', 'Edition', 'Encoding', 'Humidity', 'Pressure', 'Voltage', 'Density', 'Texture', 'Capacity',
    'Altitude', 'Checksum', 'Genre', 'License', 'Habitat', 'Viscosity', 'Latitude', 'Hardness', 'Frequency'
  ];
  const EDGE_WORD = { x: ['left', 'right'], y: ['top', 'bottom'] };

  // The two same-named things are the candidates (twins: the reply's options name each once); the other names on the
  // page must not be offered.
  const twins = (name, all) => ({ cands: [[name], [name]], others: [...new Set(all.filter((x) => x !== name))].map((x) => [x]) });

  function judgeOf(jr, spec, mode) {
    const v = spec.scenario;
    if (mode === 'impossible') {
      if (v === 'align') {
        const far = spec.axis === 'x' ? spec.W : spec.H;
        const at = far + jr.pick([60, 90, 120, 160]);
        const what = WHAT[`${spec.axis}-${spec.edge}`];
        return { mode, what: [`${at} px`, String(at)], message: `I can't do that: the canvas only goes to ${far} px, so ${at} px is off it.`,
          templates: ['Move the {what} of all the cards to {at} px on the ruler.', 'Put the {what} of every card at {at} px.',
            'Drag the cards until their {what} are at {at} px.',
            'Use {at} px as the ruler position for all {what}.'], vars: { what, at } };
      }
      if (v === 'spacing') {
        const L = spec.axis === 'x' ? spec.W : spec.H;
        const total = sum(spec.items.map((it) => it.s));
        const g = Math.ceil((L - total) / (spec.items.length - 1)) + jr.int(14, 40);
        return { mode, what: [`${g} px`, String(g)], message: `I can't do that: with ${g} px gaps the cards no longer fit on the canvas.`,
          templates: ['Set the gap between each pair of neighbouring cards to {g} px.', 'Space the cards {g} px apart, edge to edge.',
            'Arrange the cards with a {g} px gap between neighbours.',
            'Each gap between neighbouring cards should be {g} px.',
            'Leave {g} px of clear space between consecutive cards.',
            'The cards require {g} px gaps, measured edge to edge.'], vars: { g } };
      }
      if (v === 'mockup') {
        const have = spec.boxes.map((b) => b.label);
        const name = jr.pick(ABSENT_BOXES.filter((b) => !have.includes(b)));
        return { mode, what: [name], message: `I can't do that: there is no ${name} box on the canvas.`,
          templates: ['Resize the {name} box so it covers the same area as in the mockup.', 'Move the {name} box to where the mockup puts it.',
            'Make the {name} box match the mockup.',
            'Use the mockup as the guide for placing the {name} box.',
            'The {name} box needs to cover its mockup footprint.'], vars: { name: quote(name) } };
      }
      const name = jr.pick(ABSENT_COLUMNS.filter((c) => !spec.names.includes(c)));
      const w = 10 * jr.int(10, 18);
      return { mode, what: [name], message: `I can't do that: the table has no ${name} column.`,
        templates: [
          'Make the {name} column {w} px wide.', 'Set the width of the {name} column to {w} px.',
          'Drag the {name} divider until the column is {w} px wide.',
          'Use the divider to get {w} px of width for {name}.', 'The {name} column must measure {w} px across.'
        ],
        vars: { name: quote(name), w } };
    }
    // ambiguous: two of the page's names are the same one
    if (v === 'columns') {
      const i = jr.int(0, spec.names.length - 1);
      const j = jr.pick(spec.names.map((_, k) => k).filter((k) => k !== i));
      spec.names[j] = spec.names[i];
      const w = 10 * jr.int(10, 18);
      return { mode, ...twins(spec.names[i], spec.names), message: `Which ${spec.names[i]} column do you mean? There are two.`,
        templates: ['Make the {name} column {w} px wide.', 'Set the width of the {name} column to {w} px.'], vars: { name: quote(spec.names[i]), w } };
    }
    if (v === 'mockup') {
      const i = jr.int(0, spec.boxes.length - 1);
      const j = jr.pick(spec.boxes.map((_, k) => k).filter((k) => k !== i));
      spec.boxes[j].label = spec.boxes[i].label;
      spec.items[j].label = spec.items[i].label;
      const side = jr.pick(['top', 'bottom', 'left', 'right']);
      return { mode, ...twins(spec.boxes[i].label, spec.boxes.map((x) => x.label)), message: `Which ${spec.boxes[i].label} box do you mean? There are two.`,
        templates: ['Move the {name} box to the {side} edge of the canvas.', 'Push the {name} box against the {side} edge of the canvas.'],
        vars: { name: quote(spec.boxes[i].label), side } };
    }
    // align / spacing: two movable cards share a name (a locked card is never one of them)
    const mov = spec.items.map((_, k) => k).filter((k) => !locked(spec, k));
    const a = jr.pick(mov);
    const b = jr.pick(mov.filter((k) => k !== a));
    spec.items[b].label = spec.items[a].label;
    const label = spec.items[a].label;
    const side = jr.pick(EDGE_WORD[spec.axis]);
    return { mode, ...twins(label, spec.items.map((x) => x.label)), message: `Which ${label} card do you mean? There are two.`,
      templates: ['Drag the {name} card to the {side} edge of the canvas.', 'Move the {name} card all the way to the {side} of the canvas.'],
      vars: { name: quote(label), side } };
  }

  // ---------------------------------------------------------------- round 2: facts, silent, retarget

  function factsOf(model, spec) {
    const v = spec.scenario;
    if (spec.judge) return [];
    if (v === 'align') {
      const mov = spec.items.filter((_, i) => !locked(spec, i)).length;
      return [
        { label: 'Cards aligned', value: String(mov), labels: ['Aligned cards', 'Cards moved', 'Movable cards'] },
        { label: spec.axis === 'x' ? 'Top card' : 'Leftmost card', value: spec.items[0].label, labels: spec.axis === 'x' ? ['First card', 'Top-most card'] : ['First card', 'Left card'] },
      ];
    }
    if (v === 'spacing') {
      const n = spec.items.length;
      return [
        { label: 'Cards', value: String(n), labels: ['Card count', 'Number of cards'] },
        { label: spec.axis === 'x' ? 'Last card' : 'Bottom card', value: spec.items[n - 1].label, labels: spec.axis === 'x' ? ['Rightmost card', 'Right-most card'] : ['Last card'] },
      ];
    }
    if (v === 'mockup') {
      const big = spec.boxes.reduce((a, b) => (b.tw * b.th > a.tw * a.th ? b : a));
      return [
        { label: 'Boxes placed', value: String(spec.boxes.length), labels: ['Boxes', 'Box count', 'Number of boxes'] },
        { label: 'Largest box', value: big.label, labels: ['Biggest box'] },
      ];
    }
    const k = spec.target.reduce((a, w, c) => (w > spec.target[a] ? c : a), 0);
    return [
      { label: 'Columns', value: String(spec.names.length), labels: ['Column count', 'Number of columns'] },
      { label: 'Widest column', value: spec.names[k], labels: ['Widest', 'Largest column'] },
    ];
  }

  // The item (or divider) the last update changed did not stick: it ends 1-2 cells off along the graded axis.
  function silentOf(next, prev, spec, rng) {
    if (spec.judge) return null;
    const step = spec.cell || 1;
    const offs = [10, 14, 18, 24].map((o) => step * Math.max(1, Math.round(o / step)));
    const tau = spec.tau;
    if (spec.scenario === 'columns') {
      const c = next.cols.findIndex((w, k) => w !== prev.cols[k]);
      if (c < 0) return null;
      const sign = rng.bool() ? 1 : -1;
      const off = rng.pick(offs);
      for (const sg of [sign, -sign]) {
        const out = { ...next, cols: setCol(spec, next.cols, c, next.cols[c] + sg * off) };
        if (errorOf(out, spec) > tau) return out;
      }
      return null;
    }
    let best = -1;
    let bd = 0;
    next.r.forEach((r, i) => {
      const o = prev.r[i];
      const d = Math.abs(r.x - o.x) + Math.abs(r.y - o.y) + Math.abs(r.w - o.w) + Math.abs(r.h - o.h);
      if (d > bd && !locked(spec, i)) { bd = d; best = i; }
    });
    if (best < 0) return null;
    const sign = rng.bool() ? 1 : -1;
    const off = rng.pick(offs);
    const along = spec.scenario === 'mockup' ? null : spec.axis;
    for (let k = 0; k < 4; k++) {
      const sg = k % 2 ? -sign : sign;
      const o2 = off * (1 + (k >> 1));
      const r = next.r[best];
      const moved = along === 'x' ? moveRect(spec, r, sg * o2, 0) : along === 'y' ? moveRect(spec, r, 0, sg * o2) : moveRect(spec, r, sg * o2, sg * Math.round(o2 / 2 / step) * step);
      const out = { ...next, r: next.r.map((x, i) => (i === best ? moved : x)) };
      if (errorOf(out, spec) > tau) return out;
    }
    return null;
  }

  // A new goal on the same canvas; null when the layout cannot change without moving locked cards.
  function retargetOf(spec, model, rng) {
    if (spec.judge) return null;
    const step = spec.cell || 1;
    const out = [];
    const v = spec.scenario;
    if (v === 'align') {
      if (spec.anchor === 'guide') {
        const [lo0, hi0] = tRange(spec);
        const lo = Math.ceil(lo0 / step) * step;
        const hi = Math.floor(hi0 / step) * step;
        for (let k = 0; k < 12 && hi - lo >= 40; k++) {
          const t = lo + step * rng.int(0, Math.floor((hi - lo) / step));
          if (Math.abs(t - spec.t) >= 40) out.push({ ...env.util.clone(spec), t });
        }
      } else {
        // the locked card stays: aim at another edge of it
        const it = spec.items[spec.ref];
        for (const edge of ['min', 'max', 'mid']) {
          if (edge === spec.edge || (edge === 'mid' && step > 1 && spec.items.some((x) => x.s % (2 * step)))) continue;
          const ns = { ...env.util.clone(spec), edge };
          ns.t = edgeOf(ns, it.fix);
          out.push(ns);
        }
      }
    } else if (v === 'spacing') {
      if (spec.mode !== 'gap') return null;
      const L = spec.axis === 'x' ? spec.W : spec.H;
      const total = sum(spec.items.map((it) => it.s));
      for (const g of [12, 16, 20, 24, 30, 36, 40, 50]) {
        const gg = Math.max(step, snapTo(g, step));
        if (Math.abs(gg - spec.g) >= 8 && spec.p0 + total + (spec.items.length - 1) * gg <= L - 8) out.push({ ...env.util.clone(spec), g: gg });
      }
    } else if (v === 'mockup') {
      const flip = (fx, fy) => {
        const ns = env.util.clone(spec);
        for (const b of ns.boxes) {
          if (fx) b.tx = spec.W - b.tx - b.tw;
          if (fy) b.ty = spec.H - b.ty - b.th;
        }
        return ns;
      };
      out.push(flip(true, false), flip(false, true), flip(true, true));
    } else if (spec.goal === 'widths') {
      for (let k = 0; k < 10; k++) {
        const target = spec.names.map(() => rng.int(8, 20) * 10);
        if (sum(target) <= spec.W - 30 && Math.min(...target) >= 84) out.push({ ...env.util.clone(spec), target });
      }
    }
    const ok = out.filter((ns) => errorOf(model, ns) > ns.tau && Number.isFinite(errorOf(model, ns)));
    return ok.length ? rng.pick(ok) : null;
  }

  function judgeInstruction(spec, rng) {
    const j = spec.judge;
    return I.say(rng, I.ucFirst(I.phrase(rng, j.templates, j.vars, spec.isplit)), { isplit: spec.isplit, terse: I.fill(j.templates[0], j.vars) });
  }

  // ---------------------------------------------------------------- task

  const SCENARIOS = ['align', 'spacing', 'mockup', 'columns'];
  const V = env.scenariosOf('align-layout');

  env.task({
    name: 'align-layout',
    scenarios: SCENARIOS,
    files: ['scenarios/align.js', 'scenarios/spacing.js', 'scenarios/mockup.js', 'scenarios/columns.js'],
    startModes: ['off', 'partial', 'wrong', 'solved'],
    judgeModes: ['ambiguous', 'impossible'],

    helpers: { moveRect, resizeRect, setCol, colLeft, locked, MIN_BOX },
    lib: {
      LABELS, MARGIN, MIN_BOX, MIN_COL, alongPos, baseSpec, bbox, clear, edgeOf, even, fitTarget,
      gapsOf, iou, locked, moveRect, placedCount, rectAt, rectsOverlap, simulate, snapTo, startOf, sum, targetRect,
    },

    sample(rng, opts) {
      const scenario = opts.scenario || rng.pick(opts.scenarios && opts.scenarios.length ? opts.scenarios : this.scenarios);
      const q = cellOf(opts);
      for (let t = 0; t < 20; t++) {
        try {
          const spec = V[scenario].sample(rng.fork(`try${t}`), opts);
          if (q && scenario !== 'columns') quantSpec(spec, q);
          if (opts.traits && opts.traits.noOverlap && (scenario === 'mockup' || scenario === 'spacing')) spec.noOverlap = true;
          if (this.judgeModes.includes(opts.judge)) {
            const j = judgeOf(rng.fork('judge'), spec, opts.judge);
            if (j) spec.judge = j;
          }
          return spec;
        } catch (e) {
          if (t === 19) throw e;
        }
      }
      throw new Error(`layout: could not sample ${scenario}`);
    },

    init(spec, rng) {
      let m = V[spec.scenario].init(spec, rng);
      if (spec.cell && spec.scenario !== 'columns') m = quantModel(m, spec);
      // ambiguous / impossible: nothing to change, the page starts solved
      if (spec.judge) m = solveOf(spec, m);
      return m;
    },
    error: errorOf,
    tolerance(spec) {
      return { tau: spec.tau, sigma: Math.max(8, spec.tau * 4), minInitialError: Math.max(spec.tau * 2, spec.scenario === 'mockup' ? 24 : 8) };
    },
    instruction: instructionOf,
    plan: planOf,
    solve: solveOf,

    facts: factsOf,
    // preempt=cancel: each card / box (its rect) or column (its width), by the name on the page
    parts: (model, spec) => (spec.scenario === 'columns'
      ? model.cols.map((w, c) => ({ name: `${spec.names[c]} column`, value: w, aliases: [spec.names[c]] }))
      : model.r.map((r, i) => {
        const label = spec.scenario === 'mockup' ? spec.boxes[i].label : spec.items[i].label;
        return { name: label, value: [r.x, r.y, r.w, r.h] };
      })),
    silent: silentOf,
    retarget: retargetOf,
  });
})();
