(function () {
  'use strict';
  const D = { site: 'design-use-shop-variantpick-04' };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'platinum instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', body);
      const menu = u.el('div', 'mac-menu', shell);
      u.el('b', 'apple', menu, '');
      ['AppShop', 'File', 'Edit', 'View', 'Go', 'Shop', 'Window', 'Help'].forEach((x, i) =>
        u.el(i ? 'span' : 'b', '', menu, x),
      );
      u.el('span', 'mac-time', menu, '10:24 AM');
      u.el('span', 'menu-status', menu, '▣');
      const title = u.el('header', 'window-title', shell);
      u.el('span', 'title-collapse', title, '−');
      u.el('b', 'window-name', title, 'AppShop');
      u.el('span', 'title-spacer', title);
      const controls = u.el('div', 'window-actions', title);
      const endRng = ctx.rng.fork('chrome/end'),
        bank = ctx.content && ctx.content.END_LABELS;
      const labels =
        Array.isArray(bank) && bank.length
          ? bank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const isDefault = endRng.bool(0.5),
        label = isDefault ? 'Save' : labelOf(endRng.pick(labels));
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'end-control', controls, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
      }
      const decoyRng = ctx.rng.fork('chrome/collide');
      if (decoyRng.bool(0.3)) {
        const opts = [...new Set(labels.map(labelOf))].filter((x) => x.toLowerCase() !== label.toLowerCase());
        if (opts.length) {
          const d = decoyRng.pick(opts),
            b = u.el('button', 'chrome-xtra', controls, d);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: d, collide: true }));
        }
      }
      ['○', '⊗'].forEach((x, i) => u.el('span', i ? 'close-control' : 'zoom-control', title, x));
      const nav = u.el('nav', 'shop-nav', shell);
      [
        ['‹', 'Back'],
        ['›', 'Forward'],
        ['⌂', 'Home'],
        ['⌕', 'Search'],
        ['▦', 'Products'],
        ['♧', 'Bag (0)'],
      ].forEach(([ic, txt], i) => {
        const n = u.el('div', 'nav-item' + (i === 3 ? ' active' : ''), nav);
        u.el('b', 'nav-icon', n, ic);
        u.el('span', '', n, txt);
      });
      const search = u.el('div', 'search-area', nav);
      const field = u.el('div', 'search-pill', search);
      u.el('b', '', field, '⌕');
      const input = u.el('span', '', field, 't-shirt');
      const sb = u.el('button', 'search-button', search, 'Search');
      sb.type = 'button';
      const hero = u.el('section', 'store-hero', shell);
      const heroCopy = u.el('div', 'hero-copy', hero);
      u.el('strong', 'hero-title', heroCopy, 'AppShop');
      u.el('span', 'hero-subtitle', heroCopy, 'Quality goods for everyday life.');
      const depts = u.el('div', 'hero-departments', hero);
      ['Clothing', 'Accessories', 'Home', 'Outdoors'].forEach((t) => u.el('span', '', depts, t));
      const taskNote = u.el('div', 'task-note', hero);
      taskNote.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        u.el('b', 'note-label', taskNote, 'Shopping request');
        u.el('span', 'food-task', taskNote, ctx.instruction);
      }
      const stage = u.el('main', 'stage', shell);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        texts = {
          cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
          toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
          chat: ['Help', 'Need help with this store?', 'Close'],
          promo: ['News and updates', 'Discover the latest arrivals.', 'Close'],
          banner: ['Announcement', 'New season essentials are now available.', 'Dismiss'],
        };
      const [title, copy, label] = texts[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const b = u.el('button', '', actions, 'Accept all');
        b.addEventListener('click', () => ctx.dismiss());
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
