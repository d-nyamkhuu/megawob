/*
 * reference / reorder / pangea, dndkit: React 18 widgets on real React drag libraries (vendor/, loaded through the
 * widgets' `uses` lists in templates/reorder-items/base.js, which also declares their names, scenarios and traits;
 * this file fills in their render / locate). Each render mounts a fresh React root in the stage (the previous one is unmounted) with
 * ReactDOM.flushSync, so the page exists when render returns.
 *   pangea  @hello-pangea/dnd 18.0.1 (the maintained react-beautiful-dnd). Scenarios list, move, kanban (the library
 *           has no grid). Library behaviour kept: drags start only after the pointer moved 5 px with the button down
 *           (sloppy-click threshold; a press with a modifier key starts nothing), the lifted card follows the
 *           pointer from the point where the threshold was crossed, the other cards slide aside and a placeholder
 *           holds the gap, columns in a scrolling pane auto-scroll when the card nears the pane edge, the keyboard
 *           sensor lifts a focused handle with Space. Per seed the whole card or only its grip (⋮⋮) is the drag
 *           handle (list / move; kanban cards are always whole-card handles); pressing elsewhere does nothing.
 *           The drop animation is finished at once (a transitionend for 'transform' is dispatched on the dropped
 *           card in the commit that starts it), so the model and the page change on the release. CSS transitions
 *           are off on cards and placeholders (they ran on wall time, so locate() and the press snapshot read
 *           cards mid-slide): displaced cards jump aside, and after a drop into another list the home
 *           list keeps a zero-height placeholder until the next drag (its close waits for a transitionend).
 *   dndkit  @dnd-kit/core 6.3.1 + @dnd-kit/sortable 10.0.0 (one pre-built IIFE bundle). Scenarios list, move, grid,
 *           kanban. PointerSensor with an activation distance of 3-10 px per seed (no hold delay: a delay is a
 *           wall-clock timer), KeyboardSensor with sortableKeyboardCoordinates (Space / Enter picks up, arrows move,
 *           Space drops). Per seed the whole item or a grip button is the activator. Lists and grids sort live
 *           (vertical list / rect strategies; items translate, no scaling); kanban boards drag a DragOverlay
 *           (dropAnimation off) between columns, the target column highlights. Layout animations are off after
 *           the drop. The sensor's post-drag click guard ends at the next input, not on a 50 ms timer.
 * Where an item lands (pointer drags): the released pointer decides, against the layout when the button went
 * down. The dragged item's center is taken to its home center plus the pointer travel since the press (the pane's
 * auto-scroll is accounted for). In its own list / column the item takes the index of the item whose center is
 * nearest to that point (itself included: no move). Another kanban column: it goes in front of the first card whose center is below the point.
 * Outside every list / column nothing moves. Keyboard drags (the libraries' own sensors) use the library's result.
 * This keeps a drop exact however few pointer events a driver sends (one jump after the press, or eight steps)
 * while the libraries draw the drag; the libraries' own previews may lag a jumpy pointer (pangea lifts at the
 * threshold point).
 * Pinned items (spec.locked) cannot be dragged and are re-pinned after a drop (familyDef.helpers.pin). Keyboard episodes
 * (spec.keys, list / move / grid): a click focuses an item's handle, ArrowUp / ArrowLeft and ArrowDown / ArrowRight
 * swap it with its neighbour (focus mirrored into model.focus). Kanban cards are multi-line (traits.cardMeta) and
 * boards with spec.pane sit in a horizontally scrolling pane scrolled with the wheel (traits.wheelPane; the scroll
 * offset and column extents go into model.pane).
 */
(function () {
  'use strict';

  const LOCK = '<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="M5 7V5a3 3 0 0 1 6 0v2h.5A1.5 1.5 0 0 1 13 8.5v5A1.5 1.5 0 0 1 11.5 15h-7A1.5 1.5 0 0 1 3 13.5v-5A1.5 1.5 0 0 1 4.5 7H5zm1.5 0h3V5a1.5 1.5 0 0 0-3 0v2z"/></svg>';
  const DOTS = '<svg viewBox="0 0 10 16" width="10" height="16" aria-hidden="true"><g fill="currentColor"><circle cx="2.5" cy="3" r="1.5"/><circle cx="7.5" cy="3" r="1.5"/><circle cx="2.5" cy="8" r="1.5"/><circle cx="7.5" cy="8" r="1.5"/><circle cx="2.5" cy="13" r="1.5"/><circle cx="7.5" cy="13" r="1.5"/></g></svg>';
  const AV = ['#e8590c', '#1c7ed6', '#2f9e44', '#7048e8', '#d6336c', '#0c8599'];
  const EDGE = 14;
  const gidsOf = (sp) => (sp.staging ? [sp.staging, ...sp.columns] : sp.columns);

  const CSS = `
  .rr-wrap { display: flex; gap: 22px; align-items: flex-start; flex: none; position: relative; }
  .rr-set { position: relative; flex: none; box-sizing: border-box; }
  .rr-set.grid { display: grid; }
  .rr-item { box-sizing: border-box; display: flex; align-items: center; gap: 10px; padding: 0 12px; flex: none; position: relative;
    border: 1px solid var(--line); background: var(--panel); font-weight: 600; overflow: hidden; user-select: none; -webkit-user-select: none; }
  .rr-item:focus, .rr-grip:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
  .rr-item.locked { opacity: .82; }
  .rr-t { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .rr-v { flex: none; font-variant-numeric: tabular-nums; color: var(--muted); font-weight: 600; }
  .rr-grip { flex: none; color: var(--muted); display: inline-flex; align-items: center; justify-content: center; align-self: stretch;
    width: 26px; margin-left: -8px; border-radius: 4px; cursor: grab; }
  .rr-grip:hover { background: color-mix(in srgb, var(--muted) 14%, transparent); }
  .rr-lock { flex: none; color: var(--muted); display: inline-flex; width: 18px; justify-content: center; }
  .rr-item.whole { cursor: grab; }
  .rr-tag { flex: none; display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px; border-radius: 999px; font-size: .8em; font-weight: 700;
    white-space: nowrap; background: color-mix(in srgb, var(--tagc) 14%, var(--panel)); color: color-mix(in srgb, var(--tagc) 80%, var(--fg));
    border: 1px solid color-mix(in srgb, var(--tagc) 45%, transparent); }
  .rr-tag::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--tagc); }
  .rr-item.tile { flex-direction: column; justify-content: center; gap: 2px; padding: 4px 8px; text-align: center; }
  .rr-item.tile .rr-t { flex: none; width: 100%; }
  .rr-sub { width: 100%; font-size: .72em; font-weight: 500; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .rr-key { flex: none; align-self: flex-start; padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); font-size: 13px; min-width: 150px; }
  .rr-key h4 { margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
  .rr-key ol { margin: 0; padding-left: 20px; display: grid; gap: 6px; }
  .rr-pane { flex: none; position: relative; overflow-x: auto; overflow-y: hidden; scrollbar-width: thin; padding-bottom: 6px; box-sizing: content-box; }
  .rr-board { position: relative; display: flex; align-items: flex-start; }
  .rr-col { flex: none; display: flex; flex-direction: column; box-sizing: border-box; border: 1px solid var(--line); background: color-mix(in srgb, var(--panel) 55%, var(--bg)); }
  .rr-col h3 { margin: 0; padding: 0 12px; flex: none; font-size: 13px; color: var(--muted); text-transform: uppercase; letter-spacing: .04em;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; justify-content: space-between; gap: 6px; }
  .rr-col h3 small { font-size: 11px; opacity: .8; }
  .rr-body { flex: 1; min-height: 0; display: flex; flex-direction: column; padding: 8px 8px 0; box-sizing: border-box; overflow: hidden; }
  .rr-card { display: block; padding: 7px 10px; height: auto; min-height: 30px; font-weight: 500; }
  .rr-card .rr-ct { display: flex; align-items: center; gap: 8px; font-weight: 700; }
  .rr-m { font-size: .78em; color: var(--muted); line-height: 1.35; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .rr-bd { display: flex; gap: 4px; margin-top: 4px; }
  .rr-bd span { font-size: 10.5px; font-weight: 700; color: #fff; padding: 1px 6px; border-radius: 4px; }
  .rr-body.dense .rr-card .rr-m + .rr-m, .rr-body.dense .rr-card .rr-bd { display: none; }
  .rr-av { flex: none; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: 10px; font-weight: 700; color: #fff; }

  .rr-pangea .rr-item { border-radius: 3px; box-shadow: 0 1px 1px rgba(9,30,66,.25), 0 0 1px rgba(9,30,66,.31); border-color: transparent; }
  .rr-pangea .rr-item.dragging { box-shadow: 0 8px 16px -4px rgba(9,30,66,.35), 0 0 1px rgba(9,30,66,.31);
    background: color-mix(in srgb, var(--accent) 8%, var(--panel)); }
  .rr-pangea .rr-set { padding: 6px; border-radius: 4px; background: color-mix(in srgb, var(--panel) 50%, var(--bg)); }
  .rr-pangea .rr-set.over, .rr-pangea .rr-body.over { background: color-mix(in srgb, var(--accent) 9%, var(--bg)); }
  .rr-pangea .rr-col { border-radius: 4px; border-color: transparent; background: color-mix(in srgb, var(--muted) 12%, var(--bg)); }
  .rr-pangea .rr-item, .rr-pangea [data-rfd-placeholder-context-id] { transition: none !important; }

  .rr-dndkit .rr-item { border-radius: 10px; box-shadow: 0 0 0 1px rgba(63,63,68,.05), 0 1px 3px rgba(34,33,81,.15); border-color: transparent; }
  .rr-dndkit .rr-card.dragging { opacity: .45; }
  .rr-dndkit .rr-item.lifted { z-index: 2; cursor: grabbing; }
  .rr-dndkit .rr-item.lifted { box-shadow: 0 0 0 1px rgba(63,63,68,.05), -1px 0 15px rgba(34,33,81,.01), 0 15px 15px rgba(34,33,81,.25); }
  .rr-dndkit .rr-grip { margin-left: -6px; width: 28px; }
  .rr-dndkit .rr-col { border-radius: 12px; }
  .rr-dndkit .rr-col.over { outline: 2px solid color-mix(in srgb, var(--accent) 60%, transparent); outline-offset: -2px; }
  .rr-overlay { cursor: grabbing; }
  .rr-overlay .rr-item { box-shadow: 0 15px 15px rgba(34,33,81,.25), 0 0 0 1px rgba(63,63,68,.05); border-radius: 10px; border-color: transparent; }
  `;

  let R = null; // the current render (one widget page at a time)

  const h = (...a) => window.React.createElement(...a);
  const isLocked = (S, id) => !!(S.spec.locked && id in S.spec.locked);
  const rectOf = (el) => {
    const r = el.getBoundingClientRect();
    return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
  };

  // ---- shared pieces

  function tagEl(lab) {
    return h('span', { className: 'rr-tag', style: { '--tagc': lab.color || '#868e96' } }, lab.tag);
  }

  function keyPanel(spec) {
    if (!spec.legend) return null;
    return h('div', { className: 'rr-key', key: 'legend' },
      h('h4', null, spec.legendTitle || 'Key'),
      h('ol', null, spec.legend.map((l, i) => h('li', { key: i }, tagEl(l)))));
  }

  // List / grid item contents; gripProps (or null) makes the grip the drag handle.
  function rowContent(S, id, gripProps) {
    const lab = S.spec.labels[id];
    if (S.grid) {
      return [h('span', { className: 'rr-t', key: 't' }, lab.value || lab.title),
        lab.value ? h('span', { className: 'rr-sub', key: 's' }, lab.title) : null];
    }
    const lead = isLocked(S, id)
      ? h('span', { className: 'rr-lock', key: 'l', title: 'Pinned', dangerouslySetInnerHTML: { __html: LOCK } })
      : gripProps
        ? h('span', { className: 'rr-grip', key: 'g', 'aria-label': 'Drag handle', ...gripProps, dangerouslySetInnerHTML: { __html: DOTS } })
        : h('span', { className: 'rr-grip', key: 'g', 'aria-hidden': 'true', dangerouslySetInnerHTML: { __html: DOTS } });
    return [lead,
      h('span', { className: 'rr-t', key: 't' }, lab.title),
      lab.tag && (S.showTag || !lab.value) ? h(window.React.Fragment, { key: 'tag' }, tagEl(lab)) : null,
      lab.value ? h('span', { className: 'rr-v', key: 'v' }, lab.value) : null];
  }

  function cardContent(S, id) {
    const lab = S.spec.labels[id];
    const av = lab.who ? AV[(lab.who.charCodeAt(0) + lab.who.charCodeAt(1)) % AV.length] : null;
    return [
      h('div', { className: 'rr-ct', key: 'ct' },
        lab.who ? h('span', { className: 'rr-av', style: { background: av } }, lab.who) : null,
        h('span', { className: 'rr-t' }, lab.title),
        lab.value ? h('span', { className: 'rr-v' }, lab.value) : null),
      ...(lab.meta || []).map((line, i) => h('div', { className: 'rr-m', key: 'm' + i }, line)),
      lab.badges && lab.badges.length
        ? h('div', { className: 'rr-bd', key: 'bd' }, lab.badges.map((b, i) => h('span', { key: i, style: { background: b.color } }, b.text))) : null,
    ];
  }

  const itemStyle = (S, i, n) => (S.kanban ? { marginBottom: S.gap + 'px' }
    : S.grid ? { width: S.w + 'px', height: S.h + 'px' }
      : { width: S.w + 'px', height: S.h + 'px', marginBottom: i < n - 1 || S.engine === 'pangea' ? S.gap + 'px' : 0 });

  // Sizes of a list / grid (the same draws as the other reference reorder widgets) or a kanban board.
  function measure(S) {
    const { ctx, spec } = S;
    const { rng, size } = ctx;
    const n = spec.items.length;
    if (S.kanban) {
      const gids = gidsOf(spec);
      const k = gids.length;
      S.gap = rng.int(6, 9);
      S.colGap = rng.int(12, 20);
      S.head = rng.int(34, 40);
      S.colW = spec.pane ? rng.int(200, 230) : Math.min(260, Math.max(150, Math.floor((size.width - 70 - (k - 1) * S.colGap) / k)));
      S.colH = size.height - 56;
      S.boardW = k * S.colW + (k - 1) * S.colGap;
      if (spec.pane) {
        const shown = rng.float(2.2, 3.4);
        const pw = Math.min(size.width - 64, Math.floor(shown * (S.colW + S.colGap)), S.boardW - 40);
        S.paneW = Math.max(2 * (S.colW + S.colGap), pw);
      }
      S.font = rng.int(14, 15);
      return;
    }
    const legendW = spec.legend ? 190 : 0;
    const availW = size.width - 60 - legendW - (S.engine === 'pangea' ? 12 : 0);
    const availH = size.height - 36 - (S.engine === 'pangea' ? 12 : 0);
    const hasVal = spec.items.some((id) => spec.labels[id].value);
    const longest = Math.max(...spec.items.map((id) => spec.labels[id].title.length + (spec.labels[id].value || '').length * 0.9 + (spec.labels[id].tag ? 10 : 0)));
    if (S.grid) {
      const rows = Math.ceil(n / spec.cols);
      S.gap = rng.int(8, 16);
      const maxH = Math.floor((availH - (rows - 1) * S.gap) / rows);
      const maxW = Math.floor((availW - (spec.cols - 1) * S.gap) / spec.cols);
      const wordy = spec.rule.kind !== 'number';
      S.h = Math.max(40, rng.int(Math.min(56, maxH), Math.min(hasVal ? 92 : 100, maxH)));
      S.w = Math.min(maxW, wordy ? rng.int(hasVal ? 132 : 112, hasVal ? 170 : 140) : S.h);
      // Tiles fit their longest line (the tile is narrower than the label at large sizes).
      const lineLen = Math.max(...spec.items.map((id) => (spec.labels[id].value || spec.labels[id].title).length));
      S.font = Math.max(12, Math.min(20, Math.floor(S.h * 0.3), Math.floor((S.w - 20) / (lineLen * 0.62))));
    } else {
      S.gap = rng.int(5, 10);
      S.h = Math.max(26, Math.min(rng.int(40, 56), Math.floor(availH / n) - S.gap));
      S.font = Math.max(12, Math.min(17, Math.floor(S.h * 0.38)));
      const want = Math.round(longest * S.font * 0.62 + 110);
      S.w = Math.max(220, Math.min(availW, rng.int(Math.max(260, want), Math.max(280, want + 100)), 640));
    }
    S.showTag = rng.bool(0.5);
  }

  // ---- model <-> page

  function draw(S) {
    if (R !== S || !S.root) return;
    S.root.render(h(S.engine === 'pangea' ? PangeaApp : DndApp, { S, groups: S.groups, active: S.active, tick: ++S.tick }));
  }

  function moveIn(groups, id, gid, idx) {
    const out = {};
    for (const g of Object.keys(groups)) out[g] = groups[g].filter((x) => x !== id);
    out[gid].splice(Math.max(0, Math.min(out[gid].length, idx)), 0, id);
    return out;
  }

  function same(a, b) {
    return Object.keys(a).every((g) => a[g].length === b[g].length && a[g].every((x, i) => x === b[g][i]));
  }

  // A finished drag or key press: groups = the new { group: [id] } arrangement.
  function commit(S, groups, focus) {
    const { ctx, spec } = S;
    if (R !== S) return;
    let next;
    if (S.kanban) {
      if (same(groups, S.groups)) return draw(S);
      S.groups = groups;
      next = { ...ctx.model, columns: groups };
    } else {
      const pin = env.taskDef.helpers.pin;
      const order = pin ? pin(groups.main, spec) : groups.main;
      const changed = !same({ main: order }, S.groups);
      S.groups = { main: order };
      next = { ...ctx.model, order };
      if (focus) next.focus = focus;
      if (!changed && !focus) return draw(S);
    }
    ctx.update(next);
    draw(S);
  }

  // Layout when the button went down: item and group boxes (client px) and the pane's scroll offset.
  function takeSnap(S, e) {
    S.press = [e.clientX, e.clientY];
    S.up = null;
    const items = {};
    for (const g of Object.keys(S.groups)) for (const id of S.groups[g]) if (S.els[id]) items[id] = rectOf(S.els[id]);
    const groups = {};
    for (const g of Object.keys(S.groups)) {
      const box = S.kanban ? S.cols[g] : S.bodies.main;
      if (box) groups[g] = rectOf(box);
    }
    S.snap = { items, groups, scroll: S.pane ? S.pane.scrollLeft : 0 };
  }

  // Where a pointer drag of `id` lands (see the header), or null when nothing moves.
  function dropByPointer(S, id) {
    const sn = S.snap;
    if (!sn || !S.press || !S.up || !sn.items[id]) return null;
    const home = sn.items[id];
    const shift = S.pane ? S.pane.scrollLeft - sn.scroll : 0;
    const x = home.cx + S.up[0] - S.press[0] + shift; // in snapshot coordinates
    const y = home.cy + S.up[1] - S.press[1];
    let gid = null;
    if (S.kanban) {
      for (const g of Object.keys(sn.groups)) {
        const r = sn.groups[g];
        if (x >= r.l && x <= r.r && y >= r.t - EDGE && y <= r.b + EDGE) gid = g;
      }
      if (S.pane && gid) {
        // A column scrolled out of the pane cannot take the drop.
        const p = S.pane.getBoundingClientRect();
        if (x - shift < p.left || x - shift > p.right) gid = null;
      }
    } else {
      const r = sn.groups.main;
      if (r && x >= r.l - EDGE && x <= r.r + EDGE && y >= r.t - EDGE && y <= r.b + EDGE) gid = 'main';
    }
    if (!gid) return null;
    const ids = S.groups[gid];
    const c = (k) => sn.items[k];
    let idx;
    if (ids.includes(id)) {
      let bd = Infinity;
      ids.forEach((k, i) => {
        const d = Math.hypot(c(k).cx - x, c(k).cy - y);
        if (d < bd) { bd = d; idx = i; }
      });
    } else {
      idx = ids.filter((k) => c(k).cy < y).length;
    }
    return moveIn(S.groups, id, gid, idx);
  }

  function groupOf(S, id) {
    return Object.keys(S.groups).find((g) => S.groups[g].includes(id));
  }

  function mirrorPane(S) {
    const p = S.pane;
    if (!p || R !== S) return;
    const cols = {};
    for (const c of gidsOf(S.spec)) if (S.cols[c]) cols[c] = [S.cols[c].offsetLeft, S.cols[c].offsetLeft + S.cols[c].offsetWidth];
    const pane = { scroll: Math.round(p.scrollLeft), width: p.clientWidth, max: p.scrollWidth - p.clientWidth, cols };
    const old = S.ctx.model.pane;
    if (old && old.scroll === pane.scroll && old.width === pane.width && old.max === pane.max) return;
    S.ctx.update({ ...S.ctx.model, pane });
  }

  // Page listeners for one render (removed at the next render through S.abort).
  function bindPage(S, downEvent, upEvent) {
    const sig = { signal: S.abort.signal };
    S.wrap.addEventListener(downEvent, (e) => { if (e.button === 0) takeSnap(S, e); }, { capture: true, ...sig });
    window.addEventListener(upEvent, (e) => { if (S.press && !S.up) S.up = [e.clientX, e.clientY]; }, { capture: true, ...sig });
    if (S.pane) {
      S.pane.addEventListener('wheel', (e) => {
        const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? S.pane.clientWidth : 1;
        const d = (Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * unit;
        e.preventDefault();
        S.pane.scrollLeft += d;
        mirrorPane(S);
      }, { passive: false, ...sig });
      S.pane.addEventListener('scroll', () => mirrorPane(S), sig);
    }
    if (!S.spec.keys || S.kanban) return;
    const host = S.wrap;
    const itemOf = (t) => (t && t.closest ? t.closest('[data-id]') : null);
    host.addEventListener('click', (e) => {
      const el = itemOf(e.target);
      if (!el || isLocked(S, el.dataset.id)) return;
      const f = S.handles[el.dataset.id] || el;
      if (document.activeElement !== f) f.focus({ preventScroll: true });
    }, sig);
    host.addEventListener('keydown', (e) => {
      if (e.defaultPrevented || S.dragging) return;
      const el = itemOf(e.target);
      if (!el) return;
      const back = e.key === 'ArrowUp' || e.key === 'ArrowLeft';
      const fwd = e.key === 'ArrowDown' || e.key === 'ArrowRight';
      if (!back && !fwd) return;
      e.preventDefault();
      const order = S.groups.main.slice();
      const id = el.dataset.id;
      const i = order.indexOf(id);
      const j = i + (back ? -1 : 1);
      if (j < 0 || j >= order.length) return;
      [order[i], order[j]] = [order[j], order[i]];
      window.ReactDOM.flushSync(() => commit(S, { main: order }, id));
    }, sig);
    host.addEventListener('focusin', (e) => {
      const el = itemOf(e.target);
      if (el && S.ctx.model.focus !== el.dataset.id) S.ctx.update({ ...S.ctx.model, focus: el.dataset.id });
    }, sig);
    host.addEventListener('focusout', (e) => {
      if (!(e.relatedTarget && host.contains(e.relatedTarget)) && S.ctx.model.focus) S.ctx.update({ ...S.ctx.model, focus: null });
    }, sig);
  }

  // ---- pangea

  function PangeaApp({ S, groups }) {
    const D = window.ReactBeautifulDnd;
    const onDragStart = () => { S.dragging = true; };
    const onDragEnd = (res) => {
      S.dragging = false;
      const id = res.draggableId;
      let next = null;
      if (res.mode === 'SNAP') {
        if (res.destination) next = moveIn(S.groups, id, res.destination.droppableId, res.destination.index);
      } else {
        next = dropByPointer(S, id);
      }
      S.press = null;
      S.up = null;
      if (next) commit(S, next, S.spec.keys && !S.kanban && res.mode === 'SNAP' ? id : null);
      else draw(S);
    };
    const body = S.kanban ? h(PBoard, { S, groups }) : h(PList, { S, ids: groups.main });
    return h(D.DragDropContext, { onDragStart, onDragEnd, autoScrollerOptions: S.auto }, body);
  }

  function PList({ S, ids }) {
    const D = window.ReactBeautifulDnd;
    return h(D.Droppable, { droppableId: 'main', direction: 'vertical' }, (prov, snap) => h('div', {
      ref: (el) => { prov.innerRef(el); if (el) S.bodies.main = el; },
      ...prov.droppableProps,
      className: 'rr-set' + (snap.isDraggingOver ? ' over' : ''),
      style: { fontSize: S.font + 'px' },
      'data-group': 'main',
    }, ids.map((id, i) => h(D.Draggable, { key: id, draggableId: id, index: i, isDragDisabled: isLocked(S, id) },
      (p, s) => h(PItem, { S, id, p, s, i, n: ids.length }))), prov.placeholder));
  }

  function PBoard({ S, groups }) {
    const D = window.ReactBeautifulDnd;
    const { spec } = S;
    const cols = gidsOf(spec).map((c) => h('div', {
      key: c, className: 'rr-col', 'data-role': 'column', 'data-col': c,
      ref: (el) => { if (el) S.cols[c] = el; },
      style: { width: S.colW + 'px', height: S.colH + 'px', marginRight: c === gidsOf(spec).at(-1) ? 0 : S.colGap + 'px' },
    },
    h('h3', { style: { height: S.head + 'px' } }, h('span', null, c === spec.staging ? 'Unassigned' : spec.colLabels[c]), h('small', null, String(groups[c].length))),
    h(D.Droppable, { droppableId: c, direction: 'vertical' }, (prov, snap) => h('div', {
      ref: (el) => { prov.innerRef(el); if (el) S.bodies[c] = el; },
      ...prov.droppableProps,
      className: 'rr-body' + (snap.isDraggingOver ? ' over' : '') + (groups[c].length > 4 ? ' dense' : ''),
      'data-group': c,
    }, groups[c].map((id, i) => h(D.Draggable, { key: id, draggableId: id, index: i },
      (p, s) => h(PItem, { S, id, p, s, i, n: groups[c].length, card: true }))), prov.placeholder))));
    const board = h('div', { className: 'rr-board', ref: (el) => { if (el) S.board = el; }, style: { width: S.boardW + 'px', height: S.colH + 'px', fontSize: S.font + 'px' } }, cols);
    if (!spec.pane) return board;
    return h('div', { className: 'rr-pane', ref: (el) => { if (el) S.pane = el; }, style: { width: S.paneW + 'px', height: S.colH + 'px' } }, board);
  }

  function PItem({ S, id, p, s, i, n, card }) {
    const React = window.React;
    const ref = React.useRef(null);
    // Finish the drop animation in the commit that starts it: the library completes the drop (onDragEnd) on the
    // transitionend of 'transform', so the model changes on the release, not 0.33-0.55 s later.
    React.useLayoutEffect(() => {
      if (s.isDropAnimating && ref.current) {
        ref.current.dispatchEvent(new TransitionEvent('transitionend', { bubbles: true, propertyName: 'transform' }));
      }
    }, [s.isDropAnimating]);
    const locked = isLocked(S, id);
    const whole = card || S.handleAll || locked;
    const grip = whole ? null : { ...p.dragHandleProps, ref: (el) => { if (el) S.handles[id] = el; } };
    const cls = 'rr-item' + (card ? ' rr-card' : S.grid ? ' tile' : '') + (locked ? ' locked' : '') + (whole && !locked ? ' whole' : '') + (s.isDragging ? ' dragging' : '');
    return h('div', {
      ref: (el) => { ref.current = el; p.innerRef(el); if (el) { S.els[id] = el; if (whole) S.handles[id] = el; } },
      ...p.draggableProps,
      ...(whole ? p.dragHandleProps : {}),
      className: cls,
      'data-role': 'card',
      'data-id': id,
      style: { ...itemStyle(S, i, n), ...p.draggableProps.style },
    }, card ? cardContent(S, id) : rowContent(S, id, grip));
  }

  // ---- dndkit

  // dnd kit's PointerSensor swallows clicks (a capturing document listener) until a 50 ms setTimeout after the
  // release, so whether the next click lands depended on wall time. This sensor drops that guard at the next
  // press, key or wheel instead: it still eats the release's own click, and never a later one.
  const NEXT_INPUT = ['pointerdown', 'mousedown', 'touchstart', 'keydown', 'wheel'];
  let Pointer = null;
  function pointerSensor() {
    if (Pointer) return Pointer;
    Pointer = class extends window.DndKit.core.PointerSensor {
      detach() {
        super.detach();
        const docs = this.documentListeners;
        const opts = { capture: true };
        const drop = () => {
          docs.removeAll();
          for (const t of NEXT_INPUT) window.removeEventListener(t, drop, opts);
        };
        for (const t of NEXT_INPUT) window.addEventListener(t, drop, opts);
      }
    };
    return Pointer;
  }

  function DndApp({ S, groups, active }) {
    const K = window.DndKit;
    const { core, sortable } = K;
    const sensors = core.useSensors(
      core.useSensor(pointerSensor(), { activationConstraint: { distance: S.distance } }),
      core.useSensor(core.KeyboardSensor, { coordinateGetter: sortable.sortableKeyboardCoordinates }),
    );
    const onDragStart = (ev) => {
      S.dragging = true;
      S.active = ev.active.id;
      if (S.kanban) draw(S);
    };
    const onDragEnd = (ev) => {
      S.dragging = false;
      S.active = null;
      const id = ev.active.id;
      let next = null;
      const keyboard = ev.activatorEvent && ev.activatorEvent.type === 'keydown';
      if (keyboard) {
        const g = groupOf(S, id);
        const over = ev.over && ev.over.id;
        if (over && S.groups[g].includes(over)) next = moveIn(S.groups, id, g, S.groups[g].indexOf(over));
      } else {
        next = dropByPointer(S, id);
      }
      S.press = null;
      S.up = null;
      if (next) commit(S, next, keyboard && S.spec.keys && !S.kanban ? id : null);
      else draw(S);
    };
    const onDragCancel = () => {
      S.dragging = false;
      S.active = null;
      S.press = null;
      draw(S);
    };
    const body = S.kanban ? h(KBoard, { S, groups }) : h(KList, { S, ids: groups.main });
    const overlay = S.kanban ? h(core.DragOverlay, { dropAnimation: null, className: 'rr-overlay' },
      active ? h('div', { className: 'rr-item rr-card lifted', style: { width: S.colW - 18 + 'px', fontSize: S.font + 'px' } }, cardContent(S, active)) : null) : null;
    return h(core.DndContext, {
      sensors, onDragStart, onDragEnd, onDragCancel,
      collisionDetection: S.kanban ? core.rectIntersection : core.closestCenter,
      autoScroll: { threshold: { x: 0.08, y: 0.08 }, acceleration: 6 },
      accessibility: { container: S.wrap },
    }, body, overlay);
  }

  function KList({ S, ids }) {
    const { sortable } = window.DndKit;
    const strategy = S.grid ? sortable.rectSortingStrategy : sortable.verticalListSortingStrategy;
    const style = { fontSize: S.font + 'px' };
    if (S.grid) Object.assign(style, { gridTemplateColumns: `repeat(${S.spec.cols}, ${S.w}px)`, gap: S.gap + 'px' });
    return h(sortable.SortableContext, { items: ids, strategy },
      h('div', { className: 'rr-set' + (S.grid ? ' grid' : ''), style, 'data-group': 'main', ref: (el) => { if (el) S.bodies.main = el; } },
        ids.map((id, i) => h(KItem, { key: id, S, id, i, n: ids.length }))));
  }

  function KColumn({ S, c, ids }) {
    const { core, sortable } = window.DndKit;
    const drop = core.useDroppable({ id: 'col:' + c });
    const { spec } = S;
    const last = c === gidsOf(spec).at(-1);
    return h('div', {
      className: 'rr-col' + (drop.isOver ? ' over' : ''), 'data-role': 'column', 'data-col': c,
      ref: (el) => { drop.setNodeRef(el); if (el) S.cols[c] = el; },
      style: { width: S.colW + 'px', height: S.colH + 'px', marginRight: last ? 0 : S.colGap + 'px' },
    },
    h('h3', { style: { height: S.head + 'px' } }, h('span', null, c === spec.staging ? 'Unassigned' : spec.colLabels[c]), h('small', null, String(ids.length))),
    h(sortable.SortableContext, { items: ids, strategy: sortable.verticalListSortingStrategy },
      h('div', { className: 'rr-body' + (ids.length > 4 ? ' dense' : ''), 'data-group': c, ref: (el) => { if (el) S.bodies[c] = el; } },
        ids.map((id, i) => h(KItem, { key: id, S, id, i, n: ids.length, card: true })))));
  }

  function KBoard({ S, groups }) {
    const { spec } = S;
    const board = h('div', { className: 'rr-board', ref: (el) => { if (el) S.board = el; }, style: { width: S.boardW + 'px', height: S.colH + 'px', fontSize: S.font + 'px' } },
      gidsOf(spec).map((c) => h(KColumn, { key: c, S, c, ids: groups[c] })));
    if (!spec.pane) return board;
    return h('div', { className: 'rr-pane', ref: (el) => { if (el) S.pane = el; }, style: { width: S.paneW + 'px', height: S.colH + 'px' } }, board);
  }

  function KItem({ S, id, i, n, card }) {
    const { sortable, utilities } = window.DndKit;
    const locked = isLocked(S, id);
    const s = sortable.useSortable({ id, disabled: locked, animateLayoutChanges: () => false });
    const whole = card || S.handleAll || locked;
    const style = { ...itemStyle(S, i, n), touchAction: 'none' };
    // Items slide aside only while a drag sorts them; after the drop they sit still at once.
    if (!card) {
      style.transform = utilities.CSS.Translate.toString(s.transform);
      if (s.isSorting && s.transition) style.transition = s.transition;
    }
    const act = { ...s.attributes, ...(locked ? {} : s.listeners) };
    const grip = whole ? null : { ...act, ref: (el) => { s.setActivatorNodeRef(el); if (el) S.handles[id] = el; } };
    const cls = 'rr-item' + (card ? ' rr-card' : S.grid ? ' tile' : '') + (locked ? ' locked' : '') + (whole && !locked ? ' whole' : '')
      + (s.isDragging ? (card ? ' dragging' : ' lifted') : '');
    return h('div', {
      ref: (el) => { s.setNodeRef(el); if (el) { S.els[id] = el; if (whole) S.handles[id] = el; } },
      ...(whole ? act : {}),
      className: cls,
      'data-role': 'card',
      'data-id': id,
      style,
    }, card ? cardContent(S, id) : rowContent(S, id, grip));
  }

  // ---- render / locate

  function render(ctx, engine) {
    const React = window.React;
    const ReactDOM = window.ReactDOM;
    const lib = engine === 'pangea' ? window.ReactBeautifulDnd : window.DndKit;
    if (!React || !ReactDOM || !lib) throw new Error(`reorder/${engine}: vendored React or the drag library is missing`);
    ctx.css('rr-style', CSS);
    if (R) {
      R.abort.abort();
      const old = R.root;
      R.root = null;
      if (old) old.unmount();
      for (const root of R.keyRoots || []) root.unmount();
    }
    const { spec, rng } = ctx;
    const S = {
      ctx, spec, engine, kanban: spec.scenario === 'kanban', grid: spec.scenario === 'grid', tick: 0,
      els: {}, handles: {}, bodies: {}, cols: {}, pane: null, board: null, active: null, dragging: false,
      press: null, up: null, snap: null, abort: new AbortController(),
    };
    S.groups = S.kanban ? Object.fromEntries(gidsOf(spec).map((c) => [c, ctx.model.columns[c].slice()])) : { main: ctx.model.order.slice() };
    measure(S);
    S.handleAll = S.kanban || S.grid || rng.bool(0.5);
    S.distance = rng.pick([3, 5, 8, 10]);
    S.auto = { startFromPercentage: 0.12, maxScrollAtPercentage: 0.03, maxPixelScroll: 18 };
    const wrap = ctx.util.el('div', `rr-wrap rr-${engine}`, ctx.stage);
    wrap.style.margin = `${rng.int(4, 14)}px ${rng.int(8, 28)}px`;
    S.wrap = wrap;
    const keyFirst = !S.kanban && spec.legend && rng.bool(0.3);
    let mount = wrap;
    if (!S.kanban) {
      const left = keyFirst ? ctx.util.el('div', '', wrap) : null;
      mount = ctx.util.el('div', '', wrap);
      const right = !keyFirst && spec.legend ? ctx.util.el('div', '', wrap) : null;
      // The static key panel is a root of its own, rendered now (the layout is final when render returns).
      S.keyRoots = [left, right].filter(Boolean).map((box) => ReactDOM.createRoot(box));
      ReactDOM.flushSync(() => S.keyRoots.forEach((root) => root.render(keyPanel(spec))));
    }
    R = S;
    S.root = ReactDOM.createRoot(mount);
    ReactDOM.flushSync(() => draw(S));
    bindPage(S, engine === 'pangea' ? 'mousedown' : 'pointerdown', engine === 'pangea' ? 'mouseup' : 'pointerup');
    if (S.pane) mirrorPane(S);
    const anchor = S.kanban ? (S.pane || S.board) : S.bodies.main;
    return { anchors: [anchor] };
  }

  function locate(t) {
    const S = R;
    const r = (id) => rectOf(S.els[id]);
    if (t.pane !== undefined) {
      const pr = S.pane.getBoundingClientRect();
      return [pr.left + pr.width / 2, pr.top + 20];
    }
    if (t.slot === undefined && t.column === undefined) {
      if (t.item === undefined) throw new Error(`reorder/${S.engine} cannot locate ${JSON.stringify(t)}`);
      const el = S.handles[t.item] || S.els[t.item];
      const b = rectOf(el);
      const c = r(t.item);
      return [b.cx, c.cy];
    }
    // Release points for the drop rule in the header: the center of the item now in the slot (for lists, at the
    // x of its handle, so a press on a handle and the release line up).
    const at = (ids, slot) => {
      const k = Math.max(0, Math.min(slot, ids.length - 1));
      const c = r(ids[k]);
      return [S.grid || S.kanban ? c.cx : rectOf(S.handles[ids[k]] || S.els[ids[k]]).cx, c.cy];
    };
    if (!S.kanban) return at(S.groups.main, t.slot);
    const col = t.column;
    const ids = S.groups[col];
    const slot = t.slot === undefined ? ids.length : t.slot;
    if (t.item !== undefined && ids.includes(t.item)) return at(ids, slot);
    const body = rectOf(S.bodies[col]);
    if (slot < ids.length) {
      const c = r(ids[slot]);
      return [c.cx, c.t + Math.min(c.h * 0.25, 8)];
    }
    if (!ids.length) return [body.cx, body.t + Math.min(40, body.h / 2)];
    const last = r(ids[ids.length - 1]);
    if (body.b - last.b > 16) return [body.cx, last.b + Math.min(12, (body.b - last.b) / 2)];
    return [last.cx, last.b - Math.min(last.h * 0.25, 8)];
  }

  // The definitions are registered by templates/reorder-items/base.js (names, scenarios, traits, uses); this file
  // supplies the behaviour. The kit holds those same objects, so assigning to them is enough.
  const def = (name) => env.widgetOf('reorder-items', name);
  if (def('pangea')) Object.assign(def('pangea'), { render: (ctx) => render(ctx, 'pangea'), locate });
  if (def('dndkit')) Object.assign(def('dndkit'), { render: (ctx) => render(ctx, 'dndkit'), locate });
})();
