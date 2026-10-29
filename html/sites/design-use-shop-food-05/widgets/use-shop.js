// Design for the shop-food-05 menu band, starter photos, compact add controls, and tax summary.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-food-05',
  name: 'design',
  split: 'train',
  scenarios: ['food'],
  template: 'use-shop/adapted',
  design: {
    menuTitle: null,
    cartTitle: 'Basket',
    orderHost: 'slotKeep',
    addLabel: '+',
    emptyText: 'Your basket is empty.',
    photoSheet: 'menu-foods.webp',
    photoMap: [
      [/veggie|vegetarian.*burger/, 1],
      [/burger/, 0],
      [/fries/, 2],
      [/salad|edamame/, 3],
      [/wing|popper|gyoza/, 4],
      [/dip|bread|hummus|bruschetta/, 5],
      [/pasta|noodle/, 7],
      [/brownie|cake|dessert/, 8],
    ],
    parts: {
      menuBand: (base, S) => (V) => {
        const mb = V.util.el('h2', 'menu-band', V.menu);
        V.util.el('span', 'mk', mb, '02');
        V.util.el('i', 'dash', mb);
        V.util.el('span', 'lab', mb, 'MENU ITEMS');
        return mb;
      },
      foodPhoto: (base) => (V, card, it) => {
        base(V, card, it);
        const foodPhoto = card.querySelector('.fd-photo');
        const n = it.name.toLowerCase();
        const starter = /bruschetta/.test(n)
          ? 0
          : /hummus/.test(n)
            ? 1
            : /garlic.*bread/.test(n)
              ? 2
              : /edamame/.test(n)
                ? 3
                : /wing/.test(n)
                  ? 4
                  : /gyoza/.test(n)
                    ? 5
                    : -1;
        if (starter >= 0) {
          foodPhoto.style.backgroundImage = 'url(sites/design-use-shop-food-05/assets/menu-starters.webp)';
          foodPhoto.style.setProperty('--photo-height', '200%');
          foodPhoto.style.backgroundPosition = (starter % 3) * 50 + '% ' + Math.floor(starter / 3) * 100 + '%';
        }
      },
      inlineControls: (base) => (V, card, it) => {
        const { util } = V;
        const size = util.el('div', 'inline-size', card);
        const values = it.group ? it.group.values : ['Regular'];
        size.value = values[0];
        const toggle = util.el('button', 'size-toggle', size, size.value);
        toggle.type = 'button';
        toggle.setAttribute('aria-label', it.name + ' size');
        toggle.setAttribute('aria-expanded', 'false');
        const options = util.el('div', 'size-options', size);
        options.hidden = true;
        toggle.addEventListener('click', () => {
          options.hidden = !options.hidden;
          toggle.setAttribute('aria-expanded', String(!options.hidden));
        });
        for (const name of values) {
          const op = util.el('button', 'size-option', options, name);
          op.type = 'button';
          op.addEventListener('click', () => {
            size.value = name;
            toggle.textContent = name;
            options.hidden = true;
            toggle.setAttribute('aria-expanded', 'false');
          });
        }
        const qm = util.el('button', 'qty-minus', card, '−');
        qm.type = 'button';
        const qty = util.el('input', 'inline-quantity', card);
        qty.type = 'number';
        qty.min = '0';
        qty.max = '9';
        qty.value = '0';
        qm.addEventListener('click', () => {
          qty.value = String(Math.max(0, (+qty.value || 0) - 1));
        });
      },
      cardFoot: (base) => (V, card, it, id) => {
        base(V, card, it, id);
        V.addEls[id].setAttribute('aria-label', 'Add ' + it.name + ' to basket');
      },
      cartSummary: (base, S) => (V) => {
        const { util, cart, fmt, fee } = V;
        const subtotal = util.el('div', 'fd-sum subtotal', cart);
        util.el('span', '', subtotal, 'Subtotal');
        V.x.subtotalV = util.el('span', '', subtotal);
        const tax = util.el('div', 'fd-sum delivery', cart);
        util.el('span', '', tax, 'Tax (8%)');
        V.x.feeV = util.el('span', '', tax, fmt(fee));
        const total = util.el('div', 'fd-sum total', cart);
        util.el('span', '', total, 'Total');
        V.totV = util.el('span', '', total);
      },
      paintBasketState: () => (V, m) => {
        document.querySelector('.basket-state').textContent = m.ordered
          ? 'Your order has been placed.'
          : 'The basket is not complete yet.';
      },
      paintTotals: () => (V, m) => {
        const { spec, fam, fmt, cnt } = V;
        const n = m.cart.reduce((s, l) => s + l.qty, 0);
        cnt.textContent = n ? `${n} item${n > 1 ? 's' : ''}` : '';
        const subtotal = fam.cartTotal(spec, m.cart);
        const tax = Math.round(subtotal * 0.08);
        V.x.subtotalV.textContent = fmt(subtotal);
        V.x.feeV.textContent = fmt(tax);
        V.totV.textContent = fmt(subtotal + tax);
      },
    },
  },
});
