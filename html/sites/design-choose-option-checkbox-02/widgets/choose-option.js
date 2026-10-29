// This design exposes the checkbox row count and keeps the selection summary in sync.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-checkbox-02',
  name: 'design',
  split: 'train',
  scenarios: ['checkbox'],
  traits: { grid: true, topic: 'topics', count: [15, 15] },
  template: 'choose-option/widgets',
  design: {
    choiceRowsVar: '--choice-rows',
    parts: {
      choicesShown: (base) => (ctx, controls) => {
        base(ctx, controls);
        const summary = document.querySelector('.ds-none');
        if (summary) {
          const values = ctx.model.values;
          summary.textContent = values.length ? values.join(', ') : 'No topics selected yet.';
        }
      },
    },
  },
});
