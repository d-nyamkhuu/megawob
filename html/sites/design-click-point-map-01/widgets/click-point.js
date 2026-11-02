// Design on templates/click-point/base.js: the base site's click-point widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'click-point',
  site: 'design-click-point-map-01',
  name: 'design',
  split: 'train',
  scenarios: ['map'],
  template: 'click-point/base',
  design: {
    parts: {
      'drawMapFigure': (base, S) => function drawMapFigure(util, g, rng, W, H) {
        const { F, T, f1, px } = S;
        const fam = F();
        if (S.spec.mode === 'coord') {
          util.svg('rect', { x: 0, y: 0, width: W, height: H, fill: S.style.water }, g);
          // Regional map artwork: coordinates are normalized so it scales with the unchanged clickable board.
          const land = util.svg('g', { transform: `scale(${W} ${H})`, fill: S.style.land, stroke: '#68a99c', 'stroke-width': '.0012', 'stroke-linejoin': 'round' }, g);
          const coast = [
            'M0 0H.62 C.65 .03 .62 .05 .65 .07 C.68 .09 .63 .11 .62 .12 C.60 .14 .65 .15 .68 .18 C.69 .20 .65 .21 .63 .23 C.61 .25 .59 .28 .56 .29 C.53 .30 .51 .27 .49 .30 C.47 .32 .46 .35 .43 .33 C.40 .31 .40 .28 .37 .26 C.35 .23 .36 .21 .33 .20 C.30 .18 .29 .18 .26 .16 C.23 .14 .22 .11 .19 .12 C.16 .13 .15 .17 .12 .15 C.10 .13 .09 .11 .07 .13 C.05 .14 .03 .10 0 .11Z',
            'M.21 .12L.24 .15 .27 .16 .30 .19 .32 .23 .34 .29 .35 .36 .34 .42 .33 .47 .31 .50 .30 .46 .29 .41 .27 .35 .25 .30 .23 .25 .21 .20Z',
            'M.32 .31L.36 .29 .40 .30 .43 .34 .45 .38 .44 .43 .42 .48 .41 .54 .39 .58 .37 .55 .36 .50 .34 .46 .32 .42Z',
            'M.43 .35L.47 .34 .51 .35 .54 .37 .57 .40 .60 .42 .63 .40 .67 .38 .70 .40 .72 .44 .70 .48 .67 .49 .64 .47 .61 .49 .58 .48 .55 .45 .52 .43 .49 .44 .46 .42 .44 .39Z',
            'M.57 .48L.61 .47 .64 .49 .66 .52 .65 .56 .63 .59 .62 .64 .60 .67 .58 .63 .57 .58 .55 .54Z',
            'M.72 .48L.75 .45 .77 .47 .78 .51 .76 .54 .74 .52Z M.79 .48L.82 .47 .84 .50 .83 .54 .80 .55 .78 .52Z M.77 .56L.80 .55 .82 .58 .80 .61 .78 .60Z M.74 .57L.76 .55 .77 .58 .75 .60Z',
            'M.59 .69L.63 .68 .67 .70 .70 .74 .73 .78 .76 .80 .80 .81 .84 .79 .88 .80 .93 .83 .97 .86 1 .87V.90L.96 .92 .92 .91 .88 .89 .84 .88 .80 .87 .77 .86 .73 .85 .69 .84 .65 .82 .61 .79 .58 .76Z',
            'M.64 .88L.68 .89 .70 .91 .68 .93 .65 .92Z M.72 .90L.77 .91 .80 .93 .77 .94 .73 .93Z M.82 .91L.87 .92 .90 .94 .87 .95 .83 .94Z',
            'M.48 .50L.49 .54 .50 .58 .51 .62 .53 .65 .54 .69 .56 .72 .57 .77 .58 .81 .57 .85 .55 .82 .54 .78 .53 .74 .51 .70 .50 .66 .49 .62 .48 .58 .47 .54Z',
            'M.42 .55L.44 .58 .45 .62 .44 .67 .43 .71 .42 .68 .42 .63Z',
            'M.34 .50L.36 .53 .37 .57 .36 .61 .35 .58Z M.38 .49L.39 .53 .39 .57 .38 .55Z',
            'M.61 .63L.64 .62 .67 .63 .69 .66 .68 .69 .65 .70 .62 .68Z M.70 .65L.73 .64 .75 .66 .74 .69 .71 .69Z',
            'M.63 .80L.66 .78 .69 .76 .72 .77 .75 .76 .78 .78 .81 .79 .84 .78 .87 .80 .90 .82 .93 .82 .96 .85 .98 .89 .97 .93 .95 .97 .92 1 .69 1 .66 .97 .63 .93 .61 .89 .61 .85Z',
            'M.59 .73L.62 .74 .64 .77 .62 .79 .60 .77Z M.69 .72L.72 .73 .73 .76 .71 .77 .68 .75Z M.78 .74L.81 .75 .82 .78 .79 .79 .77 .77Z'
          ];
          for (const d of coast) util.svg('path', { d }, land);
          for (const d of ['M.70 .07L.72 .06 .74 .08 .73 .11 .71 .12 .69 .10Z','M.72 .14L.73 .13 .74 .15 .73 .17Z','M.66 .25L.67 .24 .68 .26 .67 .28Z','M.62 .33L.63 .31 .64 .33 .63 .35Z','M.84 .66L.88 .65 .90 .67 .88 .69 .85 .69Z']) util.svg('path', { d, fill: S.style.land, stroke:'#68a99c', 'stroke-width':'.0012' }, land);
          // 10-degree graticule over the regional extent shown in the reference (60E–150E, 30N–30S).
          for (let i = 0; i <= 9; i++) {
            const x = W * i / 9;
            util.svg('line', { x1: f1(x), y1: 0, x2: f1(x), y2: H, stroke: S.style.graticule, 'stroke-width': 1, opacity: .75 }, g);
            if (i < 9) T(util, g, x + (i === 0 ? 16 : 4), H - 8, `${60 + i * 10}°E`, { class: 'cp-tick map', 'text-anchor': 'start' });
          }
          for (let i = 0; i <= 6; i++) {
            const y = H * i / 6;
            util.svg('line', { x1: 0, y1: f1(y), x2: W, y2: f1(y), stroke: S.style.graticule, 'stroke-width': 1, opacity: .75 }, g);
            const lat = 30 - i * 10;
            const labelY = i === 6 ? H - 25 : Math.max(14, y - 5);
            T(util, g, 5, labelY, lat === 0 ? '0°' : `${Math.abs(lat)}°${lat > 0 ? 'N' : 'S'}`, { class: 'cp-tick map', 'text-anchor': 'start' });
          }
          const names = [['India',.24,.28],['China',.53,.12],['Myanmar',.40,.34],['Thailand',.43,.44],['Laos',.47,.39],['Vietnam',.51,.45],['Cambodia',.48,.49],['Malaysia',.53,.59],['Indonesia',.62,.72],['Philippines',.76,.48],['Australia',.81,.91]];
          for (const [name,x,y] of names) {
            const t = T(util, g, W*x, H*y, name, { class: 'cp-tick map', 'text-anchor': 'middle' });
          }
          for (const [word,x,y] of [['Indian',.18,.66],['Ocean',.18,.70],['Pacific',.94,.36],['Ocean',.94,.40]]) {
            const t = T(util, g, W*x, H*y, word, { class:'cp-tick map', 'text-anchor':'middle' });
            t.style.fontStyle='italic'; t.style.fontSize='18px'; t.style.fill='#0879be';
          }
          return;
        }
        util.svg('rect', { x: 0, y: 0, width: W, height: H, fill: S.style.land }, g);
        const lines = S.spec.streets.map((st) => {
          // Clip the infinite street to the board.
          const c = px(st.p);
          const d = st.d;
          const ts = [];
          if (Math.abs(d[0]) > 1e-9) ts.push(-c[0] / d[0], (W - c[0]) / d[0]);
          if (Math.abs(d[1]) > 1e-9) ts.push(-c[1] / d[1], (H - c[1]) / d[1]);
          const inside = ts.filter((tt) => {
            const q = [c[0] + d[0] * tt, c[1] + d[1] * tt];
            return q[0] >= -0.5 && q[0] <= W + 0.5 && q[1] >= -0.5 && q[1] <= H + 0.5;
          }).sort((x, y) => x - y);
          const t0 = inside[0];
          const t1 = inside[inside.length - 1];
          return { st, a: [c[0] + d[0] * t0, c[1] + d[1] * t0], b: [c[0] + d[0] * t1, c[1] + d[1] * t1] };
        });
        for (const { a, b } of lines) util.svg('line', { x1: f1(a[0]), y1: f1(a[1]), x2: f1(b[0]), y2: f1(b[1]), stroke: S.style.casing, 'stroke-width': S.style.road + 3 }, g);
        for (const { a, b } of lines) util.svg('line', { x1: f1(a[0]), y1: f1(a[1]), x2: f1(b[0]), y2: f1(b[1]), stroke: '#ffffff', 'stroke-width': S.style.road }, g);
        lines.forEach(({ st, a, b }, i) => {
          let ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
          if (ang > 90) ang -= 180;
          if (ang <= -90) ang += 180;
          const f = [0.12, 0.85, 0.3, 0.68][i % 4];
          const q = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
          const t = T(util, g, q[0], q[1], st.name, { class: 'cp-tick street' });
          t.setAttribute('transform', `rotate(${ang.toFixed(1)} ${f1(q[0])} ${f1(q[1])})`);
        });
      },
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
          if (flavor === 'board' && S.spec.scenario === 'map') Object.assign(S.style, {
            water: '#a9d7f3', land: '#b9e4b2', graticule: 'rgba(35,116,166,.46)', gratDash: 'none',
          });

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
          S.svg = util.svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, board);
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
