// Design on templates/use-shop/base.js: returns step 1/2 drawn as the reference's order table and item table.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-returns-05',
  name: 'design',
  split: 'train',
  scenarios: ['returns'],
  template: 'use-shop/base',
  design: {
    parts: {
      shoppingReturnOrders: (base, S) => (view, m) => {
        const scope = S;
        const { util, s, cash, pane, button } = view;
        const wrap = util.el('div', 'rt-wrap', pane);
        util.el('h3', 'rt-h', wrap, '1.  Select an order');
        const ob = util.el('div', 'rt-scroll rt-orders', wrap);
        const ot = util.el('table', 'rt-table', ob);
        const oh = util.el('tr', '', util.el('thead', '', ot));
        ['Order #', 'Order Date', 'Items', 'Total', 'Status'].forEach((h) => util.el('th', '', oh, h));
        const otb = util.el('tbody', '', ot);
        s.orders.forEach((o, i) => {
          const tr = util.el('tr', 'rt-row' + (m.order === i ? ' on' : ''), otb);
          const c0 = util.el('td', '', tr);
          const b = button(c0, o.no, `order:${i}`, 'rt-cellbtn');
          util.el('td', '', tr, scope.F().fmtDate(o.date, 'mdy'));
          util.el('td', '', tr, String(o.items.length));
          util.el('td', 'rt-num', tr, cash(o.items.reduce((sum, id) => sum + s.products[id].price, 0)));
          util.el('td', '', tr, 'Delivered');
          tr.addEventListener('click', (e) => { if (e.target !== b) b.click(); });
        });
        util.el('div', 'rt-rule', wrap);
        util.el('h3', 'rt-h', wrap, '2.  Select an item to return');
        const ib = util.el('div', 'rt-scroll rt-items', wrap);
        const it = util.el('table', 'rt-table rt-itemtable', ib);
        const ih = util.el('tr', '', util.el('thead', '', it));
        ['', '', 'Item', 'Options', 'Price', 'Quantity'].forEach((h) => util.el('th', '', ih, h));
        const itb = util.el('tbody', '', it);
        if (m.order === null || m.order === undefined) {
          const tr = util.el('tr', '', itb);
          const td = util.el('td', 'rt-hint', tr, 'Select an order above to see its items.');
          td.colSpan = 6;
        } else {
          s.orders[m.order].items.forEach((id) => {
            const p = s.products[id];
            const tr = util.el('tr', 'rt-row rt-itemrow' + (m.item === id ? ' on' : ''), itb);
            util.el('td', 'rt-radio', tr).appendChild(util.el('span', 'rt-dot' + (m.item === id ? ' on' : '')));
            const ph = util.el('td', 'rt-photo', tr);
            ph.innerHTML = scope.productArt(p.name, 45 + id * 62);
            const nm = util.el('td', '', tr);
            const b = button(nm, p.name, `item:${id}`, 'rt-cellbtn');
            b.setAttribute('aria-pressed', String(m.item === id));
            const COL = ['Navy', 'Oatmeal', 'Mid Wash', 'White', 'Black', 'Olive', 'Grey', 'Rust'];
            const SZ = ['Large', 'Medium', '32 x 32', "Men's 10", 'Small', 'X-Large'];
            const opt = [COL[(id * 3 + 1) % COL.length], SZ[(id * 5 + 2) % SZ.length]];
            const od = util.el('td', 'rt-opt', tr);
            (opt.length ? opt : []).forEach((x) => util.el('div', '', od, typeof x === 'string' ? x : String(x && (x.label || x.name || x.value) || '')));
            util.el('td', '', tr, cash(p.price));
            util.el('td', 'rt-qty', tr, '1');
            tr.addEventListener('click', (e) => { if (e.target !== b) b.click(); });
          });
        }
        const act = util.el('div', 'rt-act', wrap);
        button(act, 'Continue to return options', 'details', 'primary', m.order === null || m.item === null);
      },
    },
  },
});
