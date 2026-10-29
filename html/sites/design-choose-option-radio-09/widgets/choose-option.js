// Delivery design with a pickup-store decoy and an order summary.
(function () {
  'use strict';

  let left;

  env.widget({
    task: 'choose-option',
    site: 'design-choose-option-radio-09',
    name: 'design',
    split: 'train',
    scenarios: ['radio'],
    template: 'choose-option/widgets',
    design: {
      parts: {
        heading: () => (ctx, card) => {
          const { util } = ctx;
          left = util.el('div', 'ds-left', card);
          const head = util.el('header', 'ds-email-heading', left);
          util.el('h1', '', head, 'Delivery');
        },
        field: (base) => (ctx) => base(ctx, left),
        decorated: () => (ctx, card, field, wrap) => {
          const { util } = ctx;
          const decoys = util.el('section', 'ds-email-content', left);
          util.el('h3', '', decoys, 'Pickup store');
          const sel = util.el('button', 'ds-fakesel', decoys);
          sel.type = 'button';
          sel.setAttribute('aria-expanded', 'false');
          const storeLabel = util.el('span', '', sel, 'Select a store');
          const stores = util.el('div', 'ds-stores', decoys);
          stores.hidden = true;
          ['Downtown', 'Northside', 'West End'].forEach((name) => {
            const option = util.el('button', '', stores, name);
            option.type = 'button';
            option.onclick = () => {
              storeLabel.textContent = name;
              stores.hidden = true;
              sel.setAttribute('aria-expanded', 'false');
            };
          });
          sel.onclick = () => {
            stores.hidden = !stores.hidden;
            sel.setAttribute('aria-expanded', String(!stores.hidden));
          };
          sel.insertAdjacentHTML(
            'beforeend',
            '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#2b2b22" stroke-width="1.6"><path d="M3 6l5 5 5-5"/></svg>',
          );
          const sum = util.el('aside', 'ds-summary', card);
          util.el('h2', '', sum, 'Order summary');
          const it = util.el('div', 'ds-item', sum);
          util.el('div', 'ds-mug', it);
          const info = util.el('div', 'ds-iteminfo', it);
          util.el('div', '', info, 'Stoneware Mug');
          util.el('div', 'ds-dim', info, 'Sage');
          util.el('div', 'ds-dim', info, 'Qty: 1');
          util.el('div', 'ds-price', it, '$18.00');
          [
            ['Subtotal', '$18.00'],
            ['Estimated tax', '$1.44'],
          ].forEach((rowData) => {
            const row = util.el('div', 'ds-row', sum);
            util.el('span', '', row, rowData[0]);
            util.el('span', '', row, rowData[1]);
          });
          const total = util.el('div', 'ds-row ds-total', sum);
          util.el('span', '', total, 'Total');
          util.el('span', '', total, '$19.44');
          card.dataset.options = ctx.spec.options.length;
        },
      },
    },
  });
})();
