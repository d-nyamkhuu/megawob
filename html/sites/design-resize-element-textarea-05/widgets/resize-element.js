// Design on templates/resize-element/base.js: the base site's resize-element widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-textarea-05',
  name: 'design',
  split: 'train',
  scenarios: ['textarea'],
  template: 'resize-element/base',
  design: {
    parts: {
      renderTextarea: (base) => function (ctx) {
        const view = base(ctx);
        const card = ctx.stage.querySelector('.rzt-card');
        const hint = card && card.querySelector('.rzt-hint');
        if (hint) card.appendChild(hint);
        return view;
      },
    },
  },
});
