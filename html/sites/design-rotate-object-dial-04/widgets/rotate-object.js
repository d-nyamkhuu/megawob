// This design uses a compact adaptive dial with a brushed-metal face and needle.
env.widget({
  task: 'rotate-object',
  site: 'design-rotate-object-dial-04',
  name: 'design',
  split: 'train',
  scenarios: ['dial'],
  template: 'rotate-object/dial',
  design: {
    titleUnits: true,
    unitCaption: false,
    tickRadii: [0.3375, 0.38125, 0.359375, 0.434375],
    parts: {
      frame: (base, S) => (ctx, g) => {
        const { util, rng, size, spec } = ctx;
        const heading = spec.kind === 'heading';
        const Rmax = Math.min(175, Math.floor((size.height - 300) / 2));
        rng.int(Math.min(120, Rmax), Rmax);
        const captionHeight = Math.max(15, Math.min(23, size.width * 0.047)) * 1.2;
        const R = Math.min(
          Math.max(58, Math.round(size.height * 0.27)),
          Math.floor((size.height * 0.805 - captionHeight - 6) / 3.2),
          Math.floor((size.width - 8) / 3.2),
        );
        const rg = Math.round(R * rng.float(0.66, 0.76));
        const half = R * 1.6;
        const W = 2 * half;
        const card = util.el('div', 'rot-card', ctx.stage);
        const col = util.el('div', 'rot-col', card);
        util.el('div', 'rot-title', col, heading ? 'Heading' : spec.label + (spec.unit.trim() ? ` (${spec.unit.trim()})` : ''));
        const svg = S.P.sv('svg', { class: 'rot-svg', width: W, height: W, viewBox: `${-half} ${-half} ${W} ${W}` }, col);
        svg.dataset.role = 'dial';
        return { heading, Rmax, R, rg, half, W, card, col, svg };
      },
      surface: (base, S) => (ctx, g) => {
        const P = S.P;
        const { R, knob, gid, defs } = g;
        const grad = P.sv('linearGradient', { id: gid, x1: '10%', y1: '0%', x2: '80%', y2: '100%' }, defs);
        for (const [offset, color] of [['0%', '#f8fbfd'], ['18%', '#d9dfe4'], ['45%', '#7d8994'], ['67%', '#b9c1c8'], ['100%', '#56636c']]) {
          P.sv('stop', { offset, 'stop-color': color }, grad);
        }
        const faceId = gid + '-face';
        const face = P.sv('linearGradient', { id: faceId, x1: '0%', y1: '0%', x2: '100%', y2: '100%' }, defs);
        for (const [offset, color] of [['0%', '#ffffff'], ['30%', '#d6d7d8'], ['55%', '#b8bcbf'], ['80%', '#d6d8da'], ['100%', '#b5b9bc']]) {
          P.sv('stop', { offset, 'stop-color': color }, face);
        }
        const textureId = gid + '-texture';
        const texture = P.sv('filter', { id: textureId, x: '0%', y: '0%', width: '100%', height: '100%' }, defs);
        P.sv('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.7', numOctaves: 3, seed: 4, result: 'grain' }, texture);
        P.sv('feColorMatrix', { in: 'grain', type: 'saturate', values: 0 }, texture);
        P.sv('feComposite', { in2: 'SourceGraphic', operator: 'in' }, texture);
        P.sv('feBlend', { in2: 'SourceGraphic', mode: 'soft-light' }, texture);
        P.sv('circle', { class: 'metal-rim', r: R, fill: `url(#${gid})`, stroke: 'var(--line)', 'stroke-width': 2 }, knob);
        P.sv('circle', { class: 'metal-face', r: R * 0.88, fill: `url(#${faceId})`, stroke: 'var(--line)', 'stroke-width': 1, 'stroke-dasharray': ctx.rng.bool() ? '2 4' : 'none' }, knob);
        P.sv('circle', { class: 'metal-rim-highlight', r: R * 0.957, fill: 'none', stroke: '#edf1f4', 'stroke-width': 1.6, 'pointer-events': 'none' }, knob);
        P.sv('circle', { class: 'metal-face-edge', r: R * 0.9, fill: 'none', stroke: '#7d8790', 'stroke-width': 1, 'pointer-events': 'none' }, knob);
        const shineId = gid + '-shine';
        const shine = P.sv('radialGradient', { id: shineId, cx: '20%', cy: '22%', r: '85%' }, defs);
        P.sv('stop', { offset: '0%', 'stop-color': '#ffffff', 'stop-opacity': 0.6 }, shine);
        P.sv('stop', { offset: '55%', 'stop-color': '#ffffff', 'stop-opacity': 0.12 }, shine);
        P.sv('stop', { offset: '100%', 'stop-color': '#ffffff', 'stop-opacity': 0 }, shine);
        P.sv('circle', { class: 'metal-shine', r: R * 0.875, fill: `url(#${shineId})`, 'pointer-events': 'none' }, knob);
        P.sv('circle', { class: 'metal-grain', r: R * 0.875, fill: '#c6cdd3', filter: `url(#${textureId})`, opacity: 0.22, 'pointer-events': 'none' }, knob);
        const brushId = gid + '-brush';
        const brush = P.sv('pattern', { id: brushId, width: 3, height: 3, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(-40)' }, defs);
        P.sv('path', { d: 'M0 0H3', stroke: '#ffffff', 'stroke-width': 0.35, opacity: 0.45 }, brush);
        P.sv('path', { d: 'M0 1.5H3', stroke: '#64717c', 'stroke-width': 0.25, opacity: 0.2 }, brush);
        P.sv('circle', { class: 'metal-brush', r: R * 0.875, fill: `url(#${brushId})`, opacity: 0.4, 'pointer-events': 'none' }, knob);
        return { grad, face, texture, shine, brush };
      },
      pointer: (base, S) => (ctx, g) => {
        const P = S.P;
        const { heading, R, rg, knob } = g;
        const arc = heading ? null : P.sv('path', { fill: 'none', stroke: 'var(--accent)', 'stroke-width': 5, 'stroke-linecap': 'round' }, knob);
        const turn = P.sv('g', {}, knob);
        if (heading) {
          P.sv('path', { d: `M0,${-(rg + 16)} L11,-8 L-11,-8 Z`, fill: 'var(--accent)', opacity: 0.85 }, turn);
          P.sv('path', { d: `M0,${rg * 0.55} L8,8 L-8,8 Z`, fill: 'var(--muted)', opacity: 0.6 }, turn);
        } else {
          P.sv('line', { x1: 0, y1: -(rg - R * 0.14), x2: 0, y2: -(rg + R * 0.14), stroke: 'var(--muted)', 'stroke-width': 3, 'stroke-linecap': 'round' }, turn);
        }
        P.sv('circle', { r: 9, fill: 'var(--fg)', opacity: 0.75 }, knob);
        const grip = P.sv('circle', { cx: 0, cy: -rg, r: 13, fill: 'var(--accent)', stroke: '#fff', 'stroke-width': 3 }, turn);
        grip.dataset.role = 'grip';
        return { arc, turn, grip };
      },
      input: (base, S) => (ctx, g) => {
        const result = base(ctx, g);
        const initialAngle = ctx.model.angle;
        const reset = document.querySelector('.reset-button');
        if (reset) reset.onclick = () => {
          g.dial.set(initialAngle);
          ctx.update({ ...ctx.model, angle: initialAngle });
          g.paint();
        };
        return result;
      },
    },
  },
});
