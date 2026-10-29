/* use-shop/_base-shopping: reference shopping units; scope reads preserve live design overrides. */
(function () {
  'use strict';
  function shoppingArt(scope, view, parent, large = false, product = view.s.products[0]) {
    const { ctx, util } = view;
    const a = util.el('div', large ? 'ax-art' : 'ax-mini', parent);
    const hues = { Ocean: 209, Clay: 15, Moss: 95, Ink: 224 };
    a.innerHTML = scope.productArt(product.name, large ? (hues[ctx.model.selections.colour] || 209) : 45 + product.id * 62);
    return a;
  }

  function shoppingProduct(scope, view, m) {
    scope.shoppingProductHeading(view, m, view.pane);
    scope.shoppingProductOptions(view, m, view.pane);
    scope.shoppingProductAfter(view, m);
  }

  function shoppingProductOptions(scope, view, m, parent) {
    const { ctx, util, s, button, chips, qty } = view;
    chips(parent, 'Size', s.sizes, m.selections.size, 'swatch:size');
    chips(parent, 'Colour', s.colours, m.selections.colour, 'swatch:colour');
    chips(parent, 'Material', s.materials, m.selections.material, 'swatch:material');
    const complete = ['size', 'colour', 'material'].every((k) => m.selections[k]);
    const available = scope.F().shopAvailable(s, m.selections);
    util.el('div', 'ax-stock' + (complete && !available ? ' bad' : ''), parent,
      !complete ? 'Choose a size, colour and material to check availability.' : available ? 'In stock · ready to dispatch in 1–2 business days' : 'Sold out in this combination. Try a different size, colour or material.');
    const actions = util.el('div', 'ax-actions', parent);
    qty(actions, m.qty, 'qty');
    button(actions, m.picked ? 'Update bag' : 'Add to bag', 'add', 'primary', !available);
    const stock = util.el('details', 'ax-help', parent);
    util.el('summary', '', stock, 'Stock & care details');
    util.el('div', '', stock, 'Currently unavailable: ' + s.unavailable.map((v) => v.split('|').join(' / ')).join('; '));
    util.el('div', '', stock, 'Machine wash cold. Reshape while damp.');
    const guide = scope.serviceDetails(util, parent, 'Size & fit guide', 'Regular fit. Measurements below refer to the garment laid flat. Allow 1–2 cm for natural fabric variation.');
    guide.classList.add('ax-size-chart');
    const chart = util.el('table', '', guide);
    [['Size', 'Chest', 'Length'], ['S', '96 cm', '68 cm'], ['M', '104 cm', '70 cm'], ['L', '112 cm', '72 cm'], ['XL', '120 cm', '74 cm']].forEach((values, i) => {
      const tr = util.el('tr', '', chart); values.forEach((v) => util.el(i ? 'td' : 'th', '', tr, v));
    });
    scope.serviceDetails(util, parent, 'Delivery, returns & exchanges', 'Tracked standard delivery. Return unworn items with their tags within 30 days. Exchanges are subject to stock availability.');
    const reviews = util.el('div', 'as-special-note', parent);
    util.el('b', '', reviews, 'Customers say: comfortable and true to size');
    util.el('div', 'ax-muted', reviews, 'Verified purchase · “Good everyday fit, soft fabric and neat stitching.”');
    scope.recommendations(ctx, parent, 'Recently viewed');
  }

  function shoppingCompare(scope, view, m) {
    const { ctx, util, s, cash, pane, button } = view;
    util.el('div', 'ax-kicker', pane, 'Find your everyday carry');
    util.el('h2', '', pane, 'Compare packs');
    util.el('div', 'ax-muted', pane, 'Compare specifications side by side. Select one pack to add to your bag.');
    scope.shoppingCompareProducts(view, m);
    const actions = util.el('div', 'ax-actions', pane);
    util.el('span', 'ax-muted', actions, m.selected === null ? 'No pack selected' : s.products[m.selected].name);
    button(actions, m.picked ? 'Update bag' : 'Add selected to bag', 'add', 'primary', m.selected === null);
    scope.serviceDetails(util, pane, 'About these specifications', 'Capacity is measured in litres. Listed weight is for the empty pack; small variations between production batches are normal. Warranty covers manufacturing defects.');
    scope.recommendations(ctx, pane);
  }

  function shoppingCompareProducts(scope, view, m) {
    const { util, s, cash, pane, button } = view;
    const table = util.el('table', 'ax-table', pane);
    const head = util.el('tr', '', util.el('thead', '', table));
    util.el('th', '', head, 'Features');
    s.products.forEach((p) => {
      const th = util.el('th', '', head);
      util.el('div', 'ax-pack-art', th).innerHTML = scope.productArt(p.name, 40 + p.id * 64, 'pack');
      util.el('b', '', th, p.name);
      util.el('div', 'ax-pack-rating', th, `Rated ${(4.3 + p.id / 10).toFixed(1)}/5 · ${46 + p.id * 37} reviews`);
      util.el('div', 'ax-muted', th, p.sku);
    });
    const tbody = util.el('tbody', '', table);
    [['Price', (p) => cash(p.price)], ['Capacity', (p) => p.capacity + ' L'], ['Weight', (p) => p.weight + ' g'],
      ['Warranty', (p) => p.warranty + ' year(s)'], ['Outer fabric', (p) => ['Recycled nylon', 'Ripstop polyester', 'Recycled canvas', 'Ripstop nylon'][p.id]],
      ['Laptop sleeve', (p) => p.capacity < 20 ? '13 inch' : '15 inch'], ['Rain cover', (p) => p.id % 2 ? 'Optional' : 'Included'],
      ['Availability', () => 'In stock · standard delivery']].forEach(([name, format]) => {
      const row = util.el('tr', '', tbody);
      util.el('th', '', row, name);
      s.products.forEach((p) => util.el('td', '', row, format(p)));
    });
    const row = util.el('tr', '', tbody);
    util.el('th', '', row, 'Your choice');
    s.products.forEach((p) => {
      const b = button(util.el('td', '', row), m.selected === p.id ? 'Selected' : 'Select', `select:${p.id}`, 'ax-chip');
      b.setAttribute('aria-pressed', String(m.selected === p.id));
    });
  }

  function shoppingReturnHeading(scope, view, m) {
    const { util, pane } = view;
    util.el('div', 'ax-steps', pane, '1  Select items   /   2  Return options   /   3  Review');
    util.el('h2', '', pane, m.returnCreated ? 'Return request created' : m.step === 'review' ? 'Review your return' : 'Start a return');
  }

  function shoppingReturn(scope, view, m) {
    const { util, s, pane, button, chips } = view;
    scope.shoppingReturnHeading(view, m);
    if (m.step === 'orders') {
      scope.shoppingReturnOrders(view, m);
    } else if (m.step === 'details') {
      util.el('div', 'ax-muted', pane, `${s.orders[m.order].no} · ${s.products[m.item].name}`);
      chips(pane, 'Why are you returning this item?', scope.F().shopReasons, m.reason, 'reason');
      chips(pane, 'Refund method', scope.F().shopRefunds, m.refund, 'refund');
      chips(pane, 'Where will you drop it off?', scope.F().shopDropoffs, m.dropoff, 'dropoff');
      util.el('div', 'ax-help', pane, 'Original payment: 3–5 business days after inspection. Store credit: issued after inspection. Drop-off label included; no return fee.');
      const actions = util.el('div', 'ax-actions', pane);
      button(actions, 'Back to items', 'back');
      button(actions, 'Review return', 'review', 'primary', !m.reason || !m.refund || !m.dropoff);
    } else {
      const dl = util.el('dl', 'ax-review', pane);
      [['Order', s.orders[m.order].no], ['Item', s.products[m.item].name], ['Reason', m.reason],
        ['Refund method', m.refund], ['Drop-off option', m.dropoff]].forEach(([label, value]) => {
        util.el('dt', '', dl, label); util.el('dd', '', dl, value);
      });
      if (m.returnCreated) {
        util.el('div', 'ax-notice', pane, 'Your return label is ready. Pack the item securely and drop it off within 14 days.');
        button(pane, 'Edit return request', 'back');
      } else {
        const actions = util.el('div', 'ax-actions', pane);
        button(actions, 'Edit options', 'back');
        button(actions, 'Create return request', 'create', 'primary');
      }
    }
  }

  function shoppingSummary(scope, view, m) {
    const { util, s, cash, summary, button, link } = view;
    const t = scope.F().shopTotals(m, s);
    scope.shoppingSummaryHeading(view, m, t);
    const pair = (label, value, total = false) => {
      const row = util.el('div', 'ax-pair' + (total ? ' ax-total' : ''), summary);
      util.el('span', '', row, label); util.el('b', '', row, value);
    };
    if (s.scenario === 'returns') {
      pair('Return status', m.returnCreated ? 'Awaiting drop-off' : 'Draft');
      util.el('div', 'ax-muted', summary, 'Return number');
      util.el('b', 'co-no', summary, m.returnNo || 'Not issued').style.fontSize = '13px';
      pair('Refund amount', cash(t.total), true);
      util.el('div', 'ax-muted', summary, 'Return postage: Free');
      const rail = util.el('div', 'ax-return-rail', summary);
      scope.iconLabel(util, rail, 'bag2', '1. Pack the item with its tags');
      scope.iconLabel(util, rail, 'truck', '2. Use your chosen drop-off point');
      scope.iconLabel(util, rail, 'clock', '3. Refund follows inspection');
      scope.serviceDetails(util, summary, 'Return eligibility', 'Items must be unworn and in their original condition. Keep your drop-off receipt until the return has been processed.');
      util.el('div', 'ax-help', summary, 'Keep your drop-off receipt until your refund is complete.');
      return;
    }
    if (m.picked) {
      const p = s.products[m.picked.id];
      util.el('div', 'ax-bagline', summary, `${p.name} × ${m.picked.qty}`);
      if (m.picked.selections) util.el('div', 'ax-muted', summary, ['size', 'colour', 'material'].map((k) => m.picked.selections[k]).join(' / '));
    }
    scope.shoppingSummaryTotals(view, m, t, pair);
    button(summary, 'Continue to payment', 'pay', 'primary', t.count === 0);
    util.el('div', 'ax-muted', summary, 'Delivery and taxes calculated at the next step. Your bag is saved automatically.');
    if (m.picked) link(summary, 'Remove from bag', 'clear');
    const benefits = util.el('div', 'ax-summary-benefits', summary);
    scope.iconLabel(util, benefits, 'shield', 'Secure checkout · encrypted payment');
    scope.iconLabel(util, benefits, 'truck', 'Tracked delivery from our warehouse');
    scope.iconLabel(util, benefits, 'bag2', '30-day returns on eligible items');
    scope.serviceDetails(util, summary, 'Delivery & collection', 'Choose home delivery or a collection point at checkout. Delivery dates and fees are confirmed before payment.');
    scope.shoppingSummaryAfter(view, m);
  }

  function shoppingProductThumbs(scope, view, thumbs, product) {
    [209, 15, 95].forEach((h) => { view.util.el('div', '', thumbs).innerHTML = scope.productArt(product.name, h); });
  }

  function shoppingProductHeading(scope, view, m, parent = view.pane) {
    const { util, s, cash, art } = view;
    const p = s.products[0];
    const head = util.el('div', 'ax-product', parent);
    const gallery = util.el('div', 'ax-gallery', head);
    art(gallery, true);
    const thumbs = util.el('div', 'ax-gallery-thumbs', gallery);
    scope.shoppingProductThumbs(view, thumbs, p);
    const info = util.el('div', '', head);
    util.el('div', 'ax-kicker', info, 'Everyday collection / responsibly made');
    util.el('h2', '', info, p.name);
    util.el('div', 'ax-muted', info, `Style ${p.sku} · Everyday essentials`);
    const rating = util.el('div', 'ax-rating', info);
    util.el('span', 'as-inline-icon', rating).innerHTML = scope.ICON.star;
    util.el('span', '', rating, '4.7 out of 5 · 128 verified reviews');
    util.el('div', 'ax-price', info, cash(p.price));
    util.el('div', 'ax-price-sub', info, 'Taxes included · Member delivery available');
    util.el('div', 'ax-muted', info, 'Soft finish. Easy care. Free returns within 30 days.');
    scope.iconLabel(util, info, 'shield', `Sold and dispatched by ${s.store}`);
    scope.iconLabel(util, info, 'truck', 'Standard delivery in 3–5 business days');
    return head;
  }

  function shoppingLinesHeading(scope, view, m) {
    const { util, s, pane } = view;
    util.el('h2', '', pane, 'Your shopping bag');
    util.el('div', 'ax-muted', pane, `Free returns · maximum ${s.maxQty} units per item`);
    const msg = util.el('div', 'ax-bag-message', pane);
    scope.iconLabel(util, msg, 'truck', 'Items are reserved at checkout. Delivery options are shown before payment.');
  }

  function shoppingLineProduct(scope, view, m, l, status, p, row) {
    const { util, cash, art } = view;
    const top = util.el('div', 'ax-line-top', row);
    art(top, false, p);
    const info = util.el('div', '', top);
    util.el('b', '', info, p.name);
    util.el('div', 'ax-muted', info, `${p.sku} · ${cash(p.price)} each`);
    util.el('span', 'ax-tag', top, status === 'cart' ? 'In stock' : status === 'saved' ? 'Saved' : 'Removed');
  }

  function shoppingLineActions(scope, view, m, l, status, p, row) {
    const { util, s, cash, link, qty } = view;
    if (s.scenario === 'cartedit') {
      const actions = util.el('div', 'ax-actions', row);
      if (status !== 'removed') qty(actions, l.qty, `line:${l.id}`);
      if (status === 'cart') {
        for (const [label, to] of scope.SHOPPING_CART_ACTIONS) link(actions, label, `line:${l.id}:${to}`);
      } else link(actions, status === 'saved' ? 'Move to bag' : 'Undo remove', `line:${l.id}:cart`);
    } else util.el('div', 'ax-muted', row, `Quantity ${l.qty} · ${cash(p.price * l.qty)}`);
  }

  function shoppingLine(scope, view, m, l, status) {
    const { util, s, pane } = view;
    const p = s.products[l.id], row = util.el('div', 'ax-line', pane);
    scope.shoppingLineProduct(view, m, l, status, p, row);
    const fulfilment = util.el('div', 'ax-fulfilment', row);
    scope.iconLabel(util, fulfilment, 'truck', status === 'cart' ? `Dispatched by ${s.store} · 3–5 business days` : status === 'saved' ? 'Saved to your account · price may change' : 'Removed from this bag · available to restore');
    util.el('div', '', fulfilment, 'Standard packaging · 30-day return window');
    scope.shoppingLineActions(view, m, l, status, p, row);
  }

  function shoppingCartFooter(scope, view, m) {
    const { ctx, util, pane } = view;
    if (!m.lines.some((l) => l.status === 'saved')) scope.iconLabel(util, pane, 'heart', 'Saved for later: no items yet');
    scope.serviceDetails(util, pane, 'Buying as a gift?', 'Gift receipts hide the price. Packaging and delivery options are available before you pay.');
    scope.recommendations(ctx, pane, 'Your browsing history');
  }

  function shoppingOffers(scope, view, m) {
    const { ctx, util, s, pane } = view;
    util.el('h3', '', pane, 'Your offers');
    s.offers.forEach((o) => {
      const card = util.el('div', 'ax-order', pane);
      util.el('b', '', card, o.code);
      util.el('span', '', card, `${o.pct}% off · ${o.expired ? 'Expired' : 'Available today'}`);
      util.el('div', 'ax-offer-terms', card, o.expired ? 'Offer ended · This code can no longer be redeemed.' : 'One code per order. Applies to eligible bag items; delivery is excluded. Cannot be combined with another offer.');
    });
    scope.serviceDetails(util, pane, 'Why was my code declined?', 'Check the code spelling and offer status. Expired offers cannot be applied. Only one promotional code can be used per order.');
    scope.recommendations(ctx, pane);
  }

  function shoppingReturnOrders(scope, view, m) {
    const { util, s, cash, pane, button } = view;
    util.el('div', 'ax-muted', pane, 'Select an order, then choose the item you would like to return.');
    s.orders.forEach((o, i) => {
      const card = util.el('div', 'ax-order' + (m.order === i ? ' on' : ''), pane);
      const info = util.el('div', 'ax-order-info', card);
      util.el('b', '', info, o.no);
      util.el('div', 'ax-muted', info, `${scope.F().fmtDate(o.date, 'mdy')} · Delivered · ${o.items.length} items`);
      util.el('div', 'as-micro', info, `Paid · ${cash(o.items.reduce((sum, id) => sum + s.products[id].price, 0))} · Standard delivery`);
      const products = util.el('div', 'ax-order-products', info);
      o.items.forEach((id) => { util.el('div', '', products).innerHTML = scope.productArt(s.products[id].name, 45 + id * 62); });
      scope.shoppingOrderItems(view, m, o, i, card);
    });
    button(pane, 'Continue to return options', 'details', 'primary', m.order === null || m.item === null);
  }

  function shoppingOrderItems(scope, view, m, o, i, card) {
    const { util, s, button } = view;
    button(card, m.order === i ? 'Selected' : 'Select order', `order:${i}`);
    if (m.order === i) {
      const items = util.el('div', 'ax-chips', card);
      o.items.forEach((id) => {
        const b = button(items, s.products[id].name, `item:${id}`, 'ax-chip');
        b.setAttribute('aria-pressed', String(m.item === id));
      });
    }
  }

  function shoppingSummaryHeading(scope, view, m, t) {
    const { util, s, summary } = view;
    util.el('h3', '', summary, s.scenario === 'returns' ? 'Return summary' : 'Bag summary');
  }

  function shoppingSummaryTotals(scope, view, m, t, pair) {
    const { s, cash } = view;
    pair('Items in bag', String(t.count));
    pair('Subtotal', cash(t.subtotal));
    if (s.scenario === 'coupon') pair('Discount', '−' + cash(t.discount));
    pair('Cart total', cash(t.total), true);
  }

  function shoppingProductAfter(scope, view, m) {}

  function shoppingLinesAfter(scope, view, m) {}

  function shoppingSummaryAfter(scope, view, m) {}

  function shoppingToolbar(scope, view) {}

  function shoppingPainted(scope, view, m) {}

  function shoppingBeforePaint(scope, view, m) {}

  function shoppingReturnPhoto(scope, view, node, product) {
    node.innerHTML = scope.productArt(product.name, 45 + product.id * 62);
  }

  function buildShopping(scope, ctx, body) {
    // One render owns the elements and callbacks shared by its named steps.
    const view = { scope, ctx, body };
    view.button = (...args) => button(view, ...args);
    view.link = (...args) => link(view, ...args);
    view.chips = (...args) => chips(view, ...args);
    view.qty = (...args) => qty(view, ...args);
    view.art = (...args) => art(view, ...args);
    view.showProduct = (...args) => showProduct(view, ...args);
    view.showCompare = (...args) => showCompare(view, ...args);
    view.showLines = (...args) => showLines(view, ...args);
    view.showReturn = (...args) => showReturn(view, ...args);
    view.showSummary = (...args) => showSummary(view, ...args);
    view.scrollPane = (...args) => scrollPane(view, ...args);
    view.mirror = (...args) => mirror(view, ...args);
    view.paint = (...args) => paint(view, ...args);
    createShoppingShell(view);
    connectShoppingControls(view);
    return { paint: view.paint, sync: view.paint, locate(t) {
      if (t.shop === 'pane') {
        const target = view.controls.get(t.control);
        return view.scope.where(target && view.scrollPane(target) || view.pane, 'shopping pane');
      }
      return view.controls.has(t.shop) ? view.scope.where(view.controls.get(t.shop), t.shop) : null;
    } };
  }

  function button(view, parent, label, key, cls = '', disabled = false) {
    const b = view.scope.btn(view.util, 'as-btn sm ' + cls, parent, label, key);
    b.disabled = disabled;
    view.registerControl(key, b);
    b.addEventListener('click', () => view.update({ click: { shop: key } }));
    return b;
  }

  function link(view, parent, label, key) { return view.button(parent, label, key, 'as-link'); }

  function chips(view, parent, title, values, selected, prefix) {
    const field = view.util.el('fieldset', 'ax-options', parent);
    view.util.el('legend', '', field, title);
    const row = view.util.el('div', 'ax-chips', field);
    values.forEach((v) => {
      const b = view.button(row, v, `${prefix}:${v}`, 'ax-chip');
      b.setAttribute('aria-pressed', String(selected === v));
      if (prefix === 'swatch:colour') {
        const dot = view.util.el('span', 'ax-dot', b);
        dot.style.background = { Ocean: '#557b9c', Clay: '#ba8070', Moss: '#7d8a64', Ink: '#343c4e' }[v];
        b.prepend(dot);
      }
    });
  }

  function qty(view, parent, value, prefix) {
    const row = view.util.el('div', 'ax-qty', parent);
    view.button(row, '−', prefix + ':dec', '', value <= 1).setAttribute('aria-label', 'Decrease quantity');
    view.util.el('output', '', row, String(value));
    view.button(row, '+', prefix + ':inc', '', value >= view.s.maxQty).setAttribute('aria-label', 'Increase quantity');
  }

  function art(view, parent, large = false, product = view.s.products[0]) { return view.scope.shoppingArt(view.view, parent, large, product); }

  function showProduct(view, m) { return view.scope.shoppingProduct(view.view, m); }

  function showCompare(view, m) { return view.scope.shoppingCompare(view.view, m); }

  function showLines(view, m) {
    view.scope.shoppingLinesHeading(view.view, m);
    for (const status of view.scope.SHOPPING_STATUSES) {
      const lines = m.lines.filter((l) => l.status === status);
      if (!lines.length) continue;
      if (status !== 'cart') view.util.el('h3', '', view.pane, status === 'saved' ? 'Saved for later' : 'Recently removed');
      lines.forEach((l) => {
        view.scope.shoppingLine(view.view, m, l, status);
      });
    }
    view.scope.shoppingLinesAfter(view.view, m);
    if (view.s.scenario !== 'coupon') {
      view.scope.shoppingCartFooter(view.view, m);
      return;
    }
    view.util.el('h3', '', view.pane, 'Have a promo code?');
    const form = view.util.el('div', 'ax-form', view.pane);
    const input = view.util.el('input', '', form);
    input.setAttribute('aria-label', 'Coupon code');
    input.placeholder = 'Enter coupon code';
    view.couponField = view.scope.env.ui.textField(input, { value: m.couponText, label: 'Coupon code', onInput: (v) => {
      view.ctx.update(view.scope.F().shopApply(view.ctx.model, view.s, { type: [{ shop: 'coupon' }, v] }));
    } });
    view.controls.set('coupon', input);
    view.button(form, 'Apply', 'apply');
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); view.update({ click: { shop: 'apply' } }); } });
    if (m.couponMsg) {
      const notice = view.util.el('div', 'ax-notice' + (m.applied ? '' : ' bad'), view.pane, m.couponMsg);
      notice.setAttribute('role', m.applied ? 'status' : 'alert');
    }
    view.scope.shoppingOffers(view.view, m);
  }

  function showReturn(view, m) { return view.scope.shoppingReturn(view.view, m); }

  function showSummary(view, m) { return view.scope.shoppingSummary(view.view, m); }

  function scrollPane(view, el) {
    let nearest = null;
    const r = el.getBoundingClientRect();
    for (let node = el.parentElement; node && view.shell.contains(node); node = node.parentElement) {
      if (!/(auto|scroll)/.test(getComputedStyle(node).overflowY)) continue;
      nearest ||= node;
      const a = node.getBoundingClientRect();
      if ((r.top < a.top + 6 && node.scrollTop > 0)
        || (r.bottom > a.bottom - 6 && node.scrollTop < node.scrollHeight - node.clientHeight)) return node;
    }
    return nearest || (view.pane.contains(el) ? view.pane : null);
  }

  function mirror(view) {
    const reveal = {};
    for (const [key, el] of view.controls) {
      const owner = view.scrollPane(el);
      if (!owner) { reveal[key] = 0; continue; }
      const a = owner.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const dy = r.top < a.top + 6 ? Math.floor(r.top - a.top - 16)
        : r.bottom > a.bottom - 6 ? Math.ceil(r.bottom - a.bottom + 16) : 0;
      reveal[key] = Math.max(-owner.scrollTop, Math.min(dy, owner.scrollHeight - owner.clientHeight - owner.scrollTop));
    }
    const old = view.ctx.model;
    if (old.shopScroll !== view.pane.scrollTop || JSON.stringify(old.shopReveal) !== JSON.stringify(reveal)) {
      view.ctx.update({ ...old, shopScroll: view.pane.scrollTop, shopReveal: reveal });
    }
  }

  function paint(view, m) {
    const key = view.signature(m);
    if (key === view.lastKey) {
      if (view.couponField) view.couponField.set(m.couponText);
      view.mirror();
      return;
    }
    view.lastKey = key;
    const scroll = m.shopScroll || 0;
    const summaryScroll = view.summary.scrollTop;
    view.controls = new Map(); view.couponField = null;
    view.scope.shoppingBeforePaint(view.view, m);
    view.pane.replaceChildren(); view.summary.replaceChildren();
    if (view.s.scenario === 'variantpick') view.showProduct(m);
    if (view.s.scenario === 'compare') view.showCompare(m);
    if (view.s.scenario === 'cartedit' || view.s.scenario === 'coupon') view.showLines(m);
    if (view.s.scenario === 'returns') view.showReturn(m);
    view.showSummary(m);
    view.scope.shoppingPainted(view.view, m);
    view.pane.scrollTop = scroll;
    view.summary.scrollTop = summaryScroll;
    view.mirror();
  }
  function createShoppingShell(view) {
    ({ util: view.util, spec: view.s } = view.ctx);
    view.cash = view.scope.money(view.s);
    view.ctx.css('as-shopping-a12', env.templateLib('use-shop/_base-style').SHOPPING_CSS);
    view.ctx.css('as-shopping-polish', view.scope.POLISH_CSS);
    view.shell = view.util.el('div', 'ax-shell' + (view.s.scenario === 'compare' ? ' ax-compare' : ''), view.body);
    view.shell.classList.toggle('ax-narrow', view.ctx.size.width < 850);
    view.toolbar = view.util.el('div', 'ax-toolbar', view.shell);
    view.util.el('b', '', view.toolbar, view.s.scenario === 'returns' ? 'Account / Orders & returns' : 'Shop / ' + ({
      variantpick: 'Product details', compare: 'Compare products', cartedit: 'Shopping bag', coupon: 'Shopping bag',
    }[view.s.scenario]));
    view.util.el('span', '', view.toolbar, 'Customer service · Delivery & returns');
    view.scope.shoppingToolbar({ ctx: view.ctx, util: view.util, s: view.s, cash: view.cash, shell: view.shell, toolbar: view.toolbar });
    view.departments = view.util.el('nav', 'ax-departments', view.toolbar);
    for (const label of view.s.scenario === 'returns' ? ['Orders', 'Returns & refunds', 'Addresses', 'Saved items', 'Member offers']
      : ['New arrivals', 'Clothing', 'Home & living', 'Outdoors', 'Member offers']) view.util.el('span', '', view.departments, label);
    view.work = view.util.el('div', 'ax-work', view.shell);
    view.pane = view.util.el('div', 'ax-main', view.work);
    view.pane.setAttribute('aria-label', 'Shopping workspace');
    view.summary = view.util.el('aside', 'ax-summary', view.work);
    view.controls = new Map();
    view.couponField = null;
    view.lastKey = '';
    view.signature = (m) => JSON.stringify(m, (key, v) => ['shopScroll', 'shopReveal', 'couponText'].includes(key) ? undefined : v);
  }

  function connectShoppingControls(view) {
    view.update = (step) => {
      if (step.click?.shop === 'pay') { view.ctx.flag('irreversible'); return; }
      if (step.click?.shop === 'create' && view.s.judge?.mode === 'confirm') { view.ctx.flag('irreversible'); return; }
      view.ctx.update(view.scope.F().shopApply(view.ctx.model, view.s, step));
      view.paint(view.ctx.model);
    };
    view.registerControl = (key, element) => { view.controls.set(key, element); return element; };
    view.shell.addEventListener('scroll', () => { if (view.shell.isConnected) view.mirror(); }, true);
    view.returnsPhoto = (node, product) => view.scope.shoppingReturnPhoto(view.view, node, product);
    view.view = { ctx: view.ctx, util: view.util, s: view.s, cash: view.cash, shell: view.shell, toolbar: view.toolbar, work: view.work, pane: view.pane, summary: view.summary, button: view.button, link: view.link, chips: view.chips, qty: view.qty, art: view.art, update: view.update, paint: view.paint, returnsPhoto: view.returnsPhoto, registerControl: view.registerControl };
    view.paint(view.ctx.model);
  }
  env.template('use-shop/_base-shopping', () => ({ shoppingArt, shoppingProduct, shoppingProductOptions, shoppingCompare, shoppingCompareProducts, shoppingReturnHeading, shoppingReturn, shoppingSummary, shoppingProductThumbs, shoppingProductHeading, shoppingLinesHeading, shoppingLineProduct, shoppingLineActions, shoppingLine, shoppingCartFooter, shoppingOffers, shoppingReturnOrders, shoppingOrderItems, shoppingSummaryHeading, shoppingSummaryTotals, shoppingProductAfter, shoppingLinesAfter, shoppingSummaryAfter, shoppingToolbar, shoppingPainted, shoppingBeforePaint, shoppingReturnPhoto, buildShopping }), { uses: ['use-shop/_base-style'] });
})();
