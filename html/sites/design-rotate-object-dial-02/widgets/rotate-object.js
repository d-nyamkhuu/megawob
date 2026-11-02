// Site design on the rotate/dial template.
env.widget({
  task: 'rotate-object', site: 'design-rotate-object-dial-02', name: 'design', split: 'train',
  scenarios: ['dial'],
  template: 'rotate-object/dial',
  design: {
    sync: 'dial',
    parts: {
      frame: (base, S) => (ctx, g) => {
        const P = S.P;
        const { util, rng, size, spec } = ctx;
        const heading = spec.kind === 'heading';
        // Preserve the scaffold's draw sequence, independent of the reference's fixed layout.
        const Rmax = Math.min(175, Math.floor((size.height - 300) / 2));
        rng.int(Math.min(120, Rmax), Rmax);
        const card = util.el('div', 'rot-card nx-card', ctx.stage);
        const col = util.el('div', 'rot-col nx-dial', card);
        const title = util.el('div', 'rot-title', col, heading ? 'Heading' : spec.label);
        const svg = P.sv('svg', { class: 'rot-svg' }, col);
        const stageH = Math.min(size.height, ctx.stage.getBoundingClientRect().height);
        const titleH = title.getBoundingClientRect().height;
        const svgMargin = parseFloat(getComputedStyle(svg).marginTop) || 0;
        const gap = parseFloat(getComputedStyle(col).rowGap) || 0;
        const scale = Math.min(size.width / 1549, stageH / 370, Math.max(1, stageH - titleH - svgMargin - gap - 2) / 330);
        const R = 115 * scale;
        const rg = Math.round(R * rng.float(0.66, 0.76));
        const half = R + 50 * scale;
        const W = 2 * half;

        svg.setAttribute('width', W);
        svg.setAttribute('height', W);
        svg.setAttribute('viewBox', `${-half} ${-half} ${W} ${W}`);
        if (heading) svg.classList.add('heading-scale');
        svg.dataset.role = 'dial';
        return { heading, Rmax, card, col, title, svg, stageH, titleH, svgMargin, gap, scale, R, rg, half, W };
      },
      ticks: (base, S) => (ctx, g) => {
        const P = S.P;
        const { spec } = ctx;
        const fam = env.taskDef;
        const { heading, svg, scale, R, W } = g;
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
          const [x0, y0] = P.polar([0, 0], R + 6 * scale, a);
          const [x1, y1] = P.polar([0, 0], R + (isMajor ? 27 : 17) * scale, a);
          P.sv('line', { class: isMajor ? 'major' : 'minor', x1: x0, y1: y0, x2: x1, y2: y1 }, ring);
          if (isMajor) {
            const labelRadius = R + (heading ? 44 : 36) * scale;
            const [tx, ty] = P.polar([0, 0], labelRadius, a);
            const labelX = tx * (R + (heading ? 58 : 50) * scale) / labelRadius;
            const t = P.sv('text', { x: labelX, y: ty, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, ring);
            t.textContent = labelText(v);
          }
        }
        return { ring, labelText };
      },
      surface: (base, S) => (ctx, g) => {
        const P = S.P;
        const { rng } = ctx;
        const { scale, R, knob, gid, defs } = g;
        const grad = P.sv('radialGradient', { id: gid, cx: '38%', cy: '28%', r: '90%' }, defs);
        P.sv('stop', { offset: '0%', 'stop-color': '#595959' }, grad);
        P.sv('stop', { offset: '100%', 'stop-color': '#424242' }, grad);
        const bevel = P.sv('linearGradient', { id: gid + '-bevel', x1: '0%', y1: '0%', x2: '70%', y2: '100%' }, defs);
        P.sv('stop', { offset: '0%', 'stop-color': '#aaa' }, bevel);
        P.sv('stop', { offset: '45%', 'stop-color': '#555' }, bevel);
        P.sv('stop', { offset: '100%', 'stop-color': '#111' }, bevel);
        const shadow = P.sv('filter', { id: gid + '-shadow', x: '-30%', y: '-30%', width: '160%', height: '180%' }, defs);
        P.sv('feGaussianBlur', { stdDeviation: 6 * scale }, shadow);
        const grain = P.sv('filter', { id: gid + '-grain', x: '0%', y: '0%', width: '100%', height: '100%' }, defs);
        P.sv('feTurbulence', { type: 'fractalNoise', baseFrequency: '.55', numOctaves: 3, seed: 7 }, grain);
        P.sv('feColorMatrix', { type: 'saturate', values: 0 }, grain);
        const alpha = P.sv('feComponentTransfer', {}, grain);
        P.sv('feFuncA', { type: 'linear', slope: .17 }, alpha);
        P.sv('feComposite', { operator: 'in', in2: 'SourceGraphic' }, grain);
        P.sv('ellipse', { cx: 3, cy: 17, rx: R, ry: R * .92, fill: '#000', opacity: .35, filter: `url(#${gid}-shadow)` }, knob);
        P.sv('circle', { cy: R * .065, r: R, fill: '#111', stroke: '#080808', 'stroke-width': 2 }, knob);
        P.sv('circle', { r: R, fill: `url(#${gid}-bevel)`, stroke: '#222', 'stroke-width': 1.5 }, knob);
        rng.bool(); // Original optional rim decoration draw.
        for (let a = 0; a < 360; a += 2.5) {
          const [x1, y1] = P.polar([0, 0], R * .90, a);
          const [x2, y2] = P.polar([0, R * .065], R * .99, a);
          P.sv('line', { x1, y1, x2, y2, stroke: a < 130 || a > 290 ? '#555' : '#070707', 'stroke-width': 1.1 * scale, opacity: .85 }, knob);
          const [hx, hy] = P.polar([0, R * .065], R * .99, a + .65);
          P.sv('line', { x1, y1, x2: hx, y2: hy, stroke: a < 130 || a > 290 ? '#aaa' : '#454545', 'stroke-width': .55 * scale, opacity: .65 }, knob);
        }
        P.sv('circle', { r: R * .885, fill: `url(#${gid})`, stroke: '#909090', 'stroke-width': 1 }, knob);
        P.sv('circle', { r: R * .875, fill: '#777', filter: `url(#${gid}-grain)` }, knob);
        return { grad, bevel, shadow, grain, alpha };
      },
      pointer: (base, S) => (ctx, g) => {
        const P = S.P;
        const { R, rg, knob } = g;
        const arc = null;
        const turn = P.sv('g', {}, knob);
        P.sv('line', { x1: 0, y1: -R * 0.3, x2: 0, y2: -(R * 0.88), stroke: '#d8d8d8', 'stroke-width': R * 0.065, 'stroke-linecap': 'butt' }, turn);
        const grip = P.sv('circle', { cx: 0, cy: -rg, r: 10, fill: 'transparent' }, turn);
        grip.dataset.role = 'grip';
        return { arc, turn, grip };
      },
      readout: (base, S) => (ctx, g) => {
        const P = S.P;
        const { util, rng, spec } = ctx;
        const { card, title, grip, knob } = g;
        // Current value box and the target/tolerance panel sit beside the g.dial.
        const cur = util.el('div', 'nx-current', card);
        util.el('div', 'nx-box-title', cur, 'Current Time');
        const readout = util.el('div', 'nx-readout', cur);
        const hints = ['Drag the grip around the dial'];
        if (spec.wheel) hints.push(rng.pick(['Scroll over the knob to fine-tune', 'Mouse wheel adjusts in steps']));
        if (!spec.readout || spec.wheel) rng.pick(hints.slice(-1).concat(hints));
        const info = util.el('div', 'nx-info', card);
        const unitName = spec.unit.trim();
        const tolText = `±${spec.tau} ${unitName}`.trim();
        const rows = [['Target Time:', `${Number(spec.target).toFixed(spec.tdec)}${spec.unit}`], ['Tolerance:', tolText], ['Units:', unitName === 'min' ? 'minutes' : (unitName || 'units')]];
        const overviewTarget = document.querySelector('[data-role="overview-target"]');
        if (overviewTarget) overviewTarget.textContent = rows[0][1];
        const procedureGoal = document.querySelector('[data-role="procedure-goal"]');
        const instruction = document.querySelector('.instruction');
        if (procedureGoal && instruction && !instruction.hidden) procedureGoal.textContent = instruction.firstChild.textContent;
        for (const [k, v] of rows) { const r = util.el('div', 'nx-row', info); util.el('span', '', r, k); util.el('span', '', r, v); }
        util.el('hr', '', info);
        const st = util.el('div', 'nx-row', info); util.el('span', '', st, 'Status:'); const status = util.el('span', '', st, 'Not Set');
        return { cur, readout, hints, info, unitName, tolText, rows, overviewTarget, procedureGoal, instruction, st, status };
      },
      paint: (base, S) => (ctx, g) => {
        const P = S.P;
        const { spec } = ctx;
        const fam = env.taskDef;
        const { heading, R, arc, turn, readout, status } = g;
        const a = ctx.model.angle;
        turn.setAttribute('transform', `rotate(${a.toFixed(3)})`);
        if (arc) {
          if (a - spec.start > 0.05) arc.setAttribute('d', P.arcPath(R + 2, spec.start, a));
          else arc.removeAttribute('d');
        }
        if (readout) {
          const v = fam.helpers.dialValue(spec, a);
          readout.textContent = heading ? `${Math.round(v) % 360}°` : `${v.toFixed(spec.dec)}${spec.unit}`;
        }
        if (g.a0 === undefined) g.a0 = a;
        status.textContent = Math.abs(a - g.a0) > 0.05 ? 'Set' : 'Not Set'; // moved, not scored: the page must not reveal success
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
            ctx.update({ angle });
            paint();
          },
        });
        return { dial };
      },
    },
  },
});
