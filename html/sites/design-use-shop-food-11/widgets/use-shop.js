// Willow & Fork design: editorial menu cards, inline quantity steppers, and a quiet-luxury order panel.
(function () {
  'use strict';

  env.widget({
    task: 'use-shop',
    site: 'design-use-shop-food-11',
    name: 'design',
    split: 'train',
    scenarios: ['food'],
    template: 'use-shop/adapted',
    design: {
      brand: 'RED SLICE',
      css: '\n.design-header{background:#e51e2c;color:white}.design-brand{font-size:28px;line-height:1}.task-note{font-size:25px;border-bottom:5px solid #171d21;background:#f5f3e9}.fd-cart{background:#f5f3e9;padding:23px 20px}.fd-ch{font-size:25px}.fd-grid{gap:10px}.fd-card{background:#faf9f5}.fd-name{font-weight:750}.fd-tabs{border-bottom:2px solid #151b1f}.fd-tab[data-active]{color:#df172b;border-color:#df172b}.fd-add{border-color:#777;color:#171d21;background:#fff}.fd-order{background:#e11b2a}.end-control{background:#171d21}',
      cardMax: 240,
      menuTitle: null,
      menuColumns: null,
      cartTitle: 'Your Order',
      cartTitleDraw: true,
      cartColumns: null,
      orderHost: 'cart',
      totalLabel: 'Subtotal',
      emptyHtml: 'Your basket is empty.<small>Add items from the menu<br>to get started.</small>',
      parts: {
        foodWrap: (base) => (V) => {
          const wrap = base(V);
          const note = document.querySelector('.task-note');
          const notePosition = note && getComputedStyle(note).position;
          wrap.style.setProperty(
            '--task-note-height',
            (note && !note.hidden && notePosition !== 'fixed' && notePosition !== 'absolute'
              ? note.getBoundingClientRect().height
              : 0) + 'px',
          );
          V.ctx.stage.addEventListener('announcement-layout', () => V.ctx.reanchor());
          return wrap;
        },
        foodColumns: (base) => (V, width) => (width > 510 ? 3 : 2),
        foodPhoto: () => (V, card, it) => {
          const n = it.name;
          const photo = /bruschetta/i.test(n)
            ? 'bruschetta'
            : /tikka/i.test(n)
              ? 'tikka'
              : /massaman/i.test(n)
                ? 'massaman'
                : /chana/i.test(n)
                  ? 'chana'
                  : /rogan|bourguignon/i.test(n)
                    ? 'rogan'
                    : /garlic.*bread/i.test(n)
                      ? 'garlic-bread'
                      : /edamame/i.test(n)
                        ? 'edamame'
                        : /gyoza|dumpling/i.test(n)
                          ? 'gyoza'
                          : /pizza|margherita/i.test(n)
                            ? 'pizza'
                            : /coffee|latte|cappuccino|espresso|tea\b/i.test(n)
                              ? 'coffee'
                              : /hummus/i.test(n)
                                ? 'hummus'
                                : /curry|masala/i.test(n)
                                  ? 'tikka'
                                  : /soup|bisque|chowder/i.test(n)
                                    ? 'soup'
                                    : /wing/i.test(n)
                                      ? 'wings'
                                      : /pepper|popper|fries|bread|roll/i.test(n) && !/dip/i.test(n)
                                        ? 'snack'
                                        : /cake|brownie|tiramisu|dessert/i.test(n)
                                          ? 'dessert'
                                          : 'dip';
          V.util.el('div', 'fd-photo ph-' + photo, card);
        },
        cardText: (base) => (V, card, it) => {
          base(V, card, it);
          card.classList.toggle('has-dietary-info', it.tags.length > 0);
        },
        inlineControls: () => () => {},
        cardFoot: (base, S) => (V, card, it, id) => {
          const { util, fmt } = V;
          const { btn, ICON } = S.H;
          const foot = util.el('div', 'fd-foot', card);
          const price = util.el('span', 'fd-price', foot, fmt(it.price));
          if (it.group)
            util.el('span', 'fd-opts', price, `${it.group.values.length} ${it.group.name.toLowerCase()} options`);
          const stepper = util.el('div', 'fd-step', foot);
          const minus = btn(util, 'fd-minus', stepper, '−', 'dec');
          const quantity = util.el('span', 'fd-qv', stepper, '0');
          const add = btn(util, 'fd-add', stepper, undefined, 'add');
          add.innerHTML = `${ICON.plus}<span>Add</span>`;
          add.setAttribute('aria-label', 'Add ' + it.name);
          minus.setAttribute('aria-label', 'Remove one ' + it.name);
          minus.addEventListener('click', () => {
            const line = V.ctx.model.cart.find((item) => item.item === id);
            if (line && !V.ctx.model.ordered && !V.ctx.model.dialog)
              V.step({ click: { line: V.fam.lineKey(line.item, line.option), op: 'dec' } });
          });
          V.x.qtyVals = V.x.qtyVals || {};
          V.x.minusEls = V.x.minusEls || {};
          V.x.qtyVals[id] = quantity;
          V.x.minusEls[id] = minus;
          V.addEls[id] = add;
        },
        addClick: (base) => (V, k) => {
          if (!V.ctx.model.ordered && !V.ctx.model.dialog) V.step({ click: { add: k } });
        },
        cartSummary: (base) => (V) => {
          const total = V.util.el('div', 'fd-sum total', V.cart);
          V.util.el('span', '', total, 'Subtotal');
          V.totV = V.util.el('span', '', total);
        },
        orderControls: (base, S) => (V) => {
          const { btn } = S.H;
          V.order = btn(V.util, 'as-btn primary fd-order', V.cart, 'Place order', 'order');
          V.order.addEventListener('click', () => {
            if (!V.ctx.model.ordered && V.ctx.model.cart.length) V.step({ click: { order: true } });
          });
        },
        paintBasketState: () => () => {},
        paintTotals: () => (V, model) => {
          const count = model.cart.reduce((sum, line) => sum + line.qty, 0);
          const badge = document.querySelector('.nav-badge');
          if (badge) badge.textContent = String(count);
          V.cnt.textContent = count ? `${count} item${count > 1 ? 's' : ''}` : '';
          V.totV.textContent = V.fmt(V.fam.cartTotal(V.spec, model.cart));
        },
        paintControls: (base) => (V, model) => {
          base(V, model);
          for (const id of Object.keys(V.x.qtyVals || {})) {
            const quantity = model.cart
              .filter((line) => String(line.item) === id)
              .reduce((sum, line) => sum + line.qty, 0);
            V.x.qtyVals[id].textContent = String(quantity);
            V.x.minusEls[id].disabled = model.ordered || !quantity;
          }
        },
        locateAdd: (base, S) => (V, k) => S.H.where(V.addEls[k], `Add ${k}`),
      },
    },
  });
})();
