// Adds the source word count to the footer and uses a three-row option grid.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-similar-09',
  name: 'design',
  split: 'train',
  scenarios: ['similar'],
  template: 'find-fact/similar',
  design: {
    briefSelector: '.ds-panel',
    wordRows: 3,
    parts: {
      grid: (base, S) => (ctx, c, body, grid) => {
        const count = document.querySelector('.ds-count');
        if (count) {
          const n = ctx.spec.given.length;
          count.textContent = `${n} source ${n === 1 ? 'word' : 'words'}　 |　 ${ctx.spec.words.length} options`;
        }
        return base(ctx, c, body, grid);
      },
    },
  },
});
