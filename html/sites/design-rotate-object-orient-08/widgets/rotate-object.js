// Hub-grip design with a large grid canvas, gradient shapes, and a wide arrow.
env.widget({
  task: 'rotate-object',
  site: 'design-rotate-object-orient-08',
  name: 'design',
  split: 'train',
  scenarios: ['orient'],
  traits: { grip: 'hub' },
  template: 'rotate-object/orient',
  design: {
    modeClass: 'orient-',
    shapes: {
      arrow: ['M0,-88 L15,-48 L5.5,-48 L5.5,0 L-5.5,0 L-5.5,-48 L-15,-48 Z', 32, 48],
      ell: ['M-28,-46 H-4 V22 H30 V46 H-28 Z', 30, 46],
    },
    parts: {
      frame: (base, S) => (ctx, g) => {
        const sideWidth = ctx.spec.mode === 'match' ? 242 : ctx.spec.mode === 'heading' && ctx.spec.keys ? 180 : 24;
        const C = Math.floor(Math.min(560, ctx.size.height - 24, ctx.size.width - sideWidth));
        const half = C / 2;
        const B = ctx.rng.int(110, 150);
        const visualScale = Math.min(1, C / 560);
        const k = (B / 100) * 1.38 * visualScale;
        const [d, hw, hh] = S.P.shapePaths()[ctx.spec.shape];
        const color = ctx.content.COLORS[ctx.spec.color];
        const selPad = 8;
        const top = hh * k + selPad;
        const Rh = Math.round(top + ctx.rng.int(26, 36));
        Object.assign(g, { C, half, B, k, d, hw, hh, color, selPad, top });
        const card = ctx.util.el('div', `rot-card orient-${ctx.spec.mode}`, ctx.stage);
        const svg = S.P.sv('svg', { class: 'rot-svg rot-canvas', width: C, height: C, viewBox: `${-half} ${-half} ${C} ${C}` }, card);
        svg.dataset.role = 'canvas';
        return { Rh, card, svg };
      },
      grid: (base, S) => (ctx, g) => {
        const { rng } = ctx;
        const { C, half, d } = g;
        const gid = `rot-grid-${Math.floor(rng.next() * 1e9)}`;
        const defs = S.P.sv('defs', {}, g.svg);
        const cell = rng.pick([20, 24, 28]);
        const pat = S.P.sv('pattern', { id: gid, width: cell, height: cell, patternUnits: 'userSpaceOnUse', x: -half, y: -half }, defs);
        S.P.sv('path', { d: `M${cell},0 L0,0 0,${cell}`, fill: 'none', stroke: 'var(--line)', 'stroke-width': 1, opacity: 0.7 }, pat);
        const color = ctx.content.COLORS[ctx.spec.color];
        const [, , hh] = S.P.shapePaths()[ctx.spec.shape];
        const shapeFill = S.P.sv('linearGradient', {
          id: gid + '-shape', x1: 0, y1: ctx.spec.shape === 'arrow' ? -88 : -hh,
          x2: 0, y2: hh, gradientUnits: 'userSpaceOnUse',
        }, defs);
        S.P.sv('stop', { offset: 0, 'stop-color': `color-mix(in srgb, ${color} 90%, white)` }, shapeFill);
        S.P.sv('stop', { offset: 1, 'stop-color': `color-mix(in srgb, ${color} 90%, black)` }, shapeFill);
        S.P.sv('rect', { class: 'rot-gridrect', x: -half, y: -half, width: C, height: C, fill: `url(#${gid})` }, g.svg);
        const Rg = half - 9;
        S.P.sv('ellipse', { class: 'rot-ring', rx: Rg, ry: Rg - 5, fill: 'none', stroke: '#cbd5e3', 'stroke-width': 3 }, g.svg);
        for (const a of [0, 90, 180, 270]) {
          const Rt = a % 180 === 0 ? Rg - 5 : Rg;
          const [x0, y0] = S.P.polar([0, 0], Rt - 2, a);
          const [x1, y1] = S.P.polar([0, 0], Rt - 30, a);
          S.P.sv('line', { x1: x0, y1: y0, x2: x1, y2: y1, stroke: a % 180 === 0 ? '#617d99' : '#9aaec8', 'stroke-width': 2.5 }, g.svg);
        }
        return { gid, defs, cell, pat };
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
        const { C, svg } = g;
        if (spec.mode !== 'point') return;
        const [sx, sy] = S.P.polar([0, 0], (C / 2 - 8) * 0.8, spec.target);
        S.P.sv('path', {
          d: S.P.starPath(32 * Math.min(1, C / 560), 13 * Math.min(1, C / 560), 5),
          transform: `translate(${sx.toFixed(2)},${sy.toFixed(2)})`,
          fill: '#ffda22', stroke: '#9c7809', 'stroke-width': 2.5,
        }, svg);
      },
      shape: (base, S) => (ctx, g) => {
        const { k, d, sel, gid } = g;
        S.P.sv('path', { d, transform: `scale(${k})`, fill: `url(#${gid}-shape)`, stroke: 'rgba(0,0,0,.55)', 'stroke-width': 2.5 / k }, sel);
      },
      selection: (base, S) => (ctx, g) => {
        const { k, hw, selPad, top, sel } = g;
        const bx = hw * k + selPad;
        S.P.sv('rect', { class: 'rot-selbox', x: -bx, y: -top, width: 2 * bx, height: 2 * top, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }, sel);
        for (const [cx, cy] of [[-bx, -top], [bx, -top], [-bx, top], [bx, top]]) {
          S.P.sv('rect', { class: 'rot-selbox', x: cx - 4, y: cy - 4, width: 8, height: 8, fill: 'var(--panel)', stroke: 'var(--accent)', 'stroke-width': 1.5 }, sel);
        }
        return { bx };
      },
      handle: (base, S) => (ctx, g) => {
        const { top, Rh, sel } = g;
        const hubGrip = ctx.spec.grip === 'hub';
        if (!hubGrip) S.P.sv('line', { x1: 0, y1: -top, x2: 0, y2: -Rh + 9, stroke: 'var(--accent)', 'stroke-width': 1.5 }, sel);
        const handle = S.P.sv('circle', { class: 'rot-handle', cx: 0, cy: -Rh, r: 9, fill: 'var(--panel)', stroke: 'var(--accent)', 'stroke-width': 2.5 }, sel);
        handle.dataset.role = 'handle';
        if (hubGrip) { handle.style.display = 'none'; handle.style.pointerEvents = 'none'; }
        const hub = S.P.sv('circle', {
          class: 'rot-pivot' + (hubGrip ? ' rot-handle rot-hub' : ''),
          r: 17 * Math.min(1, g.C / 560), fill: '#e6e9ed', stroke: '#4c5a70', 'stroke-width': 2.5,
          'pointer-events': hubGrip ? 'auto' : 'none',
        }, sel);
        if (hubGrip) hub.dataset.role = 'grip';
        return { hubGrip, handle, hub };
      },
    },
  },
});
