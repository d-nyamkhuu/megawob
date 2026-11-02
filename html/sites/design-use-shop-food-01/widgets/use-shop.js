// Design of this site on the use-shop/adapted template (templates/use-shop/adapted.js): three category sections in a
// scrolling column, photo regions cut from several sheets, per-size rows with - / + in the card, Place order in the basket.
(function () {
  'use strict';
  const PHOTO_URL = new URL('../assets/reference-photos.webp', document.currentScript.src).href;
  const MENU_PHOTO_URL = new URL('../assets/food-menu.webp', document.currentScript.src).href;
  const SEEDED_PHOTO_URL = new URL('../assets/seeded-food-photos.webp', document.currentScript.src).href;
  const EXTRA_PHOTO_URL = new URL('../assets/extra-food-photos.webp', document.currentScript.src).href;
  env.widget({
    task: 'use-shop',
    site: 'design-use-shop-food-01',
    name: 'design',
    split: 'train',
    scenarios: ['food'],
    template: 'use-shop/adapted',
    design: {
      brand: 'RED SLICE',
      css: "\n.design-header{background:#e51e2c;color:white}.design-brand{font-size:28px;line-height:1}.task-note{font-size:25px;border-bottom:5px solid #171d21;background:#f5f3e9}.fd-cart{background:#f5f3e9;padding:23px 20px}.fd-ch{font-size:25px}.fd-grid{gap:10px}.fd-card{background:#faf9f5}.fd-name{font-weight:750}.fd-tabs{border-bottom:2px solid #151b1f}.fd-tab[data-active]{color:#df172b;border-color:#df172b}.fd-add{border-color:#777;color:#171d21;background:#fff}.fd-order{background:#e11b2a}.end-control{background:#171d21}",
      menuTitle: null,
      menuColumns: null,
      cartColumns: null,
      cartTitle: 'Your Order',
      cartTitleDraw: true,
      orderHost: 'cart',
      emptyHtml: 'Your basket is empty.<br><span>Add items from the menu to get started.</span>',
      parts: {
        foodSectionsInit: () => (V) => {
          V.x.menuQuantities = [];
          V.x.menuPhotos = [];
          V.x.sections = V.util.el('div', 'fd-sections', V.menu);
        },
        foodColumns: () => () => 3,
        foodSection: (base, S) => (V, c) => {
          const { util, spec, strip, tabEls, panels, cols } = V;
          const b = S.H.btn(util, 'fd-tab', strip, c.name, 'tab');
          tabEls.push(b);
          const section = util.el('section', 'fd-section', V.x.sections);
          section.style.setProperty('--rows', Math.ceil(c.items.length / cols));
          const sizeRows = Math.max(
            0,
            ...c.items.map((id) => {
              const group = spec.items[id].group;
              return group && /size/i.test(group.name) ? group.values.length : 0;
            }),
          );
          section.style.setProperty('--card-min', sizeRows ? 110 + sizeRows * 36 + 'px' : '93px');
          section.classList.toggle('sized-section', !!sizeRows);
          util.el('h2', 'fd-section-title', section, c.name.toUpperCase());
          const g = util.el('div', 'fd-grid', section);
          g.style.setProperty('--cols', cols);
          panels.push(g);
        },
        foodPhoto: () => (V, card, it) => {
          const foodPhoto = V.util.el('div', 'fd-photo', card);
          const dishes = [
            [31, 258, 143, 207],
            [431, 258, 143, 207],
            [831, 258, 143, 207],
            [31, 539, 143, 126],
            [431, 539, 143, 126],
            [831, 539, 143, 126],
            [31, 740, 143, 134],
            [431, 740, 143, 134],
            [831, 740, 143, 134],
          ];
          const tile = /pizza/i.test(it.name)
            ? /mushroom|funghi/i.test(it.name)
              ? 2
              : /pepperoni|bbq|hawaiian/i.test(it.name)
                ? 1
                : 0
            : /cheesecake/i.test(it.name)
              ? 6
              : /brownie|chocolate/i.test(it.name)
                ? 7
                : /tiramisu/i.test(it.name)
                  ? 8
                  : /bread|bruschetta|pita/i.test(it.name)
                    ? 3
                    : /wing|chicken|lamb/i.test(it.name)
                      ? 5
                      : /popper|gyoza|falafel|fries/i.test(it.name)
                        ? 4
                        : /mushroom|funghi|tofu|edamame/i.test(it.name)
                          ? 2
                          : /pepperoni|beef|pork/i.test(it.name)
                            ? 1
                            : /dessert|cake/i.test(it.name)
                              ? 8
                              : 0;
          let [px, py, pw, ph] = dishes[tile];
          let iw = 1672,
            ih = 941,
            source = MENU_PHOTO_URL;
          const seededTiles = [
            [/bruschetta/i, 0],
            [/hummus/i, 1],
            [/edamame/i, 2],
            [/gyoza/i, 3],
            [/tikka/i, 4],
            [/thai.*curry/i, 5],
            [/butter chicken/i, 6],
            [/rogan|massaman/i, 7],
            [/dal makhani|chana masala/i, 8],
            [/palak|paneer/i, 9],
            [/beet/i, 10],
            [/greek.*salad/i, 11],
            [/quinoa/i, 12],
            [/cobb|salad/i, 13],
            [/tofu/i, 14],
            [/enchilada|quesadilla|burrito|taco/i, 15],
          ];
          const extraTiles = [
            [/sparkling|water/i, 0],
            [/matcha/i, 1],
            [/lemonade|iced tea/i, 2],
            [/hot chocolate/i, 3],
            [/ribeye|steak/i, 4],
            [/roast chicken/i, 5],
            [/bourguignon/i, 6],
            [/shepherd/i, 7],
            [/quesadilla/i, 8],
            [/al pastor|tacos/i, 9],
            [/burrito/i, 10],
            [/sweet potato fries/i, 12],
            [/fries/i, 11],
            [/naan/i, 13],
            [/mashed/i, 14],
            [/caesar/i, 15],
          ];
          const extra = extraTiles.find(([pattern]) => pattern.test(it.name));
          const match = extra || seededTiles.find(([pattern]) => pattern.test(it.name));
          if (match) {
            const k = match[1];
            iw = ih = 1254;
            pw = ph = iw / 4;
            px = (k % 4) * pw;
            py = Math.floor(k / 4) * ph;
            source = extra ? EXTRA_PHOTO_URL : SEEDED_PHOTO_URL;
          } else if (/coffee|espresso|latte|cappuccino/i.test(it.name)) {
            iw = ih = 1254;
            pw = ph = iw / 3;
            px = py = pw;
            source = PHOTO_URL;
          }
          V.x.menuPhotos.push({ el: foodPhoto, px, py, pw, ph, iw, ih });
          foodPhoto.style.backgroundImage = `url(${source})`;
          foodPhoto.style.backgroundSize = `${(1672 / pw) * 100}% ${(941 / ph) * 100}%`;
          foodPhoto.style.backgroundPosition = `${(px / (1672 - pw)) * 100}% ${(py / (941 - ph)) * 100}%`;
        },
        inlineControls: () => () => {},
        cardFoot: (base, S) => (V, card, it, id) => {
          const { ctx, util, spec, fam, fmt, addEls, step, commit } = V;
          const { btn } = S.H;
          const isSize = it.group && /size/i.test(it.group.name);
          const options = isSize ? it.group.values : [null];
          const controls = util.el('div', 'fd-controls', card);
          if (isSize) card.classList.add('with-sizes');
          options.forEach((option, oi) => {
            const foot = util.el('div', 'fd-foot', controls);
            if (option) util.el('span', 'fd-size-label', foot, option);
            util.el('span', 'fd-price', foot, fmt(it.price + (isSize ? it.group.extra[oi] : 0)));
            const down = btn(util, 'fd-minus', foot, '−', 'qty-down');
            const quantity = util.el('span', 'fd-menu-q', foot, '0');
            const add = btn(util, 'fd-add', foot, '+', 'add');
            add.setAttribute('aria-label', `Add ${it.name}${option ? ' ' + option : ''}`);
            down.setAttribute('aria-label', `Decrease ${it.name}${option ? ' ' + option : ''}`);
            V.x.menuQuantities.push({ id, option, quantity, down, add });
            down.addEventListener('click', () => {
              const line = ctx.model.cart.find((l) => l.item === id && (!option || l.option === option));
              if (line && !ctx.model.ordered && !ctx.model.dialog)
                step({ click: { line: fam.lineKey(line.item, line.option), op: 'dec' } });
            });
            if (!oi) addEls[id] = add;
            else
              add.addEventListener('click', () => {
                if (ctx.model.ordered || ctx.model.dialog) return;
                let m = fam.apply(ctx.model, spec, { click: { add: id } });
                if (m.dialog) m = { ...m, dialog: { ...m.dialog, option } };
                commit(m);
              });
          });
        },
        foodTabs: () => (V) => {
          const { ctx, tabEls, panels, commit } = V;
          V.tabs = env.ui.tabs(tabEls, panels, {
            value: ctx.model.tab,
            onChange: (k) => {
              commit({ ...ctx.model, tab: k });
              V.x.sections.scrollTop = panels[k].parentElement.offsetTop - V.x.sections.offsetTop;
            },
          });
          env.ui.buttons(
            Object.entries(V.addEls).map(([, el]) => el),
            {
              keys: Object.keys(V.addEls).map(Number),
              label: 'add',
              onClick(k) {
                if (!ctx.model.ordered && !ctx.model.dialog) V.step({ click: { add: k } });
              },
            },
          );
        },
        paintPre: () => (V, m) => {
          // Keep all menu categories on the workstation, without changing the task's active tab.
          V.panels.forEach((p) => {
            p.hidden = false;
            p.removeAttribute('aria-hidden');
          });
          for (const photo of V.x.menuPhotos) {
            const r = photo.el.getBoundingClientRect();
            const scale = Math.max(r.width / photo.pw, r.height / photo.ph);
            photo.el.style.backgroundSize = `${photo.iw * scale}px ${photo.ih * scale}px`;
            photo.el.style.backgroundPosition = `${-photo.px * scale - (photo.pw * scale - r.width) / 2}px ${-photo.py * scale - (photo.ph * scale - r.height) / 2}px`;
          }
          for (const q of V.x.menuQuantities) {
            const count = m.cart
              .filter((l) => l.item === q.id && (!q.option || l.option === q.option))
              .reduce((n, l) => n + l.qty, 0);
            q.quantity.textContent = String(count);
            q.down.disabled = m.ordered || !count;
            q.add.disabled = m.ordered;
          }
        },
        locateAdd: (base, S) => (V, k) => {
          const card = V.addEls[k].closest('.fd-card');
          const r = card.getBoundingClientRect(),
            sr = V.x.sections.getBoundingClientRect();
          if (r.top < sr.top || r.bottom > sr.bottom)
            V.x.sections.scrollTop += r.top < sr.top ? r.top - sr.top : r.bottom - sr.bottom;
          return S.H.where(V.addEls[k], `Add ${k}`);
        },
      },
    },
  });
})();
