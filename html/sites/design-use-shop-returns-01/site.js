(function () {
  'use strict';
  env.site({
    name: 'design-use-shop-returns-01',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.documentElement.style.setProperty('--bg', '#fff');
      document.documentElement.style.setProperty('--panel', '#fff');
      document.documentElement.style.setProperty('--fg', '#111318');
      document.documentElement.style.setProperty('--accent', '#ed2525');
      document.documentElement.style.setProperty('--line', '#d8dce0');
      document.documentElement.style.setProperty('--muted', '#59606a');
      document.documentElement.style.setProperty('--font', 'Arial,Helvetica,sans-serif');
      document.body.className = 'returns-site instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body),
        header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, 'Northwood');
      u.el('div', 'top-separator', header);
      const topnav = u.el('nav', 'top-nav', header);
      ['Shop', 'Orders', 'Returns', 'Account'].forEach((x, i) => {
        u.el('span', i === 1 ? 'active' : '', topnav, x);
      });
      const search = u.el('div', 'top-search', header);
      u.el('span', 'search-glass', search).innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.6"/><path d="m16 16 5 5"/></svg>';
      u.el('span', 'search-placeholder', search, 'Search products, orders or help');
      const headerControls = u.el('div', 'header-controls', header);
      const body = u.el('div', 'design-body', shell),
        rail = u.el('nav', 'left-rail', body),
        icons = {
          Home: '<path d="m3 11 9-8 9 8v10h-6v-6H9v6H3z"/>',
          Shop: '<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/>',
          Cart: '<path d="M2 3h2l2.2 12.2h12.4L21 7H5"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/>',
          Orders: '<rect x="4" y="2.5" width="16" height="19" rx="1.5"/><path d="M8 7h8M8 11h8M8 15h6"/>',
          Returns: '<path d="M8 7 3 12l5 5M3 12h11a6 6 0 0 1 0 12" transform="translate(0 -3)"/>',
          Account: '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2z"/>',
          Help: '<circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.7 2.7 0 1 1 4.7 1.8c-1.5 1.4-2.2 1.5-2.2 3.4M12 18h.01"/>',
        };
      [
        ['Home', 'Home'],
        ['Shop', 'Shop'],
        ['Cart', 'Cart'],
        ['Orders', 'Orders'],
        ['Returns', 'Returns'],
        ['Account', 'Account'],
        ['Help', 'Help'],
      ].forEach(([icon, label]) => {
        const row = u.el('div', 'rail-item' + (label === 'Orders' ? ' selected' : ''), rail);
        u.el('span', 'rail-icon', row).innerHTML =
          '<svg viewBox="0 0 24 24" aria-hidden="true">' + icons[icon] + '</svg>';
        u.el('span', '', row, label);
      });
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') u.el('div', 'instruction-copy', note, ctx.instruction);
      const stage = u.el('main', 'stage', body);
      let submit = null;
      const r = ctx.rng.fork('chrome/end'),
        base = r.bool(0.5),
        place = base ? 'header' : r.pick(['footer', 'link', 'icon']);
      const bank = ctx.content && ctx.content.END_LABELS,
        labels =
          Array.isArray(bank) && bank.length
            ? bank
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const textOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)),
        label = base ? 'Done' : textOf(r.pick(labels));
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const opts = [...new Set(labels.map(textOf))].filter((x) => x.toLowerCase() !== label.toLowerCase());
        if (opts.length) {
          const d = u.el('button', 'toolbar-xtra', headerControls, cr.pick(opts));
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
        }
      }
      if (!ctx.finish) {
        const host = place === 'footer' ? u.el('div', 'footer-controls', shell) : headerControls;
        submit = u.el(
          place === 'link' ? 'button' : 'button',
          'end-control' + (place === 'icon' ? ' icon-end' : '') + (place === 'link' ? ' text-end' : ''),
          host,
          place === 'icon' ? '✓' : label,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        if (place === 'icon') submit.textContent = '✓';
        submit.addEventListener('click', () => ctx.submit());
      }
      if (ctx.display !== 'hidden') note.dataset.visible = 'true';
      else note.remove();
      if (!headerControls.children.length) headerControls.remove();
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const box = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      const data = {
        cookie: ['Cookie preferences', 'We use cookies to make shopping easier.', 'Accept'],
        toast: ['Saved', 'Your preferences are up to date.', 'Dismiss'],
        chat: ['Customer care', 'How can we help with your order?', 'Close'],
        promo: ['Northwood journal', 'New season essentials, selected for you.', 'Close'],
        banner: ['Delivery update', 'Free delivery on orders over $50.', 'Dismiss'],
      }[ctx.kind];
      u.el('b', 'overlay-title', box, data[0]);
      u.el('span', 'overlay-copy', box, data[1]);
      const b = u.el('button', 'overlay-dismiss', box, data[2]);
      b.type = 'button';
      b.addEventListener('click', () => ctx.dismiss());
      return { el: box, dismiss: b };
    },
  });
})();
