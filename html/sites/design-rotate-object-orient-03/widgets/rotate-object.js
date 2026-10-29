// Ribbon workspace design: enlarged canvas, hidden selection guides and a custom palette handle.
env.widget({
  task: 'rotate-object',
  site: 'design-rotate-object-orient-03',
  name: 'design',
  split: 'train',
  scenarios: ['orient'],
  traits: { shapes: ['ell'], modes: ['match'] },
  template: 'rotate-object/orient',
  design: {
    modeClass: null,
    shapes: {
      arrow: ['M0,-48 L32,-10 L12,-10 L12,48 L-12,48 L-12,-10 L-32,-10 Z', 32, 48],
      ell: ['M-28,-46 H-4 V22 H30 V46 H-28 Z', 30, 46],
    },
    parts: {
      fit: () => (ctx) => Math.floor(Math.min(560, ctx.size.height - 65, (ctx.size.width - 40) / 2)),
      shapeScale: () => (ctx, g, B, C) => Math.min(B * 2.1, C * 0.62) / 100,
      handleRadius: () => (ctx, g) => Math.round(g.top + ctx.rng.int(26, 36)),
      grid: (base, S) => (ctx, g) => {
        const P = S.P;
        const { rng } = ctx;
        const { C, half, svg } = g;
        const gid = `rot-grid-${Math.floor(rng.next() * 1e9)}`;
        const defs = P.sv('defs', {}, svg);
        const cell = rng.pick([20, 24, 28]);
        const pat = P.sv('pattern', { id: gid, width: cell, height: cell, patternUnits: 'userSpaceOnUse', x: -half, y: -half }, defs);
        P.sv('path', { d: `M${cell},0 L0,0 0,${cell}`, fill: 'none', stroke: 'var(--line)', 'stroke-width': 1, opacity: 0.7 }, pat);
        P.sv('rect', { x: -half, y: -half, width: C, height: C, fill: `url(#${gid})`, visibility: 'hidden' }, svg);
        return { gid, defs, cell, pat };
      },
      heading: (base, S) => (ctx, g) => {
        const P = S.P;
        const { rng, spec } = ctx;
        const { half, svg } = g;
        if (spec.mode === 'heading' && rng.bool(0.6)) {
          const Rr = half - 30;
          for (let a = 0; a < 360; a += 5) {
            const major = a % 45 === 0;
            const [x0, y0] = P.polar([0, 0], Rr, a);
            const [x1, y1] = P.polar([0, 0], Rr - (major ? 14 : a % 15 === 0 ? 9 : 5), a);
            P.sv('line', { class: major ? 'major' : 'minor', x1: x0, y1: y0, x2: x1, y2: y1, opacity: major ? 0.6 : 0.8 }, svg);
            if (major) {
              const [tx, ty] = P.polar([0, 0], Rr + 14, a);
              const t = P.sv('text', { x: tx, y: ty, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, svg);
              t.textContent = `${a}°`;
              t.style.fontSize = '11px';
            }
          }
        }
      },
      point: (base, S) => (ctx, g) => {
        const P = S.P;
        const { spec } = ctx;
        const { half, svg } = g;
        if (spec.mode === 'point') {
          const [sx, sy] = P.polar([0, 0], half - 38, spec.target);
          P.sv('path', { d: P.starPath(19, 8, 5), transform: `translate(${sx.toFixed(2)},${sy.toFixed(2)})`, fill: '#f2c200', stroke: '#8a6d00', 'stroke-width': 1.5 }, svg);
        }
      },
      shape: (base, S) => (ctx, g) => {
        const P = S.P;
        const { k, d, color, sel } = g;
        P.sv('path', { d, transform: `scale(${k})`, fill: color, stroke: 'rgba(20,42,72,.85)', 'stroke-width': 2.3 / k }, sel);
      },
      selection: (base, S) => (ctx, g) => {
        const P = S.P;
        const { k, hw, selPad, top, sel } = g;
        const bx = hw * k + selPad;
        P.sv('rect', { x: -bx, y: -top, width: 2 * bx, height: 2 * top, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 1.5, 'stroke-dasharray': '5 4', visibility: 'hidden' }, sel);
        for (const [cx, cy] of [[-bx, -top], [bx, -top], [-bx, top], [bx, top]]) {
          P.sv('rect', { x: cx - 4, y: cy - 4, width: 8, height: 8, fill: 'var(--panel)', stroke: 'var(--accent)', 'stroke-width': 1.5, visibility: 'hidden' }, sel);
        }
        return { bx };
      },
      handle: (base, S) => (ctx, g) => {
        const P = S.P;
        const { top, Rh, sel } = g;
        P.sv('line', { x1: 0, y1: -top, x2: 0, y2: -Rh + 9, stroke: 'var(--accent)', 'stroke-width': 1.5 }, sel);
        const handle = P.sv('circle', { class: 'rot-handle', cx: 0, cy: -Rh, r: 20, fill: '#edf6ff', stroke: '#6793cd', 'stroke-width': 1.5 }, sel);
        handle.dataset.role = 'handle';
        P.sv('path', { d: `M-11,${-Rh + 5} A12,12 0 1 1 10,${-Rh - 6} M10,${-Rh - 12} L10,${-Rh - 5} L3,${-Rh - 5}`, fill: 'none', stroke: '#2a62b0', 'stroke-width': 2.5, 'pointer-events': 'none' }, sel);
        return { handle };
      },
      reference: (base, S) => (ctx, g) => {
        const P = S.P;
        const { util, spec } = ctx;
        const { C, d, k, color, card } = g;
        const side = util.el('div', 'rot-col', card);
        if (spec.mode === 'match') {
          util.el('div', 'rot-title', side, 'Reference');
          const RW = C;
          const ref = P.sv('svg', { class: 'rot-svg rot-ref', width: RW, height: RW, viewBox: `${-RW / 2} ${-RW / 2} ${RW} ${RW}` }, side);
          P.sv('path', { d, transform: `rotate(${spec.target}) scale(${k})`, fill: color, opacity: 0.85, stroke: 'rgba(20,42,72,.85)', 'stroke-width': 2.3 / k }, ref);
        }
        return { side };
      },
      readout: (base, S) => (ctx, g) => {
        const out = base(ctx, g);
        if (out.readout && !ctx.spec.keys) out.readout.hidden = true;
        return out;
      },
      paint: (base, S) => (ctx, g) => {
        base(ctx, g);
        const paletteAngle = document.querySelector('.pal-angle');
        if (paletteAngle) paletteAngle.textContent = `${Math.round(env.taskDef.helpers.mod360(ctx.model.angle))}°`;
      },
    },
  },
});
