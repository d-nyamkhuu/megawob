// Keep the typed date format beside the required marker, matching this site's original form.
env.widget({
  task: 'set-date',
  site: 'design-set-date-typed-12',
  name: 'design',
  split: 'train',
  scenarios: ['typed'],
  template: 'set-date/calendar',
  design: {
    parts: {
      textCreated: (base, S) => (ctx, row, help, shown, unmasked) => {
        base(ctx, row, help, shown, unmasked);
        row.querySelector('.fd-label').firstChild.textContent = `${S.spec.scene.label} (${shown}): `;
      },
    },
  },
});
