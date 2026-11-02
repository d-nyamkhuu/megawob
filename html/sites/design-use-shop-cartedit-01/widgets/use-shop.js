// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-cartedit-01',
  name: 'design',
  split: 'train',
  scenarios: ['cartedit'],
  template: 'use-shop/base',
  design: {
    parts: {
      // Drawings for this design's products, checked before the template's.
      'productDrawing': (base) => (text, kind, ink, pale) => {
        if (/snorkel|goggles|glasses|mask/.test(text)) return `<path d="M25 64q15-27 55-12 40-15 55 12" fill="none" stroke="${ink}" stroke-width="6"/><path d="M36 50h32l5 25H33Zm56 0h32l3 25H87Z" fill="${pale}" stroke="${ink}" stroke-width="5"/><path d="M72 58q8-8 16 0" fill="none" stroke="${ink}" stroke-width="4"/><path d="M119 56q12-31 1-42t-5 12l3 46q1 18-15 27" fill="none" stroke="#1576c8" stroke-width="7" stroke-linecap="round"/><path d="M114 15h13l-1 9h-12Z" fill="#f28d24"/>`;
        if (/kayak|canoe/.test(text)) return `<path d="M20 69q60-50 120 0-60 50-120 0Z" fill="#dc493c" stroke="#9f2824" stroke-width="5"/><path d="M34 68q46-26 92 0-46 27-92 0Z" fill="#172d38"/><path d="M16 69h128" stroke="#792822" stroke-width="3"/><path d="M76 50q8 12 0 29" stroke="#f08b73" stroke-width="3"/>`;
        if (/tent/.test(text)) return `<path d="m26 98 53-78 55 78Z" fill="#d8873a" stroke="#81532e" stroke-width="4"/><path d="M80 20v78m-36 0 36-54 37 54" fill="none" stroke="#f1d2a9" stroke-width="4"/><path d="m70 98 10-28 12 28" fill="#252d36"/>`;
        if (/foam roller|roller/.test(text)) return `<ellipse cx="50" cy="62" rx="18" ry="39" fill="#d88930"/><path d="M50 23h65q18 0 18 39t-18 39H50Z" fill="#e6a34d" stroke="#955d2b" stroke-width="4"/><path d="M68 30v64m15-66v68m15-68v68m15-67v66" stroke="#f4d3a5" stroke-width="3"/>`;
        if (/helmet/.test(text)) return `<path d="M29 78q2-49 51-54 47-2 54 48l-9 12H42Z" fill="#e43d32" stroke="#812b27" stroke-width="5"/><path d="M31 78h104l-12 15H45Z" fill="#252a30"/><path d="M53 50q25-21 56 0" fill="none" stroke="#f5a39b" stroke-width="4"/>`;
        if (/pickleball|paddle/.test(text)) return `<path d="M43 33q11-18 27-7 17 10 8 34L62 83q-8 10-18 1L33 72q-8-8 0-19Z" fill="#2782ca" stroke="#172c43" stroke-width="4"/><path d="m47 81-9 31q-2 8 5 10l6 1q6 1 8-6l9-31" fill="#252b31"/><path d="M97 29q18-5 25 13 7 17-7 35l-18 19q-9 9-17 0l-10-12q-7-9 1-18l16-29q4-7 10-8Z" fill="#d43c3a" stroke="#202b36" stroke-width="4"/><path d="m94 87-10 29q-2 8 5 10l6 2q6 1 8-6l9-28" fill="#272d33"/><circle cx="127" cy="93" r="11" fill="#f3bc20"/><circle cx="130" cy="91" r="2" fill="#fff"/>`;
        if (/glove/.test(text)) return `<path d="M42 101 26 83q-7-8 0-14 6-6 14 0l8 8-8-34q-2-9 6-11 8-2 10 8l6 24-2-37q0-9 8-9t9 9l1 36 3-31q1-9 9-8 8 1 7 10l-2 34 6-20q3-8 10-5 8 3 5 11l-8 38q-5 20-25 20H55q-8 0-13-11Z" fill="#30343a" stroke="#151a20" stroke-width="4"/><path d="m49 79 48 5m-37-18 45 5m-40-19 35 4" stroke="#858a92" stroke-width="5"/>`;
        return base(text, kind, ink, pale);
      },
      'shoppingSummary': (base, S) => function (view, m) {
        const { F, productArt } = S;
        const { util, s, cash, summary } = view;
        const t = F().shopTotals(m, s);
        if (s.scenario === 'cartedit') {
          const line = m.lines.find((x) => x.status === 'cart') || m.lines[0];
          const p = s.products[line ? line.id : 0];
          util.el('h3', '', summary, 'Product Details');
          const image = util.el('div', 'ax-detail-art', summary);
          image.innerHTML = productArt(p.name, 209 + p.id * 31);
          util.el('b', 'ax-detail-name', summary, p.name);
          util.el('div', 'ax-detail-price', summary, cash(p.price));
          const stars = util.el('div', 'ax-detail-rating', summary, '★★★★★　(245)');
          stars.setAttribute('aria-label', 'Rated five stars');
          util.el('p', 'ax-detail-copy', summary, 'Explore the outdoors with dependable gear, thoughtfully selected for comfort and lasting performance.');
          const details = util.el('div', 'ax-detail-specs', summary);
          [['Brand', p.brand || s.store], ['SKU', p.sku || String(10023 + p.id)], ['Availability', 'In Stock']].forEach(([k, v]) => {
            const row = util.el('div', '', details);util.el('b', '', row, k + ':');util.el('span', '', row, v);
          });
          return;
        }
        return base(view, m);
      },
      'shoppingLinesHeading': (base, S) => function (view, m) {
        const { F, iconLabel } = S;
        const { util, s, cash, pane } = view;
        util.el('h2', '', pane, 'Your shopping bag');
        const bagTotals = F().shopTotals(m, s);
        util.el('div', 'ax-muted', pane, s.scenario === 'cartedit' ? `${bagTotals.count} items  |  ${cash(bagTotals.total)}` : `Free returns · maximum ${s.maxQty} units per item`);
        const msg = util.el('div', 'ax-bag-message', pane);
        iconLabel(util, msg, 'truck', 'Items are reserved at checkout. Delivery options are shown before payment.');
      },
      'shoppingLineProduct': (base, S) => function (view, m, l, status, p, row) {
        const { util, cash, art } = view;
        const top = util.el('div', 'ax-line-top', row);
        art(top, false, p);
        const info = util.el('div', '', top);
        util.el('b', '', info, p.name);
        util.el('div', 'ax-muted', info, p.sku);
        util.el('span', 'ax-tag', top, status === 'cart' ? cash(p.price * l.qty) : status === 'saved' ? 'Saved' : 'Removed');
      },
      'shoppingLinesAfter': (base, S) => function (view, m) {
        const { F } = S;
        const { util, s, cash, pane } = view;
        if (s.scenario === 'cartedit') {
          const totals = F().shopTotals(m, s);
          const box = util.el('div', 'ax-cart-totals', pane);
          const row = (label, value, total = false) => {
            const r = util.el('div', total ? 'total' : '', box);util.el('span', '', r, label);util.el('b', '', r, value);
          };
          row(`Subtotal (${totals.count} items)`, cash(totals.subtotal));
          row('Estimated Tax', cash(0));
          row('Estimated Total', cash(totals.total), true);
        }
      },
    },
  },
});
