// Center board design: keep the sampled styling but omit the grid, and retain the site's Clear control.
env.widget({
  task: 'click-point',
  site: 'design-click-point-center-09',
  name: 'design',
  split: 'train',
  scenarios: ['center'],
  template: 'click-point/board',
  design: {
    style: { grid: 'plain' },
    parts: {
      built: (base) => (ctx, view) => {
        base(ctx, view);
        env.widgetDef.clear = () => {
          ctx.update({ point: null });
          view.sync(ctx.model);
        };
      },
    },
  },
});
