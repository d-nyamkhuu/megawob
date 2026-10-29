// Design on templates/click-point/base.js: the base site's click-point widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'click-point',
  site: 'design-click-point-dense-04',
  name: 'design',
  split: 'train',
  scenarios: ['dense'],
  template: 'click-point/base',
  design: {
    parts: {
      'build': (base, S) => function build(ctx, flavor) {
        const { FILLS, bindClicks, buildCad, drawAxis, drawBisect, drawCenter, drawDense, drawGrid, drawMap, drawMidpoint, drawPath, drawRightAngle, ensureStyle, placeCard, showMarker } = S;
          ensureStyle();
          const { util, rng, size } = ctx;
          S.spec = ctx.spec;
          S.afterClick = null;
          S.posEl = null;
          S.style = {
            flavor,
            grid: rng.pick(['dots', 'lines', 'lines', 'plain']),
            gridStep: rng.int(20, 32),
            sw: rng.pick([2, 2.5, 3, 4]),
            point: rng.pick(['dot', 'dot', 'cross', 'ring']),
            guide: rng.bool(0.5),
            angleMark: rng.bool(0.6),
            rayEnd: rng.pick(['arrow', 'dot', 'none']),
            minDash: rng.pick(['2 5', '5 5', '1 4']),
            minFill: rng.bool(0.4),
            fill: rng.pick(FILLS),
            edges: rng.bool(0.5),
            dashOutline: rng.bool(0.2),
            serif: rng.bool(0.3),
            labelTurn: rng.float(-0.7, 0.7),
            rulerFill: rng.pick(['#f6e7b0', '#e9eef3', '#f3f0e6', '#dfe9d8']),
            minorGrid: rng.bool(0.5),
            markers: rng.bool(0.6),
            water: rng.pick(['#b9d6ea', '#a9cbe3', '#c3dcec']),
            land: rng.pick(['#e9e4d0', '#e4ead2', '#efe9dc']),
            graticule: rng.pick(['rgba(40,60,90,.45)', 'rgba(20,20,20,.35)']),
            gratDash: rng.pick(['none', '4 4']),
            casing: rng.pick(['#c9c3b3', '#bfc5cc']),
            road: rng.int(7, 11),
          };

          const aspect = S.spec.board.w / S.spec.board.h;
          const fit = Math.min(size.height - 72 - (flavor === 'cad' ? 52 : flavor === 'tiles' ? 58 : 0), (size.width - 80 - (flavor === 'cad' ? 22 : 0)) / aspect);
          const H = Math.floor(Math.min(fit, rng.int(440, 600)));
          S.scale = H / S.spec.board.h;
          const W = Math.round(S.spec.board.w * S.scale);

          const wrap = util.el('div', 'cp-wrap', ctx.stage);
          let board;
          let rulers = null;
          let card = null;
          if (flavor === 'cad') {
            // corner | top ruler / left ruler | board / status bar / command line (a 2-column grid)
            card = util.el('div', 'cp-cad', wrap);
            util.el('div', 'cp-corner', card);
            rulers = {
              top: util.svg('svg', { class: 'cp-ruler', width: W, height: 22, viewBox: `0 0 ${W} 22` }, card),
              left: util.svg('svg', { class: 'cp-ruler', width: 22, height: H, viewBox: `0 0 22 ${H}` }, card),
            };
            board = util.el('div', 'cp-board', card);
          } else if (flavor === 'tiles') {
            card = util.el('div', 'cp-tiles', wrap);
            const head = util.el('div', 'cp-head', card);
            util.el('span', '', head, rng.pick(['Atlas', 'Wayfinder', 'City map', 'Cartograph']));
            util.el('div', 'cp-search', head, 'Search places');
            const zoom = util.el('div', 'cp-zoom', head);
            for (const sign of ['+', '−']) {
              const b = util.el('button', '', zoom, sign);
              b.type = 'button';
              b.setAttribute('aria-label', sign === '+' ? 'Zoom in' : 'Zoom out');
              b.addEventListener('click', () => ctx.log('decoy', { what: 'zoom' }));
            }
            board = util.el('div', 'cp-board', card);
          } else board = util.el('div', 'cp-board', wrap);
          S.svg = util.svg('svg', { width: W, height: W, viewBox: `0 0 ${W} ${H}` }, board);
          S.svg.dataset.role = 'board';
          if (S.spec.scenario === 'path-mid') Object.assign(S.style, { grid: 'lines', gridStep: S.spec.grid * S.scale });
          if (S.spec.scenario === 'map' || S.spec.scenario === 'axis' && S.spec.kind !== 'ruler') S.style.grid = 'plain';
          drawGrid(util, W, H);
          const g = util.svg('g', { class: 'cp-fig' }, S.svg);
          if (S.spec.scenario === 'center') drawCenter(util, g);
          else if (S.spec.scenario === 'midpoint') drawMidpoint(util, g);
          else if (S.spec.scenario === 'bisect') drawBisect(util, g);
          else if (S.spec.scenario === 'right-angle') drawRightAngle(util, g);
          else if (S.spec.scenario === 'axis') drawAxis(util, g, rng);
          else if (S.spec.scenario === 'map') drawMap(util, g, rng, W, H);
          else if (S.spec.scenario === 'path-mid') drawPath(util, g);
          else drawDense(util, g, rng);
          S.markG = util.svg('g', { class: 'cp-mark' }, S.svg);
          showMarker(util, ctx.model);
          S.surface = bindClicks(ctx);
          if (flavor === 'cad') buildCad(ctx, card, rulers, W, H);
          if (flavor === 'tiles') util.el('div', 'cp-attrib', card, 'Map data © contributors');

          if (flavor !== 'cad') {
            const hint = util.el('div', 'cp-hint', wrap);
            hint.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="6" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="9" cy="9" r="1.6" fill="var(--accent)"/></svg>';
            util.el('span', '', hint, flavor === 'tiles' ? rng.pick(['Click the map to drop a pin. Clicking again moves it.', 'Click to place the pin; click again to move it.'])
              : rng.pick(['Click on the board to place the marker. Clicking again moves it.', 'Click to drop a marker; click again to move it.', 'One click places the marker.']));
            S.posEl = util.el('span', 'cp-pos', hint);
            showMarker(util, ctx.model);
          }
          const sync = (m) => {
            S.surface.set(m.point);
            showMarker(util, m);
          };
          placeCard(wrap, ctx);
          return { anchors: [S.svg], sync };
      },
    },
  },
});
