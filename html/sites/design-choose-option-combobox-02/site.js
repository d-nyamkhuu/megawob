(function () {
  'use strict';
  const palette = { bg: '#dbe2e9', panel: '#e3e7ea', fg: '#080d2a', muted: '#33475a', line: '#aabbcb' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ex-titlebar', document.body);
      u.el('span', 'ex-appicon', top, '▣');
      u.el('strong', 'ex-brand', top, 'PartnerLink 1999  |  Acme Manufacturing B2B Extranet');
      u.el('div', 'ex-account', top, 'Welcome, Thomas Reed    |    Oakridge Retail    |    May 14, 1999');
      _c.header = top;
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'ex-menubar', document.body);
      'File|Edit|View|Orders|Customers|Products|Reports|Tools|Help'.split('|').forEach((x) => u.el('span', '', nav, x));
      const tools = u.el('div', 'ex-toolbar', document.body);
      const toolItems = [['▤', 'New Order'], ['📂', 'Open'], ['▣', 'Copy'], ['✖', 'Delete'], ['▤', 'Print'], ['⌕', 'Find'], ['▣', 'Help']];
      toolItems.forEach((it, i) => {
        if (i === 4 || i === 5) u.el('i', 'ex-divider', tools);
        const b = u.el('button', 'ex-tool', tools);
        b.type = 'button';
        u.el('span', 'ex-toolicon', b, it[0]);
        u.el('span', '', b, it[1]);
      });
      _c.toolbar = tools;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ex-tasknote');
        _c.header.classList.add('has-note');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ex-headtools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ex-appbody', document.body);
      const side = u.el('aside', 'ex-sidebar', body);
      const groups = [
        ['Orders', 'Create Order', 'Order Search', 'Backorders', 'Order History'],
        ['Customers', 'Customer Search', 'Account Details', 'Price Lists'],
        ['Products', 'Product Catalog', 'New Products', 'Specials'],
        ['Reports', 'Sales Reports', 'Inventory Status', 'Partner Activity'],
      ];
      groups.forEach((g, gi) => {
        u.el('b', 'ex-sidehead', side, g[0]);
        g.slice(1).forEach((v, i) => u.el('div', 'ex-sidelink' + (gi === 0 && i === 0 ? ' active' : ''), side, v));
      });
      const work = u.el('main', 'ex-work', body);
      const catalog = u.el('section', 'ex-panel ex-catalog', work);
      u.el('h2', 'ex-section-title', catalog, 'Product Catalog');
      const cat = u.el('table', 'ex-table', catalog);
      cat.innerHTML = '<thead><tr><th>Product ID</th><th>Product Name</th><th>Category</th><th>List Price</th><th>Status</th></tr></thead><tbody><tr><td>1001</td><td>Infant Bodysuit</td><td>Apparel</td><td>$6.50</td><td>In Stock</td></tr><tr><td>1002</td><td>Baby Blanket</td><td>Bedding</td><td>$12.00</td><td>In Stock</td></tr><tr><td>1003</td><td>Diaper Bag Backpack</td><td>Accessories</td><td>$34.95</td><td>In Stock</td></tr></tbody>';
      const recent = u.el('section', 'ex-panel ex-recent', work);
      u.el('h2', 'ex-section-title', recent, 'Recent Orders');
      const orders = u.el('table', 'ex-table', recent);
      orders.innerHTML = '<thead><tr><th>Order #</th><th>Date</th><th>Customer</th><th>Total Amount</th><th>Status</th></tr></thead><tbody><tr><td>SO44871</td><td>05/10/1999</td><td>Oakridge Retail</td><td>$284.00</td><td>Shipped</td></tr><tr><td>SO44832</td><td>05/02/1999</td><td>Maple Leaf Stores</td><td>$516.50</td><td>Processing</td></tr><tr><td>SO44790</td><td>04/27/1999</td><td>Harbor View Mart</td><td>$198.75</td><td>Shipped</td></tr></tbody>';
      const help = u.el('aside', 'ex-help', body);
      u.el('h2', 'ex-section-title', help, 'Help & Tips');
      u.el('h3', '', help, 'Adding Products to an Order');
      u.el('p', '', help, 'Select a product from the Product list. You can type part of the product name to quickly find a match.');
      u.el('p', '', help, 'Enter the quantity and the item will be added to your order.');
      u.el('hr', '', help);
      u.el('h3', '', help, 'Tips');
      const ul = u.el('ul', '', help);
      ['Product search looks at product names and IDs.', 'Use the arrow button to see all products.', 'Prices are shown based on your customer’s price list.', 'Check product availability in the catalog if needed.'].forEach((x) => u.el('li', '', ul, x));
      const win = u.el('section', 'ex-orderwin', work);
      win.dataset.role = 'order-window';
      u.el('div', 'ex-windowtitle', win, 'Create Sales Order');
      const customer = u.el('fieldset', 'ex-customer', win);
      u.el('legend', '', customer, 'Customer Information');
      customer.innerHTML += '<div class="ex-customergrid"><div><label>Customer ID:</label><span class="fake-control">OR1005 <button>…</button></span><label>Customer Name:</label><span class="fake-control">Oakridge Retail</span><label>Contact:</label><span class="fake-control">Thomas Reed</span></div><div><label>Ship To:</label><span class="fake-control select">Main Warehouse</span><label>Requested Date:</label><span class="fake-control">05/20/1999</span><label>Order Type:</label><span class="fake-control select">Standard</span></div></div>';
      const stage = u.el('div', 'ex-stage', win);
      const items = u.el('fieldset', 'ex-items', win);
      u.el('legend', '', items, 'Order Items');
      const itemrow = u.el('div', 'ex-itemrow', items);
      u.el('div', 'ex-qty-label', itemrow, 'Quantity:');
      u.el('input', 'ex-qty', itemrow).value = '1';
      u.el('div', 'ex-price-label', itemrow, 'Unit Price:');
      u.el('div', 'ex-price', itemrow);
      u.el('div', 'ex-ext-label', itemrow, 'Extended Price:');
      u.el('div', 'ex-ext', itemrow);
      u.el('button', 'ex-add', itemrow, 'Add to Order');
      const table = u.el('table', 'ex-table ex-lines', items);
      table.innerHTML = '<thead><tr><th>Line</th><th>Product ID</th><th>Product Name</th><th>Quantity</th><th>Unit Price</th><th>Extended Price</th></tr></thead><tbody><tr><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody>';
      Object.assign(_c, { body, help, win, orderStage: stage });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.help;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => { _c.stage = _c.orderStage; },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.body.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('ex-windowfooter');
        _c.win.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => { base(_c); },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ex-overlay ex-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-choose-option-combobox-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#24558d'], LOW_ACCENTS: ['#24558d'], parts },
  });
})();
