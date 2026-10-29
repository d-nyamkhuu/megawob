// Design on templates/use-email/base.js: the base site's use-email widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-email',
  site: 'design-use-email-move-04',
  name: 'design',
  split: 'train',
  scenarios: ['move'],
  template: 'use-email/base',
  design: {
    parts: {
      // CSS presents one pane at a time even in wide layouts: navigation must return through Back.
      'mailGeometry': (base) => (ctx, ads) => ({ ...base(ctx, ads), stack: true }),
      'mailShowBack': () => () => true,
    },
  },
});
