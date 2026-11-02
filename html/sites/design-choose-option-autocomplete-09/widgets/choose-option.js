// Mirrors the selected destination in the travel summary while autocomplete paints.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-autocomplete-09',
  name: 'design',
  split: 'train',
  scenarios: ['autocomplete'],
  template: 'choose-option/widgets',
  design: {
    parts: {
      autocompletePainted: (_base) => (_ctx, _controls, model) => {
        const summary = document.querySelector('[data-role="destination-summary"]');
        if (summary) summary.textContent = model.value || 'Not selected';
      },
    },
  },
});
