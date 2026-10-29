/*
 * align-layout/canvas: a design editor with cards (align, spacing), resizable boxes and a target thumbnail
 * (mockup), or a column-width table (columns). These scenarios share their frame, rulers and placement.
 * design: {} reproduces design-align-layout-align-01, design-align-layout-spacing-01,
 * design-align-layout-mockup-01 and design-align-layout-columns-01 for their respective scenarios. No scenario presets.
 * Geometry stays in canvas px (1:1); task helpers own movement, resizing and column widths.
 * Sites restyle lo-* classes in site.css. Tool icons are inert; the only controls drag the model geometry.
 *
 * Tokens (defaults):
 *   titles = TITLES below: per-scenario arrays, sampled once for the title; replaces the whole table.
 *   icons = ICONS below: SVG table for lock, cursor, hand and frame; replaces the whole table.
 *   tools = ['cursor', 'hand', 'frame']: toolbar icon keys; the first is active.
 *   zoom = '100%': toolbar text. canvasCaption = 'Canvas', tableCaption = 'Table',
 *   mockupCaption = 'Mockup', guideLabel = 'guide': panel and guide labels.
 *   radiusMin = 6, radiusMax = 12: inclusive sampled card radius, px (always draws rng.int).
 *   cardGap = 10, cardPadding = '12px 14px 14px', bodyGap = 16: frame layout, px/CSS padding.
 *   titleSize = 15, itemSize = 12.5, itemRadius = 6, handleSize = 10: typography/control sizes, px.
 *   rulerWidth = 30, rulerHeight = 16, rulerStep = 50: ruler gutter sizes and canvas-px tick interval.
 *   gridSize = 10: dotted canvas grid period, px.
 *   headerHeight = 36, rowHeight = 34, chipHeight = 20, chipRadius = 10: table dimensions, px.
 *   insetX = 12, insetY = 8: sampled placement margins inside ctx.size, px.
 *   panel = 'var(--panel)', line = 'var(--line)', accent = 'var(--accent)',
 *   muted = 'var(--muted)', fg = 'var(--fg)': CSS colors, inherited from the site by default.
 *   borderSaturation = 55, borderLightness = 48, fillSaturation = 70, fillLightness = 60,
 *   fillMix = 26: item/thumbnail HSL tint percentages (hue comes from the spec).
 *
 * Parts (overrides: (base, S) => replacement; all calls use P):
 *   begin(ctx), rendered(ctx): before construction / after placement; default no-ops.
 *   style(ctx): inject lo-style once, using tokenized structural CSS.
 *   card(ctx) -> el: editor card in stage; draws the radius first.
 *   toolbar(ctx, card) -> el: sampled title, P.tool controls and zoom; draws the title second.
 *   tool(ctx, bar, key, index) -> el: one inert SVG toolbar icon.
 *   body(ctx, card) -> el: panel row. pane(ctx, parent, caption) -> el: labeled panel.
 *   frame(ctx, pane) -> el: ruler grid. ruler(ctx, parent, cls, len, scale) -> el: ticks/labels.
 *   canvas(ctx, frame) -> el: 1:1 canvas/table and its rulers.
 *   tint(el, hue): set border/fill colors for an item or thumbnail box.
 *   item(ctx, canvas, item, index, locked) -> el: card/box visuals, role, lock and text.
 *   handleLayer(ctx, canvas) -> el: overlay above boxes; handle(ctx, layer, index, corner) -> el: corner.
 *   itemReady(ctx, el, item, index), moved(ctx, el, index): after binding / after painting; no-ops.
 *   bindItem(ctx, el, index, locked), bindHandle(ctx, el, index, corner): model drag wiring.
 *   cards(ctx): item construction/order/handles; guide(ctx): alignment guide when specified.
 *   mockup(ctx, body) -> el: labeled thumbnail with rulers; thumbnailItem(ctx, thumb, box) -> el: box.
 *   columnHeader(ctx, canvas, name, column) -> el: header text.
 *   cell(ctx, canvas, row, rowIndex, column) -> el: striped cell with fixed-width chip.
 *   divider(ctx, canvas, name, column) -> el: accessible resize separator.
 *   bindDivider(ctx, el, column): column-width drag wiring; columns(ctx): construct table columns.
 *   raise(index): update stacking order. setRect(index, rect): update model and repaint one item.
 *   paintItem(index), paintCols(), paint(): sync geometry from the current model; paint returns nothing.
 *   place(ctx, card): freeze card dimensions and place within ctx.size; draws float/pick, float/pick.
 *   hitOk(el, x, y) -> bool: DOM hit test. req(el, description) -> DOMRect: require visible element.
 *   visiblePoint(el, description) -> [x,y]: find an uncovered integer point on a card.
 *   locate(target) -> [x,y]: grab/handle/divider plus rounded dx/dy; throws for unknown targets.
 * S.ctx/spec/st/card/body/canvas read live page state; S.D/P read resolved tokens/parts.
 * S.st holds els, hs, divs, order and cells; builders return elements and wiring is kept separately.
 * Keep rng draws in order, including draws whose results a design ignores. Extra decoration randomness
 * must use ctx.rng.fork(label). No GridStack dependency: pilots registered only the canvas widget.
 */
(function () {
  'use strict';

  const CSS = (D) => `
  .lo-card { position: absolute; display: flex; flex-direction: column; gap: ${D.cardGap}px; padding: ${D.cardPadding}; background: ${D.panel};
    border: 1px solid ${D.line}; border-radius: var(--lo-r); box-shadow: 0 1px 3px rgba(0,0,0,.07), 0 10px 26px rgba(0,0,0,.06);
    user-select: none; box-sizing: border-box; }
  .lo-bar { display: flex; align-items: center; gap: 8px; height: 26px; }
  .lo-title { font-size: ${D.titleSize}px; font-weight: 650; margin-right: auto; white-space: nowrap; }
  .lo-tool { width: 26px; height: 24px; border: 1px solid ${D.line}; border-radius: 5px; background: ${D.panel}; color: ${D.muted};
    display: flex; align-items: center; justify-content: center; }
  .lo-tool svg { width: 14px; height: 14px; }
  .lo-tool.on { color: ${D.accent}; border-color: ${D.accent}; }
  .lo-zoom { font-size: 12px; color: ${D.muted}; padding: 0 4px; font-variant-numeric: tabular-nums; }
  .lo-body { display: flex; gap: ${D.bodyGap}px; align-items: flex-start; }
  .lo-pane { display: flex; flex-direction: column; gap: 4px; }
  .lo-cap { font-size: 11.5px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: ${D.muted}; }
  .lo-frame { display: grid; grid-template-columns: ${D.rulerWidth}px auto; grid-template-rows: ${D.rulerHeight}px auto; }
  .lo-rt, .lo-rl { position: relative; font-size: 9.5px; color: ${D.muted}; font-variant-numeric: tabular-nums; overflow: hidden; }
  .lo-rt { grid-column: 2; grid-row: 1; border-bottom: 1px solid ${D.line}; }
  .lo-rl { grid-column: 1; grid-row: 2; border-right: 1px solid ${D.line}; }
  .lo-rt i, .lo-rl i { position: absolute; background: ${D.line}; }
  .lo-rt i { top: 10px; width: 1px; height: 6px; }
  .lo-rl i { right: 0; height: 1px; width: 6px; }
  .lo-rt b, .lo-rl b { position: absolute; font-weight: 500; }
  .lo-rt b { top: 0; transform: translateX(3px); }
  .lo-rl b { right: 8px; transform: translateY(-5px); }
  .lo-canvas { grid-column: 2; grid-row: 2; position: relative; overflow: hidden; outline: 1px solid color-mix(in srgb, ${D.fg} 22%, ${D.line});
    background-color: color-mix(in srgb, ${D.fg} 2.5%, ${D.panel});
    background-image: radial-gradient(circle, color-mix(in srgb, ${D.fg} 22%, transparent) 1px, transparent 1.4px);
    background-size: ${D.gridSize}px ${D.gridSize}px; background-position: -5px -5px; touch-action: none; }
  .lo-item { position: absolute; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 5px;
    border: 1.5px solid var(--lo-b); background: var(--lo-f); border-radius: ${D.itemRadius}px; cursor: grab; font-size: ${D.itemSize}px; font-weight: 600;
    color: color-mix(in srgb, var(--lo-b) 55%, ${D.fg}); overflow: hidden; white-space: nowrap; touch-action: none; }
  .lo-item.dragging { cursor: grabbing; box-shadow: 0 6px 16px rgba(0,0,0,.18); }
  .lo-item.locked { cursor: not-allowed; border-style: dashed; background: color-mix(in srgb, var(--lo-f) 55%, ${D.panel}); }
  .lo-item svg { flex: none; width: 12px; height: 12px; }
  .lo-item.box { align-items: flex-start; justify-content: flex-start; padding: 5px 7px; font-size: 11.5px; }
  .lo-guide { position: absolute; pointer-events: none; z-index: 900; border: 0 dashed ${D.accent}; }
  .lo-guide.v { top: 0; bottom: 0; border-left-width: 2px; margin-left: -1px; }
  .lo-guide.h { left: 0; right: 0; border-top-width: 2px; margin-top: -1px; }
  .lo-guide span { position: absolute; font-size: 10px; font-weight: 600; color: #fff; background: ${D.accent}; padding: 1px 5px;
    border-radius: 3px; white-space: nowrap; }
  .lo-guide.v span { top: 2px; left: 4px; }
  .lo-guide.h span { left: 4px; top: 4px; }
  .lo-hl { position: absolute; inset: 0; pointer-events: none; z-index: 1000; }
  .lo-h { position: absolute; width: ${D.handleSize}px; height: ${D.handleSize}px; margin: ${-D.handleSize / 2}px 0 0 ${-D.handleSize / 2}px; box-sizing: border-box; background: #fff;
    border: 1.5px solid ${D.accent}; border-radius: 2px; pointer-events: auto; touch-action: none; }
  .lo-h.nw, .lo-h.se { cursor: nwse-resize; }
  .lo-h.ne, .lo-h.sw { cursor: nesw-resize; }
  .lo-thumb { position: relative; overflow: hidden; outline: 1px solid color-mix(in srgb, ${D.fg} 22%, ${D.line});
    background: color-mix(in srgb, ${D.fg} 2.5%, ${D.panel}); pointer-events: none; }
  .lo-tbox { position: absolute; box-sizing: border-box; border: 1px solid var(--lo-b); background: var(--lo-f); font-size: 9.5px;
    font-weight: 600; padding: 2px 3px; overflow: hidden; white-space: nowrap; color: color-mix(in srgb, var(--lo-b) 55%, ${D.fg}); }
  .lo-table { position: relative; overflow: hidden; background: ${D.panel}; outline: 1px solid color-mix(in srgb, ${D.fg} 22%, ${D.line}); }
  .lo-th, .lo-td { position: absolute; box-sizing: border-box; overflow: hidden; }
  .lo-th { top: 0; height: ${D.headerHeight}px; display: flex; align-items: center; padding: 0 10px; font-size: 12.5px; font-weight: 650;
    background: color-mix(in srgb, ${D.fg} 5%, ${D.panel}); border-bottom: 1px solid ${D.line}; border-right: 1px solid ${D.line};
    white-space: nowrap; }
  .lo-th span { overflow: hidden; text-overflow: ellipsis; }
  .lo-td { height: ${D.rowHeight}px; display: flex; align-items: center; border-bottom: 1px solid color-mix(in srgb, ${D.fg} 7%, transparent); }
  .lo-chip { flex: none; height: ${D.chipHeight}px; box-sizing: border-box; border-radius: ${D.chipRadius}px; background: color-mix(in srgb, ${D.accent} 18%, ${D.panel});
    border: 1px solid color-mix(in srgb, ${D.accent} 40%, ${D.line}); }
  .lo-div { position: absolute; top: 0; bottom: 0; width: 10px; margin-left: -5px; cursor: col-resize; z-index: 5; touch-action: none; }
  .lo-div::after { content: ''; position: absolute; left: 4px; width: 2px; top: 6px; height: 24px; border-radius: 1px;
    background: color-mix(in srgb, ${D.fg} 30%, ${D.line}); }
  .lo-div:hover::after, .lo-div.on::after { background: ${D.accent}; }
  `;

  const ICONS = {
    lock: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="7" width="9" height="6.5" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 015 0v2"/></svg>',
    cursor: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 2l9 5-4 1-1.5 4z"/></svg>',
    hand: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M5 8V3.5a1 1 0 012 0V7m0-.5a1 1 0 012 0V8m0-1a1 1 0 012 0v3.5A3.5 3.5 0 018 14H7a3 3 0 01-2.4-1.2L3 10.5a1 1 0 011.6-1.2L5 10"/></svg>',
    frame: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 2v12M11 2v12M2 5h12M2 11h12"/></svg>',
  };

  const TITLES = {
    align: ['Dashboard layout', 'Home screen', 'Widgets'],
    spacing: ['Toolbar spacing', 'Card row', 'Stack layout'],
    mockup: ['Landing page', 'Page layout', 'Screen design'],
    columns: ['Users table', 'Report columns', 'Data grid'],
  };
  const TOKENS = {
    titles: TITLES, icons: ICONS, tools: ['cursor', 'hand', 'frame'], zoom: '100%',
    canvasCaption: 'Canvas', tableCaption: 'Table', mockupCaption: 'Mockup', guideLabel: 'guide',
    radiusMin: 6, radiusMax: 12, cardGap: 10, cardPadding: '12px 14px 14px', bodyGap: 16,
    titleSize: 15, itemSize: 12.5, itemRadius: 6, handleSize: 10,
    rulerWidth: 30, rulerHeight: 16, rulerStep: 50, gridSize: 10,
    headerHeight: 36, rowHeight: 34, chipHeight: 20, chipRadius: 10, insetX: 12, insetY: 8,
    panel: 'var(--panel)', line: 'var(--line)', accent: 'var(--accent)', muted: 'var(--muted)', fg: 'var(--fg)',
    borderSaturation: 55, borderLightness: 48, fillSaturation: 70, fillLightness: 60, fillMix: 26,
  };

  function defineFrameParts(BASE, S) {
    BASE.begin = () => {};
    BASE.rendered = () => {};
    BASE.itemReady = () => {};
    BASE.moved = () => {};
    BASE.style = (ctx) => ctx.css('lo-style', CSS(S.D));
    BASE.card = (ctx) => {
      const card = ctx.util.el('div', 'lo-card', ctx.stage);
      card.dataset.role = 'form';
      card.style.setProperty('--lo-r', ctx.rng.int(S.D.radiusMin, S.D.radiusMax) + 'px');
      return card;
    };
    BASE.toolbar = (ctx, card) => {
      const bar = ctx.util.el('div', 'lo-bar', card);
      ctx.util.el('div', 'lo-title', bar, ctx.rng.pick(S.D.titles[ctx.spec.scenario]));
      S.D.tools.forEach((key, i) => S.P.tool(ctx, bar, key, i));
      ctx.util.el('span', 'lo-zoom', bar, S.D.zoom);
      return bar;
    };
    BASE.tool = (ctx, bar, key, i) => {
      const el = ctx.util.el('span', 'lo-tool' + (i === 0 ? ' on' : ''), bar);
      el.innerHTML = S.D.icons[key];
      return el;
    };
    BASE.body = (ctx, card) => ctx.util.el('div', 'lo-body', card);
    BASE.pane = (ctx, parent, caption) => {
      const pane = ctx.util.el('div', 'lo-pane', parent);
      ctx.util.el('div', 'lo-cap', pane, caption);
      return pane;
    };
    BASE.frame = (ctx, pane) => ctx.util.el('div', 'lo-frame', pane);
    // A tick and label every rulerStep canvas px, including the half-scale mockup rulers.
    BASE.ruler = (ctx, parent, cls, len, scale) => {
      const r = ctx.util.el('div', cls, parent);
      const horiz = cls === 'lo-rt';
      r.style[horiz ? 'width' : 'height'] = Math.round(len * scale) + 'px';
      for (let v = 0; v <= len; v += S.D.rulerStep) {
        const pos = Math.round(v * scale) + 'px';
        const tick = ctx.util.el('i', '', r);
        tick.style[horiz ? 'left' : 'top'] = pos;
        const lab = ctx.util.el('b', '', r, String(v));
        lab.style[horiz ? 'left' : 'top'] = pos;
      }
      return r;
    };
    BASE.canvas = (ctx, frame) => {
      const { util, spec } = ctx;
      S.P.ruler(ctx, frame, 'lo-rt', spec.W, 1);
      let canvas;
      if (spec.scenario === 'columns') {
        canvas = util.el('div', 'lo-table', frame);
        canvas.style.gridColumn = '2';
        canvas.style.gridRow = '2';
        canvas.style.width = spec.W + 'px';
        canvas.style.height = spec.H + 'px';
        frame.style.gridTemplateColumns = '0 auto';
      } else {
        S.P.ruler(ctx, frame, 'lo-rl', spec.H, 1);
        canvas = util.el('div', 'lo-canvas', frame);
        canvas.style.width = spec.W + 'px';
        canvas.style.height = spec.H + 'px';
      }
      return canvas;
    };
    BASE.tint = (el, hue) => {
      el.style.setProperty('--lo-b', `hsl(${hue} ${S.D.borderSaturation}% ${S.D.borderLightness}%)`);
      el.style.setProperty('--lo-f', `color-mix(in srgb, hsl(${hue} ${S.D.fillSaturation}% ${S.D.fillLightness}%) ${S.D.fillMix}%, ${S.D.panel})`);
    };
    BASE.item = (ctx, canvas, it, i, locked) => {
      const el = ctx.util.el('div', 'lo-item' + (locked ? ' locked' : '') + (ctx.spec.scenario === 'mockup' ? ' box' : ''), canvas);
      S.P.tint(el, it.hue);
      el.dataset.role = 'card';
      if (locked) el.insertAdjacentHTML('beforeend', S.D.icons.lock);
      ctx.util.el('span', '', el, it.label);
      return el;
    };
    BASE.handleLayer = (ctx, canvas) => ctx.util.el('div', 'lo-hl', canvas);
    BASE.handle = (ctx, layer, i, corner) => ctx.util.el('div', `lo-h ${corner}`, layer);
  }

  function defineItemParts(BASE, S) {
    // Model updates and drag wiring stay independent of the visual builders.
    BASE.raise = (i) => {
      S.st.order.splice(S.st.order.indexOf(i), 1);
      S.st.order.push(i);
      S.st.order.forEach((k, z) => { S.st.els[k].style.zIndex = String(z + 1); });
    };
    BASE.setRect = (i, rect) => {
      const ctx = S.st.ctx;
      const m = ctx.model;
      const r = m.r.slice();
      r[i] = rect;
      ctx.update({ ...m, r });
      S.P.paintItem(i);
    };
    BASE.bindItem = (ctx, el, i, locked) => {
      let start = null;
      env.ui.track(el, {
        start() {
          if (locked) return false;
          start = { ...ctx.model.r[i] };
          S.P.raise(i);
          el.classList.add('dragging');
        },
        move(p) { S.P.setRect(i, env.taskDef.helpers.moveRect(ctx.spec, start, p.dx, p.dy)); },
        end() { el.classList.remove('dragging'); },
      }, 'layout-card');
    };
    BASE.bindHandle = (ctx, el, i, corner) => {
      let start = null;
      env.ui.track(el, {
        start() { start = { ...ctx.model.r[i] }; S.P.raise(i); },
        move(p) { S.P.setRect(i, env.taskDef.helpers.resizeRect(ctx.spec, start, corner, p.dx, p.dy)); },
      }, `layout-handle-${corner}`);
    };
    BASE.paintItem = (i) => {
      const r = S.st.ctx.model.r[i];
      const el = S.st.els[i];
      el.style.left = r.x + 'px';
      el.style.top = r.y + 'px';
      el.style.width = r.w + 'px';
      el.style.height = r.h + 'px';
      if (S.st.hs[i]) {
        const pts = { nw: [r.x, r.y], ne: [r.x + r.w, r.y], se: [r.x + r.w, r.y + r.h], sw: [r.x, r.y + r.h] };
        for (const [k, h] of Object.entries(S.st.hs[i])) {
          h.style.left = pts[k][0] + 'px';
          h.style.top = pts[k][1] + 'px';
        }
      }
      S.P.moved(S.st.ctx, el, i);
    };
    BASE.cards = (ctx) => {
      const { spec } = ctx;
      const layer = spec.scenario === 'mockup' ? S.P.handleLayer(ctx, S.st.canvas) : null;
      for (let i = 0; i < spec.items.length; i++) {
        const it = spec.items[i];
        const locked = env.taskDef.helpers.locked(spec, i);
        const el = S.P.item(ctx, S.st.canvas, it, i, locked);
        S.st.els.push(el);
        S.st.order.push(i);
        el.style.zIndex = String(i + 1);
        S.P.bindItem(ctx, el, i, locked);
        if (layer) {
          S.st.hs[i] = {};
          for (const k of ['nw', 'ne', 'se', 'sw']) {
            const h = S.P.handle(ctx, layer, i, k);
            S.st.hs[i][k] = h;
            S.P.bindHandle(ctx, h, i, k);
          }
        }
        S.P.itemReady(ctx, el, it, i);
      }
    };
    BASE.guide = (ctx) => {
      const { spec, util } = ctx;
      if (spec.scenario === 'align' && spec.anchor === 'guide') {
        const g = util.el('div', `lo-guide ${spec.axis === 'x' ? 'v' : 'h'}`, S.st.canvas);
        g.style[spec.axis === 'x' ? 'left' : 'top'] = spec.t + 'px';
        util.el('span', '', g, S.D.guideLabel);
      }
    };
    BASE.mockup = (ctx, body) => {
      const { spec, util } = ctx;
      const pane = S.P.pane(ctx, body, S.D.mockupCaption);
      const frame = S.P.frame(ctx, pane);
      frame.style.gridTemplateColumns = S.D.rulerWidth + 'px auto';
      const sc = spec.scale;
      S.P.ruler(ctx, frame, 'lo-rt', spec.W, sc);
      S.P.ruler(ctx, frame, 'lo-rl', spec.H, sc);
      const thumb = util.el('div', 'lo-thumb', frame);
      thumb.style.gridColumn = '2';
      thumb.style.gridRow = '2';
      thumb.style.width = Math.round(spec.W * sc) + 'px';
      thumb.style.height = Math.round(spec.H * sc) + 'px';
      spec.boxes.forEach((b) => S.P.thumbnailItem(ctx, thumb, b));
      return thumb;
    };
    BASE.thumbnailItem = (ctx, thumb, b) => {
      const sc = ctx.spec.scale;
      const t = ctx.util.el('div', 'lo-tbox', thumb, b.label);
      S.P.tint(t, b.hue);
      t.style.left = Math.round(b.tx * sc) + 'px';
      t.style.top = Math.round(b.ty * sc) + 'px';
      t.style.width = Math.round(b.tw * sc) + 'px';
      t.style.height = Math.round(b.th * sc) + 'px';
      return t;
    };
  }

  function defineColumnParts(BASE, S) {
    // Table builders are separate from their resize behavior and geometry sync.
    BASE.columnHeader = (ctx, canvas, name, c) => {
      const th = ctx.util.el('div', 'lo-th', canvas);
      ctx.util.el('span', '', th, name);
      return th;
    };
    BASE.cell = (ctx, canvas, row, r, c) => {
      const td = ctx.util.el('div', 'lo-td', canvas);
      td.style.top = S.D.headerHeight + r * S.D.rowHeight + 'px';
      td.style.background = r % 2 ? `color-mix(in srgb, ${S.D.fg} 2.5%, ${S.D.panel})` : 'transparent';
      const chip = ctx.util.el('div', 'lo-chip', td);
      chip.style.width = row[c] + 'px';
      chip.style.marginLeft = ctx.spec.pad + 'px';
      return td;
    };
    BASE.divider = (ctx, canvas, name, c) => {
      const div = ctx.util.el('div', 'lo-div', canvas);
      div.setAttribute('role', 'separator');
      div.setAttribute('aria-label', `Resize ${name} column`);
      return div;
    };
    BASE.bindDivider = (ctx, div, c) => {
      let start = null;
      env.ui.track(div, {
        start() { start = ctx.model.cols.slice(); div.classList.add('on'); },
        move(p) {
          ctx.update({ ...ctx.model, cols: env.taskDef.helpers.setCol(ctx.spec, start, c, start[c] + p.dx) });
          S.P.paintCols();
        },
        end() { div.classList.remove('on'); },
      }, 'layout-divider');
    };
    BASE.columns = (ctx) => {
      ctx.spec.names.forEach((name, c) => {
        const th = S.P.columnHeader(ctx, S.st.canvas, name, c);
        const col = { th, tds: [], div: null };
        ctx.spec.cells.forEach((row, r) => col.tds.push(S.P.cell(ctx, S.st.canvas, row, r, c)));
        const div = S.P.divider(ctx, S.st.canvas, name, c);
        col.div = div;
        S.st.divs.push(div);
        S.P.bindDivider(ctx, div, c);
        S.st.cells.push(col);
      });
    };
    BASE.paintCols = () => {
      const cols = S.st.ctx.model.cols;
      S.st.cells.forEach((col, c) => {
        const left = env.taskDef.helpers.colLeft(cols, c);
        for (const el of [col.th, ...col.tds]) {
          el.style.left = left + 'px';
          el.style.width = cols[c] + 'px';
        }
        col.div.style.left = left + cols[c] + 'px';
      });
    };
    BASE.paint = () => {
      if (S.st.ctx.spec.scenario === 'columns') { S.P.paintCols(); return; }
      S.st.ctx.model.r.forEach((_, i) => S.P.paintItem(i));
    };
    BASE.place = (ctx, card) => {
      const { rng, size } = ctx;
      card.style.left = '0px';
      card.style.top = '0px';
      const cw = card.offsetWidth;
      const chh = card.offsetHeight;
      card.style.width = cw + 'px';
      card.style.height = chh + 'px';
      const fx = rng.pick([0, 0.5, 0.5, 1, rng.float()]);
      const fy = rng.pick([0.5, 0.5, 0, 1, rng.float()]);
      card.style.left = Math.round(S.D.insetX + fx * Math.max(0, size.width - cw - 2 * S.D.insetX)) + 'px';
      card.style.top = Math.round(S.D.insetY + fy * Math.max(0, size.height - chh - 2 * S.D.insetY)) + 'px';
    };
  }

  function defineLocationParts(BASE, S) {
    BASE.hitOk = (el, x, y) => {
      const h = document.elementFromPoint(x, y);
      return !!h && (h === el || el.contains(h));
    };
    BASE.req = (el, what) => {
      if (!el || !el.isConnected) throw new Error(`layout: ${what} is not rendered`);
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) throw new Error(`layout: ${what} is hidden`);
      return r;
    };

    // A point on el that is really el (not covered by another card), integer px.
    BASE.visiblePoint = (el, what) => {
      const r = S.P.req(el, what);
      const fr = [[0.5, 0.5], [0.3, 0.5], [0.7, 0.5], [0.5, 0.3], [0.5, 0.7], [0.2, 0.3], [0.8, 0.7], [0.2, 0.7], [0.8, 0.3], [0.12, 0.5], [0.88, 0.5]];
      for (const [u, v] of fr) {
        const x = Math.round(r.left + r.width * u);
        const y = Math.round(r.top + r.height * v);
        if (S.P.hitOk(el, x, y)) return [x, y];
      }
      // A card dropped over another can leave only a sliver of it showing: scan a finer grid, edges included.
      for (let a = 0; a <= 12; a++) {
        for (let b = 0; b <= 12; b++) {
          const x = Math.round(r.left + 2 + (r.width - 4) * a / 12);
          const y = Math.round(r.top + 2 + (r.height - 4) * b / 12);
          if (S.P.hitOk(el, x, y)) return [x, y];
        }
      }
      return [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)];
    };

    BASE.locate = (t) => {
      const s = S.st;
      const off = (p) => [p[0] + Math.round(t.dx || 0), p[1] + Math.round(t.dy || 0)];
      if (t.grab !== undefined) return off(S.P.visiblePoint(s.els[t.grab], `item ${t.grab}`));
      if (t.handle !== undefined) {
        const h = s.hs[t.handle][t.h];
        const r = S.P.req(h, `handle ${t.handle} ${t.h}`);
        const cx = Math.round(r.left + r.width / 2);
        const cy = Math.round(r.top + r.height / 2);
        for (const [x, y] of [[cx, cy], [cx - 2, cy - 2], [cx + 2, cy + 2], [cx - 2, cy + 2], [cx + 2, cy - 2]]) {
          if (S.P.hitOk(h, x, y)) return off([x, y]);
        }
        return off([cx, cy]);
      }
      if (t.div !== undefined) {
        const r = S.P.req(s.divs[t.div], `divider ${t.div}`);
        const tb = s.canvas.getBoundingClientRect();
        return off([Math.round(r.left + r.width / 2), Math.round(tb.top + S.D.headerHeight / 2)]);
      }
      throw new Error(`layout: unknown target ${JSON.stringify(t)}`);
    };
  }

  env.template('align-layout/canvas', (design, def) => {
    let D, P;
    let st;
    const BASE = {};
    const S = {
      get ctx() { return st && st.ctx; },
      get spec() { return st && st.ctx.spec; },
      get st() { return st; },
      get card() { return st && st.card; },
      get body() { return st && st.body; },
      get canvas() { return st && st.canvas; },
      get D() { return D; },
      get P() { return P; },
    };

    defineFrameParts(BASE, S);
    defineItemParts(BASE, S);
    defineColumnParts(BASE, S);
    defineLocationParts(BASE, S);

    ({ D, P } = env.templateDesign('align-layout/canvas', design, def, { tokens: TOKENS, base: BASE, state: S }));
    return {
      render(ctx) {
        st = { ctx, els: [], hs: [], divs: [], order: [], cells: [] };
        P.style(ctx);
        P.begin(ctx);
        const card = (st.card = P.card(ctx));
        st.bar = P.toolbar(ctx, card);
        const body = (st.body = P.body(ctx, card));
        st.pane = P.pane(ctx, body, ctx.spec.scenario === 'columns' ? D.tableCaption : D.canvasCaption);
        st.frame = P.frame(ctx, st.pane);
        st.canvas = P.canvas(ctx, st.frame);
        if (ctx.spec.scenario === 'columns') P.columns(ctx);
        else {
          P.cards(ctx);
          P.guide(ctx);
          if (ctx.spec.scenario === 'mockup') st.thumb = P.mockup(ctx, body);
        }
        P.paint();
        P.place(ctx, card);
        P.rendered(ctx);
        return { anchors: [card], sync: () => P.paint() };
      },
      locate(t) { return P.locate(t); },
    };
  });
})();
