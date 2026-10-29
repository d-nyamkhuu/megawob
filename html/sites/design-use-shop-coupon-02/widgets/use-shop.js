// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-coupon-02',
  name: 'design',
  split: 'train',
  scenarios: ['coupon'],
  template: 'use-shop/base',
  design: {
    parts: {
      // Drawings for this design's products, checked before the template's.
      'productDrawing': (base) => (text, kind, ink, pale) => {
        if (/glove/.test(text)) return `<path d="M45 103 35 75q-3-8 3-10 5-2 9 6l7 12-8-41q-1-8 5-9 6-1 8 7l7 29-4-42q0-8 6-8 6 0 7 8l4 39 1-35q0-8 6-8t7 8l1 39 5-28q2-8 8-6 6 2 4 10l-8 40q-3 18-20 20l-21 1Z" fill="${ink}" stroke="#555" stroke-width="3"/><path d="m48 86 42 6m-37-17 39 6m-34-18 32 5" stroke="${pale}" stroke-width="3"/>`;
        if (/paddle|racket/.test(text)) return `<ellipse cx="80" cy="43" rx="31" ry="39" fill="${ink}" stroke="#555" stroke-width="4"/><path d="m67 72 14 3-5 41-13-2Z" fill="#555"/><path d="M63 31q17-13 34 0M58 45q21-11 43 0M62 57q17-7 36 0" fill="none" stroke="${pale}" stroke-width="3"/>`;
        if (/kettlebell/.test(text)) return `<path d="M58 43q0-26 22-26t22 26" fill="none" stroke="#555" stroke-width="10"/><path d="M38 68q0-24 19-31h46q19 7 19 31v25q0 16-17 16H55q-17 0-17-16Z" fill="${ink}" stroke="#555" stroke-width="3"/><path d="M51 72h58" stroke="${pale}" stroke-width="3" opacity=".7"/>`;
        if (/snorkel|mask|goggle/.test(text)) return `<path d="M34 47q20-24 46 0v37q-25 19-46-4Zm92 0q-20-24-46 0v37q25 19 46-4Z" fill="${ink}" stroke="#555" stroke-width="4"/><path d="M73 55q7-9 14 0m-51-8q-4-19 7-30m73 30q4-19-7-30" fill="none" stroke="${pale}" stroke-width="5"/><path d="M72 67h16" stroke="#555" stroke-width="5"/>`;
        return base(text, kind, ink, pale);
      },
      // Suggestions under "You Might Also Like" say only that they are available.
      'recommendations': (base) => (ctx, parent, heading) => {
        const box = base(ctx, parent, heading);
        if (heading === 'You Might Also Like') for (const note of box.querySelectorAll('.as-rec-item > span')) note.textContent = 'Available';
        return box;
      },
      'shoppingLinesHeading': (base, S) => function (view, m) {
        const { iconLabel } = S;
        const { util, s, pane } = view;
        util.el('h2', '', pane, 'Your shopping bag');
        util.el('div', 'ax-muted', pane, `Free returns · maximum ${s.maxQty} units per item`);
        const msg = util.el('div', 'ax-bag-message', pane);
        iconLabel(util, msg, 'truck', 'Items are reserved at checkout. Delivery options are shown before payment.');
        if (s.scenario === 'coupon') {
          const columns = util.el('div', 'ax-bag-columns', pane);
          ['Item', 'Price', 'Qty', 'Subtotal', ''].forEach((label) => util.el('b', '', columns, label));
        }
      },
      'shoppingOffers': (base, S) => function (view, m) {
        const { F, recommendations, serviceDetails } = S;
        const { ctx, util, s, cash, pane, summary } = view;
        util.el('h3', '', pane, 'Your offers');
        s.offers.forEach((o) => {
          const card = util.el('div', 'ax-order', pane);
          util.el('b', '', card, o.code);
          util.el('span', '', card, `${o.pct}% off · ${o.expired ? 'Expired' : 'Available today'}`);
          util.el('div', 'ax-offer-terms', card, o.expired ? 'Offer ended · This code can no longer be redeemed.' : 'One code per order. Applies to eligible bag items; delivery is excluded. Cannot be combined with another offer.');
        });
        if (s.scenario === 'coupon') {
          const totals = F().shopTotals(m, s);
          const box = util.el('div', 'ax-main-totals', pane);
          [[`Subtotal (${totals.count} items)`, cash(totals.subtotal)], ['Estimated Total', cash(totals.total)]].forEach(([label, value], i) => {
            const line = util.el('div', i ? 'ax-main-total final' : 'ax-main-total', box);
            util.el('span', '', line, label); util.el('b', '', line, value);
          });
        }
        serviceDetails(util, pane, 'Why was my code declined?', 'Check the code spelling and offer status. Expired offers cannot be applied. Only one promotional code can be used per order.');
        recommendations(ctx, s.scenario === 'coupon' ? summary : pane, s.scenario === 'coupon' ? 'You Might Also Like' : 'Recently viewed');
      },
      'shoppingLine': (base, S) => function (view, m, l, status) {
        const { productArt } = S;
        const { util, s, cash, pane } = view;
        const p = s.products[l.id];
        if (s.scenario === 'coupon' && status === 'cart') {
          const row = util.el('div', 'ax-line', pane);
          const image = util.el('div', 'ax-bag-image', row);
          image.innerHTML = productArt(p.name, 45 + p.id * 62);
          const info = util.el('div', 'ax-bag-name', row);
          util.el('b', '', info, p.name);
          util.el('span', '', info, p.sku);
          util.el('div', 'ax-bag-price', row, cash(p.price));
          util.el('div', 'ax-bag-qty', row, String(l.qty));
          util.el('div', 'ax-bag-subtotal', row, cash(p.price * l.qty));
          const remove = util.el('span', 'ax-bag-remove', row, '♜');
          remove.setAttribute('aria-hidden', 'true');
          return;
        }
        return base(view, m);
      },
    },
  },
});
