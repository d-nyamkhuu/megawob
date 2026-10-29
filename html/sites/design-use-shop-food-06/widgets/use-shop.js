// Ink food photos, card based size and quantity controls, and a subtotal without delivery.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-food-06',
  name: 'design',
  split: 'train',
  scenarios: ['food'],
  template: 'use-shop/adapted',
  design: {
    totalLabel: 'Subtotal',
    parts: {
      foodPhoto: (base, S) => (V, card, it) => {
        const photo = V.util.el('div', 'fd-photo', card);
        const n = it.name.toLowerCase();
        const ink = /tea|drink|lemon|juice|cola|water/.test(n)
          ? 'drink'
          : /pizza|diavola/.test(n)
            ? 'pizza'
            : /bread|bruschetta|naan/.test(n)
              ? 'bread'
              : 'salad';
        photo.style.backgroundImage = `url(sites/${S.def.site}/assets/ink-${ink}.webp)`;
      },
      inlineControls: (base, S) => (V, card, it, id) => {
        const { util, fmt } = V;
        const { btn } = S.H;
        const size = util.el('div', 'inline-size', card);
        size.value = it.group ? it.group.values[0] : 'Regular';
        if (it.group) {
          util.el('b', 'size-label', size, it.group.name);
          it.group.values.forEach((name, i) => {
            const label = util.el('label', 'size-choice', size);
            const radio = util.el('input', '', label);
            radio.type = 'radio';
            radio.name = 'food-size-' + id;
            radio.value = name;
            radio.checked = i === 0;
            radio.addEventListener('change', () => {
              size.value = name;
            });
            util.el('span', '', label, name);
            util.el('span', 'size-price', label, fmt(it.price + it.group.extra[i]));
          });
        }
        const quantity = util.el('div', 'quantity-control', card);
        util.el('span', 'quantity-label', quantity, 'Quantity');
        const down = btn(util, 'quantity-step', quantity, '−');
        const qty = util.el('input', 'inline-quantity', quantity);
        qty.type = 'text';
        qty.inputMode = 'numeric';
        qty.value = '0';
        qty.setAttribute('aria-label', 'Quantity for ' + it.name);
        const up = btn(util, 'quantity-step', quantity, '+');
        down.addEventListener('click', () => {
          qty.value = String(Math.max(0, (+qty.value || 0) - 1));
        });
        up.addEventListener('click', () => {
          qty.value = String(Math.min(9, (+qty.value || 0) + 1));
        });
      },
      paintTotals: (base) => (V, m) => {
        const { spec, fam, fmt, cnt, totV } = V;
        const n = m.cart.reduce((sum, line) => sum + line.qty, 0);
        cnt.textContent = n ? `${n} item${n > 1 ? 's' : ''}` : '';
        totV.textContent = fmt(fam.cartTotal(spec, m.cart));
      },
    },
  },
});
