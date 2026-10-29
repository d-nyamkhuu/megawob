// This design adds an eight-line gutter beside the reading card.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-find-word-11',
  name: 'design',
  split: 'train',
  scenarios: ['find-word'],
  template: 'find-fact/find-word',
  design: {
    parts: {
      readingCard: (base, S) => (ctx, card, body, work) => {
        const gutter = ctx.util.el('div', 'np-line-numbers', work);
        gutter.setAttribute('aria-hidden', 'true');
        for (let i = 1; i <= 8; i++) ctx.util.el('div', '', gutter, String(i));
      },
    },
  },
});
