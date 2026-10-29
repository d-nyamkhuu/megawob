// This design restores the sampled dial geometry, unit labels, textured silver knob, and dark needle.
env.widget({
  task: 'rotate-object', site: 'design-rotate-object-dial-05', name: 'design', split: 'train',
  scenarios: ['dial'],
  template: 'rotate-object/dial',
  design: {
    dialSize: null,
    titleUnits: true,
    unitCaption: false,
    tickUnits: 'px',
    tickRadii: [8, 22, 15, 40],
    parts: {
      frame: (base) => (ctx, g) => {
        const out = base(ctx, g);
        const { spec } = ctx;
        const heading = spec.kind === 'heading';
        const unitsCard = document.querySelector('.card-units .card-text');
        const referenceCard = document.querySelector('.card-ref .card-text');
        const firstStep = document.querySelector('.step.current .step-label');
        if (spec.unit.trim() !== 'min') {
          if (unitsCard) unitsCard.textContent = heading ? 'Degrees (°)' : ({ '°C': 'Celsius (°C)', '°F': 'Fahrenheit (°F)' }[spec.unit.trim()] || spec.unit.trim());
          if (referenceCard) referenceCard.textContent = 'Turn the knob to the required value. Use the marked scale. Units are ' + (heading ? 'degrees (°).' : spec.unit.trim() + '.');
          if (firstStep) firstStep.textContent = heading ? 'Set heading' : 'Set dial';
        }
        return out;
      },
      surface: (base, S) => (ctx, g) => {
        const P = S.P;
        const { R, knob, gid, defs } = g;
        const grad = P.sv('linearGradient', { id: gid, x1: '0%', y1: '0%', x2: '0%', y2: '100%' }, defs);
        P.sv('stop', { offset: '0%', 'stop-color': '#fafbfc' }, grad);
        P.sv('stop', { offset: '65%', 'stop-color': '#d3d5d7' }, grad);
        P.sv('stop', { offset: '100%', 'stop-color': '#939699' }, grad);
        const faceGrad = P.sv('linearGradient', { id: gid + '-face', x1: '0%', y1: '0%', x2: '80%', y2: '100%' }, defs);
        P.sv('stop', { offset: '0%', 'stop-color': '#eef0f1' }, faceGrad);
        P.sv('stop', { offset: '100%', 'stop-color': '#dfe1e3' }, faceGrad);
        const texture = P.sv('filter', { id: gid + '-texture' }, defs);
        P.sv('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.8, numOctaves: 3, seed: 5, result: 'noise' }, texture);
        P.sv('feColorMatrix', { in: 'noise', type: 'saturate', values: 0, result: 'gray' }, texture);
        const fade = P.sv('feComponentTransfer', { in: 'gray', result: 'grain' }, texture);
        P.sv('feFuncA', { type: 'linear', slope: 0.07 }, fade);
        P.sv('feComposite', { in: 'grain', in2: 'SourceGraphic', operator: 'in', result: 'clipped-grain' }, texture);
        P.sv('feBlend', { in: 'SourceGraphic', in2: 'clipped-grain', mode: 'multiply' }, texture);
        P.sv('circle', { class: 'knob-rim', r: R, fill: `url(#${gid})`, stroke: '#c8cbcd', 'stroke-width': 2 }, knob);
        const flutes = P.sv('g', { class: 'knob-flutes' }, knob);
        for (let k = 0; k < 100; k++) {
          const p = P.polar([0, 0], R * 0.954, k * 3.6);
          const q = P.polar([0, 0], R * 0.989, k * 3.6);
          P.sv('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1] }, flutes);
        }
        P.sv('circle', {
          class: 'knob-face', r: R * 0.89, fill: `url(#${gid}-face)`, filter: `url(#${gid}-texture)`,
          stroke: '#f9fafb', 'stroke-width': 1,
          'stroke-dasharray': ctx.rng.bool() ? '2 4' : 'none',
        }, knob);
        return { grad, faceGrad, texture, fade, flutes };
      },
      pointer: (base, S) => (ctx, g) => {
        const P = S.P;
        const { heading, rg, R, knob } = g;
        const arc = heading ? null : P.sv('path', { fill: 'none', stroke: 'var(--accent)', 'stroke-width': 5, 'stroke-linecap': 'round' }, knob);
        const turn = P.sv('g', {}, knob);
        if (heading) {
          P.sv('path', { d: `M0,${-(rg + 16)} L11,-8 L-11,-8 Z`, fill: 'var(--accent)', opacity: 0.85 }, turn);
          P.sv('path', { d: `M0,${rg * 0.55} L8,8 L-8,8 Z`, fill: 'var(--muted)', opacity: 0.6 }, turn);
        } else {
          P.sv('line', { class: 'knob-needle', x1: 0, y1: -R * 0.24, x2: 0, y2: -R * 0.89, stroke: '#303030', 'stroke-width': 7, 'stroke-linecap': 'round' }, turn);
        }
        P.sv('circle', { r: 9, fill: 'var(--fg)', opacity: 0.75 }, knob);
        const grip = P.sv('circle', { cx: 0, cy: -rg, r: 13, fill: 'var(--accent)', stroke: '#fff', 'stroke-width': 3 }, turn);
        grip.dataset.role = 'grip';
        return { arc, turn, grip };
      },
      readout: (base) => (ctx, g) => {
        const out = base(ctx, g);
        out.readout.dataset.caption = ctx.spec.kind === 'heading' ? 'Current heading' : 'Current ' + ctx.spec.label.toLowerCase();
        return out;
      },
    },
  },
});
