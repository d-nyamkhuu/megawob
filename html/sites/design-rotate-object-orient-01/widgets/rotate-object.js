// Adds the oversized canvas, dial marks, and arrow-specific handle orientation.
(function () {
  'use strict';
  env.widget({
    task: 'rotate-object', site: 'design-rotate-object-orient-01', name: 'design', split: 'train',
    scenarios: ['orient'],
    template: 'rotate-object/orient',
    design: {
      modeClass: 'mode-',
      shapes: {
        arrow: ['M0,-48 L32,-10 L12,-10 L12,48 L-12,48 L-12,-10 L-32,-10 Z', 32, 48],
        ell: ['M-30,-46 H-6 V22 H32 V46 H-30 Z', 32, 46],
      },
      parts: {
        fit: () => (ctx) => Math.floor(Math.min(ctx.size.height - 12, ctx.size.width * 0.7)),
        shapeScale: () => (ctx, g, B) => B / 100,
        handleRadius: () => (ctx, g) => {
          const sampled = ctx.rng.int(26, 36);
          return ctx.spec.shape === 'arrow' ? g.C * 0.16 : Math.round(g.top + sampled);
        },
        frame: (base, S) => (ctx, g) => {
          const made = base(ctx, g);
          g.handleOffset = ctx.spec.shape === 'arrow' ? 180 : 0;
          made.card.className = `rot-card mode-${ctx.spec.mode}`;
          return made;
        },
        grid: (base, S) => (ctx, g) => {
          const made = base(ctx, g);
          const { C, svg } = g;
          const rr = C * 0.355;
          S.P.sv('circle', { class: 'g-ring', cx: 0, cy: 0, r: rr, fill: 'none', stroke: '#000', 'stroke-width': 2.5, 'pointer-events': 'none' }, svg);
          for (const [x0, y0, x1, y1] of [
            [0, -rr, 0, -rr + C * 0.06], [0, rr, 0, rr - C * 0.06],
            [-rr, 0, -rr + C * 0.06, 0], [rr, 0, rr - C * 0.06, 0],
          ]) S.P.sv('line', { x1: x0, y1: y0, x2: x1, y2: y1, stroke: '#000', 'stroke-width': 2.5, 'pointer-events': 'none' }, svg);
          return made;
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
          const { size, spec } = ctx;
          const { C, svg } = g;
          if (spec.mode !== 'point') return;
          const sin = Math.sin(spec.target / S.R2D), cos = Math.cos(spec.target / S.R2D);
          const radius = Math.min(
            (size.width * (sin > 0 ? 0.575 : 0.425) - 38) / Math.max(0.01, Math.abs(sin)),
            (size.height / 2 - 38) / Math.max(0.01, Math.abs(cos)),
          ) * 0.9;
          const [sx, sy] = S.P.polar([0, 0], radius, spec.target);
          S.P.sv('path', { d: S.P.starPath(C * 0.062, C * 0.027, 5), transform: `translate(${sx.toFixed(2)},${sy.toFixed(2)})`, fill: '#f2c200', stroke: '#8a6d00', 'stroke-width': 1.5 }, svg);
        },
        shape: (base, S) => (ctx, g) => {
          const { C, k, d, color, sel, Rh } = g;
          const arrowPath = `M0,${-C * 0.22} L${C * 0.038},${-C * 0.145} L${C * 0.012},${-C * 0.145} L${C * 0.012},${Rh} L${-C * 0.012},${Rh} L${-C * 0.012},${-C * 0.145} L${-C * 0.038},${-C * 0.145} Z`;
          S.P.sv('path', { d: ctx.spec.shape === 'arrow' ? arrowPath : d, transform: `scale(${ctx.spec.shape === 'arrow' ? 1 : k})`, fill: color, stroke: 'rgba(0,0,0,.35)', 'stroke-width': 1.5 / k }, sel);
        },
        handle: (base, S) => (ctx, g) => {
          const { C, top, Rh, sel, handleOffset } = g;
          S.P.sv('line', { x1: 0, y1: -top, x2: 0, y2: -Rh + 9, stroke: 'var(--accent)', 'stroke-width': 1.5, opacity: handleOffset ? 0 : 1 }, sel);
          const handle = S.P.sv('circle', { class: 'rot-handle', cx: 0, cy: handleOffset ? Rh : -Rh, r: C * 0.028, fill: 'var(--panel)', stroke: 'var(--accent)', 'stroke-width': 2.5 }, sel);
          handle.dataset.role = 'handle';
          S.P.sv('circle', { class: 'g-hub', r: C * 0.032, fill: 'var(--accent)', stroke: '#000', 'stroke-width': 2 }, sel);
          return { handle };
        },
        readout: (base, S) => (ctx, g) => {
          const { util, rng, spec } = ctx;
          const fam = env.taskDef;
          const { handle, side, paint } = g;
          const readout = spec.mode === 'heading' || rng.bool(0.4) ? util.el('div', 'rot-readout', side) : null;
          let field = null;
          if (readout && spec.keys) field = S.P.angleField(ctx, document.getElementById('g-angle') || readout, 'Rotation', (a) => {
            const angle = fam.helpers.mod360(a);
            g.rot.set(fam.helpers.mod360(angle + g.handleOffset));
            ctx.update({ angle });
            paint();
          });
          util.el('div', 'rot-muted', side, 'Drag the round handle to rotate');
          return { readout, field };
        },
        paint: (base, S) => (ctx, g) => {
          const { readout, field } = g;
          const gAngle = document.getElementById('g-angle');
          if (gAngle && !field) gAngle.textContent = `${Math.round(ctx.model.angle) % 360}°`;
          if (field) field.paint(Math.round(ctx.model.angle) % 360);
          else if (readout) readout.textContent = `Rotation: ${Math.round(ctx.model.angle) % 360}°`;
        },
        rotate: (base, S) => (ctx, g) => {
          const fam = env.taskDef;
          const offset = g.handleOffset;
          const { Rh, svg, sel, handle, paint } = g;
          const rot = env.ui.rotateHandle(sel, handle, {
            label: 'handle', pivot: () => S.P.centerOf(svg), radius: Rh,
            angle: fam.helpers.mod360(ctx.model.angle + offset), constrain: fam.helpers.mod360,
            place: (el, a) => el.setAttribute('transform', `rotate(${(a - offset).toFixed(3)})`),
            onInput(angle) {
              ctx.update({ angle: fam.helpers.mod360(angle - offset) });
              paint();
            },
          });
          const wrapped = Object.create(rot);
          wrapped.locate = (angle) => rot.locate(fam.helpers.mod360(angle + offset));
          return { rot: wrapped };
        },
        placed: (base, S) => (ctx, g) => {
          base(ctx, g);
          const card = g.card;
          if (!card) return;
          const stageBox = ctx.stage.getBoundingClientRect();
          const canvasBox = card.querySelector('.rot-canvas').getBoundingClientRect();
          const dx = Math.max(stageBox.left + 4 - canvasBox.left, Math.min(0, stageBox.right - 4 - canvasBox.right));
          const dy = Math.max(stageBox.top + 4 - canvasBox.top, Math.min(0, stageBox.bottom - 4 - canvasBox.bottom));
          if (dx || dy) card.style.transform = `translate(${dx}px, ${dy}px)`;
        },
      },
    },
  });
})();
