// Adds the task subtitle and source-word labels, with no briefing block.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-similar-02',
  name: 'design',
  split: 'train',
  scenarios: ['similar'],
  template: 'find-fact/similar',
  design: {
    briefSelector: null,
    parts: {
      wordCard: (base, S) => (ctx, c, body, work) => {
        ctx.util.el('p', 'rl-subtitle', work,
          'For each word, choose the word or words that mean the same or a similar meaning.');
      },
      grid: (base, S) => (ctx, c, body, grid) => {
        const source = ctx.util.el('div', 'rl-sources', body);
        ctx.spec.given.forEach((w) => ctx.util.el('b', 'rl-source', source, w + ':'));
      },
    },
  },
});
