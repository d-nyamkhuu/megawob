// Design of this site on the click-point/board template (templates/click-point/board.js): a coordinate plane
// (gridlines every 2 units, labeled axes) behind a bare board, blue end points with their coordinates, labels
// and fonts scaled with the viewport. The board is centered in a stage that leaves room for the axis labels.
(function () {
  let unit = 1;
  env.widget({
    task: 'click-point',
    site: 'design-click-point-midpoint-12',
    name: 'design',
    split: 'train',
    scenarios: ['midpoint'],
    template: 'click-point/board',
    design: {
      gridPlain: false,
      pairedLabels: false,
      labelAt: null,
      css: `
  .cp-board { border: 0; border-radius: 0; overflow: visible; background: transparent; box-shadow: none; }
  .cp-board svg { overflow: visible; }
  .cp-label { font: 500 var(--cp-label-size,38px) Arial, "Segoe UI", sans-serif; fill: #16283d; }
  .cp-axis { font: 400 var(--cp-axis-size,26px) Arial, "Segoe UI", sans-serif; fill: #566074; }
  `,
      guideLine: { stroke: '#16283d', 'stroke-width': 3.5 },
      parts: {
        boardLayout: (base, S) => (ctx) => {
          const { size, rng } = ctx;
          const aspect = S.spec.board.w / S.spec.board.h;
          const fit = Math.min(size.height - 72, (size.width - 100) / aspect);
          rng.int(440, 600);
          const H = Math.floor(fit);
          S.scale = H / S.spec.board.h;
          const W = Math.floor(size.width - 100);
          S.offset = [(W - S.spec.board.w * S.scale) / 2, 0];
          unit = Math.min(size.width / 1202, size.height / 690);
          return { W, H };
        },
        backdrop: (base, S) => (util, W, H) => {
          const gg = util.svg('g', { class: 'cp-fig' }, S.svg);
          for (let i = 0; i <= 10; i++) {
            const x = (W * i) / 10;
            util.svg('line', {
              class: i === 0 ? 'cp-axis-line' : 'cp-grid-line', x1: S.f1(x), y1: 0, x2: S.f1(x), y2: H,
              stroke: i === 0 ? '#82909d' : '#dfe7e7', 'stroke-width': 1.5,
            }, gg);
            const t = util.svg('text', { x: S.f1(x), y: S.f1(H + 35), 'text-anchor': 'middle', class: 'cp-axis' }, gg);
            t.textContent = String(i * 2);
          }
          for (let j = 0; j <= 5; j++) {
            const y = (H * j) / 5;
            util.svg('line', {
              class: j === 5 ? 'cp-axis-line' : 'cp-grid-line', x1: 0, y1: S.f1(y), x2: W, y2: S.f1(y),
              stroke: j === 5 ? '#82909d' : '#dfe7e7', 'stroke-width': 1.5,
            }, gg);
            const t = util.svg('text', { x: -14, y: S.f1(y), 'text-anchor': 'end', 'dominant-baseline': 'central', class: 'cp-axis' }, gg);
            t.textContent = String(10 - j * 2);
          }
          return true;
        },
        midPoints: (base, S) => (util, g) => {
          for (const p of [S.spec.a, S.spec.b]) {
            const [x, y] = S.P.px(p);
            util.svg('circle', { cx: S.f1(x), cy: S.f1(y), r: 12 * unit, fill: '#1546ff' }, g);
            const coordinate = util.svg('text', { x: S.f1(x + 16), y: S.f1(y + 52), class: 'cp-coordinates' }, g);
            coordinate.textContent = `(${((20 * x) / Number(S.svg.getAttribute('width'))).toFixed(1)}, ${(10 - (10 * y) / Number(S.svg.getAttribute('height'))).toFixed(1)})`;
          }
        },
        midLabels: (base, S) => (util, g) => {
          const lab = (p, dx, dy, text) => {
            const [x, y] = S.P.px(p);
            const t = util.svg('text', { x: S.f1(x + dx), y: S.f1(y + dy), class: 'cp-label', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g);
            t.textContent = text;
          };
          const left = S.spec.a[0] <= S.spec.b[0];
          lab(S.spec.a, (left ? -24 : 24) * unit, 34 * unit, 'A');
          lab(S.spec.b, (left ? 26 : -26) * unit, -36 * unit, 'B');
        },
        built: (base, S) => (ctx, { wrap }) => {
          S.svg.style.setProperty('--cp-label-size', `${38 * unit}px`);
          S.svg.style.setProperty('--cp-axis-size', `${26 * unit}px`);
          wrap.style.left = '0px';
          wrap.style.top = `${-14 * unit}px`;
        },
      },
    },
  });
})();
