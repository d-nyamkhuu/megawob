// Design of this site on the use-shop/adapted template (templates/use-shop/adapted.js): no menu band or column heads,
// photos cut from the reference scene, quantity arrows in the card footer, Clear and Place order inside the basket.
(function () {
  'use strict';
  const PHOTO_URL = new URL('../assets/reference-photos.webp', document.currentScript.src).href;
  const SCENE_URL = new URL('../assets/reference-scene.webp', document.currentScript.src).href;
  env.widget({
    task: 'use-shop',
    site: 'design-use-shop-food-12',
    name: 'design',
    split: 'train',
    scenarios: ['food'],
    template: 'use-shop/adapted',
    design: {
      menuTitle: null,
      menuColumns: null,
      totalLabel: 'Total:',
      emptyText: 'Your basket is empty.',
      parts: {
        foodPhoto: () => (V, card, it) => {
          const foodPhoto = V.util.el('div', 'fd-photo', card);
          const tile = /cake|brownie|tiramisu|dessert/i.test(it.name)
            ? 8
            : /popper|wing|bread|dip|fries/i.test(it.name)
              ? 7
              : 6;
          foodPhoto.style.backgroundImage = `url(${PHOTO_URL})`;
          foodPhoto.style.backgroundSize = '300% 300%';
          foodPhoto.style.backgroundPosition = `${(tile % 3) * 50}% 100%`;
          // Local reference photograph regions; the dish labels and prices remain seeded.
          let photoRegion = null;
          if (/salad|kale|quinoa|power bowl/i.test(it.name)) photoRegion = [42, 201, 265, 192];
          else if (/lemonade|juice|soda|water/i.test(it.name)) photoRegion = [417, 553, 264, 192];
          else if (/pizza|margherita|diavola|pepperoni/i.test(it.name))
            photoRegion = /diavola|pepperoni/i.test(it.name) ? [791, 201, 266, 192] : [417, 201, 265, 192];
          if (photoRegion) {
            const [px, py, pw, ph] = photoRegion;
            foodPhoto.style.backgroundImage = `url(${SCENE_URL})`;
            foodPhoto.style.backgroundSize = `${(1672 / pw) * 100}% ${(941 / ph) * 100}%`;
            foodPhoto.style.backgroundPosition = `${(px / (1672 - pw)) * 100}% ${(py / (941 - ph)) * 100}%`;
          }
        },
        inlineControls: () => () => {},
        cardFoot: (base, S) => (V, card, it, id) => {
          const { util, fam, fmt, ctx, step, addEls } = V;
          const { btn } = S.H;
          const foot = util.el('div', 'fd-foot', card);
          const pr = util.el('span', 'fd-price', foot, fmt(it.price));
          if (it.group)
            util.el('span', 'fd-opts', pr, `${it.group.values.length} ${it.group.name.toLowerCase()} options`);
          const quantity = util.el('div', 'fd-quantity', foot);
          const value = util.el('output', 'fd-quantity-value', quantity, '0');
          const arrows = util.el('div', 'fd-quantity-arrows', quantity);
          const add = btn(util, 'fd-add', arrows, '▲', 'add');
          add.setAttribute('aria-label', `Increase quantity of ${it.name}`);
          const down = btn(util, 'fd-subtract', arrows, '▼');
          down.setAttribute('aria-label', `Decrease quantity of ${it.name}`);
          down.addEventListener('click', () => {
            if (ctx.model.ordered || ctx.model.dialog) return;
            const line = ctx.model.cart.find((l) => l.item === Number(id));
            if (line) step({ click: { line: fam.lineKey(line.item, line.option), op: 'dec' } });
          });
          (V.x.quantityEls ||= {})[id] = { value, down };
          addEls[id] = add;
        },
        addClick: () => (V, k) => {
          if (!V.ctx.model.ordered && !V.ctx.model.dialog) V.step({ click: { add: k } });
        },
        cartHead: (base, S) => (V) => {
          const { util, rng, cart } = V;
          const chd = util.el('div', 'fd-ch', cart);
          chd.innerHTML = S.H.ICON.cart;
          const cartTitle = util.el('span', '', chd, rng.pick(['Your order', 'Your cart', 'Basket']));
          cartTitle.textContent = 'Your Order';
          V.cnt = util.el('span', 'fd-cn', chd);
          V.lines = util.el('div', 'fd-lines', cart);
          V.lines.dataset.role = 'cart';
          V.x.columns = util.el('div', 'fd-columns', V.lines);
          for (const label of ['Item', 'Size', 'Qty', 'Price']) util.el('span', '', V.x.columns, label);
        },
        orderControls: (base, S) => (V) => {
          const { ctx, util, fam, spec, cart, commit, step } = V;
          const { btn } = S.H;
          V.clear = btn(util, 'as-btn fd-clear', cart, 'Clear');
          V.clear.addEventListener('click', () => {
            if (ctx.model.ordered || ctx.model.dialog) return;
            let model = ctx.model;
            for (const line of [...model.cart])
              model = fam.apply(model, spec, { click: { line: fam.lineKey(line.item, line.option), op: 'remove' } });
            if (model !== ctx.model) commit(model);
          });
          V.order = btn(util, 'as-btn primary fd-order', cart, 'Place order', 'order');
          V.order.addEventListener('click', () => {
            if (!ctx.model.ordered && ctx.model.cart.length) step({ click: { order: true } });
          });
        },
        clearLines: () => (V) => {
          V.lines.replaceChildren(V.x.columns);
          for (const k of Object.keys(V.lineEls)) delete V.lineEls[k];
        },
        paintControls: () => (V, m) => {
          const { order, clear, done, addEls } = V;
          order.hidden = m.ordered;
          order.disabled = !m.cart.length;
          clear.disabled = m.ordered;
          done.hidden = !m.ordered;
          for (const b of Object.values(addEls)) b.disabled = m.ordered;
          for (const [id, els] of Object.entries(V.x.quantityEls)) {
            els.value.textContent = String(m.cart.filter((l) => l.item === Number(id)).reduce((n, l) => n + l.qty, 0));
            els.down.disabled = m.ordered;
          }
        },
        locateAdd: (base, S) => (V, k) => S.H.where(V.addEls[k], `Add ${k}`),
      },
    },
  });
})();
