// Design on templates/draw-shape/base.js: the base site's draw-shape widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-signature-03',
  name: 'design',
  split: 'train',
  scenarios: ['signature'],
  template: 'draw-shape/base',
  design: {
    parts: {
      'buildSignature': (base, S) => function buildSignature(B) {
        const { button, env, fmtPx, wrap } = S;
        const { ctx, svg, px, W, H, scale } = B;
        const { util, rng, spec } = ctx;
        const fam = env.taskDef;
        util.svg('rect', { x: 0, y: 0, width: W, height: H, fill: rng.pick(['#fffdf8', '#ffffff', '#fbfbfa']) }, svg);
        const ink = rng.pick(['#1d3a8a', '#16181d', '#123f6b']);
        // Document text above the field (pointer-events none on text).
        const mx = 0;
        const box = spec.box;
        const [bx, by] = px([box.x, box.y]);
        const bw = box.w * B.scaleX;
        const bh = box.h * B.scaleY;
        util.svg('text', { x: mx, y: 0.1 * scale - 35, class: 'dw-doc t' }, svg).textContent = spec.doc.title;
        const maxChars = Math.max(20, Math.floor((W - 2 * mx) / 6.6));
        let y = 0.1 * scale + 15;
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
        util.svg('line', { x1: bx + 24, y1: by + bh * 0.78, x2: bx + bw - 24, y2: by + bh * 0.78, stroke: '#9a9a9a', 'stroke-width': 1.2 }, svg);
        util.svg('text', { x: bx + 24, y: by + bh * 0.78 - 6, class: 'dw-doc', style: 'font-size:18px;fill:#9a9a9a' }, svg).textContent = '✕';
        util.svg('text', { x: bx + 24, y: by + 24, class: 'dw-small', style: 'fill:#8a6d00' }, svg).textContent = rng.pick(['Sign here', 'Signature', 'Sign below']);
        const nameY = by + bh * 0.92;
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
        const toolStrip = util.el('div', 'dw-sign-tools', B.foot);
        for (const kind of ['pen', 'eraser', 'marquee']) {
          const icon = util.el('span', 'dw-tool-icon', toolStrip);
          const svgIcon = util.svg('svg', { width: 32, height: 32, viewBox: '0 0 32 32', 'aria-hidden': 'true' }, icon);
          if (kind === 'pen') {
            util.svg('path', { d: 'M5 25L9 17L22 4L28 10L15 23L7 27Z M9 17L15 23 M22 4L28 10', fill: '#76b8e7', stroke: '#111', 'stroke-width': 1.8, 'stroke-linejoin': 'round' }, svgIcon);
          } else if (kind === 'eraser') {
            util.svg('path', { d: 'M5 19L17 6Q19 4 21 6L27 12Q29 14 27 16L17 26H11Z M12 26L20 17', fill: '#ececec', stroke: '#111', 'stroke-width': 1.8, 'stroke-linejoin': 'round' }, svgIcon);
          } else {
            util.svg('rect', { x: 5, y: 5, width: 22, height: 22, fill: 'none', stroke: '#111', 'stroke-width': 2, 'stroke-dasharray': '4 3' }, svgIcon);
          }
        }
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
          const H = Math.max(120, Math.floor(Math.min(fit, rng.int(400, 600))));
          const scale = H / spec.board.h;
          const W = foot ? Math.floor(size.width * 0.89) : Math.round(spec.board.w * scale);
          const scaleX = foot ? W * 0.87 / spec.box.w : scale;
          const offsetX = foot ? -spec.box.x * scaleX : 0;
          const scaleY = foot ? scale * 1.9 : scale;
          const offsetY = foot ? spec.box.y * scale - 57 - spec.box.y * scaleY : 0;

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
          const svg = util.svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'none' }, boardEl);
          svg.dataset.role = 'board';
          if (atlas) util.el('div', 'dw-attrib', wrap, 'Map data © contributors');
          const footEl = foot ? util.el('div', 'dw-foot', wrap) : null;
          const hintEl = util.el('div', 'dw-hint', wrap);
          const px = (p) => [offsetX + p[0] * scaleX, offsetY + p[1] * scaleY];
          const toBoard = ([x, y]) => {
            const r = svg.getBoundingClientRect();
            return [Math.round((((x - r.left) * W / r.width - offsetX) / scaleX) * 1e4) / 1e4, Math.round((((y - r.top) * H / r.height - offsetY) / scaleY) * 1e4) / 1e4];
          };
          const frame = {
            toBoard: ([x, y]) => {
              const r = svg.getBoundingClientRect();
              return [((x - r.left) * W / r.width - offsetX) / scaleX, ((y - r.top) * H / r.height - offsetY) / scaleY];
            },
            fromBoard: ([bx, by]) => {
              const r = svg.getBoundingClientRect();
              return [r.left + (offsetX + bx * scaleX) * r.width / W, r.top + (offsetY + by * scaleY) * r.height / H];
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
            ctx: bctx, svg, px, toBoard, frame, W, H, scale, scaleX, scaleY, bar: barEl, foot: footEl, flavor,
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
          // Keep the Tools panel above the frame footer at shorter stage heights.
          if (footEl) footEl.style.top = `${Math.max(0, Math.min(size.height * 0.63, size.height - footEl.offsetHeight - 12))}px`;
          place(root, ctx, rng.fork('place'));
          S.st = { locate: (t) => (layers && layers.locate(t)) || view.locate(t) };
          return { anchors: [svg], sync: (m) => { view.sync(m); if (layers) layers.paint(); } };
      },
    },
  },
});
