// This design adds the harbor dial's fixed-size layout, textured face, and current-value readout.
env.widget({
  task: 'rotate-object',
  site: 'design-rotate-object-dial-09',
  name: 'design',
  split: 'train',
  scenarios: ['dial'],
  template: 'rotate-object/dial',
  design: {
    sync: 'dial',
    parts: {
      frame: (base, S) => (ctx, g) => {
        const { util, rng, size, spec } = ctx;
        const heading = spec.kind === 'heading';
        const Rmax = Math.min(175, Math.floor((size.height - 300) / 2));
        rng.int(Math.min(120, Rmax), Rmax);
        const R = Math.max(55, Math.min(size.width / 2 - 78, size.height / 2 - 88));
        const rg = Math.round(R * rng.float(0.66, 0.76));
        const half = R + 54;
        const W = 2 * half;
        const card = util.el('div', 'rot-card', ctx.stage);
        const col = util.el('div', 'rot-col', card);
        util.el('div', 'rot-title', col, heading ? 'Heading Dial' : spec.label + (spec.unit.trim() ? ` (${spec.unit.trim()})` : ''));
        const svg = S.P.sv('svg', { class: 'rot-svg', width: W, height: W, viewBox: `${-half} ${-half} ${W} ${W}` }, col);
        svg.dataset.role = 'dial';
        return { heading, Rmax, R, rg, half, W, card, col, svg };
      },
      ticks: (base, S) => (ctx, g) => {
        const P = S.P;
        const { spec } = ctx;
        const fam = env.taskDef;
        const { R, svg } = g;
        const defs = P.sv('defs', {}, svg);
        const texture = P.sv('filter', { id: 'harbor-face-texture', x: '0%', y: '0%', width: '100%', height: '100%' }, defs);
        P.sv('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.8, numOctaves: 3, seed: 17, result: 'grain' }, texture);
        P.sv('feColorMatrix', { in: 'grain', type: 'saturate', values: 0 }, texture);
        const fade = P.sv('feComponentTransfer', {}, texture);
        P.sv('feFuncA', { type: 'linear', slope: 0.12 }, fade);
        P.sv('feComposite', { in2: 'SourceGraphic', operator: 'in' }, texture);
        P.sv('feBlend', { in2: 'SourceGraphic', mode: 'multiply' }, texture);
        const ringGrad = P.sv('radialGradient', { id: 'harbor-ring', cx: '46%', cy: '40%', r: '70%' }, defs);
        P.sv('stop', { offset: '0%', 'stop-color': '#faf9f6' }, ringGrad);
        P.sv('stop', { offset: '100%', 'stop-color': '#e8e7e2' }, ringGrad);
        P.sv('circle', { r: R + 26, fill: 'url(#harbor-ring)', stroke: '#8d8b85', 'stroke-width': 1.5 }, svg);
        const ring = P.sv('g', {}, svg);
        const labelText = (v) => String(v);
        for (const v of P.niceTicks(spec, 'minor')) {
          const a = fam.helpers.dialAngleFor(spec, v);
          const rel = (v - spec.min) / spec.major;
          const isMajor = Math.abs(rel - Math.round(rel)) < 1e-6;
          const [x0, y0] = P.polar([0, 0], R + (isMajor ? -7 : 8), a);
          const [x1, y1] = P.polar([0, 0], R + (isMajor ? 22 : 15), a);
          P.sv('line', { class: isMajor ? 'major' : 'minor', x1: x0, y1: y0, x2: x1, y2: y1 }, ring);
          if (isMajor) {
            const [tx, ty] = P.polar([0, 0], R + 40, a);
            const t = P.sv('text', { x: tx, y: ty, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, ring);
            t.textContent = labelText(v);
          }
        }
        return { ring, labelText, defs };
      },
      surface: (base, S) => (ctx, g) => {
        const P = S.P;
        const { R, knob, gid, defs } = g;
        const grad = P.sv('radialGradient', { id: gid, cx: '40%', cy: '35%', r: '75%' }, defs);
        P.sv('stop', { offset: '0%', 'stop-color': '#3c3d3c' }, grad);
        P.sv('stop', { offset: '100%', 'stop-color': '#252625' }, grad);
        knob.style.filter = 'drop-shadow(5px 9px 7px #0005)';
        const rimGrad = P.sv('linearGradient', { id: 'harbor-rim', x1: '15%', y1: '0%', x2: '85%', y2: '100%' }, defs);
        P.sv('stop', { offset: '0%', 'stop-color': '#70716e' }, rimGrad);
        P.sv('stop', { offset: '48%', 'stop-color': '#363733' }, rimGrad);
        P.sv('stop', { offset: '100%', 'stop-color': '#11120f' }, rimGrad);
        P.sv('circle', { r: R * 0.77, fill: 'url(#harbor-rim)', stroke: '#252623', 'stroke-width': 2 }, knob);
        for (let k = 0; k < 100; k++) {
          const p0 = P.polar([0, 0], R * 0.72, k * 3.6);
          const p1 = P.polar([0, 0], R * 0.768, k * 3.6 + 0.6);
          P.sv('line', { x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], stroke: '#111', 'stroke-width': 2.5, opacity: 0.55 }, knob);
          P.sv('line', { x1: p0[0] + 1, y1: p0[1], x2: p1[0] + 1, y2: p1[1], stroke: '#ddd', 'stroke-width': 0.8, opacity: 0.23 }, knob);
        }
        P.sv('circle', { r: R * 0.712, fill: `url(#${gid})`, stroke: '#646561', 'stroke-width': 2.5, filter: 'url(#harbor-face-texture)' }, knob);
        P.sv('circle', { r: R * 0.693, fill: 'none', stroke: '#131413', 'stroke-width': 1.5, opacity: ctx.rng.bool() ? 0.85 : 0.95 }, knob);
        return { grad, rimGrad };
      },
      pointer: (base, S) => (ctx, g) => {
        const P = S.P;
        const { heading, R, rg, knob } = g;
        const arc = heading ? null : P.sv('path', { fill: 'none', stroke: 'var(--accent)', 'stroke-width': 5, 'stroke-linecap': 'round' }, knob);
        const turn = P.sv('g', {}, knob);
        P.sv('line', { x1: 0, y1: -(R * 0.47), x2: 0, y2: -(R * 0.64), stroke: '#080808', 'stroke-width': 11, 'stroke-linecap': 'round' }, turn);
        P.sv('line', { x1: 0, y1: -(R * 0.47), x2: 0, y2: -(R * 0.64), stroke: '#f4f3ef', 'stroke-width': 7, 'stroke-linecap': 'round' }, turn);
        const grip = P.sv('circle', { cx: 0, cy: -rg, r: 13, fill: 'transparent', stroke: 'none' }, turn);
        grip.dataset.role = 'grip';
        return { arc, turn, grip };
      },
      readout: (base, S) => (ctx, g) => {
        const { util, rng, spec } = ctx;
        const { col, heading } = g;
        const slot = document.querySelector('[data-slot="current"]');
        const curLabel = document.querySelector('.cur-label');
        if (curLabel && !heading) curLabel.textContent = `Current ${spec.label}`;
        const readout = (spec.readout || slot) ? util.el('div', 'rot-readout', slot || col) : null;
        const hints = ['Drag the grip around the dial'];
        if (spec.wheel) hints.push(rng.pick(['Scroll over the knob to fine-tune', 'Mouse wheel adjusts in steps']));
        if (!spec.readout || spec.wheel) {
          const hint = rng.pick(hints.slice(-1).concat(hints));
          util.el('div', 'rot-muted', col, heading ? 'Rotate to set course (°)' : hint);
        } else util.el('div', 'rot-muted', col, heading ? 'Rotate to set course (°)' : 'Rotate to set the value');
        return { readout, hints };
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
