// Uses the site's task-state sidebar, target palette, and taller custom silhouettes.
(function () {
  'use strict';

  const COLORS = {
    purple: '#9900b5',
    red: '#ff141a',
    blue: '#1000ff',
    green: '#1bb62e',
    orange: '#ff8100',
    yellow: '#fff500',
  };
  const NS = { 'vector-effect': 'non-scaling-stroke' };

  env.widget({
    task: 'act-in-time',
    site: 'design-act-in-time-moving-01',
    name: 'design',
    split: 'train',
    scenarios: ['moving'],
    template: 'act-in-time/arena',
    design: {
      parts: {
        frame: () => (ctx) => {
          const arena = ctx.util.el('div', 'ut-arena', ctx.stage);
          const body = ctx.util.el('div', 'ut-body', arena);
          return { arena, body, setClock() {}, setStatus() {} };
        },
        shapeEl: () => (util, g, shape, r, fill) => {
          let el;
          if (shape === 'circle') el = util.svg('circle', { r }, g);
          else if (shape === 'square') el = util.svg('rect', { x: -0.95 * r, y: -0.95 * r, width: 1.9 * r, height: 1.9 * r }, g);
          else if (shape === 'triangle') el = util.svg('polygon', { points: `0,${-1.2 * r} ${1.05 * r},${0.7 * r} ${-1.05 * r},${0.7 * r}` }, g);
          else el = util.svg('polygon', { points: `0,${-1.1 * r} ${1.1 * r},0 0,${1.1 * r} ${-1.1 * r},0` }, g);
          el.setAttribute('class', 'ut-item');
          el.setAttribute('fill', fill);
          el.setAttribute('stroke-width', 2);
          el.setAttribute('vector-effect', 'non-scaling-stroke');
          return el;
        },
        build: (base, S) => (ctx, f, up) => {
          const { spec, util } = ctx;
          const fam = env.taskDef;
          const main = util.el('div', 'ut-main', f.body);
          const side = document.querySelector('.ds-task-state');
          const b = S.P.boardSvg(util, main, spec.A, 'moving');
          document.querySelector('.ds-goal-text').textContent = `Click all the ${spec.color} shapes before they slide off the board.`;
          const lh = 1 / spec.lanes.length;
          spec.lanes.forEach((ln, i) => {
            util.svg('rect', { class: 'ut-lane' + (i % 2 ? ' alt' : ''), x: 0, y: i * lh, width: spec.A, height: lh }, b.svg);
            util.svg('line', { class: 'ut-lanemark', x1: 0, y1: ln.y, x2: spec.A, y2: ln.y, 'stroke-width': 1.5, ...NS }, b.svg);
            const s = 0.028;
            for (const x0 of [0.05, spec.A - 0.05]) {
              const d = ln.dir > 0
                ? `M${x0 - s / 2} ${ln.y - s}L${x0 + s / 2} ${ln.y}L${x0 - s / 2} ${ln.y + s}`
                : `M${x0 + s / 2} ${ln.y - s}L${x0 - s / 2} ${ln.y}L${x0 + s / 2} ${ln.y + s}`;
              util.svg('path', { class: 'ut-chev', d, 'stroke-width': 2.5, ...NS }, b.svg);
            }
          });
          const items = spec.items.map((it, i) => {
            const g = util.svg('g', {}, b.svg);
            g.dataset.key = String(i);
            g.dataset.role = 'item';
            const shape = it.shape === 'diamond' && i % 2 ? 'triangle' : it.shape;
            const mark = S.P.shapeEl(util, g, shape, spec.r, COLORS[it.color] || spec.colors[it.color]);
            const rect = main.getBoundingClientRect();
            mark.setAttribute('transform', `scale(${(spec.A * rect.height) / rect.width} 1)`);
            const tip = util.svg('title', {}, g);
            tip.textContent = `${it.color} ${shape}`;
            return g;
          });

          function stateRow(label, unit) {
            const row = util.el('div', 'ds-state-row', side);
            row.append(label + ': ');
            const value = util.el('b', '', row);
            if (unit) row.append(' ' + unit);
            return value;
          }
          const time = stateRow('Time remaining', 'seconds');
          const remaining = stateRow(spec.color[0].toUpperCase() + spec.color.slice(1) + ' shapes left');
          const count = stateRow('Shapes on board');
          const legend = util.el('section', 'ds-legend', side);
          util.el('h2', '', legend, 'Legend');
          function legendShape(parent, color, shape) {
            const svg = util.svg('svg', { viewBox: '-1.3 -1.3 2.6 2.6', 'aria-hidden': 'true' }, parent);
            S.P.shapeEl(util, svg, shape, 1.15, COLORS[color] || spec.colors[color]);
            return svg;
          }
          const target = util.el('div', 'ds-legend-row ds-target-legend', legend);
          legendShape(target, spec.color, 'circle');
          util.el('span', '', target, '= target (' + spec.color + ')');
          const distractors = util.el('div', 'ds-legend-row', legend);
          const icons = util.el('div', 'ds-distractor-icons', distractors);
          const otherColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'].filter((c) => c !== spec.color).slice(0, 4);
          otherColors.forEach((color, i) => legendShape(icons, color, ['circle', 'circle', 'square', 'triangle'][i]));
          util.el('span', '', distractors, '= distractors');
          const controls = util.el('section', 'ds-controls', side);
          util.el('h2', '', controls, 'Controls');
          util.el('p', '', controls, 'Click a shape on the board to catch it.');

          const brd = env.ui.board(b.svg, {
            toBoard: b.toBoard,
            fromBoard: b.fromBoard,
            label: 'board',
            onChange: (pt) => {
              const m = ctx.model;
              const i = fam.helpers.itemAt(spec, m.t, pt);
              if (i === null || m.hits.includes(i)) {
                env.log('miss', { point: pt });
                up({ misses: m.misses + 1 });
              } else {
                env.log('hit', { item: i, target: spec.items[i].target });
                up({ hits: m.hits.concat([i]) });
                items[i].style.display = 'none';
              }
              sync(ctx.model);
            },
          });

          function sync(m) {
            items.forEach((g, i) => {
              const p = fam.helpers.itemPos(spec, i, m.t);
              if (!p || m.hits.includes(i)) {
                g.style.display = 'none';
                return;
              }
              g.style.display = '';
              g.setAttribute('transform', `translate(${p[0].toFixed(4)} ${p[1].toFixed(4)})`);
            });
            const got = m.hits.filter((i) => spec.items[i].target).length;
            remaining.textContent = String(spec.nTargets - got);
            const seconds = String(Math.max(0, Math.ceil((spec.end - m.t) / 1000)));
            time.textContent = seconds;
            document.querySelector('.ds-time-value').textContent = seconds;
            const onBoard = spec.items.filter((_, i) => !m.hits.includes(i) && fam.helpers.itemPos(spec, i, m.t)).length;
            count.textContent = String(onBoard);
          }
          return {
            sync,
            locate: (tg) => {
              if (tg.item === undefined) return null;
              const p = fam.helpers.itemPos(spec, tg.item, ctx.model.t);
              return p ? brd.locate(p) : null;
            },
          };
        },
      },
    },
  });
})();
