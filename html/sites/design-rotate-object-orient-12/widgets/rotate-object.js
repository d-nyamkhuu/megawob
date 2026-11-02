// Site design on the rotate/orient template.
env.widget({
  task: 'rotate-object', site: 'design-rotate-object-orient-12', name: 'design', split: 'train',
  scenarios: ['orient'],
  template: 'rotate-object/orient',
  design: {
    modeClass: null,
    css: null,
    shapes: { ell: ['M-32,-46 H-8 V22 H32 V46 H-32 Z', 32, 46], },
    parts: {
      fit: () => (ctx) => Math.floor(Math.min(560, ctx.size.height - 16, ctx.size.width * .34)),
      shapeScale: () => (ctx, g, B, C) => C * .23 / 50,
      handleRadius: () => (ctx, g) => Math.round(g.C * .37 + ctx.rng.int(26, 36) - 31),
      heading: (base, S) => (ctx, g) => {
        const P = S.P;
        const R2D = S.R2D;
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
        const R2D = S.R2D;
        const { spec } = ctx;
        const { half, d, Rh, svg } = g;
        if (spec.mode === 'point') {
          const [sx, sy] = P.polar([0, 0], half - 38, spec.target);
          P.sv('path', { d: P.starPath(19, 8, 5), transform: `translate(${sx.toFixed(2)},${sy.toFixed(2)})`, fill: '#f2c200', stroke: '#8a6d00', 'stroke-width': 1.5 }, svg);
        }

        P.sv('circle', { r: Rh, fill: 'none', stroke: '#888477', 'stroke-width': 1.8, 'stroke-dasharray': '9 5' }, svg);
      },
      shape: (base, S) => (ctx, g) => {
        const P = S.P;
        const R2D = S.R2D;
        const { k, d, sel } = g;
        P.sv('path', { d, transform: `scale(${k})`, fill: '#7b2fa0', stroke: '#1a1a3a', 'stroke-width': 2 / k, 'stroke-linejoin': 'round' }, sel);
      },
      selection: (base, S) => (ctx, g) => {
        const P = S.P;
        const R2D = S.R2D;

      },
      handle: (base, S) => (ctx, g) => {
        const P = S.P;
        const R2D = S.R2D;
        const { d, Rh, sel } = g;
        // Curved double-headed arrow along the ring, with the round handle on it.
        const arcA = 26;
        const ra = Rh + 5;
        const [ax, ay] = P.polar([0, 0], ra, -arcA);
        const [bx2, by2] = P.polar([0, 0], ra, arcA);
        const arcPath = `M${ax.toFixed(2)},${ay.toFixed(2)} A${ra},${ra} 0 0 1 ${bx2.toFixed(2)},${by2.toFixed(2)}`;
        P.sv('path', { d: arcPath, fill: 'none', stroke: '#101329', 'stroke-width': 7 }, sel);
        P.sv('path', { d: arcPath, fill: 'none', stroke: '#3973bb', 'stroke-width': 4 }, sel);
        for (const s of [-1, 1]) {
          const a = (s * arcA * Math.PI) / 180;
          const px = ra * Math.sin(a), py = -ra * Math.cos(a);
          const tx = Math.cos(a) * s, ty = Math.sin(a) * s, nx = Math.sin(a), ny = -Math.cos(a);
          const pt = (u, v) => `${(px + tx * u + nx * v).toFixed(2)},${(py + ty * u + ny * v).toFixed(2)}`;
          P.sv('path', { d: `M${pt(15, 0)} L${pt(-3, 11)} L${pt(-3, -11)} Z`, fill: '#3973bb', stroke: '#101329', 'stroke-width': 1.8 }, sel);
        }
        const handle = P.sv('circle', { class: 'rot-handle', cx: 0, cy: -Rh, r: 12, fill: '#4a7fd0', stroke: '#101329', 'stroke-width': 2 }, sel);
        handle.dataset.role = 'handle';
        return { arcA, ra, ax, ay, bx2, by2, arcPath, handle };
      },
      reference: (base, S) => (ctx, g) => {
        const P = S.P;
        const R2D = S.R2D;
        const { util, spec } = ctx;
        const { d, card, svg } = g;
        const side = util.el('div', 'rot-col', card);
        if (spec.mode === 'match') {
          util.el('div', 'rot-title', side, 'Reference Shape');
          const RW = 130;
          const ref = P.sv('svg', { class: 'rot-svg rot-ref', width: RW, height: RW, viewBox: `${-RW / 2} ${-RW / 2} ${RW} ${RW}` }, side);
          const rk = 1.0;
          P.sv('path', { d, transform: `rotate(${spec.target}) scale(${rk})`, fill: '#7b2fa0', stroke: '#1a1a3a', 'stroke-width': 2 / rk, 'stroke-linejoin': 'round' }, ref);
        }
        return { side };
      },
    },
  },
});
