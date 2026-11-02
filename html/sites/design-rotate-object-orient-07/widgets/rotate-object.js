// This design adds the larger canvas, compass marks, dark shape and center hub grip.
env.widget({
  task: 'rotate-object', site: 'design-rotate-object-orient-07', name: 'design', split: 'train',
  scenarios: ['orient'],
  traits: { grip: 'hub' },
  template: 'rotate-object/orient',
  design: {
    modeClass: null,
    shapes: {
      arrow: ['M0,-88 L16,-53 L5,-55 L5,5 L-5,5 L-5,-55 L-16,-53 Z', 16, 88],
      ell: ['M-28,-46 H-4 V22 H30 V46 H-28 Z', 30, 46],
    },
    parts: {
      fit: () => (ctx) => Math.max(160, Math.floor(Math.min(560, ctx.size.height - 4,
        ctx.size.width - (ctx.spec.mode === 'match' ? 220 : 40)))),
      shapeScale: () => (ctx, g, B, C) => (B / 100) * Math.min(1, C / 390),
      handleRadius: () => (ctx, g) => {
        Math.round(g.top + ctx.rng.int(26, 36));
        return Math.round(g.C * 0.415);
      },
      frame: (base) => (ctx, g) => {
        const frame = base(ctx, g);
        const { card, svg } = frame;
        const { C } = g;
        card.classList.add('rot-mode-' + ctx.spec.mode);
        const offset = Math.max(0, parseFloat(getComputedStyle(card).top) || 0);
        const canvasHeight = Math.max(1, C - 2 * offset);
        const W = ctx.spec.mode === 'match' ? C : Math.max(C, ctx.size.width - 16);
        Object.assign(g, { W, canvasHeight });
        card.style.minHeight = C + 'px';
        svg.setAttribute('width', W);
        svg.setAttribute('height', canvasHeight);
        svg.setAttribute('viewBox', `${-W / 2} ${-canvasHeight / 2} ${W} ${canvasHeight}`);
        return frame;
      },
      heading: (base, S) => (ctx, g) => {
        const { C, Rh, svg } = g;
        const { rng, spec } = ctx;
        if (spec.mode === 'heading' && rng.bool(0.6)) {
          const Rr = g.half - 30;
          for (let a = 0; a < 360; a += 5) {
            const major = a % 45 === 0;
            const [x0, y0] = S.P.polar([0, 0], Rr, a);
            const [x1, y1] = S.P.polar([0, 0], Rr - (major ? 14 : a % 15 === 0 ? 9 : 5), a);
            S.P.sv('line', { class: major ? 'major' : 'minor', x1: x0, y1: y0, x2: x1, y2: y1,
              opacity: major ? 0.6 : 0.8 }, svg);
            if (major) {
              const [tx, ty] = S.P.polar([0, 0], Rr + 14, a);
              const t = S.P.sv('text', { x: tx, y: ty, 'text-anchor': 'middle',
                'dominant-baseline': 'central' }, svg);
              t.textContent = `${a}°`;
              t.style.fontSize = '11px';
            }
          }
        }
        const ringOffset = -C * 0.046;
        S.P.sv('circle', { cy: ringOffset, r: Rh, fill: 'none', stroke: '#4a4d4e', 'stroke-width': 2 }, svg);
        for (const a of [0, 90, 180, 270]) {
          const [x0, y0] = S.P.polar([0, 0], Rh - C * 0.058, a);
          const [x1, y1] = S.P.polar([0, 0], Rh, a);
          S.P.sv('line', { x1: x0, y1: y0 + ringOffset, x2: x1, y2: y1 + ringOffset,
            stroke: '#4a4d4e', 'stroke-width': 2 }, svg);
        }
      },
      point: (base, S) => (ctx, g) => {
        const { C, W, canvasHeight, svg } = g;
        if (ctx.spec.mode !== 'point') return base(ctx, g);
        const bearing = ctx.spec.target / S.R2D;
        const targetRadius = Math.min(C * 0.69,
          (W / 2 - 28) / Math.max(0.01, Math.abs(Math.sin(bearing))),
          (canvasHeight / 2 - 28) / Math.max(0.01, Math.abs(Math.cos(bearing))));
        const [sx, sy] = S.P.polar([0, 0], targetRadius, ctx.spec.target);
        S.P.sv('path', { d: S.P.starPath(C * 0.064, C * 0.027, 5),
          transform: `translate(${sx.toFixed(2)},${sy.toFixed(2)})`, fill: '#f7cb36', stroke: '#131411',
          'stroke-width': 2.5 }, svg);
      },
      shape: (base, S) => (ctx, g) => {
        S.P.sv('path', { d: g.d, transform: `scale(${g.k})`, fill: '#454747', stroke: '#454747',
          'stroke-width': 1 / g.k }, g.sel);
      },
      handle: (base, S) => (ctx, g) => {
        const { spec } = ctx;
        const { top, Rh, sel, C } = g;
        const hubGrip = spec.grip === 'hub';
        if (!hubGrip) S.P.sv('line', { x1: 0, y1: -top, x2: 0, y2: -Rh + 9,
          stroke: 'var(--accent)', 'stroke-width': 1.5 }, sel);
        const handle = S.P.sv('circle', { class: 'rot-handle', cx: 0, cy: -Rh, r: 9,
          fill: 'var(--panel)', stroke: 'var(--accent)', 'stroke-width': 2.5 }, sel);
        handle.dataset.role = 'handle';
        if (hubGrip) { handle.style.display = 'none'; handle.style.pointerEvents = 'none'; }
        const hub = S.P.sv('circle', { r: C * 0.038, fill: '#3479d1', stroke: '#e1e2dd', 'stroke-width': 2,
          'pointer-events': hubGrip ? 'auto' : 'none' }, sel);
        if (hubGrip) { hub.dataset.role = 'grip'; hub.style.cursor = 'grab'; }
        S.P.sv('circle', { r: C * 0.041, fill: 'none', stroke: '#444b50', 'stroke-width': 1.5,
          'pointer-events': 'none' }, sel);
        S.P.sv('circle', { r: C * 0.008, fill: '#d6bb73', 'pointer-events': 'none' }, sel);
        return { hubGrip, handle, hub };
      },
    },
  },
});
