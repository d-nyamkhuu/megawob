// Metro masthead, grouped menu sections, inline item controls and basket actions for this food design.
(function () {
  'use strict';
  const PHOTO_URL = new URL('../assets/reference-photos.webp', document.currentScript.src).href;

  env.widget({
    task: 'use-shop',
    site: 'design-use-shop-food-10',
    name: 'design',
    split: 'train',
    scenarios: ['food'],
    template: 'use-shop/adapted',
    design: {
      addLabel: 'Add to order',
      emptyText: 'No items added yet.',
      parts: {
        frameBefore: (base, S) => (ctx, app) => {
          const mast = ctx.util.el('div', 'metro-mast', app);
          ctx.util.el('div', 'metro-title', mast, 'GoodBite Kitchen');
          const nav = ctx.util.el('div', 'metro-nav', mast);
          for (const label of ['Menu', 'Basket', 'Checkout'])
            ctx.util.el('span', label === 'Menu' ? 'active' : '', nav, label);
        },
        foodSection: (base, S) => (V, category) => {
          const { util, menu, tabEls, panels, cols } = V;
          const section = util.el('section', 'food-section', menu);
          const tab = S.H.btn(util, 'fd-tab', section, category.name, 'tab');
          tabEls.push(tab);
          const grid = util.el('div', 'fd-grid', section);
          grid.style.setProperty('--cols', cols);
          panels.push(grid);
        },
        foodPhoto: (base, S) => (V, card, item) => {
          base(V, card, item);
          const name = item.name.toLowerCase();
          if (/pizza|funghi|margherita|popper|cheesecake/.test(name)) {
            const photo = card.querySelector('.fd-photo');
            photo.style.backgroundImage = `url(${PHOTO_URL})`;
            photo.style.backgroundPosition = `${/popper/.test(name) ? 50 : /cheesecake/.test(name) ? 100 : 0}% 100%`;
          }
        },
        inlineControls: (base, S) => (V, card, item, id) => {
          const { util } = V;
          V.x.inline ||= {};
          const state = (V.x.inline[id] = { option: item.group ? item.group.values[0] : null, qty: 1 });
          if (item.group) {
            const size = util.el('div', 'inline-size', card);
            util.el('span', 'control-label', size, item.group.name);
            const options = util.el('div', 'size-options', size);
            for (const name of item.group.values) {
              const option = S.H.btn(
                util,
                'size-choice' + (name === state.option ? ' selected' : ''),
                options,
                name,
              );
              option.addEventListener('click', () => {
                state.option = name;
                for (const el of options.children) el.classList.toggle('selected', el === option);
              });
            }
          }
          const quantity = util.el('div', 'inline-quantity', card);
          util.el('span', 'control-label', quantity, 'Quantity');
          const counter = util.el('div', 'quantity-counter', quantity);
          const down = S.H.btn(util, 'quantity-step', counter, '−');
          const value = util.el('span', 'quantity-value', counter, '1');
          const up = S.H.btn(util, 'quantity-step', counter, '+');
          down.addEventListener('click', () => {
            state.qty = Math.max(1, state.qty - 1);
            value.textContent = state.qty;
          });
          up.addEventListener('click', () => {
            state.qty = Math.min(9, state.qty + 1);
            value.textContent = state.qty;
          });
        },
        addClick: () => (V, key) => {
          if (!V.ctx.model.ordered && !V.ctx.model.dialog) {
            const { qty, option } = V.x.inline[key];
            V.step({ click: { add: key } });
            if (V.ctx.model.dialog)
              V.commit({ ...V.ctx.model, dialog: { ...V.ctx.model.dialog, qty, option } });
            else for (let i = 1; i < qty; i++) V.step({ click: { add: key } });
          }
        },
        orderControls: (base, S) => (V) => {
          const { ctx, util, cart, step, commit } = V;
          const orderSlot = document.querySelector('.order-slot');
          V.order = S.H.btn(util, 'as-btn primary fd-order', orderSlot, 'Place order', 'order');
          V.clear = document.querySelector('.clear-basket');
          V.clear.addEventListener('click', () =>
            commit({ ...ctx.model, cart: [], ordered: false, dialog: null }),
          );
          V.order.addEventListener('click', () => {
            if (!ctx.model.ordered && ctx.model.cart.length) step({ click: { order: true } });
          });
          const actions = util.el('div', 'basket-actions', cart);
          actions.append(orderSlot);
          const end = document.querySelector('.end-control');
          if (end) actions.append(end);
        },
        foodPaint: (base, S) => (V, model) => {
          base(V, model);
          for (const panel of V.panels) panel.hidden = false;
        },
      },
    },
  });
})();
