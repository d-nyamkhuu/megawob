// Keep the reference behavior; fit dense result sets into the catalog's shorter stage.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-loading-03',
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
        const rows = results.querySelectorAll('.ut-row2');
        const available = results.clientHeight - heading.offsetHeight - 2;
        const height = Math.floor(available / ctx.spec.results.length);
        for (const row of rows) {
          if (height >= parseFloat(row.style.height)) continue;
          row.style.height = height + 'px';
          if (height >= 40) continue;
          const name = row.querySelector('.ut-rn');
          const rating = name.querySelector('small');
          const thumb = row.querySelector('.ut-thumb');
          const price = row.querySelector('.ut-rp');
          name.style.fontSize = Math.min(16, Math.floor((height - 2) * .58)) + 'px';
          name.style.lineHeight = '1';
          if (rating) {
            rating.style.display = 'block';
            rating.style.fontSize = Math.min(12, Math.floor((height - 2) * .42)) + 'px';
          }
          thumb.style.width = thumb.style.height = Math.min(30, height - 4) + 'px';
          if (price) price.style.fontSize = Math.min(17, height - 6) + 'px';
        }
        return view;
      },
    },
  },
});
