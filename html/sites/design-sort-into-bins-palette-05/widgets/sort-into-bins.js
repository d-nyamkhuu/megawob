// Design on templates/sort-into-bins/base.js: the base site's sort-into-bins widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-palette-05',
  name: 'design',
  split: 'train',
  scenarios: ['palette'],
  template: 'sort-into-bins/base',
  design: {
    parts: {
      '+0.view': () => ({ x: 0, y: 0 }),
      toPx: (base, S) => (p) => [
        S.view.x + (p[0] - S.spec.item.w / 2) * S.geo.W,
        S.view.y + (p[1] - S.spec.item.h / 2) * S.geo.H,
      ],
      toModel: (base, S) => (q) => [
        (q[0] - S.view.x) / S.geo.W + S.spec.item.w / 2,
        (q[1] - S.view.y) / S.geo.H + S.spec.item.h / 2,
      ],
      locate: (base, S) => (t) => {
        if (t.template !== undefined) return S.ctxRef.util.center(S.els.tpls[t.template]);
        if (t.trash !== undefined) return S.ctxRef.util.center(S.els.pal);
        if (t.point !== undefined) {
          const r = S.board.getBoundingClientRect();
          return [r.left + S.view.x + t.point[0] * S.geo.W, r.top + S.view.y + t.point[1] * S.geo.H];
        }
        return base(t);
      },
      renderPalette: (base, S) => (ctx) => {
        const { rng, util, size } = ctx;
        // Preserve the template's random draws, including its optional grid spacing.
        if (rng.bool(0.6)) {
          S.board.classList.add('dots');
          S.board.style.backgroundSize = `${rng.int(16, 24)}px ${rng.int(16, 24)}px`;
        }
        const W = size.width, H = size.height;
        const canvasW = W * 0.808;
        const side = Math.min(canvasW * 0.47, H * 0.54);
        S.geo = { W: side / S.spec.frame.w, H: side / S.spec.frame.h };
        S.view.x = canvasW / 2 - (S.spec.frame.x + S.spec.frame.w / 2) * S.geo.W;
        S.view.y = H * 0.494 - (S.spec.frame.y + S.spec.frame.h / 2) * S.geo.H;
        Object.assign(S.board.style, { width: W + 'px', height: H + 'px', margin: '0' });
        S.board.style.setProperty('--canvas-width', canvasW + 'px');
        const pal = util.el('div', 'bx-pal', S.board);
        Object.assign(pal.style, { left: canvasW + 'px', top: '0', width: W - canvasW + 'px', height: H + 'px' });
        const heading = util.el('h4', '', pal, rng.pick(['Shapes', 'Palette', 'Library']));
        heading.textContent = 'Shapes';
        const frame = util.el('div', 'bx-frame', S.board);
        Object.assign(frame.style, { left: (canvasW - side) / 2 + 'px', top: H * 0.494 - side / 2 + 'px', width: side + 'px', height: side + 'px' });
        util.el('span', '', frame, rng.pick(['Frame', 'Drop zone', 'Artboard', 'Canvas area']));
        const px = S.spec.item.w * S.geo.W;
        const py = S.spec.item.h * S.geo.H;
        const tileW = (W - canvasW) * 0.73;
        const tileTop = H * 0.09;
        const gap = H * 0.02;
        const tileH = Math.min(H * 0.188, (H * 0.9 - gap * (S.spec.templates.length - 1)) / S.spec.templates.length);
        const tpls = [];
        S.spec.templates.forEach((tp, t) => {
          const el = util.el('div', 'bx-tpl', pal);
          el.dataset.role = 'template';
          Object.assign(el.style, { left: ((W - canvasW) - tileW) / 2 + 'px', top: tileTop + t * (tileH + gap) + 'px', width: tileW + 'px', height: tileH + 'px' });
          el.innerHTML = S.shapeSvg(ctx.content, tp);
          el.title = `${tp.color} ${tp.shape}`;
          el.style.setProperty('--tile-color', ['#fce9e9', '#e6f1ff', '#ebf7ee', '#fff6da'][t % 4]);
          tpls.push(el);
          let ghost, g0;
          S.env.ui.track(el, {
            start() {
              ghost = util.el('div', 'bx-ghost', S.board);
              ghost.innerHTML = S.shapeSvg(ctx.content, tp);
              g0 = [canvasW + ((W - canvasW) - px) / 2, tileTop + t * (tileH + gap) + (tileH - py) / 2];
              Object.assign(ghost.style, { width: px + 'px', height: py + 'px', left: g0[0] + 'px', top: g0[1] + 'px' });
            },
            move(p) { Object.assign(ghost.style, { left: g0[0] + p.dx + 'px', top: g0[1] + p.dy + 'px' }); },
            end(p) {
              const overPalette = g0[0] + p.dx + px / 2 >= canvasW;
              const center = overPalette ? [S.spec.pal.x + S.spec.pal.w / 2, S.spec.pal.y + S.spec.pal.h / 2] : S.toModel([g0[0] + p.dx, g0[1] + p.dy]);
              ghost.remove();
              if (p.dx === 0 && p.dy === 0) return;
              ctx.update(S.env.taskDef.helpers.paletteDrop(S.spec, ctx.model, { template: t }, center));
              sync();
            },
          }, 'template');
        });
        const placed = {};
        function sync() {
          const live = new Set(ctx.model.placed.map((p) => p.id));
          for (const id of Object.keys(placed)) if (!live.has(id)) { placed[id].el.remove(); delete placed[id]; }
          for (const p of ctx.model.placed) {
            if (!placed[p.id]) {
              const tp = S.spec.templates[p.t];
              const el = util.el('div', 'bx-item', S.board);
              el.dataset.role = 'item';
              el.title = `${tp.color} ${tp.shape}`;
              Object.assign(el.style, { width: px + 'px', height: py + 'px', zIndex: String(10 + Number(p.id.slice(1))) });
              el.innerHTML = S.shapeSvg(ctx.content, tp);
              let q0;
              const h = S.env.ui.draggable(el, {
                frame: S.board, value: S.toPx(p.pos),
                bounds: { x0: 0, y0: 0, x1: W - px, y1: H - py }, label: 'item',
                onStart(q) { q0 = q; el.classList.add('dragging'); },
                onChange(q) {
                  el.classList.remove('dragging');
                  if (q[0] === q0[0] && q[1] === q0[1]) return;
                  const overPalette = q[0] + px / 2 >= canvasW;
                  const dest = overPalette ? [S.spec.pal.x + S.spec.pal.w / 2, S.spec.pal.y + S.spec.pal.h / 2] : S.toModel(q);
                  ctx.update(S.env.taskDef.helpers.paletteDrop(S.spec, ctx.model, { item: p.id }, dest));
                  sync();
                },
              });
              placed[p.id] = { el, h };
            }
            placed[p.id].h.set(S.toPx(p.pos));
          }
        }
        sync();
        Object.assign(S.els, { tpls, placed, pal, sync });
      },
    },
  },
});
