/* use-shop/_base-food: reference food units; scope reads preserve live design overrides. */
(function () {
  'use strict';
  function buildFood(scope, ctx, body) {
    // One render owns the elements and callbacks shared by its named steps.
    const view = { scope, ctx, body };
    view.buildDialog = (...args) => buildDialog(view, ...args);
    view.paint = (...args) => paint(view, ...args);
    view.lineBtn = (...args) => lineBtn(view, ...args);
    createFoodMenuAndBasket(view);
    connectFoodDialog(view);
    return {
      paint: view.paint,
      locate(t) {
        if (t.tab !== undefined) return view.tabs.locate(t.tab);
        if (t.add !== undefined) return view.scope.where(view.addEls[t.add], `Add ${t.add}`);
        if (t.choice !== undefined) return view.choice.locate(t.choice);
        if (t.qty) return view.spin.locate(t.qty);
        if (t.dialog) return view.dlg.locate(t.dialog);
        if (t.line !== undefined) return view.lineBtn(t.line, t.op);
        if (t.order) return view.scope.where(view.order, 'Place order');
        if (t.cancelOrder) return view.scope.where(view.cancelOrder, 'Cancel order');
        return null;
      },
    };
  }

  function buildDialog(view, d) {
    const it = view.spec.items[d.item];
    view.dtitle.textContent = it.name;
    view.db.replaceChildren();
    view.util.el('div', 'fd-dd', view.db, `${it.desc} · ${view.fmt(it.price)}`);
    view.util.el('div', 'fd-gl', view.db, it.group.name);
    const tiles = view.util.el('div', 'fd-otiles', view.db);
    const els = it.group.values.map((v, k) => {
      const t = view.util.el('div', 'fd-ot', tiles);
      t.dataset.role = 'option';
      view.util.el('i', '', t);
      view.util.el('span', '', t, v);
      view.util.el('em', '', t, it.group.extra[k] ? `+${view.fmt(it.group.extra[k])}` : '');
      return [v, t];
    });
    view.choice = view.scope.env.ui.choices(els, {
      label: 'option',
      value: d.option,
      onChange: (v) => { if (view.ctx.model.dialog) view.commit({ ...view.ctx.model, dialog: { ...view.ctx.model.dialog, option: v } }); },
    });
    view.util.el('div', 'fd-gl', view.db, 'Quantity').style.marginTop = '12px';
    const q = view.util.el('div', 'fd-qty', view.db);
    q.style.marginTop = '0';
    const down = view.scope.btn(view.util, 'fd-st', q, '−', 'qty-down');
    view.qtyEl = view.util.el('span', 'fd-q', q, String(d.qty));
    const up = view.scope.btn(view.util, 'fd-st', q, '+', 'qty-up');
    view.spin = view.scope.env.ui.spinner({
      up, down, field: view.qtyEl, value: d.qty, min: 1, max: 9, label: 'quantity',
      onChange: (v) => { if (view.ctx.model.dialog) view.commit({ ...view.ctx.model, dialog: { ...view.ctx.model.dialog, qty: v } }); },
    });
    const r = view.box.getBoundingClientRect();
    view.box.style.left = Math.round((view.bh.width - r.width) / 2) + 'px';
    view.box.style.top = Math.round(Math.max(8, (view.bh.height - r.height) / 2 - 20)) + 'px';
  }

  function paint(view, m) {
    view.tabs.set(m.tab);
    view.lines.replaceChildren();
    for (const k of Object.keys(view.lineEls)) delete view.lineEls[k];
    if (!m.cart.length) {
      const e = view.util.el('div', 'fd-empty', view.lines);
      e.innerHTML = view.scope.ICON.bag2 + '<p>Your basket is waiting</p><span>Keep your favourites together in one order.</span>';
      e.querySelector('svg').style.cssText = 'width:38px;height:38px;color:var(--muted)';
      view.scope.iconLabel(view.util, e, 'truck', 'Delivery estimate appears with your order');
    }
    for (const l of m.cart) {
      const key = view.fam.lineKey(l.item, l.option);
      const it = view.spec.items[l.item];
      const row = view.util.el('div', 'fd-line', view.lines);
      row.dataset.role = 'cart-line';
      const r1 = view.util.el('div', 'fd-l1', row);
      const nm = view.util.el('div', 'fd-lname', r1, it.name);
      if (l.option) view.util.el('span', 'fd-lopt', nm, `${it.group.name}: ${l.option}`);
      view.util.el('div', 'fd-lp', r1, view.fmt(view.fam.linePrice(view.spec, l)));
      const r2 = view.util.el('div', 'fd-l2', row);
      const els = {};
      const mk = (op, txt, cls) => {
        const b = view.scope.btn(view.util, cls, r2, txt);
        b.disabled = m.ordered;
        b.addEventListener('click', () => { if (!view.ctx.model.ordered) view.step({ click: { line: key, op } }); });
        els[op] = b;
      };
      mk('dec', '−', 'fd-st');
      view.util.el('span', 'fd-q', r2, String(l.qty));
      mk('inc', '+', 'fd-st');
      mk('remove', 'Remove', 'fd-rm');
      view.lineEls[key] = els;
    }
    const n = m.cart.reduce((s, l) => s + l.qty, 0);
    view.cnt.textContent = n ? `${n} item${n > 1 ? 's' : ''}` : '';
    view.totV.textContent = view.fmt(view.fam.cartTotal(view.spec, m.cart) + (m.cart.length ? view.fee : 0));
    view.order.hidden = m.ordered;
    view.order.disabled = !m.cart.length;
    view.done.hidden = !m.ordered;
    for (const b of Object.values(view.addEls)) b.disabled = m.ordered;
    view.dlg.set(!!m.dialog);
    if (m.dialog) {
      const key = `${m.dialog.item}`;
      if (view.dFor !== key) {
        view.dFor = key;
        view.buildDialog(m.dialog);
      }
      view.choice.set(m.dialog.option);
      view.spin.set(m.dialog.qty);
      view.qtyEl.textContent = String(m.dialog.qty);
      view.dadd.textContent = `Add to cart · ${view.fmt(view.fam.linePrice(view.spec, { item: m.dialog.item, option: m.dialog.option, qty: m.dialog.qty }))}`;
    } else view.dFor = null;
  }

  function lineBtn(view, key, op) {
    const els = view.lineEls[key];
    if (!els) throw new Error(`use-shop/store: cart line ${key} not shown`);
    const b = els[op];
    const lr = view.lines.getBoundingClientRect();
    const r = b.getBoundingClientRect();
    if (r.top < lr.top || r.bottom > lr.bottom) view.lines.scrollTop += r.top < lr.top ? r.top - lr.top - 4 : r.bottom - lr.bottom + 4;
    return view.scope.where(b, `cart ${op}`);
  }
  function createFoodMenuAndBasket(view) {
    ({ util: view.util, spec: view.spec, rng: view.rng } = view.ctx);
    view.fam = view.scope.F();
    view.fmt = view.scope.money(view.spec);
    view.commit = (m) => { view.ctx.update(m); view.paint(view.ctx.model); };
    view.step = (s) => { view.scope.irreversible(view.ctx, s.click); view.commit(view.fam.apply(view.ctx.model, view.spec, s)); };
    view.wrap = view.util.el('div', 'fd-wrap' + (view.rng.bool(0.25) ? ' left' : ''), view.body);
    view.menu = view.util.el('div', 'fd-menu', view.wrap);
    view.cart = view.util.el('aside', 'fd-cart', view.wrap);
    view.hero = view.util.el('div', 'fd-hero', view.menu);
    view.util.el('div', 'fd-rname', view.hero, view.spec.restaurant);
    view.fee = view.rng.pick([99, 149, 199, 249]);
    view.util.el('div', 'fd-rmeta', view.hero, `Rated ${(4 + view.rng.int(1, 9) / 10).toFixed(1)}/5 · ${view.rng.int(15, 30)}–${view.rng.int(35, 50)} min · ${view.fmt(view.fee)} delivery`);
    view.strip = view.util.el('div', 'fd-tabs', view.menu);
    view.tabEls = [];
    view.panels = [];
    view.addEls = {};
    view.cw = view.menu.getBoundingClientRect().width - 44;
    view.cols = view.cw > 720 ? 3 : 2;
    view.spec.cats.forEach((c) => {
      const b = view.scope.btn(view.util, 'fd-tab', view.strip, c.name, 'tab');
      view.tabEls.push(b);
      const g = view.util.el('div', 'fd-grid', view.menu);
      g.style.setProperty('--cols', view.cols);
      view.panels.push(g);
    });
    view.gridTop = view.panels[0].getBoundingClientRect().top;
    view.avail = view.body.getBoundingClientRect().bottom - 14 - view.gridTop;
    view.maxRows = Math.max(...view.spec.cats.map((c) => Math.ceil(c.items.length / view.cols)));
    view.ch = Math.max(88, Math.min(124, Math.floor((view.avail - (view.maxRows - 1) * 12) / view.maxRows)));
    view.spec.cats.forEach((c, ci) => {
      for (const id of c.items) {
        const it = view.spec.items[id];
        const card = view.util.el('div', 'fd-card', view.panels[ci]);
        card.classList.toggle('compact', view.ch < 118);
        card.dataset.role = 'item';
        card.style.height = view.ch + 'px';
        view.util.el('div', 'fd-food-art', card).innerHTML = view.scope.productArt(it.name, 30 + id * 17, 'food');
        view.util.el('div', 'fd-name', card, it.name).title = it.name;
        view.util.el('div', 'fd-desc', card, it.desc);
        const tags = view.util.el('div', 'fd-tags', card);
        for (const tg of it.tags) view.util.el('span', 'fd-tag', tags, view.fam.TAG_LABEL[tg]).style.setProperty('--tc', view.scope.TAG_COLOR[tg]);
        const foot = view.util.el('div', 'fd-foot', card);
        const pr = view.util.el('span', 'fd-price', foot, view.fmt(it.price));
        if (it.group) view.util.el('span', 'fd-opts', pr, `${it.group.values.length} ${it.group.name.toLowerCase()} options`);
        const add = view.scope.btn(view.util, 'fd-add', foot, undefined, 'add');
        add.innerHTML = `${view.scope.ICON.plus}<span>Add</span>`;
        view.addEls[id] = add;
      }
    });
    view.tabs = view.scope.env.ui.tabs(view.tabEls, view.panels, { value: view.ctx.model.tab, onChange: (k) => view.commit({ ...view.ctx.model, tab: k }) });
    view.scope.env.ui.buttons(Object.entries(view.addEls).map(([, el]) => el), {
      keys: Object.keys(view.addEls).map(Number),
      label: 'add',
      onClick(k) { if (!view.ctx.model.ordered && !view.ctx.model.dialog) view.step({ click: { add: k } }); },
    });
    view.chd = view.util.el('div', 'fd-ch', view.cart);
    view.chd.innerHTML = view.scope.ICON.cart;
    view.util.el('span', '', view.chd, view.rng.pick(['Your order', 'Your cart', 'Basket']));
    view.cnt = view.util.el('span', 'fd-cn', view.chd);
    view.lines = view.util.el('div', 'fd-lines', view.cart);
    view.lines.dataset.role = 'cart';
    view.sub = view.util.el('div', 'fd-sum', view.cart);
    view.util.el('span', '', view.sub, 'Delivery');
    view.util.el('span', '', view.sub, view.fmt(view.fee));
    view.tot = view.util.el('div', 'fd-sum total', view.cart);
    view.util.el('span', '', view.tot, 'Total');
    view.totV = view.util.el('span', '', view.tot);
    view.order = view.scope.btn(view.util, 'as-btn primary fd-order', view.cart, 'Place order', 'order');
    view.order.addEventListener('click', () => { if (!view.ctx.model.ordered && view.ctx.model.cart.length) view.step({ click: { order: true } }); });
    view.done = view.util.el('div', 'fd-done', view.cart);
    view.util.el('b', '', view.done, 'Order placed');
    view.util.el('span', '', view.done, `Order #${view.rng.int(1000, 9999)} is being prepared. Estimated delivery ${view.rng.int(25, 45)} min. `);
    view.cancelOrder = view.scope.btn(view.util, 'as-link danger', view.done, 'Cancel order', 'cancel-order');
    view.cancelOrder.addEventListener('click', () => { if (view.ctx.model.ordered) view.step({ click: { cancelOrder: true } }); });
    view.lineEls = {};
    view.backdrop = view.util.el('div', 'as-backdrop', view.body);
    view.box = view.util.el('div', 'as-dialog fd-dlg', view.body);
    view.box.classList.toggle('compact', view.body.getBoundingClientRect().height < 460);
    view.box.dataset.role = 'dialog';
    view.dh = view.util.el('div', 'as-dlg-h', view.box);
    view.dtitle = view.util.el('span', 'as-dlg-t', view.dh);
    view.x = view.scope.btn(view.util, 'as-x', view.dh, '×');
    view.db = view.util.el('div', 'as-dlg-b', view.box);
    view.df = view.util.el('div', 'as-dlg-f', view.box);
    view.dcancel = view.scope.btn(view.util, 'as-btn', view.df, 'Cancel');
    view.dadd = view.scope.btn(view.util, 'as-btn primary', view.df, 'Add to cart');
  }

  function connectFoodDialog(view) {
    view.dlg = view.scope.env.ui.dialog(view.box, {
      open: !!view.ctx.model.dialog,
      close: view.x,
      closeResult: 'cancel',
      buttons: [['add', view.dadd], ['cancel', view.dcancel]],
      backdrop: view.backdrop,
      label: 'options',
      onChange(open, result) { if (result) view.step({ click: { dialog: result === 'add' ? 'add' : 'cancel' } }); },
    });
    view.dFor = null;
    view.choice = null;
    view.spin = null;
    view.qtyEl = null;
    view.bh = view.body.getBoundingClientRect();
    view.paint(view.ctx.model);
  }
  env.template('use-shop/_base-food', () => ({ buildFood }));
})();
