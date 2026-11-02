// Adds the compass scale, metallic pointer and lower rotation handle from this design.
env.widget({
  task: 'rotate-object', site: 'design-rotate-object-orient-11', name: 'design', split: 'train',
  scenarios: ['orient'],
  template: 'rotate-object/orient',
  design: {
    modeClass: 'rot-orient',
    shapes: {
      arrow: ['M0,-48 L32,-10 L12,-10 L12,48 L-12,48 L-12,-10 L-32,-10 Z', 32, 48],
      ell: ['M-28,-46 H-6 V24 H30 V46 H-28 Z', 30, 46],
    },
    parts: {
      fit: () => (ctx) => Math.floor(Math.min(560, ctx.size.height - 100, ctx.size.width - 80)),
      handleRadius: () => (ctx, g) => {
        g.sampledRh = Math.round(g.top + ctx.rng.int(26, 36));
        return g.C * 0.132;
      },
      frame: (base) => (ctx, g) => {
        const out = base(ctx, g);
        out.card.className = 'rot-card rot-orient';
        return out;
      },
      grid: (base, S) => (ctx, g) => {
        const out = base(ctx, g);
        const P = S.P;
        const gradient = P.sv('linearGradient', { id: 'pointer-metal', x1: '0%', y1: '0%', x2: '100%', y2: '100%' }, out.defs);
        P.sv('stop', { offset: '0%', 'stop-color': '#565758' }, gradient);
        P.sv('stop', { offset: '100%', 'stop-color': '#353535' }, gradient);
        return out;
      },
      heading: (base, S) => (ctx, g) => {
        const P = S.P;
        const { rng, spec } = ctx;
        const { C, half, svg } = g;
        const fam = env.taskDef;
        const ringRadius = C * 0.333;
        P.sv('circle', { r: ringRadius, fill: 'none', stroke: '#555', 'stroke-width': 1.2, 'stroke-dasharray': '13 23' }, svg);
        for (let a = 0; a < 360; a += 15) {
          const major = a % 90 === 0;
          const p0 = P.polar([0, 0], ringRadius - (major ? 10 : 6), a);
          const p1 = P.polar([0, 0], ringRadius + (major ? 10 : 6), a);
          P.sv('line', { x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], stroke: '#111', 'stroke-width': major ? 2 : 1 }, svg);
          if (major) {
            const p = P.polar([0, 0], ringRadius + 30, a);
            const t = P.sv('text', { x: p[0], y: p[1], 'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'compass-label' }, svg);
            t.style.setProperty('font-size', `${C * 0.049}px`, 'important');
            t.textContent = `${fam.helpers.mod360(90 - a)}°`;
          }
        }
        if (spec.mode === 'heading' && rng.bool(0.6)) {
          const legacyScale = P.sv('g', { visibility: 'hidden' }, svg);
          const Rr = half - 30;
          for (let a = 0; a < 360; a += 5) {
            const major = a % 45 === 0;
            const [x0, y0] = P.polar([0, 0], Rr, a);
            const [x1, y1] = P.polar([0, 0], Rr - (major ? 14 : a % 15 === 0 ? 9 : 5), a);
            P.sv('line', { class: major ? 'major' : 'minor', x1: x0, y1: y0, x2: x1, y2: y1, opacity: major ? 0.6 : 0.8 }, legacyScale);
            if (major) {
              const [tx, ty] = P.polar([0, 0], Rr + 14, a);
              const t = P.sv('text', { x: tx, y: ty, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, legacyScale);
              t.textContent = `${a}°`;
              t.style.fontSize = '11px';
            }
          }
        }
      },
      point: (base, S) => (ctx, g) => {
        const P = S.P;
        const { size, spec } = ctx;
        const { C, svg } = g;
        if (spec.mode !== 'point') return;
        const direction = P.polar([0, 0], 1, spec.target);
        const maxY = size.height * 0.44 - C * 0.078;
        const radius = Math.min(C * 0.72, maxY / Math.max(0.01, Math.abs(direction[1])));
        const [sx, sy] = P.polar([0, 0], radius, spec.target);
        P.sv('path', {
          d: P.starPath(C * 0.075, C * 0.031, 5),
          transform: `translate(${sx.toFixed(2)},${sy.toFixed(2)})`,
          fill: '#ffda00', stroke: '#000', 'stroke-width': 3, 'stroke-linejoin': 'round',
        }, svg);
      },
      shape: (base, S) => (ctx, g) => {
        const P = S.P;
        const { C, k, d, sel } = g;
        const arrow = ctx.spec.shape === 'arrow';
        const path = arrow ? 'M0,-130 L24,-65 H9 V62 H-9 V-65 H-24 Z' : d;
        P.sv('path', {
          d: path, transform: `scale(${arrow ? C / 474 : k})`, fill: 'url(#pointer-metal)',
          stroke: '#000', 'stroke-width': 2.5, 'stroke-linejoin': 'miter',
        }, sel);
      },
      selection: (base, S) => (ctx, g) => {
        const P = S.P;
        const { k, hw, selPad, top, sel } = g;
        const bx = hw * k + selPad;
        P.sv('rect', { x: -bx, y: -top, width: 2 * bx, height: 2 * top, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 1.5, 'stroke-dasharray': '5 4', visibility: 'hidden' }, sel);
        for (const [cx, cy] of [[-bx, -top], [bx, -top], [-bx, top], [bx, top]]) {
          P.sv('rect', { x: cx - 4, y: cy - 4, width: 8, height: 8, fill: 'var(--panel)', stroke: 'var(--accent)', 'stroke-width': 1.5, visibility: 'hidden' }, sel);
        }
        P.sv('line', { x1: 0, y1: -top, x2: 0, y2: -g.sampledRh + 9, stroke: 'var(--accent)', 'stroke-width': 1.5, visibility: 'hidden' }, sel);
        return { bx };
      },
      handle: (base, S) => (ctx, g) => {
        const P = S.P;
        const { C, Rh, sel } = g;
        const handle = P.sv('circle', { class: 'rot-handle', cx: 0, cy: Rh, r: C * 0.035, fill: '#a4bedf', stroke: '#000', 'stroke-width': 3 }, sel);
        handle.dataset.role = 'handle';
        return { handle };
      },
      reference: (base) => (ctx, g) => {
        const out = base(ctx, g);
        if (ctx.spec.mode === 'match') out.side.classList.add('rot-reference-col');
        return out;
      },
      readout: (base, S) => (ctx, g) => {
        const { util, rng, spec } = ctx;
        const fam = env.taskDef;
        const { card, side, paint } = g;
        const sampledReadout = spec.mode === 'heading' || rng.bool(0.4);
        const host = util.el('div', 'rot-readout', spec.mode === 'match' ? card : side);
        let field = null;
        if (host && spec.keys) field = S.P.angleField(ctx, host, 'Rotation', (a) => {
          const angle = fam.helpers.mod360(a);
          g.rot.set(angle);
          ctx.update({ angle });
          paint();
        });
        util.el('div', 'rot-muted', side, 'Drag the round handle to rotate');
        return { readout: host, field, sampledReadout };
      },
      paint: (base) => (ctx, g) => {
        const { readout, field } = g;
        if (field) field.paint(Math.round(ctx.model.angle) % 360);
        else if (readout) readout.textContent = `Current angle: ${Math.round(env.taskDef.helpers.mod360(90 - ctx.model.angle)) % 360}°`;
      },
      rotate: (base, S) => (ctx, g) => {
        const fam = env.taskDef;
        const { Rh, svg, sel, handle, paint } = g;
        const rot = env.ui.rotateHandle(sel, handle, {
          label: 'handle', pivot: () => S.P.centerOf(svg), radius: Rh, restAngle: 180,
          angle: ctx.model.angle, constrain: fam.helpers.mod360,
          place: (el, a) => el.setAttribute('transform', `rotate(${a.toFixed(3)})`),
          onInput(angle) { ctx.update({ angle }); paint(); },
        });
        return { rot };
      },
    },
  },
});
