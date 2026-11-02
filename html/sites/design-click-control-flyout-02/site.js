(function () {
  'use strict';
  const palette = { bg: '#0d171b', panel: '#111c21', fg: '#edf2f4', muted: '#a7b4bc', line: '#29383f' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has room for its note in the center pane in every mode.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'darkshop');
      const shell = u.el('main', 'shop-shell', document.body);
      const head = u.el('header', 'app-head', shell);
      const brand = u.el('div', 'app-brand', head);
      brand.innerHTML = '<span class="brand-mark">◆</span><b>ProSupply</b>';
      const search = u.el('div', 'app-search', head);
      search.innerHTML = '<span class="search-glass"></span><span>Search products, SKUs, or brands...</span>';
      u.el('span', 'bell', head, '♧');
      const avatar = u.el('span', 'avatar', head, 'JD');
      u.el('span', 'account', head, 'Jordan Davis　⌄');
      const nav = u.el('nav', 'menu-row', shell);
      ['File', 'Edit', 'View', 'Inventory', 'Orders', 'Customers', 'Reports', 'Tools', 'Help'].forEach((x) =>
        u.el('span', 'menu-label', nav, x),
      );
      const bar = u.el('div', 'action-row', shell);
      [
        [
          '<svg viewBox="0 0 24 24"><path d="M3 4h2l2 12h12l2-8H6M9 20h.01M18 20h.01"/><path d="M8 8h12"/></svg>',
          'New Order',
        ],
        ['<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6zM15 3v5h4M9 13h7M9 17h7"/></svg>', 'Open'],
        ['<svg viewBox="0 0 24 24"><path d="M12 3 21 12 12 21 3 12zM12 8v5M12 17h.01"/></svg>', 'Save Draft'],
        ['<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v7M14 11v7"/></svg>', 'Delete'],
        [
          '<svg viewBox="0 0 24 24"><path d="M20 11a8 8 0 0 0-14-5L4 8M4 4v4h4M4 13a8 8 0 0 0 14 5l2-2m0 4v-4h-4"/></svg>',
          'Refresh',
        ],
        ['<svg viewBox="0 0 24 24"><path d="M12 15V3m-5 5 5-5 5 5M5 14v6h14v-6"/></svg>', 'Export'],
      ].forEach(([svg, x]) => {
        const b = u.el('span', 'action-item', bar);
        const icon = u.el('i', '', b);
        icon.innerHTML = svg;
        u.el('span', '', b, x);
      });
      const work = u.el('div', 'shop-work', shell);
      const rail = u.el('aside', 'orders-rail', work);
      const rh = u.el('div', 'rail-heading', rail);
      u.el('b', '', rh, 'Recent Orders');
      u.el('a', '', rh, 'View All');
      [
        ['#SO-10483', 'Office Supplies', 'Apr 28, 2022', '$125.40'],
        ['#SO-10482', 'Paper Products', 'Apr 27, 2022', '$312.20'],
        ['#SO-10481', 'Breakroom', 'Apr 26, 2022', '$89.75'],
        ['#SO-10480', 'Ink & Toner', 'Apr 24, 2022', '$451.10'],
        ['#SO-10479', 'Cleaning Supplies', 'Apr 22, 2022', '$93.26'],
        ['#SO-10478', 'Office Furniture', 'Apr 21, 2022', '$1,204.00'],
        ['#SO-10477', 'Technology', 'Apr 19, 2022', '$668.35'],
        ['#SO-10476', 'Safety & PPE', 'Apr 15, 2022', '$214.90'],
        ['#SO-10475', 'Facilities', 'Apr 12, 2022', '$118.45'],
      ].forEach((row) => {
        const r = u.el('div', 'order-row', rail);
        u.el('span', 'order-id', r, row[0]);
        u.el('span', 'order-price', r, row[3]);
        u.el('span', 'order-desc', r, row[1]);
        u.el('span', 'order-date', r, row[2]);
      });
      const center = u.el('section', 'shop-center', work);
      Object.assign(_c, { shell, bar, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.bar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const center = _c.center;
      const hero = u.el('section', 'store-hero', center);
      hero.style.backgroundImage =
        "linear-gradient(90deg,rgba(13,24,20,.28),transparent 66%),url('sites/design-click-control-flyout-02/assets/prosupply-hero.webp')";
      hero.style.backgroundSize = 'cover';
      hero.style.backgroundPosition = 'center';
      const heroCopy = u.el('div', 'hero-copy', hero);
      u.el('h1', '', heroCopy, 'Everything your');
      const h2 = u.el('h2', '', heroCopy);
      h2.append('business ', u.el('span', 'hero-accent', h2, 'needs'));
      u.el('p', '', heroCopy, 'Office supplies, technology, furniture and more —\nall in one place.');
      _c.body = center;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      if (_c.display === 'panel') {
        _c.center.classList.add('has-panel-note');
        const note = _c.center.querySelector('.ref-panel');
        note.classList.add('instruction');
        note.querySelector('.ref-panel-text').dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.querySelector('.ref-note-text').dataset.display = _c.display;
        _c.center.prepend(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('shop-footer');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      _c.util.el('span', 'foot-status', foot, '●　Inventory synced');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.shell.querySelector('.shop-footer').appendChild(dock);
    },
    overlay: () => (ctx) => {

      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };    },
  };
  env.site({
    name: 'design-click-control-flyout-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-flyout-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#a3f238'],
      LOW_ACCENTS: ['#a3f238'],
      parts,
    },
  });
})();
