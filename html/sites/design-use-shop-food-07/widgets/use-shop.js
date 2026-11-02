// Lisa's food design adds a monochrome ink filter and compact inline option and quantity controls.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-food-07',
  name: 'design',
  split: 'train',
  scenarios: ['food'],
  template: 'use-shop/adapted',
  design: {
    menuTitle: 'Our Menu',
    totalLabel: 'Total:',
    emptyText: 'Your basket is empty.',
    addLabel: 'Add to Basket',
    parts: {
      foodWrap: (base, S) => (V) => {
        const wrap = base(V);
        const ink = V.util.el('div', 'ink-defs', wrap);
        ink.innerHTML =
          '<svg width="0" height="0" aria-hidden="true"><defs><filter id="food-ink" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true"/><feComponentTransfer><feFuncR type="linear" slope="-2.5" intercept="1"/><feFuncG type="linear" slope="-2.5" intercept="1"/><feFuncB type="linear" slope="-2.5" intercept="1"/></feComponentTransfer></filter></defs></svg>';
        return wrap;
      },
      foodSectionsInit: (base, S) => (V) => {
        base(V);
        V.strip.classList.toggle('multiple-categories', V.spec.cats.length > 1);
      },
      inlineControls: () => (V, card, it, id) => {
        const { util } = V;
        const size = util.el('div', 'inline-size', card);
        size.value = it.group ? it.group.values[0] : 'Regular';
        if (it.group) {
          size.classList.toggle('many-options', it.group.values.length > 3);
          util.el('b', 'size-label', size, it.group.name + ':');
          for (const name of it.group.values) {
            const label = util.el('label', 'size-choice', size);
            const radio = util.el('input', '', label);
            radio.type = 'radio';
            radio.name = 'food-option-' + id;
            radio.value = name;
            radio.checked = name === size.value;
            radio.addEventListener('change', () => {
              if (radio.checked) size.value = name;
            });
            util.el('span', '', label, name);
          }
        }
        const qb = util.el('div', 'qty-box', card);
        util.el('span', 'qty-label', qb, 'Quantity:');
        const qrow = util.el('div', 'qty-row', qb);
        const qm = util.el('button', 'qty-step', qrow, '−');
        qm.type = 'button';
        const qty = util.el('input', 'inline-quantity', qrow);
        qty.type = 'number';
        qty.min = '0';
        qty.max = '9';
        qty.value = '0';
        const qp = util.el('button', 'qty-step', qrow, '+');
        qp.type = 'button';
        qm.addEventListener('click', () => {
          qty.value = String(Math.max(0, (+qty.value || 0) - 1));
        });
        qp.addEventListener('click', () => {
          qty.value = String(Math.min(9, (+qty.value || 0) + 1));
        });
      },
      foodCard: (base, S) => (V, c, ci, id) => {
        const { util, spec, panels, ch, fam } = V;
        const it = spec.items[id];
        const card = util.el('div', 'fd-card', panels[ci]);
        S.P.foodPhoto(V, card, it);
        card.classList.toggle('compact', ch < 118);
        card.classList.toggle('dense', c.items.length > 4);
        card.dataset.role = 'item';
        card.style.height = ch + 'px';
        const copy = util.el('div', 'fd-copy', card);
        util.el('div', 'fd-name', copy, it.name).title = it.name;
        util.el('div', 'fd-desc', copy, it.desc);
        const tags = util.el('div', 'fd-tags', copy);
        for (const tg of it.tags)
          util.el('span', 'fd-tag', tags, fam.TAG_LABEL[tg]).style.setProperty('--tc', S.H.TAG_COLOR[tg]);
        S.P.inlineControls(V, card, it, id);
        S.P.cardFoot(V, card, it, id);
      },
      orderControls: (base, S) => (V) => {
        base(V);
        if (V.clear) {
          V.clear.onclick = null;
          V.clear.addEventListener('click', () =>
            V.commit({ ...V.ctx.model, cart: [], ordered: false, dialog: null }),
          );
        }
      },
    },
  },
});
