// Adds the ascending board's progress count and next-number readout.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-ascending-04',
  name: 'design',
  split: 'train',
  scenarios: ['ascending'],
  template: 'read-figure/scene',
  design: {
    parts: {
      widget: (base, S) => (ctx) => {
        base(ctx);
        const s = S.spec;
        const progress = document.querySelector('.progress-copy');
        const target = document.querySelector('.target-readout');
        if (progress && target) {
          S.paints.push((m) => {
            progress.textContent = `Numbers clicked: ${m.clicks.length} / ${s.values.length}`;
            target.textContent = m.clicks.length > 0 && m.clicks.length < s.order.length
              ? String(s.values[s.order[m.clicks.length]])
              : '–';
          });
        }
      },
    },
  },
});
