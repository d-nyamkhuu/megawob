// Changes the candidate-list card heading to “Options.”
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-similar-10',
  name: 'design',
  split: 'train',
  scenarios: ['similar'],
  template: 'find-fact/similar',
  design: {
    parts: {
      wordCard: (base, S) => (ctx, c, body, work) => {
        base(ctx, c, body, work);
        c.querySelector('h3').firstChild.textContent = 'Options';
      },
    },
  },
});
