// Design on templates/set-date/base.js, restyled through site.css.
env.widget({
  task: 'set-date',
  site: 'design-set-date-duration-04',
  name: 'design',
  split: 'train',
  scenarios: ['duration'],
  template: 'set-date/base',
  design: {
    parts: {
      buildDuration: (base, S) => (ctx) => {
        base(ctx);
        if (S.spec.control === 'presets') {
          // The inherited two-column form puts the stepper in the label column.
          // Give it a full row so its buttons cannot extend under the help text.
          S.control.style.gridColumn = '1 / -1';
        }
      },
    },
  },
});
