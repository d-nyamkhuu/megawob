(function () {
  'use strict';
  const D = {
    site: 'design-use-shop-cartedit-01',
    brand: 'TrailSide Outfitters – Shop',
    tokens: {
      bg: '#e8f1fa',
      panel: '#fff',
      fg: '#102d58',
      accent: '#1765b7',
      font: "'Segoe UI',Tahoma,Arial,sans-serif",
      line: '#c7d7e8',
      muted: '#566a84',
    },
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'trailshop instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const title = u.el('header', 'design-header', shell);
      u.el('span', 'sun-symbol', title, '◧');
      u.el('div', 'design-brand', title, D.brand);
      const win = u.el('div', 'window-controls', title);
      for (const x of ['−', '□', '×']) u.el('span', '', win, x);
      const nav = u.el('nav', 'design-nav', shell);
      for (const x of ['File', 'Edit', 'View', 'Go', 'Tools', 'Help']) u.el('span', 'menu-item', nav, x);
      const toolbar = u.el('div', 'shop-toolbar', shell);
      for (const [label, icon] of [
        ['Back', '◀'],
        ['Forward', '▶'],
        ['Home', '⌂'],
        ['Search', '⌕'],
        ['Favorites', '★'],
        ['Cart', '🛒'],
        ['Orders', '▣'],
        ['Account', '♟'],
      ]) {
        const b = u.el('span', 'tool-item', toolbar);
        u.el('b', '', b, icon);
        u.el('span', '', b, label);
      }
      const shophead = u.el('div', 'shop-head', shell);
      u.el('div', 'shop-logo', shophead, '◢▲◣');
      u.el('div', 'shop-wordmark', shophead, 'TrailSide');
      u.el('div', 'shop-submark', shophead, 'Outfitters');
      const search = u.el('div', 'search-box', shophead, 'Search for products, brands or keywords');
      u.el('button', 'search-go', shophead, '⌕');
      u.el('div', 'bag-indicator', shophead, '🛒　Your Bag (4)\n　　 $327.96');
      const body = u.el('div', 'design-body', shell);
      const cats = u.el('aside', 'category-rail', body);
      u.el('b', '', cats, 'Shop by Category');
      for (const c of [
        'Camping & Hiking',
        'Outdoor Clothing',
        'Footwear',
        'Water Sports',
        'Cycling',
        'Fitness & Recreation',
        'Travel Gear',
        'Accessories',
        'Sale',
        'Gift Cards',
        'Top Brands',
      ])
        u.el('span', c === 'Water Sports' ? 'active' : '', cats, c);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      u.el('h2', '', note, 'Shopping task');
      if (ctx.display !== 'hidden') u.el('p', 'food-task', note, ctx.instruction);
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      const tools = [];
      for (const [label, cls] of [
        ['↶  Clear basket', 'clear-basket'],
        ['▣  Print order', 'print-order'],
        ['▤  Save order…', 'save-order'],
      ]) {
        const b = u.el('button', cls, footer, label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { what: label }));
        tools.push(b);
      }
      const orderSlot = u.el('div', 'order-slot', footer);
      const endRng = ctx.rng.fork('chrome/end');
      const baseEnd = endRng.bool(0.5);
      const placement = baseEnd ? 'order' : endRng.pick(['print', 'save']);
      const bank = ctx.content && ctx.content.END_LABELS;
      const labels =
        Array.isArray(bank) && bank.length
          ? bank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const textOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = baseEnd ? 'Confirm' : textOf(endRng.pick(labels));
      const collideRng = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (collideRng.bool(0.3)) {
        const options = [...new Set(labels.map(textOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) collision = collideRng.pick(options);
      }
      if (collision) {
        const b = u.el('button', 'menu-pq', toolbar, collision);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
      }
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'end-control', toolbar, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
        if (placement === 'print') {
          tools[0].style.gridColumn = '1';
          submit.style.gridColumn = '2';
          tools[2].style.gridColumn = '3';
          orderSlot.style.gridColumn = '4';
          tools[1].style.gridColumn = '5';
          for (const x of [...tools, orderSlot, submit]) x.style.gridRow = '1';
        } else if (placement === 'save') {
          tools[0].style.gridColumn = '1';
          tools[1].style.gridColumn = '2';
          submit.style.gridColumn = '3';
          orderSlot.style.gridColumn = '4';
          tools[2].style.gridColumn = '5';
          for (const x of [...tools, orderSlot, submit]) x.style.gridRow = '1';
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const texts = {
        cookie: ['Privacy preferences', 'We use cookies to improve your shopping experience.', 'Reject optional'],
        toast: ['Notification', 'Your shopping bag has been updated.', 'Dismiss'],
        chat: ['TrailSide support', 'How can we help with your order?', 'Close'],
        promo: ['TrailSide newsletter', 'Get updates on new outdoor gear.', 'Close'],
        banner: ['Store announcement', 'Free shipping on orders over $75.', 'Dismiss announcement'],
      };
      const [title, copy, label] = texts[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
