// Keeps the site-specific remaining-time readout in sync with the shared chase widget.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-chase-06',
  name: 'design',
  split: 'train',
  scenarios: ['chase'],
  template: 'act-in-time/arena',
  design: {
    parts: {
      beforeSync: () => (ctx) => {
        const remaining = Math.max(0, ctx.spec.dur - ctx.model.t);
        const timeValue = document.querySelector('.ds-time-value');
        const timeFill = document.querySelector('.ds-time-meter i');
        if (timeValue) timeValue.textContent = `${(remaining / 1000).toFixed(1)} s`;
        if (timeFill) timeFill.style.width = `${(100 * remaining) / ctx.spec.dur}%`;
      },
    },
  },
});
