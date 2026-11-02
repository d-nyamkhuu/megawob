// Design on use-health-records/chart; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-health-records',
  site: 'design-use-health-records-order-05',
  name: 'design',
  split: 'train',
  scenarios: ['order'],
  template: 'use-health-records/chart',
  design: {
    narrowWidth: 520,
    parts: {
      // Single-purpose chart window: no global search strip, menu bar or encounter toolbar.
      top: () => () => {},
      menu: () => () => {},
      toolbar: () => () => {},
      // Order composer and read-only queue side by side with the queue slightly wider.
      styles: (base) => (ctx) => `${base(ctx)}
  .ehr-orderlayout{grid-template-columns:minmax(0,.92fr) minmax(0,1.08fr)}`,
    },
  },
});
