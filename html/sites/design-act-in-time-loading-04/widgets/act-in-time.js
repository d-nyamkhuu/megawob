// Design on templates/act-in-time/base.js: the base site's act-in-time widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-loading-04',
  name: 'design',
  split: 'train',
  scenarios: ['loading'],
  template: 'act-in-time/base',
  design: {
    parts: {
      buildLoading: (base) => (ctx, frame) => {
        const view = base(ctx, frame);
        // The Clearlooks search row and header use more space than the
        // reference frame. Fit both result and skeleton rows to that space.
        const results = frame.body.querySelector('.ut-res');
        const header = results.querySelector('.ut-reshead');
        const height = Math.floor((results.clientHeight - header.offsetHeight) / ctx.spec.results.length);
        for (const row of results.querySelectorAll('.ut-row2')) {
          row.style.height = Math.max(1, Math.min(parseFloat(row.style.height), height)) + 'px';
        }
        return view;
      },
    },
  },
});
