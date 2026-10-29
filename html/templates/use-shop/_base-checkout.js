/* use-shop/_base-checkout: reference checkout units; scope reads preserve live design overrides. */
(function () {
  'use strict';
  function buildCheckout(scope, ctx, body, frameEls, mode = 'store') {
    // One render owns the elements and callbacks shared by its named steps.
    const view = { scope, ctx, body, frameEls, mode };
    view.shopPage = (...args) => shopPage(view, ...args);
    view.productPage = (...args) => productPage(view, ...args);
    view.cartPage = (...args) => cartPage(view, ...args);
    view.checkoutPage = (...args) => checkoutPage(view, ...args);
    view.orderPage = (...args) => orderPage(view, ...args);
    view.cancelPage = (...args) => cancelPage(view, ...args);
    view.trackPage = (...args) => trackPage(view, ...args);
    view.progressBar = (...args) => progressBar(view, ...args);
    view.buildSheet = (...args) => buildSheet(view, ...args);
    view.paint = (...args) => paint(view, ...args);
    createCheckoutShell(view);
    return {
      paint: view.paint,
      sync(m) { if (m !== view.lastPainted) view.paint(m); },
      locate(t) {
        if (t.nav) return view.scope.where(view.navEls[t.nav], `nav ${t.nav}`);
        if (t.field === 'search') return view.stf.locate();
        if (t.button === 'search') return view.scope.where(view.sgo, 'Search');
        if (view.base) return view.view.locate(t) || view.base.locate(t);
        return view.view.locate(t);
      },
    };
  }

  function shopPage(view, m) {
    // One render owns the elements and callbacks shared by its named steps.
    const page = { view, m };
    page.item = (...args) => item(page, ...args);
    page.skeleton = (...args) => skeleton(page, ...args);
    page.rebuild = (...args) => rebuild(page, ...args);
    createShopFiltersAndGrid(page);
    initShopResults(page);
    return {
    paint(mm) {
      const key = JSON.stringify([mm.loading > 0, mm.loading > 0 ? 0 : page.view.fam.coVisible(mm, page.view.spec)]);
      if (key !== page.built) {
        page.built = key;
        page.rebuild(mm);
      }
      page.cats.set(mm.cats);
      if (!page.slider.active || !page.slider.active()) page.slider.set(mm.price.slice());
      page.drawRange(mm.price);
      const inCart = new Set(mm.cart.map((l) => l.id));
      for (const [id, it] of Object.entries(page.items)) {
        if (it.p.stock) it.q.set(page.view.fam.coQty(mm, +id), page.view.fam.coMaxQty(it.p));
        it.add.classList.toggle('incart', inCart.has(+id));
      }
      const added = mm.notice && mm.notice.added !== undefined ? page.view.P(mm.notice.added) : null;
      page.note.textContent = added ? ` Added ${added.name} to your cart` : '';
    },
    locate(t) {
      if (t.cat !== undefined) return page.view.scope.where(page.view.L.cats[t.cat], `category ${t.cat}`);
      if (t.price === 'thumb') return page.slider.locateThumb(t.j);
      if (t.price !== undefined) return page.slider.locate(t.price, t.j);
      if (t.thumb) return page.lbx.locateThumb();
      if (t.scroll !== undefined) return page.lbx.locateThumbFor(t.scroll);
      if (t.pane) return page.view.scope.where(page.lbx.list, 'product list');
      const it = page.items[t.open !== undefined ? t.open : t.cardQty !== undefined ? t.cardQty : t.add];
      if (!it) return null;
      if (t.open !== undefined) return page.view.scope.where(it.name, 'product link');
      if (t.cardQty !== undefined) return page.view.scope.where(t.dir === 'up' ? it.q.up : it.q.dn, 'quantity');
      return page.view.scope.where(it.add, 'Add to cart');
    },
  };
  }

  function productPage(view, m) {
    const p = view.P(m.view);
    const back = view.scope.btn(view.util, 'as-btn co-back', view.pageEl, undefined, 'back');
    back.innerHTML = `${view.scope.ICON.left}<span>Back to results</span>`;
    back.addEventListener('click', () => view.step({ click: { back: 'shop' } }));
    const det = view.util.el('div', 'co-detail', view.pageEl);
    const hero = view.util.el('div', 'co-hero', det);
    hero.innerHTML = view.scope.productArt(p.name, p.hue);
    hero.style.setProperty('--h', p.hue);
    const room = Math.min(300, Math.max(150, (view.flow ? 360 : view.pageEl.getBoundingClientRect().height - 100)));
    Object.assign(hero.style, { width: Math.min(room, Math.round(view.pageEl.getBoundingClientRect().width * 0.32)) + 'px', height: room + 'px' });
    const info = view.util.el('div', 'co-dinfo', det);
    view.util.el('div', 'co-crumb', info, `${view.spec.store} › ${view.spec.cats[p.cat]} · ${p.sku}`);
    view.util.el('div', 'co-h1', info, p.name);
    const meta = view.util.el('div', 'co-meta', info);
    view.util.el('span', 'as-inline-icon', meta).innerHTML = view.scope.ICON.star;
      view.util.el('span', 'co-stars', meta, view.stars(p));
    meta.append(` · ${p.reviews} ratings`);
    const pr = view.util.el('div', 'co-dprice', info, view.fmt(p.price));
    if (p.was) view.util.el('span', 'co-was', pr, view.fmt(p.was));
    const [cls, txt] = view.stockText(p);
    view.util.el('div', cls || 'co-muted', info, txt);
    const groups = view.scope.env.content.SENTENCE_GROUPS || {};
    const bank = (groups.product && groups.product.length ? groups.product : view.scope.env.content.SENTENCES) || [];
    if (bank.length) {
      const h = view.fam.hash32(`${view.spec.salt}|${p.id}`);
      view.util.el('div', 'co-desc', info, [0, 1].map((k) => bank[(h + k * 104729) % bank.length]).join(' '));
    }
    const buy = view.util.el('div', 'co-buy', info);
    const q = view.stepper(buy, view.fam.coQty(m, p.id), view.fam.coMaxQty(p), () => view.step({ click: { detailQty: 'down' } }),
      () => view.step({ click: { detailQty: 'up' } }), 'qty');
    const add = view.scope.btn(view.util, 'as-btn primary co-big', buy, p.stock ? 'Add to cart' : 'Currently unavailable', 'add');
    add.disabled = !p.stock;
    if (!p.stock) q.dn.disabled = q.up.disabled = true;
    add.addEventListener('click', () => { if (p.stock) view.step({ click: { addDetail: true } }); });
    const ok = view.util.el('div', 'co-ok', info);
    return {
      paint(mm) {
        if (p.stock) q.set(view.fam.coQty(mm, p.id), view.fam.coMaxQty(p));
        const line = mm.cart.find((l) => l.id === p.id);
        ok.textContent = mm.notice && mm.notice.added === p.id ? ` Added to cart (${line ? line.qty : 0} in cart).` : line ? `${line.qty} in your cart` : '';
      },
      locate(t) {
        if (t.back) return view.scope.where(back, 'Back to results');
        if (t.detailQty) return view.scope.where(t.detailQty === 'up' ? q.up : q.dn, 'quantity');
        if (t.addDetail) return view.scope.where(add, 'Add to cart');
        return null;
      },
    };
  }

  function cartPage(view, m) {
    if (m.notice && m.notice.cancelled) view.util.el('div', 'co-alert', view.pageEl, `Order ${m.notice.cancelled} was cancelled. Its items are back in your cart.`);
    view.util.el('div', 'co-h', view.pageEl, 'Your cart');
    const two = view.util.el('div', 'co-two', view.pageEl);
    const col = view.util.el('div', 'co-col', two);
    const lines = view.util.el('div', 'co-lines', col);
    lines.dataset.role = 'cart';
    const side = view.util.el('aside', 'co-side', two);
    const sums = view.util.el('div', '', side);
    view.util.el('div', 'co-lab', side, 'Promo code');
    const promo = view.util.el('div', 'co-promo', side);
    const cin = view.util.el('input', 'co-input', promo);
    Object.assign(cin, { type: 'text', autocomplete: 'off', spellcheck: false, placeholder: 'Enter code' });
    cin.dataset.role = 'coupon-field';
    const ctf = view.scope.env.ui.textField(cin, { value: m.couponText, label: 'coupon', onInput: (v) => view.commit({ ...view.ctx.model, couponText: v, couponMsg: '' }) });
    view.scope.trackFocus(view.ctx, cin, 'coupon');
    const apply = view.scope.btn(view.util, 'as-btn', promo, 'Apply', 'coupon-apply');
    apply.addEventListener('click', () => view.step({ click: { button: 'coupon' } }));
    cin.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        view.step({ key: 'Enter', on: 'coupon' });
      }
    });
    const msg = view.util.el('div', 'co-msg', side);
    const go = view.scope.btn(view.util, 'as-btn primary co-big', side, view.rng.pick(['Checkout', 'Proceed to checkout', 'Check out']), 'checkout');
    go.addEventListener('click', () => view.step({ click: { checkout: true } }));
    const cont = view.scope.btn(view.util, 'as-link', side, 'Continue shopping', 'continue');
    cont.addEventListener('click', () => view.step({ click: { nav: 'shop' } }));
    const lineEls = {};
    let removeCoupon = null;
    let built = null;
    return {
      paint(mm) {
        const key = JSON.stringify([mm.cart, mm.coupon, mm.couponMsg]);
        if (key === built) {
          if (cin.value !== mm.couponText) ctf.set(mm.couponText);
          return;
        }
        built = key;
        lines.replaceChildren();
        for (const k of Object.keys(lineEls)) delete lineEls[k];
        if (!mm.cart.length) view.util.el('div', 'co-empty', lines, 'Your cart is empty.');
        for (const l of mm.cart) {
          const p = view.P(l.id);
          const r = view.util.el('div', 'co-line', lines);
          r.dataset.role = 'cart-line';
          view.thumb(r, p);
          const info = view.util.el('div', 'co-info', r);
          view.util.el('div', 'co-name', info, p.name).title = p.name;
          view.util.el('div', 'co-meta', info, `${view.fmt(p.price)} each`);
          const s = view.stepper(r, l.qty, p.stock, () => view.step({ click: { line: l.id, op: 'dec' } }), () => view.step({ click: { line: l.id, op: 'inc' } }), 'line');
          s.dn.disabled = false;
          view.util.el('div', 'co-lt', r, view.fmt(p.price * l.qty));
          const rm = view.scope.btn(view.util, 'as-link danger', r, 'Remove', 'remove');
          rm.addEventListener('click', () => view.step({ click: { line: l.id, op: 'remove' } }));
          lineEls[l.id] = { inc: s.up, dec: s.dn, remove: rm };
        }
        const t = view.fam.coTotals(view.spec, mm.cart, mm.coupon);
        sums.replaceChildren();
        const row = (cls, a, b) => {
          const d = view.util.el('div', 'co-sum' + cls, sums);
          view.util.el('span', '', d, a);
          view.util.el('span', '', d, b);
        };
        row('', 'Subtotal', view.fmt(t.sub));
        if (t.disc) row(' disc', `Discount (${mm.coupon})`, `−${view.fmt(t.disc)}`);
        row('', 'Shipping', 'At checkout');
        row(' total', 'Total', view.fmt(t.total));
        if (cin.value !== mm.couponText) ctf.set(mm.couponText);
        msg.replaceChildren();
        msg.className = 'co-msg';
        removeCoupon = null;
        if (mm.coupon) {
          msg.classList.add('good');
          msg.append(` ${mm.coupon} applied (${view.spec.coupon.pct}% off). `);
          removeCoupon = view.scope.btn(view.util, 'as-link', msg, 'Remove', 'coupon-remove');
          removeCoupon.addEventListener('click', () => view.step({ click: { couponRemove: true } }));
        } else if (mm.couponMsg === 'invalid') {
          msg.classList.add('bad');
          msg.textContent = 'That code is not valid or has expired.';
        } else if (mm.couponMsg === 'empty') {
          msg.classList.add('bad');
          msg.textContent = 'Enter a code first.';
        }
        go.disabled = !mm.cart.length;
      },
      locate(t) {
        if (t.line !== undefined) {
          const els = lineEls[t.line];
          if (!els) throw new Error(`use-shop/store: cart line ${t.line} not shown`);
          const b = els[t.op];
          const lr = lines.getBoundingClientRect();
          const r = b.getBoundingClientRect();
          if (r.top < lr.top || r.bottom > lr.bottom) lines.scrollTop += r.top < lr.top ? r.top - lr.top - 4 : r.bottom - lr.bottom + 4;
          return view.scope.where(b, `cart ${t.op}`);
        }
        if (t.field === 'coupon') return ctf.locate();
        if (t.button === 'coupon') return view.scope.where(apply, 'Apply');
        if (t.couponRemove) return view.scope.where(removeCoupon, 'Remove coupon');
        if (t.checkout) return view.scope.where(go, 'Checkout');
        return null;
      },
    };
  }

  function checkoutPage(view, m) {
    const back = view.scope.btn(view.util, 'as-btn co-back', view.pageEl, undefined, 'back');
    back.innerHTML = `${view.scope.ICON.left}<span>Back to cart</span>`;
    back.addEventListener('click', () => view.step({ click: { back: 'cart' } }));
    const two = view.util.el('div', 'co-two', view.pageEl);
    two.style.marginTop = '8px';
    const col = view.util.el('div', 'co-col', two);
    view.util.el('div', 'co-sec', col, 'Shipping address');
    const tiles = view.util.el('div', 'co-tiles', col);
    tiles.style.setProperty('--n', view.spec.saved.length + 1);
    const tileEls = view.spec.saved.map((a, i) => {
      const t = view.util.el('div', 'co-tile', tiles);
      t.dataset.role = 'address';
      view.util.el('b', '', t, a.name);
      view.util.el('div', '', t, a.line1 + (a.line2 ? `, ${a.line2}` : ''));
      view.util.el('div', '', t, view.fam.cityLine(a));
      view.util.el('div', '', t, a.country);
      return [i, t];
    });
    const nt = view.util.el('div', 'co-tile new', tiles);
    nt.dataset.role = 'address-new';
    view.util.el('b', '', nt, '+ New address');
    view.util.el('div', '', nt, 'Ship somewhere else');
    tileEls.push(['new', nt]);
    const addrs = view.scope.env.ui.choices(tileEls, { value: m.pick, label: 'address', onChange: (v) => view.step({ click: { addr: v } }) });
    const form = view.util.el('div', 'co-form', col);
    const LABELS = { name: 'Full name', line1: 'Street address', city: 'City', postcode: view.rng.pick(['Postal code', 'Postcode', 'ZIP / Postal code']) };
    const inputs = {};
    for (const f of view.fam.ADDR_FIELDS) {
      const fl = view.util.el('label', 'co-fl', form);
      view.util.el('span', '', fl, LABELS[f]);
      const inp = view.util.el('input', 'co-input', fl);
      Object.assign(inp, { type: 'text', autocomplete: 'off', spellcheck: false });
      inp.dataset.role = `${f}-field`;
      const err = view.util.el('i', '', fl, 'Required');
      const tf = view.scope.env.ui.textField(inp, { value: m.form[f], label: f, onInput: (v) => view.commit({ ...view.ctx.model, form: { ...view.ctx.model.form, [f]: v },
        invalid: view.ctx.model.invalid.filter((x) => x !== f) }) });
      inputs[f] = { inp, tf, err };
    }
    view.util.el('div', 'co-sec co-delivery-title', col, 'Delivery').style.marginTop = '14px';
    const ships = view.util.el('div', 'co-ships', col);
    const shipEls = view.spec.methods.map((s) => {
      const lab = view.util.el('label', 'co-radio', ships);
      lab.dataset.role = 'delivery';
      const inp = view.util.el('input', '', lab);
      Object.assign(inp, { type: 'radio', name: 'co-ship' });
      const sp = view.util.el('span', '', lab);
      view.util.el('b', '', sp, s.name.replace(/\s*\(.*\)$/, ''));
      sp.append(`${s.price ? view.fmt(s.price) : 'Free'} · ${s.days[0] === s.days[1] ? s.days[0] || 'today' : `${s.days[0]}-${s.days[1]}`} ${s.days[1] ? 'days' : ''}`);
      return [s.id, inp];
    });
    const shipLabels = Object.fromEntries(shipEls.map(([id, inp]) => [id, inp.parentElement]));
    const ship = view.scope.env.ui.choices(shipEls, { value: m.ship, label: 'delivery', onChange: (v) => view.step({ click: { ship: v } }) });
    const side = view.util.el('aside', 'co-side', two);
    view.util.el('div', 'co-sec', side, 'Order summary').style.margin = '0';
    const minis = view.util.el('div', '', side);
    const sums = view.util.el('div', '', side);
    const place = view.scope.btn(view.util, 'as-btn primary co-big', side, 'Place order', 'place-order');
    place.addEventListener('click', () => view.step({ click: { place: true } }));
    const blocked = view.util.el('div', 'co-msg bad', side);
    return {
      paint(mm) {
        addrs.set(mm.pick);
        form.hidden = mm.pick !== 'new';
        for (const f of view.fam.ADDR_FIELDS) {
          const x = inputs[f];
          if (x.inp.value !== mm.form[f]) x.tf.set(mm.form[f]);
          const bad = mm.invalid.includes(f);
          x.inp.classList.toggle('bad', bad);
          x.err.hidden = !bad;
        }
        ship.set(mm.ship);
        minis.replaceChildren();
        for (const l of mm.cart) {
          const d = view.util.el('div', 'co-mini', minis);
          view.util.el('span', '', d, `${l.qty} × ${view.P(l.id).name}`);
          view.util.el('span', '', d, view.fmt(view.P(l.id).price * l.qty));
        }
        const t = view.fam.coTotals(view.spec, mm.cart, mm.coupon, mm.ship);
        sums.replaceChildren();
        const row = (cls, a, b) => {
          const d = view.util.el('div', 'co-sum' + cls, sums);
          view.util.el('span', '', d, a);
          view.util.el('span', '', d, b);
        };
        row('', 'Subtotal', view.fmt(t.sub));
        if (t.disc) row(' disc', `Discount (${mm.coupon})`, `−${view.fmt(t.disc)}`);
        row('', 'Shipping', t.shipping ? view.fmt(t.shipping) : 'Free');
        row(' total', 'Total', view.fmt(t.total));
        const live = view.fam.coLive(mm);
        place.disabled = !mm.cart.length || !!live;
        place.textContent = `Place order · ${view.fmt(t.total)}`;
        blocked.textContent = live ? `Order ${live.no} is still open. Cancel it before placing a new one.` : '';
      },
      locate(t) {
        if (t.back) return view.scope.where(back, 'Back to cart');
        if (t.addr !== undefined) return addrs.locate(t.addr);
        if (t.field) return inputs[t.field].tf.locate();
        if (t.ship) return view.scope.where(shipLabels[t.ship], 'delivery option');
        if (t.place) return view.scope.where(place, 'Place order');
        return null;
      },
    };
  }

  function orderPage(view, m) {
    const o = m.orders[m.orders.length - 1];
    if (!o) {
      view.util.el('div', 'co-h', view.pageEl, 'Your orders');
      view.util.el('div', 'co-muted', view.pageEl, "You haven't placed any orders yet.");
      return { paint() {}, locate() { return null; } };
    }
    const conf = view.util.el('div', 'co-conf', view.pageEl);
    const ic = view.util.el('div', 'co-check-big' + (o.cancelled ? ' off' : ''), conf);
    ic.innerHTML = o.cancelled ? view.scope.ICON.close : view.scope.ICON.check;
    view.util.el('div', 'co-h', conf, o.cancelled ? 'This order was cancelled' : view.rng.pick(['Thank you! Your order is confirmed.', 'Order placed. Thanks for shopping with us!'])).style.margin = '0';
    const nl = view.util.el('div', 'co-muted', view.pageEl);
    nl.style.marginTop = '10px';
    nl.append('Order number ');
    view.util.el('span', 'co-no', nl, o.no).dataset.role = 'order-number';
    const facts = view.util.el('dl', 'co-facts', view.pageEl);
    const t = view.fam.coTotals(view.spec, o.lines, o.coupon, o.ship);
    const addr = typeof o.addr === 'object' ? o.addr : view.spec.saved[o.addr];
    const method = view.spec.methods.find((x) => x.id === o.ship);
    for (const [a, b] of [['Items', o.lines.map((l) => `${l.qty} × ${view.P(l.id).name}`).join(', ')], ['Ship to', view.fam.addrText(addr)],
      ['Delivery', method ? method.name : '—'], ['Status', o.cancelled ? 'Cancelled' : 'Processing'], ['Total', view.fmt(t.total)]]) {
      view.util.el('dt', '', facts, a);
      view.util.el('dd', '', facts, b).title = b;
    }
    const acts = view.util.el('div', 'co-acts', view.pageEl);
    const cont = view.scope.btn(view.util, 'as-btn', acts, 'Continue shopping', 'continue');
    cont.addEventListener('click', () => view.step({ click: { nav: 'shop' } }));
    let cancel = null;
    if (!o.cancelled) {
      cancel = view.scope.btn(view.util, 'as-link danger', acts, 'Cancel order', 'cancel-order');
      cancel.addEventListener('click', () => view.step({ click: { cancelOrder: true } }));
    }
    return {
      paint() {},
      locate(t2) {
        if (t2.cancelOrder) return view.scope.where(cancel, 'Cancel order');
        return null;
      },
    };
  }

  function cancelPage(view, m) {
    const o = view.fam.coLive(m) || m.orders[m.orders.length - 1];
    view.util.el('div', 'co-h', view.pageEl, `Cancel order ${o ? o.no : ''}?`);
    view.util.el('div', 'co-muted', view.pageEl, 'Tell us why you want to cancel. Items go back to your cart.').style.marginBottom = '10px';
    const box = view.util.el('div', 'co-reasons', view.pageEl);
    const els = view.fam.REASONS.map(([k, label]) => {
      const lab = view.util.el('label', 'co-radio', box);
      lab.dataset.role = 'reason';
      const inp = view.util.el('input', '', lab);
      Object.assign(inp, { type: 'radio', name: 'co-reason' });
      view.util.el('span', '', lab, label);
      return [k, inp];
    });
    const labs = Object.fromEntries(els.map(([k, inp]) => [k, inp.parentElement]));
    const reasons = view.scope.env.ui.choices(els, { value: m.reason, label: 'reason', onChange: (v) => view.step({ click: { reason: v } }) });
    const acts = view.util.el('div', 'co-acts', view.pageEl);
    acts.style.marginTop = '14px';
    const confirm = view.scope.btn(view.util, 'as-btn primary', acts, 'Cancel order', 'confirm-cancel');
    confirm.style.background = '#e03131';
    confirm.style.borderColor = '#e03131';
    confirm.addEventListener('click', () => view.step({ click: { confirmCancel: true } }));
    const keep = view.scope.btn(view.util, 'as-btn', acts, 'Keep my order', 'keep');
    keep.addEventListener('click', () => view.step({ click: { keep: true } }));
    return {
      paint(mm) {
        reasons.set(mm.reason);
        confirm.disabled = !mm.reason;
      },
      locate(t) {
        if (t.reason) return view.scope.where(labs[t.reason], 'reason');
        if (t.confirmCancel) return view.scope.where(confirm, 'Cancel order');
        if (t.keep) return view.scope.where(keep, 'Keep order');
        return null;
      },
    };
  }

  function trackPage(view, m) {
    view.util.el('div', 'co-h', view.pageEl, 'Track your order');
    view.util.el('div', 'co-muted', view.pageEl, 'Enter the order number from your confirmation to see its status.');
    const row = view.util.el('div', 'co-trackrow', view.pageEl);
    const inp = view.util.el('input', 'co-input', row);
    Object.assign(inp, { type: 'text', autocomplete: 'off', spellcheck: false, placeholder: 'Order number' });
    inp.dataset.role = 'track-field';
    const tf = view.scope.env.ui.textField(inp, { value: m.trackText, label: 'track', onInput: (v) => view.commit({ ...view.ctx.model, trackText: v }) });
    view.scope.trackFocus(view.ctx, inp, 'track');
    const go = view.scope.btn(view.util, 'as-btn primary', row, 'Track', 'track-button');
    go.addEventListener('click', () => view.step({ click: { button: 'track' } }));
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        view.step({ key: 'Enter', on: 'track' });
      }
    });
    const out = view.util.el('div', '', view.pageEl);
    let shown;
    return {
      paint(mm) {
        if (inp.value !== mm.trackText) tf.set(mm.trackText);
        if (shown === mm.tracked) return;
        shown = mm.tracked;
        out.replaceChildren();
        if (mm.tracked === null) return;
        const o = mm.orders.find((x) => x.no === mm.tracked);
        const card = view.util.el('div', 'co-result' + (o ? '' : ' bad'), out);
        if (!o) {
          card.textContent = 'We could not find an order with that number. Check the number and try again.';
          return;
        }
        view.util.el('b', '', card, `Order ${o.no}`);
        view.util.el('div', '', card, o.cancelled ? 'Status: Cancelled' : `Status: Processing · ${o.lines.reduce((s, l) => s + l.qty, 0)} item(s)`);
        const method = view.spec.methods.find((x) => x.id === o.ship);
        if (!o.cancelled && method) view.util.el('div', '', card, `${method.name}: ships within ${method.days[1] || 1} business day(s).`);
      },
      locate(t) {
        if (t.field === 'track') return tf.locate();
        if (t.button === 'track') return view.scope.where(go, 'Track');
        return null;
      },
    };
  }

  function progressBar(view, page) {
    const at = { cart: 0, checkout: 1, order: 3 }[page];
    const bar = view.util.el('ol', 'mk-steps', view.pageEl);
    bar.dataset.role = 'stepper';
    ['Cart', 'Shipping', 'Payment', 'Review'].forEach((label, i) => {
      const li = view.util.el('li', i < at || (page === 'order' && i === at) ? 'done' : i === at ? 'now' : '', bar);
      const dot = view.util.el('span', 'dot', li);
      if (li.className === 'done') dot.innerHTML = view.scope.ICON.check;
      else dot.textContent = String(i + 1);
      view.util.el('span', 'lb', li, label);
    });
  }

  function buildSheet(view, m) {
    view.base = view.shopPage(m);
    view.sheetWrap = view.util.el('div', 'sh-wrap', view.body);
    const scrim = view.util.el('div', 'sh-scrim', view.sheetWrap);
    scrim.addEventListener('click', () => view.step({ click: { nav: 'shop' } }));
    const sh = view.util.el('div', 'sh-sheet', view.sheetWrap);
    sh.dataset.role = 'sheet';
    view.util.el('div', 'sh-grab', sh);
    const x = view.scope.btn(view.util, 'sh-x', sh, '×', 'close');
    x.addEventListener('click', () => view.step({ click: { nav: 'shop' } }));
    view.pageEl = view.util.el('div', 'sh-body', sh);
    const v = view.cartPage(m);
    view.pageEl = view.pageHost;
    return v;
  }

  function paint(view, m) {
    view.lastPainted = m;
    const bodyH = view.body.getBoundingClientRect().height;
    view.pageEl.classList.toggle('co-compact', m.page === 'checkout' && !view.flow && bodyH < 400);
    view.pageEl.classList.toggle('co-tight', m.page === 'checkout' && !view.flow && bodyH < 340);
    if (view.sinput.value !== m.text) view.stf.set(m.text);
    const n = m.cart.reduce((s, l) => s + l.qty, 0);
    view.badge.textContent = String(n);
    view.badge.hidden = !n;
    for (const [k, el] of Object.entries(view.navEls)) el.classList.toggle('on', k === m.page || (k === 'order' && m.page === 'cancel'));
    const sheet = view.sheetMode && m.page === 'cart';
    const pageKey = sheet ? 'sheet' : m.page === 'product' ? `product:${m.view}` : m.page === 'order' ? `order:${m.orders.length}:${m.orders.map((o) => o.cancelled).join()}` : m.page;
    if (pageKey !== view.curPage) {
      view.curPage = pageKey;
      view.pageHost.replaceChildren();
      if (view.sheetWrap) view.sheetWrap.remove();
      view.sheetWrap = view.base = null;
      for (const k of Object.keys(view.L)) delete view.L[k];
      if (sheet) view.view = view.buildSheet(m);
      else {
        if (view.market && ['cart', 'checkout', 'order'].includes(m.page)) view.progressBar(m.page);
        view.view = view.PAGES[m.page](m);
      }
      if (view.flow && window.scrollY) window.scrollTo(0, 0);
    }
    if (view.base) view.base.paint(m);
    view.view.paint(m);
  }
  function createCheckoutShell(view) {
    ({ util: view.util, spec: view.spec, rng: view.rng } = view.ctx);
    view.fam = view.scope.F();
    view.fmt = view.scope.money(view.spec);
    view.market = view.mode === 'market';
    view.sheetMode = view.mode === 'sheet';
    view.flow = view.spec.layout === 'page';
    view.commit = (m) => { view.ctx.update(m); view.paint(view.ctx.model); };
    view.step = (s) => { view.scope.irreversible(view.ctx, s.click); view.commit(view.fam.apply(view.ctx.model, view.spec, s)); };
    view.P = (id) => view.spec.products[id];
    view.L = {};
    view.top = view.frameEls.top;
    view.sbox = view.util.el('div', 'co-search', view.top);
    view.sbox.innerHTML = view.scope.ICON.search;
    view.sinput = view.util.el('input', '', view.sbox);
    Object.assign(view.sinput, { type: 'text', autocomplete: 'off', spellcheck: false,
      placeholder: view.rng.pick(['Search products', `Search ${view.spec.store}`, 'What are you looking for?']) });
    view.sinput.dataset.role = 'search-field';
    view.sgo = view.scope.btn(view.util, 'as-btn primary', view.sbox, view.rng.pick(['Search', 'Go', 'Find']), 'search-button');
    view.stf = view.scope.env.ui.textField(view.sinput, { value: view.ctx.model.text, label: 'search', onInput: (v) => view.commit({ ...view.ctx.model, text: v }) });
    view.scope.trackFocus(view.ctx, view.sinput, 'search');
    view.sgo.addEventListener('click', () => view.step({ click: { button: 'search' } }));
    view.sinput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        view.step({ key: 'Enter', on: 'search' });
      }
    });
    view.navs = view.util.el('div', view.sheetMode ? 'sh-tabs' : 'co-navs', view.sheetMode ? view.frameEls.app : view.top);
    view.navEls = {};
    for (const [k, label] of [['shop', 'Shop'], ['order', view.rng.pick(['Orders', 'My orders'])], ['track', view.rng.pick(['Track order', 'Order status'])]]) {
      view.navEls[k] = view.scope.btn(view.util, view.sheetMode ? 'sh-tab' : 'co-nb', view.navs, label, 'nav');
      view.navEls[k].addEventListener('click', () => view.step({ click: { nav: k } }));
    }
    view.cartBtn = view.scope.btn(view.util, view.sheetMode ? 'sh-tab' : 'co-cart', view.sheetMode ? view.navs : view.top, undefined, 'cart');
    view.cartBtn.innerHTML = view.scope.ICON.cart;
    view.util.el('span', '', view.cartBtn, 'Cart');
    view.badge = view.util.el('span', 'co-badge', view.cartBtn);
    view.cartBtn.addEventListener('click', () => view.step({ click: { nav: 'cart' } }));
    view.navEls.cart = view.cartBtn;
    view.pageHost = view.util.el('div', 'co-page', view.body);
    view.pageEl = view.pageHost;
    if (view.flow) view.pageEl.style.minHeight = Math.max(0, view.ctx.size.height - 80) + 'px';
    view.curPage = null;
    view.view = null;
    view.lastPainted = null;
    view.stars = (p) => `${(p.rating / 10).toFixed(1)}/5`;
    view.stockText = (p) => (!p.stock ? ['co-out', 'Sold out'] : p.stock <= 5 ? ['co-low', `Only ${p.stock} left`] : ['', 'In stock']);
    view.thumb = (parent, p, cls = 'co-thumb') => {
      const t = view.util.el('div', cls, parent);
      t.innerHTML = view.scope.productArt(p.name, p.hue);
      t.style.setProperty('--h', p.hue);
      return t;
    };
    view.stepper = (parent, value, max, onDown, onUp, roleBase) => {
      const s = view.util.el('div', 'co-step', parent);
      const dn = view.scope.btn(view.util, 'co-sb', s, '−', `${roleBase}-down`);
      const q = view.util.el('span', 'co-q', s, String(value));
      const up = view.scope.btn(view.util, 'co-sb', s, '+', `${roleBase}-up`);
      dn.addEventListener('click', () => { if (!dn.disabled) onDown(); });
      up.addEventListener('click', () => { if (!up.disabled) onUp(); });
      const set = (v, mx) => {
        q.textContent = String(v);
        dn.disabled = v <= 1;
        up.disabled = v >= mx;
      };
      set(value, max);
      return { dn, up, q, set };
    };
    view.PAGES = { shop: view.shopPage, product: view.productPage, cart: view.cartPage, checkout: view.checkoutPage, order: view.orderPage, cancel: view.cancelPage, track: view.trackPage };
    view.sheetWrap = null;
    view.base = null;
    view.paint(view.ctx.model);
  }

  function item(page, id, card) {
const p = page.view.P(id);
const r = page.view.util.el('div', card ? 'co-card' : 'co-row');
r.dataset.role = 'product';
page.view.thumb(r, p);
const info = page.view.util.el('div', 'co-info', r);
const name = page.view.util.el('a', 'co-name', info, p.name);
name.title = p.name;
name.dataset.role = 'product-link';
name.addEventListener('click', () => page.view.step({ click: { open: id } }));
const meta = page.view.util.el('div', 'co-meta', info);
page.view.util.el('span', 'as-inline-icon', meta).innerHTML = page.view.scope.ICON.star;
page.view.util.el('span', 'co-stars', meta, page.view.stars(p));
meta.append(` (${p.reviews}) · `);
const [cls, txt] = page.view.stockText(p);
page.view.util.el('span', cls, meta, txt);
const foot = card ? page.view.util.el('div', 'co-cardfoot', r) : r;
const pr = page.view.util.el('div', 'co-price', card ? info : r, page.view.fmt(p.price));
if (p.was) page.view.util.el('span', 'co-was', pr, page.view.fmt(p.was));
const q = page.view.stepper(foot, page.view.fam.coQty(page.view.ctx.model, id), page.view.fam.coMaxQty(p),
  () => page.view.step({ click: { cardQty: id, dir: 'down' } }), () => page.view.step({ click: { cardQty: id, dir: 'up' } }), 'qty');
const add = page.view.scope.btn(page.view.util, 'as-btn primary co-add', foot, p.stock ? page.addLabel : 'Sold out', 'add');
add.disabled = !p.stock;
if (!p.stock) q.dn.disabled = q.up.disabled = true;
add.addEventListener('click', () => { if (p.stock) page.view.step({ click: { add: id } }); });
page.items[id] = { r, name, q, add, p };
return r;
  }

  function skeleton(page, n, card) {
const host = card ? page.view.util.el('div', 'co-grid', page.area) : page.view.util.el('div', 'co-load', page.pane);
if (card) host.style.setProperty('--cols', page.cols);
for (let i = 0; i < n; i++) {
  const r = page.view.util.el('div', card ? 'co-card' : 'co-skrow', host);
  if (!card) r.style.height = page.pitch - page.gap + 'px';
  page.view.util.el('div', 'as-skel co-thumb', r).style.background = '';
  const s = page.view.util.el('div', 'as-skel', r);
  Object.assign(s.style, { height: '14px', width: card ? '80%' : '46%' });
  if (card) page.view.util.el('div', 'as-skel', r).style.height = '30px';
}
  }

  function rebuild(page, mm) {
for (const k of Object.keys(page.items)) delete page.items[k];
page.lbx = null;
const loading = mm.loading > 0;
const vis = page.view.fam.coVisible(mm, page.view.spec);
page.count.innerHTML = '';
if (loading) page.count.textContent = 'Loading results…';
else {
  page.view.util.el('b', '', page.count, `${vis.length} ${vis.length === 1 ? 'product' : 'products'}`);
  if (mm.query) page.count.append(` for “${mm.query}”`);
}
if (page.view.flow) {
  page.area.replaceChildren();
  if (loading) return page.skeleton(Math.min(8, page.cols * 2), true);
  if (!vis.length) {
    page.view.util.el('div', 'co-empty', page.area, 'No products match your search and filters.');
    return;
  }
  const grid = page.view.util.el('div', 'co-grid', page.area);
  grid.style.setProperty('--cols', page.cols);
  // Market: an inert sponsored tile after the second product and then after every sixth one.
  vis.forEach((id, k) => {
    grid.append(page.item(id, true));
    if (page.view.market && (k === 1 || (k > 1 && (k - 1) % 6 === 0))) page.view.scope.adCard(page.view.util, grid, page.view.scope.MARKET_ADS[(page.view.spec.salt + 2 + k) % page.view.scope.MARKET_ADS.length], 'co-card mk-tile');
  });
  return;
}
page.pane.replaceChildren();
if (loading) return page.skeleton(page.view.spec.rows, false);
if (!vis.length) {
  const e = page.view.util.el('div', 'co-empty', page.pane);
  Object.assign(e.style, { margin: '0', padding: '40px 20px', width: '100%', background: 'var(--panel)' });
  e.textContent = 'No products match your search and filters.';
  return;
}
page.lbx = page.view.scope.listPane(page.view.ctx, page.pane, { keys: vis, build: (id) => page.item(id, false), rows: page.view.spec.rows, pitch: page.pitch, gap: page.gap, scroll: mm.scroll, label: 'products' });
if (vis.length < page.view.spec.rows - 1) page.view.scope.recommendations(page.view.ctx, page.lbx.list, 'Inspired by your browsing');
  }
  function createShopFiltersAndGrid(page) {
    if (page.view.spec.coupon && page.view.spec.coupon.where === 'banner') {
    const b = page.view.util.el('div', 'co-banner', page.view.pageEl);
    b.dataset.role = 'promo';
    b.append(page.view.rng.pick(['Limited time:', 'This week only:', 'Members save more:']) + ' use code ');
    page.view.util.el('span', 'co-code', b, page.view.spec.coupon.code);
    b.append(` at checkout for ${page.view.spec.coupon.pct}% off your order.`);
  }
    if (page.view.market) page.view.scope.adLeader(page.view.util, page.view.pageEl, page.view.spec.salt);
    page.shop = page.view.util.el('div', 'co-shop', page.view.pageEl);
    page.filters = page.view.util.el('aside', 'co-filters', page.shop);
    page.main = page.view.util.el('div', 'co-main', page.shop);
    page.services = page.view.util.el('div', 'co-service-info', page.filters);
    page.view.scope.iconLabel(page.view.util, page.services, 'shield', 'Sold by verified store partners');
    page.view.scope.iconLabel(page.view.util, page.services, 'truck', 'Tracked delivery on every order');
    page.view.scope.iconLabel(page.view.util, page.services, 'bag2', 'Returns within 30 days');
    page.view.util.el('div', 'co-fh', page.filters, 'Category');
    page.boxes = [];
    page.view.spec.cats.forEach((label, ci) => {
    const lab = page.view.util.el('label', 'co-check', page.filters);
    lab.dataset.role = 'category';
    const inp = page.view.util.el('input', '', lab);
    inp.type = 'checkbox';
    page.view.util.el('span', '', lab, label);
    page.view.util.el('em', '', lab, String(page.view.spec.products.filter((p) => p.cat === ci).length));
    page.boxes.push([ci, inp]);
  });
    page.view.L.cats = Object.fromEntries(page.boxes.map(([ci, inp]) => [ci, inp.parentElement]));
    page.cats = page.view.scope.env.ui.choices(page.boxes, { multi: true, values: page.m.cats, label: 'category',
    onChange: (vals, v) => page.view.step({ click: { cat: v } }) });
    page.view.util.el('div', 'co-fh', page.filters, 'Price');
    page.range = page.view.util.el('div', 'co-range', page.filters);
    page.range.dataset.role = 'price-range';
    page.view.util.el('div', 'co-rail', page.range);
    page.fill = page.view.util.el('div', 'co-fill', page.range);
    page.knobs = [0, 1].map((j) => {
    const k = page.view.util.el('div', 'co-knob', page.range);
    k.dataset.role = j ? 'price-max' : 'price-min';
    return k;
  });
    page.prices = page.view.util.el('div', 'co-prices', page.filters);
    page.pLo = page.view.util.el('span', '', page.prices);
    page.pHi = page.view.util.el('span', '', page.prices);
    if (page.view.market) page.view.scope.adCard(page.view.util, page.filters, page.view.scope.MARKET_ADS[(page.view.spec.salt + 1) % page.view.scope.MARKET_ADS.length], 'mk-side');
    page.inset = 9;
    page.frac = (v) => v / page.view.spec.sliderMax;
    page.drawRange = (vals) => {
    const w = page.range.getBoundingClientRect().width - 2 * page.inset;
    Object.assign(page.fill.style, { left: page.inset + page.frac(vals[0]) * w + 'px', width: (page.frac(vals[1]) - page.frac(vals[0])) * w + 'px' });
    page.pLo.textContent = page.view.scope.whole(page.view.spec)(vals[0]);
    page.pHi.textContent = page.view.scope.whole(page.view.spec)(vals[1]) + (vals[1] >= page.view.spec.sliderMax ? '+' : '');
  };
    page.slider = page.view.scope.env.ui.slider(page.range, {
    label: 'price',
    thumbs: page.knobs,
    values: page.m.price.slice(),
    min: 0,
    max: page.view.spec.sliderMax,
    step: page.view.spec.sliderStep,
    inset: page.inset,
    collision: 'block',
    keyboard: true,
    place(t, point, f) {
      const w = page.range.getBoundingClientRect().width - 2 * page.inset;
      t.style.left = page.inset + f * w + 'px';
    },
    onInput(vals) {
      page.drawRange(vals);
      page.view.commit({ ...page.view.ctx.model, price: vals.slice(), scroll: 0 });
    },
    onChange(vals) {
      if (vals[0] !== page.view.ctx.model.price[0] || vals[1] !== page.view.ctx.model.price[1]) page.view.commit({ ...page.view.ctx.model, price: vals.slice(), scroll: 0 });
    },
  });
    page.view.L.slider = page.slider;
    page.rh = page.view.util.el('div', 'co-rh', page.main);
    page.count = page.view.util.el('span', '', page.rh);
    page.note = page.view.util.el('span', 'co-note', page.rh);
    page.area = page.view.util.el('div', '', page.main);
    page.items = {};
    page.pane = null;
    page.pitch = 0;
    page.gap = 1;
    if (!page.view.flow) {
    page.pane = page.view.util.el('div', 'as-pane co-pane', page.main);
    page.area.remove();
    page.pitch = page.view.scope.pitchFor(page.pane, page.view.body, page.view.spec.rows, page.gap, 54, page.view.rng.int(70, 84), 0);
    page.pane.style.height = page.view.spec.rows * page.pitch - page.gap + 2 + 'px';
    page.view.scope.mirrorPitch(page.view.ctx, page.pitch);
  }
    page.cols = Math.max(2, Math.min(4, Math.floor((page.main.getBoundingClientRect().width + 14) / 200)));
  }

  function initShopResults(page) {
    page.built = null;
    page.lbx = null;
    page.addLabel = page.view.rng.pick(['Add to cart', 'Add', 'Add to basket']);
  }
  env.template('use-shop/_base-checkout', () => ({ buildCheckout }));
})();
