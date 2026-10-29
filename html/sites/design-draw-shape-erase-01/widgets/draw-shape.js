// Design on templates/draw-shape/base.js: the base site's draw-shape widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-erase-01',
  name: 'design',
  split: 'train',
  scenarios: ['erase'],
  template: 'draw-shape/base',
  design: {
    parts: {
      'ICONS': (base, S) => ({
        pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.5-6L16.7 2.8a2 2 0 0 1 2.8 0l1.7 1.7a2 2 0 0 1 0 2.8L9 19.5Z" fill="currentColor"/><path d="m14.5 5 4.5 4.5M4.5 15 9 19.5" stroke="#fff"/></svg>',
        line: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 16L16 4"/><circle cx="4" cy="16" r="1.6" fill="currentColor"/><circle cx="16" cy="4" r="1.6" fill="currentColor"/></svg>',
        rect: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="5" width="13" height="10" rx="1"/></svg>',
        ellipse: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="10" cy="10" rx="7" ry="5"/></svg>',
        eraser: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="m3.5 14 10-10a1.6 1.6 0 0 1 2.2 0l4.8 4.8a1.6 1.6 0 0 1 0 2.2l-9 9H8.4l-4.9-3.8a1.6 1.6 0 0 1 0-2.2Z"/><path d="m11 6.5 6.5 6.5 3-3L14 3.5Z" fill="currentColor"/></svg>',
        undo: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 5L3 9l4 4"/><path d="M3 9h9a5 5 0 010 10H9"/></svg>',
        clear: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6h12M8 6V4h4v2M6 6l1 11h6l1-11"/></svg>',
        polygon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M4 7l6-4 6 5-2 8H6z"/></svg>',
      }),
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
        const width = rng.pick([4, 5, 6]) * Math.max(1, H / 320);
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
          const remaining = spec.strokes.filter((s, i) => !m.erased.includes(i));
          const count = document.querySelector('.gn-stat-strokes strong');
          const colors = document.querySelector('.gn-stat-colors strong');
          if (count) count.textContent = String(remaining.length + m.drawn.length);
          if (colors) colors.textContent = String(new Set(remaining.map(s => s.color).concat(m.drawn.length ? ['user-ink'] : [])).size);
          const thumbnail = document.querySelector('.gn-preview');
          if (thumbnail) {
            thumbnail.setAttribute('viewBox', `0 0 ${W} ${H}`);
            thumbnail.setAttribute('preserveAspectRatio', 'none');
            thumbnail.replaceChildren();
            for (const s of remaining) util.svg('polyline', { points: fmtPx(s.pts, px), fill: 'none', stroke: inks[s.color], 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, thumbnail);
            for (const s of m.drawn) util.svg('polyline', { points: fmtPx(s, px), fill: 'none', stroke: 'var(--fg)', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, thumbnail);
          }
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
          let H = Math.max(120, Math.floor(Math.min(fit, rng.int(400, 600))));
          let scale = H / spec.board.h;
          let W = Math.round(spec.board.w * scale);
          let scaleX = scale, scaleY = scale;

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
          // Fill this design's board; both coordinate directions use the same
          // mapping for drawing, pointer input, and oracle target locations.
          if (spec.scenario === 'erase') {
            const rail = barEl ? barEl.getBoundingClientRect().width : 0;
            const gap = parseFloat(getComputedStyle(wrap).columnGap) || 0;
            W = Math.max(120, Math.floor(size.width - rail - gap - 2));
            H = Math.max(120, Math.floor(size.height - 2));
            scaleX = W / spec.board.w;
            scaleY = H / spec.board.h;
            scale = Math.min(scaleX, scaleY);
          }
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
          const px = (p) => [p[0] * scaleX, p[1] * scaleY];
          const toBoard = ([x, y]) => {
            const r = svg.getBoundingClientRect();
            return [Math.round(((x - r.left) / scaleX) * 1e4) / 1e4, Math.round(((y - r.top) / scaleY) * 1e4) / 1e4];
          };
          const frame = {
            toBoard: ([x, y]) => {
              const r = svg.getBoundingClientRect();
              return [(x - r.left) / scaleX, (y - r.top) / scaleY];
            },
            fromBoard: ([bx, by]) => {
              const r = svg.getBoundingClientRect();
              return [r.left + bx * scaleX, r.top + by * scaleY];
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
    },
  },
});
