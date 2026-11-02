/* draw-shape/_base-svg: the reference svg scope, with all original unit hooks.
 * Registered by draw-shape/base in the original scope order. */
(function () {
  'use strict';
  env.template('draw-shape/_base-svg', () => ({
    register(env, scriptOf, __parts, __has, setScope) {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get ICONS() { return ICONS; },
        get TOOL_LABELS() { return TOOL_LABELS; },
        get fmtPx() { return fmtPx; },
        get unit() { return unit; },
        get BUILD() { return BUILD; },
        get HAS_BAR() { return HAS_BAR; },
        get LAYER_COLORS() { return LAYER_COLORS; },
        get EYE() { return EYE; },
        get LOCK() { return LOCK; },
        get st() { return st; }, set st(v) { st = v; },
        get keyHandler() { return keyHandler; }, set keyHandler(v) { keyHandler = v; },
        get ensureStyle() { return ensureStyle; },
        get drawGrid() { return drawGrid; },
        get dot() { return dot; },
        get label() { return label; },
        get arrowPath() { return arrowPath; },
        get drawItem() { return drawItem; },
        get button() { return button; },
        get buildClassic() { return buildClassic; },
        get buildTool() { return buildTool; },
        get wrap() { return wrap; },
        get buildSignature() { return buildSignature; },
        get buildConnect() { return buildConnect; },
        get buildErase() { return buildErase; },
        get buildMulti() { return buildMulti; },
        get drawMap() { return drawMap; },
        get drawTileMap() { return drawTileMap; },
        get buildPolygon() { return buildPolygon; },
        get place() { return place; },
        get layersPanel() { return layersPanel; },
        get renderBoard() { return renderBoard; },
        get locateIn() { return locateIn; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+0.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      setScope(__scope);
      if (__has('ensureStyle@0')) ensureStyle = __parts['ensureStyle@0'](ensureStyle, __scope);
      if (__has('drawGrid')) drawGrid = __parts['drawGrid'](drawGrid, __scope);
      if (__has('dot')) dot = __parts['dot'](dot, __scope);
      if (__has('label')) label = __parts['label'](label, __scope);
      if (__has('arrowPath')) arrowPath = __parts['arrowPath'](arrowPath, __scope);
      if (__has('drawItem')) drawItem = __parts['drawItem'](drawItem, __scope);
      if (__has('button')) button = __parts['button'](button, __scope);
      if (__has('buildClassic')) buildClassic = __parts['buildClassic'](buildClassic, __scope);
      if (__has('buildTool')) buildTool = __parts['buildTool'](buildTool, __scope);
      if (__has('wrap')) wrap = __parts['wrap'](wrap, __scope);
      if (__has('buildSignature')) buildSignature = __parts['buildSignature'](buildSignature, __scope);
      if (__has('buildConnect')) buildConnect = __parts['buildConnect'](buildConnect, __scope);
      if (__has('buildErase')) buildErase = __parts['buildErase'](buildErase, __scope);
      if (__has('buildMulti')) buildMulti = __parts['buildMulti'](buildMulti, __scope);
      if (__has('drawMap')) drawMap = __parts['drawMap'](drawMap, __scope);
      if (__has('drawTileMap')) drawTileMap = __parts['drawTileMap'](drawTileMap, __scope);
      if (__has('buildPolygon')) buildPolygon = __parts['buildPolygon'](buildPolygon, __scope);
      if (__has('place')) place = __parts['place'](place, __scope);
      if (__has('layersPanel')) layersPanel = __parts['layersPanel'](layersPanel, __scope);
      if (__has('renderBoard')) renderBoard = __parts['renderBoard'](renderBoard, __scope);
      if (__has('locateIn')) locateIn = __parts['locateIn'](locateIn, __scope);

      const CSS = __has('CSS@0') ? __parts['CSS@0'](undefined, __scope) : (`
      .dw-wrap { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 8px; }
      .dw-board {
        border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: var(--panel);
        box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 6px 20px rgba(0,0,0,.07);
      }
      .dw-board svg { display: block; cursor: crosshair; touch-action: none; user-select: none; -webkit-user-select: none; }
      .dw-hint { font-size: 13px; color: var(--muted); display: flex; align-items: center; gap: 8px; max-width: 100%; text-align: center; }
      .dw-hint .dw-swatch { flex: none; display: inline-block; width: 22px; height: 4px; border-radius: 2px; background: var(--accent); }
      .dw-label { font: 700 15px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; fill: var(--fg);
        paint-order: stroke; stroke: var(--panel); stroke-width: 4px; stroke-linejoin: round; pointer-events: none; }
      .dw-small { font: 600 12px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; fill: var(--muted);
        paint-order: stroke; stroke: var(--panel); stroke-width: 4px; stroke-linejoin: round;
        text-transform: uppercase; letter-spacing: .06em; pointer-events: none; }
      .dw-bar { display: flex; align-items: center; gap: 4px; padding: 4px; border: 1px solid var(--line); border-radius: 10px;
        background: var(--panel); box-shadow: 0 1px 2px rgba(0,0,0,.05); max-width: 100%; }
      .dw-bar .sep { width: 1px; height: 24px; background: var(--line); margin: 0 4px; }
      .dw-btn { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 10px; border-radius: 7px; border: 1px solid transparent;
        background: transparent; color: var(--fg); font: 600 13px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; cursor: pointer; white-space: nowrap; }
      .dw-btn svg { width: 17px; height: 17px; flex: none; }
      .dw-btn:hover { background: color-mix(in srgb, var(--fg) 7%, transparent); }
      .dw-btn[aria-pressed="true"] { background: color-mix(in srgb, var(--accent) 16%, var(--panel)); border-color: color-mix(in srgb, var(--accent) 45%, transparent); color: var(--accent); }
      .dw-btn kbd { font: 600 10px ui-monospace, Menlo, Consolas, monospace; color: var(--muted); border: 1px solid var(--line); border-radius: 4px; padding: 0 4px; }
      .dw-btn:disabled { opacity: .45; cursor: default; }
      .dw-foot { display: flex; align-items: center; gap: 10px; }
      .dw-foot .dw-btn { border-color: var(--line); height: 36px; padding: 0 16px; }
      .dw-foot .dw-btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
      .dw-foot .dw-btn.primary:disabled { background: color-mix(in srgb, var(--fg) 25%, var(--panel)); border-color: transparent; }
      .dw-foot .dw-ok { font-size: 13px; font-weight: 600; color: #2b8a3e; }
      .dw-node rect { fill: var(--panel); stroke: color-mix(in srgb, var(--fg) 35%, var(--line)); stroke-width: 1.5; }
      .dw-node text { font: 600 13px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; fill: var(--fg); text-anchor: middle; dominant-baseline: central; pointer-events: none; }
      .dw-port { fill: var(--panel); stroke: var(--accent); stroke-width: 2.5; cursor: crosshair; }
      .dw-port:hover { fill: var(--accent); }
      .dw-edge path.e { fill: none; stroke: color-mix(in srgb, var(--fg) 60%, transparent); stroke-width: 2.2; pointer-events: stroke; }
      .dw-edge .del { opacity: .5; cursor: pointer; }
      .dw-edge:hover .del, .dw-edge .del:hover { opacity: 1; }
      .dw-edge .del circle { fill: var(--panel); stroke: #c92a2a; stroke-width: 1.5; }
      .dw-edge .del path { stroke: #c92a2a; stroke-width: 2; stroke-linecap: round; }
      .dw-rubber { stroke: var(--accent); stroke-width: 2; stroke-dasharray: 6 5; fill: none; pointer-events: none; }
      .dw-doc { font: 13px Georgia, "Times New Roman", serif; fill: color-mix(in srgb, var(--fg) 75%, transparent); pointer-events: none; }
      .dw-doc.t { font: 700 19px Georgia, "Times New Roman", serif; fill: var(--fg); }
      .dw-street { font: 600 11px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; fill: #5c5f66; paint-order: stroke; stroke: #f3f1ea; stroke-width: 3px; pointer-events: none; }
      .dw-pin text { font: 700 12px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; fill: #fff; text-anchor: middle; dominant-baseline: central; }
      .dw-pin { pointer-events: none; }
      .dw-wb { position: absolute; display: flex; flex-direction: column; border: 1px solid var(--line); border-radius: 12px; background: var(--panel);
        box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.1); overflow: hidden; }
      .dw-wb .dw-wrap { position: static; padding: 8px 10px; }
      .dw-wb-head { display: flex; align-items: center; gap: 6px; height: 36px; padding: 0 10px; border-bottom: 1px solid var(--line); font: 600 13px system-ui, sans-serif; color: var(--fg); }
      .dw-wb-head .t { margin-right: auto; }
      .dw-wb-head button { height: 26px; padding: 0 9px; border: 1px solid var(--line); border-radius: 6px; background: var(--panel); color: var(--muted); font: 600 12px system-ui, sans-serif; cursor: pointer; }
      .dw-wb-head button.go { background: var(--accent); border-color: var(--accent); color: #fff; }
      .dw-wb-body { display: flex; align-items: flex-start; }
      .dw-layers { width: 176px; flex: none; margin: 8px 10px 8px 0; border: 1px solid var(--line); border-radius: 10px; background: color-mix(in srgb, var(--fg) 3%, var(--panel)); overflow: hidden; }
      .dw-layers h4 { margin: 0; padding: 8px 10px; font: 700 11px system-ui, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); border-bottom: 1px solid var(--line); }
      .dw-layer { display: flex; align-items: center; gap: 8px; height: 36px; padding: 0 8px; border-bottom: 1px solid var(--line); cursor: pointer; font: 600 13px system-ui, sans-serif; color: var(--fg); }
      .dw-layer.on { background: color-mix(in srgb, var(--accent) 14%, var(--panel)); box-shadow: inset 3px 0 0 var(--accent); }
      .dw-layer .sw { width: 10px; height: 10px; border-radius: 3px; flex: none; }
      .dw-layer .nm { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .dw-layer.off .nm { color: var(--muted); text-decoration: line-through; }
      .dw-eye { width: 24px; height: 24px; padding: 0; border: 0; border-radius: 5px; background: transparent; color: var(--fg); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
      .dw-eye:hover { background: color-mix(in srgb, var(--fg) 9%, transparent); }
      .dw-eye[aria-pressed="false"] { color: var(--muted); opacity: .6; }
      .dw-eye svg { width: 16px; height: 16px; }
      .dw-lock { width: 14px; height: 14px; color: var(--muted); flex: none; }
      .dw-msg { padding: 8px 10px; min-height: 52px; font: 12px/1.35 system-ui, sans-serif; color: var(--muted); }
      .dw-msg.warn { color: #c92a2a; }
      .dw-atlas-head { display: flex; align-items: center; gap: 10px; height: 38px; width: 100%; padding: 0 10px; border: 1px solid var(--line); border-radius: 10px 10px 0 0; border-bottom: 0; background: var(--panel); font: 600 14px system-ui, sans-serif; color: var(--fg); box-sizing: border-box; }
      .dw-atlas-head .s { flex: 1; height: 24px; border: 1px solid var(--line); border-radius: 12px; padding: 0 12px; color: var(--muted); font: 13px/22px system-ui, sans-serif; background: color-mix(in srgb, var(--fg) 4%, var(--panel)); }
      .dw-atlas-head button { width: 26px; height: 24px; border: 1px solid var(--line); border-radius: 6px; background: var(--panel); color: var(--fg); font: 600 15px/1 system-ui, sans-serif; cursor: pointer; }
      .dw-atlas .dw-board { border-radius: 0 0 10px 10px; }
      .dw-attrib { font: 11px system-ui, sans-serif; color: var(--muted); align-self: flex-end; }
      .dw-area { font: 700 13px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; fill: #2c3e2f; text-anchor: middle; paint-order: stroke; stroke: rgba(255,255,255,.75); stroke-width: 3px; pointer-events: none; }
      `);

      const ICONS = __has('ICONS') ? __parts['ICONS'](undefined, __scope) : ({
        pen: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17c3-1 4-5 7-6s4 2 7-1"/><path d="M13 3l4 4"/></svg>',
        line: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 16L16 4"/><circle cx="4" cy="16" r="1.6" fill="currentColor"/><circle cx="16" cy="4" r="1.6" fill="currentColor"/></svg>',
        rect: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="5" width="13" height="10" rx="1"/></svg>',
        ellipse: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="10" cy="10" rx="7" ry="5"/></svg>',
        eraser: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M8 16l-4-4 8-8 5 5-7 7z"/><path d="M8 16h9"/><path d="M6.5 9.5l5 5"/></svg>',
        undo: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 5L3 9l4 4"/><path d="M3 9h9a5 5 0 010 10H9"/></svg>',
        clear: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6h12M8 6V4h4v2M6 6l1 11h6l1-11"/></svg>',
        polygon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M4 7l6-4 6 5-2 8H6z"/></svg>',
      });
      const TOOL_LABELS = __has('TOOL_LABELS') ? __parts['TOOL_LABELS'](undefined, __scope) : ({ pen: 'Pen', line: 'Line', rect: 'Rectangle', ellipse: 'Ellipse', eraser: 'Eraser' });

      let st = __has('st') ? __parts['st'](undefined, __scope) : (null); // live episode: { locate(t) }
      let keyHandler = __has('keyHandler') ? __parts['keyHandler'](undefined, __scope) : (null);
      if (__has('stmt0.0')) __parts['stmt0.0'](undefined, __scope);
      else document.addEventListener('keydown', (e) => { if (keyHandler) keyHandler(e); });

      function ensureStyle() {
        if (document.getElementById('dw-style')) return;
        const s = document.createElement('style');
        s.id = 'dw-style';
        s.textContent = CSS;
        document.head.append(s);
      }

      const fmtPx = __has('fmtPx') ? __parts['fmtPx'](undefined, __scope) : { fmtPx: (pts, px) => pts.map((p) => px(p).map((v) => v.toFixed(1)).join(',')).join(' ') }.fmtPx;
      const unit = __has('unit@0') ? __parts['unit@0'](undefined, __scope) : { unit: (a, b) => {
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const l = Math.hypot(dx, dy) || 1;
        return [dx / l, dy / l];
      } }.unit;

      // ---------------------------------------------------------------- shared drawing helpers

      function drawGrid(util, rng, svg, W, H, styleOverride) {
        const style = styleOverride || rng.pick(['dots', 'lines', 'plain']);
        util.svg('rect', { x: 0, y: 0, width: W, height: H, fill: 'var(--panel)' }, svg);
        if (style === 'plain') return;
        const step = rng.int(20, 32);
        const defs = util.svg('defs', {}, svg);
        const pat = util.svg('pattern', { id: 'dw-grid', width: step, height: step, patternUnits: 'userSpaceOnUse' }, defs);
        if (style === 'dots') util.svg('circle', { cx: step / 2, cy: step / 2, r: 1.4, fill: 'var(--line)' }, pat);
        else util.svg('path', { d: `M ${step} 0 L 0 0 0 ${step}`, fill: 'none', stroke: 'var(--line)', 'stroke-width': 1, opacity: 0.7 }, pat);
        util.svg('rect', { x: 0, y: 0, width: W, height: H, fill: 'url(#dw-grid)', 'pointer-events': 'none' }, svg);
      }

      function dot(util, g, px, p, hollow) {
        const [x, y] = px(p);
        if (hollow) {
          util.svg('circle', { cx: x, cy: y, r: 7.5, fill: 'var(--panel)', stroke: 'var(--fg)', 'stroke-width': 2.5 }, g);
        } else {
          util.svg('circle', { cx: x, cy: y, r: 9, fill: 'var(--panel)' }, g);
          util.svg('circle', { cx: x, cy: y, r: 6.5, fill: 'var(--fg)' }, g);
        }
      }

      // Text placed `off` px from p in direction d (unit), kept inside the board.
      function label(util, g, px, W, H, p, d, text, cls = 'dw-label', off = 20) {
        const [x, y] = px(p);
        const lx = Math.min(W - 16, Math.max(16, x + d[0] * off));
        const ly = Math.min(H - 10, Math.max(14, y + d[1] * off));
        util.svg('text', { x: lx, y: ly, class: cls, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g).textContent = text;
      }

      function arrowPath(util, g, px, path, fill = 'var(--fg)') {
        const pts = fmtPx(path, px);
        util.svg('polyline', { points: pts, fill: 'none', stroke: 'var(--muted)', 'stroke-width': 16, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.18 }, g);
        util.svg('polyline', { points: pts, fill: 'none', stroke: 'var(--muted)', 'stroke-width': 2, 'stroke-dasharray': '6 6', 'stroke-linejoin': 'round' }, g);
        const tip = px(path[path.length - 1]);
        const d = unit(path[path.length - 2], path[path.length - 1]);
        const n = [-d[1], d[0]];
        const back = [tip[0] - d[0] * 18, tip[1] - d[1] * 18];
        const head = [tip, [back[0] + n[0] * 9, back[1] + n[1] * 9], [back[0] - n[0] * 9, back[1] - n[1] * 9]];
        util.svg('polygon', { points: head.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' '), fill, stroke: 'var(--panel)', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
      }

      function drawItem(util, g, px, item, attrs) {
        const a = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...attrs };
        const p = item.pts;
        if (!p || !p.length) return null;
        if (item.kind === 'pen') return util.svg('polyline', { ...a, points: fmtPx(p, px) }, g);
        const [x0, y0] = px(p[0]);
        const [x1, y1] = px(p[p.length - 1]);
        if (item.kind === 'line') return util.svg('line', { ...a, x1: x0, y1: y0, x2: x1, y2: y1 }, g);
        const x = Math.min(x0, x1);
        const y = Math.min(y0, y1);
        const w = Math.abs(x1 - x0);
        const h = Math.abs(y1 - y0);
        if (item.kind === 'rect') return util.svg('rect', { ...a, x, y, width: w, height: h }, g);
        return util.svg('ellipse', { ...a, cx: x + w / 2, cy: y + h / 2, rx: w / 2, ry: h / 2 }, g);
      }

      function button(util, parent, key, text, opts = {}) {
        const b = util.el('button', 'dw-btn' + (opts.cls ? ` ${opts.cls}` : ''), parent);
        b.type = 'button';
        b.dataset.role = opts.role || 'tool';
        b.dataset.key = key;
        if (ICONS[opts.icon || key] && opts.icon !== false) b.insertAdjacentHTML('beforeend', ICONS[opts.icon || key]);
        util.el('span', '', b, text);
        if (opts.kbd) util.el('kbd', '', b, opts.kbd);
        if (opts.title) b.title = opts.title;
        return b;
      }

      // ---------------------------------------------------------------- per-scenario builders
      // Each gets B = { ctx, svg, px, toBoard, W, H, scale, bar, foot, hint, up(m) } and returns { sync(m), locate(t) }.

      function buildClassic(B) {
        const { ctx, svg, px, W, H } = B;
        const { util, rng, spec } = ctx;
        drawGrid(util, rng, svg, W, H);
        const g = util.svg('g', {}, svg);
        if (spec.scenario === 'line') {
          if (spec.mode === 'connect') {
            dot(util, g, px, spec.a);
            dot(util, g, px, spec.b);
            label(util, g, px, W, H, spec.a, unit(spec.b, spec.a), 'A');
            label(util, g, px, W, H, spec.b, unit(spec.a, spec.b), 'B');
          } else {
            if (spec.dir === 'guide') {
              const d = [Math.cos(spec.angle), Math.sin(spec.angle)];
              const h = spec.guide.len / 2;
              const a = px([spec.guide.c[0] - d[0] * h, spec.guide.c[1] - d[1] * h]);
              const b = px([spec.guide.c[0] + d[0] * h, spec.guide.c[1] + d[1] * h]);
              util.svg('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: 'var(--muted)', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
              for (const e of [a, b]) util.svg('circle', { cx: e[0], cy: e[1], r: 4, fill: 'var(--muted)' }, g);
              const nrm = [-d[1], d[0]];
              label(util, g, px, W, H, spec.guide.c, nrm[1] > 0 ? [-nrm[0], -nrm[1]] : nrm, 'guide', 'dw-small', 18);
            }
            const [x, y] = px(spec.p);
            util.svg('circle', { cx: x, cy: y, r: 15, fill: 'none', stroke: 'var(--muted)', 'stroke-width': 1.5, 'stroke-dasharray': '3 4' }, g);
            dot(util, g, px, spec.p);
          }
        } else if (spec.scenario === 'circle') {
          const [x, y] = px(spec.c);
          if (spec.show === 'guide') {
            util.svg('circle', { cx: x, cy: y, r: spec.r * B.scale, fill: 'none', stroke: 'var(--muted)', 'stroke-width': 2, 'stroke-dasharray': '8 7', opacity: 0.8 }, g);
            dot(util, g, px, spec.c);
            if (spec.rimDot) dot(util, g, px, spec.rim, true); // trait guide 'both': guide and rim dot together
          } else {
            dot(util, g, px, spec.c);
            dot(util, g, px, spec.rim, true);
          }
        } else {
          arrowPath(util, g, px, spec.path);
          dot(util, g, px, spec.path[0]);
          label(util, g, px, W, H, spec.path[0], unit(spec.path[1], spec.path[0]), 'start', 'dw-small', 24);
        }
        const pen = util.svg('polyline', {
          fill: 'none', stroke: 'var(--accent)', 'stroke-width': rng.pick([3, 3.5, 4, 5]),
          'stroke-linecap': 'round', 'stroke-linejoin': 'round', points: '',
        }, svg);
        const stroke = env.ui.stroke(svg, {
          ...B.frame,
          strokes: ctx.model.strokes,
          render: (points) => pen.setAttribute('points', fmtPx(points, px)), // only the last stroke is drawn
          onStroke: (points, strokes) => ctx.update({ strokes }),
          onChange: (strokes) => ctx.update({ strokes }),
          label: 'pen',
        });
        B.hint(rng.pick(['Hold the mouse button to draw. Starting a new stroke replaces the old one.',
          'Press and drag to draw. Each new stroke replaces the previous one.']));
        return { sync: (m) => stroke.set(m.strokes), locate: (t) => (t.point ? stroke.locate(t.point) : null) };
      }

      function buildTool(B) {
        const { ctx, svg, px, W, H } = B;
        const { util, rng, spec } = ctx;
        const fam = env.taskDef;
        drawGrid(util, rng, svg, W, H, rng.pick(['dots', 'plain']));
        const g = util.svg('g', {}, svg);
        if (spec.target === 'line') {
          dot(util, g, px, spec.a);
          dot(util, g, px, spec.b);
          label(util, g, px, W, H, spec.a, unit(spec.b, spec.a), 'A');
          label(util, g, px, W, H, spec.b, unit(spec.a, spec.b), 'B');
        } else if (spec.target === 'pen') {
          arrowPath(util, g, px, spec.path);
          dot(util, g, px, spec.path[0]);
          label(util, g, px, W, H, spec.path[0], unit(spec.path[1], spec.path[0]), 'start', 'dw-small', 24);
        } else {
          const [x0, y0] = px(spec.a);
          const [x1, y1] = px(spec.b);
          const box = { x: Math.min(x0, x1), y: Math.min(y0, y1), width: Math.abs(x1 - x0), height: Math.abs(y1 - y0) };
          if (spec.show === 'outline') {
            util.svg('rect', { ...box, fill: 'none', stroke: 'var(--muted)', 'stroke-width': 2, 'stroke-dasharray': '7 6' }, g);
            for (const [cx, cy] of [[box.x, box.y], [box.x + box.width, box.y], [box.x, box.y + box.height], [box.x + box.width, box.y + box.height]]) {
              util.svg('rect', { x: cx - 3.5, y: cy - 3.5, width: 7, height: 7, fill: 'var(--muted)' }, g);
            }
          } else {
            dot(util, g, px, spec.a);
            dot(util, g, px, spec.b);
          }
        }
        const items = util.svg('g', {}, svg);
        const preview = util.svg('g', {}, svg);
        const ink = rng.pick(['var(--accent)', '#1c63d6', '#c2255c', '#2b8a3e']);
        const width = rng.pick([3, 3.5, 4]);

        // Toolbar.
        const tools = rng.bool(0.5) ? ['pen', 'line', 'rect', 'ellipse'] : ['line', 'rect', 'ellipse', 'pen'];
        const tbtn = {};
        for (const t of tools) {
          tbtn[t] = button(util, B.bar, t, TOOL_LABELS[t], { kbd: spec.keys ? fam.helpers.TOOL_KEYS[t].toUpperCase() : null, title: TOOL_LABELS[t] });
          tbtn[t].addEventListener('click', () => { ctx.log('tool', { tool: t }); B.up({ ...ctx.model, tool: t }); });
        }
        util.el('span', 'sep', B.bar);
        const undoBtn = button(util, B.bar, 'undo', 'Undo', { role: 'control', kbd: spec.keys ? 'Ctrl+Z' : null });
        const undo = () => { if (ctx.model.items.length) B.up({ ...ctx.model, items: ctx.model.items.slice(0, -1) }); };
        undoBtn.addEventListener('click', undo);

        const stroke = env.ui.stroke(svg, {
          ...B.frame,
          strokes: [],
          render: (points) => {
            preview.replaceChildren();
            const it = points.length >= 2 ? (ctx.model.tool === 'pen' ? { kind: 'pen', pts: points } : { kind: ctx.model.tool, pts: [points[0], points[points.length - 1]] }) : null;
            if (it) drawItem(util, preview, px, it, { stroke: ink, 'stroke-width': width, 'stroke-dasharray': ctx.model.tool === 'pen' ? null : '5 4', opacity: 0.8 });
          },
          onChange: (strokes) => {
            const pts = strokes[strokes.length - 1];
            const it = fam.helpers.itemFromStroke(ctx.model.tool, pts);
            stroke.set([]);
            if (it) B.up({ ...ctx.model, items: ctx.model.items.concat([it]) });
          },
          label: 'tool',
        });
        if (spec.keys) {
          keyHandler = (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); undo(); return; }
            const t = Object.keys(fam.helpers.TOOL_KEYS).find((k) => fam.helpers.TOOL_KEYS[k] === e.key.toLowerCase() && tools.includes(k));
            if (t && !e.ctrlKey && !e.metaKey) B.up({ ...ctx.model, tool: t });
          };
        }
        function sync(m) {
          for (const t of tools) tbtn[t].setAttribute('aria-pressed', String(m.tool === t));
          items.replaceChildren();
          for (const it of m.items) {
            const attrs = { stroke: ink, 'stroke-width': width };
            if (it.kind === 'pen') { attrs.stroke = 'var(--fg)'; attrs.opacity = 0.85; }
            drawItem(util, items, px, it, attrs);
          }
          undoBtn.disabled = !m.items.length;
        }
        B.hint(rng.pick(['Pick a tool, then drag on the canvas. Undo removes the last shape.',
          'Choose a tool in the toolbar and drag to draw. Every shape stays on the canvas.']));
        return {
          sync,
          locate(t) {
            if (t.point) return stroke.locate(t.point);
            if (t.tool) return env.util.center(tbtn[t.tool]);
            if (t.control === 'undo') return env.util.center(undoBtn);
            return null;
          },
        };
      }

      // Wrap text into lines of at most n characters.
      function wrap(text, n) {
        const out = [];
        let cur = '';
        for (const w of String(text).split(/\s+/)) {
          if (cur && (cur + ' ' + w).length > n) { out.push(cur); cur = w; } else cur = cur ? `${cur} ${w}` : w;
        }
        if (cur) out.push(cur);
        return out;
      }

      function buildSignature(B) {
        const { ctx, svg, px, W, H, scale } = B;
        const { util, rng, spec } = ctx;
        const fam = env.taskDef;
        util.svg('rect', { x: 0, y: 0, width: W, height: H, fill: rng.pick(['#fffdf8', '#ffffff', '#fbfbfa']) }, svg);
        const ink = rng.pick(['#1d3a8a', '#16181d', '#123f6b']);
        // Document text above the field (pointer-events none on text).
        const mx = 0.07 * scale;
        const box = spec.box;
        const [bx, by] = px([box.x, box.y]);
        const bw = box.w * scale;
        const bh = box.h * scale;
        util.svg('text', { x: mx, y: 0.1 * scale, class: 'dw-doc t' }, svg).textContent = spec.doc.title;
        const maxChars = Math.max(20, Math.floor((W - 2 * mx) / 6.6));
        let y = 0.1 * scale + 28;
        for (const s of spec.doc.lines) {
          for (const line of wrap(s, maxChars)) {
            if (y > by - 26) break;
            util.svg('text', { x: mx, y, class: 'dw-doc' }, svg).textContent = line;
            y += 18;
          }
          y += 6;
        }
        // The signature field.
        util.svg('rect', { x: bx, y: by, width: bw, height: bh, rx: 6, fill: 'rgba(255, 235, 150, .18)', stroke: '#b08900', 'stroke-width': 1.5, 'stroke-dasharray': '6 4' }, svg);
        util.svg('line', { x1: bx + 14, y1: by + bh * 0.78, x2: bx + bw - 14, y2: by + bh * 0.78, stroke: '#9a9a9a', 'stroke-width': 1.2 }, svg);
        util.svg('text', { x: bx + 14, y: by + bh * 0.78 - 6, class: 'dw-doc', style: 'font-size:18px;fill:#9a9a9a' }, svg).textContent = '✕';
        util.svg('text', { x: bx + 8, y: by - 7, class: 'dw-small', style: 'fill:#8a6d00' }, svg).textContent = rng.pick(['Sign here', 'Signature', 'Sign below']);
        const nameY = Math.min(H - 6, by + bh + 16);
        util.svg('text', { x: bx + 14, y: nameY, class: 'dw-doc', style: 'font-size:12px' }, svg).textContent = spec.signer;
        const strokesG = util.svg('g', {}, svg);
        const width = rng.pick([2.2, 2.6, 3]);
        const stroke = env.ui.stroke(svg, {
          ...B.frame,
          strokes: ctx.model.strokes,
          render: (points, strokes) => {
            strokesG.replaceChildren();
            for (const s of strokes) util.svg('polyline', { points: fmtPx(s, px), fill: 'none', stroke: ink, 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, strokesG);
          },
          onStroke: (points, strokes) => { if (!ctx.model.accepted) ctx.update({ ...ctx.model, strokes }); },
          onChange: (strokes) => { if (!ctx.model.accepted) B.up({ ...ctx.model, strokes }); },
          label: 'signature',
        });
        const order = rng.bool(0.7);
        const clearBtn = button(util, B.foot, 'clear', rng.pick(['Clear', 'Clear signature', 'Start over']), { role: 'control', icon: false });
        const acceptBtn = button(util, B.foot, 'accept', rng.pick(['Accept', 'Accept signature', 'Accept & sign']), { role: 'control', icon: false, cls: 'primary' });
        if (!order) B.foot.append(clearBtn);
        const ok = util.el('span', 'dw-ok', B.foot, '');
        clearBtn.addEventListener('click', () => { ctx.log('clear'); B.up({ ...ctx.model, strokes: [], accepted: false }); });
        acceptBtn.addEventListener('click', () => { if (ctx.model.strokes.length && !ctx.model.accepted) { ctx.log('accept'); B.up({ ...ctx.model, accepted: true }); } });
        function sync(m) {
          stroke.set(m.strokes);
          acceptBtn.disabled = !m.strokes.length || m.accepted;
          ok.textContent = m.accepted ? '✓ Signature accepted' : '';
          svg.style.pointerEvents = m.accepted ? 'none' : '';
          svg.style.cursor = m.accepted ? 'default' : '';
        }
        B.hint(rng.pick(['Draw your signature with the mouse. Accept locks it in.', 'Sign inside the field. Use Clear to try again.']), true);
        void fam;
        return {
          sync,
          locate(t) {
            if (t.point) return stroke.locate(t.point);
            if (t.control === 'clear') return env.util.center(clearBtn);
            if (t.control === 'accept') return env.util.center(acceptBtn);
            return null;
          },
        };
      }

      function buildConnect(B) {
        const { ctx, svg, px, W, H, scale } = B;
        const { util, rng, spec } = ctx;
        const NODE = env.taskDef.helpers.NODE;
        drawGrid(util, rng, svg, W, H, rng.pick(['dots', 'plain', 'lines']));
        const defs = util.svg('defs', {}, svg);
        const mk = util.svg('marker', { id: 'dw-arrow', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto' }, defs);
        util.svg('path', { d: 'M0,0 L10,5 L0,10 z', style: 'fill: color-mix(in srgb, var(--fg) 60%, transparent)' }, mk);
        const edgesG = util.svg('g', {}, svg);
        const nodesG = util.svg('g', {}, svg);
        const delsG = util.svg('g', { class: 'dw-edge' }, svg); // remove handles above the nodes
        const rubber = util.svg('line', { class: 'dw-rubber', visibility: 'hidden' }, svg);
        const portOf = (i, kind) => [spec.nodes[i].x + (kind === 'out' ? NODE.w / 2 : -NODE.w / 2), spec.nodes[i].y];
        const rx = rng.pick([4, 8, 14]);
        const ports = {};
        spec.nodes.forEach((n, i) => {
          const g = util.svg('g', { class: 'dw-node' }, nodesG);
          g.dataset.node = String(i);
          g.dataset.role = 'node';
          const [x, y] = px([n.x - NODE.w / 2, n.y - NODE.h / 2]);
          util.svg('rect', { x, y, width: NODE.w * scale, height: NODE.h * scale, rx }, g);
          const [cx, cy] = px([n.x, n.y]);
          util.svg('text', { x: cx, y: cy }, g).textContent = n.label;
          for (const kind of ['in', 'out']) {
            const [qx, qy] = px(portOf(i, kind));
            const c = util.svg('circle', { cx: qx, cy: qy, r: 7, class: 'dw-port' }, g);
            c.dataset.role = 'port';
            c.dataset.node = String(i);
            c.dataset.kind = kind;
            ports[`${i}:${kind}`] = c;
            env.ui.track(c, {
              start(p, e) { e.stopPropagation(); rubber.setAttribute('x1', qx); rubber.setAttribute('y1', qy); },
              move(p) {
                const r = svg.getBoundingClientRect();
                rubber.setAttribute('x2', p.x - r.left);
                rubber.setAttribute('y2', p.y - r.top);
                rubber.setAttribute('visibility', 'visible');
              },
              end(p) {
                rubber.setAttribute('visibility', 'hidden');
                const hit = document.elementsFromPoint(p.x, p.y).find((el) => el.closest && el.closest('.dw-node'));
                if (!hit) return;
                const j = Number(hit.closest('.dw-node').dataset.node);
                if (j === i) return;
                const e = kind === 'out' ? [i, j] : [j, i];
                const m = ctx.model;
                if (m.edges.some((f) => f[0] === e[0] && f[1] === e[1])) return;
                ctx.log('connect', { from: e[0], to: e[1] });
                B.up({ ...m, edges: m.edges.concat([e]) });
              },
            }, 'port');
          }
        });
        let dels = {};
        function sync(m) {
          edgesG.replaceChildren();
          delsG.replaceChildren();
          dels = {};
          for (const [i, j] of m.edges) {
            const a = px(portOf(i, 'out'));
            const b = px(portOf(j, 'in'));
            // Horizontal tangents (node-editor style); backward links bend less so they stay on the board.
            const k = b[0] > a[0] ? Math.max(40, (b[0] - a[0]) / 2) : 60;
            const c1 = [a[0] + Math.min(k, (W - a[0]) * 1.2), a[1]];
            const c2 = [b[0] - Math.min(k, b[0] * 1.2), b[1]];
            const g = util.svg('g', { class: 'dw-edge' }, edgesG);
            util.svg('path', { class: 'e', d: `M${a[0]},${a[1]} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${b[0]},${b[1]}`, 'marker-end': 'url(#dw-arrow)' }, g);
            const mid = [0.125 * a[0] + 0.375 * c1[0] + 0.375 * c2[0] + 0.125 * b[0], 0.125 * a[1] + 0.375 * c1[1] + 0.375 * c2[1] + 0.125 * b[1]];
            const del = util.svg('g', { class: 'del' }, delsG);
            del.dataset.role = 'remove-edge';
            util.svg('circle', { cx: mid[0], cy: mid[1], r: 8 }, del);
            util.svg('path', { d: `M${mid[0] - 3.5},${mid[1] - 3.5} L${mid[0] + 3.5},${mid[1] + 3.5} M${mid[0] + 3.5},${mid[1] - 3.5} L${mid[0] - 3.5},${mid[1] + 3.5}` }, del);
            del.addEventListener('click', () => {
              ctx.log('disconnect', { from: i, to: j });
              B.up({ ...ctx.model, edges: ctx.model.edges.filter((e) => !(e[0] === i && e[1] === j)) });
            });
            dels[`${i}>${j}`] = del;
          }
        }
        B.hint(rng.pick(['Drag from a node\'s right-hand dot to another node to connect them. Click × on an arrow to remove it.',
          'Connections run from the out port (right) to the in port (left). Hover an arrow to remove it.']));
        return {
          sync,
          locate(t) {
            if (t.port) return env.util.center(ports[`${t.port[0]}:${t.port[1]}`]);
            if (t.edgeDel) {
              const el = dels[`${t.edgeDel[0]}>${t.edgeDel[1]}`];
              return el ? env.util.center(el.querySelector('circle')) : null;
            }
            return null;
          },
        };
      }

      function buildErase(B) {
        const { ctx, svg, px, W, H, scale } = B;
        const { util, rng, spec } = ctx;
        const fam = env.taskDef;
        util.svg('rect', { x: 0, y: 0, width: W, height: H, fill: rng.pick(['#ffffff', '#fbfcfd', '#fdfcf7']) }, svg);
        const inks = fam.helpers.INKS;
        const g = util.svg('g', {}, svg);
        const drawnG = util.svg('g', {}, svg);
        const preview = util.svg('polyline', { fill: 'none', stroke: 'var(--fg)', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.7 }, svg);
        const width = rng.pick([4, 5, 6]);
        const tools = rng.bool(0.5) ? ['pen', 'eraser'] : ['eraser', 'pen'];
        const tbtn = {};
        for (const t of tools) {
          tbtn[t] = button(util, B.bar, t, TOOL_LABELS[t], { kbd: spec.keys ? fam.helpers.TOOL_KEYS[t].toUpperCase() : null });
          tbtn[t].addEventListener('click', () => { ctx.log('tool', { tool: t }); B.up({ ...ctx.model, tool: t }); });
        }
        util.el('span', 'sep', B.bar);
        const undoBtn = button(util, B.bar, 'undo', 'Undo', { role: 'control', kbd: spec.keys ? 'Ctrl+Z' : null });
        const undo = () => {
          const m = ctx.model;
          const op = m.ops[m.ops.length - 1];
          if (!op) return;
          const ops = m.ops.slice(0, -1);
          if (op[0] === 'e') B.up({ ...m, ops, erased: m.erased.filter((i) => i !== op[1]) });
          else B.up({ ...m, ops, drawn: m.drawn.slice(0, -1) });
        };
        undoBtn.addEventListener('click', undo);
        const R = 10 / scale; // eraser radius in board units
        const near = (p, s) => {
          for (let i = 1; i < s.length; i++) {
            const a = s[i - 1];
            const b = s[i];
            const ab = [b[0] - a[0], b[1] - a[1]];
            const l2 = ab[0] * ab[0] + ab[1] * ab[1];
            const t = l2 ? Math.max(0, Math.min(1, ((p[0] - a[0]) * ab[0] + (p[1] - a[1]) * ab[1]) / l2)) : 0;
            if (Math.hypot(p[0] - a[0] - t * ab[0], p[1] - a[1] - t * ab[1]) <= R) return true;
          }
          return false;
        };
        let seen = 0;
        const eraseAt = (points) => {
          let m = ctx.model;
          let changed = false;
          for (; seen < points.length; seen++) {
            const p = points[seen];
            spec.strokes.forEach((s, i) => {
              if (!m.erased.includes(i) && near(p, s.pts)) {
                m = { ...m, erased: m.erased.concat([i]), ops: m.ops.concat([['e', i]]) };
                changed = true;
                ctx.log('erase', { stroke: i });
              }
            });
          }
          if (changed) B.up(m);
        };
        const stroke = env.ui.stroke(svg, {
          ...B.frame,
          strokes: [],
          render: (points) => preview.setAttribute('points', ctx.model.tool === 'pen' ? fmtPx(points, px) : ''),
          onStroke: (points) => { if (points.length <= 1) seen = 0; if (ctx.model.tool === 'eraser') eraseAt(points); },
          onChange: (strokes) => {
            const pts = strokes[strokes.length - 1] || [];
            stroke.set([]);
            if (ctx.model.tool === 'eraser') { eraseAt(pts); seen = 0; return; }
            seen = 0;
            if (pts.length >= 2) B.up({ ...ctx.model, drawn: ctx.model.drawn.concat([pts]), ops: ctx.model.ops.concat([['d']]) });
          },
          label: 'board',
        });
        if (spec.keys) {
          keyHandler = (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); undo(); return; }
            const k = e.key.toLowerCase();
            if (!e.ctrlKey && !e.metaKey && (k === fam.helpers.TOOL_KEYS.pen || k === fam.helpers.TOOL_KEYS.eraser)) B.up({ ...ctx.model, tool: k === fam.helpers.TOOL_KEYS.pen ? 'pen' : 'eraser' });
          };
        }
        function sync(m) {
          for (const t of tools) tbtn[t].setAttribute('aria-pressed', String(m.tool === t));
          svg.style.cursor = m.tool === 'eraser' ? 'cell' : 'crosshair';
          g.replaceChildren();
          spec.strokes.forEach((s, i) => {
            if (m.erased.includes(i)) return;
            util.svg('polyline', { points: fmtPx(s.pts, px), fill: 'none', stroke: inks[s.color], 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
          });
          drawnG.replaceChildren();
          for (const s of m.drawn) util.svg('polyline', { points: fmtPx(s, px), fill: 'none', stroke: 'var(--fg)', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, drawnG);
          undoBtn.disabled = !m.ops.length;
        }
        B.hint(rng.pick(['The eraser removes any stroke it touches. Undo brings back the last change.', 'Select the eraser and click a stroke to delete it.']));
        return {
          sync,
          locate(t) {
            if (t.grab !== undefined) return stroke.locate(spec.strokes[t.grab].grab);
            if (t.tool) return env.util.center(tbtn[t.tool]);
            if (t.control === 'undo') return env.util.center(undoBtn);
            if (t.point) return stroke.locate(t.point);
            return null;
          },
        };
      }

      function buildMulti(B) {
        const { ctx, svg, px, W, H } = B;
        const { util, rng, spec } = ctx;
        drawGrid(util, rng, svg, W, H);
        const g = util.svg('g', {}, svg);
        for (const t of spec.targets) {
          if (t.type === 'line') {
            dot(util, g, px, t.a);
            dot(util, g, px, t.b);
            label(util, g, px, W, H, t.a, unit(t.b, t.a), t.labels[0]);
            label(util, g, px, W, H, t.b, unit(t.a, t.b), t.labels[1]);
          } else {
            const [x, y] = px(t.c);
            util.svg('circle', { cx: x, cy: y, r: t.r * B.scale, fill: 'none', stroke: 'var(--muted)', 'stroke-width': 2, 'stroke-dasharray': '8 7', opacity: 0.8 }, g);
            dot(util, g, px, t.c);
          }
        }
        const inkG = util.svg('g', {}, svg);
        const ink = rng.pick(['var(--accent)', '#1c63d6', '#c2255c']);
        const width = rng.pick([3, 3.5, 4]);
        const stroke = env.ui.stroke(svg, {
          ...B.frame,
          strokes: ctx.model.strokes,
          render: (points, strokes) => {
            inkG.replaceChildren();
            for (const s of strokes) util.svg('polyline', { points: fmtPx(s, px), fill: 'none', stroke: ink, 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, inkG);
          },
          onStroke: (points, strokes) => ctx.update({ strokes }),
          onChange: (strokes) => B.up({ strokes }),
          label: 'pen',
        });
        const penLabel = button(util, B.bar, 'pen', 'Pen', { role: 'tool' });
        penLabel.setAttribute('aria-pressed', 'true');
        util.el('span', 'sep', B.bar);
        const undoBtn = button(util, B.bar, 'undo', 'Undo', { role: 'control' });
        const clearBtn = button(util, B.bar, 'clear', rng.pick(['Clear', 'Clear all']), { role: 'control' });
        undoBtn.addEventListener('click', () => { if (ctx.model.strokes.length) B.up({ strokes: ctx.model.strokes.slice(0, -1) }); });
        clearBtn.addEventListener('click', () => { if (ctx.model.strokes.length) B.up({ strokes: [] }); });
        B.hint(rng.pick(['Every stroke stays on the board and counts. Undo removes the last one.', 'Draw each shape with its own stroke; Undo or Clear to fix mistakes.']));
        return {
          sync(m) { stroke.set(m.strokes); undoBtn.disabled = clearBtn.disabled = !m.strokes.length; },
          locate(t) {
            if (t.point) return stroke.locate(t.point);
            if (t.control === 'undo') return env.util.center(undoBtn);
            if (t.control === 'clear') return env.util.center(clearBtn);
            return null;
          },
        };
      }

      function drawMap(B) {
        return env.templateLib('draw-shape/_base-map').drawMap(__scope, B);
      }

      // atlas: a raster-tile base map (tile grid with tint and seams, city blocks, parks, river), streets on top.
      function drawTileMap(B) {
        return env.templateLib('draw-shape/_base-map').drawTileMap(__scope, B);
      }

      function buildPolygon(B) {
        return env.templateLib('draw-shape/_base-map').buildPolygon(__scope, B);
      }

      const BUILD = __has('BUILD') ? __parts['BUILD'](undefined, __scope) : ({ line: buildClassic, circle: buildClassic, trace: buildClassic, tool: buildTool, signature: buildSignature,
        connect: buildConnect, erase: buildErase, multi: buildMulti, polygon: buildPolygon });
      const HAS_BAR = __has('HAS_BAR') ? __parts['HAS_BAR'](undefined, __scope) : { HAS_BAR: (spec) => ['tool', 'erase', 'multi'].includes(spec.scenario) || (spec.scenario === 'polygon' && spec.mode === 'pins') }.HAS_BAR;

      // Place `wrap` (absolutely positioned) at a seeded spot of the stage's free space.
      function place(wrap, ctx, rng) {
        const { size } = ctx;
        const r = wrap.getBoundingClientRect();
        const fx = rng.pick([0, 0.5, 0.5, 1, rng.float(0, 1)]);
        const fy = rng.pick([0, 0.5, 0.5, 1, rng.float(0, 1)]);
        const mx = Math.min(16, Math.max(0, (size.width - r.width) / 2));
        const my = Math.min(12, Math.max(0, (size.height - r.height) / 2));
        wrap.style.left = `${Math.round(mx + fx * Math.max(0, size.width - 2 * mx - r.width))}px`;
        wrap.style.top = `${Math.round(my + fy * Math.max(0, size.height - 2 * my - r.height))}px`;
      }

      const LAYER_COLORS = __has('LAYER_COLORS') ? __parts['LAYER_COLORS'](undefined, __scope) : (['#1c7ed6', '#e8590c', '#2b8a3e']);
      const EYE = __has('EYE') ? __parts['EYE'](undefined, __scope) : ('<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10s3-5.5 8-5.5S18 10 18 10s-3 5.5-8 5.5S2 10 2 10z"/><circle cx="10" cy="10" r="2.4"/></svg>');
      const LOCK = __has('LOCK') ? __parts['LOCK'](undefined, __scope) : ('<svg class="dw-lock" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="9" width="11" height="8" rx="1.5"/><path d="M7 9V6.5a3 3 0 016 0V9"/></svg>');

      // whiteboard: the Layers panel (active layer, visibility, a locked layer) and the press gate on the board.
      function layersPanel(ctx, body, boardEl, util) {
        const { spec } = ctx;
        const L = spec.layers;
        const panel = util.el('div', 'dw-layers', body);
        panel.dataset.role = 'layers';
        util.el('h4', '', panel, 'Layers');
        const rows = [];
        const eyes = [];
        L.names.forEach((name, i) => {
          const row = util.el('div', 'dw-layer', panel);
          row.dataset.role = 'layer';
          util.el('span', 'sw', row).style.background = LAYER_COLORS[i];
          util.el('span', 'nm', row, name);
          if (i === L.locked) row.insertAdjacentHTML('beforeend', LOCK);
          const eye = util.el('button', 'dw-eye', row);
          eye.type = 'button';
          eye.dataset.role = 'eye';
          eye.innerHTML = EYE;
          eye.setAttribute('aria-label', `Toggle ${name}`);
          eye.addEventListener('click', (e) => {
            e.stopPropagation();
            const m = ctx.model;
            const hide = m.hide.slice();
            hide[i] = !hide[i];
            ctx.log('layer-visibility', { layer: i, hidden: hide[i] });
            ctx.update({ ...m, hide });
            paint();
          });
          row.addEventListener('click', () => {
            ctx.log('layer-select', { layer: i });
            ctx.update({ ...ctx.model, layer: i });
            say('');
            paint();
          });
          rows.push(row);
          eyes.push(eye);
        });
        const msg = util.el('div', 'dw-msg', panel);
        const say = (text) => { msg.textContent = text; msg.classList.toggle('warn', !!text); };
        function paint() {
          const m = ctx.model;
          rows.forEach((row, i) => {
            row.classList.toggle('on', m.layer === i);
            row.classList.toggle('off', !!m.hide[i]);
            eyes[i].setAttribute('aria-pressed', String(!m.hide[i]));
          });
        }
        boardEl.addEventListener('pointerdown', (e) => {
          const m = ctx.model;
          const name = L.names[m.layer];
          let why = null;
          if (m.hide[m.layer]) why = `“${name}” is hidden. Show it to draw on it.`;
          else if (m.layer === L.locked) why = `“${name}” is locked.`;
          else if (m.layer !== L.goal) why = `Nothing was drawn: this task needs the “${L.names[L.goal]}” layer.`;
          if (!why) { say(''); return; }
          e.stopPropagation();
          e.preventDefault();
          ctx.log('blocked', { layer: m.layer });
          say(why);
        }, true);
        paint();
        return {
          paint: () => { paint(); },
          locate(t) {
            if (t.layer !== undefined) return env.util.center(rows[t.layer]);
            if (t.eye !== undefined) return env.util.center(eyes[t.eye]);
            return null;
          },
        };
      }

      function renderBoard(ctx, flavor) {
          ensureStyle();
          keyHandler = null;
          const { util, rng, size, spec } = ctx;
          const bar = HAS_BAR(spec);
          const foot = spec.scenario === 'signature';
          const wb = flavor === 'whiteboard';
          const atlas = flavor === 'atlas';
          const reserveH = 24 + (bar ? 50 : 0) + (foot ? 46 : 0) + 30 + (wb ? 52 : atlas ? 66 : 0);
          const fit = Math.min(size.height - reserveH, (size.width - 32 - (wb ? 210 : 0)) / (spec.board.w / spec.board.h));
          const H = Math.max(120, Math.floor(Math.min(fit, rng.int(400, 600))));
          const scale = H / spec.board.h;
          const W = Math.round(spec.board.w * scale);

          // whiteboard: an app frame (header, board column + layers panel); the board column is the usual wrap.
          let root;
          let body = null;
          let wrap;
          if (wb) {
            root = util.el('div', 'dw-wb', ctx.stage);
            const head = util.el('div', 'dw-wb-head', root);
            util.el('span', 't', head, rng.pick(['Untitled board', 'Team sketch', 'Brainstorm', 'Whiteboard 1']));
            for (const b of ['Select', 'Sticky', 'Text']) {
              const btn = util.el('button', '', head, b);
              btn.type = 'button';
              btn.addEventListener('click', () => ctx.log('decoy', { what: b }));
            }
            const share = util.el('button', 'go', head, 'Share');
            share.type = 'button';
            share.addEventListener('click', () => ctx.log('decoy', { what: 'share' }));
            body = util.el('div', 'dw-wb-body', root);
            wrap = util.el('div', 'dw-wrap', body);
          } else {
            wrap = util.el('div', 'dw-wrap', ctx.stage);
            wrap.style.left = '0px';
            wrap.style.top = '0px';
            root = wrap;
          }
          const barEl = bar ? util.el('div', 'dw-bar', wrap) : null;
          if (atlas) {
            wrap.classList.add('dw-atlas');
            const head = util.el('div', 'dw-atlas-head', wrap);
            util.el('span', '', head, rng.pick(['Atlas', 'Wayfinder', 'City map', 'Cartograph']));
            util.el('div', 's', head, 'Search places');
            for (const sign of ['+', '−']) {
              const b = util.el('button', '', head, sign);
              b.type = 'button';
              b.setAttribute('aria-label', sign === '+' ? 'Zoom in' : 'Zoom out');
              b.addEventListener('click', () => ctx.log('decoy', { what: 'zoom' }));
            }
          }
          const boardEl = util.el('div', 'dw-board', wrap);
          if (bar && (atlas || rng.bool(0.3))) wrap.append(barEl); // toolbar below the board (always on the atlas page)
          const svg = util.svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, boardEl);
          svg.dataset.role = 'board';
          if (atlas) util.el('div', 'dw-attrib', wrap, 'Map data © contributors');
          const footEl = foot ? util.el('div', 'dw-foot', wrap) : null;
          const hintEl = util.el('div', 'dw-hint', wrap);
          const px = (p) => [p[0] * scale, p[1] * scale];
          const toBoard = ([x, y]) => {
            const r = svg.getBoundingClientRect();
            return [Math.round(((x - r.left) / scale) * 1e4) / 1e4, Math.round(((y - r.top) / scale) * 1e4) / 1e4];
          };
          const frame = {
            toBoard: ([x, y]) => {
              const r = svg.getBoundingClientRect();
              return [(x - r.left) / scale, (y - r.top) / scale];
            },
            fromBoard: ([bx, by]) => {
              const r = svg.getBoundingClientRect();
              return [r.left + bx * scale, r.top + by * scale];
            },
            bounds: { x0: 0, y0: 0, x1: spec.board.w, y1: spec.board.h },
          };
          let view = null;
          // The builders replace the model with their own fields; whiteboard keeps its layer state (layer, hide) across them.
          let bctx = ctx;
          if (wb) {
            bctx = Object.create(ctx);
            bctx.update = (m) => ctx.update({ layer: ctx.model.layer, hide: ctx.model.hide, ...m });
          }
          const B = {
            ctx: bctx, svg, px, toBoard, frame, W, H, scale, bar: barEl, foot: footEl, flavor,
            hint(text, swatch = true) {
              if (swatch) util.el('span', 'dw-swatch', hintEl);
              util.el('span', '', hintEl, text);
            },
            // The kit never calls sync() after ctx.update: redraw here after every change.
            up(m) {
              bctx.update(m);
              if (view) view.sync(ctx.model);
            },
          };
          let layers = null;
          if (wb) layers = layersPanel(ctx, body, boardEl, util);
          view = BUILD[spec.scenario](B);
          view.sync(ctx.model);
          hintEl.style.maxWidth = `${Math.max(W, 200)}px`;
          // The footer is as wide as the board (its row stays centred under it): on a narrow board (traits.aspect) the
          // "accepted" note appearing must not widen the column and shift the board.
          if (footEl) Object.assign(footEl.style, { width: `${W}px`, justifyContent: 'center' });
          place(root, ctx, rng.fork('place'));
          st = { locate: (t) => (layers && layers.locate(t)) || view.locate(t) };
          return { anchors: [svg], sync: (m) => { view.sync(m); if (layers) layers.paint(); } };
      }

      function locateIn(t) {
        const p = st && st.locate(t);
        if (!p) throw new Error(`draw cannot locate ${JSON.stringify(t)}`);
        return p;
      }

      env.widget({
        task: 'draw-shape',
        site: 'base',
        name: 'canvas',
        split: 'train',
        scenarios: ['line', 'circle', 'trace', 'tool', 'signature', 'connect', 'erase', 'multi', 'polygon'],
        render: (ctx) => renderBoard(ctx, 'canvas'),
        locate: locateIn,
      });

      env.widget({
        task: 'draw-shape',
        site: 'base',
        name: 'whiteboard',
        split: 'train',
        scenarios: ['line', 'circle', 'trace', 'tool', 'multi'],
        traits: { layers: true },
        render: (ctx) => renderBoard(ctx, 'whiteboard'),
        locate: locateIn,
      });

      env.widget({
        task: 'draw-shape',
        site: 'base',
        name: 'atlas',
        split: 'train',
        scenarios: ['polygon'],
        render: (ctx) => renderBoard(ctx, 'atlas'),
        locate: locateIn,
      });
    
    },
  }), { uses: ["draw-shape/_base-map"] });
})();
