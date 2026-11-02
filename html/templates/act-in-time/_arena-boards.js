/* act-in-time/_arena-boards: shared template implementation; parts remain on the calling template. */
(function () {
  'use strict';
  function buildMoving(S, NS, ctx, f, up) {
    const { spec, util } = ctx;
    const fam = env.taskDef;
    const main = util.el('div', 'ut-main', f.body);
    const side = S.P.side(ctx, f);
    const b = S.P.boardSvg(util, main, spec.A, 'moving');
    S.P.board(ctx, b, main);
    const lh = 1 / spec.lanes.length;
    spec.lanes.forEach((ln, i) => {
      util.svg(
        'rect',
        { class: 'ut-lane' + (i % 2 ? ' alt' : ''), x: 0, y: i * lh, width: spec.A, height: lh },
        b.svg,
      );
      util.svg(
        'line',
        { class: 'ut-lanemark', x1: 0, y1: ln.y, x2: spec.A, y2: ln.y, 'stroke-width': 1.5, ...NS },
        b.svg,
      );
      // Chevrons pointing the way the lane moves, at both ends.
      const s = 0.028;
      for (const x0 of [0.05, spec.A - 0.05]) {
        const d =
          ln.dir > 0
            ? `M${x0 - s / 2} ${ln.y - s}L${x0 + s / 2} ${ln.y}L${x0 - s / 2} ${ln.y + s}`
            : `M${x0 + s / 2} ${ln.y - s}L${x0 - s / 2} ${ln.y}L${x0 + s / 2} ${ln.y + s}`;
        util.svg('path', { class: 'ut-chev', d, 'stroke-width': 2.5, ...NS }, b.svg);
      }
    });
    const items = spec.items.map((it, i) => {
      const g = util.svg('g', {}, b.svg);
      g.dataset.key = String(i);
      g.dataset.role = 'item';
      S.P.item(ctx, main, g, it, i);
      return g;
    });

    const metrics = S.P.metrics(ctx, side);

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
          S.P.hit(ctx, sync);
        }
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
      S.P.metricsSync(ctx, f, metrics, m);
    }
    return {
      sync,
      locate: (tg) => {
        if (tg.item === undefined) return null;
        const p = fam.helpers.itemPos(spec, tg.item, ctx.model.t);
        return p ? brd.locate(p) : null;
      },
    };
  }

  function installBoard(BASE, S, V, constants) {
    if (V === 'chase' || V === 'moving') {
      BASE.sideCard = function (util, side, key) {
        const c = util.el('div', 'ut-card', side);
        util.el('div', 'ut-k', c, key);
        return c;
      };

      BASE.boardSize = function (main, A) {
        const r = main.getBoundingClientRect();
        const w = Math.floor(Math.min(r.width, (r.height - 2) * A));
        return [w, Math.floor(w / A)];
      };

      BASE.boardSvg = function (util, main, A, cls) {
        const [bw, bh] = S.P.boardSize(main, A);
        const svg = util.svg(
          'svg',
          { class: `ut-board ${cls}`, width: bw, height: bh, viewBox: `0 0 ${A} 1`, preserveAspectRatio: 'none' },
          main,
        );
        const toBoard = ([x, y]) => {
          const r = svg.getBoundingClientRect();
          return [((x - r.left) / r.width) * A, (y - r.top) / r.height];
        };
        const fromBoard = ([bx, by]) => {
          const r = svg.getBoundingClientRect();
          return [r.left + (bx / A) * r.width, r.top + by * r.height];
        };
        return { svg, toBoard, fromBoard };
      };
    }
  }

  function installChase(BASE, S, V, constants) {
    const { NS } = constants;
    if (V === 'chase') {
      BASE.rendered = (ctx, f) => {
        const side = f.body.querySelector('.ut-side');
        const target = S.D.sideTarget && document.querySelector(S.D.sideTarget);
        if (side && target) target[S.D.sidePlacement](side);
        const metrics = f.body.querySelector('.ds-chase-metrics');
        const readout = S.D.metricsTarget && document.querySelector(S.D.metricsTarget);
        if (metrics && readout) readout.append(metrics);
        S.P.resizeBoard(ctx, f);
      };

      BASE.build = function (ctx, f, up) {
        const { spec, util } = ctx;
        const fam = env.taskDef;
        const main = util.el('div', 'ut-main', f.body);
        const side = util.el('div', 'ut-side', f.body);
        const b = S.P.boardSvg(util, main, spec.A, 'chase');
        const grid = util.svg('g', { class: 'ut-grid' }, b.svg);
        for (let x = 0.1; x < spec.A - 1e-6; x += 0.1)
          util.svg('line', { x1: x, y1: 0, x2: x, y2: 1, 'stroke-width': 1, ...NS }, grid);
        for (let y = 0.1; y < 1 - 1e-6; y += 0.1)
          util.svg('line', { x1: 0, y1: y, x2: spec.A, y2: y, 'stroke-width': 1, ...NS }, grid);
        const trail = util.svg('polyline', { class: 'ut-trail', 'stroke-width': 2, ...NS }, b.svg);
        const circle = util.svg('circle', { class: 'ut-circle', r: spec.r, 'stroke-width': 2.5, ...NS }, b.svg);
        const dot = util.svg('circle', { class: 'ut-dot', r: spec.r * 0.09 }, b.svg);

        const { leftV, leftM, insV, insM, pill } = S.P.metrics(ctx, main, side);

        const hov = S.P.hover(ctx, b, up);

        function sync(m) {
          const t = Math.min(m.t, spec.dur);
          const [cx, cy] = fam.helpers.chasePos(spec, t);
          circle.setAttribute('cx', cx);
          circle.setAttribute('cy', cy);
          dot.setAttribute('cx', cx);
          dot.setAttribute('cy', cy);
          const pts = [];
          for (let i = 18; i >= 0; i--) {
            const ti = t - (i / 18) * 3 * spec.beat;
            if (ti >= 0)
              pts.push(
                fam.helpers
                  .chasePos(spec, ti)
                  .map((v) => v.toFixed(4))
                  .join(','),
              );
          }
          trail.setAttribute('points', pts.join(' '));
          const rest = Math.max(0, spec.dur - m.t);
          leftV.textContent = S.P.metricValue(t, spec.dur);
          leftM.style.width = `${(100 * t) / spec.dur}%`;
          insV.textContent = S.P.metricValue(m.inside, spec.need);
          insM.style.width = `${Math.min(100, (100 * m.inside) / spec.dur)}%`;
          const inside = m.p && Math.hypot(m.p[0] - cx, m.p[1] - cy) <= spec.r;
          pill.className = 'ut-pill ' + (m.p ? (inside ? 'on' : 'off') : '');
          pill.textContent = m.p ? (inside ? 'inside the circle' : 'outside the circle') : 'not on the board';
          S.P.metricsSync(ctx, m);
          f.setStatus(m.t >= spec.dur ? 'Round over' : `Round: <b>${S.P.sec1(spec.dur)} s</b>`);
        }
        return {
          sync,
          locate: (tg) => (tg.point ? b.fromBoard(tg.point) : null),
          detach: () => hov.detach(),
        };
      };

      BASE.metrics = (ctx, main, side) => {
        const { util, spec } = ctx;
        const metrics = util.el('div', 'ds-chase-metrics', side);
        const left = util.el('section', 'ds-chase-metric', metrics);
        util.el('div', 'ut-k', left, S.D.elapsedLabel);
        const leftV = util.el('div', 'ut-v', left);
        const leftM = util.el('i', '', util.el('div', 'ut-meter', left));
        const ins = util.el('section', 'ds-chase-metric', metrics);
        util.el('div', 'ut-k', ins, S.D.insideLabel);
        const insV = util.el('div', 'ut-v', ins);
        const insBar = util.el('div', 'ut-meter', ins);
        const insM = util.el('i', '', insBar);
        const goal = util.el('u', '', insBar);
        goal.style.display = 'none';
        S.P.extraMetrics(ctx, main, metrics);
        const details = util.el('section', 'ds-chase-details', side);
        util.el('h3', '', details, 'Target details');
        S.P.details(ctx, details);
        const pill = util.el('span', 'ds-pointer-status', details);
        pill.hidden = true;

        S.P.readout(ctx, main);
        return { leftV, leftM, insV, insM, pill };
      };

      BASE.details = (ctx, details) => {
        const { util, spec } = ctx;
        [
          ['Target size (diameter)', Math.round(2 * spec.r * ctx.size.height) + ' px'],
          ['Total duration', S.P.sec1(spec.dur) + ' seconds'],
          ['Required dwell time', S.P.sec1(spec.need) + ' seconds'],
          ['Pointer', 'Mouse only'],
        ].forEach(([k, v]) => {
          const r = util.el('div', '', details);
          util.el('span', '', r, k);
          util.el('span', '', r, v);
        });
      };

      BASE.hover = (ctx, b, up) => {
        if (S.D.motionOnly)
          for (const type of ['pointerenter', 'pointermove'])
            b.svg.addEventListener(
              type,
              (e) => {
                if (!e.movementX && !e.movementY) e.stopImmediatePropagation();
              },
              true,
            );
        return env.ui.hover(b.svg, {
          clock: ctx.clock,
          label: 'board',
          onMove: ({ x, y }) => {
            const p = b.toBoard([x, y]).map((v) => Math.round(v * 10000) / 10000);
            up({ p });
          },
          onLeave: () => up({ p: null }),
        });
      };

      BASE.metricValue = (value, total) => `${S.P.sec1(value)} / ${S.P.sec1(total)} s`;

      BASE.extraMetrics = (ctx, main, metrics) => {};

      BASE.readout = (ctx, main) => {};

      BASE.metricsSync = (ctx, m) => {};

      BASE.resizeBoard = (ctx, f) => {
        const board = f.body.querySelector('.ut-board');
        if (board) {
          const w = Math.min(ctx.size.width, ctx.size.height * ctx.spec.A);
          board.setAttribute('width', w);
          board.setAttribute('height', w / ctx.spec.A);
          const size = document.querySelector('.ds-chase-details>div span:last-child');
          if (size) size.textContent = Math.round((2 * ctx.spec.r * w) / ctx.spec.A) + ' px';
        }
      };
    }
  }

  function installMoving(BASE, S, V, constants) {
    const { NS, ICON, APPS } = constants;
    if (V === 'moving') {
      BASE.frame = function (ctx) {
        const { util, rng, spec, size } = ctx;
        // Size and place the console inside the stage (not always centered, not always full size).
        const maxW = Math.min(1120, Math.floor(size.width) - 16);
        const W = Math.max(Math.min(maxW, 780), Math.round(maxW * rng.float(0.8, 1)));
        const maxH = Math.min(700, Math.floor(size.height) - 12);
        const H = Math.max(Math.min(maxH, 470), Math.round(maxH * rng.float(0.86, 1)));
        const arena = util.el('div', 'ut-arena', ctx.stage);
        arena.style.width = W + 'px';
        arena.style.height = H + 'px';
        arena.style.left = Math.round(rng.pick([0.5, 0.5, rng.float(0, 1)]) * (size.width - W)) + 'px';
        arena.style.top = Math.round(rng.pick([0.5, rng.float(0, 1)]) * (size.height - H)) + 'px';
        const bar = util.el('div', 'ut-bar', arena);
        const app = util.el('div', 'ut-app', bar);
        const ic = util.el('i', '', app);
        ic.innerHTML = ICON.app;
        const [name, sub] = rng.pick(APPS[spec.scenario]);
        util.el('span', '', app, name);
        util.el('small', '', app, sub);
        const status = util.el('div', 'ut-status', bar);
        const clock = util.el('div', 'ut-clock', bar);
        clock.innerHTML = ICON.clock;
        const clockT = util.el('span', '', clock, '0:00');
        const body = util.el('div', 'ut-body', arena);
        return {
          arena,
          body,
          status,
          setClock: (t) => {
            clockT.textContent = S.P.clockText(t);
          },
          setStatus: (html) => {
            status.innerHTML = html;
          },
        };
      };

      BASE.build = (ctx, f, up) => buildMoving(S, NS, ctx, f, up);

      BASE.shapeEl = function (util, g, shape, r, fill) {
        let el;
        if (shape === 'circle') el = util.svg('circle', { r }, g);
        else if (shape === 'square')
          el = util.svg('rect', { x: -0.85 * r, y: -0.85 * r, width: 1.7 * r, height: 1.7 * r, rx: 0.2 * r }, g);
        else if (shape === 'triangle' && S.D.triangle)
          el = util.svg('polygon', { points: `0,${-1.1 * r} ${1.05 * r},${0.85 * r} ${-1.05 * r},${0.85 * r}` }, g);
        else el = util.svg('polygon', { points: `0,${-1.1 * r} ${1.1 * r},0 0,${1.1 * r} ${-1.1 * r},0` }, g);
        el.setAttribute('class', 'ut-item');
        el.setAttribute('fill', fill);
        el.setAttribute('stroke-width', 2);
        el.setAttribute('vector-effect', 'non-scaling-stroke');
        return el;
      };

      BASE.side = (ctx, f) => ctx.util.el('div', 'ut-side', f.body);

      BASE.board = (ctx, board, main) => {};

      BASE.item = (ctx, main, g, it, i) => {
        S.P.shapeEl(ctx.util, g, it.shape, ctx.spec.r, ctx.spec.colors[it.color]);
        const tip = ctx.util.svg('title', {}, g);
        tip.textContent = `${it.color} ${it.shape}`;
      };

      BASE.metrics = (ctx, side) => {
        const { spec, util } = ctx;
        const tc = S.P.sideCard(util, side, 'Catch');
        const tv = util.el('div', 'ut-v', tc);
        tv.style.fontSize = '18px';
        tv.style.whiteSpace = 'nowrap';
        const sw = util.el('span', 'ut-swatch', tv);
        sw.style.background = spec.colors[spec.color];
        tv.append(`${spec.color} shapes`);
        const cc = S.P.sideCard(util, side, S.D.caughtLabel ? `Shapes to catch (${spec.color}):` : 'Caught');
        const cv = util.el('div', 'ut-v', cc);
        const tally = util.el('div', 'ut-tally', cc);
        const dots = [...Array(spec.nTargets)].map(() => util.el('i', '', tally));
        const mc = S.P.sideCard(util, side, 'Missed clicks');
        const mv = util.el('div', 'ut-v', mc);
        util.el(
          'div',
          'ut-note',
          side,
          'Shapes slide along the lanes in the direction of the arrows. Other colors do not count; clicking one ends the round.',
        );

        return { cv, dots, mv };
      };

      BASE.metricsSync = (ctx, f, metrics, m) => {
        const { spec } = ctx;
        const fam = env.taskDef;
        const { cv, dots, mv } = metrics;
        const got = m.hits.filter((i) => spec.items[i].target).length;
        if (S.D.caughtLabel) cv.textContent = String(Math.max(0, spec.nTargets - got));
        else cv.innerHTML = `${got} <small>of ${spec.nTargets}</small>`;
        dots.forEach((d, i) => {
          d.className = i < got ? 'got' : '';
          d.style.background = i < got ? spec.colors[spec.color] : '';
        });
        mv.textContent = String(m.misses);
        const onBoard = spec.items.filter((_, i) => !m.hits.includes(i) && fam.helpers.itemPos(spec, i, m.t)).length;
        f.setStatus(`On the board: <b>${onBoard}</b>`);
      };

      BASE.hit = (ctx, sync) => {};
    }
  }
  env.template('act-in-time/_arena-boards', () => ({ installBoard, installChase, installMoving }));
})();
