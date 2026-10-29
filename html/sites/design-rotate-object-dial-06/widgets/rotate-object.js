// Dark instrument dial with a sampled radius, dense heading ticks, and the site's external readout.
env.widget({
  task: 'rotate-object',
  site: 'design-rotate-object-dial-06',
  name: 'design',
  split: 'train',
  scenarios: ['dial'],
  template: 'rotate-object/dial',
  design: {
    forceReadout: false,
    sync: 'dial',
    titleUnits: true,
    unitCaption: false,
    parts: {
      frame: (base, S) => (ctx) => {
        const P = S.P;
        const { util, rng, size, spec } = ctx;
        const heading = spec.kind === 'heading';
        const Rmax = Math.min(175, Math.max(60, Math.floor(size.height / 2.96)));
        const R = rng.int(Math.min(120, Rmax), Rmax);
        const rg = Math.round(R * rng.float(0.66, 0.76));
        const half = R * 1.48;
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
        const labelText = (v) => String(v);
        const ticks = heading ? Array.from({ length: 72 }, (_, i) => i * 5) : P.niceTicks(spec, 'minor');
        for (const v of ticks) {
          const a = fam.helpers.dialAngleFor(spec, v);
          const rel = (v - spec.min) / spec.major;
          const isMajor = heading ? v % 30 === 0 : Math.abs(rel - Math.round(rel)) < 1e-6;
          const [x0, y0] = P.polar([0, 0], R * 1.09, a);
          const [x1, y1] = P.polar([0, 0], R * (isMajor ? 1.25 : 1.19), a);
          P.sv('line', { class: isMajor ? 'major' : 'minor', x1: x0, y1: y0, x2: x1, y2: y1 }, ring);
          if (isMajor) {
            const [tx, ty] = P.polar([0, 0], R * 1.41, a);
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
        const grad = P.sv('radialGradient', { id: gid, cx: '40%', cy: '35%', r: '75%' }, defs);
        P.sv('stop', { offset: '0%', 'stop-color': '#30373a' }, grad);
        P.sv('stop', { offset: '70%', 'stop-color': '#202729' }, grad);
        P.sv('stop', { offset: '100%', 'stop-color': '#101719' }, grad);
        const grain = P.sv('filter', { id: gid + '-grain', x: '0%', y: '0%', width: '100%', height: '100%' }, defs);
        P.sv('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.85, numOctaves: 3, seed: 7, result: 'noise' }, grain);
        P.sv('feColorMatrix', { type: 'saturate', values: 0 }, grain);
        P.sv('feComposite', { in2: 'SourceAlpha', operator: 'in' }, grain);
        P.sv('circle', { class: 'rot-body', r: R, fill: `url(#${gid})`, stroke: '#3e484c', 'stroke-width': 3 }, knob);
        P.sv('circle', { r: R * 0.93, filter: `url(#${gid}-grain)`, opacity: 0.055, 'pointer-events': 'none' }, knob);
        P.sv('circle', { class: 'rot-bevel', r: R * 0.94, fill: 'none', stroke: '#080d0f', 'stroke-width': 2, 'stroke-dasharray': rng.bool() ? '2 4' : 'none' }, knob);
        return { grad, grain };
      },
      pointer: (base, S) => (ctx, g) => {
        const P = S.P;
        const { heading, R, rg, knob } = g;
        const arc = heading ? null : P.sv('path', { fill: 'none', stroke: 'var(--accent)', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0 }, knob);
        const turn = P.sv('g', {}, knob);
        P.sv('line', { x1: 0, y1: -(R * 0.45), x2: 0, y2: -(R * 0.9), stroke: '#fff', 'stroke-width': R * 0.065, 'stroke-linecap': 'round' }, turn);
        P.sv('circle', { class: 'rot-cap', r: R * 0.5, fill: `url(#${g.gid})`, stroke: '#414b4f', 'stroke-width': R * 0.025 }, knob);
        P.sv('circle', { r: R * 0.46, filter: `url(#${g.gid}-grain)`, opacity: 0.07, 'pointer-events': 'none' }, knob);
        P.sv('path', { d: P.arcPath(R * 0.46, -65, 45), fill: 'none', stroke: '#8b9294', 'stroke-width': 1.2 }, knob);
        const grip = P.sv('circle', { cx: 0, cy: -rg, r: 13, fill: '#fff', opacity: 0 }, turn);
        grip.dataset.role = 'grip';
        return { arc, turn, grip };
      },
      readout: (base, S) => (ctx, g) => {
        const P = S.P;
        const { util, rng, spec } = ctx;
        const { heading, col } = g;
        let readout = spec.readout ? util.el('div', 'rot-readout', col) : null;
        const hints = ['Drag the grip around the dial'];
        if (spec.wheel) hints.push(rng.pick(['Scroll over the knob to fine-tune', 'Mouse wheel adjusts in steps']));
        if (!readout || spec.wheel) util.el('div', 'rot-muted', col, rng.pick(hints.slice(-1).concat(hints)));
        if (!readout) readout = util.el('div', 'rot-readout', col);
        const side = document.querySelector('.center-col');
        side.append(readout);
        const readoutValue = util.el('span', 'display-value', readout);
        const fitValue = (box) => {
          const value = box.querySelector('.display-value');
          const available = box.clientWidth * 0.88;
          const scale = Math.min(0.74, available / value.offsetWidth);
          value.style.transform = `scaleX(${scale})`;
          value.style.marginRight = `${value.offsetWidth * (scale - 1)}px`;
        };
        const statusRows = document.querySelectorAll('.st-row');
        if (!heading) {
          statusRows[1].lastElementChild.textContent = spec.unit.trim() || 'Value';
          statusRows[2].lastElementChild.textContent = `${spec.min} – ${spec.max}`;
          statusRows[3].lastElementChild.textContent = String(spec.step || spec.minor);
        }
        return { readout, hints, readoutValue, fitValue };
      },
      paint: (base, S) => (ctx, g) => {
        const P = S.P;
        const { spec } = ctx;
        const fam = env.taskDef;
        const { heading, R, arc, turn, readout, readoutValue, fitValue } = g;
        const a = ctx.model.angle;
        turn.setAttribute('transform', `rotate(${a.toFixed(3)})`);
        if (arc) {
          if (a - spec.start > 0.05) arc.setAttribute('d', P.arcPath(R + 2, spec.start, a));
          else arc.removeAttribute('d');
        }
        if (readout) {
          const v = fam.helpers.dialValue(spec, a);
          readoutValue.textContent = heading ? `${Math.round(v) % 360}°` : `${v.toFixed(spec.dec)}${spec.unit}`;
          fitValue(readout);
        }
      },
      controls: (base, S) => (ctx, g) => {
        const fam = env.taskDef;
        const initialAngle = ctx.model.angle;
        document.querySelectorAll('[data-dial-action]').forEach((button) => {
          button.onclick = () => {
            if (button.dataset.dialAction === 'reset') {
              g.dial.set(initialAngle);
              ctx.update({ ...ctx.model, angle: initialAngle });
              g.paint();
            } else {
              const n = button.dataset.dialAction === 'left' ? -1 : 1;
              g.setValue(fam.helpers.dialStep(ctx.spec, fam.helpers.dialValue(ctx.spec, ctx.model.angle), n));
            }
          };
        });
      },
    },
  },
});
