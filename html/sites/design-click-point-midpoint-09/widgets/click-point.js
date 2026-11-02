// Design of this site on the click-point/board template (templates/click-point/board.js): the board fills the
// stage and shows a coordinate plane (mint grid, arrowed axes, numerals 0..10); the end points are blue dots
// and each letter carries the point's coordinates. There is no line between the points.
(function () {
  env.widget({
    task: 'click-point',
    site: 'design-click-point-midpoint-09',
    name: 'design',
    split: 'train',
    scenarios: ['midpoint'],
    template: 'click-point/board',
    design: {
      gridPlain: false,
      pairedLabels: false,
      labelAt: null,
      css: `
  .cp-label.plain { font: 400 26px Arial, sans-serif; stroke-width: 0; fill:#111820; }
  .cp-axis-n { font: 400 21px Arial, sans-serif; fill: #3a4650; }
  `,
      guideLine: false,
      dot: { r: 8, fill: '#0044b7', stroke: '#00409f', 'stroke-width': 0.5 },
      parts: {
        boardLayout: (base, S) => (ctx) => {
          const { size, rng } = ctx;
          rng.int(440, 600);
          const H = Math.floor(size.height);
          S.scale = Math.min(H / S.spec.board.h, size.width / S.spec.board.w);
          return { W: Math.round(size.width), H };
        },
        // Coordinate-plane backdrop: mint grid over the whole board, axes with arrowheads and tick numerals
        // that map board width/height linearly onto 0..10.
        backdrop: (base, S) => (util, W, H) => {
          const svg = S.svg;
          const x0 = W * 0.07, y0 = H * 0.83, x1 = W * 0.944, y1 = H * 0.077;
          const gw = x1 - x0, gh = y0 - y1;
          const grid = '#cce3de', ink = '#29363e';
          for (let i = 0; i <= 16; i++) {
            const x = x0 + (gw * i) / 16;
            util.svg('line', { x1: S.f1(x), y1: y1, x2: S.f1(x), y2: y0, stroke: grid, 'stroke-width': 1.3 }, svg);
          }
          for (let i = 0; i <= 10; i++) {
            const y = y0 - (gh * i) / 10;
            util.svg('line', { x1: x0, y1: S.f1(y), x2: x1, y2: S.f1(y), stroke: grid, 'stroke-width': 1.3 }, svg);
          }
          util.svg('line', { x1: x0, y1: y0, x2: x1 + 12, y2: y0, stroke: ink, 'stroke-width': 1.6 }, svg);
          util.svg('line', { x1: x0, y1: y0, x2: x0, y2: y1 - 20, stroke: ink, 'stroke-width': 1.6 }, svg);
          util.svg('path', { d: `M ${x1 + 16} ${y0} l -10 -4.5 v 9 z`, fill: ink }, svg);
          util.svg('path', { d: `M ${x0} ${y1 - 24} l -4.5 10 h 9 z`, fill: ink }, svg);
          const tx = (x, y, s, a) => {
            const t = util.svg('text', { x: S.f1(x), y: S.f1(y), class: 'cp-axis-n', 'text-anchor': a, 'dominant-baseline': 'central' }, svg);
            t.textContent = s;
          };
          for (let i = 1; i <= 5; i++) {
            const x = x0 + (gw * (2 * i)) / 10, y = y0 - (gh * (2 * i)) / 10;
            util.svg('line', { x1: S.f1(x), y1: y0, x2: S.f1(x), y2: y0 + 12, stroke: ink, 'stroke-width': 1.4 }, svg);
            util.svg('line', { x1: x0 - 12, y1: S.f1(y), x2: x0, y2: S.f1(y), stroke: ink, 'stroke-width': 1.4 }, svg);
            tx(x, y0 + 36, String(2 * i), 'middle');
            tx(x0 - 12, y, String(2 * i), 'end');
          }
          tx(x0 - 12, y0 + 22, '0', 'end');
          tx(x1 + 36, y0 + 1, 'x', 'middle');
          tx(x0 + 20, y1 - 32, 'y', 'middle');
          return true;
        },
        midLabels: (base, S) => (util, g) => {
          for (const [p, s] of [[S.spec.a, 'A'], [S.spec.b, 'B']]) {
            const [x, y] = S.P.px(p);
            const W = Number(S.svg.getAttribute('width')), H = Number(S.svg.getAttribute('height'));
            const cx = ((x - W * 0.07) / (W * 0.874)) * 10;
            const cy = ((H * 0.83 - y) / (H * 0.753)) * 10;
            const text = `${s} (${cx.toFixed(1)}, ${cy.toFixed(1)})`;
            const lx = Math.min(x + 16, W - text.length * 14 - 12);
            const ly = y > H * 0.83 - 35 ? Math.min(H - 18, y + 28) : y < 32 ? y + 28 : y - 23;
            const t = util.svg('text', { x: S.f1(lx), y: S.f1(ly), class: 'cp-label plain', 'text-anchor': 'start', 'dominant-baseline': 'central' }, g);
            t.textContent = text;
          }
        },
        built: () => (ctx, { wrap }) => {
          wrap.style.left = '0px';
          wrap.style.top = '0px';
        },
      },
    },
  });
})();
