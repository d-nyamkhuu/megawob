// This design packs count items evenly by row and adds a Clear control for typed answers.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-count-10',
  name: 'design',
  split: 'train',
  scenarios: ['count'],
  template: 'read-figure/scene',
  design: {
    parts: {
      boardLayout: (base, S) => (items, cols, rows) => {
        cols = Math.min(S.D.boardColumns, items.length);
        rows = Math.ceil(items.length / cols);
        cols = Math.ceil(items.length / rows);
        items = items.map((it, i) => ({ ...it, c: i % cols, r: Math.floor(i / cols) }));
        return { items, cols, rows };
      },
      inputReady: (base, S) => (ctx, element, prop) => {
        base(ctx, element, prop);
        if (S.spec.scenario !== 'count' || S.spec.answer !== 'typed') return;
        element.placeholder = 'Enter number';
        const clear = S.ctx.util.el('button', 'clear-answer', document.querySelector('.bottom'), 'Clear');
        clear.type = 'button';
        clear.addEventListener('click', () => S.P.set({ text: '' }));
      },
    },
  },
});
