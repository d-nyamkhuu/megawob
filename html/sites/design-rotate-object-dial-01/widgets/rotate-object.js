// Site design on the rotate/dial template.
env.widget({
  task: 'rotate-object', site: 'design-rotate-object-dial-01', name: 'design', split: 'train',
  scenarios: ['dial'],
  template: 'rotate-object/dial',
  design: {
    sync: 'dial',
    parts: {
      frame: (base, S) => (ctx, g) => {
        const P = S.P;
        const { util, size, spec } = ctx;
        const heading = spec.kind === 'heading';
        // Fixed, undistorted reference geometry, scaled to the available stage.
        const scale = Math.min(size.width / 1672, size.height / 583);
        const R = 165;
        const rg = 129;
        const half = 265;
        const W = 2 * half;

        const card = util.el('div', 'rot-card', ctx.stage);
        card.style.width = `${W * scale}px`;
        card.style.height = `${583 * scale}px`;
        const col = util.el('div', 'rot-col', card);
        const svg = P.sv('svg', { class: 'rot-svg', width: W * scale, height: W * scale, viewBox: `${-half} ${-half} ${W} ${W}` }, col);
        svg.dataset.role = 'dial';
        return { heading, scale, R, rg, half, W, card, col, svg };
      },
      ticks: (base, S) => (ctx, g) => {
        const P = S.P;
        const { spec } = ctx;
        const fam = env.taskDef;
        const { heading, R, W, svg } = g;
        // Tick ring and labels.
        const ring = P.sv('g', {}, svg);
        const labelText = (v) => {
          if (!heading) return String(v);
          return { 0: 'N', 90: 'E', 180: 'S', 270: 'W' }[v] ?? String(v);
        };
        for (const v of P.niceTicks(spec, 'minor')) {
          const a = fam.helpers.dialAngleFor(spec, v);
          const rel = (v - spec.min) / spec.major;
          const isMajor = Math.abs(rel - Math.round(rel)) < 1e-6;
          const [x0, y0] = P.polar([0, 0], R + (isMajor ? 27 : 33), a);
          const [x1, y1] = P.polar([0, 0], R + 44, a);
          P.sv('line', { class: isMajor ? 'major' : 'minor', x1: x0, y1: y0, x2: x1, y2: y1 }, ring);
          if (isMajor) {
            const [tx, ty] = P.polar([0, 0], R + 78, a);
            const t = P.sv('text', { x: tx, y: ty, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, ring);
            t.textContent = labelText(v);
          }
        }
        return { ring, labelText };
      },
      surface: (base, S) => (ctx, g) => {
        const P = S.P;
        const { R, knob, gid, defs } = g;
        const grad = P.sv('linearGradient', { id: gid, x1: '12%', y1: '0%', x2: '86%', y2: '100%' }, defs);
        P.sv('stop', { offset: '0%', 'stop-color': '#ffffff' }, grad);
        P.sv('stop', { offset: '48%', 'stop-color': '#e8eef6' }, grad);
        P.sv('stop', { offset: '100%', 'stop-color': '#c4cedc' }, grad);
        const faceGrad = P.sv('linearGradient', { id: gid + '-face', x1: '15%', y1: '0%', x2: '85%', y2: '100%' }, defs);
        P.sv('stop', { offset: '0%', 'stop-color': '#eff4f9' }, faceGrad);
        P.sv('stop', { offset: '100%', 'stop-color': '#e2e8f1' }, faceGrad);
        const edgeGrad = P.sv('linearGradient', { id: gid + '-edge', x1: '0%', y1: '0%', x2: '75%', y2: '100%' }, defs);
        P.sv('stop', { offset: '0%', 'stop-color': '#d9e2ee' }, edgeGrad);
        P.sv('stop', { offset: '100%', 'stop-color': '#aebacb' }, edgeGrad);
        const shadow = P.sv('filter', { id: gid + '-shadow', x: '-35%', y: '-35%', width: '180%', height: '180%' }, defs);
        P.sv('feDropShadow', { dx: -7, dy: -7, stdDeviation: 10, 'flood-color': '#ffffff', 'flood-opacity': '.8' }, shadow);
        P.sv('feDropShadow', { dx: 9, dy: 15, stdDeviation: 12, 'flood-color': '#93a3b9', 'flood-opacity': '.35' }, shadow);
        P.sv('circle', { r: R, fill: `url(#${gid})`, stroke: `url(#${gid}-edge)`, 'stroke-width': 4, filter: `url(#${gid}-shadow)` }, knob);
        P.sv('circle', { r: R - 18, fill: `url(#${gid}-face)` }, knob);
        return { grad, faceGrad, edgeGrad, shadow };
      },
      pointer: (base, S) => (ctx, g) => {
        const P = S.P;
        const { heading, rg, knob } = g;
        const arc = null;
        const turn = P.sv('g', {}, knob);
        if (heading) {
          P.sv('path', { d: `M0,${-(rg + 16)} L11,-8 L-11,-8 Z`, fill: 'var(--accent)', opacity: 0.85 }, turn);
          P.sv('path', { d: `M0,${rg * 0.55} L8,8 L-8,8 Z`, fill: 'var(--muted)', opacity: 0.6 }, turn);
        }
        P.sv('line', { x1: 0, y1: -108, x2: 0, y2: -149, stroke: '#f5f9ff', 'stroke-width': 14, 'stroke-linecap': 'round' }, turn);
        const grip = P.sv('line', { x1: 0, y1: -108, x2: 0, y2: -149, stroke: '#328dff', 'stroke-width': 11, 'stroke-linecap': 'round' }, turn);
        grip.dataset.role = 'grip';
        return { arc, turn, grip };
      },
      readout: (base, S) => (ctx, g) => {
        const P = S.P;
        const { util, spec } = ctx;
        const { heading, scale, col } = g;
        const readout = util.el('div', 'rot-readout', col);
        Object.assign(readout.style, { top: `${458 * scale}px`, width: `${318 * scale}px`, height: `${124 * scale}px`, borderRadius: `${32 * scale}px`, gap: `${8 * scale}px` });
        const label = util.el('div', 'readout-label', readout, heading ? 'Current Heading' : `Current ${spec.label}`);
        label.style.fontSize = `${22 * scale}px`;
        const number = util.el('div', 'readout-value', readout);
        number.style.fontSize = `${50 * scale}px`;
        return { readout, label, number };
      },
      paint: (base, S) => (ctx, g) => {
        const P = S.P;
        const { spec } = ctx;
        const fam = env.taskDef;
        const { heading, R, arc, turn, readout, number } = g;
        const a = ctx.model.angle;
        turn.setAttribute('transform', `rotate(${a.toFixed(3)})`);
        if (arc) {
          if (a - spec.start > 0.05) arc.setAttribute('d', P.arcPath(R + 2, spec.start, a));
          else arc.removeAttribute('d');
        }
        if (readout) {
          const v = fam.helpers.dialValue(spec, a);
          number.textContent = heading ? `${Math.round(v) % 360}°` : `${v.toFixed(spec.dec)}${spec.unit}`;
        }
      },
      input: (base, S) => (ctx, g) => {
        const P = S.P;
        const { spec } = ctx;
        const fam = env.taskDef;
        const { svg, shadow, knob, paint } = g;
        const setValue = (v) => {
          const angle = fam.helpers.dialAngleFor(spec, v);
          g.dial.set(angle);
          ctx.update({ ...ctx.model, angle });
          paint();
        };
        if (spec.wheel) {
          svg.addEventListener('wheel', (e) => {
            e.preventDefault();
            const n = Math.round(-e.deltaY / 100) || -Math.sign(e.deltaY);
            if (!n) return;
            ctx.log('wheel-step', { n });
            setValue(fam.helpers.dialStep(spec, fam.helpers.dialValue(spec, ctx.model.angle), n));
          }, { passive: false });
        }
        if (spec.keys) {
          svg.setAttribute('tabindex', '0');
          svg.style.outline = 'none';
          svg.addEventListener('pointerdown', () => svg.focus({ preventScroll: true }));
          svg.addEventListener('focus', () => {
            knob.style.filter = 'drop-shadow(0 0 3px var(--accent))';
            if (!ctx.model.focus) ctx.update({ ...ctx.model, focus: true });
          });
          svg.addEventListener('blur', () => {
            knob.style.filter = '';
            if (ctx.model.focus) ctx.update({ ...ctx.model, focus: false });
          });
          svg.addEventListener('keydown', (e) => {
            const steps = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 10, PageDown: -10 }[e.key];
            const v = fam.helpers.dialValue(spec, ctx.model.angle);
            if (steps) setValue(fam.helpers.dialStep(spec, v, steps));
            else if (e.key === 'Home' && spec.kind === 'value') setValue(spec.min);
            else if (e.key === 'End' && spec.kind === 'value') setValue(spec.max);
            else return;
            e.preventDefault();
          });
        }
        return { setValue };
      },
      dial: (base, S) => (ctx, g) => {
        const P = S.P;
        const { spec } = ctx;
        const fam = env.taskDef;
        const { scale, rg, svg, label, knob, paint } = g;
        const dial = env.ui.dial(knob, {
          label: 'dial',
          center: () => P.centerOf(svg),
          radius: rg * scale,
          angle: ctx.model.angle,
          start: spec.start,
          sweep: spec.sweep,
          min: spec.min,
          max: spec.max,
          constrain: (a) => fam.helpers.clampDial(spec, a),
          onInput(angle) {
            ctx.update({ angle });
            paint();
          },
        });
        return { dial };
      },
      placed: (base, S) => (ctx, g) => {
        const P = S.P;
        // Fixed card layout: no sampled placement.
      },
    },
  },
});
