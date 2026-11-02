(function () {
  'use strict';
  const palette = { bg: '#cbd0d6', panel: '#e9ecf0', fg: '#101923', muted: '#5f6a78', line: '#c8cdd5' };

  function drawCatalog(u, stage) {
    const backdrop = u.el('div', 'shop-backdrop', stage);
    const departments = u.el('aside', 'shop-departments', backdrop);
    u.el('b', '', departments, 'Shop by Category');
    ['Beauty', 'Skincare', 'Makeup', 'Fragrance', 'Hair Care', 'Bath & Body', 'Health', 'Personal Care', 'Accessories', 'Gifts', 'New Arrivals', 'Sale'].forEach((x, i) =>
      u.el('div', 'shop-department' + (i === 0 ? ' selected' : ''), departments, x));
    const catalog = u.el('div', 'shop-catalog', backdrop);
    u.el('h2', '', catalog, 'Beauty');
    const cards = u.el('div', 'catalog-cards', catalog);
    [['Lumi Matte Lipstick', '18.00', 'lip'], ['Radiant Eyeshadow Palette', '32.00', 'palette'], ['Silk Body Cream', '28.00', 'cream'], ['Pure Glow Serum', '36.00', 'serum']].forEach(([name, price, art]) => {
      const card = u.el('article', 'catalog-card', cards);
      u.el('div', 'catalog-photo ' + art, card);
      u.el('div', '', card, name);
      u.el('b', '', card, '$' + price);
      u.el('span', 'catalog-stars', card, '★★★★★');
    });
  }

  function drawInspector(u, footer) {
    const inspector = u.el('div', 'inspector', footer);
    const it = u.el('div', 'inspector-title', inspector);
    u.el('b', '', it, 'Product Details');
    const tabs = u.el('div', 'inspector-tabs', it);
    ['Details', 'Ingredients', 'Reviews', 'Shipping'].forEach((x, i) => u.el('span', i === 0 ? 'active' : '', tabs, x));
    const info = u.el('div', 'inspector-info', inspector);
    const product = u.el('div', 'inspector-product', info);
    u.el('div', 'inspector-photo lipstick', product);
    const summ = u.el('div', '', product);
    u.el('b', '', summ, 'Lumi Matte Lipstick');
    u.el('div', '', summ, 'Rose Nude');
    u.el('div', 'inspector-stars', summ, '★★★★★  (124)');
    u.el('strong', '', summ, '$18.00');
    const desc = u.el('div', 'inspector-description', info);
    u.el('p', '', desc, 'A long-lasting, velvety matte lipstick with rich color and a comfortable wear. Enriched with vitamin E for soft, smooth lips.');
    u.el('label', '', desc, 'Shade');
    u.el('div', 'fake-select', desc, 'Rose Nude　⌄');
    u.el('label', '', desc, 'Quantity');
    u.el('div', 'fake-select short', desc, '1　⌄');
    const fields = u.el('dl', 'inspector-fields', info);
    [['Brand', 'Lumi Beauty'], ['SKU', 'LB-LIP-002'], ['Category', 'Makeup › Lips'], ['In stock', 'Yes']].forEach(([k, v]) => {
      u.el('dt', '', fields, k);
      u.el('dd', '', fields, v);
    });
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated side card even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'side-left instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.documentElement.style.setProperty('--font', 'Arial,sans-serif');
      const shell = u.el('div', 'site-shell', document.body);
      const chrome = u.el('header', 'design-header', shell);
      u.el('div', 'sun-symbol', chrome, '▧');
      u.el('div', 'design-brand', chrome, 'Campus Café – Food Ordering');
      u.el('div', 'window-controls', chrome, '−  ×');
      const nav = u.el('nav', 'design-nav', chrome, 'File    Edit    View    Options    Help');
      u.el('span', 'sun-logo', nav, '▧ Sun');
      const toolbar = u.el('div', 'site-toolbar', chrome);
      // Instructions retain their position within the original body, in every mode.
      const noteSlot = u.el('div', 'site-note-slot');
      Object.assign(_c, { shell, toolbar, noteSlot, header: noteSlot });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.noteSlot.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note');
        const text = document.createElement('p');
        text.className = 'food-task';
        while (note.firstChild) text.appendChild(note.firstChild);
        note.appendChild(text);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'design-body', _c.shell);
      body.appendChild(_c.noteSlot);
      _c.body = body;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
      const note = _c.noteSlot.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note');
        note.querySelector('.ref-panel-text').classList.add('food-task');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      drawCatalog(_c.util, _c.stage);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        note.querySelector('.ref-note-text').classList.add('food-task');
        _c.noteSlot.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const footer = _c.util.el('footer', 'design-footer', _c.shell);
      drawInspector(_c.util, footer);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) footer.appendChild(foot);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const named = null;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) {
        [title, copy, label] = named;
      }
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
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };

  env.site({
    name: 'design-use-shop-coupon-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#88a9cd'],
      LOW_ACCENTS: ['#88a9cd'],
      parts,
    },
  });
})();
