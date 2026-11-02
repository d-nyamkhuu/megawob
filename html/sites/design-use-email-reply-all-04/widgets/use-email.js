// Design on templates/use-email/base.js: the base site's use-email widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'use-email',
  site: 'design-use-email-reply-all-04',
  name: 'design',
  split: 'train',
  scenarios: ['reply-all'],
  template: 'use-email/base',
  design: {
    parts: {
      // The stacked reader shares the list's search column. Reserve its search
      // gutter so the message toolbar remains visible and clickable below it.
      CSS: () => env.templateLib('use-email/_base-style').CSS + `
        .am-stack .am-read { padding-top: 70px; box-sizing: border-box; }
      `,
    },
  },
});
