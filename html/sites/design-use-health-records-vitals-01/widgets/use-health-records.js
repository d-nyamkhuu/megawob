// Design on use-health-records/chart; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-health-records',
  site: 'design-use-health-records-vitals-01',
  name: 'design',
  split: 'train',
  scenarios: ['vitals'],
  template: 'use-health-records/chart',
  design: {
    parts: {
      // Single-purpose paper window: no app navigation, encounter toolbar or status strip.
      top: () => () => {},
      menu: () => () => {},
      heading: () => () => {},
      toolbar: () => () => {},
      workflow: () => () => {},
    },
  },
});
