// Order and address panels replace the template's email header and content card.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-radio-12',
  name: 'design',
  split: 'train',
  scenarios: ['radio'],
  template: 'choose-option/widgets',
  design: {
    emailContent: false,
    parts: {
      heading: () => () => {},
      field: () => (ctx, card) => {
        const { util, spec } = ctx;
        const cols = util.el('div', 'ds-cols', card);
        const details = util.el('section', 'ds-pane ds-details', cols);
        util.el('h3', '', details, 'Order Details');
        const row = (key, value) => {
          const el = util.el('div', 'ds-row', details);
          util.el('span', 'ds-k', el, key);
          util.el('span', 'ds-v', el, value);
          return el;
        };
        row('Item:', 'Wireless Mouse');
        const quantity = row('Quantity:', '');
        const spinner = util.el('span', 'ds-spin', quantity);
        util.el('span', '', spinner, '1');
        const arrows = util.el('span', 'ds-arrows', spinner);
        util.el('i', '', arrows, '▲');
        util.el('i', '', arrows, '▼');
        row('Price:', '$24.99');

        const delivery = util.el('section', 'ds-pane ds-delivery', cols);
        const address = util.el('section', 'ds-pane ds-address', cols);
        util.el('h3', '', address, 'Shipping Address');
        [
          ['Full name:', 'Alex Carter'],
          ['Address line 1:', '123 Maple St'],
          ['Address line 2:', ''],
          ['City:', 'Riverton'],
          ['State:', 'WA'],
          ['ZIP code:', '98122'],
        ].forEach(([key, value]) => {
          const el = util.el('div', 'ds-row', address);
          util.el('span', 'ds-k', el, key);
          util.el(
            'span',
            'ds-box' + (key === 'State:' ? ' ds-sel' : '') + (key === 'ZIP code:' || key === 'State:' ? ' ds-short' : ''),
            el,
            value,
          );
        });

        const field = util.el('div', 'fp-field', delivery);
        util.el('div', 'fp-label', field, spec.label);
        return field;
      },
    },
  },
});
