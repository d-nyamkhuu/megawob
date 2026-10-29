// Design on the use-slides/office template; defaults reproduce the scaffold.
env.widget({
  task: 'use-slides',
  site: 'design-use-slides-reorder-04',
  name: 'design',
  split: 'train',
  scenarios: ['reorder'],
  template: 'use-slides/office',
  design: {
    maxScale: 1.65,
    parts: {
      rail: (base, S) => (main) => {
        const ctx = S.ctx, u = ctx.util, s = S.spec, P = S.P, D = S.D;
        const rail = u.el('aside', 'as-rail', main);
        u.el('div', 'as-cap', rail, 'Slides');
        const pane = P.register(u.el('div', 'as-scroll', rail), 'pane:rail');
        const board = u.el('div', 'as-thumbs', pane), cards = {};
        const pitch = Math.min(214, Math.max(112, (S.ctx.size.width - 24) / s.slides.length));
        board.style.width = `${s.slides.length * pitch}px`;
        board.style.height = `${D.thumbnailHeight + 30}px`;
        s.slides.forEach((slide, i) => {
          cards[i] = P.thumbnail(board, slide, i);
          cards[i].style.left = `${i * pitch}px`;
          cards[i].style.setProperty('width', `${pitch - 10}px`, 'important');
          u.el('strong', 'as-reorder-title', cards[i], slide.title);
        });
        S.sortable = env.ui.sortable(board, { order: ctx.model.order, items: cards,
          slotRect: (i) => ({ x: i * pitch, y: 0, w: pitch, h: D.thumbnailHeight + 24 }), axis: 'x', activeClass: 'dragging',
          onChange: (order) => P.commit({ order }), label: 'slide thumbnails' });
      },
    },
  },
});
