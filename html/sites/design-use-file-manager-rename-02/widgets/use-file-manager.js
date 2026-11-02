// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-rename-02',
  name: 'design',
  split: 'train',
  scenarios: ['rename'],
  template: 'use-file-manager/explorer',
  design: {
    windowRadius: 7,
    parts: {
      fit: (base, S) => function (ctx) {
        base(ctx); // Keep the template's seeded draws in their original order.
        S.geo = {
          left: 0, top: 0,
          winW: ctx.size.width,
          winH: ctx.size.height,
        };
      },
    },
  },
});
