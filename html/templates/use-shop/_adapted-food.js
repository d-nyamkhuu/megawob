/* use-shop/_adapted-food: adapted food parts; designs still override each BASE part. */
(function () {
  'use strict';
  function install(BASE, S) {
    installFoodWrap(BASE, S);
    installAddClick(BASE, S);
    installFoodDialog(BASE, S);
    installPaintControls(BASE, S);
  }

  function installFoodWrap(BASE, S) {
    BASE.foodWrap = (V) => V.util.el('div', 'fd-wrap', V.body);

    BASE.menuBand = (V) => (S.D.menuTitle === null ? null : V.util.el('h2', 'menu-band', V.menu, S.D.menuTitle));

    BASE.foodMenu = (V) => {
      V.menu = V.util.el('div', 'fd-menu', V.wrap);
      V.band = S.P.menuBand(V);
      V.cart = V.util.el('aside', 'fd-cart', V.wrap);
    };

    BASE.foodHero = (V) => {
      const { util, spec, rng, fmt, menu } = V;
      const hero = util.el('div', 'fd-hero', menu);
      util.el('div', 'fd-rname', hero, spec.restaurant);
      V.fee = rng.pick([99, 149, 199, 249]);
      util.el(
        'div',
        'fd-rmeta',
        hero,
        `★ ${(4 + rng.int(1, 9) / 10).toFixed(1)} · ${rng.int(15, 30)}–${rng.int(35, 50)} min · ${fmt(V.fee)} delivery`,
      );
    };

    BASE.foodColumns = (V, cw) => (cw > 720 ? 3 : 2);

    BASE.foodSection = (V, c, ci) => {
      const { util, menu, strip, tabEls, panels, cols } = V;
      const b = S.H.btn(util, 'fd-tab', strip, c.name, 'tab');
      tabEls.push(b);
      const g = util.el('div', 'fd-grid', menu);
      if (S.D.menuColumns) {
        const th = util.el('div', 'menu-columns', g);
        for (const label of S.D.menuColumns) util.el('b', '', th, label);
      }
      g.style.setProperty('--cols', cols);
      panels.push(g);
    };

    // Hook before the grid columns are decided (state a design's sections need).
    BASE.foodSectionsInit = () => {};

    BASE.foodSections = (V) => {
      const { util, spec, menu } = V;
      V.strip = util.el('div', 'fd-tabs', menu);
      V.tabEls = [];
      V.panels = [];
      V.addEls = {};
      S.P.foodSectionsInit(V);
      const cw = menu.getBoundingClientRect().width - 44;
      V.cols = S.P.foodColumns(V, cw);
      spec.cats.forEach((c, ci) => S.P.foodSection(V, c, ci));
      S.P.foodSectionsDone(V);
    };

    // Hook after every category has its tab and grid.
    BASE.foodSectionsDone = () => {};

    BASE.foodPhoto = (V, card, it) => {
      const foodPhoto = V.util.el('div', 'fd-photo', card);
      const n = it.name.toLowerCase();
      const hit = S.D.photoMap.find(([re]) => re.test(n));
      const tile = hit ? hit[1] : S.D.photoDefault;
      foodPhoto.style.backgroundImage = `url(sites/${S.def.site}/assets/${S.D.photoSheet})`;
      foodPhoto.style.backgroundSize = S.D.photoSize;
      foodPhoto.style.backgroundPosition = S.D.photoPos(tile);
      S.P.photoExtra(V, foodPhoto, it, n);
    };

    BASE.photoExtra = () => {};

    BASE.cardText = (V, card, it) => {
      const { util, fam } = V;
      util.el('div', 'fd-name', card, it.name).title = it.name;
      util.el('div', 'fd-desc', card, it.desc);
      const tags = util.el('div', 'fd-tags', card);
      for (const tg of it.tags)
        util.el('span', 'fd-tag', tags, fam.TAG_LABEL[tg]).style.setProperty('--tc', S.H.TAG_COLOR[tg]);
    };

    // The size and quantity controls inside a card; the add click reads `.inline-size` and `.inline-quantity`.
    BASE.inlineControls = (V, card, it) => {
      const { util } = V;
      const size = util.el('select', 'inline-size', card);
      for (const name of it.group ? it.group.values : ['Regular']) {
        const op = util.el('option', '', size, name);
        op.value = name;
      }
      const qty = util.el('input', 'inline-quantity', card);
      qty.type = 'number';
      qty.min = '0';
      qty.max = '9';
      qty.value = '0';
    };

    BASE.cardFoot = (V, card, it, id) => {
      const { util, fmt, addEls } = V;
      const foot = util.el('div', 'fd-foot', card);
      const pr = util.el('span', 'fd-price', foot, fmt(it.price));
      if (it.group) util.el('span', 'fd-opts', pr, `${it.group.values.length} ${it.group.name.toLowerCase()} options`);
      const add = S.H.btn(util, 'fd-add', foot, undefined, 'add');
      add.textContent = S.D.addLabel;
      addEls[id] = add;
    };

    BASE.foodCard = (V, c, ci, id) => {
      const { util, spec, panels, ch } = V;
      const it = spec.items[id];
      const card = util.el('div', 'fd-card', panels[ci]);
      S.P.foodPhoto(V, card, it);
      card.classList.toggle('compact', ch < 118);
      card.dataset.role = 'item';
      card.style.height = ch + 'px';
      S.P.cardText(V, card, it);
      S.P.inlineControls(V, card, it, id);
      S.P.cardFoot(V, card, it, id);
    };

    BASE.foodCards = (V) => {
      const { spec, body, panels, cols } = V;
      const gridTop = panels[0].getBoundingClientRect().top;
      const avail = body.getBoundingClientRect().bottom - 14 - gridTop;
      const maxRows = Math.max(...spec.cats.map((c) => Math.ceil(c.items.length / cols)));
      V.ch = Math.max(56, Math.min(S.D.cardMax, Math.floor((avail - (maxRows - 1) * 12) / maxRows)));
      spec.cats.forEach((c, ci) => {
        for (const id of c.items) S.P.foodCard(V, c, ci, id);
      });
    };
  }

  function installAddClick(BASE, S) {
    BASE.addClick = (V, k) => {
      const { ctx, addEls, step, commit } = V;
      if (!ctx.model.ordered && !ctx.model.dialog) {
        const card = addEls[k].closest('.fd-card'),
          q = Math.max(1, Math.min(9, +card.querySelector('.inline-quantity').value || 1)),
          option = card.querySelector('.inline-size').value;
        step({ click: { add: k } });
        if (ctx.model.dialog) commit({ ...ctx.model, dialog: { ...ctx.model.dialog, qty: q, option } });
        else for (let i = 1; i < q; i++) step({ click: { add: k } });
        card.querySelector('.inline-quantity').value = String(q);
      }
    };

    BASE.foodTabs = (V) => {
      const { ctx, tabEls, panels, addEls, commit } = V;
      V.tabs = env.ui.tabs(tabEls, panels, {
        value: ctx.model.tab,
        onChange: (k) => commit({ ...ctx.model, tab: k }),
      });
      env.ui.buttons(
        Object.entries(addEls).map(([, el]) => el),
        {
          keys: Object.keys(addEls).map(Number),
          label: 'add',
          onClick(k) {
            S.P.addClick(V, k);
          },
        },
      );
    };

    BASE.cartHead = (V) => {
      const { util, cart } = V;
      const chd = util.el('div', 'fd-ch', cart);
      chd.innerHTML = S.H.ICON.cart;
      // A sampled title is drawn first by designs that replace it with a fixed one.
      if (S.D.cartTitleDraw)
        util.el('span', '', chd, V.rng.pick(['Your order', 'Your cart', 'Basket'])).textContent = S.D.cartTitle;
      else util.el('span', '', chd, S.D.cartTitle);
      if (S.D.cartColumns) {
        const cartHead = util.el('div', 'basket-columns', cart);
        for (const label of S.D.cartColumns) util.el('b', '', cartHead, label);
      }
      V.cnt = util.el('span', 'fd-cn', chd);
      V.lines = util.el('div', 'fd-lines', cart);
      V.lines.dataset.role = 'cart';
    };

    // The delivery and total rows; V.totV shows the total.
    BASE.cartSummary = (V) => {
      const { util, cart, fmt, fee } = V;
      const sub = util.el('div', 'fd-sum', cart);
      util.el('span', '', sub, 'Delivery');
      util.el('span', '', sub, fmt(fee));
      const tot = util.el('div', 'fd-sum total', cart);
      util.el('span', '', tot, S.D.totalLabel);
      V.totV = util.el('span', '', tot);
    };

    // Place order and Clear basket: in the site's frame slots (orderHost 'slot': the slot is emptied first and
    // V.clear is the frame's button; 'slotKeep': the slot is kept and the click is added) or Place order alone at the
    // end of the basket (orderHost 'cart').
    BASE.orderControls = (V) => {
      const { ctx, util, cart, commit, step } = V;
      if (S.D.orderHost === 'cart') {
        V.order = S.H.btn(util, 'as-btn primary fd-order', cart, 'Place order', 'order');
      } else if (S.D.orderHost === 'slotKeep') {
        V.order = S.H.btn(util, 'as-btn primary fd-order', document.querySelector('.order-slot'), 'Place order', 'order');
        V.clear = document.querySelector('.clear-basket');
        V.clear.addEventListener('click', () => commit({ ...ctx.model, cart: [], ordered: false, dialog: null }));
      } else {
        // Chrome survives widget rebuilds, so replace its previous widget-owned control.
        const orderSlot = document.querySelector('.order-slot');
        orderSlot.replaceChildren();
        V.order = S.H.btn(util, 'as-btn primary fd-order', orderSlot, 'Place order', 'order');
        V.clear = document.querySelector('.clear-basket');
        V.clear.onclick = () => commit({ ...ctx.model, cart: [], ordered: false, dialog: null });
      }
      V.order.addEventListener('click', () => {
        if (!ctx.model.ordered && ctx.model.cart.length) step({ click: { order: true } });
      });
    };

    BASE.orderDone = (V) => {
      const { ctx, util, cart, rng, step } = V;
      V.done = util.el('div', 'fd-done', cart);
      util.el('b', '', V.done, 'Order placed');
      util.el(
        'span',
        '',
        V.done,
        `Order #${rng.int(1000, 9999)} is being prepared. Estimated delivery ${rng.int(25, 45)} min. `,
      );
      V.cancelOrder = S.H.btn(util, 'as-link danger', V.done, 'Cancel order', 'cancel-order');
      V.cancelOrder.addEventListener('click', () => {
        if (ctx.model.ordered) step({ click: { cancelOrder: true } });
      });
    };
  }

  function installFoodDialog(BASE, S) {
    BASE.foodDialog = (V) => {
      const { ctx, util, spec, fam, fmt, body, commit, step } = V;
      const backdrop = util.el('div', 'as-backdrop', body);
      const box = util.el('div', 'as-dialog fd-dlg', body);
      box.classList.toggle('compact', body.getBoundingClientRect().height < 460);
      box.dataset.role = 'dialog';
      const dh = util.el('div', 'as-dlg-h', box);
      const dtitle = util.el('span', 'as-dlg-t', dh);
      const x = S.H.btn(util, 'as-x', dh, '×');
      const db = util.el('div', 'as-dlg-b', box);
      const df = util.el('div', 'as-dlg-f', box);
      const dcancel = S.H.btn(util, 'as-btn', df, 'Cancel');
      const dadd = S.H.btn(util, 'as-btn primary', df, 'Add to cart');
      const dlg = env.ui.dialog(box, {
        open: !!ctx.model.dialog,
        close: x,
        closeResult: 'cancel',
        buttons: [
          ['add', dadd],
          ['cancel', dcancel],
        ],
        backdrop,
        label: 'options',
        onChange(open, result) {
          if (result) step({ click: { dialog: result === 'add' ? 'add' : 'cancel' } });
        },
      });
      const dd = (V.dd = { dlg, dadd, dFor: null, choice: null, spin: null, qtyEl: null });
      const bh = body.getBoundingClientRect();

      dd.build = (d) => {
        const it = spec.items[d.item];
        dtitle.textContent = it.name;
        db.replaceChildren();
        util.el('div', 'fd-dd', db, `${it.desc} · ${fmt(it.price)}`);
        util.el('div', 'fd-gl', db, it.group.name);
        const tiles = util.el('div', 'fd-otiles', db);
        const els = it.group.values.map((v, k) => {
          const t = util.el('div', 'fd-ot', tiles);
          t.dataset.role = 'option';
          util.el('i', '', t);
          util.el('span', '', t, v);
          util.el('em', '', t, it.group.extra[k] ? `+${fmt(it.group.extra[k])}` : '');
          return [v, t];
        });
        dd.choice = env.ui.choices(els, {
          label: 'option',
          value: d.option,
          onChange: (v) => {
            if (ctx.model.dialog) commit({ ...ctx.model, dialog: { ...ctx.model.dialog, option: v } });
          },
        });
        util.el('div', 'fd-gl', db, 'Quantity').style.marginTop = '12px';
        const q = util.el('div', 'fd-qty', db);
        q.style.marginTop = '0';
        const down = S.H.btn(util, 'fd-st', q, '−', 'qty-down');
        dd.qtyEl = util.el('span', 'fd-q', q, String(d.qty));
        const up = S.H.btn(util, 'fd-st', q, '+', 'qty-up');
        dd.spin = env.ui.spinner({
          up,
          down,
          field: dd.qtyEl,
          value: d.qty,
          min: 1,
          max: 9,
          label: 'quantity',
          onChange: (v) => {
            if (ctx.model.dialog) commit({ ...ctx.model, dialog: { ...ctx.model.dialog, qty: v } });
          },
        });
        const r = box.getBoundingClientRect();
        box.style.left = Math.round((bh.width - r.width) / 2) + 'px';
        box.style.top = Math.round(Math.max(8, (bh.height - r.height) / 2 - 20)) + 'px';
      };
    };

    // ---- repaint from the model

    BASE.paintPre = () => {};

    BASE.clearLines = (V) => {
      V.lines.replaceChildren();
      for (const k of Object.keys(V.lineEls)) delete V.lineEls[k];
    };

    // One cart line: name, price, - / + / Remove buttons (registered in V.lineEls by line key).
    BASE.cartLine = (V, l, m) => {
      const { util, spec, fam, fmt, lines, lineEls, step, ctx } = V;
      const key = fam.lineKey(l.item, l.option);
      const it = spec.items[l.item];
      const row = util.el('div', 'fd-line', lines);
      row.dataset.role = 'cart-line';
      const r1 = util.el('div', 'fd-l1', row);
      const nm = util.el('div', 'fd-lname', r1, it.name);
      if (l.option) util.el('span', 'fd-lopt', nm, `${it.group.name}: ${l.option}`);
      util.el('div', 'fd-lp', r1, fmt(fam.linePrice(spec, l)));
      const r2 = util.el('div', 'fd-l2', row);
      const els = {};
      const mk = (op, txt, cls) => {
        const b = S.H.btn(util, cls, r2, txt);
        b.disabled = m.ordered;
        b.addEventListener('click', () => {
          if (!ctx.model.ordered) step({ click: { line: key, op } });
        });
        els[op] = b;
      };
      mk('dec', '−', 'fd-st');
      util.el('span', 'fd-q', r2, String(l.qty));
      mk('inc', '+', 'fd-st');
      mk('remove', 'Remove', 'fd-rm');
      lineEls[key] = els;
    };

    BASE.paintBasketState = (V, m) => {
      const state = document.querySelector('.basket-state');
      if (state) state.textContent = m.ordered ? 'Your order has been placed.' : 'The basket is not complete yet.';
    };

    BASE.paintTotals = (V, m) => {
      const { spec, fam, fmt, cnt, totV, fee } = V;
      const n = m.cart.reduce((s, l) => s + l.qty, 0);
      cnt.textContent = n ? `${n} item${n > 1 ? 's' : ''}` : '';
      totV.textContent = fmt(fam.cartTotal(spec, m.cart) + (m.cart.length ? fee : 0));
    };
  }

  function installPaintControls(BASE, S) {
    BASE.paintControls = (V, m) => {
      const { order, done, addEls } = V;
      order.hidden = m.ordered;
      order.disabled = !m.cart.length;
      done.hidden = !m.ordered;
      for (const b of Object.values(addEls)) b.disabled = m.ordered;
    };

    BASE.paintDialog = (V, m) => {
      const { spec, fam, fmt, dd } = V;
      dd.dlg.set(!!m.dialog);
      if (m.dialog) {
        const key = `${m.dialog.item}`;
        if (dd.dFor !== key) {
          dd.dFor = key;
          dd.build(m.dialog);
        }
        dd.choice.set(m.dialog.option);
        dd.spin.set(m.dialog.qty);
        dd.qtyEl.textContent = String(m.dialog.qty);
        dd.dadd.textContent = `Add to cart · ${fmt(fam.linePrice(spec, { item: m.dialog.item, option: m.dialog.option, qty: m.dialog.qty }))}`;
      } else dd.dFor = null;
    };

    BASE.foodPaint = (V, m) => {
      const { util, lines } = V;
      V.tabs.set(m.tab);
      S.P.paintPre(V, m);
      S.P.clearLines(V);
      if (!m.cart.length) {
        const e = util.el('div', 'fd-empty', lines);
        if (S.D.emptyHtml) e.innerHTML = S.D.emptyHtml;
        else e.textContent = S.D.emptyText;
      }
      for (const l of m.cart) S.P.cartLine(V, l, m);
      S.P.paintBasketState(V, m);
      S.P.paintTotals(V, m);
      S.P.paintControls(V, m);
      S.P.paintDialog(V, m);
    };

    // ---- locate

    BASE.locateTab = (V, k) => V.tabs.locate(k);

    BASE.locateAdd = (V, k) => {
      V.addEls[k].scrollIntoView({ block: 'center' });
      return S.H.where(V.addEls[k], `Add ${k}`);
    };

    BASE.foodLocate = (V, t) => {
      if (t.tab !== undefined) return S.P.locateTab(V, t.tab);
      if (t.add !== undefined) return S.P.locateAdd(V, t.add);
      if (t.choice !== undefined) return V.dd.choice.locate(t.choice);
      if (t.qty) return V.dd.spin.locate(t.qty);
      if (t.dialog) return V.dd.dlg.locate(t.dialog);
      if (t.line !== undefined) return lineBtn(V, t.line, t.op);
      if (t.order) return S.H.where(V.order, 'Place order');
      if (t.cancelOrder) return S.H.where(V.cancelOrder, 'Cancel order');
      return null;
    };

    function lineBtn(V, key, op) {
      const els = V.lineEls[key];
      if (!els) throw new Error(`use-shop/store: cart line ${key} not shown`);
      const b = els[op];
      const lr = V.lines.getBoundingClientRect();
      const r = b.getBoundingClientRect();
      if (r.top < lr.top || r.bottom > lr.bottom)
        V.lines.scrollTop += r.top < lr.top ? r.top - lr.top - 4 : r.bottom - lr.bottom + 4;
      return S.H.where(b, `cart ${op}`);
    }

    BASE.buildFood = (ctx, body) => {
      const { util, spec, rng } = ctx;
      const fam = S.H.F();
      const V = { ctx, body, util, spec, rng, fam, fmt: S.H.money(spec), x: {} };
      V.commit = (m) => {
        ctx.update(m);
        V.paint(ctx.model);
      };
      V.step = (s) => V.commit(fam.apply(ctx.model, spec, s));
      V.paint = (m) => S.P.foodPaint(V, m);
      V.wrap = S.P.foodWrap(V);
      S.P.foodMenu(V);
      S.P.foodHero(V);
      S.P.foodSections(V);
      S.P.foodCards(V);
      S.P.foodTabs(V);
      S.P.cartHead(V);
      S.P.cartSummary(V);
      S.P.orderControls(V);
      S.P.orderDone(V);
      V.lineEls = {};
      S.P.foodDialog(V);
      V.paint(ctx.model);
      S.P.built(V);
      return { paint: V.paint, locate: (t) => S.P.foodLocate(V, t) };
    };
  }
  env.template('use-shop/_adapted-food', () => ({ install }));
})();
