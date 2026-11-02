/*
 * templates / bins / boxes: the shared widget code of the design-sort-into-bins-* sites (taken from the base widget
 * sort-into-bins/boxes as those sites had it). A site's widgets/sort-into-bins.js is only its design:
 *
 *   env.widget({ task: 'bins', site, name: 'design', split, scenarios: ['collect'], traits?: {...},
 *              template: 'sort-into-bins/boxes', design: { caption: 'Box', parts: { fit: (base, S) => (ctx) => ... } } });
 *
 * Scenarios: single, collect, sort (boxes on a dotted board), desk (files and folders), palette (shape palette).
 *   shapes   drag freely in 2D (env.ui.draggable) and drop wherever they are released (no snapping); a
 *            dragged shape goes on top of the others (the stacking order is mirrored into model.z, so piles
 *            can be unstacked). The box under a dragged shape lights up when it fits inside (env.ui.dropzones).
 *   desk     files drop into a folder when released over its icon (the icon highlights); clicking a folder
 *            opens a window listing its files, which drag out like desktop files; the window closes with ×.
 *   palette  pressing a template drags out a new copy (a ghost follows the pointer); dropping on the canvas
 *            places it; dragging a placed copy back over the palette deletes it.
 * The board is sized from the stage and placed with a sampled margin. Widget CSS is the template's (bx-* classes,
 * colors from the site's --panel, --line, --accent, --muted, --fg, --bg); a site restyles it in its site.css.
 *
 * design tokens (TOKENS; VARIANTS holds what the sites of one scenario share; with design {} the template draws
 * design-sort-into-bins-single-05 / -collect-02 / -sort-01 exactly, and with { stepHint: false } design-sort-into-bins-single-11):
 *   shapes       { <shape>: '<svg inner markup>' } replaces entries of the shape table (viewBox 0 0 100 100)
 *   caption      text shown inside each unlabeled box (null: none)
 *   stepHint     true: the frame's `.steps li:nth-child(2)` says on which side the box is (single)
 *   boxColorVar  true: a labeled box whose label is a color gets --bc: <that color>
 *
 * design.parts: { <part>: (base, S) => replacement } replaces a part (resolved by env.templateDesign: defaults,
 * then the scenario's preset, then the design); the replacement takes the part's arguments,
 * and may call base(...) for the default. S reads the live state: S.board, S.geo (settable), S.spec, S.ctx,
 * S.els, S.D (tokens), S.SHAPES, S.P (the parts, overrides included). Parts:
 *   begin(ctx)                render start, before anything is drawn (default: stepHint)
 *   fit(ctx) -> geo           board geometry { W, H, x?, y?, boardW?, boardH? }: the model unit square spans
 *                             W x H board px with its origin at (x, y) inside the board (default 0, 0); the board
 *                             is boardW x boardH px (default W x H)
 *   board(ctx) -> el          creates and sizes the board in ctx.stage (sampled margin)
 *   renderBoxes(ctx), renderDesk(ctx), renderPalette(ctx)   the three layouts
 *   box(ctx, el, container)   after each box is built (default: nothing)
 *   item(ctx, el, item)       after each shape is built and made draggable (default: nothing)
 *   moved(ctx, el, item)      after each drag move of a shape, and after its drop (default: nothing)
 *   rendered(ctx)             after the layout is drawn (default: nothing)
 *   shapeSvg(content, item)   a shape's SVG markup        title(item)   a shape's tooltip
 *   toPx(p), toModel(q), rectPx(rect), boardPt(event), bounds()   model <-> board px geometry
 * An override must keep the rng draws of the parts it replaces (rng.int / pick / bool calls, in order), or
 * episodes change for every seed.
 */
(function () {
  'use strict';

  const CSS = `
  .bx-board {
    position: relative; flex: none; border-radius: 14px; background-color: var(--panel); overflow: hidden;
    box-shadow: 0 0 0 1px var(--line), 0 2px 6px rgba(0,0,0,.06); touch-action: none;
  }
  .bx-board.dots {
    background-image: radial-gradient(circle, color-mix(in srgb, var(--muted) 35%, transparent) 1.1px, transparent 1.6px);
  }
  .bx-box {
    position: absolute; z-index: 1; overflow: hidden; box-sizing: border-box;
    border: 2px dashed color-mix(in srgb, var(--accent) 55%, var(--line));
    background: color-mix(in srgb, var(--accent) 6%, var(--panel));
    transition: background-color .08s, border-color .08s;
  }
  .bx-box.solid { border-style: solid; }
  .bx-box.over { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 16%, var(--panel)); }
  .bx-label {
    display: flex; align-items: center; gap: 8px; padding: 0 12px; white-space: nowrap;
    font-size: 14px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--muted);
    border-bottom: 1px solid color-mix(in srgb, var(--accent) 25%, var(--line));
    background: color-mix(in srgb, var(--accent) 10%, var(--panel));
  }
  .bx-swatch { flex: none; width: 12px; height: 12px; border-radius: 3px; box-shadow: 0 0 0 1px rgba(0,0,0,.25); }
  .bx-item { position: absolute; z-index: 2; cursor: grab; touch-action: none; filter: drop-shadow(0 1px 1.5px rgba(0,0,0,.28)); }
  .bx-item svg { display: block; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
  .bx-item.dragging { z-index: 1000 !important; cursor: grabbing; filter: drop-shadow(0 7px 10px rgba(0,0,0,.32)); }

  .bx-desk { background: linear-gradient(160deg, color-mix(in srgb, var(--accent) 22%, var(--panel)), color-mix(in srgb, var(--accent) 6%, var(--bg))); }
  .bx-folder { position: absolute; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 2px;
    border-radius: 8px; cursor: pointer; box-sizing: border-box; padding-top: 4px; }
  .bx-folder svg { width: 72%; height: auto; pointer-events: none; }
  .bx-folder span { font-size: 12px; font-weight: 600; text-align: center; line-height: 1.15; color: var(--fg);
    max-width: 100%; overflow: hidden; overflow-wrap: anywhere; padding: 0 2px; pointer-events: none;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .bx-folder.over, .bx-folder.open { background: color-mix(in srgb, var(--accent) 22%, transparent); outline: 2px solid var(--accent); }
  .bx-folder .bx-count { position: absolute; top: 2px; right: 6px; min-width: 18px; height: 18px; border-radius: 9px; padding: 0 5px;
    background: var(--accent); color: #fff; font-size: 11px; font-weight: 700; display: grid; place-items: center; box-sizing: border-box; }
  .bx-file { position: absolute; z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 2px; cursor: grab;
    touch-action: none; border-radius: 6px; box-sizing: border-box; padding-top: 3px; }
  .bx-file:hover { background: color-mix(in srgb, var(--accent) 12%, transparent); }
  .bx-file svg { width: 60%; height: auto; pointer-events: none; }
  .bx-file span { font-size: 11px; line-height: 1.15; text-align: center; color: var(--fg); overflow-wrap: anywhere; pointer-events: none;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; max-width: 100%; padding: 0 2px; }
  .bx-file.dragging { z-index: 1000 !important; cursor: grabbing; background: color-mix(in srgb, var(--accent) 18%, transparent); }
  .bx-win { position: absolute; z-index: 2; background: var(--panel); border: 1px solid var(--line); border-radius: 8px;
    box-shadow: 0 10px 28px rgba(0,0,0,.25); box-sizing: border-box; }
  .bx-win-head { display: flex; align-items: center; justify-content: space-between; padding: 0 10px; font-size: 13px; font-weight: 700;
    border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--line) 35%, var(--panel)); border-radius: 8px 8px 0 0; box-sizing: border-box; }
  .bx-win-x { width: 24px; height: 24px; border: 0; border-radius: 4px; background: transparent; color: var(--fg); font-size: 15px; cursor: pointer; }
  .bx-win-x:hover { background: color-mix(in srgb, #e03131 25%, transparent); }
  .bx-win-empty { position: absolute; left: 0; right: 0; top: 50%; text-align: center; font-size: 12px; color: var(--muted); }

  .bx-pal { position: absolute; z-index: 1; border-radius: 10px; box-sizing: border-box; border: 1px solid var(--line);
    background: color-mix(in srgb, var(--line) 30%, var(--panel)); }
  .bx-pal h4 { margin: 6px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); text-align: center; }
  .bx-tpl { position: absolute; z-index: 2; cursor: copy; touch-action: none; }
  .bx-tpl svg { display: block; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
  .bx-frame { position: absolute; z-index: 1; box-sizing: border-box; border: 2px dashed var(--accent); border-radius: 6px;
    background: color-mix(in srgb, var(--accent) 5%, transparent); }
  .bx-frame span { position: absolute; left: 6px; top: -20px; font-size: 11px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--accent); }
  .bx-ghost { position: absolute; z-index: 1001; pointer-events: none; opacity: .85; }
  .bx-ghost svg { width: 100%; height: 100%; overflow: visible; }
  `;

  const TOKENS = { shapes: {}, caption: null, stepHint: false, boxColorVar: false };
  // What the sites of one scenario share (most of them; a site of that scenario overrides a token to opt out).
  const SCENARIOS = {
    single: { stepHint: true },
    collect: { caption: 'Box' },
    sort: { boxColorVar: true, shapes: { square: '<rect x="8" y="8" width="84" height="84"/>' } },
  };

  function ensureStyle() {
    if (document.getElementById('bx-style')) return;
    const s = document.createElement('style');
    s.id = 'bx-style';
    s.textContent = CSS;
    document.head.append(s);
  }

  env.template('sort-into-bins/boxes', (design, def) => {
    const SHAPE_SVG = env.templateLib('sort-into-bins/_assets').shapes();
    const FOLDER_SVG = env.templateLib('sort-into-bins/_assets').folderSvg;
    const TRASH_SVG = env.templateLib('sort-into-bins/_assets').trashSvg;
    const KIND_COLOR = env.templateLib('sort-into-bins/_assets').colors();
    const FILE_SVG = env.templateLib('sort-into-bins/_assets').fileSvg(KIND_COLOR);
    let D;
    let P;
    let SHAPES;
    let board;
    let geo;
    let spec;
    let ctxRef;
    const els = {};
    const BASE = {};
    const S = {
      get board() { return board; },
      get geo() { return geo; },
      set geo(g) { geo = g; },
      get spec() { return spec; },
      get ctx() { return ctxRef; },
      get D() { return D; },
      get P() { return P; },
      get SHAPES() { return SHAPES; },
      els,
    };

    BASE.begin = (ctx) => {
      const step = D.stepHint && document.querySelector('.steps li:nth-child(2)');
      if (step && spec.scenario === 'single') {
        // Briefing follows the seeded scene; it does not set or modify task state.
        const c = spec.containers[0];
        const p = ctx.model.pos[spec.items[0].id];
        const side = c.x + c.w / 2 > p[0] ? 'right' : 'left';
        step.textContent = `Drop it inside the rectangular box on the ${side}.`;
      }
    };
    BASE.fit = (ctx) => {
      const { size } = ctx;
      const H = Math.floor(Math.min(size.height - 12, (size.width - 12) / spec.aspect));
      return { H, W: Math.round(H * spec.aspect) };
    };
    BASE.board = (ctx) => {
      const { rng, util } = ctx;
      const el = util.el('div', 'bx-board', ctx.stage);
      el.dataset.role = 'board';
      Object.assign(el.style, { width: (geo.boardW ?? geo.W) + 'px', height: (geo.boardH ?? geo.H) + 'px', margin: `${rng.int(4, 12)}px ${rng.int(6, 24)}px` });
      return el;
    };
    BASE.box = () => {};
    BASE.item = () => {};
    BASE.moved = () => {};
    BASE.rendered = () => {};
    BASE.shapeSvg = (content, it) => `<svg viewBox="0 0 100 100" fill="${content.COLORS[it.color]}" stroke="rgba(0,0,0,.38)" stroke-width="3">${SHAPES[it.shape]}</svg>`;
    BASE.title = (it) => `${it.color} ${it.shape}`;
    // Item top-left in board px <-> item center in normalized board units (the model).
    BASE.toPx = (p) => [(geo.x || 0) + (p[0] - spec.item.w / 2) * geo.W, (geo.y || 0) + (p[1] - spec.item.h / 2) * geo.H];
    BASE.toModel = (q) => [(q[0] - (geo.x || 0)) / geo.W + spec.item.w / 2, (q[1] - (geo.y || 0)) / geo.H + spec.item.h / 2];
    BASE.rectPx = (r) => ({ left: (geo.x || 0) + r.x * geo.W + 'px', top: (geo.y || 0) + r.y * geo.H + 'px', width: r.w * geo.W + 'px', height: r.h * geo.H + 'px' });
    BASE.boardPt = (e) => {
      const r = board.getBoundingClientRect();
      return [(e.clientX - r.left - (geo.x || 0)) / geo.W, (e.clientY - r.top - (geo.y || 0)) / geo.H];
    };
    BASE.bounds = () => ({ x0: geo.x || 0, y0: geo.y || 0, x1: (geo.x || 0) + (1 - spec.item.w) * geo.W, y1: (geo.y || 0) + (1 - spec.item.h) * geo.H });


    // ======================================================================= boxes (single, collect, sort)

    BASE.renderBoxes = function (ctx) {
      const { rng, util } = ctx;
      if (rng.bool(0.7)) {
        board.classList.add('dots');
        const g = rng.int(18, 28);
        board.style.backgroundSize = `${g}px ${g}px`;
      }
      const solid = rng.bool(0.35);
      const radius = rng.int(4, 14);
      const boxes = {};
      for (const c of spec.containers) {
        const box = util.el('div', 'bx-box' + (solid ? ' solid' : ''), board);
        box.dataset.role = 'container';
        Object.assign(box.style, P.rectPx(c), { borderRadius: radius + 'px' });
        if (c.label) {
          const head = util.el('div', 'bx-label', box);
          head.style.height = c.head * geo.H + 'px';
          const value = c.label.toLowerCase();
          if (D.boxColorVar && ctx.content.COLORS[value]) box.style.setProperty('--bc', ctx.content.COLORS[value]);
          if (spec.rule.kind === 'color' && ctx.content.COLORS[value]) util.el('span', 'bx-swatch', head).style.background = ctx.content.COLORS[value];
          util.el('span', '', head, c.label);
        }
        if (D.caption != null && !c.label) util.el('div', 'bx-caption', box, D.caption);
        P.box(ctx, box, c);
        boxes[c.id] = box;
      }
      const zones = env.ui.dropzones({
        zones: boxes,
        label: 'item',
        onEnter: (zone) => boxes[zone].classList.add('over'),
        onLeave: (zone) => boxes[zone].classList.remove('over'),
      });
      const px = spec.item.w * geo.W;
      const z = ctx.model.z || spec.items.map((it) => it.id);
      const items = {};
      for (const it of spec.items) {
        const el = util.el('div', 'bx-item', board);
        el.dataset.role = 'item';
        el.title = P.title(it);
        Object.assign(el.style, { width: px + 'px', height: px + 'px', zIndex: String(10 + z.indexOf(it.id)) });
        el.innerHTML = P.shapeSvg(ctx.content, it);
        items[it.id] = el;
      }
      let zTop = 10 + z.length;
      for (const it of spec.items) {
        const el = items[it.id];
        const id = it.id;
        let p0;
        let q0;
        env.ui.draggable(el, {
          frame: board,
          value: P.toPx(ctx.model.pos[id]),
          bounds: P.bounds(),
          label: 'item',
          onStart(q) {
            p0 = ctx.model.pos[id].slice();
            q0 = q;
            el.style.zIndex = ++zTop;
            el.classList.add('dragging');
          },
          onInput() {
            zones.track(el);
            P.moved(ctx, el, it);
          },
          onChange(q) {
            el.classList.remove('dragging');
            const p = q[0] === q0[0] && q[1] === q0[1] ? p0 : P.toModel(q);
            zones.drop(el, { item: id, at: p.map((v) => Math.round(v * 1000) / 1000) });
            const zz = (ctx.model.z || spec.items.map((x) => x.id)).filter((x) => x !== id);
            ctx.update({ ...ctx.model, pos: { ...ctx.model.pos, [id]: p }, z: [...zz, id] });
            P.moved(ctx, el, it);
          },
        });
        P.item(ctx, el, it);
      }
      Object.assign(els, { items });
    };

    // ======================================================================= desk

    BASE.renderDesk = function (ctx) {
      const { rng, util } = ctx;
      board.classList.add('bx-desk');
      const folderEls = {};
      const counts = {};
      const fcolor = rng.pick(['#f2b134', '#5c9ded', '#74b9ff', '#f6c453', '#8fa3bf']);
      for (const d of spec.folders) {
        const el = util.el('div', 'bx-folder', board);
        el.dataset.role = 'folder';
        Object.assign(el.style, P.rectPx(d));
        el.innerHTML = d.trash ? TRASH_SVG : FOLDER_SVG(fcolor);
        if (d.trash) el.querySelector('svg').style.width = '58%';
        util.el('span', '', el, d.label);
        counts[d.id] = util.el('div', 'bx-count', el);
        folderEls[d.id] = el;
        el.addEventListener('click', () => {
          const m = ctx.model;
          ctx.update({ ...m, open: m.open === d.id ? null : d.id });
          draw();
        });
      }
      const W = spec.win;
      const win = util.el('div', 'bx-win', board);
      Object.assign(win.style, P.rectPx(W));
      const head = util.el('div', 'bx-win-head', win);
      head.style.height = W.head * geo.H + 'px';
      const title = util.el('span', '', head);
      const close = util.el('button', 'bx-win-x', head, '×');
      close.type = 'button';
      close.addEventListener('click', () => {
        ctx.update({ ...ctx.model, open: null });
        draw();
      });
      const empty = util.el('div', 'bx-win-empty', win, 'This folder is empty');

      const files = {};
      const drags = {};
      const fw = spec.item.w * geo.W;
      const fh = spec.item.h * geo.H;
      for (const f of spec.files) {
        const el = util.el('div', 'bx-file', board);
        el.dataset.role = 'item';
        Object.assign(el.style, { width: fw + 'px', height: fh + 'px' });
        el.innerHTML = FILE_SVG(f.kind, f.ext);
        util.el('span', '', el, f.name);
        el.title = f.name;
        files[f.id] = el;
        let hover = null;
        const setHover = (id) => {
          if (hover === id) return;
          if (hover && folderEls[hover]) folderEls[hover].classList.remove('over');
          hover = id;
          if (hover && folderEls[hover]) folderEls[hover].classList.add('over');
        };
        let q0;
        let lastPt = null;
        drags[f.id] = env.ui.draggable(el, {
          frame: board,
          value: [0, 0],
          bounds: P.bounds(),
          label: 'file',
          onStart(q) { q0 = q; lastPt = null; el.classList.add('dragging'); },
          onInput() {
            const r = el.getBoundingClientRect();
            const b = board.getBoundingClientRect();
            // The pointer stays where it pressed relative to the tile; track the tile's center as a proxy.
            lastPt = [(r.left + r.width / 2 - b.left) / geo.W, (r.top + r.height / 2 - b.top) / geo.H];
            const d = spec.folders.find((x) => lastPt[0] >= x.x && lastPt[0] <= x.x + x.w && lastPt[1] >= x.y && lastPt[1] <= x.y + x.h);
            setHover(d ? d.id : null);
          },
          onChange(q) {
            el.classList.remove('dragging');
            setHover(null);
            if (q[0] === q0[0] && q[1] === q0[1]) { draw(); return; }
            const center = P.toModel(q);
            const m = env.taskDef.helpers.deskDrop(spec, ctx.model, f.id, center, pointerPt || center);
            pointerPt = null;
            env.log('drop', { what: 'file', item: f.id, to: m.loc[f.id] });
            ctx.update(m);
            draw();
          },
        });
      }
      // The pointer position at release decides the folder (not the tile's center).
      let pointerPt = null;
      board.addEventListener('pointerup', (e) => { pointerPt = P.boardPt(e); }, true);

      function draw() {
        const m = ctx.model;
        const open = m.open;
        win.style.display = open ? '' : 'none';
        for (const d of spec.folders) {
          folderEls[d.id].classList.toggle('open', open === d.id);
          const n = spec.files.filter((f) => m.loc[f.id] === d.id).length;
          counts[d.id].textContent = String(n);
          counts[d.id].style.display = n ? '' : 'none';
        }
        if (open) title.textContent = spec.folders.find((d) => d.id === open).label;
        const inWin = spec.files.filter((f) => open && m.loc[f.id] === open);
        empty.style.display = open && !inWin.length ? '' : 'none';
        const slots = env.taskDef.helpers.winSlots(spec, inWin.length);
        for (const f of spec.files) {
          const el = files[f.id];
          const k = inWin.indexOf(f);
          if (m.loc[f.id] === 'desk') {
            el.style.display = '';
            drags[f.id].set(P.toPx(m.pos[f.id]));
          } else if (k >= 0) {
            el.style.display = '';
            drags[f.id].set(P.toPx(slots[k]));
          } else {
            el.style.display = 'none';
          }
        }
      }
      draw();
      Object.assign(els, { files, folderEls, close, draw });
    };

    // ======================================================================= palette

    BASE.renderPalette = function (ctx) {
      const { rng, util } = ctx;
      if (rng.bool(0.6)) {
        board.classList.add('dots');
        board.style.backgroundSize = `${rng.int(16, 24)}px ${rng.int(16, 24)}px`;
      }
      const pal = util.el('div', 'bx-pal', board);
      Object.assign(pal.style, P.rectPx(spec.pal));
      util.el('h4', '', pal, rng.pick(['Shapes', 'Palette', 'Library']));
      const frame = util.el('div', 'bx-frame', board);
      Object.assign(frame.style, P.rectPx(spec.frame));
      util.el('span', '', frame, rng.pick(['Frame', 'Drop zone', 'Artboard', 'Canvas area']));
      const px = spec.item.w * geo.W;
      const tpls = [];
      spec.templates.forEach((tp, t) => {
        const el = util.el('div', 'bx-tpl', pal.parentNode);
        el.dataset.role = 'template';
        const [cx, cy] = env.taskDef.helpers.palSlot(spec, t);
        Object.assign(el.style, { left: (cx - spec.item.w / 2) * geo.W + 'px', top: (cy - spec.item.h / 2) * geo.H + 'px', width: px + 'px', height: px + 'px' });
        el.innerHTML = P.shapeSvg(ctx.content, tp);
        el.title = P.title(tp);
        tpls.push(el);
        let ghost = null;
        let g0;
        env.ui.track(el, {
          start() {
            ghost = util.el('div', 'bx-ghost', board);
            ghost.innerHTML = P.shapeSvg(ctx.content, tp);
            g0 = [(cx - spec.item.w / 2) * geo.W, (cy - spec.item.h / 2) * geo.H];
            Object.assign(ghost.style, { width: px + 'px', height: px + 'px', left: g0[0] + 'px', top: g0[1] + 'px' });
          },
          move(p) {
            Object.assign(ghost.style, { left: g0[0] + p.dx + 'px', top: g0[1] + p.dy + 'px' });
          },
          end(p) {
            const center = P.toModel([g0[0] + p.dx, g0[1] + p.dy]);
            ghost.remove();
            ghost = null;
            if (p.dx === 0 && p.dy === 0) return;
            const m = env.taskDef.helpers.paletteDrop(spec, ctx.model, { template: t }, center);
            ctx.update(m);
            sync();
          },
        }, 'template');
      });

      const placed = {};
      function sync() {
        const m = ctx.model;
        const live = new Set(m.placed.map((p) => p.id));
        for (const id of Object.keys(placed)) if (!live.has(id)) { placed[id].el.remove(); delete placed[id]; }
        for (const p of m.placed) {
          if (!placed[p.id]) {
            const tp = spec.templates[p.t];
            const el = util.el('div', 'bx-item', board);
            el.dataset.role = 'item';
            el.title = P.title(tp);
            Object.assign(el.style, { width: px + 'px', height: px + 'px', zIndex: String(10 + Number(p.id.slice(1))) });
            el.innerHTML = P.shapeSvg(ctx.content, tp);
            let q0;
            const h = env.ui.draggable(el, {
              frame: board,
              value: P.toPx(p.pos),
              bounds: P.bounds(),
              label: 'item',
              onStart(q) { q0 = q; el.classList.add('dragging'); },
              onChange(q) {
                el.classList.remove('dragging');
                if (q[0] === q0[0] && q[1] === q0[1]) return;
                ctx.update(env.taskDef.helpers.paletteDrop(spec, ctx.model, { item: p.id }, P.toModel(q)));
                sync();
              },
            });
            placed[p.id] = { el, h };
          }
          placed[p.id].h.set(P.toPx(p.pos));
        }
      }
      sync();
      Object.assign(els, { tpls, placed, pal, sync });
    };

    ({ D, P } = env.templateDesign('sort-into-bins/boxes', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));
    SHAPES = { ...SHAPE_SVG, ...D.shapes };

    return {
      render(ctx) {
        ensureStyle();
        spec = ctx.spec;
        ctxRef = ctx;
        P.begin(ctx);
        for (const k of Object.keys(els)) delete els[k];
        geo = P.fit(ctx);
        board = P.board(ctx);
        if (spec.scenario === 'desk') P.renderDesk(ctx);
        else if (spec.scenario === 'palette') P.renderPalette(ctx);
        else P.renderBoxes(ctx);
        P.rendered(ctx);
        return { anchors: [board] };
      },

      locate(t) {
        const r = board.getBoundingClientRect();
        const at = (p) => [r.left + (geo.x || 0) + p[0] * geo.W, r.top + (geo.y || 0) + p[1] * geo.H];
        if (t.point !== undefined) return at(t.point);
        if (t.item !== undefined) {
          if (els.items) return ctxRef.util.center(els.items[t.item]);
          if (els.files) return ctxRef.util.center(els.files[t.item]);
          return ctxRef.util.center(els.placed[t.item].el);
        }
        if (t.folder !== undefined) {
          const d = spec.folders.find((x) => x.id === t.folder);
          return at([d.x + d.w / 2, d.y + d.h * 0.4]);
        }
        if (t.close !== undefined) return ctxRef.util.center(els.close);
        if (t.template !== undefined) return at(env.taskDef.helpers.palSlot(spec, t.template));
        if (t.trash !== undefined) return at([spec.pal.x + spec.pal.w / 2, spec.pal.y + spec.pal.h / 2]);
        throw new Error(`sort-into-bins/boxes cannot locate ${JSON.stringify(t)}`);
      },
    };
  }, { uses: ['sort-into-bins/_assets'] });
})();
