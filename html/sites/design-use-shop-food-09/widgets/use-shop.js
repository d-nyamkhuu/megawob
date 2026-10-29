// Green Basket design: category sections, compact quantity controls, and an order panel with inline actions.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-food-09',
  name: 'design',
  split: 'train',
  scenarios: ['food'],
  template: 'use-shop/adapted',
  design: {
    menuTitle: null,
    menuColumns: null,
    cartTitle: 'Your Order',
    orderHost: 'cart',
    emptyText: 'Your basket is empty.',
    photoMap: [
      [/veggie|vegetarian.*burger/, 1],
      [/burger/, 0],
      [/fries/, 2],
      [/salad|edamame/, 3],
      [/dip|bread|hummus|bruschetta|naan/, 5],
      [/curry|masala|korma|dal|paneer/, 6],
      [/wing|popper|roast chicken|steak|gyoza|taco|quesadilla|enchilada/, 4],
      [/pasta|noodle|tofu/, 7],
      [/brownie|cake|dessert/, 8],
    ],
    photoDefault: 6,
    parts: {
      foodSections: (base, S) => (V) => {
        const { util, spec, menu } = V;
        V.strip = util.el('div', 'fd-tabs', menu);
        V.tabEls = [];
        V.panels = [];
        V.addEls = {};
        const cw = menu.getBoundingClientRect().width - 44;
        V.cols = cw > 720 ? 3 : 2;
        spec.cats.forEach((c) => {
          const section = util.el('section', 'fd-section', menu);
          const b = S.H.btn(util, 'sec-title', section, c.name, 'tab');
          V.tabEls.push(b);
          const g = util.el('div', 'fd-grid', section);
          g.style.setProperty('--cols', V.cols);
          V.panels.push(g);
        });
      },
      inlineControls: (base, S) => (V, card, it, id) => {
        const { util, ctx, fam, step } = V;
        const size = util.el('button', 'inline-size', card);
        size.type = 'button';
        size.value = it.group ? it.group.values[0] : 'Regular';
        size.textContent = size.value;
        size.hidden = !it.group;
        const choices = util.el('div', 'inline-options', card);
        choices.hidden = true;
        for (const name of it.group ? it.group.values : ['Regular']) {
          const op = util.el('button', 'inline-option', choices, name);
          op.type = 'button';
          op.addEventListener('click', () => {
            size.value = name;
            size.textContent = name;
            choices.hidden = true;
          });
        }
        size.addEventListener('click', () => {
          const wasOpen = !choices.hidden;
          for (const el of V.menu.querySelectorAll('.inline-options')) el.hidden = true;
          choices.hidden = wasOpen;
          const r = size.getBoundingClientRect();
          const bounds = V.menu.getBoundingClientRect();
          const h = Math.min(160, (it.group ? it.group.values.length : 1) * 34);
          choices.style.left = r.left + 'px';
          choices.style.top = (r.bottom + h > bounds.bottom ? r.top - h : r.bottom) + 'px';
          choices.style.minWidth = r.width + 'px';
        });
        const ctl = util.el('div', 'fd-ctl', card);
        const qm = util.el('button', 'qb', ctl, '−');
        qm.type = 'button';
        const qty = util.el('input', 'inline-quantity', ctl);
        qty.type = 'number';
        qty.min = '0';
        qty.max = '9';
        qty.value = '0';
        qty.readOnly = true;
        card.dataset.item = id;
        qm.addEventListener('click', () => {
          if (!ctx.model.ordered && !ctx.model.dialog) {
            const line = ctx.model.cart.find((l) => l.item === id && (!it.group || l.option === size.value));
            if (line) step({ click: { line: fam.lineKey(line.item, line.option), op: 'dec' } });
          }
        });
      },
      cardFoot: (base, S) => (V, card, it, id) => {
        const { util, fmt, addEls } = V;
        const foot = util.el('div', 'fd-foot', card);
        const price = util.el('span', 'fd-price', foot, fmt(it.price));
        if (it.group) util.el('span', 'fd-opts', price, `${it.group.values.length} ${it.group.name.toLowerCase()} options`);
        const add = S.H.btn(util, 'fd-add qb', card.querySelector('.fd-ctl'), undefined, 'add');
        add.textContent = '+';
        add.setAttribute('aria-label', 'Add ' + it.name);
        addEls[id] = add;
      },
      addClick: () => (V, k) => {
        if (!V.ctx.model.ordered && !V.ctx.model.dialog) {
          const card = V.addEls[k].closest('.fd-card');
          const option = card.querySelector('.inline-size').value;
          card.querySelector('.inline-options').hidden = true;
          V.step({ click: { add: k } });
          if (V.ctx.model.dialog) V.commit({ ...V.ctx.model, dialog: { ...V.ctx.model.dialog, qty: 1, option } });
        }
      },
      orderControls: (base, S) => (V) => {
        const { ctx, util, fam, spec, cart, commit, step } = V;
        const acts = util.el('div', 'cart-actions', cart);
        V.order = S.H.btn(util, 'as-btn primary fd-order', acts, 'Place order', 'order');
        const clear = util.el('button', 'clear-basket', acts, 'Clear basket');
        clear.type = 'button';
        clear.addEventListener('click', () => commit({ ...ctx.model, cart: [], ordered: false, dialog: null }));
        V.order.addEventListener('click', () => {
          if (!ctx.model.ordered && ctx.model.cart.length) step({ click: { order: true } });
        });
      },
      paintControls: () => (V, m) => {
        const { order, done, addEls } = V;
        order.hidden = m.ordered;
        order.disabled = !m.cart.length;
        done.hidden = !m.ordered;
        for (const [id, button] of Object.entries(addEls)) {
          button.disabled = m.ordered;
          const card = button.closest('.fd-card');
          card.querySelector('.inline-quantity').value = String(
            m.cart.filter((line) => line.item === Number(id)).reduce((sum, line) => sum + line.qty, 0),
          );
          card.querySelector('.qb').disabled = m.ordered;
        }
      },
      locateAdd: (base, S) => (V, k) => {
        const button = V.addEls[k];
        const card = button.closest('.fd-card');
        const grid = card.parentElement;
        const r = button.getBoundingClientRect();
        const g = grid.getBoundingClientRect();
        if (r.top < g.top || r.bottom > g.bottom)
          grid.scrollTop += r.top < g.top ? r.top - g.top - 4 : r.bottom - g.bottom + 4;
        return S.H.where(button, `Add ${k}`);
      },
    },
  },
});
