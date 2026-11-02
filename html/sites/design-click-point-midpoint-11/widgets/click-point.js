// Design of this site on the click-point/board template (templates/click-point/board.js): the plain drawn look
// through a camera; red gradient end points with a white rim, a black segment and large plain letters beside them.
(function () {
  env.widget({
    task: 'click-point',
    site: 'design-click-point-midpoint-11',
    name: 'design',
    split: 'train',
    scenarios: ['midpoint'],
    template: 'click-point/board',
    design: {
      gridPlain: false,
      pairedLabels: false,
      labelAt: null,
      css: `
  .cp-label { font: 400 34px Arial, Helvetica, sans-serif; fill: #000; stroke: none; paint-order: normal; }
  `,
      camera: true,
      placeCard: 'none',
      plainLook: true,
      style: { serif: false },
      asideReadout: true,
      guideLine: { stroke: '#111', 'stroke-width': 2.5, 'stroke-linecap': 'butt' },
      parts: {
        midPoints: (base, S) => (util, g) => {
          const defs = util.svg('defs', {}, g);
          const ink = util.svg('radialGradient', { id: 'endpoint-ink', cx: '35%', cy: '30%', r: '75%' }, defs);
          util.svg('stop', { offset: '0%', 'stop-color': '#ff5547' }, ink);
          util.svg('stop', { offset: '100%', 'stop-color': '#f23c2f' }, ink);
          for (const p of [S.spec.a, S.spec.b]) {
            const [x, y] = S.P.px(p);
            util.svg('circle', { cx: S.f1(x), cy: S.f1(y), r: 13, fill: 'url(#endpoint-ink)', stroke: '#fff', 'stroke-width': 1.5 }, g);
          }
        },
        midLabels: (base, S) => (util, g) => {
          const { a, b } = S.spec;
          for (const p of [a, b]) {
            const [x, y] = S.P.px(p);
            const steep = Math.abs(b[1] - a[1]) > Math.abs(b[0] - a[0]);
            const labelX = steep ? x + 36 : x;
            const labelY = steep ? y : y + 39;
            const t = util.svg('text', {
              x: S.f1(Math.max(20, Math.min(+S.svg.getAttribute('width') - 20, labelX))),
              y: S.f1(Math.max(20, Math.min(+S.svg.getAttribute('height') - 20, labelY))),
              class: 'cp-label', 'text-anchor': 'middle', 'dominant-baseline': 'central',
            }, g);
            t.textContent = p === a ? 'A' : 'B';
          }
        },
      },
    },
  });
})();
