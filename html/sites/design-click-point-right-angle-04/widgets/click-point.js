// Design of this site on the click-point/board template (templates/click-point/board.js): black ink, a plain white
// look. The board fills the stage through an isotropic camera (scale and offset) that keeps both points and the
// target in view and never lets the oracle's C leave the canvas.
env.widget({
  task: 'click-point',
  site: 'design-click-point-right-angle-04',
  name: 'design',
  split: 'train',
  scenarios: ['right-angle'],
  traits: { orient: 'horizontal', exclusion: 7 },
  template: 'click-point/board',
  design: {
    alwaysC: false,
    clear: false,
    style: { sw: 2, guide: false },
    hollowA: 'never',
    rayStroke: '#080808',
    dot: { r: 7.5, fill: '#080808' },
    labelAt: { A: [Math.PI / 2, 29], B: [Math.PI / 2, 29] },
    parts: {
      minCircle: (base, S) => (util, g, c) => {
        const [x, y] = S.P.px(c);
        util.svg('circle', {
          cx: x, cy: y, r: S.spec.minLen * S.scale, fill: 'none', stroke: '#575b62', 'stroke-width': 2, 'stroke-dasharray': '7 7',
        }, g);
      },
      // The inverse of the camera goes through px (same rounding as the original).
      fromBoard: (base, S) => (xy) => {
        const r = S.svg.getBoundingClientRect();
        const [x, y] = S.P.px(xy);
        return [r.left + x, r.top + y];
      },
      boardLayout: (base, S) => (ctx) => {
        const { size, rng } = ctx;
        const { spec } = S;
        rng.int(440, 600); // Retain the original style draw and seeded RNG ordering.
        const H = Math.floor(size.height - 16);
        const W = Math.floor(size.width - 16);
        // An isotropic camera preserves every angle and distance ratio. Its inverse keeps clicks and oracle
        // locations in the task's original board coordinates.
        const target = env.taskDef.helpers.target(spec);
        const lo = [
          Math.min(spec.a[0], spec.b[0] - spec.minLen, target[0]),
          Math.min(spec.a[1], spec.b[1] - spec.minLen, target[1]),
        ];
        const hi = [
          Math.max(spec.a[0], spec.b[0] + spec.minLen, target[0]),
          Math.max(spec.a[1], spec.b[1] + spec.minLen, target[1]),
        ];
        S.scale = Math.min(
          (H * 0.14) / spec.minLen,
          (H - 60) / (Math.abs(spec.a[1] - spec.b[1]) + 5 * spec.minLen),
          (W - 60) / (Math.abs(spec.a[0] - spec.b[0]) + 5 * spec.minLen),
          (W - 60) / (hi[0] - lo[0]),
          (H - 60) / (hi[1] - lo[1]),
        );
        // Retain the reference framing where it fits, but keep the oracle's C clickable.
        S.offset = [W * 0.47 - ((spec.a[0] + spec.b[0]) * S.scale) / 2, H * 0.48 - ((spec.a[1] + spec.b[1]) * S.scale) / 2]
          .map((v, i) => Math.max(30 - lo[i] * S.scale, Math.min(v, [W, H][i] - 30 - hi[i] * S.scale)));
        return { W, H };
      },
    },
  },
});
