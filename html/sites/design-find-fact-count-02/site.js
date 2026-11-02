(function () {
  'use strict';
  const palette = { bg: '#e8edf2', panel: '#fff', fg: '#081b43', muted: '#344967', line: '#aebdd0' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      const display = _c.ctx.display || 'header';
      _c.display = display === 'panel' && _c.W <= 1280 ? 'header' : display;
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const brand = u.el('div', 'ds-brand', top);
      u.el('span', 'globe', brand, '◉');
      const name = u.el('div', 'brand-name', brand);
      u.el('strong', '', name, 'HarborView');
      u.el('small', '', name, 'PARTNER EXTRANET');
      u.el('div', 'user-links', top, 'Welcome, Alex Carter　 |　 Partner Site　 |　 Help　 |　 Log Out');
      const shell = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', shell);
      ['▤|Documents', '♧|Partners', '◇|Orders', '▤|Products', '▥|Reports', '▣|Training', '⚙|Admin'].forEach((s, i) => {
        const a = u.el('div', i === 0 ? 'selected' : '', rail);
        const p = s.split('|');
        u.el('b', '', a, p[0]);
        u.el('span', '', a, p[1]);
      });
      const content = u.el('div', 'ds-content', shell);
      Object.assign(_c, { top, contentPane: content, header: content });
    },
    'frame.nav': () => (_c) => {
      const tabs = _c.util.el('nav', 'ds-menu', document.body);
      ['Home', 'Products', 'Orders', 'Resources', 'Support'].forEach((t, i) =>
        _c.util.el('span', i === 3 ? 'active' : '', tabs, t),
      );
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.contentPane);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      // The task card always precedes the library, independent of template alignment.
      _c.body.classList.remove('ref-panel-right');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const summary = u.el('aside', 'resource-side', _c.body);
      const tree = u.el('section', 'resource-tree', summary);
      u.el('h2', '', tree, 'Resource Library');
      [
        '📁  All Documents (48)',
        '▾ 📁  Product Info (12)',
        '　▤  Overview (3)',
        '　▤  Specifications (4)',
        '　▤  Release Notes (5)',
        '⊞ 📁  Sales & Marketing (8)',
        '⊞ 📁  Partner Program (6)',
        '⊞ 📁  Technical (10)',
        '⊞ 📁  Policies (7)',
        '⊞ 📁  Archived (5)',
      ].forEach((x, i) => u.el('div', i < 2 ? 'tree-strong' : '', tree, x));
      const summaryBox = u.el('section', 'side-box', summary);
      u.el('h2', '', summaryBox, 'Document Summary');
      [
        ['Total documents', '48'],
        ['PDF files', '20'],
        ['Word files', '12'],
        ['HTML files', '10'],
        ['Other files', '6'],
      ].forEach((r) => {
        const row = u.el('div', 'stat-row', summaryBox);
        u.el('span', '', row, r[0]);
        u.el('span', '', row, r[1]);
      });
      const links = u.el('section', 'side-box quick', summary);
      u.el('h2', '', links, 'Quick Links');
      ['Product Catalog', 'Partner Guide', 'Pricing Sheet', 'Contact Support'].forEach((x) =>
        u.el('div', '', links, '▤　' + x),
      );
      _c.stage = u.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.contentPane.insertBefore(note, _c.body);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.contentPane.appendChild(foot);
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
      u.el(
        'div',
        '',
        el,
        {
          cookie: 'This site uses cookies.',
          toast: 'Changes saved.',
          chat: 'How can we help?',
          promo: 'Partner update',
          banner: 'Service announcement',
        }[ctx.kind],
      );
      const b = u.el('button', '', el, 'Close');
      b.onclick = () => ctx.dismiss('close');
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-find-fact-count-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-count-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0d3767'],
      LOW_ACCENTS: ['#0d3767'],
      parts,
    },
  });
})();
