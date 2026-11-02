// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-coupon-03',
  name: 'design',
  split: 'train',
  scenarios: ['coupon'],
  template: 'use-shop/base',
  design: {
    parts: {
      // Drawings for this design's products, checked before the template's.
      'productDrawing': (base) => (text, kind, ink, pale) => {
        if (/paddle|racket/.test(text)) return `<path d="M58 30q22-19 44 3 20 21 1 43L76 104q-18 13-29-4-10-16 4-31l21-20Z" fill="${pale}" stroke="${ink}" stroke-width="5"/><path d="m73 73 33 31-9 10-34-31" fill="${ink}"/><path d="m59 43 31 29m-40-11 32 29m-17-51 30 28" stroke="${ink}" stroke-width="2"/>`;
        if (/glove/.test(text)) return `<path d="M55 101 44 64q-4-12 5-15 8-3 13 9l-5-28q-1-10 7-11 9-1 10 10l4 24-2-34q0-10 8-10 9 0 9 11l1 34 3-25q2-9 10-7 8 2 6 12l-2 30q14-9 19 0 4 7-5 17l-22 27H72Z" fill="${pale}" stroke="${ink}" stroke-width="4"/><path d="m66 74 10 24m9-30 7 30m10-32 4 26" stroke="${ink}" stroke-width="3"/>`;
        if (/kettlebell|dumbbell|weight/.test(text)) return `<path d="M55 52V39q0-24 25-24t25 24v13" fill="none" stroke="${ink}" stroke-width="9"/><path d="M48 51q32-15 64 0l-7 49q-25 15-50 0Z" fill="${ink}"/><path d="M62 67h36m-33 12h30" stroke="${pale}" stroke-width="3"/>`;
        if (/pen|pencil|marker/.test(text)) return `<g fill="${pale}" stroke="${ink}" stroke-width="4"><path d="m43 33 12-8 34 63-12 8Z"/><path d="m69 25 12-7 34 63-12 8Z"/><path d="m95 34 12-7 30 56-12 8Z"/></g><path d="m43 33-4 20 18 35m-9-42 17-9m14-2 17-8m8 20 16-9" fill="none" stroke="${ink}" stroke-width="3"/>`;
        return base(text, kind, ink, pale);
      },
      'shoppingLineActions': (base, S) => function (view, m, l, status, p, row) {
        const { util, s, cash, link, qty } = view;
        if (s.scenario === 'cartedit' || s.scenario === 'coupon') {
          const actions = util.el('div', 'ax-actions', row);
          if (status !== 'removed') qty(actions, l.qty, `line:${l.id}`);
          if (s.scenario === 'cartedit' && status === 'cart') {
            link(actions, 'Save for later', `line:${l.id}:saved`);
            link(actions, 'Remove', `line:${l.id}:removed`);
          } else if (s.scenario === 'cartedit') link(actions, status === 'saved' ? 'Move to bag' : 'Undo remove', `line:${l.id}:cart`);
        } else util.el('div', 'ax-muted', row, `Quantity ${l.qty} · ${cash(p.price * l.qty)}`);
      },
      'shoppingOffers': (base, S) => function (view, m) {
        const { util, s, pane } = view;
        util.el('h3', '', pane, 'Available Offers');
        const offerTable = (title, list, expired) => {
          const section = util.el('section', 'ax-coupon-list' + (expired ? ' expired' : ' active'), pane);
          const head = util.el('div', 'ax-coupon-head', section);
          util.el('b', '', head, title);
          const scroll = util.el('div', 'ax-coupon-scroll', section);
          const table = util.el('div', 'ax-coupon-table', scroll);
          const labels = util.el('div', 'ax-coupon-row labels', table);
          util.el('span', '', labels, 'Offer'); util.el('span', '', labels, 'Details');
          list.forEach((o) => {
            const row = util.el('div', 'ax-coupon-row', table);
            util.el('b', '', row, o.code);
            util.el('span', '', row, `${o.pct}% off${o.expired ? ` (expired ${o.until || ''})` : ' · Available today'}`);
          });
        };
        offerTable('Available Offers', s.offers.filter((o) => !o.expired), false);
        offerTable('Expired Offers', s.offers.filter((o) => o.expired), true);
        // Keep the coupon workspace focused on the bag and its offer tables.
      },
    },
  },
});
