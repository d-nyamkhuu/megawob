// Preserve this site's camera fit, plain angle styling, and answer readout on the shared board template.
env.widget({
  task: 'click-point',
  site: 'design-click-point-bisect-11',
  name: 'design',
  split: 'train',
  scenarios: ['bisect'],
  traits: { exclusion: 10, aspect: 2.2 },
  template: 'click-point/board',
  design: {
    frameFill: [0.85, 0.9],
    rayDotR: 6,
    minCircle: { stroke: 'var(--fg)', 'stroke-width': 1.8, 'stroke-linecap': 'round' },
    style: {
      grid: 'plain', sw: 2.8, point: 'dot', guide: true, angleMark: false, rayEnd: 'dot',
      minDash: '1 8', minFill: false, fill: 'var(--fg)', edges: false, dashOutline: false, serif: false,
    },
    parts: {
      layout: (base, S) => (ctx) => {
        // The original widget consumed these other-scenario style draws before laying out this board.
        const { rng } = ctx;
        rng.pick(['#f6e7b0', '#e9eef3', '#f3f0e6', '#dfe9d8']);
        rng.bool(0.5);
        rng.bool(0.6);
        rng.pick(['#b9d6ea', '#a9cbe3', '#c3dcec']);
        rng.pick(['#e9e4d0', '#e4ead2', '#efe9dc']);
        rng.pick(['rgba(40,60,90,.45)', 'rgba(20,20,20,.35)']);
        rng.pick(['none', '4 4']);
        rng.pick(['#c9c3b3', '#bfc5cc']);
        rng.int(7, 11);
        return base(ctx);
      },
      canvas: (base, S) => (ctx) => {
        const stageStyle = getComputedStyle(ctx.stage);
        const { size } = ctx;
        return [
          Math.floor(size.width - 10 - parseFloat(stageStyle.paddingLeft) - parseFloat(stageStyle.paddingRight)),
          Math.floor(size.height - 10 - parseFloat(stageStyle.paddingTop) - parseFloat(stageStyle.paddingBottom)),
        ];
      },
      bisectLabels: (base, S) => (util, g) => {
        const [r0, r1] = S.spec.rays;
        S.P.label(util, g, S.P.rayMark(r0), r0.angle, 'A', 30);
        S.P.label(util, g, S.P.rayMark(r1), r1.angle, 'B', 30);
        S.P.label(util, g, S.spec.v, S.spec.bisector + Math.PI + S.style.labelTurn, 'V', 40);
      },
    },
  },
});
