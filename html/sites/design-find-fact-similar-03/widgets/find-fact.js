// This design fixes the word-list title and replaces the sampled hint with source-specific wording.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-similar-03',
  name: 'design',
  split: 'train',
  scenarios: ['similar'],
  template: 'find-fact/similar',
  design: {
    parts: {
      hint: (base, S) => (ctx, c, body) => {
        c.querySelector('h3').firstChild.textContent = 'Word List';
        const hint = body.querySelector('.rl-hint') || ctx.util.el('div', 'rl-hint', body);
        hint.textContent = 'Choose all words that are similar in meaning to ' + ctx.spec.given.join(', ') + '.';
        c.style.setProperty('--word-count', ctx.spec.words.length);
      },
    },
  },
});
