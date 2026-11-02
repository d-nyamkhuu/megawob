// Design of this site on the click-point/board template (templates/click-point/board.js): a square-ruled graph
// (16 x 10 cells, ticks and numerals along the axes) on a bare white board, blue end points, and each letter
// followed by the point's coordinates. The board is pinned beside the axis labels.
(function () {
  let gridWidth = 0;
  env.widget({
    task: 'click-point',
    site: 'design-click-point-midpoint-06',
    name: 'design',
    split: 'train',
    scenarios: ['midpoint'],
    template: 'click-point/board',
    design: {
      gridPlain: false,
      pairedLabels: false,
      labelAt: null,
      css: `
  .cp-board { border: 0; border-radius: 0; overflow: hidden; background: #fff; box-shadow: none; }
  .cp-label { font: 400 19px var(--font); fill: #283b53; }
  .cp-tick.axis { font: 400 16px var(--font); fill: #425168; }
  `,
      hint: 'hidden',
      boardFill: '#fcfdfe',
      style: { grid: 'lines', gridStep: 26, sw: 2.5, point: 'dot', guide: false, serif: false },
      dot: { r: 6.5, fill: '#1265bf', stroke: '#06448c', 'stroke-width': 1.2 },
      guideLine: { stroke: '#2c3f57', 'stroke-width': 2.3, 'stroke-linecap': 'butt' },
      parts: {
        boardLayout: (base, S) => (ctx) => {
          const { size, rng } = ctx;
          const aspect = S.spec.board.w / S.spec.board.h;
          rng.int(440, 600); // Preserve the scaffold's style-stream draw.
          const H = Math.floor(Math.min(size.height - 91, (size.width - 98) / aspect));
          S.scale = H / S.spec.board.h;
          const W = Math.round(size.width - 98);
          gridWidth = W;
          return { W, H };
        },
        backdrop: (base, S) => (util, W, H) => {
          const gg = util.svg('g', { class: 'cp-fig' }, S.svg);
          for (let i = 0; i <= 16; i++) {
            const x = (i / 16) * W;
            util.svg('line', { x1: x, y1: 0, x2: x, y2: H, stroke: '#dfe4ea', 'stroke-width': 1 }, gg);
            util.svg('line', { x1: x, y1: H, x2: x, y2: H + 7, stroke: '#b3bdc8', 'stroke-width': 1 }, gg);
            if (i % 2 === 0) {
              const t = util.svg('text', { x, y: H + 31, 'text-anchor': 'middle', class: 'cp-tick axis' }, gg);
              t.textContent = String(i);
            }
          }
          for (let j = 0; j <= 10; j++) {
            const y = (j / 10) * H;
            util.svg('line', { x1: 0, y1: y, x2: W, y2: y, stroke: '#dfe4ea', 'stroke-width': 1 }, gg);
            if (j % 2 === 0) util.svg('line', { x1: -7, y1: y, x2: 0, y2: y, stroke: '#b3bdc8', 'stroke-width': 1 }, gg);
            if (j % 2 === 0) {
              const t = util.svg('text', { x: -17, y, 'text-anchor': 'end', 'dominant-baseline': 'central', class: 'cp-tick axis' }, gg);
              t.textContent = String(10 - j);
            }
          }
          util.svg('line', { x1: 0.5, y1: 0, x2: 0.5, y2: H, stroke: '#7b8794', 'stroke-width': 1.5 }, gg);
          util.svg('line', { x1: 0, y1: H - 0.5, x2: W, y2: H - 0.5, stroke: '#7b8794', 'stroke-width': 1.5 }, gg);
          return true;
        },
        midLabels: (base, S) => (util, g) => {
          const cs = (p) => {
            const n = (v) => String(Math.round(v * 10) / 10);
            return ` (${n(((p[0] * S.scale) / gridWidth) * 16)}, ${n((1 - p[1] / S.spec.board.h) * 10)})`;
          };
          for (const [p, name, dy] of [[S.spec.a, 'A', 25], [S.spec.b, 'B', -10]]) {
            const [x, y] = S.P.px(p);
            const right = x + 130 < S.spec.board.w * S.scale;
            const offset = name === 'A' ? 22 : 16;
            const t = util.svg('text', {
              x: x + (right ? offset : -offset),
              y: Math.max(20, Math.min(S.spec.board.h * S.scale - 10, y + dy)),
              'text-anchor': right ? 'start' : 'end',
              class: 'cp-label',
            }, g);
            t.textContent = name + cs(p);
          }
        },
        built: () => (ctx, { wrap }) => {
          wrap.style.position = 'absolute';
          wrap.style.left = '68px';
          wrap.style.top = '28px';
        },
      },
    },
  });
})();
