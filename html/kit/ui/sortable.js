/*
 * kit/ui/sortable.js: headless reorder (sortable lists, grids, columns) and drop-target primitives.
 * Behavior and geometry only: nothing here creates visible elements, sets colors, fonts, borders or
 * sizes, or injects CSS. The widget builds every element; the primitive moves them through place().
 *
 * env.ui.sortable(container, opts) -> { get(), set(value), locate(item), locateSlot(i, group?, item?),
 *                                      locateGroupEnd(group, item?), slots(group?), dragging(), detach() }
 *   Reorder items by dragging, with live reflow: while an item is dragged the others move to the slots
 *   they would occupy if it were dropped now. Single sequence (pass `order`) or several groups such as
 *   kanban columns (pass `groups`); items move between groups and are indexed by position in the target.
 *
 *   Value. opts.order = [id, ...] (one sequence) or opts.groups = { groupId: [id, ...], ... } (several;
 *   group order = opts.groupOrder or the key order). get(), onInput, onChange and set() use the same shape.
 *   Controlled: the primitive applies a drop to its own layout, then calls onChange(value); the widget calls
 *   ctx.update(model). set(value) re-syncs the layout from the model (after tick(), solve(), or to reject).
 *
 *   Items. opts.items = { id: element } | Map | (id) => element. Each item element is pressed to drag it
 *   (or only its opts.handle descendant: a CSS selector, e.g. '.grip').
 *
 *   Coordinates. Slot and group rects are { x, y, w, h } in container-local px: relative to the
 *   container's padding box (inside its border), which is where an absolutely positioned child with
 *   left/top = x/y lands. Rect callbacks may also return [x, y, w, h] or a DOMRect-like object.
 *
 *   Layout: where slot i of a group is. Two modes:
 *     slots mode (the widget computes the layout): pass opts.slotRect(i, group, n) -> rect, where n is the
 *       number of items the group would hold
 *       (it changes while an item is dragged from one group to another). Any arrangement works:
 *       list, grid, columns, a circle, a spiral. Items should be position:absolute in the container;
 *       the primitive places every item at its slot on creation, during the drag and after the drop.
 *     measured mode (the DOM lays items out; no slotRect): items stay in normal flow
 *       (table rows, flex or grid children). At press time the primitive reads every item's natural
 *       box from the DOM: slot i of a group is the box of the group's i-th item, and the slot after the
 *       last is extrapolated (last + (last - previous), or last + its height when the group has one
 *       item, or the content-box top-left of opts.groupEls[group] when it is empty). Items of one group should therefore be equal-sized along the flow. During the
 *       drag, items are shifted with transforms; on drop (and on set()) the primitive calls
 *       arrange(value) to put the DOM in the new order and clears the transforms.
 *
 *   opts:
 *     order | groups, groupOrder, items, handle        see above
 *     slotRect(i, group, n)                             slots mode (omit for measured mode)
 *     groupEls { group: element }                       group hit areas (their live boxes) and, in
 *                                                       measured mode, the parents items are arranged into
 *     groupAt([cx, cy], rect) -> group                  custom group choice for the dragged item's center
 *                                                       (container-local); default below
 *     dropRule([cx, cy], slots, group) -> index         custom index choice; default: nearest slot center
 *     placeholder (element)                             shown (hidden = false) at the target slot while
 *                                                       dragging, hidden on drop; positioned with place()
 *     place(el, rect, info)                             move an element to a container-local rect.
 *                                                       info = { id, group, index, mode ('slots' |
 *                                                       'measured'), home (measured: natural box),
 *                                                       dragging, placeholder }. rect is null in measured mode
 *                                                       when an item goes back to its natural box.
 *                                                       Default (env.ui.sortable.defaultPlace): slots mode and
 *                                                       the placeholder -> style.left/top; measured items ->
 *                                                       style.transform translate(rect - home) (or '').
 *                                                       The primitive never sets sizes: size the placeholder in
 *                                                       CSS, or override place() and use rect.w/h.
 *     arrange(value)                                    measured mode: put item elements in DOM order. Default:
 *                                                       for each group, append its items in order to
 *                                                       groupEls[group] (or the item's current parent).
 *     axis ('x' | 'y' | null)                           lock the dragged item's motion to one axis
 *     bounds ('center' | null)                          'center': the dragged item's center stays inside the
 *                                                       container
 *     activeClass                                       class toggled on the dragged item (press to release)
 *     onStart(item), onChange(value, info) (on every release, also when nothing moved; info.moved tells),
 *     keyboard (default false): focusable items; arrow keys move the focused item one place (in groups
 *                               mode Left/Right move it to the previous/next group), firing onChange.
 *                               Pass it only for tasks whose inputs include 'keyboard'.
 *     label (event log name, default 'sortable')
 *   info = { item, from: { group, index }, to: { group, index }, moved }   (group undefined for `order`)
 *
 *   Drop rule. The dragged item's center c (its box follows the pointer) picks the group: groupAt(c)
 *   if given; else the group whose hit area (groupEls) contains c, else the one nearest to c;
 *   else (no hit areas) the group holding the nearest slot overall. The index is the slot in that group
 *   (laid out with the dragged item in it) whose center is nearest to c (first on ties).
 *
 *   Oracle. locate(item) is where to press: the handle's center, or the item's center. locateSlot(i,
 *   group, item) is where to release that press so the item lands in slot i of group (single sequence:
 *   locateSlot(i)): the slot center plus the item's press offset. Pass item when it comes from another
 *   group (the target group then holds one more item); without it, the item is assumed to be in group
 *   already. locateGroupEnd(group, item) is the slot after the last item of group (append), for an
 *   item from another group unless item is given and already there. slots(group) lists the current
 *   slot rects in viewport px ({ x, y, w, h }).
 *   Logs 'drop' { what: label, item, group, index, from } and track's 'grab' / 'release'.
 *
 * env.ui.dropzones(opts) -> { test(target), track(target), drop(target, data), clear(),
 *                             rect(zone), locate(zone, [u, v]?), ids() }
 *   Containment of a dragged element in drop zones, for bins-like tasks in any visual. Combine with
 *   env.ui.draggable for free 2D dragging: call track(el) in onInput and drop(el) in onChange.
 *   opts:
 *     zones { id: element | () => rect } | Map | [[id, element | fn], ...]
 *                         a zone's box is the element's live getBoundingClientRect(), or what the
 *                         callback returns (viewport px: DOMRect-like, { left, top, right, bottom },
 *                         { x, y, w, h } or [x, y, w, h]). Zones are measured at every query.
 *     onEnter(zone, target), onLeave(zone, target)   hover-highlight callbacks (the widget restyles); a zone
 *                         counts as hovered while the target is fully inside it (the innermost zone)
 *     label (event log name, default 'dropzones')
 *   target = an element (its live box), a rect (as above) or a point [x, y], in viewport px.
 *   test(target) -> { state: 'inside' | 'partial' | 'outside', zone: innermost zone fully containing
 *                     the target or null, overlaps: [zones touched], center: innermost zone under the
 *                     target's center or null, zones: { id: 'inside' | 'partial' | 'outside' } }
 *     'partial' = overlaps some zone without being fully inside any (usually wrong in bins tasks).
 *     Tolerance EPS = 0.5 px: inside allows EPS of overhang; overlap needs more than EPS.
 *   track(target) updates the hover set (firing onEnter/onLeave)
 *   and returns test(target); clear() leaves every hovered zone; drop(target, data) = test + clear +
 *   log 'drop' { what: label, zone, state, ...data }, returning the test result.
 *   rect(zone) is the zone's box in viewport px ({ left, top, right, bottom, width, height });
 *   locate(zone, [u, v]) the viewport point at fraction (u, v) of it (default its center).
 *   When scoring uses the task's own containment math in model units (e.g. bins where()), dropzones
 *   only drives hover feedback; zone boxes that render the model exactly agree with it up to EPS.
 */
(function () {
  'use strict';
  const ui = (env.ui = env.ui || {});
  const { clamp, center, toRect, mid } = ui._base;
  const ONE = '\u0000order';

  function defaultPlace(el, rect, info) {
    if (info && info.mode === 'measured' && !info.placeholder) {
      const h = info.home;
      el.style.transform = rect && h ? `translate(${rect.x - h.x}px, ${rect.y - h.y}px)` : '';
      return;
    }
    if (!rect) return;
    el.style.left = rect.x + 'px';
    el.style.top = rect.y + 'px';
  }

  ui.sortable = function sortable(container, opts) {
    const multi = !!opts.groups;
    if (!multi && !opts.order) throw new Error('env.ui.sortable: pass opts.order or opts.groups');
    const gids = multi ? (opts.groupOrder || Object.keys(opts.groups)).slice() : [ONE];
    const measured = !opts.slotRect;
    const mode = measured ? 'measured' : 'slots';
    const place = opts.place || defaultPlace;
    const label = opts.label || 'sortable';
    const ph = opts.placeholder || null;
    const items = opts.items;
    const itemEl = typeof items === 'function' ? items : items instanceof Map ? (id) => items.get(id) : (id) => items[id];
    const gArg = (g) => (multi ? g : undefined);

    const norm = (v) => (multi
      ? Object.fromEntries(gids.map((g) => [g, (v[g] || []).slice()]))
      : { [ONE]: v.slice() });
    const out = (v) => (multi ? norm(v) : v[ONE].slice());
    let value = norm(multi ? opts.groups : opts.order);
    const ids = () => gids.flatMap((g) => value[g]);
    const groupOf = (id) => gids.find((g) => value[g].includes(id));

    const pub = (t) => ({ group: gArg(t.group), index: t.index });
    let drag = null;
    const detachers = [];

    for (const id of ids()) bind(id);
    if (ph) ph.hidden = true;
    settle();

    const gKey = (group) => (multi ? group : ONE);

    return createApi();

    // Viewport position of container-local (0, 0): the padding box's corner at scroll 0, so local px are content px
    // (where an absolutely positioned child lands) also when the container is scrolled.
    function origin() {
      const r = container.getBoundingClientRect();
      return [r.left + container.clientLeft - container.scrollLeft, r.top + container.clientTop - container.scrollTop];
    }

    function localBox(el) {
      const r = el.getBoundingClientRect();
      const [ox, oy] = origin();
      return { x: r.left - ox, y: r.top - oy, w: r.width, h: r.height };
    }

    function measureHomes() {
      const homes = {};
      for (const id of ids()) homes[id] = localBox(itemEl(id));
      return homes;
    }

    // Measured mode: the slot after the last item of g.
    function endSlot(g, base, size) {
      const n = base.length;
      if (n >= 2) {
        const a = base[n - 2];
        const b = base[n - 1];
        return { x: 2 * b.x - a.x, y: 2 * b.y - a.y, w: b.w, h: b.h };
      }
      if (n === 1) {
        const b = base[0];
        return { x: b.x, y: b.y + b.h, w: b.w, h: b.h };
      }
      const host = opts.groupEls && opts.groupEls[g];
      if (!host || !size) return null;
      const r = host.getBoundingClientRect();
      const cs = getComputedStyle(host);
      const [ox, oy] = origin();
      return {
        x: r.left + host.clientLeft + parseFloat(cs.paddingLeft) - ox,
        y: r.top + host.clientTop + parseFloat(cs.paddingTop) - oy,
        w: size.w,
        h: size.h,
      };
    }

    // Slot rects (container-local) of group g when it holds n items. base = value the homes belong to.
    function slotsFor(g, n, homes, base, size) {
      if (!measured) {
        return Array.from({ length: n }, (_, i) => toRect(opts.slotRect(i, gArg(g), n)));
      }
      const rects = base[g].map((id) => homes[id]);
      const res = rects.slice(0, n);
      while (res.length < n) {
        const e = endSlot(g, res, size);
        if (!e) break;
        res.push(e);
      }
      return res;
    }

    function info(id, g, i, homes, extra) {
      return { id, group: gArg(g), index: i, mode, home: homes ? homes[id] : undefined, dragging: false, placeholder: false, ...extra };
    }

    // Put every item (but skip) at its slot for value v.
    function layout(v, skip, homes, base, size) {
      for (const g of gids) {
        const s = slotsFor(g, v[g].length, homes, base, size);
        v[g].forEach((id, i) => { if (id !== skip && s[i]) place(itemEl(id), s[i], info(id, g, i, homes)); });
      }
    }

    function defaultArrange(pubValue) {
      const v = norm(pubValue);
      for (const g of gids) {
        for (const id of v[g]) {
          const el = itemEl(id);
          const parent = (opts.groupEls && opts.groupEls[g]) || el.parentNode;
          if (parent) parent.append(el);
        }
      }
    }

    // Bring the DOM to value (no gesture in progress).
    function settle() {
      if (measured) {
        (opts.arrange || defaultArrange)(out(value));
        for (const g of gids) value[g].forEach((id, i) => place(itemEl(id), null, info(id, g, i, null)));
      } else {
        layout(value);
      }
    }

    function groupHit(g) {
      if (opts.groupEls && opts.groupEls[g]) return localBox(opts.groupEls[g]);
      return null;
    }

    function pickIndex(c, slots, g) {
      if (opts.dropRule) return clamp(opts.dropRule(c, slots, gArg(g)), 0, slots.length - 1);
      let best = 0;
      let bestD = Infinity;
      slots.forEach((r, i) => {
        const [x, y] = mid(r);
        const d = Math.hypot(x - c[0], y - c[1]);
        if (d < bestD) { bestD = d; best = i; }
      });
      return best;
    }

    // Target { group, index } for the dragged item d whose box center is c.
    function target(d, c, rect) {
      const nIn = (g) => value[g].length + (g === d.from.group ? 0 : 1);
      const slotsOf = (g) => slotsFor(g, nIn(g), d.homes, value, d.size);
      if (!multi) return { group: ONE, index: pickIndex(c, slotsOf(ONE), ONE) };
      let g = null;
      if (opts.groupAt) g = opts.groupAt(c, rect);
      if (g == null) {
        let near = Infinity;
        for (const k of gids) {
          const r = groupHit(k);
          if (!r) continue;
          const dx = Math.max(r.x - c[0], 0, c[0] - (r.x + r.w));
          const dy = Math.max(r.y - c[1], 0, c[1] - (r.y + r.h));
          const dist = Math.hypot(dx, dy);
          if (dist < near) { near = dist; g = k; }
        }
      }
      if (g == null) {
        let near = Infinity;
        for (const k of gids) {
          for (const r of slotsOf(k)) {
            const [x, y] = mid(r);
            const dist = Math.hypot(x - c[0], y - c[1]);
            if (dist < near) { near = dist; g = k; }
          }
        }
      }
      const s = slotsOf(g);
      if (!s.length) return { ...d.from };
      return { group: g, index: pickIndex(c, s, g) };
    }

    function moved(v, id, to) {
      const next = {};
      for (const g of gids) next[g] = v[g].filter((x) => x !== id);
      next[to.group].splice(to.index, 0, id);
      return next;
    }

    function constrain(r) {
      if (opts.bounds !== 'center') return r;
      const W = container.clientWidth;
      const H = container.clientHeight;
      return { ...r, x: clamp(r.x, -r.w / 2, W - r.w / 2), y: clamp(r.y, -r.h / 2, H - r.h / 2) };
    }

    function bind(id) {
      const el = itemEl(id);
      bindPointer();

      if (opts.keyboard) bindKeyboard();

      function bindPointer() {
        detachers.push(ui.track(el, {
          start(p, e) {
            if (opts.handle) {
              const h = e.target.closest && e.target.closest(opts.handle);
              if (!h || !el.contains(h)) return false;
            }
            const g = groupOf(id);
            if (g === undefined) return false;
            const index = value[g].indexOf(id);
            const homes = measured ? measureHomes() : null;
            const start = measured ? homes[id] : slotsFor(g, value[g].length)[index];
            drag = { id, el, from: { group: g, index }, homes, start, size: { w: start.w, h: start.h }, to: null, next: null,
              scroll: [container.scrollLeft, container.scrollTop] };
            if (opts.activeClass) el.classList.add(opts.activeClass);
            if (opts.onStart) opts.onStart(id);
          },
          move(p) {
            const d = drag;
            if (!d) return;
            // The container may scroll during the drag (wheel, split drags): the item follows the pointer in content px.
            const dx = p.dx + container.scrollLeft - d.scroll[0];
            const dy = p.dy + container.scrollTop - d.scroll[1];
            const r = constrain({
              ...d.start,
              x: d.start.x + (opts.axis === 'y' ? 0 : dx),
              y: d.start.y + (opts.axis === 'x' ? 0 : dy),
            });
            place(el, r, info(id, d.from.group, d.from.index, d.homes, { dragging: true }));
            const to = target(d, mid(r), r);
            const next = moved(value, id, to);
            layout(next, id, d.homes, value, d.size);
            if (ph) {
              const slot = slotsFor(to.group, next[to.group].length, d.homes, value, d.size)[to.index];
              if (slot) place(ph, slot, info(id, to.group, to.index, d.homes, { placeholder: true }));
              ph.hidden = false;
            }
            d.to = to;
            d.next = next;
          },
          end() {
            const d = drag;
            if (!d) return;
            drag = null;
            if (opts.activeClass) el.classList.remove(opts.activeClass);
            if (ph) ph.hidden = true;
            const to = d.to || d.from;
            const wasMoved = to.group !== d.from.group || to.index !== d.from.index;
            if (d.next) value = d.next;
            settle();
            env.log('drop', { what: label, item: id, group: gArg(to.group), index: to.index, from: d.from.index });
            if (opts.onChange) opts.onChange(out(value), { item: id, from: pub(d.from), to: pub(to), moved: wasMoved });
          },
        }, label));
      }

      function bindKeyboard() {
        if (el.tabIndex < 0) el.tabIndex = 0;
        const key = (e) => {
          if (drag) return;
          const g = groupOf(id);
          const i = value[g].indexOf(id);
          let to = null;
          const back = e.key === 'ArrowUp' || (!multi && e.key === 'ArrowLeft');
          const fwd = e.key === 'ArrowDown' || (!multi && e.key === 'ArrowRight');
          if (back && i > 0) to = { group: g, index: i - 1 };
          else if (fwd && i < value[g].length - 1) to = { group: g, index: i + 1 };
          else if (multi && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
            const k = gids.indexOf(g) + (e.key === 'ArrowLeft' ? -1 : 1);
            if (k >= 0 && k < gids.length) to = { group: gids[k], index: Math.min(i, value[gids[k]].length) };
          }
          if (!to) return;
          e.preventDefault();
          value = moved(value, id, to);
          settle();
          el.focus();
          env.log('drop', { what: label, item: id, group: gArg(to.group), index: to.index, from: i, key: e.key });
          if (opts.onChange) opts.onChange(out(value), { item: id, from: pub({ group: g, index: i }), to: pub(to), moved: true });
        };
        el.addEventListener('keydown', key);
        detachers.push(() => el.removeEventListener('keydown', key));
      }
    }

    // Press point of an item, and its offset from the item's center (viewport px).
    function pressPoint(id) {
      const el = itemEl(id);
      if (!el) throw new Error(`env.ui.sortable: no item ${String(id)}`);
      const h = opts.handle && el.querySelector(opts.handle);
      return center(h || el);
    }

    function pressOffset(id) {
      if (id === undefined || !opts.handle) return [0, 0];
      const c = center(itemEl(id));
      const p = pressPoint(id);
      return [p[0] - c[0], p[1] - c[1]];
    }

    function slotPoint(g, i, foreign, item) {
      const n = value[g].length + (foreign ? 1 : 0);
      const homes = measured ? measureHomes() : null;
      const ref = item !== undefined ? item : value[g][0] !== undefined ? value[g][0] : ids()[0];
      const size = measured && ref !== undefined ? homes[ref] : null;
      const s = slotsFor(g, n, homes, value, size)[i];
      if (!s) throw new Error(`env.ui.sortable: no slot ${i} in group ${String(gArg(g))}`);
      const [ox, oy] = origin();
      const off = pressOffset(ref);
      const [cx, cy] = mid(s);
      return [ox + cx + off[0], oy + cy + off[1]];
    }

    function createApi() {
      return {
        get: () => out(value),
        set(v) {
          if (drag) return;
          value = norm(v);
          settle();
        },
        dragging: () => (drag ? drag.id : null),
        locate: (id) => pressPoint(id),
        locateSlot(i, group, item) {
          const g = gKey(group);
          const foreign = item !== undefined && groupOf(item) !== g;
          return slotPoint(g, i, foreign, item);
        },
        locateGroupEnd(group, item) {
          const g = gKey(group);
          const inside = item !== undefined && groupOf(item) === g;
          return slotPoint(g, inside ? value[g].length - 1 : value[g].length, !inside, item);
        },
        slots(group) {
          const g = gKey(group);
          const homes = measured ? measureHomes() : null;
          const ref = value[g][0] !== undefined ? value[g][0] : ids()[0];
          const [ox, oy] = origin();
          return slotsFor(g, value[g].length, homes, value, homes && ref !== undefined ? homes[ref] : null)
            .map((r) => ({ x: r.x + ox, y: r.y + oy, w: r.w, h: r.h }));
        },
        detach() { for (const f of detachers) f(); },
      };
    }
  };
  ui.sortable.defaultPlace = defaultPlace;

  ui.dropzones = function dropzones(opts = {}) {
    const src = opts.zones instanceof Map ? [...opts.zones] : Array.isArray(opts.zones) ? opts.zones.slice() : Object.entries(opts.zones || {});
    const zones = new Map(src);
    const eps = 0.5;
    const label = opts.label || 'dropzones';
    let hovered = new Set();

    const box = (r) => {
      const q = toRect(r);
      return { l: q.x, t: q.y, r: q.x + q.w, b: q.y + q.h };
    };
    function zoneBox(id) {
      const z = zones.get(id);
      if (z === undefined) throw new Error(`env.ui.dropzones: unknown zone ${id}`);
      return box(typeof z === 'function' ? z() : z.getBoundingClientRect());
    }
    function targetBox(t) {
      if (Array.isArray(t) && t.length === 2) return { l: t[0], t: t[1], r: t[0], b: t[1] };
      return box(t && t.getBoundingClientRect ? t.getBoundingClientRect() : t);
    }
    const area = (b) => (b.r - b.l) * (b.b - b.t);

    function test(t) {
      const b = targetBox(t);
      const cx = (b.l + b.r) / 2;
      const cy = (b.t + b.b) / 2;
      const res = { state: 'outside', zone: null, overlaps: [], center: null, zones: {} };
      let inArea = Infinity;
      let cArea = Infinity;
      for (const id of zones.keys()) {
        const z = zoneBox(id);
        const inside = b.l >= z.l - eps && b.t >= z.t - eps && b.r <= z.r + eps && b.b <= z.b + eps;
        const touch = b.l < z.r - eps && z.l < b.r - eps && b.t < z.b - eps && z.t < b.b - eps;
        res.zones[id] = inside ? 'inside' : touch ? 'partial' : 'outside';
        if (touch || inside) res.overlaps.push(id);
        if (inside && area(z) < inArea) { inArea = area(z); res.zone = id; }
        if (cx >= z.l && cx <= z.r && cy >= z.t && cy <= z.b && area(z) < cArea) { cArea = area(z); res.center = id; }
      }
      res.state = res.zone !== null ? 'inside' : res.overlaps.length ? 'partial' : 'outside';
      return res;
    }

    function setHover(next, t) {
      for (const id of hovered) if (!next.has(id) && opts.onLeave) opts.onLeave(id, t);
      for (const id of next) if (!hovered.has(id) && opts.onEnter) opts.onEnter(id, t);
      hovered = next;
    }

    return {
      ids: () => [...zones.keys()],
      test,
      track(t) {
        const res = test(t);
        setHover(new Set(res.zone !== null ? [res.zone] : []), t);
        return res;
      },
      clear(t) { setHover(new Set(), t); },
      drop(t, data = {}) {
        const res = test(t);
        setHover(new Set(), t);
        env.log('drop', { what: label, zone: res.zone, state: res.state, ...data });
        return res;
      },
      rect(id) {
        const z = zoneBox(id);
        return { left: z.l, top: z.t, right: z.r, bottom: z.b, width: z.r - z.l, height: z.b - z.t };
      },
      locate(id, uv = [0.5, 0.5]) {
        const z = zoneBox(id);
        return [z.l + uv[0] * (z.r - z.l), z.t + uv[1] * (z.b - z.t)];
      },
    };
  };
})();
