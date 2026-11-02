// Design on templates/sort-into-bins/base.js: the base site's sort-into-bins widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-palette-02',
  name: 'design',
  split: 'train',
  scenarios: ['palette'],
  template: 'sort-into-bins/base',
  design: {
    parts: {
      '+0.paletteRect': (base, S) => ({ paletteRect: () => ({ x: S.geo.W * .405, y: S.geo.H * .075, w: S.geo.W * .525, h: S.geo.H * .81 }) }.paletteRect),
      '+0.paletteSize': (base, S) => () => Math.min(S.geo.W * .12 * .72, S.geo.H * .245 * .72),
      '+0.palettePoint': (base, S) => {
        const { paletteRect } = S;
        return { palettePoint: (p) => {
          if (S.spec.scenario !== 'palette') return [p[0] * S.geo.W, p[1] * S.geo.H];
          const pal = S.spec.pal;
          if (p[0] >= pal.x && p[0] <= pal.x + pal.w && p[1] >= pal.y && p[1] <= pal.y + pal.h) {
            return [S.geo.W * (.025 + (p[0] - pal.x) / pal.w * .26), S.geo.H * (.05 + (p[1] - pal.y) / pal.h * .84)];
          }
          const f = S.spec.frame, r = paletteRect();
          return [r.x + (p[0] - f.x) / f.w * r.w, r.y + (p[1] - f.y) / f.h * r.h];
        } }.palettePoint;
      },
      '+0.paletteModel': (base, S) => {
        const { paletteRect } = S;
        return { paletteModel: (q) => {
          if (q[0] >= S.geo.W * .025 && q[0] <= S.geo.W * .285 && q[1] >= S.geo.H * .05 && q[1] <= S.geo.H * .89) {
            const pal = S.spec.pal;
            return [pal.x + (q[0] / S.geo.W - .025) / .26 * pal.w, pal.y + (q[1] / S.geo.H - .05) / .84 * pal.h];
          }
          const f = S.spec.frame, r = paletteRect();
          return [f.x + (q[0] - r.x) / r.w * f.w, f.y + (q[1] - r.y) / r.h * f.h];
        } }.paletteModel;
      },
      'toPx': (base, S) => {
        const { palettePoint, paletteSize } = S;
        return { toPx: (p) => {
          if (S.spec.scenario === 'palette') { const q = palettePoint(p), half = paletteSize() / 2; return [q[0] - half, q[1] - half]; }
          return [(p[0] - S.spec.item.w / 2) * S.geo.W, (p[1] - S.spec.item.h / 2) * S.geo.H];
        } }.toPx;
      },
      'toModel': (base, S) => {
        const { paletteModel, paletteSize } = S;
        return { toModel: (q) => S.spec.scenario === 'palette'
          ? paletteModel([q[0] + paletteSize() / 2, q[1] + paletteSize() / 2])
          : [q[0] / S.geo.W + S.spec.item.w / 2, q[1] / S.geo.H + S.spec.item.h / 2] }.toModel;
      },
      'renderPalette': (base, S) => function renderPalette(ctx) {
        const { els, env, shapeSvg, toModel, toPx } = S;
        const { rng, util } = ctx;
        if (rng.bool(0.6)) {
          S.board.classList.add('dots');
          S.board.style.backgroundSize = `${rng.int(16, 24)}px ${rng.int(16, 24)}px`;
        }
        const pal = util.el('div', 'bx-pal', S.board);
        Object.assign(pal.style, { left: '2.5%', top: '5%', width: '26%', height: '84%' });
        rng.pick(['Shapes', 'Palette', 'Library']);
        util.el('h4', '', pal, 'Shape Palette');
        const frame = util.el('div', 'bx-frame', S.board);
        Object.assign(frame.style, { left: '40.5%', top: '7.5%', width: '52.5%', height: '81%' });
        rng.pick(['Frame', 'Drop zone', 'Artboard', 'Canvas area']);
        util.el('span', '', frame, 'Frame');
        const tileW = S.geo.W * .12, tileH = S.geo.H * .245;
        const px = S.paletteSize();
        const templatePoint = (t) => {
          const col = t % 2, row = Math.floor(t / 2), rows = Math.ceil(S.spec.templates.length / 2);
          return [S.geo.W * (.025 + (col + .5) * .13), S.geo.H * (.05 + (row + .5) * .84 / rows)];
        };
        const tpls = [];
        S.spec.templates.forEach((tp, t) => {
          const el = util.el('div', 'bx-tpl', pal.parentNode);
          el.dataset.role = 'template';
          const [cx, cy] = templatePoint(t);
          Object.assign(el.style, { left: (cx - tileW / 2) + 'px', top: (cy - tileH / 2) + 'px', width: tileW + 'px', height: tileH + 'px' });
          el.dataset.templateCenter = `${cx},${cy}`;
          el.style.setProperty('--shape-size', px + 'px');
          el.innerHTML = shapeSvg(ctx.content, tp);
          el.title = `${tp.color} ${tp.shape}`;
          tpls.push(el);
          let ghost = null;
          let g0;
          env.ui.track(el, {
            start() {
              ghost = util.el('div', 'bx-ghost', S.board);
              ghost.innerHTML = shapeSvg(ctx.content, tp);
              g0 = [cx - px / 2, cy - px / 2];
              Object.assign(ghost.style, { width: px + 'px', height: px + 'px', left: g0[0] + 'px', top: g0[1] + 'px' });
            },
            move(p) {
              Object.assign(ghost.style, { left: g0[0] + p.dx + 'px', top: g0[1] + p.dy + 'px' });
            },
            end(p) {
              const center = toModel([g0[0] + p.dx, g0[1] + p.dy]);
              ghost.remove();
              ghost = null;
              if (p.dx === 0 && p.dy === 0) return;
              const m = env.taskDef.helpers.paletteDrop(S.spec, ctx.model, { template: t }, center);
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
              const tp = S.spec.templates[p.t];
              const el = util.el('div', 'bx-item', S.board);
              el.dataset.role = 'item';
              el.title = `${tp.color} ${tp.shape}`;
              Object.assign(el.style, { width: px + 'px', height: px + 'px', zIndex: String(10 + Number(p.id.slice(1))) });
              el.innerHTML = shapeSvg(ctx.content, tp);
              let q0;
              const h = env.ui.draggable(el, {
                frame: S.board,
                value: toPx(p.pos),
                bounds: { x0: 0, y0: 0, x1: S.geo.W - px, y1: S.geo.H - px },
                label: 'item',
                onStart(q) { q0 = q; el.classList.add('dragging'); },
                onChange(q) {
                  el.classList.remove('dragging');
                  if (q[0] === q0[0] && q[1] === q0[1]) return;
                  ctx.update(env.taskDef.helpers.paletteDrop(S.spec, ctx.model, { item: p.id }, toModel(q)));
                  sync();
                },
              });
              placed[p.id] = { el, h };
            }
            placed[p.id].h.set(toPx(p.pos));
          }
        }
        sync();
        Object.assign(els, { tpls, placed, pal, sync });
      },
      'render@0': (base, S) => function render(ctx, mode) {
        const { els, ensureStyle, mirrorView, renderBoxes, renderDesk, renderPalette, renderPane } = S;
        ensureStyle();
        const { rng, util, size } = ctx;
        S.spec = ctx.spec;
        S.ctxRef = ctx;
        S.paneEl = null;
        S.outerEl = null;
        S.thumbEl = null;
        for (const k of Object.keys(els)) delete els[k];
        if (mode.pane) renderPane(ctx);
        else {
          const H = Math.floor(Math.min(size.height - 40, (size.width - 72) / S.spec.aspect) * rng.float(0.86, 1));
          S.geo = S.spec.scenario === 'palette'
            ? { W: Math.max(1, size.width - 36), H: Math.max(1, size.height - 34) }
            : { H, W: Math.round(H * S.spec.aspect) };
          S.board = util.el('div', 'bx-board', ctx.stage);
          S.board.dataset.role = 'board';
          Object.assign(S.board.style, { width: S.geo.W + 'px', height: S.geo.H + 'px', margin: `${rng.int(4, 12)}px ${rng.int(6, 24)}px` });
        }
        if (S.spec.scenario === 'desk') renderDesk(ctx);
        else if (S.spec.scenario === 'palette') renderPalette(ctx);
        else renderBoxes(ctx, mode);
        if (mode.pane) mirrorView(ctx);
        return { anchors: [S.outerEl || S.board] };
      },
      'locate': (base, S) => function locate(t) {
        const { els, env, palettePoint, thumbTop } = S;
        const r = S.board.getBoundingClientRect();
        const at = (p) => { const q = palettePoint(p); return [r.left + q[0], r.top + q[1]]; };
        if (t.pane !== undefined) {
          const pr = S.paneEl.getBoundingClientRect();
          return [pr.left + pr.width / 2, pr.top + pr.height / 2];
        }
        if (t.thumb !== undefined) return S.ctxRef.util.center(S.thumbEl);
        if (t.thumbAt !== undefined) {
          const pr = S.paneEl.getBoundingClientRect();
          const t0 = S.thumbEl.getBoundingClientRect();
          const s = Math.max(0, Math.min(S.paneGeo.max, t.thumbAt * S.geo.H));
          return [t0.left + t0.width / 2, pr.top + thumbTop(s) + S.paneGeo.thumbH / 2];
        }
        if (t.point !== undefined) return at(t.point);
        if (t.item !== undefined) {
          if (els.items) return S.ctxRef.util.center(els.items[t.item]);
          if (els.files) return S.ctxRef.util.center(els.files[t.item]);
          return S.ctxRef.util.center(els.placed[t.item].el);
        }
        if (t.folder !== undefined) {
          const d = S.spec.folders.find((x) => x.id === t.folder);
          return at([d.x + d.w / 2, d.y + d.h * 0.4]);
        }
        if (t.close !== undefined) return S.ctxRef.util.center(els.close);
        if (t.template !== undefined && S.spec.scenario === 'palette') {
          const el = els.tpls[t.template], [x, y] = el.dataset.templateCenter.split(',').map(Number);
          return [r.left + x, r.top + y];
        }
        if (t.template !== undefined) return at(env.taskDef.helpers.palSlot(S.spec, t.template));
        if (t.trash !== undefined) return at([S.spec.pal.x + S.spec.pal.w / 2, S.spec.pal.y + S.spec.pal.h / 2]);
        throw new Error(`sort-into-bins/boxes cannot locate ${JSON.stringify(t)}`);
      },
    },
  },
});
