// This design uses a wide blue gradient canvas, a proportional handle, and matching reference art.
env.widget({
  task: 'rotate-object', site: 'design-rotate-object-orient-06', name: 'design', split: 'train',
  scenarios: ['orient'],
  traits: { shapes: ['ell'], modes: ['match'] },
  template: 'rotate-object/orient',
  design: {
    modeClass: null,
    shapes: {
      arrow: ['M0,-48 L32,-10 L12,-10 L12,48 L-12,48 L-12,-10 L-32,-10 Z', 32, 48],
      ell: ['M-43,-46 H0 V12 H43 V46 H-43 Z', 43, 46],
    },
    parts: {
      frame: (base, S) => (ctx, g) => {
        const { util, rng, size, spec } = ctx;
        const C = Math.floor(size.width * 0.449);
        const H = Math.floor(Math.min(C * 566 / 508, size.height - size.width * 0.053 - 34));
        const half = C / 2;
        const B = rng.int(110, 150);
        const k = B / 100 * 1.95 * C / 508;
        const [d, hw, hh] = S.P.shapePaths()[spec.shape];
        const color = '#90affc';
        const selPad = 8;
        const top = hh * k + selPad;
        const Rh = Math.round(top + rng.int(26, 36) + 18 * C / 508);
        const card = util.el('div', 'rot-card', ctx.stage);
        const mine = util.el('div', 'rot-col', card);
        util.el('div', 'rot-title', mine, 'Your Shape');
        const svg = S.P.sv('svg', { class: 'rot-svg rot-canvas', width: C, height: H, viewBox: `${-half} ${-H / 2} ${C} ${H}` }, mine);
        svg.dataset.role = 'canvas';
        return { C, H, half, B, k, d, hw, hh, color, selPad, top, Rh, card, mine, svg };
      },
      grid: (base, S) => (ctx, g) => {
        const { rng } = ctx;
        const { C, half, svg } = g;
        const gid = `rot-grid-${Math.floor(rng.next() * 1e9)}`;
        const defs = S.P.sv('defs', {}, svg);
        const fillId = gid + '-fill';
        const fill = S.P.sv('linearGradient', { id: fillId, x1: '0%', y1: '0%', x2: '100%', y2: '100%' }, defs);
        S.P.sv('stop', { offset: '0%', 'stop-color': '#88a5f7' }, fill);
        S.P.sv('stop', { offset: '55%', 'stop-color': g.color }, fill);
        S.P.sv('stop', { offset: '100%', 'stop-color': '#8cabfa' }, fill);
        const cell = rng.pick([20, 24, 28]);
        const pat = S.P.sv('pattern', { id: gid, width: cell, height: cell, patternUnits: 'userSpaceOnUse', x: -half, y: -half }, defs);
        S.P.sv('path', { d: `M${cell},0 L0,0 0,${cell}`, fill: 'none', stroke: 'var(--line)', 'stroke-width': 1, opacity: 0.7 }, pat);
        return { gid, fillId, defs, cell, pat };
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
        const { half, svg } = g;
        if (spec.mode === 'point') {
          const [sx, sy] = S.P.polar([0, 0], half - 38, spec.target);
          S.P.sv('path', { d: S.P.starPath(19, 8, 5), transform: `translate(${sx.toFixed(2)},${sy.toFixed(2)})`, fill: '#f2c200', stroke: '#8a6d00', 'stroke-width': 1.5 }, svg);
        }
      },
      shape: (base, S) => (ctx, g) => {
        S.P.sv('path', { d: g.d, transform: `scale(${g.k})`, fill: `url(#${g.fillId})`, stroke: '#000', 'stroke-width': 2.5 / g.k }, g.sel);
      },
      selection: () => () => ({}),
      handle: (base, S) => (ctx, g) => {
        const { C, top, Rh, sel } = g;
        const radius = 11 * C / 508;
        S.P.sv('line', { x1: 0, y1: -top + g.selPad, x2: 0, y2: -Rh + radius, stroke: '#000', 'stroke-width': 2.5 }, sel);
        const handle = S.P.sv('circle', { class: 'rot-handle', cx: 0, cy: -Rh, r: radius, fill: '#fff', stroke: '#000', 'stroke-width': 2.5 }, sel);
        handle.dataset.role = 'handle';
        return { handle };
      },
      reference: (base, S) => (ctx, g) => {
        const { util, spec } = ctx;
        const { C, H, half, d, k, card, fillId } = g;
        const side = util.el('div', 'rot-col', card);
        side.dataset.mode = spec.mode;
        if (spec.mode === 'match') {
          util.el('div', 'rot-title', side, 'Reference');
          const ref = S.P.sv('svg', { class: 'rot-svg rot-ref', width: C, height: H, viewBox: `${-half} ${-H / 2} ${C} ${H}` }, side);
          S.P.sv('path', { d, transform: `rotate(${spec.target}) scale(${k})`, fill: `url(#${fillId})`, stroke: '#000', 'stroke-width': 2.5 / k }, ref);
        }
        return { side };
      },
      controls: (base, S) => (ctx, g) => {
        const fam = env.taskDef;
        const startAngle = ctx.model.angle;
        document.querySelectorAll('[data-tool]').forEach((b) => {
          b.onclick = () => {
            const t = b.dataset.tool;
            const angle = fam.helpers.mod360(t === 'reset' ? startAngle : ctx.model.angle + (t === 'left' ? -15 : 15));
            g.rot.set(angle);
            ctx.update({ angle });
            g.paint();
          };
        });
      },
    },
  },
});
