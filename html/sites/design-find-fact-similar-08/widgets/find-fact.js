// Three-column candidate list, filled top to bottom in each column.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-similar-08',
  name: 'design',
  split: 'train',
  scenarios: ['similar'],
  template: 'find-fact/similar',
  design: {
    wordRows: 3,
    parts: {
      option: (base, S) => (ctx, grid, word, index) => {
        const label = base(ctx, grid, word, index);
        const column = Math.floor((index * 3) / ctx.spec.words.length);
        label.style.gridColumn = column + 1;
        label.style.gridRow = index - Math.ceil((column * ctx.spec.words.length) / 3) + 1;
        return label;
      },
    },
  },
});
