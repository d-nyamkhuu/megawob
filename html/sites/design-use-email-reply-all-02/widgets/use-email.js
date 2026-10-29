// Design on templates/use-email/base.js: the base site's use-email widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'use-email',
  site: 'design-use-email-reply-all-02',
  name: 'design',
  split: 'train',
  scenarios: ['reply-all'],
  template: 'use-email/base',
  design: {
    parts: {
      mailGeometry: (base) => (ctx, ads) => ({ ...base(ctx, ads), stack: false }),
    },
  },
});
