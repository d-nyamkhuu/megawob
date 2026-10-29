// This design uses a compact, striped dial with a value readout and adjustable steps.
env.widget({
  task: 'rotate-object', site: 'design-rotate-object-dial-07', name: 'design', split: 'train',
  scenarios: ['dial'],
  template: 'rotate-object/dial',
  design: {
    sync: 'paint',
    parts: {
      frame: (base, S) => (ctx, g) => {
        const P = S.P;
        const { util, rng, size, spec } = ctx;
        const heading = spec.kind === 'heading';
        const Rmax = Math.min(185, Math.floor(size.height * 0.25));
        const R = rng.int(Math.floor(Rmax * 0.99), Rmax);
        const rg = Math.round(R * rng.float(0.66, 0.76));
        const half = R + 64;
        const W = 2 * half;
        const card = util.el('div', 'rot-card', ctx.stage);
        const col = util.el('div', 'rot-col', card);
        util.el('div', 'rot-title', col, heading ? 'Heading' : spec.label + (spec.unit.trim() ? ` (${spec.unit.trim()})` : ''));
        const svg = P.sv('svg', { class: 'rot-svg', width: W, height: W, viewBox: `${-half} ${-half} ${W} ${W}` }, col);
        svg.dataset.role = 'dial';
        return { heading, Rmax, R, rg, half, W, card, col, svg };
      },
      ticks: (base, S) => (ctx, g) => {
        const P = S.P;
        const { spec } = ctx;
        const fam = env.taskDef;
        const { heading, R, svg } = g;
        const ring = P.sv('g', {}, svg);
        const labelText = (v) => !heading ? String(v) : ({ 0: 'N', 90: 'E', 180: 'S', 270: 'W' }[v] ?? String(v));
        const visualTicks = { ...spec, minor: Math.min(spec.minor, spec.major / 10) };
        for (const v of P.niceTicks(visualTicks, 'minor')) {
          const a = fam.helpers.dialAngleFor(spec, v);
          const rel = (v - spec.min) / spec.major;
          const isMajor = Math.abs(rel - Math.round(rel)) < 1e-6;
          const [x0, y0] = P.polar([0, 0], R + 14, a);
          const [x1, y1] = P.polar([0, 0], R + (isMajor ? 37 : 25), a);
          P.sv('line', { class: isMajor ? 'major' : 'minor', x1: x0, y1: y0, x2: x1, y2: y1 }, ring);
          if (isMajor) {
            const [tx, ty] = P.polar([0, 0], R + 68, a);
            const t = P.sv('text', { x: tx, y: ty, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, ring);
            t.textContent = labelText(v);
          }
        }
        return { ring, labelText };
      },
      surface: (base, S) => (ctx, g) => {
        const P = S.P;
        const { R, knob, gid, defs } = g;
        const grad = P.sv('radialGradient', { id: gid, cx: '40%', cy: '35%', r: '75%' }, defs);
        P.sv('stop', { offset: '0%', 'stop-color': 'var(--panel)' }, grad);
        P.sv('stop', { offset: '100%', 'stop-color': 'color-mix(in srgb, var(--line) 70%, var(--panel))' }, grad);
        const pat = P.sv('pattern', { id: gid + 'h', width: 8, height: 4, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(-45)' }, defs);
        P.sv('rect', { width: 8, height: 4, fill: '#f4f4f2' }, pat);
        P.sv('rect', { width: 6.5, height: 1.4, fill: '#111' }, pat);
        P.sv('circle', { r: R + 3, fill: '#fff', stroke: '#111', 'stroke-width': 3 }, knob);
        P.sv('circle', { r: R, fill: `url(#${gid}h)`, stroke: '#111', 'stroke-width': 2 }, knob);
        P.sv('circle', { r: R * 0.96, fill: 'none', stroke: '#111', 'stroke-width': 2, 'stroke-dasharray': ctx.rng.bool() ? '2 4' : 'none' }, knob);
        return { grad, pat };
      },
      pointer: (base, S) => (ctx, g) => {
        const P = S.P;
        const { heading, R, rg, knob, gid } = g;
        const arc = heading ? null : P.sv('path', { fill: 'none', stroke: 'var(--accent)', 'stroke-width': 5, 'stroke-linecap': 'round' }, knob);
        const turn = P.sv('g', {}, knob);
        if (heading) {
          P.sv('path', { d: `M0,${-(rg + 16)} L11,-8 L-11,-8 Z`, fill: 'var(--accent)', opacity: 0.85 }, turn);
          P.sv('path', { d: `M0,${rg * 0.55} L8,8 L-8,8 Z`, fill: 'var(--muted)', opacity: 0.6 }, turn);
        } else {
          P.sv('path', { d: `M-5,-8 L-3,${-R + 12} L3,${-R + 12} L5,-8 Z`, fill: '#111' }, turn);
        }
        P.sv('circle', { r: 14, fill: `url(#${gid}h)`, stroke: '#111', 'stroke-width': 3 }, knob);
        const grip = P.sv('circle', { cx: 0, cy: -rg, r: 13, fill: 'transparent', stroke: 'none' }, turn);
        grip.dataset.role = 'grip';
        return { arc, turn, grip };
      },
      readout: (base, S) => (ctx, g) => {
        const { util, rng, spec } = ctx;
        const { card, col } = g;
        const readout = util.el('div', 'rot-readout', card);
        const hints = ['Drag the grip around the dial'];
        if (spec.wheel) hints.push(rng.pick(['Scroll over the knob to fine-tune', 'Mouse wheel adjusts in steps']));
        if (!spec.readout || spec.wheel) util.el('div', 'rot-muted', col, rng.pick(hints.slice(-1).concat(hints)));
        const facts = document.querySelector('.task-facts');
        const heading = spec.kind === 'heading';
        const unit = heading ? '°' : spec.unit.trim();
        const targetNumber = (document.querySelector('.instruction')?.firstChild?.textContent || '').match(/[-+]?\d+(?:\.\d+)?/);
        const targetValue = Number.isFinite(spec.target) ? spec.target : targetNumber ? Number(targetNumber[0]) : null;
        const tolerance = spec.tau;
        if (facts) {
          facts.querySelector('[data-fact="target"]').textContent = targetValue !== null
            ? `${targetValue.toFixed(spec.dec)} ${unit} (±${tolerance.toFixed(spec.dec)} ${unit})`
            : 'See task';
          facts.querySelector('[data-fact="units"]').textContent = unit;
        }
        return { readout, hints, facts };
      },
      paint: (base, S) => (ctx, g) => {
        base(ctx, g);
        const { spec } = ctx;
        const { readout, facts } = g;
        if (facts && readout) facts.querySelector('[data-fact="current"]').textContent = readout.textContent;
      },
      dial: (base, S) => (ctx, g) => {
        const P = S.P;
        const { spec } = ctx;
        const fam = env.taskDef;
        const { svg, rg, knob, paint } = g;
        const dial = env.ui.dial(knob, {
          label: 'dial',
          center: () => P.centerOf(svg),
          radius: rg,
          angle: ctx.model.angle,
          start: spec.start,
          sweep: spec.sweep,
          min: spec.min,
          max: spec.max,
          constrain: (a) => fam.helpers.clampDial(spec, a),
          onInput(angle) {
            const stepFactor = g.stepFactor === undefined ? 1 : g.stepFactor;
            if (stepFactor !== 1) {
              const step = (spec.minor * stepFactor) / 10;
              const v = fam.helpers.dialValue(spec, angle);
              angle = fam.helpers.clampDial(spec, fam.helpers.dialAngleFor(spec, Math.round(v / step) * step));
            }
            ctx.update({ angle });
            paint();
          },
        });
        return { dial };
      },
      controls: (base, S) => (ctx, g) => {
        const initialAngle = ctx.model.angle;
        g.stepFactor = 1;
        const reset = document.querySelector('.btn-reset');
        const smaller = document.querySelector('.btn-small');
        const larger = document.querySelector('.btn-large');
        if (reset) reset.onclick = () => {
          g.stepFactor = 1;
          g.dial.set(initialAngle);
          ctx.update({ angle: initialAngle });
          g.paint();
        };
        if (smaller) smaller.onclick = () => {
          g.stepFactor = Math.max(0.125, g.stepFactor / 2);
          g.svg.dataset.step = g.stepFactor;
          smaller.setAttribute('aria-label', `Smaller Step: ${g.stepFactor} times`);
        };
        if (larger) larger.onclick = () => {
          g.stepFactor = Math.min(8, g.stepFactor * 2);
          g.svg.dataset.step = g.stepFactor;
          larger.setAttribute('aria-label', `Larger Step: ${g.stepFactor} times`);
        };
      },
    },
  },
});
