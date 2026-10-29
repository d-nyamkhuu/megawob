(function () {
  'use strict';
  const D = {
    site: 'design-use-shop-returns-04',
    brand: 'NORTHWIND',
    mode: 'industrial',
    tokens: {
      bg: '#e4ebef',
      panel: '#fff',
      fg: '#08132f',
      accent: '#104c80',
      font: 'Verdana,Arial,sans-serif',
      line: '#7891a7',
      muted: '#44566a',
    },
    obstruction: null,
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'industrial instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'mountain', header, '▲');
      const word = u.el('div', 'brand-block', header);
      u.el('strong', '', word, 'NORTHWIND');
      u.el('small', '', word, 'O U T T I T T E R S');
      u.el('i', 'tagline', header, 'Outdoor Gear for Life');
      const utility = u.el('div', 'utility-links', header);
      u.el('span', '', utility, 'My Account');
      u.el('span', '', utility, 'Customer Service');
      u.el('span', '', utility, 'Help');
      u.el('span', 'cart-label', utility, '🛒　Cart (0)');
      const nav = u.el('nav', 'design-nav', shell);
      ['Home', 'Shop by Category', 'Brands', 'Special Offers', 'Order History', 'Returns & Exchanges'].forEach(
        (x, i) => {
          const a = u.el('span', i === 4 ? 'active' : '', nav, x);
          a.setAttribute('role', 'link');
        },
      );
      const body = u.el('div', 'design-body', shell);
      const note = u.el('aside', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        u.el('h2', '', note, 'Task note');
        u.el('p', 'food-task', note, ctx.instruction);
      }
      const rail = u.el('aside', 'account-rail', body);
      panel(u, 'My Account', rail, [
        'Customer:　 Alex Carter',
        'Account #:　582719',
        'Email:　 alex.carter@northwind.com',
      ]);
      panel(u, 'Order Status Summary', rail, [
        'Total Orders　　　　　　 12',
        'Processing　　　　　　　 0',
        'Shipped　　　　　　　　 2',
        'Delivered　　　　　　　　8',
        'Returns　　　　　　　　 2',
      ]);
      panel(u, 'Returns & Exchanges', rail, [
        'Eligible for Return　　　 4',
        'Return in Progress　　　　0',
        'Completed Returns　　　　2',
      ]);
      const help = u.el('section', 'rail-panel help-panel', rail);
      u.el('h3', '', help, 'Help Topics');
      [
        'Our Return Policy',
        'How to Return an Item',
        'Return Shipping Options',
        'Refund Information',
        'Contact Support',
      ].forEach((x) => u.el('a', '', help, x));
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      const endRng = ctx.rng.fork('chrome/end');
      const bank = ctx.content && ctx.content.END_LABELS;
      const labels =
        Array.isArray(bank) && bank.length
          ? bank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const textOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = endRng.bool(0.5) ? 'OK' : textOf(endRng.pick(labels));
      const collisionRng = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (collisionRng.bool(0.3)) {
        const opts = [...new Set(labels.map(textOf))].filter((x) => x.toLowerCase() !== label.toLowerCase());
        if (opts.length) collision = collisionRng.pick(opts);
      }
      if (!ctx.finish) {
        const spacer = u.el('div', 'footer-spacer', footer);
        if (collision) {
          const b = u.el('button', 'xtra-end', footer, collision);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
        }
        const decoy = u.el('button', 'xtra-end', footer, "Let's go");
        decoy.type = 'button';
        decoy.addEventListener('click', () => env.log('decoy', { label: "Let's go" }));
        const submit = u.el('button', 'end-control', footer, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      return { stage, submit: ctx.finish ? null : footer.querySelector('[data-role=submit]') };
    },
    overlay(ctx) {
      const u = ctx.util;
      const texts = {
        cookie: ['Cookie preferences', 'This site uses cookies for account services.', 'Dismiss'],
        toast: ['Notice', 'Your account information is current.', 'Dismiss'],
        chat: ['Customer service', 'How can we help with your return?', 'Close'],
        promo: ['Northwind news', 'See the latest outdoor equipment updates.', 'Close'],
        banner: ['Service notice', 'Returns are being processed as usual.', 'Dismiss'],
      };
      const [title, copy, label] = texts[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
  function panel(u, title, parent, rows) {
    const p = u.el('section', 'rail-panel', parent);
    u.el('h3', '', p, title);
    rows.forEach((x) => u.el('div', 'rail-row', p, x));
    return p;
  }
})();
