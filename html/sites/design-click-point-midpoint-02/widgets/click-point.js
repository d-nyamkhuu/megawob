// Midpoint board with transparent frame, larger accent points and larger unoutlined labels.
(function () {
  env.widget({
    task: 'click-point',
    site: 'design-click-point-midpoint-02',
    name: 'design',
    split: 'train',
    scenarios: ['midpoint'],
    template: 'click-point/board',
    design: {
      style: { grid: 'plain', point: 'dot', serif: false, labelTurn: Math.PI / 2 },
      gridPlain: true,
      boardFill: 'transparent',
      guideLine: { stroke: 'var(--fg)', 'stroke-width': 2 },
      labelAt: { A: [-Math.PI / 2, 30], B: [-Math.PI / 2, 30] },
      dot: { r: 11, fill: 'var(--accent)' },
      css: `
  .cp-board { border: 0; border-radius: 0; background: transparent; box-shadow: none; }
  .cp-hint { display: none !important; }
  .cp-label { stroke: none; font-size: 26px; font-weight: 600; }
  `,
    },
  });
})();
