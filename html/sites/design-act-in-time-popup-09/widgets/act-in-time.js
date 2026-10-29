// Opens a pending popup during setup while retaining the template's geometric backdrop.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-popup-09',
  name: 'design',
  split: 'train',
  scenarios: ['popup'],
  template: 'act-in-time/arena',
  design: {
    parts: {
      beforeBuild: (base) => (ctx, f) => {
        base(ctx, f);
        if (!ctx.model.login && ctx.model.popup === 'pending')
          ctx.update({ ...ctx.model, popup: 'open' });
      },
    },
  },
});
