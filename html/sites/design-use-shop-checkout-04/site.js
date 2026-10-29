(function () {
  'use strict';
  const D = {
    site: 'design-use-shop-checkout-04',
    brand: 'Shop & Buy',
    tokens: {
      bg: '#f1efe3',
      panel: '#f7f5ea',
      fg: '#111110',
      accent: '#111110',
      line: '#74746d',
      muted: '#55554f',
      font: 'Georgia,"Times New Roman",serif',
    },
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className =
        'lisa-window ' + (ctx.display === 'toast' ? 'toast-mode' : 'instruction-' + ctx.display);
      const shell = u.el('div', 'site-shell', document.body);
      const title = u.el('header', 'design-header', shell);
      u.el('span', 'app-mark', title, '▧');
      u.el('strong', 'design-brand', title, D.brand);
      const win = u.el('div', 'window-controls', title);
      for (const c of ['−', '□', '×']) u.el('span', '', win, c);
      const nav = u.el('nav', 'design-nav', shell);
      u.el('span', 'app-menu-icon', nav, '▯');
      u.el('span', '', nav, 'File');
      u.el('span', '', nav, 'Edit');
      u.el('span', '', nav, 'View');
      u.el('span', '', nav, 'Search');
      u.el('span', '', nav, 'Products');
      u.el('span', '', nav, 'Cart');
      u.el('span', '', nav, 'Tools');
      u.el('span', '', nav, 'Help');
      const tools = u.el('div', 'toolbar', shell);
      const er = ctx.rng.fork('chrome/end');
      const label = er.bool(0.5) ? 'OK' : ctx.content.endLabel(er);
      const placement = er.pick(['header', 'header', 'header', 'footer', 'link', 'icon']);
      const cr = ctx.rng.fork('chrome/collide');
      const collide = cr.bool(0.3) ? ctx.content.collideLabel(cr, label) : null;
      const toolItems = [
        ['⌂', 'Home'],
        ['⌕', 'Search'],
        ['▤', 'Categories'],
        ['🛒', 'Cart'],
        ['▤', 'Orders'],
      ];
      for (const [ic, label] of toolItems) {
        const b = u.el('button', 'tool-button', tools);
        b.type = 'button';
        u.el('b', 'tool-icon', b, ic);
        u.el('span', '', b, label);
        b.addEventListener('click', () => env.log('decoy', { label }));
      }
      let end = null;
      if (!ctx.finish) {
        const asLink = placement === 'link';
        end = u.el(
          asLink ? 'a' : 'button',
          'end-control' +
            (placement === 'icon' ? ' end-icon' : '') +
            (placement === 'footer' ? ' end-footer' : '') +
            (asLink ? ' end-link' : ''),
          tools,
          placement === 'icon' ? '✓' : label,
        );
        end.type = asLink ? undefined : 'button';
        if (asLink) end.href = '#';
        end.dataset.role = 'submit';
        end.setAttribute('aria-label', label);
        end.title = label;
        end.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        const go = u.el('button', 'toolbar-xtra', tools, 'Go');
        go.type = 'button';
        go.dataset.role = 'xtra';
        go.addEventListener('click', () => env.log('decoy', { label: 'Go' }));
        if (collide) {
          const d = u.el('button', 'toolbar-xtra toolbar-pqs', tools, collide);
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
        }
      }
      const hero = u.el('section', 'auto-hero', shell);
      const art = u.el('div', 'auto-art', hero);
      art.innerHTML =
        '<svg viewBox="0 0 620 150" aria-hidden="true"><g fill="none" stroke="#111" stroke-width="4"><path d="M35 103 55 70l50-17 45-33 90 4 65 45 34 10 17 27v22H38z"/><path d="m74 71 35-9 42-31 82 5 38 35zM192 38v33m35-31 28 32M57 86h290"/><circle cx="110" cy="119" r="22"/><circle cx="280" cy="119" r="22"/><rect x="355" y="57" width="75" height="57"/><path d="M365 57V35h55v22M449 115c-4-40 8-79 34-92 32-17 68 10 73 56 4 39-9 63-41 65-31 2-58-8-66-29z"/><ellipse cx="504" cy="94" rx="27" ry="48"/><path d="M497 47c-8 19-12 33-13 47 1 20 8 33 20 48M517 48c-9 17-13 34-13 47 0 19 8 35 22 49"/></g><g fill="#111"><circle cx="110" cy="119" r="9"/><circle cx="280" cy="119" r="9"/><path d="M38 97h25l-5 8H35zm286-2h23l7 14h-30z"/></g></svg>';
      const heroText = u.el('div', 'hero-copy', hero);
      u.el('h1', '', heroText, 'Auto Parts & Accessories');
      u.el('p', '', heroText, 'Quality parts for a smooth ride.');
      const benefits = u.el('div', 'hero-benefits', hero);
      for (const t of ['Trusted brands', 'In-stock items', 'Fast delivery']) {
        const row = u.el('div', '', benefits);
        u.el('b', '', row, '✓');
        u.el('span', '', row, t);
      }
      const instruction = u.el('div', 'task-note', shell);
      instruction.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') u.el('span', '', instruction, ctx.instruction);
      if (ctx.display === 'hidden') instruction.hidden = true;
      const stage = u.el('main', 'stage', shell);
      const inspector = u.el('section', 'product-inspector', shell);
      u.el('strong', 'inspector-title', inspector, 'Product Details');
      const preview = u.el('div', 'inspector-preview', inspector);
      u.el('div', 'inspector-art', preview, '▧');
      const summary = u.el('div', 'inspector-summary', preview);
      const products = ctx.spec.products || {};
      const product = products[Object.keys(products)[0]] || {};
      const productName = product.name || 'Selected product';
      const productBrand = product.brand || productName.split(' ')[0];
      const productType = product.type || productName.split(' ').slice(1).join(' ') || productName;
      u.el('b', '', summary, productName);
      u.el('div', 'inspector-stars', summary, '★★★★☆　' + (product.rating ? (product.rating / 10).toFixed(1) : '4.8'));
      u.el(
        'p',
        '',
        summary,
        product.description ||
          product.desc ||
          'Reliable ' + productType.toLowerCase() + ' for dependable everyday performance.',
      );
      const metadata = u.el('div', 'inspector-meta', inspector);
      for (const [a, b] of [
        ['Brand:', productBrand],
        ['Type:', productType],
        ['Compatibility:', product.compatibility || 'Multiple models'],
        ['Condition:', product.condition || 'New'],
        ['Availability:', product.stock ? 'In stock' : 'Out of stock'],
        ['Price:', product.price != null ? (product.price / 100).toFixed(2).replace('.', ',') + ' €' : '—'],
      ]) {
        const r = u.el('div', '', metadata);
        u.el('span', '', r, a);
        u.el('b', '', r, b);
      }
      const cart = u.el('aside', 'cart-inspector', inspector);
      u.el('strong', 'cart-title', cart, '🛒　Your Cart');
      u.el('div', 'cart-empty', cart, 'Your cart is empty.');
      u.el('div', 'cart-subtotal', cart, 'Subtotal:　　0,00 €');
      if (end && placement === 'footer') {
        cart.classList.add('has-end');
        cart.append(end);
      }
      return { stage, submit: end };
    },
    overlay(ctx) {
      const u = ctx.util;
      const copy = {
        cookie: ['Cookie notice', 'This application stores essential preferences.', 'Accept'],
        toast: ['Notice', 'Your catalogue is ready.', 'Dismiss'],
        chat: ['Assistance', 'Can we help with your order?', 'Close'],
        promo: ['Special offer', 'See this week’s stationery and parts offers.', 'Close'],
        banner: ['Announcement', 'The catalogue is available for browsing.', 'Dismiss'],
      };
      const [t, m, l] = copy[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      u.el('h2', '', el, t);
      u.el('div', 'overlay-copy', el, m);
      const actions = u.el('div', 'overlay-actions', el);
      const b = u.el('button', 'primary', actions, l);
      b.type = 'button';
      b.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss: b };
    },
  });
})();
