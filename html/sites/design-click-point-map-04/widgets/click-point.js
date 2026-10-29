// Design on templates/click-point/base.js: the base site's click-point widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'click-point',
  site: 'design-click-point-map-04',
  name: 'design',
  split: 'train',
  scenarios: ['map'],
  template: 'click-point/base',
  design: {
    parts: {
      'placeCard': (base, S) => function placeCard(card, ctx) {
        // Keep the sheet centered, using the template's native SVG dimensions so
        // its drawing scale and pointer coordinates stay identical.
        const { width, height } = ctx.size;
        const board = S.svg.parentElement;
        const W = Number(S.svg.getAttribute('width'));
        const H = Number(S.svg.getAttribute('height'));
        const padX = Math.max(0, Math.min(width <= 794 ? 28 : 50, (width - W - 8) / 2));
        const padY = Math.max(0, Math.min(width <= 794 ? 20 : 28, (height - H - 8) / 2));
        Object.assign(card.style, {
          flex: 'none', width: width + 'px', height: height + 'px',
          justifyContent: 'center', gap: '0px',
        });
        board.style.padding = padY + 'px ' + padX + 'px';
        card.querySelector('.cp-hint').style.display = 'none';
        base(card, ctx);
      },
      'drawMapFigure': (base, S) => function drawMapFigure(util, g, rng, W, H) {
        const { F, T, f1, px } = S;
        const fam = F();
        if (S.spec.mode === 'coord') {
          util.svg('rect', { x: 0, y: 0, width: W, height: H, fill: S.style.water }, g);
          // A compact, deterministic geographic base map. Coordinates stay in lon/lat and
          // pass through the task's existing projection, so regional map windows crop naturally.
          const continents = [
            [[-168,65],[-160,70],[-150,72],[-140,70],[-132,65],[-128,59],[-124,54],[-124,48],[-122,42],[-117,33],[-111,31],[-106,29],[-101,25],[-97,19],[-91,18],[-87,21],[-83,24],[-81,29],[-79,33],[-75,36],[-72,41],[-67,45],[-61,48],[-58,53],[-63,57],[-69,59],[-73,63],[-79,66],[-86,69],[-95,72],[-106,74],[-118,73],[-130,71],[-143,70],[-155,72],[-165,70]],
            [[-74,60],[-66,59],[-61,55],[-58,51],[-61,48],[-65,46],[-68,43],[-71,45],[-75,49],[-78,53]],
            [[-52,60],[-45,62],[-40,68],[-43,75],[-51,81],[-60,83],[-68,80],[-66,73],[-61,67]],
            [[-81,12],[-76,9],[-78,3],[-77,-4],[-74,-10],[-72,-17],[-70,-22],[-72,-30],[-70,-38],[-73,-46],[-71,-53],[-67,-56],[-63,-52],[-61,-45],[-58,-38],[-55,-31],[-52,-25],[-48,-20],[-44,-14],[-39,-9],[-35,-5],[-38,1],[-44,4],[-50,1],[-56,3],[-62,8],[-69,11],[-75,12]],
            [[-11,36],[-9,43],[-5,48],[-8,54],[-5,58],[1,58],[5,55],[9,57],[13,55],[17,58],[21,61],[25,64],[30,70],[36,70],[40,66],[38,61],[33,57],[29,54],[24,52],[28,48],[34,46],[40,43],[45,40],[50,42],[55,48],[60,53],[67,56],[75,55],[82,59],[90,58],[96,55],[103,53],[110,51],[118,50],[123,53],[128,51],[132,48],[136,44],[140,41],[144,44],[146,48],[142,53],[138,57],[130,60],[123,62],[116,66],[108,69],[99,72],[90,74],[82,77],[73,77],[65,73],[58,70],[51,70],[45,73],[38,76],[31,75],[25,71],[19,69],[15,65],[11,62],[7,59],[4,56],[0,52],[-4,49],[-7,45],[-10,41]],
            [[-17,37],[-8,36],[0,36],[8,37],[13,33],[18,31],[25,32],[31,31],[34,27],[41,15],[43,12],[51,11],[50,4],[44,-2],[42,-11],[38,-17],[34,-23],[30,-29],[25,-34],[20,-35],[17,-31],[14,-26],[12,-19],[10,-9],[7,1],[3,5],[-2,5],[-8,10],[-13,15],[-17,22],[-16,29]],
            [[-8,58],[-5,56],[-3,53],[-5,50],[-8,51]], [[-25,65],[-20,66],[-18,64],[-22,63]],
            [[68,24],[71,28],[77,31],[82,29],[88,27],[92,23],[90,20],[88,18],[86,15],[83,10],[81,8],[78,9],[76,13],[73,17],[70,20]],
            [[92,22],[95,27],[100,29],[104,26],[107,22],[109,19],[108,15],[106,12],[108,9],[106,6],[103,5],[101,2],[98,5],[97,9],[95,13],[92,16]],
            [[112,-11],[118,-14],[123,-17],[129,-16],[135,-13],[140,-14],[146,-18],[151,-24],[153,-29],[150,-34],[145,-38],[139,-38],[134,-35],[128,-34],[123,-30],[117,-28],[114,-23],[113,-17]],
            [[95,5],[100,2],[104,1],[108,3],[111,6],[110,10],[107,12],[104,10],[101,7]],
            [[118,18],[122,21],[125,25],[123,28],[120,25]], [[129,31],[132,34],[136,37],[140,41],[143,44],[145,42],[141,37],[137,34],[133,31]],
            [[-180,-72],[-150,-70],[-120,-72],[-90,-70],[-60,-73],[-30,-70],[0,-72],[30,-69],[60,-72],[90,-70],[120,-73],[150,-70],[180,-72],[180,-90],[-180,-90]]
          ];
          const project = ([lon,lat]) => { const q=px(fam.helpers.mapXY(S.spec,lat,lon)); return q.map(f1).join(','); };
          for (const coast of continents) util.svg('polygon',{points:coast.map(project).join(' '),fill:S.style.land,stroke:'#647d5d','stroke-width':1.15,'stroke-linejoin':'round'},g);
          const borders = [
            [[-124,49],[-117,49],[-110,49],[-102,49],[-95,49]], [[-117,32],[-111,31],[-106,31],[-103,29]], [[-103,29],[-100,25]],
            [[-67,45],[-71,45],[-75,45],[-79,43],[-82,41]], [[-72,-5],[-65,-8],[-60,-10],[-55,-12]], [[-72,-18],[-66,-20],[-60,-21],[-54,-23]], [[-69,-34],[-64,-35],[-58,-35]],
            [[-8,42],[2,43],[8,44],[14,45]], [[-5,49],[2,50],[8,51],[14,51]], [[5,55],[12,54],[18,55],[24,56]], [[8,47],[14,47],[20,48],[26,48]], [[13,45],[15,40],[18,37]],
            [[-5,35],[2,34],[9,33]], [[9,30],[15,29],[22,29]], [[22,31],[25,25],[29,20]], [[29,20],[34,15],[39,12]], [[20,0],[27,1],[33,2]], [[18,-10],[25,-11],[32,-12]], [[25,-20],[31,-20],[35,-22]],
            [[28,55],[32,50],[35,45],[40,40]], [[40,50],[45,48],[50,46]], [[60,55],[65,52],[70,50]], [[75,55],[80,50],[85,45]], [[90,55],[95,50],[100,48]], [[105,50],[110,45],[115,40]], [[120,50],[125,45],[130,42]], [[100,40],[105,35],[110,30]], [[80,35],[85,30],[90,25]],
            [[68,23],[74,22],[80,22],[86,23]], [[73,17],[78,17],[83,18],[88,21]], [[88,22],[91,21],[94,20]], [[96,21],[100,20],[104,19],[107,18]], [[96,16],[100,15],[104,14],[107,13]], [[98,10],[102,9],[106,8]],
            [[115,-21],[120,-22],[125,-22],[130,-24]], [[130,-15],[135,-20],[140,-24],[145,-27]]
          ];
          for(const border of borders){const pts=border.map(([lon,lat])=>px(fam.helpers.mapXY(S.spec,lat,lon)));util.svg('polyline',{points:pts.map(p=>p.map(f1).join(',')).join(' '),fill:'none',stroke:'#8da27f','stroke-width':.8,'stroke-linecap':'round'},g);}
          const step = S.spec.step;
          for (let lat = S.spec.lat0; lat <= S.spec.lat1 + 1e-9; lat += step) {
            const [, y] = px(fam.helpers.mapXY(S.spec, lat, S.spec.lon0));
            util.svg('line', { x1: 0, y1: f1(y), x2: W, y2: f1(y), stroke: S.style.graticule, 'stroke-width': 1, 'stroke-dasharray': S.style.gratDash }, g);
            if (y > 10 && y < H - 22) T(util, g, 6, y - 9, fam.helpers.fmtLat(Number(lat.toFixed(4)), 'deg'), { 'text-anchor': 'start', class: 'cp-tick map' });
          }
          for (let lon = S.spec.lon0; lon <= S.spec.lon1 + 1e-9; lon += step) {
            const [x] = px(fam.helpers.mapXY(S.spec, S.spec.lat0, lon));
            util.svg('line', { x1: f1(x), y1: 0, x2: f1(x), y2: H, stroke: S.style.graticule, 'stroke-width': 1, 'stroke-dasharray': S.style.gratDash }, g);
            if (x > 30 && x < W - 30) T(util, g, x, H - 10, fam.helpers.fmtLon(Number(lon.toFixed(4)), 'deg'), { class: 'cp-tick map' });
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
    },
  },
});
