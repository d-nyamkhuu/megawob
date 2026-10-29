(function () {
  'use strict';
  const C = { site: 'design-choose-option-combobox-02' };
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        content = ctx.content || {},
        rng = ctx.rng,
        W = window.innerWidth,
        H = window.innerHeight;
      const top = u.el('header', 'ex-titlebar', document.body);
      u.el('span', 'ex-appicon', top, '▣');
      u.el('strong', 'ex-brand', top, 'PartnerLink 1999  |  Acme Manufacturing B2B Extranet');
      const account = u.el(
        'div',
        'ex-account',
        top,
        'Welcome, Thomas Reed    |    Oakridge Retail    |    May 14, 1999',
      );
      const nav = u.el('nav', 'ex-menubar', document.body);
      'File|Edit|View|Orders|Customers|Products|Reports|Tools|Help'.split('|').forEach((x) => u.el('span', '', nav, x));
      const tools = u.el('div', 'ex-toolbar', document.body);
      const toolItems = [
        ['▤', 'New Order'],
        ['📂', 'Open'],
        ['▣', 'Copy'],
        ['✖', 'Delete'],
        ['▤', 'Print'],
        ['⌕', 'Find'],
        ['▣', 'Help'],
      ];
      toolItems.forEach((it, i) => {
        if (i === 4 || i === 5) u.el('i', 'ex-divider', tools);
        const b = u.el('button', 'ex-tool', tools);
        b.type = 'button';
        u.el('span', 'ex-toolicon', b, it[0]);
        u.el('span', '', b, it[1]);
      });
      const modes = { header: 'header', panel: 'panel', toast: 'toast', hidden: 'hidden' };
      let mode = modes[ctx.display] || 'header';
      if (mode === 'panel' && W < 1260) mode = 'header';
      if (mode === 'toast' && H < 700) mode = 'header';
      if (mode === 'header') {
        const note = u.el('div', 'ex-tasknote', top, ctx.instruction);
        note.dataset.role = 'instruction';
        top.classList.add('has-note');
      }
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
        g.slice(1).forEach((v, i) => {
          const a = u.el('div', 'ex-sidelink' + (gi === 0 && i === 0 ? ' active' : ''), side, v);
        });
      });
      const work = u.el('main', 'ex-work', body);
      const catalog = u.el('section', 'ex-panel ex-catalog', work);
      u.el('h2', 'ex-section-title', catalog, 'Product Catalog');
      const cat = u.el('table', 'ex-table', catalog);
      cat.innerHTML =
        '<thead><tr><th>Product ID</th><th>Product Name</th><th>Category</th><th>List Price</th><th>Status</th></tr></thead><tbody><tr><td>1001</td><td>Infant Bodysuit</td><td>Apparel</td><td>$6.50</td><td>In Stock</td></tr><tr><td>1002</td><td>Baby Blanket</td><td>Bedding</td><td>$12.00</td><td>In Stock</td></tr><tr><td>1003</td><td>Diaper Bag Backpack</td><td>Accessories</td><td>$34.95</td><td>In Stock</td></tr></tbody>';
      const recent = u.el('section', 'ex-panel ex-recent', work);
      u.el('h2', 'ex-section-title', recent, 'Recent Orders');
      const orders = u.el('table', 'ex-table', recent);
      orders.innerHTML =
        '<thead><tr><th>Order #</th><th>Date</th><th>Customer</th><th>Total Amount</th><th>Status</th></tr></thead><tbody><tr><td>SO44871</td><td>05/10/1999</td><td>Oakridge Retail</td><td>$284.00</td><td>Shipped</td></tr><tr><td>SO44832</td><td>05/02/1999</td><td>Maple Leaf Stores</td><td>$516.50</td><td>Processing</td></tr><tr><td>SO44790</td><td>04/27/1999</td><td>Harbor View Mart</td><td>$198.75</td><td>Shipped</td></tr></tbody>';
      const help = u.el('aside', 'ex-help', body);
      u.el('h2', 'ex-section-title', help, 'Help & Tips');
      u.el('h3', '', help, 'Adding Products to an Order');
      u.el(
        'p',
        '',
        help,
        'Select a product from the Product list. You can type part of the product name to quickly find a match.',
      );
      u.el('p', '', help, 'Enter the quantity and the item will be added to your order.');
      u.el('hr', '', help);
      u.el('h3', '', help, 'Tips');
      const ul = u.el('ul', '', help);
      [
        'Product search looks at product names and IDs.',
        'Use the arrow button to see all products.',
        'Prices are shown based on your customer’s price list.',
        'Check product availability in the catalog if needed.',
      ].forEach((x) => u.el('li', '', ul, x));
      if (mode === 'panel') {
        const note = u.el('div', 'ex-panelnote', help);
        u.el('b', '', note, 'Instructions');
        u.el('div', '', note, ctx.instruction);
      }
      const win = u.el('section', 'ex-orderwin', work);
      win.dataset.role = 'order-window';
      u.el('div', 'ex-windowtitle', win, 'Create Sales Order');
      const customer = u.el('fieldset', 'ex-customer', win);
      u.el('legend', '', customer, 'Customer Information');
      customer.innerHTML +=
        '<div class="ex-customergrid"><div><label>Customer ID:</label><span class="fake-control">OR1005 <button>…</button></span><label>Customer Name:</label><span class="fake-control">Oakridge Retail</span><label>Contact:</label><span class="fake-control">Thomas Reed</span></div><div><label>Ship To:</label><span class="fake-control select">Main Warehouse</span><label>Requested Date:</label><span class="fake-control">05/20/1999</span><label>Order Type:</label><span class="fake-control select">Standard</span></div></div>';
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
      table.innerHTML =
        '<thead><tr><th>Line</th><th>Product ID</th><th>Product Name</th><th>Quantity</th><th>Unit Price</th><th>Extended Price</th></tr></thead><tbody><tr><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody>';
      const endRng = rng.fork('chrome/end'),
        collideRng = rng.fork('chrome/collide');
      const labels = (
        Array.isArray(content.END_LABELS) && content.END_LABELS.length
          ? content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map(labelOf);
      let placement = null,
        label = null;
      if (!ctx.finish) {
        if (endRng.bool(0.5)) {
          placement = 'header';
          label = 'Submit';
        } else {
          placement = endRng.pick(['header', 'footer', 'link', 'icon']);
          const a = labels.filter((x) => x.trim().toLowerCase() !== 'submit');
          label = a.length ? endRng.pick(a) : 'Done';
        }
      }
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const p = [...new Set(labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))];
        if (p.length) collide = { text: collideRng.pick(p), where: collideRng.pick(['header', 'footer']) };
      }
      const decoy = (parent, text, isCollide) => {
        const b = u.el('button', 'ex-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
      };
      const end = (parent, cls, text) => {
        const b = u.el(cls === 'ex-endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      let submit = null;
      const headTools = u.el('div', 'ex-headtools', tools);
      if (collide && collide.where === 'header') decoy(headTools, collide.text, true);
      if (placement === 'header') submit = end(headTools, 'ex-submit', label);
      if (placement === 'icon') submit = end(headTools, 'ex-submit ex-icon', '✓');
      const footer = u.el('div', 'ex-windowfooter', win);
      if (collide && collide.where === 'footer') decoy(footer, collide.text, true);
      if (placement === 'footer') submit = end(footer, 'ex-submit', label);
      if (placement === 'link') submit = end(footer, 'ex-endlink', `${label} ›`);
      if (!ctx.finish && rng.fork('chrome/filler').bool(0.22))
        decoy(footer, rng.fork('chrome/filler-label').pick(content.DECOY_LABELS || ['Help', 'Save draft']), false);
      if (mode === 'toast') {
        const note = u.el('div', 'ex-toast', body);
        u.el('div', '', note, ctx.instruction);
      }
      if (ctx.finish) tools.classList.add('finish');
      return { stage, submit };
    },
    overlay(ctx) {
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
  });
})();
