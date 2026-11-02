/* read-figure/_scene-widgets: shared template implementation; design parts stay on the calling template. */
(function () {
  'use strict';
  function installAddition(BASE, scope, V) {
    if (V === 'addition') {
      BASE.cube = (ctx, group, i, k) => {
        const b = scope.u.el('span', 'cube', group);
        if (!scope.D.cubeFaces) return;
        const svg = scope.u.svg('svg', { viewBox: '0 0 100 100' }, b);
        ['0,22 22,0 100,0 78,22', '0,22 78,22 78,100 0,100', '78,22 100,0 100,78 78,100'].forEach((points, j) =>
          scope.u.svg(
            'polygon',
            { points, fill: scope.D.cubeFaces[j], ...(scope.D.cubeStroke ? { stroke: scope.D.cubeStroke, 'stroke-width': 1 } : {}) },
            svg,
          ),
        );
      };
      BASE.widget = (ctx) => {
        [scope.s.a, scope.s.b].forEach((n, i) => {
          if (i) scope.u.el('span', 'plus', scope.scene, '+');
          const group = scope.u.el('div', 'blocks', scope.scene);
          for (let k = 0; k < n; k++) scope.P.cube(ctx, group, i, k);
        });
        scope.P.input(scope.D.additionInputParent === 'scene' ? scope.scene : scope.root, 'text', 'Total number of blocks:');
      };
    }
  }

  function installAscending(BASE, scope, V) {
    if (V === 'ascending') {
      BASE.numberGeometry = (ctx, b, e, p, i) => {
        const cw = (ctx.size.width - 35) / scope.s.gw,
          ch = (ctx.size.height - 70) / scope.s.gh,
          T = Math.min(62, cw - 12, ch - 10);
        e.style.cssText = `left:${6 + p.c * cw + p.jx * (cw - T - 8)}px;top:${5 + p.r * ch + p.jy * (ch - T - 8)}px;width:${T}px;height:${T}px`;
      };
      BASE.widget = (ctx) => {
        const b = scope.u.el('div', 'ascending-board', scope.scene);
        let prefix = (m) => {
          let k = 0;
          while (k < m.clicks.length && m.clicks[k] === scope.s.order[k]) k++;
          return k;
        };
        scope.s.cells.forEach((p, i) => {
          const e = scope.P.button(
            b,
            String(scope.s.values[i]),
            { number: i },
            () => {
              const m = ctx.model;
              if (m.clicks.includes(i) || m.clicks.length > prefix(m)) return;
              scope.P.set({ clicks: m.clicks.concat(i), wrong: (m.wrong || 0) + (scope.s.order[m.clicks.length] === i ? 0 : 1) });
            },
            'number-tile',
          );
          scope.P.numberGeometry(ctx, b, e, p, i);
          scope.paints.push((m) => {
            const pos = m.clicks.indexOf(i),
              bad = pos >= prefix(m) && pos >= 0,
              gone = pos >= 0 && !bad;
            e.classList.toggle('gone', gone);
            e.classList.toggle('bad', bad);
            e.textContent = scope.s.mode === 'hide' && m.clicks.length && !bad ? '' : String(scope.s.values[i]);
          });
        });
      };
    }
  }

  function installColor(BASE, scope, V) {
    if (V === 'color') {
      BASE.swatchSize = (ctx) => {
        scope.scene.style.setProperty(
          '--swatch-size',
          Math.max(
            24,
            Math.min(150, (ctx.size.width - 80 - (scope.s.hex.length - 1) * 15) / scope.s.hex.length, (ctx.size.height - 220) / 2),
          ) + 'px',
        );
        scope.scene.style.setProperty('--sample-size', Math.max(30, Math.min(165, (ctx.size.height - 160) / 2)) + 'px');
      };
      BASE.colorReady = (ctx, sample, choices) => {};
      BASE.widget = (ctx) => {
        const sample = scope.u.el('div', 'sample', scope.scene);
        if (scope.D.swatchSizing) scope.P.swatchSize(ctx);
        scope.u.el('b', '', sample, scope.D.sampleLabel);
        const sw = scope.u.el('i', '', sample);
        sw.style.background = scope.s.hex[scope.s.target];
        const choices = scope.u.el('div', 'swatches', scope.scene);
        scope.s.hex.forEach((hex, i) => {
          const b = scope.P.button(choices, '', { swatch: i }, () => scope.P.answer(i), 'swatch');
          b.style.background = hex;
          b.setAttribute('aria-label', scope.s.colors[i]);
          scope.paints.push((m) => (b.style.outline = m.answer === i ? '3px solid var(--accent)' : ''));
        });
        scope.P.colorReady(ctx, sample, choices);
      };
    }
  }

  function installCount(BASE, scope, V) {
    if (V === 'count') {
      BASE.countOptions = (ctx) => {
        let parent = scope.root;
        if (scope.D.answerCaption !== null) {
          parent = scope.u.el('div', 'count-options', scope.root);
          scope.u.el('span', '', parent, scope.D.answerCaption);
        }
        scope.P.options(parent, scope.s.options);
      };
      BASE.widget = (ctx) => {
        if (scope.s.mode === 'shapes') scope.P.board(scope.s.items, scope.s.cols, scope.s.rows, false);
        else {
          const svg = scope.u.svg('svg', { width: 380, height: 230, viewBox: '0 0 380 230' }, scope.scene);
          scope.u.svg(
            'polygon',
            {
              points: scope.P.poly(scope.s.sides, 190, 115, 95 * scope.s.scale, scope.s.rot),
              fill: 'none',
              stroke: scope.f.helpers.ITEM_COLORS[scope.s.color] || '#222',
              'stroke-width': 3,
            },
            svg,
          );
        }
        if (scope.s.answer === 'typed') scope.P.input(scope.root, 'text', scope.D.typedLabel);
        else scope.P.countOptions(ctx);
      };
    }
  }

  function installGreatest(BASE, scope, V) {
    if (V === 'greatest') {
      BASE.widget = (ctx) => {
        const grid = scope.u.el('div', 'number-cards', scope.scene);
        grid.style.setProperty('--n', scope.s.values.length);
        scope.s.values.forEach((v, i) => {
          const b = scope.P.button(
            grid,
            String(v),
            { card: i },
            () => {
              const m = ctx.model;
              scope.P.set({ up: i, seen: m.seen.includes(i) ? m.seen : m.seen.concat(i) });
            },
            'number-card',
          );
          scope.paints.push((m) => {
            b.classList.toggle('selected', m.up === i);
            b.classList.toggle('down', scope.s.mode === 'cards' && m.up !== i);
            b.setAttribute('aria-label', scope.s.mode === 'cards' && m.up !== i ? 'Face-down card' : String(v));
          });
        });
      };
    }
  }

  function installGrid(BASE, scope, V) {
    if (V === 'grid') {
      BASE.gridSize = (ctx) => ({ W: ctx.size.width - 20, H: Math.max(120, ctx.size.height - 55) });
      BASE.gridGeometry = (ctx) => {
        const { W, H } = scope.P.gridSize(ctx),
          pad = 38;
        return {
          W,
          H,
          pad,
          X: (x) => pad + ((x + scope.s.xr) * (W - 2 * pad)) / (2 * scope.s.xr),
          Y: (y) => pad + ((scope.s.yr - y) * (H - 2 * pad)) / (2 * scope.s.yr),
        };
      };
      BASE.gridFrame = (ctx, { W, H }) =>
        scope.u.svg(
          'svg',
          {
            width: W,
            height: H,
            viewBox: `0 0 ${W} ${H}`,
            class: 'plane',
            ...(scope.D.gridAspect ? { preserveAspectRatio: scope.D.gridAspect } : {}),
          },
          scope.scene,
        );
      BASE.gridLine = (ctx, svg, { W, H, pad, X, Y }, value, axis) => {
        const cls = value === 0 ? 'axis' : 'gridline';
        scope.u.svg(
          'line',
          axis === 'x'
            ? { x1: X(value), x2: X(value), y1: pad / 2, y2: H - pad / 2, class: cls }
            : { x1: pad / 2, x2: W - pad / 2, y1: Y(value), y2: Y(value), class: cls },
          svg,
        );
      };
      BASE.gridTick = (ctx, svg, { X, Y }, value, axis) => {
        const T = scope.D.tickSize;
        if (!T) return;
        if (axis === 'x') scope.u.svg('line', { x1: X(value), x2: X(value), y1: Y(0) - T, y2: Y(0) + T, class: 'tick' }, svg);
        else scope.u.svg('line', { x1: X(0) - T, x2: X(0) + T, y1: Y(value), y2: Y(value), class: 'tick' }, svg);
      };
      BASE.gridLabel = (ctx, svg, { X, Y }, value, axis) => {
        const t = scope.u.svg(
          'text',
          axis === 'x' ? { x: X(value) - 6, y: Y(0) + 23 } : { x: X(0) - 25, y: Y(value) + 5 },
          svg,
        );
        t.textContent = value;
      };
      BASE.gridArrows = (ctx, svg, { W, H, pad, X, Y }) => {
        if (!scope.D.gridArrows) return;
        let path = `M${W - 25} ${Y(0) - 8} L${W - 10} ${Y(0)} L${W - 25} ${Y(0) + 8}z`;
        if (scope.D.arrowEnds === 'all') path += ` M25 ${Y(0) - 8} L10 ${Y(0)} L25 ${Y(0) + 8}z`;
        path += ` M${X(0) - 8} 25 L${X(0)} 10 L${X(0) + 8} 25z`;
        if (scope.D.arrowEnds === 'all') path += ` M${X(0) - 8} ${H - 25} L${X(0)} ${H - 10} L${X(0) + 8} ${H - 25}z`;
        scope.u.svg('path', { d: path, fill: scope.D.arrowColor }, svg);
        scope.u.svg('text', { x: W - 18, y: Y(0) - 18 }, svg).textContent = 'x';
        scope.u.svg('text', { x: X(0) + 16, y: 22 }, svg).textContent = 'y';
      };
      BASE.gridDecorated = (ctx, svg, geo) => {
        scope.P.gridArrows(ctx, svg, geo);
      };
      BASE.gridRadius = (ctx, { W, H, pad }) => Math.min((W - 2 * pad) / (2 * scope.s.xr), (H - 2 * pad) / (2 * scope.s.yr)) * 0.38;
      BASE.widget = (ctx) => {
        const geo = scope.P.gridGeometry(ctx),
          { W, H, pad, X, Y } = geo,
          svg = scope.P.gridFrame(ctx, geo);
        for (let x = -scope.s.xr; x <= scope.s.xr; x++) {
          scope.P.gridLine(ctx, svg, geo, x, 'x');
          scope.P.gridTick(ctx, svg, geo, x, 'x');
          scope.P.gridLabel(ctx, svg, geo, x, 'x');
        }
        for (let y = -scope.s.yr; y <= scope.s.yr; y++) {
          scope.P.gridLine(ctx, svg, geo, y, 'y');
          scope.P.gridTick(ctx, svg, geo, y, 'y');
          if (y) scope.P.gridLabel(ctx, svg, geo, y, 'y');
        }
        scope.P.gridDecorated(ctx, svg, geo);
        for (let x = -scope.s.xr; x <= scope.s.xr; x++)
          for (let y = -scope.s.yr; y <= scope.s.yr; y++) {
            const hit = scope.u.svg('circle', { cx: X(x), cy: Y(y), r: scope.P.gridRadius(ctx, geo), class: 'hit' }, svg);
            hit.addEventListener('click', () => scope.P.answer(`${x},${y}`));
            scope.refs.set(JSON.stringify({ point: [x, y] }), hit);
            scope.paints.push((m) => hit.classList.toggle('chosen', m.answer === `${x},${y}`));
          }
      };
    }
  }

  function installIdentify(BASE, scope, V) {
    if (V === 'identify') {
      BASE.fClamp = (v) => {
        return Math.min(1.1, v || 1);
      };
      BASE.identifySize = (ctx) => ({
        W: Math.min(600, ctx.size.width - 40),
        H: Math.max(80, Math.min(300, ctx.size.height - 150)),
      });
      BASE.identifyFrame = (ctx, W, H) =>
        scope.u.svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, style: 'border:1px solid var(--line)' }, scope.scene);
      BASE.identified = (ctx, svg, W, H) => {};
      BASE.widget = (ctx) => {
        scope.scene.style.flexDirection = 'column';
        const { W, H } = scope.P.identifySize(ctx),
          svg = scope.P.identifyFrame(ctx, W, H);
        scope.P.figure(
          scope.u,
          svg,
          scope.s.figure,
          W / 2,
          H / 2,
          Math.min(W, H) * scope.D.figureScale * scope.P.fClamp(scope.s.figure.scale),
          scope.f.helpers.ITEM_COLORS[scope.s.figure.color],
        );
        scope.P.identified(ctx, svg, W, H);
        scope.P.options(scope.scene, scope.s.options);
      };
    }
  }

  function installNumberCheckboxes(BASE, scope, V) {
    if (V === 'number-checkboxes') {
      BASE.pixelTitles = (ctx) => ['Example', scope.D.answerTitle];
      BASE.pixelParent = (ctx, row, n) => row;
      BASE.pixelSize = (ctx) =>
        Math.max(
          12,
          Math.min(scope.D.pixelMax, Math.floor((ctx.size.height - scope.D.pixelInset - (scope.s.rows - 1) * scope.D.pixelGap) / scope.s.rows)),
        ) + 'px';
      BASE.pixelGrid = (ctx, wrap, grid, n) => {};
      BASE.pixelReady = (ctx, wrap, grid, n) => {};
      BASE.widget = (ctx) => {
        const row = scope.u.el('div', 'pixels', scope.scene);
        scope.P.pixelTitles(ctx).forEach((title, n) => {
          const wrap = scope.u.el('div', 'pixel-wrap', scope.P.pixelParent(ctx, row, n));
          scope.u.el('b', scope.D.titleClass, wrap, title);
          const grid = scope.u.el('div', 'pixel-grid', wrap);
          grid.style.setProperty('--cols', scope.s.cols);
          grid.style.setProperty('--pixel', scope.P.pixelSize(ctx));
          scope.P.pixelGrid(ctx, wrap, grid, n);
          scope.s.pattern.flat().forEach((v, i) => {
            if (!n) scope.u.el('i', v ? 'on' : '', grid);
            else {
              const e = scope.u.el('input', '', grid);
              e.type = 'checkbox';
              e.setAttribute('aria-label', `Row ${Math.floor(i / scope.s.cols) + 1}, column ${(i % scope.s.cols) + 1}`);
              e.addEventListener('change', () => {
                const on = ctx.model.on;
                scope.P.set({ on: e.checked ? on.concat(i) : on.filter((k) => k !== i) });
                scope.P.pixelReady(ctx, wrap, grid, n);
              });
              scope.refs.set(JSON.stringify({ cell: i }), e);
              scope.paints.push((m) => (e.checked = m.on.includes(i)));
            }
          });
          scope.P.pixelReady(ctx, wrap, grid, n);
        });
      };
    }
  }

  function installShape(BASE, scope, V) {
    if (V === 'shape') {
      BASE.shape = (ctx) => {
        scope.P.board(scope.s.items, scope.s.cols, scope.s.rows, true);
      };
      BASE.widget = (ctx) => {
        scope.P.shape(ctx);
      };
    }
  }

  function install(BASE, scope, V) {
    installAddition(BASE, scope, V);
    installAscending(BASE, scope, V);
    installColor(BASE, scope, V);
    installCount(BASE, scope, V);
    installGreatest(BASE, scope, V);
    installGrid(BASE, scope, V);
    installIdentify(BASE, scope, V);
    installNumberCheckboxes(BASE, scope, V);
    installShape(BASE, scope, V);
  }
  env.template('read-figure/_scene-widgets', () => ({ install }));
})();
