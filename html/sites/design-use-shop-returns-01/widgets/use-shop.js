// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-returns-01',
  name: 'design',
  split: 'train',
  scenarios: ['returns'],
  template: 'use-shop/base',
  design: {
    parts: {
      // A full-bleed app, its bottom kept 8 px clear of fixed site frame.
      'framePlace': (base) => (app, g) => (g.flow ? base(app, g)
        : Object.assign(app.style, { left: '0px', width: '100%', top: '0px', bottom: (g.cover ? g.cover + 8 : 0) + 'px' })),
      // No step strip on the order history; the options step keeps its title after the return is created.
      'shoppingReturnHeading': (base) => (view, m) => {
        if (m.step !== 'orders') base(view, m.step === 'details' ? { ...m, returnCreated: false } : m);
      },
      // The order history: a searchable order list beside the selected order's items.
      'shoppingReturnOrders': (base, S) => function (view, m) {
        const { F } = S;
        const { util, s, cash, pane, button, returnsPhoto } = view;
        const title = util.el('div', 'returns-titlebar', pane);
        util.el('h2', '', title, 'Orders');
        const tabs = util.el('div', 'returns-tabs', pane);
        util.el('span', 'current', tabs, 'Order history');
        util.el('span', '', tabs, 'Returns');
        const split = util.el('div', 'returns-split', pane);
        const list = util.el('section', 'returns-order-list', split);
        const search = util.el('div', 'returns-search', list);
        util.el('span', 'returns-search-icon', search).innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/></svg>';
        util.el('span', '', search, 'Search orders');
        const details = util.el('section', 'returns-selected-order', split);
        let selected = null;
        s.orders.forEach((o, i) => {
          const card = util.el('div', 'returns-order' + (m.order === i ? ' on' : ''), list);
          const pick = button(card, '›', `order:${i}`, 'returns-order-select');
          pick.setAttribute('aria-label', `Select order ${o.no}`);
          util.el('b', 'returns-order-number', card, o.no);
          util.el('span', 'returns-order-date', card, F().fmtDate(o.date, 'mdy'));
          util.el('span', 'returns-order-count', card, `${o.items.length} ${o.items.length === 1 ? 'item' : 'items'}`);
          if (m.order === i) selected = o;
        });
        if (selected) {
          util.el('h3', 'returns-detail-heading', details, `Order ${selected.no}`);
          util.el('div', 'returns-order-subtitle', details, `${F().fmtDate(selected.date, 'mdy')}  |  ${selected.items.length} items`);
          selected.items.forEach((id) => {
            const p = s.products[id];
            const row = util.el('div', 'returns-product-row' + (m.item === id ? ' chosen' : ''), details);
            const photo = util.el('div', 'returns-product-photo', row);
            returnsPhoto(photo, p);
            const info = util.el('div', 'returns-product-info', row);
            util.el('b', '', info, p.name);
            util.el('div', 'returns-product-meta', info, [p.gender, p.colour, p.size].filter(Boolean).join('  |  ') || 'Standard');
            util.el('strong', 'returns-product-price', info, cash(p.price));
            const choose = button(row, 'Select for return', `item:${id}`, 'returns-item-select');
            choose.setAttribute('aria-pressed', String(m.item === id));
          });
          if (m.item !== null) {
            const continueBtn = button(details, 'Continue to return options', 'details', 'primary');
            continueBtn.classList.add('returns-continue');
          }
        } else {
          util.el('h3', 'returns-detail-heading', details, 'Choose an order');
          util.el('div', 'returns-order-subtitle', details, 'Select an order to view its items.');
        }
      },
      'shoppingSummary': (base, S) => function (view, m) {
        const { F } = S;
        const { util, s, cash, summary, returnsPhoto } = view;
        if (s.scenario === 'returns') {
          const heading = util.el('div', 'returns-recent-heading', summary);
          util.el('h3', '', heading, 'Recent orders');
          util.el('span', 'returns-view-all', heading, 'View all orders');
          const all = util.el('div', 'returns-recent-list', summary);
          s.orders.forEach((o, i) => {
            const row = util.el('div', 'returns-recent-order' + (m.order === i ? ' on' : ''), all);
            const pic = util.el('div', 'returns-recent-photo', row);
            const product = s.products[o.items[0]];
            returnsPhoto(pic, product);
            const info = util.el('div', 'returns-recent-info', row);
            util.el('b', '', info, o.no);
            util.el('span', '', info, F().fmtDate(o.date, 'mdy'));
            util.el('span', '', info, `${o.items.length} ${o.items.length === 1 ? 'item' : 'items'}`);
            util.el('strong', 'returns-recent-total', row, cash(o.items.reduce((sum, id) => sum + s.products[id].price, 0)));
            util.el('span', 'returns-recent-chevron', row, '›');
          });
          return;
        }
        return base(view, m);
      },
      'shoppingReturnPhoto': (base, S) => function (view, node, product) {
        const { productArt } = S;
        const { util } = view;
        const name = String(product.name).toLowerCase();
        const slot = /chelsea/.test(name) ? 'chelsea' : /boot/.test(name) ? 'boots' : /jacket|coat|rain/.test(name) ? 'jacket' : /pack|backpack|bag/.test(name) ? 'pack' : /hat|cap|beanie/.test(name) ? 'hat' : /bottle|thermos|tumbler/.test(name) ? 'bottle' : /shoe|sneaker/.test(name) ? 'shoe' : /shirt|tee|top/.test(name) ? 'tee' : '';
        if (slot) {
          node.classList.add('photo-sheet-item'); node.dataset.slot = slot;
          const accessory = ['hat', 'tee', 'bottle', 'shoe'].includes(slot);
          const image = util.el('img', 'returns-sheet-image ' + slot + (accessory ? ' accessory' : ''), node);
          image.src = new URL('sites/design-use-shop-returns-01/assets/' + (accessory ? 'returns-accessory-photos.webp' : 'returns-core-photos-v2.webp'), location.href).href;
          image.alt = '';
        }
        else node.innerHTML = productArt(product.name, 45 + product.id * 62);
      },
      'shoppingBeforePaint': (base, S) => function (view, m) {
        const { s, pane } = view;
        pane.classList.toggle('returns-history', s.scenario === 'returns' && m.step === 'orders');
      },
    },
  },
});
