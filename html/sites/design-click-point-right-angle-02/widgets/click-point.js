// Right-angle board design: fill the stage with solid black points and the site's large labels.
env.widget({
  task: 'click-point',
  site: 'design-click-point-right-angle-02',
  name: 'design',
  split: 'train',
  scenarios: ['right-angle'],
  template: 'click-point/board',
  design: {
    style: { grid: 'plain', sw: 3, point: 'dot', guide: false, minDash: '4 6', minFill: false, serif: true, labelTurn: 0 },
    fitMargin: [8, 8],
    fillBoard: true,
    placeCard: 'draw',
    hint: 'hidden',
    alwaysLabels: false,
    alwaysC: false,
    dot: null,
    dotRadii: [8.5, 7.5],
    hollowDot: { r: 7.5, fill: 'var(--fg)' },
    labelAt: { A: [Math.PI * 0.6, 26], B: [Math.PI / 2, 26] },
    css: `
  .cp-board { border: 0; border-radius: 0; background: #fff; box-shadow: none; }
  .cp-label.serif { font: italic 500 26px "Segoe UI", Arial, sans-serif; }
  `,
    parts: {
      built: (base) => (ctx, { wrap }) => {
        base(ctx, { wrap });
        wrap.style.position = 'relative';
        wrap.style.left = '0px';
        wrap.style.top = '0px';
      },
    },
  },
});
