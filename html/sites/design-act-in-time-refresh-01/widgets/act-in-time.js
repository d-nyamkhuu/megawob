// Design on templates/act-in-time/base.js: the base site's act-in-time widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-refresh-01',
  name: 'design',
  split: 'train',
  scenarios: ['refresh'],
  template: 'act-in-time/base',
  design: {
    parts: {
      buildRefresh: (base) => function (ctx, frame) {
        const view = base(ctx, frame);
        const list = frame.body.querySelector('.ut-list');
        const skeleton = list.nextElementSibling;
        const result = list.parentElement;
        const pane = ctx.util.el('div', 'support-ticket-scroll', result);
        // Keep the list header in place while all rows remain reachable.
        pane.style.cssText = 'position:absolute;inset:88px 0 0;overflow:auto';
        pane.append(list, skeleton);
        result.insertBefore(pane, result.querySelector('.ut-detail'));
        return view;
      },
    },
  },
});
