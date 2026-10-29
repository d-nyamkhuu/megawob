/* sort-into-bins/oracle.js: box scoring, oracle moves and scrolling. Shared internals live on the task lib. */
(function () {
  'use strict';
  const lib = env.taskOf('sort-into-bins').lib;

  // ---------------------------------------------------------------- error / plan (single / collect / sort)

  function countTarget(spec) {
    return spec.rule.mode === 'count' ? `c${spec.rule.target || 0}` : null;
  }

  // An item in the wrong box is a missing item plus an extra one in that box: it costs EXTRA, more than an item that is
  // simply not placed yet (1), so dumping every item in one box earns no progress over the start.
  const EXTRA = 2;
  const misplaced = (w) => (w !== 'out' && w !== 'partial' ? EXTRA : 1);

  function boxErrors(model, spec) {
    let wrong = 0;
    let inside = 0;
    const ct = countTarget(spec);
    for (const it of spec.items) {
      const w = lib.where(spec, model.pos[it.id]);
      const g = spec.goal[it.id];
      if (g === 'any') {
        if (w === ct) inside++;
        else if (w !== 'out') wrong += w === 'partial' ? 1 : EXTRA;
      } else if (w !== g) wrong += misplaced(w);
    }
    if (ct) wrong += Math.abs(inside - spec.rule.k);
    return { wrong, inside };
  }

  const boxError = (model, spec) => boxErrors(model, spec).wrong / spec.items.length;

  // Stacking: the press point of an item is its center, or a visible spot when items above cover it.
  function pressPoint(spec, model, id) {
    const z = model.z || spec.items.map((it) => it.id);
    const above = z.slice(z.indexOf(id) + 1).map((o) => lib.itemRect(spec, model.pos[o]));
    const p = model.pos[id];
    if (!above.length) return { center: true, at: p };
    const { w, h } = spec.item;
    for (const [fu, fv] of [[0, 0], [-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3], [0, -0.35], [0, 0.35], [-0.35, 0], [0.35, 0]]) {
      const q = [p[0] + fu * w, p[1] + fv * h];
      if (!above.some((b) => lib.inPt(q, lib.growBox(b, 0.04 * w, 0.04 * h)))) return { center: fu === 0 && fv === 0, at: q };
    }
    return null;
  }

  // The topmost item covering id's center (to move away first).
  function coverOf(spec, model, id) {
    const z = model.z || spec.items.map((it) => it.id);
    const p = model.pos[id];
    const above = z.slice(z.indexOf(id) + 1).reverse();
    return above.find((o) => lib.inPt(p, lib.itemRect(spec, model.pos[o]))) || above[0];
  }

  // Next box move: { id, to } or null.
  function boxMove(model, spec) {
    const ct = countTarget(spec);
    const placeAt = (id) => {
      const g = spec.goal[id];
      if (g === 'out') return lib.freeOutside(spec, model, id);
      if (g === 'any') return null;
      return lib.freeSlot(spec, model, id, spec.containers.find((c) => c.id === g));
    };
    const wrong = spec.items.filter((it) => spec.goal[it.id] !== 'any' && lib.where(spec, model.pos[it.id]) !== spec.goal[it.id]);
    // Clear items sitting in (or across) the wrong container first, so they free up slots.
    const inWrong = wrong.filter((x) => lib.where(spec, model.pos[x.id]) !== 'out');
    const pool = inWrong.length ? inWrong : wrong;
    // Scrollable boards: prefer a move whose two ends are on screen together (saves scrolling).
    const it = pool.find((x) => onScreen(spec, model, x.id, placeAt(x.id))) || pool[0];
    if (it) return { id: it.id, to: placeAt(it.id) };
    if (ct) {
      const any = spec.items.filter((x) => spec.goal[x.id] === 'any');
      const stray = any.find((x) => { const w = lib.where(spec, model.pos[x.id]); return w !== 'out' && w !== ct; });
      if (stray) return { id: stray.id, to: lib.freeOutside(spec, model, stray.id) };
      const inside = any.filter((x) => lib.where(spec, model.pos[x.id]) === ct);
      if (inside.length > spec.rule.k) return { id: inside[0].id, to: lib.freeOutside(spec, model, inside[0].id) };
      if (inside.length < spec.rule.k) {
        const out = any.find((x) => lib.where(spec, model.pos[x.id]) === 'out');
        if (out) return { id: out.id, to: lib.freeSlot(spec, model, out.id, spec.containers.find((c) => c.id === ct)) };
      }
    }
    return null;
  }

  // ---- scrollable boards (spec.tall, model.view)

  const viewMargin = (spec) => spec.item.h * 0.5 + 0.015;
  // An item centered at normalized y is fully on screen (the board's own top and bottom edges count as visible).
  function seen(spec, v, y) {
    const m = viewMargin(spec);
    return (y - m >= v.top - 1e-6 || v.top <= 0.01) && (y + m <= v.top + v.h + 1e-6 || v.top + v.h >= 0.99);
  }
  function onScreen(spec, model, id, to) {
    const v = model.view;
    if (!spec.tall || !v || !to) return true;
    return seen(spec, v, model.pos[id][1]) && seen(spec, v, to[1]);
  }

  // Scroll the pane so its top edge sits at normalized y = top: the wheel over the pane, or the scrollbar thumb.
  function scrollStep(spec, v, top) {
    top = Math.max(0, Math.min(1 - v.h, top));
    if (Math.abs(top - v.top) * v.boardH < 2) return null;
    if (spec.route === 'thumb') return { drag: [{ thumb: 'y' }, { thumbAt: top }] };
    return { wheel: [{ pane: 'y' }, Math.round((top - v.top) * v.boardH)] };
  }

  // Wrap a drag so both of its ends are on screen: scroll first; when they cannot both fit, hop the item to
  // a free spot at the edge of the view nearest the target and finish after scrolling.
  function viewPlan(model, spec, step) {
    const v = model.view;
    if (!spec.tall || !v || !step || !step.drag) return step;
    const [a, b] = step.drag;
    if (a.item === undefined || b.point === undefined) return step;
    const ya = model.pos[a.item][1];
    const yb = b.point[1];
    const m = viewMargin(spec);
    const vis = (y) => seen(spec, v, y);
    if (vis(ya) && vis(yb)) return step;
    const lo = Math.min(ya, yb) - m;
    const hi = Math.max(ya, yb) + m;
    if (hi - lo <= v.h) return scrollStep(spec, v, (lo + hi) / 2 - v.h / 2) || step;
    if (!vis(ya)) return scrollStep(spec, v, ya - v.h / 2) || step;
    const hop = lib.freeOutside(spec, model, a.item, [0, v.top + 0.015, 1, v.top + v.h - 0.015], [b.point[0], Math.max(v.top + m, Math.min(v.top + v.h - m, yb))]);
    return hop ? { drag: [a, { point: hop }] } : step;
  }

  function boxPlan(model, spec) {
    return viewPlan(model, spec, boxPlanRaw(model, spec));
  }

  function boxPlanRaw(model, spec) {
    const mv = boxMove(model, spec);
    if (!mv || !mv.to) return null;
    const pp = pressPoint(spec, model, mv.id);
    if (!pp) {
      // Fully covered: move the covering item off to a free spot first (out, or into its own goal).
      const top = coverOf(spec, model, mv.id);
      const to = spec.goal[top] && spec.goal[top] !== 'out' && spec.goal[top] !== 'any' && lib.where(spec, model.pos[top]) !== spec.goal[top]
        ? lib.freeSlot(spec, model, top, spec.containers.find((c) => c.id === spec.goal[top]))
        : lib.freeOutside(spec, model, top);
      const tp = pressPoint(spec, model, top) || { center: true, at: model.pos[top] };
      return dragStep(spec, model, top, tp, to);
    }
    return dragStep(spec, model, mv.id, pp, mv.to);
  }

  function dragStep(spec, model, id, pp, to) {
    if (pp.center) return { drag: [{ item: id }, { point: to }] };
    const c = model.pos[id];
    const off = [pp.at[0] - c[0], pp.at[1] - c[1]];
    return { drag: [{ point: pp.at }, { point: [to[0] + off[0], to[1] + off[1]] }] };
  }

  // Apply a drag step in model space (self test, solve): the item pressed moves by the drag vector.
  function applyBoxStep(spec, m, step) {
    const [a, b] = step.drag;
    let id = a.item;
    let from = id !== undefined ? m.pos[id] : a.point;
    if (id === undefined) {
      const z = m.z || spec.items.map((it) => it.id);
      id = z.slice().reverse().find((o) => lib.inPt(a.point, lib.itemRect(spec, m.pos[o])));
    }
    const c = m.pos[id];
    const to = [c[0] + b.point[0] - from[0], c[1] + b.point[1] - from[1]];
    m.pos[id] = to;
    if (m.z) m.z = [...m.z.filter((o) => o !== id), id];
    return m;
  }

  Object.assign(lib, { EXTRA, applyBoxStep, boxError, boxMove, boxPlan, boxPlanRaw, seen });
})();
