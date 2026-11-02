/*
 * templates / reorder / cards: absolutely positioned cards on env.ui.sortable. Scenarios: grid, list,
 * kanban, move (the medoid's live move/list and scrolling-kanban paths are retained).
 * Empty designs reproduce design-reorder-items-grid-01 (lineage medoid), design-reorder-items-list-01 and
 * design-reorder-items-kanban-11 for their respective scenarios. Move uses the medoid's unmodified list path.
 * The rejected table registrations and scaffold wrappers are dead and are intentionally absent.
 * See README.md beside this file for the complete 36-site variation inventory and counts.
 *
 * Tokens (defaults below; data replaces whole values):
 *   chromeHints true       update the Memphis/newspaper frame for non-month/non-alpha rules
 *   numericClass true      add .numeric to numeric grid cards
 *   flatClasses []         body classes selecting the unsampled list geometry and unpadded available room
 *   zeroMarginClasses []   body classes selecting margin 0, skipping both margin RNG draws
 *   monthHint null         Memphis descending-month helper text, before setting the wrap margin
 *   gridCols null          fixed visual grid columns; null uses spec.cols, without changing model order
 *   gridGap .0175          minimum grid gap as a fraction of stage width (keeps the sampled gap draw)
 *   gridHeight .64         fraction of available row height; minimum card height remains 40
 *   gridWidth .90          fraction of stage width occupied by grid cards and their gaps
 *   listGapMin 4           minimum gap in the flat list branch, in px
 *   listGap .009           flat-list gap as a fraction of stage height
 *   listHeight .075        flat-list card height cap as a fraction of stage height; Infinity removes cap
 *   listFill null          flat-list height budget as a fraction of stage height; null uses available height
 *   listFontMax 24         flat-list maximum font size in px (minimum 15)
 *   listFont .46           flat-list font size as a fraction of card height
 *   tray false             deterministic tray/column geometry; false keeps the medoid's sampled kanban
 *   realStaging false      initialize staged ids from the actual source group; skip fake tray offsets
 *   avatars true           draw the avatar coin flip and, when true, sampled person/color per card
 *   roundBoard false       round kanban board width to integer px
 *   roundPane false        floor the deterministic kanban pane width
 *   kanbanWidth .205       non-pane kanban card width cap as a fraction of stage width
 *   columnGap .026         deterministic kanban column gap as a fraction of stage width
 *   kanbanHead [34,.086]   deterministic header height: max(minimum px, stage height * fraction)
 *   stagingLast false      put an actual staging group after destinations instead of before them
 *
 * VARIANTS (applied before a site's design):
 *   list: numericClass false; flatClasses/zeroMarginClasses ['memphis']; monthHint is the descending-month
 *         wording of list-01. These branches recur in 11/12 list sources (default wording in 9/12).
 *   kanban: chromeHints false, tray true, avatars false (12/12, 11/12, 11/12 respectively); board/pane
 *           rounding remains false, as in 7/12. The empty-design representative is kanban-11: width .224,
 *           header [28,.073], and trayFit/tray/trayPositions presets build its bottom tray. Its one-off
 *           layout has no majority equivalent; the other tray styles replace those small parts.
 *
 * Parts: design.parts.<name> = (base, S) => replacement. Every call, including nested calls and callbacks,
 * goes through P. S has live D/P, ctx, spec, board, wrap, geo (settable), sortable, paneEl/paneGeo, layout,
 * cards, staged/trayPositions (settable), dragScrollStart/trayDelta (settable), showCounts, EDGE_BAND,
 * LOCK_SVG, and extra (private per-page scratch state for designs). L is the kanban layout record
 * {size, n, k, barH, wordy, boardW, boardH}. Parts return nothing unless documented otherwise:
 *   style(id, css)                      inject shared CSS + css once, at the original cascade position
 *   tagEl(util, parent, lab) -> el       create the colored tag badge
 *   keyPanel(ctx, parent) -> el|null     create a legend, or null when absent
 *   isLocked(spec, id) -> bool          whether this id is pinned
 *   onOrder(ctx, getSortable) -> fn     drop handler: re-pin, set when needed, mirror model order
 *   mirrorFocus(ctx, root, idOf)         mirror focus and pointer focusing for keyboard episodes
 *   orderedBegin(ctx, wrap)              before ordered measurements (noop)
 *   available(ctx, wrap) -> room         {availW, availH}, subtracting legend and stage margins
 *   gridFit(ctx, room, longest)          mutate geo: grid card dimensions, pitch and font; one gap draw
 *   listFit(ctx, room, longest)          mutate geo: list dimensions; two draws unless flatClasses matches
 *   orderedFit(ctx, wrap)                after board extent calculation, before board creation (noop)
 *   orderedBoard(ctx, wrap)              after board creation and sizing (noop)
 *   orderedCard(ctx, card, lab, longest) after data attributes, before card sizing and children (noop)
 *   gridTitle(ctx, card, lab, longest) -> el   create the main tile title, before its optional subtitle
 *   grip(ctx, card) -> el               create the unlocked list grip (text dots)
 *   orderedReady(ctx, wrap)              after sortable setup, before focus listeners (noop)
 *   slotPos(i) -> [x,y]                 ordered slot position from live geo
 *   renderOrdered(ctx, wrap)             render list/move/grid, using the smaller parts above
 *   mirrorPane(ctx)                      mirror scroll/width/max/column spans into model.pane
 *   thumbLeft(scroll) -> number          scrollbar thumb offset in px
 *   kanbanSize(ctx, wrap) -> size         use ctx.size (may remeasure frame or size/position wrap)
 *   kanbanFit(ctx, size) -> L            sample/compute geo, initialize staging, return layout
 *   trayFit(ctx, size)                   after deterministic heights/staging, before column widths (noop)
 *   columnFit(ctx, size)                 after widths and pitches, before board extents (noop)
 *   boardHeight(ctx, size, barH) -> px   tray: full available height; sampled: column height
 *   boardWidth(ctx, size) -> px          column extents, optionally rounded
 *   staging(ctx)                        reset staged/trayPositions for this episode
 *   cardPos(columnIndex, i, n) -> [x,y]  column slot, with compressed pitch in crowded columns
 *   paneColumns() -> map                column spans for the task oracle
 *   paneWidth(ctx, L) -> px             deterministic width or sampled 2.2-3.4 columns (one float draw)
 *   kanbanBoard(ctx, L)                  set .ordered on trays, board size, and sampled-board font draw
 *   trayPositions(ctx, L)                fill the visual fake-source positions (base: four columns)
 *   tray(ctx, wrap, L) -> groupEls       build tray DOM before columns; base: label + fake positions
 *   columnIds() -> ids                  visible destination column order (base: spec.columns)
 *   groupIds() -> ids                   sortable group order, including a real staging group if enabled
 *   columnBegin(ctx, col, c, ci, L)      before column heading creation (noop)
 *   column(ctx, col, h, c, ci, L) -> el  add the column heading's label
 *   columnReady(ctx, col, h, c, ci, L)   after heading/count creation (noop)
 *   columnsReady(ctx, L, cols, counts)   after all columns, before the first count update (noop)
 *   counts(ctx, cols, counts, L) -> fn   create a callback displaying model column counts
 *   kanbanCardBegin(ctx, card, lab, L)   after avatars, before title/value (noop)
 *   kanbanTitle(ctx, card, lab, L) -> el create title with wordy wrapping and 13px wordy font
 *   kanbanCard(ctx, card, lab, L)        after title/value, before sortable setup (noop)
 *   kanbanReady(ctx, wrap, L, cols)      after sortable setup, before pane controls (noop)
 *   slotRect(i, column, n) -> [x,y,w,h]  map a group id to its slot geometry
 *   dragStart(id)                       record scroll and fake-source grab offset
 *   dragRect(el, rect, info) -> rect    apply fake-source placement and grab offsets
 *   pan(el, rect, info) -> rect         edge-pan the pane, mirror it, compensate dragged x
 *   place(el, rect, info)               delegate to sortable.defaultPlace after dragRect/pan
 *   dragScrollDelta() -> px             live scroll minus the scroll at drag start
 *   groupAt([x,y]) -> id                nearest destination column, with pan/source compensation
 *   dropRule([x,y], slots) -> index     closest slot center in 2D, with pan/source compensation
 *   columnsChanged(columns, info)       clear fake staging/reflow when needed, update model and counts
 *   paneReady(ctx)                      before pane listeners and first pane mirror (noop)
 *   renderKanban(ctx, wrap)             create board, columns/cards, sortable and pane controls
 *   begin(ctx)                          frame hints after spec is set, before wrap creation
 *   wrap(ctx, wrap)                     descending-month helper and sampled/zero margin
 *   resetOrder(ctx)                     install widget.clear restoring this episode's initial order
 *   rendered(ctx, wrap)                 after rendering, before returning anchors (noop)
 *   render(ctx) -> {anchors}            episode setup and scenario dispatch
 *   locate(target) -> [x,y]             viewport target through sortable and pane geometry
 *   ctxCenter(el) -> [x,y]              viewport center of an element
 *
 * A replacement must preserve every original rng draw in order; extra decoration randomness uses a fork.
 */
(function () {
  'use strict';
  const SHARED_CSS = `
  .ro-tag { flex: none; display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px; border-radius: 999px;
    font-size: 11.5px; font-weight: 700; letter-spacing: .02em; white-space: nowrap;
    background: color-mix(in srgb, var(--tagc) 14%, var(--panel)); color: color-mix(in srgb, var(--tagc) 80%, var(--fg));
    border: 1px solid color-mix(in srgb, var(--tagc) 45%, transparent); }
  .ro-tag::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--tagc); }
  .ro-key { flex: none; align-self: flex-start; padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px;
    background: var(--panel); font-size: 13px; min-width: 150px; }
  .ro-key h4 { margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
  .ro-key ol { margin: 0; padding-left: 20px; display: grid; gap: 6px; }
  .ro-key li .ro-tag { font-size: 12px; }
  .ro-lockic { color: var(--muted); display: inline-flex; }
  .ro-locked { opacity: .82; }
  `;

  const CSS = `
  .ro-wrap { display: flex; gap: 22px; align-items: flex-start; flex: none; }
  .ro-board { position: relative; flex: none; }
  .ro-card, .ro-slot { position: absolute; border-radius: 8px; }
  .ro-card {
    display: flex; align-items: center; gap: 10px; padding: 0 12px; box-sizing: border-box;
    border: 1px solid var(--line); background: var(--panel); font-weight: 600; box-shadow: 0 1px 2px rgba(0,0,0,.08);
  }
  .ro-card:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
  .ro-card .ro-h { position: absolute; inset: 0; }
  .ro-card .ro-t { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; position: relative; pointer-events: none; }
  .ro-card .ro-v { flex: none; font-variant-numeric: tabular-nums; color: var(--muted); font-weight: 600; position: relative; pointer-events: none; }
  .ro-card .ro-tag, .ro-card .ro-grip, .ro-card .ro-lockic, .ro-card .ro-av { position: relative; pointer-events: none; }
  .ro-card .ro-t.wrap { white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-height: 1.25; }
  .ro-card.tile { flex-direction: column; justify-content: center; gap: 2px; padding: 4px 8px; text-align: center; }
  .ro-card.tile .ro-t { flex: none; width: 100%; }
  .ro-card.tile .ro-sub { width: 100%; font-size: 11px; font-weight: 500; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; pointer-events: none; }
  .ro-card.dragging { z-index: 5; border-color: var(--accent); box-shadow: 0 8px 22px rgba(0,0,0,.25); }
  .ro-grip { color: var(--muted); letter-spacing: -2px; }
  .ro-slot { border: 2px dashed var(--accent); opacity: .6; box-sizing: border-box; }
  .ro-col { position: absolute; border: 1px solid var(--line); border-radius: 10px; background: color-mix(in srgb, var(--panel) 60%, var(--bg)); box-sizing: border-box; }
  .ro-col h3 { margin: 0; padding: 0 12px; font-size: 13px; color: var(--muted); text-transform: uppercase; letter-spacing: .04em;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; justify-content: space-between; gap: 6px; }
  .ro-col h3 small { font-size: 11px; opacity: .8; }
  .ro-av { flex: none; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: 10px; font-weight: 700; color: #fff; }
  .ro-pane { position: relative; overflow: hidden; flex: none; }
  .ro-bar { position: relative; height: 12px; margin-top: 6px; border-radius: 6px; background: color-mix(in srgb, var(--line) 70%, transparent); }
  .ro-thumb { position: absolute; top: 1px; height: 10px; border-radius: 5px; background: color-mix(in srgb, var(--muted) 70%, var(--panel)); cursor: grab; }
  .ro-thumb:hover, .ro-thumb.on { background: var(--accent); }
  .ro-hint { font-size: 12px; color: var(--muted); margin-top: 4px; }
  `;

  const EDGE_BAND = 36;

  const TOKENS = {
    chromeHints: true, numericClass: true, flatClasses: [], zeroMarginClasses: [], monthHint: null,
    gridCols: null, gridGap: .0175, gridHeight: .64, gridWidth: .90,
    listGapMin: 4, listGap: .009, listHeight: .075, listFill: null, listFontMax: 24, listFont: .46,
    tray: false, realStaging: false, avatars: true, roundBoard: false, roundPane: false,
    kanbanWidth: .205, columnGap: .026, kanbanHead: [34, .086], stagingLast: false,
  };
  const SCENARIOS = {
    list: { numericClass: false, flatClasses: ['memphis'], zeroMarginClasses: ['memphis'],
      monthHint: 'Drag and drop the months on the right to arrange them from December to January.' },
    kanban: {
      chromeHints: false, tray: true, avatars: false, kanbanWidth: .224, kanbanHead: [28, .073],
      parts: {
        trayFit: (base, S) => (ctx, size) => {
          const { geo, spec } = S, rows = Math.max(2, Math.ceil(S.staged.size / 4));
          if (!spec.pane && rows > 2) {
            geo.h = Math.min(geo.h, (size.height * .308 - (rows - 1) * 8) / rows);
            geo.pitchY = geo.h + 8;
          }
          geo.binY = 0;
          geo.colH = spec.pane ? size.height - 22 - 3 : size.height * .576;
        },
        tray: (base, S) => (ctx, wrap, L) => {
          const { size, boardW } = L, { util } = ctx;
          if (!S.spec.pane) {
            const box = util.el('div', 'tray-box', S.board);
            Object.assign(box.style, { left: '0px', top: size.height * .62 + 'px', width: boardW + 'px', height: size.height * .38 + 'px' });
          }
          const label = util.el('div', 'tray-label', S.board);
          util.el('strong', '', label, 'Cards');
          util.el('span', '', label, ' (drag from here)');
          label.hidden = !!S.spec.pane;
          if (!S.spec.pane) { label.style.top = size.height * .633 + 'px'; label.style.left = size.width * .014 + 'px'; }
          S.P.trayPositions(ctx, L);
          return {};
        },
        trayPositions: (base, S) => (ctx, L) => {
          const { size } = L, { spec, geo } = S;
          S.trayPositions = {};
          spec.items.filter((id) => S.staged.has(id)).forEach((id, i) => {
            S.trayPositions[id] = { x: size.width * .019 + (i % 4) * size.width * .244,
              y: size.height * (spec.pane ? .07 : .692) + Math.floor(i / 4) * geo.pitchY, w: geo.w, h: geo.h };
          });
        },
      },
    },
  };

  env.template('reorder-items/cards', (design, def) => {
    const shared = env.templateLib('reorder-items/_shared');
    const { LOCK_SVG } = shared;
    let D, P;
    let board, slotEl, geo, spec, sortable, paneEl, thumbEl, barEl, paneGeo, ctxRef, wrapRef;
    let staged, trayPositions, layout, cards, showCounts, dragScrollStart, trayDelta;
    const extra = {};
    const BASE = {};
    const S = {
      get D() { return D; }, get P() { return P; }, get ctx() { return ctxRef; },
      get board() { return board; }, get wrap() { return wrapRef; }, get spec() { return spec; },
      get geo() { return geo; }, set geo(v) { geo = v; }, get sortable() { return sortable; },
      get paneEl() { return paneEl; }, get paneGeo() { return paneGeo; }, get layout() { return layout; },
      get cards() { return cards; }, get staged() { return staged; }, set staged(v) { staged = v; },
      get trayPositions() { return trayPositions; }, set trayPositions(v) { trayPositions = v; },
      get dragScrollStart() { return dragScrollStart; }, set dragScrollStart(v) { dragScrollStart = v; },
      get trayDelta() { return trayDelta; }, set trayDelta(v) { trayDelta = v; },
      get showCounts() { return showCounts; }, EDGE_BAND, LOCK_SVG, extra,
    };

    BASE.style = (id, css) => {
      if (document.getElementById(id)) return;
      const s = document.createElement('style');
      s.id = id;
      s.textContent = SHARED_CSS + css;
      document.head.append(s);
    };

    BASE.tagEl = (util, parent, lab) => shared.tagEl(util, parent, lab);

    // The legend (key) for page-grounded rules.
    BASE.keyPanel = (ctx, parent) => {
      const { util, spec } = ctx;
      if (!spec.legend) return null;
      const box = util.el('div', 'ro-key', parent);
      util.el('h4', '', box, spec.legendTitle || 'Key');
      const ol = util.el('ol', '', box);
      for (const l of spec.legend) P.tagEl(util, util.el('li', '', ol), l);
      return box;
    };

    BASE.isLocked = (spec, id) => !!(spec.locked && id in spec.locked);

    // Drop handler shared by both widgets: re-pin locked items, mirror the order.
    BASE.onOrder = (ctx, getSortable) => shared.onOrder(env, ctx, getSortable);

    // Focus mirror for keyboard episodes.
    BASE.mirrorFocus = (ctx, root, idOf) => shared.mirrorFocus(ctx, root, idOf);


    BASE.orderedBegin = () => {};
    BASE.available = (ctx, wrap) => {
      const flat = D.flatClasses.some((c) => document.body.classList.contains(c));
      return { availW: ctx.size.width - (flat ? 0 : 60) - (spec.legend ? 190 : 0),
        availH: ctx.size.height - (flat ? 0 : 36) };
    };
    BASE.gridFit = (ctx, { availW, availH }, longest) => {
      const { rng, size } = ctx;
      const rows = Math.ceil(spec.items.length / geo.cols);
      const gapDraw = rng.int(8, 16);
      const gap = Math.max(gapDraw, Math.round(size.width * D.gridGap));
      const maxH = Math.floor((availH - (rows - 1) * gap) / rows);
      const maxW = Math.floor((availW - (geo.cols - 1) * gap) / geo.cols);
      geo.h = Math.max(40, Math.floor(maxH * D.gridHeight));
      geo.w = Math.min(maxW, Math.floor((size.width * D.gridWidth - (geo.cols - 1) * gap) / geo.cols));
      geo.pitchX = geo.w + gap;
      geo.pitchY = geo.h + gap;
      geo.font = Math.max(18, Math.min(42, Math.floor(geo.h * 0.35)));
    };
    BASE.listFit = (ctx, { availW, availH }, longest) => {
      const { rng, size } = ctx;
      const n = spec.items.length;
      const flat = D.flatClasses.some((c) => document.body.classList.contains(c));
      const gap = flat ? Math.max(D.listGapMin, size.height * D.listGap) : rng.int(5, 10);
      geo.h = flat ? Math.min(size.height * D.listHeight, ((D.listFill === null ? availH : size.height * D.listFill) - (n - 1) * gap) / n)
        : Math.max(26, Math.min(rng.int(40, 56), Math.floor(availH / n) - gap));
      geo.pitchX = 0;
      geo.pitchY = geo.h + gap;
      geo.font = flat ? Math.max(15, Math.min(D.listFontMax, geo.h * D.listFont))
        : Math.max(12, Math.min(17, Math.floor(geo.h * 0.38)));
      geo.w = availW;
    };
    BASE.orderedFit = () => {};
    BASE.orderedBoard = () => {};
    BASE.orderedCard = () => {};
    BASE.gridTitle = (ctx, card, lab) => ctx.util.el('span', 'ro-t', card, lab.value || lab.title);
    BASE.grip = (ctx, card) => ctx.util.el('span', 'ro-grip', card, '⋮⋮');
    BASE.orderedReady = () => {};
    BASE.slotPos = (i) => {
      const col = i % geo.cols;
      const row = Math.floor(i / geo.cols);
      return [col * geo.pitchX, row * geo.pitchY];
    };

    BASE.renderOrdered = (ctx, wrap) => {
      const { rng, util, size } = ctx;
      const n = spec.items.length;
      const grid = spec.scenario === 'grid';
      P.orderedBegin(ctx, wrap);
      const room = P.available(ctx, wrap);
      const longest = Math.max(...spec.items.map((id) => spec.labels[id].title.length + (spec.labels[id].value || '').length * 0.9 + (spec.labels[id].tag ? 10 : 0)));
      geo = { cols: grid && D.gridCols ? D.gridCols : spec.cols };
      if (grid) P.gridFit(ctx, room, longest);
      else P.listFit(ctx, room, longest);
      const rows = Math.ceil(n / geo.cols);
      geo.boardW = (geo.cols - 1) * geo.pitchX + geo.w;
      geo.boardH = (rows - 1) * geo.pitchY + geo.h;
      P.orderedFit(ctx, wrap);
      board = util.el('div', 'ro-board', wrap);
      Object.assign(board.style, { width: geo.boardW + 'px', height: geo.boardH + 'px', fontSize: geo.font + 'px' });
      P.orderedBoard(ctx, wrap);
      slotEl = util.el('div', 'ro-slot', board);
      Object.assign(slotEl.style, { width: geo.w + 'px', height: geo.h + 'px' });
      const cards = {};
      const showTag = rng.bool(0.5);
      for (const id of ctx.model.order) {
        const lab = spec.labels[id];
        const locked = P.isLocked(spec, id);
        const card = util.el('div', 'ro-card' + (grid ? ' tile' : '') + (D.numericClass && grid && spec.rule.kind === 'number' ? ' numeric' : '') + (locked ? ' ro-locked' : ''), board);
        card.dataset.role = 'card';
        card.dataset.id = id;
        P.orderedCard(ctx, card, lab, longest);
        Object.assign(card.style, { width: geo.w + 'px', height: geo.h + 'px' });
        if (!locked) util.el('div', 'ro-h', card);
        if (grid) {
          P.gridTitle(ctx, card, lab, longest);
          if (lab.value) util.el('span', 'ro-sub', card, lab.title);
        } else {
          if (locked) util.el('span', 'ro-lockic', card).innerHTML = LOCK_SVG;
          else P.grip(ctx, card);
          util.el('span', 'ro-t', card, lab.title);
          if (lab.tag && (showTag || !lab.value)) P.tagEl(util, card, lab).style.position = 'relative';
          if (lab.value) util.el('span', 'ro-v', card, lab.value);
        }
        if (locked) card.title = 'Pinned';
        cards[id] = card;
      }
      sortable = env.ui.sortable(board, {
        items: cards,
        order: ctx.model.order,
        handle: '.ro-h',
        slotRect: (i) => [...P.slotPos(i), geo.w, geo.h],
        placeholder: slotEl,
        bounds: 'center',
        activeClass: 'dragging',
        keyboard: !!spec.keys,
        label: 'card',
        onChange: P.onOrder(ctx, () => sortable),
      });
      P.orderedReady(ctx, wrap);
      if (spec.keys) P.mirrorFocus(ctx, board, (t) => t.closest && t.closest('.ro-card') && t.closest('.ro-card').dataset.id);
    };

    BASE.mirrorPane = (ctx) => {
      if (!paneEl) return;
      const cols = P.paneColumns();
      const pane = { scroll: Math.round(paneEl.scrollLeft), width: paneEl.clientWidth, max: paneGeo.max, cols };
      const old = ctx.model.pane;
      if (old && old.scroll === pane.scroll && old.width === pane.width) return;
      if (thumbEl) thumbEl.style.left = P.thumbLeft(pane.scroll) + 'px';
      ctx.update({ ...ctx.model, pane });
    };

    BASE.thumbLeft = (s) => {
      return paneGeo.max > 0 ? (s / paneGeo.max) * (paneGeo.trackW - paneGeo.thumbW) : 0;
    };


    BASE.kanbanSize = (ctx, wrap) => ctx.size;
    BASE.kanbanFit = (ctx, size) => {
      const { rng } = ctx;
      const n = spec.items.length, k = spec.columns.length;
      const barH = spec.pane ? 22 : 0;
      const wordy = spec.items.some((id) => spec.labels[id].title.length > 16);
      if (D.tray) {
        geo = { head: Math.max(D.kanbanHead[0], size.height * D.kanbanHead[1]), pad: Math.max(9, size.width * .012), binY: 0 };
        geo.h = Math.max(46, size.height * .122);
        geo.pitchY = geo.h + Math.max(10, size.height * .028);
        P.staging(ctx);
        const trayRows = Math.max(2, Math.ceil(staged.size / 4));
        geo.binY = Math.min(size.height * .49, Math.max(size.height * .392, size.height * .07 + trayRows * geo.pitchY));
        geo.colH = size.height - geo.binY - barH - 3;
        P.trayFit(ctx, size);
        if (spec.pane) geo.w = Math.min(260, Math.max(170, size.width * .205));
        else geo.w = Math.min(size.width * D.kanbanWidth, (size.width - 28 * (k - 1)) / k - 2 * geo.pad);
        geo.colW = spec.pane ? Math.max(geo.w + 2 * geo.pad, size.width * .316) : (size.width - size.width * D.columnGap * (k - 1)) / k;
        geo.pitchX = geo.colW + size.width * D.columnGap;
        P.columnFit(ctx, size);
      } else {
        geo = { head: rng.int(34, 42), pad: rng.int(8, 10) };
        geo.h = wordy ? rng.int(48, 56) : rng.int(36, 44);
        geo.pitchY = geo.h + rng.int(6, 9);
        const maxColH = size.height - 36 - barH;
        const wantColH = geo.head + 2 * geo.pad + n * geo.pitchY;
        geo.colH = Math.min(maxColH, wantColH);
        if (spec.pane) geo.w = rng.int(180, 220);
        else {
          const maxW = Math.floor((size.width - 70) / k) - 56;
          geo.w = Math.min(maxW, rng.int(Math.min(190, maxW), Math.max(170, Math.min(250, maxW))));
        }
        geo.colW = geo.w + 2 * geo.pad;
        geo.pitchX = geo.colW + (spec.pane ? rng.int(12, 20) : rng.int(16, 36));
        P.columnFit(ctx, size);
      }
      const boardW = P.boardWidth(ctx, size);
      return { size, n, k, barH, wordy, boardW, boardH: P.boardHeight(ctx, size, barH) };
    };
    BASE.trayFit = () => {};
    BASE.columnFit = () => {};
    BASE.boardHeight = (ctx, size, barH) => D.tray ? size.height - barH : geo.colH;
    BASE.boardWidth = () => {
      const w = (spec.columns.length - 1) * geo.pitchX + geo.colW;
      return D.roundBoard ? Math.round(w) : w;
    };
    BASE.staging = (ctx) => {
      staged = new Set(D.realStaging && spec.staging ? (ctx.model.columns[spec.staging] || []) : []);
      trayPositions = {};
      if (!spec.pane && !(D.realStaging && spec.staging)) {
        for (const c of spec.columns) for (const id of ctx.model.columns[c] || []) {
          if (spec.member[id] !== c) staged.add(id);
        }
      }
    };
    BASE.cardPos = (c, i, n) => {
      const room = geo.colH - geo.head - 2 * geo.pad - geo.h;
      const pitch = n > 1 ? Math.min(geo.pitchY, room / (n - 1)) : geo.pitchY;
      return [c * geo.pitchX + geo.pad, (geo.binY || 0) + geo.head + geo.pad + i * pitch];
    };
    BASE.paneColumns = () => Object.fromEntries(spec.columns.map((c, ci) => [c, [ci * geo.pitchX, ci * geo.pitchX + geo.colW]]));
    BASE.paneWidth = (ctx, L) => {
      if (D.tray) {
        const w = Math.min(L.size.width - 3, L.boardW - 40);
        return D.roundPane ? Math.floor(w) : w;
      }
      const shown = ctx.rng.float(2.2, 3.4);
      const pw = Math.floor(Math.min(L.size.width - 64, shown * geo.pitchX, L.boardW - 40));
      return Math.min(Math.max(2 * geo.pitchX + 10, pw), L.size.width - 64);
    };
    BASE.kanbanBoard = (ctx, L) => {
      if (D.tray) board.classList.toggle('ordered', !!spec.ordered);
      Object.assign(board.style, { width: L.boardW + 'px', height: L.boardH + 'px' });
      if (!D.tray) board.style.fontSize = ctx.rng.int(14, 16) + 'px';
    };
    BASE.trayPositions = (ctx, L) => {
      trayPositions = {};
      spec.items.filter((id) => staged.has(id)).forEach((id, i) => {
        trayPositions[id] = { x: L.size.width * .012 + (i % 4) * L.size.width * .227,
          y: L.size.height * .07 + Math.floor(i / 4) * geo.pitchY, w: geo.w, h: geo.h };
      });
    };
    BASE.tray = (ctx, wrap, L) => {
      if (D.tray) {
        ctx.util.el('div', 'tray-label', board, 'Cards (drag to a column):');
        P.trayPositions(ctx, L);
      }
      return {};
    };
    BASE.columnIds = () => spec.columns;
    BASE.groupIds = () => D.realStaging && spec.staging
      ? (D.stagingLast ? [...spec.columns, spec.staging] : [spec.staging, ...spec.columns]) : spec.columns;
    BASE.columnBegin = () => {};
    BASE.column = (ctx, col, h, c, ci, L) => ctx.util.el('span', '', h, spec.colLabels[c]);
    BASE.columnReady = () => {};
    BASE.columnsReady = () => {};
    BASE.counts = (ctx, cols, counts, L) => () => {
      for (const c of spec.columns) counts[c].textContent = String((ctx.model.columns[c] || []).length);
    };
    BASE.kanbanTitle = (ctx, card, lab, L) => {
      const t = ctx.util.el('span', 'ro-t' + (L.wordy ? ' wrap' : ''), card, lab.title);
      if (L.wordy) t.style.fontSize = '13px';
      return t;
    };
    BASE.kanbanCardBegin = () => {};
    BASE.kanbanCard = () => {};
    BASE.kanbanReady = () => {};
    BASE.slotRect = (i, c, n) => [...P.cardPos(spec.columns.indexOf(c), i, n), geo.w, geo.h];
    BASE.dragStart = (id) => {
      dragScrollStart = paneEl ? paneEl.scrollLeft : 0;
      trayDelta = { x: 0, y: 0 };
      if (D.tray && staged.has(id) && !(D.realStaging && spec.staging)) {
        const c = spec.columns.find((c) => ctxRef.model.columns[c].includes(id));
        const items = ctxRef.model.columns[c];
        const p = P.cardPos(spec.columns.indexOf(c), items.indexOf(id), items.length);
        trayDelta = { x: trayPositions[id].x - p[0], y: trayPositions[id].y - p[1] };
      }
    };
    BASE.dragRect = (el, rect, info) => {
      if (D.tray && info.dragging) rect = { ...rect, x: rect.x + trayDelta.x, y: rect.y + trayDelta.y };
      if (D.tray && !(D.realStaging && spec.staging) && !info.dragging && !info.placeholder && staged.has(info.id)) rect = trayPositions[info.id];
      return rect;
    };
    BASE.pan = (el, rect, info) => {
      if (info.dragging && paneEl) {
        const br = board.getBoundingClientRect();
        const pr = paneEl.getBoundingClientRect();
        const x = br.left + rect.x + rect.w / 2 + P.dragScrollDelta() - pr.left;
        if (x > paneEl.clientWidth - EDGE_BAND) {
          const fraction = Math.min(1, (x - paneEl.clientWidth + EDGE_BAND) / EDGE_BAND);
          paneEl.scrollLeft = Math.max(paneEl.scrollLeft, dragScrollStart + fraction * (paneGeo.max - dragScrollStart));
        } else if (x < EDGE_BAND) {
          const fraction = Math.min(1, (EDGE_BAND - x) / EDGE_BAND);
          paneEl.scrollLeft = Math.min(paneEl.scrollLeft, dragScrollStart * (1 - fraction));
        }
        P.mirrorPane(ctxRef);
        rect = { ...rect, x: rect.x + P.dragScrollDelta() };
      }
      return rect;
    };
    BASE.place = (el, rect, info) => env.ui.sortable.defaultPlace(el, rect, info);
    BASE.dragScrollDelta = () => paneEl ? paneEl.scrollLeft - dragScrollStart : 0;
    BASE.groupAt = (c) => {
      const x = c[0] + P.dragScrollDelta() + (D.tray ? trayDelta.x : 0);
      return spec.columns.reduce((best, col, i) => {
        const near = Math.max(i * geo.pitchX - x, x - (i * geo.pitchX + geo.colW), 0);
        return !best || near < best.distance ? { col, distance: near } : best;
      }, null).col;
    };
    BASE.dropRule = (c, slots) => {
      const x = c[0] + P.dragScrollDelta() + (D.tray ? trayDelta.x : 0);
      let best = 0, distance = Infinity;
      slots.forEach((r, i) => {
        const d = Math.hypot(r.x + r.w / 2 - x, r.y + r.h / 2 - c[1] - (D.tray ? trayDelta.y : 0));
        if (d < distance) { distance = d; best = i; }
      });
      return best;
    };
    BASE.columnsChanged = (columns, info) => {
      if (D.tray && !D.realStaging) {
        staged.delete(info.item);
        trayDelta = { x: 0, y: 0 };
        sortable.set(columns);
      }
      ctxRef.update({ ...ctxRef.model, columns });
      showCounts();
    };
    BASE.paneReady = () => {};
    BASE.renderKanban = (ctx, wrap) => {
      const { rng, util } = ctx;
      layout = P.kanbanFit(ctx, P.kanbanSize(ctx, wrap));
      const L = layout;
      let host = wrap;
      if (spec.pane) {
        const box = util.el('div', '', wrap);
        paneEl = util.el('div', 'ro-pane', box);
        paneGeo = { width: P.paneWidth(ctx, L) };
        Object.assign(paneEl.style, { width: paneGeo.width + 'px', height: L.boardH + 'px' });
        paneGeo.max = Math.max(0, L.boardW - paneGeo.width);
        barEl = util.el('div', 'ro-bar', box);
        barEl.style.width = paneGeo.width + 'px';
        paneGeo.trackW = paneGeo.width;
        paneGeo.thumbW = Math.max(40, Math.round((paneGeo.width / L.boardW) * paneGeo.trackW));
        thumbEl = util.el('div', 'ro-thumb', barEl);
        thumbEl.dataset.role = 'scrollbar';
        thumbEl.style.width = paneGeo.thumbW + 'px';
        host = paneEl;
      } else { paneEl = null; thumbEl = null; }
      board = util.el('div', 'ro-board', host);
      P.kanbanBoard(ctx, L);
      const cols = P.tray(ctx, wrap, L);
      const counts = {};
      P.columnIds().forEach((c, ci) => {
        const col = util.el('div', 'ro-col', board);
        col.dataset.role = 'column';
        Object.assign(col.style, { left: ci * geo.pitchX + 'px', top: D.tray ? (geo.binY || 0) + 'px' : 0, width: geo.colW + 'px', height: geo.colH + 'px' });
          P.columnBegin(ctx, col, c, ci, L);
        const h = util.el('h3', '', col);
        h.style.height = geo.head + 'px';
        P.column(ctx, col, h, c, ci, L);
        counts[c] = util.el('small', '', h);
        cols[c] = col;
        P.columnReady(ctx, col, h, c, ci, L);
      });
      P.columnsReady(ctx, L, cols, counts);
      showCounts = P.counts(ctx, cols, counts, L);
      showCounts();
      slotEl = util.el('div', 'ro-slot', board);
      Object.assign(slotEl.style, { width: geo.w + 'px', height: geo.h + 'px' });
      cards = {};
      const avatars = D.avatars && rng.bool(0.5);
      const AV = ['#e8590c', '#1c7ed6', '#2f9e44', '#7048e8', '#d6336c', '#0c8599'];
      for (const id of spec.items) {
        const lab = spec.labels[id];
        const card = util.el('div', 'ro-card', board);
        card.dataset.role = 'card';
        Object.assign(card.style, { width: geo.w + 'px', height: geo.h + 'px', padding: '0 10px', gap: '8px' });
        util.el('div', 'ro-h', card);
        if (avatars) {
          const p = ctx.content.personName ? ctx.content.personName(rng, { csplit: spec.csplit }) : { first: 'A', last: 'B' };
          const av = util.el('span', 'ro-av', card, (p.first[0] + p.last[0]).toUpperCase());
          av.style.background = rng.pick(AV);
        }
        P.kanbanCardBegin(ctx, card, lab, L);
        P.kanbanTitle(ctx, card, lab, L);
        if (lab.value) {
          const v = util.el('span', 'ro-v', card, lab.value);
          v.style.fontSize = '12px';
        }
        P.kanbanCard(ctx, card, lab, L);
        cards[id] = card;
      }
      dragScrollStart = 0;
      trayDelta = { x: 0, y: 0 };
      sortable = env.ui.sortable(board, {
        items: cards, handle: '.ro-h', groups: ctx.model.columns, groupOrder: P.groupIds(), groupEls: cols,
        slotRect: (i, c, n) => P.slotRect(i, c, n), placeholder: slotEl, activeClass: 'dragging', label: 'card',
        onStart: (id) => P.dragStart(id),
        place: (el, rect, info) => P.place(el, P.pan(el, P.dragRect(el, rect, info), info), info),
        groupAt: (c) => P.groupAt(c), dropRule: (c, slots) => P.dropRule(c, slots),
        onChange: (columns, info) => P.columnsChanged(columns, info),
      });
      P.kanbanReady(ctx, wrap, L, cols);
      if (paneEl) {
        P.paneReady(ctx);
        paneEl.addEventListener('wheel', (e) => {
          const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? paneGeo.width : 1;
          const d = (Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * unit;
          e.preventDefault();
          paneEl.scrollLeft = Math.max(0, Math.min(paneGeo.max, paneEl.scrollLeft + d));
          P.mirrorPane(ctx);
        }, { passive: false });
        let s0 = 0;
        env.ui.track(thumbEl, {
          start() { s0 = paneEl.scrollLeft; thumbEl.classList.add('on'); },
          move(p) {
            const span = paneGeo.trackW - paneGeo.thumbW;
            paneEl.scrollLeft = Math.max(0, Math.min(paneGeo.max, s0 + (span > 0 ? (p.dx / span) * paneGeo.max : 0)));
            P.mirrorPane(ctx);
          },
          end() { thumbEl.classList.remove('on'); P.mirrorPane(ctx); },
        }, 'scrollbar');
        // Clicking the track pages the board (like a native scrollbar).
        barEl.addEventListener('pointerdown', (e) => {
          if (e.target !== barEl || e.button !== 0) return;
          const r = thumbEl.getBoundingClientRect();
          paneEl.scrollLeft = Math.max(0, Math.min(paneGeo.max, paneEl.scrollLeft + (e.clientX < r.left ? -1 : 1) * paneGeo.width * 0.8));
          P.mirrorPane(ctx);
        });
        P.mirrorPane(ctx);
      }
    };

    BASE.begin = (ctx) => {
      if (!D.chromeHints) return;
      if (document.body.classList.contains('memphis') && spec.rule.kind !== 'month') {
        const heading = document.querySelector('.brief-title');
        if (heading) heading.textContent = 'Organize the List';
        const helper = document.querySelector('.brief-copy');
        if (helper) helper.textContent = 'Drag and drop the items on the right to match the requested order.';
      }
      if (document.body.classList.contains('newspaper') && spec.rule.kind !== 'alpha') {
        const heading = document.querySelector('.article-intro h1');
        if (heading) heading.textContent = 'List Order';
        const helper = document.querySelector('.article-intro p');
        if (helper) helper.textContent = 'Rearrange the cards below to match the requested order:';
      }
    };
    BASE.wrap = (ctx, wrap) => {
      if (D.monthHint && document.body.classList.contains('memphis') && spec.rule.kind === 'month' && spec.rule.dir === 'desc') {
        const helper = document.querySelector('.brief-copy');
        if (helper) helper.textContent = D.monthHint;
      }
      wrap.style.margin = D.zeroMarginClasses.some((c) => document.body.classList.contains(c))
        ? '0' : `${ctx.rng.int(4, 14)}px ${ctx.rng.int(8, 28)}px`;
    };
    BASE.resetOrder = (ctx) => {
      const initialOrder = ctx.model.order.slice();
      env.widgetDef.clear = () => {
        sortable.set(initialOrder.slice());
        ctx.update({ ...ctx.model, order: initialOrder.slice() });
      };
    };
    BASE.rendered = () => {};
    BASE.render = (ctx) => {
      ctxRef = ctx;
      P.style('ro-style', CSS);
      spec = ctx.spec;
      P.begin(ctx);
      paneEl = null;
      thumbEl = null;
      wrapRef = ctx.util.el('div', 'ro-wrap', ctx.stage);
      const wrap = wrapRef;
      // Sampled offset inside the stage (the site also samples the stage alignment).
      P.wrap(ctx, wrap);
      if (spec.scenario === 'kanban') P.renderKanban(ctx, wrap);
      else {
        if (spec.legend && ctx.rng.bool(0.3)) {
          P.keyPanel(ctx, wrap);
          P.renderOrdered(ctx, wrap);
        } else {
          P.renderOrdered(ctx, wrap);
          P.keyPanel(ctx, wrap);
        }
      }
      P.rendered(ctx, wrap);
      return { anchors: [paneEl ? paneEl.parentElement : board] };
    };
    BASE.locate = (t) => {
      if (t.edge !== undefined) {
        const r = paneEl.getBoundingClientRect();
        const scroll = paneEl.scrollLeft;
        const span = t.edge > 0 ? paneGeo.max - scroll : scroll;
        const fraction = span > 0 ? Math.min(1, Math.abs(t.scrollAt - scroll) / span) : 0;
        const x = t.edge > 0 ? r.right - EDGE_BAND * (1 - fraction) : r.left + EDGE_BAND * (1 - fraction);
        return [x, sortable.locate(t.item)[1]];
      }
      if (t.pane !== undefined) {
        const r = paneEl.getBoundingClientRect();
        return [r.left + r.width / 2, r.top + Math.min(20, geo.head / 2)];
      }
      if (t.thumb !== undefined) return P.ctxCenter(thumbEl);
      if (t.thumbAt !== undefined) {
        const r = barEl.getBoundingClientRect();
        const s = Math.max(0, Math.min(paneGeo.max, t.thumbAt));
        const t0 = thumbEl.getBoundingClientRect();
        // Where the thumb center must go (the press is at the thumb center).
        return [r.left + P.thumbLeft(s) + paneGeo.thumbW / 2, t0.top + t0.height / 2];
      }
      if (t.column !== undefined) {
        const p = t.slot !== undefined ? sortable.locateSlot(t.slot, t.column, t.item) : sortable.locateGroupEnd(t.column, t.item);
        if (t.scrollAt !== undefined) p[0] += paneEl.scrollLeft - t.scrollAt;
        return p;
      }
      if (t.slot !== undefined) return sortable.locateSlot(t.slot);
      if (t.item !== undefined) return sortable.locate(t.item);
      throw new Error(`reorder-items/cards cannot locate ${JSON.stringify(t)}`);
    };
    BASE.ctxCenter = (el) => {
      const r = el.getBoundingClientRect();
      return [r.left + r.width / 2, r.top + r.height / 2];
    };

    ({ D, P } = env.templateDesign('reorder-items/cards', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));
    return { traits: { dragScroll: true }, render: (ctx) => P.render(ctx), locate: (t) => P.locate(t) };
  }, { uses: ['reorder-items/_shared'] });
})();
