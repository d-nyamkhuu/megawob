// Keeps this site's return form and reveals the active dropdown option while scrolling.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-dropdown-08',
  name: 'design',
  split: 'train',
  scenarios: ['dropdown'],
  template: 'choose-option/widgets',
  design: {
    revealOptions: true,
    motifTitle: 'Order Number',
    motifValue: 'RMA-7842',
    parts: {
      motifFields: (base, S) => (ctx, card) => {
        const { util } = ctx;
        const decoys = util.el('div', 'ds-motif-xtras', card);
        [['Quantity', '1'], ['Return Reason', ''], ['Condition', '']].forEach(([key, value], i) => {
          const label = util.el('label', 'ds-motif-field', decoys, key);
          const input = util.el('input', '', label);
          input.type = 'text';
          input.value = value;
          if (i) input.placeholder = i === 1 ? 'Select a reason...' : 'Select a condition...';
        });
      },
    },
  },
});
