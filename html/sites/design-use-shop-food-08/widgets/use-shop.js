// Notebook menu design with custom food crops, inline option and quantity controls, and basket frame placement.
(function () {
  'use strict';
  env.widget({
    task: 'use-shop',
    site: 'design-use-shop-food-08',
    name: 'design',
    split: 'train',
    scenarios: ['food'],
    template: 'use-shop/adapted',
    design: {
      menuTitle: 'Appetizers',
      menuColumns: ['Item', 'Size', 'Price', 'Quantity', 'Add'],
      cartTitle: 'Your Order Basket',
      cartColumns: ['Item', 'Size', 'Qty', 'Price'],
      orderHost: 'slotKeep',
      totalLabel: 'Total:',
      emptyText: 'Your basket is empty.',
      addLabel: 'Add to Order',
      parts: {
        menuBand: () => (V) => {
          V.menuTitle = V.util.el('h2', 'menu-band', V.menu, V.spec.cats[V.ctx.model.tab].name);
          return V.menuTitle;
        },
        photoExtra: (base, S) => (V, foodPhoto, it, n) => {
          if (/dip|hummus|bruschetta|bread|wing|stick|roll|ring/.test(n)) {
            const y = /wing/.test(n) ? 586 : /stick|roll/.test(n) ? 437 : /ring/.test(n) ? 733 : 263;
            const h = y === 263 ? 128 : y === 437 ? 113 : y === 586 ? 112 : 117;
            foodPhoto.style.backgroundImage = `url(sites/${S.def.site}/assets/notebook-food-art.webp)`;
            foodPhoto.style.backgroundSize = `${(1672 / 176) * 100}% ${(941 / h) * 100}%`;
            foodPhoto.style.backgroundPosition = `${(278 / (1672 - 176)) * 100}% ${(y / (941 - h)) * 100}%`;
          }
          if (/bruschetta|hummus|garlic bread|edamame/.test(n)) {
            const tile = /bruschetta/.test(n) ? 0 : /hummus/.test(n) ? 1 : /garlic bread/.test(n) ? 2 : 3;
            foodPhoto.style.backgroundImage = `url(sites/${S.def.site}/assets/appetizer-art.svg)`;
            foodPhoto.style.backgroundSize = '200% 200%';
            foodPhoto.style.backgroundPosition = `${(tile % 2) * 100}% ${Math.floor(tile / 2) * 100}%`;
          }
        },
        inlineControls: () => (V, card, it, id) => {
          const { util } = V;
          const size = util.el('div', 'inline-size', card);
          size.value = it.group ? it.group.values[0] : 'Regular';
          if (it.group) {
            size.dataset.count = it.group.values.length;
            util.el('span', 'size-caption', size, `${it.group.name}:`);
            const options = util.el('div', 'size-options', size);
            for (const name of it.group.values) {
              const lab = util.el('label', 'size-option', options);
              const radio = util.el('input', '', lab);
              radio.type = 'radio';
              radio.name = `size-${id}`;
              radio.value = name;
              radio.checked = name === size.value;
              radio.addEventListener('change', () => { size.value = name; });
              util.el('span', '', lab, name);
            }
          }
          const quantity = util.el('div', 'quantity-control', card);
          util.el('label', 'quantity-caption', quantity, 'Quantity:');
          const qty = util.el('input', 'inline-quantity', quantity);
          qty.type = 'number';
          qty.min = '1';
          qty.max = '9';
          qty.value = '1';
          const arrows = util.el('div', 'quantity-arrows', quantity);
          for (const [label, delta] of [['▲', 1], ['▼', -1]]) {
            const arrow = util.el('button', 'quantity-arrow', arrows, label);
            arrow.type = 'button';
            arrow.addEventListener('click', () => {
              qty.value = String(Math.max(1, Math.min(9, (+qty.value || 1) + delta)));
            });
          }
        },
        addClick: () => (V, k) => {
          const { ctx, step, commit, addEls } = V;
          if (!ctx.model.ordered && !ctx.model.dialog) {
            const card = addEls[k].closest('.fd-card');
            const q = Math.max(1, Math.min(9, +card.querySelector('.inline-quantity').value || 1));
            const option = card.querySelector('.inline-size').value;
            step({ click: { add: k } });
            if (ctx.model.dialog) commit({ ...ctx.model, dialog: { ...ctx.model.dialog, qty: q, option } });
            else for (let i = 1; i < q; i++) step({ click: { add: k } });
            card.querySelector('.inline-quantity').value = String(q);
          }
        },
        orderControls: (base) => (V) => {
          base(V);
          V.cart.append(V.clear);
        },
        foodPaint: (base) => (V, m) => {
          base(V, m);
          V.menuTitle.textContent = V.spec.cats[m.tab].name;
        },
        paintControls: (base) => (V, m) => {
          base(V, m);
          V.clear.hidden = !m.cart.length || m.ordered;
        },
      },
    },
  });
})();
