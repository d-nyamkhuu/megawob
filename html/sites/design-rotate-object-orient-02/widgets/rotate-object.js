// Site design on the rotate/orient template.
env.widget({
  task: 'rotate-object', site: 'design-rotate-object-orient-02', name: 'design', split: 'train',
  scenarios: ['orient'],
  traits: { grip: 'hub' },
  template: 'rotate-object/orient',
  design: {
    modeClass: null,
    sync: 'paint',
    shapes: { arrow: ['M0,-88 L25,-22 L6,-27 L6,0 L-6,0 L-6,-27 L-25,-22 Z', 32, 48], ell: ['M-28,-46 H-4 V22 H30 V46 H-28 Z', 30, 46], },
    parts: {
      fit: () => (ctx) => Math.floor(Math.min(ctx.size.width * .96, ctx.size.height * .86)),
      shapeScale: () => (ctx, g, B) => {
        g.unit = ctx.size.width / 1293;
        return (ctx.spec.shape === 'arrow' ? 1.32 : B / 100) * g.unit;
      },
      handleRadius: () => (ctx, g) => {
        ctx.rng.int(26, 36);
        const Rh = 131 * g.unit;
        g.dragRadius = ctx.spec.shape === 'arrow' ? 88 * g.k : Rh;
        return Rh;
      },
      heading: (base, S) => (ctx, g) => {
        const P = S.P;
        const R2D = S.R2D;
        const { rng, spec } = ctx;
        const { unit, Rh, svg } = g;
        if (spec.mode === 'heading' && rng.bool(0.6)) {
          const Rr = Rh + 36 * unit;
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
        const { unit, d, Rh, svg } = g;
        if (spec.mode === 'point') {
          const radians = spec.target / R2D;
          const dx = Math.sin(radians), dy = -Math.cos(radians);
          const margin = 60 * unit;
          const pivotY = size.height * 0.56;
          const horizontalLimit = (size.width / 2 - margin) / Math.max(Math.abs(dx), 0.001);
          const verticalLimit = (dy > 0 ? size.height - pivotY - margin : pivotY - size.height * 0.18 - margin) / Math.max(Math.abs(dy), 0.001);
          const distance = Math.min(469 * unit, horizontalLimit, verticalLimit);
          const [sx, sy] = P.polar([0, 0], distance, spec.target);
          P.sv('path', { d: P.starPath(54, 23, 5), transform: `translate(${sx.toFixed(2)},${sy.toFixed(2)}) scale(${unit})`, fill: '#fbe951', stroke: '#101b29', 'stroke-width': 3 }, svg);
        }

        P.sv('circle', { class: 'rot-ring', r: Rh, fill: 'none', stroke: '#909cb8', 'stroke-width': 2.5 * unit, 'stroke-dasharray': `${12 * unit} ${10 * unit}` }, svg);
      },
      handle: (base, S) => (ctx, g) => {
        const P = S.P;
        const R2D = S.R2D;
        const { spec } = ctx;
        const { unit, top, Rh, dragRadius, sel } = g;
        const hubGrip = spec.grip === 'hub';
        if (!hubGrip) P.sv('line', { x1: 0, y1: -top, x2: 0, y2: -Rh + 9, stroke: 'var(--accent)', 'stroke-width': 1.5 }, sel);
        const handle = P.sv('circle', { class: 'rot-handle' + (spec.shape === 'arrow' ? ' arrow-tip-handle' : ''), cx: 0, cy: -dragRadius, r: 12 * unit, fill: 'var(--panel)', stroke: 'var(--accent)', 'stroke-width': 2.5 }, sel);
        handle.dataset.role = 'handle';
        if (hubGrip) { handle.style.display = 'none'; handle.style.pointerEvents = 'none'; }
        const hub = P.sv('circle', { class: hubGrip ? 'rot-hub' : '', r: 16 * unit, fill: '#9baabc', stroke: '#101b29', 'stroke-width': 3 * unit }, sel);
        if (hubGrip) { hub.dataset.role = 'grip'; hub.style.cursor = 'grab'; }
        return { hubGrip, handle, hub };
      },
      reference: (base, S) => (ctx, g) => {
        const P = S.P;
        const R2D = S.R2D;
        const { util, spec } = ctx;
        const { d, color, svg } = g;
        // Use a frame-owned parent so the kit removes this column before re-rendering.
        const side = util.el('div', 'rot-col', document.querySelector('.side-panel'));
        {
          util.el('div', 'rot-title', side, 'Reference');
          const box = util.el('div', 'reference-box', side);
          const ref = P.sv('svg', { class: 'rot-svg reference-shape', viewBox: '-100 -105 230 150' }, box);
          const rk = 1.7;
          const refShape = P.sv('g', { transform: `rotate(${spec.mode === 'match' ? spec.target : 90}) scale(${rk})` }, ref);
          P.sv('path', { d, fill: color, stroke: '#101b29', 'stroke-width': 2.5 }, refShape);
          P.sv('circle', { r: 20, fill: '#9baabc', stroke: '#101b29', 'stroke-width': 3.5 }, ref);
          util.el('div', 'reference-caption', box, `This shows the ${spec.shape === 'arrow' || spec.shape === 'dart' ? 'pointer' : 'shape'}\nat a different rotation.`);
        }
        return { side };
      },
      readout: (base, S) => (ctx, g) => {
        const P = S.P;
        const R2D = S.R2D;
        const { util, rng, spec } = ctx;
        const fam = env.taskDef;
        const { d, svg, side, paint } = g;
        const readout = spec.mode === 'heading' || rng.bool(0.4) ? util.el('div', 'rot-readout', side) : null;
        let field = null;
        const controls = util.el('div', 'angle-controls', side);
        const buttons = [];
        for (const dir of [-1, 1]) {
          const button = util.el('button', 'turn-button ' + (dir < 0 ? 'turn-left' : 'turn-right'), controls);
          button.type = 'button';
          button.setAttribute('aria-label', dir < 0 ? 'Rotate Left' : 'Rotate Right');
          const icon = P.sv('svg', { viewBox: '0 0 90 120', 'aria-hidden': 'true' }, button);
          const group = P.sv('g', { transform: dir < 0 ? '' : 'translate(90 0) scale(-1 1)' }, icon);
          P.sv('path', { d: 'M65,2 H88 V118 H44 L2,63 L16,36 Z', fill: '#b9baf3', stroke: '#122342', 'stroke-width': 2.5 }, group);
          P.sv('path', { d: 'M43,36 L30,49 L45,61 L43,52 C64,52 66,66 66,85 H73 V67 C73,49 61,43 43,43 Z', fill: '#102447' }, group);
          util.el('span', '', button, dir < 0 ? 'Rotate Left' : 'Rotate Right');
          buttons.push([button, dir]);
        }
        const angleBox = util.el('div', 'current-angle', controls);
        util.el('div', 'angle-label', angleBox, 'Current Angle');
        const angleValue = util.el('div', 'angle-value', angleBox);
        // The design's "Current Angle" box doubles as the typed-angle field (the task's route 'type').
        if (readout && spec.keys) {
          readout.style.display = 'none';
          field = P.angleField(ctx, angleValue, 'Rotation', (a) => {
            const angle = fam.helpers.mod360(a);
            g.rot.set(angle);
            ctx.update({ angle });
            paint();
          });
        }
        return { readout, field, controls, buttons, angleBox, angleValue };
      },
      paint: (base, S) => (ctx, g) => {
        const P = S.P;
        const R2D = S.R2D;
        const { readout, field, angleValue, paint } = g;
        if (!field) angleValue.textContent = `${Math.round(ctx.model.angle) % 360}°`;
        if (field) field.paint(Math.round(ctx.model.angle) % 360);
        else if (readout) readout.textContent = `Rotation: ${Math.round(ctx.model.angle) % 360}°`;
      },
      rotate: (base, S) => (ctx, g) => {
        const P = S.P;
        const R2D = S.R2D;
        const fam = env.taskDef;
        const { dragRadius, svg, sel, handle, paint } = g;
        const rot = env.ui.rotateHandle(sel, handle, {
          label: 'handle',
          pivot: () => P.centerOf(svg),
          radius: dragRadius,
          angle: ctx.model.angle,
          constrain: fam.helpers.mod360,
          place: (el, a) => el.setAttribute('transform', `rotate(${a.toFixed(3)})`),
          onInput(angle) {
            ctx.update({ angle });
            paint();
          },
        });
        return { rot };
      },
      controls: (base, S) => (ctx, g) => {
        const P = S.P;
        const R2D = S.R2D;
        const fam = env.taskDef;
        const { buttons, rot, paint } = g;
        for (const [button, direction] of buttons) button.onclick = () => {
          const angle = fam.helpers.mod360(ctx.model.angle + direction * 5);
          g.rot.set(angle);
          ctx.update({ angle });
          paint();
        };
      },
      placed: (base, S) => (ctx, g) => {
        const P = S.P;
        const R2D = S.R2D;
        const { card } = g;
        const s = ctx.stage.getBoundingClientRect();
        let r = card.getBoundingClientRect();
        if (ctx.spec.scenario === 'orient') {
          // Sample placement with the original canvas bounds, preserving the two RNG draws.
          const oldC = Math.floor(Math.min(560, ctx.size.height - 130, ctx.size.width - 520));
          const cx = (s.left + s.right) / 2, cy = (s.top + s.bottom) / 2;
          r = { left: cx - oldC / 2, right: cx + oldC / 2, top: cy - oldC / 2, bottom: cy + oldC / 2 };
        }
        const lo = [s.left - r.left + 4, s.top - r.top + 4];
        const hi = [s.right - r.right - 4, s.bottom - r.bottom - 4];
        const pick = (a, b) => (b > a ? Math.round(ctx.rng.float(Math.max(a, -90), Math.min(b, 90))) : 0);
        card.style.position = 'relative';
        card.style.left = pick(lo[0], hi[0]) + 'px';
        card.style.top = pick(lo[1], hi[1]) + 'px';
      },
    },
  },
});
