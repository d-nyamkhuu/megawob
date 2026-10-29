// Design of this site on the layout/canvas template (templates/align-layout/canvas.js).
env.widget({
  task: 'align-layout',
  site: 'design-align-layout-spacing-03',
  name: 'design',
  split: 'train',
  scenarios: ['spacing'],
  template: 'align-layout/canvas',
  design: {
    parts: {
      // site.css draws each card's spine label from data-book-title.
      item: (base) => (ctx, canvas, it, i, locked) => {
        const el = base(ctx, canvas, it, i, locked);
        el.dataset.bookTitle = it.label;
        return el;
      },
    },
  },
});
