// Design on templates/handle-text/base.js: the base site's handle-text widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-find-05',
  name: 'design',
  split: 'train',
  scenarios: ['find'],
  template: 'handle-text/base',
  design: {
    parts: {
      buildFind: (base) => function (ctx, look) {
        const view = base(ctx, look);
        const documentPane = view.card.querySelector('.ut-doc');
        if (documentPane) documentPane.style.setProperty('--pane-height', documentPane.style.height);
        const paragraph = view.card.querySelector('p');
        if (paragraph) paragraph.parentElement.classList.add('document-prose');
        return view;
      }
    }
  },
});
