// Adds the unscored address sheet rows and its site specific card title.
env.widget({
  task: 'type-text',
  site: 'design-type-text-multi-09',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'type-text/fields',
  design: {
    title: 'Customer Address',
    fit: null,
    parts: {
      afterFields: () => (ctx, grid) => {
        const { spec, util } = ctx;
        const extras = ['Address line 2 (optional):', 'State/Region (optional):', 'Reference (optional):'];
        for (let i = spec.fields.length; i < 6; i++) {
          const wrap = util.el('div', 'ft-field', grid);
          util.el('span', 'ft-label', wrap, extras[(i - spec.fields.length) % extras.length]);
          const box = util.el('div', 'ft-inwrap', wrap);
          const input = util.el('input', 'ft-input', box);
          input.type = 'text';
          input.tabIndex = -1;
          input.setAttribute('aria-label', extras[(i - spec.fields.length) % extras.length]);
        }
        const country = util.el('div', 'ft-field', grid);
        util.el('span', 'ft-label', country, 'Country:');
        const countryBox = util.el('div', 'ft-inwrap', country);
        const countryValue = util.el('div', 'ds-country', countryBox, 'United Kingdom');
        util.el('span', 'ds-country-arrow', countryValue, '▾');
      },
    },
  },
});
