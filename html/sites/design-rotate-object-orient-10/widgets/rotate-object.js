// Point mode adds a compass, a centered drag grip and its arrow pointer.
env.widget({
  task: 'rotate-object', site: 'design-rotate-object-orient-10', name: 'design', split: 'train',
  scenarios: ['orient'],
  template: 'rotate-object/orient',
  design: {
    modeClass: null,
    shapes: {
      arrow: ['M0,-48 L32,-10 L12,-10 L12,48 L-12,48 L-12,-10 L-32,-10 Z', 32, 48],
      ell: ['M-42,-48 H-12 V18 H42 V48 H-42 Z', 42, 48],
    },
    parts: {
      fit: () => (ctx) => Math.floor(Math.min(900, ctx.size.height * 0.88, ctx.size.width * 0.64)) - 6,
      shapeScale: () => (ctx, g, B) => B / 100,
      handleRadius: () => (ctx, g) => Math.round(g.top + ctx.rng.int(26, 36)),
      frame: (base, S) => (ctx, g) => {
        const { util, rng, spec, content } = ctx;
        const C = S.P.fit(ctx, g);
        const half = C / 2;
        const B = rng.int(110, 150);
        const k = S.P.shapeScale(ctx, g, B, C);
        const [d, hw, hh] = S.P.shapePaths()[spec.shape];
        const color = content.COLORS[spec.color];
        const selPad = 8;
        const top = hh * k + selPad;
        Object.assign(g, { C, half, B, k, d, hw, hh, color, selPad, top });
        const Rh = S.P.handleRadius(ctx, g);
        const card = util.el('div', spec.mode === 'point' ? 'rot-card point-mode' : 'rot-card', ctx.stage);
        const svg = S.P.sv('svg', { class: 'rot-svg rot-canvas', width: C, height: C, viewBox: `${-half} ${-half} ${C} ${C}` }, card);
        svg.dataset.role = 'canvas';
        return { Rh, card, svg };
      },
      heading: (base, S) => (ctx, g) => {
        const { rng, spec } = ctx;
        const { half, svg } = g;
        if (spec.mode === 'heading' && rng.bool(0.6)) {
          const Rr = half - 30;
          for (let a = 0; a < 360; a += 5) {
            const major = a % 45 === 0;
            const [x0, y0] = S.P.polar([0, 0], Rr, a);
            const [x1, y1] = S.P.polar([0, 0], Rr - (major ? 14 : a % 15 === 0 ? 9 : 5), a);
            S.P.sv('line', { class: major ? 'major' : 'minor', x1: x0, y1: y0, x2: x1, y2: y1, opacity: major ? 0.6 : 0.8 }, svg);
            if (major) {
              const [tx, ty] = S.P.polar([0, 0], Rr + 14, a);
              const t = S.P.sv('text', { x: tx, y: ty, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, svg);
              t.textContent = `${a}°`;
              t.style.fontSize = '11px';
            }
          }
        }
      },
      point: (base, S) => (ctx, g) => {
        const { spec } = ctx;
        if (spec.mode !== 'point') return base(ctx, g);
        const P = S.P;
        const { half, svg } = g;
        const Rr = half - 34;
        P.sv('circle', { r: Rr, fill: 'none', stroke: '#606c77', 'stroke-width': 2.5 }, svg);
        P.sv('line', { x1: 0, y1: -Rr, x2: 0, y2: Rr, stroke: '#64717e', 'stroke-width': 1.5, 'stroke-dasharray': '6 6' }, svg);
        P.sv('line', { x1: -Rr, y1: 0, x2: Rr, y2: 0, stroke: '#64717e', 'stroke-width': 1.5, 'stroke-dasharray': '6 6' }, svg);
        for (let a = 0; a < 360; a += 7.5) {
          const major = a % 90 === 0;
          const [x0, y0] = P.polar([0, 0], Rr, a);
          const [x1, y1] = P.polar([0, 0], Rr - (major ? 32 : a % 30 === 0 ? 32 : 17), a);
          P.sv('line', { x1: x0, y1: y0, x2: x1, y2: y1, stroke: major ? '#9aa4b1' : '#6b7480', 'stroke-width': major ? 4 : 2 }, svg);
        }
        [['N', 0, -Rr - 28], ['E', Rr + 28, 0], ['S', 0, Rr + 30], ['W', -Rr - 28, 0]].forEach(([label, x, y]) => {
          const t = P.sv('text', { x, y, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, svg);
          t.textContent = label;
          t.style.fill = '#9aa4b1';
        });
        const [sx, sy] = P.polar([0, 0], Rr * 0.73, spec.target);
        P.sv('path', { d: P.starPath(19, 8, 5), transform: `translate(${sx.toFixed(2)},${sy.toFixed(2)})`, fill: '#f2c200', stroke: '#8a6d00', 'stroke-width': 1.5 }, svg);
      },
      shape: (base, S) => (ctx, g) => {
        if (ctx.spec.mode !== 'point' || ctx.spec.shape !== 'arrow') return base(ctx, g);
        const { half, k, color, sel } = g;
        const P = S.P;
        const pointerLength = (half - 34) * 0.615;
        const d = `M0,0 H5 V${-pointerLength + 48} H25 L0,${-pointerLength} L-25,${-pointerLength + 48} H-5 V0 Z`;
        P.sv('path', { d, transform: '', fill: color, stroke: 'rgba(0,0,0,.35)', 'stroke-width': 1.5 / k }, sel);
      },
      handle: (base, S) => (ctx, g) => {
        const { top, Rh, sel } = g;
        const P = S.P;
        const stem = P.sv('line', { x1: 0, y1: -top, x2: 0, y2: -Rh + 9, stroke: 'var(--accent)', 'stroke-width': 1.5 }, sel);
        if (ctx.spec.mode === 'point') stem.style.display = 'none';
        const point = ctx.spec.mode === 'point';
        const handle = P.sv('circle', { class: 'rot-handle', cx: 0, cy: point ? 0 : -Rh, r: point ? 15 : 9, fill: 'var(--panel)', stroke: 'var(--accent)', 'stroke-width': 2.5 }, sel);
        handle.dataset.role = 'handle';
        P.sv('circle', { r: point ? 6 : 3, fill: 'var(--accent)', 'pointer-events': 'none' }, sel);
        return { handle };
      },
      rotate: (base, S) => (ctx, g) => {
        const { spec } = ctx;
        let rot;
        if (spec.mode === 'point') {
          const fam = env.taskDef;
          const { handle, svg, sel, Rh, paint } = g;
          const set = (angle) => sel.setAttribute('transform', `rotate(${angle.toFixed(3)})`);
          let dragging = false;
          handle.addEventListener('pointerdown', (event) => {
            dragging = true;
            handle.setPointerCapture(event.pointerId);
            event.preventDefault();
          });
          handle.addEventListener('pointermove', (event) => {
            if (!dragging) return;
            const [cx, cy] = S.P.centerOf(svg);
            if (Math.hypot(event.clientX - cx, event.clientY - cy) < 3) return;
            const angle = fam.helpers.mod360(Math.atan2(event.clientX - cx, cy - event.clientY) * S.R2D);
            set(angle);
            ctx.update({ angle });
            paint();
          });
          handle.addEventListener('pointerup', () => { dragging = false; });
          handle.addEventListener('pointercancel', () => { dragging = false; });
          set(ctx.model.angle);
          rot = { set, locateHandle: () => S.P.centerOf(svg), locate: (a) => S.P.polar(S.P.centerOf(svg), Rh, a) };
        } else {
          rot = base(ctx, g).rot;
        }
        const initialAngle = ctx.model.angle;
        const reset = document.querySelector('[data-action="reset"]');
        if (reset) reset.onclick = () => {
          rot.set(initialAngle);
          ctx.update({ angle: initialAngle });
          g.paint();
        };
        return { rot };
      },
    },
  },
});
