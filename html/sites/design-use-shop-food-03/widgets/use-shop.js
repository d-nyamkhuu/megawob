// Design of this site on the use-shop/adapted template (templates/use-shop/adapted.js): a cafeteria order form with
// a description column, a dropdown size button and quantity arrows per row, and a basket tab in the category strip.
(function () {
  'use strict';
  const PHOTO_URL = new URL('../assets/reference-photos.webp', document.currentScript.src).href;
  env.widget({
    task: 'use-shop',
    site: 'design-use-shop-food-03',
    name: 'design',
    split: 'train',
    scenarios: ['food'],
    template: 'use-shop/adapted',
    design: {
      menuTitle: 'Cafeteria Ordering',
      menuColumns: ['Item', 'Description', 'Size', 'Price', 'Qty', 'Add'],
      cartColumns: ['Item', 'Size', 'Qty', 'Unit Price', 'Total', 'Remove'],
      totalLabel: 'Subtotal',
      addLabel: 'Add',
      orderHost: 'slotKeep',
      photoMap: [
        [/veggie|vegetarian.*burger/, 1],
        [/burger/, 0],
        [/fries/, 2],
        [/salad|edamame/, 3],
        [/wing|popper/, 4],
        [/dip|bread|bruschetta|hummus/, 5],
        [/pasta|noodle/, 7],
        [/brownie|cake|dessert/, 8],
      ],
      photoSize: '360% 360%',
      photoPos: (tile) => 4.2 + (tile % 3) * 45.8 + '% ' + (4.2 + Math.floor(tile / 3) * 45.8) + '%',
      parts: {
        foodSectionsDone: (base, S) => (V) => {
          const { spec, strip, cart, tabEls } = V;
          tabEls[0].textContent = 'Menu / ' + spec.cats[0].name;
          const basketTab = S.H.btn(V.util, 'fd-tab basket-tab', strip, 'Basket (0 items)');
          cart.tabIndex = -1;
          basketTab.addEventListener('click', () => cart.focus({ preventScroll: true }));
          V.x.basketTab = basketTab;
        },
        photoExtra: () => (V, foodPhoto, it, n) => {
          if (/pizza|margherita|diavola/.test(n)) {
            foodPhoto.style.backgroundImage = `url(${PHOTO_URL})`;
            foodPhoto.style.backgroundSize = '300% 300%';
            foodPhoto.style.backgroundPosition = '0% 100%';
          }
        },
        inlineControls: (base, S) => (V, card, it) => {
          const { util } = V;
          const { btn } = S.H;
          const sizes = it.group ? it.group.values : ['Regular'];
          const size = btn(util, 'inline-size', card, sizes[0]);
          size.value = sizes[0];
          size.setAttribute('aria-haspopup', 'listbox');
          size.setAttribute('aria-expanded', 'false');
          const options = util.el('div', 'inline-options', card);
          options.hidden = true;
          options.setAttribute('role', 'listbox');
          for (const name of sizes) {
            const op = btn(util, 'inline-option', options, name);
            op.setAttribute('role', 'option');
            op.addEventListener('click', () => {
              size.value = name;
              size.textContent = name;
              options.hidden = true;
              size.setAttribute('aria-expanded', 'false');
              size.focus();
            });
          }
          size.addEventListener('click', () => {
            options.hidden = !options.hidden;
            size.setAttribute('aria-expanded', String(!options.hidden));
          });
          size.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
              options.hidden = true;
              size.setAttribute('aria-expanded', 'false');
            }
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              e.preventDefault();
              const delta = e.key === 'ArrowDown' ? 1 : -1;
              size.value = sizes[(sizes.indexOf(size.value) + delta + sizes.length) % sizes.length];
              size.textContent = size.value;
            }
          });
          const qwrap = util.el('div', 'inline-qty-control', card);
          const qty = util.el('input', 'inline-quantity', qwrap);
          qty.type = 'number';
          qty.min = '0';
          qty.max = '9';
          qty.value = '0';
          qty.setAttribute('aria-label', it.name + ' quantity');
          for (const [delta, caption] of [
            [1, '▴'],
            [-1, '▾'],
          ]) {
            const arrow = btn(util, 'inline-step ' + (delta > 0 ? 'qty-up' : 'qty-down'), qwrap, caption);
            arrow.setAttribute('aria-label', (delta > 0 ? 'Increase ' : 'Decrease ') + it.name + ' quantity');
            arrow.addEventListener('click', () => {
              qty.value = String(Math.max(0, Math.min(9, (+qty.value || 0) + delta)));
            });
          }
        },
        orderControls: (base) => (V) => {
          V.cart.append(document.querySelector('.brief-status'));
          V.cart.append(document.querySelector('.design-footer'));
          base(V);
        },
        cartLine: (base, S) => (V, l, m) => {
          const { util, spec, fam, fmt, lines, lineEls, step, ctx } = V;
          const { btn } = S.H;
          const key = fam.lineKey(l.item, l.option);
          const it = spec.items[l.item];
          const row = util.el('div', 'fd-line', lines);
          row.dataset.role = 'cart-line';
          const r1 = util.el('div', 'fd-l1', row);
          const nm = util.el('div', 'fd-lname', r1, it.name);
          util.el('div', 'fd-lsize', r1, l.option || 'Regular');
          util.el('div', 'fd-lunit', r1, fmt(fam.linePrice(spec, { ...l, qty: 1 })));
          util.el('div', 'fd-lp', r1, fmt(fam.linePrice(spec, l)));
          const r2 = util.el('div', 'fd-l2', row);
          const quantity = util.el('div', 'fd-lqty', r2);
          const els = {};
          const mk = (op, txt, cls) => {
            const b = btn(util, cls, op === 'remove' ? r2 : quantity, txt);
            b.disabled = m.ordered;
            b.addEventListener('click', () => {
              if (!ctx.model.ordered) step({ click: { line: key, op } });
            });
            els[op] = b;
          };
          mk('dec', '▾', 'fd-st fd-dec');
          util.el('span', 'fd-q', quantity, String(l.qty));
          mk('inc', '▴', 'fd-st fd-inc');
          mk('remove', 'Remove', 'fd-rm');
          lineEls[key] = els;
        },
        paintBasketState: () => (V, m) => {
          document.querySelector('.basket-state').textContent = m.ordered
            ? 'Your order has been placed.'
            : 'This order is not yet placed.';
        },
        paintTotals: () => (V, m) => {
          const { spec, fam, fmt, cnt, totV } = V;
          const n = m.cart.length;
          cnt.textContent = `${n} item${n !== 1 ? 's' : ''}`;
          V.x.basketTab.textContent = `Basket (${n} item${n !== 1 ? 's' : ''})`;
          totV.textContent = fmt(fam.cartTotal(spec, m.cart));
        },
      },
    },
  });
})();
