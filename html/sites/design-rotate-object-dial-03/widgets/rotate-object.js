// The dial keeps its panel-sized geometry, engraved dark bezel and vessel readout.
env.widget({
  task: 'rotate-object', site: 'design-rotate-object-dial-03', name: 'design', split: 'train',
  scenarios: ['dial'],
  template: 'rotate-object/dial',
  design: {
    parts: {
      frame: (base, S) => (ctx, g) => {
        const P = S.P;
        const { util, rng, size, spec } = ctx;
        const heading = spec.kind === 'heading';
        const Rmax = Math.min(175, Math.floor((size.height - 300) / 2));
        const sampledR = rng.int(Math.min(120, Rmax), Rmax);
        const gripRatio = rng.float(0.66, 0.76);
        const R = Math.max(45, Math.min(size.width * 0.267, size.height * 0.31));
        const rg = Math.round(R * gripRatio);
        const half = R + Math.min(64, size.height / 2 - R - 6);
        const W = 2 * half;

        const card = util.el('div', 'rot-card', ctx.stage);
        const col = util.el('div', 'rot-col', card);
        util.el('div', 'rot-title', col, heading ? 'Heading' : spec.label + (spec.unit.trim() ? ` (${spec.unit.trim()})` : ''));
        const svg = P.sv('svg', { class: 'rot-svg', width: W, height: W, viewBox: `${-half} ${-half} ${W} ${W}` }, col);
        svg.dataset.role = 'dial';
        return { heading, Rmax, sampledR, R, rg, half, W, card, col, svg };
      },
      ticks: (base, S) => (ctx, g) => {
        const P = S.P;
        const { spec } = ctx;
        const fam = env.taskDef;
        const { heading, R, svg } = g;
        const ring = P.sv('g', {}, svg);
        const labelText = (v) => String(v);
        const ticks = heading ? Array.from({ length: 72 }, (_, k) => k * 5) : P.niceTicks(spec, 'minor');
        for (const v of ticks) {
          const a = fam.helpers.dialAngleFor(spec, v);
          const rel = (v - spec.min) / (heading ? 30 : spec.major);
          const isMajor = Math.abs(rel - Math.round(rel)) < 1e-6;
          const [x0, y0] = P.polar([0, 0], R * 1.06, a);
          const [x1, y1] = P.polar([0, 0], R * (isMajor ? 1.164 : 1.112), a);
          P.sv('line', { class: isMajor ? 'major' : 'minor', x1: x0, y1: y0, x2: x1, y2: y1 }, ring);
          if (isMajor) {
            const [tx, ty] = P.polar([0, 0], R * 1.373, a);
            const t = P.sv('text', { x: tx, y: ty, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, ring);
            t.textContent = labelText(v);
          }
        }
        return { ring, labelText };
      },
      surface: (base, S) => (ctx, g) => {
        const P = S.P;
        const { rng } = ctx;
        const { R, knob, gid, defs } = g;
        const grad = P.sv('radialGradient', { id: gid, gradientUnits: 'userSpaceOnUse', cx: -R * 0.3, cy: -R * 0.5, r: R * 1.9 }, defs);
        P.sv('stop', { offset: '0%', 'stop-color': '#373d40' }, grad);
        P.sv('stop', { offset: '100%', 'stop-color': '#22272a' }, grad);
        const rimGrad = P.sv('linearGradient', { id: gid + '-rim', x1: '0%', y1: '0%', x2: '100%', y2: '100%' }, defs);
        P.sv('stop', { offset: '0%', 'stop-color': '#41474a' }, rimGrad);
        P.sv('stop', { offset: '45%', 'stop-color': '#303639' }, rimGrad);
        P.sv('stop', { offset: '100%', 'stop-color': '#202528' }, rimGrad);
        const texture = P.sv('filter', { id: gid + '-grain' }, defs);
        P.sv('feTurbulence', { type: 'fractalNoise', baseFrequency: '.8', numOctaves: 3, stitchTiles: 'stitch', result: 'noise' }, texture);
        P.sv('feColorMatrix', { in: 'noise', type: 'saturate', values: 0, result: 'mono' }, texture);
        const soften = P.sv('feComponentTransfer', { in: 'mono', result: 'soft' }, texture);
        P.sv('feFuncA', { type: 'linear', slope: '.09' }, soften);
        P.sv('feComposite', { in: 'soft', in2: 'SourceGraphic', operator: 'in', result: 'clipped' }, texture);
        P.sv('feBlend', { in: 'SourceGraphic', in2: 'clipped', mode: 'soft-light' }, texture);
        P.sv('circle', { r: R, fill: `url(#${gid})`, stroke: '#151b1e', 'stroke-width': 2 }, knob);
        const rimStyle = rng.bool();
        for (let k = 0; k < 44; k++) {
          const a = (k * 360) / 44;
          const p = [
            P.polar([0, 0], R * 0.87, a - 3.6), P.polar([0, 0], R, a - 3.6),
            P.polar([0, 0], R, a + 3.6), P.polar([0, 0], R * 0.87, a + 3.6),
          ];
          P.sv('path', { d: `M${p.map((pt) => pt.join(',')).join(' L')} Z`, fill: `url(#${gid}-rim)`, stroke: '#111719', 'stroke-width': 1 }, knob);
          const p0 = P.polar([0, 0], R * 0.88, a - 3.4);
          const p1 = P.polar([0, 0], R * 0.985, a - 3.4);
          P.sv('line', { x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], stroke: '#667071', 'stroke-width': 0.7, opacity: 0.7 }, knob);
        }
        P.sv('circle', { r: R * 0.835, fill: `url(#${gid})`, stroke: '#626a6c', 'stroke-width': 3, filter: `url(#${gid}-grain)` }, knob);
        P.sv('circle', { r: R * 0.817, fill: 'none', stroke: '#202628', 'stroke-width': 1 }, knob);
        return { grad, rimGrad, texture, rimStyle };
      },
      pointer: (base, S) => (ctx, g) => {
        const P = S.P;
        const { R, knob } = g;
        const arc = g.heading ? null : P.sv('path', { fill: 'none', stroke: 'var(--accent)', 'stroke-width': 5, 'stroke-linecap': 'round' }, knob);
        const turn = P.sv('g', {}, knob);
        P.sv('rect', { class: 'dial-pointer', x: -5, y: -R * 0.82, width: 10, height: R * 0.52, rx: 2 }, turn);
        P.sv('circle', { r: 9, fill: 'var(--fg)', opacity: 0.75 }, knob);
        const grip = P.sv('circle', { cx: 0, cy: -g.rg, r: 13, fill: 'var(--accent)', stroke: '#fff', 'stroke-width': 3 }, turn);
        grip.dataset.role = 'grip';
        return { arc, turn, grip };
      },
      readout: (base, S) => (ctx, g) => {
        const { util, rng, spec } = ctx;
        const { col } = g;
        const readout = spec.readout ? util.el('div', 'rot-readout', col) : null;
        const hints = ['Drag the grip around the dial'];
        const meta = document.querySelector('.meta');
        if (meta && !g.heading) meta.textContent = 'Vessel: NR-417   |   Mode: Manual   |   Unit: ' + spec.unit.trim();
        if (spec.wheel) hints.push(rng.pick(['Scroll over the knob to fine-tune', 'Mouse wheel adjusts in steps']));
        if (!readout || spec.wheel) util.el('div', 'rot-muted', col, rng.pick(hints.slice(-1).concat(hints)));
        return { readout, hints, meta };
      },
      paint: (base, S) => (ctx, g) => {
        base(ctx, g);
        const { spec, model } = ctx;
        const curBox = document.getElementById('cur-heading');
        if (curBox) {
          const cv = env.taskDef.helpers.dialValue(spec, model.angle);
          curBox.textContent = g.heading ? `${Math.round(cv) % 360}°` : `${cv.toFixed(spec.dec)}${spec.unit}`;
        }
      },
    },
  },
});
