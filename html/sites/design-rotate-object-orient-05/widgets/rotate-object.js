// Site design on the rotate/orient template.
env.widget({
  task: 'rotate-object', site: 'design-rotate-object-orient-05', name: 'design', split: 'train',
  scenarios: ['orient'],
  traits: { grip: 'hub' },
  template: 'rotate-object/orient',
  design: {
    shapes: { arrow: ['M0,-122 L23,-74 L5,-78 L5,0 L-5,0 L-5,-78 L-23,-74 Z', 23, 122], },
    parts: {
      frame: (base, S) => (ctx, g) => {
        const P = S.P;
        const R2D = S.R2D;
        const { util, rng, size, spec, content } = ctx;
        const C = Math.floor(Math.min(size.height * .92, size.width * .615));
        const half = C / 2;
        const B = rng.int(110, 150);
        const scale = Math.min(1, C / 570);
        const k = B / 100 * scale;
        const [d, hw, hh] = P.shapePaths()[spec.shape];
        const color = content.COLORS[spec.color];
        const selPad = 8 * scale;
        const top = hh * k + selPad;
        const Rh = Math.round(top + rng.int(26, 36) * scale);

        const card = util.el('div', 'rot-card', ctx.stage);
        card.dataset.mode = spec.mode;
        if (spec.mode !== 'point') {
          const helper = document.querySelector('.task-helper');
          if (helper) helper.textContent = 'Click and drag the circular handle to rotate the shape.';
          const firstStep = document.querySelector('.steps li:first-child');
          if (firstStep) firstStep.textContent = 'Click and drag the circular handle\nto rotate the shape.';
          const step = document.querySelector('.steps li:nth-child(2)');
          if (step) step.textContent = spec.mode === 'match' ? 'Turn the shape to match the reference.' : 'Turn the shape to the orientation given in the task.';
        }
        const svg = P.sv('svg', { class: 'rot-svg rot-canvas', width: C, height: C, viewBox: `${-half} ${-half} ${C} ${C}` }, card);
        svg.dataset.role = 'canvas';
        // Keep the dial left of the pane center, leaving room for a distant target.
        const pivotX = size.width * .421;
        const pivotY = size.height * .476;
        Object.assign(svg.style, { position: 'absolute', left: `${pivotX - half}px`, top: `${pivotY - half}px` });
        return { C, half, B, scale, k, d, hw, hh, color, selPad, top, Rh, card, svg, pivotX, pivotY };
      },
      grid: (base, S) => (ctx, g) => {
        const P = S.P;
        const R2D = S.R2D;
        const { rng } = ctx;
        const { C, half, d, Rh, svg } = g;
        // Design-tool grid.
        const gid = `rot-grid-${Math.floor(rng.next() * 1e9)}`;
        const defs = P.sv('defs', {}, svg);
        const cell = rng.pick([20, 24, 28]);
        const pat = P.sv('pattern', { id: gid, width: cell, height: cell, patternUnits: 'userSpaceOnUse', x: -half, y: -half }, defs);
        P.sv('path', { d: `M${cell},0 L0,0 0,${cell}`, fill: 'none', stroke: 'var(--line)', 'stroke-width': 1, opacity: 0.7 }, pat);
        P.sv('rect', { x: -half, y: -half, width: C, height: C, fill: 'none' }, svg);
        // e-ink dial: outlined ring with four ticks
        const ringR = Math.max(Rh + 24, half * 0.88);
        P.sv('circle', { r: ringR, fill: 'none', stroke: '#1b1b1b', 'stroke-width': 3 }, svg);
        for (const a of [0, 90, 180, 270]) {
          const [x0, y0] = P.polar([0, 0], ringR, a);
          const [x1, y1] = P.polar([0, 0], ringR - 28, a);
          P.sv('line', { x1: x0, y1: y0, x2: x1, y2: y1, stroke: '#1b1b1b', 'stroke-width': 2.5 }, svg);
        }
        return { gid, defs, cell, pat, ringR };
      },
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
        const { size, spec } = ctx;
        const { C, d, svg, pivotX, pivotY, ringR } = g;
        if (spec.mode === 'point') {
          const [dx, dy] = P.polar([0, 0], 1, spec.target);
          const margin = Math.min(38, C * .07);
          const maxX = (dx > 0 ? size.width - pivotX - margin : pivotX - margin) / Math.max(Math.abs(dx), .001);
          const maxY = (dy > 0 ? size.height - pivotY - margin : pivotY - margin) / Math.max(Math.abs(dy), .001);
          const targetRadius = Math.min(ringR * 1.78, maxX, maxY);
          const [sx, sy] = P.polar([0, 0], targetRadius, spec.target);
          P.sv('path', { d: P.starPath(C * .061, C * .026, 5), transform: `translate(${sx.toFixed(2)},${sy.toFixed(2)})`, fill: '#1b1b1b', stroke: '#1b1b1b', 'stroke-width': 1.5 }, svg);
        }
      },
      shape: (base, S) => (ctx, g) => {
        const P = S.P;
        const R2D = S.R2D;
        const { scale, k, d, sel } = g;
        P.sv('path', { d, transform: `scale(${k})`, fill: '#1b1b1b', stroke: '#1b1b1b', 'stroke-width': 1.5 / k }, sel);
      },
      selection: (base, S) => (ctx, g) => {
        const P = S.P;
        const R2D = S.R2D;

      },
      handle: (base, S) => (ctx, g) => {
        const P = S.P;
        const R2D = S.R2D;
        const { spec } = ctx;
        const { C, scale, top, Rh, svg, sel } = g;
        const hubGrip = spec.grip === 'hub';
        if (!hubGrip) P.sv('line', { x1: 0, y1: -top, x2: 0, y2: -Rh + 9, stroke: '#1b1b1b', 'stroke-width': 2 }, sel);
        const handle = P.sv('circle', { class: 'rot-handle', cx: 0, cy: -Rh, r: Math.max(8, 11 * scale), fill: '#f5f4ef', stroke: '#1b1b1b', 'stroke-width': 3 }, sel);
        handle.dataset.role = 'handle';
        if (hubGrip) {
          handle.style.display = 'none';
          handle.style.pointerEvents = 'none';
        } else P.sv('circle', { cx: 0, cy: -Rh, r: 4, fill: '#1b1b1b', 'pointer-events': 'none' }, sel);
        const hub = P.sv('circle', { class: hubGrip ? 'rot-handle rot-hub' : '', r: C * .038, fill: '#f6f5f1', stroke: '#1b1b1b', 'stroke-width': 3, 'pointer-events': hubGrip ? 'auto' : 'none' }, svg);
        if (hubGrip) hub.dataset.role = 'grip';
        P.sv('circle', { r: C * .025, fill: '#1b1b1b', 'pointer-events': 'none' }, svg);
        return { hubGrip, handle, hub };
      },
      reference: (base, S) => (ctx, g) => {
        const P = S.P;
        const R2D = S.R2D;
        const { util, size, spec } = ctx;
        const { scale, d, hw, hh, card, svg } = g;
        const side = util.el('div', 'rot-col', card);
        if (spec.mode === 'match') {
          util.el('div', 'rot-title', side, 'Reference');
          const RW = Math.min(190, size.width * .2);
          const ref = P.sv('svg', { class: 'rot-svg rot-ref', width: RW, height: RW, viewBox: `${-RW / 2} ${-RW / 2} ${RW} ${RW}` }, side);
          const rk = Math.min(1.15, RW / (Math.max(hw, hh) * 2.5));
          P.sv('path', { d, transform: `rotate(${spec.target}) scale(${rk})`, fill: '#1b1b1b', stroke: '#1b1b1b', 'stroke-width': 1.5 / rk }, ref);
        }
        return { side };
      },
    },
  },
});
