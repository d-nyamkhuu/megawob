/*
 * sort-into-bins: drag items into containers on a 2D board.
 * MiniWoB counterparts: drag-box, drag-shapes, drag-shapes-2.
 *
 * scenarios
 *   single   one item, one (unlabeled) container; the item must end fully inside it
 *   collect  4-8 items (ood 9-12), one container or two unlabeled ones named by position ("the box on the
 *            left"). rule.mode: 'in' (the items matching a color or a shape go into the target box, the others
 *            stay out), 'remove' (all items start inside the box; take the matching ones out, leave the rest),
 *            'count' (exactly rule.k of the matching items go into the target box; the rest stay out)
 *   sort     2-3 labeled containers (ood 4), one per category (a color, a shape, or "Other"); rule.mode 'each' |
 *            'split' (one value vs "Other"), or 'spatial': two unlabeled boxes named by position ("circles
 *            into the left box, everything else into the right one")
 *   desk     a desktop: file icons and icon-sized folder targets (plus a Trash). A file dropped on a folder
 *            icon goes into it and disappears from the desk; clicking a folder opens a window listing its
 *            files, which can be dragged back out to the desk or onto another folder (recovery). Goals: move
 *            the files of a kind into a folder, delete files (Trash), or file every kind into its folder.
 *   palette  a palette of shape templates and a canvas with a frame; dragging a template drops a new copy on
 *            the canvas, dragging a placed copy back onto the palette deletes it. Goal: the frame must hold
 *            exactly the requested numbers of each shape ("two blue stars and a red circle").
 * collect/sort episodes may start with piles (spec.pile): items overlap, so the top one must be moved first
 * or an item grabbed by its visible part.
 *
 * Widget traits (opts.traits, single / collect / sort; drawn from rng.fork('traits'), so other widgets' episodes are
 * unchanged): noPile (no starting piles), snap (spec.snap 'none' | 'slot' | 'arrange': the widget snaps a dropped
 * item to the nearest free slot of its box, or re-flows the box's items; env.taskDef.helpers.snapDrop is the shared
 * rule), tall (spec.tall = visible fraction of a board that is taller than its pane, spec.route 'wheel' |
 * 'thumb' = how the oracle scrolls). opts.route: 'wheel' forces the wheel route and 'pointer' the scrollbar-thumb
 * route on tall boards; 'keyboard' is ignored (no keyboard route). Tall boards declare the 'wheel' input.
 * model.view (tall boards, unscored, mirrored by the widget) = { top, h, boardH }: the pane shows normalized board
 * y in [top, top + h]; boardH is the board's height in px (for wheel deltas). The plan scrolls so both ends of a
 * drag are on screen (a drag whose ends cannot fit hops the item to a free spot at the edge of the view first):
 *   { wheel: [{ pane: 'y' }, dy] } or { drag: [{ thumb: 'y' }, { thumbAt: top }] } (top = normalized y of the
 *   pane's top edge after scrolling).
 *
 * Layout traits (opts.traits, single / collect / sort; geometry only, drawn from forks so the item identities,
 * rule and goal of a seed stay as sampled except where noted): layout 'central' | 'rows' (spec.layout, spec.startPos
 * = the tidy start center of every item, used by 'off', 'partial' and 'wrong' starts instead of the random scatter;
 * no piles). central: single = a wide bin at one side with a large item at the other, both vertically centered;
 * collect = ONE large bin in the middle (about 36% x 63% of the board; a drawn two-box rule becomes one box) and
 * the items in tidy columns of up to three rows on either side; sort ignores it (it needs several bins). rows:
 * the bins side by side and wide (two spatial boxes are always left / right), the items in tidy rows below them
 * (traits.itemsAt 'above' puts the rows above); single = a wide bin with the item below. itemSize [lo, hi]
 * (a number is fixed): item height in board-height units (0.104 is 6.5% of a 1.6 : 1 board's width); the layouts
 * default to larger items than the unforced 0.07-0.125. itemCount n | [lo, hi]: collect total item count (the
 * split into matching and other items is redrawn). Colors and shapes stay seeded unless the palette trait is on.
 *
 * Palette trait (opts.traits.palette, collect only; other scenarios ignore it): { target: 'blue', distractors:
 * ['black', 'outline'] } (both optional; these are the defaults). The rule becomes a COLOR rule on `target` (a name
 * of content.COLORS; a drawn shape rule is converted: the matching items get random shapes), every matching
 * item is drawn in that color, solid, and every other item is a distractor: 'black' = solid black, 'outline' =
 * outline-only black (no fill), or any other COLORS name = that color, solid. The distractor kinds are dealt out in
 * turn over a shuffled order, so each kind appears whenever there are enough distractors. spec.palette =
 * { target, distractors }; every item then carries fill: 'solid' | 'outline' and color: a COLORS name or 'black'
 * (not in content.COLORS: the widget draws it; an 'outline' item is a stroke in its color with fill none). The
 * instruction names the target color ("blue shapes"); scoring is unchanged (the draws come from rng.fork('palette')).
 *
 * Task-area geometry traits (opts.traits, single / collect / sort; desk and palette ignore them). They let a widget
 * declare where the bins and the waiting items are, instead of the code's single skeleton; scoring (where), the
 * oracle, snapping (snapDrop) and slots all read the resulting spec.containers rects. Bad values throw an Error
 * at sample time (nothing is clamped or ignored silently).
 *   itemsAt 'below' | 'above' | 'left' | 'right'   which side of the bins the items wait on, in a tidy block
 *            (layout 'rows'; given without a layout it implies layout 'rows'). left / right: the bins fill the
 *            other side of the board, items in tidy columns. single honours it too (default: the item below).
 *   orient 'row' | 'column' | 'grid'   how the bins are arranged (layout 'rows'; implies it when no layout is
 *            given): side by side (row; the default), stacked one above the other (column), or two per row
 *            (grid: 3 bins = two over one, 4 = two by two). Default with itemsAt left / right: column. Two
 *            spatial boxes are named by where they ended up: left / right, or top / bottom for a column.
 *            spec.itemsAt and spec.orient record the arrangement whenever either trait is given. A column of 3-4
 *            bins with the items above / below is short of height: the items shrink (to about half for 4 bins).
 *   containers [{ x, y, w, h }, ...] | { single?, collect?, sort?: [...] }   explicit bin rects in board fractions
 *            (0..1 of the width and of the height; a labeled bin's top 0.065 is its label strip). An array applies
 *            to every scenario the widget declares; an object gives per-scenario lists (a scenario without one is laid
 *            out as usual). The number of rects sets the task's bin count: single 1; collect 1, or 2 = the
 *            two-box rule named by position (no 'remove' mode); sort 2-4 (2 = 'each', 'split' or 'spatial'; 3-4 =
 *            'each'). Two unlabeled bins are named left / right when one lies wholly left of the other, else top /
 *            bottom. Rects must lie on the board and must not overlap. With layout (or itemsAt / orient) the items start in a tidy block in the free
 *            band on the itemsAt side of the rects' bounding box (default: the first side with room among below,
 *            right, left, above); without, they are scattered around them (piles allowed, as unforced). The item
 *            size shrinks to fit the rects, down to 0.06; when the rects cannot hold their items (or leave no room
 *            for them outside), sample throws.
 *   layout must be 'central' | 'rows'; 'central' does not combine with itemsAt or orient.
 *
 * Levels (opts.level; spec.level is set for easy / medium only, normal is the task as it always was):
 *   easy    single: a bigger bin. collect: mode 'in', one box, 2 matching + 2 other items, no piles. sort: 2 labeled
 *           boxes ('each'), 2 + 2 items. desk: 5 files, 2 kinds, mode 'into' or 'trash'. palette: 3 templates, one
 *           shape wanted twice. Boxes games start half solved (half of the right moves already made), desk
 *           half of the files already moved, palette one copy already placed.
 *   medium  collect: 2-3 + 2-3 items, no 'count' mode, one box, no piles. sort: 'each' (2 boxes) or 'split', 2-3
 *           items per category, no spatial rule. desk: 5-6 files, 2 kinds, no 'sort'. palette: two shapes wanted
 *           1-2 times. Starts a third solved. Declared containers / itemCount traits still decide the box and
 *           item counts. Only the 'off' start changes; sigma is wider on both rungs.
 *
 * Coordinates: everything lives on a logical board of fixed aspect ratio spec.aspect (width / height).
 * Points are normalized board coordinates [bx, by] in 0..1 on each axis (x of the width, y of the
 * height), so placement does not depend on the widget's pixel size. Shape items are squares on screen
 * (spec.item.w * spec.aspect === spec.item.h); desk file tiles are taller than wide.
 *
 * spec (single/collect/sort)
 *        { scenario, isplit, csplit, ood, startMode, aspect, item: { w, h }, items: [{ id, shape, color }],
 *          containers: [{ id, label, x, y, w, h, head, side? ('left'|'right'|'top'|'bottom') }],
 *          goal: { itemId: containerId | 'out' | 'any' },  'any' = count mode: in the target box or out
 *          rule: { kind: 'color' | 'shape', value?, values?, mode, k?, target? }, pile (bool) }
 * model  { pos: { itemId: [bx, by] }, z: [itemId] (stacking order, bottom first) }
 * spec (desk)
 *        { ..., item: { w, h } (file tile), files: [{ id, name, ext, kind }], folders: [{ id, label, kind?,
 *          trash?, x, y, w, h }], win: { x, y, w, h, head }, goal: { fileId: folderId | 'desk' }, rule }
 * model  { pos: { fileId: [bx, by] }, loc: { fileId: 'desk' | folderId }, open: folderId | null }
 * spec (palette)
 *        { ..., item: { w, h }, templates: [{ shape, color }], pal: { x, y, w, h }, canvas: { x, y, w, h },
 *          frame: { x, y, w, h }, want: { templateIndex: count } }
 * model  { placed: [{ id, t, pos }], next }
 *
 * An item is inside a container when its whole extent lies within the container rect; it is out when it
 * overlaps no container; anything else is "partial" (always wrong).
 * error  single: 0 inside the bin, else 0.25 + 0.75 x min(1, the shift its center still needs to fit / 0.5 board heights).
 *        collect/sort: weighted share of items not where they should be (count mode: plus |inside - k|); an item
 *        not placed yet (out, or straddling an edge) counts 1, an item sitting in a box it does not belong in counts 2
 *        (a missing item plus an extra one), so dumping everything in one box earns no progress over the start (a
 *        majority-heavy dump keeps a little: its right items are right);
 *        desk: the same weights over files (still on the desk 1, in a wrong folder 2); palette: (sum over templates of
 *        |count in frame - wanted| + copies straddling the frame edge) / wanted total. tau = 0.
 *
 * plan targets
 *   { item: id }         an item's current center (shapes; desk files on the desk or in the open window)
 *   { point: [bx, by] }  a board point (normalized): drop points, and press points on the visible part of a
 *                        partly covered item (piles)
 *   { folder: id }       desk: a folder icon's center (drop target, or click to open it)
 *   { close: true }      desk: the open window's close button
 *   { template: t }      palette: template t's swatch (press there to drag out a new copy)
 *   { trash: true }      palette: the palette area (drop a placed copy there to delete it)
 *
 * Helpers (widget API, env.taskDef.helpers):
 *   where(spec, p)                         container id, 'partial' or 'out' for an item center
 *   freeSlot(spec, model, id, c)            an unoccupied slot in a container
 *   freeOutside(spec, model, id)            an unoccupied point outside every container
 *   snapDrop(spec, model, id, p)            position map after a snapping drop
 *   deskDrop(spec, model, id, center, pointer)  desktop model after a file drop
 *   winSlots(spec, n)                       file centers in the open folder window
 *   paletteDrop(spec, model, src, center)   palette model after a template or copy drop
 *   palSlot(spec, t)                        template center on the palette
 *
 * Files: sampling.js (box tasks and layout), oracle.js (box scoring and moves), scenarios/boxes.js
 * (single / collect / sort), scenarios/desk.js, scenarios/palette.js, instructions.js, hooks.js.
 * Self-tests live in selftest.js and are loaded only by the checker and Node tests.
 * Start modes: off, partial (some items already placed right), wrong (wrong items inside / files in wrong
 * folders / wrong shapes in the frame), solved. No wrong-choice endings.
 *
 * Round 2 hooks (optional, pure; see the html/kit/env.js header)
 *   facts(model, spec)       what the page shows when solved: single / collect / sort "Items in <box>" for the first three boxes
 *                            and "Items outside the boxes"; desk "Files in <folder>" (the badge on the folder icon) for the first
 *                            three folders and "Files left on the desktop"; palette "Shapes in the frame" and the count of the
 *                            first two wanted shapes. Label paraphrases go in labels.
 *   parts(model, spec)       preempt=cancel: boxes: each look-alike group of shapes by its name ("red circle", value: where each
 *                            one is); desk: each file by file name (value: its folder); palette: each template (value: its
 *                            count in the frame).
 *   silent(next, prev, spec, rng)   the item the last drop moved did not stay (it is back where it was, or it ends straddling
 *                            the box edge); desk: the file is back in its old folder / on the desk; palette: the newest copy in
 *                            the frame vanished. null when the copy would not have an error.
 *   retarget(spec, model, rng)   collect (no traits.palette): another value of the same kind present among the items (new goal
 *                            map, count mode a new k) or, with two boxes, the other box; sort 'spatial': the other box or another
 *                            value; desk: another kind to the Trash, or a kind to its folder; palette: the same total wanted in
 *                            a new split over the shapes. single, labeled sort ('each', 'split') and judge episodes: null.
 *   judgeModes impossible (spec.judge = { mode, message, templates, vars, what }; the page starts solved; the reply is status
 *     impossible and names what, [the missing thing as the instruction says it, ...alternates]): single "into the second box"
 *     (or third, fourth; there is one); collect / sort a box that is not there (the third, or a labeled sort box for a color / shape no box
 *     carries); desk a folder that does not exist; palette a shape the palette does not have. 'ambiguous' is not declared: a
 *     single board or a one-box board has nothing to be ambiguous about, and every declared mode must build on every scenario.
 */
(function () {
  'use strict';

  const { cap } = env.util;
  const { content } = env;
  const C = content;
  const I = env.instruct;

  const ASPECT = 1.6;
  const COLOR_NAMES = Object.keys(content.COLORS).filter((c) => c !== 'gray');
  const SHAPES = content.SHAPES;
  const PLURAL = { circle: 'circles', square: 'squares', triangle: 'triangles', diamond: 'diamonds', star: 'stars', hexagon: 'hexagons' };
  const EPS = 1e-9;
  const plural = (s) => PLURAL[s] || s + 's';
  const NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six'];

  // ---------------------------------------------------------------- geometry (normalized coords)

  function itemRect(spec, p, grow = 0) {
    const hw = spec.item.w * (0.5 + grow);
    const hh = spec.item.h * (0.5 + grow);
    return [p[0] - hw, p[1] - hh, p[0] + hw, p[1] + hh];
  }
  const boxRect = (c) => [c.x, c.y, c.x + c.w, c.y + c.h];
  const within = (r, b) => r[0] >= b[0] - EPS && r[1] >= b[1] - EPS && r[2] <= b[2] + EPS && r[3] <= b[3] + EPS;
  const overlap = (a, b) => a[0] < b[2] - EPS && b[0] < a[2] - EPS && a[1] < b[3] - EPS && b[1] < a[3] - EPS;
  const growBox = (b, gx, gy) => [b[0] - gx, b[1] - gy, b[2] + gx, b[3] + gy];
  const inPt = (p, b) => p[0] >= b[0] && p[0] <= b[2] && p[1] >= b[1] && p[1] <= b[3];

  // Where an item is: a container id (fully inside), 'out' (touches no container) or 'partial'.
  function where(spec, p) {
    const r = itemRect(spec, p);
    let touches = false;
    for (const c of spec.containers) {
      const b = boxRect(c);
      if (within(r, b)) return c.id;
      if (overlap(r, b)) touches = true;
    }
    return touches ? 'partial' : 'out';
  }

  // Item-sized slots inside a container's content area (below the label strip), row-major.
  function slots(spec, c) {
    const { w, h } = spec.item;
    const padX = Math.max(0, Math.min(0.15 * w, (c.w - w) / 2));
    const padY = Math.max(0, Math.min(0.15 * h, (c.h - c.head - h) / 2));
    const left = c.x + padX;
    const top = c.y + c.head + padY;
    const cw = c.w - 2 * padX;
    const ch = c.h - c.head - 2 * padY;
    const cols = Math.max(1, Math.floor(cw / (1.15 * w)));
    const rows = Math.max(1, Math.floor(ch / (1.15 * h)));
    const out = [];
    for (let r = 0; r < rows; r++) {
      for (let k = 0; k < cols; k++) out.push([left + ((k + 0.5) * cw) / cols, top + ((r + 0.5) * ch) / rows]);
    }
    return out;
  }

  function othersRects(spec, model, skip, grow) {
    return spec.items.filter((it) => it.id !== skip).map((it) => itemRect(spec, model.pos[it.id], grow));
  }

  function freeSlot(spec, model, id, c) {
    const others = othersRects(spec, model, id, 0.03);
    let best = null;
    let bestHits = Infinity;
    for (const s of slots(spec, c)) {
      const r = itemRect(spec, s);
      const hits = others.filter((o) => overlap(r, o)).length;
      if (hits < bestHits) { best = s; bestHits = hits; }
      if (!hits) break;
    }
    return best;
  }

  // Candidate centers on a fine grid, inside a region (default the board).
  function gridPoints(spec, stepFrac = 0.25, region = [0, 0, 1, 1]) {
    const { w, h } = spec.item;
    const pts = [];
    const m = 0.01;
    for (let y = region[1] + h / 2 + m; y <= region[3] - h / 2 - m + EPS; y += h * stepFrac) {
      for (let x = region[0] + w / 2 + m / spec.aspect; x <= region[2] - w / 2 - m / spec.aspect + EPS; x += w * stepFrac) pts.push([x, y]);
    }
    return pts;
  }

  // A point where the item touches no container (with a clear margin) and no other item.
  // Optional region (item extents) and toward (a point to get close to instead of the item's current spot).
  function freeOutside(spec, model, id, region, toward) {
    const { w, h } = spec.item;
    const boxes = spec.containers.map((c) => growBox(boxRect(c), 0.3 * w, 0.3 * h));
    const others = othersRects(spec, model, id, 0.1);
    const cur = toward || model.pos[id];
    const d = (p) => Math.hypot((p[0] - cur[0]) * spec.aspect, p[1] - cur[1]);
    let best = null;
    let fallback = null;
    for (const p of gridPoints(spec, 0.25, region)) {
      const r = itemRect(spec, p);
      if (boxes.some((b) => overlap(r, b))) continue;
      if (!fallback || d(p) < d(fallback)) fallback = p;
      if (others.some((o) => overlap(r, o))) continue;
      if (!best || d(p) < d(best)) best = p;
    }
    return best || fallback;
  }

  // Scatter n items outside all containers (clear margin), without overlapping each other.
  function scatter(rng, spec, n) {
    const { w, h } = spec.item;
    const boxes = spec.containers.map((c) => growBox(boxRect(c), 0.5 * w, 0.5 * h));
    const cands = rng.shuffle(gridPoints(spec).filter((p) => !boxes.some((b) => overlap(itemRect(spec, p), b))));
    for (const gap of [0.35, 0.15, 0.03]) {
      const picked = [];
      for (const p of cands) {
        const r = itemRect(spec, p, gap / 2);
        if (picked.some((q) => overlap(r, itemRect(spec, q, gap / 2)))) continue;
        picked.push(p);
        if (picked.length === n) return picked;
      }
    }
    return null;
  }

  // Piles: about half the items sit on top of an earlier one, offset by 30-55% of the item size.
  function pileUp(rng, spec, pts) {
    const out = pts.map((p) => p.slice());
    const { w, h } = spec.item;
    const boxes = spec.containers.map((c) => growBox(boxRect(c), 0.3 * w, 0.3 * h));
    for (let i = 1; i < out.length; i++) {
      if (!rng.bool(0.5)) continue;
      const base = out[rng.int(0, i - 1)];
      for (let t = 0; t < 8; t++) {
        const q = [base[0] + rng.pick([-1, 1]) * rng.float(0.3, 0.55) * w, base[1] + rng.pick([-1, 1]) * rng.float(0.3, 0.55) * h];
        const r = itemRect(spec, q);
        if (r[0] < 0 || r[1] < 0 || r[2] > 1 || r[3] > 1 || boxes.some((b) => overlap(r, b))) continue;
        out[i] = q;
        break;
      }
    }
    return out;
  }

  // Where a dropped item ends up when the widget snaps (spec.snap): 'slot' puts it on the nearest free slot of the
  // container its center is in; 'arrange' re-flows every item of that container onto the slots in reading
  // order. Anywhere else (and snap 'none') the item stays where it was released. Returns the new pos map.
  function snapDrop(spec, model, id, p) {
    const pos = { ...model.pos, [id]: p };
    if (!spec.snap || spec.snap === 'none') return pos;
    const c = spec.containers.find((b) => inPt(p, boxRect(b)));
    if (!c) return pos;
    const ss = slots(spec, c);
    const mine = spec.items.filter((it) => it.id !== id && inPt(pos[it.id], boxRect(c))).map((it) => it.id);
    if (spec.snap === 'slot') {
      const taken = mine.map((o) => itemRect(spec, pos[o], 0.03));
      const free = ss.filter((q) => !taken.some((r) => overlap(itemRect(spec, q), r)));
      if (free.length) {
        const d = (q) => Math.hypot((q[0] - p[0]) * spec.aspect, q[1] - p[1]);
        pos[id] = free.reduce((a, q) => (d(q) < d(a) ? q : a));
      }
      return pos;
    }
    const row = (q) => Math.round(q[1] / (spec.item.h * 1.15));
    const group = [...mine, id].sort((a, b) => row(pos[a]) - row(pos[b]) || pos[a][0] - pos[b][0]);
    group.forEach((g, i) => { if (i < ss.length) pos[g] = ss[i]; });
    return pos;
  }

  // ---------------------------------------------------------------- task

  // Level starts: 'off' is built as a partly solved board (partial) with this fraction of the right moves made.
  const levelFrac = (spec) => (spec.level === 'easy' ? 0.5 : 1 / 3);
  const levelMode = (spec) => (spec.level && spec.startMode === 'off' ? 'partial' : spec.startMode);

  function errorOf(model, spec) {
    return V[spec.scenario].error(model, spec);
  }

  function planOf(model, spec) {
    return V[spec.scenario].plan(model, spec);
  }

  function solveOf(spec, model) {
    if (spec.scenario === 'desk') return { ...model, loc: { ...spec.goal }, open: model.open || null };
    if (spec.scenario === 'palette') {
      let m = { placed: model.placed.map((p) => ({ ...p })), next: model.next };
      for (let i = 0; i < 30; i++) {
        const st = lib.palettePlan(m, spec);
        if (!st) break;
        const [a, b] = st.drag;
        if (a.template !== undefined) m = lib.paletteDrop(spec, m, a, b.point);
        else m = lib.paletteDrop(spec, m, a, [spec.pal.x + spec.pal.w / 2, spec.pal.y + spec.pal.h / 2]);
      }
      return m;
    }
    let m = { pos: { ...model.pos }, z: (model.z || spec.items.map((it) => it.id)).slice() };
    for (let i = 0; i < 6 * spec.items.length + 6; i++) {
      const step = lib.boxPlanRaw(m, spec);
      if (!step) break;
      m = lib.applyBoxStep(spec, m, step);
    }
    return model.view ? { ...m, view: model.view } : m;
  }

  const SCENARIOS = ['single', 'collect', 'sort', 'desk', 'palette'];

  function sampleSpec(rng, opts) {
    const scenario = opts.scenario || rng.pick(opts.scenarios && opts.scenarios.length ? opts.scenarios : SCENARIOS);
    const base = { isplit: opts.isplit || 'train', csplit: opts.csplit || 'train', ood: !!opts.ood, startMode: opts.startMode };
    if (opts.level === 'easy' || opts.level === 'medium') base.level = opts.level;
    if (opts.traits) lib.checkGeometry(opts.traits);
    return V[scenario].sample(rng, base, opts);
  }

  const lib = {
    ASPECT, C, COLOR_NAMES, EPS, I, NUM, SHAPES, boxRect, cap, errorOf, freeOutside, freeSlot,
    gridPoints, growBox, inPt, itemRect, levelFrac, levelMode, overlap, pileUp, plural, scatter,
    slots, solveOf, where, within,
  };
  const V = env.scenariosOf('sort-into-bins');

  env.task({
    name: 'sort-into-bins',
    scenarios: SCENARIOS,
    files: ['sampling.js', 'oracle.js', 'scenarios/boxes.js', 'scenarios/desk.js', 'scenarios/palette.js', 'instructions.js', 'hooks.js'],
    lib,
    startModes: ['off', 'partial', 'wrong', 'solved'],
    judgeModes: ['impossible'],
    inputs: (spec) => (spec && spec.tall ? ['pointer', 'wheel'] : ['pointer']),

    // Widget API: geometry plus the desk and palette drop rules.
    helpers: {
      where, freeSlot, freeOutside, snapDrop,
      deskDrop: (...args) => lib.deskDrop(...args),
      winSlots: (...args) => lib.winSlots(...args),
      paletteDrop: (...args) => lib.paletteDrop(...args),
      palSlot: (...args) => lib.palSlot(...args),
    },

    sample(rng, opts) {
      const spec = sampleSpec(rng, opts);
      if (this.judgeModes.includes(opts.judge)) {
        const j = lib.judgeOf(rng.fork('judge'), spec);
        if (j) spec.judge = j;
      }
      return spec;
    },

    init(spec, rng) {
      // ambiguous / impossible: nothing to change, the page starts solved
      if (spec.judge) return solveOf(spec, this.init({ ...spec, judge: undefined }, rng));
      return V[spec.scenario].init(spec, rng);
    },

    error: errorOf,

    // Every item must be placed right; the Gaussian width gives partial credit per misplaced item.
    tolerance(spec) {
      if (spec.level) return { tau: 0, sigma: spec.level === 'easy' ? 0.55 : 0.42, minInitialError: 1e-6 };
      return { tau: 0, sigma: 0.3, minInitialError: spec.scenario === 'palette' || spec.rule.mode === 'remove' || spec.rule.mode === 'count' ? 0.15 : 0.2 };
    },

    instruction(spec, rng) {
      return spec.judge ? lib.judgeInstruction(spec, rng) : lib.instructionOf(spec, rng);
    },
    plan: planOf,
    solve: solveOf,

    facts: (...args) => lib.factsOf(...args),
    parts: (...args) => lib.partsOf(...args),
    silent: (...args) => lib.silentOf(...args),
    retarget: (...args) => lib.retargetOf(...args),
  });
})();
