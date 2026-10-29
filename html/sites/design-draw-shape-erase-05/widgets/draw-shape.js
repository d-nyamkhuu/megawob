// Design on templates/draw-shape/base.js: the base site's draw-shape widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-erase-05',
  name: 'design',
  split: 'train',
  scenarios: ['erase'],
  template: 'draw-shape/base',
  design: {
    parts: {
      'buildErase': (base, S) => function buildErase(B) {
        const { TOOL_LABELS, button, env, fmtPx } = S;
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
        // Reference-style palette items are decorative in this eraser exercise.
        const decorative = (label, glyph, cls) => {
          const b = util.el('button', `dw-xp-extra ${cls || ''}`, B.bar);
          b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
          b.innerHTML = glyph;
          b.addEventListener('click', () => ctx.log('decoy', { what: label }));
        };
        decorative('Rectangle', '<svg viewBox="0 0 40 32"><rect x="4" y="5" width="31" height="22"/></svg>');
        decorative('Ellipse', '<svg viewBox="0 0 40 32"><ellipse cx="20" cy="16" rx="15" ry="11"/></svg>');
        decorative('Line', '<svg viewBox="0 0 40 32"><path d="M5 4L35 28"/></svg>');
        decorative('Text', '<b>A</b>', 'xp-text');
        for (const color of ['#111111', '#f00000', '#0879e8', '#08a51b', '#f0df00']) {
          const sw = util.el('button', 'dw-xp-swatch', B.bar);
          sw.type = 'button'; sw.title = `Color ${color}`; sw.setAttribute('aria-label', `Color ${color}`);
          sw.style.setProperty('--swatch', color);
          sw.addEventListener('click', () => ctx.log('decoy', { what: 'color' }));
        }
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
          S.keyHandler = (e) => {
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
      },
      'renderBoard': (base, S) => function renderBoard(ctx, flavor) {
        const { BUILD, HAS_BAR, ensureStyle, layersPanel, place } = S;
          ensureStyle();
          S.keyHandler = null;
          const { util, rng, size, spec } = ctx;
          const bar = HAS_BAR(spec);
          const foot = spec.scenario === 'signature';
          const wb = flavor === 'whiteboard';
          const atlas = flavor === 'atlas';
          const reserveH = 24 + (bar ? 50 : 0) + (foot ? 46 : 0) + 30 + (wb ? 52 : atlas ? 66 : 0);
          const fit = Math.min(size.height - reserveH, (size.width - 32 - (wb ? 210 : 0)) / (spec.board.w / spec.board.h));
          const sampledH = rng.int(400, 600);
          const H = Math.max(120, Math.floor(Math.min(fit, spec.scenario === 'erase' ? 600 : sampledH)));
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
          S.st = { locate: (t) => (layers && layers.locate(t)) || view.locate(t) };
          return { anchors: [svg], sync: (m) => { view.sync(m); if (layers) layers.paint(); } };
      },
      'renderCanvasboard': (base, S) => function renderCanvasboard(ctx) {
        const { CB_APPS, CB_AV, CB_BOARDS, CB_CSS, CB_FRAMES, CB_ICONS, CB_NOTES, CB_NOTE_TEXT, CB_TOOL_LABELS, env, r4 } = S;
        const { spec, util, rng, size } = ctx;
        ctx.css('cb-style', CB_CSS);
        const fam = env.taskDef;
        const v = spec.scenario;
        S.cbKey = null;
        if (S.cbView && S.cbView.off) S.cbView.off();

        // Room: the stage minus a floating end control that overlaps it.
        let W = size.width;
        let H = size.height;
        const st = ctx.stage.getBoundingClientRect();
        const sub = env.submitEl && env.submitEl.getBoundingClientRect();
        if (sub && sub.width && sub.left < st.right && sub.right > st.left && sub.top < st.bottom && sub.bottom > st.top) {
          const cutH = st.bottom - sub.top + 10;
          const cutW = st.right - sub.left + 10;
          if (cutH * W <= cutW * H) H -= cutH;
          else W -= cutW;
        }
        const appW = Math.round(Math.min(W - 2 * rng.int(4, 14), 1360));
        const appH = Math.round(Math.min(H - 2 * rng.int(4, 10), 820));
        const app = util.el('div', 'cb-app', ctx.stage);
        const appLeft = Math.round(rng.float(0, 1) * Math.max(0, W - appW));
        const appTop = Math.round(rng.float(0, 1) * Math.max(0, H - appH));
        app.style.width = `${v === 'erase' ? W : appW}px`;
        app.style.height = `${v === 'erase' ? H : appH}px`;
        app.style.left = `${v === 'erase' ? 0 : appLeft}px`;
        app.style.top = `${v === 'erase' ? 0 : appTop}px`;
        const cw = app.clientWidth;
        const ch = app.clientHeight;
        const canvas = util.el('canvas', 'cb-canvas', app);
        canvas.dataset.role = 'board';
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(cw * dpr);
        canvas.height = Math.round(ch * dpr);
        canvas.style.width = `${cw}px`;
        canvas.style.height = `${ch}px`;
        const g = canvas.getContext('2d');

        // Colors from the theme (canvas needs concrete values).
        const cs = getComputedStyle(app);
        const tv = (k, d) => {
          const s = (cs.getPropertyValue(`--${k}`) || '').trim();
          if (!s) return d;
          g.fillStyle = '#010203';
          g.fillStyle = s;
          return g.fillStyle === '#010203' && s !== '#010203' ? d : g.fillStyle;
        };
        const col = { bg: tv('bg', '#f4f5f7'), panel: tv('panel', '#ffffff'), fg: tv('fg', '#1d2330'), muted: tv('muted', '#6b7280'),
          line: tv('line', '#d5d9e0'), accent: tv('accent', '#2f6fed') };
        const lum = (c) => {
          const m = /^#([0-9a-f]{6})$/i.exec(c);
          if (!m) return 1;
          const n = parseInt(m[1], 16);
          return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
        };
        const dark = lum(col.bg) < 0.45;
        const font = getComputedStyle(document.body).fontFamily || 'system-ui, sans-serif';

        // ---- DOM frame
        const head = util.el('div', 'cb-float cb-head', app);
        const appName = rng.pick(CB_APPS);
        util.el('span', 'logo', head, appName[0]);
        util.el('span', 'name', head, rng.pick(CB_BOARDS));
        util.el('span', 'crumb', head, appName);
        const share = util.el('div', 'cb-float cb-share', app);
        const people = rng.sample(['AK', 'JM', 'RT', 'SL', 'PD', 'NO'], rng.int(2, 3));
        people.forEach((p, i) => { const a = util.el('span', 'av', share, p); a.style.background = CB_AV[(i + rng.int(0, 5)) % CB_AV.length]; });
        const shareBtn = util.el('button', '', share, 'Share');
        shareBtn.type = 'button';
        shareBtn.addEventListener('click', () => ctx.log('decoy', { what: 'share' }));

        const toolsEl = util.el('div', 'cb-float cb-tools', app);
        const btn = {};
        const mkBtn = (parent, key, title, kbd) => {
          const b = util.el('button', 'cb-btn', parent);
          b.type = 'button';
          b.dataset.key = key;
          b.title = title;
          b.setAttribute('aria-label', title);
          if (CB_ICONS[key]) b.insertAdjacentHTML('beforeend', CB_ICONS[key]);
          if (kbd) util.el('kbd', '', b, kbd);
          return b;
        };
        const keyOf = (t) => (spec.keys && fam.helpers.TOOL_KEYS[t] ? fam.helpers.TOOL_KEYS[t].toUpperCase() : null);
        let tools;
        if (v === 'tool') tools = rng.bool(0.5) ? ['pen', 'line', 'rect', 'ellipse'] : ['line', 'rect', 'ellipse', 'pen'];
        else if (v === 'erase') tools = rng.bool(0.5) ? ['pen', 'eraser'] : ['eraser', 'pen'];
        else if (v === 'connect') tools = ['select'];
        else tools = ['pen'];
        const decoys = v === 'connect' ? ['sticky', 'text'] : rng.bool(0.5) ? ['sticky'] : ['text'];
        for (const t of ['hand', ...tools]) {
          btn[t] = mkBtn(toolsEl, t, CB_TOOL_LABELS[t], keyOf(t));
          btn[t].dataset.role = 'tool';
        }
        for (const t of decoys) {
          const b = mkBtn(toolsEl, t, CB_TOOL_LABELS[t]);
          b.addEventListener('click', () => ctx.log('decoy', { what: t }));
        }
        const ctl = {};
        if (v === 'tool' || v === 'erase' || v === 'multi') {
          util.el('span', 'sep', toolsEl);
          ctl.undo = mkBtn(toolsEl, 'undo', 'Undo', spec.keys && v !== 'multi' ? '⌃Z' : null);
          ctl.undo.dataset.role = 'control';
          if (v === 'multi') {
            ctl.clear = mkBtn(toolsEl, 'clear', rng.pick(['Clear', 'Clear all']));
            ctl.clear.dataset.role = 'control';
          }
        }
        if (v === 'erase') {
          const extra = (label, markup, cls) => {
            const b = util.el('button', `cb-btn cb-xp-extra ${cls || ''}`, toolsEl);
            b.type = 'button'; b.title = label; b.setAttribute('aria-label', label); b.innerHTML = markup;
            b.addEventListener('click', () => ctx.log('decoy', { what: label }));
          };
          extra('Rectangle', '<svg viewBox="0 0 40 32"><rect x="4" y="5" width="31" height="22"/></svg>');
          extra('Ellipse', '<svg viewBox="0 0 40 32"><ellipse cx="20" cy="16" rx="15" ry="11"/></svg>');
          extra('Line', '<svg viewBox="0 0 40 32"><path d="M5 4L35 28"/></svg>');
          extra('Text', '<b>A</b>', 'cb-xp-text');
          for (const color of ['#111111', '#f00000', '#0879e8', '#08a51b', '#f0df00']) {
            const b = util.el('button', 'cb-btn cb-xp-swatch', toolsEl);
            b.type = 'button'; b.title = `Color ${color}`; b.setAttribute('aria-label', `Color ${color}`);
            b.style.setProperty('--swatch', color);
            b.addEventListener('click', () => ctx.log('decoy', { what: 'color' }));
          }
        }
        const zoomEl = util.el('div', 'cb-float cb-zoom', app);
        const zOut = mkBtn(zoomEl, 'zout', 'Zoom out');
        zOut.textContent = '−';
        const pct = util.el('span', 'pct', zoomEl, '100%');
        const zIn = mkBtn(zoomEl, 'zin', 'Zoom in');
        zIn.textContent = '+';
        const zFit = mkBtn(zoomEl, 'fit', 'Zoom to fit');
        const hints = {
          line: 'Press and drag on the frame to draw; a new stroke replaces the last one.',
          circle: 'Press and drag on the frame to draw; a new stroke replaces the last one.',
          trace: 'Press and drag on the frame to draw; a new stroke replaces the last one.',
          tool: 'Pick a tool, then drag on the frame. Undo removes the last shape.',
          connect: 'Drag from a note’s right-hand dot onto another note to connect them. Hover a connector for its ×.',
          erase: 'The eraser deletes any doodle it touches. Undo brings it back.',
          multi: 'Every stroke stays and counts. Undo removes the last one.',
        };
        const hintEl = util.el('div', 'cb-float cb-hint', app, `${hints[v]} Hand tool or middle-drag pans.`);

        // ---- free area for the frame (inside the floating frame)
        const ar = app.getBoundingClientRect();
        const rel = (el) => { const r = el.getBoundingClientRect(); return { l: r.left - ar.left, t: r.top - ar.top, r: r.right - ar.left, b: r.bottom - ar.top }; };
        const zr = rel(zoomEl);
        hintEl.style.maxWidth = `${Math.max(120, zr.l - 26)}px`;
        const free = { x: rel(toolsEl).r + 18, y: Math.max(rel(head).b, rel(share).b) + 30, r: cw - 18, b: Math.min(zr.t, rel(hintEl).t) - 16 };
        const bw = spec.board.w;
        const bh = spec.board.h;
        const fitK = Math.min((free.r - free.x) / bw, (free.b - free.y) / bh);
        const cam = { k: 0, x: 0, y: 0 };
        let k0 = fitK;
        function fit(frac, fx, fy) {
          cam.k = fitK * frac;
          cam.x = free.x + (free.r - free.x - bw * cam.k) * fx;
          cam.y = free.y + (free.b - free.y - bh * cam.k) * fy;
        }
        fit(rng.float(0.84, 0.97), rng.float(0.25, 0.75), rng.float(0.3, 0.7));
        k0 = cam.k;
        const K100 = rng.pick([440, 480, 520]); // px per board unit shown as 100%
        const toS = ([x, y]) => [cam.x + x * cam.k, cam.y + y * cam.k];
        const toB = ([x, y]) => [(x - cam.x) / cam.k, (y - cam.y) / cam.k];
        const z = () => cam.k / k0; // zoom relative to the start (stroke widths, text)
        const vp = (s) => { const r = canvas.getBoundingClientRect(); return [r.left + s[0], r.top + s[1]]; };
        const local = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
        const clampB = ([x, y]) => [r4(Math.min(bw, Math.max(0, x))), r4(Math.min(bh, Math.max(0, y)))];

        // ---- world clutter outside the frame (seeded): notes, shapes and a second frame
        const cr = rng.fork('clutter');
        const clutter = [];
        const frame2 = cr.bool(0.6) ? { x: bw + cr.float(0.3, 0.45), y: cr.float(-0.1, 0.25), w: cr.float(0.7, 1.0), h: cr.float(0.6, 0.85), name: cr.pick(['Frame 2', 'Parking lot', 'Archive', 'Ideas']) } : null;
        const nClutter = cr.int(4, 7);
        for (let i = 0; i < nClutter; i++) {
          const side = cr.pick(['left', 'left', 'below', 'above', 'right']);
          const w = cr.float(0.16, 0.24);
          let x;
          let y;
          if (side === 'left') { x = -w - cr.float(0.12, 0.6); y = cr.float(-0.2, bh); }
          else if (side === 'right') { x = bw + cr.float(0.12, 0.2); y = cr.float(-0.2, bh); }
          else if (side === 'below') { x = cr.float(-0.2, bw); y = bh + cr.float(0.14, 0.4); }
          else { x = cr.float(-0.2, bw); y = -w - cr.float(0.2, 0.4); }
          if (frame2 && x + w > frame2.x - 0.05 && x < frame2.x + frame2.w + 0.05 && y + w > frame2.y - 0.05 && y < frame2.y + frame2.h + 0.05) continue;
          clutter.push({ kind: cr.pick(['note', 'note', 'note', 'shape']), x, y, w, h: w, color: cr.pick(CB_NOTES), text: cr.pick(CB_NOTE_TEXT), rot: cr.float(-0.05, 0.05) });
        }
        if (frame2) for (let i = 0; i < cr.int(2, 3); i++) {
          const w = cr.float(0.16, 0.2);
          clutter.push({ kind: 'note', x: frame2.x + 0.06 + i * (w + 0.05), y: frame2.y + cr.float(0.08, frame2.h - w - 0.05), w, h: w, color: cr.pick(CB_NOTES), text: cr.pick(CB_NOTE_TEXT), rot: cr.float(-0.04, 0.04) });
        }
        const frameName = rng.pick(CB_FRAMES);
        const paper = v === 'erase' && dark ? '#f3f2ee' : col.panel; // the doodles' ink colors need a light page
        const gridStep = rng.pick([0.04, 0.05, 0.0625]);
        const inkCol = v === 'erase' ? '#25262b' : rng.pick([col.accent, '#1c63d6', '#c2255c', '#2b8a3e']);
        const inkW = rng.pick([3, 3.5, 4]);
        const noteCols = (spec.nodes || []).map(() => rng.pick(CB_NOTES));
        const eraseW = rng.pick([4, 5, 6]);

        // ---- drawing helpers (canvas px)
        function text(s, x, y, size, color, weight = 700, align = 'center', halo = paper) {
          g.font = `${weight} ${size}px ${font}`;
          g.textAlign = align;
          g.textBaseline = 'middle';
          if (halo) { g.lineWidth = 4; g.strokeStyle = halo; g.lineJoin = 'round'; g.strokeText(s, x, y); }
          g.fillStyle = color;
          g.fillText(s, x, y);
        }
        function dotAt(p, hollow) {
          const [x, y] = toS(p);
          g.beginPath();
          if (hollow) {
            g.arc(x, y, 7.5, 0, 2 * Math.PI);
            g.fillStyle = paper;
            g.fill();
            g.lineWidth = 2.5;
            g.strokeStyle = col.fg;
            g.stroke();
            return;
          }
          g.arc(x, y, 9, 0, 2 * Math.PI);
          g.fillStyle = paper;
          g.fill();
          g.beginPath();
          g.arc(x, y, 6.5, 0, 2 * Math.PI);
          g.fillStyle = col.fg;
          g.fill();
        }
        const unitV = (a, b) => { const dx = a[0] - b[0]; const dy = a[1] - b[1]; const l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
        function labelAt(p, d, s, small, off = 20) {
          const [x, y] = toS(p);
          const [fx0, fy0] = toS([0, 0]);
          const [fx1, fy1] = toS([bw, bh]);
          const lx = Math.min(fx1 - 16, Math.max(fx0 + 16, x + d[0] * off));
          const ly = Math.min(fy1 - 10, Math.max(fy0 + 12, y + d[1] * off));
          if (small) text(s.toUpperCase(), lx, ly, 12, col.muted, 600);
          else text(s, lx, ly, 15, col.fg, 700);
        }
        function poly(pts, color, width, dash, alpha = 1) {
          if (!pts || pts.length < 1) return;
          g.save();
          g.globalAlpha = alpha;
          g.beginPath();
          pts.forEach((p, i) => { const [x, y] = toS(p); if (i) g.lineTo(x, y); else g.moveTo(x, y); });
          if (pts.length === 1) { const [x, y] = toS(pts[0]); g.lineTo(x + 0.01, y); }
          g.lineWidth = width;
          g.strokeStyle = color;
          g.lineCap = 'round';
          g.lineJoin = 'round';
          g.setLineDash(dash || []);
          g.stroke();
          g.restore();
        }
        function arrowRoute(path) {
          poly(path, col.muted, 16, null, 0.18);
          poly(path, col.muted, 2, [6, 6]);
          const tip = toS(path[path.length - 1]);
          const d = unitV(toS(path[path.length - 1]), toS(path[path.length - 2]));
          const n = [-d[1], d[0]];
          const back = [tip[0] - d[0] * 18, tip[1] - d[1] * 18];
          g.beginPath();
          g.moveTo(tip[0], tip[1]);
          g.lineTo(back[0] + n[0] * 9, back[1] + n[1] * 9);
          g.lineTo(back[0] - n[0] * 9, back[1] - n[1] * 9);
          g.closePath();
          g.fillStyle = col.fg;
          g.fill();
          g.lineWidth = 1.5;
          g.strokeStyle = paper;
          g.stroke();
        }
        function dashedCircle(c, r) {
          const [x, y] = toS(c);
          g.save();
          g.beginPath();
          g.arc(x, y, r * cam.k, 0, 2 * Math.PI);
          g.lineWidth = 2;
          g.strokeStyle = col.muted;
          g.globalAlpha = 0.8;
          g.setLineDash([8, 7]);
          g.stroke();
          g.restore();
        }
        function item(it, color, width, dash, alpha) {
          const p = it.pts;
          if (!p || !p.length) return;
          if (it.kind === 'pen') { poly(p, color, width, dash, alpha); return; }
          if (it.kind === 'line') { poly([p[0], p[p.length - 1]], color, width, dash, alpha); return; }
          const [x0, y0] = toS(p[0]);
          const [x1, y1] = toS(p[p.length - 1]);
          g.save();
          g.globalAlpha = alpha ?? 1;
          g.beginPath();
          if (it.kind === 'rect') g.rect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
          else g.ellipse((x0 + x1) / 2, (y0 + y1) / 2, Math.abs(x1 - x0) / 2, Math.abs(y1 - y0) / 2, 0, 0, 2 * Math.PI);
          g.lineWidth = width;
          g.strokeStyle = color;
          g.lineJoin = 'round';
          g.setLineDash(dash || []);
          g.stroke();
          g.restore();
        }
        function sticky(x, y, w, h, color, label, rot, size) {
          // x, y, w, h in canvas px (top-left box)
          g.save();
          g.translate(x + w / 2, y + h / 2);
          g.rotate(rot || 0);
          g.shadowColor = 'rgba(0,0,0,.18)';
          g.shadowBlur = 8;
          g.shadowOffsetY = 3;
          g.fillStyle = color;
          g.beginPath();
          const f = Math.min(12, w * 0.14);
          g.moveTo(-w / 2, -h / 2);
          g.lineTo(w / 2, -h / 2);
          g.lineTo(w / 2, h / 2 - f);
          g.lineTo(w / 2 - f, h / 2);
          g.lineTo(-w / 2, h / 2);
          g.closePath();
          g.fill();
          g.shadowColor = 'transparent';
          g.fillStyle = 'rgba(0,0,0,.08)';
          g.beginPath();
          g.moveTo(w / 2, h / 2 - f);
          g.lineTo(w / 2 - f, h / 2 - f);
          g.lineTo(w / 2 - f, h / 2);
          g.closePath();
          g.fill();
          if (label) {
            let s = size;
            g.font = `600 ${s}px ${font}`;
            while (s > 8 && g.measureText(label).width > w - 12) { s -= 1; g.font = `600 ${s}px ${font}`; }
            g.textAlign = 'center';
            g.textBaseline = 'middle';
            g.fillStyle = '#26221a';
            g.fillText(label, 0, 0);
          }
          g.restore();
        }

        // ---- connect geometry (board units -> canvas px)
        const NODE = fam.helpers.NODE;
        const portOf = (i, kind) => [spec.nodes[i].x + (kind === 'out' ? NODE.w / 2 : -NODE.w / 2), spec.nodes[i].y];
        function edgeGeom(i, j) {
          const a = toS(portOf(i, 'out'));
          const b = toS(portOf(j, 'in'));
          const Wl = toS([0, 0])[0];
          const Wr = toS([bw, 0])[0];
          const kk = b[0] > a[0] ? Math.max(40 * z(), (b[0] - a[0]) / 2) : 60 * z();
          const c1 = [a[0] + Math.min(kk, (Wr - a[0]) * 1.2), a[1]];
          const c2 = [b[0] - Math.min(kk, (b[0] - Wl) * 1.2), b[1]];
          const at = (t) => {
            const u = 1 - t;
            return [u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0],
              u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1]];
          };
          return { a, b, c1, c2, at, mid: at(0.5) };
        }
        const noteRect = (i) => {
          const [x, y] = toS([spec.nodes[i].x - NODE.w / 2, spec.nodes[i].y - NODE.h / 2]);
          return { x, y, w: NODE.w * cam.k, h: NODE.h * cam.k };
        };
        const portR = () => Math.max(5, Math.min(8, 6 * z()));

        // ---- paint
        let hover = null; // { edge: 'i>j' } | { port: 'i:kind' }
        let live = null; // the gesture being drawn: { kind, pts, ... }
        function paint() {
          const m = ctx.model;
          g.setTransform(dpr, 0, 0, dpr, 0, 0);
          g.fillStyle = col.bg;
          g.fillRect(0, 0, cw, ch);
          // infinite dot grid in world space
          let step = gridStep;
          while (step * cam.k < 12) step *= 2;
          const [wx0, wy0] = toB([0, 0]);
          const [wx1, wy1] = toB([cw, ch]);
          g.fillStyle = col.line;
          const rad = Math.max(0.8, Math.min(1.6, 1.2 * z()));
          for (let gx = Math.floor(wx0 / step) * step; gx <= wx1; gx += step) {
            for (let gy = Math.floor(wy0 / step) * step; gy <= wy1; gy += step) {
              const [x, y] = toS([gx, gy]);
              g.fillRect(x - rad, y - rad, 2 * rad, 2 * rad);
            }
          }
          // clutter
          if (frame2) {
            const [x, y] = toS([frame2.x, frame2.y]);
            g.fillStyle = col.panel;
            g.globalAlpha = 0.85;
            g.fillRect(x, y, frame2.w * cam.k, frame2.h * cam.k);
            g.globalAlpha = 1;
            g.strokeStyle = col.line;
            g.lineWidth = 1;
            g.strokeRect(x, y, frame2.w * cam.k, frame2.h * cam.k);
            text(frame2.name, x, y - 11, 12, col.muted, 600, 'left', null);
          }
          for (const c of clutter) {
            const [x, y] = toS([c.x, c.y]);
            if (c.kind === 'note') sticky(x, y, c.w * cam.k, c.h * cam.k, c.color, c.text, c.rot, Math.max(9, 13 * z()));
            else {
              g.save();
              g.strokeStyle = col.muted;
              g.globalAlpha = 0.7;
              g.lineWidth = 2;
              g.beginPath();
              g.ellipse(x + c.w * cam.k / 2, y + c.h * cam.k / 2, c.w * cam.k / 2, c.h * cam.k / 3, 0, 0, 2 * Math.PI);
              g.stroke();
              g.restore();
            }
          }
          // the frame
          const [fx, fy] = toS([0, 0]);
          const fw = bw * cam.k;
          const fh = bh * cam.k;
          g.save();
          g.shadowColor = dark ? 'rgba(0,0,0,.5)' : 'rgba(0,0,0,.12)';
          g.shadowBlur = 14;
          g.shadowOffsetY = 3;
          g.fillStyle = paper;
          g.fillRect(fx, fy, fw, fh);
          g.restore();
          g.strokeStyle = col.line;
          g.lineWidth = 1;
          g.strokeRect(fx + 0.5, fy + 0.5, fw - 1, fh - 1);
          text(frameName, fx, fy - 12, 12, col.muted, 600, 'left', null);
          g.save();
          g.beginPath();
          g.rect(fx, fy, fw, fh);
          g.clip();
          paintScenario(m);
          g.restore();
          if (v === 'connect') paintConnect(m); // notes and ports may sit at the frame edge
          pct.textContent = `${Math.round((cam.k / K100) * 100)}%`;
        }

        function paintScenario(m) {
          if (v === 'line') {
            if (spec.mode === 'connect') {
              dotAt(spec.a);
              dotAt(spec.b);
              labelAt(spec.a, unitV(spec.a, spec.b), 'A');
              labelAt(spec.b, unitV(spec.b, spec.a), 'B');
            } else {
              if (spec.dir === 'guide') {
                const d = [Math.cos(spec.angle), Math.sin(spec.angle)];
                const h = spec.guide.len / 2;
                const a = [spec.guide.c[0] - d[0] * h, spec.guide.c[1] - d[1] * h];
                const b = [spec.guide.c[0] + d[0] * h, spec.guide.c[1] + d[1] * h];
                poly([a, b], col.muted, 4);
                for (const e of [a, b]) { const [x, y] = toS(e); g.beginPath(); g.arc(x, y, 4, 0, 2 * Math.PI); g.fillStyle = col.muted; g.fill(); }
                const nrm = [-d[1], d[0]];
                labelAt(spec.guide.c, nrm[1] > 0 ? [-nrm[0], -nrm[1]] : nrm, 'guide', true, 18);
              }
              const [x, y] = toS(spec.p);
              g.save();
              g.beginPath();
              g.arc(x, y, 15, 0, 2 * Math.PI);
              g.setLineDash([3, 4]);
              g.lineWidth = 1.5;
              g.strokeStyle = col.muted;
              g.stroke();
              g.restore();
              dotAt(spec.p);
            }
            const k = (m.strokes || [])[m.strokes.length - 1];
            poly(live ? live.pts : k, inkCol, inkW * z());
          } else if (v === 'circle') {
            if (spec.show === 'guide') {
              dashedCircle(spec.c, spec.r);
              dotAt(spec.c);
              if (spec.rimDot) dotAt(spec.rim, true);
            } else {
              dotAt(spec.c);
              dotAt(spec.rim, true);
            }
            const k = (m.strokes || [])[m.strokes.length - 1];
            poly(live ? live.pts : k, inkCol, inkW * z());
          } else if (v === 'trace') {
            arrowRoute(spec.path);
            dotAt(spec.path[0]);
            labelAt(spec.path[0], unitV(spec.path[0], spec.path[1]), 'start', true, 24);
            const k = (m.strokes || [])[m.strokes.length - 1];
            poly(live ? live.pts : k, inkCol, inkW * z());
          } else if (v === 'tool') {
            if (spec.target === 'line') {
              dotAt(spec.a);
              dotAt(spec.b);
              labelAt(spec.a, unitV(spec.a, spec.b), 'A');
              labelAt(spec.b, unitV(spec.b, spec.a), 'B');
            } else if (spec.target === 'pen') {
              arrowRoute(spec.path);
              dotAt(spec.path[0]);
              labelAt(spec.path[0], unitV(spec.path[0], spec.path[1]), 'start', true, 24);
            } else if (spec.show === 'outline') {
              const [x0, y0] = toS(spec.a);
              const [x1, y1] = toS(spec.b);
              g.save();
              g.setLineDash([7, 6]);
              g.lineWidth = 2;
              g.strokeStyle = col.muted;
              g.strokeRect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
              g.restore();
              g.fillStyle = col.muted;
              for (const [cx, cy] of [[x0, y0], [x1, y0], [x0, y1], [x1, y1]]) g.fillRect(cx - 3.5, cy - 3.5, 7, 7);
            } else {
              dotAt(spec.a);
              dotAt(spec.b);
            }
            for (const it of m.items || []) item(it, it.kind === 'pen' ? col.fg : inkCol, inkW * z(), null, it.kind === 'pen' ? 0.85 : 1);
            if (live && live.pts.length >= 2) {
              const t = m.tool;
              item(t === 'pen' ? { kind: 'pen', pts: live.pts } : { kind: t, pts: [live.pts[0], live.pts[live.pts.length - 1]] }, inkCol, inkW * z(), t === 'pen' ? null : [5, 4], 0.8);
            }
          } else if (v === 'erase') {
            spec.strokes.forEach((s, i) => { if (!(m.erased || []).includes(i)) poly(s.pts, fam.helpers.INKS[s.color], eraseW * z()); });
            for (const s of m.drawn || []) poly(s, '#25262b', 3 * z());
            if (live && m.tool === 'pen') poly(live.pts, '#25262b', 3 * z(), null, 0.7);
          } else if (v === 'multi') {
            for (const t of spec.targets) {
              if (t.type === 'line') {
                dotAt(t.a);
                dotAt(t.b);
                labelAt(t.a, unitV(t.a, t.b), t.labels[0]);
                labelAt(t.b, unitV(t.b, t.a), t.labels[1]);
              } else {
                dashedCircle(t.c, t.r);
                dotAt(t.c);
              }
            }
            for (const s of m.strokes || []) poly(s, inkCol, inkW * z()); // a live stroke is already the model's last
          }
        }

        function paintConnect(m) {
          // connectors under the notes, remove handles above them
          const arrow = (e) => {
            const d = unitV(e.b, e.at(0.96));
            const n = [-d[1], d[0]];
            const back = [e.b[0] - d[0] * 10, e.b[1] - d[1] * 10];
            g.beginPath();
            g.moveTo(e.b[0], e.b[1]);
            g.lineTo(back[0] + n[0] * 5, back[1] + n[1] * 5);
            g.lineTo(back[0] - n[0] * 5, back[1] - n[1] * 5);
            g.closePath();
            g.fill();
          };
          const edges = (m.edges || []).map(([i, j]) => ({ i, j, e: edgeGeom(i, j) }));
          g.save();
          g.strokeStyle = col.fg;
          g.fillStyle = col.fg;
          g.globalAlpha = 0.65;
          g.lineWidth = 2;
          for (const { e } of edges) {
            g.beginPath();
            g.moveTo(e.a[0], e.a[1]);
            g.bezierCurveTo(e.c1[0], e.c1[1], e.c2[0], e.c2[1], e.b[0], e.b[1]);
            g.stroke();
            arrow(e);
          }
          g.restore();
          const size = Math.max(10, Math.min(20, 0.05 * cam.k));
          spec.nodes.forEach((n, i) => {
            const r = noteRect(i);
            sticky(r.x, r.y, r.w, r.h, noteCols[i], n.label, 0, size);
            for (const kind of ['in', 'out']) {
              const [x, y] = toS(portOf(i, kind));
              const on = hover && hover.port === `${i}:${kind}`;
              g.beginPath();
              g.arc(x, y, portR() + (on ? 2 : 0), 0, 2 * Math.PI);
              g.fillStyle = on ? col.accent : col.panel;
              g.fill();
              g.lineWidth = 2;
              g.strokeStyle = on ? col.accent : col.fg;
              g.stroke();
            }
          });
          for (const { i, j, e } of edges) {
            const on = hover && hover.edge === `${i}>${j}`;
            g.save();
            g.globalAlpha = on ? 1 : 0.35;
            g.beginPath();
            g.arc(e.mid[0], e.mid[1], 8, 0, 2 * Math.PI);
            g.fillStyle = on ? '#e03131' : col.panel;
            g.fill();
            g.lineWidth = 1.5;
            g.strokeStyle = on ? '#e03131' : col.muted;
            g.stroke();
            g.beginPath();
            g.moveTo(e.mid[0] - 3.5, e.mid[1] - 3.5);
            g.lineTo(e.mid[0] + 3.5, e.mid[1] + 3.5);
            g.moveTo(e.mid[0] + 3.5, e.mid[1] - 3.5);
            g.lineTo(e.mid[0] - 3.5, e.mid[1] + 3.5);
            g.strokeStyle = on ? '#fff' : col.fg;
            g.stroke();
            g.restore();
          }
          if (live && live.kind === 'link') {
            g.save();
            g.setLineDash([6, 5]);
            g.lineWidth = 2;
            g.strokeStyle = col.accent;
            g.beginPath();
            g.moveTo(live.from[0], live.from[1]);
            g.lineTo(live.cur[0], live.cur[1]);
            g.stroke();
            g.restore();
          }
        }

        // ---- model updates
        function up(m) {
          ctx.update(m);
          sync(ctx.model);
        }
        let hand = false;
        function sync(m) {
          for (const t of Object.keys(btn)) {
            const on = t === 'hand' ? hand : !hand && (v === 'tool' || v === 'erase' ? m.tool === t : true);
            btn[t].setAttribute('aria-pressed', String(on));
          }
          if (ctl.undo) ctl.undo.disabled = v === 'tool' ? !(m.items || []).length : v === 'erase' ? !(m.ops || []).length : !(m.strokes || []).length;
          if (ctl.clear) ctl.clear.disabled = !(m.strokes || []).length;
          canvas.style.cursor = hand ? 'grab' : v === 'connect' ? 'default' : v === 'erase' && m.tool === 'eraser' ? 'cell' : 'crosshair';
          paint();
        }
        const undo = () => {
          const m = ctx.model;
          if (v === 'tool') { if (m.items.length) up({ ...m, items: m.items.slice(0, -1) }); return; }
          if (v === 'multi') { if (m.strokes.length) up({ strokes: m.strokes.slice(0, -1) }); return; }
          const op = m.ops[m.ops.length - 1];
          if (!op) return;
          const ops = m.ops.slice(0, -1);
          if (op[0] === 'e') up({ ...m, ops, erased: m.erased.filter((i) => i !== op[1]) });
          else up({ ...m, ops, drawn: m.drawn.slice(0, -1) });
        };
        btn.hand.addEventListener('click', () => { hand = !hand; ctx.log('tool', { tool: hand ? 'hand' : 'off' }); sync(ctx.model); });
        for (const t of tools) {
          btn[t].addEventListener('click', () => {
            hand = false;
            ctx.log('tool', { tool: t });
            if (v === 'tool' || v === 'erase') up({ ...ctx.model, tool: t });
            else sync(ctx.model);
          });
        }
        if (ctl.undo) ctl.undo.addEventListener('click', undo);
        if (ctl.clear) ctl.clear.addEventListener('click', () => { if (ctx.model.strokes.length) up({ strokes: [] }); });
        if (spec.keys && (v === 'tool' || v === 'erase')) {
          S.cbKey = (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); undo(); return; }
            if (e.ctrlKey || e.metaKey) return;
            const t = tools.find((k) => fam.helpers.TOOL_KEYS[k] === e.key.toLowerCase());
            if (t) { hand = false; up({ ...ctx.model, tool: t }); }
          };
        }
        function zoomBy(f) {
          const kmin = k0 * 0.45;
          const kmax = k0 * 2.6;
          const nk = Math.min(kmax, Math.max(kmin, cam.k * f));
          const c = [(free.x + free.r) / 2, (free.y + free.b) / 2];
          const w = toB(c);
          cam.k = nk;
          cam.x = c[0] - w[0] * nk;
          cam.y = c[1] - w[1] * nk;
          ctx.log('zoom', { pct: Math.round((nk / K100) * 100) });
          paint();
        }
        zIn.addEventListener('click', () => zoomBy(1.25));
        zOut.addEventListener('click', () => zoomBy(0.8));
        zFit.addEventListener('click', () => { fit(0.92, 0.5, 0.5); ctx.log('zoom', { fit: true }); paint(); });

        // ---- hit testing
        const near = (a, b, r) => Math.hypot(a[0] - b[0], a[1] - b[1]) <= r;
        function portAt(s) {
          for (let i = spec.nodes.length - 1; i >= 0; i--) {
            for (const kind of ['out', 'in']) if (near(toS(portOf(i, kind)), s, portR() + 5)) return { i, kind };
          }
          return null;
        }
        function edgeHandleAt(s) {
          for (const [i, j] of ctx.model.edges || []) if (near(edgeGeom(i, j).mid, s, 10)) return [i, j];
          return null;
        }
        function edgeNear(s) {
          for (const [i, j] of ctx.model.edges || []) {
            const e = edgeGeom(i, j);
            for (let t = 0; t <= 1.0001; t += 1 / 24) if (near(e.at(t), s, 7)) return [i, j];
          }
          return null;
        }
        function noteAt(s) {
          for (let i = spec.nodes.length - 1; i >= 0; i--) {
            const r = noteRect(i);
            const pad = portR() + 4;
            if (s[0] >= r.x - pad && s[0] <= r.x + r.w + pad && s[1] >= r.y && s[1] <= r.y + r.h) return i;
          }
          return -1;
        }
        // erase: a doodle within 10 px of p (board units through the camera)
        let erasedNow = 0;
        function eraseAt(points) {
          const R = 10 / cam.k;
          let m = ctx.model;
          let changed = false;
          for (; erasedNow < points.length; erasedNow++) {
            const p = points[erasedNow];
            spec.strokes.forEach((s, i) => {
              if (m.erased.includes(i)) return;
              for (let k = 1; k < s.pts.length; k++) {
                const a = s.pts[k - 1];
                const b = s.pts[k];
                const ab = [b[0] - a[0], b[1] - a[1]];
                const l2 = ab[0] * ab[0] + ab[1] * ab[1];
                const t = l2 ? Math.max(0, Math.min(1, ((p[0] - a[0]) * ab[0] + (p[1] - a[1]) * ab[1]) / l2)) : 0;
                if (Math.hypot(p[0] - a[0] - t * ab[0], p[1] - a[1] - t * ab[1]) <= R) {
                  m = { ...m, erased: m.erased.concat([i]), ops: m.ops.concat([['e', i]]) };
                  changed = true;
                  ctx.log('erase', { stroke: i });
                  return;
                }
              }
            });
          }
          if (changed) up(m);
        }

        // ---- pointer
        let drag = null;
        function inkLive() {
          const pts = live.pts.slice();
          if (v === 'line' || v === 'circle' || v === 'trace' || v === 'multi') ctx.update({ strokes: live.base.concat([pts]) });
          else if (v === 'erase' && ctx.model.tool === 'eraser') { eraseAt(live.pts); return; }
          paint();
        }
        function inkEnd() {
          const pts = live.pts.slice();
          const kind = v;
          live = null;
          ctx.log('stroke', { phase: 'end', points: pts.length });
          if (kind === 'line' || kind === 'circle' || kind === 'trace' || kind === 'multi') up({ strokes: ctx.model.strokes.slice(0, -1).concat([pts]) });
          else if (kind === 'tool') {
            const it = fam.helpers.itemFromStroke(ctx.model.tool, pts);
            if (it) up({ ...ctx.model, items: ctx.model.items.concat([it]) });
            else paint();
          } else if (kind === 'erase') {
            if (ctx.model.tool === 'eraser') { eraseAt(pts); erasedNow = 0; paint(); return; }
            erasedNow = 0;
            if (pts.length >= 2) up({ ...ctx.model, drawn: ctx.model.drawn.concat([pts]), ops: ctx.model.ops.concat([['d']]) });
            else paint();
          }
        }
        const onDown = (e) => {
          if (drag) return;
          const s = local(e);
          if (e.button === 1 || (e.button === 0 && hand)) {
            e.preventDefault();
            drag = { kind: 'pan', s0: s, c0: { ...cam } };
            canvas.style.cursor = 'grabbing';
          } else if (e.button === 0) {
            if (v === 'connect') {
              const p = portAt(s);
              const del = !p && edgeHandleAt(s);
              if (p) {
                drag = { kind: 'link', i: p.i, port: p.kind };
                live = { kind: 'link', from: toS(portOf(p.i, p.kind)), cur: s };
              } else if (del) drag = { kind: 'del', edge: del, s0: s };
              else if (noteAt(s) < 0) drag = { kind: 'pan', s0: s, c0: { ...cam } };
              else return;
            } else {
              const p = clampB(toB(s));
              drag = { kind: 'ink', last: s };
              live = { kind: 'ink', pts: [p], base: (ctx.model.strokes || []).slice() };
              erasedNow = 0;
              ctx.log('stroke', { phase: 'start' });
              inkLive();
            }
          } else return;
          canvas.setPointerCapture(e.pointerId);
        };
        const onMove = (e) => {
          const s = local(e);
          if (!drag) {
            if (v !== 'connect') return;
            const p = portAt(s);
            const ed = !p && (edgeHandleAt(s) || edgeNear(s));
            const h = p ? { port: `${p.i}:${p.kind}` } : ed ? { edge: `${ed[0]}>${ed[1]}` } : null;
            if (JSON.stringify(h) !== JSON.stringify(hover)) { hover = h; paint(); }
            canvas.style.cursor = hand ? 'grab' : p ? 'crosshair' : ed && edgeHandleAt(s) ? 'pointer' : 'default';
            return;
          }
          if (drag.kind === 'pan') {
            cam.x = drag.c0.x + s[0] - drag.s0[0];
            cam.y = drag.c0.y + s[1] - drag.s0[1];
            paint();
          } else if (drag.kind === 'link') {
            live.cur = s;
            paint();
          } else if (drag.kind === 'ink') {
            const evs = (e.getCoalescedEvents && e.getCoalescedEvents()) || [];
            let added = false;
            for (const ce of evs.length ? evs : [e]) {
              const q = local(ce);
              if (Math.hypot(q[0] - drag.last[0], q[1] - drag.last[1]) < 1) continue;
              drag.last = q;
              live.pts.push(clampB(toB(q)));
              added = true;
            }
            if (added) inkLive();
          }
        };
        const onUp = (e) => {
          if (!drag) return;
          const d = drag;
          drag = null;
          const s = local(e);
          try { canvas.releasePointerCapture(e.pointerId); } catch (err) { /* already released */ }
          if (d.kind === 'pan') {
            if (s[0] !== d.s0[0] || s[1] !== d.s0[1]) ctx.log('pan', { dx: Math.round(s[0] - d.s0[0]), dy: Math.round(s[1] - d.s0[1]) });
            sync(ctx.model);
          } else if (d.kind === 'link') {
            live = null;
            const j = noteAt(s);
            if (j >= 0 && j !== d.i) {
              const edge = d.port === 'out' ? [d.i, j] : [j, d.i];
              const m = ctx.model;
              if (!m.edges.some((f) => f[0] === edge[0] && f[1] === edge[1])) {
                ctx.log('connect', { from: edge[0], to: edge[1] });
                up({ ...m, edges: m.edges.concat([edge]) });
                return;
              }
            }
            paint();
          } else if (d.kind === 'del') {
            const [i, j] = d.edge;
            if (near(edgeGeom(i, j).mid, s, 10)) {
              ctx.log('disconnect', { from: i, to: j });
              hover = null;
              up({ ...ctx.model, edges: ctx.model.edges.filter((f) => !(f[0] === i && f[1] === j)) });
            }
          } else if (d.kind === 'ink') {
            const p = clampB(toB(s));
            const l = live.pts[live.pts.length - 1];
            if (p[0] !== l[0] || p[1] !== l[1]) live.pts.push(p);
            inkEnd();
          }
        };
        canvas.addEventListener('pointerdown', onDown);
        canvas.addEventListener('pointermove', onMove);
        canvas.addEventListener('pointerup', onUp);
        canvas.addEventListener('pointercancel', onUp);
        canvas.addEventListener('auxclick', (e) => e.preventDefault());
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        sync(ctx.model);

        S.cbView = {
          locate(t) {
            if (t.point) return vp(toS(t.point));
            if (t.tool) return btn[t.tool] ? env.util.center(btn[t.tool]) : null;
            if (t.control) return ctl[t.control] ? env.util.center(ctl[t.control]) : null;
            if (t.port) return vp(toS(portOf(t.port[0], t.port[1])));
            if (t.edgeDel) {
              const [i, j] = t.edgeDel;
              return (ctx.model.edges || []).some((e) => e[0] === i && e[1] === j) ? vp(edgeGeom(i, j).mid) : null;
            }
            if (t.grab !== undefined) return vp(toS(spec.strokes[t.grab].grab));
            return null;
          },
        };
        return { anchors: [canvas], sync };
      },
    },
  },
});
