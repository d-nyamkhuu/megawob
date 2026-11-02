(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#10182a', muted: '#4d5e75', line: '#b4c9df' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const s = window.getSelection();
      if (s) s.removeAllRanges();
      const u = _c.util, root = document.body;
      const top = u.el('header', 'ds-top', root), brand = u.el('div', 'ds-brand', top);
      u.el('span', 'ds-globe', brand, '◎');
      const word = u.el('div', 'ds-wordmark', brand);
      u.el('strong', '', word, 'GlobalMart');
      u.el('small', '', word, 'SUPPLIER DIRECTORY & INVENTORY');
      const right = u.el('div', 'ds-headright', top), links = u.el('div', 'ds-quicklinks', right);
      ['Help', 'Site Map', 'Contact'].forEach((x) => u.el('span', '', links, x));
      const search = u.el('div', 'ds-search', right);
      u.el('b', '', search, 'Search:');
      const input = u.el('input', '', search);
      input.setAttribute('aria-label', 'Search');
      u.el('button', '', search, 'Go');
      Object.assign(_c, { top });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'ds-menu', document.body);
      ['Suppliers', 'Products', 'Orders', 'Shipments', 'Reports'].forEach((x) => u.el('span', '', nav, x));
      const outer = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', outer);
      Object.assign(_c, { outer, content, header: content });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-tools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util, content = _c.content;
      const banner = u.el('section', 'ds-overview', content);
      const art = u.el('div', 'ds-art', banner);
      u.el('div', 'ds-art-lines', art);
      const copy = u.el('div', 'ds-overview-copy', banner);
      u.el('h1', '', copy, 'Office Supplies');
      u.el('p', '', copy, 'Everyday products for a productive workplace. Browse our inventory of supplies from trusted global suppliers.');
      const cols = u.el('div', 'ds-cats', copy);
      [
        ['Writing & Correction', 'Paper & Notebooks', 'Filing & Storage'],
        ['Desk Accessories', 'Kitchen & Breakroom', 'Technology Supplies'],
      ].forEach((a) => {
        const col = u.el('div', '', cols);
        a.forEach((x) => u.el('a', '', col, x));
      });
      _c.body = u.el('div', 'ds-main', content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) note.classList.add('ds-brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const foot = u.el('footer', 'ds-footer', document.body);
      ['Home', 'Inventory', 'Suppliers', 'Orders', 'Reports', 'Preferences'].forEach((x, i) => {
        const item = u.el('div', i === 1 ? 'ds-dockitem on' : 'ds-dockitem', foot);
        u.el('b', '', item, ['◆', '⬡', '♟', '▤', '▮', '◎'][i]);
        u.el('span', '', item, x);
      });
      base(_c);
      const controls = document.body.querySelector('.ref-foot');
      foot.appendChild(controls);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      b.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-find-fact-tooltip-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-tooltip-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#08458f'],
      LOW_ACCENTS: ['#08458f'],
      parts,
    },
  });
})();
