// Design on templates/find-fact/base.js: the base site's find-fact widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-locate-12',
  name: 'design',
  split: 'train',
  scenarios: ['locate'],
  template: 'find-fact/base',
  design: {
    parts: {
      // The inherited frame stylesheet forces .rl-card to width: 100%.
      // Keep the template's card geometry for the document and answer column.
      card: (base) => (...args) => {
        const result = base(...args);
        result.card.classList.replace('rl-card', 'ds-lookup-card');
        result.card.firstElementChild.classList.add('ds-lookup-card-title');
        return result;
      },
    },
  },
});
