// This design keeps the compact panel dial, brushed metal knob, and value pointer.
env.widget({
  task: 'rotate-object', site: 'design-rotate-object-dial-10', name: 'design', split: 'train',
  scenarios: ['dial'],
  template: 'rotate-object/dial',
  design: {
    parts: {
      frame: (base, S) => (ctx, g) => {
        const P = S.P;
        const { util, rng, size, spec } = ctx;
        const heading = spec.kind === 'heading';
        const chamberInfo = document.querySelector('.chamber pre');
        if (chamberInfo && !heading) {
          chamberInfo.textContent = `Mode   : ${spec.label} Control\nRange  : ${spec.min.toFixed(spec.dec)} – ${spec.max.toFixed(spec.dec)} ${spec.unit.trim()}\nStep   : ${(10 ** -spec.dec).toFixed(spec.dec)} ${spec.unit.trim()}`;
        }
        const Rmax = Math.min(175, Math.floor((size.height - 300) / 2));
        const sampledRadius = rng.int(Math.min(120, Rmax), Rmax);
        const R = Math.min(size.width * 0.225, size.height * 0.28);
        const rg = Math.round(R * rng.float(0.66, 0.76));
        const half = R * 1.48;
        const W = 2 * half;

        const card = util.el('div', 'rot-card', ctx.stage);
        const col = util.el('div', 'rot-col', card);
        util.el('div', 'rot-title', col, heading ? 'Heading' : spec.label + (spec.unit.trim() ? ` (${spec.unit.trim()})` : ''));
        const svg = P.sv('svg', { class: 'rot-svg', width: W, height: W, viewBox: `${-half} ${-half} ${W} ${W}` }, col);
        svg.dataset.role = 'dial';
        return { heading, Rmax, sampledRadius, R, rg, half, W, card, col, svg };
      },
      ticks: (base, S) => (ctx, g) => {
        const P = S.P;
        const { spec } = ctx;
        const fam = env.taskDef;
        const { heading, R, svg } = g;
        const ring = P.sv('g', {}, svg);
        const labelText = (v) => {
          if (!heading) return String(v);
          return { 0: 'N', 90: 'E', 180: 'S', 270: 'W' }[v] ?? String(v);
        };
        for (const v of P.niceTicks(spec, 'minor')) {
          const a = fam.helpers.dialAngleFor(spec, v);
          const rel = (v - spec.min) / spec.major;
          const isMajor = Math.abs(rel - Math.round(rel)) < 1e-6;
          const [x0, y0] = P.polar([0, 0], R * 1.13, a);
          const [x1, y1] = P.polar([0, 0], R * (isMajor ? 1.3 : 1.23), a);
          P.sv('line', { class: isMajor ? 'major' : 'minor', x1: x0, y1: y0, x2: x1, y2: y1 }, ring);
          if (isMajor) {
            const [tx, ty] = P.polar([0, 0], R * 1.47, a);
            const t = P.sv('text', { x: tx, y: ty, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, ring);
            t.textContent = labelText(v);
          }
        }
        return { ring, labelText };
      },
      surface: (base, S) => (ctx, g) => {
        const P = S.P;
        const { R, knob, gid, defs } = g;
        const grad = P.sv('radialGradient', { id: gid, cx: '30%', cy: '25%', r: '90%' }, defs);
        P.sv('stop', { offset: '0%', 'stop-color': '#e5e4e2' }, grad);
        P.sv('stop', { offset: '50%', 'stop-color': '#d5d4d2' }, grad);
        P.sv('stop', { offset: '100%', 'stop-color': '#bebfbd' }, grad);
        const texture = P.sv('filter', { id: gid + '-texture', x: '-5%', y: '-5%', width: '110%', height: '110%' }, defs);
        P.sv('feTurbulence', { type: 'fractalNoise', baseFrequency: '.7', numOctaves: '3', seed: '1', result: 'grain' }, texture);
        const transfer = P.sv('feComponentTransfer', { in: 'grain', result: 'softgrain' }, texture);
        P.sv('feFuncA', { type: 'linear', slope: '.05' }, transfer);
        P.sv('feBlend', { in: 'SourceGraphic', in2: 'softgrain', mode: 'multiply' }, texture);
        P.sv('feDropShadow', { dx: '3', dy: '4', stdDeviation: '2.5', 'flood-color': '#000', 'flood-opacity': '.3' }, texture);
        const rim = P.sv('linearGradient', { id: gid + '-rim', x1: '0%', y1: '0%', x2: '75%', y2: '100%' }, defs);
        P.sv('stop', { offset: '0%', 'stop-color': '#d4d4d2' }, rim);
        P.sv('stop', { offset: '55%', 'stop-color': '#a5a5a1' }, rim);
        P.sv('stop', { offset: '100%', 'stop-color': '#676861' }, rim);
        P.sv('circle', { class: 'knob-rim', r: R, fill: `url(#${gid}-rim)`, stroke: '#babbb8', 'stroke-width': 2 }, knob);
        P.sv('circle', { class: 'knob-fluting', r: R * 0.955, fill: 'none', stroke: '#737570', opacity: 0.22, 'stroke-width': R * 0.065, 'stroke-dasharray': '1 3' }, knob);
        const sampledBevel = ctx.rng.bool();
        P.sv('circle', { class: 'knob-face', r: R * 0.865, fill: `url(#${gid})`, stroke: '#ededeb', 'stroke-width': 2.5, filter: `url(#${gid}-texture)` }, knob);
        return { grad, texture, rim, sampledBevel };
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
          P.sv('line', { class: 'knob-pointer', x1: 0, y1: -(rg - 30), x2: 0, y2: -(R * 0.87), stroke: 'var(--accent)', 'stroke-width': 10, 'stroke-linecap': 'round' }, turn);
        }
        const grip = P.sv('circle', { cx: 0, cy: -rg, r: 13, fill: 'transparent', stroke: 'none' }, turn);
        grip.dataset.role = 'grip';
        return { arc, turn, grip };
      },
    },
  },
});
