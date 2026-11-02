// Keep the reference's behavior, sizing result rows for this window's search bar.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-loading-02',
  name: 'design',
  split: 'train',
  scenarios: ['loading'],
  template: 'act-in-time/base',
  design: {
    parts: {
      buildLoading: (base) => (ctx, frame) => {
        const view = base(ctx, frame);
        const results = frame.body.querySelector('.ut-res');
        const heading = results.querySelector('.ut-reshead');
        const height = Math.floor((results.clientHeight - heading.offsetHeight) / ctx.spec.results.length);
        for (const row of results.querySelectorAll('.ut-row2')) {
          const fitted = Math.min(parseFloat(row.style.height), height);
          row.style.height = fitted + 'px';
          if (fitted < 34) {
            row.style.fontSize = '12px';
            row.style.gap = '8px';
            const thumb = row.querySelector('.ut-thumb');
            thumb.style.width = thumb.style.height = Math.min(20, fitted - 2) + 'px';
            const name = row.querySelector('.ut-rn');
            name.style.display = 'flex';
            name.style.alignItems = 'center';
            name.style.gap = '8px';
          }
        }
        return view;
      },
    },
  },
});
