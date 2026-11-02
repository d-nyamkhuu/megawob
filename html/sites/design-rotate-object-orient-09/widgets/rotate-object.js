// Adds the workshop canvas scale, enamel finish, brass handle details, and dial controls.
(function () {
  'use strict';
  env.widget({
    task: 'rotate-object', site: 'design-rotate-object-orient-09', name: 'design', split: 'train',
    scenarios: ['orient'],
    traits: { shapes: ['ell'], modes: ['match'] },
    template: 'rotate-object/orient',
    design: {
      modeClass: null,
      shapes: {
        ell: ['M-28,-46 H-4 V22 H30 V46 H-28 Z', 30, 46],
        arrow: ['M0,-48 L32,-10 L12,-10 L12,48 L-12,48 L-12,-10 L-32,-10 Z', 32, 48],
      },
      parts: {
        fit: () => (ctx) => Math.floor(Math.min(560, ctx.size.height * 0.78, ctx.size.width * 0.44)),
        shapeScale: () => (ctx, g, B, C) => (B / 100) * (C / 480) * 2.5,
        handleRadius: () => (ctx, g) => Math.round(g.top + ctx.rng.int(26, 36)),
        frame: (base) => (ctx, g) => {
          const made = base(ctx, g);
          made.card.dataset.mode = ctx.spec.mode;
          return made;
        },
        grid: (base, S) => (ctx, g) => {
          const { rng } = ctx;
          const { C, half, svg } = g;
          const gid = `rot-grid-${Math.floor(rng.next() * 1e9)}`;
          const defs = S.P.sv('defs', {}, svg);
          const brass = S.P.sv('radialGradient', { id: 'workshop-brass', cx: '32%', cy: '25%', r: '75%' }, defs);
          for (const [offset, color] of [['0%', '#fff3c5'], ['28%', '#d8bd74'], ['65%', '#aa843f'], ['100%', '#674923']]) {
            S.P.sv('stop', { offset, 'stop-color': color }, brass);
          }
          const finish = S.P.sv('filter', { id: 'workshop-enamel', x: '-10%', y: '-10%', width: '120%', height: '120%' }, defs);
          S.P.sv('feTurbulence', { type: 'fractalNoise', baseFrequency: '.035', numOctaves: 3, seed: 4, result: 'noise' }, finish);
          S.P.sv('feColorMatrix', {
            in: 'noise',
            values: '.333 .333 .333 0 0 .333 .333 .333 0 0 .333 .333 .333 0 0 0 0 0 .07 0',
            result: 'noise',
          }, finish);
          S.P.sv('feComposite', { in: 'noise', in2: 'SourceGraphic', operator: 'in', result: 'noise' }, finish);
          S.P.sv('feBlend', { in: 'SourceGraphic', in2: 'noise', mode: 'soft-light' }, finish);
          const cell = rng.pick([20, 24, 28]);
          const pat = S.P.sv('pattern', { id: gid, width: cell, height: cell, patternUnits: 'userSpaceOnUse', x: -half, y: -half }, defs);
          S.P.sv('path', { d: `M${cell},0 L0,0 0,${cell}`, fill: 'none', stroke: 'var(--line)', 'stroke-width': 1, opacity: 0.7 }, pat);
          S.P.sv('rect', { x: -half, y: -half, width: C, height: C, fill: `url(#${gid})` }, svg);
          return { gid, defs, cell, pat };
        },
        heading: (base, S) => (ctx, g) => {
          const { rng, spec } = ctx;
          const { half, svg } = g;
          if (spec.mode === 'heading' && rng.bool(0.6)) {
            const radius = half - 30;
            for (let angle = 0; angle < 360; angle += 5) {
              const major = angle % 45 === 0;
              const [x0, y0] = S.P.polar([0, 0], radius, angle);
              const [x1, y1] = S.P.polar([0, 0], radius - (major ? 14 : angle % 15 === 0 ? 9 : 5), angle);
              S.P.sv('line', {
                class: major ? 'major' : 'minor', x1: x0, y1: y0, x2: x1, y2: y1,
                opacity: major ? 0.6 : 0.8,
              }, svg);
              if (major) {
                const [tx, ty] = S.P.polar([0, 0], radius + 14, angle);
                const text = S.P.sv('text', {
                  x: tx, y: ty, 'text-anchor': 'middle', 'dominant-baseline': 'central',
                }, svg);
                text.textContent = `${angle}°`;
                text.style.fontSize = '11px';
              }
            }
          }
        },
        point: (base, S) => (ctx, g) => {
          const { spec } = ctx;
          const { half, svg } = g;
          if (spec.mode === 'point') {
            const [x, y] = S.P.polar([0, 0], half - 38, spec.target);
            S.P.sv('path', {
              d: S.P.starPath(19, 8, 5), transform: `translate(${x.toFixed(2)},${y.toFixed(2)})`,
              fill: '#f2c200', stroke: '#8a6d00', 'stroke-width': 1.5,
            }, svg);
          }
        },
        shape: (base, S) => (ctx, g) => {
          const { k, d, color, sel } = g;
          S.P.sv('path', {
            class: 'shape-enamel', d, transform: `scale(${k})`, fill: color,
            filter: 'url(#workshop-enamel)', stroke: 'rgba(0,0,0,.35)', 'stroke-width': 1.5 / k,
          }, sel);
          S.P.sv('path', {
            class: 'shape-outline', d, transform: `scale(${k})`, fill: 'none', stroke: '#111',
            'stroke-width': 3 / k, 'pointer-events': 'none',
          }, sel);
        },
        handle: (base, S) => (ctx, g) => {
          const { top, Rh, sel } = g;
          S.P.sv('line', { x1: 0, y1: -top, x2: 0, y2: -Rh + 9, stroke: 'var(--accent)', 'stroke-width': 1.5 }, sel);
          S.P.sv('path', {
            class: 'rotation-arc', d: `M-76,${-Rh + 30} Q0,${-Rh - 35} 76,${-Rh + 30}`,
            fill: 'none', stroke: '#746854', 'stroke-width': 2, 'pointer-events': 'none',
          }, sel);
          S.P.sv('path', {
            class: 'rotation-arc', d: `M-76,${-Rh + 30} l5,-16 10,9 Z M76,${-Rh + 30} l-5,-16 -10,9 Z`,
            fill: '#746854', stroke: 'none', 'pointer-events': 'none',
          }, sel);
          const handle = S.P.sv('circle', {
            class: 'rot-handle', cx: 0, cy: -Rh, r: 9, fill: 'var(--panel)',
            stroke: 'var(--accent)', 'stroke-width': 2.5,
          }, sel);
          handle.dataset.role = 'handle';
          S.P.sv('circle', { r: 3, fill: 'var(--accent)' }, sel);
          return { handle };
        },
        reference: (base, S) => (ctx, g) => {
          const { util, spec } = ctx;
          const { d, color, card } = g;
          const side = util.el('div', 'rot-col', card);
          if (spec.mode === 'match') {
            util.el('div', 'rot-title', side, 'Reference');
            const RW = g.C;
            const ref = S.P.sv('svg', {
              class: 'rot-svg rot-ref', width: RW, height: RW,
              viewBox: `${-RW / 2} ${-RW / 2} ${RW} ${RW}`,
            }, side);
            const rk = g.k;
            S.P.sv('path', {
              class: 'shape-enamel', d, transform: `rotate(${spec.target}) scale(${rk})`, fill: color,
              filter: 'url(#workshop-enamel)', stroke: 'rgba(0,0,0,.35)', 'stroke-width': 1.5 / rk,
            }, ref);
            S.P.sv('path', {
              class: 'shape-outline', d, transform: `rotate(${spec.target}) scale(${rk})`, fill: 'none',
              stroke: '#111', 'stroke-width': 3 / rk, 'pointer-events': 'none',
            }, ref);
          }
          return { side };
        },
        paint: (base) => (ctx, g) => {
          const { readout, field } = g;
          if (field) field.paint(Math.round(ctx.model.angle) % 360);
          else if (readout) readout.textContent = `Rotation: ${Math.round(ctx.model.angle) % 360}°`;
          const knob = document.querySelector('.knob');
          if (knob) knob.style.setProperty('--bearing', `${ctx.model.angle}deg`);
        },
        controls: (base) => (ctx, g) => {
          const fam = env.taskDef;
          for (const button of document.querySelectorAll('[data-turn]')) {
            button.onclick = () => {
              const angle = fam.helpers.mod360(ctx.model.angle + Number(button.dataset.turn));
              g.rot.set(angle);
              ctx.update({ angle });
              g.paint();
            };
          }
        },
      },
    },
  });
})();
