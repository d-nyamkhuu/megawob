// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      const row = util.el('div', 'ref-ov-row', box);
      const btn = (label, how, primary) => {
        if (word && K.button[label]) label = word(K.button[label]);
        const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
        b.type = 'button';
        b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
        return b;
      };
      let dismiss;
      if (kind === 'cookie') {
        if (rng.bool(0.5)) btn('Settings', null, false);
        btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
        dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
      } else if (kind === 'promo') {
        dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
        btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
      } else if (kind === 'banner') {
        dismiss = btn('Dismiss', 'close', false);
      } else {
        dismiss = btn('×', 'close', false);
        dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
      }
      const close = (parent, how = 'close') => {
        const x = util.el('button', 'paw-overlay-close', parent, '×');
        x.type = 'button';
        x.setAttribute('aria-label', word ? word('close') : 'Close');
        x.addEventListener('click', () => ctx.dismiss(how));
        return x;
      };
      if (kind === 'cookie') {
        const icon = util.el('span', 'paw-cookie-icon', el, '◉');
        el.prepend(icon);
        close(el, 'reject');
      } else if (kind === 'banner') {
        el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom}px`;
      } else if (kind === 'promo') {
        const art = util.el('div', 'paw-promo-art', box);
        const copy = util.el('div', 'paw-promo-copy', box);
        util.el('h2', '', copy, 'Exclusive offers\nfor you and your pet');
        copy.appendChild(box.querySelector('.ref-ov-text'));
        const input = util.el('input', 'paw-promo-email', copy);
        input.type = 'email'; input.placeholder = 'Your email address'; input.setAttribute('aria-label', 'Your email address');
        copy.appendChild(row);
        box.prepend(art);
        close(box);
      } else if (kind === 'chat') {
        const heading = util.el('div', 'paw-chat-title', el, '▣　Chat with us');
        heading.appendChild(dismiss);
        el.prepend(heading);
        const compose = util.el('div', 'paw-chat-compose', el);
        const input = util.el('input', '', compose);
        input.placeholder = 'Type a message…'; input.setAttribute('aria-label', 'Chat message');
        const send = util.el('button', '', compose, '›');
        send.type = 'button'; send.setAttribute('aria-label', 'Send message');
        send.addEventListener('click', () => env.log('overlay-click', { label: 'Send message' }));
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.header': (base, S) => function (_c) {
      const { content, ctx, display, local, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'cad-titlebar', header);
      const appIcon = util.el('span', 'cad-app-icon', titlebar);
      appIcon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M5 18V8l4-3 5 2 4-1v5l2 2-3 3-6-2-3 4Z" fill="none" stroke="#0c2a40" stroke-width="2"/><circle cx="15" cy="10" r="1" fill="#0c2a40"/></svg>';
      util.el('span', 'cad-app-name', titlebar, 'Bramblewick Depot');
      util.el('span', 'cad-version', titlebar, 'v2.3.1');
      util.el('span', 'cad-window-controls', titlebar, '—　　 ▣　　 ×');
      const menubar = util.el('nav', 'cad-menubar', header);
      for (const item of ['▾', 'Home', 'Shop', 'My Account', 'Tools', 'Help']) {
        const m = util.el('span', 'cad-menu-item', menubar, item);
        m.dataset.role = 'menu';
      }
      const toolbar = util.el('div', 'cad-toolbar', header);
      const tabs = util.el('nav', 'cad-tabs', toolbar);
      const icons = {
        Home: '<path d="m2 12 10-10 10 10h-3v10h-5v-7h-4v7H5V12Z"/>',
        Search: '<circle cx="11" cy="10" r="7" fill="none" stroke="currentColor" stroke-width="3"/><path d="m16 16 7 7" fill="none" stroke="currentColor" stroke-width="3"/>',
        'Browse Categories': '<path d="M2 6h8l2 2h12v14H2Z"/><path d="M2 6V3h8l2 3" fill="#ffd256"/>',
        'Special Offers': '<path d="m13 1 3 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1Z"/>',
        'New Arrivals': '<path d="M3 11 14 1h10v10L13 22a3 3 0 0 1-4 0l-6-7a3 3 0 0 1 0-4Z"/><circle cx="19" cy="6" r="1.7" fill="white"/>',
        'Gift Ideas': '<path d="M2 9h22v5H2zm2 5h18v10H4zm7 0v10m1-15C6 9 6 3 9 3c2 0 3 3 3 6Zm0 0c0-4 2-7 4-7 4 0 3 6-4 7Z"/>',
        'View Basket': '<path d="M1 3h4l3 13h13l3-10H7"/><circle cx="10" cy="22" r="2"/><circle cx="20" cy="22" r="2"/>',
        'My Account': '<circle cx="13" cy="7" r="5"/><path d="M3 24v-3c0-8 20-8 20 0v3Z"/>',
        'Help & Support': '<circle cx="13" cy="13" r="11"/><path d="M10 9a3 3 0 1 1 5 2c-2 1-2 2-2 4m0 4v1" fill="none" stroke="white" stroke-width="2.5"/>',
        Shop: '<path d="M1 2h4l4 14h11l3-11H6v2h14l-2 7H10L6 0H1Z"/><circle cx="10" cy="21" r="2"/><circle cx="19" cy="21" r="2"/>',
        Pets: '<ellipse cx="5" cy="10" rx="3" ry="4"/><ellipse cx="10" cy="5" rx="3" ry="4"/><ellipse cx="17" cy="5" rx="3" ry="4"/><ellipse cx="22" cy="11" rx="3" ry="4"/><path d="M5 19c2-3 4-8 8-8s7 6 9 9c2 5-3 5-6 3-2-1-3-1-5 0-4 2-9 1-6-4Z"/>',
        Orders: '<path d="M4 1h11l5 5v18H4Zm10 1v6h6M7 12h10v-2H7Zm0 5h10v-2H7Zm0 4h10v-2H7Z"/>',
        Customers: '<circle cx="8" cy="7" r="4"/><circle cx="19" cy="7" r="4"/><path d="M0 23v-5c0-7 16-7 16 0v5Zm16-11c6-1 10 2 10 6v5h-8v-5c0-3-1-5-2-6Z"/>',
        Reports: '<path d="M2 14h5v10H2Zm8-12h5v22h-5Zm8 6h5v16h-5Z"/>',
      };
      for (const [icon, label] of [['⌂', 'Home'], ['▤', 'Search'], ['♟', 'Browse Categories'], ['▣', 'Special Offers'], ['●', 'New Arrivals'], ['▥', 'Gift Ideas'], ['▤', 'View Basket'], ['▣', 'My Orders'], ['●', 'My Account'], ['?', 'Help & Support']]) {
        const tab = util.el('div', 'cad-tab', tabs);
        const glyph = util.el('span', 'cad-tab-icon', tab);
        glyph.innerHTML = `<svg viewBox="0 0 26 26">${icons[label] || icons.Shop}</svg>`;
        util.el('span', '', tab, label);
      }
      const search = util.el('div', 'cad-search', toolbar);
      util.el('span', 'cad-search-icon', search);
      util.el('span', 'cad-search-text', search, 'Search products…');
      const cart = util.el('div', 'cad-cart', toolbar);
      cart.innerHTML = `<svg viewBox="0 0 26 26">${icons.Shop}</svg><span class="cad-cart-count">1</span>`;
      util.el('div', 'cad-settings', toolbar, '⚙　Settings');
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', toolbar, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', toolbar);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      if (display === 'header') util.el('div', 'ref-instruction', titlebar, ctx.instruction);
      else util.el('div', 'ref-spacer', toolbar);
      Object.assign(_c, { appIcon, cart, header, icons, menubar, search, tabs, titlebar, toolbar });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, placement, titlebar, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', titlebar);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      titlebar.appendChild(titlebar.querySelector('.cad-window-controls'));
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const catalog = util.el('aside', 'cad-catalog', body);
      util.el('div', 'cad-catalog-head', catalog, 'Products');
      for (const item of ['Home', 'Health & Beauty', 'Household', 'Garden & DIY', 'Kitchen & Dining', 'Electronics',
        'Toys & Games', 'Sports & Outdoors', 'Books & Media', 'Clothing & Accessories', 'Special Offers']) {
        const row = util.el('div', `cad-category${item === 'Health & Beauty' ? ' is-active' : ''}`, catalog, item);
        const railIcons = {
          'Home': '<path d="m2 12 10-10 10 10h-3v10h-5v-7h-4v7H5v-10Z"/>',
          'Health & Beauty': '<path d="M9 2h6v4H9zM7 7h10v15H7z"/>',
          'Household': '<path d="m2 12 10-10 10 10h-3v10h-5v-7h-4v7H5v-10Z"/>',
          'Garden & DIY': '<path d="M3 20 15 8a5 5 0 1 1 3 3L6 23Z"/>',
          'Kitchen & Dining': '<path d="M3 8h14v6a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6ZM17 9h3a3 3 0 0 1 0 6h-3zM2 22h16v2H2z"/>',
          'Electronics': '<path d="M2 3h20v14H2zM9 19h6v2h4v2H5v-2h4z"/>',
          'Toys & Games': '<path d="M5 7h14a4 4 0 0 1 4 5l-1 6a3 3 0 0 1-5 1l-2-3h-6l-2 3a3 3 0 0 1-5-1l-1-6a4 4 0 0 1 4-5Z"/>',
          'Sports & Outdoors': '<circle cx="12" cy="12" r="10"/>',
          'Books & Media': '<path d="M2 4c4-1 8-1 10 1v16c-2-2-6-2-10-1ZM22 4c-4-1-8-1-10 1v16c2-2 6-2 10-1Z"/>',
          'Clothing & Accessories': '<path d="M8 2 1 6l3 5 3-1v12h10V10l3 1 3-5-7-4c-1 3-7 3-8 0Z"/>',
          'Special Offers': '<circle cx="12" cy="12" r="10"/><path d="M8 16 16 8" stroke="#fff" stroke-width="2.4"/><circle cx="8.5" cy="8.5" r="1.8" fill="#fff"/><circle cx="15.5" cy="15.5" r="1.8" fill="#fff"/>',
        };
        const ico = document.createElement('span');
        ico.className = 'cad-cat-ico';
        ico.innerHTML = `<svg viewBox="0 0 24 24">${railIcons[item]}</svg>`;
        row.prepend(ico);
      }
      const records = util.el('aside', 'cad-records', body);
      const recordsHead = util.el('div', 'cad-records-head', records);
      util.el('span', '', recordsHead, 'Image');
      util.el('span', '', recordsHead, 'Product Name');
      const recordsList = util.el('div', 'cad-record-list', records);
      for (const item of ['Grooming Brush, Deshedding', 'Slicker Brush', 'Nail Clippers', 'Shampoo, Oatmeal',
        'Conditioning Spray', 'Ear Cleaning Kit', 'Toothbrush Set', 'Grooming Wipes', 'Flea Comb', 'De-shedding Glove']) {
        util.el('div', `cad-record${item.startsWith('Grooming Brush') ? ' is-selected' : ''}`, recordsList,
          item.startsWith('Grooming Brush') ? item.replace(', ', ',\n') : item);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, catalog, records, recordsHead, recordsList });
    },
    'frame.panel': (base, S) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) _c.catalog.prepend(panel);
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['Basket  |  Order in progress', 'Basket  |  Ready',
          'Basket  |  Order in progress', 'Basket  |  Ready']);
        const footLabel = word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText;
        const ft = util.el('span', 'ref-foot-text', foot);
        ft.title = footLabel;
        ft.innerHTML = '<svg class="ft-cart" viewBox="0 0 26 26"><path d="M1 3h4l3 13h13l3-10H7" fill="#2f5f93"/><circle cx="10" cy="22" r="2" fill="#2f5f93"/><circle cx="20" cy="22" r="2" fill="#2f5f93"/></svg><b>Basket</b><i></i><b>0 items</b><i></i><span>Subtotal: £0.00</span>';
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        // The native status strip reserves a generous target around its end control.
        // Delegate only empty-strip clicks beside that control; buttons keep their own handlers.
        foot.addEventListener('click', (event) => {
          if (event.target !== foot && !event.target.classList.contains('ref-foot-text')) return;
          const box = foot.getBoundingClientRect();
          if (event.clientX < box.right - 210) return;
          const target = submit || document.querySelector('[data-role="submit"]');
          if (target) target.click();
        });
      }
      Object.assign(_c, { submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-confirmshame-05',
    template: 'site/base',
    design: { parts },
  });
})();
