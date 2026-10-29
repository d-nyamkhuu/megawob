// Silver dial with proportional geometry, engraved face, and live instrument readout.
env.widget({
  task: 'rotate-object', site: 'design-rotate-object-dial-08', name: 'design', split: 'train',
  scenarios: ['dial'],
  template: 'rotate-object/dial',
  design: {
    parts: {
      style: (base, S) => () => {
        const existing = document.getElementById('rot-style');
        if (existing) { document.head.prepend(existing); return; }
        const s = document.createElement('style');
        s.id = 'rot-style';
        s.textContent = S.D.css;
        document.head.prepend(s);
      },
      frame: (base, S) => (ctx, g) => {
        const P = S.P;
        const { util, rng, size, spec } = ctx;
        const heading = spec.kind === 'heading';
        const Rmax = Math.min(175, Math.floor((size.height - 300) / 2));
        rng.int(Math.min(120, Rmax), Rmax);
        const R = Math.min(size.height * .275, size.width * .12);
        const rg = Math.round(R * rng.float(.66, .76));
        const half = R * 1.44;
        const W = 2 * half;
        const card = util.el('div', 'rot-card', ctx.stage);
        const col = util.el('div', 'rot-col', card);
        util.el('div', 'rot-title', col, heading ? 'Heading' : spec.label + (spec.unit.trim() ? ` (${spec.unit.trim()})` : ''));
        const svg = P.sv('svg', { class: 'rot-svg', width: W, height: W, viewBox: `${-half} ${-half} ${W} ${W}` }, col);
        svg.dataset.role = 'dial';
        svg.style.setProperty('--dial-half', half + 'px');
        return { heading, Rmax, R, rg, half, W, card, col, svg };
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
          const [x0, y0] = P.polar([0, 0], R * 1.075, a);
          const [x1, y1] = P.polar([0, 0], R * (isMajor ? 1.205 : 1.16), a);
          P.sv('line', { class: isMajor ? 'major' : 'minor', x1: x0, y1: y0, x2: x1, y2: y1 }, ring);
          if (isMajor) {
            const [tx, ty] = P.polar([0, 0], R * 1.36, a);
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
        const grad = P.sv('linearGradient', { id: gid, x1: '0%', y1: '0%', x2: '85%', y2: '100%' }, defs);
        P.sv('stop', { offset: '0%', 'stop-color': '#f0f0f0' }, grad);
        P.sv('stop', { offset: '48%', 'stop-color': '#b2b4b7' }, grad);
        P.sv('stop', { offset: '100%', 'stop-color': '#45474a' }, grad);
        const faceGrad = P.sv('linearGradient', { id: gid + '-face', x1: '0%', y1: '0%', x2: '90%', y2: '100%' }, defs);
        P.sv('stop', { offset: '0%', 'stop-color': '#d1d2d4' }, faceGrad);
        P.sv('stop', { offset: '100%', 'stop-color': '#a9abae' }, faceGrad);
        const grain = P.sv('filter', { id: gid + '-grain', x: '0%', y: '0%', width: '100%', height: '100%' }, defs);
        P.sv('feTurbulence', { type: 'fractalNoise', baseFrequency: '.8', numOctaves: '3', seed: '8', result: 'noise' }, grain);
        P.sv('feColorMatrix', { in: 'noise', type: 'saturate', values: '0', result: 'gray' }, grain);
        const alpha = P.sv('feComponentTransfer', { in: 'gray', result: 'faint' }, grain);
        P.sv('feFuncA', { type: 'linear', slope: '.13' }, alpha);
        P.sv('feComposite', { in: 'faint', in2: 'SourceGraphic', operator: 'in', result: 'clipped' }, grain);
        P.sv('feBlend', { in: 'SourceGraphic', in2: 'clipped', mode: 'multiply' }, grain);
        P.sv('circle', { r: R, fill: `url(#${gid})`, stroke: 'var(--line)', 'stroke-width': 2 }, knob);
        P.sv('circle', { class: 'knob-face', cx: -R * .025, cy: -R * .025, r: R * .93, fill: `url(#${gid}-face)`, filter: `url(#${gid}-grain)`, stroke: '#eee', 'stroke-width': 1, 'stroke-dasharray': rng.bool() ? '2 4' : 'none' }, knob);
        return { grad, faceGrad, grain, alpha };
      },
      pointer: (base, S) => (ctx, g) => {
        const P = S.P;
        const { heading, R, rg, knob } = g;
        const arc = heading ? null : P.sv('path', { fill: 'none', stroke: 'var(--accent)', 'stroke-width': 5, 'stroke-linecap': 'round' }, knob);
        const turn = P.sv('g', {}, knob);
        if (heading) {
          P.sv('path', { d: `M0,${-(rg + 16)} L11,-8 L-11,-8 Z`, fill: 'var(--accent)', opacity: 0.85 }, turn);
          P.sv('path', { d: `M0,${rg * .55} L8,8 L-8,8 Z`, fill: 'var(--muted)', opacity: 0.6 }, turn);
        } else {
          P.sv('line', { x1: 0, y1: -14, x2: 0, y2: -(rg - 14), stroke: 'var(--muted)', 'stroke-width': 3, 'stroke-linecap': 'round' }, turn);
        }
        P.sv('circle', { r: 9, fill: 'var(--fg)', opacity: 0.75 }, knob);
        const grip = P.sv('circle', { cx: 0, cy: -rg, r: 13, fill: 'var(--accent)', stroke: '#fff', 'stroke-width': 3 }, turn);
        grip.dataset.role = 'grip';
        P.sv('rect', { class: 'knob-slot', x: -R * .06, y: -R * .9, width: R * .12, height: R * .39, rx: R * .025, fill: '#48494b', stroke: '#dedede', 'stroke-width': 1.5 }, turn);
        return { arc, turn, grip };
      },
      paint: (base, S) => (ctx, g) => {
        base(ctx, g);
        if (g.readout) {
          const { spec } = ctx;
          const text = g.readout.textContent;
          ctx.stage.showDialState(g.heading ? 'Heading' : spec.label, text, spec.unit);
          g.readout.dataset.label = spec.label === 'Timer' ? 'Current Time' : 'Current ' + (g.heading ? 'Heading' : spec.label);
        }
      },
    },
  },
});
