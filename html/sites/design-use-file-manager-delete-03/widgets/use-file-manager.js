// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-delete-03',
  name: 'design',
  split: 'train',
  scenarios: ['delete'],
  template: 'use-file-manager/explorer',
  design: {
    parts: {
      fit: (base, S) => (ctx) => {
        base(ctx);
        // The required desktop stylesheet fills the stage with the window.
        // Keep the template's internal geometry consistent with that footprint.
        S.geo = { left: 0, top: 0, winW: ctx.size.width, winH: ctx.size.height };
      },
    },
  },
});
