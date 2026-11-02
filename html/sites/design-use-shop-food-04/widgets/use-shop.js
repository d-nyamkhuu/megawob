// Design of this site on the use-shop/adapted template (templates/use-shop/adapted.js): the menu is laid out as a
// featured category and side categories with category bands, an atlas of food photos, size radios and a quantity box.
(function () {
  'use strict';
  env.widget({
    task: 'use-shop',
    site: 'design-use-shop-food-04',
    name: 'design',
    split: 'train',
    scenarios: ['food'],
    template: 'use-shop/adapted',
    design: {
      cartColumns: ['Item', 'Size / Details', 'Qty', 'Price'],
      totalLabel: 'Total:',
      emptyText: 'Your basket is empty.',
      parts: {
        foodMenu: () => (V) => {
          V.menu = V.util.el('div', 'fd-menu luna-menu', V.wrap);
          V.band = V.util.el('h2', 'menu-band', V.menu, 'Menu');
          V.cart = V.util.el('aside', 'fd-cart', V.wrap);
        },
        foodSection: (base, S) => (V, c, ci) => {
          const { util, menu, strip, tabEls, panels, cols } = V;
          const { btn } = S.H;
          const b = btn(util, 'fd-tab', strip, c.name, 'tab');
          tabEls.push(b);
          const g = util.el('div', 'fd-grid', menu);
          const band = util.el('button', 'cat-band', g, c.name);
          band.type = 'button';
          band.addEventListener('click', () => b.click());
          const th = util.el('div', 'menu-columns', g);
          for (const label of ['Item', 'Size', 'Price', 'Quantity', 'Add']) util.el('b', '', th, label);
          const columns =
              ci === 0 ? Math.min(c.items.length, 6) : c.items.length === 4 ? 4 : Math.min(c.items.length, 3),
            rows = Math.ceil(c.items.length / columns);
          g.dataset.layout = ci === 0 ? 'featured' : 'sides';
          g.dataset.rows = rows;
          g.dataset.columns = columns;
          g.style.setProperty('--columns', columns);
          g.style.setProperty('--rows', rows);
          g.style.setProperty('--weight', ci === 0 ? 2.3 : rows > 1 ? 1.5 : 1.1);
          g.style.flex = 'var(--weight) 1 0';
          g.style.setProperty('--cols', cols);
          panels.push(g);
        },
        foodPhoto: () => (V, card, it) => {
          const { util } = V;
          const foodPhoto = util.el('div', 'fd-photo food-atlas', card);
          const pictures = [
            [/pepperoni/i, 1],
            [/funghi|mushroom.*pizza/i, 2],
            [/hawaiian/i, 3],
            [/pizza|margherita/i, 0],
            [/garlic.*bread/i, 4],
            [/popper/i, 5],
            [/cheesecake/i, 6],
            [/brownie|chocolate.*cake/i, 7],
            [/ice cream|gelato/i, 8],
            [/wing/i, 9],
            [/bruschetta/i, 10],
            [/hummus|pita|dip/i, 11],
            [/edamame/i, 12],
            [/gyoza|dumpling/i, 13],
            [/tikka/i, 14],
            [/green curry/i, 15],
            [/butter chicken/i, 16],
            [/rogan|lamb.*curry/i, 17],
            [/dal|lentil|chana/i, 18],
            [/palak|paneer|spinach/i, 19],
            [/beet|goat.*cheese/i, 20],
            [/greek|feta/i, 21],
            [/quinoa/i, 22],
            [/cobb|caesar|salad/i, 23],
            [/steak|ribeye/i, 24],
            [/roast.*chicken/i, 25],
            [/shepherd|pie/i, 26],
            [/tofu|bok choy/i, 27],
            [/taco/i, 28],
            [/quesadilla/i, 29],
            [/enchilada/i, 30],
            [/burrito/i, 31],
            [/bourguignon|stew/i, 32],
            [/pad thai|noodle|pasta/i, 33],
            [/burger/i, 34],
            [/fries|chips/i, 35],
            [/curry|massaman/i, 17],
          ];
          const tile = (pictures.find(([re]) => re.test(it.name)) || [null, 14])[1];
          foodPhoto.style.backgroundImage = 'url(sites/design-use-shop-food-04/assets/luna-food-atlas.webp)';
          foodPhoto.style.backgroundPosition = (tile % 6) * 20 + '% ' + Math.floor(tile / 6) * 20 + '%';
          const extraPictures = [
            [/water/i, 0],
            [/matcha.*latte/i, 1],
            [/lemonade/i, 2],
            [/hot chocolate|cocoa/i, 3],
            [/lassi|smoothie/i, 4],
            [/cappuccino|coffee|espresso|\blatte\b/i, 5],
            [/tart/i, 6],
            [/br[uû]l[eé]e/i, 7],
            [/panna cotta|pudding/i, 8],
            [/fruit salad/i, 9],
            [/rainbow.*roll/i, 10],
            [/dragon.*roll/i, 11],
            [/sashimi/i, 12],
            [/vegetable.*maki|maki/i, 13],
            [/california/i, 14],
            [/avocado.*roll/i, 15],
            [/mashed potato/i, 16],
            [/naan/i, 17],
            [/calamari/i, 18],
            [/nachos/i, 19],
            [/rice/i, 20],
            [/soup|pho|ramen/i, 21],
            [/chocolate.*cake/i, 22],
            [/juice/i, 23],
          ];
          const extra = extraPictures.find(([re]) => re.test(it.name));
          if (extra) {
            foodPhoto.classList.add('food-extras');
            foodPhoto.style.backgroundImage = 'url(sites/design-use-shop-food-04/assets/luna-food-extras-cutout.webp)';
            foodPhoto.style.backgroundPosition =
              (extra[1] % 6) * 20 + '% ' + Math.floor(extra[1] / 6) * (100 / 3) + '%';
          }
        },
        foodCard: (base, S) => (V, c, ci, id) => {
          const { util, spec, panels, ch } = V;
          const it = spec.items[id];
          const card = util.el('div', 'fd-card', panels[ci]);
          S.P.foodPhoto(V, card, it);
          card.classList.toggle('compact', ch < 118);
          card.classList.add(ci === 0 ? 'featured-card' : 'side-card');
          card.dataset.role = 'item';
          card.style.height = ch + 'px';
          S.P.cardText(V, card, it);
          S.P.inlineControls(V, card, it, id);
          S.P.cardFoot(V, card, it, id);
        },
        inlineControls: () => (V, card, it) => {
          const { util } = V;
          const size = util.el('select', 'inline-size', card);
          for (const name of it.group ? it.group.values : ['Regular']) {
            const op = util.el('option', '', size, name);
            op.value = name;
          }
          const controls = util.el('div', 'fd-controls', card);
          const quantity = util.el('div', 'quantity-box', controls);
          const qty = util.el('input', 'inline-quantity', quantity);
          qty.type = 'number';
          qty.min = '0';
          qty.max = '9';
          qty.value = '0';
          const arrows = util.el('div', 'quantity-arrows', quantity);
          for (const [delta, label] of [
            [1, 'Increase quantity'],
            [-1, 'Decrease quantity'],
          ]) {
            const arrow = util.el('button', delta > 0 ? 'quantity-up' : 'quantity-down', arrows);
            arrow.type = 'button';
            arrow.setAttribute('aria-label', label);
            arrow.addEventListener('click', () => {
              qty.value = String(Math.max(0, Math.min(9, (+qty.value || 0) + delta)));
            });
          }
          V.x.controls = controls;
        },
        cardFoot: (base, S) => (V, card, it, id) => {
          const { util, fmt, addEls } = V;
          const { btn } = S.H;
          const controls = V.x.controls;
          const size = card.querySelector('.inline-size');
          const foot = util.el('div', 'fd-foot', controls);
          if (it.group) {
            card.classList.add('has-options');
            card.classList.toggle(
              'has-sizes',
              /size|portion/i.test(it.group.name) ||
                it.group.values.filter((v) => /^(small|medium|large|regular|family)$/i.test(v)).length >= 2,
            );
            const rl = util.el('div', 'size-radios', card);
            const rbs = [];
            for (const [index, name] of it.group.values.entries()) {
              const row = util.el('button', 'size-row', rl);
              row.type = 'button';
              const dot = util.el('span', 'radio', row);
              util.el('span', 'rn', row, name);
              util.el('span', 'rp', row, fmt(it.price + (it.group.extra[index] || 0)));
              rbs.push([name, dot]);
              row.addEventListener('click', () => {
                size.value = name;
                for (const [nm, d] of rbs) d.classList.toggle('on', nm === name);
              });
            }
          }
          const pr = util.el('span', 'fd-price', foot, fmt(it.price));
          if (it.group)
            util.el('span', 'fd-opts', pr, `${it.group.values.length} ${it.group.name.toLowerCase()} options`);
          const add = btn(util, 'fd-add', foot, undefined, 'add');
          add.textContent = 'Add';
          addEls[id] = add;
        },
        paintPre: () => (V) => {
          for (const panel of V.panels) panel.hidden = false;
        },
        locateTab: (base, S) => (V, k) => {
          const band = V.panels[k].querySelector('.cat-band');
          band.scrollIntoView({ block: 'nearest' });
          return S.H.where(band, `Category ${k}`);
        },
        locateAdd: (base, S) => (V, k) => {
          V.addEls[k].scrollIntoView({ block: 'nearest' });
          return S.H.where(V.addEls[k], `Add ${k}`);
        },
      },
    },
  });
})();
