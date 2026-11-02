// Site design on the shared act-in-time/arena template.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-moving-02',
  name: 'design',
  split: 'train',
  scenarios: ['moving'],
  template: 'act-in-time/arena',
  design: {
    triangle: false,
    parts: {
      board: () => (ctx, b) => {
        ctx.util.svg('defs', {}, b.svg);
      },
      shapeEl: () =>
        function (util, g, shape, r, fill) {
          let el;
          if (shape === 'circle') el = util.svg('circle', { r }, g);
          else if (shape === 'square')
            el = util.svg('rect', { x: -0.85 * r, y: -0.85 * r, width: 1.7 * r, height: 1.7 * r, rx: 0 }, g);
          else el = util.svg('polygon', { points: `0,${-1.1 * r} ${1.1 * r},0 0,${1.1 * r} ${-1.1 * r},0` }, g);
          el.setAttribute('class', 'ut-item');
          const id = 'shape-gloss-' + g.dataset.key;
          const defs = g.ownerSVGElement.querySelector('defs');
          const gradient = util.svg('linearGradient', { id, x1: '0', y1: '0', x2: '0', y2: '1' }, defs);
          util.svg('stop', { offset: '0', 'stop-color': `color-mix(in srgb, ${fill} 85%, white)` }, gradient);
          util.svg('stop', { offset: '.25', 'stop-color': fill }, gradient);
          util.svg('stop', { offset: '1', 'stop-color': `color-mix(in srgb, ${fill} 96%, black)` }, gradient);
          el.setAttribute('fill', `url(#${id})`);
          el.style.stroke = `color-mix(in srgb, ${fill} 70%, #000)`;
          el.setAttribute('stroke-width', 2);
          el.setAttribute('vector-effect', 'non-scaling-stroke');
          const rim = util.svg('linearGradient', { id: id + '-rim', x1: '0', y1: '0', x2: '0', y2: '1' }, defs);
          util.svg('stop', { offset: '0', 'stop-color': '#fff', 'stop-opacity': '.7' }, rim);
          util.svg('stop', { offset: '.45', 'stop-color': fill, 'stop-opacity': '0' }, rim);
          util.svg('stop', { offset: '1', 'stop-color': '#000', 'stop-opacity': '.15' }, rim);
          const glint = el.cloneNode(false);
          glint.setAttribute('class', 'ut-glint');
          glint.setAttribute('fill', 'none');
          glint.setAttribute('transform', 'scale(.95)');
          glint.setAttribute('stroke-width', '1.5');
          glint.style.stroke = `url(#${id}-rim)`;
          glint.style.pointerEvents = 'none';
          g.appendChild(glint);
          return el;
        },
      metrics: (base, S) => (ctx, side) => {
        const { util, spec } = ctx;
        const fam = env.taskDef;
        const deadlineFor = function (spec, fam) {
          if (Number.isFinite(spec.dur)) return spec.dur;
          let deadline = 0;
          for (let i = 0; i < spec.items.length; i++) {
            if (!spec.items[i].target) continue;
            let seenAt = null;
            let goneAt = null;
            for (let t = 0; t <= 600000; t += 250) {
              if (fam.helpers.itemPos(spec, i, t)) seenAt = t;
              else if (seenAt !== null) {
                goneAt = t;
                break;
              }
            }
            if (goneAt === null) return null;
            let lo = seenAt,
              hi = goneAt;
            while (hi - lo > 1) {
              const mid = (lo + hi) / 2;
              if (fam.helpers.itemPos(spec, i, mid)) lo = mid;
              else hi = mid;
            }
            deadline = Math.max(deadline, hi);
          }
          return deadline;
        };
        const ovb = document.querySelector('.ds-ovbody');
        if (ovb) {
          side.classList.add('ds-readouts');
          ovb.appendChild(side);
          const leg = util.el('div', 'ds-legend', ovb);
          const rows = [
            ['Targets:', [spec.color]],
            ['Do not click:', Object.keys(spec.colors).filter((c) => c !== spec.color)],
          ];
          rows.forEach(([lab, cols]) => {
            const row = util.el('div', 'ds-leg-row', leg);
            util.el('span', 'ds-leg-lab', row, lab);
            const shapes = ['square', 'circle', 'diamond'].filter((sh) => spec.items.some((it) => it.shape === sh));
            cols.forEach((c, ci) =>
              shapes.forEach((sh, si) => {
                if (cols.length > 1 && si % cols.length !== ci % cols.length) return;
                const i = util.el('i', 'ds-leg-' + sh, row);
                i.style.setProperty('--shape', spec.colors[c]);
              }),
            );
          });
        }
        const deadline = deadlineFor(spec, fam);
        const tc = S.P.sideCard(util, side, deadline !== null ? 'Time Remaining:' : 'Time Elapsed:');
        tc.title = deadline !== null ? 'Time until the last target leaves the board' : 'Time since the round started';
        const tv = util.el('div', 'ut-v', tc);
        tv.style.fontSize = '18px';
        tv.style.whiteSpace = 'nowrap';
        const cc = S.P.sideCard(util, side, `${spec.color[0].toUpperCase() + spec.color.slice(1)} Shapes Left:`);
        const cv = util.el('div', 'ut-v', cc);
        const tally = util.el('div', 'ut-tally', cc);
        const dots = [...Array(spec.nTargets)].map(() => util.el('i', '', tally));
        const mc = S.P.sideCard(util, side, 'Total Shapes on Board:');
        const mv = util.el('div', 'ut-v', mc);
        util.el(
          'div',
          'ut-note',
          side,
          'Shapes slide along the lanes in the direction of the arrows. Other colors do not count; clicking one ends the round.',
        );

        return { tv, cv, dots, mv, deadline };
      },
      metricsSync:
        (base, S) =>
        (ctx, f, { tv, cv, dots, mv, deadline }, m) => {
          const { spec } = ctx;
          const fam = env.taskDef;
          const got = m.hits.filter((i) => spec.items[i].target).length;
          cv.textContent = String(spec.nTargets - got);
          const remaining = deadline !== null ? Math.ceil(Math.max(0, deadline - m.t) / 1000) * 1000 : m.t;
          tv.textContent = S.P.clockText(remaining).padStart(5, '0');
          const score = document.querySelector('.ds-score-value');
          if (score) {
            score.textContent = String(got);
            score.parentElement.title = `Missed clicks: ${m.misses}`;
          }
          dots.forEach((d, i) => {
            d.className = i < got ? 'got' : '';
            d.style.background = i < got ? spec.colors[spec.color] : '';
          });
          const onBoard = spec.items.filter((_, i) => !m.hits.includes(i) && fam.helpers.itemPos(spec, i, m.t)).length;
          mv.textContent = String(onBoard);
          f.setStatus(`On the board: <b>${onBoard}</b>`);
        },
    },
  },
});
